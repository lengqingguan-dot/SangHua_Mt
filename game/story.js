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

    // 支线任务7 - 我心难安（多阶段：进度1~4，最终完成才算完成）
    quest_troubled_heart: {
        id: 'quest_troubled_heart',
        type: 'side',
        name: '支线任务7：我心难安',
        trigger: {
            type: 'composite_trigger',
            operator: 'all',
            triggers: [
                { type: 'enter_room', room: 'scribe_residence_gate' },
                { type: 'quest_complete', quest: 'quest_purge_order' }
            ]
        },
        stages: [
            {
                name: '飘零的落叶',
                questNpc: 'elaine',
                conditions: {
                    type: 'single',
                    condType: 'quest_talk',
                    condValue: 'elaine',
                    label: '与艾琳完成任务对话'
                },
                questDialogue: [
                    "你推开抄写员家的门。",
                    "墨水的气味涌出来，混着旧纸和灰尘的味道。房间不大，架子上堆满卷宗，桌上摊着一本翻开的书，旁边搁着半碗冷掉的稀粥。一个女孩坐在桌边，低着头，笔搁在纸上，墨迹洇开了一团。",
                    "她听见门响，抬起头来。",
                    "褐色齐肩短发，发尾微翘，像被揉过的干草，有些发丝粘在脸颊上，汗还是泪分不清楚。褐色瞳孔，又圆又满，但眼眶是红的，红得透彻，像被人用手指狠狠揉过。白色衬衫的领口皱巴巴的，格子短裙上沾着一小片灰——像是跪在地上过。棕色小皮鞋的鞋尖上有一块暗色的湿痕。",
                    "她的脸颊上有一道没擦干净的泪痕。有新干的，也有旧的，一层叠一层，在光线下泛着微微的水光。",
                    "她认出你了。不是认出你是矿场的人——她根本不认识你。她认出的是另一种东西：你身上的衣服、你手上的茧、你站在门口的方式。",
                    "「……你也是从矿场出来的？」",
                    "声音是哑的。像哭过很久之后第一次开口说话。",
                    "你没回答，把门在身后合上，朝她走了两步。「你父亲呢？」",
                    "她把脸转开了。不是不想看你，是怕一张嘴就会崩掉。",
                    "「前天晚上。」她说，声音很小，像在自言自语，「他们来敲门。说领主府有紧急文件要抄。他穿上外套走了……」",
                    "她停下来。肩膀抖了一下，手指攥住了桌沿，指节发白。",
                    "「第二天。第二天，有人把他抄的东西送了回来。但人——没有。」",
                    "她把头低下去，额头几乎碰到桌面，褐色短发垂下来遮住了半张脸。你看见她的肩膀在抽动，一下一下的，像扛了很重的东西快扛不住了。",
                    "「我要。」她的声音从垂落的发丝后面传过来，「我要——我把那张纸放在抽屉里了。我、我还没敢——」",
                    "她说不下去。",
                    "你站在桌边，看了她一会儿。然后你拉开对面的椅子，坐了下来。椅子腿在木地板上蹭出一声轻响。",
                    "「把那张纸给我。」",
                    "她抬起头来。整张脸都是湿的，褐色瞳孔糊了一层水光，看不太清你在哪里。但她认出了你的声音，伸手拉开了面前的抽屉，抖着手取出了一张折好的羊皮纸，推到你面前。",
                    "纸页上有墨迹。有新干的，也有被水滴洇开的痕迹——她在上面哭过。",
                    "你展开来。",
                    "鸢尾骑士团的紫鸢蜡印拓痕。矿场封闭指令。灭杀法术执行日期。格式严谨、措辞冰冷，像一份普通的政务文件。它的文字末尾，没有签名，没有公章。只有一行潦草的小字，笔迹和正文完全不同，像是用最后一丁点力气添上去的：「艾琳·维斯特。——别让人看见。」",
                    "「他抄完就知道自己活不了。」她的声音在发抖，从牙缝里挤出来，「他还是抄了。他抄了，他送回来了，然后他没有了。」",
                    "她的褐色眼睛终于抬起来看着你。泪水的冲刷没有让她的目光变浑浊，反而透出一种被剥到最底层之后裸露出的东西——恐惧、混乱，还有一丝没有熄灭的、死死攥着什么不肯放手的东西。",
                    "「领主府的人说他是急病死的。急病——」她的声音陡然高了一点，又立刻压了回去，像怕被邻居听见，「一个人抄完这种——急病死了，你信吗？」",
                    "她看着你。褐色瞳孔还泡在水里，但她在认真等你回答。",
                    "「我信。」你说。",
                    "她愣了一瞬。",
                    "你把羊皮纸轻轻放回桌上，手指压着纸角：「急病就是他抄完的那张密令。」",
                    "她的嘴唇动了动。又动了动。然后她整个人从椅子上滑下去，蹲在地上，头埋在膝盖里，肩膀剧烈地抖了起来。她没有出声，但她的背弓得很紧，像是要把所有的东西都蜷进一个最小的范围内。",
                    "你坐在椅子上，没有站起来。你只是把羊皮纸折好，放在桌面的正中央，然后看着蹲在地上缩成一团的女孩。",
                    "外面有马车经过，车轮碾过石板的声音从远处传过来。街上有人在说话，很模糊，听不清在说什么。房间里只有她断断续续的呼吸声，和她自己掐住自己手臂时衣料摩擦的窸窣声。",
                    "她没有哭出声。但那张湿透的脸上，已经没有干净的地方了。",
                    "你站起来。椅子腿又响了一声。",
                    "「你叫什么？」",
                    "她的声音从膝盖缝隙里透出来，闷闷的，带着鼻腔的堵塞感：「……艾琳·维斯特。」",
                    "「艾琳。」你站在桌边，低头看她蜷在地上的影子，「这张纸我先放你这。我去西边——去你说的公墓。明天天亮之前回来。」",
                    "你推开门。外面的街道上空荡荡的，街灯还没点，暮色从西边漫过来，像一盆脏水缓缓铺开。身后的房间里，传来一声很轻很轻的、憋了很久终于漏出来的呜咽，又被捂住了。",
                    "你关上门。"
                ],
                description: '她说——今日起，你我都是飘零的落叶',
                rewards: { exp: 60 },
                onComplete() {
                    const cemetery = gameState.world && gameState.world['cemetery'];
                    if (cemetery) {
                        if (!cemetery.items) cemetery.items = [];
                        if (!cemetery.items.includes('strange_mound')) cemetery.items.push('strange_mound');
                    }
                    print(`<span style="color:#888;">西边公墓的方向，似乎有什么被埋在了土里……</span>`);
                }
            },
            {
                name: '新生的火种',
                questNpc: 'elaine',
                conditions: {
                    type: 'composite',
                    operator: 'all',
                    subConditions: [
                        { type: 'has_item', item: 'scribe_manuscript', label: '持有「抄写员的手稿」' },
                        { type: 'quest_talk', condValue: 'elaine', label: '与艾琳完成任务对话' }
                    ]
                },
                questDialogue: [
                    "你推开抄写员家门的时候，艾琳坐在椅子上，面前摊着翻开的书，但她的视线没有落在书上。",
                    "她抬起头来的时候，眼睛还是肿的，眼眶外围一圈浅红色的印子，像没有睡过觉。褐色短发比昨天更乱了几缕，衬衫的领口依然皱着，袖口蹭了一团墨水。",
                    "你没有说话。你把油布包裹放在桌面上，推到她面前。",
                    "她看了一眼。她的手指碰到油布边缘时停了一下——像被烫了一下——然后她解开了蜡封，翻开第一页。",
                    "她翻得很慢。翻到中间的时候速度变了——更快了——像在找什么东西。她找到了那页潦草的笔迹，读完了，然后合上手稿，两只手按在上面，安静地坐了一会儿。",
                    "她的眼睛红了几轮，但没有新泪淌下来。可能是哭干了，可能是现在不是哭的时候。",
                    "「他什么都记了。」她说，声音里没有昨天那种碎裂的边缘了，取而代之的是另一种声音——像是踩在碎瓷片上，发现找不到落脚的地方，「这几年所有的东西。每一条。每一笔。」",
                    "她的褐色瞳孔抬起来看着你，没有昨天那么湿了，但里面有一种新的东西——不确定。像是站在某个边缘，不知道下一步该往哪里落。",
                    "「这些东西……」她低头看着手稿，手指尖轻轻滑过纸面，「这些东西有什么用？」",
                    "她不是在问你一个她期待答案的问题。她是在把一句她自己也在想的话说出来。",
                    "「我父亲抄了七年。七年。这些东西堆在一起，足够把领主府的人送上去绞架——如果有地方送的话。」她的手停在纸面上方，没有压下去，「但没有人在乎。王都的人不会在乎，骑士团的人不会在乎。这些东西只是纸。他死在一张纸的后面——但这些纸救不了任何人。」",
                    "她的声音渐渐变小了。",
                    "「那他在做什么。」",
                    "她抬起头看着你的时候，褐色瞳孔像两颗浸在水里的栗子。这一次她没有哭。但她的样子比哭更让人觉得压不住。",
                    "「他抄这些东西，是为了什么。」",
                    "你站在桌沿对面，看着她。",
                    "「他抄的时候知道你会看见。」你说。",
                    "她看着你。",
                    "「他知道。」她重复了一遍，声音很轻，「他知道。」",
                    "她把手收回去，抱着那叠手稿，像抱着一件不知道该放在哪里的东西。棕色皮鞋的鞋尖并拢着，白色短袜裹着的脚踝细微地晃了一下——她在微微发抖，但说不清是冷还是什么。",
                    "「那我现在知道了。」她说，「然后呢。」",
                    "她把后半句咽回去了。但你能听出来她在问什么：然后我能做什么。",
                    "她没有答案。",
                    "「先留着。」你说，「知道之后怎么办——不是今晚要想的事。」",
                    "她没有动。她只是抱着那叠纸坐在那里，褐色的眼睛看着你。没有哭，没有笑，只是一层透明的迷茫覆在瞳孔表面。"
                ],
                description: '她说——今日起，你我都是新生的火种',
                rewards: { exp: 120 }
            },
            {
                name: '燃烧的薪柴',
                questNpc: 'elaine',
                conditions: {
                    type: 'composite',
                    operator: 'all',
                    subConditions: [
                        { type: 'has_item', item: 'flag_design', label: '持有「旗帜设计图」' },
                        { type: 'quest_talk', condValue: 'elaine', label: '与艾琳完成任务对话' }
                    ]
                },
                questDialogue: [
                    "你推开抄写员家的门时，她坐在桌边，面前摊着一叠写满字的纸。",
                    "她抬起头来看你。褐色瞳孔里没有泪光了，也不飘忽了——目光是直的，像终于找到了一个可以落下去的地方。",
                    "「我昨晚把旧档又读了一遍。」她说，「读了很久。」",
                    "你走进去，在她对面坐下。",
                    "「发现什么了？」",
                    "她没有直接回答。她低头翻了一会儿，抽出一张纸推到你面前：「十五年前，北境银矿镇。一样的矿场，一样的封闭令。他们写在纸上的理由是‘瘟疫’。」",
                    "她的手指按着纸面，抬起头来看着你：「但你的密令上写的是‘疯疫’。不一样的。」",
                    "你看着她：「然后呢。」",
                    "「然后——你回去救不了他们。」她说完这句话，嘴唇抿了一下，像是在确认自己有没有说错，「密令上写的是灭杀。你回去，你能做什么？你挡不住鸢尾骑士团的法术。」",
                    "她没有移开视线。",
                    "「但你还活着。我也活着。西区那些人还活着。农场那些人还活着。」她的手指从纸面上抬起来，握成拳搁在桌边，「我一个人做不了什么。我连这个门都不敢随便出。但是——」",
                    "她吸了一口气。",
                    "「如果我们一起呢？」",
                    "她看着你，褐色瞳孔在烛光里亮得有点晃眼。",
                    "「你认识贫民窟的人。我知道农场那边的记录——他们每年交七成的粮，冬天饿死的人比矿场还多。他们只是不知道别人也和他们一样。」",
                    "她把拳头松开，手掌平放在桌面上。",
                    "「你不是要找帮手吗？那些人就是帮手。他们不是矿工，但他们有手，有镐，有锄头——他们也有恨。」",
                    "她停了一下，声音低了一些，但目光没有躲：「我父亲把那些东西留给我。不是让我抱在怀里哭的。」",
                    "她往前凑了一点，椅子腿在地板上蹭出轻响：「我们把那些人拢起来。你出面，我在后面帮你整理消息。贫民窟、农场——不只是卡伦镇。周围还有别的村子。」",
                    "她盯着你，褐色瞳孔又圆又满，里面压着一层薄薄的热。",
                    "「我们可以做到的。」",
                    "她说完这四个字之后没有移开视线，像是在等你接住这句话。",
                    "你看着她。她坐在灯下，衬衫格子裙，手按在纸页上，下巴微抬，褐色短发边缘泛着烛火的暖光。",
                    "「你怕不怕？」你问。",
                    "她把手指蜷了一下，然后伸开了。",
                    "「怕。但我们还是会做的。」",
                    "窗外起了风。桌上的纸页被吹动了一角，她伸手压住，目光没有离开你。",
                    "「我会期盼你胜利归来，即使没有胜利，我更希望你能回来。」"
                ],
                description: '她说——今日起，你我都是燃烧的薪柴',
                rewards: { item: 'red_banner' },
                onComplete() {
                    if (!gameState.gameFlags) gameState.gameFlags = {};
                    gameState.gameFlags.rebelAlliesEnabled = true;
                }
            },
            {
                name: '升起的朝阳',
                conditions: {
                    type: 'composite',
                    operator: 'all',
                    subConditions: [
                        { type: 'flag', flag: 'redFlagPlanted', label: '插上鲜红的旗帜' },
                        { type: 'enter_room', room: 'count_castle_gate', label: '首次来到伯爵城堡大门' }
                    ]
                },
                description: '她说——今日起，你我都是升起的朝阳',
                rewards: { exp: 1000 },
                completeStoryUseNextBtn: false,
                completeStoryColor: '#ffaa66',
                completeStory: [
                    "你推开领主城堡大门的时候，广场上全是人。",
                    "天刚亮不久。晨光从东边漫过来，把石板路面染成浅金色。人群从四个方向涌向广场——西区农场的人，手上还带着干涸的泥；贫民窟的人，衣衫破旧但腰板挺得笔直；镇上的工匠、商贩、抄写员学徒，还有那些你叫不出名字但在夜晚见过面的人。",
                    "他们中间留出了一条路。",
                    "你往前走。人群在你经过的时候安静下来，然后又在你身后重新响起来——压低了的声音，像水浪一样一波一波地传开。",
                    "你站在广场中央的水井边。石砌的井沿还凉着，你把手按上去，触感粗糙而实在。",
                    "广场上的人越来越多。有人爬上屋顶，有人站在墙根的木箱上，小孩子被大人举过头顶。你看见农场的年轻人，手里还攥着镰刀。你看见抄写员家门口站着一个人——褐色齐肩短发，白色衬衫，格子短裙。她没有挤到前面来，就站在门槛上，手里握着一叠纸。",
                    "她看见你看向她，微微点了点头。",
                    "人群的声响渐渐沉下来。所有人都在等你开口。",
                    "你环顾了一圈。那些面孔，你不认识大多数。但那些人的眼睛都看着你——不是看一个逃犯，不是看一个矿工。是看一个带他们走到这里的人。",
                    "你吸了一口气。",
                    "「我们没有领主了。」",
                    "声音在晨光里传出去，落在石板路上，弹起来又散开。",
                    "「帝国不会善罢甘休。他们会派人来。他们回来的时候——」",
                    "你停了一下。扫视着人群。",
                    "「——他们来的时候，会看见一个没有领主、没有骑士、没有征税官的镇子。他们会看见我们自己管自己。他们会看见我们站在这座广场上，和今天一样。」",
                    "人群里没有人说话。但没有人后退。",
                    "「卡伦镇从今天开始自治。不收帝国税，不供帝国粮。谁来管我们——我们自己管。谁来找麻烦——」你顿了一下，「我们让他走着进来，抬着出去。」",
                    "安静。",
                    "「我们胜利了！」某一个人喊了一声。然后另一个人喊了一声。最终声音连成一片——没有整齐的口号，只是一片乱七八糟的、从喉咙里挤出来的叫喊，带着排山倒海的气势，撞上教堂的尖顶，又落回石板路上。",
                    "你看见艾琳在人群边缘，把脸侧过去了一瞬——抬手擦了一下眼角，然后转回来，笑着看向你。",
                    "她旁边站着一个瘦瘦的女孩，极长的黑发垂到腰际，金色瞳孔在晨光里亮得扎眼。她抱着手臂靠在墙上，没有看你。",
                    "你低下头。脚边是磨得发亮的石板，缝隙里嵌着青苔和碎砂。你蹲下去，手掌贴着石面。暖的。阳光把石板晒暖了。",
                    "你站起来。",
                    "「开始劳动吧，为自己而活。」",
                    "人群里的声音渐渐收拢成一阵低沉的涌动。有人开始动起来——转身往粮仓方向走，有人往自己住的方向跑，像一摊被搅动的水，缓缓溢出广场，流向镇子的各个角落。",
                    "你又朝抄写员家的方向看了一眼。艾琳还站在门槛上，那叠纸被她抱在胸前。她看见你看她，张了张嘴——隔得太远，听不见。但你读得懂那个口型。",
                    "她说的是：「我们做到了。」",
                    "你转过身，看向南边。透过广场尽头低矮的屋顶，可以看到远处地平线上那一线灰黄色——桑华山。它还在那里。安静地蹲伏着，和从前一样。",
                    "你看了它一会儿。然后转回来。",
                    "广场上有人在喊你的名字。不止一个。你听不清具体的音节，但你知道那些声音是冲着你来的。你迈了一步，走下井沿的石阶。脚下的石板是实的。",
                    "阳光铺满了整个广场。"
                ]
            }
        ]
    },

    // 主线任务4 - 终究会离开（解锁条件：首次到达卡伦镇驿站）
    quest_depart: {
        id: 'quest_depart',
        type: 'main',
        name: '主线任务4：终究会离开',
        trigger: { type: 'enter_room', room: 'karen_relay_station' },
        questNpc: 'coachman',
        conditions: {
            type: 'single',
            condType: 'quest_talk',
            condValue: 'coachman',
            label: '与车夫交谈'
        },
        questDialogue: [
            "驿站的院子里，一个车夫正靠着驿车打盹，听见脚步声才慢吞吞地睁开眼。",
            "「哟，生面孔。是要出远门？」他上下打量你一眼，目光停在你沾满石粉的外套上。",
            "「桑华山那边来的吧——看这身灰就知道。只要给够路费，你想去哪儿，我的车就能把你送到哪儿。」"
        ],
        description: '通往其他城市的驿站，摆脱旧身份，开始新生活。',
        rewards: { exp: 300 },
        onComplete() {
            // 若非通过营救华沙完成（即直接与车夫对话离开），华沙便死在地牢深处
            const rescueDone = StoryEngine.completedQuests.includes('quest_rescue_huasha');
            if (rescueDone) return;

            if (typeof removeNpcEverywhere === 'function') {
                removeNpcEverywhere('huasha');
            }
            const dungeon3 = gameState.world && gameState.world['dungeon_3'];
            if (dungeon3 && typeof generateHuashaCorpse === 'function') {
                if (!dungeon3.items) dungeon3.items = [];
                const corpse = generateHuashaCorpse();
                if (corpse) dungeon3.items.push(corpse.id);
            }
            print(`<span style="color:#888;">你并未回地牢去救华沙。那个被囚在牢道深处的驿站老板，大概再也等不到来人了。</span>`);
            if (typeof updateSceneInfo === 'function') { updateSceneInfo(); updateMinimap(); }
        }
    },

    // 支线任务8 - 拯救桑华山的幻想
    quest_rescue_huasha: {
        id: 'quest_rescue_huasha',
        type: 'side',
        name: '支线任务8：拯救桑华山的幻想',
        trigger: {
            type: 'composite_trigger',
            operator: 'all',
            triggers: [
                { type: 'enter_room', room: 'karen_relay_station' },
                { type: 'quest_complete', quest: 'quest_purge_order' }
            ]
        },
        questNpc: 'huasha',
        conditions: {
            type: 'single',
            condType: 'quest_talk',
            condValue: 'huasha',
            label: '在地牢中与华沙交谈'
        },
        questDialogue: [
            "华沙从铁栅的阴影里缓缓抬起头。看清你的脸后，她灰败的眼里终于浮起一点活气。",
            "「你……你是来救我的吧？」她把脸贴近栅栏，声音压得极低，却止不住地发抖。",
            "「我叫华沙，是驿站老板。伯爵的人逼我交出驿站的通行路引，好让他们神不知鬼不觉地从这里离开。我一直没给，他们就把我关到了这种地方。」",
            "「求求你……带我出去。外面还等着我回去。你只要救我出去，我一定会报答你的。」"
        ],
        description: '驿站老板华沙被关进了城堡的地牢。前往地牢，救出华沙。',
        rewards: { exp: 150 },
        onComplete() {
            if (typeof moveNpcToRoom === 'function') {
                moveNpcToRoom('huasha', 'karen_relay_station');
            }
            // 华沙获救后，由她接手带你离开
            const depart = StoryEngine.registry.get('quest_depart');
            if (depart) {
                depart.questNpc = 'huasha';
                depart.conditions = {
                    type: 'single',
                    condType: 'quest_talk',
                    condValue: 'huasha',
                    label: '与华沙交谈'
                };
                depart.questDialogue = [
                    "华沙回到了驿站，像是整个人重新活了过来。她整了整衣襟，朝你深深欠身。",
                    "「谢谢你。要不是你，我这辈子大概都会烂在那个地牢里。」",
                    "「你想离开？好——驿车的路引我给你开，车夫我也替你安排。只不过，离开之前，陪我说说桑华山吧。我……也曾经从那里逃出来过。」"
                ];
                depart.description = '华沙被救出来了。去驿站找她，安排离开的事。';
            }
            if (typeof updateSceneInfo === 'function') { updateSceneInfo(); updateMinimap(); }
        }
    }
};