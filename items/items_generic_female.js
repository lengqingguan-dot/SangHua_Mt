// ============================================================
//  items/items_generic_female.js - 普通女贫民随机肢体系统
//  品质随机（白40/绿30/蓝15/紫10/橙5）
//  脚码随机（36/37/38各25%、35 15%、39 5%、34/40各2.5%）
//  罩杯随机（A/B各30%、C25%、D10%、E5%）
//  成对肢体（腿/手臂/手/脚/乳房）同品质、同尺寸
// ============================================================

// ---------- 概率分布 ----------
const GENERIC_FOOT_SIZES = [
    ['36码', 25], ['37码', 25], ['38码', 25],
    ['35码', 15], ['39码', 5], ['34码', 2.5], ['40码', 2.5]
];

const GENERIC_CUPS = [
    ['A罩杯', 30], ['B罩杯', 30], ['C罩杯', 25], ['D罩杯', 10], ['E罩杯', 5]
];

function _weightedRoll(table) {
    const roll = Math.random() * 100;
    let acc = 0;
    for (const [value, weight] of table) {
        acc += weight;
        if (roll < acc) return value;
    }
    return table[table.length - 1][0];
}

function rollGenericScore() { return Math.floor(Math.random() * 101); }
function rollGenericFootSize() { return _weightedRoll(GENERIC_FOOT_SIZES); }
function rollGenericCup() { return _weightedRoll(GENERIC_CUPS); }

// ---------- 描述数据库（部位 × 品质） ----------
// 品质 key: normal/good/rare/epic/legendary
// foot 用 {size} 占位，breast 用 {cup} 占位
const GENERIC_FEMALE_DESCRIPTIONS = {
    head: {
        normal: ["一颗普普通通的女人头颅。皮肤因长期贫苦而显得暗沉，头发枯黄地贴在额角，嘴微微张着，像还有什么话没说完。"],
        good: ["一颗年轻女人的头颅。五官清秀，只是双颊瘦得有些凹陷。脖颈断口处血已经干了，黏成一圈暗红的边。"],
        rare: ["一颗仍带着几分温婉的头颅。眉眼间依稀可见生前的柔顺，只是嘴唇苍白，下颌被切得整齐，像一件被精心摆放过的东西。"],
        epic: ["一颗让人多看几眼的女人头颅。她的面容安静，带着一种贫贱里少见的干净，哪怕闭着眼，也有几分让人想据为己有的姿色。"],
        legendary: ["一颗美得不像贫民窟应有的头颅。肤白如纸，轮廓柔和，长长的睫毛在脸上投下细影。只是断口处翻卷的皮肉提醒你——它已经死了，而且是被齐颈切下的。"],
        mythic: ["一颗几近神迹的女人头颅。它像一件不该存在于凡间的造物，肤若凝脂、轮廓完美得不真实，连断面都仿佛被某种力量封存，没有一滴血渗出。"]
    },
    torso: {
        normal: ["一截瘦削的躯干。肋骨的轮廓凸起来，皮肤粗糙，肚腹因饥饿而深深凹陷。断面上血已凝成暗块。"],
        good: ["一截年轻女人的躯干。腰身还算纤细，皮肤虽无光泽却也算光洁。胸腹之间有一道浅浅的旧疤，不知是什么时候留下的。"],
        rare: ["一截线条柔和的躯干。锁骨下凹得恰到好处，腰胯的曲线若隐若现。它已经不再流血，几滴血珠还挂在下腹。"],
        epic: ["一截令人挪不开眼的女人躯干。她的身体带着贫苦人家少有的匀称，肌肤细腻得几乎不像这个年纪，断口处甚至还有一丝未散的体温。"],
        legendary: ["一截犹如人偶般完美的躯干。肩颈、腰线、小腹的弧度都恰到好处，皮肤薄而透，像一块被死亡封存起来的白色绸缎。"],
        mythic: ["一截不属于尘世的女人躯干。它的每一寸曲线都像被神明亲手校正过，皮肤由内而外透着一层温润的光，死亡也没能夺走它分毫。"]
    },
    leg: {
        normal: ["一条瘦得没什么肉的女人腿。膝盖突出，小腿上有些蚊虫咬过的旧痕，脚踝处青筋隐约。"],
        good: ["一条还算笔直的女人腿。大腿有些肉感，小腿线条却纤细。它被从大腿根整齐地切断，血顺着脚背流下。"],
        rare: ["一条线条动人的女人腿。从大腿到小腿的弧线自然流畅，膝盖圆润，皮肤紧致得没有一丝松弛。"],
        epic: ["一条足以入画的女人腿。皮肤洁白，大腿与小腿的比例漂亮得像是被精心雕凿过，连断口处的肌肉纹理都透着异样的美感。"],
        legendary: ["一条美得惊心的女人腿。它修长、光洁、骨肉匀停，仿佛不属于这肮脏的贫民窟，而是某个贵族闺房里才该有的东西。"],
        mythic: ["一条只该出现在神殿长卷里的女人腿。它纤长、无瑕、骨肉均匀到诡异地完美，仿佛活人时都未必能有这样的造物。"]
    },
    arm: {
        normal: ["一条细瘦的女人手臂。小臂上沾着灰，手肘处皮肤皲裂，像常年干粗活的人。"],
        good: ["一条还算匀称的女人手臂。皮肤因日晒而偏深，但线条柔和，指尖有薄薄的茧。"],
        rare: ["一条线条柔美的女人手臂。手腕很细，指节分明，断口处露出淡粉的肌腱，像半截被折下的花枝。"],
        epic: ["一条让人想握在手里的女人手臂。皮肤细腻，小臂的弧线漂亮，那几根修长的手指即便死了也仍保持着柔顺的模样。"],
        legendary: ["一条近乎艺术品的女人手臂。从肩到指尖的比例无懈可击，皮肤白得病态，指节匀净，像一尊被斩下来的象牙雕。"],
        mythic: ["一条不该属于凡人的女人手臂。它光洁得没有一丝纹理，从肩头到指尖的弧线如流水一般，安静得仿佛它只是睡着了。"]
    },
    hand: {
        normal: ["一只粗糙的女人手。指节有些肿，指甲短而缺损，掌心有干活的硬茧。"],
        good: ["一只还算干净的女人手。手指细长，指甲剪得整齐，掌心因沾血而泛着淡红。"],
        rare: ["一只生得好看的女人手。指若削葱，虽然指甲缝里还留着泥，却藏不住那副天生的纤巧。"],
        epic: ["一只让人忍不住端详的女人手。十指纤细白净，像从来不曾干过重活，断腕处还凝着一颗将坠未坠的血珠。"],
        legendary: ["一只足以令贵族夫人嫉妒的女人手。它白净、纤长、柔若无骨，仿佛死前的最后一刻还在做着什么优雅的手势。"],
        mythic: ["一只可被供奉起来顶礼膜拜的女人手。它纤细、白净、每一寸都恰到好处，仿佛轻轻一握就能触到某种不属于凡尘的柔光。"]
    },
    foot: {
        normal: ["一只{size}的女人脚。脚底生着厚茧，趾缝里夹着泥，像一双走了太多路、从没歇过的脚。"],
        good: ["一只{size}的女人脚。脚型小巧，脚背有些旧擦痕，脚趾因寒冷而微微蜷起。"],
        rare: ["一只{size}的女人脚。脚背的弧线柔和，脚趾圆润整齐，断踝处血已干成深红。"],
        epic: ["一只{size}的女人脚。白净得几乎透光，指肚饱满，像某种精巧的物件，让人不忍心去想它是被活生生切下来的。"],
        legendary: ["一只{size}的女人脚。它小得过分，皮肤细嫩没有一丝老茧，脚趾如同新剥的莲子，连尸体散发的甜腥都像某种残香。"],
        mythic: ["一只{size}的女人脚。它光洁得没有半分瑕疵，脚形玲珑剔透得不像血肉，倒像一块被精心打磨出来的玉石。"]
    },
    breast: {
        normal: ["一只{cup}的女人乳房。不大，皮肤粗糙，乳晕颜色发暗，像被贫苦一点点消磨过。"],
        good: ["一只{cup}的女人乳房。形状还算饱满，皮肤光洁，乳尖因失血而显得蜡白。"],
        rare: ["一只{cup}的女人乳房。圆润而柔软，乳肉沉甸甸地垂着，断面上能看见细腻的脂肪层。"],
        epic: ["一只{cup}的女人乳房。饱满挺翘，乳晕是浅淡的褐色，那种属于年轻身体的弹性仿佛还未散去。"],
        legendary: ["一只{cup}的女人乳房。它美得让人屏息——白嫩、浑圆，乳头小巧而颜色浅淡，像从某幅淫靡油画上直接摘下来的。"],
        mythic: ["一只{cup}的女人乳房。它如同一件被供奉的神物：肤白胜雪、形状完美无瑕，连乳尖都透着某种不属于凡人的柔润光泽。"]
    }
};

const GENERIC_LIMB_NAMES = {
    head: '女贫民的头',
    torso: '女贫民的躯干',
    leg: '女贫民的腿',
    arm: '女贫民的手臂',
    hand: '女贫民的手',
    foot: '女贫民的脚',
    breast: '女贫民的乳房'
};

// 根据部位/评分/脚码/罩杯构建一个肢体模板
function buildGenericFemaleLimb(part, score, footSize, cup) {
    const quality = scoreToQuality(score);
    const pool = (GENERIC_FEMALE_DESCRIPTIONS[part] || {})[quality]
        || GENERIC_FEMALE_DESCRIPTIONS[part].normal;
    let desc = pool[Math.floor(Math.random() * pool.length)];
    if (part === 'foot') desc = desc.replace(/\{size\}/g, footSize || '未知');
    if (part === 'breast') desc = desc.replace(/\{cup\}/g, cup || '未知');

    // 名称直接附带码数/罩杯，避免同名堆叠
    let limbName = GENERIC_LIMB_NAMES[part];
    if (part === 'foot') limbName = `${limbName}（${footSize || '未知码'}）`;
    if (part === 'breast') limbName = `${limbName}（${cup || '未知罩杯'}）`;

    return {
        id: `generic_${part}_${quality}`,
        name: limbName,
        type: 'limb',
        rarity: quality,
        score: score,
        desc: desc
    };
}

function _clone(o) { return typeof structuredClone === 'function' ? structuredClone(o) : JSON.parse(JSON.stringify(o)); }

// 生成一具普通女贫民的尸体（含预掷的成对肢体）
function generateGenericFemaleCorpse(ownerName) {
    ownerName = ownerName || '女贫民';
    const uid = `corpse_peasant_female_${Date.now()}_${Math.random().toString(36).substr(2, 6)}`;

    const footSize = rollGenericFootSize();
    const cup = rollGenericCup();

    // 成对部位：先掷一次评分，再复制两份 → 保证品质/尺寸一致
    const pair = (part) => {
        const base = buildGenericFemaleLimb(part, rollGenericScore(), footSize, cup);
        return [base, _clone(base)];
    };

    const generatedLimbs = {
        head: [buildGenericFemaleLimb('head', rollGenericScore(), footSize, cup)],
        torso: [buildGenericFemaleLimb('torso', rollGenericScore(), footSize, cup)],
        leg: pair('leg'),
        arm: pair('arm'),
        hand: pair('hand'),
        foot: pair('foot'),
        breast: pair('breast')
    };

    const limbTemplates = [
        { id: 'head', name: '头', count: 1 },
        { id: 'torso', name: '躯干', count: 1 },
        { id: 'leg', name: '腿', count: 2 },
        { id: 'arm', name: '手臂', count: 2 },
        { id: 'hand', name: '手', count: 2 },
        { id: 'foot', name: '脚', count: 2 },
        { id: 'breast', name: '乳房', count: 2 }
    ];

    const corpse = {
        id: uid,
        name: ownerName + '的尸体',
        type: 'limb',
        desc: '一具瘦弱的女贫民尸体，皮肤上还留着被兵刃划开的口子。血已经流干，在身子下面洇成一片暗红。',
        usable: true,
        customAction: true,
        dismemberable: true,
        loot: ['bread'],
        corpseStory: [
            "你看着这具女贫民的尸体。她太瘦了，像一捆被抽干了的柴。",
            "若不是那场清场，她大概还会缩在自己的窝棚里，熬过这个和别的夜晚没有差别的夜晚。"
        ],
        limbTemplates: limbTemplates,
        generatedLimbs: generatedLimbs
    };

    ITEM_TEMPLATES[uid] = corpse;
    return corpse;
}

// 生成一具普通男贫民的尸体（可互动/拾取，不可肢解）
function generatePeasantMaleCorpse() {
    const uid = `corpse_peasant_male_${Date.now()}_${Math.random().toString(36).substr(2, 6)}`;
    const corpse = {
        id: uid,
        name: '男贫民的尸体',
        type: 'limb',
        desc: '一具瘦削的男贫民尸体。他倒在地上，颈侧有一道已经干涸的血口，眼睛半睁着。',
        usable: true,
        customAction: true,
        loot: ['bread'],
        corpseStory: [
            "你看着这具男贫民的尸体。他的衣服破得只剩布条，肋骨在皮肤下一根根凸出来。",
            "这样的尸体，贫民窟里明天大概又会多出几具。"
        ]
    };
    ITEM_TEMPLATES[uid] = corpse;
    return corpse;
}