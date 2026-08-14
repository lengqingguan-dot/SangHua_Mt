// ============================================================
//  characters/char_bountyNpcs.js - 势力悬赏目标NPC
//  悬赏板上的目标角色，接取后随机刷新到镇子/贫民窟房间
// ============================================================

// 悬赏目标元数据（id 对应 CHARACTER_TEMPLATES 中的基础模板）
// stars: 星级，影响可接等级与名望奖励
const BOUNTY_NPCS = [
    { id: 'bounty_peasant_female', name: '女贫民', stars: 1 }
];

// 星级 → 名望奖励
const BOUNTY_REWARDS = {
    1: 1,
    2: 2,
    3: 5,
    4: 10,
    5: 20,
    6: 50
};

// 悬赏目标基础模板（由 spawnBountyNpc 克隆为唯一实例并注册）
Object.assign(CHARACTER_TEMPLATES, {
    bounty_peasant_female: {
        id: 'bounty_peasant_female',
        name: '女贫民',
        type: 'npc',
        desc: '一个被悬赏通缉的女贫民，枯瘦、麻木，眼底却仍有一丝警觉。',
        dialogue: [
            "「……别过来。我什么也没做。」"
        ],
        repeatDialogue: [
            "「……你们这些人，都只会欺软怕硬。」"
        ],
        hp: 15,
        maxHp: 15,
        atk: 2,
        def: 0,
        agi: 3,
        level: 1,
        canTalk: true,
        canFight: true,
        hostile: false,
        drops: [],
        exp: 5,
        femaleCorpse: true   // 击杀后按普通女贫民肢体生成可肢解尸体
    }
});

// 将一个悬赏目标实例化（返回唯一npcId，并注册到 CHARACTER_TEMPLATES）
function spawnBountyNpc(bountyDef) {
    const base = CHARACTER_TEMPLATES[bountyDef.id];
    if (!base) return null;
    const npcId = `bounty_${bountyDef.id}_${Date.now()}_${Math.random().toString(36).substr(2, 6)}`;
    const template = JSON.parse(JSON.stringify(base));
    template.id = npcId;
    template.name = bountyDef.name;
    CHARACTER_TEMPLATES[npcId] = template;
    return npcId;
}