// ============================================================
//  game/helpers.js - 通用辅助函数
// ============================================================

function print(msg) { UI.print(msg); }
function clearOutput() { UI.clearOutput(); }
function printToDetail(content) { UI.printToDetail(content); }
function clearDetailPanel() { UI.clearDetail(); }

/** 统一传送后处理：移动到指定房间并刷新所有UI */
function relocateTo(roomId, options = {}) {
    const { travelText, travelColor = '#cc9966', delay = 0, callback, skipCheck = false } = options;
    if (travelText) { print(`<span style="color: ${travelColor};">${travelText}</span>`); print(""); }
    const doRelocate = () => {
        gameState.player.location = roomId;
        if (typeof StoryEngine !== 'undefined' && StoryEngine.loaded && !skipCheck) StoryEngine.check();
        look();
        updateMinimap();
        updateSceneInfo();
        if (callback) callback();
    };
    if (delay > 0) setTimeout(doRelocate, delay);
    else doRelocate();
}

function centerLine() {
    return `<div style="border-top: 1px solid #ffffffff;margin:10px 0;"></div>`;
}

function makeTitle(text) {
    return `<div style="display: flex; justify-content: center; align-items: center;">
<span style="flex: 1; border-top: 1px solid #ffffffff; margin-right: 8px;"></span>
<span style="white-space: nowrap;">${text}</span>
<span style="flex: 1; border-top: 1px solid #ffffffff; margin-left: 8px;"></span>
</div>`;
}

function getItemTypeName(type) {
    const map = { weapon: '武器', armor: '防具', consumable: '消耗品', readable: '读物', misc: '杂物', accessory: '饰品', limb: '肢体' };
    return map[type] || type;
}

function getCharacterTypeName(type) {
    const map = { npc: 'NPC', enemy: '敌人', boss: '首领' };
    return map[type] || type;
}

function getItemEmoji(item) {
    if (!item) return '📦';
    if (item.type === 'weapon') return '⚔️';
    if (item.type === 'armor') return '🛡️';
    if (item.type === 'consumable') return '🧪';
    if (item.type === 'readable') return '📖';
    return '📦';
}

const RARITY_COLORS = {
    normal:    '#c0c0c0',
    good:      '#66cc66',
    rare:      '#6699ff',
    epic:      '#cc66ff',
    legendary: '#ff8844'
};

const RARITY_NAMES = {
    normal:    '普通',
    good:      '优良',
    rare:      '稀有',
    epic:      '罕见',
    legendary: '珍品'
};

function getRarityColor(rarity) {
    return RARITY_COLORS[rarity] || '#c0c0c0';
}

// ★ 装备显示名：前缀和名称都带品质颜色
function getEquipmentDisplayName(item) {
    if (!item || !item.rarity) return item ? item.name : '';
    const color = getRarityColor(item.rarity);
    const prefix = item.crafted ? '<span style="color:' + color + ';">★</span>' : '';
    const rarityLabel = RARITY_NAMES[item.rarity] || '';
    return prefix + '<span style="color:' + color + ';">【' + rarityLabel + '】' + item.name + '</span>';
}

function findItemById(itemId) {
    return gameState.player.inventory.find(item => item.id === itemId) || null;
}

function removeItemFromInventory(itemId) {
    const index = gameState.player.inventory.findIndex(item => item.id === itemId);
    if (index !== -1) {
        gameState.player.inventory.splice(index, 1);
        return true;
    }
    return false;
}

let _storyNextCallback = null;

function showNextBtn(callback) {
    UI.toggleNextBtn(true, callback);
}

function hideNextBtn() {
    UI.toggleNextBtn(false);
}

function isItemUnpickable(itemOrId) {
    const item = (typeof itemOrId === 'string') ? getItemInfoById(itemOrId) : itemOrId;
    const itemId = (typeof itemOrId === 'string') ? itemOrId : (item ? item.id : '');
    if (item && item.notPickable) return true;
    if (item && item.type === 'portal') return true;
    const unpickablePatterns = [
        'ladder', 'dynamite', 'heavy_wooden_door', 'medium_wooden_door',
        'spiral_stairs', 'stairs_', 'stove', 'milker', 'workbench',
        'mansion_gate_door', 'wooden_hut', 'hut_door', 'side_gate_door',
        'randolph_statue', 'stone_wall', 'wardrobe', 'mine_pit',
        'teleport_circle', 'tunnel_entrance', 'leaf_pile'
    ];
    return unpickablePatterns.some(p => itemId.includes(p));
}

function isMine4Area(roomId) {
    return ['tunnel_4_west_4', 'tunnel_4_west_5', 'tunnel_4_west_6', 'tunnel_4_west_7'].includes(roomId);
}

function checkLevelUp() {
    const player = gameState.player;
    while (player.exp >= player.maxExp) {
        player.exp -= player.maxExp;
        player.level++;
        const multiplier = 1.2;
        player.maxHp = Math.floor(player.maxHp * multiplier);
        player.hp = player.maxHp;
        player.atk = player.atk * multiplier;
        player.def = player.def * multiplier;
        player.agi = player.agi * multiplier;
        player.maxSp = Math.floor(player.maxSp + 2);
        player.sp = player.maxSp;
        player.maxExp = Math.floor(player.maxExp * multiplier);
        print("");
        print(`<span style="color: #ffdd44;">═══════════════════════════</span>`);
        print(`<span style="color: #ffdd44; font-weight: bold;">【升级！】等级提升至 ${player.level}！</span>`);
        print(`<span style="color: #aaffaa;">生命值上限: ${player.maxHp}  |  攻击力: ${Math.floor(player.atk)}  |  防御力: ${Math.floor(player.def)}</span>`);
        print(`<span style="color: #aaffaa;">技力上限: ${player.maxSp}  |  灵巧: ${Math.floor(player.agi)}</span>`);
        print(`<span style="color: #ffdd44;">下一级所需经验: ${player.maxExp}</span>`);
        print(`<span style="color: #ffdd44;">═══════════════════════</span>`);
    }
    print(`<span style="color: #888;">当前经验: ${player.exp}/${player.maxExp}</span>`);
}

const MIRROR_TELEPORT_DESTINATIONS = [
    { id: 'mine_gate', name: '矿场大门', roomName: '矿场大门' }
];

function useMagicMirror() {
    const mirror = findItemById('magic_mirror');
    if (!mirror) {
        if (!(gameState.player.equipment.accessory && gameState.player.equipment.accessory.id === 'magic_mirror')) {
            print(`<span style="color: #ffaaaa;">你没有魔镜！</span>`);
            return;
        }
    }
    clearDetailPanel();
    currentPanel = null;
    let html = makeTitle('🌀 魔镜传送');
    html += `<div style="color: #888; margin-bottom: 8px;">选择要传送的目的地：</div>\n`;
    MIRROR_TELEPORT_DESTINATIONS.forEach(dest => {
        const room = gameState.world[dest.id];
        const roomName = room ? room.name : dest.roomName;
        html += `<div style="margin: 4px 0;"><span style="color: #6688ff; text-decoration: underline; cursor: pointer;" onclick="teleportViaMirror('${dest.id}')">📍 ${roomName}</span></div>\n`;
    });
    html += centerLine();
    html += `<div><span style="color: #aaa; cursor: pointer;" onclick="clearDetailPanel()">↩️ 关闭</span></div>`;
    UI.setDetail(html);
    currentPanel = 'mirror_teleport';
}

function teleportViaMirror(roomId) {
    const room = gameState.world[roomId];
    if (!room) {
        print(`<span style="color: #ffaaaa;">传送失败：目的地不存在。</span>`);
        return;
    }
    gameState.player.location = roomId;
    clearDetailPanel();
    currentPanel = null;
    clearOutput();
    print(`<span style="color: #6688ff;">🌀 魔镜发出耀眼的蓝光，你感到一阵眩晕...</span>`);
    print(`<span style="color: #aaffaa;">你被传送到了「${room.name}」。</span>`);
    print("");
    look();
    updateMinimap();
    updateSceneInfo();
    StoryEngine.check();
}

function isItemSellable(item) {
    if (!item) return false;
    if (item.id && item.id.includes('corpse')) return false;
    if (item.type === 'limb' || item.story) return false;
    if (item.type === 'important') return false;
    if (item.type === 'readable') return false;
    if (item.id === 'gold_coin') return false;
    return true;
}

function getItemSellPrice(item) {
    if (!item) return 0;
    if (item.type === 'weapon' || item.type === 'armor' || item.type === 'accessory') {
        const atk = item.atk || 0;
        const def = item.def || 0;
        const agi = Math.abs(item.agi || 0);
        let price = atk * 3 + def * 3 + agi * 2;
        if (item.rarity) {
            const rarityMultiplier = { normal: 1, fine: 1.5, rare: 2.5, epic: 4, legendary: 8 };
            price = Math.floor(price * (rarityMultiplier[item.rarity] || 1));
        }
        return Math.max(1, price);
    }
    if (item.type === 'consumable' && item.value) {
        return Math.floor(item.value * 2);
    }
    return 5;
}

function hasKnightSetBonus() {
    const eq = gameState.player.equipment;
    return eq.weapon && (eq.weapon.id === 'knight_greatsword' || eq.weapon.id.startsWith('crafted_knight_greatsword'))
        && eq.armor && (eq.armor.id === 'knight_armor' || eq.armor.id.startsWith('crafted_knight_armor'))
        && eq.accessory && eq.accessory.id === 'knight_emblem';
}

// ★ 检测套装状态变化并同步技能（供装备/卸下时调用）
function checkKnightSetChange() {
    const skills = gameState.player.skills;
    const hadVow = skills.includes('player_vow');
    const hadSacrifice = skills.includes('player_sacrifice');
    const hasSet = hasKnightSetBonus();

    if (hasSet && (!hadVow || !hadSacrifice)) {
        if (!hadVow) skills.push('player_vow');
        if (!hadSacrifice) skills.push('player_sacrifice');
        print(`<span style="color: #ffd700; font-weight: bold;">✨ 骑士套装效果触发！获得临时技能「誓言」「舍身」</span>`);
    } else if (!hasSet && (hadVow || hadSacrifice)) {
        const idx1 = skills.indexOf('player_vow');
        if (idx1 > -1) skills.splice(idx1, 1);
        const idx2 = skills.indexOf('player_sacrifice');
        if (idx2 > -1) skills.splice(idx2, 1);
        print(`<span style="color: #888;">骑士套装效果已消失，临时技能已移除。</span>`);
    }
}

function showStatus() {
    const p = gameState.player;
    const gold = p.gold || 0;
    print(`<span style="color: #c3b38d;">👤 ${p.name}  |  ❤️ HP: ${p.hp}/${p.maxHp}  |  💰 ${gold}金币  |  📍 ${gameState.world[p.location].name}</span>`);
}