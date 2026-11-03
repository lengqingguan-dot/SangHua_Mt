// ============================================================
//  characters/char_hostileNpcs.js - 敌对NPC
//  发狂矿工、发狂的监工主动攻击玩家；普通监工保持中立
// ============================================================

Object.assign(CHARACTER_TEMPLATES, {

    // ==================== 监工 ====================
    mine_supervisor: {
        id: "mine_supervisor",
        name: "监工",
        type: "npc",
        desc: "一个身穿制服的监工，手持铁棍，正警惕地注视着矿道出口方向。",
        dialogue: [
            "「往哪儿钻？今天的活干完了？」",
            "「一百块石头，少一块，你今晚就睡在坑里！」",
            "「还愣着干什么？没交齐就滚回去抡镐！」"
        ],
        repeatDialogue: [
            "「又来晃什么？石头呢？」",
            "「一百块！少拿那些碎渣糊弄我，回去干活！」"
        ],
        level: 2,
        hp: 25,
        maxHp: 25,
        atk: 4,
        def: 2,
        agi: 5,
        canTalk: true,
        canFight: true,
        hostile: false,
        drops: ["bread"],
        exp: 10
    },

    // ==================== 发狂矿工 ====================
    mad_miner: {
        id: "mad_miner",
        name: "发狂矿工",
        type: "npc",
        desc: "一个被「疯疫」感染的矿工，双目血红得几乎要滴出血来，眼白布满血丝。\n他的皮肤呈现出病态的灰白色，嘴角流淌着混杂着血沫的涎水，指甲全部断裂，手指上满是抓挠岩壁留下的伤痕。\n他已经完全失去了理智，嘴里发出野兽般的嘶吼，手中紧握着一把染血的铁镐。\n这就是「疯疫」感染者的下场——双目血红、见人就杀，彻底沦为野兽。",
        level: 2,
        hp: 20,
        maxHp: 20,
        atk: 3,
        def: 1,
        agi: 4,
        canTalk: true,
        canFight: true,
        hostile: true,
        drops: ["herb"],
        exp: 10
    },

    // ==================== 发狂的监工 ====================
    mad_supervisor: {
        id: "mad_supervisor",
        name: "发狂的监工",
        type: "npc",
        desc: "一个被「疯疫」感染的监工，原本整洁的制服已被撕裂，沾满血迹和泥土。\n他的双目血红，曾经威严的面容如今扭曲成狰狞的野兽模样。\n手中紧握着一根染血的铁棍，疯狂地挥舞着，嘴里发出不似人声的咆哮。\n即使沦为感染者，他仍保留着监工时期的暴虐本性。",
        level: 3,
        hp: 30,
        maxHp: 30,
        atk: 6,
        def: 3,
        agi: 4,
        canTalk: true,
        canFight: true,
        hostile: true,
        drops: ["iron_stick"],
        exp: 20
    }

});
