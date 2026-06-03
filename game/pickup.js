// ============================================================
//  game/pickup.js - 物品拾取/丢弃系统
// ============================================================

function countSameItemsOnGround(itemName) {
    const room = gameState.world[gameState.player.location];
    if (!room || !room.items) return 0;
    let count = 0;
    room.items.forEach(id => { const item = getItemInfoById(id); if (item && item.name === itemName) count++; });
    return count;
}

function pickupItem(itemId) {
    const room = gameState.world[gameState.player.location];
    if (!room || !room.items) { print("无法拾取。"); return; }

    const item = getItemInfoById(itemId);
    if (!item) return;
    if (isItemUnpickable(item)) { print(`<span style="color: #ff6666;">这个物品无法拾取。</span>`); return; }

    const index = room.items.indexOf(itemId);
    if (index === -1) { print("该物品已不存在。"); return; }

    room.items.splice(index, 1);
    clearDetailPanel(); currentPanel = null;

    if (itemId.includes('corpse')) {
        print(`你拾取了「${item.name}」。`);
        if (item.loot && item.loot.length > 0) {
            print(`从尸体上搜刮到了：`);
            item.loot.forEach(lootId => {
                const lootItem = createItemFromTemplate(lootId);
                if (lootItem) { gameState.player.inventory.push(lootItem); print(`✨ ${lootItem.name}`); }
            });
        }
        const corpseCopy = JSON.parse(JSON.stringify(item));
        corpseCopy.loot = [];
        gameState.player.inventory.push(corpseCopy);
        print(`「${item.name}」已放入行囊。`);
    } else {
        gameState.player.inventory.push(JSON.parse(JSON.stringify(item)));
        print(`你拾取了「${item.name}」。`);
    }

    delete ITEM_TEMPLATES[itemId];
    updateSceneInfo();
    StoryEngine.check();
}

function pickupAllItems() {
    const room = gameState.world[gameState.player.location];
    if (!room || !room.items || room.items.length === 0) { print("这里没有可拾取的物品。"); return; }
    clearDetailPanel(); currentPanel = null;

    const itemsToPickup = [], itemsToKeep = [];
    room.items.forEach(itemId => {
        const item = getItemInfoById(itemId);
        if (!item) return;
        if (isItemUnpickable(item)) {
            itemsToKeep.push(itemId); return;
        }
        itemsToPickup.push({ id: itemId, item: item });
    });

    if (itemsToPickup.length === 0) { print("这里没有可拾取的物品。"); return; }

    print("你开始搜刮周围的一切...");
    itemsToPickup.forEach(({ id, item }) => {
        if (item.searchable && item.loot && item.loot.length > 0) {
            print(`搜刮「${item.name}」，获得了：`);
            item.loot.forEach(lootId => {
                const lootItem = createItemFromTemplate(lootId);
                if (lootItem) { gameState.player.inventory.push(lootItem); print(`  ✨ ${lootItem.name}`); }
            });
            delete ITEM_TEMPLATES[id];
        } else {
            gameState.player.inventory.push(JSON.parse(JSON.stringify(item)));
            print(`✨ 拾取了「${item.name}」`);
        }
    });

    room.items = itemsToKeep;
    print(`共拾取了 ${itemsToPickup.length} 件物品。`);
    updateSceneInfo();
    StoryEngine.check();
}

function pickupAllSameItems(itemName) {
    const room = gameState.world[gameState.player.location];
    if (!room || !room.items) { print("无法拾取。"); return; }
    let count = 0;
    const itemsToPickup = [];
    room.items.forEach(id => { const item = getItemInfoById(id); if (item && item.name === itemName && !isItemUnpickable(item)) itemsToPickup.push(id); });
    itemsToPickup.forEach(itemId => {
        const index = room.items.indexOf(itemId);
        if (index !== -1) { const item = getItemInfoById(itemId); if (item) { room.items.splice(index, 1); gameState.player.inventory.push(item); count++; } }
    });
    if (count > 0) { print(`<span style="color: #aaffaa;">你拾取了 ${count} 个「${itemName}」。</span>`); updateSceneInfo(); showInventoryPanel(); }
    else print("没有找到该物品。");
}

function dropItemFromInventory(itemId) {
    const item = findItemById(itemId);
    if (!item) { print("物品不存在。"); return; }
    const room = gameState.world[gameState.player.location];
    if (!room) { print("无法丢弃物品。"); return; }

    removeItemFromInventory(itemId);
    const uniqueId = `${itemId}_dropped_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const droppedItem = JSON.parse(JSON.stringify(item));
    droppedItem.id = uniqueId;
    if (!room.items) room.items = [];
    room.items.push(uniqueId);
    ITEM_TEMPLATES[uniqueId] = droppedItem;

    clearDetailPanel(); currentPanel = null;
    print(`你将「${item.name}」丢在了地上。`);
    updateSceneInfo();
}

function dropAllItemsByName(itemName) {
    const room = gameState.world[gameState.player.location];
    if (!room) { print("无法丢弃物品。"); return; }
    const itemsToDrop = gameState.player.inventory.filter(item => item.name === itemName);
    if (itemsToDrop.length === 0) { print("没有找到该物品。"); return; }

    gameState.player.inventory = gameState.player.inventory.filter(item => item.name !== itemName);
    itemsToDrop.forEach(item => {
        const uniqueId = `${item.id}_dropped_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
        const droppedItem = JSON.parse(JSON.stringify(item)); droppedItem.id = uniqueId;
        if (!room.items) room.items = [];
        room.items.push(uniqueId); ITEM_TEMPLATES[uniqueId] = droppedItem;
    });

    clearDetailPanel(); currentPanel = null;
    print(`你将 ${itemsToDrop.length} 个「${itemName}」丢在了地上。`);
    updateSceneInfo();
}