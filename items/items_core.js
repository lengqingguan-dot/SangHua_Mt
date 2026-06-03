// ============================================================
//  items/items_core.js - 核心物品模板 + 辅助函数
// ============================================================

const ITEM_TEMPLATES = {
    gold_coin: { id: "gold_coin", name: "金币", type: "misc", desc: "一枚闪闪发光的金币，在矿场中极为罕见。" },
    bread: { id: "bread", name: "干粮", type: "consumable", desc: "一块硬邦邦的黑面包。", effect: "heal", value: 5 },
    herb: { id: "herb", name: "止血草", type: "consumable", desc: "矿工们常用的草药。", effect: "heal", value: 10 },
    magic_mirror: { id: "magic_mirror", name: "魔镜", type: "misc", desc: "一面边框镶嵌紫色宝石的古朴手镜，镜面泛着幽蓝色的微光。点击传送可以瞬间移动到曾经到过的地点。", usable: true, customAction: true },
    statue_obedient: { id: "statue_obedient", name: "雕像【顺从】", type: "exhibit", desc: "这是一座以肉体欲望为蓝图，用死亡砌成的纪念碑。\n雕像的基座是艾莲娜那双跪倒的腿。黑色的高跟鞋将足弓绷成一道惊心动魄的弧线，脚踝纤细，向上延伸出紧实的小腿肌理。\n上半身属于伊莎贝拉。那对被精心保存并重新归位的乳房，在托举的姿态下微微上提，呈现出完美的圆形。底缘的缝合线将这对柔软的器官固定在胸前，成为一个专供审视的、永不衰垂的展品。\n伊莎贝拉冰冷的双手托举着银盘，盘中，塞西莉亚那双穿着白色厚丝袜的小巧脚掌，被摆放在头颅两侧。黑色的玛丽珍皮鞋与纯白的丝袜包裹着僵硬的脚踝和足背，散发着一种少女独有的、混合着纯真与诱惑的气息，那颗沾满干涸精液的头颅，是这篇矿场献给你的最终礼物。\n也许在未来的家园中可以展示它..." },
    black_stockings: { id: "black_stockings", name: "黑丝", type: "misc", desc: "一双黑色薄丝袜，触感丝滑细腻。这是伊莎贝拉生前最爱的穿着，上面似乎还残留着她肌肤的温度和淡淡的香水味。" },
    black_high_heels: { id: "black_high_heels", name: "黑色高跟鞋", type: "misc", desc: "一双黑色细跟高跟鞋，鞋面光滑，鞋跟细长优雅。伊莎贝拉生前最喜欢穿着这双高跟鞋在宅邸中走动，鞋底还残留着些许磨损痕迹。" },
    miner_note: { id: "miner_note", name: "染血的字条", type: "readable", desc: "一张皱巴巴的字条，上面沾着暗红色的血迹。", content: ["『如果有人看到这张字条...』","『西侧矿洞挖到了不该挖的东西。』","『不知道是什么，但接触到它的人都疯了。』","『眼睛变得血红，见人就杀...』","『几乎所有工友都发狂了...』","『我撤走了梯子，希望能挡住他们。』","『已经用无线电通知了外面，让他们封锁矿洞。』","『别让瘟疫蔓延出去...』","『这是我唯一能做的了。』"] },
    urgent_order: { id: "urgent_order", name: "加急密令", type: "readable", desc: "一封用火漆封口的正式公函，印有王国王室徽记。", usable: true, customAction: true, content: ["『致：桑华山矿场所有贵族人员』","『发自：王国紧急事务委员会』","『等级：绝密 · 加急』","","『王国已正式确认，桑华山四号矿坑爆发严重「疯疫」疫情。』","『病原体来源不明，感染率接近百分之百。』","『为防止疫情扩散，委员会决定执行以下紧急措施：』","","『一、所有贵族人员须立即撤离矿场区域；』","『二、平民、矿工及其他工作人员不得撤离；』","『三、明日清晨，法师团将对矿场进行净化术式；』","『四、净化将无差别覆盖所有区域。』","","『望诸位贵族以王国大局为重，速速撤离。』","『愿女神庇佑王国。』"] },
    music_score: { id: "music_score", name: "乐谱", type: "readable", desc: "一张泛黄的乐谱，记录着一首古老的桑华山民谣。", readable: true, content: "《桑华山的月光》\n\n桑华山的月光，洒在山路上，\n小溪在山间流过，送走我的悲伤。\n——艾莲娜·冯·罗森堡 整理" },
    mine_side_key: { id: "mine_side_key", name: "矿场侧门钥匙", type: "important", desc: "一把黄铜制成的钥匙。" },
    mine_gate_key: { id: "mine_gate_key", name: "矿场大门钥匙", type: "important", desc: "一把沉重的铁钥匙。" },
    mine_exit_4_key: { id: "mine_exit_4_key", name: "四号矿井口钥匙", type: "important", desc: "一把沾满血迹的铜钥匙。" },
    mansion_key: { id: "mansion_key", name: "伯爵宅邸钥匙", type: "important", desc: "一把精致的银质钥匙，钥匙柄上雕刻着贵族纹章。" },
    broken_pickaxe: { id: "broken_pickaxe", name: "折断的镐头", type: "misc", desc: "一柄早已折断的镐头。" },
    tinder: { id: "tinder", name: "火折子", type: "misc", desc: "引火用的竹筒。" },
    rag: { id: "rag", name: "破布", type: "misc", desc: "一块脏兮兮的破布。" },
    stone: { id: "stone", name: "石块", type: "misc", desc: "一块开采出的石块，沉甸甸的。" },
    iron_ore: { id: "iron_ore", name: "铁矿石", type: "misc", desc: "一块暗红色的铁矿石。" },
    rusty_tool: { id: "rusty_tool", name: "生锈的工具", type: "misc", desc: "一把锈迹斑斑的采矿工具。" },
    broken_lock: { id: "broken_lock", name: "被破开的铁锁", type: "misc", desc: "一把被破坏的大铁锁。" },
    corpse_miner: { id: "corpse_miner", name: "矿工的尸体", type: "misc", desc: "一个死去的矿工，脸上有一道醒目的疤痕。", loot: ["miner_note", "mine_exit_4_key"] },
    water: { id: "water", name: "水", type: "misc", desc: "清澈的水。", isSeasoning: true },
    mint: { id: "mint", name: "薄荷", type: "misc", desc: "几片新鲜的薄荷叶。", isSeasoning: true },
    oil: { id: "oil", name: "油", type: "misc", desc: "一小瓶食用油。", isSeasoning: true },
    salt: { id: "salt", name: "盐", type: "misc", desc: "粗盐粒。", isSeasoning: true },
    star_anise: { id: "star_anise", name: "八角", type: "misc", desc: "干燥的八角茴香。", isSeasoning: true },
    cinnamon: { id: "cinnamon", name: "桂皮", type: "misc", desc: "一块粗糙的桂皮。", isSeasoning: true },
    wild_pepper: { id: "wild_pepper", name: "野山椒", type: "misc", desc: "几颗野山椒。", isSeasoning: true },
    vinegar: { id: "vinegar", name: "醋", type: "misc", desc: "一坛陈醋。", isSeasoning: true },
    red_wine: { id: "red_wine", name: "红酒", type: "misc", desc: "一瓶深红色葡萄酒。", isSeasoning: true },
    rosemary: { id: "rosemary", name: "迷迭香", type: "misc", desc: "几枝干燥的迷迭香。", isSeasoning: true },
    bay_leaf: { id: "bay_leaf", name: "月桂叶", type: "misc", desc: "几片干燥的月桂叶。", isSeasoning: true },
    soy_sauce: { id: "soy_sauce", name: "酱油", type: "misc", desc: "一瓶深色酱油。", isSeasoning: true },
    black_pepper: { id: "black_pepper", name: "黑胡椒", type: "misc", desc: "研磨好的黑胡椒粒。", isSeasoning: true },
    olive_oil: { id: "olive_oil", name: "橄榄油", type: "misc", desc: "一瓶金黄色的橄榄油。", isSeasoning: true },
    ginger: { id: "ginger", name: "姜片", type: "misc", desc: "几片生姜。", isSeasoning: true },
    scallion: { id: "scallion", name: "葱", type: "misc", desc: "几根翠绿的小葱。", isSeasoning: true },
    honey: { id: "honey", name: "蜂蜜", type: "misc", desc: "一罐金色的蜂蜜。", isSeasoning: true },
    gelatin_sheet: { id: "gelatin_sheet", name: "吉利丁片", type: "misc", desc: "几片透明的吉利丁片。", isSeasoning: true },
    rose_petal: { id: "rose_petal", name: "玫瑰花瓣", type: "misc", desc: "几片新鲜的玫瑰花瓣。", isSeasoning: true },
    sugar: { id: "sugar", name: "糖", type: "misc", desc: "精制的蔗糖。", isSeasoning: true },
    egg: { id: "egg", name: "鸡蛋", type: "misc", desc: "新鲜的鸡蛋。", isSeasoning: true },
    white_wine: { id: "white_wine", name: "白葡萄酒", type: "misc", desc: "一瓶清澈白葡萄酒。", isSeasoning: true },
    milk: { id: "milk", name: "牛奶", type: "misc", desc: "新鲜的牛奶。", isSeasoning: true },
    vanilla_bean: { id: "vanilla_bean", name: "香草荚", type: "misc", desc: "一根香草荚。", isSeasoning: true },
    osmanthus: { id: "osmanthus", name: "桂花", type: "misc", desc: "干燥的桂花。", isSeasoning: true },
    cherry: { id: "cherry", name: "樱桃", type: "misc", desc: "几颗新鲜的樱桃。", isSeasoning: true },
    cream: { id: "cream", name: "奶油", type: "misc", desc: "新鲜的动物奶油。", isSeasoning: true },
    nutmeg: { id: "nutmeg", name: "肉豆蔻粉", type: "misc", desc: "研磨的肉豆蔻粉。", isSeasoning: true },
    butter: { id: "butter", name: "黄油", type: "misc", desc: "一块金黄色的黄油。", isSeasoning: true },
    cheese: { id: "cheese", name: "芝士", type: "misc", desc: "一块成熟的芝士。", isSeasoning: true },
    red_date: { id: "red_date", name: "红枣", type: "misc", desc: "几颗饱满的红枣。", isSeasoning: true },
    apple_wood_chips: { id: "apple_wood_chips", name: "苹果木屑", type: "misc", desc: "燃烧用的苹果木屑。", isSeasoning: true },
    sake: { id: "sake", name: "清酒", type: "misc", desc: "一瓶清酒。", isSeasoning: true },
    kelp: { id: "kelp", name: "昆布", type: "misc", desc: "干燥的昆布片。", isSeasoning: true },
    lettuce: { id: "lettuce", name: "生菜", type: "misc", desc: "几片新鲜的生菜。", isSeasoning: true },
    knight_semen: { id: "knight_semen", name: "骑士战马精液", type: "misc", desc: "从骑士战马身上榨取的浓稠精液。", isSeasoning: true },
    lemon_juice: { id: "lemon_juice", name: "柠檬汁", type: "misc", desc: "新鲜的柠檬汁。", isSeasoning: true },
    wasabi_paste: { id: "wasabi_paste", name: "山葵酱", type: "misc", desc: "辛辣的山葵酱。", isSeasoning: true },
    perilla_leaf: { id: "perilla_leaf", name: "紫苏叶", type: "misc", desc: "新鲜的紫苏叶。", isSeasoning: true },
    thyme: { id: "thyme", name: "百里香", type: "misc", desc: "干燥的百里香。", isSeasoning: true },
    parsley: { id: "parsley", name: "欧芹碎", type: "misc", desc: "切碎的欧芹。", isSeasoning: true },
    huadiao_wine: { id: "huadiao_wine", name: "花雕酒", type: "misc", desc: "传统的花雕酒。", isSeasoning: true },
    sherry: { id: "sherry", name: "雪莉酒", type: "misc", desc: "雪莉酒。", isSeasoning: true }
};

function createItemFromTemplate(templateId) {
    const template = ITEM_TEMPLATES[templateId];
    if (!template) { console.error(`物品模板 "${templateId}" 不存在！`); return null; }
    return JSON.parse(JSON.stringify(template));
}
function createItemsFromTemplates(templateIds) { return templateIds.map(id => createItemFromTemplate(id)).filter(item => item !== null); }
function getAllTemplateIds() { return Object.keys(ITEM_TEMPLATES); }
function getItemNameById(itemId) { const item = ITEM_TEMPLATES[itemId]; return item ? item.name : itemId; }
function getItemInfoById(itemId) { return ITEM_TEMPLATES[itemId] || null; }

const CORPSE_TEMPLATE_MAP = {
    liana: 'liana_corpse', liana_wounded: 'liana_wounded_corpse',
    cecilia: 'cecilia_corpse', isabella: 'isabella_corpse',
    sophie: 'sophie_corpse', elena: 'elena_corpse', aisha: 'aisha_corpse',
    mine_supervisor: null, apprentice_knight: null, mad_miner: null, mad_supervisor: null
};

// ★ 统一用尸体 loot，不再使用 NPC drops
function createCorpse(npcId, extraProps = {}) {
    const mappedTemplateId = CORPSE_TEMPLATE_MAP[npcId];
    const corpseTemplateId = mappedTemplateId !== undefined ? mappedTemplateId : `${npcId}_corpse`;
    const template = corpseTemplateId ? ITEM_TEMPLATES[corpseTemplateId] : null;
    const charTemplate = (typeof CHARACTER_TEMPLATES !== 'undefined') ? CHARACTER_TEMPLATES[npcId] : null;
    const chineseName = charTemplate ? charTemplate.name : null;

    if (!template) {
        const corpseName = extraProps.name || (chineseName ? `${chineseName}的尸体` : `${npcId}的尸体`);
        return {
            id: `corpse_${npcId}_${Date.now()}`, name: corpseName, type: "misc",
            desc: extraProps.desc || (charTemplate ? `${charTemplate.desc || '一具倒在血泊中的尸体'}可以拾取后在背包中搜刮。` : "一具倒在血泊中的尸体。"),
            loot: []
        };
    }
    return {
        id: `corpse_${npcId}_${Date.now()}`, name: extraProps.name || template.name, type: "misc",
        desc: extraProps.desc || template.desc,
        loot: template.loot ? [...template.loot] : [],
        dismemberable: template.dismemberable || false, usable: true, customAction: true,
        corpseStory: extraProps.corpseStory || template.corpseStory || []
    };
}