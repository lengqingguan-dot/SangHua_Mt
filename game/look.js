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

    // 所有移动、传送和场景入口最终都会调用 look()；在这里统一记录
    // 魔镜传送点，确保只有玩家首次亲自抵达后才会解锁。
    if (typeof recordMirrorDestinationVisit === 'function') {
        recordMirrorDestinationVisit(loc);
    }

    // 进入房间时检查是否存在后台战斗记录（盟友后续或仇恨恢复）
    if (typeof maybeResumeOrReportBackgroundBattle === 'function' && !battleState.inBattle) {
        if (maybeResumeOrReportBackgroundBattle(loc)) {
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
    const currentWorld = gameState.world;
    const currentLoc = gameState.player.location;
    const room = gameState.world[currentLoc];
    if (!room) return;

    UI.elements.roomNameDisplay.textContent = room.name;

    const centerRoomNameSpan = document.getElementById('current-room-name-on-map');
    if (centerRoomNameSpan) centerRoomNameSpan.textContent = room.name;

    const roomNumSpan = document.getElementById('room-number-display');
    if (roomNumSpan) {
        roomNumSpan.textContent = room.roomNumber ? '#' + room.roomNumber : '-';
    }

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
            const targetId = exits[dir];
            const handler = () => {
                if(gameState.world!==currentWorld || gameState.player.location!==currentLoc || currentWorld[currentLoc]?.exits[dir]!==targetId) return false;
                return moveByButton(dir);
            };
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

    let html = typeof explorationSceneActions === 'function' ? explorationSceneActions() : '';

    // NPC
    if (room.npcs && room.npcs.length > 0) {
        room.npcs.forEach(npcId => {
            const npc = getCharacterInfo(npcId);
            if (npc) {
                const npcClass = npc.hostile ? 'scene-entry--danger' : 'scene-entry--npc';
                const npcLabel = npc.hostile ? '敌对 NPC' : 'NPC';
                html += `<div class="scene-entry ${npcClass}" onclick="showNPCInfo('${npcId}')"><span>👤 ${npc.name}</span><small>${npcLabel} · 点击查看</small></div>`;
            }
        });
    }

    // 地面物品
    let pickupableCount = 0;
    if (room.items && room.items.length > 0) {
        const countMap = {}, itemMap = {}, order = [], pickupableKeys = new Set();

        room.items.forEach(itemId => {
            const item = getItemInfoById(itemId);
            if (!item) return;
            const key = getItemStackKey(item);
            const isUnpickupable = isItemUnpickable(itemId);

            if (!isUnpickupable) pickupableKeys.add(key);

            if (countMap[key]) { countMap[key]++; }
            else { countMap[key] = 1; itemMap[key] = item; order.push(key); }
        });

        pickupableCount = pickupableKeys.size;

        order.forEach(key => {
            const count = countMap[key];
            const item = itemMap[key];
            const itemId = item.id;
            const emoji = getItemEmoji(item);
            const thumbnailScaleStyle = item.thumbnailScale ? ` style="--item-thumbnail-scale:${item.thumbnailScale}"` : '';
            const itemVisual = item.thumbnail
                ? `<img class="scene-entry__thumbnail" src="${item.thumbnail}" alt="" loading="lazy"${thumbnailScaleStyle}${item.thumbnailCutout ? ` onload="applyCutoutThumbnail(this)"` : ''}>`
                : `<span class="scene-entry__emoji">${emoji}</span>`;
            const nameHtml = item.id === 'red_banner'
                ? getInventoryDisplayName(item)
                : (item.type === 'limb' && item.rarity ? getLimbDisplayName(item) : item.name);
            const displayName = count > 1 ? `${nameHtml}×${count}` : nameHtml;
            const isUnpickupable = item.notPickable || false;
            const itemClass = isUnpickupable ? 'scene-entry--muted' : 'scene-entry--object';
            const itemLabel = isUnpickupable ? '场景设施' : '地面物品';
            html += `<div class="scene-entry ${itemClass}" onclick="showGroundItemInfo('${itemId}')"><div class="scene-entry__main">${itemVisual}<span class="scene-entry__name">${displayName}</span></div><small>${itemLabel} · 点击查看</small></div>`;
        });

        const hasIronLock = room.items && room.items.some(id => id === 'iron_lock' || (getItemInfoById(id) && getItemInfoById(id).id === 'iron_lock'));
        if (pickupableCount > 0 && !(loc === 'mine_exit_4' && hasIronLock)) {
            html += `<div class="scene-pick-all"><span style="cursor:pointer;" onclick="pickupAllItems()">📥 全部拾取</span></div>`;
        }
    }

    sceneListDiv.innerHTML = html || '— 暂无 —';
}
