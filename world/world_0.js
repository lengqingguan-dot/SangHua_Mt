// ============================================================
//  世界地图数据库 - 所有房间的定义
// ============================================================

const WORLD_TEMPLATE = {
    // ========== 房间编号对照表 ==========
    // 1-5: 二号矿井区域
    // 6-7: 石子路1-2
    // 8-12: 一号矿井区域
    // 13-14: 石子路3-4
    // 15-19: 三号矿井区域
    // 20-21: 石子路5-6
    // 22-26: 四号矿井区域（口、出口、北、东、西）
    // 27-33: 西侧矿道1-7
    // 34: 四号矿道南
    // 35-36: 石子路7-8（四号矿井口东侧）
    // 15-16: 石子路15-16（石子路8东侧）
    // workshop: 工作坊（石子路16东侧）
    // 37: 石子路9（通往食堂）
    // 38: 食堂大门
    // 39: 食堂大厅
    // 40: 厨房
    // 41: 石子路10（通往宿舍）
    // 42: 宿舍大门
    // 43-44: 石子路11-12（一号矿井口西侧）
    // 45: 矿场大门
    // 46-47: 小路1-2（通往侧门）
    // 48: 侧门
    // 49-50: 石子路13-14（通往骑士住所）
    // 51: 骑士住所大门
    // 52: 训练场
    // 53: 骑士住所
    // 森林区域（54-106）：
    // 54: forest_start（森林起点）
    // 55-58: forest_1_e1-4（森林第1行东侧）
    // 59-62: forest_1_w1-4（森林第1行西侧）
    // 63: forest_2_center（森林第2行中心）
    // 64-67: forest_2_e1-4（森林第2行东侧）
    // 68-71: forest_2_w1-4（森林第2行西侧）
    // 72: forest_3_center（森林第3行中心）
    // 73-76: forest_3_e1-4（森林第3行东侧）
    // 77-80: forest_3_w1-4（森林第3行西侧）
    // 81: forest_4_center（森林第4行中心）
    // 82-85: forest_4_e1-4（森林第4行东侧）
    // 86-89: forest_4_w1-4（森林第4行西侧）
    // 90: deep_forest_1_center（深林第5行中心，7房间）
    // 91-93: deep_forest_1_e1-3（深林第5行东侧）
    // 94-96: deep_forest_1_w1-3（深林第5行西侧）
    // 97: deep_forest_2_center（深林第6行中心，5房间）
    // 98-99: deep_forest_2_e1-2（深林第6行东侧）
    // 100-101: deep_forest_2_w1-2（深林第6行西侧）
    // 102: deep_forest_3_center（深林第7行中心，3房间）
    // 103: deep_forest_3_e1（深林第7行东侧）
    // 104: deep_forest_3_w1（深林第7行西侧）
    // 105: cliff（悬崖）
    // 106: hut_floor1（木屋一层）
    // 山路区域（107-126）：
    // 107-110: 山路1-4（矿场大门西侧）
    // 111: mansion_gate（伯爵宅邸大门）
    // 112: fence_gate（围栏门，森林第4行西侧）
    // 113: garden_center（花园中心）
    // 114: garden_south（花园南侧）
    // 115: garden_north（花园北侧）
    // 116: greenhouse（温室）
    // 117: mansion_back_door（伯爵宅邸后门，温室西侧）
    // 118: corridor_center（一层走廊中心）
    // 119: corridor_west（一层走廊西侧）
    // 120: corridor_west_2（一层走廊西侧第二间）
    // 121: corridor_north（一层走廊北侧）
    // 122: corridor_north_2（一层走廊北侧第二间，有旋转楼梯）
    // 123: corridor_south（一层走廊南侧）
    // 124: corridor_south_2（一层走廊南侧第二间，有旋转楼梯）
    // 125: mansion_hall（宅邸大厅）
    // 126: mansion_front_yard（宅邸前院）
    // 二层走廊区域（127-131）：
    // 127: second_floor_north（二层走廊北侧，旋转楼梯上来）
    // 128: second_floor_1（二层走廊房间1）
    // 129: second_floor_2（二层走廊房间2）
    // 130: second_floor_3（二层走廊房间3）
    // 131: second_floor_4（二层走廊房间4，最南侧，有旋转楼梯）
    // 宅邸功能房间（132-145）：
    // 132: maid_room（女仆房间，corridor_south西侧）
    // 133: dining_room（用餐室，corridor_north西侧）
    // 134: mansion_kitchen（厨房，用餐室西侧）
    // 135: reception_room（会客室，corridor_west北侧）
    // 136: bathroom（卫生间，corridor_west南侧）
    // 137: storage_room（储藏室，corridor_south东侧）
    // 138: terrace（露台，second_floor_2东侧）
    // 139: countess_bedroom（伯爵夫人卧室，second_floor_3西侧）
    // 140: daughter_bedroom（伯爵女儿卧室，second_floor_1西侧）
    // 141: study（书房，second_floor_north西侧）
    // 142: third_floor_center（三层走廊中心）
    // 143: count_bedroom（伯爵卧室，三层西侧）
    // 144: third_floor_north（三层走廊北侧）
    // 145: attic（阁楼）
    // ====================================

    // [1] 二号矿井深处（起点）
    mine_deep: {
        name: "二号矿井深处",
        desc: "矿道在这里戛然而止，四周是粗糙的岩壁，空气中弥漫着煤尘和铁锈味。\n昏暗的油灯勉强照亮你脚下的碎石。\n南边的石壁上布满了凿痕，似乎可以挖掘。\n北边隐隐透来一丝凉风——那是唯一的出路。",
        exits: { north: "mine_tunnel" },
        items: ["stone", "stone_wall"],  // 使用英文ID
        npcs: []
    },
    // 矿道
    mine_tunnel: {
        name: "矿道",
        desc: "一条狭窄的矿道，支撑木已经腐朽，头顶不时落下细碎的石屑。\n南边是矿井深处，北方隐约有脚步声和锁链声...",
        exits: { north: "north_tunnel", south: "mine_deep" },
        items: ["stone"],
        npcs: ["tired_miner"]  // 使用英文ID
    },
    // 北侧矿道
    north_tunnel: {
        name: "北侧矿道",
        desc: "一条狭窄的矿道，支撑木已经腐朽，头顶不时落下细碎的石屑。\n南边是矿道，北方隐约有脚步声和锁链声...",
        exits: { north: "tunnel_exit", south: "mine_tunnel" },
        items: ["stone"],
        npcs: []
    },
    // [4] 二号矿道出口
    tunnel_exit: {
        name: "二号矿道出口",
        desc: "矿道在这里到达尽头，头顶是一块松动的石板——那是一条通往地面的隐秘通道。\n一架陈旧的、锈迹斑斑的铁梯斜靠在岩壁上。\n南边是北侧矿道。",
        exits: { south: "north_tunnel", up: "mine_exit" },
        items: ["ladder"],
        npcs: ["mine_supervisor"]
    },
    // [9] 一号矿道出口
    tunnel_exit_1: {
        name: "一号矿道出口",
        desc: "一条相对宽敞的矿道，地上铺着木板，不时传来滴水声。\n一架木梯靠在角落，通往地面。\n南边是一条幽深的矿道，黑暗中传来细微的滴水声。",
        exits: { up: "mine_exit_1", south: "north_tunnel_1" },
        items: ["ladder_1"],
        npcs: ["aisha"]
    },
    // 北侧矿道（一号矿道）
    north_tunnel_1: {
        name: "北侧矿道",
        desc: "一条狭窄的矿道，岩壁上渗着水珠，地面湿滑。\n支撑木看起来比二号矿道的还要腐朽，头顶的岩层不时发出不祥的声响。\n北边是一号矿道出口，南边延伸向更深的黑暗。",
        exits: { north: "tunnel_exit_1", south: "tunnel_1" },
        items: ["stone"],
        npcs: []
    },
    // 矿道（一号矿道中段）
    tunnel_1: {
        name: "矿道",
        desc: "矿道在这里变得更加狭窄，只能容一人侧身通过。\n空气浑浊，混杂着霉味和某种说不清的铁锈气息。\n岩壁上残留着一些模糊的凿痕，似乎是前人留下的标记。\n北边是北侧矿道，南边通向未知深处。",
        exits: { north: "north_tunnel_1", south: "mine_deep_1" },
        items: ["stone"],
        npcs: []
    },
    // 一号矿道深处
    mine_deep_1: {
        name: "一号矿道深处",
        desc: "矿道在这里戛然而止，四周是裸露的岩壁，地上散落着破碎的镐头和生锈的矿车零件。\n空气中弥漫着一股潮湿的霉味，角落里积着一滩发黑的水。\n这里似乎曾是一处采矿作业面，但早已被废弃。\n北边是唯一的出路。",
        exits: { north: "tunnel_1" },
        items: ["stone", "broken_pickaxe"],
        npcs: []
    },
    // 二号矿井口（地表）
    mine_exit: {
        name: "二号矿井口",
        desc: "矿道口豁然敞开，夜风灌进来，凉得人一激灵。\n月光铺在山坡的碎石上，泛着灰蒙蒙的白，即使是夜晚，月光也比井下的油灯亮堂得多。\n远处草丛里的虫鸣声细细的，时断时续，远处传来叫喊声与打骂声。\n不过最重要的是提醒着你此刻境遇的探照灯，正凶恶地扫过任何不工作的、想要逃跑的工人。",
        exits: { down: "tunnel_exit", west: "stone_road", east: "stone_road_3" },
        items: ["ladder_surface"],
        npcs: []
    },
    // 石子路1
    stone_road: {
        name: "石子路",
        desc: "石子路从井口延伸出去，月光下白惨惨的，碎石踩上去咔咔响。\n路两边什么都没有，就连野草都长得很稀疏。\n风从山口灌进来，贴着地皮呜呜地刮过，吹得你脸颊发疼。",
        exits: { east: "mine_exit", west: "stone_road_2" },
        items: [],
        npcs: []
    },
    // 石子路2
    stone_road_2: {
        name: "石子路",
        desc: "石子路从井口延伸出去，月光下白惨惨的，碎石踩上去咔咔响。\n路两边什么都没有，就连野草都长得很稀疏。\n风从山口灌进来，贴着地皮呜呜地刮过，吹得你脸颊发疼。",
        exits: { east: "stone_road", west: "mine_exit_1" },
        items: [],
        npcs: []
    },
    // 石子路3（二号矿井口东侧）
    stone_road_3: {
        name: "石子路",
        desc: "石子路沿着山坡蜿蜒向东，月光将路面照得惨白。\n路边的灌木丛在风中沙沙作响，偶尔传来夜枭的啼叫声。\n西边是二号矿井口，东边继续延伸。",
        exits: { west: "mine_exit", east: "stone_road_4" },
        items: [],
        npcs: []
    },
    // 石子路4
    stone_road_4: {
        name: "石子路",
        desc: "石子路在这里略微收窄，路面坑洼不平。\n远处的探照灯光偶尔扫过，让你不得不贴着岩壁前行。\n西边是来的路，东边隐约可见另一处矿井口的轮廓。",
        exits: { west: "stone_road_3", east: "mine_exit_3" },
        items: [],
        npcs: []
    },
    // 三号矿井口（地表）
    mine_exit_3: {
        name: "三号矿井口",
        desc: "第三处矿道出口，与一号、二号矿井口格局相同。\n夜风从井口灌出，带着地下潮湿的霉味。\n一架木梯斜靠在井壁旁，通向幽深的三号矿道。",
        exits: { down: "tunnel_exit_3", west: "stone_road_4", east: "stone_road_5" },
        items: ["ladder_mine_exit_3"],
        npcs: []
    },
    // 三号矿道出口（地下）
    tunnel_exit_3: {
        name: "三号矿道出口",
        desc: "三号矿道的入口处，岩壁上还残留着新开采的痕迹。\n一架木梯靠在角落，通往地面。\n南边是一条幽深的矿道，黑暗中传来细微的气流声。",
        exits: { up: "mine_exit_3", south: "north_tunnel_3" },
        items: ["ladder_3"],
        npcs: []
    },
    // 北侧矿道（三号矿道）
    north_tunnel_3: {
        name: "北侧矿道",
        desc: "一条相对规整的矿道，支撑木看起来还算结实。\n地上散落着一些矿石碎屑，似乎是近期开采留下的。\n北边是三号矿道出口，南边延伸向深处。",
        exits: { north: "tunnel_exit_3", south: "tunnel_3" },
        items: ["stone"],
        npcs: []
    },
    // 矿道（三号矿道中段）
    tunnel_3: {
        name: "矿道",
        desc: "矿道在这里变得狭窄，岩壁上的油灯已经熄灭，只有远处传来微弱的光亮。\n空气中弥漫着一股硫磺的味道，让人有些头晕。\n北边是北侧矿道，南边通向矿道尽头。",
        exits: { north: "north_tunnel_3", south: "mine_deep_3" },
        items: ["stone"],
        npcs: []
    },
    // 三号矿道深处
    mine_deep_3: {
        name: "三号矿道深处",
        desc: "矿道在这里到达尽头，四周是裸露的煤层，地上堆放着一些废弃的矿车。\n角落里有一滩积水，水面倒映着头顶的岩壁，显得幽深而寂静。\n在东边的岩壁上，你注意到有一堆松动的岩石，似乎是人工堆积的封堵物。\n旁边的木箱里放着一些探矿物资...\n这里似乎还在开采中，但今晚没有工人。\n北边是唯一的出路。",
        exits: { north: "tunnel_3" },
        items: ["stone", "iron_ore", "dynamite"],
        npcs: []
    },
        collapsed_wall: {
        name: "坍塌的岩壁",
        desc: "一堵由松动岩石和碎石堆积而成的封堵墙，将四号矿道与隔壁的三号矿道牢牢分隔开来。\n岩壁严严实实，没有任何缝隙可以穿过。\n如果有足够威力的工具，或许可以炸开...",
        exits: {},
        items: [],
        npcs: [],
        blocked: true  // 标记为阻塞状态
    },
    // 石子路5（三号矿井口东侧）
    stone_road_5: {
        name: "石子路",
        desc: "石子路继续向东延伸，路面变得更加崎岖。\n远处的山峦在月光下呈现出狰狞的轮廓，风声在峡谷间回荡。\n西边是三号矿井口，东边还有很长的路要走。",
        exits: { west: "mine_exit_3", east: "stone_road_6" },
        items: [],
        npcs: []
    },
    // 石子路6
    stone_road_6: {
        name: "石子路",
        desc: "石子路在这里拐了个弯，前方隐约可见一处被木板和铁丝网封锁的井口。\n路边的警示牌上写着「危险区域，禁止入内」。\n西边是来的路，东边是被封锁的四号矿井口。",
        exits: { west: "stone_road_5", east: "mine_exit_4" },
        items: [],
        npcs: []
    },
    // 四号矿井口（地表 - 被封锁）
    mine_exit_4: {
        name: "四号矿井口",
        desc: "一处被完全封锁的矿井口。\n厚重的木板和生锈的铁丝网将井口封得严严实实，上面还缠绕着几道铁链，挂着一把大锁。\n木板上的封条已经泛黄，隐约可见「疯疫区域 禁止入内」几个血红的字迹。\n据说昨天夜里这里挖出了什么东西，一夜之间矿坑里的人都感染了名为「疯疫」的未知瘟疫。\n西边是石子路，东边延伸向矿场深处，下方被封锁无法通行。",
        exits: { west: "stone_road_6", east: "stone_road_7" },
        items: ["iron_lock"],
        npcs: []
    },
    // 石子路7（四号矿井口东侧）
    stone_road_7: {
        name: "石子路",
        desc: "石子路从四号矿井口延伸出来，路面坑洼不平，碎石在月光下泛着惨白的光。\n路边的野草稀疏枯黄，偶尔有夜风从山口灌进来，带着一股说不清的腐朽气息。\n西边是四号矿井口，东边继续延伸。",
        exits: { west: "mine_exit_4", east: "stone_road_8" },
        items: [],
        npcs: []
    },
    // 四号矿道出口（地下）
    tunnel_exit_4: {
        name: "四号矿道出口",
        desc: "你从一个狭窄的竖井跌落至此，四周弥漫着浓重的腐臭味和血腥气息。\n这里的矿道比其他的都要古老，岩壁上布满了奇怪的凿痕和暗红色的污渍——那似乎是干涸的血迹。\n头顶是遥不可及的井口，只有一丝微弱的光线从上方渗透下来。\n地上散落着破碎的矿灯和撕裂的衣物，仿佛这里曾发生过惨烈的搏斗。\n矿道向各个方向延伸，消失在黑暗中，深处隐约传来细微的嘶吼声。",
        exits: { north: "tunnel_4_north", south: "tunnel_4_south", east: "tunnel_4_east", west: "tunnel_4_west" },
        items: [],
        npcs: []
    },
    // 四号矿道-北
    tunnel_4_north: {
        name: "矿道",
        desc: "一条幽深的矿道，空气中弥漫着令人作呕的腐臭味。\n岩壁上的油灯早已熄灭，只有远处传来微弱的滴水声和某种低沉的呜咽。\n地上散落着一些破碎的木板和生锈的铁钉，还有几具已经面目全非的尸体——他们的眼睛瞪得很大，眼白布满血丝。\n角落里有一具不同的尸体，手里紧紧攥着什么。旁边靠着一架被撤下来的木梯。\n黑暗中传来沉重的喘息声，有什么东西正在靠近...\n南边回到四号矿道出口。",
        exits: { south: "tunnel_exit_4" },
        items: ["stone", "corpse_miner", "removed_ladder"],
        npcs: ["mad_miner"]
    },
    // 四号矿道-东
    tunnel_4_east: {
        name: "矿道",
        desc: "一条狭窄的矿道，两侧的岩壁呈现出不自然的扭曲状，上面布满了抓痕和血迹。\n地面上有一些拖拽的痕迹，似乎有什么沉重的东西被从这里拖过，留下暗红色的印记。\n空气中弥漫着一股腥臭味，让人作呕。角落里传来窸窸窣窣的声响，一双血红的眼睛在黑暗中死死盯着你——发狂矿工正潜伏在这里。\n更深处还有一个高大的身影，手持铁棍，那是发狂的监工！\n西边回到四号矿道出口。",
        exits: { west: "tunnel_exit_4" },
        items: ["stone"],
        npcs: ["mad_miner", "mad_supervisor"]
    },
    // 四号矿道-南
    tunnel_4_south: {
        name: "矿道",
        desc: "四号矿道的尽头区域，也是「疯疫」的源头。\n空气中弥漫着令人窒息的腐臭和某种说不清的铁锈味，岩壁呈现出病态的暗红色，仿佛被鲜血浸透。\n地面上散落着破碎的骨骸、生锈的工具，以及某种奇怪的黑色结晶——那似乎就是导致一切的罪魁祸首。\n角落里有一汪死水，水面倒映着岩壁上那些诡异的符号，散发着微弱的荧光。\n一个发狂的矿工正蹲在地上，啃食着什么...\n这里曾是开采最深处，也是最先出现感染者的地方。王国已经决定放弃这里，连同所有还困在矿中的工人一起埋葬。\n北边是四号矿道出口，西侧是一堵坍塌的岩壁，似乎无法通行。",
        exits: { north: "tunnel_exit_4" },
        items: ["stone", "rusty_tool"],
        npcs: ["mad_miner"]
    },
    // 四号矿道-西
    tunnel_4_west: {
        name: "矿道",
        desc: "一条幽深的矿道，空气中弥漫着腐朽和血腥的气息。\n岩壁上渗着暗红色的液体，仿佛整座矿山都在流血。\n地上散落着几把折断的镐头和破碎的矿灯，还有几具蜷缩在角落里的尸体。\n黑暗深处传来野兽般的低吼，西边似乎还有路...\n东边回到四号矿道出口。",
        exits: { east: "tunnel_exit_4", west: "tunnel_4_west_1" },
        items: ["broken_pickaxe"],
        npcs: ["mad_miner"]
    },
    // 西侧矿道-1
    tunnel_4_west_1: {
        name: "矿道",
        desc: "矿道变得更加狭窄，空气中弥漫着令人窒息的腐臭味。\n岩壁上的凿痕越来越多，仿佛有什么东西曾在这里疯狂地挖掘。\n地上散落着更多的尸体，他们的眼睛都瞪得很大，脸上凝固着极度恐惧的表情。\n你感到一阵不安，但还是可以继续前进...\n东边回到来时的路。",
        exits: { east: "tunnel_4_west", west: "tunnel_4_west_2" },
        items: ["stone"],
        npcs: ["mad_miner"]
    },
    // 西侧矿道-2（两个发狂矿工）
    tunnel_4_west_2: {
        name: "矿道",
        desc: "这里的空气变得更加浑浊，呼吸变得困难。\n岩壁上布满了新鲜的抓痕和血迹，地上散落着破碎的衣物和生锈的工具。\n黑暗中有不止一双血红的眼睛在注视着你...\n东边回到来时的路。",
        exits: { east: "tunnel_4_west_1", west: "tunnel_4_west_3" },
        items: ["stone"],
        npcs: ["mad_miner", "mad_miner"]
    },
    // 西侧矿道-3（一个发狂矿工）
    tunnel_4_west_3: {
        name: "矿道",
        desc: "矿道在这里变得更加阴森，温度似乎下降了几度。\n岩壁上开始浮现出奇怪的符号，散发着微弱的暗红色光芒。\n地上有一具新鲜的尸体，似乎刚死去不久，他的手指还保持着抓挠的姿势。\n黑暗深处传来低沉的呢喃声，像是某种古老的咒语...\n东边回到来时的路。",
        exits: { east: "tunnel_4_west_2", west: "tunnel_4_west_4" },
        items: ["stone"],
        npcs: ["mad_miner"]
    },
    // 西侧矿道-4（剧情模式，提示返回）
    tunnel_4_west_4: {
        name: "矿道",
        desc: "安静得可怕。\n岩壁符号散发着诡异红光。\n内心有个声音：快回去...",
        exits: { east: "tunnel_4_west_3", west: "tunnel_4_west_5" },
        items: [],
        npcs: []
    },
    // 西侧矿道-5（更强烈的提示）
    tunnel_4_west_5: {
        name: "矿道",
        desc: "空气稀薄，难以呼吸。\n符号在嘲笑你。\n恐惧如潮：快回去！这是最后的机会！",
        exits: { east: "tunnel_4_west_4", west: "tunnel_4_west_6" },
        items: [],
        npcs: []
    },
    // 西侧矿道-6（乱码剧情，血色宝石）
    tunnel_4_west_6: {
        name: "矿道",
        desc: "矿道在这里变得支离破碎，空气中弥漫着血腥的气息。\n岩壁上布满了诡异的符号，散发着暗红色的光芒。\n地上有一些发光的结晶体，在黑暗中闪烁着血色的光芒。\n东边...回去...",
        exits: { east: "tunnel_4_west_5", west: "tunnel_4_west_7" },
        items: ["blood_gem"],
        npcs: []
    },
    // 西侧矿道-7（强制死亡）
    tunnel_4_west_7: {
        name: "矿道",
        desc: "它来了。\n符号组成血红眼睛注视着你。\n有什么东西进入了你的身体...\n东边...回不去...了...",
        exits: { east: "tunnel_4_west_6" },
        items: [],
        npcs: []
    },
    // 石子路8（矿场深处）
    stone_road_8: {
        name: "石子路",
        desc: "石子路在这里略微拓宽，路面上可以看到一些车辙痕迹，似乎是运送物资的矿车留下的。\n远处隐约可见一些建筑物的轮廓，北侧飘来淡淡的炊烟味，南侧则传来低沉的鼾声。\n西边是来时的路，东边是通往工作坊方向的石子路，北侧通往食堂方向，南侧通往宿舍方向。",
        exits: { west: "stone_road_7", east: "stone_road_15", north: "stone_road_9", south: "stone_road_10" },
        items: [],
        npcs: []
    },
    // 石子路15（石子路8东侧）
    stone_road_15: {
        name: "石子路",
        desc: "石子路向东延伸，路面变得更加平整，似乎有人经常维护。\n路边散落着一些铁片和木屑，空气中隐约传来叮叮当当的锤打声。\n西边是石子路主路，东边继续延伸。",
        exits: { west: "stone_road_8", east: "stone_road_16" },
        items: [],
        npcs: []
    },
    // 石子路16（石子路15东侧）
    stone_road_16: {
        name: "石子路",
        desc: "石子路在这里变得宽阔，路面上的车辙痕迹更加明显。\n空气中弥漫着金属和炭火的气味，东边矗立着一座低矮的石砌建筑，屋顶的烟囱正冒着袅袅炊烟。\n西边是来时的路，东边是工作坊。",
        exits: { west: "stone_road_15", east: "workshop" },
        items: [],
        npcs: []
    },
    // 工作坊
    workshop: {
        name: "工作坊",
        desc: "一座用粗糙石块砌成的工坊，屋顶铺着厚重的石板，烟囱里冒出滚滚黑烟。\n工坊内摆放着一座简陋的铁匠炉和几张工作台，墙上挂满了各种工具——锤子、钳子、锉刀，还有一排排打磨得锃亮的矿镐和铁锹。\n炉火已经熄灭，但空气中仍然弥漫着炭火和金属的余温。\n墙角堆着一些矿石和金属废料，一张木桌上放着设计图纸和几件半成品。\n西边回到石子路。",
        exits: { west: "stone_road_16" },
        items: ["workbench"],
        npcs: []
    },
    // 石子路9（通往食堂）
    stone_road_9: {
        name: "石子路",
        desc: "石子路向北延伸，空气中弥漫着一股淡淡的饭菜香味，还有木材燃烧的气味。\n远处可以看到一座用木板和铁皮搭建的简陋建筑，窗户里透出昏黄的灯光——那是矿工们的食堂。\n南边回到主路，北边是食堂大门。",
        exits: { south: "stone_road_8", north: "canteen_gate" },
        items: [],
        npcs: []
    },
    // 食堂大门
    canteen_gate: {
        name: "食堂大门",
        desc: "一座用粗木搭建的大门，门框上挂着一盏摇摇晃晃的煤油灯。\n门内传来锅碗瓢盆的碰撞声和低沉的交谈声，空气中弥漫着稀粥和腌菜的混合气味。\n这是矿工们一天中唯一可以填饱肚子的地方，但食物的质和量都让人不敢恭维。\n南边是石子路，北边通向食堂大厅。",
        exits: { south: "stone_road_9", north: "canteen_hall" },
        items: [],
        npcs: []
    },
    // 食堂大厅
    canteen_hall: {
        name: "食堂大厅",
        desc: "一个宽敞的棚屋，屋顶用铁皮覆盖，几根粗木柱子支撑着整个结构。\n屋内摆放着十几张长条木桌和板凳，桌上残留着干涸的粥渍和咸菜残渣。\n角落里有一口大铁锅，锅底还粘着早上没刮干净的稀粥。\n北侧有一扇门通往厨房，南侧回到食堂大门。",
        exits: { south: "canteen_gate", north: "kitchen" },
        items: [],
        npcs: []
    },
    // 厨房
    kitchen: {
        name: "厨房",
        desc: "食堂的后厨，空气中弥漫着油烟和腐烂食物混合的刺鼻气味。\n墙角堆着发霉的蔬菜和一些分不清是什么的肉块，砧板上还残留着暗红色的污渍。\n房间中央是一个用砖块砌成的炉灶，里面还残留着余烬。\n角落里放着几把刀具。墙边有一排壁橱。\n南侧回到食堂大厅。",
        exits: { south: "canteen_hall" },
        items: ["kitchen_knife", "fruit_knife", "stove", "wardrobe"],
        npcs: []
    },
    // 石子路10（通往宿舍）
    stone_road_10: {
        name: "石子路",
        desc: "石子路向南延伸，路面变得更加崎岖不平。\n远处可以看到一排排低矮的棚屋，屋顶用破旧的油毡覆盖，墙壁由薄木板拼凑而成。\n棚屋里传来此起彼伏的鼾声和咳嗽声——那是矿工们的宿舍，一座连牲畜都不愿居住的窝棚。\n北边回到主路，南边是宿舍大门。",
        exits: { north: "stone_road_8", south: "dormitory_gate" },
        items: [],
        npcs: []
    },
    // 宿舍大门
    dormitory_gate: {
        name: "宿舍大门",
        desc: "一道用铁丝和木板胡乱拼凑的栅栏门，门轴已经生锈，推开时会发出刺耳的吱呀声。\n门内是一排排低矮的窝棚，每个棚屋里挤满了疲惫不堪的矿工，空气中弥漫着汗臭、霉味和疾病的气息。\n这里是「休息」的地方，但很少有人能在这里真正安眠。\n北边是石子路，南边是矿工宿舍。",
        exits: { north: "stone_road_10", south: "dormitory_1" },
        items: [],
        npcs: []
    },
    // 矿工宿舍1（北侧第一个）
    dormitory_1: {
        name: "矿工宿舍",
        desc: "一间简陋的棚屋，屋顶用破旧的油毡覆盖，墙壁由薄木板拼凑而成。\n屋内摆放着几张破旧的床铺，床上躺着几个熟睡的矿工。空气中弥漫着汗臭、霉味和疾病的气息。\n北边是宿舍大门，南边是下一间宿舍。",
        exits: { north: "dormitory_gate", south: "dormitory_2" },
        items: [],
        npcs: ["sleeping_miner", "sleeping_miner", "sleeping_miner", "sleeping_miner"]
    },
    // 矿工宿舍2（中间）
    dormitory_2: {
        name: "矿工宿舍",
        desc: "一间简陋的棚屋，与其他的宿舍没有什么区别。\n几张破旧的床铺上躺着熟睡的矿工，他们的鼾声此起彼伏。墙角堆着一些破旧的衣物和工具。\n北边是上一间宿舍，南边是下一间宿舍。",
        exits: { north: "dormitory_1", south: "dormitory_3" },
        items: [],
        npcs: ["sleeping_miner", "sleeping_miner", "sleeping_miner", "sleeping_miner"]
    },
    // 矿工宿舍3（最南侧，有火折子）
    dormitory_3: {
        name: "矿工宿舍",
        desc: "这间宿舍比其他两间更加阴暗潮湿，靠近山体的墙壁上有明显的渗水痕迹。\n几张破旧的床铺上躺着熟睡的矿工。在角落的破旧箱子里，你注意到有一些矿工的私人物品。\n北边是上一间宿舍。",
        exits: { north: "dormitory_2" },
        items: ["tinder"],
        npcs: ["sleeping_miner", "sleeping_miner", "sleeping_miner", "sleeping_miner"]
    },
    // [8] 一号矿井口（地表）
    mine_exit_1: {
        name: "一号矿井口",
        desc: "又一处矿道出口，与二号矿井口隔着一道山脊。\n夜风依旧冷得刺骨，月光依旧惨白。\n脚下的木梯通向地下的一号矿道。\n西侧是通往矿场大门的道路。",
        exits: { down: "tunnel_exit_1", east: "stone_road_2", west: "stone_road_11" },
        items: ["ladder_mine_exit_1"],
        npcs: []
    },
    // 石子路11（一号矿井口西侧）
    stone_road_11: {
        name: "石子路",
        desc: "石子路从一号矿井口向西延伸，路面上的碎石越来越稀疏。\n远处的山峦在月光下呈现出狰狞的轮廓，偶尔传来夜枭的啼叫声。\n东边是一号矿井口，西边继续延伸。",
        exits: { east: "mine_exit_1", west: "stone_road_12" },
        items: [],
        npcs: []
    },
    // 石子路12
    stone_road_12: {
        name: "石子路",
        desc: "石子路在这里略微拓宽，路边开始出现一些车辙痕迹。\n前方矗立着一座高大的木制拱门——矿场的大门。\n两名见习骑士守在大门前的石子路上，手持长剑，目光警惕地注视着每一个试图靠近的人。\n西边是矿场大门，东边是来时的路，南侧有一条岔路通向骑士住所，北侧有一条小路通向侧门。",
        exits: { east: "stone_road_11", west: "mine_gate", south: "stone_road_13", north: "path_1" },
        items: [],
        npcs: ["apprentice_knight", "apprentice_knight"]
    },
    // 石子路13（通往骑士住所）
    stone_road_13: {
        name: "石子路",
        desc: "石子路从主路向南延伸，路面逐渐变得平坦。\n路边的野草中偶尔能看到一些马蹄印，说明这里经常有骑兵经过。\n北边回到石子路，南边继续延伸。",
        exits: { north: "stone_road_12", south: "stone_road_14" },
        items: [],
        npcs: []
    },
    // 石子路14
    stone_road_14: {
        name: "石子路",
        desc: "石子路在这里分出一条岔道，通向远处一座石砌建筑。\n那是一座比矿工宿舍高大得多的建筑，门口站着身披铠甲的守卫。\n那是驻矿骑士的住所，普通人不得靠近。\n北边是来时的路，南边是骑士住所大门。",
        exits: { north: "stone_road_13", south: "knight_gate" },
        items: [],
        npcs: []
    },
    // 骑士住所大门
    knight_gate: {
        name: "骑士住所大门",
        desc: "一扇用厚重的橡木制成的大门，门上镶嵌着铁制的花纹。\n这里是王国派驻桑华山矿场的骑士团驻地，负责维持矿场的「秩序」。\n这些骑士名义上是保护矿工，实际上却是兰德尔家主子的看门狗。\n北侧是石子路，南侧通往训练场。",
        exits: { north: "stone_road_14", south: "training_ground" },
        items: [],
        npcs: []
    },
    // 训练场
    training_ground: {
        name: "训练场",
        desc: "一片用木栅栏围起来的空地，地面夯得坚实平整。\n场地上摆放着几个稻草人和木桩，供骑士们练习剑术和骑术。\n角落里有一个武器架，上面挂着几把训练用的木剑。\n空气中弥漫着汗水和铁锈的气息。\n一位身穿银灰色板甲的女骑士正在场中央练习剑术，她的动作迅捷而精准。\n北侧是骑士住所大门，南侧是骑士住所，西侧是马厩。",
        exits: { north: "knight_gate", south: "knight_house", west: "stables" },
        items: [],
        npcs: ["liana"]
    },
    // 马厩
    stables: {
        name: "马厩",
        desc: "一间用粗木搭建的马厩，空气中弥漫着干草和马粪的气味。\n几间隔栏中铺着厚厚的稻草，食槽里还残留着干草和燕麦。\n最里面的隔栏中，一匹高大的白色战马正安静地站立着，它的肌肉线条分明，显得强壮而优雅。\n东侧通往训练场。",
        exits: { east: "training_ground" },
        items: [],
        npcs: ["warhorse"]
    },
    // 骑士住所
    knight_house: {
        name: "骑士住所",
        desc: "一座用石头砌成的坚固建筑，比矿工们的窝棚要气派得多。\n屋内铺着干净的木地板，墙上挂着王国骑士团的徽章。\n这里是驻矿骑士的休息之所，也是他们谋划如何更好地「管理」矿工的地方。\n北侧是训练场。",
        exits: { north: "training_ground" },
        items: [],
        npcs: []
    },
    // 矿场大门
    mine_gate: {
        name: "矿场大门",
        desc: "一座用粗大的原木搭建的高大门楼，顶端挂着一盏摇曳的油灯。\n这里是桑华山矿场的正式入口，所有进出的人和物资都要经过这里检查。\n大门内侧安静而冷清，只有风声和远处矿场深处传来的低沉回响。\n东侧通往矿区，西侧是一条蜿蜒的山路。",
        exits: { east: "stone_road_12", west: "mountain_path_1" },
        items: [],
        npcs: []
    },
    // 山路1（矿场大门西侧）
    mountain_path_1: {
        name: "山路",
        desc: "一条蜿蜒的山路从矿场大门延伸而出，路面上布满了碎石和车辙痕迹。\n两旁是陡峭的山坡，偶尔能看到几棵顽强生长的松树。\n远处山峦起伏，云雾缭绕。\n东边是矿场大门，西边继续延伸。",
        exits: { east: "mine_gate", west: "mountain_path_2" },
        items: [],
        npcs: []
    },
    // 山路2
    mountain_path_2: {
        name: "山路",
        desc: "山路在这里变得狭窄，一侧是陡峭的岩壁，另一侧是深不见底的山谷。\n风吹过山谷发出呜呜的声响，令人不寒而栗。\n东边是来的路，西边继续延伸。",
        exits: { east: "mountain_path_1", west: "mountain_path_3" },
        items: [],
        npcs: []
    },
    // 山路3
    mountain_path_3: {
        name: "山路",
        desc: "山路逐渐向上攀升，空气变得稀薄而清冷。\n路边的岩石上覆盖着青苔，显示出这里很少有人经过。\n远处隐约可见一座宏伟建筑的轮廓。\n东边是来的路，西边继续延伸。",
        exits: { east: "mountain_path_2", west: "mountain_path_4" },
        items: [],
        npcs: []
    },
    // 山路4（最西侧，通往南边的逃跑路线）
    mountain_path_4: {
        name: "山路",
        desc: "山路的尽头，前方是一座宏伟的石制大门，那就是伯爵宅邸的入口。\n大门两侧是雕刻着复杂花纹的石柱，顶端是狰狞的石像鬼。\n除此之外，你还注意到南侧似乎有一条隐秘的小径，通向深山之中。\n北边是伯爵宅邸大门，南边是隐秘小径，东边是来的路。",
        exits: { east: "mountain_path_3", north: "mansion_gate", south: "mountain_path_5" },
        items: [],
        npcs: []
    },
    // 伯爵宅邸大门
    mansion_gate: {
        name: "伯爵宅邸大门",
        desc: "一座宏伟的石制大门，高达数丈，门上雕刻着繁复的贵族纹章。\n大门由厚重的橡木制成，表面镶嵌着铁艺花纹，看起来坚固无比。\n门旁有一个钥匙孔，显然需要特殊的钥匙才能进入。\n这是兰德尔伯爵的私人宅邸，普通人根本无法靠近。\n东侧是宅邸前院，南边是山路，大门需要钥匙才能打开。",
        exits: { south: "mountain_path_4", east: "mansion_front_yard" },
        items: ["mansion_gate_door"],
        npcs: []
    },
    // 宅邸前院
    mansion_front_yard: {
        name: "宅邸前院",
        desc: "宅邸的正门前是一片精心修剪的草坪，几条石板路从大门向四周延伸。\n两侧是整齐的花坛，种植着各色鲜花。\n草坪中央矗立着一座雄伟的青铜雕像，那是兰德尔家族的创始人。\n前方就是宏伟的宅邸大门，高大而威严。\n东边是伯爵宅邸大门，西侧是宅邸大厅。",
        exits: { west: "mansion_gate", east: "mansion_hall" },
        items: ["randolph_statue"],
        npcs: []
    },

    // ========== 逃跑路线山路（5-14） ==========
    // 山路5（逃跑路线起点）
    mountain_path_5: {
        name: "山路",
        desc: "一条隐秘的小径从山路尽头向南方延伸，路面上杂草丛生，显然很少有人经过。\n四周是高耸的岩壁，月光从头顶的缝隙中洒落，照亮了脚下的碎石。\n北边回到山路，南边继续延伸。",
        exits: { north: "mountain_path_4", south: "mountain_path_6" },
        items: [],
        npcs: []
    },
    // 山路6
    mountain_path_6: {
        name: "山路",
        desc: "小径在这里变得狭窄，两旁的灌木丛生，枝条不时划过你的手臂。\n空气中弥漫着野草的清香和泥土的潮湿气息。\n北边是来的路，南边继续延伸。",
        exits: { north: "mountain_path_5", south: "mountain_path_7" },
        items: [],
        npcs: []
    },
    // 山路7
    mountain_path_7: {
        name: "山路",
        desc: "山路蜿蜒向上，脚下的碎石让行进变得困难。\n回头望去，矿场的灯火已经变得微弱，像远处漂浮的鬼火。\n北边是来的路，南边继续延伸。",
        exits: { north: "mountain_path_6", south: "mountain_path_8" },
        items: [],
        npcs: []
    },
    // 山路8
    mountain_path_8: {
        name: "山路",
        desc: "这里的山路逐渐平缓，两旁开始出现稀疏的松树。\n夜风吹过，松针发出沙沙的声响，像是有人在低声耳语。\n北边是来的路，南边继续延伸。",
        exits: { north: "mountain_path_7", south: "mountain_path_9" },
        items: [],
        npcs: []
    },
    // 山路9
    mountain_path_9: {
        name: "山路",
        desc: "山路在这里分出了几条岔道，但你选择了最宽阔的一条继续向南。\n远处传来夜枭的叫声，在寂静的山谷中回荡。\n北边是来的路，南边继续延伸。",
        exits: { north: "mountain_path_8", south: "mountain_path_10" },
        items: [],
        npcs: []
    },
    // 山路10
    mountain_path_10: {
        name: "山路",
        desc: "脚下的路越来越窄，两旁的野草长得几乎齐腰高。\n露水打湿了你的裤脚，带来一阵凉意。\n北边是来的路，南边继续延伸。",
        exits: { north: "mountain_path_9", south: "mountain_path_11" },
        items: [],
        npcs: []
    },
    // 山路11
    mountain_path_11: {
        name: "山路",
        desc: "山路在这里转了个弯，前方是一片开阔的野地。\n月光洒在草地上，白惨惨的，像是一层薄霜。\n北边是来的路，南边继续延伸。",
        exits: { north: "mountain_path_10", south: "mountain_path_12" },
        items: [],
        npcs: []
    },
    // 山路12
    mountain_path_12: {
        name: "山路",
        desc: "你已经深入山野，四周是连绵起伏的山峦。\n远处的山峰在月光下呈现出灰黄色的轮廓，沉默而威严。\n北边是来的路，南边继续延伸。",
        exits: { north: "mountain_path_11", south: "mountain_path_13" },
        items: [],
        npcs: []
    },
    // 山路13
    mountain_path_13: {
        name: "山路",
        desc: "山路在这里变得开阔，前方隐约可见山路的尽头。\n夜风从山口灌进来，带着一丝未知的气息。\n北边是来的路，南边是未知的前方。",
        exits: { north: "mountain_path_12", south: "mountain_path_14" },
        items: [],
        npcs: []
    },
    // 山路14（最后一个，结局触发点）
    mountain_path_14: {
        name: "山路尽头",
        desc: "山路的尽头，一片开阔的野地展现在眼前。\n你已经远离了桑华山，矿场的围墙消失在夜色中。\n这里是你逃离的最后一站，也是新生活的起点。\n北边是来的路，前方是未知的自由。",
        exits: { north: "mountain_path_13" },
        items: [],
        npcs: [],
        isEnding: true
    },

    // 小路1（通往侧门）
    path_1: {
        name: "小路",
        desc: "一条狭窄的泥土小路，两旁长满了杂草和灌木。\n这里是矿工们私下进出的秘密通道，避开了正门守卫的视线。\n南边回到石子路，北边继续延伸。",
        exits: { south: "stone_road_12", north: "path_2" },
        items: [],
        npcs: []
    },
    // 小路2
    path_2: {
        name: "小路",
        desc: "小路在这里变得更加狭窄，周围的灌木几乎要将道路完全遮蔽。\n前方可以看到一扇生锈的铁门——那就是矿场侧门。\n南边是来时的路，北边是侧门。",
        exits: { south: "path_1", north: "side_gate" },
        items: [],
        npcs: []
    },
    // 侧门
    side_gate: {
        name: "矿场侧门",
        desc: "一扇生锈的铁门，门上的油漆早已剥落。\n这里是矿场的备用出口，平时很少有人使用。\n使用钥匙可以打开通往森林的秘密通道。\n南边是小路，通往矿场大门方向。",
        exits: { south: "path_2" },
        items: ["side_gate_door"],
        npcs: []
    },
    // ========== 森林区域 ==========
    // 森林第1行（起点，9个房间）
    forest_start: {
        name: "森林边缘",
        desc: "你穿过侧门，来到了一片茂密的森林。\n高大的松树遮天蔽日，只有零星的光线透过枝叶洒落下来。\n空气中弥漫着松脂和腐叶的气息，远处传来不知名的鸟叫声。\n这里是逃离矿场后的第一站，但你依然能感觉到身后的危险。\n南边回到矿场侧门，四周都是茫茫林海。",
        exits: { south: "side_gate", east: "forest_1_e1", west: "forest_1_w1", north: "forest_2_center" },
        items: [],
        npcs: []
    },
    forest_1_e1: {
        name: "森林边缘",
        desc: "茂密的松树林，地上铺满了厚厚的松针。\n西边是来的方向，东边、北边还有路。",
        exits: { west: "forest_start", east: "forest_1_e2", north: "forest_2_e1" },
        items: [],
        npcs: []
    },
    forest_1_e2: {
        name: "森林边缘",
        desc: "树木变得更加密集，光线也越来越暗。\n西边是来的方向，东边、北边还有路。",
        exits: { west: "forest_1_e1", east: "forest_1_e3", north: "forest_2_e2" },
        items: [],
        npcs: []
    },
    forest_1_e3: {
        name: "森林边缘",
        desc: "一棵巨大的古树横倒在路中央，树干上长满了青苔。\n西边是来的方向，东边、北边还有路。",
        exits: { west: "forest_1_e2", east: "forest_1_e4", north: "forest_2_e3" },
        items: [],
        npcs: []
    },
    forest_1_e4: {
        name: "森林边缘",
        desc: "森林的尽头，一道小溪从岩石间流过。\n西边是来的方向，北边还有路。",
        exits: { west: "forest_1_e3", north: "forest_2_e4" },
        items: [],
        npcs: []
    },
    forest_1_w1: {
        name: "森林边缘",
        desc: "松树林中有一块空地，地上散落着一些动物的骸骨。\n东边是来的方向，西边、北边还有路。",
        exits: { east: "forest_start", west: "forest_1_w2", north: "forest_2_w1" },
        items: [],
        npcs: []
    },
    forest_1_w2: {
        name: "森林边缘",
        desc: "灌木丛越来越密集，几乎难以通行。\n东边是来的方向，西边、北边还有路。",
        exits: { east: "forest_1_w1", west: "forest_1_w3", north: "forest_2_w2" },
        items: [],
        npcs: []
    },
    forest_1_w3: {
        name: "森林边缘",
        desc: "一棵枯萎的老树矗立在路边，树枝像扭曲的手臂伸向天空。\n东边是来的方向，西边、北边还有路。",
        exits: { east: "forest_1_w2", west: "forest_1_w4", north: "forest_2_w3" },
        items: [],
        npcs: []
    },
    forest_1_w4: {
        name: "森林边缘",
        desc: "一片荆棘丛挡住了去路，只能绕道而行。\n东边是来的方向，北边还有路。",
        exits: { east: "forest_1_w3", north: "forest_2_w4" },
        items: [],
        npcs: []
    },
    // 森林第2行（9个房间）
    forest_2_center: {
        name: "森林深处",
        desc: "森林越来越深，树木高大得遮天蔽日。\n四周都是茂密的林海，方向感开始变得模糊。\n南边、东西两边、北边都有路。",
        exits: { south: "forest_start", east: "forest_2_e1", west: "forest_2_w1", north: "forest_3_center" },
        items: [],
        npcs: []
    },
    forest_2_e1: {
        name: "森林深处",
        desc: "地上有一条被踩踏出来的小径，似乎是动物常走的路线。\n西边是中心区域，东边、南北两边还有路。",
        exits: { west: "forest_2_center", east: "forest_2_e2", south: "forest_1_e1", north: "forest_3_e1" },
        items: [],
        npcs: []
    },
    forest_2_e2: {
        name: "森林深处",
        desc: "一棵巨大的橡树矗立在路中央，树干需要三人才能合抱。\n西边是来的方向，东边、南北两边还有路。",
        exits: { west: "forest_2_e1", east: "forest_2_e3", south: "forest_1_e2", north: "forest_3_e2" },
        items: [],
        npcs: []
    },
    forest_2_e3: {
        name: "森林深处",
        desc: "林间的空地上长满了野蘑菇，有些散发着诡异的荧光。\n西边是来的方向，东边、南北两边还有路。",
        exits: { west: "forest_2_e2", east: "forest_2_e4", south: "forest_1_e3", north: "forest_3_e3" },
        items: [],
        npcs: []
    },
    forest_2_e4: {
        name: "森林深处",
        desc: "一道清澈的溪流从林间流过，水声潺潺。\n西边是来的方向，南边、北边还有路。",
        exits: { west: "forest_2_e3", south: "forest_1_e4", north: "forest_3_e4" },
        items: [],
        npcs: []
    },
    forest_2_w1: {
        name: "森林深处",
        desc: "地上有一些奇怪的足迹，看起来不像是普通动物留下的。\n东边是中心区域，西边、南北两边还有路。",
        exits: { east: "forest_2_center", west: "forest_2_w2", south: "forest_1_w1", north: "forest_3_w1" },
        items: [],
        npcs: []
    },
    forest_2_w2: {
        name: "森林深处",
        desc: "林间的光线越来越暗，几乎看不清前方的路。\n东边是来的方向，西边、南北两边还有路。",
        exits: { east: "forest_2_w1", west: "forest_2_w3", south: "forest_1_w2", north: "forest_3_w2" },
        items: [],
        npcs: []
    },
    forest_2_w3: {
        name: "森林深处",
        desc: "一棵被雷劈中的树木倒在地上，焦黑的树干散发着木炭的气味。\n东边是来的方向，西边、南北两边还有路。",
        exits: { east: "forest_2_w2", west: "forest_2_w4", south: "forest_1_w3", north: "forest_3_w3" },
        items: [],
        npcs: []
    },
    forest_2_w4: {
        name: "森林深处",
        desc: "一片沼泽地挡住了去路，泥泞中冒着气泡。\n东边是来的方向，南边、北边还有路。",
        exits: { east: "forest_2_w3", south: "forest_1_w4", north: "forest_3_w4" },
        items: [],
        npcs: []
    },
    // 森林第3行（9个房间）
    forest_3_center: {
        name: "森林深处",
        desc: "你已经深入森林，四周的树木几乎一模一样。\n如果没有标记，很容易在这里迷失方向。\n南边、东西两边、北边都有路。",
        exits: { south: "forest_2_center", east: "forest_3_e1", west: "forest_3_w1", north: "forest_4_center" },
        items: [],
        npcs: []
    },
    forest_3_e1: {
        name: "森林深处",
        desc: "林间传来奇怪的声音，像是某种动物的低吼。\n西边是中心区域，东边、南北两边还有路。",
        exits: { west: "forest_3_center", east: "forest_3_e2", south: "forest_2_e1", north: "forest_4_e1" },
        items: [],
        npcs: []
    },
    forest_3_e2: {
        name: "森林深处",
        desc: "一棵树上挂着一些奇怪的标记，似乎是某种警示。\n西边是来的方向，东边、南北两边还有路。",
        exits: { west: "forest_3_e1", east: "forest_3_e3", south: "forest_2_e2", north: "forest_4_e2" },
        items: [],
        npcs: []
    },
    forest_3_e3: {
        name: "森林深处",
        desc: "地上散落着一些破碎的陶片，似乎是古人留下的遗迹。\n西边是来的方向，东边、南北两边还有路。",
        exits: { west: "forest_3_e2", east: "forest_3_e4", south: "forest_2_e3", north: "forest_4_e3" },
        items: [],
        npcs: []
    },
    forest_3_e4: {
        name: "森林深处",
        desc: "一道山涧从岩石间流过，水流湍急。\n西边是来的方向，南边、北边还有路。",
        exits: { west: "forest_3_e3", south: "forest_2_e4", north: "forest_4_e4" },
        items: [],
        npcs: []
    },
    forest_3_w1: {
        name: "森林深处",
        desc: "林间的雾气越来越重，能见度不足十米。\n东边是中心区域，西边、南北两边还有路。",
        exits: { east: "forest_3_center", west: "forest_3_w2", south: "forest_2_w1", north: "forest_4_w1" },
        items: [],
        npcs: []
    },
    forest_3_w2: {
        name: "森林深处",
        desc: "一棵树上刻着一些奇怪的符号，散发着淡淡的暗红色光芒。\n东边是来的方向，西边、南北两边还有路。",
        exits: { east: "forest_3_w1", west: "forest_3_w3", south: "forest_2_w2", north: "forest_4_w2" },
        items: [],
        npcs: []
    },
    forest_3_w3: {
        name: "森林深处",
        desc: "地上有一些白骨，看起来是某种大型动物的遗骸。\n东边是来的方向，西边、南北两边还有路。",
        exits: { east: "forest_3_w2", west: "forest_3_w4", south: "forest_2_w3", north: "forest_4_w3" },
        items: [],
        npcs: []
    },
    forest_3_w4: {
        name: "森林深处",
        desc: "一片密不透风的灌木丛挡住了去路，只能绕道而行。\n东边是来的方向，南边、北边还有路。",
        exits: { east: "forest_3_w3", south: "forest_2_w4", north: "forest_4_w4" },
        items: [],
        npcs: []
    },
    // 森林第4行（9个房间）
    forest_4_center: {
        name: "森林深处",
        desc: "森林已经深到令人窒息的程度，空气变得潮湿而沉重。\n四周静得可怕，只有自己的脚步声在林间回荡。\n地上有一堆不自然的落叶堆积着，似乎掩盖了什么。\n南边、东西两边、北边都有路。",
        exits: { south: "forest_3_center", east: "forest_4_e1", west: "forest_4_w1", north: "deep_forest_1_center" },
        items: ["leaf_pile"],
        npcs: []
    },
    forest_4_e1: {
        name: "森林深处",
        desc: "一棵巨大的藤蔓从树上垂下来，像是一条巨蛇。\n西边是中心区域，东边、南北两边还有路。",
        exits: { west: "forest_4_center", east: "forest_4_e2", south: "forest_3_e1", north: "deep_forest_1_e1" },
        items: [],
        npcs: []
    },
    forest_4_e2: {
        name: "森林深处",
        desc: "林间的一块空地上有一个熄灭已久的火堆，似乎有人曾在这里露营。\n西边是来的方向，东边、南北两边还有路。",
        exits: { west: "forest_4_e1", east: "forest_4_e3", south: "forest_3_e2", north: "deep_forest_1_e2" },
        items: [],
        npcs: []
    },
    forest_4_e3: {
        name: "森林深处",
        desc: "一棵树的树干上有一个巨大的树洞，里面黑漆漆的不知道藏着什么。\n西边是来的方向，东边、南北两边还有路。",
        exits: { west: "forest_4_e2", east: "forest_4_e4", south: "forest_3_e3", north: "deep_forest_1_e3" },
        items: [],
        npcs: []
    },
    forest_4_e4: {
        name: "森林深处",
        desc: "一道深沟挡住了去路，需要绕行才能通过。\n西边是来的方向，南边、北边还有路。",
        exits: { west: "forest_4_e3", south: "forest_3_e4", north: "deep_forest_1_e4" },
        items: [],
        npcs: []
    },
    forest_4_w1: {
        name: "森林深处",
        desc: "地上的苔藓厚得可以没过脚踝，踩上去软绵绵的。\n东边是中心区域，西边、南北两边还有路。",
        exits: { east: "forest_4_center", west: "forest_4_w2", south: "forest_3_w1", north: "deep_forest_1_w1" },
        items: [],
        npcs: []
    },
    // 围栏门（森林第4行西侧新增）
    fence_gate: {
        name: "围栏门",
        desc: "森林在这里豁然开朗，前方是一道简单的围栏门，通往兰德尔伯爵的私人宅邸花园。\n与宏伟的正门不同，这道门由木栅栏围成，看起来是供仆人和采买人员进出的通道。\n东边是森林深处，西边通向宅邸的花园。",
        exits: { east: "forest_4_w4", west: "garden_center" },
        items: [],
        npcs: []
    },
    forest_4_w2: {
        name: "森林深处",
        desc: "一棵倒下的巨树横亘在路上，树干上长满了各种菌类。\n东边是来的方向，西边、南北两边还有路。",
        exits: { east: "forest_4_w1", west: "forest_4_w3", south: "forest_3_w2", north: "deep_forest_1_w2" },
        items: [],
        npcs: []
    },
    forest_4_w3: {
        name: "森林深处",
        desc: "林间的雾气中隐约可见一些奇怪的影子，但走近后却什么也没有。\n东边是来的方向，西边、南北两边还有路。",
        exits: { east: "forest_4_w2", west: "forest_4_w4", south: "forest_3_w3", north: "deep_forest_1_w3" },
        items: [],
        npcs: []
    },
    forest_4_w4: {
        name: "森林深处",
        desc: "一片荆棘丛生的区域，衣服很容易被划破。\n东边是来的方向，南边、北边还有路，西边隐约可见一道围墙。",
        exits: { east: "forest_4_w3", south: "forest_3_w4", north: "deep_forest_1_w4", west: "fence_gate" },
        items: [],
        npcs: []
    },

    // ========== 深林区域 ==========
    // 深林第5行（7个房间）
    deep_forest_1_center: {
        name: "深林",
        desc: "你已经进入了深林，这里的树木比普通森林更加高大古老。\n树干上覆盖着厚厚的青苔，空气中弥漫着一种说不清的古老气息。\n南边、东西两边、北边都有路。",
        exits: { south: "forest_4_center", east: "deep_forest_1_e1", west: "deep_forest_1_w1", north: "deep_forest_2_center" },
        items: [],
        npcs: []
    },
    deep_forest_1_e1: {
        name: "深林",
        desc: "一棵巨大的古树上刻满了奇怪的符号，散发着微弱的荧光。\n西边是中心区域，东边、南北两边还有路。",
        exits: { west: "deep_forest_1_center", east: "deep_forest_1_e2", south: "forest_4_e1", north: "deep_forest_2_e1" },
        items: [],
        npcs: []
    },
    deep_forest_1_e2: {
        name: "深林",
        desc: "林间的空地上有一块巨大的石碑，上面刻着无法辨认的文字。\n西边是来的方向，东边、南北两边还有路。",
        exits: { west: "deep_forest_1_e1", east: "deep_forest_1_e3", south: "forest_4_e2", north: "deep_forest_2_e2" },
        items: [],
        npcs: []
    },
    deep_forest_1_e3: {
        name: "深林",
        desc: "一棵树的树根暴露在地面上，形成了复杂的迷宫般的结构。\n西边是来的方向，南边、北边还有路。",
        exits: { west: "deep_forest_1_e2", south: "forest_4_e3", north: "deep_forest_2_e3" },
        items: [],
        npcs: []
    },
    deep_forest_1_e4: {
        name: "深林",
        desc: "一片诡异的空地，地面上的落叶似乎形成了某种图案。\n西边是来的方向，南边、北边还有路。",
        exits: { west: "deep_forest_1_e3", south: "forest_4_e4", north: "deep_forest_2_e4" },
        items: [],
        npcs: []
    },
    deep_forest_1_w1: {
        name: "深林",
        desc: "林间的雾气中传来低沉的呜咽声，像是某种生物的哀嚎。\n东边是中心区域，西边、南北两边还有路。",
        exits: { east: "deep_forest_1_center", west: "deep_forest_1_w2", south: "forest_4_w1", north: "deep_forest_2_w1" },
        items: [],
        npcs: []
    },
    deep_forest_1_w2: {
        name: "深林",
        desc: "地上有一些巨大的爪印，看起来是某种猛兽留下的。\n东边是来的方向，西边、南北两边还有路。",
        exits: { east: "deep_forest_1_w1", west: "deep_forest_1_w3", south: "forest_4_w2", north: "deep_forest_2_w2" },
        items: [],
        npcs: []
    },
    deep_forest_1_w3: {
        name: "深林",
        desc: "一片散发着诡异香气的花丛，花朵呈现出不自然的血红色。\n东边是来的方向，南边、北边还有路。",
        exits: { east: "deep_forest_1_w2", south: "forest_4_w3", north: "deep_forest_2_w3" },
        items: [],
        npcs: []
    },
    deep_forest_1_w4: {
        name: "深林",
        desc: "深林的边缘区域，雾气更加浓重。\n东边是来的方向，南边、西边还有路。",
        exits: { east: "deep_forest_1_w3", south: "forest_4_w4", west: "deep_forest_1_w4_extra" },
        items: [],
        npcs: []
    },
    deep_forest_1_w4_extra: {
        name: "深林",
        desc: "一片被浓雾笼罩的区域，几乎看不见前方。\n东边是来的方向，北边还有路。",
        exits: { west: "deep_forest_1_center", north: "deep_forest_2_w4" },
        items: [],
        npcs: []
    },
    // 深林第6行（5个房间）
    deep_forest_2_center: {
        name: "深林",
        desc: "深林越来越密，光线几乎无法穿透树冠。\n四周笼罩在一片诡异的幽暗中，令人不寒而栗。\n南边、东西两边、北边都有路。",
        exits: { south: "deep_forest_1_center", east: "deep_forest_2_e1", west: "deep_forest_2_w1", north: "deep_forest_3_center" },
        items: [],
        npcs: []
    },
    deep_forest_2_e1: {
        name: "深林",
        desc: "一棵树的树干上有一个巨大的疤痕，像是被什么东西撕裂的。\n西边是中心区域，东边、南北两边还有路。",
        exits: { west: "deep_forest_2_center", east: "deep_forest_2_e2", south: "deep_forest_1_e1", north: "deep_forest_3_e1" },
        items: [],
        npcs: []
    },
    deep_forest_2_e2: {
        name: "深林",
        desc: "林间的一片沼泽散发着腐臭的气味，水面上漂浮着绿色的藻类。\n西边是来的方向，南边、北边还有路。",
        exits: { west: "deep_forest_2_e1", south: "deep_forest_1_e2", north: "deep_forest_3_e2" },
        items: [],
        npcs: []
    },
    deep_forest_2_e3: {
        name: "深林",
        desc: "一棵枯死的老树矗立在路旁，树枝像扭曲的手臂伸向天空。\n西边是来的方向，南边、北边还有路。",
        exits: { west: "deep_forest_2_e2", south: "deep_forest_1_e3", north: "deep_forest_3_e3" },
        items: [],
        npcs: []
    },
    deep_forest_2_e4: {
        name: "深林",
        desc: "深林中的一片空地，似乎是某种生物的巢穴。\n西边是来的方向，南边还有路。",
        exits: { west: "deep_forest_2_e3", south: "deep_forest_1_e4" },
        items: [],
        npcs: []
    },
    deep_forest_2_w1: {
        name: "深林",
        desc: "地上的落叶厚得可以没过膝盖，每走一步都发出沙沙的声响。\n东边是中心区域，西边、南北两边还有路。",
        exits: { east: "deep_forest_2_center", west: "deep_forest_2_w2", south: "deep_forest_1_w1", north: "deep_forest_3_w1" },
        items: [],
        npcs: []
    },
    deep_forest_2_w2: {
        name: "深林",
        desc: "一棵枯死的巨树倒在地上，树根暴露出一个巨大的坑洞。\n东边是来的方向，西边、南北两边还有路。",
        exits: { east: "deep_forest_2_w1", west: "deep_forest_2_w3", south: "deep_forest_1_w2", north: "deep_forest_3_w2" },
        items: [],
        npcs: []
    },
    deep_forest_2_w3: {
        name: "深林",
        desc: "林间的空气中弥漫着一股奇怪的味道，像是腐烂的花香。\n东边是来的方向，南边、北边还有路。",
        exits: { east: "deep_forest_2_w2", south: "deep_forest_1_w3", north: "deep_forest_3_w3" },
        items: [],
        npcs: []
    },
    deep_forest_2_w4: {
        name: "深林",
        desc: "浓雾中的区域，几乎什么也看不见。\n东边是来的方向，南边、西边还有路。",
        exits: { east: "deep_forest_1_w4_extra", south: "deep_forest_1_w4", west: "deep_forest_2_w4_extra" },
        items: [],
        npcs: []
    },
    deep_forest_2_w4_extra: {
        name: "深林",
        desc: "雾气稍微散开了一些，可以看清周围的环境。\n东边是来的方向，北边还有路。",
        exits: { west: "deep_forest_2_center", north: "deep_forest_3_w4" },
        items: [],
        npcs: []
    },
    // 深林第7行（3个房间）
    deep_forest_3_center: {
        name: "深林",
        desc: "你已经来到了深林的核心地带，这里的树木古老得超乎想象。\n树干粗得需要十几人才能合抱，树冠高耸入云。\n南边、东西两边、北边都有路。",
        exits: { south: "deep_forest_2_center", east: "deep_forest_3_e1", west: "deep_forest_3_w1", north: "cliff" },
        items: [],
        npcs: []
    },
    deep_forest_3_e1: {
        name: "深林",
        desc: "一棵树的树干上挂满了奇怪的果实，散发着诱人的香气。\n西边是中心区域，南边、北边还有路。",
        exits: { west: "deep_forest_3_center", south: "deep_forest_2_e1", north: "cliff" },
        items: [],
        npcs: []
    },
    deep_forest_3_w1: {
        name: "深林",
        desc: "林间的空地上有一个石制的祭坛，上面长满了青苔。\n东边是中心区域，南边、北边还有路。",
        exits: { east: "deep_forest_3_center", south: "deep_forest_2_w1", north: "cliff" },
        items: [],
        npcs: []
    },
    deep_forest_3_w2: {
        name: "深林",
        desc: "一棵扭曲的老树挡住了去路，树枝间似乎有什么东西在窥视。\n东边是来的方向，西边、南边还有路。",
        exits: { east: "deep_forest_3_w1", west: "deep_forest_3_w3", south: "deep_forest_2_w2", north: "cliff" },
        items: [],
        npcs: []
    },
    deep_forest_3_w3: {
        name: "深林",
        desc: "深林的最深处，地面上的苔藓厚得可以没过脚踝。\n东边是来的方向，西边、南边还有路。",
        exits: { east: "deep_forest_3_w2", west: "deep_forest_3_w4", south: "deep_forest_2_w3", north: "cliff" },
        items: [],
        npcs: []
    },
    deep_forest_3_w4: {
        name: "深林",
        desc: "深林的西部边缘，雾气更加浓重。\n东边是来的方向，南边还有路。",
        exits: { east: "deep_forest_3_w3", south: "deep_forest_2_w4_extra" },
        items: [],
        npcs: []
    },
    // 悬崖（第8行，1个房间）
    cliff: {
        name: "悬崖",
        desc: "森林在这里戛然而止，前方是一道陡峭的悬崖。\n悬崖下是深不见底的深渊，云雾缭绕，看不到底部。\n在悬崖边缘矗立着一座古老的木屋，看起来已经有些年头了。\n南边回到深林，木屋可以进入。",
        exits: { south: "deep_forest_3_center" },
        items: ["wooden_hut"],
        npcs: []
    },
    // 木屋一层（独立房间）
    hut_floor1: {
        name: "木屋一层",
        desc: "一座古老木屋的内部，空气中弥漫着陈旧的木头气味。\n屋内陈设简陋，只有一张木桌和几把椅子。\n墙上挂着一些奇怪的符号和草药，角落里堆着一些破旧的行李。\n房间角落有一个通往二层的木质楼梯。\n落地窗前站着一位紫发女子，她背对着门口，淡紫色长发在月光下微微浮动。\n门口可以回到悬崖。",
        exits: { out: "cliff", up: "hut_floor2" },
        items: ["stairs_to_hut_floor2", "hut_door"],
        npcs: ["serena"]
    },
    // 木屋二层
    hut_floor2: {
        name: "木屋二层",
        desc: "木屋的二层，比一层更加简陋。\n斜顶的天花板让人不得不低头，一张简陋的床铺靠在墙边，床上铺着破旧的被褥。\n墙角放着一个满是灰尘的书架，上面散落着几本泛黄的书籍。\n一扇小窗户透进微弱的月光，照亮了空气中飘浮的尘埃。\n下方是回到一层的楼梯。",
        exits: { down: "hut_floor1" },
        items: ["stairs_to_hut_floor1"],
        npcs: []
    },

    // 花园中心
    garden_center: {
        name: "花园",
        desc: "一片精心打理的私人花园，与外面的荒野形成鲜明对比。\n各种珍稀的花卉在这里争奇斗艳，空气中弥漫着醉人的香气。\n花园中央是一座喷泉，水流潺潺，几条石板小径向四周延伸。\n东边是围栏门，南边、北边、西边都是花园的其他区域。",
        exits: { east: "fence_gate", south: "garden_south", north: "garden_north", west: "greenhouse" },
        items: [],
        npcs: []
    },
    // 花园南侧
    garden_south: {
        name: "花园",
        desc: "花园的南侧区域，种植着大片盛开的玫瑰花丛。\n深红、粉红、纯白的花朵在阳光下绽放，形成一片花的海洋。\n花丛中摆放着几张白色的大理石长椅，供人休息赏花。\n北边是花园中心区域，东边是围栏门。",
        exits: { north: "garden_center", east: "fence_gate" },
        items: [],
        npcs: []
    },
    // 花园北侧
    garden_north: {
        name: "花园",
        desc: "花园的北侧区域，这里种植着高大的灌木和修剪整齐的园艺造型。\n几棵古老的橡树为这里提供了大片阴凉，树下是修剪得整整齐齐的草坪。\n南边是花园中心区域，东边是围栏门。",
        exits: { south: "garden_center", east: "fence_gate" },
        items: [],
        npcs: []
    },
    // 温室（只在花园中心西侧）
    greenhouse: {
        name: "温室",
        desc: "一座用玻璃和铁架搭建的大型温室，里面种植着各种珍稀的热带植物。\n温暖湿润的空气扑面而来，与外面的清冷形成鲜明对比。\n架子上摆满了奇花异草，有些是珍贵的药材，有些则是纯粹的观赏植物。\n温室中央有一张工作台，上面放着各种园艺工具。\n东边是花园中心，西侧有一扇厚重的木门通往宅邸内部。",
        exits: { east: "garden_center", west: "mansion_back_door" },
        items: [],
        npcs: []
    },
    // 伯爵宅邸后门（温室西侧）
    mansion_back_door: {
        name: "伯爵宅邸后门",
        desc: "温室的尽头是一扇厚重的橡木门，门上雕刻着精美的花纹。\n这扇门通向兰德尔伯爵宅邸的内部，但门被牢牢锁住了。\n看起来需要强大的力量才能强行破开...\n东侧回到温室，西侧的木门可以破坏。",
        exits: { east: "greenhouse" },
        items: ["heavy_wooden_door"],
        npcs: []
    },
    // 一层走廊中心（破门后进入）
    corridor_center: {
        name: "一层走廊",
        desc: "一条宽敞而华丽的走廊，地面铺着厚厚的红色地毯。\n两侧墙壁上挂着精美的油画和壁灯，空气中弥漫着淡淡的熏香。\n这是兰德尔伯爵宅邸的内部，处处彰显着贵族的奢华。\n四周都是相似的走廊，东边是一扇破损的木门。",
        exits: { east: "mansion_back_door", west: "corridor_west", north: "corridor_north", south: "corridor_south" },
        items: [],
        npcs: []
    },
    // 一层走廊西侧
    corridor_west: {
        name: "一层走廊",
        desc: "走廊在这里向西延伸，两侧的油画描绘着兰德尔家族的历史。\n地毯上的花纹变得更加繁复，壁灯散发着柔和的光芒。\n东边是走廊中心，西侧通往宅邸大厅，北侧是会客室，南侧是卫生间。",
        exits: { east: "corridor_center", west: "mansion_hall", north: "reception_room", south: "bathroom" },
        items: [],
        npcs: []
    },
    // 宅邸大厅
    mansion_hall: {
        name: "宅邸大厅",
        desc: "宅邸的正厅，宽敞得令人咋舌。\n高耸的天花板上悬挂着巨大的水晶吊灯，光芒在四面八方的镜子上反射，让整个大厅亮如白昼。\n大厅中央是一条长长的红地毯，通向正前方的宝座。\n西侧是通往宅邸前院的出口，东侧是一层走廊。",
        exits: { west: "mansion_front_yard", east: "corridor_west" },
        items: [],
        npcs: []
    },
    // 会客室
    reception_room: {
        name: "会客室",
        desc: "一间典雅的会客室，布置得极为考究。\n舒适的沙发和扶手椅围绕着壁炉摆放，茶几上放着精致的茶具。\n墙上挂着兰德尔伯爵的肖像，彰显着主人的身份。\n南侧回到走廊。",
        exits: { south: "corridor_west" },
        items: ["sofa_set", "tea_table", "fireplace"],
        npcs: []
    },
    // 卫生间
    bathroom: {
        name: "卫生间",
        desc: "一间干净的卫生间，设施齐全。\n大理石浴缸、铜质水龙头、洁白的瓷砖，一切都一尘不染。\n角落里放着柔软的毛巾和香皂。\n北侧回到走廊。",
        exits: { north: "corridor_west" },
        items: ["marble_bathtub", "copper_faucet", "towel_rack"],
        npcs: []
    },
    // 一层走廊北侧
    corridor_north: {
        name: "一层走廊",
        desc: "走廊向北延伸，两侧的油画描绘着兰德尔家族的历史。\n地毯上的花纹变得更加繁复，壁灯散发着柔和的光芒。\n南边是走廊中心，北边通往有旋转楼梯的房间，西侧是用餐室。",
        exits: { south: "corridor_center", north: "corridor_north_2", west: "dining_room" },
        items: [],
        npcs: []
    },
    // 一层走廊南侧
    corridor_south: {
        name: "一层走廊",
        desc: "走廊向南延伸，光线略显昏暗。\n墙壁上挂着精美的壁灯，地毯柔软舒适。\n北边是走廊中心，南边通往有旋转楼梯的房间，西侧是女仆房间。",
        exits: { north: "corridor_center", south: "corridor_south_2", west: "maid_room" },
        items: [],
        npcs: []
    },
    // 一层走廊南侧第二间（有旋转楼梯）
    corridor_south_2: {
        name: "一层走廊",
        desc: "走廊的尽头是一扇装饰华丽的房门，似乎通向某个重要的房间。\n门旁的墙上挂着一盏精美的壁灯。\n房间角落有一座精美的旋转楼梯，通往二层。\n另外，你还注意到角落里有一个通往地下的入口，那是通往酒窖的楼梯。\n北边是来的路。",
        exits: { north: "corridor_south", down: "cellar_southeast" },
        items: ["spiral_stairs_south", "stairs_to_cellar"],
        npcs: []
    },
    // 用餐室（corridor_north西侧）
    dining_room: {
        name: "用餐室",
        desc: "一间宽敞明亮的用餐室，中央摆放着一张长长的橡木餐桌，周围环绕着高背椅。\n餐桌上铺着洁白的桌布，银质餐具整齐地摆放着。\n一侧的餐边柜上摆放着精美的瓷器。\n东侧是走廊，西侧通往厨房。",
        exits: { east: "corridor_north", west: "mansion_kitchen" },
        items: [],
        npcs: []
    },
    // 厨房
    mansion_kitchen: {
        name: "厨房",
        desc: "宅邸的厨房，比矿工食堂的厨房要豪华得多。\n大理石台面、铜质炊具、巨大的壁炉，一切都井然有序。\n空气中弥漫着香料和烘焙面包的香气。\n角落里有一个炉灶可以用来烹饪，台面上还放着一台榨奶器。墙边有一排壁橱。\n东侧是用餐室。",
        exits: { east: "dining_room" },
        items: ["stove", "milker", "wardrobe"],
        npcs: []
    },
    // 女仆房间（独立房间，corridor_south西侧）
    maid_room: {
        name: "女仆房间",
        desc: "一间狭窄、潮湿且充满皂荚味的房间，这是宅邸女仆索菲的住处。\n角落里放着一张简陋的单人床和一个小小的储物柜。\n女仆索菲正跪在冰冷的地板上，吃力地提着一大桶浑浊的冷水，机械地擦拭着地面。\n东侧回到走廊。",
        exits: { east: "corridor_south" },
        items: [],
        npcs: ["sophie"]
    },
    // 一层走廊北侧第二间（有旋转楼梯）
    corridor_north_2: {
        name: "一层走廊",
        desc: "走廊的尽头是一扇窗户，窗外是宅邸的后院。\n这里的光线很好，墙上挂着一面巨大的镜子。\n房间角落有一座精美的旋转楼梯，通往二层。\n南边是来的路。",
        exits: { south: "corridor_north" },
        items: ["spiral_stairs_north"],
        npcs: []
    },
    // 二层走廊北侧（旋转楼梯上来）
    // 二层走廊北侧（5号）
    second_floor_north: {
        name: "二层走廊",
        desc: "这是宅邸的二层走廊最北端，比一层更加安静。\n地面铺着柔软的地毯，踩上去几乎没有声音。\n南侧延伸着长长的走廊，西侧是书房，北侧是旋转楼梯可以下到一层。",
        exits: { south: "second_floor_1", west: "study", down: "corridor_north_2" },
        items: ["spiral_stairs_north_2f"],
        npcs: []
    },
    // 书房（5号西侧）
    study: {
        name: "书房",
        desc: "一间静谧的书房，四壁都是高耸的书架，摆满了各种典籍。\n宽大的书桌后面是一把皮椅，桌上放着羽毛笔和墨水。\n这里是兰德尔伯爵处理政务的地方。\n东侧回到走廊。",
        exits: { east: "second_floor_north" },
        items: ["bookcases", "leather_chair", "writing_desk"],
        npcs: []
    },
    // 三层走廊中心（从二层上来）
    third_floor_center: {
        name: "三层走廊",
        desc: "宅邸的三层走廊，这里比二层更加安静，几乎听不到任何声音。\n走廊两侧挂着家族历代祖先的肖像，气氛庄严肃穆。\n西侧是伯爵卧室，北侧延伸，下方是楼梯可以下到二层。",
        exits: { down: "second_floor_4", west: "count_bedroom", north: "third_floor_north" },
        items: ["stairs_to_second_floor"],
        npcs: []
    },
    // 伯爵卧室（三层西侧）
    count_bedroom: {
        name: "伯爵卧室",
        desc: "兰德尔伯爵的私人卧室，是整个宅邸最奢华的房间。\n巨大的四柱床上铺着天鹅绒被褥，墙上挂着昂贵的挂毯。\n一扇窗户可以俯瞰整个宅邸的花园。\n东侧回到走廊。",
        exits: { east: "third_floor_center" },
        items: ["four_post_bed", "tapestry", "window_view"],
        npcs: []
    },
    // 三层走廊北侧
    third_floor_north: {
        name: "三层走廊",
        desc: "三层走廊向北延伸，这里光线较暗，只有几盏壁灯提供微弱的照明。\n天花板上有通往阁楼的入口，一架木梯靠在墙边。\n南侧回到走廊中心，上方是阁楼。",
        exits: { south: "third_floor_center", up: "attic" },
        items: ["ladder_to_attic"],
        npcs: []
    },
    // 阁楼
    attic: {
        name: "阁楼",
        desc: "宅邸的阁楼，堆满了废弃的家具和旧物。\n灰尘在从天窗射入的光线中飞舞，空气中弥漫着陈旧的气息。\n角落里堆着几个大木箱，不知道里面装着什么。\n下方是木梯可以回到三层。",
        exits: { down: "third_floor_north" },
        items: ["ladder_from_attic", "old_furniture", "wooden_boxes"],
        npcs: []
    },
    // 二层走廊房间1（4号）
    second_floor_1: {
        name: "二层走廊",
        desc: "二层走廊向南延伸，两侧的墙壁上挂着家族成员的肖像。\n北边是来的方向，南边继续延伸，西侧是伯爵女儿卧室，东侧是一扇紧闭的房门。",
        exits: { north: "second_floor_north", south: "second_floor_2", west: "daughter_bedroom" },
        items: ["medium_wooden_door_cecilia"],
        npcs: []
    },
    // 伯爵女儿卧室（4号西侧）
    daughter_bedroom: {
        name: "伯爵女儿卧室",
        desc: "一间温馨雅致的少女卧室，粉色的窗帘和床品透露出房间主人的年龄。\n书架上摆满了诗集和小说，梳妆台上放着几支鲜花。\n东侧回到走廊。",
        exits: { east: "second_floor_1" },
        items: ["pink_bed", "bookshelf", "dressing_table"],
        npcs: ["cecilia"]
    },
    // 二层走廊房间2（3号）
    second_floor_2: {
        name: "二层走廊",
        desc: "走廊中段，这里有几扇紧闭的房门，似乎是卧室或书房。\n北边是来的方向，南边继续延伸，东侧通往露台。",
        exits: { north: "second_floor_1", south: "second_floor_3", east: "terrace" },
        items: [],
        npcs: []
    },
    // 露台（3号东侧）
    terrace: {
        name: "露台",
        desc: "一个宽敞的露台，可以俯瞰宅邸的花园和远处的山峦。\n几张藤椅和茶几摆放在这里，是享受下午茶的好地方。\n西侧回到走廊。",
        exits: { west: "second_floor_2" },
        items: ["wicker_chairs", "tea_table_terrace"],
        npcs: []
    },
    // 二层走廊房间3（2号）
    second_floor_3: {
        name: "二层走廊",
        desc: "走廊继续向南延伸，窗外可以看到宅邸的花园。\n北边是来的方向，南边继续延伸，西侧是伯爵夫人卧室，东侧是家庭教师卧室和家庭教师东侧的一扇紧锁房门。",
        exits: { north: "second_floor_2", south: "second_floor_4", west: "countess_bedroom", east: "tutor_bedroom" },
        items: ["medium_wooden_door_countess"],
        npcs: []
    },
    // 伯爵夫人卧室（2号西侧）
    countess_bedroom: {
        name: "伯爵夫人卧室",
        desc: "一间典雅华贵的卧室，这是兰德尔伯爵夫人的私人空间。\n四柱床上挂着轻纱帐幔，梳妆台上摆满了精致的香水瓶。\n空气中弥漫着淡淡的玫瑰香气。\n房间角落的雕花沙发上，一位年轻女人正独自倚靠着。\n东侧回到走廊。",
        exits: { east: "second_floor_3" },
        items: [],
        npcs: ["isabella"]
    },
    // 家庭教师卧室（2号东侧，146号）
    tutor_bedroom: {
        name: "家庭教师卧室",
        desc: "一间简洁而雅致的小卧室，这是兰德尔家家庭教师的住处。\n书架上摆满了各种教材和经典文学作品，书桌上摊开着一本未读完的书，一位银发女子正安静地坐在桌前写作。\n墙上挂着一幅世界地图和几幅风景画。\n床头的台灯散发着温暖的光芒，给房间增添了一丝温馨。\n西侧回到走廊。",
        exits: { west: "second_floor_3" },
        items: [],
        npcs: ["elena"]
    },
    // 二层走廊房间4（最南侧，有旋转楼梯）
    second_floor_4: {
        name: "二层走廊",
        desc: "走廊的最南侧，光线柔和而昏暗。\n这里有一座精美的旋转楼梯通往一层，楼梯的扶手雕花精美。\n北边是来的方向，上方是旋转楼梯可以下到一层。",
        exits: { north: "second_floor_3", down: "corridor_south_2" ,up:"third_floor_center"},
        items: ["spiral_stairs_south_2f","stairs_to_third_floor"],
        npcs: []
    },

    // ========== 酒窖区域（3x3空间） ==========
    // 酒窖东南角（起点，从一层走廊下来）
    cellar_southeast: {
        name: "酒窖",
        desc: "宅邸的地下酒窖，空气中弥漫着陈年葡萄酒的醇香。\n这里是用石头砌成的地下空间，墙壁上长满了青苔，几盏昏黄的油灯提供着微弱的照明。\n四周是整齐排列的橡木酒架，上面摆满了各种年份的葡萄酒。\n上方是通往一层的楼梯，北边、西边都有路。",
        exits: { up: "corridor_south_2", north: "cellar_east", west: "cellar_south" },
        items: ["stairs_from_cellar", "red_wine", "white_wine", "sherry", "sake", "huadiao_wine"],
        npcs: []
    },
    // 酒窖东边中间
    cellar_east: {
        name: "酒窖",
        desc: "酒窖的东侧区域，这里的酒架上摆放着许多珍稀的甜酒。\n空气中除了酒香，还夹杂着一丝潮湿的霉味。\n南边、北边、西边都有路。",
        exits: { south: "cellar_southeast", north: "cellar_northeast", west: "cellar_center" },
        items: ["sherry", "sherry", "sake", "sake", "red_wine"],
        npcs: []
    },
    // 酒窖东北角
    cellar_northeast: {
        name: "酒窖",
        desc: "酒窖的东北角，这里存放着最为珍贵的陈年老酒。\n酒架上积满了灰尘，显示出这些酒已经存放了很长时间。\n南边、西边都有路。",
        exits: { south: "cellar_east", west: "cellar_north" },
        items: ["sherry", "huadiao_wine", "white_wine", "red_wine", "sake"],
        npcs: []
    },
    // 酒窖南边中间
    cellar_south: {
        name: "酒窖",
        desc: "酒窖的南侧区域，这里的温度比其他地方稍高一些。\n酒架上摆放着许多新酿的葡萄酒，标签上还写着年份。\n东边、北边、西边都有路。",
        exits: { east: "cellar_southeast", north: "cellar_center", west: "cellar_southwest" },
        items: ["white_wine", "sake", "sherry", "red_wine", "huadiao_wine"],
        npcs: []
    },
    // 酒窖中心
    cellar_center: {
        name: "酒窖",
        desc: "酒窖的中央区域，这里有一个巨大的橡木酒桶，足足有一人多高。\n酒桶上刻着兰德尔家族的徽记，旁边放着几个取酒用的长柄勺。\n四周的酒架上摆满了各式各样的酒瓶。\n东边、南边、西边、北边都有路。",
        exits: { east: "cellar_east", south: "cellar_south", west: "cellar_west", north: "cellar_north" },
        items: ["sake", "sherry", "red_wine", "white_wine", "huadiao_wine"],
        npcs: []
    },
    // 酒窖北边中间
    cellar_north: {
        name: "酒窖",
        desc: "酒窖的北侧区域，这里的温度比其他地方稍低，墙壁上甚至结着一层薄薄的白霜。\n这里存放着一些需要低温保存的特殊酒类。\n东边、南边、西边都有路。",
        exits: { east: "cellar_northeast", south: "cellar_center", west: "cellar_northwest" },
        items: ["sake", "sake", "sherry", "white_wine", "red_wine"],
        npcs: []
    },
    // 酒窖西南角
    cellar_southwest: {
        name: "酒窖",
        desc: "酒窖的西南角，这里堆放着一些空酒桶和酿酒工具。\n角落里还有一张小木桌，上面放着一本记录酒库存的账本。\n东边、北边都有路。",
        exits: { east: "cellar_south", north: "cellar_west" },
        items: ["huadiao_wine", "sherry", "sake", "white_wine", "red_wine"],
        npcs: []
    },
    // 酒窖西边中间
    cellar_west: {
        name: "酒窖",
        desc: "酒窖的西侧区域，这里的酒架上摆放着许多烈性酒。\n瓶子的形状各异，有些还贴着奇怪的标签。\n东边、南边、北边都有路。",
        exits: { east: "cellar_center", south: "cellar_southwest", north: "cellar_northwest" },
        items: ["sherry", "sherry", "sake", "red_wine", "white_wine"],
        npcs: []
    },
    // 酒窖西北角
    cellar_northwest: {
        name: "酒窖",
        desc: "酒窖的西北角，这里是整个酒窖最阴暗的地方。\n一盏快要熄灭的油灯挂在墙上，只能照亮很小一片区域。\n深处似乎有什么东西在微微发光...\n东边、南边都有路。",
        exits: { east: "cellar_north", south: "cellar_west" },
        items: ["sake", "sake", "sherry", "huadiao_wine", "red_wine"],
        npcs: []
    },

    // ========== 地下室（森林落叶堆下方） ==========
    basement: {
        name: "地下室",
        desc: "你顺着地道向下攀爬，来到了一间隐蔽的地下室。\n这里似乎是一个古老的密室，石壁上刻满了奇怪的符文，散发着微弱的幽蓝色光芒。\n房间中央的地面上刻着一个巨大的魔法阵，阵法中心的符文不断旋转，散发着神秘的能量波动。\n空气中弥漫着一股古老而神秘的气息。\n上方是通往森林的地道出口。",
        exits: { up: "forest_4_center" },
        items: ["teleport_circle", "basement_ladder_up"],
        npcs: []
    }
};
