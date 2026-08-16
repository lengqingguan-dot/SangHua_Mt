// ============================================================
//  game/sceneItems.js - 场景物品详情与交互
// ============================================================

const GROUND_ITEM_ACTIONS = [
    { match(itemId, item) { return itemId === 'bounty_board'; }, actions(itemId, item, html) { html.push(`<div><span style="color: #cc9966; text-decoration: underline; cursor: pointer;" onclick="showBountyBoard()">📜 查看悬赏</span></div>`); }, earlyReturn: true },
    { match(itemId, item) { return itemId === 'dungeon_door' || itemId === 'dungeon_exit'; }, actions(itemId, item, html) { html.push(`<div><span style="color: #cc9966; text-decoration: underline; cursor: pointer;" onclick="usePortal('${itemId}')">🚪 进入</span></div>`); }, earlyReturn: true },
    { match(itemId, item) { return itemId === 'dungeon_straw_mat_special'; }, actions(itemId, item, html) { html.push(`<div><span style="color: #cc9966; text-decoration: underline; cursor: pointer;" onclick="liftDungeonStrawMat('${itemId}')">🧹 掀开</span></div>`); }, earlyReturn: true },
    { match(itemId, item) { return itemId === 'strange_mound'; }, actions(itemId, item, html) { html.push(`<div><span style="color: #cc9966; text-decoration: underline; cursor: pointer;" onclick="digStrangeMound('${itemId}')">⛏️ 挖开</span></div>`); }, earlyReturn: true },
    { match(itemId, item) { return itemId === 'working_peasants'; }, actions(itemId, item, html) { html.push(`<div><span style="color: #cc9966; text-decoration: underline; cursor: pointer;" onclick="observeWorkingPeasants('${itemId}')">👀 观察</span></div>`); }, earlyReturn: true },
    { match(itemId, item) { return itemId === 'working_serfs'; }, actions(itemId, item, html) { html.push(`<div><span style="color: #cc9966; text-decoration: underline; cursor: pointer;" onclick="observeWorkingSerfs('${itemId}')">👀 观察</span></div>`); }, earlyReturn: true },
    { match(itemId, item) { return itemId === 'randolph_family_banner'; }, actions(itemId, item, html) { html.push(`<div><span style="color: #ff6666; text-decoration: underline; cursor: pointer;" onclick="breakRandolphBanner('${itemId}')">⚔️ 折断</span></div>`); }, earlyReturn: true },
    { match(itemId, item) { return itemId === 'flag_base'; }, actions(itemId, item, html) { html.push(`<div><span style="color: #ff6666; text-decoration: underline; cursor: pointer;" onclick="plantRedFlag('${itemId}')">🚩 插入旗帜</span></div>`); }, earlyReturn: true },
    { match(itemId, item) { return !!PORTAL_DEFS[itemId]; }, actions(itemId, item, html) { html.push(`<div><span style="color: #cc9966; text-decoration: underline; cursor: pointer;" onclick="usePortal('${itemId}')">🪜 使用</span></div>`); } },
    { match(itemId, item) { return itemId === 'ladder'; }, actions(itemId, item, html) { html.push(`<div><span style="color: #cc9966; text-decoration: underline; cursor: pointer;" onclick="useSupervisorLadder()">🪜 使用木梯</span></div>`); } },
    { match(itemId, item) { return itemId === 'removed_ladder' || (itemId.includes('removed_ladder') && itemId.includes('_dropped_')); }, actions(itemId, item, html) { html.push(`<div><span style="color: #aaffaa; text-decoration: underline; cursor: pointer;" onclick="useRemovedLadder('${itemId}')">🪜 使用</span></div>`); html.push(`<div><span style="color: #aaffaa; text-decoration: underline; cursor: pointer;" onclick="pickupItem('${itemId}')">📦 拾取</span></div>`); } },
    { match(itemId, item) { return itemId === 'iron_lock'; }, actions(itemId, item, html) { const hasKey = gameState.player.inventory.some(invItem => invItem && invItem.id === 'mine_exit_4_key'); if (hasKey) html.push(`<div><span style="color: #aaffaa; text-decoration: underline; cursor: pointer;" onclick="openIronLockWithKey('${itemId}')">🔑 使用四号矿井口钥匙</span></div>`); html.push(`<div><span style="color: #ffaa66; text-decoration: underline; cursor: pointer;" onclick="breakLock('${itemId}')">⚔️ 破坏铁锁</span></div>`); } },
    { match(itemId, item) { return itemId === 'heavy_wooden_door'; }, actions(itemId, item, html) { html.push(`<div><span style="color: #ffaa66; text-decoration: underline; cursor: pointer;" onclick="breakDoor('${itemId}', 'heavy')">⚔️ 强行破门</span></div>`); } },
    { match(itemId, item) { return itemId.includes('medium_wooden_door'); }, actions(itemId, item, html) { html.push(`<div><span style="color: #ffaa66; text-decoration: underline; cursor: pointer;" onclick="breakDoor('${itemId}', 'medium')">⚔️ 强行破门</span></div>`); } },
    { match(itemId, item) { return itemId === 'randolph_statue'; }, actions(itemId, item, html) { html.push(`<div><span style="color: #ff6666; text-decoration: underline; cursor: pointer;" onclick="pushStatue('${itemId}')">💪 推倒雕像</span></div>`); } },
    { match(itemId, item) { return itemId.includes('statue_base'); }, actions(itemId, item, html) { html.push(`<div><span style="color: #ffaa66; text-decoration: underline; cursor: pointer;" onclick="rebuildStatue('${itemId}')">🔨 重建雕像</span></div>`); } },
    { match(itemId, item) { return itemId === 'stove'; }, actions(itemId, item, html) { html.push(`<div><span style="color: #ff8844; text-decoration: underline; cursor: pointer;" onclick="useStove('${itemId}')">🍳 烹饪</span></div>`); }, earlyReturn: true },
    { match(itemId, item) { return itemId === 'workbench'; }, actions(itemId, item, html) { html.push(`<div><span style="color: #88ccff; text-decoration: underline; cursor: pointer;" onclick="useWorkbench('${itemId}')">🔨 锻造</span></div>`); }, earlyReturn: true },
    { match(itemId, item) { return itemId === 'milker'; }, actions(itemId, item, html) { html.push(`<div><span style="color: #ffddaa; text-decoration: underline; cursor: pointer;" onclick="useMilker('${itemId}')">🥛 榨奶</span></div>`); }, earlyReturn: true },
    { match(itemId, item) { return itemId === 'dynamite'; }, actions(itemId, item, html) { html.push(`<div><span style="color: #ff4444; text-decoration: underline; cursor: pointer;" onclick="useDynamite('${itemId}')">💥 使用雷管</span></div>`); }, earlyReturn: true },
    { match(itemId, item) { return itemId === 'leaf_pile'; }, actions(itemId, item, html) { html.push(`<div><span style="color: #aaffaa; text-decoration: underline; cursor: pointer;" onclick="sweepLeafPile()">🍃 扫开落叶</span></div>`); }, earlyReturn: true },
    { match(itemId, item) { return itemId === 'tunnel_entrance'; }, actions(itemId, item, html) { html.push(`<div><span style="color: #aaffaa; text-decoration: underline; cursor: pointer;" onclick="enterTunnel()">🕳️ 进入地道</span></div>`); }, earlyReturn: true },
    { match(itemId, item) { return itemId === 'teleport_circle' || itemId === 'mod_teleport_circle'; }, actions(itemId, item, html) { html.push(`<div><span style="color: #6688ff; text-decoration: underline; cursor: pointer;" onclick="useTeleportCircle('${itemId}')">🌀 查看传送阵</span></div>`); }, earlyReturn: true },
    { match(itemId, item) { return itemId === 'wardrobe'; }, actions(itemId, item, html) { html.push(`<div><span style="color: #aaccff; text-decoration: underline; cursor: pointer;" onclick="searchWardrobe('${itemId}')">🔍 翻找</span></div>`); }, earlyReturn: true },
    { match(itemId, item) { return itemId.includes('mine_pit'); }, actions(itemId, item, html) { html.push(`<div><span style="color: #ff8844; text-decoration: underline; cursor: pointer;" onclick="enterMinePit('${itemId}')">🕳️ 跳下矿坑</span></div>`); }, earlyReturn: true },
    { match(itemId, item) { return itemId === 'stone_wall'; }, actions(itemId, item, html) { html.push(`<div><span style="color: #ffaa66; text-decoration: underline; cursor: pointer;" onclick="mineStoneWall('${itemId}')">⛏️ 挖掘</span></div>`); } },
    { match(itemId, item) { return itemId === 'karen_church_door'; }, actions(itemId, item, html) { if (gameState.player.location === 'church_porch') { html.push(`<div><span style="color: #aaffaa; text-decoration: underline; cursor: pointer;" onclick="leaveChurchToGate()">🚪 离开教堂</span></div>`); } else { html.push(`<div><span style="color: #aaffaa; text-decoration: underline; cursor: pointer;" onclick="enterChurchPorch()">🚪 进入教堂</span></div>`); } }, earlyReturn: true },
    { match(itemId, item) { return itemId === 'karen_church_back_door'; }, actions(itemId, item, html) { if (gameState.player.location === 'church_back_door') { html.push(`<div><span style="color: #aaffaa; text-decoration: underline; cursor: pointer;" onclick="enterChurchAltar()">🚪 进入教堂</span></div>`); } else { html.push(`<div><span style="color: #aaffaa; text-decoration: underline; cursor: pointer;" onclick="leaveChurchToBackDoor()">🚪 离开教堂</span></div>`); } }, earlyReturn: true },
    { match(itemId, item) { return itemId === 'karen_town'; }, actions(itemId, item, html) { html.push(`<div><span style="color: #aaffaa; text-decoration: underline; cursor: pointer;" onclick="StoryEngine.triggerUseItem('${itemId}')">🚶 进入</span></div>`); }, earlyReturn: true },
    { match(itemId, item) { return itemId === 'sanghuashan_mine'; }, actions(itemId, item, html) { html.push(`<div><span style="color: #ff8844; text-decoration: underline; cursor: pointer;" onclick="enterSanghuashanMine()">🚶 进入</span></div>`); }, earlyReturn: true },
    { match(itemId, item) { return itemId.includes('corpse'); }, actions(itemId, item, html) { if (item.corpseStory || item.usable) html.push(`<div><span style="color: #ff66aa; text-decoration: underline; cursor: pointer;" onclick="useCorpseOnGround('${itemId}')">🔞 互动</span></div>`); if (item.loot && item.loot.length > 0) html.push(`<div><span style="color: #ffdd44; text-decoration: underline; cursor: pointer;" onclick="lootCorpse('${itemId}')">✨ 搜刮</span></div>`); if (item.dismemberable) html.push(`<div><span style="color: #ff6b6b; text-decoration: underline; cursor: pointer;" onclick="dismemberItem('${itemId}')">🔪 肢解</span></div>`); if (!item.notPickable) { html.push(`<div><span style="color: #aaffaa; text-decoration: underline; cursor: pointer;" onclick="pickupItem('${itemId}')">📦 拾取</span></div>`); const sameCount = countSameItemsOnGround(item); if (sameCount > 1) html.push(`<div><span style="color: #aaffaa; text-decoration: underline; cursor: pointer;" onclick="pickupAllSameItems('${itemId}')">📥 全部拾取(${sameCount}个)</span></div>`); } } }
];

// 挖开墓地中怪异的小土堆：播放剧情，获得「抄写员的手稿」
function digStrangeMound(itemId) {
    const room = gameState.world[gameState.player.location];
    if (!room || !room.items || !room.items.includes(itemId)) { print("土堆已不存在。"); return; }

    clearDetailPanel(); currentPanel = null;

    StoryEngine.playLines({
        lines: [
            "枯死的橡树底下，土面还是潮的。没有墓碑，只有一块没刻字的青石压在上面。旁边的野花已经蔫了，花瓣蜷缩成褐色的团。",
            "你蹲下来。土面边缘有一处凹陷，像是被人动过。你拨开浮土，指腹碰到一个硬东西。",
            "油布包裹。用蜡封过，没有纹章。像是一个不想让任何人发现的东西。",
            "你拆开。里面是一叠手稿，边角微卷，字迹工整细密，每一笔都落在格子里。人名，日期，数字，简短的事由。地契没收记录，林地产权变更，新增税目，驻军征粮令的历年对比——全是抄本。",
            "最后一页笔迹明显变了，潦草、急促，像是在赶在什么之前写完：「若你读到这些，我已经不在了。有些事若无人记得，便等于不曾发生。」"
        ],
        color: '#cc9966', useNextBtn: true,
        onComplete: () => {
            const idx = room.items.indexOf(itemId);
            if (idx > -1) room.items.splice(idx, 1);

            const manuscript = createItemFromTemplate('scribe_manuscript');
            if (manuscript) {
                gameState.player.inventory.push(manuscript);
                print(`<span style="color:#aaffaa;">✨ 获得了「${manuscript.name}」。</span>`);
            }
            updateSceneInfo();
            if (typeof StoryEngine !== 'undefined') StoryEngine.check();
        }
    });
}

// 观察劳动的贫民们：记录观察，两个景观都观察后获得旗帜设计图
function observeWorkingPeasants(itemId) {
    if (!gameState.gameFlags) gameState.gameFlags = {};
    gameState.gameFlags.observedPeasants = true;
    _afterObserveLabor(itemId);
}

// 观察劳作的农奴们：记录观察，两个景观都观察后获得旗帜设计图
function observeWorkingSerfs(itemId) {
    if (!gameState.gameFlags) gameState.gameFlags = {};
    gameState.gameFlags.observedSerfs = true;
    _afterObserveLabor(itemId);
}

function _afterObserveLabor(itemId) {
    clearDetailPanel(); currentPanel = null;
    print("");
    if (itemId === 'working_peasants') {
        print(`<span style="color:#cc9966;">贫民们围在破棚前，铁锤一下下敲着，粗麻绳把散架的屋角重新捆牢。那些最不起眼的手，一直在做最不起眼、却又最不能停止的活计。</span>`);
    } else {
        print(`<span style="color:#cc9966;">农奴们躬身在田里，镰刀一茬茬地放倒麦子。他们交得出七成的粮，却未必换得回一顿饱饭。那种沉默的恨，和麦穗一样沉。</span>`);
    }

    if (gameState.gameFlags.observedPeasants && gameState.gameFlags.observedSerfs) {
        const has = gameState.player.inventory.some(i => i && i.id === 'flag_design');
        if (!has) {
            const design = createItemFromTemplate('flag_design');
            if (design) {
                gameState.player.inventory.push(design);
                print(`<span style="color:#aaffaa;">✨ 你从这些劳作的身影中看出了某种轮廓——获得了「${design.name}」。</span>`);
            }
        }
    }
    updateSceneInfo();
    if (typeof StoryEngine !== 'undefined') StoryEngine.check();
}

// 折断兰德尔家族旗帜（伯爵死亡后）
function breakRandolphBanner(itemId) {
    const room = gameState.world[gameState.player.location];
    if (!room || !room.items || !room.items.includes(itemId)) { print("旗帜已不存在。"); return; }

    const countDefeated = (typeof _isNpcDefeated === 'function' ? _isNpcDefeated('count_randolph') : false)
        || (typeof StoryEngine !== 'undefined' ? !StoryEngine._isNpcAliveAnywhere('count_randolph') : true);

    if (!countDefeated) {
        print(`<span style="color:#888;">旗杆纹丝不动。只要兰德尔伯爵还活着，这面山鹰旗便不会倒。</span>`);
        return;
    }

    clearDetailPanel(); currentPanel = null;
    print("");
    print(`<span style="color:#ff6666;">你抓住旗杆，用尽全力一折——</span>`);
    print(`<span style="color:#ff8844;">「咔嚓——」</span>`);
    print(`<span style="color:#aaffaa;">兰德尔家族的山鹰旗断成两截，旗面被风撕开一道长口。</span>`);

    const idx = room.items.indexOf(itemId);
    if (idx > -1) room.items.splice(idx, 1);
    if (!room.items.includes('randolph_family_banner_broken')) {
        room.items.push('randolph_family_banner_broken');
    }
    if (!room.items.includes('flag_base')) {
        room.items.push('flag_base');
    }
    updateSceneInfo();
}

// 将「鲜红的旗帜」插入旗帜基座
function plantRedFlag(itemId) {
    const room = gameState.world[gameState.player.location];
    if (!room || !room.items || !room.items.includes(itemId)) { print("基座已不存在。"); return; }

    const inv = gameState.player.inventory;
    const banner = inv.find(i => i && i.id === 'red_banner');
    if (!banner) { print(`<span style="color:#888;">你的行囊里没有「鲜红的旗帜」可以插入。</span>`); return; }

    clearDetailPanel(); currentPanel = null;
    print("");
    print(`<span style="color:#ff6666;">你将那面鲜红的旗帜插进基座。</span>`);
    print(`<span style="color:#aaffaa;">红底上，金色的镰刀与锤子在风里缓缓展开。</span>`);

    // 消耗旗帜
    const bidx = inv.indexOf(banner);
    if (bidx > -1) inv.splice(bidx, 1);

    // 基座替换为已插旗
    const idx = room.items.indexOf(itemId);
    if (idx > -1) room.items.splice(idx, 1);
    if (!room.items.includes('red_flag_planted')) room.items.push('red_flag_planted');

    if (!gameState.gameFlags) gameState.gameFlags = {};
    gameState.gameFlags.redFlagPlanted = true;

    updateSceneInfo();
    StoryEngine.check();
}

// 掀开地牢中特殊的稻草席：删除席子，露出一扇不起眼的活板门
function liftDungeonStrawMat(itemId) {
    const room = gameState.world[gameState.player.location];
    if (!room || !room.items || !room.items.includes(itemId)) { print("稻草席已不存在。"); return; }

    const idx = room.items.indexOf(itemId);
    if (idx > -1) room.items.splice(idx, 1);

    const trapId = 'dungeon_trapdoor';
    if (!room.items.includes(trapId)) {
        if (!ITEM_TEMPLATES[trapId]) {
            ITEM_TEMPLATES[trapId] = { id: trapId, name: "不起眼的活板门", type: "misc", desc: "稻草席被掀开后，地面露出一扇不起眼的活板门，木板与泥地几乎融为一体，不仔细看很难察觉。", usable: true, customAction: true, notPickable: true };
        }
        room.items.push(trapId);
    }

    clearDetailPanel(); currentPanel = null;
    print("");
    print(`<span style="color:#cc9966;">你将破烂的稻草席掀到一旁……</span>`);
    print(`<span style="color:#aaffaa;">稻草席下露出一扇不起眼的活板门。</span>`);
    updateSceneInfo();
}

function showGroundItemInfo(itemId) {
    const item = getItemInfoById(itemId);
    if (!item) { printToDetail("找不到该物品信息。"); return; }
    let html = makeTitle('物品详情');
    const nameDisplay = getInventoryDisplayName(item);
    html += `名称：${nameDisplay}\n类型：${getItemTypeName(item.type)}\n`;
    if (item.score !== undefined) html += `评分：${item.score}\n`;
    if (item.rarity) html += `品质：${getQualityName(item.rarity)}\n`;
    if (item.desc) { if (item.story || item.milkItem || item.ingredientType || item.dismemberable) { html += `\n<span style="color: #66ff66;">${item.desc}</span>\n`; } else if (item.type === "consumable") { html += `\n<span style="color: #ff6666;">${item.desc}</span>\n`; } else { html += `描述：${item.desc}\n`; } }
    if (item.atk) html += `攻击力：+${item.atk}\n`; if (item.def) html += `防御力：+${item.def}\n`;
    if (item.effect) { if (item.effect === 'heal') html += `效果：恢复 ${item.value} 点生命\n`; else html += `效果：${item.effect}\n`; }
    html += centerLine();
    const actionLines = []; let matched = false; let needsEarlyReturn = false;
    for (const entry of GROUND_ITEM_ACTIONS) { if (entry.match(itemId, item)) { entry.actions(itemId, item, actionLines); matched = true; if (entry.earlyReturn) needsEarlyReturn = true; break; } }
    html += actionLines.join('');
    if (needsEarlyReturn) { html += `<div><span style="color: #aaa; cursor: pointer;" onclick="clearDetailPanel()">↩️ 返回</span></div>`; currentDetailItem = itemId; UI.setDetail(html); currentPanel = 'ground_item'; return; }
    if (!matched && !item.notPickable) { html += `<div><span style="color: #aaffaa; text-decoration: underline; cursor: pointer;" onclick="pickupItem('${itemId}')">✨ 拾取</span></div>`; const sameCount = countSameItemsOnGround(item); if (sameCount > 1) html += `<div><span style="color: #aaffaa; text-decoration: underline; cursor: pointer;" onclick="pickupAllSameItems('${itemId}')">📥 全部拾取(${sameCount}个)</span></div>`; }
    html += `<div><span style="color: #aaa; cursor: pointer;" onclick="clearDetailPanel()">↩️ 返回</span></div>`;
    currentDetailItem = itemId; UI.setDetail(html); currentPanel = 'ground_item';
}

function breakDoor(doorId, doorType) {
    const room = gameState.world[gameState.player.location];
    if (!room || !room.items || !room.items.includes(doorId)) { print("门已不存在。"); return; }
    clearDetailPanel(); currentPanel = null; print("");
    const weapon = gameState.player.equipment.weapon;
    const maxDamage = (gameState.player.atk || 1) + (weapon && weapon.atk ? weapon.atk : 0);
    const requiredDamage = doorType === 'heavy' ? 30 : 20;
    const brokenTemplate = doorType === 'heavy' ? 'broken_wooden_door' : 'broken_medium_door';
    print(`你握紧武器，用力砸向${doorType === 'heavy' ? '厚重的木门' : '紧锁的房门'}...（最大伤害：${maxDamage}）`);
    if (maxDamage >= requiredDamage) { print(`<span style="color: #ff6666;">${doorType === 'heavy' ? '轰——！' : '咔嚓——！'}</span>`); print(`门在你的猛击下碎裂开来！`); const doorIndex = room.items.indexOf(doorId); if (doorIndex > -1) { room.items.splice(doorIndex, 1); const brokenId = `${brokenTemplate}_${Date.now()}`; const broken = createItemFromTemplate(brokenTemplate); if (broken) { broken.id = brokenId; ITEM_TEMPLATES[brokenId] = broken; room.items.push(brokenId); } } print(`<span style="color: #aaffaa;">你成功破坏了房门！</span>`); if (doorType === 'heavy') { room.exits.west = 'corridor_center'; const corridor = gameState.world['corridor_center']; if (corridor) corridor.exits.east = 'mansion_back_door'; } if (doorType === 'medium') handleMediumDoorUnlock(room); updateSceneInfo(); updateMinimap(); print(""); look(); }
    else { print(`<span style="color: #888;">你的攻击只留下一道凹痕...</span>`); print(`<span style="color: #ffaaaa;">（需要${requiredDamage}点伤害）</span>`); }
}

function handleMediumDoorUnlock(room) {
    const loc = gameState.player.location;
    if (loc === 'second_floor_1') { room.exits.east = 'hidden_room_cecilia'; if (!gameState.world['hidden_room_cecilia']) gameState.world['hidden_room_cecilia'] = { name: "隐秘房间", desc: "一个被隐藏的小房间...", exits: { west: 'second_floor_1' }, items: [], npcs: [] }; }
    else if (loc === 'second_floor_3') { room.exits.east = 'secret_storage'; if (!gameState.world['secret_storage']) gameState.world['secret_storage'] = { name: "秘密储藏室", desc: "一间隐秘的储藏室...", exits: { west: 'second_floor_3' }, items: ['healing_potion', 'healing_potion', 'coin', 'coin', 'coin'], npcs: [] }; }
}

// ★ 重建雕像（支线任务5）—— 不含骑士大剑
function rebuildStatue(baseId) {
    const room = gameState.world[gameState.player.location];
    if (!room || !room.items || !room.items.includes(baseId)) { print("底座已不存在。"); return; }
    const questActive = (typeof StoryEngine !== 'undefined') && StoryEngine.activeQuests.includes('quest_statue_rebuild_5_2');
    if (!questActive) { print(`<span style="color:#888;">你看着底座，不知从何下手...</span>`); return; }

    const requiredItems = [
        { id: 'cecilia_head_broken', name: '被玩坏的塞西莉亚的头颅', count: 1 },
        { id: 'cecilia_tongue', name: '塞西莉亚的舌头', count: 1 },
        { id: 'cecilia_foot', name: '塞西莉亚的脚', count: 2 },
        { id: 'isabella_torso', name: '伊莎贝拉的躯干', count: 1 },
        { id: 'isabella_breast', name: '伊莎贝拉的乳房', count: 2 },
        { id: 'isabella_head', name: '伊莎贝拉的头颅', count: 1 },
        { id: 'elena_leg', name: '艾莲娜的腿', count: 2 },
        { id: 'elena_foot', name: '艾莲娜的脚', count: 2 },
        { id: 'isabella_arm', name: '伊莎贝拉的手臂', count: 2 },
        { id: 'isabella_hand', name: '伊莎贝拉的手', count: 2 },
        { id: 'black_high_heels', name: '黑色高跟鞋',count:1},
        { id: 'black_stockings', name: '黑丝',count:1},
    ];

    const missing = [];
    requiredItems.forEach(req => {
        const hasCount = gameState.player.inventory.filter(i => { if (!i?.id) return false; return i.id === req.id || i.id.startsWith(req.id + '_'); }).length;
        if (hasCount < req.count) missing.push(`${req.name}×${req.count}(仅${hasCount}个)`);
    });
    if (missing.length > 0) { print(`<span style="color:#ff6666;">材料不足！缺少：${missing.join('、')}</span>`); return; }

    clearDetailPanel(); currentPanel = null; print("");

    requiredItems.forEach(req => {
        let removed = 0;
        gameState.player.inventory = gameState.player.inventory.filter(item => { if (!item?.id) return true; if (removed >= req.count) return true; if (item.id === req.id || item.id.startsWith(req.id + '_')) { removed++; return false; } return true; });
    });

    if (typeof StoryEngine !== 'undefined') {
        const qId = 'quest_statue_rebuild_5_2';
        const qStory = StoryEngine.registry.get(qId);
        if (qStory && StoryEngine.activeQuests.includes(qId)) {
            StoryEngine.completeQuest(qId, qStory, () => {
                const idx = room.items.indexOf(baseId); if (idx > -1) { room.items.splice(idx, 1); delete ITEM_TEMPLATES[baseId]; }
                updateSceneInfo();
            });
        }
    }
}

function pushStatue(statueId) {
    const room = gameState.world[gameState.player.location]; if (!room || !room.items || !room.items.includes(statueId)) { print("雕像已不存在。"); return; }
    clearDetailPanel(); currentPanel = null; print("");
    const weapon = gameState.player.equipment.weapon; const maxDamage = (gameState.player.atk || 1) + (weapon && weapon.atk ? weapon.atk : 0);
    print(`你握紧武器，用力砸向兰德尔一世的雕像...（最大伤害：${maxDamage}）`);
    if (maxDamage >= 50) { print(`<span style="color: #ff6666;">轰——！！！</span>`); print(`沉重的青铜雕像在你的猛击下轰然倒塌！`); const idx = room.items.indexOf(statueId); if (idx > -1) { room.items.splice(idx, 1); const fallenId = `randolph_statue_fallen_${Date.now()}`; const fallen = createItemFromTemplate('randolph_statue_fallen'); if (fallen) { fallen.id = fallenId; ITEM_TEMPLATES[fallenId] = fallen; room.items.push(fallenId); } } if (!gameState.gameFlags) gameState.gameFlags = {}; gameState.gameFlags.statue_pushed = true; const baseId = `statue_base_${Date.now()}`; const baseItem = { id: baseId, name: "雕像底座", type: "misc", desc: "兰德尔一世雕像的黑色花岗岩底座...也许可以在这里重建雕像...", usable: true, customAction: true, notPickable: true }; ITEM_TEMPLATES[baseId] = baseItem; if (!room.items) room.items = []; room.items.push(baseId); StoryEngine.check(); updateSceneInfo(); updateMinimap(); }
    else { print(`<span style="color: #888;">你的攻击在坚固的青铜雕像上只留下一道痕迹...</span>`); print(`<span style="color: #ffaaaa;">（需要50点伤害）</span>`); }
}