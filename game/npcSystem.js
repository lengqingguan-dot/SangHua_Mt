// ============================================================
//  game/npcSystem.js - NPC交互系统
//  NPC信息展示、对话、攻击、侵犯、屠宰、榨精、买卖
// ============================================================

function getCharacterInfo(templateId) {
    return (typeof CHARACTER_TEMPLATES !== 'undefined') ? (CHARACTER_TEMPLATES[templateId] || null) : null;
}

// 显示NPC详情
function showNPCInfo(npcId) {
    const npc = getCharacterInfo(npcId);
    if (!npc) { printToDetail("找不到该角色信息。"); return; }

    let html = makeTitle(npc.name);
    html += `类型：${getCharacterTypeName(npc.type)}\n`;
    if (npc.desc) html += `\n<span style="color: #80e5ff;">${npc.desc}</span>\n`;
    html += centerLine();

    if (npc.canTalk && npc.dialogue) {
        const genderText = npc.gender === 'female' ? '她' : '他';
        html += `<div><span style="color: #aaffaa; text-decoration: underline; cursor: pointer;" onclick="talkToNPCAction('${npcId}')">💬 与${genderText}交谈</span></div>`;
    }
    if (typeof StoryEngine !== 'undefined') {
        const activeQuest = StoryEngine.findActiveQuestForNpc(npcId);
        if (activeQuest && activeQuest.questDialogue) {
            html += `<div><span style="color: #ffaa66; text-decoration: underline; cursor: pointer;" onclick="talkToNPCQuest('${npcId}')">📋 任务对话</span></div>`;
        }
    }
    if (npc.canFight) {
        html += `<div><span style="color: #ffaaaa; text-decoration: underline; cursor: pointer;" onclick="attackNPC('${npcId}')">⚔️ 攻击</span></div>`;
    }
    if (npc.gender === 'female') {
        html += `<div><span style="color: #ff66aa; text-decoration: underline; cursor: pointer;" onclick="assaultNPC('${npcId}')">🔞 侵犯</span></div>`;
    }
    if (npc.canSlaughter) {
        html += `<div><span style="color: #ff8844; text-decoration: underline; cursor: pointer;" onclick="slaughterNPC('${npcId}')">🔪 屠宰</span></div>`;
    }
    if (npc.canMilk) {
        html += `<div><span style="color: #ff88cc; text-decoration: underline; cursor: pointer;" onclick="milkNPC('${npcId}')">💦 榨精</span></div>`;
    }
    if (npc.merchantType === 'sell') {
        html += `<div><span style="color: #ffaa00; text-decoration: underline; cursor: pointer;" onclick="showTradePanel()">💰 出售</span></div>`;
    } else if (npc.merchantType === 'buy') {
        html += `<div><span style="color: #ffaa00; text-decoration: underline; cursor: pointer;" onclick="showBuyPanel()">🛒 购买</span></div>`;
    }

    html += `<div><span style="color: #aaa; cursor: pointer;" onclick="clearDetailPanel()">↩️ 返回</span></div>`;
    currentDetailNPC = npcId;
    UI.setDetail(html);
    currentPanel = 'npc_detail';
}

// 与NPC对话
function talkToNPCAction(npcId) {
    const npc = getCharacterInfo(npcId);
    if (!npc || !npc.dialogue) { print(`${npc.name} 似乎不想和你说话。`); return; }

    clearDetailPanel(); currentPanel = null;
    UI.setOverlay(true);

    const isFirstTime = !gameState.talkedNPCs[npcId];
    const isAssaulted = gameState.assaultedNPCs && gameState.assaultedNPCs[npcId];
    let dialogues = npc.dialogue;
    if (isAssaulted && npc.assaultedDialogue) dialogues = npc.assaultedDialogue;
    else if (!isFirstTime) dialogues = npc.repeatDialogue || npc.dialogue;

    if (isFirstTime) {
        StoryEngine.checkFirstTalk(npcId);
        StoryEngine.markConditionProgress('first_talk', npcId);
        gameState.talkedNPCs[npcId] = true;
    }

    let lineIndex = 0;
    function showNext() {
        if (lineIndex < dialogues.length) {
            print("<br>");
            print(`<span style="color: #ff8844;">${dialogues[lineIndex]}</span>`);
            lineIndex++;
            showNextBtn(showNext);
        } else {
            hideNextBtn();
            UI.setOverlay(false);
            StoryEngine.check();
        }
    }
    showNext();
}

// 与NPC进行任务对话
function talkToNPCQuest(npcId) {
    const activeQuest = StoryEngine.findActiveQuestForNpc(npcId);
    if (!activeQuest || !activeQuest.questDialogue) {
        print(`<span style="color: #888;">没有可用的任务对话。</span>`);
        return;
    }

    clearDetailPanel(); currentPanel = null;
    UI.setOverlay(true);

    let lineIndex = 0;
    function showNext() {
        if (lineIndex < activeQuest.questDialogue.length) {
            print("<br>");
            print(`<span style="color: #ffaa66;">${activeQuest.questDialogue[lineIndex]}</span>`);
            lineIndex++;
            showNextBtn(showNext);
        } else {
            hideNextBtn();
            UI.setOverlay(false);
            StoryEngine.markConditionProgress('quest_talk', npcId);
            StoryEngine.check();
        }
    }
    showNext();
}

// 攻击NPC
function attackNPC(npcId) {
    if (typeof battleState !== 'undefined' && battleState.inBattle) { print(`<span style="color: #ffaaaa;">战斗中无法执行其他操作！</span>`); return; }
    clearDetailPanel();

    if (npcId === 'apprentice_knight' && gameState.player.location === 'stone_road_12') {
        const room = gameState.world['stone_road_12'];
        if (room && room.npcs) {
            const knightCount = room.npcs.filter(id => id === 'apprentice_knight').length;
            if (knightCount > 1) {
                print(`<span style="color: #ff6666;">两名见习骑士并肩作战，同时向你发起攻击！</span>`);
                startMultiBattle(['apprentice_knight', 'apprentice_knight']);
                return;
            }
        }
    }
    startBattle(npcId);
}

// 侵犯NPC
function assaultNPC(npcId) {
    if (typeof battleState !== 'undefined' && battleState.inBattle) { print(`<span style="color: #ffaaaa;">战斗中无法执行其他操作！</span>`); return; }

    const npc = getCharacterInfo(npcId);
    if (!npc || npc.gender !== 'female') { print("目标不符合条件。"); return; }

    clearDetailPanel();

    const playerAtk = gameState.player.atk || 1;
    const npcAtk = npc.atk || 1;
    const finalRate = Math.max(5, Math.min(95, (playerAtk - npcAtk) * 10));
    const roll = Math.random() * 100;

    if (roll < finalRate) {
        print(`<span style="color: #ff66aa;">侵犯成功！</span>`);
        UI.setOverlay(true);

        const story = npc.assaultStory;
        if (!story || story.length === 0) { print(`<span style="color: #888;">侵犯结束...</span>`); UI.setOverlay(false); return; }

        let lineIndex = 0;
        function showNext() {
            if (lineIndex < story.length) {
                print("<br>");
                print(`<span style="color: #ff44e3;">${story[lineIndex]}</span>`);
                lineIndex++;
                showNextBtn(showNext);
            } else {
                hideNextBtn();
                UI.setOverlay(false);
                print(`<span style="color: #ff66aa;">侵犯结束...</span>`);
                if (!gameState.assaultedNPCs) gameState.assaultedNPCs = {};
                gameState.assaultedNPCs[npcId] = true;
            }
        }
        showNext();
    } else {
        print(`<span style="color: #ff4444;">侵犯失败！${npc.name}挣脱了你的控制！</span>`);
        startBattle(npcId);
    }
}

// 屠宰NPC
function slaughterNPC(npcId) {
    const npc = getCharacterInfo(npcId);
    if (!npc || !npc.canSlaughter) { print("无法屠宰。"); return; }
    const room = gameState.world[gameState.player.location];
    if (!room || !room.npcs || !room.npcs.includes(npcId)) { print("这里没有可以屠宰的目标。"); return; }

    clearDetailPanel(); currentPanel = null;
    const npcIndex = room.npcs.indexOf(npcId);
    if (npcIndex > -1) room.npcs.splice(npcIndex, 1);

    print(`<span style="color: #ff8844;">你举起了屠刀...</span>`);

    if (npcId === 'warhorse') {
        print(`<span style="color: #ffaaaa;">战马发出一声悲鸣，倒在了血泊中...</span>`);
        const drops = ['warhorse_penis', 'warhorse_meat', 'warhorse_head'];
        drops.forEach(dropId => {
            const item = createItemFromTemplate(dropId);
            if (item) { 
                const uniqueId = `${dropId}_${Date.now()}`;
                item.id = uniqueId;
                ITEM_TEMPLATES[uniqueId] = item;
                if (!room.items) room.items = [];
                room.items.push(uniqueId); 
                print(`<span style="color: #aaffaa;">${item.name}掉落在了地上。</span>`); 
            }
        });
        room.desc = "一间用粗木搭建的马厩...最里面的隔栏中残留着大片血迹，一匹战马曾在这里被屠宰。";
    }
    updateSceneInfo();
}

// 榨精NPC
function milkNPC(npcId) {
    clearDetailPanel();
    const npc = getCharacterInfo(npcId);
    if (!npc) { print("该生物已不存在。"); return; }

    if (npcId === 'warhorse') {
        print(`<span style="color: #ff88cc;">你走向了${npc.name}...</span>`);
        const story = [
            "战马不安地踢着蹄子，但它似乎明白你的意图。",
            "你熟练地制服了这匹强壮的战马，它的阴茎逐渐显露...",
            "在机械般的刺激下，战马的阴茎逐渐充血勃起...",
            "很快，第一股精液被挤压出来——乳白色的液体带着浓烈的雄性气息...",
            "精液量相当丰沛，一股一股地喷溅，榨精器持续工作了十几分钟..."
        ];
        let lineIndex = 0;
        function showNext() {
            if (lineIndex < story.length) {
                print("<br>"); print(`<span style="color: #ff88cc;">${story[lineIndex]}</span>`);
                lineIndex++; showNextBtn(showNext);
            } else {
                hideNextBtn();
                const semen = createItemFromTemplate('knight_semen');
                if (semen) {
                    gameState.player.inventory.push(semen);
                    print(`<span style="color: #aaffaa;">获得了「${semen.name}」！</span>`);
                }
                showInventoryPanel();
            }
        }
        showNext();
    } else {
        print(`目前无法对${npc.name}进行榨精。`);
    }
}