// ============================================================
//  game/state.js - 游戏状态管理
//  集中管理所有游戏状态变量和默认值
// ============================================================

// 默认游戏状态工厂函数
function getDefaultGameState() {
    return {
        player: {
            name: "散华",
            hp: 18,
            maxHp: 20,
            sp: 10,
            maxSp: 10,
            atk: 3,
            def: 2,
            agi: 3,
            level: 1,
            exp: 0,
            maxExp: 10,
            gold: 0,
            location: "mine_deep",
            inventory: [],
            skills: ['hatred'],
            equipment: {
                weapon: createItemFromTemplate('pickaxe'),
                armor: createItemFromTemplate('miners_cloth'),
                accessory: null
            }
        },
        world: getWorldData(),
        firstTimeEntered: true,
        talkedNPCs: {},
        assaultedNPCs: {},
        quests: {
            main: [],
            side: []
        },
        factions: {
            extinction: { joined: false, renown: 0, level: 1 }
        },
        bountyState: {
            activeBounties: [],
            lastShownBounties: []
        },
        // 玩家逃跑后盟友与敌人的后台战斗记录（按房间ID索引）
        backgroundBattles: {},
        gameFlags: {}
    };
}

// 主游戏状态（可变）
let gameState = getDefaultGameState();

// 面板状态管理
let mainContent = '';
let currentPanel = null;
let detailContent = '';
let previousPanelType = null;
let inventoryContent = '';
let equipmentContent = '';
let statusContent = '';
let questsContent = '';
let groundItemReturnTarget = '';
let npcDialogueReturnTarget = '';
let currentDetailItem = null;
let currentDetailNPC = null;
let waitingForName = false;


