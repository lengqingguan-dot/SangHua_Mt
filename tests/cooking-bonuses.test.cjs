// Run: node --test tests/cooking-bonuses.test.cjs
// Real game functions; only browser UI, file pickers and timers are replaced.
const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');

const root = path.resolve(__dirname, '..');
const plain = value => JSON.parse(JSON.stringify(value));
const zeroBonuses = { maxHp: 0, atk: 0, def: 0, agi: 0 };

function createGame(initialSave = '') {
    let saved = initialSave;
    let reloads = 0;
    const timers = [];
    const errors = [];
    const noOp = () => {};
    const context = vm.createContext({
        console: { log: noOp, warn: noOp, error: (...args) => errors.push(args) },
        ITEM_TEMPLATES: {},
        createItemFromTemplate: id => ({ id, name: id }),
        getWorldData: () => ({ mine_deep: { name: 'Test room', items: [], npcs: ['test_enemy'], exits: {} } }),
        getCharacterInfo: () => ({ name: 'Test enemy', hp: 50, maxHp: 50, atk: 3, def: 2, agi: 3, canFight: true, exp: 0 }),
        UI: {
            elements: { cmdInput: { focus: noOp } }, print: noOp, clearOutput: noOp,
            clearDetail: noOp, setDetail: noOp, setOverlay: noOp
        },
        StoryEngine: {
            check: noOp, getState: () => ({}), restore: noOp,
            completedQuests: [], activeQuests: [], questStages: {}, questProgress: {}, registry: new Map()
        },
        window: {
            addEventListener: noOp,
            showSaveFilePicker: async () => ({
                name: 'memory.json',
                createWritable: async () => ({ write: async text => { saved = text; }, close: async () => {} })
            }),
            showOpenFilePicker: async () => [{ getFile: async () => ({ text: async () => saved }) }]
        },
        document: { body: { classList: { add: noOp, remove: noOp } } },
        location: { reload: () => { reloads++; } },
        setTimeout: (fn, delay) => { timers.push({ fn, delay }); return timers.length; },
        clearTimeout: noOp,
        look: noOp, updateMinimap: noOp, updateSceneInfo: noOp, confirm: () => true
    });
    for (const file of [
        'character.js', 'game/balance.js', 'game/skills.js', 'game/battle.js',
        'game/state.js', 'game/helpers.js', 'game/inventoryPanels.js',
        'game/saveSystem.js', 'game/mainMenu.js'
    ]) {
        vm.runInContext(fs.readFileSync(path.join(root, file), 'utf8'), context, { filename: file });
    }
    // Do not exercise HTML rendering in domain/persistence tests.
    context.showInventoryPanel = noOp;
    context.showEquipmentPanel = noOp;
    const run = code => vm.runInContext(code, context);
    return {
        context, run, timers, errors,
        get player() { return run('gameState.player'); },
        get saved() { return saved; },
        get reloads() { return reloads; },
        eat(effect, value = 5) {
            this.player.inventory.push({ id: 'test_dish', name: 'Test dish', type: 'consumable', effect, value });
            context.useItemFromDetail('test_dish');
        },
        async load() {
            assert.equal(await context.loadGame(), true, JSON.stringify(errors));
        }
    };
}

function stats(player) {
    return { maxHp: player.maxHp, atk: player.atk, def: player.def, agi: player.agi };
}
function dishCount(player) { return player.inventory.filter(item => item.id === 'test_dish').length; }

for (const effect of ['maxHp', 'atk', 'def', 'agi', 'all']) {
    test(`${effect}: stacking, XP, multiple level-ups and repeated save/load retain bonuses`, async () => {
        const game = createGame();
        game.eat(effect);
        game.eat(effect, 2);
        const bonuses = { ...zeroBonuses };
        for (const key of effect === 'all' ? Object.keys(bonuses) : [effect]) bonuses[key] = 7;
        const expected = base => Object.fromEntries(Object.keys(base).map(key => [key, base[key] + bonuses[key]]));
        const level1 = expected({ maxHp: 20, atk: 3, def: 2, agi: 3 });
        assert.deepEqual(stats(game.player), level1);
        assert.deepEqual(plain(game.player.permanentBonuses), bonuses);
        assert.equal(dishCount(game.player), 0);
        game.player.exp = 1;
        game.context.checkLevelUp();
        assert.deepEqual(stats(game.player), level1);
        await game.context.saveGame();
        assert.equal(JSON.parse(game.saved).version, 4);
        const restored = createGame(game.saved);
        await restored.load();
        assert.deepEqual(stats(restored.player), level1);
        restored.player.exp = 55; // 20 + 35: level 1 -> 3.
        restored.context.checkLevelUp();
        const level3 = expected({ maxHp: 32, atk: 7, def: 4, agi: 4 });
        assert.equal(restored.player.level, 3);
        assert.equal(restored.player.hp, restored.player.maxHp);
        assert.deepEqual(stats(restored.player), level3);
        for (let i = 0; i < 3; i++) {
            await restored.context.saveGame();
            await restored.load();
            assert.deepEqual(stats(restored.player), level3);
            assert.deepEqual(plain(restored.player.permanentBonuses), bonuses);
            assert.equal(dishCount(restored.player), 0);
        }
    });
}

test('healing consumables do not create permanent growth; invalid bonuses do not consume items', () => {
    const game = createGame();
    game.player.hp = 10;
    game.eat('heal', 5);
    assert.equal(game.player.hp, 15);
    assert.deepEqual(plain(game.player.permanentBonuses), zeroBonuses);
    game.eat('atk', '5');
    assert.equal(dishCount(game.player), 1);
    assert.equal(game.player.atk, 3);
});

test('curse applies to base HP plus food HP regardless of equip/eat order; no rounding drift', async () => {
    const game = createGame();
    const curse = { id: 'test_curse', name: 'Test curse', type: 'accessory', maxHpPercent: -0.2 };
    game.eat('maxHp', 7);
    game.player.inventory.push(curse);
    game.context.equipItemFromDetail(curse.id);
    assert.equal(game.player.maxHp, 21);
    game.eat('maxHp', 5);
    assert.equal(game.player.maxHp, 25);
    game.player.hp = 10;
    await game.context.saveGame();
    await game.load();
    assert.equal(game.player.maxHp, 25);
    assert.equal(game.player.hp, 10);
    game.player.exp = 20;
    game.context.checkLevelUp();
    assert.equal(game.player.maxHp, 30); // floor((26 + 12) * 0.8)
    for (let i = 0; i < 3; i++) {
        game.context.unequipItem('accessory');
        assert.equal(game.player.maxHp, 38);
        game.context.equipItemFromDetail(curse.id);
        assert.equal(game.player.maxHp, 30);
    }
    game.player.inventory.push({ id: 'plain_ring', name: 'Ring', type: 'accessory' });
    game.context.equipItemFromDetail('plain_ring');
    assert.equal(game.player.maxHp, 38);
    assert.equal(game.player.hp, 30);
    assert.deepEqual(plain(game.player.permanentBonuses), { ...zeroBonuses, maxHp: 12 });
});

function legacySave(overrides = {}) {
    const game = createGame();
    const state = plain(game.run('gameState'));
    state.version = 2;
    delete state.player.permanentBonuses;
    Object.assign(state.player, overrides);
    return JSON.stringify(state);
}

test('v2 remaining bonuses migrate once, survive upgrades and do not double on reload', async () => {
    const game = createGame(legacySave({ maxHp: 30, hp: 15, atk: 8, def: 7, agi: 8 }));
    await game.load();
    const bonuses = { maxHp: 10, atk: 5, def: 5, agi: 5 };
    assert.deepEqual(plain(game.player.permanentBonuses), bonuses);
    assert.deepEqual(stats(game.player), { maxHp: 30, atk: 8, def: 7, agi: 8 });
    assert.equal(game.player.hp, 15);
    await game.context.saveGame();
    await game.load();
    assert.deepEqual(plain(game.player.permanentBonuses), bonuses);
    game.player.exp = 20;
    game.context.checkLevelUp();
    assert.deepEqual(stats(game.player), { maxHp: 36, atk: 10, def: 8, agi: 8 });
});

test('v2 curse rounding creates no bonus for base stats and retains observable HP surplus', async () => {
    const equipment = { accessory: { maxHpPercent: -0.2 }, weapon: null, armor: null };
    const base = createGame(legacySave({ level: 2, maxHp: 20, equipment, atk: 5, def: 3, agi: 3 }));
    await base.load();
    assert.deepEqual(plain(base.player.permanentBonuses), zeroBonuses);
    const boosted = createGame(legacySave({ maxHp: 21, hp: 21, equipment }));
    await boosted.load();
    assert.equal(boosted.player.maxHp, 21);
    await boosted.context.saveGame();
    await boosted.load();
    assert.equal(boosted.player.maxHp, 21);
    boosted.context.unequipItem('accessory');
    assert.equal(boosted.player.maxHp, 27);
});

test('v3 bonus ledger wins over saved temporary combat values', async () => {
    const game = createGame();
    game.eat('all');
    game.context.startBattle('test_enemy');
    game.run('skills.hatred.effect()');
    game.run('skills.player_vow.effect()');
    assert.equal(game.player.atk, 16);
    assert.equal(game.player.agi, 0);
    await game.context.saveGame();
    const restored = createGame(game.saved);
    await restored.load();
    assert.deepEqual(stats(restored.player), { maxHp: 25, atk: 8, def: 7, agi: 8 });
    assert.deepEqual(plain(restored.player.permanentBonuses), { maxHp: 5, atk: 5, def: 5, agi: 5 });
});

for (const outcome of ['victory', 'flee', 'defeat']) {
    test(`food eaten during buffed combat survives ${outcome} and later load`, async () => {
        const game = createGame();
        game.context.startBattle('test_enemy');
        game.run('skills.hatred.effect()');
        game.eat('all');
        if (outcome === 'flee') game.context._cleanupBattleState();
        else game.context.battleEnd(outcome === 'victory');
        assert.deepEqual(stats(game.player), { maxHp: 25, atk: 8, def: 7, agi: 8 });
        await game.context.saveGame();
        if (outcome === 'defeat') {
            game.timers.find(timer => timer.delay === 2000).fn();
            assert.equal(game.reloads, 1);
        }
        const restored = createGame(game.saved);
        await restored.load();
        assert.deepEqual(stats(restored.player), { maxHp: 25, atk: 8, def: 7, agi: 8 });
    });
}

test('defeat then reload of a pre-battle save preserves consumed food bonuses', async () => {
    const game = createGame();
    game.eat('all');
    await game.context.saveGame();
    game.context.startBattle('test_enemy');
    game.run('skills.hatred.effect()');
    game.player.hp = 0;
    game.context.battleEnd(false);
    game.timers.find(timer => timer.delay === 2000).fn();
    const restored = createGame(game.saved);
    await restored.load();
    assert.deepEqual(stats(restored.player), { maxHp: 25, atk: 8, def: 7, agi: 8 });
    assert.equal(dishCount(restored.player), 0);
    restored.context.initializeGame();
    assert.deepEqual(stats(restored.player), { maxHp: 20, atk: 3, def: 2, agi: 3 });
    assert.deepEqual(plain(restored.player.permanentBonuses), zeroBonuses);
});

test('victory XP level-up and in-combat level-up do not lose food to opening snapshots', () => {
    for (const duringCombat of [false, true]) {
        const game = createGame();
        game.eat('all');
        game.context.startBattle('test_enemy');
        if (duringCombat) {
            game.player.exp = 20;
            game.context.checkLevelUp();
        } else {
            game.run('battleState.enemies[0].exp = 20');
        }
        game.context.battleEnd(true);
        assert.equal(game.player.level, 2);
        assert.deepEqual(stats(game.player), { maxHp: 31, atk: 10, def: 8, agi: 8 });
    }
});
