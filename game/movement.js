// ============================================================
//  game/movement.js - 移动逻辑
//  方向移动、通行条件检查、场景切换触发
// ============================================================

function move(direction) {
    const currentLoc = gameState.player.location;
    const room = gameState.world[currentLoc];
    if (!room) return;

    const dirMap = {
        'n': 'north', 's': 'south', 'e': 'east', 'w': 'west',
        'north': 'north', 'south': 'south', 'east': 'east', 'west': 'west'
    };
    const fullDir = dirMap[direction];
    if (!fullDir) {
        print(`无效的方向: ${direction}`);
        return;
    }

    const targetRoomId = room.exits[fullDir];
    if (!targetRoomId) {
        print(`那边没有路。`);
        return;
    }
    if (!gameState.world[targetRoomId]) {
        print(`目标房间数据错误。`);
        return;
    }

    // 通行条件检查
    if (!checkPassCondition(targetRoomId)) return;

    // 执行移动
    gameState.player.location = targetRoomId;
    const dirChinese = { north: '北', south: '南', east: '东', west: '西' };
    print(`你向${dirChinese[fullDir]}方走去……`);

    // 结局检查
    if (targetRoomId === 'mountain_path_14') {
        if (!gameState.gameFlags) gameState.gameFlags = {};
        if (!gameState.gameFlags.endingPlayed) {
            StoryEngine.check();
            return;
        }
    }

    look();
    updateMinimap();
    updateSceneInfo();

    // 发狂敌人主动攻击检查
    checkHostileNPCs(targetRoomId);

    // 剧情引擎检查
    StoryEngine.check();
}

// 通行条件检查
function checkPassCondition(targetRoomId) {
    // 矿场大门通行检查
    if (targetRoomId === 'mine_gate') {
        const stoneRoad12 = gameState.world['stone_road_12'];
        const hasKnightsAlive = stoneRoad12 && stoneRoad12.npcs && stoneRoad12.npcs.includes('apprentice_knight');
        const hasGateKey = gameState.player.inventory.some(item => item && item.id === 'mine_gate_key');

        if (hasKnightsAlive) {
            print("");
            print(`<span style="color: #ffaa66;">═══════════════════════════</span>`);
            print(`<span style="color: #ffaa66;">见习骑士拦住了你的去路。</span>`);
            print(`<span style="color: #888;">「站住！未经许可不得通过矿场大门！」</span>`);
            print(`<span style="color: #888;">${hasGateKey ? '「就算你有钥匙也不行！没有骑士团的命令，谁都不能通过！」' : '（需要击败守门的见习骑士并取得矿场大门钥匙才能通行...）'}</span>`);
            print(`<span style="color: #ffaa66;">═══════════════════════</span>`);
            return false;
        }

        if (!hasGateKey) {
            print("");
            print(`<span style="color: #ffaa66;">═══════════════════════════</span>`);
            print(`<span style="color: #ffaa66;">矿场大门紧锁着。</span>`);
            print(`<span style="color: #888;">守门的骑士虽然已经不在了，但大门上还挂着一把沉重的铁锁。</span>`);
            print(`<span style="color: #666;">（你需要矿场大门钥匙才能打开大门...）</span>`);
            print(`<span style="color: #ffaa66;">═══════════════════════</span>`);
            return false;
        }
    }

    // 伯爵宅邸大门通行检查
    if (targetRoomId === 'mansion_gate') {
        const hasMansionKey = gameState.player.inventory.some(item => item && item.id === 'mansion_key');
        if (!hasMansionKey) {
            print("");
            print(`<span style="color: #ffaa66;">═══════════════════════════</span>`);
            print(`<span style="color: #ffaa66;">伯爵宅邸的大门紧闭着。</span>`);
            print(`<span style="color: #888;">沉重的橡木大门上挂着一把巨大的铁锁。</span>`);
            print(`<span style="color: #666;">（你需要伯爵宅邸钥匙才能进入...）</span>`);
            print(`<span style="color: #ffaa66;">═══════════════════════</span>`);
            return false;
        }
    }

    return true;
}

// 发狂敌人主动攻击
function checkHostileNPCs(roomId) {
    const newRoom = gameState.world[roomId];
    if (!newRoom || !newRoom.npcs) return;

    const hostileNPCs = newRoom.npcs.filter(npcId => npcId === 'mad_miner' || npcId === 'mad_supervisor');
    if (hostileNPCs.length === 0) return;

    UI.setOverlay(true);

    setTimeout(() => {
        print("");
        const madMiners = hostileNPCs.filter(id => id === 'mad_miner');
        const madSupervisors = hostileNPCs.filter(id => id === 'mad_supervisor');

        let msg = '';
        if (madMiners.length > 0 && madSupervisors.length > 0) {
            msg = `${madMiners.length}个发狂矿工和${madSupervisors.length}个发狂监工发现了你，发出野兽般的嘶吼，挥舞着武器冲了上来！`;
        } else if (madSupervisors.length > 0) {
            msg = madSupervisors.length === 1 ? '发狂的监工发现了你...' : `${madSupervisors.length}个发狂的监工发现了你...`;
        } else {
            msg = madMiners.length === 1 ? '发狂矿工发现了你...' : `${madMiners.length}个发狂矿工发现了你...`;
        }
        print(`<span style="color: #ff6666;">${msg}</span>`);
        startMultiBattle(hostileNPCs);
    }, 800);
}

// 从按钮/小地图移动（先关闭面板）
function moveByButton(direction) {
    if (currentPanel !== null) {
        closeCurrentPanel();
        setTimeout(() => move(direction), 50);
    } else {
        move(direction);
    }
}

// 关闭当前面板
function closeCurrentPanel() {
    if (currentPanel === 'inventory' || currentPanel === 'equipment' || currentPanel === 'status') {
        if (mainContent) { UI.setOutputHtml(mainContent); }
    } else if (currentPanel === 'quests') {
        UI.clearDetail();
    } else if (currentPanel === 'detail') {
        if (detailContent) { UI.setOutputHtml(detailContent); }
    } else if (currentPanel === 'ground_item') {
        if (groundItemReturnTarget) { UI.setOutputHtml(groundItemReturnTarget); }
    } else if (currentPanel === 'npc_detail') {
        if (mainContent) { UI.setOutputHtml(mainContent); }
    }
    currentPanel = null;
    detailContent = '';
    updateSceneInfo();
}