// ============================================================
//  game/battle.js - 战斗系统
//  回合制普攻 + 实时技能 + 盟友/敌方双阵营 + 即时尸体 + 逃跑/后台战斗
// ============================================================

// 逃跑敏捷判定系数（玩家Agi >= 敌方平均Agi * 该系数）
const FLEE_AGI_FACTOR = 0.7;

// 后台盟友战斗回合间隔（毫秒）
const BACKGROUND_BATTLE_TICK = 2000;

// 敌方名字统一显示为红色，友方/盟友为绿色，玩家为金色
function enemyNameHtml(name) { return `<span style="color:#ff4444;">${name}</span>`; }
function allyNameHtml(name) { return `<span style="color:#44ff44;">${name}</span>`; }
function playerNameHtml(name) { return `<span style="color:#ffdd44;">${name}</span>`; }

// 根据 HP 百分比返回文字状态描述（敌人与盟友共用，不显示具体数值）
function getHpStatusText(unit) {
    if (!unit || unit.maxHp <= 0) return '状态完好';
    const ratio = unit.currentHp / unit.maxHp;
    if (ratio > 0.8) return '状态完好';
    if (ratio > 0.6) return '略有伤痕';
    if (ratio > 0.4) return '伤口流血';
    if (ratio > 0.2) return '脚步虚浮，喘息不止';
    return '濒死，摇摇欲坠';
}

// 1. 战斗状态
let battleState = {
    inBattle: false,
    roomId: null,
    enemies: [],
    allies: [],
    currentTurnIndex: 0,
    turnOrder: [],
    round: 0,
    hatredUsed: false, vowUsed: false, sacrificeCooldown: 0,
    lianaVowUsed: false, lianaSacrificeCooldown: 0, androsBlessingUsed: false,
    originalPlayerStats: null,
    reinforcement: null,
    fleeAttemptedThisRound: false
};

// 战斗状态的默认快照（供重新开始游戏时重置）
const DEFAULT_BATTLE_STATE = JSON.parse(JSON.stringify(battleState));

// 尸体序号：保证敌人/盟友尸体ID中的 index 全局唯一
let _corpseSeqCounter = 0;

// ============================================================
//  城堡卫兵增援系统
//  伯爵城堡区域发生战斗时，地图上的城堡卫兵会向战斗房间增援，
//  每回合移动最多两个房间，到达后立即加入战斗。
// ============================================================

// 全员卫兵类型：城堡卫兵、城楼弩手、卫兵队长、皇家卫兵、地牢卫兵
const GUARD_NPC_IDS = ['castle_guard_1', 'castle_guard_2', 'crossbowman', 'guard_captain', 'royal_guard', 'dungeon_guard'];

// 城堡增援卫兵（全域搜索目标，含门后区域）
const CASTLE_GUARD_IDS = GUARD_NPC_IDS;

let _castleReinforcementKeyCounter = 0;

// 判定是否为伯爵城堡区域
function isCastleAreaRoom(roomId) {
    if (!roomId) return false;
    return roomId.startsWith('castle_') ||
           roomId.startsWith('count_castle_') ||
           roomId.startsWith('dungeon') ||
           roomId.startsWith('griffin_') ||
           roomId === 'fence_gate_north';
}

// 门视为一个房间的邻接关系（用于卫兵寻路翻越门）
const DOOR_ADJACENCY = [
    ['count_castle_gate', 'castle_outer'],
    ['dungeon_entrance', 'dungeon'],
    ['fence_gate_north', 'castle_road_1'],
    ['castle_outer', 'castle_hall']
];

// 判断房间是否有存活的卫兵Npc
function hasAliveGuardsInRoom(roomId) {
    const room = gameState.world[roomId];
    if (!room || !room.npcs) return false;
    return room.npcs.some(id => GUARD_NPC_IDS.includes(id));
}

// 展开一场战斗：若目标包含卫兵，则把当前房间内所有卫兵一并加入战斗
function expandBattleWithRoomGuards(npcIds) {
    const result = [...npcIds];
    const room = gameState.world[gameState.player.location];
    if (!room || !room.npcs) return result;
    const hasGuard = result.some(id => GUARD_NPC_IDS.includes(id));
    if (!hasGuard) return result;
    room.npcs.forEach(id => {
        if (GUARD_NPC_IDS.includes(id) && !result.includes(id)) {
            result.push(id);
        }
    });
    return result;
}

// 构建一个战斗单位实例（敌人或盟友共用）
function buildBattleEnemy(npcId, index) {
    const npc = getCharacterInfo(npcId);
    if (!npc) return null;
    return {
        index, npcId, name: npc.name,
        currentHp: npc.hp, maxHp: npc.hp,
        sp: npc.sp || 0, maxSp: npc.maxSp || 0,
        atk: npc.atk, def: npc.def, agi: getCharacterAgility(npc),
        drops: npc.drops ? [...npc.drops] : [], exp: npc.exp || 0,
        _ally: false, _dead: false, _corpseSpawned: false,
        _corpseSeq: _corpseSeqCounter++
    };
}

// 战斗开始时初始化城堡卫兵增援
function initCastleReinforcement(battleRoomId) {
    if (!isCastleAreaRoom(battleRoomId)) return;
    const units = [];
    for (const roomId in gameState.world) {
        if (roomId === battleRoomId) continue;
        const room = gameState.world[roomId];
        if (!room || !room.npcs) continue;
        room.npcs.forEach(npcId => {
            if (CASTLE_GUARD_IDS.includes(npcId)) {
                units.push({ key: `rg_${_castleReinforcementKeyCounter++}`, npcId, roomId });
            }
        });
    }
    if (units.length > 0) {
        battleState.reinforcement = { battleRoomId, units };
    }
}

// 每回合移动增援卫兵（每个最多移动两个房间）
function moveCastleReinforcements() {
    const r = battleState.reinforcement;
    if (!r || !battleState.inBattle) return;

    r.units = r.units.filter(unit => {
        if (unit.joined) return false;

        const npc = getCharacterInfo(unit.npcId);
        if (!npc) return false;

        // 已在战斗房间 → 立即加入战斗
        if (unit.roomId === r.battleRoomId) {
            _joinCastleReinforcements(unit);
            unit.joined = true;
            return false;
        }

        const path = _findShortestPath(unit.roomId, r.battleRoomId);
        if (!path) return true; // 不可达，原地待命

        const steps = Math.min(2, path.length);
        for (let i = 0; i < steps; i++) {
            const nextRoomId = path[i];
            _moveNpcBetweenRooms(unit.npcId, unit.roomId, nextRoomId);
            unit.roomId = nextRoomId;
            if (nextRoomId === r.battleRoomId) {
                _joinCastleReinforcements(unit);
                unit.joined = true;
                return false;
            }
        }
        return true;
    });

    if (r.units.length === 0) battleState.reinforcement = null;
}

// 将卫兵从源房间移动到目标房间（按模板ID移动单个实例）
function _moveNpcBetweenRooms(npcId, fromRoomId, toRoomId) {
    const from = gameState.world[fromRoomId];
    if (from && from.npcs) {
        const idx = from.npcs.indexOf(npcId);
        if (idx > -1) from.npcs.splice(idx, 1);
    }
    const to = gameState.world[toRoomId];
    if (to) {
        if (!to.npcs) to.npcs = [];
        to.npcs.push(npcId);
    }
}

// 增援卫兵加入战斗
function _joinCastleReinforcements(unit) {
    const duplicate = battleState.enemies.some(e => e._reinforcementKey === unit.key);
    if (duplicate) return;
    const enemy = buildBattleEnemy(unit.npcId, battleState.enemies.length);
    if (!enemy) return;
    enemy._reinforcementKey = unit.key;
    battleState.enemies.push(enemy);
    print(`<span style="color:#ff6666;">🏰 一名${enemyNameHtml(enemy.name)}闻讯赶到，加入了战斗！</span>`);
}

// 基于 exit 的广度优先寻路，返回需经过的房间ID数组（不含起点）
// 门的交互视为一个房间：通过 DOOR_ADJACENCY 建立额外邻接
function _findShortestPath(fromRoomId, toRoomId) {
    if (fromRoomId === toRoomId) return [];
    const world = gameState.world;
    const queue = [[fromRoomId]];
    const visited = new Set([fromRoomId]);
    while (queue.length > 0) {
        const path = queue.shift();
        const current = path[path.length - 1];
        const room = world[current];
        const neighbors = [];
        if (room && room.exits) {
            for (const dir in room.exits) {
                const next = room.exits[dir];
                if (world[next]) neighbors.push(next);
            }
        }
        // 门视为一个房间的邻接
        for (const [a, b] of DOOR_ADJACENCY) {
            if (a === current && world[b]) neighbors.push(b);
            if (b === current && world[a]) neighbors.push(a);
        }
        for (const next of neighbors) {
            if (next === toRoomId) return path.slice(1).concat(next);
            if (!visited.has(next)) {
                visited.add(next);
                queue.push(path.concat(next));
            }
        }
    }
    return null;
}

// ============================================================
//  起义群众增援（农奴/贫民）
//  完成进度三后，在伯爵城堡区域战斗，每回合有30%概率有1名
//  「女农奴」或「女贫民」加入战斗帮助主角。
// ============================================================

const REBEL_ALLY_IDS = ['female_serf', 'peasant_female'];
let _rebelAllyKeyCounter = 0;

// 是否启用起义群众增援（完成「我心难安」进度三后）
function rebelAlliesEnabled() {
    return !!(gameState.gameFlags && gameState.gameFlags.rebelAlliesEnabled);
}

// 每回合尝试加入一名起义群众（60%概率）
function maybeSpawnRebelAlly() {
    if (!rebelAlliesEnabled()) return;
    if (Math.random() >= 0.6) return;

    const npcId = REBEL_ALLY_IDS[Math.floor(Math.random() * REBEL_ALLY_IDS.length)];
    const ally = buildBattleEnemy(npcId, battleState.allies.length);
    if (!ally) return;
    ally._ally = true;
    ally._rebelAllyKey = `ra_${_rebelAllyKeyCounter++}`;
    battleState.allies.push(ally);

    // 加入当前房间NPC列表，使左侧「周围可见」显示该盟友
    const room = gameState.world[battleState.roomId || gameState.player.location];
    if (room) {
        if (!room.npcs) room.npcs = [];
        room.npcs.push(npcId);
    }

    print(`<span style="color:#ffaa66;">🔥 一名${allyNameHtml(ally.name)}加入了战斗，与你并肩作战！</span>`);
    _refreshSceneAfterBattleChange();
}

// 敌方是否攻击某个存活盟友（按40%几率）
function maybeEnemyTargetAlly(enemy) {
    const allies = (battleState.allies || []).filter(a => a.currentHp > 0 && !a._dead);
    if (allies.length === 0) return false;
    if (Math.random() >= 0.4) return false;

    const target = allies[Math.floor(Math.random() * allies.length)];
    print(`<span style="color:#ffaaaa;">→ ${enemyNameHtml(enemy.name)} 的回合</span>`);
    print(`${enemyNameHtml(enemy.name)} 向 ${allyNameHtml(target.name)} 发起攻击！`);
    const damage = calculateDamage(enemy.atk, target.def, null, null);
    target.currentHp = Math.max(0, target.currentHp - damage);
    print(`${enemyNameHtml(enemy.name)} 对 ${allyNameHtml(target.name)} 造成 ${damage} 点伤害！`);
    if (target.currentHp <= 0) {
        _settleUnitDeath(target, false, null, battleState.roomId || gameState.player.location);
    }
    return true;
}

// ============================================================
//  尸体生成 / 死亡处理
// ============================================================

// 任意单位 HP ≤ 0 时立即生成尸体（尸体ID规则：corpse_${npcId}_${Date.now()}_${index}）
// silent 为 true 时不向主输出框打印，仅写入 log 数组（用于后台盟友战斗）
function _spawnCorpseForUnit(unit, silent = false, log, roomId) {
    if (unit._corpseSpawned) return;
    unit._corpseSpawned = true;

    const targetRoomId = roomId || battleState.roomId || gameState.player.location;
    const room = gameState.world[targetRoomId];
    if (!room) return;
    if (!room.items) room.items = [];

    const npcId = unit.npcId;
    // 瑟蕾娜保留特殊演出：化为紫雾，不生成尸体
    if (npcId === 'serena') return;

    let corpse = null;
    const corpseId = `corpse_${npcId}_${Date.now()}_${unit._corpseSeq}`;

    // 沿用现有专用尸体生成函数（命中后统一覆盖ID并注册到 ITEM_TEMPLATES）
    if (npcId === 'female_serf') {
        corpse = (typeof generateFemaleSerfCorpse === 'function') ? generateFemaleSerfCorpse() : null;
    } else if (npcId === 'slum_girl') {
        corpse = (typeof generateMandorolaCorpse === 'function') ? generateMandorolaCorpse() : null;
    } else if (npcId === 'peasant_female') {
        corpse = (typeof generateGenericFemaleCorpse === 'function') ? generateGenericFemaleCorpse('女贫民') : null;
    } else if (npcId === 'peasant_male') {
        corpse = (typeof generatePeasantMaleCorpse === 'function') ? generatePeasantMaleCorpse() : null;
    } else if (npcId.indexOf('bounty_female_serf') === 0) {
        corpse = (typeof generateFemaleSerfCorpse === 'function') ? generateFemaleSerfCorpse() : null;
    } else if (npcId.indexOf('bounty_') === 0) {
        corpse = (typeof generateGenericFemaleCorpse === 'function') ? generateGenericFemaleCorpse('女贫民') : null;
    } else {
        corpse = createCorpse(npcId);
    }

    if (!corpse) {
        const fallback = createCorpse(npcId);
        if (!fallback) return;
        corpse = fallback;
    }

    corpse.id = corpseId;
    ITEM_TEMPLATES[corpseId] = corpse;
    room.items.push(corpseId);

    if (!silent) {
        print(`<span style="color:#888;">${corpse.name}倒在了地上...</span>`);
        _refreshSceneAfterBattleChange();
    } else if (log) {
        log.push(`${corpse.name}倒在了地上...`);
    }

    // 起义群众盟友死亡后，有概率预先肢解并掉落部分肢体
    if (unit._ally && (npcId === 'female_serf' || npcId === 'peasant_female')) {
        _maybeDropLimbsFromCorpse(corpse, room, silent, log);
    }
}

// 从尸体上概率掉落一部位肢体
function _maybeDropLimbsFromCorpse(corpse, room, silent, log) {
    if (Math.random() < 0.5) return;
    const parts = (corpse.limbTemplates || []).filter(l => l.count > 0);
    if (parts.length === 0) return;
    const part = parts[Math.floor(Math.random() * parts.length)];
    const count = Math.floor(Math.random() * part.count) + 1;
    const generated = (corpse.generatedLimbs && corpse.generatedLimbs[part.id]) || [];

    if (!corpse.dismemberedLimbs) corpse.dismemberedLimbs = [];
    if (!corpse.dismemberedLimbs.includes(part.id)) corpse.dismemberedLimbs.push(part.id);

    for (let i = 0; i < count; i++) {
        const limb = (generated[i] ? JSON.parse(JSON.stringify(generated[i])) : createItemFromTemplate(part.id));
        if (!limb) continue;
        const realId = `${part.id}_drop_${Date.now()}_${i}_${Math.random().toString(36).substr(2, 6)}`;
        limb.id = realId;
        ITEM_TEMPLATES[realId] = limb;
        room.items.push(realId);
        if (!silent) print(`<span style="color:#ffaa66;">${limb.name}掉落在地上。</span>`);
        else if (log) log.push(`${limb.name}掉落在地上。`);
    }
}

// 统一处理单位死亡：标记死亡 + 生成尸体
function _settleUnitDeath(unit, silent = false, log, roomId) {
    if (unit._dead) return;
    unit._dead = true;
    if (!silent) {
        print(`<span style="color:#ff8888;">${_unitNameHtml(unit)} 倒下了！</span>`);
    } else if (log) {
        log.push(`${unit.name} 倒下了！`);
    }
    // 立即从周围可见中移除该NPC，只保留尸体
    _removeUnitFromRoomNpcs(unit, roomId);
    _spawnCorpseForUnit(unit, silent, log, roomId);
}

// 单位名字着色（盟友绿色/敌人红色）
function _unitNameHtml(unit) {
    return unit._ally ? allyNameHtml(unit.name) : enemyNameHtml(unit.name);
}

// 战斗中单位死亡后立即从当前房间移除该NPC（周围可见只保留尸体）
function _removeUnitFromRoomNpcs(unit, roomId) {
    const targetRoomId = roomId || battleState.roomId || gameState.player.location;
    const room = gameState.world[targetRoomId];
    if (!room || !room.npcs) return;
    const idx = room.npcs.indexOf(unit.npcId);
    if (idx > -1) room.npcs.splice(idx, 1);
    _refreshSceneAfterBattleChange();
}

// 战斗内实时刷新左侧「周围可见」（防御式调用）
function _refreshSceneAfterBattleChange() {
    if (typeof updateSceneInfo === 'function') updateSceneInfo();
}

// 清理被击败的卫兵实例（含从其他房间赶来增援的卫兵）
function _pruneDefeatedGuardNpcs(defeatedNpcIds) {
    if (!defeatedNpcIds || defeatedNpcIds.length === 0) return;
    const guardSet = new Set(GUARD_NPC_IDS);
    const defeatedGuardTemplates = defeatedNpcIds.filter(id => guardSet.has(id));
    if (defeatedGuardTemplates.length === 0) return;
    for (const roomId in gameState.world) {
        const room = gameState.world[roomId];
        if (!room || !room.npcs) continue;
        room.npcs = room.npcs.filter(id => !defeatedGuardTemplates.includes(id));
    }
}

// 扣除HP并触发即时死亡处理
function _applyDamageToUnit(unit, damage, silent = false, log, roomId) {
    unit.currentHp = Math.max(0, unit.currentHp - damage);
    if (unit.currentHp <= 0) {
        _settleUnitDeath(unit, silent, log, roomId);
    }
}

// 玩家技能击杀敌人时调用（由 skills.js 调用，保证技能可即时生成尸体）
function handlePlayerSkillEnemyDeath(enemy) {
    if (!enemy || enemy._dead) return;
    _settleUnitDeath(enemy, false, null, battleState.roomId || gameState.player.location);
}

// ============================================================
//  战斗详情面板（技能按钮 + 盟友状态 + 敌人状态）
// ============================================================

function renderSkillButtons() {
    const currentSp = gameState.player.sp || 0; const maxSp = gameState.player.maxSp || 0;
    let html = '<h3>技能</h3>';
    if (gameState.player.skills && gameState.player.skills.length > 0) {
        html += '<div class="skill-buttons">';
        gameState.player.skills.forEach(sId => { const s = skills[sId]; if (s) { if (s.requireKnightSet && !hasKnightSetBonus()) return; if (s.npcOnly) return; const disabled = currentSp < s.cost ? 'disabled' : ''; html += `<button class="skill-button ${disabled}" onclick="useSkill('${sId}')" ${disabled}><span class="skill-name">${s.name}</span><span class="skill-cost">SP: ${s.cost} (${currentSp}/${maxSp})</span><span class="skill-desc">${s.description}</span></button>`; } });
        html += '</div>';
    } else { html += '<p>暂无技能</p>'; }
    return html;
}

// 战斗详情：技能 + 敌人（红）（盟友改由左侧「周围可见」显示）
function renderBattleDetail() {
    let html = renderSkillButtons();

    html += '<h3>敌人</h3>';
    const enemies = battleState.enemies.filter(e => e.currentHp > 0 && !e._dead);
    if (enemies.length === 0) {
        html += '<p style="color:#666;">无</p>';
    } else {
        enemies.forEach(e => {
            html += `<div>${enemyNameHtml(e.name)} <span style="color:#888;">（${getHpStatusText(e)}）</span></div>`;
        });
    }

    return html;
}

// 实时技能：战斗中任意时刻点击、立即消耗SP并结算，不打断当前行动序列
function useSkill(skillId) {
    if (!battleState.inBattle) { print(`<span style="color: #ffaaaa;">战斗外无法使用技能！</span>`); return; }
    const skill = skills[skillId]; if (!skill) { print(`<span style="color: #ffaaaa;">技能不存在！</span>`); return; }
    const currentSp = gameState.player.sp || 0; if (currentSp < skill.cost) { print(`<span style="color: #ffaaaa;">技力不足！</span>`); return; }
    gameState.player.sp = Math.floor(currentSp - skill.cost);
    skill.effect();

    if (UI.elements.detailPanel) { UI.setDetail(renderBattleDetail()); }
    const updatedSp = gameState.player.sp || 0;
    print(`<span style="color: #aaffaa;">你的 HP: ${gameState.player.hp}/${gameState.player.maxHp} SP: ${updatedSp}/${gameState.player.maxSp||0}</span>`);
    print("");
    _afterSkillResolution();
}

// 技能结算后：补捡死亡敌人尸体、检查是否结束战斗
function _afterSkillResolution() {
    if (!battleState.inBattle) return;

    battleState.enemies.forEach(enemy => {
        if (enemy.currentHp <= 0 && !enemy._dead) {
            handlePlayerSkillEnemyDeath(enemy);
        }
    });

    if (gameState.player.hp <= 0) { battleEnd(false); return; }

    const aliveEnemies = battleState.enemies.filter(e => e.currentHp > 0 && !e._dead);
    if (aliveEnemies.length === 0) {
        battleEnd(true);
        return;
    }

    if (UI.elements.detailPanel) { UI.setDetail(renderBattleDetail()); }
}

// ============================================================
//  战斗启动
// ============================================================

function startMultiBattle(npcIds) {
    if (!npcIds || npcIds.length === 0) return;
    if (typeof mainContent !== 'undefined' && mainContent) { UI.setOutputHtml(mainContent); }
    print("");
    print(`═══════ ⚔️ 战斗开始 ═══════`);

    // 卫兵机制：与其中一名卫兵进入战斗时，同房间所有卫兵一同参战
    const fullIds = expandBattleWithRoomGuards(npcIds);

    const enemies = [];
    fullIds.forEach((npcId, index) => {
        const npc = getCharacterInfo(npcId);
        if (npc && npc.canFight) {
            const enemyInstance = buildBattleEnemy(npcId, index);
            if (enemyInstance) {
                enemies.push(enemyInstance);
                print(`<span style="color:#ff4444;">敌人${index + 1}: ${enemyNameHtml(npc.name)}（${getHpStatusText(enemyInstance)}）</span>`);
            }
        }
    });

    gameState.player.sp = Math.floor(gameState.player.maxSp || 10);
    print(`<span style="color: #aaffaa;">你 (HP:${gameState.player.hp}/${gameState.player.maxHp} SP:${gameState.player.sp}/${gameState.player.maxSp} ATK:${getCharacterAttack(gameState.player)} DEF:${getCharacterDefense(gameState.player)} AGI:${getCharacterAgility(gameState.player)})</span>`);
    print("────────────────────────────────");

    battleState = {
        inBattle: true,
        roomId: gameState.player.location,
        enemies,
        allies: [],
        round: 1,
        currentTurnIndex: 0,
        turnOrder: [],
        hatredUsed: false, vowUsed: false, sacrificeCooldown: 0,
        lianaVowUsed: false, lianaSacrificeCooldown: 0, androsBlessingUsed: false,
        reinforcement: null,
        originalPlayerStats: { atk: gameState.player.atk, def: gameState.player.def, agi: gameState.player.agi },
        fleeAttemptedThisRound: false
    };
    document.body.classList.add('battle-mode');

    initCastleReinforcement(gameState.player.location);
    if (UI.elements.detailPanel) { UI.setDetail(renderBattleDetail()); }
    setTimeout(() => startNewRound(), 800);
}

function startBattle(npcId) { startMultiBattle([npcId]); }

// ============================================================
//  回合推进
// ============================================================

function calculateTurnOrder() {
    const participants = [{ key: 'player', agi: getCharacterAgility(gameState.player) }];
    battleState.enemies.forEach((enemy, index) => {
        if (enemy.currentHp > 0 && !enemy._dead) participants.push({ key: `enemy_${index}`, agi: enemy.agi });
    });
    (battleState.allies || []).forEach((ally, index) => {
        if (ally.currentHp > 0 && !ally._dead) participants.push({ key: `ally_${index}`, agi: ally.agi });
    });
    participants.sort((a, b) => a.agi !== b.agi ? b.agi - a.agi : (a.key === 'player' ? -1 : (b.key === 'player' ? 1 : Math.random() - 0.5)));
    return participants.map(p => p.key);
}

function turnOrderToName(key) {
    if (key === 'player') return '你';
    const parts = key.split('_');
    const idx = parseInt(parts[1], 10);
    if (parts[0] === 'enemy') return enemyNameHtml(battleState.enemies[idx].name);
    if (parts[0] === 'ally') return allyNameHtml(battleState.allies[idx].name);
    return key;
}

function startNewRound() {
    if (!battleState.inBattle) return;
    if (battleState.enemies.filter(e => e.currentHp > 0 && !e._dead).length === 0) { battleEnd(true); return; }
    if (gameState.player.hp <= 0) { battleEnd(false); return; }

    if (battleState.sacrificeCooldown > 0) battleState.sacrificeCooldown--;
    if (battleState.lianaSacrificeCooldown > 0) battleState.lianaSacrificeCooldown--;

    // 每回合重置逃跑尝试次数
    battleState.fleeAttemptedThisRound = false;

    battleState.enemies.forEach(enemy => {
        if (enemy.npcId === 'andros' && enemy.divineBlessingTurns !== undefined && enemy.divineBlessingTurns > 0) {
            enemy.divineBlessingTurns--;
            if (enemy.divineBlessingTurns <= 0) {
                print(`<span style="color: #888;">安德罗斯身上的神恩光芒消散了，属性恢复到原有水平。</span>`);
                enemy.atk = 10; enemy.def = 10; enemy.agi = 10;
            }
        }
    });

    moveCastleReinforcements();
    maybeSpawnRebelAlly();

    print(`<span style="color: #ffdd44;">═══════════════════════════</span>`);
    print(`<span style="color: #ffdd44;">【第${battleState.round}回合】</span>`);
    battleState.turnOrder = calculateTurnOrder();
    battleState.currentTurnIndex = 0;
    print(`<span style="color: #888;">行动顺序: ${battleState.turnOrder.map(turnOrderToName).join(' → ')}</span>`);
    print("");
    if (UI.elements.detailPanel) { UI.setDetail(renderBattleDetail()); }
    setTimeout(() => executeNextTurn(), 600);
}

function executeNextTurn() {
    if (!battleState.inBattle) return;
    if (battleState.enemies.filter(e => e.currentHp > 0 && !e._dead).length === 0) { battleEnd(true); return; }
    if (gameState.player.hp <= 0) { battleEnd(false); return; }

    if (battleState.currentTurnIndex >= battleState.turnOrder.length) {
        battleState.round++;
        setTimeout(() => startNewRound(), 800);
        return;
    }

    const target = battleState.turnOrder[battleState.currentTurnIndex++];
    if (target === 'player') { executePlayerTurn(); return; }
    const parts = target.split('_');
    const idx = parseInt(parts[1], 10);
    if (parts[0] === 'enemy') { executeEnemyTurn(idx); }
    else if (parts[0] === 'ally') { executeAllyTurn(idx); }
    else { executeNextTurn(); }
}

function executePlayerTurn() {
    if (!battleState.inBattle || gameState.player.hp <= 0) { if (gameState.player.hp <= 0) battleEnd(false); return; }
    const aliveEnemies = battleState.enemies.filter(e => e.currentHp > 0 && !e._dead);
    if (aliveEnemies.length === 0) { battleEnd(true); return; }

    const targetEnemy = aliveEnemies[0];
    const playerAtk = getCharacterAttack(gameState.player);
    print(`<span style="color: #aaffaa;">→ 你的回合</span>`);
    print(`你选择攻击 ${enemyNameHtml(targetEnemy.name)}！`);

    if (tryDodge(targetEnemy.agi)) {
        print(`你的攻击被 ${enemyNameHtml(targetEnemy.name)} 闪避了！`);
    } else {
        const damage = calculateDamage(playerAtk, targetEnemy.def, gameState.player.equipment, null);
        print(`你对 ${enemyNameHtml(targetEnemy.name)} 造成 <span style="color: #ff6666;">${damage}</span> 点伤害！`);
        _applyDamageToUnit(targetEnemy, damage, false, null, battleState.roomId || gameState.player.location);
    }

    if (!battleState.inBattle) return;
    print(`<span style="color: #aaffaa;">你的 HP: ${gameState.player.hp}/${gameState.player.maxHp} SP: ${gameState.player.sp||0}/${gameState.player.maxSp||0}</span>`);
    print("");
    if (UI.elements.detailPanel) { UI.setDetail(renderBattleDetail()); }
    setTimeout(() => executeNextTurn(), 1200);
}

function executeAllyTurn(allyIndex) {
    if (!battleState.inBattle) return;
    const ally = battleState.allies[allyIndex];
    if (!ally || ally.currentHp <= 0 || ally._dead) { executeNextTurn(); return; }

    const aliveEnemies = battleState.enemies.filter(e => e.currentHp > 0 && !e._dead);
    if (aliveEnemies.length === 0) { battleEnd(true); return; }

    const target = aliveEnemies[Math.floor(Math.random() * aliveEnemies.length)];
    print(`<span style="color:#66ff66;">→ ${allyNameHtml(ally.name)} 的回合</span>`);
    print(`${allyNameHtml(ally.name)} 挥舞武器，攻击 ${enemyNameHtml(target.name)}！`);

    if (tryDodge(target.agi)) {
        print(`${allyNameHtml(ally.name)} 的攻击被 ${enemyNameHtml(target.name)} 闪避了！`);
    } else {
        const damage = calculateDamage(ally.atk, target.def, null, null);
        print(`${allyNameHtml(ally.name)} 对 ${enemyNameHtml(target.name)} 造成 ${damage} 点伤害！`);
        _applyDamageToUnit(target, damage, false, null, battleState.roomId || gameState.player.location);
    }

    if (!battleState.inBattle) return;
    if (UI.elements.detailPanel) { UI.setDetail(renderBattleDetail()); }
    setTimeout(() => executeNextTurn(), 1200);
}

function executeEnemyTurn(enemyIndex) {
    if (!battleState.inBattle) return;
    const enemy = battleState.enemies[enemyIndex];
    if (!enemy || enemy.currentHp <= 0 || enemy._dead) { executeNextTurn(); return; }
    if (gameState.player.hp <= 0) { battleEnd(false); return; }

    if (enemy.npcId === 'slum_girl') {
        // 曼德罗拉：先手时发动「穿喉」，一击必杀、无视护甲
        if (battleState.turnOrder[0] === `enemy_${enemyIndex}`) {
            const throatSkill = skills['mandorola_throat'];
            print(`<span style="color: #ffaaaa;">→ ${enemyNameHtml(enemy.name)} 的回合</span>`);
            if (throatSkill) throatSkill.effect(enemy);
            print(`<span style="color: #ff6666;">你倒下了...</span>`);
            setTimeout(() => battleEnd(false), 1000);
            return;
        }
    }

    if (enemy.npcId === 'liana') {
        if (!battleState.lianaVowUsed) {
            const vowSkill = skills['liana_vow'];
            if (vowSkill) {
                print(`<span style="color: #ffaaaa;">→ ${enemyNameHtml(enemy.name)} 的回合</span>`);
                battleState.lianaVowUsed = true;
                vowSkill.effect(enemy);
                updateEnemyStatusDisplay(enemy);
                setTimeout(() => executeNextTurn(), 1200);
                return;
            }
        }
        if (!battleState.lianaSacrificeCooldown || battleState.lianaSacrificeCooldown <= 0) {
            const sacSkill = skills['liana_sacrifice'];
            if (sacSkill) {
                print(`<span style="color: #ffaaaa;">→ ${enemyNameHtml(enemy.name)} 的回合</span>`);
                sacSkill.effect(enemy);
                battleState.lianaSacrificeCooldown = sacSkill.cooldown || 3;
                updateEnemyStatusDisplay(enemy);
                if (gameState.player.hp <= 0) { setTimeout(() => battleEnd(false), 1000); return; }
                setTimeout(() => executeNextTurn(), 1200);
                return;
            }
        }
    }

    if (enemy.npcId === 'andros') {
        if (!battleState.androsBlessingUsed) {
            const blessingSkill = skills['andros_divine_blessing'];
            if (blessingSkill && enemy.sp >= blessingSkill.cost) {
                print(`<span style="color: #ffaaaa;">→ ${enemyNameHtml(enemy.name)} 的回合</span>`);
                enemy.sp -= blessingSkill.cost;
                blessingSkill.effect(enemy);
                battleState.androsBlessingUsed = true;
                updateEnemyStatusDisplay(enemy);
                setTimeout(() => executeNextTurn(), 1200);
                return;
            }
        }
        if (enemy.currentHp < enemy.maxHp * 0.5 && enemy.sp >= 15) {
            const healSkill = skills['andros_holy_light'];
            if (healSkill) {
                print(`<span style="color: #ffaaaa;">→ ${enemyNameHtml(enemy.name)} 的回合</span>`);
                enemy.sp -= healSkill.cost;
                healSkill.effect(enemy);
                updateEnemyStatusDisplay(enemy);
                setTimeout(() => executeNextTurn(), 1200);
                return;
            }
        }
    }

    // 起义群众优先吸引部分攻击
    if (maybeEnemyTargetAlly(enemy)) {
        print(`<span style="color: #aaffaa;">你的 HP: ${gameState.player.hp}/${gameState.player.maxHp} SP: ${gameState.player.sp||0}/${gameState.player.maxSp||0}</span>`);
        setTimeout(() => executeNextTurn(), 1200);
        return;
    }

    const playerDef = getCharacterDefense(gameState.player);
    const playerAgi = getCharacterAgility(gameState.player);
    print(`<span style="color: #ffaaaa;">→ ${enemyNameHtml(enemy.name)} 的回合</span>`);
    print(`${enemyNameHtml(enemy.name)} 向你发起攻击！`);

    if (tryDodge(playerAgi)) {
        print(`${enemyNameHtml(enemy.name)} 的攻击被你闪避了！`);
    } else {
        const damage = calculateDamage(enemy.atk, playerDef, null, gameState.player.equipment);
        gameState.player.hp = Math.max(0, gameState.player.hp - damage);
        print(`${enemyNameHtml(enemy.name)} 对你造成 <span style="color: #ff6666;">${damage}</span> 点伤害！`);
    }

    if (gameState.player.hp <= 0) {
        print(`<span style="color: #ff6666;">你倒下了...</span>`);
        setTimeout(() => battleEnd(false), 1000);
        return;
    }
    print(`<span style="color: #aaffaa;">你的 HP: ${gameState.player.hp}/${gameState.player.maxHp} SP: ${gameState.player.sp||0}/${gameState.player.maxSp||0}</span>`);
    if (UI.elements.detailPanel) { UI.setDetail(renderBattleDetail()); }
    setTimeout(() => executeNextTurn(), 1200);
}

function updateEnemyStatusDisplay(enemy) {
    print(`<span style="color:#ff8888;">${enemyNameHtml(enemy.name)}（${getHpStatusText(enemy)}）</span>`);
}

// ============================================================
//  战斗结束
// ============================================================

function battleEnd(playerWon) {
    battleState.inBattle = false;
    battleState.reinforcement = null;
    if (battleState.originalPlayerStats) {
        gameState.player.atk = battleState.originalPlayerStats.atk;
        gameState.player.def = battleState.originalPlayerStats.def;
        gameState.player.agi = battleState.originalPlayerStats.agi;
        battleState.originalPlayerStats = null;
    }
    document.body.classList.remove('battle-mode');

    print(`<span style="color: #ffdd44;">═══════════════════════════</span>`);
    if (playerWon) {
        print(`<span style="color: #aaffaa;">【胜利！】你击败了所有敌人！</span>`);
        const room = gameState.world[gameState.player.location];
        let totalExp = 0;
        const defeatedEnemies = [];

        battleState.enemies.forEach((enemy, index) => {
            const npc = getCharacterInfo(enemy.npcId);
            if (!npc) return;
            defeatedEnemies.push(enemy.npcId);

            if (enemy.npcId === 'serena') {
                print(`<span style="color: #cc66ff;">"既然如此，就送你个宝贝。"</span>`);
                print(`<span style="color: #cc66ff;">瑟蕾娜的身躯化为一团紫雾...</span>`);
                if (enemy.drops?.length > 0 && room) {
                    enemy.drops.forEach((dropId, di) => {
                        const dropItem = createItemFromTemplate(dropId);
                        if (dropItem) {
                            dropItem.id = `drop_${dropId}_${Date.now()}_${di}`;
                            ITEM_TEMPLATES[dropItem.id] = dropItem;
                            if (!room.items) room.items = [];
                            room.items.push(dropItem.id);
                        }
                    });
                }
                totalExp += enemy.exp;
                return;
            }

            if (enemy.npcId.indexOf('bounty_') === 0 && typeof completeBountyByNpcId === 'function') {
                completeBountyByNpcId(enemy.npcId);
            }
            totalExp += enemy.exp;
        });

        if (totalExp > 0) {
            print("");
            print(`<span style="color: #ffdd44;">获得 ${totalExp} 点经验值！</span>`);
            gameState.player.exp += totalExp;
            checkLevelUp();
        }

        if (room?.npcs) {
            defeatedEnemies.forEach(npcId => {
                const idx = room.npcs.indexOf(npcId);
                if (idx > -1) room.npcs.splice(idx, 1);
            });
        }
        // 清理被击败的卫兵（含从其他房间赶来增援的卫兵）
        _pruneDefeatedGuardNpcs(defeatedEnemies);
        updateSceneInfo();
    } else {
        print(`<span style="color: #ff6666;">【失败...】你被击败了。</span>`);
        print(`<span style="color: #aaa;">（游戏将重新开始...）</span>`);
        setTimeout(() => location.reload(), 2000);
    }

    UI.setOverlay(false);
    if (UI.elements.detailPanel) UI.clearDetail();
    currentPanel = null;

    // ★ 战斗结束回调（供支线任务使用，例如贫民窟分支）
    if (typeof window._onBattleEnd === 'function') {
        const cb = window._onBattleEnd;
        window._onBattleEnd = null;
        cb(playerWon);
    }
}

// 清理战斗状态（玩家逃跑时使用：不结算经验/掉落）
function _cleanupBattleState() {
    battleState.inBattle = false;
    battleState.reinforcement = null;
    if (battleState.originalPlayerStats) {
        gameState.player.atk = battleState.originalPlayerStats.atk;
        gameState.player.def = battleState.originalPlayerStats.def;
        gameState.player.agi = battleState.originalPlayerStats.agi;
        battleState.originalPlayerStats = null;
    }
    document.body.classList.remove('battle-mode');
}

// ============================================================
//  逃跑机制（小地图点击触发）
// ============================================================

function tryFlee(direction) {
    if (!battleState.inBattle) return;

    if (battleState.fleeAttemptedThisRound) {
        print(`<span style="color: #ffaaaa;">你刚才已经尝试过逃跑，这一回合无法再试了！</span>`);
        return;
    }
    battleState.fleeAttemptedThisRound = true;

    const room = gameState.world[gameState.player.location];
    if (!room) return;

    const dirMap = { 'n': 'north', 's': 'south', 'e': 'east', 'w': 'west', 'north': 'north', 'south': 'south', 'east': 'east', 'west': 'west' };
    const fullDir = dirMap[direction];
    const targetRoomId = fullDir && room.exits[fullDir];
    if (!targetRoomId || !gameState.world[targetRoomId]) return;

    const aliveEnemies = battleState.enemies.filter(e => e.currentHp > 0 && !e._dead);
    const aliveAllies = (battleState.allies || []).filter(a => a.currentHp > 0 && !a._dead);

    // 敏捷判定：玩家Agi >= 敌方平均Agi * 系数
    const avgEnemyAgi = aliveEnemies.length
        ? aliveEnemies.reduce((sum, e) => sum + (e.agi || 0), 0) / aliveEnemies.length
        : 0;
    const playerAgi = getCharacterAgility(gameState.player);

    if (playerAgi < avgEnemyAgi * FLEE_AGI_FACTOR) {
        print(`<span style="color: #ff8888;">你试图逃跑，但被敌人拦住了！</span>`);
        return;
    }

    const dirChinese = { north: '北', south: '南', east: '东', west: '西' };
    print(`<span style="color: #aaffaa;">你找准空当，向${dirChinese[fullDir]}方逃去……</span>`);

    // 将当前敌我状态保存为仇恨记录（关联原房间），用于玩家下次返回恢复战斗
    if (!gameState.backgroundBattles) gameState.backgroundBattles = {};
    const bg = {
        roomId: gameState.player.location,
        enemies: JSON.parse(JSON.stringify(aliveEnemies)),
        allies: JSON.parse(JSON.stringify(aliveAllies)),
        allyCount: aliveAllies.length,
        round: battleState.round,
        log: [],
        status: aliveAllies.length > 0 ? 'pending' : 'allies_defeat'
    };
    gameState.backgroundBattles[bg.roomId] = bg;

    if (aliveAllies.length > 0) {
        print(`<span style="color:#888;">${allyNameHtml('你的盟友')}仍留在原地与敌人缠斗……</span>`);
        ensureBackgroundBattleLoop();
    } else {
        bg.log.push(`【仇恨记录】你逃离了战斗，敌人仍盘踞在房间中等待复仇。`);
    }

    // 清理当前战斗状态，不结算经验/掉落
    _cleanupBattleState();

    // 玩家移出当前房间，前往点击的目标房间
    gameState.player.location = targetRoomId;
    UI.setOverlay(false);
    if (UI.elements.detailPanel) UI.clearDetail();
    currentPanel = null;

    look();

    // 目标房间若恢复了后台战斗，则停止后续普通渲染
    if (battleState.inBattle) return;

    updateMinimap();
    updateSceneInfo();

    // 目标房间可能触发新的敌对遭遇与剧情
    checkHostileNPCs(targetRoomId);
    StoryEngine.check();
}

// ============================================================
//  后台盟友战斗（异步定时结算，不向主输出框打印，写入 battleLog）
// ============================================================

let _backgroundBattleLoopId = null;

function ensureBackgroundBattleLoop() {
    if (!gameState.backgroundBattles) gameState.backgroundBattles = {};
    if (_backgroundBattleLoopId) return;
    _backgroundBattleLoopId = setInterval(() => {
        let anyPending = false;
        for (const roomId in gameState.backgroundBattles) {
            const bg = gameState.backgroundBattles[roomId];
            if (bg && bg.status === 'pending') {
                anyPending = true;
                _stepBackgroundBattle(bg);
            }
        }
        if (!anyPending) _stopBackgroundBattleLoop();
    }, BACKGROUND_BATTLE_TICK);
}

function _stopBackgroundBattleLoop() {
    if (_backgroundBattleLoopId) {
        clearInterval(_backgroundBattleLoopId);
        _backgroundBattleLoopId = null;
    }
}

// 后台推进一回合
function _stepBackgroundBattle(bg) {
    if (!bg || bg.status !== 'pending') return;

    const enemies = bg.enemies.filter(e => e.currentHp > 0 && !e._dead);
    const allies = bg.allies.filter(a => a.currentHp > 0 && !a._dead);

    if (enemies.length === 0 || allies.length === 0) {
        _settleBackgroundBattle(bg);
        return;
    }

    // 盟友各攻击一次随机存活敌人
    allies.forEach(ally => {
        if (ally.currentHp <= 0 || ally._dead) return;
        const target = enemies[Math.floor(Math.random() * enemies.length)];
        if (!target || target.currentHp <= 0) return;
        const damage = calculateDamage(ally.atk, target.def, null, null);
        _applyDamageToUnit(target, damage, true, bg.log, bg.roomId);
        bg.log.push(`${ally.name} 对 ${target.name} 造成 ${damage} 点伤害。`);
    });

    // 每个存活敌人按40%概率攻击一名随机存活盟友
    enemies.forEach(enemy => {
        if (enemy.currentHp <= 0 || enemy._dead) return;
        if (Math.random() >= 0.4) return;
        const target = allies[Math.floor(Math.random() * allies.length)];
        if (!target || target.currentHp <= 0) return;
        const damage = calculateDamage(enemy.atk, target.def, null, null);
        _applyDamageToUnit(target, damage, true, bg.log, bg.roomId);
        bg.log.push(`${enemy.name} 对 ${target.name} 造成 ${damage} 点伤害。`);
    });

    // 处理死亡尸体（静默）
    [...enemies, ...allies].forEach(unit => {
        if (unit.currentHp <= 0 && !unit._dead) {
            _settleUnitDeath(unit, true, bg.log, bg.roomId);
        }
    });

    _settleBackgroundBattle(bg);
}

// 判定后台战斗是否结束
function _settleBackgroundBattle(bg) {
    const enemiesAlive = bg.enemies.filter(e => e.currentHp > 0 && !e._dead);
    const alliesAlive = bg.allies.filter(a => a.currentHp > 0 && !a._dead);

    if (enemiesAlive.length === 0) {
        bg.status = 'allies_victory';
        const room = gameState.world[bg.roomId];
        if (room && room.npcs) {
            bg.enemies.forEach(e => {
                const idx = room.npcs.indexOf(e.npcId);
                if (idx > -1) room.npcs.splice(idx, 1);
            });
        }
        const names = bg.allies.map(a => a.name).join('、');
        bg.log.push(`【盟友胜利】${names} 击败了所有敌人。`);
    } else if (alliesAlive.length === 0) {
        bg.status = 'allies_defeat';
        bg.log.push(`【盟友失败】你的盟友被击败了，敌人仍盘踞在房间中。`);
    }
    // 若双方都仍存活，则继续保持 pending，等待下一回合
}

// 玩家进入某房间时检查是否存在后台战斗记录
// 返回 true 表示已开始恢复实战（调用方应停止后续普通渲染）
function maybeResumeOrReportBackgroundBattle(roomId) {
    if (!gameState.backgroundBattles) return false;
    if (battleState.inBattle) return false;
    const bg = gameState.backgroundBattles[roomId];
    if (!bg) return false;

    delete gameState.backgroundBattles[roomId];

    if (bg.status === 'pending') {
        // 后台战斗尚未结束，玩家中途返回 → 立即恢复实战
        _printBackgroundSummary(bg);
        _resumeBattleFromBackground(bg);
        return true;
    }

    if (bg.status === 'allies_victory') {
        _printBackgroundSummary(bg);
        return false;
    }

    if (bg.status === 'allies_defeat') {
        _printBackgroundSummary(bg);
        _resumeBattleFromBackground(bg);
        return true;
    }

    return false;
}

// 后台结算摘要（不显示具体HP数值，仅展示结果与简要日志）
function _printBackgroundSummary(bg) {
    print("");
    print(`<span style="color: #ffdd44;">════════ 战斗后续 ════════</span>`);
    if (bg.status === 'allies_victory') {
        print(`<span style="color: #aaffaa;">你离开后，${bg.allies.map(a => allyNameHtml(a.name)).join('、')} 击败了盘踞于此的敌人。</span>`);
    } else if (bg.status === 'allies_defeat') {
        if (bg.allyCount > 0) {
            print(`<span style="color: #ff8888;">你离开后，你的盟友不敌敌人，这里仍被敌人占据。</span>`);
        } else {
            print(`<span style="color: #ff8888;">你逃离了战斗，敌人仍盘踞在此，等待与你再次相遇。</span>`);
        }
    } else {
        print(`<span style="color: #888;">你离开后，盟友与敌人的战斗仍在继续。</span>`);
    }
    if (bg.log && bg.log.length > 0) {
        print(`<span style="color: #888;">—— 简要记录 ——</span>`);
        const lines = bg.log.slice(-8);
        lines.forEach(line => print(`<span style="color: #777;">${line}</span>`));
    }
    print(`<span style="color: #ffdd44;">═══════════════════════════</span>`);
    print("");
}

// 从后台记录恢复为主界面实战
function _resumeBattleFromBackground(bg) {
    if (typeof mainContent !== 'undefined' && mainContent) { UI.setOutputHtml(mainContent); }
    print("");
    print(`═══════ ⚔️ 战斗再开 ═══════`);

    const enemies = bg.enemies.filter(e => e.currentHp > 0 && !e._dead);
    const allies = bg.allies.filter(a => a.currentHp > 0 && !a._dead);

    enemies.forEach(e => {
        print(`<span style="color:#ff4444;">敌人: ${enemyNameHtml(e.name)}（${getHpStatusText(e)}）</span>`);
    });
    allies.forEach(a => {
        print(`<span style="color:#44ff44;">盟友: ${allyNameHtml(a.name)}（${getHpStatusText(a)}）</span>`);
    });
    print("────────────────────────────────");

    battleState = {
        inBattle: true,
        roomId: bg.roomId || gameState.player.location,
        enemies,
        allies,
        round: bg.round || 1,
        currentTurnIndex: 0,
        turnOrder: [],
        hatredUsed: false, vowUsed: false, sacrificeCooldown: 0,
        lianaVowUsed: false, lianaSacrificeCooldown: 0, androsBlessingUsed: false,
        reinforcement: null,
        originalPlayerStats: { atk: gameState.player.atk, def: gameState.player.def, agi: gameState.player.agi },
        fleeAttemptedThisRound: false
    };
    document.body.classList.add('battle-mode');

    initCastleReinforcement(battleState.roomId);
    if (UI.elements.detailPanel) { UI.setDetail(renderBattleDetail()); }
    setTimeout(() => startNewRound(), 800);
}