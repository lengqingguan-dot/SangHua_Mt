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
        exits: { south: "town_road_center", north: "town_road_n2", west: "residence_w1", east: "slum_east_1" },
        items: [],
        npcs: []
    },
    town_road_n2: {
        name: "街道",
        desc: "街道在这里略微收窄，两侧的建筑变得高大了些。\n石墙上嵌着铁制的烛台，顶端有蜡油凝固的痕迹。\n一盏粗铁链悬挂的风灯在路中央摇晃，投下明暗交错的光影。",
        exits: { south: "town_road_n1", north: "town_road_n3", west: "slum_west_n1", east: "slum_east_n1" },
        items: [],
        npcs: []
    },
    town_road_n3: {
        name: "街道",
        desc: "街道在这里变得开阔，路面由精磨的青石板铺就，缝隙间长着薄薄的苔藓。\n两旁的建筑变得高大气派，底层橱窗陈列着来自各地的商品。\n北边延伸入卡伦镇的中心街区，东西两侧分别通向贫民窟与新街区。",
        exits: { south: "town_road_n2", north: "center_street_1", west: "town_road_n2_e2", east: "town_road_e2_n1" },
        items: [],
        npcs: []
    },

    // ========== 中心街道（3个） ==========
    center_street_1: {
        name: "中心街道",
        desc: "一条宽阔的石板大道，路面由精心打磨的青石铺就。\n两旁整齐排列着两层高的石砌建筑，底层是各色店铺，橱窗干净明亮。\n街边每隔几步便有一盏铸铁路灯，悬挂着微微摇晃的玻璃灯罩。\n空气中弥漫着烤面包和咖啡的香气，偶有马车碾过石板路发出清脆的蹄声。",
        exits: { south: "town_road_n3", north: "center_street_2" },
        items: [],
        npcs: []
    },
    center_street_2: {
        name: "中心街道",
        desc: "中心街道继续向北延伸，路面更加宽阔。\n两旁建筑的高度渐增，三层的石砌楼房夹道而立，阳台上摆着盆栽花卉。\n街心的喷泉池中央立着一尊风化的石雕女神像，池水清冽映着天光。\n来往的行人衣着体面，偶有贵族马车驶过。",
        exits: { south: "center_street_1", north: "center_street_3" },
        items: [],
        npcs: []
    },
    center_street_3: {
        name: "中心街道",
        desc: "中心街道的北段，前方一片开阔——那是卡伦镇的中央广场。\n街道在这里略微收窄，两侧建筑的底楼全是考究的店铺：面包坊、裁缝铺、香料店。\n北边广场上的钟楼尖顶已经清晰可见，在午后的阳光下投下修长的影子。",
        exits: { south: "center_street_2", north: "town_square" },
        items: [],
        npcs: []
    },

    // ========== 镇中广场 ==========
    town_square: {
        name: "镇中广场",
        desc: "一片宽阔的方形广场，地面由一块块巨大的灰岩石板铺就，石缝间生着细碎的青苔。\n广场中央矗立着一座古老的石砌钟楼，钟面已经风化发黄，但指针仍在缓缓转动。\n钟楼四周散布着几条石凳和废弃的花坛，几只鸽子在石板地上啄食面包屑。\n广场四通八达：西边通向镇外农田，东边连接着驿站与集市，北边的主路则通往伯爵城堡的方向。",
        exits: { south: "center_street_3", west: "square_w1", east: "square_e1", north: "square_n1" },
        items: [],
        npcs: []
    },

    // ========== 广场西侧街道（3个） ==========
    square_w1: {
        name: "中心街道",
        desc: "广场西侧延伸出的街道，路面由青石铺就，向前逐渐变窄，碎石从石板缝隙间露了出来。\n远处的视野渐渐开阔，隐约可见低矮的田垄和远处起伏的丘陵轮廓。\n路旁是一家农具铺和一家种子店，铺子门口堆着铁锹和麻袋，空气中飘着干草和泥土的气息。",
        exits: { east: "town_square", west: "square_w2" },
        items: [],
        npcs: []
    },
    square_w2: {
        name: "中心街道",
        desc: "西侧街道继续延伸，两旁的建筑渐渐低矮稀疏。\n路边停着几辆装满蔬菜和谷物的板车，系在柱上的驮马甩着尾巴驱赶蝇虫。\n空气中弥漫着泥土、秸秆和牲畜的气息，前方一片开阔——那是卡伦镇西侧的农田。",
        exits: { east: "square_w1", west: "square_w3" },
        items: [],
        npcs: []
    },
    square_w3: {
        name: "中心街道",
        desc: "西侧街道的尽头，前方一扇粗木栅栏门敞开着，门外的碎石路直通卡伦镇西侧的农田区。\n田野一望无际，整齐的田垄间麦浪在风中起伏，偶有农人的身影在田间劳作。\n街角有一家小酒馆，招牌上画着一只歪斜的酒杯，门口飘着淡淡的麦酒香，为田里归来的人们解渴。\n东边是回广场的路，西边穿过栅栏门便是广阔的农田。",
        exits: { east: "square_w2", west: "farm_3_5" },
        items: [],
        npcs: []
    },

    // ========== 广场东侧街道（3个） ==========
    square_e1: {
        name: "中心街道",
        desc: "广场东侧延伸出的街道，路面宽阔平整，足以容纳两辆马车并行。\n两旁建筑以货栈和车马行为主，石砌仓库门前停着卸货的平板马车，车夫们忙碌地搬运着捆扎好的货物。\n空气中混着皮革、草料和远方飘来的香料气味，远处隐约传来集市嘈杂的人声。",
        exits: { west: "town_square", east: "square_e2" },
        items: [],
        npcs: []
    },
    square_e2: {
        name: "中心街道",
        desc: "东侧街道的中段，路中央有一条供驮马饮水的长石槽，水面上浮着零星的草屑。\n两旁是旅店和商行，石砌门面挂着各色招牌。\n人行道上各色人等往来匆匆——背着行囊的旅人、牵着骡马的商贩、沿街叫卖的小贩——空气中混合着汗味、香料和烤饼的香气。",
        exits: { west: "square_e1", east: "square_e3" },
        items: [],
        npcs: []
    },
    square_e3: {
        name: "中心街道",
        desc: "东侧街道的尽头，路面愈发开阔。\n前方立着一座石砌拱门，门楣上刻着「卡伦镇驿」的字样，门下车辆行人络绎不绝。\n拱门后传来马匹嘶鸣和车轮辘辘的声响——那便是镇子的驿站与集市所在。\n拱门一侧立着告示牌，张贴着往来的商队行程和集市开市的日期。\n西边是回广场的路，东边穿过拱门继续延伸。",
        exits: { west: "square_e2", east: "square_e4" },
        items: [],
        npcs: []
    },
    square_e4: {
        name: "街道",
        desc: "穿过石砌拱门后，街道继续向东延伸。\n两旁的建筑从商铺渐渐变为车马行和货栈，门前停满了装载货物的板车。\n路面被车轮碾出了深深的车辙，空气中弥漫着草料和马匹的气息。\n西边是回广场的拱门，东边继续通向驿站。",
        exits: { west: "square_e3", east: "square_e5" },
        items: [],
        npcs: []
    },
    square_e5: {
        name: "街道",
        desc: "东侧街道的最东端，路面在这里变得极为宽阔，足以容纳数辆马车同时停靠。\n路边的拴马桩上系着各色马匹，有的低头饮水，有的甩尾驱赶蝇虫。\n一座两层高的石砌建筑矗立在路北侧，门楣上的铜牌在阳光下闪闪发光。\n西边是来时的街道，东边便是驿站的正门。",
        exits: { west: "square_e4", east: "karen_relay_station" },
        items: [],
        npcs: []
    },
    karen_relay_station: {
        name: "卡伦镇驿站",
        desc: "一座宽大的二层石砌建筑，正门上方悬挂着刻有「卡伦镇驿」的铜匾。\n一楼的马厩里拴着十几匹健壮的驿马，马夫正忙着喂草刷毛。\n院中停着几辆驿车，车夫们三三两两地蹲在车旁闲聊。\n柜台后面坐着一位戴眼镜的老驿丞，正低头整理着厚厚的登记簿。\n墙上贴满了往来的驿路图和时刻表，空气里混合着草料、皮革和马汗的气息。\n西边是回镇子的街道。",
        exits: { west: "square_e5" },
        items: [],
        npcs: []
    },

    // ========== 广场北侧街道（3个） ==========
    square_n1: {
        name: "中心街道",
        desc: "广场北侧的主街，路面由宽大的青石板铺成。\n两旁的建筑风格端庄，石墙上嵌着家族纹章浮雕，昭示着这些楼宇主人的显赫身份。\n远处隐约可见伯爵城堡的灰色塔楼轮廓，塔尖的山鹰旗帜在风中飘扬。\n东侧传来酒杯碰撞声和喧闹的人声——那是卡伦酒馆的所在。",
        exits: { south: "town_square", north: "square_n2", east: "karen_tavern" },
        items: [],
        npcs: []
    },
    square_n2: {
        name: "中心街道",
        desc: "北侧街道继续延伸，路面略微升高的坡度使人感到正在接近镇子的高地区域。\n两旁的建筑逐渐减少，取而代之的是修剪整齐的树篱和石砌矮墙。\n空气中飘着花园玫瑰的芬芳，北边隐约可见一处宏伟府邸的轮廓。\n西侧一扇精致铁栅门后面是抄写员的住宅。",
        exits: { south: "square_n1", north: "square_n3", west: "scribe_residence_gate" },
        items: [],
        npcs: []
    },
    square_n3: {
        name: "中心街道",
        desc: "北侧高地区域的街道尽头。前方是一道铁栅围栏和两扇厚实的橡木大门，\n门楣上嵌着一枚铜铸纹章——展翅雄鹰被剑盾环绕，那是狮鹫骑士团的团徽。\n门后隐约可见伯爵城堡的灰色塔楼，塔尖旗帜猎猎作响。",
        exits: { south: "square_n2", north: "fence_gate_north" },
        items: [],
        npcs: []
    },

    // ========== 城堡围栏门 ==========
    fence_gate_north: {
        name: "围栏大门",
        desc: "一道铁栅围栏横在街道北端，中央两扇厚实的橡木大门上钉着粗大的铁钉。\n门柱两侧各站着一名披甲卫兵，胸甲上刻着伯爵家族的山鹰纹章，手中的长戟在阳光下泛着冷光。\n围栏之后是一条平坦的石板甬道，两侧旗杆上蓝底旗帜迎风招展，绣着展翅的山鹰——狮鹫骑士团的团徽。\n北边石板大道通向城堡区域，隐约传来操练的号令和兵器碰撞的声响。\n大门由伯爵亲卫把守，无令不得通行。",
        exits: { south: "square_n3", north: "castle_road_1" },
        items: [],
        npcs: ["castle_guard_1", "castle_guard_2"]
    },

    // ========== 城堡区域 ==========
    castle_road_1: {
        name: "石板路",
        desc: "一条宽阔的石板大道，从围栏大门向北延伸。路面由大块青石板铺就，两侧每隔十步立着一根石柱，柱顶的铁环里插着未燃的火把。东边一条岔路向东延伸，北边继续通向城堡深处。",
        exits: { south: "fence_gate_north", north: "castle_road_2", east: "castle_road_e1" },
        items: [], npcs: []
    },
    castle_road_2: {
        name: "石板路",
        desc: "石板大道在这里抵达一个小型岔路口。北边伯爵城堡的灰色主塔已近在眼前，厚重的橡木城门上刻着巨大的山鹰浮雕。西侧一扇铁栅门后是一片宽阔的演武场——那是狮鹫骑士团的驻地。",
        exits: { south: "castle_road_1", west: "griffin_knight_hq" },
        items: [], npcs: []
    },
    griffin_knight_hq: {
        name: "狮鹫骑士驻地",
        desc: "一片宽阔的演武场，青石地面上到处是枪矛和剑盾留下的深深刻痕。场边排列着数栋石砌长屋，墙面上挂着蓝底山鹰旗帜。兵器架上整齐地摆放着长戟和阔剑，几名骑士正在场中央对练，金属碰撞的清脆声响回荡在演武场上空。东边铁栅门外是城堡的主路。",
        exits: { east: "castle_road_2" },
        items: [], npcs: []
    },
    castle_road_e1: {
        name: "石板路",
        desc: "一条向东延伸的石板岔路，路面比主道略窄。两旁的矮墙修剪整齐，墙后种着深绿色的紫杉。空气中飘着淡淡的花香，与演武场方向传来的金属碰撞声形成奇特的对比。西边回到城堡主道。",
        exits: { west: "castle_road_1", east: "castle_road_e2" },
        items: [], npcs: []
    },
    castle_road_e2: {
        name: "石板路",
        desc: "石板岔路继续向东延伸，路面在这里变得更宽，铺着精心打磨的灰色花岗岩石板。两侧立着高大的石柱，柱身雕刻着狮鹫与山鹰的图案。前方矗立着伯爵城堡的主城门，门楣上方悬挂着巨大的伯爵家族纹章。",
        exits: { west: "castle_road_e1", east: "count_castle_gate" },
        items: [], npcs: []
    },
    count_castle_gate: {
        name: "伯爵城堡大门",
        desc: "一座宏伟的城堡矗立在眼前，灰色石墙高耸入云。厚重橡木城门上雕刻着展翅的山鹰，鹰眼镶嵌着两颗幽蓝的宝石，在阳光下泛着冷冽的光芒。城门紧闭，两侧各站着一名全副武装的城堡卫兵。城堡塔楼上的旗帜在风中猎猎作响，仿佛在宣告此地的主人——兰德尔伯爵大人的威严。",
        exits: { west: "castle_road_e2" },
        items: [], npcs: []
    },

    // ========== 抄写员住宅 ==========
    scribe_residence_gate: {
        name: "抄写员住宅",
        desc: "一扇精致的铁栅门嵌在一道低矮的石墙中央。\n门后的庭院里种着几株修剪整齐的薰衣草，碎石小径通向一座两层高的石砌小楼。\n小楼的窗户里透出暖黄色的灯光，隐约可见书架上密密排列的书卷。\n门上挂着一块小木牌，用工整的字体写着「抄写员公会·卡伦镇分会」。",
        exits: { east: "square_n2" },
        items: [],
        npcs: []
    },

    // ========== 卡伦酒馆 ==========
    karen_tavern: {
        name: "卡伦酒馆",
        desc: "一幢两层高的石砌建筑，底楼的窗户透出暖黄的烛光。\n门口挂着一块铁制招牌，上面刻着一只装满麦酒的木杯。\n推开厚重的橡木门，麦酒和烤肉的香气扑面而来。\n店堂里几张方木桌上点着蜡烛，几个镇民正举杯畅饮。\n吧台后面站着一个围裙上沾满面粉的中年女人，正麻利地擦拭着陶杯。",
        exits: { west: "square_n1" },
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
        exits: { east: "town_road_w1", west: "town_road_w3", north: "residence_w2" },
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
        desc: "石板路向东延伸，路面较为整洁。\n两旁的建筑比西侧更为规整，多为两层石砌小楼。\n墙上的灰泥已经剥落，露出内层的砖石。\n北侧有一条窄巷通向一片棚屋区。",
        exits: { west: "town_road_center", east: "town_road_e2", north: "slum_east_1" },
        items: [],
        npcs: []
    },
    town_road_e2: {
        name: "街道",
        desc: "街道在这里略显宽敞，路边有几棵老槐树。\n树干粗壮，枝叶繁茂，在石板路上投下大片树荫。\n树下的石凳上落满了枯叶，缝隙间长着薄薄的苔藓。\n北侧有一条窄巷通向一片棚屋区。",
        exits: { west: "town_road_e1", east: "town_road_e3", north: "slum_east_2"},
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
        name: "贫民窟西",
        desc: "一片破败的棚屋区，低矮的木棚和石砌小屋杂乱地挤在一起。\n墙壁歪斜，屋顶的茅草和铁皮在风中吱呀作响。\n地面上满是泥泞和碎石，角落里堆着发霉的干草和破烂的麻布。\n空气中弥漫着潮湿、霉烂和贫穷的气息。",
        exits: { south: "town_road_w1", north: "slum_west_n1", west: "residence_w2", east: "town_road_n1" },
        items: ["peasant_hut_1"],
        npcs: []
    },
    residence_w2: {
        name: "贫民窟西",
        desc: "一片破败的棚屋区，低矮的木棚和石砌小屋杂乱地挤在一起。\n墙壁歪斜，屋顶的茅草和铁皮在风中吱呀作响。\n地面上满是泥泞和碎石，角落里堆着发霉的干草和破烂的麻布。\n空气中弥漫着潮湿、霉烂和贫穷的气息。",
        exits: { south: "town_road_w2", north: "slum_west_n2", west: "residence_w3", east: "residence_w1" },
        items: [],
        npcs: []
    },
    residence_w3: {
        name: "贫民窟西",
        desc: "一片破败的棚屋区，低矮的木棚和石砌小屋杂乱地挤在一起。\n墙壁歪斜，屋顶的茅草和铁皮在风中吱呀作响。\n地面上满是泥泞和碎石，角落里堆着发霉的干草和破烂的麻布。\n空气中弥漫着潮湿、霉烂和贫穷的气息。",
        exits: { south: "town_road_w3", north: "slum_west_n3", east: "residence_w2", west:'town_road_w4_n1' },
        items: ["peasant_hut_2"],
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

    // ========== 东侧建筑（贫民窟东） ==========
    slum_east_1: {
        name: "贫民窟东",
        desc: "一片破败的棚屋区，低矮的木棚和石砌小屋杂乱地挤在一起。\n墙壁歪斜，屋顶的茅草和铁皮在风中吱呀作响。\n地面上满是泥泞和碎石，角落里堆着发霉的干草和破烂的麻布。\n空气中弥漫着潮湿、霉烂和贫穷的气息。",
        exits: { south: "town_road_e1", north: "slum_east_n1", east: "slum_east_2", west: "town_road_n1" },
        items: [],
        npcs: []
    },
    slum_east_2: {
        name: "贫民窟东",
        desc: "一片破败的棚屋区，低矮的木棚和石砌小屋杂乱地挤在一起。\n墙壁歪斜，屋顶的茅草和铁皮在风中吱呀作响。\n地面上满是泥泞和碎石，角落里堆着发霉的干草和破烂的麻布。\n空气中弥漫着潮湿、霉烂和贫穷的气息。",
        exits: { south: "town_road_e2", north: "slum_east_n2", west: "slum_east_1", east: "town_road_e3_north" },
        items: [],
        npcs: []
    },

    // ========== 贫民窟西·北 ==========
    slum_west_n1: {
        name: "贫民窟西",
        desc: "棚屋区向北延伸，这里的棚屋更加残破不堪。\n几间棚屋顶已经塌陷，露出里面的朽木梁架。\n地面上满是积水坑和散落的碎瓦，狭窄的巷道蜿蜒在棚屋之间。\n空气中弥漫着潮湿、霉烂和贫穷的气息。",
        exits: { south: "residence_w1", north: "town_road_n2_e2", west: "slum_west_n2", east: "town_road_n2" },
        items: ["peasant_hut_3"],
        npcs: []
    },
    slum_west_n2: {
        name: "贫民窟西",
        desc: "棚屋区向北延伸，这里的棚屋更加残破不堪。\n几间棚屋顶已经塌陷，露出里面的朽木梁架。\n地面上满是积水坑和散落的碎瓦，狭窄的巷道蜿蜒在棚屋之间。\n空气中弥漫着潮湿、霉烂和贫穷的气息。",
        exits: { south: "residence_w2", north: "town_road_n2_e1", west: "slum_west_n3", east: "slum_west_n1" },
        items: ["peasant_hut_4"],
        npcs: []
    },
    slum_west_n3: {
        name: "贫民窟西",
        desc: "棚屋区向北延伸，这里的棚屋更加残破不堪。\n几间棚屋顶已经塌陷，露出里面的朽木梁架。\n地面上满是积水坑和散落的碎瓦，狭窄的巷道蜿蜒在棚屋之间。\n空气中弥漫着潮湿、霉烂和贫穷的气息。",
        exits: { south: "residence_w3", north: "town_road_n2_w1", east: "slum_west_n2", west: "town_road_w4_n2" },
        items: ["slum_hut"],
        npcs: []
    },
    slum_hut_inside: {
        name: "窝棚",
        desc: "一间低矮破旧的窝棚，四壁用薄木板和破布拼凑而成，漏风的缝隙里透进几缕昏暗的天光。\n地上铺着发霉的干草，角落里堆着几个豁口的陶罐。空气中弥漫着潮湿、霉烂和淡淡的血腥味。\n东边的破布门帘通向贫民窟。",
        exits: { east: "slum_west_n3" },
        items: [],
        npcs: []
    },
    slum_tunnel: {
        name: "地道",
        desc: "一条幽暗狭窄的地道，空气潮湿而阴冷，头顶的活板门隔绝了地上的喧闹。\n角落里一团微弱的烛光轻轻摇曳，映出一个瘦小的人影。\n上方那扇活板门可以回到窝棚，北边则继续延伸向地下深处。",
        exits: { north: "slum_tunnel_n1" },
        items: ["slum_trapdoor_exit"],
        npcs: ["slum_girl"]
    },
    slum_tunnel_n1: {
        name: "地道",
        desc: "地道向北延伸，两壁湿滑，渗着黏腻的水珠。每隔一段才有一小点将熄未熄的火光。南边是来时的活板门，北边继续前进。",
        exits: { south: "slum_tunnel", north: "slum_tunnel_n2" },
        items: [],
        npcs: []
    },
    slum_tunnel_n2: {
        name: "地道",
        desc: "地道愈发低矮，四周一片死寂，只有滴水声和你的脚步在回响。南边是来时的路，北边继续延伸。",
        exits: { south: "slum_tunnel_n1", north: "slum_tunnel_n3" },
        items: [],
        npcs: []
    },
    slum_tunnel_n3: {
        name: "地道",
        desc: "地道在这里略微开阔了一些，空气冷得像从地底深处呼出来。南边是来时的路，北边隐约能看见一扇金属大门。",
        exits: { south: "slum_tunnel_n2", north: "slum_tunnel_n4" },
        items: [],
        npcs: []
    },
    slum_tunnel_n4: {
        name: "地道",
        desc: "地道的最北端，前方赫然立着一扇沉重的大铁门。铁门表面锈迹斑斑，中央嵌着一枚骷髅形状的锁孔。\n南边是来时的路。",
        exits: { south: "slum_tunnel_n3" },
        items: ["iron_gate"],
        npcs: []
    },
    dark_hall: {
        name: "昏暗的大厅",
        desc: "一扇铁门后是一间昏暗的大厅，几座粗糙的石柱撑起低矮的穹顶。空气里浮着灰尘与陈年蜡油的气味。\n南边那扇敞开的大铁门可以回到最北侧的地道。",
        exits: { south: "slum_tunnel_n4" },
        items: ["bounty_board"],
        npcs: []
    },
    peasant_hut_1_inside: {
        name: "窝棚",
        desc: "一间低矮破旧的窝棚，四壁漏风，地上散着发霉的干草。墙角蜷着一个瘦小的身影。\n西边的破布门帘通向贫民窟。",
        exits: { south: "residence_w1" },
        items: [],
        npcs: ["peasant_female"]
    },
    peasant_hut_2_inside: {
        name: "窝棚",
        desc: "一间低矮破旧的窝棚，木板墙上尽是裂缝，冷风从缝隙里钻进来。\n角落里挤着两个瑟瑟发抖的贫民。西边的破布门帘通向贫民窟。",
        exits: { south: "residence_w3" },
        items: [],
        npcs: ["peasant_male", "peasant_female"]
    },
    peasant_hut_3_inside: {
        name: "窝棚",
        desc: "一间低矮破旧的窝棚，屋顶漏着天光，泥地上积了一滩看不清颜色的水。\n角落里躲着一个男贫民和一个女贫民。西边的破布门帘通向贫民窟。",
        exits: { south: "slum_west_n1" },
        items: [],
        npcs: ["peasant_male", "peasant_female"]
    },
    peasant_hut_4_inside: {
        name: "窝棚",
        desc: "一间低矮破旧的窝棚，四壁用破布和朽木胡乱糊住，散发着潮湿的霉味。\n角落里缩着一个女贫民。西边的破布门帘通向贫民窟。",
        exits: { south: "slum_west_n2" },
        items: [],
        npcs: ["peasant_female"]
    },

    // ========== 贫民窟东·北 ==========
    slum_east_n1: {
        name: "贫民窟东",
        desc: "棚屋区向北延伸，这里的棚屋更加残破不堪。\n几间棚屋顶已经塌陷，露出里面的朽木梁架。\n地面上满是积水坑和散落的碎瓦，狭窄的巷道蜿蜒在棚屋之间。\n空气中弥漫着潮湿、霉烂和贫穷的气息。",
        exits: { south: "slum_east_1", north: "town_road_e2_n1", east: "slum_east_n2", west: "town_road_n2" },
        items: [],
        npcs: []
    },
    slum_east_n2: {
        name: "贫民窟东",
        desc: "棚屋区向北延伸，这里的棚屋更加残破不堪。\n几间棚屋顶已经塌陷，露出里面的朽木梁架。\n地面上满是积水坑和散落的碎瓦，狭窄的巷道蜿蜒在棚屋之间。\n空气中弥漫着潮湿、霉烂和贫穷的气息。",
        exits: { south: "slum_east_2", north: "town_road_e2_n2", west: "slum_east_n1", east:'town_road_e3_n1' },
        items: [],
        npcs: []
    },

    // ========== n2西侧街道（贫民窟北侧·东，3个） ==========
    town_road_n2_w1: {
        name: "街道",
        desc: "一条向东延伸的小街，路面由碎石铺就。\n北侧是一排低矮的石砌仓库，墙壁被煤灰熏得漆黑。\n南边俯瞰着贫民窟破败的棚屋顶，巷道幽暗狭窄。",
        exits: { south: "slum_west_n3", east: "town_road_n2_e1", west: 'town_road_w4_n3'},
        items: [],
        npcs: []
    },
    town_road_n2_e1: {
        name: "街道",
        desc: "街道继续向东延伸，路面略微宽敞了些。\n两旁的石墙上爬满了干枯的藤蔓，墙根堆着破损的木箱。\n南边可以下到贫民窟深处。",
        exits: { south: "slum_west_n2", west: "town_road_n2_w1", east: "town_road_n2_e2" },
        items: [],
        npcs: []
    },
    town_road_n2_e2: {
        name: "街道",
        desc: "东侧街道的最东端，路面在这里与北侧的城堡大道交汇。\n脚下就是贫民窟的边缘，棚屋的茅草屋顶在下方延伸。\n东边连接着通往伯爵城堡的主路，西边回到街道。",
        exits: { south: "slum_west_n1", west: "town_road_n2_e1", east: "town_road_n3" },
        items: [],
        npcs: []
    },

    // ========== e2北侧街道（贫民窟东·北侧，2个） ==========
    town_road_e2_n1: {
        name: "街道",
        desc: "一条向西延伸的小街，路面由碎石铺就。\n北侧是一排低矮的石砌仓房，南边俯瞰着贫民窟。",
        exits: { south: "slum_east_n1", west: "town_road_n3", east: "town_road_e2_n2" },
        items: [],
        npcs: []
    },
    town_road_e2_n2: {
        name: "街道",
        desc: "东侧街道的北向延伸，路面略微宽敞。\n南边可以下去贫民窟，东边通向镇子边缘。",
        exits: { south: "slum_east_n2", west: "town_road_e2_n1", east: "town_road_e3_n2" },
        items: [],
        npcs: []
    },

    // ========== e3北侧街道（贫民窟最东侧，2个） ==========
    town_road_e3_n1: {
        name: "街道",
        desc: "一条蜿蜒向北的碎石小路，西侧紧邻贫民窟的棚屋区。\n路面坑洼不平，缝隙间生着枯黄的杂草。\n南边通向镇子边缘，北边继续延伸。",
        exits: { south: "town_road_e3_north", north: "town_road_e3_n2", west: "slum_east_n2" },
        items: [],
        npcs: []
    },
    town_road_e3_n2: {
        name: "街道",
        desc: "东侧最北端的小街，路面由青石板铺就。\n北边是一面爬满藤蔓的石墙，墙后隐约可见教堂的尖顶。\n南边可以回到街道，西边连接着贫民窟北侧的街道。",
        exits: { south: "town_road_e3_n1", west: "town_road_e2_n2" },
        items: [],
        npcs: []
    },

    // ========== 东侧延伸街道（e2北、e3北） ==========
    town_road_e3_north: {
        name: "街道",
        desc: "一条幽静的北向小路，路面由碎石铺就。\n两旁的院墙高大厚实，墙顶嵌着碎玻璃，似乎是为了防盗。\n远处传来风铃的叮当声，空气中飘着淡淡的花香。\n南边回到东侧街道。",
        exits: { south: "town_road_e3", west: "slum_east_2", north:'town_road_e3_n1' },
        items: [],
        npcs: []
    },

    // ========== w4北侧街道（3个） ==========
    town_road_w4_n1: {
        name: "街道",
        desc: "一条向北延伸的小街，路面由青石板铺就。\n两旁是低矮的石砌仓房，墙面上留着烟熏的痕迹。\n空气中弥漫着干燥的草料和谷物气息。",
        exits: { south: "town_road_w4", north: "town_road_w4_n2",east:'residence_w3' },
        items: [],
        npcs: []
    },
    town_road_w4_n2: {
        name: "街道",
        desc: "街道在这里收窄，两侧的墙壁上爬满了干枯的藤蔓。\n地面的石板碎裂严重，缝隙间长出了野草。\n头顶两旁的屋檐几乎要碰在一起，形成一条窄巷。",
        exits: { south: "town_road_w4_n1", north: "town_road_w4_n3",east:'slum_west_n3' },
        items: [],
        npcs: []
    },
    town_road_w4_n3: {
        name: "街道",
        desc: "北侧街道的尽头，前方是一面斑驳的土墙。\n墙根堆着碎石和朽烂的木板，一只野猫从墙头跳下，消失在墙角的阴影中。\n南边是来时的路。",
        exits: { south: "town_road_w4_n2", east: "town_road_n2_w1" },
        items: [],
        npcs: []
    },

    // ========== 农田区域（5×5） ==========
    // 第1行（北侧边缘）
    farm_1_1: { name: "农田", desc: "农田的西北角，一株老榆树孤零零地立在田边，枝叶稀疏。", exits: { east: "farm_1_2", south: "farm_2_1" }, items: [], npcs: [] },
    farm_1_2: { name: "农田", desc: "农田北侧中央偏西，这里的麦子长得格外高，几乎齐腰。", exits: { east: "farm_1_3", south: "farm_2_2", west: "farm_1_1" }, items: [], npcs: [] },
    farm_1_3: { name: "农田", desc: "农田北侧中央偏东，微风拂过麦田，发出沙沙的声响。", exits: { east: "farm_1_4", south: "farm_2_3", west: "farm_1_2" }, items: [], npcs: [] },
    farm_1_4: { name: "农田", desc: "农田北侧偏东，向东可以看见卡伦镇北侧伯爵城堡的塔楼。", exits: { east: "farm_1_5", south: "farm_2_4", west: "farm_1_3" }, items: [], npcs: [] },
    farm_1_5: { name: "农田", desc: "农田的东北角，卡伦镇的轮廓在东边清晰可见。田野向西南方向展开。", exits: { south: "farm_2_5", west: "farm_1_4" }, items: [], npcs: [] },
    // 第2行
    farm_2_1: { name: "农田", desc: "农田西侧偏北，西边不远处矗立着一座石砌磨坊，巨大的水车轮在河边缓缓转动。", exits: { north: "farm_1_1", south: "farm_3_1", east: "farm_2_2" }, items: [], npcs: [] },
    farm_2_2: { name: "农田", desc: "农田中央偏西北，田地中竖着一个稻草人，破旧的衣裳在风中飘摆。", exits: { north: "farm_1_2", south: "farm_3_2", east: "farm_2_3", west: "farm_2_1" }, items: [], npcs: [] },
    farm_2_3: { name: "农田", desc: "大片农田的中央偏东区域，麦子在阳光下泛着金色的光泽。", exits: { north: "farm_1_3", south: "farm_3_3", east: "farm_2_4", west: "farm_2_2" }, items: [], npcs: [] },
    farm_2_4: { name: "农田", desc: "一片开阔的农田，整齐的田垄东西走向。东边不远便是卡伦镇的栅栏门。", exits: { north: "farm_1_4", south: "farm_3_4", east: "farm_2_5", west: "farm_2_3" }, items: [], npcs: [] },
    farm_2_5: { name: "农田", desc: "农田东侧偏北，隔着栅栏门可以望见镇里的房屋和街道。", exits: { north: "farm_1_5", south: "farm_3_5", west: "farm_2_4" }, items: [], npcs: [] },
    // 第3行（中央行，西连磨坊，东连镇子）
    farm_3_1: { name: "农田", desc: "农田最西侧中央，面前就是一条清澈的小河。河对岸矗立着一座古老的石砌磨坊，水车轮吱呀作响。西边穿过小石桥便是磨坊。", exits: { north: "farm_2_1", south: "farm_4_1", east: "farm_3_2", west: "grain_mill" }, items: [], npcs: [] },
    farm_3_2: { name: "农田", desc: "农田中央偏西，这里的地势略微隆起，可以俯瞰周围的田野。西边可见一座石砌建筑的轮廓。", exits: { north: "farm_2_2", south: "farm_4_2", east: "farm_3_3", west: "farm_3_1" }, items: [], npcs: [] },
    farm_3_3: { name: "农田", desc: "整片农田的正中央，视野极为开阔，无论望向哪个方向都是绵延的麦田。这里显然是卡伦镇周边最肥沃的一块土地。", exits: { north: "farm_2_3", south: "farm_4_3", east: "farm_3_4", west: "farm_3_2" }, items: [], npcs: [] },
    farm_3_4: { name: "农田", desc: "农田中央偏东，向东已经可以望见卡伦镇的石砌围墙和栅栏门。", exits: { north: "farm_2_4", south: "farm_4_4", east: "farm_3_5", west: "farm_3_3" }, items: [], npcs: [] },
    farm_3_5: { name: "农田", desc: "农田最东侧中央，面前便是卡伦镇的栅栏门。东边穿过栅栏门便是镇子的街道，酒馆的麦酒香随风飘来。", exits: { north: "farm_2_5", south: "farm_4_5", east: "square_w3", west: "farm_3_4" }, items: [], npcs: [] },
    // 第4行
    farm_4_1: { name: "农田", desc: "农田西侧偏南，西边的河道在这里转了个弯，水声隐约可闻。", exits: { north: "farm_3_1", south: "farm_5_1", east: "farm_4_2" }, items: [], npcs: [] },
    farm_4_2: { name: "农田", desc: "农田南侧中央偏西，田垄间偶尔可以看到几朵野花。", exits: { north: "farm_3_2", south: "farm_5_2", east: "farm_4_3", west: "farm_4_1" }, items: [], npcs: [] },
    farm_4_3: { name: "农田", desc: "农田南侧中央偏东，麦浪在暖风中起伏，远处偶尔传来鸟鸣。", exits: { north: "farm_3_3", south: "farm_5_3", east: "farm_4_4", west: "farm_4_2" }, items: [], npcs: [] },
    farm_4_4: { name: "农田", desc: "农田东南方向，一阵风从镇子方向吹来，带来了酒馆麦酒的香气。", exits: { north: "farm_3_4", south: "farm_5_4", east: "farm_4_5", west: "farm_4_3" }, items: [], npcs: [] },
    farm_4_5: { name: "农田", desc: "农田东侧偏南，卡伦镇的房屋在栅栏外依次排开。", exits: { north: "farm_3_5", south: "farm_5_5", west: "farm_4_4" }, items: [], npcs: [] },
    // 第5行（南侧边缘）
    farm_5_1: { name: "农田", desc: "农田的西南角，一条小溪从田间穿过，水面上漂着几片落叶。", exits: { north: "farm_4_1", east: "farm_5_2" }, items: [], npcs: [] },
    farm_5_2: { name: "农田", desc: "农田南侧边缘中央偏西，地面微微向南倾斜。", exits: { north: "farm_4_2", east: "farm_5_3", west: "farm_5_1" }, items: [], npcs: [] },
    farm_5_3: { name: "农田", desc: "农田南侧边缘中央偏东，田垄的尽头是一片荒草地。", exits: { north: "farm_4_3", east: "farm_5_4", west: "farm_5_2" }, items: [], npcs: [] },
    farm_5_4: { name: "农田", desc: "农田的南侧边缘，田垄在这里略微下沉。南边远处是一片低矮的灌木丛。", exits: { north: "farm_4_4", east: "farm_5_5", west: "farm_5_3" }, items: [], npcs: [] },
    farm_5_5: { name: "农田", desc: "农田的东南角，东南边远处可见卡伦镇驿站的旗帜在风中飘扬。", exits: { north: "farm_4_5", west: "farm_5_4" }, items: [], npcs: [] },
    grain_mill: {
        name: "磨坊",
        desc: "一座古老的石砌磨坊矗立在小河岸边。巨大的木制水车轮在流水的推动下缓缓转动，发出有节奏的吱呀声。\n磨坊的石墙上爬满了青苔，屋顶的瓦片有些已经松动。推开厚重的木门，里面是一个宽敞的石磨间，中央摆放着一具巨大的石磨，磨盘上还残留着细白的面粉。\n角落里堆着装满谷物的麻袋，空气中弥漫着新鲜面粉的香气。\n东边穿过小石桥便是广阔的麦田。",
        exits: { east: "farm_3_1" },
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
        desc: "一座古老的石砌教堂矗立在眼前，尖顶直插云霄。\n正门是两扇厚重的橡木门，门板上钉着粗大的铁钉，门楣上方镶嵌着一扇彩色玻璃窗，描绘着不知名的宗教场景。\n门两侧各立着一尊风化的石像圣徒，面容模糊不清。\n教堂四周被一道低矮的石墙环绕，墙头攀附着常春藤。\n东边是通往镇子的小路，南边是教堂的院子，北边一条石板小径通向教堂后方的树林。",
        exits: { east: "side_path_3", south: "church_courtyard_1", north: "church_north_path_1"},
        items: ["karen_church_door"],
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
        desc: "西南角的院子，四周的石墙比其他地方更高。\n墙根下堆着一些破碎的石碑残片，字迹已经无法辨认。\n院子角落有一口枯井，井口用木板钉死，木板已经朽烂发黑。\n东边是来时的院子，南边一条碎石小路通向南侧深处。",
        exits: { east: "church_courtyard_2_w1", north: "church_courtyard_1_w2", south: "church_south_path" },
        items: [],
        npcs: []
    },
    church_south_path: {
        name: "小路",
        desc: "一条幽静的碎石小路，夹在两排修剪整齐的冬青树篱之间向南延伸。\n树篱的叶片深绿发亮，显然有人精心打理。路面干净整洁，几乎看不见一片落叶。\n空气中飘着淡淡的熏香气息，南边矗立着一座朴素的石砌住宅。\n北边是回教堂院子的路。",
        exits: { north: "church_courtyard_2_w2", south: "priest_residence" },
        items: [],
        npcs: []
    },
    priest_residence: {
        name: "神父住宅",
        desc: "一座朴素的二层石砌小楼，外墙被岁月染成了温润的浅灰色。\n一楼大厅布置简朴，木桌上摊开着一本厚重的圣经，旁边放着一副老花镜。\n壁炉里的余烬散发着微弱的暖意，墙上挂着一幅褪色的圣徒画像。\n空气中弥漫着旧书、烛蜡和淡淡的乳香气息。\n一位白发苍苍的老神父正坐在摇椅上，听见脚步声后缓缓抬起头来，目光平和而安详。\n北边是回教堂的小路。",
        exits: { north: "church_south_path" },
        items: [],
        npcs: ["andros"]
    },
    // ========== 教堂北侧小路与钟楼 ==========
    church_north_path_1: {
        name: "小路",
        desc: "一条石板小径从教堂北侧延伸出来，穿过一片稀疏的白桦林向北蜿蜒。\n阳光透过树叶在地上洒下斑驳的光影，微风吹过时叶片沙沙作响。\n石板路面有些年久失修，几块碎裂处已被青苔覆盖。\n南边是教堂大门，北边继续深入林中，西侧矗立着一座高耸的石砌钟楼。",
        exits: { south: "church_gate", north: "church_north_path_2", west: "bell_tower" },
        items: [],
        npcs: []
    },
    bell_tower: {
        name: "钟楼",
        desc: "一座独立的石砌钟楼，外墙爬满了深绿色的常春藤。\n钟楼高约三十尺，顶部的拱形窗口悬挂着一口古旧的铜钟，钟身布满铜绿。\n底层有一扇低矮的木门，门板已经风化开裂，露出里面昏暗的空间。\n一根粗麻绳从钟楼顶部垂落下来，末端被系在墙边的铁环上。\n东边是回教堂北侧的小路。",
        exits: { east: "church_north_path_1" },
        items: [],
        npcs: []
    },
    church_north_path_2: {
        name: "小路",
        desc: "石板小径继续向北延伸，两旁的树木愈发茂密，树冠在高空交织成一道绿色的拱廊。\n空气变得潮湿而阴凉，远处隐约可见一座残破建筑的轮廓。\n南边是通往教堂的路，北边矗立着一座废弃的修道院。",
        exits: { south: "church_north_path_1", north: "abandoned_monastery" },
        items: [],
        npcs: []
    },
    abandoned_monastery: {
        name: "废弃修道院",
        desc: "一座被遗忘的古老修道院，四面石墙大多完整，但屋顶已经坍塌大半。\n残存的拱形窗户框上挂着碎裂的彩色玻璃残片，在阳光下泛着幽暗的光。\n院内的石板地面上落满了枯叶和碎瓦，中央一口干涸的圣水池已经开裂。\n回廊的石柱歪斜着，藤蔓和野草从每一处缝隙中钻出，一片荒凉而静谧的景象。\n南边是回教堂的小路。",
        exits: { south: "church_north_path_2" },
        items: [],
        npcs: []
    },

    cemetery: {
        name: "墓地",
        desc: "教堂后方的墓地，一排排歪斜的石碑矗立在荒草中。\n石碑上刻着逝者的名字和生卒年月，大多数字迹已被风雨侵蚀得模糊不清。\n墓碑之间散落着枯萎的花束和生锈的铁十字架，地面的泥土松软潮湿。\n一棵巨大的紫杉树矗立在墓地中央，浓密的枝叶遮蔽了大半天光。\n南边是教堂院子的木栅门。\n东侧一扇沉重的木门上钉着铁箍，通向教堂内部。",
        exits: { south: "church_courtyard_1_w2", east: "church_back_door" },
        items: ["karen_church_door"],
        npcs: []
    },

    // ========== 教堂后门与门廊 ==========
    church_back_door: {
        name: "教堂后门",
        desc: "一小段狭窄的过道，连接着墓地与教堂内部。\n粗石墙壁上挂着几盏即将燃尽的油灯，火焰在风中摇曳。\n脚下的石板被无数双脚磨得光滑发亮，散发出淡淡的蜡油和旧木的气味。\n南侧通往教堂的门廊，西侧则回到墓地。",
        exits: { west: "cemetery"},
        items: ["karen_church_back_door"],
        npcs: []
    },
    church_porch: {
        name: "门廊",
        desc: "教堂后方的门廊，高挑的拱顶由两排粗大的石柱支撑。\n彩色玻璃窗透过的光线在石板地面上投下斑斓的图案。\n空气中弥漫着陈年木头和烛蜡混合的气息，远处传来唱诗班的圣咏声。\n北侧有一扇门通往教堂后门，南侧是教堂的正门出入口，西侧延伸入教堂深处的中殿。",
        exits: {west: "church_nave" },
        items: ["karen_church_door"],
        npcs: []
    },

    // ========== 教堂内部 ==========
    church_nave: {
        name: "中殿",
        desc: "教堂内部广阔的中殿，高耸的拱顶由两排粗壮的石柱支撑。\n柱身上雕刻着圣徒和天使的浮雕，彩绘玻璃窗倾泻下斑斓的光线。\n两旁的木质长椅排列整齐，椅背上刻着磨损的祷文。\n空气中弥漫着烛蜡和旧木的气息，脚步声在石板上回荡。\n东侧通往门廊，西侧则是唱诗班的所在。",
        exits: { east: "church_porch", west: "church_choir" },
        items: [],
        npcs: []
    },
    church_choir: {
        name: "唱诗班席",
        desc: "中殿西侧的唱诗班席位，两层高的木雕唱诗台靠着北墙而立。\n台上放着几本摊开的羊皮纸赞美诗集，页面已经泛黄发脆。\n空气中有淡淡的乳香气息，仿佛刚做完一场弥撒。\n东侧是中殿，西侧则通向教堂最神圣的区域——圣坛。",
        exits: { east: "church_nave", west: "church_altar" },
        items: [],
        npcs: []
    },
    church_altar: {
        name: "圣坛",
        desc: "教堂最西端的圣坛，一座巨大的石砌祭台矗立在中央。\n祭台上铺着洁白的亚麻布，中央摆着一尊金色十字架和两支青铜烛台。\n彩色玻璃窗描绘着圣徒殉道的场景，光线透过玻璃在祭台上投下神圣的光影。\n南侧有一扇窄门通向圣器室，一根拉绳从穹顶垂落下来。\n东侧是唱诗班席，一道后门上有铜牌刻着「教堂后门」。",
        exits: { east: "church_choir", south: "church_sacristy" },
        items: ["karen_church_back_door"],
        npcs: []
    },
    church_sacristy: {
        name: "圣器室",
        desc: "一间小巧的侧室，墙边立着几个高大的橡木柜子。\n柜门半开，里面整齐叠放着教士的法袍和圣带。\n一张小桌上摆着银质的圣餐杯和烛台，旁边放着一本翻开的仪式书。\n空气中弥漫着乳香和陈年木材的气味，只有北侧通往圣坛的窄门与外界相连。",
        exits: { north: "church_altar" },
        items: [],
        npcs: []
    }
};
