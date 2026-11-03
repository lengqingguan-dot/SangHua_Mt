// ============================================================
//  items/items_mara.js - 玛拉（昏倒的女人）的肢体与尸体
//  品质与评分由 items_character_visuals.js 之外的固定设定给出：绿色·优良，评分50。
//  脚码37，乳房B罩杯；成对肢体共用同一模板，保证品质与大小一致。
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
        desc: "一颗年轻女人的头颅，属于玛拉。额角凝着一小片暗红的血，深色长发散乱地沾着泥与汗，几缕贴在颊边。眼睛没有完全合上，涣散的瞳孔里还映着一点微光；脸瘦，颧骨略突，唇色发白，微微张着。皮肤粗糙，指腹蹭过去发涩，颊侧按下去只剩下薄薄一层肉，很快就能摸到骨。脖颈断面平齐，血已经凉透，断面里嵌着细小的泥粒。"
    },

    mara_torso: {
        id: "mara_torso",
        name: "玛拉的躯干",
        type: "limb",
        rarity: MARA_QUALITY,
        score: 50,
        desc: "一截瘦削的躯干，属于玛拉。肋骨在皮肤下隐约可见，肩背窄，腰腹凹进去，是长期挨饿的样子；皮肤粗糙发暗，摸着凉，按下去没有多少肉，只隔着一层皮就能摸到骨。臀肉瘪，几乎托不满一掌，捏起来松；股间是杂乱的深色毛发，阴唇干瘪，颜色深，触上去发涩。断口在腰侧，血早已不流，只留下暗红的一圈。"
    },

    mara_leg: {
        id: "mara_leg",
        name: "玛拉的腿",
        type: "limb",
        rarity: MARA_QUALITY,
        score: 50,
        desc: "一条瘦而直的腿，属于玛拉。膝盖以下的皮肤有几处擦伤的旧痕，小腿细，膝头突出；皮肤粗糙，摸着凉而干，指压下去能直接摸到骨面。腿不算长，线条却紧，是常年奔走磨出来的。断面在腿根，股骨细，粉色的肌肉很薄，血顺着脚踝一直流到脚背，早已干成暗褐。"
    },

    mara_arm: {
        id: "mara_arm",
        name: "玛拉的手臂",
        type: "limb",
        rarity: MARA_QUALITY,
        score: 50,
        desc: "一条细瘦的手臂，属于玛拉。小臂覆着一层极淡的汗毛，手腕处有绳索勒过的旧印，颜色比周围深；皮肤粗糙发凉，捏一下能摸到骨，皮肉薄得几乎提不起来。断口在肩下，腕骨短促，筋缩成一小束，指尖还蜷着一点没松开的泥。"
    },

    mara_hand: {
        id: "mara_hand",
        name: "玛拉的手",
        type: "limb",
        rarity: MARA_QUALITY,
        score: 50,
        desc: "一只不精致的手，属于玛拉。指节细长，指甲缝里嵌满灰黑的泥，掌心有几道粗深的纹；皮肤干，摸着涩，指腹上有一层走街串巷磨出的硬皮。手指并拢着，还保持着临死前想抓住什么的姿势，掰开时会有一点僵硬的阻力。断腕处骨节短促，血染红了掌心那几道纹路。"
    },

    mara_foot: {
        id: "mara_foot",
        name: "玛拉的脚",
        type: "limb",
        rarity: MARA_QUALITY,
        score: 50,
        desc: "一只小巧的脚，属于玛拉，37码。脚型窄，脚背微微拱起，脚趾因为寒冷而蜷着；脚底有走街串巷磨出的薄茧，还沾着泥屑。皮肤干而凉，握在手里轻得几乎没有分量。断踝处骨与肌腱清楚，血已干涸，凝在趾缝之间。鞋早就没有了，脚上只缠着几圈磨烂的布。"
    },

    mara_breast: {
        id: "mara_breast",
        name: "玛拉的乳房",
        type: "limb",
        rarity: MARA_QUALITY,
        score: 50,
        desc: "一只不算丰满的乳房，属于玛拉，B罩杯。大小刚够拢进一只手里，不轻不重；乳肉软，指压下去陷得慢，回弹也慢，皮肤粗糙发暗，乳晕是浅浅的褐色，乳头因失血而蜡白。粗布的衣料在乳根压出一道红痕。断面露出淡黄的脂肪与暗红的胸肌，血顺着乳下那道弧线缓缓流下。"
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
        limbTemplates: [
            { id: 'mara_head', name: '头', count: 1 },
            { id: 'mara_torso', name: '躯干', count: 1 },
            { id: 'mara_leg', name: '腿', count: 2 },
            { id: 'mara_arm', name: '手臂', count: 2 },
            { id: 'mara_hand', name: '手', count: 2 },
            { id: 'mara_foot', name: '脚', count: 2 },
            { id: 'mara_breast', name: '乳房', count: 2 }
        ],
        corpseStory: [
            "你蹲下来看玛拉的尸体。她比先前在巷子里时更安静了，脸上那点惊恐也散了，只剩一片没有血色的白。",
            "她的一只手还朝科林倒下的方向伸着，像是临死前还想抓住什么。",
            "你把她摊平，瘦得几乎没有重量，皮肤凉而干，肋骨在掌心下清楚得让人不太想再往下摸。",
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
