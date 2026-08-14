// ============================================================
//  game/corpseSystem.js - 尸体互动/搜刮/肢解/肢体使用
// ============================================================

function useCorpse(itemId) {
    const item = findItemById(itemId);
    if (!item) { print("该物品不在行囊中，无法使用。"); return; }
    clearDetailPanel(); currentPanel = null; print(""); print(`你靠近了「${item.name}」...`);
    _playCorpseStory(item, '#c444ff');
}

function useCorpseOnGround(itemId) {
    const room = gameState.world[gameState.player.location];
    if (!room || !room.items || !room.items.includes(itemId)) { print("该尸体已不在此处。"); return; }
    const item = getItemInfoById(itemId);
    if (!item) { print("找不到该尸体信息。"); return; }
    clearDetailPanel(); currentPanel = null; print(""); print(`你靠近了地上的「${item.name}」...`);
    _playCorpseStory(item, '#ff66aa');
}

function _playCorpseStory(item, color) {
    const story = item.corpseStory;
    if (!story || story.length === 0) { print(`<span style="color:#888;">没有特别的事情发生。</span>`); return; }
    StoryEngine.playLines({
        lines: story, color: color, useNextBtn: true,
        onEachLine: () => { print("<br>"); },
        onComplete: () => { print(`<span style="color:#888;">互动结束...</span>`); }
    });
}

function _lootCorpseCore(item, source) {
    const prefix = source === 'ground' ? '你搜刮了' : '你搜刮了行囊里的';
    clearDetailPanel(); currentPanel = null; print("");
    print(`${prefix}「${item.name}」，获得了：`);
    item.loot.forEach(lootId => { const loot = createItemFromTemplate(lootId); if (loot) { gameState.player.inventory.push(loot); print(`✨ ${loot.name}`); } });
    item.loot = []; print(`「${item.name}」已被搜刮完毕。`);
    if (source === 'ground') updateSceneInfo(); else showInventoryPanel();
}

function lootCorpse(itemId) {
    const item = ITEM_TEMPLATES[itemId];
    if (!item || !item.loot || item.loot.length === 0) { print("这具尸体已经被搜刮过了。"); return; }
    _lootCorpseCore(item, 'ground');
}

function lootCorpseFromInventory(itemId) {
    const item = findItemById(itemId);
    if (!item || !item.loot || item.loot.length === 0) { print("这具尸体已经被搜刮过了。"); return; }
    _lootCorpseCore(item, 'inventory');
}

function getLimbTemplatesForCorpse(corpseId) {
    const allTemplates = { ...CHARACTER_TEMPLATES };
    if (typeof MOD_CHARACTER_TEMPLATES !== 'undefined') Object.assign(allTemplates, MOD_CHARACTER_TEMPLATES);
    const sorted = Object.entries(allTemplates).filter(([id, d]) => d.limbTemplates && corpseId.includes(id)).sort((a, b) => b[0].length - a[0].length);
    return sorted.length > 0 ? sorted[0][1].limbTemplates : [];
}

// 取得某尸体使用的肢解模板（优先尸体自带的 limbTemplates）
function _getCorpseLimbTemplates(corpse) {
    if (corpse && corpse.limbTemplates && corpse.limbTemplates.length > 0) return corpse.limbTemplates;
    return getLimbTemplatesForCorpse(corpse ? corpse.id : '');
}

function _deepClone(o) {
    if (!o) return o;
    if (typeof structuredClone === 'function') return structuredClone(o);
    return JSON.parse(JSON.stringify(o));
}

// 制造一个肢体物品：优先取尸体预生成的肢体（generatedLimbs），否则走模板
function _makeLimbItem(corpse, limbId, occurrence) {
    if (corpse && corpse.generatedLimbs) {
        const arr = corpse.generatedLimbs[limbId];
        if (arr && arr[occurrence]) return _deepClone(arr[occurrence]);
        if (arr && arr[0]) return _deepClone(arr[0]);
        return null;
    }
    return createItemFromTemplate(limbId);
}

function dismemberCorpseFromInventory(corpseId) {
    const inv = gameState.player.inventory; const index = inv.findIndex(item => item.id === corpseId);
    if (index === -1) { print("该尸体不在行囊中。"); return; }
    const corpse = inv[index];
    if (!corpse.dismemberable) { print("这具尸体无法被肢解。"); return; }
    if (corpse.loot && corpse.loot.length > 0) { print(`搜刮`); corpse.loot.forEach(id => { const it = createItemFromTemplate(id); if (it) { inv.push(it); print(`✨ ${it.name}`); } }); corpse.loot = []; print(""); }
    clearDetailPanel();
    const limbTemplates = _getCorpseLimbTemplates(corpse);
    if (!corpse.dismemberedLimbs || !limbTemplates.every(limb => corpse.dismemberedLimbs.includes(limb.id)))
        showDismemberPanel(corpse.name, limbTemplates, corpse, 'inventory');
    else print("这具尸体已经没有可以肢解的部位了。");
}

function dismemberItem(itemId) {
    const item = ITEM_TEMPLATES[itemId]; if (!item) { print("该物品已不存在。"); return; }
    if (item.loot && item.loot.length > 0) { print(`搜刮`); item.loot.forEach(id => { const it = createItemFromTemplate(id); if (it) gameState.player.inventory.push(it); }); item.loot = []; print(""); }
    clearDetailPanel();
    const limbTemplates = _getCorpseLimbTemplates(item);
    if (!item.dismemberedLimbs || !limbTemplates.every(limb => item.dismemberedLimbs.includes(limb.id)))
        showDismemberPanel(item.name, limbTemplates, item, 'ground');
    else print("这具尸体已经没有可以肢解的部位了。");
}

function showDismemberPanel(corpseName, limbTemplates, corpseObj, source) {
    const dismemberedLimbs = corpseObj && corpseObj.dismemberedLimbs ? corpseObj.dismemberedLimbs : [];
    let html = makeTitle('🔪 肢解选择');
    html += `<div style="color:#ff6b6b;">选择要肢解下来的肢体：</div><div style="color:#888;font-size:12px;">（灰色为已肢解部位）</div>`;
    limbTemplates.forEach((limb, index) => {
        const isDone = dismemberedLimbs.includes(limb.id);
        html += `<div style="margin:8px 0;"><input type="checkbox" id="limb_check_${index}" ${isDone ? 'disabled' : 'checked'}><label style="color:${isDone ? '#888' : '#fff'};">${limb.name} (${limb.count}个)${isDone ? ' ✓' : ''}</label></div>`;
    });
    html += centerLine() + `<span style="color:#aaffaa;text-decoration:underline;cursor:pointer;" onclick="toggleAllLimbCheckboxes(true)">✅全选</span> <span style="color:#ff8888;text-decoration:underline;cursor:pointer;" onclick="toggleAllLimbCheckboxes(false)">❌取消全选</span>`;
    html += `<div><span style="color:#aaa;cursor:pointer;" onclick="cancelDismember()">↩️返回</span> <span id="confirm-dismember-btn" style="color:#ff6b6b;cursor:pointer;">🔪确认肢解</span></div>`;
    window.currentDismemberCorpse = corpseObj; window.currentDismemberSource = source;
    window.currentDismemberLimbTemplates = limbTemplates; window.currentDismemberCorpseName = corpseName;
    UI.setDetail(html);
    const btn = document.getElementById('confirm-dismember-btn');
    if (btn) btn.addEventListener('click', function() { confirmDismember(corpseName, limbTemplates); }, { once: true });
    currentPanel = 'dismember';
}

function toggleAllLimbCheckboxes(check) { document.querySelectorAll('[id^="limb_check_"]').forEach(cb => { cb.checked = check; }); }
function cancelDismember() { clearDetailPanel(); showInventoryPanel(); }

function confirmDismember(corpseName, limbTemplates) {
    const selectedLimbs = []; const selectedIds = [];
    limbTemplates.forEach((limb, i) => {
        const cb = document.getElementById(`limb_check_${i}`);
        if (cb && cb.checked) {
            for (let j = 0; j < limb.count; j++) selectedLimbs.push({ limbId: limb.id, occurrence: j });
            selectedIds.push(limb.id);
        }
    });
    if (selectedLimbs.length === 0) { print("请至少选择一个肢体。"); return; }
    const corpseObj = window.currentDismemberCorpse; const source = window.currentDismemberSource;
    const currentRemaining = corpseObj && corpseObj.dismemberedLimbs ? limbTemplates.filter(l => !corpseObj.dismemberedLimbs.includes(l.id)) : [...limbTemplates];
    const remainingAfter = currentRemaining.filter(l => !selectedIds.includes(l.id)).length;
    clearDetailPanel(); currentPanel = null; print(""); print(`你将「${corpseName}」肢解...`);
    UI.setOverlay(true);
    let idx = 0;
    function spawnNext() {
        if (idx < selectedLimbs.length) {
            const sel = selectedLimbs[idx];
            const limbItem = _makeLimbItem(corpseObj, sel.limbId, sel.occurrence);
            if (limbItem) {
                if (source === 'inventory') { gameState.player.inventory.push(limbItem); print(`✨ 获得了${limbItem.name}`); }
                else { const realId = `${sel.limbId}_${Date.now()}_${idx}_${Math.random().toString(36).substr(2,9)}`; limbItem.id = realId; const room = gameState.world[gameState.player.location]; if (room && room.items) { room.items.push(realId); ITEM_TEMPLATES[realId] = limbItem; } print(`✨ ${limbItem.name}掉落在地上`); }
            }
            idx++; setTimeout(spawnNext, 800);
        } else {
            if (corpseObj) { if (!corpseObj.dismemberedLimbs) corpseObj.dismemberedLimbs = []; selectedIds.forEach(id => { if (!corpseObj.dismemberedLimbs.includes(id)) corpseObj.dismemberedLimbs.push(id); }); delete corpseObj.corpseStory; delete corpseObj.usable; }
            if (corpseObj && remainingAfter === 1) {
                const remainingLimb = limbTemplates.find(l => !corpseObj.dismemberedLimbs.includes(l.id));
                if (remainingLimb) {
                    print(`<br><span style="color:#ff8866;">尸体只剩下${remainingLimb.name}了...</span>`);
                    if (source === 'inventory') { const invIdx = gameState.player.inventory.indexOf(corpseObj); if (invIdx !== -1) gameState.player.inventory.splice(invIdx, 1); for (let j = 0; j < remainingLimb.count; j++) { const it = _makeLimbItem(corpseObj, remainingLimb.id, j); if (it) gameState.player.inventory.push(it); } }
                    else { const room = gameState.world[gameState.player.location]; if (room && room.items) { const itemIdx = room.items.indexOf(corpseObj.id); if (itemIdx !== -1) room.items.splice(itemIdx, 1); for (let j = 0; j < remainingLimb.count; j++) { const it = _makeLimbItem(corpseObj, remainingLimb.id, j); if (it) { const lid = `${remainingLimb.id}_${Date.now()}_${j}_${Math.random().toString(36).substr(2,9)}`; it.id = lid; room.items.push(lid); ITEM_TEMPLATES[lid] = it; } } } }
                }
            }
            UI.setOverlay(false);
            if (source === 'inventory') showInventoryPanel(); else updateSceneInfo();
        }
    }
    spawnNext();
}

function useLimb(itemId) {
    const item = findItemById(itemId);
    if (!item) { print("该物品不在行囊中，无法使用。"); return; }
    clearDetailPanel(); currentPanel = null; print(""); print(`你仔细端详着「${item.name}」...`);
    if (item.story && item.story.length > 0) {
        StoryEngine.playLines({
            lines: item.story, color: '#ff4486', useNextBtn: true,
            onEachLine: () => { print("<br>"); },
            onComplete: () => {
                if (item.onUseDestroy) { const inv = gameState.player.inventory; const idx = inv.indexOf(item); if (idx !== -1) { inv.splice(idx, 1); print(`<span style="color:#ff6b6b;">「${item.name}」已损毁。</span>`); } if (item.onUseSpawn) item.onUseSpawn.forEach(spawnId => { const spawned = createItemFromTemplate(spawnId); if (spawned) { inv.push(spawned); print(`<span style="color:#aaffaa;">✨获得了「${spawned.name}」</span>`); } }); showInventoryPanel(); }
            }
        });
    } else { print(`<span style="color:#888;">【暂无剧情内容】</span>`); }
}
