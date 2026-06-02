// ============================================================
//  game/skills.js - 技能数据定义
//  requireKnightSet: 需要装备骑士大剑+骑士板甲+骑士徽记
//  npcOnly: 仅NPC可使用
// ============================================================

const skills = {
    hatred: {
        name: "仇恨",
        description: "释放后本场战斗攻击力翻倍，灵巧降低至0，防御降低50%（本场战斗只能使用一次）",
        cost: 10,
        effect: function() {
            if (battleState.hatredUsed) {
                print(`<span style="color: #ffaaaa;">仇恨技能已经在本场战斗中使用过了！</span>`);
                gameState.player.sp += this.cost;
                return false;
            }
            battleState.hatredUsed = true;
            gameState.player.atk *= 2;
            gameState.player.agi = 0;
            gameState.player.def *= 0.5;
            print(`<span style="color: #ff6666;">你释放了技能「仇恨」！攻击力翻倍，灵巧降低至0，防御降低50%！</span>`);
            return true;
        }
    },

    // ★ 骑士套技能：誓言（玩家）
    player_vow: {
        name: "誓言",
        description: "以骑士之名起誓，本场战斗防御力上涨20%（每场战斗只能使用一次）。需装备骑士套装。",
        cost: 20,
        requireKnightSet: true,
        effect: function() {
            if (battleState.vowUsed) {
                print(`<span style="color: #ffaaaa;">誓言技能已经在本场战斗中使用过了！</span>`);
                gameState.player.sp += this.cost;
                return false;
            }
            battleState.vowUsed = true;
            const boost = Math.floor(gameState.player.def * 0.2);
            gameState.player.def += boost;
            print(`<span style="color: #66aaff;">你释放了「誓言」！防御力永久提升${boost}点！</span>`);
            return true;
        }
    },

    // ★ 骑士套技能：舍身（玩家）
    player_sacrifice: {
        name: "舍身",
        description: "消耗10%当前血量，立即对敌方造成一次普通攻击伤害。若灵巧高于敌方则免除扣血。冷却3回合。需装备骑士套装。",
        cost: 20,
        cooldown: 3,
        requireKnightSet: true,
        effect: function() {
            if (battleState.sacrificeCooldown && battleState.sacrificeCooldown > 0) {
                print(`<span style="color: #ffaaaa;">舍身技能冷却中（剩余${battleState.sacrificeCooldown}回合）！</span>`);
                gameState.player.sp += this.cost;
                return false;
            }
            const aliveEnemies = battleState.enemies.filter(e => e.currentHp > 0);
            if (aliveEnemies.length === 0) { gameState.player.sp += this.cost; return false; }
            const targetEnemy = aliveEnemies[0];
            const playerAgi = getCharacterAgility(gameState.player);
            const enemyAgi = targetEnemy.agi || 0;

            if (playerAgi < enemyAgi) {
                const hpCost = Math.max(1, Math.floor(gameState.player.hp * 0.1));
                gameState.player.hp = Math.max(0, gameState.player.hp - hpCost);
                print(`<span style="color: #ff6666;">你消耗了${hpCost}点生命值释放舍身！</span>`);
                if (gameState.player.hp <= 0) { battleEnd(false); return false; }
            } else {
                print(`<span style="color: #aaffaa;">你的灵巧高于${targetEnemy.name}，舍身无需扣血！</span>`);
            }

            const playerAtk = getCharacterAttack(gameState.player);
            const damage = calculateDamage(playerAtk, targetEnemy.def);
            targetEnemy.currentHp = Math.max(0, targetEnemy.currentHp - damage);
            print(`<span style="color: #ff8844;">你对${targetEnemy.name}舍身一击，造成${damage}点伤害！</span>`);
            if (targetEnemy.currentHp <= 0) { print(`<span style="color: #ff8888;">${targetEnemy.name}倒下了！</span>`); }

            battleState.sacrificeCooldown = 3;
            return true;
        }
    },

    // ★ 莉娅娜技能：真·誓言
    liana_vow: {
        name: "真·誓言",
        description: "莉娅娜以骑士荣誉起誓，本场战斗防御力上涨50%",
        cost: 20,
        npcOnly: true,
        isBuff: true,
        effect: function(caster) {
            const boost = Math.floor(caster.def * 0.5);
            caster.def += boost;
            print(`<span style="color: #66aaff;">莉娅娜释放了「真·誓言」！防御力上涨50%（+${boost}）！</span>`);
            return true;
        }
    },

    // ★ 莉娅娜技能：真·舍身
    liana_sacrifice: {
        name: "真·舍身",
        description: "莉娅娜舍命一击，若灵巧低于对手则扣除10%血量，对敌方造成两次伤害。冷却3回合。",
        cost: 20,
        cooldown: 3,
        npcOnly: true,
        isDamage: true,
        effect: function(caster) {
            const playerAgi = getCharacterAgility(gameState.player);
            const casterAgi = caster.agi || 0;

            if (casterAgi < playerAgi) {
                const hpCost = Math.max(1, Math.floor(caster.currentHp * 0.1));
                caster.currentHp = Math.max(0, caster.currentHp - hpCost);
                print(`<span style="color: #ff6666;">莉娅娜消耗了${hpCost}点生命值释放真·舍身！</span>`);
                if (caster.currentHp <= 0) return false;
            }

            const playerDef = getCharacterDefense(gameState.player);
            for (let hit = 1; hit <= 2; hit++) {
                if (gameState.player.hp <= 0) break;
                const damage = calculateDamage(caster.atk, playerDef);
                gameState.player.hp = Math.max(0, gameState.player.hp - damage);
                print(`<span style="color: #ff8844;">莉娅娜真·舍身第${hit}击！对你造成${damage}点伤害！</span>`);
            }

            if (gameState.player.hp <= 0) {
                print(`<span style="color: #ff6666;">你倒下了...</span>`);
                setTimeout(() => battleEnd(false), 1000);
                return false;
            }
            print(`<span style="color: #aaffaa;">你的 HP: ${gameState.player.hp}/${gameState.player.maxHp}</span>`);
            return true;
        }
    }
};