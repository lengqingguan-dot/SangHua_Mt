// ============================================================
//  items/items_char_huasha.js - 华沙（驿站老板）的肢体与尸体
//  品质与评分由 items_character_visuals.js 统一赋值，这里只保留文案与尺寸设定。
//  脚码37，乳房B罩杯；所有成对肢体（腿/手臂/手/脚/乳房）共用同一模板。
// ============================================================

const HUASHA_QUALITY = 'good';
const HUASHA_FOOT_SIZE = '37码';
const HUASHA_CUP = 'B罩杯';

Object.assign(ITEM_TEMPLATES, {

    huasha_head: {
        id: "huasha_head",
        name: "华沙的头",
        type: "limb",
        rarity: HUASHA_QUALITY,
        score: 75,
        desc: "一颗眉眼清秀的头颅，属于驿站老板华沙。栗色的麻花辫散开了一半，辫梢还系着褪色的布条；浅淡的雀斑从鼻梁散到颊侧，眼睛半睁，棕色的瞳孔里已经没了光。脸不算艳，胜在骨相端正，颧骨到下颌的线条干净，唇形饱满，颜色偏淡。皮肤是常年在外跑出来的浅褐色，摸上去温热而略粗，脸颊按下去还有一点软。脖颈断面平齐，血凝成暗红，混着尘土与马料的气味。"
    },

    huasha_torso: {
        id: "huasha_torso",
        name: "华沙的躯干",
        type: "limb",
        rarity: HUASHA_QUALITY,
        score: 75,
        desc: "一截腰身细韧的躯干，属于驿站老板华沙。肩背的肌肉薄而结实，是常年搬行李、拉缰绳练出来的；腰腹没有赘肉，皮肤偏深，被日头晒出细小的斑。臀肉不厚，形状却圆，托在掌里紧实，指压下去回弹得干脆；臀沟里沾着一点干了的泥。股间是修剪得随意的深色毛发，阴唇厚而合拢，颜色偏深，触上去干爽温热。断口在腰侧，肌肉纤维一丝丝分得清，血凝在断面上，颜色发暗。"
    },

    huasha_leg: {
        id: "huasha_leg",
        name: "华沙的腿",
        type: "limb",
        rarity: HUASHA_QUALITY,
        score: 75,
        desc: "一条结实耐用的腿，属于驿站老板华沙。大腿和小腿的肌肉都被长年赶路磨得紧致，膝盖外侧有一块旧擦痕，脚踝附近留着绑带勒出的浅印。皮肤偏深，摸上去干爽，掌心按下去能觉出肌肉的轮廓，回弹很快；腿内侧的皮比外侧细一些。断面在腿根，股骨粗，粉色的肌肉层厚，血顺着腿根往下淌，在皮肤上留下几道暗痕。"
    },

    huasha_arm: {
        id: "huasha_arm",
        name: "华沙的手臂",
        type: "limb",
        rarity: HUASHA_QUALITY,
        score: 75,
        desc: "一条匀称有力的手臂，属于驿站老板华沙。小臂的肌肉薄而实，是常年执笔记账、牵马搬箱养出来的；手腕内侧有一圈早已褪色的镣铐印，比周围的皮肤浅。皮肤是浅褐色，掌心一侧略粗，摸着温热。指压下去会陷出浅窝，松手很快平复。断面在肩下，臂骨与肌肉切得整齐，血凝在断口上，混着一点皂角的气味。"
    },

    huasha_hand: {
        id: "huasha_hand",
        name: "华沙的手",
        type: "limb",
        rarity: HUASHA_QUALITY,
        score: 75,
        desc: "一只利落的手，属于驿站老板华沙。手指不细，指节分明，掌形偏宽；虎口与指根压着一层薄茧，是握缰绳和笔磨出来的，掌心还有几道被行李绳勒出的旧痕。皮肤浅褐，摸着干爽有力，掰开手指时能觉出筋的韧。断腕处骨节清楚，血凝在断面里，指甲缝里还嵌着一点洗不掉的泥。"
    },

    huasha_foot: {
        id: "huasha_foot",
        name: "华沙的脚",
        type: "limb",
        rarity: HUASHA_QUALITY,
        score: 75,
        desc: "一只清瘦匀称的脚，属于驿站老板华沙，37码。脚背的弧线自然，脚趾排得整齐，脚底有一层走出来的薄茧，脚跟处更厚一些；脚踝外侧留着靴带压出的浅印。皮肤浅褐，摸着温热，握久了会出一点薄汗。断踝处骨与肌腱清楚，血已经干成暗褐。靴子丢在旁边，是双走了很多路的旧靴，鞋底磨得只剩薄薄一层。"
    },

    huasha_breast: {
        id: "huasha_breast",
        name: "华沙的乳房",
        type: "limb",
        rarity: HUASHA_QUALITY,
        score: 75,
        desc: "一只轮廓柔和的乳房，属于驿站老板华沙，B罩杯。不大不小，合手一收便整个拢住，轻飘飘的；乳肉软而有弹性，指压下去陷出浅窝，慢慢鼓回。皮肤因为牢里的日子显得有些苍白，乳晕是浅褐色，乳头不大。工装的粗布在乳根压出一道浅痕。断面露出乳白的脂肪与粉色的腺体，血凝在边缘。"
    }

});

// 生成华沙的尸体（可互动、可搜刮、可肢解、可拾取）
function generateHuashaCorpse() {
    const uid = `corpse_huasha_${Date.now()}`;

    const limbTemplates = [
        { id: 'huasha_head', name: '头', count: 1 },
        { id: 'huasha_torso', name: '躯干', count: 1 },
        { id: 'huasha_leg', name: '腿', count: 2 },
        { id: 'huasha_arm', name: '手臂', count: 2 },
        { id: 'huasha_hand', name: '手', count: 2 },
        { id: 'huasha_foot', name: '脚', count: 2 },
        { id: 'huasha_breast', name: '乳房', count: 2 }
    ];

    const clone = (o) => JSON.parse(JSON.stringify(o));
    const generatedLimbs = {
        huasha_head: [clone(ITEM_TEMPLATES['huasha_head'])],
        huasha_torso: [clone(ITEM_TEMPLATES['huasha_torso'])],
        huasha_leg: [clone(ITEM_TEMPLATES['huasha_leg']), clone(ITEM_TEMPLATES['huasha_leg'])],
        huasha_arm: [clone(ITEM_TEMPLATES['huasha_arm']), clone(ITEM_TEMPLATES['huasha_arm'])],
        huasha_hand: [clone(ITEM_TEMPLATES['huasha_hand']), clone(ITEM_TEMPLATES['huasha_hand'])],
        huasha_foot: [clone(ITEM_TEMPLATES['huasha_foot']), clone(ITEM_TEMPLATES['huasha_foot'])],
        huasha_breast: [clone(ITEM_TEMPLATES['huasha_breast']), clone(ITEM_TEMPLATES['huasha_breast'])]
    };

    const corpse = {
        id: uid,
        name: "华沙的尸体",
        type: "limb",
        desc: "一具鬓发散乱的女子尸体，正是驿站老板华沙。她蜷在潮湿的牢道里，眼睛半睁着，到死都没能等到那个愿意带她离开的人。",
        usable: true,
        customAction: true,
        dismemberable: true,
        loot: ["bread"],
        limbTemplates: limbTemplates,
        generatedLimbs: generatedLimbs,
        corpseStory: [
            "你蹲下来看华沙的尸体。她的脸贴在冰冷的泥地上，散乱的长发掩住了半边眉眼。",
            "她生前总有力气高声招呼往来的旅人，此刻却安静得像一截被遗忘在角落里的旧木。",
            "你把她翻过来，手腕内侧那圈褪色的镣铐印在灯下很清楚。她的身子不算软，也不硬，皮肤还留着一点牢里闷出来的温。",
            "你想起她说过的那些话——她想离开这里，想回驿站去。可终究，她没能走出这地牢。"
        ]
    };
    ITEM_TEMPLATES[uid] = corpse;
    return corpse;
}
