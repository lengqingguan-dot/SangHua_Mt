// ============================================================
//  game/balance.js - 等级、经验与基础数值的统一规则
//  新NPC只需填写 level；type 为 boss 时自动套用首领倍率。
// ============================================================

function getExpRequiredForLevel(level) {
    const lv = Math.max(1, Math.floor(level || 1));
    if (lv <= 5) return 20 + (lv - 1) * 15;       // 20 / 35 / 50 / 65 / 80
    if (lv <= 10) return 100 + (lv - 6) * 25;     // 100—200
    if (lv <= 20) return 240 + (lv - 11) * 40;    // 240—600
    return 660 + (lv - 21) * 60;                  // 21级后稳定线性增加
}

function getPlayerBaseStatsForLevel(level) {
    const lv = Math.max(1, Math.floor(level || 1));
    const gained = lv - 1;
    return {
        maxHp: 20 + gained * 6,
        maxSp: 10 + gained * 2,
        atk: 3 + gained * 2,
        def: 2 + gained,
        agi: 3 + Math.floor(gained / 2)
    };
}

// 永久成长单独保存，不能从含有战斗临时效果的当前属性反复推算。
function getPlayerPermanentBonuses(player) {
    const bonuses = player.permanentBonuses || {};
    player.permanentBonuses = {};
    for (const key of ['maxHp', 'atk', 'def', 'agi']) {
        player.permanentBonuses[key] = Number.isFinite(bonuses[key]) ? Math.max(0, bonuses[key]) : 0;
    }
    return player.permanentBonuses;
}

function getPlayerBalancedStats(player) {
    const stats = getPlayerBaseStatsForLevel(player.level);
    const bonuses = getPlayerPermanentBonuses(player);
    for (const key of Object.keys(bonuses)) stats[key] += bonuses[key];
    const hpModifier = player.equipment?.accessory?.maxHpPercent || 0;
    stats.maxHp = Math.max(1, Math.floor(stats.maxHp * (1 + hpModifier)));
    return stats;
}

// 仅用于没有永久加成字段的旧存档，且必须在读档重算属性之前调用。
// 旧版未记录食用历史，只能保留仍存在的正差值；已丢失的加成无法恢复。
function migrateLegacyPlayerBonuses(player) {
    if (player.permanentBonuses) return;
    const base = getPlayerBaseStatsForLevel(player.level);
    const bonuses = { maxHp: 0, atk: 0, def: 0, agi: 0 };
    for (const key of ['atk', 'def', 'agi']) {
        if (Number.isFinite(player[key])) bonuses[key] = Math.max(0, player[key] - base[key]);
    }
    const hpFactor = 1 + (player.equipment?.accessory?.maxHpPercent || 0);
    const equippedBaseHp = Math.max(1, Math.floor(base.maxHp * hpFactor));
    if (hpFactor > 0 && Number.isFinite(player.maxHp) && player.maxHp > equippedBaseHp) {
        // 旧版取整且可能在装备诅咒之后食用料理，按现有生命上限反推最小加成。
        bonuses.maxHp = Math.max(0, Math.ceil(player.maxHp / hpFactor) - base.maxHp);
    }
    player.permanentBonuses = bonuses;
}

// 装备变化只重算生命上限，保留当前生命（超过上限时截断），不解除战斗技能。
function refreshPlayerMaxHp(player) {
    player.maxHp = getPlayerBalancedStats(player).maxHp;
    player.hp = Math.min(player.hp, player.maxHp);
}

function addPlayerPermanentBonus(player, effect, value) {
    if (!['maxHp', 'atk', 'def', 'agi', 'all'].includes(effect) || !Number.isFinite(value) || value <= 0) return false;
    const bonuses = getPlayerPermanentBonuses(player);
    const keys = effect === 'all' ? ['maxHp', 'atk', 'def', 'agi'] : [effect];
    const oldMaxHp = player.maxHp;
    for (const key of keys) {
        bonuses[key] += value;
        // 保持现有战斗内即时加成；战斗结束再按永久属性去除临时效果。
        if (key !== 'maxHp') player[key] += value;
    }
    if (keys.includes('maxHp')) {
        player.maxHp = getPlayerBalancedStats(player).maxHp;
        player.hp = Math.min(player.maxHp, player.hp + Math.max(0, player.maxHp - oldMaxHp));
    }
    return true;
}

function applyPlayerLevelBalance(player, preserveResourceRatio = true) {
    if (!player) return;
    const oldMaxHp = Math.max(1, player.maxHp || 1);
    const oldMaxSp = Math.max(1, player.maxSp || 1);
    const hpRatio = preserveResourceRatio ? Math.max(0, Math.min(1, (player.hp || 0) / oldMaxHp)) : 1;
    const spRatio = preserveResourceRatio ? Math.max(0, Math.min(1, (player.sp || 0) / oldMaxSp)) : 1;
    const stats = getPlayerBalancedStats(player);
    Object.assign(player, stats);
    player.hp = Math.max(1, Math.round(player.maxHp * hpRatio));
    player.sp = Math.max(0, Math.round(player.maxSp * spRatio));
    player.maxExp = getExpRequiredForLevel(player.level);
}

function getNpcStatsForLevel(level, isBoss = false) {
    const lv = Math.max(1, Math.floor(level || 1));
    const base = {
        maxHp: 18 + lv * 7,
        maxSp: 8 + lv * 3,
        atk: 2 + lv * 2,
        def: 1 + Math.floor(lv * 1.1),
        agi: 3 + Math.floor(lv / 2),
        exp: 6 + lv * 4
    };
    if (!isBoss) return base;
    return {
        maxHp: base.maxHp * 3,
        maxSp: base.maxSp * 2,
        atk: Math.round(base.atk * 1.2),
        def: Math.round(base.def * 1.15),
        agi: base.agi,
        exp: base.exp * 4
    };
}

function applyNpcLevelBalance(npc) {
    if (!npc || typeof npc !== 'object') return npc;
    if (npc.fixedBalance) return npc;
    const stats = getNpcStatsForLevel(npc.level || 1, npc.type === 'boss');
    npc.maxHp = stats.maxHp;
    npc.hp = npc.wounded ? Math.max(1, Math.floor(stats.maxHp * 0.2)) : stats.maxHp;
    npc.maxSp = stats.maxSp;
    npc.sp = stats.maxSp;
    npc.atk = stats.atk;
    npc.def = stats.def;
    npc.agi = stats.agi;
    npc.exp = npc.canFight ? stats.exp : 0;
    return npc;
}

function rebalanceAllCharacterTemplates() {
    if (typeof CHARACTER_TEMPLATES === 'undefined') return;
    Object.values(CHARACTER_TEMPLATES).forEach(applyNpcLevelBalance);
}

rebalanceAllCharacterTemplates();
