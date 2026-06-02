// ============================================================
//  items/items_char_warhorse.js - 骑士战马相关物品
// ============================================================

Object.assign(ITEM_TEMPLATES, {
    warhorse_penis: {
        id: "warhorse_penis",
        name: "骑士战马的阴茎",
        type: "misc",
        desc: "从骑士战马身上取下的阴茎，粗壮而骇人。长度惊人，表面布满粗大的血管，色泽深褐，散发着浓烈的雄性气息。",
        isSeasoning: true
    },
    warhorse_meat: {
        id: "warhorse_meat",
        name: "马肉",
        type: "misc",
        desc: "一大块从骑士战马身上割下的马肉，肉质紧实粗犷，颜色深红，散发着野性的血腥气息。",
        cookable: true,
        ingredientType: "leg",
        resultDish: "warhorse_meat_steak"
    },
    warhorse_head: {
        id: "warhorse_head",
        name: "骑士战马的马头",
        type: "misc",
        desc: "一颗被砍下的战马马头，曾经属于骑士团最勇猛的战马。鬃毛漆黑浓密，眼神已经黯淡无光，嘴唇微张露出坚固的牙齿。即使死后，仍散发着令人敬畏的气势。"
    }
});