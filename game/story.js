// ============================================================
//  game/story.js - 剧情/任务数据定义
//  所有剧情事件、主线/支线任务的统一数据源
//  触发条件 + 剧情文本 + 完成条件 + 回调
// ============================================================

const STORIES = {

    // ==================== 剧情事件 ====================

    // 血色宝石触发莉娅娜攻击
    blood_gem_liana: {
        id: 'blood_gem_liana',
        type: 'event',
        trigger: { type: 'equip_and_enter', item: 'blood_gem', room: 'training_ground', npc_alive: 'liana' },
        story: [
            "莉娅娜注意到了你身上的血色宝石！",
            "她的红色瞳孔骤然收缩，眉头紧锁，手不自觉地按在了剑柄上。",
            "一种说不清的不详感从心底涌起，驱使着她想要摧毁你。",
            "「这东西...让我不舒服。」她低声说道，眼神变得危险起来。",
            "莉娅娜拔出长剑，向你冲来！"
        ],
        onStart() { startBattle('liana'); }
    },

    // 卡伦镇道路入口（进入「马路」的无文本传送事件）
    karen_town_enter: {
        id: 'karen_town_enter',
        type: 'event',
        trigger: { type: 'use_item', item: 'karen_town' },
        onStart() {
            UI.setOverlay(true);
            clearDetailPanel();
            currentPanel = null;
            gameState.player.location = 'road';
            if (!gameState.gameFlags) gameState.gameFlags = {};
            gameState.gameFlags.roadEntered = true;
        },
        onComplete() {
            UI.setOverlay(false);
            look();
            updateMinimap();
            updateSceneInfo();
            StoryEngine.check();
        }
    },

    // ==================== 主线任务 ====================

    // 主线任务1 - 不喜欢你，还有你的石头（解锁条件：首次进入矿道深处，开场动画播放后解锁）
    quest_surface: {
        id: 'quest_surface',
        type: 'main',
        name: '主线任务1：不喜欢你，还有你的石头',
        trigger: { type: 'first_enter', room: 'mine_deep', flag: 'firstTimeEntered' },
        startStoryIsTitle: true,
        startStoryColor: '#e6d5a8',
        startStory: [
            "序章-夜出桑华山",
            "矿道深处只有镐尖敲击岩壁的声音。一下，又一下，沉闷得像心跳。",
            "空气里浮着石粉，吸进肺里很痛。你直起腰，脖颈的汗顺着脊背滑下去。",
            "监工的影子在远处晃了晃。没人说话，都低下头继续挖着。",
            "你握紧镐柄往下敲去。石壁迸裂，碎片飞溅，手上的镐子因为贫血而不断打滑。",
            "痛苦，无尽的痛苦。饥饿啃噬着你的身体，疲惫席卷着你的精神。",
            "但是你又一次举起镐子。",
            "不知过了多久，你终于砸出了一个像样的石块。",
            "你不知道你还能活多久，但也许这种生活似乎会持续到你的生命尽头。"
        ],
        startStoryOnStart() {
            UI.setOverlay(true);
            clearOutput();
        },
        afterStartStory() {
            gameState.firstTimeEntered = false;
            waitingForName = true;
            UI.setOverlay(false);
            print(`<span style="color: #e6d5a8; font-weight: bold;">═══════════════════════════</span>`);
            print(`<span style="color: #e6d5a8; font-weight: bold;">你是谁？</span>`);
            print(`<span style="color: #888;">请在下方指令栏中输入你的名字。</span>`);
            print(`<span style="color: #888;">若留空则默认名为「散华」。</span>`);
            print(`<span style="color: #e6d5a8; font-weight: bold;">═══════════════════════════</span>`);
            print("");
            UI.elements.cmdInput.placeholder = "输入你的名字后回车...";
            UI.elements.cmdInput.focus();
        },
        conditions: {
            type: 'single',
            condType: 'enter_room',
            condValue: 'mine_exit',
            label: '到达地面（二号矿井口）'
        },
        description: '离开这个地方，到地面上。',
        rewards: { exp: 20 }
    },

    // 主线任务2 - 夜出桑华山
    quest_night_escape: {
        id: 'quest_night_escape',
        type: 'main',
        name: '主线任务2：夜出桑华山',
        trigger: { type: 'quest_complete', quest: 'quest_surface' },
        conditions: {
            type: 'single',
            condType: 'enter_room',
            condValue: 'mountain_path_14',
            label: '到达山路尽头'
        },
        description: '这些牢笼不是为人打造的，它们关不住你。',
        rewards: { exp: 100 },
        completeStoryColor: '#e6d5a8',
        completeStoryUseNextBtn: false,
        completeStory: [
            "矿场甩在身后了。", "", "你不知道自己跑了多远。脚下是野地，杂草绊着靴子，露水打湿了裤脚。夜风从山口灌进来，贴着汗透的脊背，凉得像一瓢冷水。", "",
            "你停下来，弯着腰喘气。肺里还残着矿道的石粉，每吸一口气都像在磨砂纸。心跳撞着耳膜，咚咚的，盖过了风声。", "",
            "这一夜的事——你记得每一帧，但连不起来。门是怎么开的，那些人是怎么倒下的。", "",
            "你只记得铁锈味——不是梯子上的那种锈。是热的、血的气味。", "",
            "远处有什么声音。你猛地回头，但什么也没有。只有风，只有草，白惨惨地躺在月光底下，脚下的路一直通向你再也回不去的那个井口。", "",
            "你不知道报复什么时候来临。你只知道总有一天它会来。矿道，工棚，鞭子，草席，咳嗽整夜的人，睡着睡着就没了声息的人——像他们一样被抹掉。", "",
            "像那些你没来得及杀的人。", "更像那些你已经杀了的人。", "",
            "你蹲下去，把脸埋进膝盖里。手指还在抖。不是因为累，不是因为怕。只是你的身体比你更先知道——从今晚开始，有些东西不一样了。", "",
            "你听见山在沉默。", "三百年了，它一直沉默。被发现的时候沉默，被挖开的时候沉默，血渗进岩层的时候沉默。现在它还在沉默。", "",
            "你站起来。膝盖上的布料洇湿了两小块，不知道是露水还是汗。", "",
            "矿场的围墙黑黢黢地趴在月光底下，像一条黑蛇，高不可攀，昨天晚上下工你望着它，觉得自己一辈子都不会出去了。", "",
            "但是你翻过去了。", "",
            "身后，桑华山蹲伏在夜色里，灰黄色的岩体泛着冷光。你离开了。没有回头。", "",
            "自由了？也许吧。"
        ],
        onComplete() {
            if (!gameState.gameFlags) gameState.gameFlags = {};
            gameState.gameFlags.endingPlayed = true;
            clearDetailPanel();
            currentPanel = null;
            const endingRoom = gameState.world["mountain_path_14"];
            if (endingRoom) {
                if (!endingRoom.items) endingRoom.items = [];
                if (!endingRoom.items.includes("karen_town")) endingRoom.items.push("karen_town");
                endingRoom.desc = "山路的尽头，一片开阔的野地展现在眼前。\n你已经远离了桑华山，矿场的围墙消失在夜色中。\n不远处，你看到了一个小镇的轮廓——那是卡伦镇。\n北边是来的路，前方是未知的自由。";
            }
            UI.setOverlay(false);
            print(`<span style="color: #66ff66;">你成功逃离了桑华山矿场！</span>`);
            look();
            setTimeout(() => { updateMinimap(); updateSceneInfo(); }, 100);
        }
    },

    // 主线任务3 - 初入卡伦镇
    quest_karen_town: {
        id: 'quest_karen_town',
        type: 'main',
        name: '主线任务3：初入卡伦镇',
        trigger: { type: 'enter_room', room: 'road' },
        conditions: {
            type: 'single',
            condType: 'enter_room',
            condValue: 'karen_town_gate',
            label: '首次到达卡伦镇大门'
        },
        description: '这是你的第一站，也许它会是一个温暖的港湾',
        rewards: { exp: 100 },
        completeStoryIsTitle: true,
        completeStoryColor: '#e6d5a8',
        completeStoryUseNextBtn: false,
        completeStory: [
            "第一章-卡伦镇之风",
            "马路走到了尽头。",
            "面前是一道木栅栏门——两扇对开的厚木板，门缝里透出暖黄的光。门顶挂着一盏铁皮油灯，灯芯在夜风里一跳一跳的，把门框的影子拽得忽长忽短。门边立着一个矮木棚，里面坐着一个人。",
            "你走近了才看清，是个穿皮甲的守卫，腰里别着短剑，手边放着一只粗陶杯，里头剩着半杯浑浊的麦酒。他听见脚步声抬起头，眯着眼打量了你一遍。目光扫过你身上那件沾满石粉和血迹的外套时，他皱了皱鼻子。",
            "\"站住。\"",
            "他站起来，靴子踩在泥地上，发出沉闷的声响。他比你高半个头，影子罩过来把你整个人盖住了。",
            "\"干什么的？从哪来？\"",
            "他没有拔剑，但右手已经搭上了剑柄。这是个习惯动作——他拦过很多像你一样的人，夜里的、脏兮兮的、没有行李的。",
            "你还没来得及开口。不知何处传来一声闷响。接着是叫骂声。有人吼了一句什么，然后是重物砸在木板上的声音，在夜里格外响。",
            "守卫猛地转头。你也转头。",
            "目光越过夜色，你可以看到镇里的方向，几个黑影正在窝棚之间扭打，有个人倒在地上又爬起来，顺手抄起一根木棍。",
            "\"又他妈打起来了……\"",
            "守卫骂了一句，朝你竖起一根手指，示意你站在原地别动。然后他往贫民窟的方向走了几步——像是想过去看看，又不想走太远。",
            "就是这几步。",
            "你从他的背后走过去，没有跑，步子不快不慢。门缝是留着的——他刚才起身时蹭开了半尺宽的间隙。你侧过身，肩膀擦着木门粗糙的边缘挤进去。",
            "你脚下是平整的土路，两侧有低矮的房屋，窗户里透出微弱的烛火。一只猫从屋檐下窜过去，钻进排水沟不见了。",
            "身后那个守卫还在骂骂咧咧。你不知道自己有没有被看见。也许有，也许没有。但你已经进来了。",
            "你呼出一口气，手掌心全是汗。夜风吹过来，带着你早已闻到的那种气味——柴火、干草、人的气味。你站在一条窄巷里，两边是黑黢黢的墙壁，前面隐约有一条更宽的路。",
            "你听见自己的心跳在慢慢落下去。",
            "卡伦镇欢迎你。"
        ],
        onComplete() {
            if (!gameState.gameFlags) gameState.gameFlags = {};
            gameState.gameFlags.karenMainComplete = true;
            StoryEngine.check();
        }
    },

    // ==================== 支线任务 ====================

    // 支线1-1 - 血红色的眼睛（触发+与疲惫的矿工对话）
    quest_blood_eyes_1: {
        id: 'quest_blood_eyes_1',
        type: 'side',
        name: '支线任务：血红色的眼睛1',
        trigger: { type: 'enter_room', room: 'mine_tunnel' },
        conditions: {
            type: 'single',
            condType: 'quest_talk',
            condValue: 'tired_miner',
            label: '与疲惫的矿工聊聊'
        },
        questNpc: 'tired_miner',
        questDialogue: [
            "「四号矿井是怎么了？今天都封锁了，工友也一个都没看见。」",
            "「孩子，你能帮我去四号矿井看看吗，我有位朋友在那。」",
            "「他脸上有一道很长的疤，瘦高个。」",
            "「如果找到他，回来和我说一声，行吗？」",
        ],
        description: '与矿道中的疲惫矿工聊一聊。',
        rewards: { exp: 10 }
    },

    // 支线1-2 - 了解四号矿坑的现状
    quest_blood_eyes_2: {
        id: 'quest_blood_eyes_2',
        type: 'side',
        name: '支线任务：血红色的眼睛2',
        trigger: { type: 'quest_complete', quest: 'quest_blood_eyes_1' },
        conditions: {
            type: 'single',
            condType: 'read_item',
            condValue: 'miner_note',
            label: '阅读"染血的字条"'
        },
        description: '去四号矿井看看，找到脸上带疤的工友，了解四号矿井的情况。',
        rewards: { exp: 20, item: 'bread' }
    },

    // 支线2 - 清洗
    quest_purge_order: {
        id: 'quest_purge_order',
        type: 'side',
        name: '支线任务：清洗',
        trigger: { type: 'has_item', item: 'urgent_order' },
        conditions: {
            type: 'single',
            condType: 'read_item',
            condValue: 'urgent_order',
            label: '阅读"加急密令"'
        },
        description: '看看密令内容。',
        rewards: { exp: 40 }
    },

    // 支线3 - 这是谁的秘密基地
    quest_secret_base: {
        id: 'quest_secret_base',
        type: 'side',
        name: '支线任务：这是谁的秘密基地',
        trigger: { type: 'enter_room', room: 'forest_4_center' },
        conditions: {
            type: 'single',
            condType: 'use_item',
            condValue: 'teleport_circle',
            label: '使用传送阵'
        },
        description: '扫开落叶堆，探索地下。',
        rewards: { exp: 50 }
    },

    // 支线4 - 你是敌人，还是朋友？
    quest_friend_or_foe: {
        id: 'quest_friend_or_foe',
        type: 'side',
        name: '支线任务：你是敌人，还是朋友？',
        trigger: { type: 'enter_room', room: 'hut_floor1' },
        conditions: {
            type: 'single',
            condType: 'first_talk',
            condValue: 'serena',
            label: '首次与瑟蕾娜·紫雾对话'
        },
        description: '木屋中的神秘法师似乎对你很感兴趣，和她聊聊吧。',
        rewards: { item: 'magic_mirror' }  // 魔镜
    },

    // 支线5-1 - 兰德尔家族雕像重建工作（触发+与索菲对话）
    quest_statue_rebuild_5_1: {
        id: 'quest_statue_rebuild_5_1',
        type: 'side',
        name: '支线任务：兰德尔家族雕像重建工作1',
        trigger: {
            type: 'composite_trigger',
            operator: 'all',
            triggers: [
                { type: 'flag', flag: 'statue_pushed' },       // 推倒了雕像
                { type: 'npc_not_defeated', npc: 'sophie' }    // 索菲未死亡
            ]
        },
        conditions: {
            type: 'single',
            condType: 'quest_talk',
            condValue: 'sophie',
            label: '与索菲谈论倒塌的雕像'
        },
        questNpc: 'sophie',
        questDialogue: [
            "你推开女仆卧室破旧的木门，索菲正跪在地上，用冻得通红的手指搓洗着一件沾满煤灰的矿工服。她瘦弱的身体在昏暗的烛光下微微发抖，亚麻色的长发遮住了半边苍白的小脸。",
            "听见门响，她慌忙抬起头，那双因营养不良而显得格外大的浅灰色眼睛里闪过一丝明显的害怕。她赶紧跪得更低，双手紧紧抓着抹布，声音带着恭敬和紧张：",
            "「先……先生……房间还没擦干净，我马上就擦完……求您别生气……」",
            "你挥了挥手，示意自己不是来责骂她的。索菲这才小心翼翼地抬起头，看了你一眼，又迅速低下头，身体却依然在轻轻颤抖。",
            "你告诉了她兰德尔一世雕像倒塌的事。",
            "索菲的身体猛地一僵。她缓缓抬起头，浅灰色的眼睛里满是震惊和难以置信，声音细若蚊鸣：",
            "「……倒……倒了？那座……那座雕像……？」",
            "她的双手不再抓着抹布，而是紧紧攥着破旧的女仆裙摆，指关节因为用力而发白。她低头沉默了片刻，声音轻轻颤抖着：",
            "「我能为您做些什么呢，先生……」",
            "你思索片刻，告诉了她你的想法。",
            "索菲的瞳孔因为惊恐而睁大，身体不由自主地向后退了一步，但是她最终还是低下了头，眼泪滑下脸颊。",
            "「我会照做的，先生……」"
        ],
        description: '与女仆索菲谈谈倒塌的雕像。',
        rewards: { exp: 20 },
        startStory: [
            "兰德尔一世的青铜雕像轰然倒塌，激起一片尘土与碎屑。",
            "你想起那个总是低声下气、跪在冰冷地板上擦洗的女仆索菲。",
            "也许该去女仆房间找她谈谈这座被你推倒的雕像。"
        ]
    },

    // 支线5-2 - 收集材料重建雕像
    quest_statue_rebuild_5_2: {
        id: 'quest_statue_rebuild_5_2',
        type: 'side',
        name: '支线任务：兰德尔家族雕像重建工作2',
        trigger: { type: 'quest_complete', quest: 'quest_statue_rebuild_5_1' },
        conditions: {
            type: 'composite', operator: 'all',
            subConditions: [
                { type: 'has_item', item: 'cecilia_head_broken', label: '被玩坏的塞西莉亚的头颅' },
                { type: 'has_item', item: 'cecilia_tongue', label: '塞西莉亚的舌头' },
                { type: 'has_item_count', item: 'cecilia_foot', count: 2, label: '塞西莉亚的脚×2' },
                { type: 'has_item', item: 'isabella_torso', label: '伊莎贝拉的躯干' },
                { type: 'has_item_count', item: 'isabella_breast', count: 2, label: '伊莎贝拉的乳房×2' },
                { type: 'has_item', item: 'isabella_head', label: '伊莎贝拉的头颅' },
                { type: 'has_item_count', item: 'elena_leg', count: 2, label: '艾莲娜的腿×2' },
                { type: 'has_item_count', item: 'elena_foot', count: 2, label: '艾莲娜的脚×2' },
                { type: 'has_item_count', item: 'isabella_arm', count: 2, label: '伊莎贝拉的手臂×2' },
                { type: 'has_item_count', item: 'isabella_hand', count: 2, label: '伊莎贝拉的手×2' },
                { type: 'has_item', item: 'black_stockings', label: '黑丝' },
                { type: 'has_item', item: 'black_high_heels', label: '黑色高跟鞋' },
                { type: 'interact_with', item: 'randolph_statue_fallen', label: '与雕像底座交互' }
            ]
        },
        completeStory: [
            "你看着地上分门别类摆放好的部件。伊莎贝拉柔软的乳房，艾莲娜冷玉般的双腿，还有托盘里塞西莉亚沾满精液的头颅。索菲站在一边，双手垂在身侧，等待你的命令。\n",
            "「开始吧。」你说。\n",
            "索菲没有说话，只是点了点头，抱起艾莲娜那双修长笔直的腿。她先拿银针和坚韧的金丝线开始将艾莲娜的脚踝缝合到小腿的断面上。\n",
            "索菲为缝合好的、艾莲娜的双腿套上黑丝，拿起伊莎贝拉那双黑色的细高跟鞋，费了些力气，才将艾莲娜那双冰冷僵硬的脚塞进去，从没穿过如此高度的高跟鞋的断脚，脚面拱起一个夸张的弧度。\n",
            "接着，她调整好位置，让躯干大腿根部的断面与之精准对齐。伯爵夫人象牙般温润的臀部与艾莲娜冷玉般的大腿连接在一起，色差清晰可见。\n",
            "索菲搬过伊莎贝拉的头颅，将其与躯干的颈部断面仔细对齐。她换了更细的针线，从颈后入针，沿着皮肤的边缘细细缝合。针脚藏在浓密的金发下，几乎看不出痕迹。\n",
            "然后，索菲将伊莎贝拉那两条匀称的手臂对上躯干的肩部切口，用同样的方式进行缝合，整个上半身逐渐完整。\n",
            "你拿起伊莎贝拉那对柔软硕大的乳房，乳房如同水一般在你手中摊开。你递给索菲，让她将乳房重新缝上。\n",
            "索菲用几根长钢针穿过伊莎贝拉的手腕和托盘底部，缝上手的同时将两者牢牢钉在一起。然后，她调整手指的姿势，让它们看起来像是自然地托着盘子。\n",
            "你拿起塞西莉亚那颗沾满干涸精液的头颅，亲自将它摆在托盘正中央。塞西莉亚的头颅眼神空洞，失去舌头的小嘴已经被撕裂得不成样子。你取来那双还穿着白色厚丝袜和黑色小皮鞋的脚，对称地摆在头颅两侧。\n",
            "你也没有忘记那条被你割下的舌头，柔软的舌头被你摆放在头颅的正前方。这颗头颅将永远惊恐地看着自己被割下的舌头。从今往后从这个小嘴中进出的只能是粗大的阴茎。\n",
            "你欣赏着跪地的雕塑，上半身属于伊莎贝拉，下半身属于艾莲娜。那双高洁的双腿正穿着淫荡的黑丝与黑色高跟，而伊莎贝拉的双手虔诚地托举着一个银盘，似乎正顺从地交出自己朝夕相处的姐妹最宝贵的部位，供你享用。\n" ,
            "做完这一切后，索菲站在一旁，抿着嘴低下头，等待着你的发落。\n",
            "「很完美。」你说，「这就是我想要的。」\n",
            "娇小的女仆没有作声，向你露出了一个不自然的、苍白的微笑，干枯的眼眶似乎又红了起来。"
        ],
        description: '收集指定肢体部位，在雕像底座重建兰德尔家族的雕像。',
        rewards: { item: 'statue_obedient' }
    },

    // 支线6 - 这里是贫民窟
    quest_slum_district: {
        id: 'quest_slum_district',
        type: 'side',
        name: '支线任务：这里是贫民窟',
        trigger: { type: 'flag', flag: 'karenMainComplete' },
        afterStartStory() {
            spawnSlumNpcs();
            print(`<span style="color: #888;">贫民窟的方向传来一阵异样的骚动……</span>`);
        },
        questNpc: 'slum_guard',
        conditions: {
            type: 'single',
            condType: 'quest_talk',
            condValue: 'slum_guard',
            label: '与守卫进行任务对话'
        },
        questDialogue: [
            "你拐进贫民窟西边的一条窄巷。",
            "这里比镇子其他地方更暗——房屋挤得密不透风，墙与墙之间只留下勉强够一个人通过的间隙。泥地上积着污水，不知从哪户人家流出来的，黑糊糊地漫过鞋尖。巷子尽头有一小片空地，堆着几只破木箱和一口倒扣的铁锅。",
            "此刻那里站着三个人。",
            "一个年轻男人蹲在地上，半抱着一个躺倒的年轻女人。女人闭着眼，额头有血，胸口微微起伏——还活着。男人抬头瞪着面前的人，一只手挡在女人身前，全身在发抖。",
            "他们对面站着一个高个子男人，衣着比贫民窟的人整齐。深灰短袍与皮靴，没有补丁，他脸上没有表情，手里拎着一根铁钎。",
            "地上有血。不多，但足以让你知道——他已经动过手了。",
            "他开口了，声音不大，像是说给自己听的：",
            "\"你跑啊。你带着她跑啊。怎么不跑了。\"",
            "蹲着的男人没回答。他低下头，把女人的头往自己怀里搂了搂。",
            "巷口外面传来脚步声。皮靴踩在泥地上的声音，和巡逻的节奏一样——是你见过的那个南门守卫。",
            "高个子男人朝巷口偏了偏头，没有转身。",
            "\"来得正好。这两个偷东西的，被我堵住了。\"",
            "守卫走到巷口，扫了一眼地上的女人、蹲着的男人、高个子手里的铁钎。他认出了高个子——也许是认出了他的衣服，也许是认出了他这个人。",
            "\"……这是您的？\"",
            "高个子没答话。他朝地上的两个人抬了抬下巴。",
            "守卫没再问。他拔出剑。",
            "\"行，我来处理。您别脏了手。\"",
            "蹲着的男人猛地抬起头。",
            "\"她不是偷的！她是——\"",
            "守卫踹在他肩膀上。他往后倒下去，后背撞在墙上，发出一声闷响。躺倒的女人没了他的支撑，头歪向一边，嘴角的血流到泥地上，和脏水混在一起，再也分不开了。",
            "高个子站在几步之外，看着这一幕。他的表情没有变化。"
        ],
        description: '守卫似乎被某些声音吸引，去看看',
        rewards: { exp: 80 },
        questDialogueOnComplete() {
            print(`<span style="color: #ff6666; text-decoration: underline; cursor: pointer;" onclick="slumChoiceAttack()">⚔️ 冲上去</span>`);
            print(`<span style="color: #888; text-decoration: underline; cursor: pointer;" onclick="slumChoiceIgnore()">🚶 无视</span>`);
        }
    },

    // 支线7 - 贫苦的泪珠，仇恨的种子
    quest_tears_of_poverty: {
        id: 'quest_tears_of_poverty',
        type: 'side',
        name: '支线任务：贫苦的泪珠，仇恨的种子',
        trigger: { type: 'quest_complete', quest: 'quest_slum_district' },
        conditions: {
            type: 'single',
            condType: 'flag',
            condValue: '__quest_tears_of_poverty_pending__',
            label: '（后续剧情待续）'
        },
        description: '曼德罗拉接纳了你。在这座地下组织里，你即将看到贫民窟真正的血与泪。',
        rewards: {}
    }
};
