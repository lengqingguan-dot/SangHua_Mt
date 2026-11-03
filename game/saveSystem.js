// ============================================================
//  game/saveSystem.js - 改进版存档/读档系统
//  - 持久化动态物品模板(dynamicItems)
//  - 持久化剧情/任务状态(storyState)
//  - 修复尸体肢解状态和地面掉落物的保存问题
// ============================================================

// 原始静态模板ID集合（用于区分动态创建的物品）
const ORIGINAL_TEMPLATE_IDS = new Set(
    (typeof ITEM_TEMPLATES !== 'undefined') ? Object.keys(ITEM_TEMPLATES) : []
);

// Mod 在页面启动后才加载；只登记本次加载的 Mod 物品，避免把旧游戏遗留的
// 动态掉落误登记成静态模板。
function registerStaticItemTemplates() {
    if (typeof ModLoader === 'undefined' || !ModLoader.mergedItems) return;
    Object.keys(ModLoader.mergedItems).forEach(id => ORIGINAL_TEMPLATE_IDS.add(id));
}

// 已从世界数据中移除的旧装饰物。读旧存档时也一并清理，避免重新出现。
const DEPRECATED_ROOM_ITEM_IDS = new Set([
    'sofa_set', 'tea_table', 'fireplace',
    'marble_bathtub', 'copper_faucet', 'towel_rack',
    'bookcases', 'leather_chair', 'writing_desk',
    'four_post_bed', 'tapestry', 'window_view',
    'old_furniture', 'wooden_boxes',
    'pink_bed', 'bookshelf', 'dressing_table',
    'wicker_chairs', 'tea_table_terrace',
    'medium_wooden_door_countess',
    'lost_carriage_horse', 'recovered_carriage_horse'
]);

function cleanupDeprecatedWorldContent(state) {
    if (!state || !state.world) return;

    Object.values(state.world).forEach(room => {
        if (room && Array.isArray(room.items)) {
            room.items = room.items.filter(id => !DEPRECATED_ROOM_ITEM_IDS.has(id));
        }
        if (room && room.exits) {
            Object.keys(room.exits).forEach(direction => {
                if (room.exits[direction] === 'secret_storage') delete room.exits[direction];
            });
        }
    });

    // 兼容曾进入过旧占位房间的存档，先送回原走廊再删除房间。
    if (state.player && state.player.location === 'secret_storage') {
        state.player.location = 'second_floor_3';
    }
    delete state.world.secret_storage;
}

// 兼容旧存档：补齐 272 → 山路尽头 → 147 的主线路线。
function repairKarenTownMainRoute(state, latestWorld) {
    if (!state || !state.world || !latestWorld) return;

    if (!state.world.mountain_path_13 && latestWorld.mountain_path_13) {
        state.world.mountain_path_13 = latestWorld.mountain_path_13;
    }
    if (!state.world.mountain_path_14 && latestWorld.mountain_path_14) {
        state.world.mountain_path_14 = latestWorld.mountain_path_14;
    }

    const room272 = state.world.mountain_path_13;
    const endingRoom = state.world.mountain_path_14;
    if (room272) {
        if (!room272.exits) room272.exits = {};
        room272.exits.south = 'mountain_path_14';
    }
    if (endingRoom) {
        if (!endingRoom.exits) endingRoom.exits = {};
        endingRoom.exits.north = 'mountain_path_13';
        if (!Array.isArray(endingRoom.items)) endingRoom.items = [];
        if (!endingRoom.items.includes('karen_town')) endingRoom.items.push('karen_town');
        endingRoom.isEnding = true;
    }
}

// 兼容旧存档：覆盖备用马版本的荒地支路，并补齐 325—333 号新路线。
function repairHiddenPathRoute(state, latestWorld) {
    if (!state || !state.world || !latestWorld) return;
    const routeRoomIds = [
        'wasteland_trail', 'wasteland_hollow',
        'hidden_path_3', 'hidden_path_4', 'hidden_path_5', 'hidden_path_6',
        'hidden_path_n1', 'hidden_path_n2', 'mysterious_stone_gate',
        'quiet_clearing', 'quiet_hut_floor1', 'quiet_hut_floor2', 'quiet_stable'
    ];
    const preserveAfterCreation = new Set(['quiet_clearing', 'quiet_hut_floor1', 'quiet_hut_floor2', 'quiet_stable']);
    routeRoomIds.forEach(roomId => {
        if (latestWorld[roomId] && (!preserveAfterCreation.has(roomId) || !state.world[roomId])) {
            state.world[roomId] = JSON.parse(JSON.stringify(latestWorld[roomId]));
        }
    });

    if (state.gameFlags && state.gameFlags.carriageHorseFound && state.world.quiet_stable) {
        state.world.quiet_stable.items = (state.world.quiet_stable.items || []).filter(id => id !== 'beautiful_white_horse');
    }

    const wasteland = state.world.wasteland;
    if (wasteland) {
        if (!(wasteland.items || []).includes('repaired_carriage')) wasteland.desc = latestWorld.wasteland.desc;
        wasteland.exits = { ...latestWorld.wasteland.exits };
        wasteland.items = (wasteland.items || []).filter(id => !['lost_carriage_horse', 'recovered_carriage_horse'].includes(id));
    }
}

function migrateFriendOrFoeQuest(state) {
    if (!state || typeof StoryEngine === 'undefined') return;
    const questId = 'quest_friend_or_foe';
    const completedIndex = StoryEngine.completedQuests.indexOf(questId);
    const wasCompleted = completedIndex !== -1;
    const alreadyMetFirstSerena = !!(state.talkedNPCs && state.talkedNPCs.serena);
    const alreadyMetQuietSerena = !!(state.talkedNPCs && state.talkedNPCs.serena_quiet);
    // 新版中完成两次对话的存档保持完成状态；只修复旧版在首次对话后便提前完成的记录。
    if (wasCompleted && alreadyMetQuietSerena) return;
    if (wasCompleted) StoryEngine.completedQuests.splice(completedIndex, 1);
    if (alreadyMetFirstSerena) {
        if (!StoryEngine.activeQuests.includes(questId)) StoryEngine.activeQuests.push(questId);
        StoryEngine.questStages[questId] = 1;
        StoryEngine.questProgress[questId] = {};
        const story = StoryEngine.registry.get(questId);
        if (story && story.stages) StoryEngine._applyStage(questId, story);
    }
}

// 判断是否为动态物品ID
function isDynamicItem(itemId) {
    return !ORIGINAL_TEMPLATE_IDS.has(itemId);
}

// 收集所有动态创建的物品模板
function collectDynamicItems() {
    const dynamic = {};
    for (const [id, template] of Object.entries(ITEM_TEMPLATES)) {
        if (isDynamicItem(id) && template && typeof template === 'object') {
            dynamic[id] = JSON.parse(JSON.stringify(template));
        }
    }
    return dynamic;
}

// 恢复动态物品模板到全局
function restoreDynamicItems(dynamicItems) {
    if (!dynamicItems) return 0;
    let count = 0;
    for (const [id, template] of Object.entries(dynamicItems)) {
        if (!ITEM_TEMPLATES[id]) {
            ITEM_TEMPLATES[id] = template;
            // ★ 不添加到 ORIGINAL_TEMPLATE_IDS，保持动态物品标记
            // 确保后续保存时 isDynamicItem() 仍返回 true
            count++;
        }
    }
    return count;
}

// 保存游戏
let saveLoadInProgress = false;
async function saveGame() {
    if (saveLoadInProgress) return false;
    if (battleState.inBattle && typeof window._onBattleEnd==='function' && !battleState.completionHandler) {
        print('此 Mod 战斗使用了无法保存的回调，请在战斗结束后保存。'); return false;
    }
    saveLoadInProgress = true;
    const resume = typeof pauseCombatForIO === 'function' ? pauseCombatForIO() : () => {};
    try {
        const saveData = {
            version: 4,
            activeDungeon: gameState.activeDungeon || null,
            exploration: gameState.exploration || null,
            entitySequence: gameState.entitySequence || 0,
            combatState: typeof snapshotCombat === 'function' ? snapshotCombat() : null,
            timestamp: Date.now(),
            player: gameState.player,
            world: gameState.world,
            quests: gameState.quests,
            gameFlags: gameState.gameFlags || {},
            talkedNPCs: gameState.talkedNPCs || {},
            assaultedNPCs: gameState.assaultedNPCs || {},
            firstTimeEntered: gameState.firstTimeEntered,

            // ★ 持久化势力与悬赏状态
            factions: gameState.factions || {},
            bountyState: gameState.bountyState || { activeBounties: [], lastShownBounties: [] },

            // ★ 持久化逃跑后的后台盟友战斗
            backgroundBattles: gameState.backgroundBattles || {},

            // ★ 持久化动态创建的物品模板
            dynamicItems: collectDynamicItems(),

            // ★ 持久化剧情/任务状态
            storyState: typeof StoryEngine !== 'undefined' ? StoryEngine.getState() : {}
        };

        const saveDataStr = JSON.stringify(saveData);
        const fileName = `save_${Date.now()}.json`;
        const options = {
            suggestedName: fileName,
            types: [{ description: '游戏存档', accept: { 'application/json': ['.json', '.sav'] } }]
        };
        const handle = await window.showSaveFilePicker(options);
        const writable = await handle.createWritable();
        await writable.write(saveDataStr);
        await writable.close();
        print("💾 你的复仇之路已保存到: " + handle.name);
    } catch (e) {
        if (e.name === 'AbortError') {
            print("⚠️ 保存已取消。");
        } else {
            print("❌ 保存失败: " + e.message);
        }
    } finally {
        saveLoadInProgress = false;
        resume();
    }
}

// 读取存档
async function loadGame() {
    if (saveLoadInProgress) return false;
    saveLoadInProgress = true;
    currentPanel = null;
    const resume = typeof pauseCombatForIO === 'function' ? pauseCombatForIO() : () => {};
    try {
        const options = {
            types: [{ description: '游戏存档', accept: { 'application/json': ['.json', '.sav'] } }]
        };
        const [fileHandle] = await window.showOpenFilePicker(options);
        const file = await fileHandle.getFile();
        const saved = await file.text();
        if (!saved) { print("❌ 存档文件为空。"); return false; }

        const loaded = JSON.parse(saved);
        if (!loaded || !loaded.player || !loaded.world || !Array.isArray(loaded.player.inventory) || !loaded.player.equipment) throw new Error('缺少玩家或世界数据');
        if (loaded.version > 4) throw new Error('此存档来自更新版本');

        cleanupDeprecatedWorldContent(loaded);

        // ★ 恢复动态物品模板
        if (loaded.dynamicItems) {
            const restored = restoreDynamicItems(loaded.dynamicItems);
            console.log(`[SaveSystem] 恢复了 ${restored} 个动态物品模板`);
        }

        // ★ 恢复剧情状态
        if (loaded.storyState && typeof StoryEngine !== 'undefined') {
            StoryEngine.restore(loaded.storyState);
        }

        // 恢复游戏状态
        gameState = loaded;
        if (gameState.player?.equipment?.body) {
            const legacyBodyArmor = gameState.player.equipment.body;
            if (!gameState.player.equipment.armor) gameState.player.equipment.armor = legacyBodyArmor;
            else gameState.player.inventory.push(legacyBodyArmor);
            delete gameState.player.equipment.body;
        }
        if (!loaded.version || loaded.version < 3) migrateLegacyPlayerBonuses(gameState.player);
        if (typeof applyPlayerLevelBalance === 'function') applyPlayerLevelBalance(gameState.player, true);
        if (typeof migrateProgression029 === 'function') migrateProgression029(gameState, loaded.version || 1);
        if (typeof resetElaineAppearance === 'function') resetElaineAppearance();
        if (typeof resetMandorolaIdentity === 'function') resetMandorolaIdentity();
        if (typeof resetCoachmanState === 'function') resetCoachmanState();

        // 兼容旧存档：补默认势力/悬赏状态
        if (!gameState.factions) gameState.factions = {};
        if (!gameState.factions.extinction) gameState.factions.extinction = { joined: false, renown: 0, level: 1 };
        if (!gameState.bountyState) gameState.bountyState = { activeBounties: [], lastShownBounties: [] };
        if (!gameState.bountyState.activeBounties) gameState.bountyState.activeBounties = [];
        if (!gameState.bountyState.lastShownBounties) gameState.bountyState.lastShownBounties = [];
        // 兼容旧存档：补后台战斗字段
        if (!gameState.backgroundBattles) gameState.backgroundBattles = {};

        // 重新加载世界数据，确保包含最新的房间定义
        const latestWorld = getWorldData();
        for (const roomId in latestWorld) {
            if (!gameState.world[roomId]) {
                gameState.world[roomId] = latestWorld[roomId];
            }
        }
        repairKarenTownMainRoute(gameState, latestWorld);
        repairHiddenPathRoute(gameState, latestWorld);
        if (typeof repairLoadedAcademyDungeon === 'function') repairLoadedAcademyDungeon();
        if (typeof repairExploration029 === 'function') repairExploration029();
        migrateFriendOrFoeQuest(gameState);

        // 兼容新增主线5前已经完成主线4、但仍停在驿站的存档。
        const departDone = typeof StoryEngine !== 'undefined' && StoryEngine.completedQuests.includes('quest_depart');
        const shadowStarted = typeof StoryEngine !== 'undefined' &&
            (StoryEngine.activeQuests.includes('quest_shadow_castle') || StoryEngine.completedQuests.includes('quest_shadow_castle'));
        if (departDone && !shadowStarted && gameState.player.location === 'karen_relay_station') {
            if (typeof moveNpcToRoom === 'function') moveNpcToRoom('coachman', 'wasteland');
            gameState.player.location = 'wasteland';
        }

        // 恢复由任务进度改变的人物身份与外观（兼容旧存档）。
        const mandorolaMoved = Object.entries(gameState.world).some(([roomId, room]) =>
            roomId !== 'slum_tunnel' && room && Array.isArray(room.npcs) && room.npcs.includes('slum_girl')
        );
        if (typeof revealMandorolaIdentity === 'function' &&
            ((gameState.gameFlags && gameState.gameFlags.mandorolaIntroduced) || mandorolaMoved)) {
            revealMandorolaIdentity();
        }
        const hasRedBanner = gameState.player.inventory.some(item => item && item.id === 'red_banner');
        const elaineChanged = gameState.gameFlags && (gameState.gameFlags.rebelAlliesEnabled || gameState.gameFlags.redFlagPlanted);
        if (typeof applyElaineRebelAppearance === 'function' && (hasRedBanner || elaineChanged)) {
            applyElaineRebelAppearance();
        }
        const shadowActive = typeof StoryEngine !== 'undefined' && StoryEngine.activeQuests.includes('quest_shadow_castle');
        if (typeof applyCoachmanStrandedState === 'function' &&
            ((gameState.gameFlags && gameState.gameFlags.carriageStranded) || shadowActive)) {
            applyCoachmanStrandedState();
        }

        // 重新注册地面物品到ITEM_TEMPLATES（兼容旧存档）
        for (const roomId in gameState.world) {
            const room = gameState.world[roomId];
            if (room && room.items) {
                room.items.forEach(itemId => {
                    if (!ITEM_TEMPLATES[itemId]) {
                        // 尝试从动态物品中查找
                        if (loaded.dynamicItems && loaded.dynamicItems[itemId]) {
                            ITEM_TEMPLATES[itemId] = loaded.dynamicItems[itemId];
                        }
                    }
                });
            }
        }

        gameState.firstTimeEntered = false;
        waitingForName = false;
        UI.elements.cmdInput.placeholder = "输入命令 (如 look, n, i)...";
        clearOutput();

        // ★ 读档后恢复进行中悬赏的NPC实例
        if (typeof restoreBountyNpcs === 'function') {
            restoreBountyNpcs();
        }

        // ★ 读档后恢复未完成的后台盟友战斗
        if (typeof ensureBackgroundBattleLoop === 'function') {
            const hasPending = Object.keys(gameState.backgroundBattles || {})
                .some(id => gameState.backgroundBattles[id] && gameState.backgroundBattles[id].status === 'pending');
            if (hasPending) ensureBackgroundBattleLoop();
        }

        print("📀 记忆复苏，你回到了桑华山的矿道中……");
        if (typeof restoreCombatSnapshot === 'function') restoreCombatSnapshot(loaded.combatState);
        look();
        updateMinimap();
        return true;
    } catch (e) {
        if (e.name === 'AbortError') { print('读取已取消。'); return false; }
        print("❌ 存档损坏，无法读取。");
        console.error("读档错误:", e);
        return false;
    } finally {
        saveLoadInProgress = false;
        resume();
    }
}

// 重置游戏
function resetGame() {
    currentPanel = null;
    if (confirm('一切将重新开始，确定吗？')) {
        if (typeof cancelBattleTimers === 'function') cancelBattleTimers();
        if (typeof _stopBackgroundBattleLoop === 'function') _stopBackgroundBattleLoop();
        battleState = JSON.parse(JSON.stringify(DEFAULT_BATTLE_STATE));
        window._onBattleEnd = null;
        document.body.classList.remove('battle-mode');
        gameState = getDefaultGameState();
        if (typeof resetElaineAppearance === 'function') resetElaineAppearance();
        if (typeof resetMandorolaIdentity === 'function') resetMandorolaIdentity();
        if (typeof resetCoachmanState === 'function') resetCoachmanState();
        clearOutput();
        waitingForName = false;
        UI.elements.cmdInput.placeholder = "输入命令 (如 look, n, i)...";
        print("⚒️ 桑华山的阴冷再次包裹了你。你必须逃出去，然后复仇。");
        look();
        updateMinimap();
    }
}
