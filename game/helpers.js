// ============================================================
//  game/helpers.js - 通用辅助函数
//  被所有模块共享的UI输出、格式化、工具函数
// ============================================================

// 输出代理（委托给UI对象）
function print(msg) { UI.print(msg); }
function clearOutput() { UI.clearOutput(); }
function printToDetail(content) { UI.printToDetail(content); }
function clearDetailPanel() { UI.clearDetail(); }

// 自适应宽度的分隔线
function centerLine() {
    return `<div style="border-top: 1px solid #ffffffff;margin:10px 0;"></div>`;
}

// 居中标题
function makeTitle(text) {
    return `<div style="display: flex; justify-content: center; align-items: center;">
<span style="flex: 1; border-top: 1px solid #ffffffff; margin-right: 8px;"></span>
<span style="white-space: nowrap;">${text}</span>
<span style="flex: 1; border-top: 1px solid #ffffffff; margin-left: 8px;"></span>
</div>`;
}

// 物品类型名称映射
function getItemTypeName(type) {
    const map = { weapon: '武器', armor: '防具', consumable: '消耗品', readable: '读物', misc: '杂物', accessory: '饰品', limb: '肢体' };
    return map[type] || type;
}

// 角色类型名称映射
function getCharacterTypeName(type) {
    const map = { npc: 'NPC', enemy: '敌人', boss: '首领' };
    return map[type] || type;
}

// 物品类型对应emoji
function getItemEmoji(item) {
    if (!item) return '📦';
    if (item.type === 'weapon') return '⚔️';
    if (item.type === 'armor') return '🛡️';
    if (item.type === 'consumable') return '🧪';
    if (item.type === 'readable') return '📖';
    return '📦';
}

// 从背包查找物品
function findItemById(itemId) {
    return gameState.player.inventory.find(item => item.id === itemId) || null;
}

// 从背包移除物品
function removeItemFromInventory(itemId) {
    const index = gameState.player.inventory.findIndex(item => item.id === itemId);
    if (index !== -1) {
        gameState.player.inventory.splice(index, 1);
        return true;
    }
    return false;
}

// 剧情Next按钮系统
let _storyNextCallback = null;

function showNextBtn(callback) {
    UI.toggleNextBtn(true, callback);
}

function hideNextBtn() {
    UI.toggleNextBtn(false);
}

// 统一判定：物品是否不可拾取（供 look.js、pickup.js 共用）
// 需同时检查 item 对象的 notPickable 属性和 itemId 模式匹配
function isItemUnpickable(itemOrId) {
    // 支持传入 item 对象或 itemId 字符串
    const item = (typeof itemOrId === 'string') ? getItemInfoById(itemOrId) : itemOrId;
    const itemId = (typeof itemOrId === 'string') ? itemOrId : (item ? item.id : '');

    if (item && item.notPickable) return true;
    if (item && item.type === 'portal') return true;

    // ID 模式匹配 —— 场景交互类物品不可拾取
    const unpickablePatterns = [
        'ladder', 'dynamite', 'heavy_wooden_door', 'medium_wooden_door',
        'spiral_stairs', 'stairs_to_', 'stove', 'milker', 'workbench',
        'mansion_gate_door', 'wooden_hut', 'hut_door', 'side_gate_door',
        'randolph_statue', 'stone_wall', 'wardrobe', 'mine_pit',
        'teleport_circle', 'tunnel_entrance', 'leaf_pile'
    ];
    return unpickablePatterns.some(p => itemId.includes(p));
}

// 西侧矿道红色场景检测
function isMine4Area(roomId) {
    return ['tunnel_4_west_4', 'tunnel_4_west_5', 'tunnel_4_west_6', 'tunnel_4_west_7'].includes(roomId);
}

// 检查升级
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
        print(`<span style="color: #ffdd44;">═══════════════════════════</span>`);
    }
    print(`<span style="color: #888;">当前经验: ${player.exp}/${player.maxExp}</span>`);
}

// 魔镜传送功能
const MIRROR_TELEPORT_DESTINATIONS = [
    { id: 'mine_gate', name: '矿场大门', roomName: '矿场大门' }
];

function useMagicMirror() {
    const mirror = findItemById('magic_mirror');
    if (!mirror) {
        // 检查装备栏
        if (gameState.player.equipment.accessory && gameState.player.equipment.accessory.id === 'magic_mirror') {
            // 允许从装备栏使用
        } else {
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

// 查看状态
function showStatus() {
    const p = gameState.player;
    print(`<span style="color: #c3b38d;">👤 ${p.name}  |  ❤️ HP: ${p.hp}/${p.maxHp}  |  📍 ${gameState.world[p.location].name}</span>`);
}
