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
    // ladder 特殊处理，见 useSupervisorLadder()

    // === 入口类 ===
    wooden_hut:               { targetRoom: "hut_floor1",           travelText: "你推开木门，陈旧的木头气味扑面而来..." },
    hut_door:                 { targetRoom: "cliff",                travelText: "你推开门，清新的空气扑面而来..." },
    quiet_wooden_hut:         { targetRoom: "quiet_hut_floor1",     travelText: "你推开木门，陈旧的木头气味扑面而来..." },
    quiet_hut_door:           { targetRoom: "quiet_clearing",       travelText: "你推开门，幽静空地的微风迎面吹来..." },
    quiet_stairs_to_hut_floor2:{ targetRoom: "quiet_hut_floor2",    travelText: "你踏上木质楼梯，吱呀作响..." },
    quiet_stairs_to_hut_floor1:{ targetRoom: "quiet_hut_floor1",    travelText: "你走下楼梯，回到木屋一层..." },
    slum_hut:                 { targetRoom: "slum_hut_inside",      travelText: "你掀开破布门帘，猫腰钻进了低矮的窝棚..." },
    slum_trapdoor:            { targetRoom: "slum_tunnel",          travelText: "你掀开地板下的活板门，跳进了黑暗的地道..." },
    slum_trapdoor_exit:       { targetRoom: "slum_hut_inside",      travelText: "你推开头顶的活板门，爬回了窝棚..." },
    castle_gate_door:         { targetRoom: "castle_outer",         travelText: "你推开厚重的大门，伯爵城堡内部的庭院展现在眼前..." },
    castle_gate_door_exit:    { targetRoom: "count_castle_gate",    travelText: "你推开门扉，重新回到了伯爵城堡的大门之外..." },
    castle_spiral_stairs_up:  { targetRoom: "castle_2f_corridor_1", travelText: "你踏上旋转楼梯，缓缓向城堡二层走去..." },
    castle_spiral_stairs_down:{ targetRoom: "castle_corridor_2",    travelText: "你踏下旋转楼梯，回到了一楼的走廊..." },
    castle_spiral_stairs_2up: { targetRoom: "castle_3f_corridor_1", travelText: "你踏上旋转楼梯，继续向城堡三层走去..." },
    castle_spiral_stairs_3down:{ targetRoom: "castle_2f_corridor_1", travelText: "你踏下旋转楼梯，回到了二层的走廊..." },
    castle_rooftop_stairs_up:  { targetRoom: "castle_rooftop",       travelText: "你沿着狭窄的石梯向上，风从石缝里灌进来..." },
    castle_rooftop_stairs_down:{ targetRoom: "castle_3f_corridor_1", travelText: "你踏下石梯，回到了三楼的走廊..." },
    dungeon_door:             { targetRoom: "dungeon",              travelText: "你用冰冷的钥匙转动锁孔，地牢门缓缓打开，阴冷潮湿的气息扑面而来...",
                                requiresKey: "dungeon_key",          keyFailMsg: "地牢门纹丝不动。它的锁孔沉沉地注视着你，你需要一把地牢钥匙。" },
    dungeon_exit:             { targetRoom: "dungeon_entrance",     travelText: "你踏着潮湿的石阶向上，重新回到了地牢入口..." },
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

// 所有通道均交给 relocateTo 即时切换，钥匙和守卫条件仍在入口处检查。
function usePortal(portalId) {
    if (portalId === 'ladder') return useSupervisorLadder();
    const portalDef = PORTAL_DEFS[portalId];
    if (!portalDef) { print(`该传送门未定义: ${portalId}`); return false; }
    if (battleState.inBattle) { print('战斗中无法使用传送通道。'); return false; }
    if (portalDef.requiresKey && !gameState.player.inventory.some(item => item && item.id === portalDef.requiresKey)) {
        print(`<span style="color: #ffaa66;">${portalDef.keyFailMsg}</span>`);
        return false;
    }
    const guardedRooms = { castle_gate_door: 'count_castle_gate', dungeon_door: 'dungeon_entrance' };
    const guardRoom = guardedRooms[portalId];
    if (guardRoom && typeof hasAliveGuardsInRoom === 'function' && hasAliveGuardsInRoom(guardRoom)) {
        print('卫兵挡在门前，必须先解决此处的卫兵才能使用这扇门。');
        return false;
    }
    return relocateTo(portalDef.targetRoom, { travelText: portalDef.travelText });
}

// 和平放行：仅扣除一次100块石块，监工仍然留在原地。
function handInSupervisorStones() {
    if (battleState.inBattle) {
        print(`<span style="color: #ffaaaa;">战斗中无法上交石块。</span>`);
        return false;
    }
    const room = gameState.world[gameState.player.location];
    if (gameState.player.location !== 'tunnel_exit' || !room?.npcs?.includes('mine_supervisor')) {
        print("这里没有可以接收石块的监工。");
        return false;
    }
    if (gameState.gameFlags.mineSupervisorPaid) {
        print("你已经交齐石块，监工不会再阻拦你。");
        return true;
    }
    const isStone = item => item && (item.templateId || item.id) === 'stone';
    const stoneCount = gameState.player.inventory.filter(isStone).length;
    if (stoneCount < 100) {
        print(`<span style="color: #ff6666;">监工拦住了你：「石块不够！一百块，一块都不能少！」</span>`);
        print(`<span style="color: #aaa;">你目前有 ${stoneCount} 块石块，还需要 ${100 - stoneCount} 块。</span>`);
        return false;
    }
    let removed = 0;
    gameState.player.inventory = gameState.player.inventory.filter(item => {
        if (isStone(item) && removed < 100) {
            removed++;
            return false;
        }
        return true;
    });
    gameState.gameFlags.mineSupervisorPaid = true;
    print("你将100块石块交给监工。");
    print(`<span style="color: #aaffaa;">监工用靴尖拨了拨石堆，数完才把铁棍挪开：「够数了。滚，别在这儿碍眼。」</span>`);
    updateSceneInfo();
    if (currentPanel === 'npc_detail' && currentDetailNPC === 'mine_supervisor') showNPCInfo('mine_supervisor');
    return true;
}

function useSupervisorLadder() {
    if (battleState.inBattle) { print('战斗中无法使用木梯。'); return false; }
    if (gameState.player.location !== 'tunnel_exit') { print('这里无法使用二号矿道出口的木梯。'); return false; }
    const room = gameState.world.tunnel_exit;
    if (room.npcs?.includes('mine_supervisor') && !gameState.gameFlags.mineSupervisorPaid && !handInSupervisorStones()) return false;
    return relocateTo('mine_exit', { travelText: '你爬上木梯，推开石板，来到二号矿井口。' });
}

function leaveChurchToGate() {
    return relocateTo('church_gate', { travelText: '你推开橡木大门，走出教堂。' });
}

function leaveChurchToBackDoor() {
    return relocateTo('church_back_door', { travelText: '你推开圣坛后方的窄门，走出教堂。' });
}

function enterSanghuashanMine() {
    return relocateTo('mountain_path_13', { travelText: '你沿着熟悉的小路，折返桑华山矿场。' });
}

function enterChurchAltar() {
    return relocateTo('church_altar', { travelText: '你推开后门，走进教堂圣坛。' });
}

function enterChurchPorch() {
    return relocateTo('church_porch', { travelText: '你推开橡木大门，踏入教堂门廊。' });
}

function useRemovedLadder(itemId) {
    if (battleState.inBattle) { print('战斗中无法使用梯子。'); return false; }
    const ladder = gameState.player.inventory.find(item =>
        (!itemId || item.id === itemId) && itemTemplateId(item) === 'removed_ladder');
    if (!ladder) { print('你需要先将撤走的梯子拾取到背包中。'); return false; }
    const loc = gameState.player.location;
    if (loc !== 'tunnel_exit_4' && loc !== 'mine_exit_4') {
        print('这架梯子只能在四号矿道出口或四号矿井口使用。');
        return false;
    }
    const up = loc === 'tunnel_exit_4';
    return relocateTo(up ? 'mine_exit_4' : 'tunnel_exit_4', {
        travelText: up ? '你架好梯子爬出井口，来到四号矿井口。' : '你架好梯子爬下井口，回到四号矿道出口。'
    });
}
