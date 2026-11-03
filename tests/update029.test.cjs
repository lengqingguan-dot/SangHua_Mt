// node --test tests/update029.test.cjs
// Load the actual script list in browser order. Only the host DOM, timers and file picker are simulated.
const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
const path = require('node:path');
const root = path.resolve(__dirname, '..');
function fixture() {
    const noop=()=>{}, timers=new Map(), messages=[]; let seq=0,saved='',reloads=0;
    const nodes=new Map();
    const node=()=>({innerHTML:'',style:{},classList:{add:noop,remove:noop},addEventListener:noop,removeEventListener:noop,focus:noop,appendChild:noop,getContext:()=>({})});
    const c={console,document:{addEventListener:noop,getElementById:id=>{if(!nodes.has(id))nodes.set(id,node());return nodes.get(id);},querySelector:()=>node(),querySelectorAll:()=>[],body:node(),createElement:node},
        setTimeout:(fn,delay)=>{timers.set(++seq,{fn,delay});return seq;},clearTimeout:id=>timers.delete(id),setInterval:()=>++seq,clearInterval:noop,
        confirm:()=>true,localStorage:{getItem:()=>null,setItem:noop},Image:class{},location:{href:'file:///game/index.html',reload:()=>reloads++},URL,addEventListener:noop,
        showSaveFilePicker:async()=>({name:'test.json',createWritable:async()=>({write:async text=>{saved=text;},close:async()=>{}})}),
        showOpenFilePicker:async()=>[{getFile:async()=>({text:async()=>saved})}]};
    c.window=c;vm.createContext(c);
    for(const [,file] of fs.readFileSync(path.join(root,'index.html'),'utf8').matchAll(/<script src="([^"]+)"/g)) vm.runInContext(fs.readFileSync(path.join(root,file),'utf8'),c,{filename:file});
    const run=code=>vm.runInContext(code,c);
    const browserPrint=run('UI.print');
    const browserUpdateScene=run('updateSceneInfo');
    const browserUpdateMinimap=run('updateMinimap');
    c.recordMessage=m=>messages.push(m);
    run(`UI.init(); UI.print=recordMessage; UI.setDetail=html=>{UI.lastDetail=html}; UI.clearDetail=()=>{}; UI.clearOutput=()=>{}; UI.setOverlay=()=>{}; UI.setOutputHtml=()=>{};
        StoryEngine.check=()=>{}; StoryEngine._applyStage=()=>{}; look=()=>{}; updateMinimap=()=>{}; updateSceneInfo=()=>{};
        gameState.firstTimeEntered=false; Math.random=()=>.5;`);
    return {c,run,timers,messages,browserPrint,browserUpdateScene,browserUpdateMinimap,get p(){return run('gameState.player')},get saved(){return saved},set saved(v){saved=v},get reloads(){return reloads},
        battle(ids=['expedition_1_enemy','expedition_1_enemy']) {
            c.testIds=ids;
            run(`gameState.world[gameState.player.location].npcs=[...testIds]; startMultiBattle(testIds); startNewRound(); cancelBattleTimers();`);
        },
        learn(id) {c.learnId=id; run(`gameState.player.level=15;applyPlayerLevelBalance(gameState.player,false);addRewardItems('book_'+learnId);learnSkillFromBook(learnId);`);}
    };
}
test('all scripts boot; 24 equipment, 12 learnable skills, six validated cost tables and actual map anchors',()=>{
    const g=fixture();
    assert.equal(g.run('UPDATE029_EQUIPMENT.length'),24);
    assert.equal(g.run('Object.keys(PLAYER_SKILL_DEFINITIONS).length'),12);
    assert.equal(g.run('EXPLORATION_DEFINITIONS.filter(Boolean).every(d=>gameState.world[d.anchor] && d.equipment.length===4 && d.books.every(id=>ITEM_TEMPLATES["book_"+id]))'),true);
    assert.equal(g.run('Object.values(SKILL_UPGRADE_COSTS).map(a=>a.reduce((x,y)=>x+y,0)).join()'),'10,15,20,28,40,56');
    assert.equal(g.p.skills.length,1);
    assert.equal(g.c.bookCount('book_hatred'),0);
    assert.equal(g.c.skillLevel('hatred'),1);
});
test('hatred is initially learned; other acquired originals are learned in inventory and then shown in the skills panel',()=>{
    const g=fixture();assert.equal(typeof g.c.claimStarterBooks,'undefined');
    assert.equal(g.c.bookCount('book_hatred'),0);
    g.c.showSkillsPanel();
    assert.match(g.run('UI.lastDetail'),/仇恨 Lv.1/);
    assert.doesNotMatch(g.run('UI.lastDetail'),/迅刺|学习原典/);
    assert.equal(g.c.useSkillBookFromInventory('book_quick_stab'),false);
    g.c.addRewardItems('book_quick_stab');
    assert.equal(g.c.skillLevel('quick_stab'),0);
    assert.equal(g.c.bookCount('book_quick_stab'),1);
    g.c.examineItemFromPanel('book_quick_stab');
    assert.match(g.run('UI.lastDetail'),/useSkillBookFromInventory\('book_quick_stab',false\)/);
    assert.equal(g.c.useSkillBookFromInventory('book_quick_stab'),true);
    assert.equal(g.c.skillLevel('quick_stab'),1);
    assert.equal(g.c.bookCount('book_quick_stab'),0);
    assert.equal(g.run('currentPanel'),'inventory');
    g.c.showSkillsPanel();
    assert.match(g.run('UI.lastDetail'),/迅刺 Lv.1/);
    assert.match(g.run('UI.lastDetail'),/showSkillDetail\('quick_stab'\)/);
    assert.match(g.run('UI.lastDetail'),/仇恨 Lv.1/);
    assert.doesNotMatch(g.run('UI.lastDetail'),/稳斩|领取|learnSkillFromBook|useSkillBookFromInventory/);
    assert.doesNotMatch(g.c.explorationSceneActions(),/技能图鉴|新手书包/);
});
test('new game, reset and loading preserve initial hatred without granting its original',async()=>{
    const g=fixture();
    assert.equal(g.c.useSkillBookFromInventory('book_hatred'),false);
    assert.equal(g.c.bookCount('book_hatred'),0);
    assert.equal(g.c.skillLevel('hatred'),1);
    await g.c.saveGame();
    assert.equal(await g.c.loadGame(),true);
    assert.equal(g.c.bookCount('book_hatred'),0);
    assert.equal(g.c.skillLevel('hatred'),1);
    g.c.resetGame();
    assert.equal(g.c.bookCount('book_hatred'),0);
    assert.equal(g.c.skillLevel('hatred'),1);
    g.c.resetGame();
    assert.equal(g.c.bookCount('book_hatred'),0);
    assert.equal(g.c.skillLevel('hatred'),1);
});
test('the previous test-version save with an unread hatred original gains the initial skill on load without consuming the book',async()=>{
    const g=fixture();
    g.run("gameState.player.skills=[];gameState.player.skillProgress={};addRewardItems('book_hatred')");
    await g.c.saveGame();
    assert.equal(await g.c.loadGame(),true);
    assert.equal(g.c.skillLevel('hatred'),1);
    assert.equal(g.c.bookCount('book_hatred'),1);
    assert.equal(g.c.useSkillBookFromInventory('book_hatred',true),true);
    assert.equal(g.c.bookCount('book_hatred'),0);
    assert.equal(g.c.bookCount('training_book_normal'),1);
});
test('learning level and combat restrictions do not consume a book',()=>{
    const g=fixture();g.c.addRewardItems('book_judgment_cut');
    assert.equal(g.c.learnSkillFromBook('judgment_cut'),false);
    g.battle();g.c.addRewardItems('book_quick_stab');
    assert.equal(g.c.learnSkillFromBook('quick_stab'),false);
    assert.equal(g.c.bookCount('book_quick_stab'),1);
});
test('upgrade is deterministic, same-rarity only, stale double click rejected, capped at five',()=>{
    const g=fixture();g.learn('heavy_cut');g.c.addRewardItems('training_book_rare',20);
    assert.equal(g.c.upgradeLearnedSkill('heavy_cut',1),false);
    g.c.addRewardItems('training_book_good',15);
    for(let lv=1;lv<5;lv++) {
        assert.equal(g.c.upgradeLearnedSkill('heavy_cut',lv),true);
        assert.equal(g.c.upgradeLearnedSkill('heavy_cut',lv),false);
    }
    assert.equal(g.c.bookCount('training_book_good'),0);
    assert.equal(g.c.bookCount('training_book_rare'),20);
    assert.equal(g.c.upgradeLearnedSkill('heavy_cut',5),false);
});
test('duplicate original converts exactly one book; unlearned original cannot convert',()=>{
    const g=fixture();g.c.addRewardItems('book_heavy_cut');
    assert.equal(g.c.learnSkillFromBook('heavy_cut',true),false);
    g.learn('heavy_cut');
    assert.equal(g.c.learnSkillFromBook('heavy_cut',true),true);
    assert.equal(g.c.bookCount('training_book_good'),1);
    assert.equal(g.c.learnSkillFromBook('heavy_cut',true),false);
});
test('weapon changes do not grant or remove permanent learned skills',()=>{
    const g=fixture();g.run(`gameState.player.equipment={weapon:createItemFromTemplate('knight_greatsword'),armor:createItemFromTemplate('knight_armor'),accessory:createItemFromTemplate('knight_emblem')};checkKnightSetChange()`);
    assert.equal(g.c.skillLevel('player_vow'),0);
    g.learn('player_vow');g.run(`gameState.player.equipment.weapon=null;checkKnightSetChange()`);
    assert.equal(g.c.skillLevel('player_vow'),1);
});
test('same-template enemies get distinct stable IDs; lock directs ordinary attacks',()=>{
    const g=fixture();g.battle();const enemies=g.run('battleState.enemies');
    assert.notEqual(enemies[0].entityId,enemies[1].entityId);
    g.c.selectBattleTarget(enemies[1].entityId);g.c.executePlayerTurn();
    assert.equal(enemies[0].currentHp,enemies[0].maxHp);
    assert(enemies[1].currentHp<enemies[1].maxHp);
    g.run('battleState.enemies.reverse()');
    assert.equal(g.c.resolvePlayerTarget().entityId,enemies[0].entityId); // array reference reversed; selected original second
    g.c.selectBattleTarget(null);
    assert.equal(g.c.resolvePlayerTarget().joinOrder,0);
});
test('dead target clears lock; reinforcement cannot steal it',()=>{
    const g=fixture();g.battle();const [a,b]=g.run('battleState.enemies');
    g.c.selectBattleTarget(b.entityId);
    g.run("battleState.enemies.push(buildBattleEnemy('expedition_1_enemy',2))");
    assert.equal(g.c.resolvePlayerTarget(),b);
    b.currentHp=0;b._dead=true;
    assert.equal(g.c.resolvePlayerTarget(),a);
    assert.equal(g.run('battleState.selectedEnemyEntityId'),null);
});
test('all ten offensive skills damage only the selected instance; effects stay on it',()=>{
    const g=fixture();const ids=g.run('Object.keys(PLAYER_SKILL_DEFINITIONS).filter(id=>!skills[id].self)');
    for(const id of ids) {
        g.run('battleState.inBattle=false');g.learn(id);g.battle();
        const s=g.run(`skills['${id}']`), weapon={dagger:'fruit_knife',sword:'rusty_sword',cleaver:'kitchen_knife',blunt:'iron_stick',mining_tool:'pickaxe',greatsword:'knight_greatsword'}[s.categories[0]];
        g.run(`gameState.player.equipment={weapon:createItemFromTemplate('${weapon}'),armor:createItemFromTemplate('knight_armor'),accessory:createItemFromTemplate('knight_emblem')};gameState.player.sp=999;battleState.enemies.forEach(e=>{e.currentHp=10000;e.maxHp=10000;e.agi=0})`);
        const [a,b]=g.run('battleState.enemies');g.c.selectBattleTarget(b.entityId);
        g.messages.length=0;
        assert.equal(g.c.useSkill(id),true,id);assert.equal(a.currentHp,10000,id);assert(b.currentHp<10000,id);
        assert.equal(g.messages.filter(m=>m.includes(`你发动了技能「${s.name}」！`)).length,1,id);
        assert.match(g.messages[0],/你发动了技能/);
        if(s.debuff) {assert(b.statusEffects[s.debuff]);assert.equal(a.statusEffects,undefined);}
    }
});
test('unlearned, wrong weapon, insufficient SP and action double spending are rejected',()=>{
    const g=fixture();g.battle();const sp=g.p.sp;assert.equal(g.c.useSkill('heavy_cut'),false);assert.equal(g.p.sp,sp);
    g.run('battleState.inBattle=false');g.learn('heavy_cut');g.battle();assert.equal(g.c.useSkill('heavy_cut'),false);
    g.run("gameState.player.equipment.weapon=createItemFromTemplate('knight_greatsword');gameState.player.sp=0");assert.equal(g.c.useSkill('heavy_cut'),false);
    assert.equal(g.messages.some(m=>m.includes('你发动了技能')),false);
    g.p.sp=50;g.run('battleState.enemies.forEach(e=>e.currentHp=500)');assert.equal(g.c.useSkill('heavy_cut'),true);
    const hp=g.run('battleState.enemies[0].currentHp');assert.equal(g.c.useSkill('heavy_cut'),false);g.c.executePlayerTurn();assert.equal(g.run('battleState.enemies[0].currentHp'),hp);
    assert.equal(g.messages.filter(m=>m.includes('你发动了技能「重斩」！')).length,1);
});

test('self buffs announce activation once and failed repeat use does not announce success',()=>{
    for(const id of ['hatred','player_vow']) {
        const g=fixture();if(id==='player_vow')g.learn(id);g.battle();
        g.run("gameState.player.equipment={weapon:createItemFromTemplate('knight_greatsword'),armor:createItemFromTemplate('knight_armor'),accessory:createItemFromTemplate('knight_emblem')};gameState.player.sp=100");
        g.messages.length=0;
        const name=g.run(`skills['${id}'].name`),sp=g.p.sp;
        assert.equal(g.c.useSkill(id),true);assert(g.p.sp<sp);
        assert.equal(g.messages.length,1);
        assert(g.messages[0].includes(`你发动了技能「${name}」！`));
        assert(g.run(`battleState.playerEffects.${id==='hatred'?'hatred':'vow'}`));
        const remaining=g.p.sp;
        assert.equal(g.c.useSkill(id),false);assert.equal(g.p.sp,remaining);
        g.run('battleState.auxiliaryUsed=false');
        assert.equal(g.c.useSkill(id),false);assert.equal(g.p.sp,remaining);
        assert.equal(g.messages.filter(m=>m.includes('你发动了技能')).length,1);
    }
});

test('offensive skill activation precedes dodge and killing-blow results',()=>{
    for(const dodge of [true,false]) {
        const g=fixture();g.learn('quick_stab');g.battle();
        g.run("gameState.player.equipment.weapon=createItemFromTemplate('fruit_knife');battleState.enemies.forEach(e=>{e.currentHp=1;e.agi=0})");
        g.c.tryDodge=()=>dodge;g.messages.length=0;
        assert.equal(g.c.useSkill('quick_stab'),true);
        assert.match(g.messages[0],/你发动了技能「迅刺」！/);
        assert.equal(g.messages.filter(m=>m.includes('你发动了技能')).length,1);
        if(dodge) {
            assert(g.messages.some(m=>m.includes('闪避')));
            assert.equal(g.run('battleState.enemies[0].currentHp'),1);
        } else {
            assert.equal(g.run('battleState.enemies[0]._dead'),true);
            assert(g.messages.some(m=>m.includes('点伤害')));
        }
    }
});
test('buffs are derived; food, level changes and battle cleanup retain permanent growth',()=>{
    const g=fixture();g.battle();const base=g.p.atk;
    assert.equal(g.c.useSkill('hatred'),true);assert.equal(g.p.atk,base);
    g.c.addPlayerPermanentBonus(g.p,'atk',5);assert.equal(g.p.atk,base+5);
    assert.equal(g.c.getCharacterAttack(g.p),(base+5)*2+2);
    g.run('gameState.player.level++;applyPlayerLevelBalance(gameState.player,true)');
    assert.equal(g.c.getCharacterAttack(g.p),g.p.atk*2+2);
    g.c._cleanupBattleState();assert.equal(g.p.permanentBonuses.atk,5);
});
test('debuffs expire after two target actions; stronger effects are not added together',()=>{
    const g=fixture();const enemy={atk:20,def:20,statusEffects:{atk:{remaining:2,reduction:.15}}};
    assert.equal(g.c.effectiveEnemyStat(enemy,'atk'),17);g.c.tickEnemyEffects(enemy);assert.equal(g.c.effectiveEnemyStat(enemy,'atk'),17);
    g.c.tickEnemyEffects(enemy);assert.equal(g.c.effectiveEnemyStat(enemy,'atk'),20);
});
test('all six dungeon entrances produce connected rooms and durable metadata',()=>{
    const g=fixture();g.c.checkHostileNPCs=()=>{};
    for(let i=1;i<=6;i++) {
        const d=g.run(`EXPLORATION_DEFINITIONS[${i}]`);g.p.location=d.anchor;
        g.run('gameState.gameFlags.mineSurveyRead=true;gameState.gameFlags.storehouseNoticeRead=true;gameState.gameFlags.monasteryCourtyardCleared=true');
        g.messages.length=0;
        assert.equal(g.c.enterExploration(d.id),true,d.id);
        assertTravelCaption(g);
        const active=g.run('gameState.activeDungeon');assert(active.instanceId);assert(active.roomIds.length>=5);
        assert.equal(g.run('gameState.world[gameState.activeDungeon.bossRoomId].isDungeonBossRoom'),true);
        g.messages.length=0;
        assert.equal(g.c.leaveExploration(),true);assert.equal(g.p.location,d.anchor);assertTravelCaption(g);
        assert.equal(g.c.abandonExploration(),true);
    }
});
test('completion only records the clear and does not grant fixed rewards, choices or tokens',()=>{
    const g=fixture();g.c.checkHostileNPCs=()=>{};
    g.run("gameState.player.location='mine_exit_4';gameState.gameFlags.mineSurveyRead=true;enterExploration('sealed_mine_gallery')");
    const d=g.run('gameState.activeDungeon');assert.equal(g.c.completeExploration(d),true);assert.equal(g.c.completeExploration(d),false);
    assert.equal(g.c.bookCount('training_book_normal'),0);assert.equal(g.p.gold,0);
    assert.equal(g.run('explorationProgress().firstClears.sealed_mine_gallery'),true);
    assert.equal(typeof g.c.claimExplorationChoice,'undefined');
    assert.equal(typeof g.c.exchangeExploration,'undefined');
    assert.equal(g.c.bookCount('book_quick_stab'),0);
});
test('scene opens dungeon details and has no reward or supply hub',()=>{
    const g=fixture();g.p.location='workshop';
    assert.doesNotMatch(g.c.explorationSceneActions(),/告示|解锁|readExplorationNotice/);
    g.p.location='mine_exit_4';
    assert.match(g.c.explorationSceneActions(),/showExplorationDetail\('sealed_mine_gallery'\)/);
    assert.doesNotMatch(g.c.explorationSceneActions(),/enterExploration\(/);
    assert.doesNotMatch(g.c.explorationSceneActions(),/探索、奖励与补给|凭证|兑换|补给/);
    assert.equal(typeof g.c.buySupply,'undefined');
    assert.equal(typeof g.c.claimExplorationSideReward,'undefined');
});
test('enemy drops equipment, original and same-rarity manual on the ground once; pickup survives save/load',async()=>{
    const g=fixture();g.c.checkHostileNPCs=()=>{};
    g.run("Math.random=()=>0;gameState.player.location='mine_exit_4';gameState.gameFlags.mineSurveyRead=true;enterExploration('sealed_mine_gallery')");
    const d=g.run('gameState.activeDungeon'),room=d.roomIds[1];g.p.location=room;
    g.battle(['expedition_1_enemy']);const enemy=g.run('battleState.enemies[0]');
    g.c._applyDamageToUnit(enemy,99999,false,null,room);
    const drops=g.run(`gameState.world['${room}'].items.filter(id=>id.startsWith('drop_'))`);
    assert.equal(drops.length,3);
    assert(drops.some(id=>g.c.itemTemplateId(g.c.getItemInfoById(id))==='pit_pick'));
    assert(drops.some(id=>g.c.itemTemplateId(g.c.getItemInfoById(id))==='book_quick_stab'));
    assert(drops.some(id=>g.c.itemTemplateId(g.c.getItemInfoById(id))==='training_book_normal'));
    g.c._applyDamageToUnit(enemy,99999,false,null,room);
    assert.equal(g.run(`gameState.world['${room}'].items.filter(id=>id.startsWith('drop_')).length`),3);
    g.c.pickupItem(drops[1]);
    assert.equal(g.c.bookCount('book_quick_stab'),1);
    await g.c.saveGame();assert.equal(await g.c.loadGame(),true);
    assert.equal(g.c.bookCount('book_quick_stab'),1);
    assert.equal(g.run(`gameState.world['${room}'].items.filter(id=>id.startsWith('drop_')).length`),2);
});
test('drop chances can yield nothing, and previous pending choices and tokens migrate once',async()=>{
    const g=fixture();g.c.checkHostileNPCs=()=>{};
    g.run("Math.random=()=>.99;gameState.player.location='mine_exit_4';gameState.gameFlags.mineSurveyRead=true;enterExploration('sealed_mine_gallery')");
    const room=g.run('gameState.activeDungeon.roomIds[1]');g.p.location=room;g.battle(['expedition_1_enemy']);
    g.c._applyDamageToUnit(g.run('battleState.enemies[0]'),99999,false,null,room);
    assert.equal(g.run(`gameState.world['${room}'].items.filter(id=>id.startsWith('drop_')).length`),0);
    g.run("gameState.exploration={discovered:{},firstClears:{},pending:{old:{choices:['book_quick_stab','book_steady_cut']}},tokens:{sealed_mine_gallery:2}}");
    await g.c.saveGame();assert.equal(await g.c.loadGame(),true);
    assert.equal(g.c.bookCount('book_quick_stab'),1);assert.equal(g.c.bookCount('training_book_normal'),2);
    assert.equal(g.run('gameState.exploration.tokens'),undefined);
    await g.c.saveGame();assert.equal(await g.c.loadGame(),true);
    assert.equal(g.c.bookCount('book_quick_stab'),1);assert.equal(g.c.bookCount('training_book_normal'),2);
});
test('trial boss can drop a knight piece instead of granting the full set on completion',()=>{
    const g=fixture();g.c.checkHostileNPCs=()=>{};
    g.run("Math.random=()=>0;gameState.player.location='training_ground';enterExploration('knight_trial')");
    const d=g.run('gameState.activeDungeon');g.p.location=d.bossRoomId;
    g.battle(['expedition_3_boss']);g.c._applyDamageToUnit(g.run('battleState.enemies[0]'),99999,false,null,d.bossRoomId);
    const ids=g.run(`gameState.world['${d.bossRoomId}'].items`);
    assert(ids.some(id=>g.c.itemTemplateId(g.c.getItemInfoById(id))==='knight_greatsword'));
    assert.equal(g.run('gameState.gameFlags.knightSupplyClaimed'),undefined);
    assert(!g.p.inventory.some(item=>g.c.itemTemplateId(item)==='knight_greatsword'));
});
test('completed dungeon can be restarted directly; unpicked ground loot is cleared only after confirmation',()=>{
    const g=fixture();g.c.checkHostileNPCs=()=>{};
    g.run("Math.random=()=>0;gameState.player.location='mine_exit_4';gameState.gameFlags.mineSurveyRead=true;enterExploration('sealed_mine_gallery')");
    const old=g.run('gameState.activeDungeon.instanceId'),room=g.run('gameState.activeDungeon.roomIds[1]');
    g.c.spawnExplorationDrop(g.run(`gameState.world['${room}']`),'book_quick_stab');
    g.c.completeExploration(g.run('gameState.activeDungeon'));g.c.leaveExploration();
    assert.match(g.c.explorationSceneActions(),/showExplorationDetail\('sealed_mine_gallery'\)/);
    g.c.showExplorationDetail('sealed_mine_gallery');
    assert.match(g.run('UI.lastDetail'),/重置副本/);
    assert.equal(g.c.restartExploration('sealed_mine_gallery'),true);
    assert.notEqual(g.run('gameState.activeDungeon.instanceId'),old);
    assert.equal(g.run(`gameState.world['${room}'].items.length`),0);
    assert.equal(g.c.bookCount('book_quick_stab'),0);
});
test('enemies left after an early boss clear still roll their own ground drops',()=>{
    const g=fixture();g.c.checkHostileNPCs=()=>{};
    g.run("Math.random=()=>0;gameState.player.location='mine_exit_4';gameState.gameFlags.mineSurveyRead=true;enterExploration('sealed_mine_gallery')");
    const d=g.run('gameState.activeDungeon'),room=d.roomIds[1];
    g.c.completeExploration(d);g.p.location=room;g.battle(['expedition_1_enemy']);
    g.c._applyDamageToUnit(g.run('battleState.enemies[0]'),99999,false,null,room);
    assert.equal(g.run(`gameState.world['${room}'].items.filter(id=>id.startsWith('drop_')).length`),3);
});
test('training defeat preserves pre-entry resources and creates no rewards or corpses',()=>{
    const g=fixture();g.c.checkHostileNPCs=()=>{};g.p.location='training_ground';g.p.hp=9;g.p.sp=3;
    g.c.enterExploration('knight_trial');const d=g.run('gameState.activeDungeon');g.p.location=d.roomIds[1];g.battle(['expedition_3_enemy']);
    g.p.hp=0;g.c.battleEnd(false);assert.equal(g.p.location,'training_ground');assert.equal(g.p.hp,9);assert.equal(g.p.sp,3);
    assert.equal(g.p.gold,0);assert.equal(g.reloads,0);
});
test('v3 migration preserves learned skills and grants qualified old knight skills exactly once',()=>{
    const g=fixture();g.run("delete gameState.player.skillProgress;gameState.player.skills=['hatred'];gameState.player.inventory=['knight_greatsword','knight_armor','knight_emblem'].map(createItemFromTemplate);migrateProgression029(gameState,3)");
    assert.equal(g.c.skillLevel('player_sacrifice'),1);
    g.run("gameState.player.skillProgress.player_sacrifice.level=4;migrateProgression029(gameState,3)");assert.equal(g.c.skillLevel('player_sacrifice'),4);
});
test('dynamic original weapon instances use template identity, not full instance ID',()=>{
    const g=fixture();g.run("ITEM_TEMPLATES.knight_greatsword_123={...ITEM_TEMPLATES.knight_greatsword,id:'knight_greatsword_123'}");
    assert.equal(g.c.itemTemplateId({id:'knight_greatsword_123'}),'knight_greatsword');
});
test('save/load restores lock, cooldown, action budget, books and dungeon; old callbacks are invalid',async()=>{
    const g=fixture();g.c.checkHostileNPCs=()=>{};g.learn('quick_stab');g.p.location='forest_start';g.c.enterExploration('forest_supply_camp');
    const d=g.run('gameState.activeDungeon');g.p.location=d.roomIds[2];g.battle(['expedition_2_enemy','expedition_2_enemy']);
    g.run("gameState.player.equipment.weapon=createItemFromTemplate('fruit_knife');battleState.enemies.forEach(e=>e.currentHp=1000)");
    const id=g.run('battleState.enemies[1].entityId');g.c.selectBattleTarget(id);g.c.useSkill('quick_stab');
    g.c.queueBattleStep('turn');const oldCallbacks=[...g.timers.values()].map(t=>t.fn);
    await g.c.saveGame();const saved=JSON.parse(g.saved);assert.equal(saved.version,4);assert(saved.activeDungeon.instanceId);
    assert.equal(await g.c.loadGame(),true);assert.equal(g.run('battleState.selectedEnemyEntityId'),id);assert.equal(g.run('battleState.paused'),false);
    assert.equal(g.timers.size,1); // restored next action is scheduled exactly once
    assert.equal(g.run('battleState.attackUsed'),true);assert.equal(g.run('battleState.skillReadyRounds.quick_stab'),2);
    const hp=g.p.hp;oldCallbacks.forEach(fn=>fn());assert.equal(g.p.hp,hp);
    assert.equal(g.run('gameState.activeDungeon.instanceId'),d.instanceId);
    const enemyHp=g.run('battleState.enemies.map(e=>e.currentHp).join()');
    for(let step=0;step<2;step++) {
        const [timerId,timer]=g.timers.entries().next().value;g.timers.delete(timerId);timer.fn();
    }
    assert.equal(g.run('battleState.enemies.map(e=>e.currentHp).join()'),enemyHp);
    assert(g.p.hp<hp); // saved player action is not repeated; the enemy proceeds automatically
});
test('cancelled save resumes same encounter without granting a fresh action',async()=>{
    const g=fixture();g.battle();g.run('battleState.attackUsed=true');
    g.c.showSaveFilePicker=async()=>{throw Object.assign(new Error('cancel'),{name:'AbortError'})};await g.c.saveGame();
    assert.equal(g.run('battleState.paused'),false);assert.equal(g.run('battleState.attackUsed'),true);
});
test('every dungeon can be completed through actual unit deaths, not direct reward calls',()=>{
    const g=fixture();g.c.checkHostileNPCs=()=>{};
    for(let number=1;number<=6;number++) {
        const def=g.run(`EXPLORATION_DEFINITIONS[${number}]`);
        g.p.location=def.anchor;
        g.run('gameState.gameFlags.mineSurveyRead=true;gameState.gameFlags.storehouseNoticeRead=true;gameState.gameFlags.monasteryCourtyardCleared=true');
        assert.equal(g.c.enterExploration(def.id),true);
        const d=g.run('gameState.activeDungeon');
        // Boss room is deliberately processed last, as in the generated routes.
        for(const room of [...d.roomIds.filter(id=>id!==d.bossRoomId),d.bossRoomId]) {
            const ids=[...g.run(`gameState.world['${room}'].npcs`)];if(!ids.length) continue;
            g.p.location=room;g.battle(ids);
            if(number===3 && ids.length>1) g.c.selectBattleTarget(g.run('battleState.enemies[1].entityId'));
            const enemies=g.run('battleState.enemies');
            for(const enemy of enemies) g.c._applyDamageToUnit(enemy,999999,false,null,room);
            g.c._afterSkillResolution();
        }
        assert.equal(d.completed,true,def.id);assert.equal(g.run(`explorationProgress().firstClears['${def.id}']`),true);
        if(number===3) assert.equal(g.run('gameState.gameFlags.knightSupplyClaimed'),undefined);
        if(number===5) assert(g.run(`gameState.world['${d.bossRoomId}'].items`).some(id=>id.startsWith('mage_crystal_')));
        assert.equal(g.c.leaveExploration(),true);assert.equal(g.c.abandonExploration(),true);
    }
});
test('flee and resume keep target, SP, used skill and pending turn position even after a death',()=>{
    const g=fixture();g.battle();
    g.run("gameState.world.mine_deep.exits.north='mine_exit';gameState.player.agi=100");
    const [a,b]=g.run('battleState.enemies');g.c._applyDamageToUnit(a,9999,false,null,'mine_deep');
    g.c.selectBattleTarget(b.entityId);g.c.useSkill('hatred');g.p.agi=100; // force flee success despite buff by deterministic zero roll
    g.run('Math.random=()=>0;battleState.currentTurnIndex=1;battleState.nextStep="turn"');
    assert.equal(g.c.tryFlee('north'),true);const sp=g.p.sp;
    g.p.location='mine_deep';assert.equal(g.c.maybeResumeOrReportBackgroundBattle('mine_deep'),true);
    assert.equal(g.run('battleState.enemies.length'),2);assert.equal(g.c.resolvePlayerTarget().entityId,b.entityId);
    assert.equal(g.run('battleState.currentTurnIndex'),1);assert.equal(g.run('battleState.usedSkills.hatred'),true);assert.equal(g.p.sp,sp);
    assert.equal(g.run('battleState.paused'),false);
    assert.equal(g.run('battleTimers.size'),1);
});
test('one dead guard template does not wipe other rooms or skip same-template combatants',()=>{
    const g=fixture();g.run("gameState.world.mine_deep.npcs=['castle_guard_1','castle_guard_1'];gameState.world.mine_exit.npcs=['castle_guard_1'];startBattle('castle_guard_1')");
    assert.equal(g.run('battleState.enemies.length'),2);
    for(const e of g.run('battleState.enemies')) g.c._applyDamageToUnit(e,9999,false,null,'mine_deep');g.c._afterSkillResolution();
    assert.equal(g.run('gameState.world.mine_exit.npcs.length'),1);
});
test('all six dungeons are open at their entrances with no notices, clears or prior victories',()=>{
    const g=fixture();
    g.run('gameState.gameFlags.mineSurveyRead=false;gameState.gameFlags.storehouseNoticeRead=false;gameState.gameFlags.monasteryCourtyardCleared=false');
    for(const def of g.run('EXPLORATION_DEFINITIONS.filter(Boolean)')) {
        g.p.location=def.anchor;
        assert.equal(g.c.explorationAvailable(def),true,def.id);
        assert.equal(g.c.explorationAccessText(def),'');
        g.c.showExplorationDetail(def.id);
        assert(g.run('UI.lastDetail').includes(`enterExploration('${def.id}')" >进入副本`));
        assert.doesNotMatch(g.c.explorationSceneActions(),/告示|挑战外庭|前置遭遇/);
        assert.equal(g.c.enterExploration(def.id),true,def.id);
        assert.equal(g.run('battleState.inBattle'),false);
        assert.equal(g.c.leaveExploration(),true);
        assert.equal(g.c.abandonExploration(),true);
    }
    assert.equal(g.run('gameState.gameFlags.mineSurveyRead'),false);
    assert.equal(g.run('gameState.gameFlags.storehouseNoticeRead'),false);
    assert.equal(g.run('gameState.gameFlags.monasteryCourtyardCleared'),false);
    g.p.location='town_square';
    for(const number of [1,2,3])assert.equal(g.c.explorationAvailable(g.run(`EXPLORATION_DEFINITIONS[${number}]`)),true);
    assert.doesNotMatch(g.c.explorationSceneActions(),/告示|阅读/);
    assert.equal(typeof g.c.readExplorationNotice,'undefined');
    assert.equal(typeof g.c.clearMonasteryCourtyard,'undefined');
});

test('old saves with missing or false unlock flags can enter every dungeon directly',async()=>{
    for(const flags of [{},{mineSurveyRead:false,storehouseNoticeRead:false,monasteryCourtyardCleared:false}]) {
        const g=fixture();g.c.oldUnlockFlags=flags;g.run('gameState.gameFlags={...oldUnlockFlags}');
        await g.c.saveGame();assert.equal(await g.c.loadGame(),true);
        for(const def of g.run('EXPLORATION_DEFINITIONS.filter(Boolean)')) {
            g.p.location=def.anchor;assert.equal(g.c.enterExploration(def.id),true,def.id);
            assert.equal(g.c.leaveExploration(),true);assert.equal(g.c.abandonExploration(),true);
        }
    }
});
test('new effects applied after enemy action are not decremented by its pending completion',()=>{
    const g=fixture();const enemy={statusEffects:{atk:{reduction:.1,remaining:2,generation:2}}};
    g.c.tickEnemyEffects(enemy,{atk:1});assert.equal(enemy.statusEffects.atk.remaining,2);
    g.c.tickEnemyEffects(enemy,{atk:2});assert.equal(enemy.statusEffects.atk.remaining,1);
});
test('round transition blocks extra skill before the new-round reset',()=>{
    const g=fixture();g.learn('quick_stab');g.battle();g.run("gameState.player.equipment.weapon=createItemFromTemplate('fruit_knife')");
    g.c.queueBattleStep('round');const sp=g.p.sp;
    assert.equal(g.c.useSkill('quick_stab'),false);assert.equal(g.p.sp,sp);
});
test('combat controls are explicitly exempted from the existing overlay pointer block',()=>{
    const g=fixture();g.battle();g.run('battleState.paused=true');const html=g.c.renderBattleDetail();
    assert.doesNotMatch(html,/continueBattle|saveGame|开始[／]?战斗|保存战斗/);
    assert.match(html,/class="battle-control" onclick="selectBattleTarget/);
    assert.match(fs.readFileSync(path.join(root,'index.html'),'utf8'),/button:not\(\.skill-button\):not\(\.battle-control\)/);
});
test('plain accessory stats participate in combat totals',()=>{
    const g=fixture();g.run("gameState.player.equipment.accessory=createItemFromTemplate('smuggler_ring')");assert.equal(g.c.getCharacterAttack(g.p),g.p.atk+4);
    g.run("gameState.player.equipment.accessory=createItemFromTemplate('drill_badge')");assert.equal(g.c.getCharacterDefense(g.p),g.p.def+3);
});
test('clearing skipped encounters after the boss still completes the dungeon once',()=>{
    const g=fixture();g.c.checkHostileNPCs=()=>{};g.p.location='forest_start';g.c.enterExploration('forest_supply_camp');
    const d=g.run('gameState.activeDungeon');
    for(const room of [d.bossRoomId,...d.roomIds.filter(id=>id!==d.bossRoomId)]) {
        g.p.location=room;const ids=[...g.run(`gameState.world['${room}'].npcs`)];if(!ids.length) continue;
        g.battle(ids);for(const e of g.run('battleState.enemies')) g.c._applyDamageToUnit(e,99999,false,null,room);g.c._afterSkillResolution();
    }
    assert.equal(d.completed,true);assert.equal(g.run('explorationProgress().firstClears.forest_supply_camp'),true);
});
test('a serialized story completion handler is restored; an unrelated stale callback is cleared',async()=>{
    const g=fixture();g.battle();g.run("battleState.completionHandler='slum_attack';window._onBattleEnd=slumAttackBattleCompleted");
    await g.c.saveGame();g.run('window._onBattleEnd=()=>{throw new Error("stale callback")}');
    assert.equal(await g.c.loadGame(),true);
    assert.equal(g.run('window._onBattleEnd===slumAttackBattleCompleted'),true);
    g.c._cleanupBattleState();assert.equal(g.c._onBattleEnd,null);
});
test('ordinary combat starts automatically and reaches victory without duplicate actions or button clicks',()=>{
    const g=fixture();g.p.atk=100;
    g.run("gameState.world[gameState.player.location].npcs=['expedition_1_enemy'];startBattle('expedition_1_enemy')");
    assert.equal(g.run('battleState.paused'),false);
    assert.equal(g.timers.size,1);
    assert.equal(g.run('battleState.roundReady'),false);
    let steps=0;
    while(g.run('battleState.inBattle') && steps++<30) {
        const next=g.timers.entries().next().value;assert(next,'combat has a scheduled continuation');
        g.timers.delete(next[0]);next[1].fn();
    }
    assert.equal(g.run('battleState.inBattle'),false);assert(steps<30);assert(g.messages.some(m=>m.includes('胜利')));
});

test('automatic opening leaves time to lock a target and ignores repeated start or resume clicks',()=>{
    const g=fixture();g.p.atk=1;g.p.agi=100;
    g.run("gameState.world[gameState.player.location].npcs=['expedition_1_enemy','expedition_1_enemy'];startMultiBattle(['expedition_1_enemy','expedition_1_enemy'])");
    const [a,b]=g.run('battleState.enemies');g.c.selectBattleTarget(b.entityId);
    g.c.startBattle('expedition_1_enemy');g.c.continueBattle();
    assert.equal(g.timers.size,1);
    assert.doesNotMatch(g.c.renderBattleDetail(),/continueBattle|saveGame|保存战斗/);
    for(let step=0;step<2;step++) {
        const [id,timer]=g.timers.entries().next().value;g.timers.delete(id);timer.fn();
    }
    assert.equal(g.run('battleState.round'),1);
    assert.equal(a.currentHp,a.maxHp);
    assert(b.currentHp<b.maxHp);
    assert.equal(g.run('battleState.attackUsed'),true);
    assert.equal(g.run('battleTimers.size'),1);
});
test('existing skill detail provides upgrades and refreshes the same detail panel',()=>{
    const g=fixture();g.learn('quick_stab');g.c.addRewardItems('training_book_normal');
    g.c.showSkillsPanel();g.c.showSkillDetail('quick_stab');
    assert.match(g.run('UI.lastDetail'),/普通 · 迅刺 Lv.1/);
    assert.match(g.run('UI.lastDetail'),/upgradeLearnedSkill\('quick_stab',1\)/);
    assert.match(g.run('UI.lastDetail'),/普通技能研习册：1 \/ 1/);
    assert.equal(g.c.upgradeLearnedSkill('quick_stab',1),true);
    assert.equal(g.run('currentPanel'),'skill_detail');
    assert.match(g.run('UI.lastDetail'),/迅刺 Lv.2/);
    assert.match(g.run('UI.lastDetail'),/disabled>升级（研习册不足）/);
    g.run('gameState.player.skillProgress.quick_stab.level=5');g.c.showSkillDetail('quick_stab');
    assert.match(g.run('UI.lastDetail'),/已满级/);
    assert.doesNotMatch(g.run('UI.lastDetail'),/onclick="upgradeLearnedSkill/);
});
test('inventory book action checks level, combat and ownership; consumes the clicked dynamic copy',()=>{
    const g=fixture();g.c.addRewardItems('book_heavy_cut');g.c.examineItemFromPanel('book_heavy_cut');
    assert.match(g.run('UI.lastDetail'),/disabled>📖 学习技能/);
    assert.equal(g.c.useSkillBookFromInventory('book_heavy_cut'),false);
    g.run("gameState.player.inventory.push({...ITEM_TEMPLATES.book_quick_stab,id:'book_quick_stab_copy',templateId:'book_quick_stab'})");
    g.c.addRewardItems('book_quick_stab');
    assert.equal(g.c.useSkillBookFromInventory('book_quick_stab_copy'),true);
    assert(!g.p.inventory.some(i=>i.id==='book_quick_stab_copy'));
    assert.equal(g.c.bookCount('book_quick_stab'),1);
    g.c.examineItemFromPanel('book_quick_stab');
    assert.match(g.run('UI.lastDetail'),/useSkillBookFromInventory\('book_quick_stab',true\)/);
    g.battle();assert.equal(g.c.useSkillBookFromInventory('book_quick_stab',true),false);
    assert.equal(g.c.bookCount('book_quick_stab'),1);
});
test('training books are inventory materials, not learning or free skill entry points',()=>{
    const g=fixture();g.c.addRewardItems('training_book_normal');g.c.examineItemFromPanel('training_book_normal');
    assert.match(g.run('UI.lastDetail'),/升级材料/);
    assert.doesNotMatch(g.run('UI.lastDetail'),/useSkillBookFromInventory|showSkillLibrary/);
    assert.equal(g.c.useSkillBookFromInventory('training_book_normal'),false);
    assert.equal(g.p.skills.length,1);
    assert.equal(g.c.skillLevel('hatred'),1);
    assert.match(g.c.generateInventoryCategoryMenu(),/showInventoryCategory\('skill_book'\)/);
    assert.match(fs.readFileSync(path.join(root,'index.html'),'utf8'),/id="btn-skills" onclick="showSkillsPanel\(\)"/);
});

function finishSupervisorClimb(g) {
    assert.equal(g.p.location,'mine_exit','the ladder completes the passage immediately');
    assert.equal([...g.timers.values()].some(timer=>timer.delay===1500),false);
}
test('ordinary supervisor is neutral on entry but remains voluntarily attackable',()=>{
    const g=fixture();g.p.location='north_tunnel';g.c.move('n');
    assert.equal(g.p.location,'tunnel_exit');
    assert.equal(g.run('battleState.inBattle'),false);
    assert.equal([...g.timers.values()].some(t=>t.delay===800),false);
    assert.equal(g.c.getCharacterInfo('mine_supervisor').hostile,false);
    assert.equal(g.c.getCharacterInfo('mine_supervisor').canFight,true);
    assert.equal(g.c.getCharacterInfo('mad_supervisor').hostile,true);
    g.c.showNPCInfo('mine_supervisor');
    assert.match(g.run('UI.lastDetail'),/handInSupervisorStones\(\).*上交100块石块/);
    assert.match(g.run('UI.lastDetail'),/attackNPC\('mine_supervisor'\)/);
    assert.doesNotMatch(g.run('UI.lastDetail'),/此人物具有敌意/);
});
test('99 stones neither pay nor open the upward passage',()=>{
    const g=fixture();g.p.location='tunnel_exit';g.c.addRewardItems('stone',99);
    g.c.useSupervisorLadder();
    assert.equal(g.p.inventory.filter(i=>i.id==='stone').length,99);
    assert.equal(g.run('gameState.gameFlags.mineSupervisorPaid'),undefined);
    assert.equal(g.p.location,'tunnel_exit');
    assert.equal([...g.timers.values()].some(t=>t.delay===1500),false);
    assert(g.messages.some(m=>m.includes('还需要 1 块')));
});

test('supervisor speaks as an overseer; NPC dialogue has one blank line in next and skip playback',()=>{
    for(const mode of ['next','skip']) {
        const g=fixture();g.p.location='tunnel_exit';
        g.c.realBrowserPrint=g.browserPrint;
        g.run('UI.print=realBrowserPrint; UI.elements.output.innerHTML=""');
        const lines=g.c.getCharacterInfo('mine_supervisor').dialogue;
        assert.match(lines.join(),/一百块石头/);
        assert.doesNotMatch(lines.join(),/来找我上交|使用木梯|让开通道/);
        g.c.talkToNPCAction('mine_supervisor');
        if(mode==='skip') g.run('StoryEngine.skipLines()');
        else for(let i=0;i<lines.length;i++) g.run('UI.elements.nextBtn.onclick()');
        const expected=lines.map(line=>`<span style="color: #ff8844;">${line}</span><br><br>`).join('');
        assert.equal(g.run('UI.elements.output.innerHTML'),expected);
        assert.equal(g.run('gameState.talkedNPCs.mine_supervisor'),true);
        assert.equal(g.run('StoryEngine._currentPlayLines'),null);
        assert.equal(g.run('UI.elements.nextBtn.style.display'),'none');
        assert.equal(g.c.getCharacterInfo('mine_supervisor').hostile,false);
    }
});
test('100 stones permanently open the passage without removing the living supervisor',()=>{
    const g=fixture();g.p.location='tunnel_exit';g.c.addRewardItems('stone',100);
    g.c.showNPCInfo('mine_supervisor');
    assert.equal(g.c.handInSupervisorStones(),true);
    assert.equal(g.p.location,'tunnel_exit');
    assert.equal(g.p.inventory.filter(i=>i.id==='stone').length,0);
    assert.equal(g.run('gameState.gameFlags.mineSupervisorPaid'),true);
    assert.equal(g.run('gameState.world.tunnel_exit.npcs.includes("mine_supervisor")'),true);
    assert.match(g.run('UI.lastDetail'),/通道已开放/);
    assert.doesNotMatch(g.run('UI.lastDetail'),/onclick="handInSupervisorStones/);
    g.c.usePortal('ladder');finishSupervisorClimb(g);assert.equal(g.p.location,'mine_exit');
    g.p.location='tunnel_exit';g.c.useSupervisorLadder();finishSupervisorClimb(g);
    assert.equal(g.p.location,'mine_exit');
    let lines;g.run('StoryEngine.checkFirstTalk=()=>{}');g.run('StoryEngine.playLines=options=>window.captureDialogue(options.lines)');
    g.c.captureDialogue=value=>{lines=value};g.c.talkToNPCAction('mine_supervisor');
    assert.match(lines.join(),/已经收到了/);
});
test('payment consumes exactly 100 stones including dynamic copies, preserves other items and is idempotent',()=>{
    const g=fixture();g.p.location='tunnel_exit';g.c.addRewardItems('bread');g.c.addRewardItems('stone',99);
    g.run("gameState.player.inventory.push({...ITEM_TEMPLATES.stone,id:'stone_copy',templateId:'stone'})");
    g.c.addRewardItems('stone',3);
    assert.equal(g.c.handInSupervisorStones(),true);
    assert.equal(g.p.inventory.filter(i=>i.id==='stone').length,3);
    assert.equal(g.p.inventory.some(i=>i.id==='stone_copy'),false);
    assert.equal(g.p.inventory.filter(i=>i.id==='bread').length,1);
    assert.equal(g.c.handInSupervisorStones(),true);
    assert.equal(g.p.inventory.filter(i=>i.id==='stone').length,3);
});
test('voluntary supervisor combat and actual death unlock the ladder with no stones',()=>{
    const g=fixture();g.p.location='tunnel_exit';g.c.attackNPC('mine_supervisor');
    assert.equal(g.run('battleState.inBattle'),true);
    const enemy=g.run('battleState.enemies[0]');
    g.c._applyDamageToUnit(enemy,enemy.maxHp+100);g.c.battleEnd(true);
    assert.equal(g.run('gameState.world.tunnel_exit.npcs.includes("mine_supervisor")'),false);
    assert.equal(g.run('gameState.gameFlags.mineSupervisorPaid'),undefined);
    g.c.useSupervisorLadder();finishSupervisorClimb(g);assert.equal(g.p.location,'mine_exit');
});
test('paid and killed supervisor routes survive save/load; legacy missing-supervisor saves stay open',async()=>{
    for(const route of ['paid','killed','legacy']) {
        const g=fixture();g.p.location='tunnel_exit';
        if(route==='paid') {g.c.addRewardItems('stone',100);g.c.handInSupervisorStones();}
        else if(route==='killed') {
            g.c.attackNPC('mine_supervisor');const enemy=g.run('battleState.enemies[0]');
            g.c._applyDamageToUnit(enemy,enemy.maxHp+100);g.c.battleEnd(true);
        } else g.run("gameState.world.tunnel_exit.npcs=[];delete gameState.gameFlags.mineSupervisorPaid");
        await g.c.saveGame();assert.equal(await g.c.loadGame(),true);
        assert.equal(g.run('gameState.world.tunnel_exit.npcs.includes("mine_supervisor")'),route==='paid');
        g.c.useSupervisorLadder();finishSupervisorClimb(g);assert.equal(g.p.location,'mine_exit');
        assert.equal(g.p.inventory.filter(i=>i.id==='stone').length,0);
    }
});
test('combat and remote clicks cannot pay or use the supervisor ladder',()=>{
    const g=fixture();g.c.addRewardItems('stone',100);
    assert.equal(g.c.handInSupervisorStones(),false);g.c.useSupervisorLadder();
    assert.equal(g.p.inventory.filter(i=>i.id==='stone').length,100);
    g.p.location='tunnel_exit';g.c.attackNPC('mine_supervisor');
    assert.equal(g.c.handInSupervisorStones(),false);g.c.useSupervisorLadder();
    assert.equal(g.p.inventory.filter(i=>i.id==='stone').length,100);
    assert.equal(g.run('gameState.gameFlags.mineSupervisorPaid'),undefined);
    assert.equal([...g.timers.values()].some(t=>t.delay===1500),false);
});
test('an instant upward passage leaves no old travel callback after loading',async()=>{
    const g=fixture();g.p.location='tunnel_exit';g.c.addRewardItems('stone',100);g.c.handInSupervisorStones();
    await g.c.saveGame();g.c.useSupervisorLadder();
    finishSupervisorClimb(g);
    const oldCallbacks=[...g.timers.values()].map(timer=>timer.fn);
    assert.equal(await g.c.loadGame(),true);oldCallbacks.forEach(fn=>fn());
    assert.equal(g.p.location,'tunnel_exit');
    g.c.useSupervisorLadder();finishSupervisorClimb(g);assert.equal(g.p.location,'mine_exit');
});

function assertTravelCaption(g) {
    const captions=g.messages.filter(message=>message.includes('class="travel-text"'));
    assert.equal(captions.length,1,'one travel caption per successful crossing');
    assert.match(captions[0],/style="color: #cc9966;"/);
    assert.doesNotMatch(captions[0],/<br|[\r\n]/);
    assert.equal(g.timers.size,0,'no scheduled travel delay');
    return captions[0];
}
test('every standard scene portal crosses immediately with one same-color caption',()=>{
    const g=fixture();
    g.run("gameState.world.count_castle_gate.npcs=[];gameState.world.dungeon_entrance.npcs=[]");
    for(const key of ['mine_side_key','mansion_key','skull_key','dungeon_key'])g.c.addRewardItems(key);
    for(const [id,def] of Object.entries(g.run('PORTAL_DEFS'))) {
        g.p.location='mine_deep';g.messages.length=0;
        assert.equal(g.c.usePortal(id),true,id);
        assert.equal(g.p.location,def.targetRoom,id);
        assertTravelCaption(g);
    }
});
test('instant portals still require keys and defeated guards and cannot bypass combat',()=>{
    const g=fixture();const initial=g.p.location;
    assert.equal(g.c.usePortal('side_gate_door'),false);assert.equal(g.p.location,initial);
    g.p.location='count_castle_gate';
    assert.equal(g.c.usePortal('castle_gate_door'),false);assert.equal(g.p.location,'count_castle_gate');
    g.c.addRewardItems('dungeon_key');g.p.location='dungeon_entrance';
    assert.equal(g.c.usePortal('dungeon_door'),false);assert.equal(g.p.location,'dungeon_entrance');
    g.run('battleState.inBattle=true');
    assert.equal(g.c.usePortal('ladder_3'),false);
    assert.equal(g.c.useRemovedLadder(),false);
    assert.equal(g.p.location,'dungeon_entrance');
    assert.equal(g.messages.some(message=>message.includes('class="travel-text"')),false);
    assert.equal(g.timers.size,0);
});
test('church doors, mine return and both directions of the removed ladder use the same instant path',()=>{
    const g=fixture();
    g.c.addRewardItems('removed_ladder');
    for(const [fn,from,to] of [
        ['enterChurchPorch','church_gate','church_porch'],['leaveChurchToGate','church_porch','church_gate'],
        ['enterChurchAltar','church_back_door','church_altar'],['leaveChurchToBackDoor','church_altar','church_back_door'],
        ['enterSanghuashanMine','road','mountain_path_13'],
        ['useRemovedLadder','tunnel_exit_4','mine_exit_4'],['useRemovedLadder','mine_exit_4','tunnel_exit_4']
    ]) {
        g.p.location=from;g.messages.length=0;
        assert.equal(g.c[fn](),true,fn);assert.equal(g.p.location,to);assertTravelCaption(g);
    }
});
test('tunnel and teleport-circle destinations have no delayed travel or overlay',()=>{
    const g=fixture();let overlayEnabled=false;
    g.c.trackOverlay=active=>{if(active)overlayEnabled=true};g.run('UI.setOverlay=trackOverlay');
    g.run("gameState.world.mine_deep.items.push('tunnel_entrance');gameState.world.test_mod={name:'测试世界',items:[],npcs:[],exits:{}}");
    assert.equal(g.c.enterTunnel(),true);assert.equal(g.p.location,'basement');assertTravelCaption(g);
    g.messages.length=0;assert.equal(g.c.teleportToMod('test_mod'),true);assert.equal(g.p.location,'test_mod');assertTravelCaption(g);
    g.messages.length=0;assert.equal(g.c.teleportToBasement(),true);assert.equal(g.p.location,'basement');assertTravelCaption(g);
    assert.equal(overlayEnabled,false);
});
test('mirror destinations keep visit locks and show only one travel line',()=>{
    const g=fixture();const initial=g.p.location;
    assert.equal(g.c.teleportViaMirror('town_square'),undefined);assert.equal(g.p.location,initial);
    g.c.recordMirrorDestinationVisit('town_square');g.messages.length=0;
    assert.equal(g.c.teleportViaMirror('town_square'),true);assert.equal(g.p.location,'town_square');assertTravelCaption(g);
    g.run('battleState.inBattle=true');g.messages.length=0;
    assert.equal(g.c.teleportViaMirror('town_square'),false);assert.equal(g.messages.some(m=>m.includes('class="travel-text"')),false);
});
test('mine-pit travel is immediate, retains each damage value and consumes the pit once',()=>{
    for(const [fn,damage]of [['enterMinePit',20],['jumpIntoPit',10]]) {
        const g=fixture();g.p.hp=100;g.p.maxHp=100;
        g.run("gameState.world.mine_deep.items.push('mine_pit_test');ITEM_TEMPLATES.mine_pit_test={id:'mine_pit_test',name:'矿坑'}");
        assert.equal(g.c[fn]('mine_pit_test'),true);assert.equal(g.p.location,'tunnel_exit_4');assert.equal(g.p.hp,100-damage);
        assert.match(assertTravelCaption(g),new RegExp('受到'+damage+'点坠落伤害'));
        assert.equal(g.run('gameState.world.mine_deep.items.includes("mine_pit_test")'),false);
        assert.equal(g.run('ITEM_TEMPLATES.mine_pit_test'),undefined);
    }
});
test('town entrance adds one immediate caption on first event and subsequent visits',()=>{
    const g=fixture();g.run('StoryEngine.init()');
    for(let visit=0;visit<2;visit++) {
        g.p.location='mountain_path_14';g.messages.length=0;
        g.c.enterKarenTown();assert.equal(g.p.location,'road');assertTravelCaption(g);
        assert.equal(g.run('gameState.gameFlags.roadEntered'),true);
        assert.equal(g.run('StoryEngine.completedEvents.includes("karen_town_enter")'),true);
    }
});
test('shared relocation supplies missing captions and ignores old color and delay options',()=>{
    const g=fixture();let callbacks=0;
    g.c.arrived=()=>{callbacks++;assert.equal(g.p.location,'mine_tunnel')};
    assert.equal(g.c.relocateTo('mine_tunnel',{travelText:'你穿过通道。\n<br>已经抵达。',travelColor:'#ff0000',delay:9000,callback:g.c.arrived}),true);
    assert.equal(callbacks,1);assertTravelCaption(g);
    g.messages.length=0;assert.equal(g.c.relocateTo('mine_exit'),true);
    assert.match(assertTravelCaption(g),/二号矿井口/);
    g.messages.length=0;assert.equal(g.c.relocateTo('missing_room'),false);
    assert.equal(g.p.location,'mine_exit');assert.equal(g.messages.some(m=>m.includes('class="travel-text"')),false);
});
test('dungeon cards open descriptions and actual enemy levels without entering or resetting',()=>{
    const g=fixture();
    g.run('gameState.gameFlags.mineSurveyRead=true;gameState.gameFlags.storehouseNoticeRead=true;gameState.gameFlags.monasteryCourtyardCleared=true');
    for(const def of g.run('EXPLORATION_DEFINITIONS.filter(Boolean)')) {
        g.p.location=def.anchor;
        const world=JSON.stringify(g.run('gameState.world'));
        if(def.number!==5) {
            const cards=g.c.explorationSceneActions();
            assert.match(cards,/scene-entry scene-entry--object/);
            assert.match(cards,/scene-entry__main/);assert.match(cards,/<small>副本入口 · 点击查看<\/small>/);
            assert(cards.includes(`showExplorationDetail('${def.id}')`));
            assert.doesNotMatch(cards,/onclick="(?:enterExploration|restartExploration|resetExploration)/);
        }
        assert.equal(g.c.showExplorationDetail(def.id),true);
        const html=g.run('UI.lastDetail');
        assert(html.includes(def.description));assert.match(html,/副本怪物等级/);
        assert(html.includes(`enterExploration('${def.id}')" >进入副本`));
        assert(html.includes(`resetExploration('${def.id}')" disabled`));
        if(def.number===5) {assert.match(html,/普通敌人<b>Lv.8/);assert.match(html,/首领<b>Lv.12/);}
        else assert(html.includes(`首领<b>Lv.${def.level}`));
        assert.equal(g.run('gameState.activeDungeon'),undefined);assert.equal(g.p.location,def.anchor);
        assert.equal(JSON.stringify(g.run('gameState.world')),world);
    }
});

test('academy has one physical entrance card and opens the shared detail page',()=>{
    const g=fixture();g.p.location='mysterious_stone_gate';
    g.browserUpdateScene();
    const scene=g.c.document.getElementById('scene-items-list').innerHTML;
    assert.equal([...scene.matchAll(/onclick="showGroundItemInfo\('academy_stone_gate'\)"/g)].length,1);
    assert.doesNotMatch(scene,/showExplorationDetail\('academy_ruins'\)/);
    g.c.showGroundItemInfo('academy_stone_gate');
    assert(g.run('UI.lastDetail').includes(g.c.explorationDef('academy_ruins').description));
    assert.match(g.run('UI.lastDetail'),/进入副本/);assert.match(g.run('UI.lastDetail'),/重置副本/);
    assert.equal(g.run('gameState.activeDungeon'),undefined);
});

test('open dungeon details still refuse entry and resets during combat or at the wrong entrance',()=>{
    const g=fixture();
    for(const [id,anchor] of [['sealed_mine_gallery','mine_exit_4'],['smuggler_storehouse','slum_east_1'],['monastery_vault','abandoned_monastery']]) {
        g.p.location=anchor;g.c.showExplorationDetail(id);
        assert(g.run('UI.lastDetail').includes(`enterExploration('${id}')" >进入副本`));
    }
    g.p.location='mine_deep';assert.equal(g.c.enterExploration('monastery_vault'),false);
    g.run('battleState.inBattle=true');g.p.location='abandoned_monastery';
    assert.equal(g.c.enterExploration('monastery_vault'),false);g.run('battleState.inBattle=false');
    g.p.location='forest_start';g.c.enterExploration('forest_supply_camp');
    const instance=g.run('gameState.activeDungeon.instanceId');
    assert.equal(g.c.resetExploration('forest_supply_camp'),false); // inside the dungeon
    g.c.leaveExploration();g.run('battleState.inBattle=true');
    assert.equal(g.c.resetExploration('forest_supply_camp'),false);
    assert.equal(g.c.showExplorationDetail('forest_supply_camp'),false);
    g.run('battleState.inBattle=false');g.p.location='training_ground';
    g.c.showExplorationDetail('knight_trial');assert.match(g.run('UI.lastDetail'),/正在探索「林间补给营」/);
    assert.equal(g.c.enterExploration('knight_trial'),false);
    assert.equal(g.c.resetExploration('forest_supply_camp'),false);
    assert.equal(g.c.resetExploration('knight_trial'),false);
    assert.equal(g.run('gameState.activeDungeon.instanceId'),instance);
});

test('reset works before completion, cancellation preserves progress, and reset removes only ground loot',()=>{
    const g=fixture();g.c.checkHostileNPCs=()=>{};g.p.location='forest_start';g.c.enterExploration('forest_supply_camp');
    const old=g.run('gameState.activeDungeon'),room=g.run(`gameState.world['${old.roomIds[1]}']`);
    g.c.spawnExplorationDrop(room,'book_heavy_cut');
    g.c.spawnExplorationDrop(room,'training_book_good');
    const [picked,unpicked]=room.items;g.p.location=old.roomIds[1];g.c.pickupItem(picked);
    g.run(`gameState.backgroundBattles['${old.roomIds[2]}']={status:'allies_defeat',enemies:[]}`);
    g.p.location=old.entryRoomId;
    g.c.leaveExploration();const world=JSON.stringify(g.run('gameState.world'));
    g.c.confirm=()=>false;
    assert.equal(g.c.resetExploration(old.id),false);assert.equal(g.run('gameState.activeDungeon.instanceId'),old.instanceId);
    assert.equal(JSON.stringify(g.run('gameState.world')),world);
    g.c.confirm=()=>true;
    assert.equal(g.c.resetExploration(old.id),true);assert.equal(g.p.location,'forest_start');
    assert.equal(g.run('gameState.activeDungeon'),undefined);assert.equal(g.c.bookCount('book_heavy_cut'),1);
    assert.equal(g.c.getItemInfoById(unpicked),null);
    assert.equal(g.run('Object.keys(gameState.backgroundBattles).length'),0);
    assert(old.roomIds.every(id=>!g.run('gameState.world')[id]));
    assert.equal(g.run('explorationProgress().firstClears.forest_supply_camp'),undefined);
    assert.equal(g.c.enterExploration(old.id),true);
    assert.notEqual(g.run('gameState.activeDungeon.instanceId'),old.instanceId);
    assert.equal(g.c.bookCount('book_heavy_cut'),1);
});

test('all six random dungeon maps obey physical compass directions, room quotas and the simplified content',()=>{
    const g=fixture();
    const opposite={north:'south',east:'west',south:'north',west:'east'};
    for(const def of g.run('EXPLORATION_DEFINITIONS.filter(Boolean)')) {
        const layouts=new Set();
        for(let seed=0;seed<35;seed++) {
            g.run(seed<3 ? `Math.random=()=>${[0,.5,.999999][seed]}` : `var dungeonTestSeed=${seed};Math.random=()=>{dungeonTestSeed=(Math.imul(dungeonTestSeed,1664525)+1013904223)>>>0;return dungeonTestSeed/4294967296}`);
            const d=g.c.generateDungeon(def.id),world=g.run('gameState.world'),seen=new Set(),queue=[d.entryRoomId];
            const coordinates=new Map([[d.entryRoomId,{x:0,y:0}]]),occupied=new Map(),steps={north:[0,-1],east:[1,0],south:[0,1],west:[-1,0]};
            while(queue.length) {
                const id=queue.shift();if(seen.has(id))continue;seen.add(id);
                const p=coordinates.get(id),key=`${p.x},${p.y}`;
                assert(!occupied.has(key),`${def.id}: different rooms occupy ${key}`);occupied.set(key,id);
                assert.equal(world[id].dungeonPosition.x,p.x);assert.equal(world[id].dungeonPosition.y,p.y);
                for(const [dir,to]of Object.entries(world[id].exits)) {
                    assert(d.roomIds.includes(to),`${def.id}: foreign exit`);
                    assert.equal(world[to].exits[opposite[dir]],id);
                    const next={x:p.x+steps[dir][0],y:p.y+steps[dir][1]},known=coordinates.get(to);
                    if(known)assert.deepEqual(known,next);else coordinates.set(to,next);
                    queue.push(to);
                }
            }
            assert.equal(seen.size,d.roomIds.length,def.id);
            assert(d.roomIds.some(id=>Object.keys(world[id].exits).length>=3),def.id);
            assert(d.roomIds.every(id=>Object.keys(world[id].exits).length<=4));
            assert.equal(world[d.entryRoomId].npcs.length,0);
            assert.equal(g.c.getDungeonDistance(world,d.entryRoomId,d.bossRoomId),d.bossDistance);
            assert(d.bossDistance>=10 && d.bossDistance<=12);
            assert(d.normalRoomCount>=10 && d.normalRoomCount<=15);
            assert.equal(d.roomIds.length,d.normalRoomCount+2);
            assert.equal(d.roomIds.filter(id=>world[id].dungeonRoomType==='initial').length,1);
            assert.equal(d.roomIds.filter(id=>world[id].dungeonRoomType==='boss').length,1);
            assert.equal(d.roomIds.filter(id=>world[id].dungeonRoomType==='normal').length,d.normalRoomCount);
            assert.equal(new Set(d.roomIds.map(id=>world[id].name)).size,3);
            const ordinary=d.roomIds.filter(id=>world[id].dungeonRoomType==='normal');
            assert.equal(new Set(ordinary.map(id=>world[id].desc)).size,1);
            const expectedEnemy=def.number===5?'female_mage':`expedition_${def.number}_enemy`;
            const expectedBoss=def.number===5?'mad_female_mage':`expedition_${def.number}_boss`;
            assert.deepEqual([...world[d.bossRoomId].npcs],[expectedBoss]);
            for(const id of d.roomIds) {
                assert(world[id].desc.length>25);
                for(const npcId of world[id].npcs) {
                    assert.equal(npcId,id===d.bossRoomId?expectedBoss:expectedEnemy);
                    const npc=g.run('CHARACTER_TEMPLATES')[npcId];assert.equal(npc.gender,'female');assert(npc.age>=18);
                }
            }
            layouts.add(JSON.stringify(d.roomIds.map(id=>world[id].exits)));
        }
        assert(layouts.size>10,def.id);
    }
});

test('each expedition woman has a distinct complete limb table with fixed pairs and compatible doll parts',()=>{
    const g=fixture(),npcs=g.run('Object.values(CHARACTER_TEMPLATES).filter(npc=>npc.expeditionAnatomy)');
    assert.equal(npcs.length,12);
    const allIds=new Set();
    for(const npc of npcs) {
        assert.equal(npc.gender,'female');assert(npc.age>=18);assert(npc.desc.includes('成年'));assert(npc.desc.length>35);
        assert.equal(npc.limbTemplates.length,7);
        const corpse=g.c.generateExpeditionCorpse(npc.id);
        assert.equal(corpse.limbTemplates.reduce((n,l)=>n+l.count,0),12);
        for(const part of corpse.limbTemplates) {
            if(!npc.bodySourceId)assert(!allIds.has(part.id));allIds.add(part.id);
            const base=g.c.getItemInfoById(part.id),limbs=corpse.generatedLimbs[part.id];
            assert(base.desc.includes(npc.name));assert(base.desc.length>25);
            assert.equal(limbs.length,part.count);
            assert(limbs[0].score>=0 && limbs[0].score<=100);
            assert.equal(limbs[0].rarity,g.c.scoreToQuality(limbs[0].score));
            assert.equal(g.c.inferMagicDollLimbPart(limbs[0]),base.limbPart);
            if(part.count===2) {assert.deepEqual(limbs[0],limbs[1]);assert.notEqual(limbs[0],limbs[1]);}
            const made=g.c._makeLimbItem(corpse,part.id,0);made.score=-1;
            assert.notEqual(corpse.generatedLimbs[part.id][0].score,-1);
        }
    }
    assert.equal(allIds.size,77);
});

test('actual expedition deaths produce one complete corpse each; training opponents retain nonlethal rules',()=>{
    const g=fixture();
    for(const npc of g.run('Object.values(CHARACTER_TEMPLATES).filter(npc=>npc.expeditionAnatomy)')) {
        g.run('battleState.inBattle=false;gameState.world.mine_deep.items=[]');g.p.location='mine_deep';g.battle([npc.id]);
        const enemy=g.run('battleState.enemies[0]');g.c._applyDamageToUnit(enemy,99999,false,null,'mine_deep');
        g.c._applyDamageToUnit(enemy,99999,false,null,'mine_deep');
        const ids=g.run('gameState.world.mine_deep.items.filter(id=>id.startsWith("corpse_"))');
        assert.equal(ids.length,npc.training?0:1,npc.id);
        if(!npc.training) {
            const corpse=g.c.getItemInfoById(ids[0]);assert.equal(corpse.sourceNpcId,npc.id);
            assert.equal(corpse.dismemberable,true);assert.equal(corpse.limbTemplates.length,7);
        }
    }
});

test('random map and generated corpse limbs survive dismembering, pickup and repeated save/load',async()=>{
    const g=fixture();g.c.checkHostileNPCs=()=>{};g.p.location='forest_start';g.c.enterExploration('forest_supply_camp');
    const d=g.run('gameState.activeDungeon');g.p.location=d.roomIds[1];g.battle(['expedition_2_enemy']);
    g.c._applyDamageToUnit(g.run('battleState.enemies[0]'),99999,false,null,g.p.location);g.c._afterSkillResolution();
    const id=g.run('gameState.world[gameState.player.location].items.find(id=>id.startsWith("corpse_"))');
    const corpse=g.c.getItemInfoById(id),limbs=JSON.stringify(corpse.generatedLimbs);
    const map=JSON.stringify(d.roomIds.map(id=>g.run('gameState.world')[id]));
    await g.c.saveGame();assert.equal(await g.c.loadGame(),true);
    assert.equal(JSON.stringify(g.c.getItemInfoById(id).generatedLimbs),limbs);
    assert.equal(JSON.stringify(d.roomIds.map(id=>g.run('gameState.world')[id])),map);
    g.c.dismemberItem(id);
    g.c.document.getElementById('limb_check_0').checked=true;
    g.c.confirmDismember(corpse.name,g.c.getItemInfoById(id).limbTemplates);
    for(let i=0;g.timers.size && i<20;i++) {
        const [timerId,timer]=g.timers.entries().next().value;g.timers.delete(timerId);timer.fn();
    }
    const headId=g.run('gameState.world[gameState.player.location].items.find(id=>id.startsWith("expedition_2_enemy_head_"))');
    assert(headId);g.c.pickupItem(headId);
    const head=JSON.stringify(g.p.inventory.find(i=>i.id===headId));
    await g.c.saveGame();assert.equal(await g.c.loadGame(),true);
    assert.equal(JSON.stringify(g.p.inventory.find(i=>i.id===headId)),head);
    assert(g.c.getItemInfoById(id).dismemberedLimbs.includes('expedition_2_enemy_head'));
});

test('legacy dungeon content repairs invalid routes without resetting resources or combat progress',async()=>{
    const g=fixture();g.c.checkHostileNPCs=()=>{};g.p.location='forest_start';g.c.enterExploration('forest_supply_camp');
    const d=g.run('gameState.activeDungeon');
    g.run('delete gameState.activeDungeon.layoutVersion;delete gameState.activeDungeon.sceneryVersion');
    for(let index=0;index<d.roomIds.length;index++) {
        const room=g.run('gameState.world')[d.roomIds[index]];
        delete room.dungeonPosition;
        room.exits={...(index?{west:d.roomIds[index-1]}:{}),...(index<d.roomIds.length-1?{east:d.roomIds[index+1]}:{})};
    }
    const routes=JSON.stringify(d.roomIds.map(id=>g.run('gameState.world')[id].exits));
    const oldCorpse={id:'corpse_expedition_2_enemy_legacy',name:'补给护卫的尸体',type:'misc',loot:['bread']};
    g.p.inventory.push(oldCorpse);
    g.p.location=d.roomIds[1];g.battle(['expedition_2_enemy']);g.run('battleState.enemies[0].name="补给护卫";battleState.enemies[0].currentHp=8;battleState.attackUsed=true');
    const sp=g.p.sp;await g.c.saveGame();assert.equal(await g.c.loadGame(),true);
    assert.notEqual(JSON.stringify(d.roomIds.map(id=>g.run('gameState.world')[id].exits)),routes);
    assert.equal(g.c.validateDungeonGrid(g.run('gameState.activeDungeon')),true);
    const repairedRoutes=JSON.stringify(d.roomIds.map(id=>g.run('gameState.world')[id].exits));
    assert.equal(g.run('battleState.enemies[0].currentHp'),8);assert.equal(g.run('battleState.attackUsed'),true);assert.equal(g.p.sp,sp);
    assert.equal(g.run('battleState.enemies[0].name'),'林营女护卫');
    const upgraded=g.p.inventory.find(i=>i.id===oldCorpse.id);assert.equal(upgraded.limbTemplates.length,7);assert.equal(upgraded.loot[0],'bread');
    const limbs=JSON.stringify(upgraded.generatedLimbs);
    await g.c.saveGame();assert.equal(await g.c.loadGame(),true);
    assert.equal(JSON.stringify(g.p.inventory.find(i=>i.id===oldCorpse.id).generatedLimbs),limbs);
    assert.equal(JSON.stringify(d.roomIds.map(id=>g.run('gameState.world')[id].exits)),repairedRoutes);
});

test('room grid validation rejects overlapping rooms and geometrically false reciprocal exits',()=>{
    const g=fixture(),d=g.c.generateDungeon('sealed_mine_gallery'),world=g.run('gameState.world');
    assert.equal(g.c.validateDungeonGrid(d),true);
    const a=d.roomIds[0],b=d.roomIds[1],position={...world[b].dungeonPosition};
    world[b].dungeonPosition={...world[a].dungeonPosition};
    assert.equal(g.c.validateDungeonGrid(d),false);
    world[b].dungeonPosition=position;
    const [dir,to]=Object.entries(world[a].exits)[0];
    const reverse={north:'south',east:'west',south:'north',west:'east'},wrong={north:'east',east:'south',south:'west',west:'north'}[dir];
    delete world[a].exits[dir];delete world[to].exits[reverse[dir]];
    world[a].exits[wrong]=to;world[to].exits[reverse[wrong]]=a;
    // 两端互逆仍然成立，但方位与平面位置不符，必须拒绝。
    assert.equal(g.c.validateDungeonGrid(d),false);
    assert.equal(g.c.repairDungeonGrid(d),true);
    assert.equal(g.c.validateDungeonGrid(d),true);
});

test('old short dungeons gain rooms and correct directions without respawning enemies or losing loot',async()=>{
    for(const completed of [false,true]) {
        const g=fixture(),prefix='explore_sealed_mine_gallery_',ids=[prefix+'0',prefix+'1',prefix+'2',prefix+'3',prefix+'boss'];
        g.c.legacyRoomIds=ids;
        g.run(`gameState.activeDungeon={id:'sealed_mine_gallery',name:'封存支矿道',instanceId:'legacy-instance',entranceRoom:'mine_exit_4',entryRoomId:legacyRoomIds[0],bossRoomId:legacyRoomIds[4],roomIds:[...legacyRoomIds],completed:${completed}};
            legacyRoomIds.forEach((id,i)=>{gameState.world[id]={name:'旧矿道',desc:'旧描述',items:[],npcs:[],generatedDungeon:true,dungeonId:'sealed_mine_gallery',exits:{...(i?{west:legacyRoomIds[i-1]}:{}),...(i<4?{east:legacyRoomIds[i+1]}:{})}}});
            gameState.gameFlags.mineSurveyRead=true;`);
        g.p.location=ids[1];g.c.spawnExplorationDrop(g.run('gameState.world')[ids[1]],'book_quick_stab');
        const loot=g.run('gameState.world')[ids[1]].items[0];
        if(!completed) {
            g.battle(['expedition_1_enemy']);
            g.run(`battleState.enemies[0].npcId='expedition_1_support';battleState.enemies[0].name='矿道女投石手';battleState.enemies[0].currentHp=7;battleState.attackUsed=true;gameState.world[legacyRoomIds[1]].npcs=['expedition_1_support']`);
        }
        const hp=g.p.hp,sp=g.p.sp;await g.c.saveGame();assert.equal(await g.c.loadGame(),true);
        const repaired=g.run('gameState.activeDungeon');
        assert.equal(repaired.instanceId,'legacy-instance');assert.equal(repaired.completed,completed);
        assert.equal(repaired.roomIds.length,12);assert.equal(repaired.normalRoomCount,10);
        assert.equal(g.c.validateDungeonGrid(repaired),true);assert.equal(g.p.location,ids[1]);
        assert.equal(g.p.hp,hp);assert.equal(g.p.sp,sp);
        assert(g.run('gameState.world')[ids[1]].items.includes(loot));assert(g.c.getItemInfoById(loot));
        assert.equal(g.run('gameState.world')[ids[2]].npcs.length,0); // 不复活已清空的房间
        const added=[...repaired.roomIds].filter(id=>!ids.includes(id));
        assert(added.every(id=>g.run('gameState.world')[id].npcs.length===0));
        if(!completed) {
            assert.equal(g.run('battleState.enemies[0].npcId'),'expedition_1_enemy');
            assert.equal(g.run('battleState.enemies[0].currentHp'),7);assert.equal(g.run('battleState.attackUsed'),true);
            assert.equal(g.run('gameState.world')[ids[1]].npcs[0],'expedition_1_enemy');
        }
        const positions=JSON.stringify(repaired.roomIds.map(id=>g.run('gameState.world')[id].dungeonPosition));
        await g.c.saveGame();assert.equal(await g.c.loadGame(),true);
        assert.equal(JSON.stringify(repaired.roomIds.map(id=>g.run('gameState.world')[id].dungeonPosition)),positions);
    }
});

test('every dungeon limb uses different prose for all six qualities without a quality suffix',()=>{
    const g=fixture(),scores=[20,50,75,90,97,100];
    for(const def of g.run('EXPLORATION_DEFINITIONS.filter(Boolean)')) {
        const ids=def.number===5?['female_mage']:[`expedition_${def.number}_enemy`,`expedition_${def.number}_boss`];
        for(const npcId of ids)for(const part of ['head','torso','leg','arm','hand','foot','breast']) {
            const descriptions=scores.map(score=>g.c.buildExpeditionLimb(npcId,part,score,'37码','B罩杯').desc);
            assert.equal(new Set(descriptions).size,6,`${npcId}:${part}`);
            for(const desc of descriptions) {
                assert.doesNotMatch(desc,/保存状况|保存品质|品质[：:]/);
                assert.doesNotMatch(desc,/普通|优良|稀有|史诗|珍品|神品/);
                assert(desc.length>35);
            }
        }
        if(def.number!==5)assert.equal(g.run('CHARACTER_TEMPLATES')[`expedition_${def.number}_support`],undefined);
    }
    const mage=g.c.buildFemaleMageLimb('hand',90,'37码','B罩杯');
    assert.equal(mage.desc,g.c.buildExpeditionLimb('female_mage','hand',90,'37码','B罩杯').desc);
});

test('legacy limb descriptions and retired support corpses migrate without rerolling quality or sizes',async()=>{
    const g=fixture();
    const legacy=g.c.generateExpeditionCorpse('expedition_2_enemy');
    legacy.id='corpse_expedition_2_support_legacy';legacy.sourceNpcId='expedition_2_support';
    legacy.name='林营女救护者的尸体';
    for(const parts of Object.values(legacy.generatedLimbs))for(const item of parts) {
        item.id=item.id.replace('expedition_2_enemy','expedition_2_support');
        item.sourceNpcId='expedition_2_support';item.name=item.name.replace('林营女护卫','林营女救护者');
        item.desc='旧部位描述。 保存状况：优良。';delete item.qualityDescriptionVersion;
    }
    const loose=g.c.buildExpeditionLimb('expedition_4_enemy','foot',97,'39码','C罩杯');
    loose.id='expedition_4_support_foot_dropped_123';loose.sourceNpcId='expedition_4_support';
    loose.name='暗仓女号令者的脚（39码）';loose.desc='旧部位描述。 保存状况：珍品。';delete loose.qualityDescriptionVersion;
    const outer={id:'expedition_6_outer_guard_arm_legacy',name:'外庭女守卫的手臂',sourceNpcId:'expedition_6_outer_guard',type:'limb',limbPart:'arm',score:90,rarity:'epic',desc:'旧部位描述。 保存状况：史诗。'};
    g.p.inventory.push(legacy,loose,outer);
    const original=Object.values(legacy.generatedLimbs).flat().map(i=>[i.score,i.rarity,i.footSize,i.cup]);
    await g.c.saveGame();assert.equal(await g.c.loadGame(),true);
    const repaired=g.p.inventory.find(i=>i.id===legacy.id),foot=g.p.inventory.find(i=>i.id===loose.id);
    assert.equal(repaired.sourceNpcId,'expedition_2_enemy');assert.equal(repaired.name,'林营女护卫的尸体');
    assert.deepEqual(Object.values(repaired.generatedLimbs).flat().map(i=>[i.score,i.rarity,i.footSize,i.cup]),original);
    assert(Object.values(repaired.generatedLimbs).flat().every(i=>!i.desc.includes('保存状况') && i.sourceNpcId==='expedition_2_enemy'));
    assert.equal(foot.score,97);assert.equal(foot.rarity,'legendary');assert.equal(foot.footSize,'39码');
    assert.equal(foot.name,'暗仓女看守的脚');assert.match(foot.desc,/39码/);assert.doesNotMatch(foot.desc,/保存状况/);
    const outerLimb=g.p.inventory.find(i=>i.id===outer.id);
    assert.equal(outerLimb.sourceNpcId,'expedition_6_enemy');assert.equal(outerLimb.score,90);
    assert.doesNotMatch(outerLimb.desc,/保存状况/);
    const items=JSON.stringify(g.p.inventory.slice(-3));
    await g.c.saveGame();assert.equal(await g.c.loadGame(),true);
    assert.equal(JSON.stringify(g.p.inventory.slice(-3)),items);
});

test('dungeon exits exist only at the entrance and after killing the boss in its room',async()=>{
    for(const defNumber of [1,2,3,4,5,6]) {
        const g=fixture();g.c.checkHostileNPCs=()=>{};
        const def=g.run(`EXPLORATION_DEFINITIONS[${defNumber}]`);g.p.location=def.anchor;g.c.enterExploration(def.id);
        const d=g.run('gameState.activeDungeon');
        assert.match(g.c.explorationSceneActions(),/leaveExploration/);
        for(const id of d.roomIds.filter(id=>id!==d.entryRoomId)) {
            g.p.location=id;
            assert.doesNotMatch(g.c.explorationSceneActions(),/leaveExploration/);
            assert.equal(g.c.leaveExploration(),false);assert.equal(g.p.location,id);
        }
        g.p.location=d.bossRoomId;
        const bossId=defNumber===5?'mad_female_mage':`expedition_${defNumber}_boss`;
        g.battle([bossId]);
        assert.equal(g.c.leaveExploration(),false);
        g.c._applyDamageToUnit(g.run('battleState.enemies[0]'),999999,false,null,d.bossRoomId);
        g.c._afterSkillResolution();
        assert.equal(g.run('battleState.inBattle'),false);
        if(defNumber!==5)assert.notEqual(d.completed,true); // 岔路仍有小怪也可从已击败首领的房间离开
        assert.match(g.c.explorationSceneActions(),/leaveExploration/);
        await g.c.saveGame();assert.equal(await g.c.loadGame(),true);
        assert.match(g.c.explorationSceneActions(),/leaveExploration/);
        const ordinary=d.roomIds[1];g.p.location=ordinary;
        assert.doesNotMatch(g.c.explorationSceneActions(),/leaveExploration/);
        assert.equal(g.c.leaveExploration(),false);
        g.p.location=d.bossRoomId;assert.equal(g.c.leaveExploration(),true);assert.equal(g.p.location,def.anchor);
        assert.equal(g.c.enterExploration(def.id),defNumber!==5);
        if(defNumber!==5)assert.equal(g.p.location,d.bossRoomId);
    }
});

test('map movement after closing an inventory panel is immediate and leaves no delayed move after teleporting',()=>{
    const g=fixture();g.c.checkHostileNPCs=()=>{};
    const d=g.c.generateDungeon('sealed_mine_gallery'),world=g.run('gameState.world');
    d.roomIds.forEach(id=>world[id].npcs=[]);g.p.location=d.entryRoomId;
    const dir=Object.keys(world[g.p.location].exits)[0],target=world[g.p.location].exits[dir];
    g.run("currentPanel='inventory'");g.c.moveByButton(dir);
    assert.equal(g.p.location,target);assert.equal(g.timers.size,0);
    g.c.relocateTo(d.entryRoomId);assert.equal(g.p.location,d.entryRoomId);
    for(const timer of g.timers.values())timer.fn();
    assert.equal(g.p.location,d.entryRoomId);
});

test('old minimap click handlers cannot move from another room or a replaced world',()=>{
    const g=fixture();g.c.checkHostileNPCs=()=>{};
    const d=g.c.generateDungeon('sealed_mine_gallery'),world=g.run('gameState.world');
    d.roomIds.forEach(id=>world[id].npcs=[]);g.p.location=d.entryRoomId;
    g.browserUpdateMinimap();
    const dir=Object.keys(world[g.p.location].exits)[0],target=world[g.p.location].exits[dir];
    const cell=g.c.document.getElementById('map-'+dir),oldHandler=cell._clickHandler;
    oldHandler();assert.equal(g.p.location,target);
    assert.equal(oldHandler(),false);assert.equal(g.p.location,target);
    g.p.location=d.entryRoomId;g.run('gameState.world=JSON.parse(JSON.stringify(gameState.world))');
    assert.equal(oldHandler(),false);assert.equal(g.p.location,d.entryRoomId);
    g.browserUpdateMinimap();cell._clickHandler();assert.equal(g.p.location,target);
});

test('limb names omit measurements while introductions and separate attributes retain them',()=>{
    const g=fixture();
    for(const npcId of g.run('Object.keys(EXPEDITION_LIMB_PROSE)')) {
        const foot=g.c.buildExpeditionLimb(npcId,'foot',75,'38码','C罩杯');
        const breast=g.c.buildExpeditionLimb(npcId,'breast',75,'38码','C罩杯');
        for(const item of [foot,breast]) {
            assert.doesNotMatch(item.name,/码|罩杯|[（()）]/);
            assert.equal(item.score,75);assert.equal(item.rarity,'rare');
        }
        assert.match(foot.desc,/38码/);assert.equal(foot.footSize,'38码');
        assert.match(breast.desc,/C罩杯/);assert.equal(breast.cup,'C罩杯');
        const corpse=g.c.generateExpeditionCorpse(npcId);
        assert(corpse.limbTemplates.every(part=>!/[（()）]|码|罩杯/.test(part.name)));
    }
    const generic=g.c.buildGenericFemaleLimb('foot',50,'38码','C罩杯','女农奴');
    assert.equal(generic.name,'女农奴的脚');assert.equal(generic.footSize,'38码');assert.match(generic.desc,/38码/);
});

test('equal-quality limbs with different measurements stay separate in inventory and ground pickup',()=>{
    const g=fixture(),a=g.c.buildExpeditionLimb('expedition_1_enemy','foot',75,'38码','C罩杯');
    const b=g.c.buildExpeditionLimb('expedition_1_enemy','foot',75,'39码','C罩杯');
    const c=g.c.buildExpeditionLimb('expedition_1_enemy','breast',75,'38码','C罩杯');
    const d=g.c.buildExpeditionLimb('expedition_1_enemy','breast',75,'38码','D罩杯');
    assert.equal(a.name,b.name);assert.equal(c.name,d.name);
    assert.notEqual(g.c.getItemStackKey(a),g.c.getItemStackKey(b));
    assert.notEqual(g.c.getItemStackKey(c),g.c.getItemStackKey(d));
    const groups=g.c.groupInventoryEntries([a,{...a},b,c,d]);
    assert.deepEqual([...groups].map(group=>group.count),[2,1,1,1]);
    g.p.inventory.push(a,b,c,d);
    g.c.examineItemFromPanel(b.id,encodeURIComponent(g.c.getInventoryEntryStackKey(b)));
    assert.match(g.run('UI.lastDetail'),/39码/);assert.doesNotMatch(g.run('UI.lastDetail'),/38码/);
    const names=[...g.c.renderInventoryEntries([a,b,c,d]).matchAll(/<span class="inventory-entry__name">([\s\S]*?)<\/span>/g)].map(match=>match[1].replace(/<[^>]*>/g,''));
    assert.equal(names.length,4);assert(names.every(name=>!/码|罩杯|[（()）]/.test(name)));
    g.c.groundFootA={...a,id:'test_foot_a'};g.c.groundFootB={...b,id:'test_foot_b'};
    g.run("ITEM_TEMPLATES.test_foot_a=groundFootA;ITEM_TEMPLATES.test_foot_b=groundFootB;gameState.world.mine_deep.items=['test_foot_a','test_foot_b'];gameState.player.inventory=[]");
    g.c.pickupAllSameItems('test_foot_a');
    assert.equal(g.p.inventory.length,1);assert.equal(g.p.inventory[0].footSize,'38码');
    assert.equal(g.run('gameState.world.mine_deep.items[0]'),'test_foot_b');
});

test('old names and corpse menus migrate measurements into introductions without rerolling them',async()=>{
    const g=fixture();
    const foot={id:'expedition_4_enemy_foot_legacy',name:'暗仓女看守的脚（38码）',type:'limb',score:90,rarity:'epic',desc:'旧介绍'};
    const breast={id:'expedition_2_enemy_breast_legacy',name:'林营女护卫的乳房(C罩杯)',type:'limb',score:75,rarity:'rare',desc:'旧介绍'};
    const generic={id:'female_serf_foot_legacy',name:'女农奴的脚（39码）',type:'limb',score:50,rarity:'good',desc:'原来的介绍。'};
    const corpse={id:'corpse_female_serf_legacy',name:'女农奴的尸体',type:'limb',limbTemplates:[{id:'foot',name:'脚（39码）',count:2}],generatedLimbs:{foot:[{...generic},{...generic}]}};
    g.p.inventory.push(foot,breast,corpse);
    await g.c.saveGame();assert.equal(await g.c.loadGame(),true);
    const f=g.p.inventory.find(item=>item.id===foot.id),b=g.p.inventory.find(item=>item.id===breast.id),old=g.p.inventory.find(item=>item.id===corpse.id);
    assert.equal(f.name,'暗仓女看守的脚');assert.equal(f.footSize,'38码');assert.match(f.desc,/38码/);assert.equal(f.score,90);
    assert.equal(b.name,'林营女护卫的乳房');assert.equal(b.cup,'C罩杯');assert.match(b.desc,/C罩杯/);assert.equal(b.score,75);
    assert.equal(old.limbTemplates[0].name,'脚');assert(old.generatedLimbs.foot.every(item=>item.footSize==='39码' && item.name==='女农奴的脚' && item.desc.includes('原来的介绍。')));
    const saved=JSON.stringify(g.p.inventory);
    await g.c.saveGame();assert.equal(await g.c.loadGame(),true);assert.equal(JSON.stringify(g.p.inventory),saved);
});

test('dungeon limb prose distinguishes occupations and grades rather than substituting character names',()=>{
    const g=fixture(),owners=g.run('Object.keys(EXPEDITION_LIMB_PROSE)');
    assert.equal(owners.length,11);
    for(const part of ['head','torso','arm','hand','leg','foot','breast']) {
        for(const rarity of ['normal','good','rare','epic','legendary','mythic']) {
            const descriptions=owners.map(id=>g.c.expeditionLimbDescription(id,part,rarity));
            assert.equal(new Set(descriptions).size,owners.length,`${part}:${rarity}`);
            assert(descriptions.every(text=>text.length>=35 && !/依稀记录着|保存状况|属于.*的.*。/.test(text)));
        }
    }
});

test('room 24 ladder is picked up, saved, and used from inventory in room 23',async()=>{
    const g=fixture();g.p.location='tunnel_4_north';
    assert.equal(g.c.isItemUnpickable('removed_ladder'),false);
    assert.equal(g.c.isItemUnpickable('ladder'),true);
    assert.equal(g.c.isItemUnpickable('ladder_3'),true);
    g.c.showGroundItemInfo('removed_ladder');
    assert.match(g.run('UI.lastDetail'),/pickupItem\('removed_ladder'\)/);
    assert.doesNotMatch(g.run('UI.lastDetail'),/useRemovedLadder/);
    g.c.pickupItem('removed_ladder');
    assert.equal(g.run('gameState.world.tunnel_4_north.items.includes("removed_ladder")'),false);
    assert.equal(g.p.inventory.filter(i=>i.id==='removed_ladder').length,1);
    await g.c.saveGame();assert.equal(await g.c.loadGame(),true);
    g.p.location='tunnel_exit_4';g.c.examineItemFromPanel('removed_ladder');
    const action=g.run('UI.lastDetail').match(/onclick="(useRemovedLadder\('[^']+'\))"/)[1];
    g.messages.length=0;assert.equal(g.run(action),true);
    assert.equal(g.p.location,'mine_exit_4');assertTravelCaption(g);
    assert.equal(g.p.inventory.filter(i=>i.id==='removed_ladder').length,1);
});

test('ladder supports bulk pickup and dropped ladder survives save/load and inventory reuse',async()=>{
    for(const pickup of ['pickupAllItems()',"pickupAllSameItems('removed_ladder')"]) {
        const g=fixture();g.p.location='tunnel_4_north';g.run(pickup);
        assert.equal(g.p.inventory.filter(i=>i.id==='removed_ladder').length,1);
        assert.equal(g.run('gameState.world.tunnel_4_north.items.includes("removed_ladder")'),false);
        g.c.dropItemFromInventory('removed_ladder');
        const dropped=g.run('gameState.world.tunnel_4_north.items.find(id=>id.startsWith("removed_ladder_dropped_"))');
        assert(dropped);assert.equal(g.c.isItemUnpickable(dropped),false);
        await g.c.saveGame();assert.equal(await g.c.loadGame(),true);
        g.c.pickupItem(dropped);g.p.location='tunnel_exit_4';
        g.c.examineItemFromPanel(dropped);
        assert(g.run('UI.lastDetail').includes(`useRemovedLadder('${dropped}')`));
        assert.equal(g.c.useRemovedLadder(dropped),true);assert.equal(g.p.location,'mine_exit_4');
        assert(g.p.inventory.some(i=>i.id===dropped));
    }
});

test('ladder requires inventory ownership, valid location and no combat',()=>{
    const g=fixture();g.p.location='tunnel_exit_4';
    assert.equal(g.c.useRemovedLadder(),false);assert.equal(g.p.location,'tunnel_exit_4');
    g.p.location='tunnel_4_north';g.c.pickupItem('removed_ladder');
    assert.equal(g.c.useRemovedLadder('removed_ladder'),false);assert.equal(g.p.location,'tunnel_4_north');
    g.p.location='tunnel_exit_4';g.run('battleState.inBattle=true');
    assert.equal(g.c.useRemovedLadder('removed_ladder'),false);assert.equal(g.p.location,'tunnel_exit_4');
    g.run('battleState.inBattle=false');g.c.dropItemFromInventory('removed_ladder');
    assert.equal(g.c.useRemovedLadder('removed_ladder'),false);assert.equal(g.p.location,'tunnel_exit_4');
    const dropped=g.run('gameState.world.tunnel_exit_4.items.find(id=>id.startsWith("removed_ladder_dropped_"))');
    g.c.pickupItem(dropped);
    assert.equal(g.c.useRemovedLadder('removed_ladder'),false);
    assert.equal(g.c.useRemovedLadder('stone'),false);
    assert.equal(g.p.location,'tunnel_exit_4');
    assert.equal(g.messages.some(m=>m.includes('class="travel-text"')),false);
    assert.equal(g.timers.size,0);
});

test('combat skill buttons contain only names while skill details and usability rules remain',()=>{
    const g=fixture();g.learn('quick_stab');g.battle();
    g.run("gameState.player.equipment.weapon=createItemFromTemplate('fruit_knife')");
    const labels=html=>[...html.matchAll(/<button class="skill-button"[^>]*>([\s\S]*?)<\/button>/g)].map(m=>m[1]);
    assert.deepEqual(labels(g.c.renderSkillButtons()),['仇恨','迅刺']);
    const sp=g.p.sp;assert.equal(g.c.useSkill('quick_stab'),true);assert(g.p.sp<sp);
    assert.match(g.c.renderSkillButtons(),/useSkill\('quick_stab'\)" disabled/);
    g.c._cleanupBattleState();g.c.showSkillDetail('quick_stab');
    assert(g.run('UI.lastDetail').includes(g.c.skillEffectText('quick_stab')));
    g.run('playerSkillFailure=undefined;gameState.player.sp=0');
    assert.deepEqual(labels(g.c.renderSkillButtons()),['仇恨','迅刺']);
    assert.match(g.c.renderSkillButtons(),/useSkill\('quick_stab'\)" disabled/);
});
