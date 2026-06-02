
// 1. 战斗状态
let battleState = {
    inBattle: false,
    enemies: [],  // 多个敌人 [{npcId, currentHp, maxHp, agi, atk, def, name}, ...]
    currentTurnIndex: 0,  // 当前行动者的索引
    turnOrder: [],  // 行动顺序 ['player' 或 enemy索引]
    round: 0,
    hatredUsed: false,  // 仇恨技能是否已在本次战斗中使用
    originalPlayerStats: null  // 战斗开始时玩家的原始属性
};

// 默认战斗状态，用于重置游戏
const DEFAULT_BATTLE_STATE = JSON.parse(JSON.stringify(battleState));

// 当前战斗中的敌人实例（用于快速查找）
let currentBattleEnemies = {};

// 2. 技能定义
// 技能数据已提取至 game/skills.js，此处保留公开声明
// skills 对象由 game/skills.js 定义

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
                const disabled = currentSp < s.cost ? 'disabled' : '';
                html += `
                    <button class="skill-button ${disabled}" onclick="useSkill('${sId}')" ${disabled}>
                        <span class="skill-name">${s.name}</span>
                        <span class="skill-cost">SP: ${s.cost} (${currentSp}/${maxSp})</span>
                        <span class="skill-desc">${s.description}</span>
                    </button>
                `;
            }
        });
        html += '</div>';
    } else {
        html += '<p>暂无技能</p>';
    }
    return html;
}

// 3. 战斗函数
function useSkill(skillId) {
    if (!battleState.inBattle) {
        print(`<span style="color: #ffaaaa;">战斗外无法使用技能！</span>`);
        return;
    }
    
    const skill = skills[skillId];
    if (!skill) {
        print(`<span style="color: #ffaaaa;">技能不存在！</span>`);
        return;
    }
    
    const currentSp = gameState.player.sp || 0;
    if (currentSp < skill.cost) {
        print(`<span style="color: #ffaaaa;">技力不足！</span>`);
        return;
    }
    
    // 消耗技力
    gameState.player.sp = Math.floor(currentSp - skill.cost);
    
    // 执行技能效果
    skill.effect();
    
    // 重新显示技能按钮，更新技力显示
    if (UI.elements.detailPanel) {
        UI.setDetail(renderSkillButtons());
    }
    
    // 显示当前玩家状态
    const updatedSp = gameState.player.sp || 0;
    const maxSp = gameState.player.maxSp || 0;
    print(`<span style="color: #aaffaa;">你的 HP: ${gameState.player.hp}/${gameState.player.maxHp} SP: ${updatedSp}/${maxSp}</span>`);
    print("");
}

function startMultiBattle(npcIds) {
    if (!npcIds || npcIds.length === 0) return;
    
    // 显示遮罩
    UI.setOverlay(true);
    
    // 先显示主界面内容
    if (typeof mainContent !== 'undefined' && mainContent) {
        UI.setOutputHtml(mainContent);
    }
    
    print("");
    print(`═══════ ⚔️ 战斗开始 ═══════`);
    
    // 初始化敌人数据
    const enemies = [];
    npcIds.forEach((npcId, index) => {
        const npc = getCharacterInfo(npcId);
        if (npc && npc.canFight) {
            // 为每个敌人创建独立实例（即使有相同ID）
            const enemyInstance = {
                index: index,
                npcId: npcId,
                name: npc.name,
                currentHp: npc.hp,
                maxHp: npc.hp,
                atk: npc.atk,
                def: npc.def,
                agi: getCharacterAgility(npc),
                drops: npc.drops ? [...npc.drops] : [],
                exp: npc.exp || 0
            };
            enemies.push(enemyInstance);
            
            // 显示敌人信息
            print(`<span style="color: #ffaaaa;">敌人${index + 1}: ${npc.name} (HP:${npc.hp} ATK:${npc.atk} DEF:${npc.def} AGI:${enemyInstance.agi})</span>`);
        }
    });
    
    // 回满技力
    gameState.player.sp = Math.floor(gameState.player.maxSp || 10);
    const currentSp = gameState.player.sp || 0;
    const maxSp = gameState.player.maxSp || 10;
    print(`<span style="color: #aaffaa;">你 (HP:${gameState.player.hp}/${gameState.player.maxHp} SP:${currentSp}/${maxSp} ATK:${getCharacterAttack(gameState.player)} DEF:${getCharacterDefense(gameState.player)} AGI:${getCharacterAgility(gameState.player)})</span>`);
    print("────────────────────────────────");
    
    // 显示技能按钮
    if (UI.elements.detailPanel) {
        UI.setDetail(renderSkillButtons());
    }
    
    // 初始化战斗状态
    battleState = {
        inBattle: true,
        enemies: enemies,
        round: 1,
        currentTurnIndex: 0,
        turnOrder: [],  
        hatredUsed: false,  
        originalPlayerStats: {  
            atk: gameState.player.atk,
            def: gameState.player.def,
            agi: gameState.player.agi
        }
    };
    
    // 计算行动顺序并开始第一回合
    setTimeout(() => {
        startNewRound();
    }, 800);
}

function calculateTurnOrder() {
    const playerAgi = getCharacterAgility(gameState.player);
    
    const participants = [];
    participants.push({ type: 'player', agi: playerAgi });
    
    battleState.enemies.forEach((enemy, index) => {
        if (enemy.currentHp > 0) {
            participants.push({ type: 'enemy', index: index, agi: enemy.agi });
        }
    });
    
    participants.sort((a, b) => {
        if (a.agi !== b.agi) {
            return b.agi - a.agi;  
        }
        if (a.type === 'player' && b.type === 'enemy') {
            return -1;  
        }
        if (a.type === 'enemy' && b.type === 'player') {
            return 1;  
        }
        return Math.random() - 0.5;
    });
    
    return participants.map(p => p.type === 'player' ? 'player' : p.index);
}

function startNewRound() {
    if (!battleState.inBattle) return;
    
    const aliveEnemies = battleState.enemies.filter(e => e.currentHp > 0);
    if (aliveEnemies.length === 0) {
        battleEnd(true);
        return;
    }
    
    if (gameState.player.hp <= 0) {
        battleEnd(false);
        return;
    }
    
    print(`<span style="color: #ffdd44;">═══════════════════════════</span>`);
    print(`<span style="color: #ffdd44;">【第${battleState.round}回合】</span>`);
    
    battleState.turnOrder = calculateTurnOrder();
    battleState.currentTurnIndex = 0;
    
    const orderNames = battleState.turnOrder.map(target => {
        if (target === 'player') return '你';
        return battleState.enemies[target].name;
    });
    print(`<span style="color: #888;">行动顺序: ${orderNames.join(' → ')}</span>`);
    print("");
    
    if (UI.elements.detailPanel) {
        UI.setDetail(renderSkillButtons());
    }
    
    setTimeout(() => {
        executeNextTurn();
    }, 600);
}

function executeNextTurn() {
    if (!battleState.inBattle) return;
    
    const aliveEnemies = battleState.enemies.filter(e => e.currentHp > 0);
    if (aliveEnemies.length === 0) {
        battleEnd(true);
        return;
    }
    if (gameState.player.hp <= 0) {
        battleEnd(false);
        return;
    }
    
    if (battleState.currentTurnIndex >= battleState.turnOrder.length) {
        battleState.round++;
        setTimeout(() => {
            startNewRound();
        }, 800);
        return;
    }
    
    const currentTarget = battleState.turnOrder[battleState.currentTurnIndex];
    battleState.currentTurnIndex++;
    
    if (currentTarget === 'player') {
        executePlayerTurn();
    } else {
        executeEnemyTurn(currentTarget);
    }
}

function executePlayerTurn() {
    if (!battleState.inBattle) return;
    
    if (gameState.player.hp <= 0) {
        battleEnd(false);
        return;
    }
    
    const aliveEnemies = battleState.enemies.filter(e => e.currentHp > 0);
    if (aliveEnemies.length === 0) {
        battleEnd(true);
        return;
    }
    
    const targetEnemy = aliveEnemies[0];
    const playerAtk = getCharacterAttack(gameState.player);
    const enemyDef = targetEnemy.def;
    const enemyAgi = targetEnemy.agi;
    
    print(`<span style="color: #aaffaa;">→ 你的回合</span>`);
    print(`你选择攻击 ${targetEnemy.name}！`);
    
    if (tryDodge(enemyAgi)) {
        print(`你的攻击被 ${targetEnemy.name} 闪避了！`);
    } else {
        const damage = calculateDamage(playerAtk, enemyDef);
        targetEnemy.currentHp = Math.max(0, targetEnemy.currentHp - damage);
        print(`你对 ${targetEnemy.name} 造成 <span style="color: #ff6666;">${damage}</span> 点伤害！`);
    }
    
    if (targetEnemy.currentHp <= 0) {
        print(`<span style="color: #ff8888;">${targetEnemy.name} 倒下了！</span>`);
    } else {
        print(`<span style="color: #ff8888;">${targetEnemy.name} HP: ${targetEnemy.currentHp}/${targetEnemy.maxHp}</span>`);
    }
    
    const currentSp = gameState.player.sp || 0;
    const maxSp = gameState.player.maxSp || 0;
    print(`<span style="color: #aaffaa;">你的 HP: ${gameState.player.hp}/${gameState.player.maxHp} SP: ${currentSp}/${maxSp}</span>`);
    print("");
    
    if (UI.elements.detailPanel) {
        UI.setDetail(renderSkillButtons());
    }
    
    setTimeout(() => {
        executeNextTurn();
    }, 1200);
}

function executeEnemyTurn(enemyIndex) {
    if (!battleState.inBattle) return;
    
    const enemy = battleState.enemies[enemyIndex];
    
    if (!enemy || enemy.currentHp <= 0) {
        executeNextTurn();
        return;
    }
    
    if (gameState.player.hp <= 0) {
        battleEnd(false);
        return;
    }
    
    const playerDef = getCharacterDefense(gameState.player);
    const playerAgi = getCharacterAgility(gameState.player);
    
    print(`<span style="color: #ffaaaa;">→ ${enemy.name} 的回合</span>`);
    print(`${enemy.name} 向你发起攻击！`);
    
    if (tryDodge(playerAgi)) {
        print(`${enemy.name} 的攻击被你闪避了！`);
    } else {
        const damage = calculateDamage(enemy.atk, playerDef);
        gameState.player.hp = Math.max(0, gameState.player.hp - damage);
        print(`${enemy.name} 对你造成 <span style="color: #ff6666;">${damage}</span> 点伤害！`);
    }
    
    if (gameState.player.hp <= 0) {
        print(`<span style="color: #ff6666;">你倒下了...</span>`);
        setTimeout(() => battleEnd(false), 1000);
        return;
    }
    
    const currentSp = gameState.player.sp || 0;
    const maxSp = gameState.player.maxSp || 0;
    print(`<span style="color: #aaffaa;">你的 HP: ${gameState.player.hp}/${gameState.player.maxHp} SP: ${currentSp}/${maxSp}</span>`);
    print("");
    
    setTimeout(() => {
        executeNextTurn();
    }, 1200);
}

function startBattle(npcId) {
    startMultiBattle([npcId]);
}

function battleEnd(playerWon) {
    battleState.inBattle = false;
    
    if (battleState.originalPlayerStats) {
        gameState.player.atk = battleState.originalPlayerStats.atk;
        gameState.player.def = battleState.originalPlayerStats.def;
        gameState.player.agi = battleState.originalPlayerStats.agi;
        battleState.originalPlayerStats = null;
    }
    
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
                print(`<span style="color: #cc66ff;">瑟蕾娜的身躯化为一团淡紫色的雾气，在空中消散。</span>`);
                print(`<span style="color: #cc66ff;">地面上只留下了一个闪闪发亮的宝石。</span>`);
                if (enemy.drops && enemy.drops.length > 0 && room) {
                    enemy.drops.forEach((dropId, dropIndex) => {
                        const dropItem = createItemFromTemplate(dropId);
                        if (dropItem) {
                            const dropItemId = `drop_${dropId}_${Date.now()}_${dropIndex}`;
                            dropItem.id = dropItemId;
                            ITEM_TEMPLATES[dropItemId] = dropItem;
                            if (!room.items) room.items = [];
                            room.items.push(dropItemId);
                        }
                    });
                }
                totalExp += enemy.exp;
                return; 
            }
            
            const drops = enemy.drops ? [...enemy.drops] : [];
            const corpseId = `corpse_${enemy.npcId}_${Date.now()}_${index}`;
            const corpse = createCorpse(enemy.npcId, drops);
            corpse.id = corpseId; 
            
            if (room) {
                if (!room.items) room.items = [];
                room.items.push(corpseId);
            }
            
            ITEM_TEMPLATES[corpseId] = corpse;
            
            print(`<span style="color: #888;">${enemy.name}的尸体倒在地上...</span>`);
            
            totalExp += enemy.exp;
        });
        
        if (totalExp > 0) {
            print("");
            print(`<span style="color: #ffdd44;">获得 ${totalExp} 点经验值！</span>`);
            gameState.player.exp += totalExp;
            checkLevelUp();
        }
        
        if (room && room.npcs) {
            defeatedEnemies.forEach(npcId => {
                const index = room.npcs.indexOf(npcId);
                if (index > -1) {
                    room.npcs.splice(index, 1);
                }
            });
        }
        
        updateSceneInfo();
    } else {
        print(`<span style="color: #ff6666;">【失败...】你被击败了。</span>`);
        print(`<span style="color: #aaa;">（游戏将重新开始...）</span>`);
        setTimeout(() => {
            location.reload();
        }, 2000);
    }
    
    UI.setOverlay(false);
    
    if (UI.elements.detailPanel) {
        UI.clearDetail();
    }
    currentPanel = null;
}