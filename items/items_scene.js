// ============================================================
//  items/items_scene.js - 场景物品模板
// ============================================================

Object.assign(ITEM_TEMPLATES, {

    karen_church_door: { id: "karen_church_door", name: "卡伦教堂大门", type: "portal", desc: "一扇沉重的木门，门板上钉着粗大的铁箍和铁钉。门上没有窗户，只有一道细窄的窥视孔。门后隐约传来管风琴的乐声和唱诗班的圣咏。", usable: true, customAction: true, notPickable: true },
    karen_church_back_door: { id: "karen_church_back_door", name: "卡伦教堂后门", type: "portal", desc: "圣坛后方的窄门，门框上的铜牌刻着「教堂后门」。门缝间透出一丝冷风，似乎通向户外。", usable: true, customAction: true, notPickable: true },

    // ========== 梯子类 ==========
    basement_ladder_up: {
        id: "basement_ladder_up",
        name: "木梯（上行）",
        type: "misc",
        desc: "一架通往森林的木梯，固定在地下室的天花板上。顺着它爬上去可以回到地面。",
        usable: true,
        customAction: true,
        notPickable: true
    },
    ladder: {
        id: "ladder",
        name: "木梯（上行）",
        type: "misc",
        desc: "一架通往地面的木梯，固定在矿道顶部。似乎需要搬够足够的石块作为「交代」才能离开...",
        usable: true,
        customAction: true
    },
    ladder_surface: {
        id: "ladder_surface",
        name: "木梯（下行）",
        type: "misc",
        desc: "一架通往地下的木梯，你可以顺着它回到矿道中。",
        usable: true,
        customAction: true
    },
    ladder_mine_exit_1: {
        id: "ladder_mine_exit_1",
        name: "木梯（下行）",
        type: "misc",
        desc: "一架通往地下的木梯，你可以顺着它进入一号矿道。",
        usable: true,
        customAction: true
    },
    ladder_1: {
        id: "ladder_1",
        name: "木梯（上行）",
        type: "misc",
        desc: "一架通往地面的木梯。",
        usable: true,
        customAction: true
    },
    ladder_mine_exit_3: {
        id: "ladder_mine_exit_3",
        name: "木梯（下行）",
        type: "misc",
        desc: "一架通往地下的木梯，你可以顺着它进入三号矿道。",
        usable: true,
        customAction: true
    },
    ladder_3: {
        id: "ladder_3",
        name: "木梯（上行）",
        type: "misc",
        desc: "一架通往地面的木梯。",
        usable: true,
        customAction: true
    },
    ladder_to_attic: {
        id: "ladder_to_attic",
        name: "木梯（上行）",
        type: "misc",
        desc: "一架陈旧的木梯，通向天花板上的阁楼。梯子看起来有些年头了，但还算结实。",
        usable: true,
        customAction: true
    },
    ladder_from_attic: {
        id: "ladder_from_attic",
        name: "木梯（下行）",
        type: "misc",
        desc: "一架陈旧的木梯，通向下方的三层走廊。",
        usable: true,
        customAction: true
    },
    removed_ladder: {
        id: "removed_ladder",
        name: "撤走的梯子",
        type: "misc",
        desc: "一架从其他矿道撤下来的木梯，虽然有些破旧但还能使用。据字条所说，这是为了封锁疯疫而撤走的。可以在四号矿道出口和四号矿井口之间来回传送。",
        usable: true,
        customAction: true
    },

    // ========== 楼梯类 ==========
    spiral_stairs_north: {
        id: "spiral_stairs_north",
        name: "旋转楼梯（上行）",
        type: "misc",
        desc: "一座精美的螺旋形楼梯，扶手雕刻着复杂的花纹。楼梯盘旋向上，通往宅邸的二层。",
        usable: true,
        customAction: true
    },
    spiral_stairs_north_2f: {
        id: "spiral_stairs_north_2f",
        name: "旋转楼梯（下行）",
        type: "misc",
        desc: "一座精美的螺旋形楼梯，扶手雕刻着复杂的花纹。楼梯盘旋向下，通往宅邸的一层。",
        usable: true,
        customAction: true
    },
    spiral_stairs_south: {
        id: "spiral_stairs_south",
        name: "旋转楼梯（上行）",
        type: "misc",
        desc: "一座精美的螺旋形楼梯，扶手雕刻着复杂的花纹。楼梯盘旋向上，通往宅邸的二层。",
        usable: true,
        customAction: true
    },
    spiral_stairs_south_2f: {
        id: "spiral_stairs_south_2f",
        name: "旋转楼梯（下行）",
        type: "misc",
        desc: "一座精美的螺旋形楼梯，扶手雕刻着复杂的花纹。楼梯盘旋向下，通往宅邸的一层。",
        usable: true,
        customAction: true
    },
    stairs_to_cellar: {
        id: "stairs_to_cellar",
        name: "楼梯（下行）",
        type: "misc",
        desc: "一个通往地下酒窖的石阶楼梯，楼梯两侧的墙壁上挂着昏暗的壁灯，空气中弥漫着陈年的酒香。",
        usable: true,
        customAction: true
    },
    stairs_from_cellar: {
        id: "stairs_from_cellar",
        name: "楼梯（上行）",
        type: "misc",
        desc: "一个通往宅邸一层的石阶楼梯，上方的光线隐约可见。",
        usable: true,
        customAction: true
    },
    stairs_to_third_floor: {
        id: "stairs_to_third_floor",
        name: "旋转楼梯（上行）",
        type: "misc",
        desc: "一座精美的螺旋形楼梯，扶手雕刻着复杂的花纹。楼梯盘旋向上，通往宅邸的三层。",
        usable: true,
        customAction: true
    },
    stairs_to_second_floor: {
        id: "stairs_to_second_floor",
        name: "旋转楼梯（下行）",
        type: "misc",
        desc: "一座精美的螺旋形楼梯，扶手雕刻着复杂的花纹。楼梯盘旋向下，通往宅邸的二层。",
        usable: true,
        customAction: true
    },
    stairs_to_hut_floor2: {
        id: "stairs_to_hut_floor2",
        name: "楼梯（上行）",
        type: "misc",
        desc: "一个通往木屋二层的木质楼梯，楼梯有些老旧，踩上去会发出吱呀的声响。",
        usable: true,
        customAction: true
    },
    stairs_to_hut_floor1: {
        id: "stairs_to_hut_floor1",
        name: "楼梯（下行）",
        type: "misc",
        desc: "一个通往木屋一层的木质楼梯，楼梯有些老旧，踩上去会发出吱呀的声响。",
        usable: true,
        customAction: true
    },

    // ========== 门类 ==========
    heavy_wooden_door: {
        id: "heavy_wooden_door",
        name: "厚重的木门",
        type: "misc",
        desc: "一扇由厚重橡木制成的门，表面雕刻着精美的花纹。门锁看起来非常坚固，但也许可以用蛮力破坏...",
        usable: true,
        customAction: true
    },
    broken_wooden_door: {
        id: "broken_wooden_door",
        name: "被破坏的木门",
        type: "misc",
        desc: "一扇被破坏的橡木门，门板上布满了裂痕和凹痕，锁具已经完全损坏，无力地挂在门框上。"
    },
    medium_wooden_door: {
        id: "medium_wooden_door",
        name: "紧锁的房门",
        type: "misc",
        desc: "一扇上锁的房门，看起来没有宅邸后门的木门那么厚重，但门锁依然坚固。也许可以用蛮力破坏...",
        usable: true,
        customAction: true
    },
    broken_medium_door: {
        id: "broken_medium_door",
        name: "被破坏的房门",
        type: "misc",
        desc: "一扇被破坏的房门，锁具已经崩坏，门轴也松动了，无力地半开着。"
    },
    mansion_gate_door: {
        id: "mansion_gate_door",
        name: "伯爵宅邸大门",
        type: "misc",
        desc: "一座宏伟的石制大门，由厚重的橡木制成，表面镶嵌着铁艺花纹。需要使用伯爵宅邸钥匙才能进入。",
        usable: true,
        customAction: true
    },
    side_gate_door: {
        id: "side_gate_door",
        name: "矿场侧门",
        type: "misc",
        desc: "一扇生锈的铁门，门上的油漆早已剥落。需要使用矿场侧门钥匙才能打开通往森林的秘密通道。",
        usable: true,
        customAction: true
    },
    hut_door: {
        id: "hut_door",
        name: "木屋门",
        type: "misc",
        desc: "一扇老旧的木门，通向悬崖。",
        usable: true,
        customAction: true
    },

    // ========== 雕像类 ==========
    randolph_statue: {
        id: "randolph_statue",
        name: "兰德尔一世雕像",
        type: "misc",
        desc: "雕像为超过真人两倍大小的青铜立像，底座用黑色花岗岩制成，底座正面刻着铭文：\n「维克多·兰德尔一世\n桑华山之主、矿场奠基者\n以铁与血铸就兰德尔荣耀」\n雕像姿态为站姿，左脚微微向前，右手高举矿镐权杖指向天空，左手按在腰间佩剑上，目光直视前方，表情冷酷而充满征服欲。斗篷被设计成被风吹起的动态效果，增加威严感。",
        usable: true,
        customAction: true,
        breakable: true,
        requiredDamage: 50
    },
    randolph_statue_fallen: {
        id: "randolph_statue_fallen",
        name: "倒塌的兰德尔一世雕像",
        type: "misc",
        desc: "曾经威严的兰德尔一世雕像现在倒在草坪上，青铜身躯扭曲变形，矿镐权杖断裂在一旁。底座的花岗岩碎裂成几块，铭文依稀可辨，却再也无人敬畏。"
    },

    // ========== 设施类 ==========
    stone_wall: {
        id: "stone_wall",
        name: "石壁",
        type: "misc",
        desc: "一面粗糙的岩壁，上面布满了凿痕和裂缝。似乎可以挖掘出石块。",
        usable: true,
        customAction: true
    },
    leaf_pile: {
        id: "leaf_pile",
        name: "落叶堆",
        type: "misc",
        desc: "地上堆积着厚厚的一层枯叶，看起来有些不自然。\n似乎有人刻意用落叶掩盖了什么。",
        usable: true,
        customAction: true,
        notPickable: true
    },
    tunnel_entrance: {
        id: "tunnel_entrance",
        name: "地道",
        type: "misc",
        desc: "落叶被扫开后，露出一个黑漆漆的地道入口。\n一股潮湿的凉风从洞口涌出，隐约能听到水流的声音。",
        usable: true,
        customAction: true,
        notPickable: true
    },
    teleport_circle: {
        id: "teleport_circle",
        name: "传送阵",
        type: "misc",
        desc: "地面上刻着一个古老的魔法阵，散发着幽蓝色的光芒。\n阵法中心的符文不断旋转，似乎连接着某个未知的地方。",
        usable: true,
        customAction: true,
        notPickable: true
    },
    iron_lock: {
        id: "iron_lock",
        name: "铁锁",
        type: "misc",
        desc: "一把沉重的大铁锁，锁链缠绕在木板和铁丝网上，牢牢封锁着四号矿井口。锁身布满锈迹，看起来已经有些年头了。",
        usable: true,
        customAction: true
    },
    dynamite: {
        id: "dynamite",
        name: "雷管",
        type: "misc",
        desc: "一捆用油纸包裹的雷管，旁边还有一段导火索。这是矿工用来爆破岩石的工具，威力足以炸开封堵的岩壁。",
        usable: true,
        customAction: true
    },
    wardrobe: {
        id: "wardrobe",
        name: "壁橱",
        type: "misc",
        desc: "一个古旧的壁橱，看起来可以翻找一些东西。",
        usable: true,
        customAction: true,
        notPickable: true
    },
    stove: {
        id: "stove",
        name: "炉灶",
        type: "misc",
        desc: "一个用砖块砌成的简陋炉灶，里面还残留着余烬。可以用来烹饪食物...或者加热某些「特殊」的食材。",
        usable: true,
        customAction: true
    },
    workbench: {
        id: "workbench",
        name: "工作台",
        type: "misc",
        desc: "一张厚重的铁匠工作台，台面上布满了锤击的凹痕和烧灼的黑色印记。\n台面上散落着一些铁片、铆钉和磨刀石，旁边还有一把铁钳和几根粗铁条。\n台面下方的架子上堆放着各种矿石原料和半成品武器。\n工作台一侧安装着一个简易的虎钳，另一侧摆放着一把沉重的铁锤。\n看起来可以用这里的工具和材料锻造武器。",
        usable: true,
        customAction: true,
        notPickable: true
    },
    milker: {
        id: "milker",
        name: "榨奶器",
        type: "misc",
        desc: "一台精致的金属榨奶器，由两个半球形吸杯和手柄组成。可以用来从乳房中榨取乳汁。",
        usable: true,
        customAction: true
    },
    wooden_hut: {
        id: "wooden_hut",
        name: "木屋",
        type: "misc",
        desc: "一座古老的木屋矗立在悬崖边缘，看起来已经有些年头了。木屋的门虚掩着，似乎可以进入。",
        usable: true,
        customAction: true
    },
    slum_hut: {
        id: "slum_hut",
        name: "窝棚",
        type: "portal",
        desc: "一间低矮破旧的窝棚，木板和破布拼凑成的门虚掩着。里面透出潮湿的霉味，似乎能进去。",
        usable: true,
        customAction: true,
        notPickable: true
    },
    slum_trapdoor: {
        id: "slum_trapdoor",
        name: "活板门",
        type: "portal",
        desc: "地板下的一扇活板门，门板与地面的稻草几乎融为一体。掀开它似乎能通往窝棚下方。",
        usable: true,
        customAction: true,
        notPickable: true
    },
    slum_trapdoor_exit: {
        id: "slum_trapdoor_exit",
        name: "活板门",
        type: "portal",
        desc: "头顶上方的一扇活板门，插着一根粗大的铁栓。推开它就能回到上面的窝棚。",
        usable: true,
        customAction: true,
        notPickable: true
    },
    iron_gate: {
        id: "iron_gate",
        name: "大铁门",
        type: "portal",
        desc: "一扇沉重的大铁门，表面锈迹斑斑，中央嵌着一枚骷髅形状的锁孔。似乎需要一把特殊的钥匙才能打开。",
        usable: true,
        customAction: true,
        notPickable: true
    },
    bounty_board: {
        id: "bounty_board",
        name: "悬赏板",
        type: "misc",
        desc: "一块钉在墙上的木板，上面贴满了写满名字与星级的通缉令。靠近它，你仿佛能闻到一种隐秘而危险的气息。",
        usable: true,
        customAction: true,
        notPickable: true
    },
    ruins_burned: {
        id: "ruins_burned",
        name: "熄灭的废墟",
        type: "misc",
        desc: "一片被烧得焦黑的废墟，只剩下几根歪斜的焦木和坍塌的土墙。灰烬早已冷透，闻不出一丝烟味。",
        notPickable: true
    },
    peasant_hut_1: {
        id: "peasant_hut_1",
        name: "窝棚",
        type: "portal",
        desc: "一间低矮破旧的窝棚，木板和破布拼凑成的门虚掩着。里面透出潮湿的霉味，似乎能进去。",
        usable: true, customAction: true, notPickable: true
    },
    peasant_hut_2: {
        id: "peasant_hut_2",
        name: "窝棚",
        type: "portal",
        desc: "一间低矮破旧的窝棚，木板和破布拼凑成的门虚掩着。里面透出潮湿的霉味，似乎能进去。",
        usable: true, customAction: true, notPickable: true
    },
    peasant_hut_3: {
        id: "peasant_hut_3",
        name: "窝棚",
        type: "portal",
        desc: "一间低矮破旧的窝棚，木板和破布拼凑成的门虚掩着。里面透出潮湿的霉味，似乎能进去。",
        usable: true, customAction: true, notPickable: true
    },
    peasant_hut_4: {
        id: "peasant_hut_4",
        name: "窝棚",
        type: "portal",
        desc: "一间低矮破旧的窝棚，木板和破布拼凑成的门虚掩着。里面透出潮湿的霉味，似乎能进去。",
        usable: true, customAction: true, notPickable: true
    },

    // ========== 场景出口 ==========
    karen_town: {
        id: "karen_town",
        name: "卡伦镇",
        type: "scene",
        desc: "一个宁静的小镇，是你逃离矿场后的第一个目的地。",
        interactive: true,
        notPickable: true
    },
    sanghuashan_mine: {
        id: "sanghuashan_mine",
        name: "桑华山矿场",
        type: "scroll",
        desc: "你曾经被困的地方，现在已经成为你不堪回首的记忆。",
        usable: true,
        notPickable: true
    }
});