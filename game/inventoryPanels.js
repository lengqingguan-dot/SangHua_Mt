// ============================================================
//  game/inventoryPanels.js - 背包/装备/状态/技能面板
// ============================================================

function showInventoryPanel() {
    if (currentPanel === 'inventory') { clearDetailPanel(); currentPanel = null; return; }
    let html = makeTitle('行囊物品');
    html += `<div style="text-align:center;">${generateInventoryCategoryMenu()}</div>`;
    const inv = gameState.player.inventory;
    if (inv.length === 0) { html += `你的行囊空空如也。\n`; }
    else { inv.forEach(item => { const displayName = item.rarity ? getEquipmentDisplayName(item) : item.name; html += `  ▫️ <span style="text-decoration:underline;cursor:pointer;" onclick="examineItemFromPanel('${item.id}')">${displayName}</span> ${getItemEmoji(item)}\n`; }); }
    html += centerLine() + `<div style="text-align:center;"><span style="color:#aaa;cursor:pointer;" onclick="showInventoryPanel()">↩️ 关闭</span></div>`;
    UI.setDetail(html); currentPanel = 'inventory';
}

function generateInventoryCategoryMenu() {
    return `<span style="color:#b7c9e2;text-decoration:underline;cursor:pointer;margin:0 10px;" onclick="showInventoryAll()">全部</span>` +
           `<span style="color:#b7c9e2;text-decoration:underline;cursor:pointer;margin:0 10px;" onclick="showInventoryCategory('consumable')">消耗品</span>` +
           `<span style="color:#b7c9e2;text-decoration:underline;cursor:pointer;margin:0 10px;" onclick="showInventoryCategory('important')">重要道具</span>` +
           `<span style="color:#b7c9e2;text-decoration:underline;cursor:pointer;margin:0 10px;" onclick="showInventoryCategory('limb')">肢体</span>` +
           `<span style="color:#b7c9e2;text-decoration:underline;cursor:pointer;margin:0 10px;" onclick="showInventoryCategory('misc')">杂物</span>\n` + centerLine();
}

function showInventoryCategory(category) {
    const categoryName = category === 'consumable' ? '消耗品' : category === 'important' ? '重要道具' : category === 'limb' ? '肢体' : '杂物';
    let html = makeTitle(`行囊物品 - ${categoryName}`);
    html += `<div style="text-align:center;">${generateInventoryCategoryMenu()}</div>`;
    const inv = gameState.player.inventory;
    let filtered = [];
    switch (category) {
        case 'consumable': filtered = inv.filter(i => i.type === 'consumable'); break;
        case 'important': filtered = inv.filter(i => i.type === 'readable' || i.id.includes('key') || i.id.includes('note')); break;
        case 'limb': filtered = inv.filter(i => i.id.includes('corpse') || i.story || i.ingredientType || i.dismemberable || i.milkItem); break;
        case 'misc': filtered = inv.filter(i => i.type === 'misc' && !i.id.includes('corpse') && !i.story && !i.ingredientType && !i.dismemberable && !i.milkItem); break;
    }
    if (filtered.length === 0) { html += `该分类下没有物品。\n`; }
    else { filtered.forEach(item => { const displayName = item.rarity ? getEquipmentDisplayName(item) : item.name; html += `  ▫️ <span style="text-decoration:underline;cursor:pointer;" onclick="examineItemFromPanel('${item.id}')">${displayName}</span> ${getItemEmoji(item)}\n`; }); }
    html += centerLine() + `<div style="text-align:center;"><span style="color:#aaa;cursor:pointer;" onclick="showInventoryPanel()">↩️ 返回物品栏</span></div>`;
    UI.setDetail(html); currentPanel = 'inventory';
}

function showInventoryAll() {
    let html = makeTitle('行囊物品'); html += `<div style="text-align:center;">${generateInventoryCategoryMenu()}</div>`;
    const inv = gameState.player.inventory;
    if (inv.length === 0) { html += `你的行囊空空如也。\n`; }
    else { inv.forEach(item => { const displayName = item.rarity ? getEquipmentDisplayName(item) : item.name; html += `  ▫️ <span style="text-decoration:underline;cursor:pointer;" onclick="examineItemFromPanel('${item.id}')">${displayName}</span> ${getItemEmoji(item)}\n`; }); }
    html += centerLine() + `<div style="text-align:center;"><span style="color:#aaa;cursor:pointer;" onclick="showInventoryPanel()">↩️ 关闭</span></div>`;
    UI.setDetail(html); currentPanel = 'inventory';
}

function examineItemFromPanel(itemId) {
    const item = findItemById(itemId); if (!item) { print("物品不存在。"); return; }
    let html = makeTitle('物品详情') + `名称：${item.name}\n类型：${getItemTypeName(item.type)}\n`;
    if (item.desc) html += `描述：${item.desc}\n`;
    if (item.atk) html += `攻击力：+${item.atk}\n`; if (item.def) html += `防御力：+${item.def}\n`; if (item.agi) html += `灵巧：+${item.agi}\n`;
    if (item.maxHpPercent && item.maxHpPercent < 0) html += `<span style="color:#ff6666;">诅咒：最大生命值${Math.round(item.maxHpPercent*100)}%</span>\n`;
    if (item.effect === 'heal') html += `效果：恢复${item.value}点生命\n`;
    else if (item.effect) html += `效果：${item.effect} 永久+${item.value}\n`;
    html += centerLine();
    if (item.id && item.id.includes('corpse')) { if (item.corpseStory) html += `<div><span style="color:#ff66aa;text-decoration:underline;cursor:pointer;" onclick="useCorpse('${item.id}')">🔞 互动</span></div>`; if (item.loot && item.loot.length > 0) html += `<div><span style="color:#ffdd44;text-decoration:underline;cursor:pointer;" onclick="lootCorpseFromInventory('${item.id}')">✨ 搜刮</span></div>`; if (item.dismemberable) html += `<div><span style="color:#ff6b6b;text-decoration:underline;cursor:pointer;" onclick="dismemberCorpseFromInventory('${item.id}')">🔪 肢解</span></div>`; }
    else if (item.id === 'magic_mirror') { html += `<div><span style="color:#6688ff;text-decoration:underline;cursor:pointer;" onclick="useMagicMirror()">🌀 传送</span></div>`; html += `<div><span style="color:#aaffaa;text-decoration:underline;cursor:pointer;" onclick="equipItemFromDetail('${item.id}')">⚔️ 装备</span></div>`; }
    else if (item.type === 'weapon' || item.type === 'armor' || item.type === 'accessory') { html += `<div><span style="color:#aaffaa;text-decoration:underline;cursor:pointer;" onclick="equipItemFromDetail('${item.id}')">⚔️ 装备</span></div>`; }
    else if (item.type === 'consumable') { html += `<div><span style="color:#aaffaa;text-decoration:underline;cursor:pointer;" onclick="useItemFromDetail('${item.id}')">🧪 使用</span></div>`; }
    else if (item.type === 'readable') { html += `<div><span style="color:#aaffaa;text-decoration:underline;cursor:pointer;" onclick="readItemFromDetail('${item.id}')">📖 阅读</span></div>`; }
    else if (item.story) { html += `<div><span style="color:#80e5ff;text-decoration:underline;cursor:pointer;" onclick="useLimb('${item.id}')">🔍 互动</span></div>`; }
    else if (item.id === 'removed_ladder' || (item.id.includes('removed_ladder') && item.id.includes('_dropped_'))) { html += `<div><span style="color:#aaffaa;text-decoration:underline;cursor:pointer;" onclick="useRemovedLadder()">🪜 使用梯子</span></div>`; }
    html += `<div><span style="color:#ff8888;text-decoration:underline;cursor:pointer;" onclick="dropItemFromInventory('${item.id}')">🗑️ 丢弃</span></div>` + `<div><span style="color:#aaa;cursor:pointer;" onclick="showInventoryPanel()">↩️ 返回</span></div>`;
    UI.setDetail(html); currentPanel = 'item_detail';
}

function showTradePanel() { clearDetailPanel(); currentPanel = null; const gold = gameState.player.gold || 0; const inv = gameState.player.inventory; const sellableItems = inv.filter(item => isItemSellable(item)); let html = makeTitle('💰 出售物品') + `<div style="text-align:center; color:#ffdd44;">当前金币：${gold}</div>\n` + centerLine(); if (sellableItems.length === 0) { html += `<div style="color:#888;">背包中没有可出售的物品。</div>\n`; } else { html += `<div style="color:#aaffaa;font-weight:bold;">可出售的物品：</div>\n`; sellableItems.forEach(item => { const price = getItemSellPrice(item); const displayName = item.rarity ? getEquipmentDisplayName(item) : item.name; html += `<div style="margin:4px 0;"><span style="color:#ffaa00;text-decoration:underline;cursor:pointer;" onclick="sellItemFromTrade('${item.id}')">💰 ${price}金币</span> ▫️ ${displayName}</div>\n`; }); } html += centerLine() + `<div><span style="color:#aaa;cursor:pointer;" onclick="clearDetailPanel()">↩️ 关闭</span></div>`; UI.setDetail(html); currentPanel = 'trade'; }

function sellItemFromTrade(itemId) { const item = findItemById(itemId); if (!item) { print("物品不存在。"); return; } const price = getItemSellPrice(item); removeItemFromInventory(itemId); gameState.player.gold = (gameState.player.gold || 0) + price; print(`<span style="color:#ffaa00;">你出售了「${item.name}」，获得了 ${price} 金币。</span>`); print(`<span style="color:#ffdd44;">当前金币：${gameState.player.gold}</span>`); showTradePanel(); }

function equipItemFromDetail(itemId) { const index = gameState.player.inventory.findIndex(i => i.id === itemId); if (index === -1) { print("你没有这件物品。"); return; } const item = gameState.player.inventory[index]; if (item.type !== 'weapon' && item.type !== 'armor' && item.type !== 'accessory') { print(`「${item.name}」无法装备。`); return; } const slot = item.slot || item.type; const current = gameState.player.equipment[slot]; if (current) { if (current.maxHpPercent) gameState.player.maxHp = Math.floor(gameState.player.maxHp / (1 + current.maxHpPercent)); gameState.player.inventory.push(current); print(`你卸下了「${current.name}」。`); } gameState.player.inventory.splice(index, 1); gameState.player.equipment[slot] = item; if (item.maxHpPercent && item.maxHpPercent < 0) { gameState.player.maxHp = Math.floor(gameState.player.maxHp * (1 + item.maxHpPercent)); if (gameState.player.hp > gameState.player.maxHp) gameState.player.hp = gameState.player.maxHp; print(`<span style="color:#ff6666;">诅咒生效！最大生命值降低至${gameState.player.maxHp}。</span>`); } else { const equipDisplayName = item.rarity ? getEquipmentDisplayName(item) : item.name; print(`你装备了「${equipDisplayName}」。`); } checkKnightSetChange(); clearDetailPanel(); showInventoryPanel(); StoryEngine.check(); }

function useItemFromDetail(itemId) { if (itemId === 'sanghuashan_mine') { return; } const item = findItemById(itemId); if (!item) return; if (item.type === 'consumable' && item.effect === 'heal') { gameState.player.hp = Math.min(gameState.player.maxHp, gameState.player.hp + (item.value || 10)); print(`你使用了「${item.name}」，恢复了${item.value||10}点生命。`); removeItemFromInventory(itemId); } else if (['maxHp','atk','def','agi','all'].includes(item.effect)) { const p = gameState.player; switch (item.effect) { case 'maxHp': p.maxHp += item.value; p.hp += item.value; break; case 'atk': p.atk += item.value; break; case 'def': p.def += item.value; break; case 'agi': p.agi += item.value; break; case 'all': p.maxHp += item.value; p.hp += item.value; p.atk += item.value; p.def += item.value; p.agi += item.value; break; } print(`你食用了「${item.name}」，${item.effect==='all'?'所有属性':''}永久提升${item.value}点！`); removeItemFromInventory(itemId); } else { print(`你使用了「${item.name}」，但没什么效果。`); } clearDetailPanel(); showInventoryPanel(); }

function readItemFromDetail(itemId) { const item = findItemById(itemId); if (!item) return; clearDetailPanel(); currentPanel = null; if (item.content && Array.isArray(item.content)) { print(`你打开「${item.name}」……`); print("<br>"); if (typeof StoryEngine !== 'undefined') { StoryEngine.playLines({ lines: item.content, color: '#ffdd44', useNextBtn: true, addLineBreaks: false, onComplete: () => { print("────────────────"); if (!gameState.gameFlags) gameState.gameFlags = {}; gameState.gameFlags[`read_${itemId}`] = true; StoryEngine.markConditionProgress('read_item', itemId); } }); } } }

function showEquipmentPanel() { if (currentPanel === 'equipment') { clearDetailPanel(); currentPanel = null; return; } let html = makeTitle('当前装备'); ['weapon','armor','accessory'].forEach(slot => { const item = gameState.player.equipment[slot]; const equipName = item ? (item.rarity ? getEquipmentDisplayName(item) : item.name) : ''; html += item ? `🔸${slot}:<span style="text-decoration:underline;cursor:pointer;" onclick="examineEquippedItem('${slot}')">${equipName}</span>\n` : `🔸${slot}:<span style="color:#888;">（空）</span>\n`; }); html += centerLine() + `⚔️总攻击:${getCharacterAttack(gameState.player)} | 🛡️总防御:${getCharacterDefense(gameState.player)} | 💨总灵巧:${getCharacterAgility(gameState.player)}` + centerLine() + `<div style="text-align:center;"><span style="color:#aaa;cursor:pointer;" onclick="showEquipmentPanel()">↩️ 关闭</span></div>`; UI.setDetail(html); currentPanel = 'equipment'; }

function examineEquippedItem(slotKey) { const item = gameState.player.equipment[slotKey]; if (!item) return; const displayName = item.rarity ? getEquipmentDisplayName(item) : item.name; let html = makeTitle('装备详情') + `名称：${displayName}\n类型：${getItemTypeName(item.type)}\n`; if (item.desc) html += `描述：${item.desc}\n`; if (item.atk) html += `攻击力：+${item.atk}\n`; if (item.def) html += `防御力：+${item.def}\n`; if (item.agi) html += `灵巧：+${item.agi}\n`; html += centerLine() + `<div><span style="color:#ffaa66;text-decoration:underline;cursor:pointer;" onclick="unequipItem('${slotKey}')">⬇️ 卸下</span></div>` + `<div><span style="color:#aaa;cursor:pointer;" onclick="showEquipmentPanel()">↩️ 返回</span></div>`; UI.setDetail(html); currentPanel = 'equipped_detail'; }

function unequipItem(slotKey) { const item = gameState.player.equipment[slotKey]; if (!item) return; if (item.maxHpPercent && item.maxHpPercent < 0) { gameState.player.maxHp = Math.floor(gameState.player.maxHp / (1 + item.maxHpPercent)); if (gameState.player.hp > gameState.player.maxHp) gameState.player.hp = gameState.player.maxHp; } gameState.player.inventory.push(item); gameState.player.equipment[slotKey] = null; print(`你卸下了「${item.name}」。`); checkKnightSetChange(); clearDetailPanel(); showEquipmentPanel(); }

function showStatusPanel() { if (currentPanel === 'status') { clearDetailPanel(); currentPanel = null; return; } const p = gameState.player; const hpPercent = Math.floor((p.hp/p.maxHp)*100), expPercent = Math.floor((p.exp/p.maxExp)*100); let html = makeTitle('角色状态') + `<div style="text-align:center;">👤 ${p.name}</div>` + centerLine() + `❤️ 生命：${p.hp}/${p.maxHp}\n[${'█'.repeat(Math.floor(hpPercent/10))}${'░'.repeat(10-Math.floor(hpPercent/10))}] ${hpPercent}%\n` + `⚡ 技力：${p.sp||0}/${p.maxSp||0}\n` + `⚔️ 攻击：${getCharacterAttack(p)}\n🛡️ 防御：${getCharacterDefense(p)}\n💨 灵巧：${getCharacterAgility(p)}\n` + `⭐ 等级：${p.level}\n📊 经验：${p.exp}/${p.maxExp}\n[${'█'.repeat(Math.floor(expPercent/10))}${'░'.repeat(10-Math.floor(expPercent/10))}] ${expPercent}%\n` + `💰 金币：${p.gold || 0}\n` + centerLine() + `<div style="text-align:center;color:#9aabbb;font-style:italic;">多年矿场的折磨锤炼了你一身如钢铁般的肌肉。</div>` + centerLine() + `<div style="text-align:center;"><span style="color:#aaa;cursor:pointer;" onclick="showStatusPanel()">↩️ 关闭</span></div>`; UI.setDetail(html); currentPanel = 'status'; }

function showQuestsPanel() { if (currentPanel === 'quests') { clearDetailPanel(); currentPanel = null; return; } showQuestsTab('incomplete'); }

function showQuestsTab(tab) { let html = makeTitle('任务日志') + `<div style="text-align:center;margin-bottom:8px;"><span style="color:${tab==='incomplete'?'#ffaa66':'#888'};cursor:pointer;" onclick="showQuestsTab('incomplete')">未完成</span> | <span style="color:${tab==='completed'?'#66ff66':'#888'};cursor:pointer;" onclick="showQuestsTab('completed')">已完成</span></div>` + centerLine(); const allMainQuests = [], allSideQuests = []; const storyEngineQuests = (typeof StoryEngine !== 'undefined') ? StoryEngine.registry : new Map(); const triggeredQuestIds = new Set((typeof StoryEngine !== 'undefined') ? [...StoryEngine.activeQuests, ...StoryEngine.completedQuests] : []); storyEngineQuests.forEach((story, id) => { if (story.type !== 'main' && story.type !== 'side') return; if (!triggeredQuestIds.has(id)) return; const isCompleted = (typeof StoryEngine !== 'undefined') && StoryEngine.completedQuests.includes(id); if (tab === 'completed' && !isCompleted) return; if (tab === 'incomplete' && isCompleted) return; const questInfo = { id, name: story.name || id, description: story.description || '', type: story.type, startStory: story.startStory || [], completeStory: story.completeStory || [], conditions: story.conditions }; if (story.type === 'main') allMainQuests.push(questInfo); else allSideQuests.push(questInfo); }); const typeStyle = (type) => type === 'main' ? 'color:#ffaa66;' : 'color:#66aaff;'; const typeLabel = (type) => type === 'main' ? '📜' : '📋'; if (allMainQuests.length > 0) { html += `<div style="color:#ffaa66;font-weight:bold;">━━━ 主线任务 ━━━</div>`; allMainQuests.forEach(q => { html += `<div style="margin:4px 0;"><span style="${typeStyle(q.type)}cursor:pointer;text-decoration:underline;" onclick="showQuestDetail('${q.id}','${tab}')">${typeLabel(q.type)} ${q.name}</span></div>`; }); html += '<br>'; } if (allSideQuests.length > 0) { html += `<div style="color:#66aaff;font-weight:bold;">━━━ 支线任务 ━━━</div>`; allSideQuests.forEach(q => { html += `<div style="margin:4px 0;"><span style="${typeStyle(q.type)}cursor:pointer;text-decoration:underline;" onclick="showQuestDetail('${q.id}','${tab}')">${typeLabel(q.type)} ${q.name}</span></div>`; }); } if (allMainQuests.length === 0 && allSideQuests.length === 0) { html += `<div style="color:#888;">${tab === 'completed' ? '暂无已完成任务' : '暂无进行中的任务'}</div>`; } html += centerLine() + `<div style="text-align:center;"><span style="color:#aaa;cursor:pointer;" onclick="showQuestsPanel()">↩️关闭</span></div>`; UI.setDetail(html); currentPanel = 'quests'; }

function showQuestDetail(questId, tab) { let story; if (typeof StoryEngine !== 'undefined') story = StoryEngine.registry.get(questId); if (!story) { const q = gameState.quests.main.find(q => q.id === questId) || gameState.quests.side.find(q => q.id === questId); if (!q) { UI.setDetail(makeTitle('错误') + '找不到任务信息'); return; } story = { name: q.name, description: q.description, type: 'main' }; } const isCompleted = (typeof StoryEngine !== 'undefined') && StoryEngine.completedQuests.includes(questId); let html = makeTitle(story.name) + `类型：${story.type === 'main' ? '主线任务' : '支线任务'}\n描述：${story.description || '(无)'}\n` + centerLine(); if (isCompleted) { if (story.startStory && story.startStory.length > 0) { html += `<div><span style="color:#ffaa66;text-decoration:underline;cursor:pointer;" onclick="replayStory('${questId}','start')">🎬 播放触发剧情</span></div>` + centerLine(); } if (story.completeStory && story.completeStory.length > 0) { html += `<div><span style="color:#ffaa66;text-decoration:underline;cursor:pointer;" onclick="replayStory('${questId}','complete')">🎬 播放完成剧情</span></div>` + centerLine(); } } if (story.conditions) { html += `<div style="color:#888;font-weight:bold;">完成条件：</div>`; if (story.conditions.type === 'single') html += `<span style="color:#aaa;">${story.conditions.label || story.conditions.condValue}</span>\n`; else if (story.conditions.type === 'composite') story.conditions.subConditions.forEach((cond, i) => { html += `<span style="color:#aaa;">${i+1}. ${cond.label || cond.item || cond.condValue}</span>\n`; }); } html += centerLine() + `<div style="text-align:center;"><span style="color:#aaa;cursor:pointer;" onclick="showQuestsTab('${tab}')">↩️返回任务列表</span></div>`; UI.setDetail(html); currentPanel = 'quest_detail'; }

function showSkillsPanel() { if (currentPanel === 'skills') { clearDetailPanel(); currentPanel = null; return; } let html = makeTitle('技能总览'); const playerSkills = gameState.player.skills || []; if (playerSkills.length === 0) { html += `<span style="color:#888;">暂无技能</span>\n`; } else { playerSkills.forEach(sId => { const s = skills[sId]; if (s) html += `  ▫️ <span style="color:#b7c9e2;text-decoration:underline;cursor:pointer;" onclick="showSkillDetail('${sId}')">${s.name}</span> (SP:${s.cost})\n`; }); } html += centerLine() + `<div style="text-align:center;"><span style="color:#aaa;cursor:pointer;" onclick="showSkillsPanel()">↩️ 关闭</span></div>`; UI.setDetail(html); currentPanel = 'skills'; }

function showSkillDetail(skillId) { const skill = skills[skillId]; if (!skill) { print("技能不存在！"); return; } let html = makeTitle('技能详情') + `名称：${skill.name}\n消耗：${skill.cost}SP\n描述：${skill.description}\n` + centerLine() + `<div style="text-align:center;"><span style="color:#aaa;cursor:pointer;" onclick="showSkillsPanel()">↩️ 返回</span></div>`; UI.setDetail(html); currentPanel = 'skill_detail'; }

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