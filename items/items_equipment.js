// ============================================================
//  items/items_equipment.js - 可装备物品
//  武器/防具/饰品（有 slot 属性，可装备到角色身上）
//  rarity: normal=普通(白) good=优良(绿) rare=稀有(蓝) epic=罕见(紫) legendary=珍品(橙)
//  crafted: true 表示玩家自制装备，显示★前缀
// ============================================================

Object.assign(ITEM_TEMPLATES, {
    // ========== 武器 ==========
    pickaxe: {
        id: "pickaxe", type: "weapon", slot: "weapon", name: "破镐头", rarity: "normal",
        desc: "一把生锈的镐头，勉强能当武器。木柄上满是裂纹，铁头边缘已经卷刃。",
        atk: 4, agi: 2
    },
    kitchen_knife: {
        id: "kitchen_knife", type: "weapon", slot: "weapon", name: "菜刀", rarity: "normal",
        desc: "一把厚重的厨用刀具，刀身宽阔，刃口还算锋利。刀柄上沾着常年使用留下的油渍。",
        atk: 8, agi: 0
    },
    fruit_knife: {
        id: "fruit_knife", type: "weapon", slot: "weapon", name: "水果刀", rarity: "normal",
        desc: "一把小巧的水果刀，刀身轻薄但锋利。刀柄由普通木料削成，手感一般。",
        atk: 5, agi: 2
    },

    rusty_sword: {
        id: "rusty_sword", type: "weapon", slot: "weapon", name: "生锈的铁剑", rarity: "good",
        desc: "剑刃布满锈迹，但剑身仍保持平衡性。剑柄上的皮革虽然磨损，却依然能提供稳固的握持。这把剑或许经历了不止一场战斗。",
        atk: 5, agi: 3
    },
    iron_stick: {
        id: "iron_stick", type: "weapon", slot: "weapon", name: "铁棍", rarity: "good",
        desc: "一根沉甸甸的铁棍，通体由粗铁锻造而成。虽然做工粗糙，但重量赋予了它不俗的杀伤力。棍身有几处明显的敲击凹痕，说明它曾真正上过战场。",
        atk: 12, agi: 1
    },

    knight_greatsword: {
        id: "knight_greatsword", type: "weapon", slot: "weapon", name: "骑士大剑", rarity: "rare",
        desc: "女骑士莉娅娜·冯·斯特兰使用的王国骑士团标准配剑。剑身由优质钢材锻造，宽阔而锋利，剑柄缠绕着双层鞣制皮革，末端镶嵌着一颗暗红色的宝石。剑身靠近护手处刻有王国狮鹫徽记和她的名字缩写，握在手中能感受到一股冷冽的杀意。",
        atk: 18, agi: -1
    },

    // ========== 防具 ==========
    miners_cloth: {
        id: "miners_cloth", type: "armor", slot: "armor", name: "矿工服", rarity: "normal",
        desc: "一件破旧的矿工服，满是补丁和汗渍。布料粗糙刺肤，唯一的优点是还算耐磨。",
        def: 1, agi: 1
    },
    leather_vest: {
        id: "leather_vest", type: "armor", slot: "armor", name: "破皮背心", rarity: "normal",
        desc: "一件多处磨损的皮背心，背部的皮革已经裂开几道口子。穿在身上能提供微弱的防护，聊胜于无。",
        def: 2, agi: 0
    },
    maid_uniform: {
        id: "maid_uniform", type: "armor", slot: "body", name: "女仆服", rarity: "normal",
        desc: "一套略显宽大的女仆装，黑白相间的配色。裙摆下缘沾着些许水渍和皂角的痕迹，布料已经被反复搓洗得发白。虽然朴素，但能看出曾经的整洁。",
        def: 1, equipable: true
    },

    lolita_dress: {
        id: "lolita_dress", type: "armor", slot: "body", name: "洛丽塔裙装", rarity: "good",
        desc: "一套古典洛丽塔裙装：层层叠叠的黑色蕾丝裙摆搭配白色荷叶边，裙身点缀着精致的蝴蝶结。虽然沾染了些许血迹，但依然能看出其华贵的做工。内衬用上等丝绸缝制，裙撑由鲸骨骨架支撑，每一层蕾丝都绣着细密的花纹。",
        def: 1, equipable: true
    },

    knight_armor: {
        id: "knight_armor", type: "armor", slot: "armor", name: "骑士板甲", rarity: "rare",
        desc: "莉娅娜身穿的银灰色全覆式板甲，由精钢锻打而成。甲片表面刻有王国狮鹫徽记，关节处采用精巧的叠层结构既保证了防护又不失灵活性。胸甲上有一道深深的剑痕，见证了某场惨烈的战斗。虽然重量可观，但穿上它确实能让你在战场上多几分活命的资本。",
        def: 15, agi: -2
    },

    // ========== 饰品 ==========
    knight_emblem: {
        id: "knight_emblem", type: "accessory", slot: "accessory", name: "骑士徽记", rarity: "good",
        desc: "一枚刻有王国狮鹫图案的金属徽章，由黄铜压制而成。背面刻有颁发日期和骑士编号。佩戴它可以略微提升防御力，也可能引起某些人的敌意。",
        def: 3
    },

    blood_gem: {
        id: "blood_gem", type: "accessory", slot: "accessory", name: "血色宝石", rarity: "epic",
        desc: "一颗散发着诡异血色光芒的宝石，大小如鸽蛋，通体呈暗红色。宝石内部似乎有什么东西在流动，凑近细看能看到无数细如发丝的暗纹在搏动，如同血管。据说这是疯疫的源头之一——矿工们挖到的那个\u201c不该挖的东西\u201d。佩戴它的人会获得超凡的敏捷，但生命力会被逐渐吞噬……仿佛这宝石在汲取佩戴者的生命来养活自己。",
        agi: 40, curse: true, maxHpPercent: -0.4
    },

    magic_gem: {
        id: "magic_gem", type: "accessory", slot: "accessory", name: "魔导宝石", rarity: "legendary",
        desc: "一颗散发着淡紫色光芒的神秘宝石，足有婴儿拳头大小。宝石内部仿佛封存着整个星云——无数光点在其中缓慢旋转，明灭不定，时而聚拢成漩涡，时而又消散如烟。这是瑟蕾娜·紫雾的魔力核心，凝聚了一位活了数百年的法师对魔力的全部理解。佩戴后能大幅提升战斗力，握在手中甚至能感受到宝石本身微弱的脉动，像一颗沉睡的心脏。",
        effect: "boost", atkPercent: 0.5, defPercent: 0.5, equipable: true
    }
});