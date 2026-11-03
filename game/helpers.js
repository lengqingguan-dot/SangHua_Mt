// ============================================================
//  game/helpers.js - 通用辅助函数
// ============================================================

function print(msg) { UI.print(msg); }
function clearOutput() { UI.clearOutput(); }
function printToDetail(content) { UI.printToDetail(content); }
function clearDetailPanel() { UI.clearDetail(); }

// 所有场景传送共用同一种字幕样式，不依赖文字长度或钥匙类型。
const TRAVEL_TEXT_COLOR = '#cc9966';

/** 即时传送：切换位置，输出一行字幕，再刷新场景和剧情。 */
function relocateTo(roomId, options = {}) {
    const { travelText, callback, skipCheck = false } = options;
    if (battleState.inBattle) { print('战斗中无法使用传送通道。'); return false; }
    const room = gameState.world[roomId];
    if (!room) { print('传送失败：目的地不存在。'); return false; }
    clearDetailPanel();
    currentPanel = null;
    UI.setOverlay(false);
    gameState.player.location = roomId;
    const caption = String(travelText || '').replace(/<[^>]*>|\s+/g, ' ').trim() || `你来到了「${room.name}」。`;
    print(`<span class="travel-text" style="color: ${TRAVEL_TEXT_COLOR};">${caption}</span>`);
    look();
    updateMinimap();
    updateSceneInfo();
    if (typeof StoryEngine !== 'undefined' && StoryEngine.loaded && !skipCheck) StoryEngine.check();
    if (callback) callback();
    return true;
}

function centerLine() {
    return `<div class="detail-divider"></div>`;
}

function makeTitle(text) {
    return `<div class="detail-title">${text}</div>`;
}

function makePanelFooter(onclick, label = '关闭', icon = '✕') {
    return `<div class="panel-footer"><button type="button" class="panel-footer__button" onclick="${onclick}"><span>${icon}</span>${label}</button></div>`;
}

function getItemTypeName(type) {
    if (type === 'skill_book') return '技能书';
    const map = { weapon: '武器', armor: '防具', consumable: '消耗品', readable: '读物', misc: '杂物', accessory: '饰品', limb: '肢体' };
    return map[type] || type;
}

function getCharacterTypeName(type) {
    const map = { npc: 'NPC', enemy: '敌人', boss: '首领' };
    return map[type] || type;
}

function getItemEmoji(item) {
    if (!item) return '📦';
    if (item.type === 'skill_book') return '📚';
    if (item.type === 'weapon') return '⚔️';
    if (item.type === 'armor') return '🛡️';
    if (item.type === 'consumable') return '🧪';
    if (item.type === 'readable') return '📖';
    return '📦';
}

// 将生成器烘焙的中性棋盘底在浏览器中转为真实透明像素，仅供标记过的缩略图使用。
function applyCutoutThumbnail(image) {
    if (!image || image.dataset.cutoutProcessed === 'true') return;
    image.dataset.cutoutProcessed = 'true';
    try {
        const canvas = document.createElement('canvas');
        canvas.width = image.naturalWidth;
        canvas.height = image.naturalHeight;
        const context = canvas.getContext('2d', { willReadFrequently: true });
        context.drawImage(image, 0, 0);
        const frame = context.getImageData(0, 0, canvas.width, canvas.height);
        const pixels = frame.data;
        for (let i = 0; i < pixels.length; i += 4) {
            const r = pixels[i], g = pixels[i + 1], b = pixels[i + 2];
            const darkest = Math.min(r, g, b);
            const lightest = Math.max(r, g, b);
            if (darkest >= 225 && lightest - darkest <= 10) pixels[i + 3] = 0;
        }
        context.putImageData(frame, 0, 0);
        image.src = canvas.toDataURL('image/png');
    } catch (error) {
        console.warn('缩略图透明化处理失败：', error);
    }
}

const RARITY_COLORS = {
    normal:    '#c0c0c0',
    good:      '#66cc66',
    rare:      '#6699ff',
    epic:      '#cc66ff',
    legendary: '#ff8844',
    mythic:    '#ff4040'
};

const RARITY_NAMES = {
    normal:    '普通',
    good:      '优良',
    rare:      '稀有',
    epic:      '史诗',
    legendary: '珍品',
    mythic:    '神品'
};

function getRarityColor(rarity) {
    return RARITY_COLORS[rarity] || '#c0c0c0';
}

function getQualityName(rarity) {
    return RARITY_NAMES[rarity] || '';
}

// 评分(0-100) → 品质
function scoreToQuality(score) {
    if (score >= 100) return 'mythic';
    if (score >= 95) return 'legendary';
    if (score >= 85) return 'epic';
    if (score >= 70) return 'rare';
    if (score >= 40) return 'good';
    return 'normal';
}

function stripLimbMeasurementSuffix(name) {
    return String(name || '').replace(/[（(]\s*(?:\d+(?:\.\d+)?\s*码|[A-Z]\s*罩杯|未知码|未知罩杯)\s*[）)]/gi,'').trim();
}
function limbMeasurementPart(item) {
    if(!item || item.id?.includes('corpse')) return '';
    if(item.limbPart==='foot' || item.limbPart==='breast') return item.limbPart;
    if(item.ingredientType==='foot' || item.ingredientType==='breast') return item.ingredientType;
    if(/(?:^|_)foot(?:_|$)/.test(item.id || '') || item.type==='limb' && /脚/.test(item.name || '')) return 'foot';
    if(/(?:^|_)breast(?:_|$)/.test(item.id || '') || item.type==='limb' && /乳房/.test(item.name || '')) return 'breast';
    return '';
}
function getLimbMeasurements(item) {
    const part=limbMeasurementPart(item), text=`${item?.name || ''} ${item?.desc || ''}`;
    const foot=part==='foot' && (String(item.footSize || '').match(/\d+(?:\.\d+)?/)?.[0] || text.match(/(\d+(?:\.\d+)?)\s*码/)?.[1]);
    const cup=part==='breast' && (String(item.cup || '').match(/[A-Z]/i)?.[0] || text.match(/([A-Z])\s*罩杯/i)?.[1]);
    return {part,footSize:foot?`${foot}码`:'',cup:cup?`${cup.toUpperCase()}罩杯`:''};
}
function normalizeLimbMeasurements(item) {
    if(!item) return item;
    const {part,footSize,cup}=getLimbMeasurements(item);
    if(part) {
        item.name=stripLimbMeasurementSuffix(item.name);
        const value=footSize || cup;
        if(footSize) item.footSize=footSize;
        if(cup) item.cup=cup;
        if(value && !String(item.desc || '').includes(value)) item.desc=`${footSize?'脚码':'尺寸'}：${value}。\n${item.desc || ''}`;
    }
    if(item.generatedLimbs) Object.values(item.generatedLimbs).forEach(parts=>parts.forEach(normalizeLimbMeasurements));
    if(item.limbTemplates) item.limbTemplates.forEach(part=>{part.name=stripLimbMeasurementSuffix(part.name)});
    return item;
}

// 肢体显示名：按品质着色，不带前缀标签
function getLimbDisplayName(item) {
    if (!item) return '';
    normalizeLimbMeasurements(item);
    if (!item.rarity) return item.name;
    return `<span style="color:${getRarityColor(item.rarity)};">${item.name}</span>`;
}

// 列表显示名：肢体按品质着色（无前缀），其余沿用装备前缀规则
function getInventoryDisplayName(item) {
    if (!item) return '';
    normalizeLimbMeasurements(item);
    if (item.id === 'red_banner') return `<span class="item-name--red">${item.name}</span>`;
    if (item.type === 'limb') return getLimbDisplayName(item);
    return item.rarity ? getEquipmentDisplayName(item) : item.name;
}

// 尺寸保留为独立属性参与堆叠，不依赖物品名称中的括号。
function getItemStackKey(item) {
    if (!item) return '';
    normalizeLimbMeasurements(item);
    if (item.id && item.id.includes('corpse')) return item.id;
    if (item.type === 'limb' || limbMeasurementPart(item)) {
        const size=getLimbMeasurements(item);
        return `${item.name}::${item.rarity || 'none'}::${item.score !== undefined ? item.score : 'x'}::${size.footSize}::${size.cup}`;
    }
    return item.name;
}

// ★ 装备显示名：前缀和名称都带品质颜色
function getEquipmentDisplayName(item) {
    if (!item || !item.rarity) return item ? item.name : '';
    const color = getRarityColor(item.rarity);
    const prefix = item.crafted ? '<span style="color:' + color + ';">★</span>' : '';
    const rarityLabel = item.qualityLabel || RARITY_NAMES[item.rarity] || '';
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
    if (item && itemTemplateId(item) === 'removed_ladder') return false;
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
    player.maxExp = getExpRequiredForLevel(player.level);
    while (player.exp >= player.maxExp) {
        player.exp -= player.maxExp;
        player.level++;
        applyPlayerLevelBalance(player, false);
        print("");
        print(`<span style="color: #ffdd44;">═══════════════════════════</span>`);
        print(`<span style="color: #ffdd44; font-weight: bold;">【升级！】等级提升至 ${player.level}！</span>`);
        print(`<span style="color: #aaffaa;">生命值上限: ${player.maxHp}  |  攻击力: ${player.atk}  |  防御力: ${player.def}</span>`);
        print(`<span style="color: #aaffaa;">技力上限: ${player.maxSp}  |  灵巧: ${player.agi}</span>`);
        print(`<span style="color: #ffdd44;">下一级所需经验: ${player.maxExp}</span>`);
        print(`<span style="color: #ffdd44;">═══════════════════════</span>`);
    }
    print(`<span style="color: #888;">当前经验: ${player.exp}/${player.maxExp}</span>`);
}

const MIRROR_TELEPORT_DESTINATIONS = [
    { id: 'mine_gate', name: '矿场大门', roomName: '矿场大门', unlockRoom: 'mine_gate' },
    { id: 'town_square', name: '卡伦镇', roomName: '镇中广场', unlockRoom: 'town_square' },
    { id: 'mysterious_stone_gate', name: '学院遗址', roomName: '神秘的石门', unlockRoom: 'mysterious_stone_gate' }
];

function getMirrorDestinationState() {
    if (!gameState.gameFlags) gameState.gameFlags = {};
    if (!gameState.gameFlags.mirrorDestinations) gameState.gameFlags.mirrorDestinations = {};
    return gameState.gameFlags.mirrorDestinations;
}

function hasMagicMirror() {
    return gameState.player.inventory.some(item => item && item.id === 'magic_mirror') ||
        !!(gameState.player.equipment.accessory && gameState.player.equipment.accessory.id === 'magic_mirror');
}

function recordMirrorDestinationVisit(roomId) {
    const destination = MIRROR_TELEPORT_DESTINATIONS.find(dest => dest.unlockRoom === roomId);
    if (!destination) return;
    const unlocked = getMirrorDestinationState();
    if (unlocked[destination.id]) return;
    unlocked[destination.id] = true;
    if (hasMagicMirror()) {
        print(`<span style="color:#8aa4ff;">🌀 魔镜记录了新的传送点：「${destination.name}」。</span>`);
    }
}

function isMirrorDestinationUnlocked(destination) {
    return !!getMirrorDestinationState()[destination.id];
}

function useMagicMirror() {
    if (!hasMagicMirror()) {
        print(`<span style="color: #ffaaaa;">你没有魔镜！</span>`);
        return;
    }
    clearDetailPanel();
    currentPanel = null;
    let html = makeTitle('🌀 魔镜传送');
    html += `<div style="color: #888; margin-bottom: 8px;">魔镜只会回应你亲自抵达过的传送点：</div>\n`;
    const unlockedDestinations = MIRROR_TELEPORT_DESTINATIONS.filter(isMirrorDestinationUnlocked);
    unlockedDestinations.forEach(dest => {
        const room = gameState.world[dest.id];
        const arrivalName = room ? room.name : dest.roomName;
        html += `<div style="margin: 4px 0;"><span style="color: #6688ff; text-decoration: underline; cursor: pointer;" onclick="teleportViaMirror('${dest.id}')">📍 ${dest.name}</span><small style="color:#718096; margin-left:8px;">${arrivalName}</small></div>\n`;
    });
    if (unlockedDestinations.length === 0) html += `<div style="color:#718096;">尚未记录任何传送点。</div>\n`;
    html += centerLine();
    html += `<div><span style="color: #aaa; cursor: pointer;" onclick="clearDetailPanel()">↩️ 关闭</span></div>`;
    UI.setDetail(html);
    currentPanel = 'mirror_teleport';
}

function teleportViaMirror(roomId) {
    if (battleState.inBattle) { print('战斗中无法使用魔镜。'); return false; }
    const destination = MIRROR_TELEPORT_DESTINATIONS.find(dest => dest.id === roomId);
    if (!destination || !isMirrorDestinationUnlocked(destination)) {
        print(`<span style="color: #ffaaaa;">魔镜尚未记录这个传送点。</span>`);
        return;
    }
    const room = gameState.world[roomId];
    if (!room) {
        print(`<span style="color: #ffaaaa;">传送失败：目的地不存在。</span>`);
        return;
    }
    clearOutput();
    return relocateTo(roomId, { travelText: `魔镜泛起蓝光，你已来到「${room.name}」。` });
}

function isItemSellable(item) {
    if (!item) return false;
    if (item.type === 'skill_book') return false; // 书籍只允许从详情确认出售。
    if (item.id && item.id.includes('corpse')) return false;
    if (item.type === 'limb' || item.story) return false;
    if (item.type === 'important') return false;
    if (item.type === 'readable') return false;
    if (item.id === 'gold_coin') return false;
    return true;
}

function getItemSellPrice(item) {
    if (!item) return 0;
    if (Number.isFinite(item.sellPrice)) return item.sellPrice;
    if (item.type === 'weapon' || item.type === 'armor' || item.type === 'accessory') {
        const atk = item.atk || 0;
        const def = item.def || 0;
        const agi = Math.abs(item.agi || 0);
        let price = atk * 3 + def * 3 + agi * 2;
        if (item.rarity) {
            const rarityMultiplier = { normal: 1, good: 1.5, rare: 2.5, epic: 4, legendary: 8, mythic: 12 };
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
    if (typeof itemTemplateId === 'function') return ['knight_greatsword','crafted_knight_greatsword'].includes(itemTemplateId(eq.weapon)) && ['knight_armor','crafted_knight_armor'].includes(itemTemplateId(eq.armor)) && itemTemplateId(eq.accessory)==='knight_emblem';
    return eq.weapon && (eq.weapon.id === 'knight_greatsword' || eq.weapon.id.startsWith('crafted_knight_greatsword'))
        && eq.armor && (eq.armor.id === 'knight_armor' || eq.armor.id.startsWith('crafted_knight_armor'))
        && eq.accessory && eq.accessory.id === 'knight_emblem';
}

// 装備变动只刷新技能条件，不授予或删除技能。
function checkKnightSetChange() {
    if (typeof ensureSkillProgress === 'function') ensureSkillProgress();
}

function showStatus() {
    const p = gameState.player;
    const gold = p.gold || 0;
    print(`<span style="color: #c3b38d;">👤 ${p.name}  |  ❤️ HP: ${p.hp}/${p.maxHp}  |  💰 ${gold}金币  |  📍 ${gameState.world[p.location].name}</span>`);
}
