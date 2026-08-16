// ============================================================
//  items/items_mara.js - 玛拉（昏倒的女人）的肢体与尸体
//  品质统一为绿色（优良），脚码37，乳房B罩杯
//  所有成对肢体（腿/手臂/手/脚/乳房）共用同一模板，保证品质与大小一致
// ============================================================

const MARA_QUALITY = 'good';   // 绿色·优良
const MARA_FOOT_SIZE = '37码';
const MARA_CUP = 'B罩杯';

Object.assign(ITEM_TEMPLATES, {

    mara_head: {
        id: "mara_head",
        name: "玛拉的头",
        type: "limb",
        rarity: MARA_QUALITY,
        score: 50,
        desc: "玛拉的头颅。年轻女人的脸因为失血与受惊而显得苍白，额角凝固着一小片暗红的血。她的眼睛没有完全合上，微弱的光映在涣散的瞳孔里，像一蓬将熄的灰。深色的长发散乱地沾着泥与汗，断面处露出整齐的颈椎横截面，血已经凉透了。"
    },

    mara_torso: {
        id: "mara_torso",
        name: "玛拉的躯干",
        type: "limb",
        rarity: MARA_QUALITY,
        score: 50,
        desc: "玛拉的躯干。瘦削，肋骨在皮肤下隐约可见，一看便知长期挨饿。她生前拼命保护的那个部位——腰腹——此刻没有任何遮掩，肚脐下方的小腹随着死亡而微微凹陷。断口处血已不再流，只留下一圈暗红。"
    },

    mara_leg: {
        id: "mara_leg",
        name: "玛拉的腿",
        type: "limb",
        rarity: MARA_QUALITY,
        score: 50,
        desc: "玛拉的腿。瘦而直，膝盖以下的皮肤因为常年奔走而带着些微擦伤的旧痕。她的腿不算长，却有一种贫苦人家磨出来的紧实。断面露出淡红的肌肉束与白生生的腿骨，血顺着脚踝一直流到脚背。"
    },

    mara_arm: {
        id: "mara_arm",
        name: "玛拉的手臂",
        type: "limb",
        rarity: MARA_QUALITY,
        score: 50,
        desc: "玛拉的手臂。细瘦，小臂上覆着一层极淡的汗毛，手腕处有绳索勒过的旧印。这只手臂曾紧紧护着那个昏倒的人，直到力竭。断面露出腕骨与紧缩的筋膜，指尖还蜷着一点没松开的泥。"
    },

    mara_hand: {
        id: "mara_hand",
        name: "玛拉的手",
        type: "limb",
        rarity: MARA_QUALITY,
        score: 50,
        desc: "玛拉的手。指节细长，指甲里嵌满灰黑的泥。她的手并不精致，却干净地并拢着，仿佛仍保持着临死前想要抓住什么的姿势。断面处腕骨短促，血染红了掌心那几道粗糙的纹路。"
    },

    mara_foot: {
        id: "mara_foot",
        name: "玛拉的脚",
        type: "limb",
        rarity: MARA_QUALITY,
        score: 50,
        desc: "玛拉的脚，37码。脚型小巧，脚背微微拱起，脚趾因为寒冷而蜷缩。脚底有走街串巷磨出的薄茧，还担着些泥屑。断面露出脚踝骨与淡粉的肌腱，血已干涸，凝在趾缝之间。"
    },

    mara_breast: {
        id: "mara_breast",
        name: "玛拉的乳房",
        type: "limb",
        rarity: MARA_QUALITY,
        score: 50,
        desc: "玛拉的乳房，B罩杯。不算丰满，却有着年轻女人柔和的弧度。乳晕是浅浅的褐色，乳头因失血而显得蜡白。断面露出淡黄的脂肪层与暗红的胸肌，血顺着乳下那道弧线缓缓流下。"
    }

});

// 生成玛拉的尸体（可互动、可搜刮、可肢解、可拾取）
function generateMaraCorpse() {
    const uid = `corpse_fainted_woman_${Date.now()}`;
    const corpse = {
        id: uid,
        name: "玛拉的尸体",
        type: "limb",
        desc: "一具年轻女人的尸体，脸色苍白，额头有一道已经凝固的血口。她躺在被血浸透的脏毯子旁，身下漫开的血已经和泥地黏在了一起。",
        usable: true,
        customAction: true,
        dismemberable: true,
        loot: ["bread"],
        corpseStory: [
            "你蹲下来看玛拉的尸体。她比先前在巷子里时更安静了，脸上那点惊恐也散了，只剩一片没有血色的白。",
            "她的一只手还朝科林倒下的方向伸着，像是临死前还想抓住什么。",
            "你知道，这个贫民窟里，这样的尸体明天就会被人抬走，或者根本不会被发现。"
        ]
    };
    ITEM_TEMPLATES[uid] = corpse;
    return corpse;
}

// 生成科林的尸体（仅可拾取，不可使用/互动）
function generateColinCorpse() {
    const uid = `corpse_angry_man_${Date.now()}`;
    const corpse = {
        id: uid,
        name: "科林的尸体",
        type: "limb",
        desc: "一具年轻男人的尸体，胸口被军刀捅穿，血从伤口淅沥地淌下，把身前的泥地浸成一片黑红。他至死都睁着眼睛。",
        usable: false,
        customAction: false
    };
    ITEM_TEMPLATES[uid] = corpse;
    return corpse;
}
