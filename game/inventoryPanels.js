// ============================================================
//  game/inventoryPanels.js - 背包/装备/状态/技能面板
// ============================================================

function showInventoryPanel() {
    if (currentPanel === 'inventory') { clearDetailPanel(); currentPanel = null; return; }
    let html = makeTitle('行囊物品');
    html += generateInventoryCategoryMenu('all');
    const inv = gameState.player.inventory;
    html += renderInventoryEntries(inv, '你的行囊空空如也。');
    html += makePanelFooter('showInventoryPanel()', '关闭物品栏');
    UI.setDetail(html); currentPanel = 'inventory';
}

const LIMB_INVENTORY_OWNERS = [
    { id: 'cecilia', name: '塞西莉亚', prefixes: ['cecilia'] },
    { id: 'isabella', name: '伊莎贝拉', prefixes: ['isabella'] },
    { id: 'liana', name: '莉娅娜', prefixes: ['liana'] },
    { id: 'huasha', name: '华沙', prefixes: ['huasha'] },
    { id: 'elaine', name: '艾琳', prefixes: ['elaine'] },
    { id: 'mandorola', name: '曼德罗拉', prefixes: ['mandorola'] },
    { id: 'aisha', name: '艾莎', prefixes: ['aisha'] },
    { id: 'sophie', name: '索菲', prefixes: ['sophie'] },
    { id: 'elena', name: '艾莲娜', prefixes: ['elena'] },
    { id: 'serena', name: '瑟蕾娜', prefixes: ['serena'] },
    { id: 'mara', name: '玛拉', prefixes: ['mara'] },
    { id: 'other', name: '其他', prefixes: [] }
];

function isLimbInventoryItem(item) {
    return !!item && (item.type === 'limb' || item.id.includes('corpse') || item.story || item.ingredientType || item.dismemberable || item.milkItem);
}

function getLimbInventoryOwnerId(item) {
    const id = String(item && item.id || '').toLowerCase();
    for (const owner of LIMB_INVENTORY_OWNERS) {
        if (owner.id === 'other') continue;
        if (owner.prefixes.some(prefix => id === `${prefix}_corpse` || id.startsWith(`${prefix}_`) || id.startsWith(`corpse_${prefix}_`))) return owner.id;
    }
    return 'other';
}

function getOwnedLimbGroups(items) {
    const grouped = new Map(LIMB_INVENTORY_OWNERS.map(owner => [owner.id, { ...owner, items: [] }]));
    items.forEach(item => grouped.get(getLimbInventoryOwnerId(item)).items.push(item));
    return LIMB_INVENTORY_OWNERS.map(owner => grouped.get(owner.id)).filter(group => group.items.length > 0);
}

function getInventoryEntryStackKey(item) {
    const equipmentTypes = ['weapon', 'armor', 'accessory'];
    if (equipmentTypes.includes(item.type)) {
        return [item.id, item.rarity || '', item.score ?? '', item.atk ?? '', item.def ?? '', item.agi ?? ''].join('::');
    }
    if (isLimbInventoryItem(item)) return getItemStackKey(item);
    return [getItemStackKey(item), item.effect || '', item.value ?? ''].join('::');
}

function groupInventoryEntries(items) {
    const groups = [];
    const byKey = new Map();
    items.forEach(item => {
        const key = getInventoryEntryStackKey(item);
        let group = byKey.get(key);
        if (!group) {
            group = { key, item, count: 0 };
            byKey.set(key, group);
            groups.push(group);
        }
        group.count++;
    });
    return groups;
}

function renderInventoryEntries(items, emptyText) {
    if (!items || items.length === 0) return `<div class="detail-empty detail-empty--compact">${emptyText}</div>`;
    let html = `<div class="inventory-grid">`;
    groupInventoryEntries(items).forEach(({ item, key, count }) => {
        const displayName = getInventoryDisplayName(item);
        const itemType = getItemTypeName(item.type);
        const stackKey = encodeURIComponent(key).replace(/'/g, '%27');
        const countLabel = count > 1 ? `<span class="inventory-entry__count">×${count}</span>` : '';
        html += `<div class="inventory-entry" onclick="examineItemFromPanel('${item.id}','${stackKey}')"><span class="inventory-entry__icon">${getInventoryItemVisual(item)}</span><span class="inventory-entry__name">${displayName}${countLabel}</span><small>${itemType}</small></div>`;
    });
    return html + `</div>`;
}

function getInventoryItemVisual(item) {
    if (item && item.thumbnail) {
        const scaleStyle = item.thumbnailScale ? ` style="--item-thumbnail-scale:${item.thumbnailScale}"` : '';
        return `<img class="inventory-entry__thumbnail" src="${item.thumbnail}" alt="" loading="lazy"${scaleStyle}${item.thumbnailCutout ? ` onload="applyCutoutThumbnail(this)"` : ''}>`;
    }
    return getItemEmoji(item);
}

function getItemDetailHeading(item, displayName) {
    const scaleStyle = item && item.thumbnailScale ? ` style="--item-thumbnail-scale:${item.thumbnailScale}"` : '';
    const visual = item && item.thumbnail
        ? `<img class="item-detail-heading__thumbnail" src="${item.thumbnail}" alt="" loading="lazy"${scaleStyle}${item.thumbnailCutout ? ` onload="applyCutoutThumbnail(this)"` : ''}>`
        : `<span class="item-detail-heading__emoji">${getItemEmoji(item)}</span>`;
    return `<span class="item-detail-heading">${visual}<span>${displayName}</span></span>`;
}

function generateInventoryCategoryMenu(active = 'all') {
    const tab = (id, label, action) => `<span class="panel-tab ${active === id ? 'panel-tab--active' : ''}" onclick="${action}">${label}</span>`;
    return `<div class="panel-tabs">` +
           tab('all', '全部', 'showInventoryAll()') +
           tab('consumable', '消耗品', "showInventoryCategory('consumable')") +
           tab('skill_book', '技能书', "showInventoryCategory('skill_book')") +
           tab('important', '重要道具', "showInventoryCategory('important')") +
           tab('limb', '肢体', "showInventoryCategory('limb')") +
           tab('misc', '杂物', "showInventoryCategory('misc')") + `</div>`;
}

function showInventoryCategory(category) {
    if (category === 'limb') { showInventoryLimbCategory(); return; }
    const categoryName = category === 'skill_book' ? '技能书' : category === 'consumable' ? '消耗品' : category === 'important' ? '重要道具' : category === 'limb' ? '肢体' : '杂物';
    let html = makeTitle(`行囊物品 - ${categoryName}`);
    html += generateInventoryCategoryMenu(category);
    const inv = gameState.player.inventory;
    let filtered = [];
    switch (category) {
        case 'skill_book': filtered = inv.filter(i => i.type === 'skill_book'); break;
        case 'consumable': filtered = inv.filter(i => i.type === 'consumable'); break;
        case 'important': filtered = inv.filter(i => i.type === 'readable' || i.id.includes('key') || i.id.includes('note')); break;
        case 'limb': filtered = inv.filter(i => i.id.includes('corpse') || i.story || i.ingredientType || i.dismemberable || i.milkItem); break;
        case 'misc': filtered = inv.filter(i => i.type === 'misc' && !i.id.includes('corpse') && !i.story && !i.ingredientType && !i.dismemberable && !i.milkItem); break;
    }
    html += renderInventoryEntries(filtered, '该分类下没有物品。');
    html += makePanelFooter('showInventoryPanel()', '返回物品栏', '←');
    UI.setDetail(html); currentPanel = 'inventory';
}

function showInventoryLimbCategory(activeOwnerId = '') {
    const limbItems = gameState.player.inventory.filter(isLimbInventoryItem);
    const groups = getOwnedLimbGroups(limbItems);
    let html = makeTitle('行囊物品 - 肢体') + generateInventoryCategoryMenu('limb');
    if (groups.length === 0) {
        html += `<div class="detail-empty detail-empty--compact">尚未获得任何肢体或尸体。</div>`;
    } else {
        const activeGroup = groups.find(group => group.id === activeOwnerId) || groups[0];
        html += `<div class="limb-browser"><nav class="limb-browser__owners"><div class="limb-browser__label">角色目录</div>`;
        groups.forEach(group => {
            const activeClass = group.id === activeGroup.id ? ' limb-owner--active' : '';
            html += `<button type="button" class="limb-owner${activeClass}" onclick="showInventoryLimbCategory('${group.id}')"><span>${group.name}</span><small>${group.items.length}</small></button>`;
        });
        html += `</nav><section class="limb-browser__items"><div class="limb-browser__heading"><b>${activeGroup.name}</b><small>拥有 ${activeGroup.items.length} 件</small></div>`;
        html += renderInventoryEntries(activeGroup.items, '该角色名下没有肢体。');
        html += `</section></div>`;
    }
    html += makePanelFooter('showInventoryPanel()', '返回物品栏', '←');
    UI.setDetail(html); currentPanel = 'inventory';
}

function showInventoryAll() {
    let html = makeTitle('行囊物品'); html += generateInventoryCategoryMenu('all');
    const inv = gameState.player.inventory;
    html += renderInventoryEntries(inv, '你的行囊空空如也。');
    html += makePanelFooter('showInventoryPanel()', '关闭物品栏');
    UI.setDetail(html); currentPanel = 'inventory';
}

function examineItemFromPanel(itemId, encodedStackKey = '') {
    const stackKey = encodedStackKey ? decodeURIComponent(encodedStackKey) : '';
    const item = stackKey
        ? gameState.player.inventory.find(candidate => candidate.id === itemId && getInventoryEntryStackKey(candidate) === stackKey)
        : findItemById(itemId);
    if (!item) { print("物品不存在。"); return; }
    const nameDisplay = getInventoryDisplayName(item);
    const meta = item.rarity ? `${getItemTypeName(item.type)} · ${item.qualityLabel || getQualityName(item.rarity)}` : getItemTypeName(item.type);
    let html = makeTitle('物品详情') + `<div class="detail-card ${item.detailImage ? 'detail-card--with-image' : ''}"><div class="detail-card__header">${getItemDetailHeading(item, nameDisplay)}<span class="detail-card__badge">${meta}</span></div>`;
    if (item.detailImage) html += `<button class="item-detail-visual" type="button" title="点击查看大图" onclick="openNPCPortrait(this.querySelector('img'))"><img src="${item.detailImage}" alt="${nameDisplay}细节图" loading="eager"><span>点击查看大图</span></button>`;
    if (item.desc) html += `<div class="detail-card__desc">${item.desc}</div>`;
    if (item.score !== undefined || item.atk || item.def || item.agi) {
        html += `<div class="equipment-summary"><div>评分<b>${item.score !== undefined ? item.score : '—'}</b></div><div>攻击<b>${item.atk ? '+' + item.atk : '—'}</b></div><div>防御/灵巧<b>${item.def ? '+' + item.def : (item.agi ? '+' + item.agi : '—')}</b></div></div>`;
    }
    if (item.maxHpPercent && item.maxHpPercent < 0) html += `<div class="quest-condition" style="border-left-color:#9f4650;color:#dc8c94;">诅咒：最大生命值 ${Math.round(item.maxHpPercent * 100)}%</div>`;
    if (item.effect === 'heal') html += `<div class="quest-condition">效果：恢复 ${item.value} 点生命</div>`;
    else if (item.effect) html += `<div class="quest-condition">效果：${item.effect} 永久 +${item.value}</div>`;
    html += `</div><div class="detail-action-grid">`;
    if (item.id && item.id.includes('corpse')) {
        if (item.corpseStory) html += `<span class="detail-action" onclick="useCorpse('${item.id}')">🔞 互动</span>`;
        if (item.loot && item.loot.length > 0) html += `<span class="detail-action" onclick="lootCorpseFromInventory('${item.id}')">✨ 搜刮</span>`;
        if (item.dismemberable) html += `<span class="detail-action detail-action--danger" onclick="dismemberCorpseFromInventory('${item.id}')">🔪 肢解</span>`;
    } else if (item.id === 'magic_mirror') {
        html += `<span class="detail-action" onclick="useMagicMirror()">🌀 传送</span><span class="detail-action detail-action--good" onclick="equipItemFromDetail('${item.id}')">⚔️ 装备</span>`;
    } else if (item.type === 'weapon' || item.type === 'armor' || item.type === 'accessory') html += `<span class="detail-action detail-action--good" onclick="equipItemFromDetail('${item.id}')">⚔️ 装备</span>`;
    else if (item.type === 'consumable') html += `<span class="detail-action detail-action--good" onclick="useItemFromDetail('${item.id}')">🧪 使用</span>`;
    else if (item.type === 'readable') html += `<span class="detail-action detail-action--good" onclick="readItemFromDetail('${item.id}')">📖 阅读</span>`;
    else if (item.type === 'skill_book') {
        if (item.skillId && PLAYER_SKILL_DEFINITIONS[item.skillId]) {
            const learned = skillLevel(item.skillId) > 0;
            const levelRequired = PLAYER_SKILL_DEFINITIONS[item.skillId].learnLevel;
            const disabled = battleState.inBattle || (!learned && gameState.player.level < levelRequired);
            html += `<button onclick="useSkillBookFromInventory('${item.id}',${learned})" ${disabled ? 'disabled' : ''}>${learned ? '已学会 · 转为同阶研习册' : '📖 学习技能'}</button>`;
            if (!learned && gameState.player.level < levelRequired) html += `<span>需要角色等级 ${levelRequired}</span>`;
        } else html += '<span>升级材料：在下方「技能」栏选择已学技能，进入详情升级。</span>';
        html += `<button onclick="sellSkillBookFromDetail('${item.id}')" ${battleState.inBattle ? 'disabled' : ''}>确认出售书籍</button>`;
    }
    else if (item.story) html += `<span class="detail-action" onclick="useLimb('${item.id}')">🔍 互动</span>`;
    else if (itemTemplateId(item) === 'removed_ladder') html += `<span class="detail-action detail-action--good" onclick="useRemovedLadder('${item.id}')">🪜 使用梯子</span>`;
    html += `<span class="detail-action detail-action--danger" onclick="dropItemFromInventory('${item.id}')">🗑️ 丢弃</span></div>`;
    html += makePanelFooter('showInventoryPanel()', '返回物品栏', '←');
    UI.setDetail(html); currentPanel = 'item_detail';
}

function showTradePanel() { clearDetailPanel(); currentPanel = null; const gold = gameState.player.gold || 0; const inv = gameState.player.inventory; const sellableItems = inv.filter(item => isItemSellable(item)); let html = makeTitle('💰 出售物品') + `<div style="text-align:center; color:#ffdd44;">当前金币：${gold}</div>\n` + centerLine(); if (sellableItems.length === 0) { html += `<div style="color:#888;">背包中没有可出售的物品。</div>\n`; } else { html += `<div style="color:#aaffaa;font-weight:bold;">可出售的物品：</div>\n`; sellableItems.forEach(item => { const price = getItemSellPrice(item); const displayName = item.rarity ? getEquipmentDisplayName(item) : item.name; html += `<div style="margin:4px 0;"><span style="color:#ffaa00;text-decoration:underline;cursor:pointer;" onclick="sellItemFromTrade('${item.id}')">💰 ${price}金币</span> ▫️ ${displayName}</div>\n`; }); } html += centerLine() + `<div><span style="color:#aaa;cursor:pointer;" onclick="clearDetailPanel()">↩️ 关闭</span></div>`; UI.setDetail(html); currentPanel = 'trade'; }

function sellItemFromTrade(itemId) { const item = findItemById(itemId); if (!item) { print("物品不存在。"); return; } const price = getItemSellPrice(item); removeItemFromInventory(itemId); gameState.player.gold = (gameState.player.gold || 0) + price; print(`<span style="color:#ffaa00;">你出售了「${item.name}」，获得了 ${price} 金币。</span>`); print(`<span style="color:#ffdd44;">当前金币：${gameState.player.gold}</span>`); showTradePanel(); }

function equipItemFromDetail(itemId) {
    const player = gameState.player;
    const index = player.inventory.findIndex(i => i.id === itemId);
    if (index === -1) { print("你没有这件物品。"); return; }
    const item = player.inventory[index];
    if (!['weapon', 'armor', 'accessory'].includes(item.type)) { print(`「${item.name}」无法装备。`); return; }
    const slot = item.slot || item.type;
    const current = player.equipment[slot];
    if (current) {
        player.inventory.push(current);
        print(`你卸下了「${current.name}」。`);
    }
    player.inventory.splice(index, 1);
    player.equipment[slot] = item;
    refreshPlayerMaxHp(player);
    if (item.maxHpPercent && item.maxHpPercent < 0) {
        print(`<span style="color:#ff6666;">诅咒生效！最大生命值降低至${player.maxHp}。</span>`);
    } else {
        const equipDisplayName = item.rarity ? getEquipmentDisplayName(item) : item.name;
        print(`你装备了「${equipDisplayName}」。`);
    }
    checkKnightSetChange();
    clearDetailPanel();
    showInventoryPanel();
    StoryEngine.check();
}

function useItemFromDetail(itemId) {
    if (itemId === 'sanghuashan_mine') return;
    const item = findItemById(itemId);
    if (!item) return;
    if (item.type === 'consumable' && item.effect === 'heal') {
        gameState.player.hp = Math.min(gameState.player.maxHp, gameState.player.hp + (item.value || 10));
        print(`你使用了「${item.name}」，恢复了${item.value || 10}点生命。`);
        removeItemFromInventory(itemId);
    } else if (addPlayerPermanentBonus(gameState.player, item.effect, item.value)) {
        print(`你食用了「${item.name}」，${item.effect === 'all' ? '所有属性' : ''}永久提升${item.value}点！`);
        removeItemFromInventory(itemId);
    } else {
        print(`你使用了「${item.name}」，但没什么效果。`);
    }
    clearDetailPanel();
    showInventoryPanel();
}

function readItemFromDetail(itemId) { const item = findItemById(itemId); if (!item) return; clearDetailPanel(); currentPanel = null; if (item.content && Array.isArray(item.content)) { print(`你打开「${item.name}」……`); print("<br>"); if (typeof StoryEngine !== 'undefined') { StoryEngine.playLines({ lines: item.content, color: '#ffdd44', useNextBtn: true, addLineBreaks: false, onComplete: () => { print("────────────────"); if (!gameState.gameFlags) gameState.gameFlags = {}; gameState.gameFlags[`read_${itemId}`] = true; StoryEngine.markConditionProgress('read_item', itemId); } }); } } }

function showEquipmentPanel() {
    if (currentPanel === 'equipment') { clearDetailPanel(); currentPanel = null; return; }
    const slotInfo = {
        weapon: { name: '武器', icon: '⚔️' },
        armor: { name: '防具', icon: '🛡️' },
        accessory: { name: '饰品', icon: '💠' }
    };
    let html = makeTitle('当前装备') + `<div class="equipment-slots">`;
    Object.keys(slotInfo).forEach(slot => {
        const item = gameState.player.equipment[slot];
        const equipName = item ? (item.rarity ? getEquipmentDisplayName(item) : item.name) : '尚未装备';
        html += `<div class="equipment-slot" ${item ? `onclick="examineEquippedItem('${slot}')"` : ''}><span class="equipment-slot__icon">${slotInfo[slot].icon}</span><small>${slotInfo[slot].name}</small>`;
        html += item ? `<span>${equipName}</span>` : `<span style="color:#596a7c;">${equipName}</span>`;
        html += `</div>`;
    });
    html += `</div><div class="equipment-summary"><div>攻击<b>${getCharacterAttack(gameState.player)}</b></div><div>防御<b>${getCharacterDefense(gameState.player)}</b></div><div>灵巧<b>${getCharacterAgility(gameState.player)}</b></div></div>`;
    if (typeof renderMagicDollInterface === 'function') html += renderMagicDollInterface();
    html += makePanelFooter('showEquipmentPanel()', '关闭装备栏');
    UI.setDetail(html); currentPanel = 'equipment';
}

function examineEquippedItem(slotKey) {
    const item = gameState.player.equipment[slotKey]; if (!item) return;
    const displayName = item.rarity ? getEquipmentDisplayName(item) : item.name;
    let html = makeTitle('装备详情') + `<div class="detail-card"><div class="detail-card__header"><span>${getItemEmoji(item)} ${displayName}</span><span class="detail-card__badge">${getItemTypeName(item.type)}</span></div>`;
    if (item.desc) html += `<div class="detail-card__desc">${item.desc}</div>`;
    html += `<div class="equipment-summary"><div>攻击<b>+${item.atk || 0}</b></div><div>防御<b>+${item.def || 0}</b></div><div>灵巧<b>+${item.agi || 0}</b></div></div></div>`;
    html += `<div class="detail-action-grid"><span class="detail-action detail-action--danger" onclick="unequipItem('${slotKey}')">⬇️ 卸下装备</span></div>`;
    html += makePanelFooter('showEquipmentPanel()', '返回装备栏', '←');
    UI.setDetail(html); currentPanel = 'equipped_detail';
}

function unequipItem(slotKey) {
    const player = gameState.player;
    const item = player.equipment[slotKey];
    if (!item) return;
    player.inventory.push(item);
    player.equipment[slotKey] = null;
    refreshPlayerMaxHp(player);
    print(`你卸下了「${item.name}」。`);
    checkKnightSetChange();
    clearDetailPanel();
    showEquipmentPanel();
}

function showStatusPanel() {
    if (currentPanel === 'status') { clearDetailPanel(); currentPanel = null; return; }
    const p = gameState.player;
    const hpPercent = Math.max(0, Math.min(100, Math.floor((p.hp / p.maxHp) * 100)));
    const spPercent = Math.max(0, Math.min(100, Math.floor(((p.sp || 0) / (p.maxSp || 1)) * 100)));
    const expPercent = Math.max(0, Math.min(100, Math.floor((p.exp / p.maxExp) * 100)));
    let html = makeTitle('角色状态');
    html += `<div class="status-heading"><span>👤 ${p.name}</span><small>等级 ${p.level}</small></div>`;
    html += `<div class="status-resource"><div><span>❤️ 生命</span><b>${p.hp}/${p.maxHp}</b></div><div class="status-track"><i class="status-fill status-fill--hp" style="width:${hpPercent}%"></i></div></div>`;
    html += `<div class="status-resource"><div><span>⚡ 技力</span><b>${p.sp || 0}/${p.maxSp || 0}</b></div><div class="status-track"><i class="status-fill status-fill--sp" style="width:${spPercent}%"></i></div></div>`;
    html += `<div class="status-resource"><div><span>📊 经验</span><b>${p.exp}/${p.maxExp}</b></div><div class="status-track"><i class="status-fill status-fill--exp" style="width:${expPercent}%"></i></div></div>`;
    html += `<div class="status-stat-grid"><div><span>⚔️ 攻击</span><b>${getCharacterAttack(p)}</b></div><div><span>🛡️ 防御</span><b>${getCharacterDefense(p)}</b></div><div><span>💨 灵巧</span><b>${getCharacterAgility(p)}</b></div><div><span>💰 金币</span><b>${p.gold || 0}</b></div></div>`;
    html += centerLine() + `<div class="status-note">多年矿场的折磨锤炼了你一身如钢铁般的肌肉。</div>`;
    html += makePanelFooter('showStatusPanel()', '关闭人物详情');
    UI.setDetail(html); currentPanel = 'status';
}

function showQuestsPanel() { if (currentPanel === 'quests') { clearDetailPanel(); currentPanel = null; return; } showQuestsTab('incomplete'); }

function showQuestsTabBar(active) {
    const t = (id, label) => `<span class="panel-tab ${active === id ? 'panel-tab--active' : ''}" onclick="showQuestsTab('${id}')">${label}</span>`;
    return `<div class="panel-tabs">${t('incomplete', '进行中')}${t('completed', '已完成')}${t('faction', '势力任务')}</div>`;
}

function showFactionQuestsTab() {
    const f = (typeof getFaction === 'function') ? getFaction() : null;
    let html = makeTitle('任务日志') + showQuestsTabBar('faction') + centerLine();
    if (!f || !f.joined) {
        html += `<div style="color:#888;">你尚未加入任何势力。</div>\n`;
        html += makePanelFooter('showQuestsPanel()', '关闭任务栏');
        UI.setDetail(html); currentPanel = 'quests'; return;
    }

    html += `<div class="detail-card"><div class="detail-card__header"><span>☠️ 势力：灭绝</span><span class="detail-card__badge">等级 ${f.level || 1}</span></div><div class="equipment-summary"><div>名望<b>${f.renown || 0}</b></div><div>势力等级<b>${f.level || 1}</b></div><div>悬赏数<b>${(gameState.bountyState && gameState.bountyState.activeBounties ? gameState.bountyState.activeBounties.length : 0)}</b></div></div></div>`;
    const nextReq = (typeof FACTION_LEVEL_UP_REQUIREMENTS !== 'undefined') ? FACTION_LEVEL_UP_REQUIREMENTS[f.level + 1] : null;
    if (nextReq) html += `<div style="color:#888;">升到 ${f.level + 1} 级需要名望 ${nextReq}。</div>\n`;
    else html += `<div style="color:#888;">已达最高等级。</div>\n`;
    html += centerLine();

    const active = gameState.bountyState && gameState.bountyState.activeBounties ? gameState.bountyState.activeBounties : [];
    if (active.length === 0) {
        html += `<div style="color:#888;">当前没有进行中的势力悬赏。</div>\n`;
    } else {
        html += `<div class="panel-section-label">进行中的悬赏</div><div class="quest-list">`;
        active.forEach(b => {
            const room = gameState.world[b.roomId];
            const roomName = room ? room.name : '未知';
            const roomNum = room && room.roomNumber ? ('#' + room.roomNumber + ' ') : '';
            html += `<div class="quest-card"><span class="quest-card__icon">⭐${b.stars}</span><span>${b.name}</span><small>📍 ${roomNum}${roomName}</small></div>`;
        });
        html += `</div>`;
    }

    html += makePanelFooter('showQuestsPanel()', '关闭任务栏');
    UI.setDetail(html);
    currentPanel = 'quests';
}

function showQuestsTab(tab) {
    if (tab === 'faction') { showFactionQuestsTab(); return; }
    let html = makeTitle('任务日志') + showQuestsTabBar(tab);
    const allMainQuests = [], allSideQuests = [];
    const storyEngineQuests = (typeof StoryEngine !== 'undefined') ? StoryEngine.registry : new Map();
    const triggeredQuestIds = new Set((typeof StoryEngine !== 'undefined') ? [...StoryEngine.activeQuests, ...StoryEngine.completedQuests] : []);
    storyEngineQuests.forEach((story, id) => {
        if (story.type !== 'main' && story.type !== 'side') return;
        if (!triggeredQuestIds.has(id)) return;
        const isCompleted = (typeof StoryEngine !== 'undefined') && StoryEngine.completedQuests.includes(id);
        if (tab === 'completed' && !isCompleted) return;
        if (tab === 'incomplete' && isCompleted) return;
        const questInfo = { id, name: story.name || id, description: story.description || '', type: story.type, startStory: story.startStory || [], completeStory: story.completeStory || [], conditions: story.conditions };
        if (story.type === 'main') allMainQuests.push(questInfo); else allSideQuests.push(questInfo);
    });
    const renderQuestGroup = (label, quests, type) => {
        if (quests.length === 0) return '';
        let group = `<div class="panel-section-label">${label}</div><div class="quest-list">`;
        quests.forEach(q => {
            const icon = type === 'main' ? '📜' : '📋';
            const kind = type === 'main' ? '主线' : '支线';
            group += `<div class="quest-card ${type === 'side' ? 'quest-card--side' : ''}" onclick="showQuestDetail('${q.id}','${tab}')"><span class="quest-card__icon">${icon}</span><span>${q.name}</span><small>${kind}</small></div>`;
        });
        return group + `</div>`;
    };
    html += renderQuestGroup('主线任务', allMainQuests, 'main');
    html += renderQuestGroup('支线任务', allSideQuests, 'side');
    if (allMainQuests.length === 0 && allSideQuests.length === 0) html += `<div class="detail-empty detail-empty--compact">${tab === 'completed' ? '暂无已完成任务' : '暂无进行中的任务'}</div>`;
    html += makePanelFooter('showQuestsPanel()', '关闭任务栏');
    UI.setDetail(html); currentPanel = 'quests';
}

function showQuestDetail(questId, tab) {
    let story;
    if (typeof StoryEngine !== 'undefined') story = StoryEngine.registry.get(questId);
    if (!story) {
        const q = gameState.quests.main.find(q => q.id === questId) || gameState.quests.side.find(q => q.id === questId);
        if (!q) { UI.setDetail(makeTitle('错误') + '找不到任务信息'); return; }
        story = { name: q.name, description: q.description, type: 'main' };
    }
    const isCompleted = (typeof StoryEngine !== 'undefined') && StoryEngine.completedQuests.includes(questId);
    const typeName = story.type === 'main' ? '主线任务' : '支线任务';
    let html = makeTitle(story.name) + `<div class="detail-card"><div class="detail-card__header"><span>${story.type === 'main' ? '📜' : '📋'} ${story.name}</span><span class="detail-card__badge">${isCompleted ? '已完成' : typeName}</span></div><div class="detail-card__desc">${story.description || '暂无任务说明。'}</div></div>`;
    if (isCompleted && ((story.startStory && story.startStory.length) || (story.completeStory && story.completeStory.length))) {
        html += `<div class="detail-action-grid">`;
        if (story.startStory && story.startStory.length) html += `<span class="detail-action" onclick="replayStory('${questId}','start')">🎬 触发剧情</span>`;
        if (story.completeStory && story.completeStory.length) html += `<span class="detail-action" onclick="replayStory('${questId}','complete')">🎬 完成剧情</span>`;
        html += `</div>`;
    }
    if (story.conditions) {
        html += `<div class="panel-section-label">完成条件</div>`;
        if (story.conditions.type === 'single') html += `<div class="quest-condition">◆ ${story.conditions.label || story.conditions.condValue}</div>`;
        else if (story.conditions.type === 'composite') story.conditions.subConditions.forEach((cond, i) => { html += `<div class="quest-condition">${i + 1}. ${cond.label || cond.item || cond.condValue}</div>`; });
    }
    html += makePanelFooter(`showQuestsTab('${tab}')`, '返回任务列表', '←');
    UI.setDetail(html); currentPanel = 'quest_detail';
}

function showSkillsPanel() {
    if (typeof battleState !== 'undefined' && battleState.inBattle) { UI.setDetail(renderBattleDetail()); return; }
    if (currentPanel === 'skills') { clearDetailPanel(); currentPanel = null; return; }
    let html = makeTitle('技能总览');
    if (typeof ensureSkillProgress === 'function') ensureSkillProgress();
    const playerSkills = (gameState.player.skills || []).filter(id => skills[id] && !skills[id].npcOnly && (typeof skillLevel !== 'function' || skillLevel(id) > 0));
    if (playerSkills.length === 0) html += `<div class="detail-empty detail-empty--compact">暂无已学技能。获得技能原典后，请在背包中点击原典进行学习。</div>`;
    else {
        html += `<div class="skill-list">`;
        playerSkills.forEach(sId => {
            const s = skills[sId];
            const managed = typeof PLAYER_SKILL_DEFINITIONS !== 'undefined' && PLAYER_SKILL_DEFINITIONS[sId];
            html += `<div class="skill-card" onclick="showSkillDetail('${sId}')"><div class="skill-card__top"><span>${managed ? `${RARITY_NAMES[s.rarity]} · ` : '✨ '}${s.name}${managed ? ` Lv.${skillLevel(sId)}` : ''}</span><b>${managed ? skillSpCost(sId) : s.cost} SP</b></div><p>${managed ? skillEffectText(sId) : s.description || '暂无技能说明'}</p><small>点击查看详情${managed ? '／升级' : ''}</small></div>`;
        });
        html += `</div>`;
    }
    html += makePanelFooter('showSkillsPanel()', '关闭技能栏');
    UI.setDetail(html); currentPanel = 'skills';
}

function showSkillDetail(skillId) {
    if (typeof battleState !== 'undefined' && battleState.inBattle) { UI.setDetail(renderBattleDetail()); return; }
    const skill = skills[skillId];
    if (!skill || skill.npcOnly || !gameState.player.skills?.includes(skillId)) { print("尚未学习此技能。"); return; }
    if (typeof PLAYER_SKILL_DEFINITIONS !== 'undefined' && PLAYER_SKILL_DEFINITIONS[skillId]) {
        const lv = skillLevel(skillId), cost = lv < 5 ? SKILL_UPGRADE_COSTS[skill.rarity][lv-1] : 0;
        if (!lv) { print('尚未学习此技能。'); return; }
        const owned = bookCount(`training_book_${skill.rarity}`);
        let html = makeTitle('技能详情') + `<div class="detail-card"><div class="detail-card__header"><span style="color:${RARITY_COLORS[skill.rarity]}">${RARITY_NAMES[skill.rarity]} · ${skill.name} Lv.${lv}</span><span class="detail-card__badge">消耗 ${skillSpCost(skillId)} SP</span></div><p>${skillEffectText(skillId)}</p><p>武器条件：${skill.requireKnightSet ? '骑士三件套' : (skill.categories || []).map(id=>WEAPON_CATEGORIES[id]).join('／') || '无武器限制'}${skill.categories?.some(id=>['greatsword','mining_tool','blunt'].includes(id)) ? '；需双手持握' : ''}</p><p>${skill.once ? '每场战斗一次' : `冷却 ${skill.cooldown || 0} 回合`}</p>`;
        if (cost) html += `<p>下一级 Lv.${lv+1}：${skillEffectText(skillId,lv+1)} · SP ${skillSpCost(skillId,lv+1)}</p><p>${RARITY_NAMES[skill.rarity]}技能研习册：${owned} / ${cost}</p><button onclick="upgradeLearnedSkill('${skillId}',${lv})" ${owned < cost ? 'disabled' : ''}>升级${owned < cost ? '（研习册不足）' : ''}</button>`;
        else html += '<p>已满级（Lv.5）</p>';
        html += '</div>' + makePanelFooter('showSkillsPanel()', '返回技能栏', '←');
        UI.setDetail(html); currentPanel='skill_detail'; return;
    }
    let html = makeTitle('技能详情') + `<div class="detail-card"><div class="detail-card__header"><span>✨ ${skill.name}</span><span class="detail-card__badge">消耗 ${skill.cost} SP</span></div><div class="detail-card__desc">${skill.description || '暂无技能说明。'}</div></div>`;
    html += makePanelFooter('showSkillsPanel()', '返回技能栏', '←');
    UI.setDetail(html); currentPanel = 'skill_detail';
}

// ★ 任务回顾剧情：手动播放 + 橙色
function replayStory(questId, type) {
    let story;
    if (typeof StoryEngine !== 'undefined') story = StoryEngine.registry.get(questId);
    if (!story) return;
    const lines = type === 'start' ? story.startStory : story.completeStory;
    if (!lines || lines.length === 0) return;
    clearDetailPanel(); currentPanel = null;
    print("");
    print(`<span style="color: #888;">═══════════════════════════</span>`);
    StoryEngine.playLines({
        lines: lines, color: '#ffaa66', useNextBtn: true,
        onStart: () => { UI.setOverlay(true); },
        onComplete: () => {
            print(`<span style="color: #888;">═══════════════════════════</span>`);
            UI.setOverlay(false);
        }
    });
}

function showInventory() { currentPanel = null; showInventoryPanel(); }
