// ============================================================
//  世界地图数据库 - 卡伦镇区域
// ============================================================

const WORLD_TEMPLATE_1 = {
    // 马路房间（通往卡伦镇的起点）
    road: {
        name: "马路",
        desc: "一条宽敞的马路，连接着卡伦镇和外界。\n路面上铺着平整的石板，石板间的缝隙里长着细碎的苔藓。\n远处隐约可见卡伦镇的轮廓，教堂的尖顶在天际线上若隐若现。\n你已经成功逃离了桑华山矿场，开始了新的生活。",
        exits: { north: "road_north_1" },
        items: ['sanghuashan_mine'],
        npcs: []
    },
    road_north_1: {
        name: "马路",
        desc: "马路继续向北延伸，两旁的荒野逐渐被稀疏的农田取代。\n泥土的芬芳随风飘来，田垄间杂草丛生。\n远处的卡伦镇轮廓愈发清晰，教堂尖顶的十字架在天际间勾勒出分明的线条。",
        exits: { south: "road", north: "road_north_2" },
        items: [],
        npcs: []
    },
    road_north_2: {
        name: "马路",
        desc: "路两旁开始出现低矮的石墙和木栅栏，划分着田地的边界。\n木栅栏多处歪斜，有些已经腐朽倒塌，露出后方的农田。\n空气中飘来泥土和青草的气息，远处隐约传来牲畜的嘶鸣。",
        exits: { south: "road_north_1", north: "road_north_3" },
        items: [],
        npcs: []
    },
    road_north_3: {
        name: "马路",
        desc: "道路两旁开始出现零星的建筑，大多是低矮的茅草屋和木棚。\n屋墙斑驳，屋顶的茅草稀疏凌乱。\n不远处卡伦镇的城墙已经清晰可见，城墙上爬满了藤蔓和青苔。",
        exits: { south: "road_north_2", north: "road_north_4" },
        items: [],
        npcs: []
    },
    road_north_4: {
        name: "马路",
        desc: "卡伦镇的城墙就在眼前，高大的石墙由规整的灰岩砌成，墙面布满了岁月的痕迹。\n城墙根部杂草丛生，几株藤蔓攀附其上。\n石板路在城门前变得宽阔，路面上有深深的车辙印痕。\n北边就是卡伦镇大门了。",
        exits: { south: "road_north_3", north: "karen_town_gate" },
        items: [],
        npcs: []
    },
    // 卡伦镇大门
    karen_town_gate: {
        name: "卡伦镇大门",
        desc: "一座用厚重石块砌成的镇门，门楣上刻着「卡伦镇」三个大字，字迹已被风雨侵蚀得有些模糊。\n城门由两扇厚重的橡木门构成，门板上镶嵌着生锈的铁钉和铁箍。\n门洞内幽暗深邃，两侧墙壁上留有火把熏烤的黑痕。\n穿过城门，里面就是卡伦镇的街道了。",
        exits: { south: "road_north_4", north: "town_road_center" },
        items: [],
        npcs: []
    },

    // ========== 卡伦镇内部 - 中心街道 ==========
    town_road_center: {
        name: "街道",
        desc: "卡伦镇内的石板路在这里形成了一个十字路口。\n路面由青灰色的石板铺就，石板表面被无数脚步和车轮磨得光滑。\n路口中央有一口古旧的石砌水井，井沿上爬满了青苔。\n四周的建筑风格各异，北面通往镇子深处，东西两侧延伸向不同的街区。",
        exits: { south: "karen_town_gate", north: "town_road_n1", west: "town_road_w1", east: "town_road_e1" },
        items: [],
        npcs: []
    },

    // ========== 镇内北侧街道（3个） ==========
    town_road_n1: {
        name: "街道",
        desc: "石板路向北延伸，两旁是紧凑排列的石砌和木构房屋。\n墙角堆积着落叶，屋檐下挂着干枯的藤蔓。\n路面上有深深的车辙，路边的排水沟里积着浅浅的雨水。",
        exits: { south: "town_road_center", north: "town_road_n2" },
        items: [],
        npcs: []
    },
    town_road_n2: {
        name: "街道",
        desc: "街道在这里略微收窄，两侧的建筑变得高大了些。\n石墙上嵌着铁制的烛台，顶端有蜡油凝固的痕迹。\n一盏粗铁链悬挂的风灯在路中央摇晃，投下明暗交错的光影。",
        exits: { south: "town_road_n1", north: "town_road_n3" },
        items: [],
        npcs: []
    },
    town_road_n3: {
        name: "街道",
        desc: "街道尽头，前方矗立着一道气派的铁栅门。\n门柱由雕刻精细的灰岩砌成，顶端嵌着家族纹章。\n栅门后的庭院隐约可见，修剪整齐的灌木和碎石小径在远处延伸。\n北边就是伯爵城堡大门了。",
        exits: { south: "town_road_n2", north: "count_mansion_gate" },
        items: [],
        npcs: []
    },

    // 伯爵城堡大门
    count_mansion_gate: {
        name: "伯爵城堡大门",
        desc: "一道宏伟的锻铁大门矗立在眼前，门扇上铸有繁复的花纹和家族徽记。\n门柱高耸，顶端各蹲踞着一尊石雕狮鹫，威严地注视着来路。\n门后的石板甬道笔直延伸，两旁是修剪得一丝不苟的矮灌木丛。\n铁门紧闭，门上挂着一把沉重的铜锁。",
        exits: { south: "town_road_n3" },
        items: [],
        npcs: []
    },

    // ========== 镇内西侧街道 ==========
    town_road_w1: {
        name: "街道",
        desc: "石板路向西延伸，路面的石板间隙里生着杂草。\n两旁的房屋多是木石混搭的结构，墙体斑驳，木梁裸露。\n路边有一个废弃的石槽，里面积满了雨水和枯叶。",
        exits: { east: "town_road_center", west: "town_road_w2", north: "residence_w1" },
        items: [],
        npcs: []
    },
    town_road_w2: {
        name: "街道",
        desc: "街道两旁的建筑愈发低矮简陋，多为茅草屋顶。\n一截断裂的木栅栏歪倒在路边，栅栏后的院落里长满了野草。\n远处传来风穿过空旷木棚的呜咽声。",
        exits: { east: "town_road_w1", west: "town_road_w3", north: "bakery" },
        items: [],
        npcs: []
    },
    town_road_w3: {
        name: "街道",
        desc: "西侧街道的尽头，前方是一堵半坍塌的土墙。\n墙根下堆着碎石和朽木，几株野花从缝隙中顽强地探出头来。\n石板路在这里变得坑洼不平，碎裂的石板散落各处。\n东边是来时的路，北侧有一条狭窄的巷道通向更深处。",
        exits: { east: "town_road_w2", west: "town_road_w4", north: "residence_w3" },
        items: [],
        npcs: []
    },

    // ========== 镇内东侧街道 ==========
    town_road_e1: {
        name: "街道",
        desc: "石板路向东延伸，路面较为整洁。\n两旁的建筑比西侧更为规整，多为两层石砌小楼。\n墙上的灰泥已经剥落，露出内层的砖石。",
        exits: { west: "town_road_center", east: "town_road_e2" },
        items: [],
        npcs: []
    },
    town_road_e2: {
        name: "街道",
        desc: "街道在这里略显宽敞，路边有几棵老槐树。\n树干粗壮，枝叶繁茂，在石板路上投下大片树荫。\n树下的石凳上落满了枯叶，缝隙间长着薄薄的苔藓。",
        exits: { west: "town_road_e1", east: "town_road_e3"},
        items: [],
        npcs: []
    },
    town_road_e3: {
        name: "街道",
        desc: "东侧街道的尽头，前方是一面完整的石砌院墙。\n墙面被雨水冲刷出深浅不一的水痕，角落里攀着一丛枯萎的藤萝。\n石板路在这里终止，碎石和泥土混杂在一起。\n西边是来时的路，北侧隐约可见一座木质建筑的屋檐。",
        exits: { west: "town_road_e2", north: "town_road_e3_north" },
        items: [],
        npcs: []
    },

    // ========== 西侧建筑 ==========
    residence_w1: {
        name: "民房",
        desc: "一座低矮的石砌民房，墙面抹着粗糙的灰泥，多处已经剥落露出里面的碎石。\n木门歪斜地挂在门框上，门板上的漆色早已褪尽。\n屋顶铺着深灰色的石板瓦，几处已经碎裂，用茅草勉强填补。\n门前有一小片空地，碎石和泥土混杂。",
        exits: { south: "town_road_w1" },
        items: [],
        npcs: []
    },
    bakery: {
        name: "面包店",
        desc: "一间不大的石砌店铺，门面比两旁的民房稍显整洁。\n门口挂着一块褪色的木质招牌，上面用拙朴的笔触画着一个面包的图案。\n橱窗是粗糙的木框玻璃，玻璃上蒙着一层薄薄的灰。\n门缝里隐约飘出面粉和炭火烘烤过的气息。\n墙壁被烟囱熏得微微发黑。",
        exits: { south: "town_road_w2" },
        items: [],
        npcs: []
    },
    residence_w3: {
        name: "民房",
        desc: "一座与街角建筑风格相似的石砌民房，墙壁由大小不一的石块垒成。\n木门紧闭，门上挂着一把铜锁。\n窗洞用木板钉死，木板缝隙间透出一丝阴暗的光。\n屋顶长着一层薄薄的苔藓，几根枯藤从墙根攀爬到屋檐。",
        exits: { south: "town_road_w3" },
        items: [],
        npcs: []
    },

    // ========== 西侧延伸街道（w4、w5） ==========
    town_road_w4: {
        name: "街道",
        desc: "街道继续向西延伸，两旁的房屋越来越稀疏。\n石板路逐渐被碎石和泥土取代，路面布满了裂纹。\n一堵年久失修的矮墙沿着街道北侧延伸，墙头长满了枯黄的野草。\n东边是来时的路，西边还有一小段路。",
        exits: { east: "town_road_w3", west: "town_road_w5", north: "town_road_w4_n1" },
        items: [],
        npcs: []
    },
    town_road_w5: {
        name: "街道",
        desc: "西侧街道的最后一段，路面已经完全变成了压实的泥土。\n两旁是几间歪斜的棚屋，木板和铁皮拼凑而成的墙壁在风中吱呀作响。\n西边矗立着一扇低矮的铁门，门上锈迹斑斑，那是卡伦镇的侧门。\n东边是来时的石板路。",
        exits: { east: "town_road_w4", west: "karen_town_side_gate" },
        items: [],
        npcs: []
    },
    // 卡伦镇侧门
    karen_town_side_gate: {
        name: "卡伦镇侧门",
        desc: "一扇低矮的铁门嵌在斑驳的石墙中，门板上布满了锈蚀的痕迹。\n门楣上没有任何装饰，只有几道深深的划痕，像是被什么利器刮过。\n门外是一片荒芜的野地，枯草在风中摇曳。\n铁门虚掩着，推开便能离开卡伦镇。",
        exits: { east: "town_road_w5", west: "side_path_1" },
        items: [],
        npcs: []
    },

    // ========== 东侧延伸街道（e2北、e3北） ==========
    town_road_e3_north: {
        name: "街道",
        desc: "一条幽静的北向小路，路面由碎石铺就。\n两旁的院墙高大厚实，墙顶嵌着碎玻璃，似乎是为了防盗。\n远处传来风铃的叮当声，空气中飘着淡淡的花香。\n南边回到东侧街道。",
        exits: { south: "town_road_e3" },
        items: [],
        npcs: []
    },

    // ========== w4北侧街道（3个） ==========
    town_road_w4_n1: {
        name: "街道",
        desc: "一条向北延伸的小街，路面由青石板铺就。\n两旁是低矮的石砌仓房，墙面上留着烟熏的痕迹。\n空气中弥漫着干燥的草料和谷物气息。",
        exits: { south: "town_road_w4", north: "town_road_w4_n2" },
        items: [],
        npcs: []
    },
    town_road_w4_n2: {
        name: "街道",
        desc: "街道在这里收窄，两侧的墙壁上爬满了干枯的藤蔓。\n地面的石板碎裂严重，缝隙间长出了野草。\n头顶两旁的屋檐几乎要碰在一起，形成一条窄巷。",
        exits: { south: "town_road_w4_n1", north: "town_road_w4_n3" },
        items: [],
        npcs: []
    },
    town_road_w4_n3: {
        name: "街道",
        desc: "北侧街道的尽头，前方是一面斑驳的土墙。\n墙根堆着碎石和朽烂的木板，一只野猫从墙头跳下，消失在墙角的阴影中。\n南边是来时的路。",
        exits: { south: "town_road_w4_n2" },
        items: [],
        npcs: []
    },

    // ========== 侧门西侧小路（3个） ==========
    side_path_1: {
        name: "小路",
        desc: "出了侧门，脚下是松软的泥土地，枯黄的野草从两侧侵入路面。\n远处是一片低矮的丘陵，丘陵的轮廓在天际线上起伏。\n东边是卡伦镇侧门，西边继续延伸。",
        exits: { east: "karen_town_side_gate", west: "side_path_2" },
        items: [],
        npcs: []
    },
    side_path_2: {
        name: "小路",
        desc: "小路蜿蜒向西，两旁是半人高的枯草丛。\n风吹过草丛发出沙沙的声响，远处隐约可见一座建筑的尖顶。\n东边是来时的路，西边继续延伸。",
        exits: { east: "side_path_1", west: "side_path_3" },
        items: [],
        npcs: []
    },
    side_path_3: {
        name: "小路",
        desc: "小路的尽头变得宽敞，脚下重新出现了石板路面。\n几棵苍老的橡树矗立在路旁，粗壮的枝干向天空伸展。\n东边是来时的泥土小路，西边矗立着一扇厚重的木门。\n门框上方的石楣上雕刻着十字架的图案。",
        exits: { east: "side_path_2", west: "church_gate" },
        items: [],
        npcs: []
    },
    // 教堂大门
    church_gate: {
        name: "教堂大门",
        desc: "一座古老的石砌教堂矗立在眼前，尖顶直插云霄。\n正门是两扇厚重的橡木门，门板上钉着粗大的铁钉，门楣上方镶嵌着一扇彩色玻璃窗，描绘着不知名的宗教场景。\n门两侧各立着一尊风化的石像圣徒，面容模糊不清。\n教堂四周被一道低矮的石墙环绕，墙头攀附着常春藤。\n东边是通往镇子的小路，南边是教堂的院子。",
        exits: { east: "side_path_3", south: "church_courtyard_1" },
        items: [],
        npcs: []
    },

    // ========== 教堂院子区域 ==========
    church_courtyard_1: {
        name: "院子",
        desc: "教堂南侧的院子，地面铺着整齐的碎石，几株常青灌木沿着石墙根部修剪成球形。\n院子中央有一座古旧的石砌圣水池，池中的水面平静如镜。\n北边是教堂大门，南边还有院子延伸，西边有一扇木栅门通向更深处的院子。",
        exits: { north: "church_gate", south: "church_courtyard_2", west: "church_courtyard_1_w1" },
        items: [],
        npcs: []
    },
    church_courtyard_1_w1: {
        name: "院子",
        desc: "院子的西半部分，碎石路在这里变成了青苔覆盖的石板。\n一棵老橄榄树歪斜地生长在院子角落，枝干虬曲苍劲。\n树下放着一条风化严重的石凳，凳面上刻着模糊的拉丁铭文。\n东边是来时的院子，西边还有一道木栅门。",
        exits: { east: "church_courtyard_1", west: "church_courtyard_1_w2", south: "church_courtyard_2_w1" },
        items: [],
        npcs: []
    },
    church_courtyard_1_w2: {
        name: "院子",
        desc: "院子的最西北角，四周被一堵半人高的石墙环绕。\n墙角堆积着枯叶和断裂的树枝，一只乌鸦站在墙头。\n石板路在这里终止，前方是一扇通往北侧的小木门。\n东边是来时的院子。",
        exits: { east: "church_courtyard_1_w1", north: "cemetery", south: "church_courtyard_2_w2"},
        items: [],
        npcs: []
    },
    church_courtyard_2: {
        name: "院子",
        desc: "院子向南延伸，这里的植被更加茂密。\n几丛野玫瑰攀附在石墙上，枝条上挂着枯萎的花苞。\n一条窄窄的石板小径穿过杂草，通向西边的另一个院子。\n北边是来时的院子。",
        exits: { north: "church_courtyard_1", west: "church_courtyard_2_w1" },
        items: [],
        npcs: []
    },
    church_courtyard_2_w1: {
        name: "院子",
        desc: "院子的西南区域，碎石地面上长满了苔藓和蕨类植物。\n一架生锈的铁花架歪倒在墙边，花架上缠绕着干枯的藤蔓。\n空气潮湿而阴凉，弥漫着泥土和腐叶的气息。\n东边是来时的院子，西边还有一道木栅门。",
        exits: { east: "church_courtyard_2", west: "church_courtyard_2_w2",north:"church_courtyard_1_w1" },
        items: [],
        npcs: []
    },
    church_courtyard_2_w2: {
        name: "院子",
        desc: "西南角的院子，四周的石墙比其他地方更高。\n墙根下堆着一些破碎的石碑残片，字迹已经无法辨认。\n院子角落有一口枯井，井口用木板钉死，木板已经朽烂发黑。\n东边是来时的院子。",
        exits: { east: "church_courtyard_2_w1",north: "church_courtyard_1_w2"},
        items: [],
        npcs: []
    },
    cemetery: {
        name: "墓地",
        desc: "教堂后方的墓地，一排排歪斜的石碑矗立在荒草中。\n石碑上刻着逝者的名字和生卒年月，大多数字迹已被风雨侵蚀得模糊不清。\n墓碑之间散落着枯萎的花束和生锈的铁十字架，地面的泥土松软潮湿。\n一棵巨大的紫杉树矗立在墓地中央，浓密的枝叶遮蔽了大半天光。\n南边是教堂院子的木栅门。",
        exits: { south: "church_courtyard_1_w2" },
        items: [],
        npcs: []
    }
};
