// ============================================================
//  game/portals.js - 传送门统一定义与处理
//  所有不可拾取、仅做场景传送的物品在此统一定义
// ============================================================

// 传送门定义（传送目标、文字、条件）
const PORTAL_DEFS = {
    // === 楼梯类（宅邸）===
    spiral_stairs_north:      { targetRoom: "second_floor_north",   travelText: "你踏上旋转楼梯，缓缓向上走去..." },
    spiral_stairs_north_2f:   { targetRoom: "corridor_north_2",     travelText: "你踏上旋转楼梯，缓缓向下走去..." },
    spiral_stairs_south:      { targetRoom: "second_floor_4",       travelText: "你踏上旋转楼梯，缓缓向上走去..." },
    spiral_stairs_south_2f:   { targetRoom: "corridor_south_2",     travelText: "你踏上旋转楼梯，缓缓向下走去..." },
    stairs_to_third_floor:    { targetRoom: "third_floor_center",   travelText: "你踏上旋转楼梯，缓缓向上走去..." },
    stairs_to_second_floor:   { targetRoom: "second_floor_4",       travelText: "你踏上旋转楼梯，缓缓向下走去..." },
    stairs_to_cellar:         { targetRoom: "cellar_southeast",     travelText: "你踏下石阶，走入地下酒窖..." },
    stairs_from_cellar:       { targetRoom: "corridor_south_2",     travelText: "你踏上石阶，回到了宅邸一层..." },
    stairs_to_hut_floor2:     { targetRoom: "hut_floor2",           travelText: "你踏上木质楼梯，吱呀作响..." },
    stairs_to_hut_floor1:     { targetRoom: "hut_floor1",           travelText: "你走下楼梯，回到木屋一层..." },
    ladder_to_attic:          { targetRoom: "attic",                travelText: "你爬上木梯，来到阁楼..." },
    ladder_from_attic:        { targetRoom: "third_floor_north",    travelText: "你爬下木梯，回到三层走廊..." },
    basement_ladder_up:       { targetRoom: "forest_4_center",      travelText: "你顺着木梯爬回森林..." },

    // === 矿井木梯（地表↔地下）===
    ladder_surface:           { targetRoom: "tunnel_exit",          travelText: "你顺着木梯爬下矿道..." },
    ladder_1:                 { targetRoom: "mine_exit_1",          travelText: "你爬上木梯，推开头顶的石板..." },
    ladder_mine_exit_1:       { targetRoom: "tunnel_exit_1",        travelText: "你顺着木梯爬下矿道..." },
    ladder_3:                 { targetRoom: "mine_exit_3",          travelText: "你爬上木梯，推开头顶的石板..." },
    ladder_mine_exit_3:       { targetRoom: "tunnel_exit_3",        travelText: "你顺着木梯爬下矿道..." },

    // === 木梯（二号矿道出口→地表，需检查监工）===
    // ladder 特殊处理，见 usePortal() 中的 supervisor_stone_check

    // === 入口类 ===
    wooden_hut:               { targetRoom: "hut_floor1",           travelText: "你推开木门，陈旧的木头气味扑面而来..." },
    hut_door:                 { targetRoom: "cliff",                travelText: "你推开门，清新的空气扑面而来..." },
    slum_hut:                 { targetRoom: "slum_hut_inside",      travelText: "你掀开破布门帘，猫腰钻进了低矮的窝棚..." },
    slum_trapdoor:            { targetRoom: "slum_tunnel",          travelText: "你掀开地板下的活板门，跳进了黑暗的地道..." },
    slum_trapdoor_exit:       { targetRoom: "slum_hut_inside",      travelText: "你推开头顶的活板门，爬回了窝棚..." },
    iron_gate:                { targetRoom: "dark_hall",            travelText: "你插入刻有骷髅的钥匙，沉重的大铁门发出一声低沉的闷响，缓缓开启...",
                                requiresKey: "skull_key",            keyFailMsg: "大铁门纹丝不动，中央的骷髅锁孔仿佛在无声地冷笑。你需要刻有骷髅的钥匙。" },
    peasant_hut_1:            { targetRoom: "peasant_hut_1_inside", travelText: "你掀开破布门帘，猫腰钻进了低矮的窝棚..." },
    peasant_hut_2:            { targetRoom: "peasant_hut_2_inside", travelText: "你掀开破布门帘，猫腰钻进了低矮的窝棚..." },
    peasant_hut_3:            { targetRoom: "peasant_hut_3_inside", travelText: "你掀开破布门帘，猫腰钻进了低矮的窝棚..." },
    peasant_hut_4:            { targetRoom: "peasant_hut_4_inside", travelText: "你掀开破布门帘，猫腰钻进了低矮的窝棚..." },

    // === 需要钥匙的传送门 ===
    side_gate_door:           { targetRoom: "forest_start",         travelText: "你使用矿场侧门钥匙打开了铁门...门后是一条通往森林的小路。",
                                 requiresKey: "mine_side_key",       keyFailMsg: "侧门被牢牢锁住。你需要矿场侧门钥匙。" },
    mansion_gate_door:        { targetRoom: "mansion_front_yard",   travelText: "你使用伯爵宅邸钥匙打开了沉重的大门...宅邸内部的庭院展现在眼前。",
                                 requiresKey: "mansion_key",         keyFailMsg: "大门被牢牢锁住。你需要伯爵宅邸钥匙。" },

    // === 洞穴/地道入口 ===
    tunnel_entrance:          { targetRoom: "basement",             travelText: "你小心翼翼地钻进了地道..." },
};

// 使用传送门（统一入口，取代原来30+个else-if分支）
function usePortal(portalId) {
    const portalDef = PORTAL_DEFS[portalId];
    if (!portalDef) {
        print(`<span style="color: #ff6666;">该传送门未定义: ${portalId}</span>`);
        return;
    }

    // 1. 钥匙检查
    if (portalDef.requiresKey) {
        const hasKey = gameState.player.inventory.some(item => item && item.id === portalDef.requiresKey);
        if (!hasKey) {
            print("");
            print(`<span style="color: #ffaa66;">═══════════════════════════</span>`);
            print(`<span style="color: #ffaa66;">${portalDef.keyFailMsg}</span>`);
            print(`<span style="color: #ffaa66;">═══════════════════════════</span>`);
            return;
        }
    }

    // 2. 特殊处理：二号矿道出口的木梯（需要监工检查）
    if (portalId === 'ladder') {
        useSupervisorLadder();
        return;
    }

    // 3. 标准传送
    clearDetailPanel();
    currentPanel = null;
    print("");

    if (portalDef.travelText) {
        print(`<span style="color: ${portalDef.requiresKey ? '#aaffaa' : '#cc9966'};">${portalDef.travelText}</span>`);
        print("");
    }

    // 显示遮罩（有文本时）
    if (portalDef.travelText && portalDef.travelText.length > 20) {
        UI.setOverlay(true);
    }

    const delay = portalDef.travelText ? (portalDef.travelText.length > 20 ? 1500 : 800) : 0;

    setTimeout(() => {
        gameState.player.location = portalDef.targetRoom;

        if (UI.elements.overlay && UI.elements.overlay.classList.contains('active')) {
            UI.setOverlay(false);
        }

        // 传送后触发剧情检查
        if (typeof StoryEngine !== 'undefined' && StoryEngine.loaded) {
            StoryEngine.check();
        }

        look();
        updateMinimap();
        updateSceneInfo();
    }, delay);
}

// 监工木梯（特殊逻辑：需要99块石块）
function useSupervisorLadder() {
    const room = gameState.world[gameState.player.location];
    const hasSupervisor = room.npcs && room.npcs.includes('mine_supervisor');

    clearDetailPanel();
    currentPanel = null;
    print("");

    if (hasSupervisor) {
        const stoneCount = gameState.player.inventory.filter(item => item.id === 'stone').length;
        if (stoneCount < 99) {
            print(`<span style="color: #ff6666;">监工拦住了你：「石块不够！九十九块，一块都不能少！」</span>`);
            print(`<span style="color: #aaa;">你目前有 ${stoneCount} 块石块，还需要 ${99 - stoneCount} 块。</span>`);
            return;
        }

        // 消耗99个石块
        let removed = 0;
        gameState.player.inventory = gameState.player.inventory.filter(item => {
            if (item.id === 'stone' && removed < 99) {
                removed++;
                return false;
            }
            return true;
        });

        print(`你将 ${removed} 块石块交给监工。`);
        print(`<span style="color: #aaffaa;">监工挥了挥手：「滚吧，别让我再看见你。」</span>`);

        // 移除监工
        const supervisorIndex = room.npcs.indexOf('mine_supervisor');
        if (supervisorIndex > -1) {
            room.npcs.splice(supervisorIndex, 1);
        }
    }

    print("你爬上木梯，推开头顶的石板...");
    print("");

    setTimeout(() => {
        gameState.player.location = 'mine_exit';
        look();
        updateMinimap();
        updateSceneInfo();
    }, 1500);
}

// ★ 离开教堂门廊 → 教堂大门（正门出口）
function leaveChurchToGate() {
    clearDetailPanel();
    currentPanel = null;
    print("");
    UI.setOverlay(true);
    print(`<span style="color: #ddbb88;">你推开教堂厚重的橡木大门，走出教堂...</span>`);
    setTimeout(() => {
        gameState.player.location = 'church_gate';
        UI.setOverlay(false);
        look();
        updateMinimap();
        updateSceneInfo();
    }, 1200);
}

// ★ 离开教堂圣坛 → 后门
function leaveChurchToBackDoor() {
    clearDetailPanel();
    currentPanel = null;
    print("");
    UI.setOverlay(true);
    print(`<span style="color: #ddbb88;">你推开圣坛后方的窄门，走了出去...</span>`);
    setTimeout(() => {
        gameState.player.location = 'church_back_door';
        UI.setOverlay(false);
        look();
        updateMinimap();
        updateSceneInfo();
    }, 1200);
}

// ★ 从后门进入教堂圣坛
function enterChurchAltar() {
    clearDetailPanel();
    currentPanel = null;
    print("");
    UI.setOverlay(true);
    print(`<span style="color: #ddbb88;">你推开厚重的木门，走入教堂深处...</span>`);
    setTimeout(() => {
        gameState.player.location = 'church_altar';
        UI.setOverlay(false);
        look();
        updateMinimap();
        updateSceneInfo();
    }, 1200);
}

// ★ 进入教堂门廊
function enterChurchPorch() {
    clearDetailPanel();
    currentPanel = null;
    print("");
    UI.setOverlay(true);
    print(`<span style="color: #ddbb88;">你推开厚重的橡木门，门轴发出低沉的吱呀声...</span>`);
    setTimeout(() => {
        gameState.player.location = 'church_porch';
        UI.setOverlay(false);
        look();
        updateMinimap();
        updateSceneInfo();
    }, 1200);
}

// 撤走的梯子（四号矿道出口↔四号矿井口双向，不消耗）
function useRemovedLadder() {
    const currentLoc = gameState.player.location;

    if (currentLoc !== 'tunnel_exit_4' && currentLoc !== 'mine_exit_4') {
        print(`<span style="color: #ffaa66;">这里无法使用撤走的梯子。</span>`);
        print(`<span style="color: #888;">（这架梯子只能在四号矿道出口或四号矿井口使用...）</span>`);
        return;
    }

    clearDetailPanel();
    currentPanel = null;
    print("");

    UI.setOverlay(true);

    const isGoingUp = currentLoc === 'tunnel_exit_4';
    const targetRoom = isGoingUp ? 'mine_exit_4' : 'tunnel_exit_4';
    const lines = isGoingUp
        ? ["你将撤走的梯子架在岩壁上...", "梯子稳稳地架在岩壁与地面之间。",
           "你顺着梯子向上爬去...", "头顶被封堵的木板被推开，月光洒落进来。"]
        : ["你将撤走的梯子放入被破开的井口...", "梯子稳稳地架在井壁之间。",
           "你顺着梯子向下爬去...", "黑暗和腐臭的气息扑面而来。"];

    print(lines[0]);

    let delay = 1000;
    const lineTimings = [1000, 2300, 3600, 4900];

    for (let i = 1; i < lines.length; i++) {
        setTimeout(() => {
            print(`<span class="story-text">${lines[i]}</span>`);
            if (i === lines.length - 1) {
                setTimeout(() => {
                    gameState.player.location = targetRoom;
                    print("");
                    print(`<span style="color: #aaffaa;">你来到了${isGoingUp ? '四号矿井口' : '四号矿道出口'}...</span>`);

                    UI.setOverlay(false);
                    look();
                    updateMinimap();
                    updateSceneInfo();
                }, delay);
            }
        }, lineTimings[i]);
    }
}