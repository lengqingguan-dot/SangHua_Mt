// ============================================================
//  items/items_char_mandorola.js - 曼德罗拉的肢体与尸体
//  品质统一为绿色（优良），与贫民窟女尸肢体结构一致
// ============================================================

const MANDOROLA_QUALITY = 'good';

Object.assign(ITEM_TEMPLATES, {

    mandorola_head: {
        id: "mandorola_head",
        name: "曼德罗拉的头",
        type: "limb",
        rarity: MANDOROLA_QUALITY,
        score: 68,
        desc: "曼德罗拉的头颅。黑色长发散乱地贴在脸颊上，金色瞳孔已经涣散，像两枚将要熄灭的灯。她的脸很年轻，下巴却绷得很紧，像死后仍不肯放松戒备。断颈处血已经凉透。"
    },

    mandorola_torso: {
        id: "mandorola_torso",
        name: "曼德罗拉的躯干",
        type: "limb",
        rarity: MANDOROLA_QUALITY,
        score: 68,
        desc: "曼德罗拉的躯干。瘦小的身体上还穿着裹了灰尘的黑衣，布料被匕首划开几道口子，露出下面薄而紧实的肌肉。断口处露出肋骨的轮廓，血已经凝成暗红。"
    },

    mandorola_leg: {
        id: "mandorola_leg",
        name: "曼德罗拉的腿",
        type: "limb",
        rarity: MANDOROLA_QUALITY,
        score: 68,
        desc: "曼德罗拉的腿。细长而有力，小腿的形状像踩惯狭窄地道的人磨出来的。脚踝纤细，裹着灰扑扑的绑腿。断面露出肌肉束与白森森的腿骨。"
    },

    mandorola_arm: {
        id: "mandorola_arm",
        name: "曼德罗拉的手臂",
        type: "limb",
        rarity: MANDOROLA_QUALITY,
        score: 68,
        desc: "曼德罗拉的手臂。细瘦，指节分明，虎口有一层常年握刀磨出的薄茧。这条手臂曾用极快的速度把刀刃递进出，此刻却软软地垂着，指尖还沾着一点没干的血。"
    },

    mandorola_hand: {
        id: "mandorola_hand",
        name: "曼德罗拉的手",
        type: "limb",
        rarity: MANDOROLA_QUALITY,
        score: 68,
        desc: "曼德罗拉的手。手指细长，掌心有淡淡的薄茧，指甲剪得很短。这只手握住匕首时从不犹豫。断面处腕骨短促，血顺着指缝淌成几道细线。"
    },

    mandorola_foot: {
        id: "mandorola_foot",
        name: "曼德罗拉的脚",
        type: "limb",
        rarity: MANDOROLA_QUALITY,
        score: 68,
        desc: "曼德罗拉的脚，36码。脚型窄小，脚背微微拱起，脚底是在地道湿泥里磨出的薄茧。脚趾蜷着，断踝处的血已经发黑，凝在趾缝之间。"
    },

    mandorola_breast: {
        id: "mandorola_breast",
        name: "曼德罗拉的乳房",
        type: "limb",
        rarity: MANDOROLA_QUALITY,
        score: 68,
        desc: "曼德罗拉的乳房，A罩杯。小而紧实，像尚未完全长开的少女。皮肤苍白，乳晕是浅褐色，断面露出淡黄的脂肪与暗红的肌理。"
    }

});

// 生成曼德罗拉的尸体（可互动、可搜刮、可肢解、可拾取）
function generateMandorolaCorpse() {
    const uid = `corpse_mandorola_${Date.now()}`;

    const limbTemplates = [
        { id: 'mandorola_head', name: '头', count: 1 },
        { id: 'mandorola_torso', name: '躯干', count: 1 },
        { id: 'mandorola_leg', name: '腿', count: 2 },
        { id: 'mandorola_arm', name: '手臂', count: 2 },
        { id: 'mandorola_hand', name: '手', count: 2 },
        { id: 'mandorola_foot', name: '脚', count: 2 },
        { id: 'mandorola_breast', name: '乳房', count: 2 }
    ];

    const clone = (o) => JSON.parse(JSON.stringify(o));
    const generatedLimbs = {
        mandorola_head: [clone(ITEM_TEMPLATES['mandorola_head'])],
        mandorola_torso: [clone(ITEM_TEMPLATES['mandorola_torso'])],
        mandorola_leg: [clone(ITEM_TEMPLATES['mandorola_leg']), clone(ITEM_TEMPLATES['mandorola_leg'])],
        mandorola_arm: [clone(ITEM_TEMPLATES['mandorola_arm']), clone(ITEM_TEMPLATES['mandorola_arm'])],
        mandorola_hand: [clone(ITEM_TEMPLATES['mandorola_hand']), clone(ITEM_TEMPLATES['mandorola_hand'])],
        mandorola_foot: [clone(ITEM_TEMPLATES['mandorola_foot']), clone(ITEM_TEMPLATES['mandorola_foot'])],
        mandorola_breast: [clone(ITEM_TEMPLATES['mandorola_breast']), clone(ITEM_TEMPLATES['mandorola_breast'])]
    };

    const corpse = {
        id: uid,
        name: "曼德罗拉的尸体",
        type: "limb",
        desc: "一具少女的尸体。她倒在自己最熟悉的地道里，金色瞳孔已经没了光。黑发铺在湿冷的泥地上，像被谁随手泼开的一捧夜。",
        usable: true,
        customAction: true,
        dismemberable: true,
        loot: ["skull_key"],
        limbTemplates: limbTemplates,
        generatedLimbs: generatedLimbs,
        corpseStory: [
            "你蹲下来看曼德罗拉的尸体。",
            "她比活着的时候更安静，那张总是绷着的、随时准备翻脸的年轻面孔，此刻只剩下一种很淡的、近乎无辜的空白。",
            "那把曾抵住你喉咙的匕首不知滚到了哪里。地道里只剩你自己的呼吸声。"
        ]
    };
    ITEM_TEMPLATES[uid] = corpse;
    return corpse;
}