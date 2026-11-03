// ============================================================
//  items/items_char_mandorola.js - 曼德罗拉的肢体与尸体
//  品质与评分由 items_character_visuals.js 统一赋值；这里只保留文案与尺寸设定。
//  脚码36，乳房A罩杯；成对肢体共用同一模板。
// ============================================================

const MANDOROLA_QUALITY = 'good';

Object.assign(ITEM_TEMPLATES, {

    mandorola_head: {
        id: "mandorola_head",
        name: "曼德罗拉的头",
        type: "limb",
        rarity: MANDOROLA_QUALITY,
        score: 68,
        desc: "一颗轮廓锐利的头颅，属于曼德罗拉。极长的黑发从断颈散开，铺在手上像一捧凉水；皮肤苍白得几乎透明，金色瞳孔半睁着，眼白上还留着一点血丝。五官冷峻，眉眼距近，鼻梁挺直，唇薄而颜色淡，微微抿着。皮肤摸着凉，指腹压下去很软，颧骨下的颊肉薄得能捏到骨。脖颈断面整齐，血凝成暗红，带着地道里的潮气与铁锈味。"
    },

    mandorola_torso: {
        id: "mandorola_torso",
        name: "曼德罗拉的躯干",
        type: "limb",
        rarity: MANDOROLA_QUALITY,
        score: 68,
        desc: "一截纤细紧实的躯干，属于曼德罗拉。腰腹和背部覆着一层薄薄的肌肉，是潜行与短促发力磨出来的；肋下的线条清楚，皮肤苍白，摸上去凉而滑。臀肉小而圆，托在掌里刚好一握，指压下去回弹得快；臀沟里沾着泥。股间是稀疏的深色毛发，阴唇薄而合拢，颜色极浅，触上去凉而干燥。断口在腰侧，肌肉层薄，脂肪少，血凝成暗色的边。"
    },

    mandorola_leg: {
        id: "mandorola_leg",
        name: "曼德罗拉的腿",
        type: "limb",
        rarity: MANDOROLA_QUALITY,
        score: 68,
        desc: "一条细长有力的腿，属于曼德罗拉。大腿与小腿的肌肉都收得利落，膝弯内侧有一道极浅的旧刀痕；皮肤苍白，摸上去凉，按下去能觉出肌肉的形状，回弹很快。脚踝细，踝骨突出。断面在腿根，股骨细而直，粉色的肌肉束分得清楚，血顺着腿根流下，在苍白的皮肤上格外刺眼。"
    },

    mandorola_arm: {
        id: "mandorola_arm",
        name: "曼德罗拉的手臂",
        type: "limb",
        rarity: MANDOROLA_QUALITY,
        score: 68,
        desc: "一条纤细却有力的手臂，属于曼德罗拉。肩、肘、腕的比例精准，小臂的肌肉薄而清楚，是挥刀练出来的；手肘外侧有一层浅浅的硬皮，腕内侧留着绑带的压痕。皮肤苍白发凉，摸上去滑，指压会陷出浅窝。断面在肩下，臂骨细，肌肉层薄，血凝在断口，带着一点皮革与汗的味道。"
    },

    mandorola_hand: {
        id: "mandorola_hand",
        name: "曼德罗拉的手",
        type: "limb",
        rarity: MANDOROLA_QUALITY,
        score: 68,
        desc: "一只精巧的手，属于曼德罗拉。手指细长，掌形窄小，指甲剪得极短，甲缝干净；掌心只有一层不影响触感的持刀薄茧，落在虎口和食指根。皮肤苍白，摸上去凉而干爽，掰开手指时关节会发出很轻的响。断腕处骨节小巧，筋缩成一小束，血凝在断面里，指侧还有一道极细的旧割伤。"
    },

    mandorola_foot: {
        id: "mandorola_foot",
        name: "曼德罗拉的脚",
        type: "limb",
        rarity: MANDOROLA_QUALITY,
        score: 68,
        desc: "一只窄小的脚，属于曼德罗拉，36码。足弓挑得高，脚趾整齐，抓地的姿势还留着；脚底只有长期潜行磨出的均匀薄茧，脚踝细得能一把握住。皮肤苍白，摸着凉，握久了会慢慢回暖。断踝处骨节小，肌腱清楚。软底的黑靴丢在一旁，鞋底薄得几乎没有纹路，鞋口还系着一根细绳。"
    },

    mandorola_breast: {
        id: "mandorola_breast",
        name: "曼德罗拉的乳房",
        type: "limb",
        rarity: MANDOROLA_QUALITY,
        score: 68,
        desc: "一只小巧紧实的乳房，属于曼德罗拉，A罩杯。小小一团，单手拢起来还空出半掌；乳肉薄而结实，指压下去立刻回弹，皮肤苍白，薄得能看见底下的青色血管。乳晕小而颜色极浅，乳头因为寒冷而硬起。黑衣的接缝在乳根留下一道浅印。断面露出薄薄的脂肪与粉色腺体，血凝在边缘，带着一点铁锈味。"
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
            "你把她翻过来，黑衣底下瘦得几乎没有重量，肋骨的形状隔着皮都能摸到。腕上的绑带还系着，指侧那道旧割伤在灯下发白。",
            "那把曾抵住你喉咙的匕首不知滚到了哪里。地道里只剩你自己的呼吸声。"
        ]
    };
    ITEM_TEMPLATES[uid] = corpse;
    return corpse;
}
