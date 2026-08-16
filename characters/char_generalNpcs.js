// ============================================================
//  characters/char_generalNpcs.js - 一般NPC
//  hostile: false，不主动攻击玩家，无侵犯/肢解功能
//  疲惫的矿工、见习骑士、骑士战马、熟睡的矿工、城堡卫兵
// ============================================================

Object.assign(CHARACTER_TEMPLATES, {

    // ==================== 城堡卫兵 ====================
    castle_guard_1: {
        id: "castle_guard_1",
        name: "城堡卫兵",
        type: "npc",
        desc: "一名身披铁甲的城堡卫兵，手持长戟，面无表情地站在围栏门前。头盔的面罩遮住了大半张脸，只露出一双警觉的眼睛。他胸甲上刻着伯爵家族的纹章。",
        dialogue: [
            "「站住。前方是伯爵城堡，无关人等不得进入。」",
            "「如果你有通行文书，请出示。否则请离开。」"
        ],
        repeatDialogue: [
            "「轮岗时间还没到，耐心等着吧。」"
        ],
        hp: 50,
        maxHp: 50,
        atk: 12,
        def: 8,
        agi: 4,
        canTalk: true,
        canFight: true,
        hostile: false,
        drops: [],
        exp: 40,
        level: 5
    },
    castle_guard_2: {
        id: "castle_guard_2",
        name: "城堡卫兵",
        type: "npc",
        desc: "另一名守门的卫兵，靠在门柱上，看起来比同伴稍微松懈一些。他的目光漫不经心地扫过来往的行人，偶尔低下头打一个哈欠。",
        dialogue: [
            "「又是站岗的一天......无聊透顶。」",
            "「除非你有伯爵大人的亲笔信，否则别想进去。」"
        ],
        repeatDialogue: [
            "「贵族老爷们整天在里面享福，我们在这儿吹冷风。」"
        ],
        hp: 45,
        maxHp: 45,
        atk: 10,
        def: 7,
        agi: 4,
        canTalk: true,
        canFight: true,
        hostile: false,
        drops: [],
        exp: 35,
        level: 4
    },

    // ==================== 弩手 ====================
    crossbowman: {
        id: "crossbowman",
        name: "弩手",
        type: "npc",
        desc: "一名端坐城楼垛口后的弩手，怀里抱着一把上弦的十字弩。他的皮甲外罩着灰褐色的披风，腰间挂着一筒弩矢，眼神像鹰一样扫视着下方。",
        dialogue: [
            "「别在城墙上乱晃。弩箭可不长眼睛。」"
        ],
        repeatDialogue: [
            "「守好你的位置。上面交代了，一只苍蝇都不能放进来。」"
        ],
        hp: 40,
        maxHp: 40,
        atk: 15,
        def: 5,
        agi: 6,
        canTalk: true,
        canFight: true,
        hostile: false,
        drops: [],
        exp: 30
    },

    // ==================== 卫兵队长 ====================
    guard_captain: {
        id: "guard_captain",
        name: "卫兵队长",
        type: "npc",
        desc: "一名体格更为魁梧的卫兵队长，铠甲擦得锃亮，腰间悬着一柄阔剑，披风上绣着山鹰纹章。他站在观察室中，背着手，目光沉冷地俯瞰着整片城堡外围。",
        dialogue: [
            "「观察室重地，闲人止步。你最好说明来意。」"
        ],
        repeatDialogue: [
            "「把你的眼睛放老实点。这里不是你能随意进出的地方。」"
        ],
        hp: 90,
        maxHp: 90,
        atk: 22,
        def: 12,
        agi: 8,
        canTalk: true,
        canFight: true,
        hostile: false,
        drops: [],
        exp: 80
    },

    // ==================== 皇家卫兵 ====================
    royal_guard: {
        id: "royal_guard",
        name: "皇家卫兵",
        type: "npc",
        desc: "一名身着镀金胸甲、披猩红披风的皇家卫兵，手中握着出鞘的长剑。他的姿态比普通城堡卫兵更为肃杀，仿佛随时准备为伯爵赴死。",
        dialogue: [
            "「退下。这里是伯爵的寝殿区。」"
        ],
        repeatDialogue: [
            "「没有伯爵的命令，任何人不得靠近。」"
        ],
        hp: 70,
        maxHp: 70,
        atk: 20,
        def: 10,
        agi: 9,
        canTalk: true,
        canFight: true,
        hostile: false,
        drops: [],
        exp: 60
    },

    // ==================== 兰德尔伯爵 ====================
    count_randolph: {
        id: "count_randolph",
        name: "兰德尔伯爵",
        type: "npc",
        desc: "兰德尔伯爵背对着大门，负手站在指挥室的作战地图前。他的身形高大，深色华服外披着一件黑狐毛领的斗篷，不怒自威。即使听见脚步声，他也没有立刻回头。",
        dialogue: [
            "「……是你。矿场里逃出来的那只老鼠。」",
            "「我曾下令，明日黎明前，桑华山不会再有活着的矿工。」"
        ],
        repeatDialogue: [
            "「既然到了这里，就别想再活着出去了。」"
        ],
        hp: 150,
        maxHp: 150,
        atk: 30,
        def: 15,
        agi: 12,
        canTalk: true,
        canFight: true,
        hostile: false,
        drops: [],
        exp: 200
    },

    // ==================== 地牢卫兵 ====================
    dungeon_guard: {
        id: "dungeon_guard",
        name: "地牢卫兵",
        type: "npc",
        desc: "一名身材瘦高的地牢卫兵，腰间挂着一串沉甸甸的钥匙，蜡黄的脸上没有半分表情。他握着短杖，冷冷地扫视着每一间牢房。",
        dialogue: [
            "「地牢重地，老实呆着。」"
        ],
        repeatDialogue: [
            "「别打什么歪主意。钥匙在我这儿。」"
        ],
        hp: 55,
        maxHp: 55,
        atk: 14,
        def: 8,
        agi: 5,
        canTalk: true,
        canFight: true,
        hostile: false,
        drops: [],
        exp: 40
    },

    // ==================== 华沙（驿站老板） ====================
    huasha: {
        id: "huasha",
        name: "华沙",
        type: "npc",
        gender: "female",
        desc: "一名被关押在牢房里的女子，鬓发散乱，衣着虽有些破损却仍能看出曾是体面的驿站老板。她抬头看向你时，眼里带着疲惫与一丝不易察觉的希冀。",
        dialogue: [
            "「……你是来救我的吗？我叫华沙，卡伦镇驿站就是我在打理。」"
        ],
        repeatDialogue: [
            "「他们把我关在这里……说我知道得太多。」"
        ],
        hp: 30,
        maxHp: 30,
        atk: 2,
        def: 1,
        agi: 6,
        canTalk: true,
        canFight: false,
        hostile: false,
        drops: [],
        exp: 0
    },

    // ==================== 车夫 ====================
    coachman: {
        id: "coachman",
        name: "车夫",
        type: "npc",
        desc: "一个皮肤黝黑的车夫，穿着耐磨的粗布短褐，手里攥着一根赶车的长鞭。他靠着驿车，懒洋洋地打量着进进出出的旅人。",
        dialogue: [
            "「嘿，客官，要出远门吗？我的车可稳当得很。」"
        ],
        repeatDialogue: [
            "「只要给够路费，天南海北都能去。」"
        ],
        hp: 40,
        maxHp: 40,
        atk: 6,
        def: 3,
        agi: 5,
        canTalk: true,
        canFight: false,
        hostile: false,
        drops: [],
        exp: 0
    },

    // ==================== 女农奴（起义增援） ====================
    female_serf: {
        id: "female_serf",
        name: "女农奴",
        type: "npc",
        gender: "female",
        desc: "一名黝黑结实的女农奴，手里攥着一把磨得发亮的镰刀。她的眼睛里有恨，也有豁出去的决绝。",
        dialogue: [
            "「领主没了……我们也该为自己活了。」"
        ],
        repeatDialogue: [
            "「打！把他们赶出去！」"
        ],
        hp: 35,
        maxHp: 35,
        atk: 8,
        def: 3,
        agi: 6,
        canTalk: true,
        canFight: true,
        hostile: false,
        drops: [],
        exp: 0
    },

    // ==================== 疲惫的矿工 ====================
    tired_miner: {
        id: "tired_miner",
        name: "疲惫的矿工",
        type: "npc",
        desc: "一个满脸疲惫的中年矿工，眼神中透露着绝望。他身上伤痕累累，似乎经历了非人的折磨。",
        dialogue: [
            "「听说四号矿井挖出了什么东西...之后就有人疯了...」",
            "「那些疯了的人眼睛血红，见人就杀...太可怕了...」"
        ],
        repeatDialogue: [
            "「如果你去四号矿井，一定要小心...那些疯了的人很危险。」"
        ],
        level: 1,
        hp: 15,
        maxHp: 15,
        atk: 2,
        def: 0,
        agi: 3,
        canTalk: true,
        canFight: false,
        canGiveItem: null,
        quest: "find_escape_route"
    },

    // ==================== 见习骑士 ====================
    apprentice_knight: {
        id: "apprentice_knight",
        name: "见习骑士",
        type: "npc",
        desc: "一名年轻的见习骑士，身穿轻便的锁子甲，手持训练用长剑。\n他看起来不过十七八岁，脸上还带着少年人的青涩与紧张，但目光坚定，双手紧握剑柄，尽职尽责地守卫着矿场大门。",
        dialogue: [
            "「站住！矿场大门禁止未经许可的矿工通行！」",
            "「退回去！这是骑士团的命令！」"
        ],
        repeatDialogue: [
            "「退回去！没有通行证禁止通行！」",
            "「这是骑士团的命令，不要挑战我们的耐心！」"
        ],
        level: 2,
        hp: 50,
        maxHp: 50,
        atk: 15,
        def: 15,
        agi: 8,
        canTalk: true,
        canFight: true,
        hostile: false,
        groupFight: true,
        drops: [],
        exp: 40
    },

    // ==================== 骑士战马 ====================
    warhorse: {
        id: "warhorse",
        name: "骑士战马",
        type: "npc",
        desc: "一匹健壮的黑色战马，通体漆黑如墨，肌肉线条分明。\n它披着印有王国狮鹫徽记的马甲，四蹄强健有力，眼神警惕而骄傲。\n这匹战马是骑士团精心培育的坐骑，曾随骑士征战沙场，如今被拴在马厩中。\n它似乎感受到了什么，不安地刨着蹄子。",
        level: 5,
        hp: 80,
        maxHp: 80,
        atk: 20,
        def: 10,
        agi: 12,
        canTalk: false,
        canFight: false,
        canSlaughter: true,
        canMilk: true,
        hostile: false,
        drops: [],
        exp: 0
    },

    // ==================== 熟睡的矿工 ====================
    sleeping_miner: {
        id: "sleeping_miner",
        name: "熟睡的矿工",
        type: "npc",
        desc: "一个疲惫不堪的矿工，正蜷缩在简陋的床铺上沉睡。他满脸煤灰，身上的衣服破旧不堪，即使在这个恶臭的宿舍里，他也能睡得如此香甜——毕竟这是他一天中唯一能休息的时刻。",
        level: 1,
        hp: 10,
        maxHp: 10,
        atk: 1,
        def: 0,
        agi: 1,
        canTalk: false,
        canFight: false,
        hostile: false,
        drops: []
    }

});