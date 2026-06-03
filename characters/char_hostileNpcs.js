// ============================================================
//  characters/char_hostileNpcs.js - 敌对NPC
//  hostile: true，主动攻击玩家
//  监工、发狂矿工、发狂的监工
// ============================================================

Object.assign(CHARACTER_TEMPLATES, {

    // ==================== 监工 ====================
    mine_supervisor: {
        id: "mine_supervisor",
        name: "监工",
        type: "npc",
        desc: "一个身穿制服的监工，手持铁棍，正警惕地注视着矿道出口方向。",
        dialogue: [
            "站住！你以为你能逃出去？",
            "想走？先把今天的矿石交上来！九十九块，一块都不能少！",
            "没有足够的石块，就别想离开这里半步！"
        ],
        repeatDialogue: [
            "还站在这里干什么？还不快去挖矿石！",
            "今天的指标还没完成，别想偷懒！"
        ],
        level: 3,
        hp: 25,
        maxHp: 25,
        atk: 4,
        def: 2,
        agi: 5,
        canTalk: true,
        canFight: true,
        hostile: true,
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