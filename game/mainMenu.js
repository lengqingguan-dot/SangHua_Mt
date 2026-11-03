// ============================================================
//  game/mainMenu.js - 主菜单/启动/初始化
// ============================================================

// 开始游戏
async function startGame() {
    document.getElementById('main-menu').style.display = 'none';
    document.getElementById('game-container').style.display = 'flex';

    // 加载模组
    if (typeof ModLoader !== 'undefined') {
        await ModLoader.loadAllMods();
        ModLoader.applyToCharacters();
        ModLoader.applyToItems();
        ModLoader.applyToCorpseMap();
        registerStaticItemTemplates();
    }

    // 初始化剧情引擎并注册主游戏剧情
    if (typeof StoryEngine !== 'undefined') {
        StoryEngine.init();
    }

    // 重新初始化游戏
    initializeGame();
}

// 从菜单加载存档
async function loadGameFromMenu() {
    if (typeof ModLoader !== 'undefined') {
        await ModLoader.loadAllMods();
        ModLoader.applyToCharacters();
        ModLoader.applyToItems();
        ModLoader.applyToCorpseMap();
        registerStaticItemTemplates();
    }

    if (typeof StoryEngine !== 'undefined') {
        StoryEngine.init();
    }

    if (await loadGame()) {
        document.getElementById('main-menu').style.display = 'none';
        document.getElementById('game-container').style.display = 'flex';
    }
}

// 退出游戏
function exitGame() {
    if (confirm("确定要退出游戏吗？")) {
        window.close();
    }
}

// 返回主菜单
function backToMainMenu() {
    if (typeof cancelBattleTimers === 'function') cancelBattleTimers();
    if (battleState.inBattle) battleState.paused = true;
    if (typeof _stopBackgroundBattleLoop === 'function') _stopBackgroundBattleLoop();
    document.getElementById('main-menu').style.display = 'block';
    document.getElementById('game-container').style.display = 'none';
}

// 清空输出区
function clearOutputWindow() {
    UI.clearOutput();
    print("✨ 输出区已清空。");
    currentPanel = null;
}

// 初始化游戏
function initializeGame() {
    window._onBattleEnd = null;
    if (typeof cancelBattleTimers === 'function') cancelBattleTimers();
    if (typeof _stopBackgroundBattleLoop === 'function') _stopBackgroundBattleLoop();
    gameState = getDefaultGameState();
    if (typeof resetElaineAppearance === 'function') resetElaineAppearance();
    if (typeof resetMandorolaIdentity === 'function') resetMandorolaIdentity();
    if (typeof resetCoachmanState === 'function') resetCoachmanState();
    if (typeof battleState !== 'undefined') {
        battleState = JSON.parse(JSON.stringify(DEFAULT_BATTLE_STATE));
    }
    currentPanel = null;
    currentDetailItem = null;
    currentDetailNPC = null;

    clearOutput();
    look();
    updateMinimap();
    updateSceneInfo();

    if (UI.elements.cmdInput) {
        UI.elements.cmdInput.focus();
    }
}

// 页面加载初始化
window.addEventListener('DOMContentLoaded', () => {
    UI.init();

    // 绑定输入框回车事件
    UI.elements.cmdInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') sendCommand();
    });

    // 显示主菜单
    const mainMenu = document.getElementById('main-menu');
    if (mainMenu) {
        document.getElementById('game-container').style.display = 'none';
        mainMenu.style.display = 'block';
    } else {
        look();
        updateMinimap();
        UI.elements.cmdInput.focus();
    }
});
