// ============================================================
//  game/state.js - 游戏状态管理
//  集中管理所有游戏状态变量和默认值
// ============================================================

// 默认游戏状态工厂函数
function getDefaultGameState() {
    const state = {
        player: {
            name: "散华",
            hp: 18,
            maxHp: 20,
            sp: 10,
            maxSp: 10,
            atk: 3,
            def: 2,
            agi: 3,
            permanentBonuses: { maxHp: 0, atk: 0, def: 0, agi: 0 },
            level: 1,
            exp: 0,
            maxExp: 20,
            gold: 0,
            location: "mine_deep",
            inventory: [],
            skills: ['hatred'],
            skillProgress: { hatred: { level: 1, learnedSource: 'initial' } },
            equipment: {
                weapon: createItemFromTemplate('pickaxe'),
                armor: createItemFromTemplate('miners_cloth'),
                accessory: null
            },
            magicDoll: {
                slots: {
                    head: null,
                    torso: null,
                    leftArm: null,
                    rightArm: null,
                    leftHand: null,
                    rightHand: null,
                    leftLeg: null,
                    rightLeg: null,
                    leftFoot: null,
                    rightFoot: null,
                    leftBreast: null,
                    rightBreast: null
                }
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
    if (typeof applyPlayerLevelBalance === 'function') applyPlayerLevelBalance(state.player, false);
    return state;
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


