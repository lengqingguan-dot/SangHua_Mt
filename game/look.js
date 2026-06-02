// ============================================================
//  game/look.js - 房间观察/小地图/场景更新
// ============================================================

function look() {
    const loc = gameState.player.location;
    let room = gameState.world[loc];
    if (!room) {
        gameState.world = getWorldData();
        room = gameState.world[loc];
        if (!room) {
            print(`<span style="color:red;">错误：当前位置「${loc}」不存在！</span>`);
            return;
        }
    }

    if (gameState.firstTimeEntered && loc === 'mine_deep') {
        StoryEngine.check();
        return;
    }

    showRoomInfo(room);
    updateSceneInfo();
}

function showRoomInfo(room) {
    const loc = gameState.player.location;
    const isMine4 = isMine4Area(loc);

    print('<br>');
    print(`<span style="color: #e6d5a8; font-weight: bold;">[ ${room.name} ]</span>`);

    if (isMine4) {
        print(`<span style="color: #ff6666;">${room.desc}</span>`);
    } else {
        print(`<span class="scene-desc">${room.desc}</span>`);
    }

    const exits = room.exits;
    const exitNames = { north: '北', south: '南', east: '东', west: '西', up: '上', down: '下' };
    const exitList = Object.keys(exits).map(dir => exitNames[dir] || dir);
    if (exitList.length > 0) {
        print(`<span style="color: #aac7e0;">可通行方向: ${exitList.join('、')}</span>`);
    } else {
        print(`<span style="color: #aac7e0;">四周都是死路。</span>`);
    }

    mainContent = UI.getOutputHtml();

    // 血色宝石检测 → 由 StoryEngine 处理
    StoryEngine.check();
}

function updateMinimap() {
    const currentLoc = gameState.player.location;
    const room = gameState.world[currentLoc];
    if (!room) return;

    UI.elements.roomNameDisplay.textContent = room.name;

    const centerRoomNameSpan = document.getElementById('current-room-name-on-map');
    if (centerRoomNameSpan) centerRoomNameSpan.textContent = room.name;

    const exits = room.exits || {};
    const getRoomName = (dir) => {
        const targetId = exits[dir];
        if (targetId && gameState.world[targetId]) return gameState.world[targetId].name;
        return null;
    };

    const directions = [
        { dir: 'north', cell: UI.elements.mapNorth, span: UI.elements.northRoomSpan },
        { dir: 'south', cell: UI.elements.mapSouth, span: UI.elements.southRoomSpan },
        { dir: 'east', cell: UI.elements.mapEast, span: UI.elements.eastRoomSpan },
        { dir: 'west', cell: UI.elements.mapWest, span: UI.elements.westRoomSpan }
    ];

    directions.forEach(({ dir, cell, span }) => {
        const roomName = getRoomName(dir);
        cell.removeEventListener('click', cell._clickHandler);
        if (roomName) {
            cell.classList.remove('empty'); cell.classList.add('clickable');
            span.textContent = roomName;
            const handler = () => moveByButton(dir);
            cell._clickHandler = handler;
            cell.addEventListener('click', handler);
        } else {
            cell.classList.add('empty'); cell.classList.remove('clickable');
            span.textContent = '—';
            cell._clickHandler = null;
        }
    });
}

function updateSceneInfo() {
    const sceneListDiv = document.getElementById('scene-items-list');
    if (!sceneListDiv) return;

    const loc = gameState.player.location;
    const room = gameState.world[loc];
    if (!room) { sceneListDiv.innerHTML = '— 暂无 —'; return; }

    let html = '';

    // NPC
    if (room.npcs && room.npcs.length > 0) {
        room.npcs.forEach(npcId => {
            const npc = getCharacterInfo(npcId);
            if (npc) {
                const npcColor = npc.hostile ? '#ff6666' : '#90ee90';
                html += `<div style="margin:5px 0;"><span style="cursor:pointer;color:${npcColor};" onclick="showNPCInfo('${npcId}')">👤 ${npc.name}</span></div>`;
            }
        });
    }

    // 地面物品
    let pickupableCount = 0;
    if (room.items && room.items.length > 0) {
        const nameCountMap = {}, nameItemMap = {}, nameOrder = [], pickupableNames = new Set();

        room.items.forEach(itemId => {
            const item = getItemInfoById(itemId);
            if (!item) return;
            const itemName = item.name;
            const isUnpickupable = isItemUnpickable(itemId);

            if (!isUnpickupable) pickupableNames.add(itemName);

            if (nameCountMap[itemName]) { nameCountMap[itemName]++; }
            else { nameCountMap[itemName] = 1; nameItemMap[itemName] = item; nameOrder.push(itemName); }
        });

        pickupableCount = pickupableNames.size;

        nameOrder.forEach(name => {
            const count = nameCountMap[name];
            const item = nameItemMap[name];
            const itemId = item.id;
            const emoji = getItemEmoji(item);
            const displayName = count > 1 ? `${name}×${count}` : name;
            const isUnpickupable = item.notPickable || false;
            html += `<div style="margin:5px 0;"><span style="cursor:pointer;color:${isUnpickupable ? '#888' : '#c0d0e0'};" onclick="showGroundItemInfo('${itemId}')">${emoji} ${displayName}</span></div>`;
        });

        const hasIronLock = room.items && room.items.some(id => id === 'iron_lock' || (getItemInfoById(id) && getItemInfoById(id).id === 'iron_lock'));
        if (pickupableCount > 0 && !(loc === 'mine_exit_4' && hasIronLock)) {
            html += `<div style="margin:10px 0 5px 0;border-top:1px dashed #4a5a6a;padding-top:8px;"><span style="color:#aaffaa;text-decoration:underline;cursor:pointer;font-size:13px;" onclick="pickupAllItems()">📥 全部拾取</span></div>`;
        }
    }

    sceneListDiv.innerHTML = html || '— 暂无 —';
}