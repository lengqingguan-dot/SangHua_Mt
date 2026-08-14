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
        canFight: false,
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
        canFight: false,
        level: 4
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