// ============================================================
//  items/items_core.js - 核心物品模板 + 辅助函数
//  武器/防具/消耗品/饰品/读物/钥匙/杂物/辅料
// ============================================================

const ITEM_TEMPLATES = {
    // ========== 武器 ==========
    pickaxe: {
        id: "pickaxe",
        name: "破镐头",
        type: "weapon",
        desc: "一把生锈的镐头，勉强能当武器。",
        atk: 4,
        agi: 2,
        slot: "weapon"
    },
    rusty_sword: {
        id: "rusty_sword",
        name: "生锈的铁剑",
        type: "weapon",
        desc: "剑刃布满锈迹，但总比空手强。",
        atk: 5,
        agi: 3,
        slot: "weapon"
    },
    broken_pickaxe: {
        id: "broken_pickaxe",
        name: "折断的镐头",
        type: "misc",
        desc: "一柄早已折断的镐头，木柄腐朽，铁头锈迹斑斑，显然已被遗弃多年。"
    },
    iron_stick: {
        id: "iron_stick",
        name: "铁棍",
        type: "weapon",
        desc: "一根沉甸甸的铁棍，可以用来防身。",
        atk: 12,
        agi: 1,
        slot: "weapon"
    },
    kitchen_knife: {
        id: "kitchen_knife",
        name: "菜刀",
        type: "weapon",
        desc: "一把厚重的厨用刀具，刀身宽阔，刃口锋利。原本是用来切菜的，但在这地方...它可能有其他用途。",
        atk: 8,
        agi: 0,
        slot: "weapon"
    },
    fruit_knife: {
        id: "fruit_knife",
        name: "水果刀",
        type: "weapon",
        desc: "一把小巧的水果刀，刀身轻薄但锋利。在这穷乡僻壤，水果是奢侈品，这把刀大概是某位监工的私人物品。",
        atk: 5,
        agi: 2,
        slot: "weapon"
    },

    // ========== 防具 ==========
    leather_vest: {
        id: "leather_vest",
        name: "破皮背心",
        type: "armor",
        desc: "一件多处磨损的皮背心，提供微弱的防护。",
        def: 2,
        agi: 0,
        slot: "armor"
    },
    miners_cloth: {
        id: "miners_cloth",
        name: "矿工服",
        type: "armor",
        desc: "一件破旧的矿工服，满是补丁和汗渍。",
        def: 1,
        agi: 1,
        slot: "armor"
    },
    knight_armor: {
        id: "knight_armor",
        name: "骑士板甲",
        type: "armor",
        desc: "莉娅娜身穿的银灰色全覆式板甲，甲片上刻有王国狮鹫徽记。虽然有些地方已经凹陷变形，但整体依然坚固。这是一件品质上乘的防具。",
        def: 15,
        agi: -2,
        slot: "armor"
    },
    knight_greatsword: {
        id: "knight_greatsword",
        name: "骑士大剑",
        type: "weapon",
        desc: "莉娅娜使用的长剑，剑身宽阔而锋利，剑柄缠着皮革。这是王国骑士团的标准配剑，专为斩杀敌人而设计。",
        atk: 18,
        agi: -1,
        slot: "weapon"
    },
    lolita_dress: {
        id: "lolita_dress",
        name: "洛丽塔裙装",
        type: "armor",
        desc: "一套古典洛丽塔裙装：层层叠叠的黑色蕾丝裙摆搭配白色荷叶边，裙身点缀着精致的蝴蝶结。虽然沾染了些许血迹，但依然能看出其华贵的做工。",
        equipable: true,
        def: 1,
        slot: "body"
    },
    white_thighhighs: {
        id: "white_thighhighs",
        name: "白色厚丝袜",
        type: "armor",
        desc: "一双洁白的厚丝袜，质地柔软，能够包裹住纤细的大腿。虽然有些地方已经破损，但依然能感受到少女曾经穿着它时的纯真气息。",
        equipable: true,
        def: 0,
        agi: 1,
        slot: "legs"
    },
    black_lolita_shoes: {
        id: "black_lolita_shoes",
        name: "黑色洛丽塔皮鞋",
        type: "armor",
        desc: "一双精致的黑色小皮鞋，鞋面上绣着小小的蝴蝶结，散发着贵族少女特有的娇气与纯真。",
        equipable: true,
        def: 0,
        agi: 1,
        slot: "feet"
    },
    black_skirt: {
        id: "black_skirt",
        name: "黑色包臀裙",
        type: "armor",
        desc: "一件紧身的黑色包臀裙，裙摆短得几乎包不住臀部，完美展现穿着者的曲线。质地光滑，触感细腻。",
        equipable: true,
        def: 1,
        slot: "body"
    },
    black_lace_bra: {
        id: "black_lace_bra",
        name: "黑色蕾丝胸罩",
        type: "armor",
        desc: "一件精致的黑色蕾丝胸罩，边缘绣着细腻的花纹，散发着成熟女性特有的魅惑气息。",
        equipable: true,
        def: 0,
        slot: "body"
    },
    maid_uniform: {
        id: "maid_uniform",
        name: "女仆服",
        type: "armor",
        desc: "一套略显宽大的女仆装，黑白相间的配色，裙摆下缘沾着些许水渍和皂角的痕迹。虽然朴素，但能看出曾经的整洁。",
        equipable: true,
        def: 1,
        slot: "body"
    },

    // ========== 消耗品 ==========
    bread: {
        id: "bread",
        name: "干粮",
        type: "consumable",
        desc: "一块硬邦邦的黑面包，吃下去能恢复少许体力。",
        effect: "heal",
        value: 5
    },
    herb: {
        id: "herb",
        name: "止血草",
        type: "consumable",
        desc: "矿工们常用的草药，嚼碎敷在伤口上。",
        effect: "heal",
        value: 10
    },

    // ========== 饰品 ==========
    magic_mirror: {
        id: "magic_mirror",
        name: "魔镜",
        type: "accessory",
        desc: "一面古朴的银色魔镜，镜框上刻着复杂的魔法符文。镜面泛着淡淡的蓝光，仿佛连接着某个遥远的地方。点击传送可以瞬间移动到曾经到过的地点。",
        usable: true,
        customAction: true,
        slot: "accessory",
        atk: 0,
        def: 1
    },
    blood_gem: {
        id: "blood_gem",
        name: "血色宝石",
        type: "accessory",
        desc: "一颗散发着诡异血色光芒的宝石，仿佛蕴含着某种邪恶的力量。据说这是疯疫的源头之一，佩戴它的人会获得超凡的敏捷，但生命力会被逐渐吞噬。",
        agi: 40,
        slot: "accessory",
        curse: true,
        maxHpPercent: -0.4
    },
    knight_emblem: {
        id: "knight_emblem",
        name: "骑士徽记",
        type: "accessory",
        desc: "一枚刻有王国狮鹫图案的金属徽章，是王国骑士团成员的身份象征。佩戴它可以提升一定防御力，但也可能引起某些人的敌意。",
        def: 3,
        slot: "accessory"
    },
    magic_gem: {
        id: "magic_gem",
        name: "魔导宝石",
        type: "accessory",
        desc: "一颗散发着淡紫色光芒的神秘宝石，内部仿佛有星云在流转。蕴含着强大的魔力，能够大幅提升佩戴者的战斗力。",
        equipable: true,
        slot: "accessory",
        effect: "boost",
        atkPercent: 0.5,
        defPercent: 0.5
    },
    statue_obedient: {
        id: "statue_obedient",
        name: "雕像【顺从】",
        type: "accessory",
        desc: "一座由兰德尔家族成员的肢体拼凑而成的扭曲雕像。塞西莉亚的头颅、伊莎贝拉的躯干、艾莲娜的双腿被骑士大剑贯穿着固定在一起，散发着令人不安的气息。佩戴后可大幅提升战斗力，但它似乎在注视着你...",
        atk: 25,
        def: 10,
        agi: 5,
        slot: "accessory"
    },

    // ========== 读物 ==========
    diary1: {
        id: "diary1",
        name: "矿工日记·一",
        type: "readable",
        desc: "一本破旧的日记，封面上写着「桑华山矿场日志」。",
        content: [
            "『桑华山矿场日志』",
            "第一天：被押送到这鬼地方，监工说干满三年就放人。",
            "第三天：矿道塌方，死了两个人。没人管。",
            "第七天：听说北边有旧矿道可以通到山外……",
            "第十天：我决定今晚行动。如果我死了，希望有人能把这本日记带出去。"
        ]
    },
    miner_note: {
        id: "miner_note",
        name: "染血的字条",
        type: "readable",
        desc: "一张皱巴巴的字条，上面沾着暗红色的血迹，字迹潦草但还能辨认。",
        content: [
            "『如果有人看到这张字条...』",
            "『西侧矿洞挖到了不该挖的东西。』",
            "『不知道是什么，但接触到它的人都疯了。』",
            "『眼睛变得血红，见人就杀...』",
            "『几乎所有工友都发狂了...』",
            "『我撤走了梯子，希望能挡住他们。』",
            "『已经用无线电通知了外面，让他们封锁矿洞。』",
            "『别让瘟疫蔓延出去...』",
            "『这是我唯一能做的了。』"
        ]
    },
    urgent_order: {
        id: "urgent_order",
        name: "加急密令",
        type: "readable",
        desc: "一封用火漆封口的正式公函，信封上印有王国王室的徽记，边缘烫着金边。火漆上的印章清晰可见，显示这是最高等级的机密文件。",
        usable: true,
        customAction: true,
        content: [
            "『致：桑华山矿场所有贵族人员』",
            "『发自：王国紧急事务委员会』",
            "『等级：绝密 · 加急』",
            "",
            "『王国已正式确认，桑华山四号矿坑爆发严重「疯疫」疫情。』",
            "『病原体来源不明，感染率接近百分之百，且无任何已知治愈方法。』",
            "『为防止疫情扩散至王国全境，委员会决定执行以下紧急措施：』",
            "",
            "『一、所有贵族人员须于接获此令后立即撤离矿场区域；』",
            "『二、平民、矿工及其他工作人员一律不得随贵族撤离；』",
            "『三、明日清晨，王国将派遣法师团对矿场进行大范围的净化术式；』",
            "『四、此次净化将无差别覆盖矿场所有区域，所有滞留人员将被视为已感染处理。』",
            "",
            "『望诸位贵族以王国大局为重，速速撤离。』",
            "『王国的决定虽然残酷，但这是为了防止更大的灾难。』",
            "",
            "『愿女神庇佑王国。』"
        ]
    },
    music_score: {
        id: "music_score",
        name: "乐谱",
        type: "readable",
        desc: "一张泛黄的乐谱，上面用工整的笔迹记录着一首古老的桑华山民谣。乐谱的空白处还有艾莲娜自己的批注，字迹优雅而精致。",
        readable: true,
        content: "《桑华山的月光》\n\n桑华山的月光，洒在山路上，\n小溪在山间流过，送走我的悲伤。\n风从山脊吹过，带来她的呼唤，\n我梦中的美丽月亮，何时才能照亮我的彷徨？\n\n——艾莲娜·冯·罗森堡 整理"
    },

    // ========== 钥匙 ==========
    mine_side_key: {
        id: "mine_side_key",
        name: "矿场侧门钥匙",
        type: "important",
        desc: "一把黄铜制成的钥匙，上面刻着桑华山矿场的标记。据说可以打开矿场的侧门，那是逃离这座地狱的秘密通道之一。"
    },
    mine_gate_key: {
        id: "mine_gate_key",
        name: "矿场大门钥匙",
        type: "important",
        desc: "一把沉重的铁钥匙，上面刻着桑华山矿场的徽记。这是矿场大门的钥匙，通常只有驻矿骑士的指挥官才拥有。"
    },
    mine_exit_4_key: {
        id: "mine_exit_4_key",
        name: "四号矿井口钥匙",
        type: "important",
        desc: "一把沾满血迹的铜钥匙，上面刻着四号矿井的标记。在北侧矿道一具矿工尸体手中发现的，或许可以用来打开四号矿井口的铁锁。"
    },
    mansion_key: {
        id: "mansion_key",
        name: "男爵宅邸钥匙",
        type: "important",
        desc: "一把精致的银质钥匙，钥匙柄上雕刻着复杂的贵族纹章。这是进入桑华山男爵私人宅邸的唯一凭证。"
    },

    // ========== 可拾取杂物 ==========
    tinder: {
        id: "tinder",
        name: "火折子",
        type: "misc",
        desc: "引火用的竹筒，在黑暗的矿道里或许有用。"
    },
    rag: {
        id: "rag",
        name: "破布",
        type: "misc",
        desc: "一块脏兮兮的破布，没什么用处。"
    },
    stone: {
        id: "stone",
        name: "石块",
        type: "misc",
        desc: "一块开采出的的石块，沉甸甸的。"
    },
    iron_ore: {
        id: "iron_ore",
        name: "铁矿石",
        type: "misc",
        desc: "一块暗红色的铁矿石，表面粗糙，沉甸甸的。"
    },
    rusty_tool: {
        id: "rusty_tool",
        name: "生锈的工具",
        type: "misc",
        desc: "一把早已锈迹斑斑的采矿工具，木柄腐朽，金属部分布满暗红色的锈迹。"
    },
    broken_lock: {
        id: "broken_lock",
        name: "被破开的铁锁",
        type: "misc",
        desc: "一把被破坏的大铁锁，锁身扭曲变形，锁梁被硬生生撬开，只剩下半截锁链无力地垂挂着。"
    },
    corpse_miner: {
        id: "corpse_miner",
        name: "矿工的尸体",
        type: "misc",
        desc: "一个死去的矿工，脸上有一道醒目的疤痕，手里紧紧攥着什么东西。他的表情痛苦而决绝，仿佛临死前做出了什么重大的决定。可以拾取后在背包中搜刮。",
        loot: ["miner_note", "mine_exit_4_key"]
    },

    // ========== 烹饪辅料 ==========
    water: { id: "water", name: "水", type: "misc", desc: "清澈的水，烹饪不可或缺的辅料。", isSeasoning: true },
    mint: { id: "mint", name: "薄荷", type: "misc", desc: "几片新鲜的薄荷叶，带有清凉的香气。", isSeasoning: true },
    oil: { id: "oil", name: "油", type: "misc", desc: "一小瓶食用油，煎炒必备。", isSeasoning: true },
    salt: { id: "salt", name: "盐", type: "misc", desc: "粗盐粒，最基础的调味料。", isSeasoning: true },
    star_anise: { id: "star_anise", name: "八角", type: "misc", desc: "干燥的八角茴香，浓郁甘甜的香气。", isSeasoning: true },
    cinnamon: { id: "cinnamon", name: "桂皮", type: "misc", desc: "一块粗糙的桂皮，温暖的木质辛香。", isSeasoning: true },
    wild_pepper: { id: "wild_pepper", name: "野山椒", type: "misc", desc: "几颗野山椒，辛辣刺鼻。", isSeasoning: true },
    vinegar: { id: "vinegar", name: "醋", type: "misc", desc: "一坛陈醋，酸香醇厚。", isSeasoning: true },
    red_wine: { id: "red_wine", name: "红酒", type: "misc", desc: "一瓶来自桑华山酒窖的深红色葡萄酒，采用当地特有的野生葡萄酿造，口感醇厚饱满，带有黑莓和李子的浓郁果香，单宁柔和，余味悠长。", isSeasoning: true },
    rosemary: { id: "rosemary", name: "迷迭香", type: "misc", desc: "几枝干燥的迷迭香，散发着清新的木质香气。", isSeasoning: true },
    bay_leaf: { id: "bay_leaf", name: "月桂叶", type: "misc", desc: "几片干燥的月桂叶，微苦而芳香。", isSeasoning: true },
    soy_sauce: { id: "soy_sauce", name: "酱油", type: "misc", desc: "一瓶深色酱油，鲜咸浓郁。", isSeasoning: true },
    black_pepper: { id: "black_pepper", name: "黑胡椒", type: "misc", desc: "研磨好的黑胡椒粒，辛辣芳香。", isSeasoning: true },
    olive_oil: { id: "olive_oil", name: "橄榄油", type: "misc", desc: "一瓶金黄色的橄榄油，口感醇厚。", isSeasoning: true },
    ginger: { id: "ginger", name: "姜片", type: "misc", desc: "几片生姜，辛辣暖胃。", isSeasoning: true },
    scallion: { id: "scallion", name: "葱", type: "misc", desc: "几根翠绿的小葱，辛香提味。", isSeasoning: true },
    honey: { id: "honey", name: "蜂蜜", type: "misc", desc: "一罐金色的蜂蜜，甘甜芬芳。", isSeasoning: true },
    gelatin_sheet: { id: "gelatin_sheet", name: "吉利丁片", type: "misc", desc: "几片透明的吉利丁片，用于凝固成型。", isSeasoning: true },
    rose_petal: { id: "rose_petal", name: "玫瑰花瓣", type: "misc", desc: "几片新鲜的玫瑰花瓣，带着淡淡的芬芳。", isSeasoning: true },
    sugar: { id: "sugar", name: "糖", type: "misc", desc: "精制的蔗糖，甜味纯净。", isSeasoning: true },
    egg: { id: "egg", name: "鸡蛋", type: "misc", desc: "新鲜的鸡蛋，富含蛋白质。", isSeasoning: true },
    white_wine: { id: "white_wine", name: "白葡萄酒", type: "misc", desc: "一瓶来自桑华山酒窖的清澈白葡萄酒，选用高山泉水灌溉的白葡萄品种，口感清爽优雅，带有柑橘和梨的清新果香，酸度平衡，余味清爽。", isSeasoning: true },
    milk: { id: "milk", name: "牛奶", type: "misc", desc: "新鲜的牛奶，醇厚丝滑。", isSeasoning: true },
    vanilla_bean: { id: "vanilla_bean", name: "香草荚", type: "misc", desc: "一根香草荚，散发着浓郁的香草香气。", isSeasoning: true },
    osmanthus: { id: "osmanthus", name: "桂花", type: "misc", desc: "干燥的桂花，金黄芬芳。", isSeasoning: true },
    cherry: { id: "cherry", name: "樱桃", type: "misc", desc: "几颗新鲜的樱桃，甜美多汁。", isSeasoning: true },
    cream: { id: "cream", name: "奶油", type: "misc", desc: "新鲜的动物奶油，丝滑香浓。", isSeasoning: true },
    nutmeg: { id: "nutmeg", name: "肉豆蔻粉", type: "misc", desc: "研磨的肉豆蔻粉，温暖辛辣。", isSeasoning: true },
    butter: { id: "butter", name: "黄油", type: "misc", desc: "一块金黄色的黄油，香气浓郁。", isSeasoning: true },
    cheese: { id: "cheese", name: "芝士", type: "misc", desc: "一块成熟的芝士，浓郁醇厚。", isSeasoning: true },
    red_date: { id: "red_date", name: "红枣", type: "misc", desc: "几颗饱满的红枣，甘甜滋补。", isSeasoning: true },
    apple_wood_chips: { id: "apple_wood_chips", name: "苹果木屑", type: "misc", desc: "燃烧用的苹果木屑，增添烟熏风味。", isSeasoning: true },
    sake: { id: "sake", name: "清酒", type: "misc", desc: "一瓶清酒，清冽甘醇。", isSeasoning: true },
    kelp: { id: "kelp", name: "昆布", type: "misc", desc: "干燥的昆布片，提鲜增香。", isSeasoning: true },
    lettuce: { id: "lettuce", name: "生菜", type: "misc", desc: "几片新鲜的生菜，清脆爽口。", isSeasoning: true },
    knight_semen: { id: "knight_semen", name: "骑士战马精液", type: "misc", desc: "从骑士战马身上榨取的浓稠精液，散发着雄性气息。", isSeasoning: true },
    lemon_juice: { id: "lemon_juice", name: "柠檬汁", type: "misc", desc: "新鲜的柠檬汁，酸甜清香。", isSeasoning: true },
    wasabi_paste: { id: "wasabi_paste", name: "山葵酱", type: "misc", desc: "辛辣的山葵酱，具有独特的刺激性风味。", isSeasoning: true },
    perilla_leaf: { id: "perilla_leaf", name: "紫苏叶", type: "misc", desc: "新鲜的紫苏叶，具有独特的香气和风味。", isSeasoning: true },
    thyme: { id: "thyme", name: "百里香", type: "misc", desc: "干燥的百里香，散发着浓郁的香草气息。", isSeasoning: true },
    parsley: { id: "parsley", name: "欧芹碎", type: "misc", desc: "切碎的欧芹，具有清新的香气。", isSeasoning: true },
    huadiao_wine: { id: "huadiao_wine", name: "花雕酒", type: "misc", desc: "传统的花雕酒，色泽橙黄，香气馥郁。", isSeasoning: true },
    sherry: { id: "sherry", name: "雪莉酒", type: "misc", desc: "雪莉酒，口感醇厚，带有坚果和焦糖的风味。", isSeasoning: true }
};

// ============================================================
//  辅助函数
// ============================================================

function createItemFromTemplate(templateId) {
    const template = ITEM_TEMPLATES[templateId];
    if (!template) {
        console.error(`物品模板 "${templateId}" 不存在！`);
        return null;
    }
    return JSON.parse(JSON.stringify(template));
}

function createItemsFromTemplates(templateIds) {
    return templateIds.map(id => createItemFromTemplate(id)).filter(item => item !== null);
}

function getAllTemplateIds() {
    return Object.keys(ITEM_TEMPLATES);
}

function getItemNameById(itemId) {
    const item = ITEM_TEMPLATES[itemId];
    return item ? item.name : itemId;
}

function getItemInfoById(itemId) {
    return ITEM_TEMPLATES[itemId] || null;
}

// NPC ID 到尸体模板 ID 的映射
const CORPSE_TEMPLATE_MAP = {
    liana: 'liana_corpse',
    liana_wounded: 'liana_wounded_corpse',
    cecilia: 'cecilia_corpse',
    isabella: 'isabella_corpse',
    sophie: 'sophie_corpse',
    elena: 'elena_corpse',
    aisha: 'aisha_corpse',
    mine_supervisor: null,
    apprentice_knight: null,
    mad_miner: null,
    mad_supervisor: null
};

function createCorpse(npcId, drops = [], extraProps = {}) {
    const mappedTemplateId = CORPSE_TEMPLATE_MAP[npcId];
    const corpseTemplateId = mappedTemplateId !== undefined ? mappedTemplateId : `${npcId}_corpse`;
    const template = corpseTemplateId ? ITEM_TEMPLATES[corpseTemplateId] : null;

    const charTemplate = (typeof CHARACTER_TEMPLATES !== 'undefined') ? CHARACTER_TEMPLATES[npcId] : null;
    const chineseName = charTemplate ? charTemplate.name : null;

    if (!template) {
        const corpseName = extraProps.name || (chineseName ? `${chineseName}的尸体` : `${npcId}的尸体`);
        return {
            id: `corpse_${npcId}_${Date.now()}`,
            name: corpseName,
            type: "misc",
            desc: extraProps.desc || (charTemplate ? `${charTemplate.desc || '一具倒在血泊中的尸体'}可以拾取后在背包中搜刮。` : "一具倒在血泊中的尸体，可以拾取后在背包中搜刮。"),
            loot: [...drops]
        };
    }

    return {
        id: `corpse_${npcId}_${Date.now()}`,
        name: extraProps.name || template.name,
        type: "misc",
        desc: extraProps.desc || template.desc,
        loot: [...drops],
        dismemberable: template.dismemberable || false,
        usable: true,
        customAction: true,
        corpseStory: extraProps.corpseStory || template.corpseStory || []
    };
}