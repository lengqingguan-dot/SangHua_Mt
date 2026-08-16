// ============================================================
//  items/items_char_huasha.js - 华沙（驿站老板）的肢体与尸体
//  品质统一为绿色（优良），脚码37，乳房B罩杯
//  所有成对肢体（腿/手臂/手/脚/乳房）共用同一模板
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
        desc: "华沙的头颅。她生前的眉眼并不十分出挑，却有一种长年迎来送往养出的精明与清朗。如今那点生气散尽了，鬓发散乱地贴着灰败的脸，嘴角像是还含着一句没来得及出口的哀求。"
    },

    huasha_torso: {
        id: "huasha_torso",
        name: "华沙的躯干",
        type: "limb",
        rarity: HUASHA_QUALITY,
        score: 75,
        desc: "华沙的躯干。腰身细韧，是常年劳碌奔波的人才会有的紧实。皮肤因为久囚地牢而显得苍白，断口处的血已经冷透，沿着肋骨的轮廓凝成一道暗红。"
    },

    huasha_leg: {
        id: "huasha_leg",
        name: "华沙的腿",
        type: "limb",
        rarity: HUASHA_QUALITY,
        score: 75,
        desc: "华沙的腿。笔直而修长，小腿的线条利落。她的腿上没有太多赘肉，都是靠两条腿东奔西走磨出来的。断面露出淡红的肌理与白净的腿骨。"
    },

    huasha_arm: {
        id: "huasha_arm",
        name: "华沙的手臂",
        type: "limb",
        rarity: HUASHA_QUALITY,
        score: 75,
        desc: "华沙的手臂。小臂匀称，手腕处有一圈被镣铐勒出的旧印。这只手臂曾稳稳地接过无数旅人的路引与银钱，此刻却软软地垂着，指尖还沾着地牢里的泥。"
    },

    huasha_hand: {
        id: "huasha_hand",
        name: "华沙的手",
        type: "limb",
        rarity: HUASHA_QUALITY,
        score: 75,
        desc: "华沙的手。指节分明，指腹和虎口处有常年执笔、握马鞭磨出的薄茧。她的手总是利落地清点票据、指认方向，此时却只是半张着，像再也握不住什么。"
    },

    huasha_foot: {
        id: "huasha_foot",
        name: "华沙的脚",
        type: "limb",
        rarity: HUASHA_QUALITY,
        score: 75,
        desc: "华沙的脚，37码。脚型清瘦，脚背因久不沾地面而显得苍白。脚底留着几道淡褐的旧痕，脚趾在死后微微并拢，像还在惦着某条没走完的路。"
    },

    huasha_breast: {
        id: "huasha_breast",
        name: "华沙的乳房",
        type: "limb",
        rarity: HUASHA_QUALITY,
        score: 75,
        desc: "华沙的乳房，B罩杯。不算丰硕，却有着成年女性柔和的弧度。乳肉在久囚的苍白里透出一点青，乳尖无精打采地垂着，断面上能看见浅黄的脂肪层。"
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
            "你想起她说过的那些话——她想离开这里，想回驿站去。可终究，她没能走出这地牢。"
        ]
    };
    ITEM_TEMPLATES[uid] = corpse;
    return corpse;
}