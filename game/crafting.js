// ============================================================
//  game/crafting.js - 烹饪 + 锻造系统
// ============================================================

let cookingReturnItems = [];

// ========== 锻造系统 ==========

const WORKBENCH_RECIPES = {
    furniture: {
        name: '家具', icon: '🪑',
        items: [
            { id: 'craft_wooden_table', name: '木桌', desc: '一张用矿场废木料打造的简陋木桌。', materials: ['stone×3', 'wood×2'], materialIds: [{ id: 'stone', count: 3 }, { id: 'wood', count: 2 }], resultEffect: '可放置在房间中作为装饰' },
            { id: 'craft_wooden_chair', name: '木椅', desc: '一把用木板拼凑的椅子。', materials: ['wood×2', 'stone×1'], materialIds: [{ id: 'wood', count: 2 }, { id: 'stone', count: 1 }], resultEffect: '可放置在房间中作为装饰' },
            { id: 'craft_candle_holder', name: '烛台', desc: '一个用铁片弯折而成的烛台。', materials: ['iron_ore×2', 'stone×1'], materialIds: [{ id: 'iron_ore', count: 2 }, { id: 'stone', count: 1 }], resultEffect: '可放置在房间中提供照明' },
            { id: 'craft_simple_bed', name: '简易床', desc: '一张用木板和稻草搭建的简易床铺。', materials: ['wood×4', 'rag×2', 'stone×2'], materialIds: [{ id: 'wood', count: 4 }, { id: 'rag', count: 2 }, { id: 'stone', count: 2 }], resultEffect: '可放置在房间中供休息' }
        ]
    },
    weapons: {
        name: '武器', icon: '⚔️',
        items: [
            { id: 'crafted_knight_greatsword', name: '骑士大剑·改', desc: '熔铸骑士大剑并镶嵌莉娅娜的腿骨与头颅，剑身更重更锋锐，无视敌人50%护甲。', atk: 30, agi: -2, rarity: 'epic', slot: 'weapon', crafted: true, armorPenetration: 0.5, resultTemplate: 'crafted_knight_greatsword', materials: ['莉娅娜的腿×1', '莉娅娜的头颅×1', '骑士大剑×1', '铁矿石×1'], materialIds: [{ id: 'liana_leg', count: 1 }, { id: 'liana_head', count: 1 }, { id: 'knight_greatsword', count: 1 }, { id: 'iron_ore', count: 1 }], resultEffect: '攻击+30 灵巧-2 无视50%护甲' },
            { id: 'crafted_knight_armor', name: '骑士板甲·改', desc: '将莉娅娜的肋骨熔铸进骑士板甲中，形成骨钢复合层，减免10%物理伤害。', def: 25, agi: -2, rarity: 'epic', slot: 'armor', crafted: true, physicalDamageReduction: 0.1, resultTemplate: 'crafted_knight_armor', materials: ['莉娅娜的躯干×1', '骑士板甲×1'], materialIds: [{ id: 'liana_torso', count: 1 }, { id: 'knight_armor', count: 1 }], resultEffect: '防御+25 灵巧-2 减免10%物理伤害' }
        ]
    }
};

// ★ 辅助：检查物品ID是否匹配材料（支持动态ID如 liana_leg_178xxxx_abc123）
function itemMatchesMaterial(item, materialId) {
    if (!item || !item.id) return false;
    if (item.id === materialId) return true;
    // 动态ID：liana_leg_178xxxx → 匹配 liana_leg
    if (item.id.startsWith(materialId + '_')) return true;
    return false;
}

function useWorkbench(workbenchId) {
    if (!gameState.world[gameState.player.location]?.items?.includes(workbenchId)) { print("工作台已不存在。"); return; }
    let html = makeTitle('🔨 锻造菜单') + `<div style="color:#888;">请选择要制作的类型：</div>` + centerLine();
    Object.keys(WORKBENCH_RECIPES).forEach(cat => { const c = WORKBENCH_RECIPES[cat]; html += `<div style="margin:8px 0;"><span style="color:#88ccff;cursor:pointer;" onclick="showWorkbenchCategory('${cat}')">${c.icon} ${c.name} (${c.items.length}种配方)</span></div>`; });
    html += centerLine() + `<div style="color:#aaa;cursor:pointer;" onclick="clearDetailPanel()">↩️ 返回</div>`;
    UI.setDetail(html); currentPanel = 'workbench_menu';
}

function showWorkbenchCategory(category) {
    const cat = WORKBENCH_RECIPES[category]; if (!cat) return;
    const player = gameState.player;
    let html = makeTitle(`🔨 ${cat.name}`) + centerLine();
    cat.items.forEach(recipe => {
        let hasAll = true;
        const matStatus = recipe.materialIds.map(mat => {
            const count = player.inventory.filter(i => itemMatchesMaterial(i, mat.id)).length;
            const ok = count >= mat.count; if (!ok) hasAll = false;
            return { name: getItemInfoById(mat.id)?.name || mat.id, need: mat.count, have: count, ok };
        });
        let effectText = recipe.resultEffect || '';
        if (recipe.atk) effectText += ` | 攻击+${recipe.atk}`; if (recipe.def) effectText += ` | 防御+${recipe.def}`; if (recipe.agi) effectText += ` | 灵巧${recipe.agi>0?'+':''}${recipe.agi}`;
        html += `<div style="margin:10px 0;padding:10px;background:#2a2a2a;border-radius:4px;border-left:3px solid ${hasAll?'#88ccff':'#555'};"><div style="color:${hasAll?'#88ccff':'#666'};font-weight:bold;${hasAll?'cursor:pointer;text-decoration:underline':''}" ${hasAll?`onclick="startCraftingProcess('${category}','${recipe.id}')"`:''}>${cat.icon} ${recipe.name}</div><div style="color:#aaa;font-size:12px;">${recipe.desc}</div><div style="color:#66ff66;font-size:11px;">效果：${effectText}</div><div style="font-size:11px;">${matStatus.map(m=>`<span style="color:${m.ok?'#66ff66':'#ff6666'};">${m.ok?'✓':'✗'} ${m.name}×${m.need}(${m.have})</span>`).join(' ')}</div>${hasAll?`<span style="color:#88ccff;cursor:pointer;" onclick="startCraftingProcess('${category}','${recipe.id}')">🔨开始锻造</span>`:`<span style="color:#555;">🔨材料不足</span>`}</div>`;
    });
    html += centerLine() + `<div style="color:#aaa;cursor:pointer;" onclick="useWorkbench('workbench')">↩️返回</div>`;
    UI.setDetail(html); currentPanel = 'workbench_category';
}

function startCraftingProcess(category, recipeId) {
    const cat = WORKBENCH_RECIPES[category]; if (!cat) return;
    const recipe = cat.items.find(r => r.id === recipeId); if (!recipe) return;
    const player = gameState.player;
    const matIndices = [];
    let missing = [];
    recipe.materialIds.forEach(mat => {
        const found = [];
        player.inventory.forEach((item, i) => {
            if (itemMatchesMaterial(item, mat.id) && found.length < mat.count) found.push(i);
        });
        matIndices.push(found);
        if (found.length < mat.count) {
            const name = getItemInfoById(mat.id)?.name || mat.id;
            missing.push(`${name}×${mat.count - found.length}`);
        }
    });
    if (missing.length > 0) { print(`<span style="color:#ff6666;">材料不足！缺少：${missing.join('、')}</span>`); return; }
    matIndices.forEach(indices => indices.sort((a, b) => b - a).forEach(idx => player.inventory.splice(idx, 1)));
    clearDetailPanel(); currentPanel = null;
    print(`<span style="color:#88ccff;">你站在工作台前，拿起铁锤和铁钳...</span>`);

    if (recipe.resultTemplate) {
        const template = ITEM_TEMPLATES[recipe.resultTemplate];
        if (template) {
            const craftStory = ["你将材料一件件摆放在工作台上。", "炉火重新燃起，铁钳夹住烧红的铁块——", "叮！叮！叮！火星四溅，铁块在锤击下逐渐成形。", "锻造完成了！一件崭新的作品诞生在你的手中。"];
            let i = 0;
            function next() {
                if (i < craftStory.length) { print(`<span style="color:#88ccff;">${craftStory[i]}</span>`); i++; setTimeout(next, 800); }
                else {
                    const craftedItem = JSON.parse(JSON.stringify(template));
                    craftedItem.id = recipe.id + '_' + Date.now();
                    player.inventory.push(craftedItem);
                    print(`<span style="color:#ffdd44;">🔨获得了「${craftedItem.name}」！</span>`);
                    updateSceneInfo();
                }
            }
            next();
            return;
        }
    }

    const craftStory = ["你将材料一件件摆放在工作台上。", "炉火重新燃起，铁钳夹住烧红的铁块——", "叮！叮！叮！火星四溅，铁块在锤击下逐渐成形。", "锻造完成了！一件崭新的作品诞生在你的手中。"];
    let i = 0; function next() { if (i < craftStory.length) { print(`<span style="color:#88ccff;">${craftStory[i]}</span>`); i++; setTimeout(next, 800); } else { const craftedItem = { id: recipe.id + '_' + Date.now(), name: recipe.name, type: recipe.atk ? 'weapon' : (recipe.def ? 'armor' : 'misc'), desc: recipe.desc, usable: true }; if (recipe.atk) { craftedItem.atk = recipe.atk; craftedItem.slot = 'weapon'; } if (recipe.def) { craftedItem.def = recipe.def; craftedItem.slot = 'armor'; } if (recipe.agi) craftedItem.agi = recipe.agi; if (recipe.effect) { craftedItem.effect = recipe.effect; craftedItem.value = recipe.value; } player.inventory.push(craftedItem); print(`<span style="color:#ffdd44;">🔨获得了「${recipe.name}」！</span>`); updateSceneInfo(); } }
    next();
}

// ========== 烹饪系统 ==========

function useStove(stoveId) {
    if (!gameState.world[gameState.player.location]?.items?.includes(stoveId)) { print("炉灶已不存在。"); return; }
    const cookableItems = [];
    gameState.player.inventory.forEach((item, index) => { if (item?.cookable) cookableItems.push({ item, index }); });
    if (cookableItems.length === 0) { print(`<span style="color:#ffaa66;">炉灶中的余烬发出微弱的红光...你翻遍了背包，但没有找到可以烹饪的食材。</span>`); return; }
    const byType = {};
    cookableItems.forEach(({ item, index }) => { const type = item.ingredientType || 'other'; if (!byType[type]) byType[type] = []; byType[type].push({ item, index }); });
    const typeNames = { head: '头颅', torso: '躯干', leg: '腿', arm: '手臂', hand: '手', foot: '脚', breast: '乳房', other: '其他' };
    let html = makeTitle('🍳 烹饪菜单') + `<div style="color:#888;">请选择部位类型：</div>` + centerLine();
    Object.keys(byType).forEach(type => { html += `<div style="margin:8px 0;"><span style="color:#ffaa66;cursor:pointer;" onclick="showCookingMenuByType('${type}')">🍖 ${typeNames[type] || type} (${byType[type].length}个)</span></div>`; });
    html += `<div style="margin:8px 0;"><span style="color:#ffaa66;cursor:pointer;" onclick="showCustomCookingMode()">✨自定义模式</span></div>` + centerLine() + `<div style="color:#aaa;cursor:pointer;" onclick="clearDetailPanel()">↩️返回</div>`;
    window.cookingIngredients = byType;
    UI.setDetail(html); currentPanel = 'cooking_menu';
}

function showCookingMenuByType(type) {
    const ingredients = window.cookingIngredients?.[type]; if (!ingredients?.length) { print("该部位没有可烹饪的食材。"); return; }
    const typeNames = { head: '头颅', torso: '躯干', leg: '腿', arm: '手臂', hand: '手', foot: '脚', breast: '乳房', other: '其他' };
    let html = makeTitle(`🍳 ${typeNames[type] || type}`) + centerLine();
    ingredients.forEach(({ item, index }) => {
        const resultDish = item.resultDish ? ITEM_TEMPLATES[item.resultDish] : null;
        const dishName = resultDish?.name || '未知料理';
        const requiredS = resultDish?.seasonings || [];
        const hasAll = requiredS.every(sId => gameState.player.inventory.some(inv => inv?.id === sId));
        const missing = requiredS.filter(sId => !gameState.player.inventory.some(inv => inv?.id === sId)).map(sId => ITEM_TEMPLATES[sId]?.name || sId);
        let effectText = ''; if (resultDish) { switch (resultDish.effect) { case 'maxHp': effectText = `生命上限+${resultDish.value}`; break; case 'atk': effectText = `攻击+${resultDish.value}`; break; case 'def': effectText = `防御+${resultDish.value}`; break; case 'agi': effectText = `灵巧+${resultDish.value}`; break; case 'all': effectText = `全属性+${resultDish.value}`; break; } }
        html += `<div style="margin:10px 0;padding:10px;background:#2a2a2a;border-radius:4px;border-left:3px solid ${hasAll?'#ff8844':'#666'};"><div style="color:${hasAll?'#ffdd44':'#888'};font-weight:bold;${hasAll?'cursor:pointer;text-decoration:underline':''}" ${hasAll?`onclick="startCookingProcess(${index})"`:''}>🍖${dishName}</div><div style="color:#66ff66;font-size:11px;">效果：${effectText}</div>${hasAll?`<span style="color:#ff6b6b;cursor:pointer;" onclick="startCookingProcess(${index})">🔥开始烹饪</span>`:`<span style="color:#555;">🔥材料不足（缺少：${missing.join('、')}）</span>`}</div>`;
    });
    html += centerLine() + `<div style="color:#aaa;cursor:pointer;" onclick="useStove('stove')">↩️返回</div>`;
    UI.setDetail(html); currentPanel = 'cooking_menu_detail';
}

function startCookingProcess(inventoryIndex) {
    const player = gameState.player; const ingredient = player.inventory[inventoryIndex];
    if (!ingredient?.cookable) { print("该物品无法烹饪。"); return; }
    const resultDishId = ingredient.resultDish; if (!resultDishId) { print("该食材没有对应的料理配方。"); return; }
    const resultDish = ITEM_TEMPLATES[resultDishId]; if (!resultDish) { print("料理配方不存在。"); return; }
    const requiredS = resultDish.seasonings || []; const seasoningsToRemove = []; const missing = [];
    requiredS.forEach(sId => { const idx = player.inventory.findIndex((item, i) => item?.id === sId && !seasoningsToRemove.includes(i)); if (idx === -1) { const t = ITEM_TEMPLATES[sId]; missing.push(t?.name || sId); } else seasoningsToRemove.push(idx); });
    if (missing.length > 0) { print(`<span style="color:#ff6666;">材料不足！缺少辅料：${missing.join('、')}</span>`); return; }
    clearDetailPanel(); currentPanel = null;
    print(`<span style="color:#ff8844;">你开始烹饪${ingredient.name}...</span>`);
    player.inventory.splice(inventoryIndex, 1);
    const returnItems = resultDish.returnAfterCook ? [...resultDish.returnAfterCook] : []; cookingReturnItems = [];
    seasoningsToRemove.sort((a, b) => b - a).forEach(idx => { const removed = player.inventory[idx]; if (removed && returnItems.includes(removed.id)) { cookingReturnItems.push(removed); returnItems.splice(returnItems.indexOf(removed.id), 1); } player.inventory.splice(idx, 1); });
    const cookStory = resultDish.cookStory;
    if (!cookStory?.length) { completeCooking(ingredient, resultDish, resultDishId); return; }
    let i = 0; function next() { if (i < cookStory.length) { print("<br>"); print(`<span style="color:#ffaa66;">${cookStory[i]}</span>`); i++; showNextBtn(next); } else { hideNextBtn(); completeCooking(ingredient, resultDish, resultDishId); } }
    next();
}

function completeCooking(ingredient, dishTemplate, dishId) {
    const player = gameState.player;
    const dish = { id: dishId, name: dishTemplate.name, type: dishTemplate.type, desc: dishTemplate.desc, effect: dishTemplate.effect, value: dishTemplate.value, usable: true };
    player.inventory.push(dish);
    print(`<span style="color:#aaffaa;">🍖烹饪完成！获得了「${dishTemplate.name}」！</span>`);
    let effectText = ''; switch (dishTemplate.effect) { case 'maxHp': effectText = `永久提升生命上限${dishTemplate.value}点`; break; case 'atk': effectText = `永久提升攻击${dishTemplate.value}点`; break; case 'def': effectText = `永久提升防御${dishTemplate.value}点`; break; case 'agi': effectText = `永久提升灵巧${dishTemplate.value}点`; break; case 'all': effectText = `永久提升所有属性${dishTemplate.value}点`; break; }
    print(`<span style="color:#66ff66;">效果：${effectText}</span>`);
    if (cookingReturnItems.length > 0) { cookingReturnItems.forEach(item => { player.inventory.push(item); print(`<span style="color:#aaffaa;">「${item.name}」已归还。</span>`); }); cookingReturnItems = []; }
    updateSceneInfo();
}

function showCustomCookingMode() {
    const player = gameState.player; const limbs = []; const seasonings = [];
    player.inventory.forEach((item, index) => { if (item?.cookable) limbs.push({ item, index }); else if (item?.isSeasoning) seasonings.push({ item, index }); });
    if (limbs.length === 0) { print("你没有可用于烹饪的肢体。"); return; }
    let html = makeTitle('✨自定义烹饪模式') + centerLine() + `<div style="color:#ffaa66;">选择肢体：</div>`;
    limbs.forEach(({ item, index }) => { html += `<div><input type="checkbox" id="limb_${index}"><label style="color:#fff;">${item.name}</label></div>`; });
    html += `<div style="color:#ffaa66;">选择辅料：</div>`; seasonings.forEach(({ item, index }) => { html += `<div><input type="checkbox" id="seasoning_${index}"><label style="color:#fff;">${item.name}</label></div>`; });
    html += `<div>菜名：<input type="text" id="dish_name" style="background:#222;border:1px solid #444;color:#fff;"></div><div>步骤：<textarea id="cooking_steps" rows="4" style="background:#222;border:1px solid #444;color:#fff;"></textarea></div><div>描述：<textarea id="dish_description" rows="3" style="background:#222;border:1px solid #444;color:#fff;"></textarea></div>` + centerLine() + `<span style="color:#ffaa66;cursor:pointer;" onclick="createCustomDish()">✨生成料理</span>`;
    UI.setDetail(html); currentPanel = 'custom_cooking';
}

function createCustomDish() {
    const player = gameState.player; const selectedLimbs = []; const selectedSeasonings = [];
    player.inventory.forEach((item, index) => { const cb = document.getElementById(`limb_${index}`); if (cb?.checked) selectedLimbs.push({ item, index }); const cb2 = document.getElementById(`seasoning_${index}`); if (cb2?.checked) selectedSeasonings.push({ item, index }); });
    if (selectedLimbs.length === 0) { print("请至少选择一个肢体。"); return; }
    const dishName = document.getElementById('dish_name')?.value.trim(); const steps = document.getElementById('cooking_steps')?.value.trim(); const desc = document.getElementById('dish_description')?.value.trim();
    if (!dishName || !steps || !desc) { print("请输入菜名/步骤/描述。"); return; }
    selectedLimbs.sort((a, b) => b.index - a.index).forEach(({ index }) => player.inventory.splice(index, 1));
    selectedSeasonings.sort((a, b) => b.index - a.index).forEach(({ index }) => player.inventory.splice(index, 1));
    player.inventory.push({ id: 'custom_dish_' + Date.now(), name: dishName, type: 'consumable', desc: steps + '\n' + desc, effect: null, value: 0, isCustom: true });
    print(`<span style="color:#ffaa66;">🍳料理制作完成！你成功制作了：${dishName}</span>`);
    clearDetailPanel(); updateSceneInfo();
}