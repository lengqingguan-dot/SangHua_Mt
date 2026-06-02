// 1. 战斗状态
let battleState = {
    inBattle: false,
    enemies: [],
    currentTurnIndex: 0,
    turnOrder: [],
    round: 0,
    hatredUsed: false,
    vowUsed: false,
    sacrificeCooldown: 0,
    lianaVowUsed: false,
    lianaSacrificeCooldown: 0,
    originalPlayerStats: null
};

const DEFAULT_BATTLE_STATE = JSON.parse(JSON.stringify(battleState));
let currentBattleEnemies = {};

// 渲染技能按钮HTML（供战斗各阶段复用）
function renderSkillButtons() {
    const currentSp = gameState.player.sp || 0;
    const maxSp = gameState.player.maxSp || 0;
    let html = '<h3>技能</h3>';
    if (gameState.player.skills && gameState.player.skills.length > 0) {
        html += '<div class="skill-buttons">';
        gameState.player.skills.forEach(sId => {
            const s = skills[sId];
            if (s) {
                // ★ 套装技能的过滤逻辑
                if (s.requireKnightSet && !hasKnightSetBonus()) return;
                if (s.npcOnly) return;
                const disabled = currentSp < s.cost ? 'disabled' : '';
                html += `
                    <button class="skill-button ${disabled}" onclick="useSkill('${sId}')" ${disabled}>
                        <span class="skill-name">${s.name}</span>
                        <span class="skill-cost">SP: ${s.cost} (${currentSp}/${maxSp})</span>
                        <span class="skill-desc">${s.description}</span>
                    </button>`;
            }
        });
        html += '</div>';
    } else { html += '<p>暂无技能</p>'; }
    return html;
}

function useSkill(skillId) {
    if (!battleState.inBattle) { print(`<span style="color: #ffaaaa;">战斗外无法使用技能！</span>`); return; }
    const skill = skills[skillId];
    if (!skill) { print(`<span style="color: #ffaaaa;">技能不存在！</span>`); return; }
    const currentSp = gameState.player.sp || 0;
    if (currentSp < skill.cost) { print(`<span style="color: #ffaaaa;">技力不足！</span>`); return; }
    gameState.player.sp = Math.floor(currentSp - skill.cost);
    skill.effect();
    if (UI.elements.detailPanel) { UI.setDetail(renderSkillButtons()); }
    const updatedSp = gameState.player.sp || 0;
    print(`<span style="color: #aaffaa;">你的 HP: ${gameState.player.hp}/${gameState.player.maxHp} SP: ${updatedSp}/${gameState.player.maxSp||0}</span>`);
    print("");
}

function startMultiBattle(npcIds) {
    if (!npcIds || npcIds.length === 0) return;
    UI.setOverlay(true);
    if (typeof mainContent !== 'undefined' && mainContent) { UI.setOutputHtml(mainContent); }
    print(""); print(`═══════ ⚔️ 战斗开始 ═══════`);
    const enemies = [];
    npcIds.forEach((npcId, index) => {
        const npc = getCharacterInfo(npcId);
        if (npc && npc.canFight) {
            const enemyInstance = { index, npcId, name: npc.name, currentHp: npc.hp, maxHp: npc.hp, sp: npc.sp || 0, maxSp: npc.maxSp || 0, atk: npc.atk, def: npc.def, agi: getCharacterAgility(npc), drops: npc.drops ? [...npc.drops] : [], exp: npc.exp || 0 };
            enemies.push(enemyInstance);
            print(`<span style="color: #ffaaaa;">敌人${index + 1}: ${npc.name} (HP:${npc.hp} ATK:${npc.atk} DEF:${npc.def} AGI:${enemyInstance.agi})</span>`);
        }
    });
    gameState.player.sp = Math.floor(gameState.player.maxSp || 10);
    print(`<span style="color: #aaffaa;">你 (HP:${gameState.player.hp}/${gameState.player.maxHp} SP:${gameState.player.sp}/${gameState.player.maxSp} ATK:${getCharacterAttack(gameState.player)} DEF:${getCharacterDefense(gameState.player)} AGI:${getCharacterAgility(gameState.player)})</span>`);
    print("────────────────────────────────");
    if (UI.elements.detailPanel) { UI.setDetail(renderSkillButtons()); }
    battleState = { inBattle: true, enemies, round: 1, currentTurnIndex: 0, turnOrder: [], hatredUsed: false, vowUsed: false, sacrificeCooldown: 0, lianaVowUsed: false, lianaSacrificeCooldown: 0, originalPlayerStats: { atk: gameState.player.atk, def: gameState.player.def, agi: gameState.player.agi } };
    setTimeout(() => startNewRound(), 800);
}

function calculateTurnOrder() {
    const participants = [{ type: 'player', agi: getCharacterAgility(gameState.player) }];
    battleState.enemies.forEach((enemy, index) => { if (enemy.currentHp > 0) participants.push({ type: 'enemy', index, agi: enemy.agi }); });
    participants.sort((a, b) => a.agi !== b.agi ? b.agi - a.agi : (a.type === 'player' ? -1 : (b.type === 'player' ? 1 : Math.random() - 0.5)));
    return participants.map(p => p.type === 'player' ? 'player' : p.index);
}

function startNewRound() {
    if (!battleState.inBattle) return;
    if (battleState.enemies.filter(e => e.currentHp > 0).length === 0) { battleEnd(true); return; }
    if (gameState.player.hp <= 0) { battleEnd(false); return; }
    // ★ 冷却递减
    if (battleState.sacrificeCooldown > 0) battleState.sacrificeCooldown--;
    if (battleState.lianaSacrificeCooldown > 0) battleState.lianaSacrificeCooldown--;
    print(`<span style="color: #ffdd44;">═══════════════════════════</span>`);
    print(`<span style="color: #ffdd44;">【第${battleState.round}回合】</span>`);
    battleState.turnOrder = calculateTurnOrder(); battleState.currentTurnIndex = 0;
    print(`<span style="color: #888;">行动顺序: ${battleState.turnOrder.map(t => t === 'player' ? '你' : battleState.enemies[t].name).join(' → ')}</span>`);
    print("");
    if (UI.elements.detailPanel) { UI.setDetail(renderSkillButtons()); }
    setTimeout(() => executeNextTurn(), 600);
}

function executeNextTurn() {
    if (!battleState.inBattle) return;
    if (battleState.enemies.filter(e => e.currentHp > 0).length === 0) { battleEnd(true); return; }
    if (gameState.player.hp <= 0) { battleEnd(false); return; }
    if (battleState.currentTurnIndex >= battleState.turnOrder.length) { battleState.round++; setTimeout(() => startNewRound(), 800); return; }
    const target = battleState.turnOrder[battleState.currentTurnIndex++];
    target === 'player' ? executePlayerTurn() : executeEnemyTurn(target);
}

function executePlayerTurn() {
    if (!battleState.inBattle || gameState.player.hp <= 0) { if (gameState.player.hp <= 0) battleEnd(false); return; }
    const aliveEnemies = battleState.enemies.filter(e => e.currentHp > 0);
    if (aliveEnemies.length === 0) { battleEnd(true); return; }
    const targetEnemy = aliveEnemies[0];
    const playerAtk = getCharacterAttack(gameState.player);
    print(`<span style="color: #aaffaa;">→ 你的回合</span>`);
    print(`你选择攻击 ${targetEnemy.name}！`);
    if (tryDodge(targetEnemy.agi)) { print(`你的攻击被 ${targetEnemy.name} 闪避了！`); }
    else { const damage = calculateDamage(playerAtk, targetEnemy.def, gameState.player.equipment, null); targetEnemy.currentHp = Math.max(0, targetEnemy.currentHp - damage); print(`你对 ${targetEnemy.name} 造成 <span style="color: #ff6666;">${damage}</span> 点伤害！`); }
    if (targetEnemy.currentHp <= 0) { print(`<span style="color: #ff8888;">${targetEnemy.name} 倒下了！</span>`); }
    else { print(`<span style="color: #ff8888;">${targetEnemy.name} HP: ${targetEnemy.currentHp}/${targetEnemy.maxHp}</span>`); }
    print(`<span style="color: #aaffaa;">你的 HP: ${gameState.player.hp}/${gameState.player.maxHp} SP: ${gameState.player.sp||0}/${gameState.player.maxSp||0}</span>`); print("");
    if (UI.elements.detailPanel) { UI.setDetail(renderSkillButtons()); }
    setTimeout(() => executeNextTurn(), 1200);
}

// ★ 莉娅娜NPC技能AI
function executeEnemyTurn(enemyIndex) {
    if (!battleState.inBattle) return;
    const enemy = battleState.enemies[enemyIndex];
    if (!enemy || enemy.currentHp <= 0) { executeNextTurn(); return; }
    if (gameState.player.hp <= 0) { battleEnd(false); return; }

    // ★ 莉娅娜特殊AI：优先释放buff，再伤害技能
    if (enemy.npcId === 'liana') {
        const lianaSp = 100; // 莉娅娜SP=100（足够放所有技能）
        // 优先：释放未使用的buff技能（真·誓言）
        if (!battleState.lianaVowUsed) {
            const vowSkill = skills['liana_vow'];
            if (vowSkill) {
                print(`<span style="color: #ffaaaa;">→ ${enemy.name} 的回合</span>`);
                battleState.lianaVowUsed = true;
                vowSkill.effect(enemy);
                updateEnemyStatusDisplay(enemy);
                setTimeout(() => executeNextTurn(), 1200);
                return;
            }
        }
        // 其次：释放伤害技能（真·舍身），检查冷却
        if (!battleState.lianaSacrificeCooldown || battleState.lianaSacrificeCooldown <= 0) {
            const sacSkill = skills['liana_sacrifice'];
            if (sacSkill) {
                print(`<span style="color: #ffaaaa;">→ ${enemy.name} 的回合</span>`);
                sacSkill.effect(enemy);
                battleState.lianaSacrificeCooldown = sacSkill.cooldown || 3;
                updateEnemyStatusDisplay(enemy);
                if (gameState.player.hp <= 0) { setTimeout(() => battleEnd(false), 1000); return; }
                setTimeout(() => executeNextTurn(), 1200);
                return;
            }
        }
    }

    // 普通攻击
    const playerDef = getCharacterDefense(gameState.player);
    const playerAgi = getCharacterAgility(gameState.player);
    print(`<span style="color: #ffaaaa;">→ ${enemy.name} 的回合</span>`);
    print(`${enemy.name} 向你发起攻击！`);
    if (tryDodge(playerAgi)) { print(`${enemy.name} 的攻击被你闪避了！`); }
    else { const damage = calculateDamage(enemy.atk, playerDef, null, gameState.player.equipment); gameState.player.hp = Math.max(0, gameState.player.hp - damage); print(`${enemy.name} 对你造成 <span style="color: #ff6666;">${damage}</span> 点伤害！`); }
    if (gameState.player.hp <= 0) { print(`<span style="color: #ff6666;">你倒下了...</span>`); setTimeout(() => battleEnd(false), 1000); return; }
    print(`<span style="color: #aaffaa;">你的 HP: ${gameState.player.hp}/${gameState.player.maxHp} SP: ${gameState.player.sp||0}/${gameState.player.maxSp||0}</span>`);
    setTimeout(() => executeNextTurn(), 1200);
}

function updateEnemyStatusDisplay(enemy) {
    print(`<span style="color: #ff8888;">${enemy.name} HP: ${enemy.currentHp}/${enemy.maxHp}</span>`);
}

function startBattle(npcId) { startMultiBattle([npcId]); }

function battleEnd(playerWon) {
    battleState.inBattle = false;
    if (battleState.originalPlayerStats) { gameState.player.atk = battleState.originalPlayerStats.atk; gameState.player.def = battleState.originalPlayerStats.def; gameState.player.agi = battleState.originalPlayerStats.agi; battleState.originalPlayerStats = null; }
    print(`<span style="color: #ffdd44;">═══════════════════════════</span>`);
    if (playerWon) {
        print(`<span style="color: #aaffaa;">【胜利！】你击败了所有敌人！</span>`);
        const room = gameState.world[gameState.player.location]; let totalExp = 0; const defeatedEnemies = [];
        battleState.enemies.forEach((enemy, index) => {
            const npc = getCharacterInfo(enemy.npcId); if (!npc) return;
            defeatedEnemies.push(enemy.npcId);
            if (enemy.npcId === 'serena') { print(`<span style="color: #cc66ff;">"既然如此，就送你个宝贝。"</span>`); print(`<span style="color: #cc66ff;">瑟蕾娜的身躯化为一团紫雾...</span>`); if (enemy.drops?.length > 0 && room) { enemy.drops.forEach((dropId, di) => { const dropItem = createItemFromTemplate(dropId); if (dropItem) { dropItem.id = `drop_${dropId}_${Date.now()}_${di}`; ITEM_TEMPLATES[dropItem.id] = dropItem; if (!room.items) room.items = []; room.items.push(dropItem.id); } }); } totalExp += enemy.exp; return; }
            const drops = enemy.drops ? [...enemy.drops] : []; const corpseId = `corpse_${enemy.npcId}_${Date.now()}_${index}`; const corpse = createCorpse(enemy.npcId, drops); if (corpse) { corpse.id = corpseId; if (room) { if (!room.items) room.items = []; room.items.push(corpseId); } ITEM_TEMPLATES[corpseId] = corpse; print(`<span style="color: #888;">${enemy.name}的尸体倒在地上...</span>`); } totalExp += enemy.exp;
        });
        if (totalExp > 0) { print(""); print(`<span style="color: #ffdd44;">获得 ${totalExp} 点经验值！</span>`); gameState.player.exp += totalExp; checkLevelUp(); }
        if (room?.npcs) defeatedEnemies.forEach(npcId => { const idx = room.npcs.indexOf(npcId); if (idx > -1) room.npcs.splice(idx, 1); });
        updateSceneInfo();
    } else { print(`<span style="color: #ff6666;">【失败...】你被击败了。</span>`); print(`<span style="color: #aaa;">（游戏将重新开始...）</span>`); setTimeout(() => location.reload(), 2000); }
    UI.setOverlay(false);
    if (UI.elements.detailPanel) UI.clearDetail();
    currentPanel = null;
}