// 副本实例独立保存；装备、原典与研习册由敌人死亡时概率掉落到地面。
function explorationProgress() {
    return gameState.exploration ||= { discovered:{}, firstClears:{}, rewardModel:'monster_drops_v1' };
}
function explorationDef(id) { return EXPLORATION_DEFINITIONS.find(d=>d?.id===id); }
function explorationAvailable(def) {
    if (!def) return false;
    const loc=gameState.player.location;
    return loc===def.anchor || (loc==='town_square' && def.number<=3);
}
function discoverExploration() {
    const p=explorationProgress();
    EXPLORATION_DEFINITIONS.forEach(def=> { if(def && gameState.player.location===def.anchor) p.discovered[def.id]=true; });
}
function explorationSceneEntry(name, action, icon='🚪', label='副本入口') {
    return `<div class="scene-entry scene-entry--object" onclick="${action}"><div class="scene-entry__main"><span class="scene-entry__emoji">${icon}</span><span class="scene-entry__name">${name}</span></div><small>${label} · 点击查看</small></div>`;
}
function explorationExitAvailable(dungeon=gameState.activeDungeon, roomId=gameState.player.location) {
    if(!dungeon || !dungeon.roomIds.includes(roomId)) return false;
    if(roomId===dungeon.entryRoomId) return true;
    if(roomId!==dungeon.bossRoomId) return false;
    const def=explorationDef(dungeon.id),room=gameState.world[roomId];
    if(!def || !Array.isArray(room?.npcs)) return false;
    const bossId=def.number===5?'mad_female_mage':`expedition_${def.number}_boss`;
    return !room.npcs.includes(bossId);
}
function explorationSceneActions() {
    discoverExploration();
    let html='';
    const loc=gameState.player.location;
    if (gameState.world[loc]?.generatedDungeon && explorationExitAvailable())
        html+=explorationSceneEntry('离开副本（保留进度）','leaveExploration()','↩️','副本出口');
    EXPLORATION_DEFINITIONS.forEach(def=> {
        if(!def || (loc!==def.anchor && !explorationAvailable(def))) return;
        // 学院使用场景中真实的石门物品，避免同一入口出现两张卡片。
        if(def.number===5 && gameState.world[loc]?.items?.includes('academy_stone_gate')) return;
        html+=explorationSceneEntry(def.name,`showExplorationDetail('${def.id}')`);
    });
    return html;
}
function explorationAccessText(def) {
    if(explorationAvailable(def)) return '';
    return '请前往这处副本的入口。';
}
function showExplorationDetail(id) {
    const def=explorationDef(id);
    if(!def) return false;
    if(battleState.inBattle) { UI.setDetail(renderBattleDetail()); return false; }
    const active=gameState.activeDungeon, same=active?.id===id, accessible=explorationAvailable(def);
    const enemyIds=def.number===5 ? ['female_mage','mad_female_mage'] : [`expedition_${def.number}_enemy`,`expedition_${def.number}_boss`];
    const enemies=enemyIds.map(npcId=>getCharacterInfo(npcId));
    const normalLevels=[...new Set(enemies.slice(0,-1).map(npc=>npc.level))].map(lv=>`Lv.${lv}`).join('／');
    let html=makeTitle(def.name)+`<div class="detail-card"><div class="detail-card__header">${def.name}<span class="detail-card__badge">副本</span></div><div class="detail-card__desc">${def.description}</div></div>`;
    html+=`<div class="panel-section-label">副本怪物等级</div><div class="equipment-summary"><div>普通敌人<b>${normalLevels}</b></div><div>首领<b>Lv.${enemies.at(-1).level}</b></div></div>`;
    html+=`<div class="quest-condition">${enemies.map(npc=>`${npc.name} Lv.${npc.level}`).join(' · ')}</div>`;
    html+=`<p>副本规模：初始房间1间、普通房间${same?active.normalRoomCount:'10～15'}间、首领房间1间。</p>`;
    if(def.training) html+='<p>演武按训练规矩进行，不留下尸体；失败后恢复入场前的生命与技力。</p>';
    if(same) html+=`<p>${active.completed?'本轮已通关，重置后可再次进入。':'本轮探索进度已保留，再次进入会回到离开的位置。'}</p>`;
    if(active && !same) html+=`<p>正在探索「${active.name}」。请先回到它的入口重置本轮，再进入其他副本。</p>`;
    const accessText=explorationAccessText(def);
    if(accessText) html+=`<p>${accessText}</p>`;
    html+=`<div class="detail-action-grid dungeon-actions"><button onclick="enterExploration('${id}')" ${!accessible || active && (!same || active.completed)?'disabled':''}>${same && !active.completed?'继续探索':'进入副本'}</button><button onclick="resetExploration('${id}')" ${!accessible || !same?'disabled':''}>重置副本</button></div>`;
    html+=makePanelFooter('clearDetailPanel()','关闭详情');
    UI.setDetail(html);
    if(UI.elements.detailPanel) UI.elements.detailPanel.scrollTop=0;
    currentPanel='exploration_detail';return true;
}
function showExplorationHub() {
    discoverExploration();
    const loc=gameState.player.location;
    let html=makeTitle('🧭 副本入口');
    if (battleState.inBattle) { UI.setDetail(renderBattleDetail()); return; }
    html+='<p>副本入口直接显示在左侧“周围可见”。击败怪物和首领后，装备、原典及研习册有概率掉在战斗房间地面；点击拾取或“全部拾取”。</p>';
    if(gameState.activeDungeon) html+=`<p>当前副本：${gameState.activeDungeon.name}${gameState.activeDungeon.completed?'（已通关，可回入口重开）':'（进度保留）'}</p>`;
    html+=explorationSceneActions() || '<p>此处没有可进入的副本。</p>';
    html+=makePanelFooter('clearDetailPanel()', '关闭', '←');
    UI.setDetail(html); currentPanel='exploration';
}
function completeExploration(dungeon) {
    if (!dungeon || dungeon.completed) return false;
    const def=explorationDef(dungeon.id); if(!def) return false;
    const p=explorationProgress(); dungeon.completed=true;
    p.firstClears[def.id]=true;
    print(`${def.name}已通关！战利品掉在敌人倒下的房间，离开或重开前记得拾取。`);
    return true;
}
function prepareExplorationInstance(dungeon, def, returnRoom) {
    dungeon.instanceId ||= newCombatId('dungeon');
    dungeon.entranceRoom=returnRoom;
    explorationProgress().discovered[def.id]=true;
    if(def.training) dungeon.trainingStart={hp:gameState.player.hp,sp:gameState.player.sp};
}
function enterExploration(id) {
    const def=explorationDef(id);
    if(!def || battleState.inBattle || !explorationAvailable(def)) return false;
    let active=gameState.activeDungeon;
    if(active && active.id!==id) { print('请先放弃当前副本，再开始另一处探索。'); return false; }
    if(active?.completed) { print('本轮已完成；请在入口详情中重置副本，再开始下一轮。'); return false; }
    const entrance=gameState.player.location;
    if(!active) {
        active=generateDungeon(id);
        if(def.number===5) gameState.gameFlags.academyDungeonEntered=true;
        prepareExplorationInstance(active,def,entrance);
    } else repairExpeditionContent();
    relocateTo(active.lastRoomId && gameState.world[active.lastRoomId] ? active.lastRoomId : active.entryRoomId,{skipCheck:true,callback:()=>checkHostileNPCs(gameState.player.location)});
    return true;
}
function leaveExploration() {
    const dungeon=gameState.activeDungeon;
    if(!dungeon || battleState.inBattle || !dungeon.roomIds.includes(gameState.player.location)) return false;
    if(!explorationExitAvailable(dungeon)) { print('只能从初始房间或击败首领后的首领房间离开副本。'); return false; }
    dungeon.lastRoomId=gameState.player.location;
    if (dungeon.trainingStart) {
        gameState.player.hp=Math.min(gameState.player.maxHp,dungeon.trainingStart.hp);
        gameState.player.sp=Math.min(gameState.player.maxSp,dungeon.trainingStart.sp);
    }
    relocateTo(dungeon.entranceRoom,{skipCheck:true}); return true;
}
function abandonExploration() {
    const dungeon=gameState.activeDungeon;
    if(!dungeon || battleState.inBattle) return false;
    const ground=dungeon.roomIds.reduce((n,id)=>n+(gameState.world[id]?.items?.length || 0),0);
    if(!confirm(`清理本轮副本？${ground}件地面物品将移除，已拾取的物品会保留。`)) return false;
    if (dungeon.trainingStart && dungeon.roomIds.includes(gameState.player.location)) {
        gameState.player.hp=Math.min(gameState.player.maxHp,dungeon.trainingStart.hp);
        gameState.player.sp=Math.min(gameState.player.maxSp,dungeon.trainingStart.sp);
    }
    if(dungeon.roomIds.includes(gameState.player.location)) gameState.player.location=dungeon.entranceRoom;
    dungeon.roomIds.forEach(id=> {
        (gameState.world[id]?.items || []).forEach(itemId=> { if(isDynamicItem(itemId)) delete ITEM_TEMPLATES[itemId]; });
        delete gameState.world[id]; delete gameState.backgroundBattles[id];
    });
    delete gameState.activeDungeon;
    look(); updateMinimap(); updateSceneInfo(); return true;
}
function resetExploration(id) {
    const dungeon=gameState.activeDungeon, def=explorationDef(id);
    if(battleState.inBattle || !dungeon || dungeon.id!==id || !explorationAvailable(def)) return false;
    if(!abandonExploration()) return false;
    print(`「${def.name}」已重置，下次进入将展开新一轮探索。`);
    showExplorationDetail(id);return true;
}
function restartExploration(id) {
    const dungeon=gameState.activeDungeon;
    if(!dungeon?.completed || dungeon.id!==id || !explorationAvailable(explorationDef(id))) return false;
    if(!abandonExploration()) return false;
    return enterExploration(id);
}
const EXPLORATION_DROP_RATES={enemy:{equipment:.18,original:.09,manual:.32},support:{equipment:.25,original:.14,manual:.40},boss:{equipment:.80,original:.60,manual:.85}};
function spawnExplorationDrop(room,templateId) {
    const item=createItemFromTemplate(templateId);
    if(!item) return false;
    item.templateId=templateId;
    item.id=`drop_${templateId}_${newCombatId('loot')}`;
    ITEM_TEMPLATES[item.id]=item;
    room.items ||= [];
    room.items.push(item.id);
    print(`${item.name}掉落在地上。`);
    return true;
}
function rollExplorationDrops(unit,roomId,dungeon) {
    if(unit._ally || unit._magicDoll) return;
    const def=explorationDef(dungeon.id), room=gameState.world[roomId];
    if(!def || !room) return;
    const role=unit.npcId===`expedition_${def.number}_boss` || unit.npcId==='mad_female_mage' ? 'boss'
        : unit.npcId===`expedition_${def.number}_support` ? 'support' : 'enemy';
    const rates=EXPLORATION_DROP_RATES[role];
    const equipment=[...(def.equipment || []),...(def.number===1?['fruit_knife','kitchen_knife']:def.number===2?['iron_stick','rusty_sword']:[])], originals=def.books || [];
    if(equipment.length && Math.random()<rates.equipment) spawnExplorationDrop(room,equipment[Math.floor(Math.random()*equipment.length)]);
    if(originals.length && Math.random()<rates.original) spawnExplorationDrop(room,`book_${originals[Math.floor(Math.random()*originals.length)]}`);
    if(Math.random()<rates.manual) spawnExplorationDrop(room,`training_book_${def.rarity}`);
    // 骑士旧套装只在演武场概率掉落，不再通过完成演武直接领取。
    if(def.training && Math.random()<(role==='boss'?.50:.12)) {
        const pieces=['knight_greatsword','knight_armor','knight_emblem'];
        spawnExplorationDrop(room,pieces[Math.floor(Math.random()*pieces.length)]);
    }
    if(roomId===gameState.player.location) updateSceneInfo();
}
function handleExplorationDeath(unit,roomId) {
    const d=gameState.activeDungeon;
    if(!d || !d.roomIds.includes(roomId) || unit._ally || unit._magicDoll) return;
    rollExplorationDrops(unit,roomId,d);
    if(d.completed) return;
    // 首领房的所有敌人倒下才算通关；学院保留原有剧情掉落和出口。
    if((gameState.world[d.bossRoomId]?.npcs || []).length) return;
    if(d.id!=='academy_ruins' && d.roomIds.some(id=>(gameState.world[id]?.npcs || []).length)) return;
    completeExploration(d);
}
function finishTrainingBattle(won) {
    const d=gameState.activeDungeon;
    if(!d || d.id!=='knight_trial' || !d.roomIds.includes(battleState.roomId) || won) return false;
    battleState.inBattle=false;
    restorePlayerStatsAfterBattle();
    document.body.classList.remove('battle-mode'); UI.setOverlay(false);
    gameState.player.hp=Math.min(gameState.player.maxHp,d.trainingStart.hp);
    gameState.player.sp=Math.min(gameState.player.maxSp,d.trainingStart.sp);
    gameState.player.location=d.entranceRoom;
    d.roomIds.forEach(id=> {delete gameState.world[id];delete gameState.backgroundBattles[id];});
    delete gameState.activeDungeon;
    print('演武失败，无奖励。已恢复进入前的生命与技力并返回训练场。');
    look(); updateMinimap(); return true;
}
function tryExplorationSupport(enemy) {
    if(!enemy.expeditionRole || enemy.sp<5) return false;
    enemy.actionsTaken=(enemy.actionsTaken || 0)+1;
    if(enemy.actionsTaken%3) return false;
    const ally=battleState.enemies.filter(e=>e!==enemy && e.currentHp>0 && !e._dead).sort((a,b)=>a.currentHp/a.maxHp-b.currentHp/b.maxHp)[0];
    if(!ally) return false;
    enemy.sp-=5;
    if(enemy.expeditionRole==='heal') ally.currentHp=Math.min(ally.maxHp,ally.currentHp+Math.ceil(ally.maxHp*.15));
    else ally.supportBuff={key:enemy.expeditionRole==='attack'?'atk':'def',remaining:2,generation:(ally.supportBuff?.generation || 0)+1};
    print(`${enemy.name}支援了${ally.name}！剩余 SP ${enemy.sp}`);
    UI.setDetail(renderBattleDetail()); return true;
}
function repairExploration029() {
    const progress=explorationProgress();
    if(progress.rewardModel!=='monster_drops_v1') {
        // 兼容前一测试版的待领选择与凭证：一次性转为实际物品，避免旧档奖励失联。
        Object.values(progress.pending || {}).forEach(reward=> {
            const id=reward.choices?.find(candidate=>ITEM_TEMPLATES[candidate]);
            if(id) addRewardItems(id);
        });
        Object.entries(progress.tokens || {}).forEach(([id,count])=> {
            const rarity=explorationDef(id)?.rarity;
            if(rarity && Number.isInteger(count) && count>0) addRewardItems(`training_book_${rarity}`,Math.min(count,1000));
        });
        delete progress.pending; delete progress.tokens; delete progress.claimed; delete progress.sideRewards;
        progress.rewardModel='monster_drops_v1';
    }
    const d=gameState.activeDungeon;
    if(d && explorationDef(d.id)) {
        if(!Array.isArray(d.roomIds) || !d.roomIds.every(id=>gameState.world[id])) {
            gameState.player.location=explorationDef(d.id).anchor;
            delete gameState.activeDungeon; print('副本房间不完整，已安全返回入口；背包物品保留。');
        }
        if(gameState.activeDungeon) { d.instanceId ||= newCombatId('dungeon'); delete d.randomEquipment; delete d.rewardPrepared; }
    } else if(gameState.player.location.startsWith('academy_dungeon_')) {
        gameState.player.location='mysterious_stone_gate';
        print('旧档缺少副本实例信息，已保留背包并安全返回神秘石门。');
    }
    repairExpeditionContent();
}
