// ============================================================
//  items/items_char_female_serf.js - 女农奴的肢体与尸体
//  评分、品质、脚码、罩杯与描述统一沿用普通女性随机模板
// ============================================================

// 生成女农奴的尸体（可互动、可搜刮、可肢解、可拾取）
function generateFemaleSerfCorpse() {
    const uid = `corpse_female_serf_${Date.now()}`;
    const footSize = rollGenericFootSize();
    const cup = rollGenericCup();
    const single = part => buildGenericFemaleLimb(part, rollGenericScore(), footSize, cup, '女农奴');
    const pair = part => {
        const base = single(part);
        return [JSON.parse(JSON.stringify(base)), JSON.parse(JSON.stringify(base))];
    };

    const limbTemplates = [
        { id: 'female_serf_head', name: '头', count: 1 },
        { id: 'female_serf_torso', name: '躯干', count: 1 },
        { id: 'female_serf_leg', name: '腿', count: 2 },
        { id: 'female_serf_arm', name: '手臂', count: 2 },
        { id: 'female_serf_hand', name: '手', count: 2 },
        { id: 'female_serf_foot', name: '脚', count: 2 },
        { id: 'female_serf_breast', name: '乳房', count: 2 }
    ];

    const generatedLimbs = {
        female_serf_head: [single('head')],
        female_serf_torso: [single('torso')],
        female_serf_leg: pair('leg'),
        female_serf_arm: pair('arm'),
        female_serf_hand: pair('hand'),
        female_serf_foot: pair('foot'),
        female_serf_breast: pair('breast')
    };

    const corpse = {
        id: uid,
        name: "女农奴的尸体",
        type: "limb",
        desc: "一具女农奴的尸体。她倒在城里的石板路上，黝黑的皮肤上还沾着田里的浮土。镰刀不知丢在了哪里，只剩一只半张开的手。",
        usable: true,
        customAction: true,
        dismemberable: true,
        loot: ["bread"],
        limbTemplates: limbTemplates,
        generatedLimbs: generatedLimbs,
        corpseStory: [
            "你蹲下来看这具女农奴的尸体。她的手还保持着握镰刀的姿势，像倒下前也未曾松开过。",
            "她本不该死在这里。可既然拿起镰刀走到了广场上，有些命，就已经不是自己的了。"
        ]
    };
    ITEM_TEMPLATES[uid] = corpse;
    return corpse;
}
