// ============================================================
//  items/items_ingredients.js - 烹饪调料/食材物品模板
//  从 items_core.js 抽取，方便独立维护
// ============================================================

(function() {
    const seasonings = {
        water:           { id: "water", name: "水", type: "misc", desc: "清澈的水。", isSeasoning: true },
        mint:            { id: "mint", name: "薄荷", type: "misc", desc: "几片新鲜的薄荷叶。", isSeasoning: true },
        oil:             { id: "oil", name: "油", type: "misc", desc: "一小瓶食用油。", isSeasoning: true },
        salt:            { id: "salt", name: "盐", type: "misc", desc: "粗盐粒。", isSeasoning: true },
        star_anise:      { id: "star_anise", name: "八角", type: "misc", desc: "干燥的八角茴香。", isSeasoning: true },
        cinnamon:        { id: "cinnamon", name: "桂皮", type: "misc", desc: "一块粗糙的桂皮。", isSeasoning: true },
        wild_pepper:     { id: "wild_pepper", name: "野山椒", type: "misc", desc: "几颗野山椒。", isSeasoning: true },
        vinegar:         { id: "vinegar", name: "醋", type: "misc", desc: "一坛陈醋。", isSeasoning: true },
        red_wine:        { id: "red_wine", name: "红酒", type: "misc", desc: "一瓶深红色葡萄酒。", isSeasoning: true },
        rosemary:        { id: "rosemary", name: "迷迭香", type: "misc", desc: "几枝干燥的迷迭香。", isSeasoning: true },
        bay_leaf:        { id: "bay_leaf", name: "月桂叶", type: "misc", desc: "几片干燥的月桂叶。", isSeasoning: true },
        soy_sauce:       { id: "soy_sauce", name: "酱油", type: "misc", desc: "一瓶深色酱油。", isSeasoning: true },
        black_pepper:    { id: "black_pepper", name: "黑胡椒", type: "misc", desc: "研磨好的黑胡椒粒。", isSeasoning: true },
        olive_oil:       { id: "olive_oil", name: "橄榄油", type: "misc", desc: "一瓶金黄色的橄榄油。", isSeasoning: true },
        ginger:          { id: "ginger", name: "姜片", type: "misc", desc: "几片生姜。", isSeasoning: true },
        scallion:        { id: "scallion", name: "葱", type: "misc", desc: "几根翠绿的小葱。", isSeasoning: true },
        honey:           { id: "honey", name: "蜂蜜", type: "misc", desc: "一罐金色的蜂蜜。", isSeasoning: true },
        gelatin_sheet:   { id: "gelatin_sheet", name: "吉利丁片", type: "misc", desc: "几片透明的吉利丁片。", isSeasoning: true },
        rose_petal:      { id: "rose_petal", name: "玫瑰花瓣", type: "misc", desc: "几片新鲜的玫瑰花瓣。", isSeasoning: true },
        sugar:           { id: "sugar", name: "糖", type: "misc", desc: "精制的蔗糖。", isSeasoning: true },
        egg:             { id: "egg", name: "鸡蛋", type: "misc", desc: "新鲜的鸡蛋。", isSeasoning: true },
        white_wine:      { id: "white_wine", name: "白葡萄酒", type: "misc", desc: "一瓶清澈白葡萄酒。", isSeasoning: true },
        milk:            { id: "milk", name: "牛奶", type: "misc", desc: "新鲜的牛奶。", isSeasoning: true },
        vanilla_bean:    { id: "vanilla_bean", name: "香草荚", type: "misc", desc: "一根香草荚。", isSeasoning: true },
        osmanthus:       { id: "osmanthus", name: "桂花", type: "misc", desc: "干燥的桂花。", isSeasoning: true },
        cherry:          { id: "cherry", name: "樱桃", type: "misc", desc: "几颗新鲜的樱桃。", isSeasoning: true },
        cream:           { id: "cream", name: "奶油", type: "misc", desc: "新鲜的动物奶油。", isSeasoning: true },
        nutmeg:          { id: "nutmeg", name: "肉豆蔻粉", type: "misc", desc: "研磨的肉豆蔻粉。", isSeasoning: true },
        butter:          { id: "butter", name: "黄油", type: "misc", desc: "一块金黄色的黄油。", isSeasoning: true },
        cheese:          { id: "cheese", name: "芝士", type: "misc", desc: "一块成熟的芝士。", isSeasoning: true },
        red_date:        { id: "red_date", name: "红枣", type: "misc", desc: "几颗饱满的红枣。", isSeasoning: true },
        apple_wood_chips:{ id: "apple_wood_chips", name: "苹果木屑", type: "misc", desc: "燃烧用的苹果木屑。", isSeasoning: true },
        sake:            { id: "sake", name: "清酒", type: "misc", desc: "一瓶清酒。", isSeasoning: true },
        kelp:            { id: "kelp", name: "昆布", type: "misc", desc: "干燥的昆布片。", isSeasoning: true },
        lettuce:         { id: "lettuce", name: "生菜", type: "misc", desc: "几片新鲜的生菜。", isSeasoning: true },
        knight_semen:    { id: "knight_semen", name: "骑士战马精液", type: "misc", desc: "从骑士战马身上榨取的浓稠精液。", isSeasoning: true },
        lemon_juice:     { id: "lemon_juice", name: "柠檬汁", type: "misc", desc: "新鲜的柠檬汁。", isSeasoning: true },
        wasabi_paste:    { id: "wasabi_paste", name: "山葵酱", type: "misc", desc: "辛辣的山葵酱。", isSeasoning: true },
        perilla_leaf:    { id: "perilla_leaf", name: "紫苏叶", type: "misc", desc: "新鲜的紫苏叶。", isSeasoning: true },
        thyme:           { id: "thyme", name: "百里香", type: "misc", desc: "干燥的百里香。", isSeasoning: true },
        parsley:         { id: "parsley", name: "欧芹碎", type: "misc", desc: "切碎的欧芹。", isSeasoning: true },
        huadiao_wine:    { id: "huadiao_wine", name: "花雕酒", type: "misc", desc: "传统的花雕酒。", isSeasoning: true },
        sherry:          { id: "sherry", name: "雪莉酒", type: "misc", desc: "雪莉酒。", isSeasoning: true }
    };

    // 合并到全局 ITEM_TEMPLATES
    for (const [id, data] of Object.entries(seasonings)) {
        ITEM_TEMPLATES[id] = data;
    }
})();