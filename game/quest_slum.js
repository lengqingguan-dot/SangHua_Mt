// ============================================================
//  game/quest_slum.js - 支线任务6「这里是贫民窟」专用逻辑
//  生成NPC、两个分支选择、NPC对NPC的自动战斗模拟
// ============================================================

const SLUM_QUEST_ID = 'quest_slum_district';

// 在房间165（residence_w2）生成任务相关NPC（避免重复）
function spawnSlumNpcs() {
    const room = gameState.world['residence_w2'];
    if (!room) return;
    if (!room.npcs) room.npcs = [];

    const ids = ['slum_guard', 'slum_collector', 'angry_man', 'fainted_woman'];
    let changed = false;
    ids.forEach(id => {
        if (!room.npcs.includes(id)) {
            room.npcs.push(id);
            changed = true;
        }
    });

    if (changed && typeof updateSceneInfo === 'function') {
        updateSceneInfo();
        updateMinimap();
    }
}

// 将某个NPC从当前所有房间移除，并加入目标房间
function moveNpcToRoom(npcId, targetRoomId) {
    for (const roomId in gameState.world) {
        const room = gameState.world[roomId];
        if (room && room.npcs && room.npcs.includes(npcId)) {
            const idx = room.npcs.indexOf(npcId);
            if (idx > -1) room.npcs.splice(idx, 1);
        }
    }
    const target = gameState.world[targetRoomId];
    if (target) {
        if (!target.npcs) target.npcs = [];
        if (!target.npcs.includes(npcId)) target.npcs.push(npcId);
    }
}

// 从所有房间移除某个NPC
function removeNpcEverywhere(npcId) {
    for (const roomId in gameState.world) {
        const room = gameState.world[roomId];
        if (room && room.npcs) {
            const idx = room.npcs.indexOf(npcId);
            if (idx > -1) room.npcs.splice(idx, 1);
        }
    }
}

// 向房间添加地面物品（避免重复）
function addItemToRoom(roomId, itemId) {
    const room = gameState.world[roomId];
    if (!room) return;
    if (!room.items) room.items = [];
    if (!room.items.includes(itemId)) room.items.push(itemId);
}

// 分支一：冲上去 —— 玩家与守卫、商人战斗
function slumChoiceAttack() {
    if (typeof battleState !== 'undefined' && battleState.inBattle) {
        print('<span style="color:#ffaaaa;">战斗已经开始了！</span>');
        return;
    }

    clearDetailPanel();
    currentPanel = null;

    print('');
    print('<span style="color:#ff6666;">你没有犹豫，从暗处冲了出去！</span>');

    // 胜利后再处理任务推进
    window._onBattleEnd = function (playerWon) {
        if (playerWon) slumOnVictory();
    };

    startMultiBattle(['slum_guard', 'slum_collector']);
}

// 冲上去并战胜后：任务描述改变，改为与男人进行「快和我走」的任务对话
function slumOnVictory() {
    const story = StoryEngine.registry.get(SLUM_QUEST_ID);
    if (story) {
        story.description = '跟上那个男人，到贫民窟西的窝棚中';
        story.questNpc = 'angry_man';
        story.conditions = {
            type: 'single',
            condType: 'quest_talk',
            condValue: 'angry_man',
            label: '与愤怒的男人交谈'
        };
        story.questDialogue = [
            "「快和我走。」",
            "男人的声音从你身后传来，低而急促。他已经把女人半背半拖地架起来了，两人艰难地移动着。",
            "「我会带你到安全的地方。」"
        ];
        story.questDialogueOnComplete = function () {
            slumAfterFollowDialogue();
        };
    }

    print('');
    print('<span style="color:#ffaa66;">守卫和商人倒下了。那个男人架起昏倒的女人，踉跄着朝你点了点头。</span>');
    print('');
}

// 听完「快和我走」后：改名、迁移到窝棚、在房间190生成窝棚入口
function slumAfterFollowDialogue() {
    const man = CHARACTER_TEMPLATES['angry_man'];
    const woman = CHARACTER_TEMPLATES['fainted_woman'];
    if (man) man.name = '科林';
    if (woman) woman.name = '玛拉';

    // 迁移两人到窝棚内部
    moveNpcToRoom('angry_man', 'slum_hut_inside');
    moveNpcToRoom('fainted_woman', 'slum_hut_inside');

    // 在房间190（slum_west_n3）生成可进入的窝棚
    addItemToRoom('slum_west_n3', 'slum_hut');

    const story = StoryEngine.registry.get(SLUM_QUEST_ID);
    if (story) {
        story.description = '去窝棚中与科林交谈';
        story.questNpc = 'angry_man';
        story.conditions = {
            type: 'single',
            condType: 'quest_talk',
            condValue: 'angry_man',
            label: '与科林交谈'
        };
        story.questDialogue = [
            "窝棚很小。一盏没点亮的油灯，一张歪腿的桌子，墙角的稻草堆上铺着一条脏得看不出颜色的毯子。风从墙缝里钻进来，吹得油灯的铁皮罩子轻轻晃动。",
            "“我叫科林，她是我的妻子玛拉。”",
            "科林靠在墙上喘气。他的脸上有血——不是他的。他低头看了看自己的手，又看了看你。",
            "“……你杀人了。他们不会放过你的。”",
            "你没有回答。",
            "门外突然传来脚步声。你们突然紧张起来。",
            "脚步声不是一两个人的，是很多人的。",
            "沉重的、整齐的、靴底砸在泥地上的声音突兀地回荡在。接着是喊话——嗓门很大，带着军伍里练出来的那种穿透力：“西区清场！所有人出屋！十息之后还在屋里的，按窝藏论处！”",
            "科林猛地抬头看你。他的眼睛里有一瞬间的空白，然后是恐惧。",
            "“……他们不是冲你来的。”他说，声音低得像在自言自语。“是冲我们来的。冲这条巷子。冲……”",
            "他说不下去了。因为外面已经开始响了——木板被踹开的声音，铁器砸在土墙上的声音，然后是女人被奸淫后拖长的哭声、尖叫，还有士兵的狂笑与高喊。",
            "科林低下头。他把玛拉往稻草堆深处推了推，用毯子盖住她。",
            "“别出声。”他说。",
            "你们在窝棚里，听着外面的声音，数着那些你没看见的门的倒塌。",
            "你坐在泥地上，后背抵着冰冷的土墙。外面偶尔还有人声——士兵在交换信息：“这间查过了”“那边还有两个”“不用留”。",
            "你说不上来过了多久。",
            "有几个人走到窝棚外面，停住了。皮靴踩在泥地里的声音，比前面那几个轻一些。突然木板门被人从外面暴力地踹开，你们暴露在一队士兵眼底。明晃晃的军刀闪着锐利的光。",
            "你屏住了呼吸。刚看见科林想要开口，军刀却直接捅穿了他的胸膛，又热又腥的血飙到屋顶。科林软绵绵地倒在地上，渐渐涣散的眼里满是恐惧与绝望。",
            "你本能地退却，一边抽出武器，准备殊死一搏。",
            "就在这时，窝棚的稻草堆下面——你站着的这块地面下面——传来一声极轻极轻的响动。像是木料被掀开的吱嘎声。",
            "你猛地低头。",
            "一只手，细瘦的、沾着灰的手，快速地打开了一个活板门，从地板底下伸出来，准确地抓住了你的脚踝。并用与之外形极其不匹配的力量将你瞬间拽了下去。",
            "你完全无法站稳，失重的感觉瞬时来临，活板门在你眼前迅速关上，被插上了一个巨大的铁栓。一瞬间你还听见士兵恼怒的叫喊，以及军刀砍剁活板门的声音。",
            "许久之后，周围安静下来，只剩下地道中的黑暗以及看着你的一个女孩。"
        ];
        story.questDialogueOnComplete = function () {
            slumTeleportToTunnel();
        };
    }

    print('');
    print('<span style="color:#ffaa66;">科林搀着玛拉，艰难地朝贫民窟西边的一间窝棚走去。</span>');
    print('');

    if (typeof updateSceneInfo === 'function') {
        updateSceneInfo();
        updateMinimap();
    }
}

// 移除房间内所有指定NPC
function _removeNpcIdsFromRoom(roomId, npcId) {
    const room = gameState.world[roomId];
    if (!room || !room.npcs) return;
    room.npcs = room.npcs.filter(id => id !== npcId);
}

// 在房间内生成一具通用女贫民尸体并返回；preDrop=true 时随机预掉落部分肢体并标记已肢解
function _spawnFemalePeasantCorpse(roomId, preDrop) {
    const room = gameState.world[roomId];
    if (!room || typeof generateGenericFemaleCorpse !== 'function') return null;
    if (!room.items) room.items = [];

    const corpse = generateGenericFemaleCorpse('女贫民');
    if (!corpse) return null;
    room.items.push(corpse.id);

    if (preDrop && corpse.generatedLimbs && corpse.limbTemplates) {
        const partIds = corpse.limbTemplates.map(l => l.id);
        const shuffled = [...partIds].sort(() => Math.random() - 0.5);
        const dropCount = 1 + Math.floor(Math.random() * 3); // 随机 1~3 个部位
        const toDrop = shuffled.slice(0, dropCount);
        if (!corpse.dismemberedLimbs) corpse.dismemberedLimbs = [];

        toDrop.forEach(partId => {
            const arr = corpse.generatedLimbs[partId];
            if (!arr) return;
            arr.forEach(limbTemplate => {
                const limb = JSON.parse(JSON.stringify(limbTemplate));
                const realId = `${partId}_predrop_${Date.now()}_${Math.random().toString(36).substr(2, 6)}`;
                limb.id = realId;
                ITEM_TEMPLATES[realId] = limb;
                room.items.push(realId);
            });
            if (!corpse.dismemberedLimbs.includes(partId)) corpse.dismemberedLimbs.push(partId);
        });
    }

    return corpse;
}

// 清场后：所有贫民NPC转尸体、165放废墟与两名女贫民尸体+肢体、164/189留女尸、166/188留男尸
function slumMassacreAftermath() {
    // 164、189窝棚：女贫民原地变尸体
    _removeNpcIdsFromRoom('peasant_hut_1_inside', 'peasant_female');
    _removeNpcIdsFromRoom('peasant_hut_4_inside', 'peasant_female');
    _spawnFemalePeasantCorpse('peasant_hut_1_inside', false);
    _spawnFemalePeasantCorpse('peasant_hut_4_inside', false);

    // 166、188窝棚：男贫民变男尸，女贫民删除
    _removeNpcIdsFromRoom('peasant_hut_2_inside', 'peasant_male');
    _removeNpcIdsFromRoom('peasant_hut_3_inside', 'peasant_male');
    if (typeof generatePeasantMaleCorpse === 'function') {
        const r2 = gameState.world['peasant_hut_2_inside']; if (r2) { if (!r2.items) r2.items = []; const c = generatePeasantMaleCorpse(); if (c) r2.items.push(c.id); }
        const r3 = gameState.world['peasant_hut_3_inside']; if (r3) { if (!r3.items) r3.items = []; const c = generatePeasantMaleCorpse(); if (c) r3.items.push(c.id); }
    }
    _removeNpcIdsFromRoom('peasant_hut_2_inside', 'peasant_female');
    _removeNpcIdsFromRoom('peasant_hut_3_inside', 'peasant_female');

    // 165（residence_w2）：熄灭的废墟 + 两个女贫民尸体与随机掉落肢体
    addItemToRoom('residence_w2', 'ruins_burned');
    _spawnFemalePeasantCorpse('residence_w2', true);
    _spawnFemalePeasantCorpse('residence_w2', true);
}

// 看完科林剧情后：传送进地道，科林与玛拉死亡移除，窝棚生成两具尸体，完成任务
function slumTeleportToTunnel() {
    // 科林、玛拉从窝棚移除
    removeNpcEverywhere('angry_man');
    removeNpcEverywhere('fainted_woman');

    // 窝棚添加通往地道的活板门（与地道中的出口活板门对应）
    addItemToRoom('slum_hut_inside', 'slum_trapdoor');

    // 窝棚中生成科林、玛拉的尸体
    const hut = gameState.world['slum_hut_inside'];
    if (hut) {
        if (!hut.items) hut.items = [];
        if (typeof generateColinCorpse === 'function') {
            const colinCorpse = generateColinCorpse();
            if (colinCorpse) hut.items.push(colinCorpse.id);
        }
        if (typeof generateMaraCorpse === 'function') {
            const maraCorpse = generateMaraCorpse();
            if (maraCorpse) hut.items.push(maraCorpse.id);
        }
    }

    // 贫民清场
    slumMassacreAftermath();

    if (typeof updateSceneInfo === 'function') {
        updateSceneInfo();
        updateMinimap();
    }

    // 传送到地道房间，到达后自动触发曼德罗拉的自我介绍剧情
    relocateTo('slum_tunnel', {
        travelText: '黑暗吞没了你。等你的眼睛适应之后，才看清地道里那个瘦小的女孩。',
        travelColor: '#cc9966',
        callback: mandorolaIntro
    });
}

// 曼德罗拉自我介绍 + 用刀架脖逼入会
function mandorolaIntro() {
    clearDetailPanel();
    currentPanel = null;

    StoryEngine.playLines({
        lines: [
            "女孩松开了抓着你的手，向后退了半步。她的目光在你身上扫过，像在打量一件货品。",
            "「我叫曼德罗拉。」她说，声音很轻，却清楚得让人发冷。",
            "「不管你是什么人，能从那帮士兵刀下活下来，就值得被看一眼。」",
            "她不知何时已经绕到你身后，一柄冰凉的匕首横在你的咽喉上。",
            "「加入我们。否则死在这里，也不会有人记得你。」"
        ],
        color: '#ff8844', useNextBtn: true, requireOverlay: true,
        onComplete: () => {
            print(`<span style="color:#ffaa66;">你感到刀刃贴着自己的喉咙，要怎么做？</span>`);
            print(`<span style="color:#ff6666;text-decoration:underline;cursor:pointer;" onclick="mandorolaResist()">⚔️ 反抗</span>`);
            print(`<span style="color:#aaffaa;text-decoration:underline;cursor:pointer;" onclick="mandorolaAgree()">👍 同意</span>`);
        }
    });
}

// 反抗 → 与曼德罗拉战斗
function mandorolaResist() {
    if (typeof battleState !== 'undefined' && battleState.inBattle) { print('<span style="color:#ffaaaa;">战斗已经开始了！</span>'); return; }
    clearDetailPanel(); currentPanel = null;

    print('');
    print('<span style="color:#ff6666;">你猛地侧身，试图避开那看似松垮实则致命的刀锋！</span>');

    window._onBattleEnd = function (playerWon) {
        if (playerWon) {
            removeNpcEverywhere('slum_girl');
            print('');
            print('<span style="color:#ffaa66;">女孩倒在了地道里，血渗进冰冷的泥土。你对这条地下通道一无所知，唯一的引路人已经死了。</span>');
        }
    };

    startBattle('slum_girl');
}

// 同意 → 改名并移动到带大铁门的房间，更新任务6
function mandorolaAgree() {
    clearDetailPanel(); currentPanel = null;

    if (CHARACTER_TEMPLATES['slum_girl']) CHARACTER_TEMPLATES['slum_girl'].name = '曼德罗拉';
    moveNpcToRoom('slum_girl', 'slum_tunnel_n4');

    const story = StoryEngine.registry.get(SLUM_QUEST_ID);
    if (story) {
        story.description = '你同意了曼德罗拉，此时你只能遵守她的规则';
        story.questNpc = 'slum_girl';
        story.conditions = { type: 'single', condType: 'quest_talk', condValue: 'slum_girl', label: '与曼德罗拉交谈' };
        story.rewards = { exp: 80, item: 'skull_key' };
        story.questDialogue = [
            "曼德罗拉收起匕首，转身朝地道深处走去，靴子踩在湿冷的泥土上几乎无声。",
            "「跟上来。别掉队。」",
            "你跟着她一路向北，直到一扇沉重的大铁门前停下。",
            "「进去之前，记住一件事。」她回过头，眼神冷得像这地道里的风。",
            "「从你答应我的那一刻起，你的命就不再只属于你自己了。」"
        ];
        story.questDialogueOnComplete = mandorolaEnterHall;
    }

    print('');
    print('<span style="color:#ffaa66;">曼德罗拉收起了匕首。她朝地道深处走去，示意你跟上。</span>');
    print('');

    if (typeof updateSceneInfo === 'function') { updateSceneInfo(); updateMinimap(); }
}

// 铁门对话后：与曼德罗拉一起进入昏暗大厅；到达后再完成任务6、发钥匙、解锁支线7
function mandorolaEnterHall() {
    moveNpcToRoom('slum_girl', 'dark_hall');

    relocateTo('dark_hall', {
        travelText: '你跟着曼德罗拉走进了那扇大铁门。门后的世界暗得几乎难以看清。',
        travelColor: '#cc9966',
        callback: () => {
            const story = StoryEngine.registry.get(SLUM_QUEST_ID);
            if (story && StoryEngine.activeQuests.includes(SLUM_QUEST_ID)) {
                StoryEngine.completeQuest(SLUM_QUEST_ID, story);
            }
            if (typeof joinFactionExtinction === 'function') {
                joinFactionExtinction();
                print('<span style="color:#ffaa66;">你已加入势力「灭绝」。</span>');
            }
            StoryEngine.check();
        }
    });
}

// 分支二：无视 —— 守卫、商人杀死愤怒的男人与昏倒的女人，任务直接完成
function slumChoiceIgnore() {
    if (typeof battleState !== 'undefined' && battleState.inBattle) {
        print('<span style="color:#ffaaaa;">战斗已经开始了！</span>');
        return;
    }

    clearDetailPanel();
    currentPanel = null;

    print('');
    print('<span style="color:#888;">你退进阴影里，没有出声，也没有出手。</span>');
    runNpcVsNpcBattle(['slum_guard', 'slum_collector'], ['angry_man', 'fainted_woman']);

    const story = StoryEngine.registry.get(SLUM_QUEST_ID);
    if (story && StoryEngine.activeQuests.includes(SLUM_QUEST_ID)) {
        StoryEngine.completeQuest(SLUM_QUEST_ID, story);
    }
}

// NPC 对 NPC 的自动战斗模拟（攻击方必胜，用于剧情过场）
function runNpcVsNpcBattle(attackerIds, defenderIds) {
    const attackers = attackerIds
        .map(id => {
            const t = getCharacterInfo(id);
            if (!t) return null;
            return { npcId: id, name: t.name, atk: t.atk || 1, def: t.def || 0, agi: t.agi || 0 };
        })
        .filter(Boolean);
    const defenders = defenderIds
        .map(id => {
            const t = getCharacterInfo(id);
            if (!t) return null;
            return { npcId: id, name: t.name, hp: t.hp || 1, maxHp: t.hp || 1, def: t.def || 0, agi: t.agi || 0 };
        })
        .filter(Boolean);

    if (attackers.length === 0 || defenders.length === 0) {
        print('<span style="color:#888;">（这里已经没有人了。）</span>');
        return;
    }

    print('');
    print('<span style="color:#ffaa66;">═══════════════════════════</span>');
    print('<span style="color:#ffaa66;">守卫和商人同时动了手。</span>');

    let round = 0;
    while (defenders.some(d => d.hp > 0) && round < 50) {
        round++;
        attackers.forEach(attacker => {
            const alive = defenders.filter(d => d.hp > 0);
            if (alive.length === 0) return;
            const target = alive[0];

            // 受害者 agi 为 0，无法闪避；伤害经 ±60% 浮动后仍能确保击杀
            const damage = calculateDamage(attacker.atk, target.def, null, null);
            target.hp = Math.max(0, target.hp - damage);

            if (target.hp <= 0) {
                print(`<span style="color:#ff6666;">${attacker.name} 挥下武器——${target.name}倒在了血泊中。</span>`);
            } else {
                print(`<span style="color:#ff9999;">${attacker.name} 攻击 ${target.name}，造成 ${damage} 点伤害。</span>`);
            }
        });
    }

    // 从房间移除死者并生成尸体
    const room = gameState.world[gameState.player.location];
    defenders.forEach(d => {
        if (room && room.npcs) {
            const idx = room.npcs.indexOf(d.npcId);
            if (idx > -1) room.npcs.splice(idx, 1);
        }
        const corpse = createCorpse(d.npcId);
        if (corpse) {
            corpse.id = `corpse_${d.npcId}_${Date.now()}`;
            ITEM_TEMPLATES[corpse.id] = corpse;
            if (room) {
                if (!room.items) room.items = [];
                room.items.push(corpse.id);
            }
        }
    });

    print('<span style="color:#ff6666;">愤怒的男人和昏倒的女人死了。没有人再发出声音。</span>');
    print('<span style="color:#ffaa66;">═══════════════════════════</span>');
    print('');

    if (typeof updateSceneInfo === 'function') {
        updateSceneInfo();
        updateMinimap();
    }
}