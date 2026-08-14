// ============================================================
//  characters/char_slumNpcs.js - 支线任务6「这里是贫民窟」NPC
//  南门守卫、商人（高个子灰袍人）、愤怒的男人、昏倒的女人
// ============================================================

Object.assign(CHARACTER_TEMPLATES, {

    // ==================== 南门守卫（可战） ====================
    slum_guard: {
        id: "slum_guard",
        name: "南门守卫",
        type: "npc",
        desc: "那名你在木栅栏门见过的守卫，皮甲上沾着泥点和旧血。他握着剑，脸上没有太多表情。",
        dialogue: [
            "「不该看的别看。走你自己的路。」"
        ],
        repeatDialogue: [
            "「别在这片地方逗留。」"
        ],
        hp: 60,
        maxHp: 60,
        atk: 18,
        def: 10,
        agi: 6,
        level: 5,
        canTalk: true,
        canFight: true,
        hostile: false,
        drops: [],
        exp: 50
    },

    // ==================== 商人（高个子灰袍人，可战） ====================
    slum_collector: {
        id: "slum_collector",
        name: "商人",
        type: "npc",
        desc: "一个衣着比贫民窟众人整齐的高个子男人，深灰短袍，皮靴上没有补丁。他面无表情，手里拎着一根染血的铁钎。",
        dialogue: [
            "「这里没有你要找的东西。」"
        ],
        repeatDialogue: [
            "「把路让开。」"
        ],
        hp: 70,
        maxHp: 70,
        atk: 22,
        def: 12,
        agi: 8,
        level: 6,
        canTalk: true,
        canFight: true,
        hostile: false,
        drops: [],
        exp: 60
    },

    // ==================== 愤怒的男人（受害者，不可战） ====================
    angry_man: {
        id: "angry_man",
        name: "愤怒的男人",
        type: "npc",
        desc: "一个年轻男人，蹲在地上半抱着昏迷的女人，全身发抖，眼里是暴怒与绝望。",
        dialogue: [
            "「她不是偷的……她只是饿……」",
            "「求求你……她真的快撑不住了……」"
        ],
        repeatDialogue: [
            "「……帮帮她。」"
        ],
        hp: 10,
        maxHp: 10,
        atk: 2,
        def: 0,
        agi: 0,
        level: 1,
        canTalk: true,
        canFight: false,
        hostile: false,
        drops: [],
        exp: 0
    },

    // ==================== 昏倒的女人（受害者，濒死） ====================
    fainted_woman: {
        id: "fainted_woman",
        name: "昏倒的女人",
        type: "npc",
        desc: "一个年轻女人，额头有血，双眼紧闭，胸口微弱地起伏着。",
        dialogue: [],
        hp: 1,
        maxHp: 1,
        atk: 0,
        def: 0,
        agi: 0,
        level: 1,
        canTalk: false,
        canFight: false,
        hostile: false,
        drops: [],
        exp: 0,
        dismemberable: true,
        limbTemplates: [
            { id: 'mara_head', name: '玛拉的头', count: 1 },
            { id: 'mara_torso', name: '玛拉的躯干', count: 1 },
            { id: 'mara_leg', name: '玛拉的腿', count: 2 },
            { id: 'mara_arm', name: '玛拉的手臂', count: 2 },
            { id: 'mara_hand', name: '玛拉的手', count: 2 },
            { id: 'mara_foot', name: '玛拉的脚', count: 2 },
            { id: 'mara_breast', name: '玛拉的乳房', count: 2 }
        ]
    },

    // ==================== 女贫民（可战，击杀→通用可肢解尸体） ====================
    peasant_female: {
        id: "peasant_female",
        name: "女贫民",
        type: "npc",
        desc: "一个瘦骨嶙峋的女贫民，破旧的衣物勉强蔽体。她缩在阴影里，眼神里满是戒备和恐惧。",
        dialogue: [
            "「别……别过来。我们什么都没有。」"
        ],
        repeatDialogue: [
            "「走开……求你了。」"
        ],
        hp: 15,
        maxHp: 15,
        atk: 2,
        def: 0,
        agi: 3,
        level: 1,
        canTalk: true,
        canFight: true,
        hostile: false,
        drops: [],
        exp: 5
    },

    // ==================== 男贫民（可战） ====================
    peasant_male: {
        id: "peasant_male",
        name: "男贫民",
        type: "npc",
        desc: "一个同样瘦弱的男贫民，颧骨高突，眼神浑浊。他攥着一根木条，却抖得厉害。",
        dialogue: [
            "「走开。这里没你要的东西。」"
        ],
        repeatDialogue: [
            "「别逼我……」"
        ],
        hp: 20,
        maxHp: 20,
        atk: 3,
        def: 0,
        agi: 3,
        level: 1,
        canTalk: true,
        canFight: true,
        hostile: false,
        drops: [],
        exp: 5
    },

    // ==================== 地道中的少女（曼德罗拉/杀手） ====================
    slum_girl: {
        id: "slum_girl",
        name: "女孩",
        type: "npc",
        desc: "一个瘦小的女孩，细瘦的手还沾着灰。她把一根粗大的铁栓插回活板门后，才缓缓转过身看着你。",
        dialogue: [
            "「别出声。他们已经走了。」"
        ],
        repeatDialogue: [
            "「这里暂时安全……至少现在。」"
        ],
        hp: 20,
        maxHp: 20,
        atk: 400,
        def: 0,
        agi: 90,
        level: 1,
        canTalk: true,
        canFight: true,
        hostile: false,
        drops: [],
        exp: 0
    }

});
