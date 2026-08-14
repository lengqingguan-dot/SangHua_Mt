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
async function saveGame() {
    try {
        const saveData = {
            version: 2,
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
    }
}

// 读取存档
async function loadGame() {
    currentPanel = null;
    try {
        const options = {
            types: [{ description: '游戏存档', accept: { 'application/json': ['.json', '.sav'] } }]
        };
        const [fileHandle] = await window.showOpenFilePicker(options);
        const file = await fileHandle.getFile();
        const saved = await file.text();
        if (!saved) { print("❌ 存档文件为空。"); return false; }

        const loaded = JSON.parse(saved);

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

        // 兼容旧存档：补默认势力/悬赏状态
        if (!gameState.factions) gameState.factions = {};
        if (!gameState.factions.extinction) gameState.factions.extinction = { joined: false, renown: 0, level: 1 };
        if (!gameState.bountyState) gameState.bountyState = { activeBounties: [], lastShownBounties: [] };
        if (!gameState.bountyState.activeBounties) gameState.bountyState.activeBounties = [];
        if (!gameState.bountyState.lastShownBounties) gameState.bountyState.lastShownBounties = [];

        // 重新加载世界数据，确保包含最新的房间定义
        const latestWorld = getWorldData();
        for (const roomId in latestWorld) {
            if (!gameState.world[roomId]) {
                gameState.world[roomId] = latestWorld[roomId];
            }
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

        print("📀 记忆复苏，你回到了桑华山的矿道中……");
        look();
        updateMinimap();
        return true;
    } catch (e) {
        print("❌ 存档损坏，无法读取。");
        console.error("读档错误:", e);
        return false;
    }
}

// 重置游戏
function resetGame() {
    currentPanel = null;
    if (confirm('一切将重新开始，确定吗？')) {
        gameState = getDefaultGameState();
        clearOutput();
        waitingForName = false;
        UI.elements.cmdInput.placeholder = "输入命令 (如 look, n, i)...";
        print("⚒️ 桑华山的阴冷再次包裹了你。你必须逃出去，然后复仇。");
        look();
        updateMinimap();
    }
}