// ============================================================
//  items/items_char_female_serf.js - 女农奴的肢体与尸体
//  品质统一为绿色（优良），与女贫民肢体模板结构一致
// ============================================================

const FEMALE_SERF_QUALITY = 'good';

Object.assign(ITEM_TEMPLATES, {

    female_serf_head: {
        id: "female_serf_head",
        name: "女农奴的头",
        type: "limb",
        rarity: FEMALE_SERF_QUALITY,
        score: 60,
        desc: "女农奴的头颅。常年风吹日晒让她的脸颊粗糙而黝黑，额角有几道被泥汗浸出的细纹。她的眼睛半阖着，像还没从田垄间直起腰来。断口处沾着草屑和干涸的血。"
    },

    female_serf_torso: {
        id: "female_serf_torso",
        name: "女农奴的躯干",
        type: "limb",
        rarity: FEMALE_SERF_QUALITY,
        score: 60,
        desc: "女农奴的躯干。瘦而结实，肩背被重物压出常年劳作的痕迹。皮肤黝黑，腰腹薄薄的一层肉下面就是肋骨。断口处血已经凝住，混着田里的泥。"
    },

    female_serf_leg: {
        id: "female_serf_leg",
        name: "女农奴的腿",
        type: "limb",
        rarity: FEMALE_SERF_QUALITY,
        score: 60,
        desc: "女农奴的腿。肌肉紧实，小腿的形状像被无数次弯腰起身磨出来的一样。膝盖上留着跪在田里磕出的旧茧，脚踝沾着泥点。断面露出暗红的肌肉与白净的腿骨。"
    },

    female_serf_arm: {
        id: "female_serf_arm",
        name: "女农奴的手臂",
        type: "limb",
        rarity: FEMALE_SERF_QUALITY,
        score: 60,
        desc: "女农奴的手臂。小臂晒得发黑，指尖粗短而有力，是常年握锄、捆麦磨出来的。此刻软软地垂着，手腕处还有麻绳勒出的浅印。"
    },

    female_serf_hand: {
        id: "female_serf_hand",
        name: "女农奴的手",
        type: "limb",
        rarity: FEMALE_SERF_QUALITY,
        score: 60,
        desc: "女农奴的手。指节粗大，虎口和掌心满是厚茧，指缝里嵌着洗不净的泥。这只手曾一次又一次地攥住镰刀，如今却只是半张着，再握不住任何东西。"
    },

    female_serf_foot: {
        id: "female_serf_foot",
        name: "女农奴的脚",
        type: "limb",
        rarity: FEMALE_SERF_QUALITY,
        score: 60,
        desc: "女农奴的脚，37码。脚掌宽而粗糙，脚底是走田埂磨出的厚茧。脚趾微微蜷着，脚背沾满灰黄的浮土。断踝处血已发黑。"
    },

    female_serf_breast: {
        id: "female_serf_breast",
        name: "女农奴的乳房",
        type: "limb",
        rarity: FEMALE_SERF_QUALITY,
        score: 60,
        desc: "女农奴的乳房，B罩杯。不算丰硕，因为常年劳作而略显干瘪，乳肉沉甸甸地往下坠。皮肤黝黑，乳晕颜色较深，断面上能看见浅黄的脂肪层。"
    }

});

// 生成女农奴的尸体（可互动、可搜刮、可肢解、可拾取）
function generateFemaleSerfCorpse() {
    const uid = `corpse_female_serf_${Date.now()}`;

    const limbTemplates = [
        { id: 'female_serf_head', name: '头', count: 1 },
        { id: 'female_serf_torso', name: '躯干', count: 1 },
        { id: 'female_serf_leg', name: '腿', count: 2 },
        { id: 'female_serf_arm', name: '手臂', count: 2 },
        { id: 'female_serf_hand', name: '手', count: 2 },
        { id: 'female_serf_foot', name: '脚', count: 2 },
        { id: 'female_serf_breast', name: '乳房', count: 2 }
    ];

    const clone = (o) => JSON.parse(JSON.stringify(o));
    const generatedLimbs = {
        female_serf_head: [clone(ITEM_TEMPLATES['female_serf_head'])],
        female_serf_torso: [clone(ITEM_TEMPLATES['female_serf_torso'])],
        female_serf_leg: [clone(ITEM_TEMPLATES['female_serf_leg']), clone(ITEM_TEMPLATES['female_serf_leg'])],
        female_serf_arm: [clone(ITEM_TEMPLATES['female_serf_arm']), clone(ITEM_TEMPLATES['female_serf_arm'])],
        female_serf_hand: [clone(ITEM_TEMPLATES['female_serf_hand']), clone(ITEM_TEMPLATES['female_serf_hand'])],
        female_serf_foot: [clone(ITEM_TEMPLATES['female_serf_foot']), clone(ITEM_TEMPLATES['female_serf_foot'])],
        female_serf_breast: [clone(ITEM_TEMPLATES['female_serf_breast']), clone(ITEM_TEMPLATES['female_serf_breast'])]
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