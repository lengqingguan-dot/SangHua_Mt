// ============================================================
//  items/items_char_elaine.js - 艾琳·维斯特（抄写员之女）的肢体与尸体
// ============================================================

Object.assign(ITEM_TEMPLATES, {

    elaine_head: {
        id: "elaine_head",
        name: "艾琳的头",
        type: "limb",
        rarity: "good",
        score: 60,
        desc: "艾琳的头颅。褐色齐肩短发凌乱地贴在脸颊上，发尾被泪水和汗渍打得微翘。她的眼睛大而圆，褐色的瞳孔在死亡里失了神，眼眶却依旧红得透彻，像被人用手狠狠揉过。断口处还凝着没干透的血。"
    },

    elaine_torso: {
        id: "elaine_torso",
        name: "艾琳的躯干",
        type: "limb",
        rarity: "good",
        score: 60,
        desc: "艾琳的躯干。她的身量偏瘦，久坐抄写的肩膀微微内扣，白色衬衫早已皱作一团。腹部平坦，皮肤在日照不足里透出病态的苍白，断口处翻出的肋骨与肌肉在光线下显得格外清晰。"
    },

    elaine_leg: {
        id: "elaine_leg",
        name: "艾琳的腿",
        type: "limb",
        rarity: "good",
        score: 60,
        desc: "艾琳的腿。不算十分修长，却有着年轻女孩的柔韧线条。膝盖微红，像刚刚跪过。格子短裙的裙摆还半卷在大腿上方，断面处露出白净的腿骨与淡红的肌肉。"
    },

    elaine_arm: {
        id: "elaine_arm",
        name: "艾琳的手臂",
        type: "limb",
        rarity: "good",
        score: 60,
        desc: "艾琳的手臂。细瘦，腕骨突出，小臂上还沾着几点没洗掉的墨渍。这只手臂曾整夜整夜地伏案抄写，此刻却软软地摊着，指尖蜷曲，像还想握住那支写不出完整句子的笔。"
    },

    elaine_hand: {
        id: "elaine_hand",
        name: "艾琳的手",
        type: "limb",
        rarity: "good",
        score: 60,
        desc: "艾琳的手。十指纤长，中指和拇指处生着常年握笔留下的薄茧，指甲缝里嵌着灰黑的墨。她的手在死前还死死攥着桌沿，虎口和指节都泛着用力过度的白。"
    },

    elaine_foot: {
        id: "elaine_foot",
        name: "艾琳的脚",
        type: "limb",
        rarity: "good",
        score: 60,
        desc: "艾琳的脚，36码。脚型小巧，脚背清瘦。棕色的鞋早已不知去向，只留下浅淡的磨损。脚趾微微蜷缩，脚踝的皮肤薄得能看见下面的青筋。"
    },

    elaine_breast: {
        id: "elaine_breast",
        name: "艾琳的乳房",
        type: "limb",
        rarity: "good",
        score: 60,
        desc: "艾琳的乳房，A罩杯。不大，却有着少女尚未完全长开的柔和轮廓。衬衫下的皮肤白得发青，乳尖因死亡而失去血色，断口处露出浅黄的脂肪与暗红的胸肌。"
    },

    elaine_corpse: {
        id: "elaine_corpse",
        name: "艾琳的尸体",
        type: "limb",
        desc: "艾琳・维斯特的尸体。她蜷在冰冷的木地板上，褐色短发散乱地遮住半边脸，眼眶的红痕还隐约可见。那张曾因哭泣而湿透的脸上，此刻只剩下没有生气的苍白。",
        usable: true,
        customAction: true,
        dismemberable: true,
        loot: ["bread"],
        corpseStory: [
            "你蹲下来看艾琳的尸体。她的身体还保持着一种蜷缩的姿势，像要把所有的悲伤都收进最小的范围里。",
            "桌上的羊皮纸还摊着，墨迹已经被水和时间洇成了一团化不开的黑。",
            "她终究没能走出这间屋子。而那句「明天天亮之前回来」，也再没有人会等下去了。"
        ]
    }

});