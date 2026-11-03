// 稳定身份与战斗时钟；旧回调不可操作读档后的遭遇。
let battleTimerEpoch = 0;
let battleTimers = new Set();
function newCombatId(prefix) {
    gameState.entitySequence = (gameState.entitySequence || 0)+1;
    return `${prefix}_${gameState.entitySequence}`;
}
function ensureCombatIdentity() {
    battleState.encounterId ||= newCombatId('encounter');
    battleState.enemies.forEach((e,i)=> { e.entityId ||= newCombatId('unit'); e.joinOrder ??= i; });
}
function resolvePlayerTarget() {
    ensureCombatIdentity();
    const enemies=battleState.enemies.filter(e=>e.currentHp>0 && !e._dead && !e._ally);
    const selected=enemies.find(e=>e.entityId===battleState.selectedEnemyEntityId);
    if (selected) return selected;
    if (battleState.selectedEnemyEntityId) { battleState.selectedEnemyEntityId=null; print('原锁定目标已失效，恢复自动目标。'); }
    return enemies.sort((a,b)=>a.joinOrder-b.joinOrder)[0] || null;
}
function selectBattleTarget(id = null) {
    if (!battleState.inBattle) return false;
    ensureCombatIdentity();
    if (id && !battleState.enemies.some(e=>e.entityId===id && e.currentHp>0 && !e._dead && !e._ally)) return false;
    const previous=resolvePlayerTarget()?.entityId;
    battleState.selectedEnemyEntityId=id;
    if (previous && id && previous!==id && gameState.activeDungeon?.id==='knight_trial') gameState.activeDungeon.targetSwitched=true;
    UI.setDetail(renderBattleDetail()); return true;
}
function cancelBattleTimers() {
    battleTimerEpoch++;
    battleTimers.forEach(clearTimeout); battleTimers.clear();
}
function queueBattleStep(step, delay = 600) {
    battleState.nextStep=step;
    if (step==='round') battleState.roundReady=false;
    if (battleState.paused) return;
    const epoch=battleTimerEpoch, encounter=battleState.encounterId;
    const timer=setTimeout(()=> {
        battleTimers.delete(timer);
        if (epoch!==battleTimerEpoch || encounter!==battleState.encounterId || battleState.paused || !battleState.inBattle) return;
        if (step==='round') startNewRound();
        else if (step==='defeat') battleEnd(false);
        else executeNextTurn();
    },delay);
    battleTimers.add(timer);
}
function continueBattle() {
    if (!battleState.inBattle || !battleState.paused) return;
    battleState.paused=false;
    queueBattleStep(battleState.nextStep || 'round');
    UI.setDetail(renderBattleDetail());
}
function pauseCombatForIO() {
    const original=battleState, wasPaused=battleState.paused;
    cancelBattleTimers();
    if (battleState.inBattle) battleState.paused=true;
    _stopBackgroundBattleLoop();
    return ()=> {
        if (battleState===original && battleState.inBattle && !wasPaused) continueBattle();
        if (Object.values(gameState.backgroundBattles || {}).some(bg=>bg.status==='pending')) ensureBackgroundBattleLoop();
    };
}
function snapshotCombat() {
    if (!battleState.inBattle) return null;
    ensureCombatIdentity();
    return JSON.parse(JSON.stringify(battleState));
}
function restoreCombatSnapshot(snapshot) {
    cancelBattleTimers();
    window._onBattleEnd=null;
    battleState=JSON.parse(JSON.stringify(DEFAULT_BATTLE_STATE));
    document.body.classList.remove('battle-mode');
    UI.setOverlay(false);
    if (!snapshot?.inBattle || snapshot.roomId!==gameState.player.location || !Array.isArray(snapshot.enemies)) return;
    Object.assign(battleState,snapshot,{paused:true});
    if(typeof refreshExpeditionUnitNames==='function') refreshExpeditionUnitNames(battleState.enemies);
    if (battleState.completionHandler==='slum_attack') window._onBattleEnd=slumAttackBattleCompleted;
    if (battleState.completionHandler==='mandorola_resist') window._onBattleEnd=mandorolaResistBattleCompleted;
    ensureCombatIdentity(); resolvePlayerTarget();
    document.body.classList.add('battle-mode');
    UI.setOverlay(true);
    // 读档和逃跑后返回都按保存的下一步自动继续，不再等待额外按钮。
    continueBattle();
}
