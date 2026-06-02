// ============================================================
//  game/sceneItems.js - 场景物品详情与交互
//  地面物品信息展示 + 场景物品交互（铁锁、木门、雕像）  
// ============================================================

// ============================================================
//  场景物品交互映射表
//  每个条目定义：(可选)id匹配规则 + (可选)body匹配规则 + 操作生成函数
//  按注册顺序匹配，第一个匹配到的条目生效
// ============================================================
const GROUND_ITEM_ACTIONS = [

    // --- 传送门（优先级最高，需检查 PORTAL_DEFS） ---
    {
        match(itemId, item) { return !!PORTAL_DEFS[itemId]; },
        actions(itemId, item, html) {
            html.push(`<div><span style="color: #cc9966; text-decoration: underline; cursor: pointer;" onclick="usePortal('${itemId}')">🪜 使用</span></div>`);
        }
    },
    {
        match(itemId, item) { return itemId === 'ladder'; },
        actions(itemId, item, html) {
            html.push(`<div><span style="color: #cc9966; text-decoration: underline; cursor: pointer;" onclick="useSupervisorLadder()">🪜 使用木梯</span></div>`);
        }
    },

    // --- 撤走的梯子 ---
    {
        match(itemId, item) { return itemId === 'removed_ladder' || (itemId.includes('removed_ladder') && itemId.includes('_dropped_')); },
        actions(itemId, item, html) {
            html.push(`<div><span style="color: #aaffaa; text-decoration: underline; cursor: pointer;" onclick="useRemovedLadder('${itemId}')">🪜 使用</span></div>`);
            html.push(`<div><span style="color: #aaffaa; text-decoration: underline; cursor: pointer;" onclick="pickupItem('${itemId}')">📦 拾取</span></div>`);
        }
    },

    // --- 铁锁 ---
    {
        match(itemId, item) { return itemId === 'iron_lock'; },
        actions(itemId, item, html) {
            const hasKey = gameState.player.inventory.some(invItem => invItem && invItem.id === 'mine_exit_4_key');
            if (hasKey) html.push(`<div><span style="color: #aaffaa; text-decoration: underline; cursor: pointer;" onclick="openIronLockWithKey('${itemId}')">🔑 使用四号矿井口钥匙</span></div>`);
            html.push(`<div><span style="color: #ffaa66; text-decoration: underline; cursor: pointer;" onclick="breakLock('${itemId}')">⚔️ 破坏铁锁</span></div>`);
        }
    },

    // --- 门 ---
    {
        match(itemId, item) { return itemId === 'heavy_wooden_door'; },
        actions(itemId, item, html) {
            html.push(`<div><span style="color: #ffaa66; text-decoration: underline; cursor: pointer;" onclick="breakDoor('${itemId}', 'heavy')">⚔️ 强行破门</span></div>`);
        }
    },
    {
        match(itemId, item) { return itemId.includes('medium_wooden_door'); },
        actions(itemId, item, html) {
            html.push(`<div><span style="color: #ffaa66; text-decoration: underline; cursor: pointer;" onclick="breakDoor('${itemId}', 'medium')">⚔️ 强行破门</span></div>`);
        }
    },

    // --- 雕像 ---
    {
        match(itemId, item) { return itemId === 'randolph_statue'; },
        actions(itemId, item, html) {
            html.push(`<div><span style="color: #ff6666; text-decoration: underline; cursor: pointer;" onclick="pushStatue('${itemId}')">💪 推倒雕像</span></div>`);
        }
    },
    {
        match(itemId, item) { return itemId.includes('statue_base'); },
        actions(itemId, item, html) {
            html.push(`<div><span style="color: #ffaa66; text-decoration: underline; cursor: pointer;" onclick="rebuildStatue('${itemId}')">🔨 重建雕像</span></div>`);
        }
    },

    // --- 功能性设施（early return 类型）---
    {
        match(itemId, item) { return itemId === 'stove'; },
        actions(itemId, item, html) {
            html.push(`<div><span style="color: #ff8844; text-decoration: underline; cursor: pointer;" onclick="useStove('${itemId}')">🍳 烹饪</span></div>`);
        },
        earlyReturn: true
    },
    {
        match(itemId, item) { return itemId === 'workbench'; },
        actions(itemId, item, html) {
            html.push(`<div><span style="color: #88ccff; text-decoration: underline; cursor: pointer;" onclick="useWorkbench('${itemId}')">🔨 锻造</span></div>`);
        },
        earlyReturn: true
    },
    {
        match(itemId, item) { return itemId === 'milker'; },
        actions(itemId, item, html) {
            html.push(`<div><span style="color: #ffddaa; text-decoration: underline; cursor: pointer;" onclick="useMilker('${itemId}')">🥛 榨奶</span></div>`);
        },
        earlyReturn: true
    },
    {
        match(itemId, item) { return itemId === 'dynamite'; },
        actions(itemId, item, html) {
            html.push(`<div><span style="color: #ff4444; text-decoration: underline; cursor: pointer;" onclick="useDynamite('${itemId}')">💥 使用雷管</span></div>`);
        },
        earlyReturn: true
    },
    {
        match(itemId, item) { return itemId === 'leaf_pile'; },
        actions(itemId, item, html) {
            html.push(`<div><span style="color: #aaffaa; text-decoration: underline; cursor: pointer;" onclick="sweepLeafPile()">🍃 扫开落叶</span></div>`);
        },
        earlyReturn: true
    },
    {
        match(itemId, item) { return itemId === 'tunnel_entrance'; },
        actions(itemId, item, html) {
            html.push(`<div><span style="color: #aaffaa; text-decoration: underline; cursor: pointer;" onclick="enterTunnel()">🕳️ 进入地道</span></div>`);
        },
        earlyReturn: true
    },
    {
        match(itemId, item) { return itemId === 'teleport_circle' || itemId === 'mod_teleport_circle'; },
        actions(itemId, item, html) {
            html.push(`<div><span style="color: #6688ff; text-decoration: underline; cursor: pointer;" onclick="useTeleportCircle('${itemId}')">🌀 查看传送阵</span></div>`);
        },
        earlyReturn: true
    },
    {
        match(itemId, item) { return itemId === 'wardrobe'; },
        actions(itemId, item, html) {
            html.push(`<div><span style="color: #aaccff; text-decoration: underline; cursor: pointer;" onclick="searchWardrobe('${itemId}')">🔍 翻找</span></div>`);
        },
        earlyReturn: true
    },

    // --- 矿坑（破开四号矿井口铁锁后出现）---
    {
        match(itemId, item) { return itemId.includes('mine_pit'); },
        actions(itemId, item, html) {
            html.push(`<div><span style="color: #ff8844; text-decoration: underline; cursor: pointer;" onclick="enterMinePit('${itemId}')">🕳️ 跳下矿坑</span></div>`);
        },
        earlyReturn: true
    },

    // --- 石壁 ---
    {
        match(itemId, item) { return itemId === 'stone_wall'; },
        actions(itemId, item, html) {
            html.push(`<div><span style="color: #ffaa66; text-decoration: underline; cursor: pointer;" onclick="mineStoneWall('${itemId}')">⛏️ 挖掘</span></div>`);
        }
    },

    // --- 卡伦镇/桑华山矿场入口 ---
    {
        match(itemId, item) { return itemId === 'karen_town'; },
        actions(itemId, item, html) {
            html.push(`<div><span style="color: #aaffaa; text-decoration: underline; cursor: pointer;" onclick="StoryEngine.triggerUseItem('${itemId}')">🚶 进入</span></div>`);
        },
        earlyReturn: true
    },
    {
        match(itemId, item) { return itemId === 'sanghuashan_mine'; },
        actions(itemId, item, html) {
            html.push(`<div><span style="color: #ff8844; text-decoration: underline; cursor: pointer;" onclick="useItemFromDetail('${itemId}')">🚶 进入</span></div>`);
        },
        earlyReturn: true
    },

    // --- 尸体（使用 item 属性判定） ---
    {
        match(itemId, item) { return itemId.includes('corpse'); },
        actions(itemId, item, html) {
            if (item.corpseStory || item.usable) html.push(`<div><span style="color: #ff66aa; text-decoration: underline; cursor: pointer;" onclick="useCorpseOnGround('${itemId}')">🔞 互动</span></div>`);
            if (item.loot && item.loot.length > 0) html.push(`<div><span style="color: #ffdd44; text-decoration: underline; cursor: pointer;" onclick="lootCorpse('${itemId}')">✨ 搜刮</span></div>`);
            if (item.dismemberable) html.push(`<div><span style="color: #ff6b6b; text-decoration: underline; cursor: pointer;" onclick="dismemberItem('${itemId}')">🔪 肢解</span></div>`);
            if (!item.notPickable) {
                html.push(`<div><span style="color: #aaffaa; text-decoration: underline; cursor: pointer;" onclick="pickupItem('${itemId}')">📦 拾取</span></div>`);
                const sameCount = countSameItemsOnGround(item.name);
                if (sameCount > 1) html.push(`<div><span style="color: #aaffaa; text-decoration: underline; cursor: pointer;" onclick="pickupAllSameItems('${item.name}')">📥 全部拾取(${sameCount}个)</span></div>`);
            }
        }
    }
];

// 显示地面物品信息到详情栏
function showGroundItemInfo(itemId) {
    const item = getItemInfoById(itemId);
    if (!item) { printToDetail("找不到该物品信息。"); return; }

    let html = makeTitle('物品详情');
    html += `名称：${item.name}\n`;
    html += `类型：${getItemTypeName(item.type)}\n`;
    if (item.desc) {
        if (item.story || item.milkItem || item.ingredientType || item.dismemberable) {
            html += `\n<span style="color: #66ff66;">${item.desc}</span>\n`;
        } else if (item.type === "consumable") {
            html += `\n<span style="color: #ff6666;">${item.desc}</span>\n`;
        } else {
            html += `描述：${item.desc}\n`;
        }
    }
    if (item.atk) html += `攻击力：+${item.atk}\n`;
    if (item.def) html += `防御力：+${item.def}\n`;
    if (item.effect) {
        if (item.effect === 'heal') html += `效果：恢复 ${item.value} 点生命\n`;
        else html += `效果：${item.effect}\n`;
    }
    html += centerLine();

    // ★ 使用映射表生成交互按钮
    const actionLines = [];
    let matched = false;
    let needsEarlyReturn = false;

    for (const entry of GROUND_ITEM_ACTIONS) {
        if (entry.match(itemId, item)) {
            entry.actions(itemId, item, actionLines);
            matched = true;
            if (entry.earlyReturn) needsEarlyReturn = true;
            break; // 第一个匹配生效
        }
    }

    html += actionLines.join('');

    // 如果映射表要求 early return（如功能性设施），直接提交面板
    if (needsEarlyReturn) {
        html += `<div><span style="color: #aaa; cursor: pointer;" onclick="clearDetailPanel()">↩️ 返回</span></div>`;
        currentDetailItem = itemId;
        UI.setDetail(html);
        currentPanel = 'ground_item';
        return;
    }

    // 未匹配到特殊交互 且 物品可拾取 → 显示拾取按钮
    if (!matched && !item.notPickable) {
        html += `<div><span style="color: #aaffaa; text-decoration: underline; cursor: pointer;" onclick="pickupItem('${itemId}')">✨ 拾取</span></div>`;
        const sameCount = countSameItemsOnGround(item.name);
        if (sameCount > 1) html += `<div><span style="color: #aaffaa; text-decoration: underline; cursor: pointer;" onclick="pickupAllSameItems('${item.name}')">📥 全部拾取(${sameCount}个)</span></div>`;
    }

    html += `<div><span style="color: #aaa; cursor: pointer;" onclick="clearDetailPanel()">↩️ 返回</span></div>`;
    currentDetailItem = itemId;
    UI.setDetail(html);
    currentPanel = 'ground_item';
}

// 统一破门函数
function breakDoor(doorId, doorType) {
    const room = gameState.world[gameState.player.location];
    if (!room || !room.items || !room.items.includes(doorId)) { print("门已不存在。"); return; }
    clearDetailPanel(); currentPanel = null; print("");

    const weapon = gameState.player.equipment.weapon;
    const maxDamage = (gameState.player.atk || 1) + (weapon && weapon.atk ? weapon.atk : 0);
    const requiredDamage = doorType === 'heavy' ? 30 : 20;
    const brokenTemplate = doorType === 'heavy' ? 'broken_wooden_door' : 'broken_medium_door';

    print(`你握紧武器，用力砸向${doorType === 'heavy' ? '厚重的木门' : '紧锁的房门'}...`);
    print(`（你的最大伤害值：${maxDamage}）`);

    if (maxDamage >= requiredDamage) {
        const sound = doorType === 'heavy' ? '轰——！' : '咔嚓——！';
        print(`<span style="color: #ff6666;">${sound}</span>`);
        print(`门在你的猛击下碎裂开来！`);

        const doorIndex = room.items.indexOf(doorId);
        if (doorIndex > -1) {
            room.items.splice(doorIndex, 1);
            const brokenId = `${brokenTemplate}_${Date.now()}`;
            const broken = createItemFromTemplate(brokenTemplate);
            if (broken) { broken.id = brokenId; ITEM_TEMPLATES[brokenId] = broken; room.items.push(brokenId); }
        }
        print(`<span style="color: #aaffaa;">你成功破坏了房门！</span>`);

        if (doorType === 'heavy') {
            room.exits.west = 'corridor_center';
            const corridor = gameState.world['corridor_center'];
            if (corridor) corridor.exits.east = 'mansion_back_door';
        }

        if (doorType === 'medium') {
            handleMediumDoorUnlock(room);
        }

        // ★ 设置新出口后再刷新
        updateSceneInfo(); updateMinimap();
        print("");
        look();
    } else {
        print(`<span style="color: #888;">你的攻击只留下一道凹痕...</span>`);
        print(`<span style="color: #ffaaaa;">（需要${requiredDamage}点伤害）</span>`);
    }
}

function handleMediumDoorUnlock(room) {
    const loc = gameState.player.location;
    if (loc === 'second_floor_1') {
        room.exits.east = 'hidden_room_cecilia';
        if (!gameState.world['hidden_room_cecilia']) {
            gameState.world['hidden_room_cecilia'] = {
                name: "隐秘房间", desc: "一个被隐藏的小房间...", exits: { west: 'second_floor_1' }, items: [], npcs: []
            };
        }
    } else if (loc === 'second_floor_3') {
        room.exits.east = 'secret_storage';
        if (!gameState.world['secret_storage']) {
            gameState.world['secret_storage'] = {
                name: "秘密储藏室", desc: "一间隐秘的储藏室...", exits: { west: 'second_floor_3' },
                items: ['healing_potion', 'healing_potion', 'coin', 'coin', 'coin'], npcs: []
            };
        }
    }
}

// ★ 重建雕像（支线任务5）
function rebuildStatue(baseId) {
    const room = gameState.world[gameState.player.location];
    if (!room || !room.items || !room.items.includes(baseId)) { print("底座已不存在。"); return; }

    // 检查支线任务5-2是否已激活
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
        { id: 'knight_greatsword', name: '骑士大剑', count: 1 }
    ];

    const missing = [];
    requiredItems.forEach(req => {
        const hasCount = gameState.player.inventory.filter(i => {
            if (!i?.id) return false;
            return i.id === req.id || i.id.startsWith(req.id + '_');
        }).length;
        if (hasCount < req.count) {
            missing.push(`${req.name}×${req.count}(仅${hasCount}个)`);
        }
    });

    if (missing.length > 0) {
        print(`<span style="color:#ff6666;">材料不足！缺少：${missing.join('、')}</span>`);
        return;
    }

    clearDetailPanel(); currentPanel = null; print("");
    print(`<span style="color:#ffaa66;">你将收集的肢体一件件摆放在底座上...</span>`);

    UI.setOverlay(true);

    // 消耗材料（支持动态ID匹配，如 liana_hand_176789123）
    requiredItems.forEach(req => {
        let removed = 0;
        gameState.player.inventory = gameState.player.inventory.filter(item => {
            if (!item?.id) return true;
            if (removed >= req.count) return true;
            if (item.id === req.id || item.id.startsWith(req.id + '_')) { removed++; return false; }
            return true;
        });
    });

    let li = 0;
    const lines = [
        "被玩坏的塞西莉亚的头颅被安放在最上方，空洞的双眼似乎仍在注视着什么...",
        "伊莎贝拉的躯干构成了身体，丰满的曲线在月光下显得格外妖艳...",
        "艾莲娜的双腿被拼接在底座两侧，冷白的皮肤与黑色花岗岩形成强烈对比...",
        "骑士大剑被插入底座缝隙，成为雕像的支柱...",
        "一座由尸体拼凑而成的扭曲雕像完成了。它散发着令人不安的气息..."
    ];

    function showNext() {
        if (li < lines.length) {
            print(`<span style="color:#ffaa66;">${lines[li]}</span>`);
            li++; setTimeout(showNext, 1300);
        } else {
            UI.setOverlay(false);
            // 完成支线任务5-2（由引擎统一处理：任务状态迁移、奖励发放、完成剧情播放）
            if (typeof StoryEngine !== 'undefined') {
                const qId = 'quest_statue_rebuild_5_2';
                const qStory = StoryEngine.registry.get(qId);
                if (qStory && StoryEngine.activeQuests.includes(qId)) {
                    StoryEngine.completeQuest(qId, qStory);
                }
            }
            // 移除底座
            const idx = room.items.indexOf(baseId);
            if (idx > -1) { room.items.splice(idx, 1); delete ITEM_TEMPLATES[baseId]; }
            updateSceneInfo();
        }
    }
    showNext();
}

function pushStatue(statueId) {
    const room = gameState.world[gameState.player.location];
    if (!room || !room.items || !room.items.includes(statueId)) { print("雕像已不存在。"); return; }
    clearDetailPanel(); currentPanel = null; print("");

    const weapon = gameState.player.equipment.weapon;
    const maxDamage = (gameState.player.atk || 1) + (weapon && weapon.atk ? weapon.atk : 0);

    print(`你握紧武器，用力砸向兰德尔一世的雕像...`);
    print(`（你的最大伤害值：${maxDamage}）`);

    if (maxDamage >= 50) {
        print(`<span style="color: #ff6666;">轰——！！！</span>`);
        print(`沉重的青铜雕像在你的猛击下轰然倒塌！`);

        const idx = room.items.indexOf(statueId);
        if (idx > -1) {
            room.items.splice(idx, 1);
            const fallenId = `randolph_statue_fallen_${Date.now()}`;
            const fallen = createItemFromTemplate('randolph_statue_fallen');
            if (fallen) { fallen.id = fallenId; ITEM_TEMPLATES[fallenId] = fallen; room.items.push(fallenId); }
        }
        if (!gameState.gameFlags) gameState.gameFlags = {};
        gameState.gameFlags.statue_pushed = true;

        // ★ 生成雕像底座（可交互重建）
        const baseId = `statue_base_${Date.now()}`;
        const baseItem = {
            id: baseId, name: "雕像底座", type: "misc",
            desc: "兰德尔一世雕像的黑色花岗岩底座，上面残留着青铜像的断裂痕迹。底座正面刻着依稀可辨的铭文。也许可以在这里重建雕像...",
            usable: true, customAction: true, notPickable: true
        };
        ITEM_TEMPLATES[baseId] = baseItem;
        if (!room.items) room.items = [];
        room.items.push(baseId);

        StoryEngine.check();
        updateSceneInfo(); updateMinimap();
    } else {
        print(`<span style="color: #888;">你的攻击在坚固的青铜雕像上只留下一道痕迹...</span>`);
        print(`<span style="color: #ffaaaa;">（需要50点伤害）</span>`);
    }
}