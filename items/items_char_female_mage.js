// ============================================================
//  items/items_char_female_mage.js - 女魔法师随机肢体与尸体
//  副本肢体共用评分与尺寸规则，品质由不同的部位描写体现。
// ============================================================

function buildFemaleMageLimb(part, score, footSize, cup) {
    return buildExpeditionLimb('female_mage', part, score, footSize, cup);
}

function generateFemaleMageCorpse() {
    const uid = `corpse_female_mage_${Date.now()}_${Math.random().toString(36).substr(2, 6)}`;
    const footSize = rollGenericFootSize();
    const cup = rollGenericCup();
    const single = part => buildFemaleMageLimb(part, rollExpeditionLimbScore(), footSize, cup);
    const pair = part => {
        const base = single(part);
        return [JSON.parse(JSON.stringify(base)), JSON.parse(JSON.stringify(base))];
    };
    const generatedLimbs = {
        head: [single('head')], torso: [single('torso')],
        leg: pair('leg'), arm: pair('arm'), hand: pair('hand'),
        foot: pair('foot'), breast: pair('breast')
    };
    const corpse = {
        id: uid,
        name: '女魔法师的尸体',
        type: 'limb',
        desc: '一具身穿破损深色法袍的女魔法师尸体。她身上的魔力纹路已经暗淡，只剩少量结晶粉末附着在衣褶间。',
        usable: true,
        customAction: true,
        dismemberable: true,
        loot: [],
        limbTemplates: [
            { id: 'head', name: '头', count: 1 },
            { id: 'torso', name: '躯干', count: 1 },
            { id: 'leg', name: '腿', count: 2 },
            { id: 'arm', name: '手臂', count: 2 },
            { id: 'hand', name: '手', count: 2 },
            { id: 'foot', name: '脚', count: 2 },
            { id: 'breast', name: '乳房', count: 2 }
        ],
        generatedLimbs
    };
    ITEM_TEMPLATES[uid] = corpse;
    return corpse;
}
