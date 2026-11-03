// ============================================================
//  characters/char_dungeonNpcs.js - 学院遗址敌人
//  基础战斗数值由等级系统自动计算。
// ============================================================

Object.assign(CHARACTER_TEMPLATES, {
    female_mage: {
        id: 'female_mage',
        name: '女魔法师',
        type: 'enemy',
        gender: 'female',
        age: 32,
        level: 8,
        desc: '一名在学院遗址中徘徊的成年女魔法师。她披着褪色的深蓝法袍，散乱长发间沾着结晶粉尘，双眼被不稳定的紫光占据。她已经无法正常交流，只会本能地攻击闯入者。',
        canTalk: false,
        canFight: true,
        hostile: true,
        drops: [],
        enemySkill: 'arcane_missile'
    },
    mad_female_mage: {
        id: 'mad_female_mage',
        name: '疯魔的女魔法师',
        type: 'boss',
        gender: 'female',
        age: 46,
        level: 12,
        desc: '密室中央站着一名被魔力彻底侵蚀的成年女魔法师。破碎法袍悬浮在她周围，皮肤下流动着蛛网般的紫色光纹；她的轮廓时而清晰、时而像雾气一样散开。',
        canTalk: false,
        canFight: true,
        hostile: true,
        drops: [],
        noCorpse: true,
        enemySkill: 'crazed_arcana'
    }
});

if (typeof applyNpcLevelBalance === 'function') {
    applyNpcLevelBalance(CHARACTER_TEMPLATES.female_mage);
    applyNpcLevelBalance(CHARACTER_TEMPLATES.mad_female_mage);
}
