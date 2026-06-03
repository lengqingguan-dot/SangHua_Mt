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

// 房间编号映射（开发者测试用）
const ROOM_ID_MAP = {
    1: 'mine_deep',           2: 'mine_tunnel',         3: 'north_tunnel',
    4: 'tunnel_exit',         5: 'mine_exit',           6: 'stone_road',
    7: 'stone_road_2',        8: 'mine_exit_1',         9: 'tunnel_exit_1',
    10: 'north_tunnel_1',     11: 'tunnel_1',           12: 'mine_deep_1',
    13: 'stone_road_3',       14: 'stone_road_4',       15: 'mine_exit_3',
    16: 'tunnel_exit_3',      17: 'north_tunnel_3',     18: 'tunnel_3',
    19: 'mine_deep_3',        20: 'stone_road_5',       21: 'stone_road_6',
    22: 'mine_exit_4',        23: 'tunnel_exit_4',      24: 'tunnel_4_north',
    25: 'tunnel_4_east',      26: 'tunnel_4_west',      27: 'tunnel_4_west_1',
    28: 'tunnel_4_west_2',    29: 'tunnel_4_west_3',    30: 'tunnel_4_west_4',
    31: 'tunnel_4_west_5',    32: 'tunnel_4_west_6',    33: 'tunnel_4_west_7',
    34: 'tunnel_4_south',     35: 'stone_road_7',       36: 'stone_road_8',
    37: 'stone_road_9',       38: 'canteen_gate',       39: 'canteen_hall',
    40: 'kitchen',            41: 'stone_road_10',      42: 'dormitory_gate',
    43: 'stone_road_11',      44: 'stone_road_12',      45: 'mine_gate',
    46: 'path_1',             47: 'path_2',             48: 'side_gate',
    49: 'stone_road_13',      50: 'stone_road_14',      51: 'knight_gate',
    52: 'training_ground',    53: 'knight_house',       54: 'stable',
    55: 'forest_start',       56: 'forest_1_e1',        57: 'forest_1_e2',
    58: 'forest_1_e3',        59: 'forest_1_e4',        60: 'forest_1_w1',
    61: 'forest_1_w2',        62: 'forest_1_w3',        63: 'forest_1_w4',
    64: 'forest_2_center',    65: 'forest_2_e1',        66: 'forest_2_e2',
    67: 'forest_2_e3',        68: 'forest_2_e4',        69: 'forest_2_w1',
    70: 'forest_2_w2',        71: 'forest_2_w3',        72: 'forest_2_w4',
    73: 'forest_3_center',    74: 'forest_3_e1',        75: 'forest_3_e2',
    76: 'forest_3_e3',        77: 'forest_3_e4',        78: 'forest_3_w1',
    79: 'forest_3_w2',        80: 'forest_3_w3',        81: 'forest_3_w4',
    82: 'forest_4_center',    83: 'forest_4_e1',        84: 'forest_4_e2',
    85: 'forest_4_e3',        86: 'forest_4_e4',        87: 'forest_4_w1',
    88: 'forest_4_w2',        89: 'forest_4_w3',        90: 'forest_4_w4',
    91: 'deep_forest_1_center', 92: 'deep_forest_1_e1', 93: 'deep_forest_1_e2',
    94: 'deep_forest_1_e3',   95: 'deep_forest_1_w1',   96: 'deep_forest_1_w2',
    97: 'deep_forest_1_w3',   98: 'deep_forest_2_center', 99: 'deep_forest_2_e1',
    100: 'deep_forest_2_e2',  101: 'deep_forest_2_w1',  102: 'deep_forest_2_w2',
    103: 'deep_forest_3_center', 104: 'deep_forest_3_e1', 105: 'deep_forest_3_w1',
    106: 'cliff',             107: 'hut_floor1',
    108: 'mountain_path_1',   109: 'mountain_path_2',   110: 'mountain_path_3',
    111: 'mountain_path_4',   112: 'mansion_gate',      113: 'fence_gate',
    114: 'garden_south',      115: 'garden_north',      116: 'greenhouse',
    117: 'mansion_back_door', 118: 'corridor_center',   119: 'corridor_west',
    120: 'corridor_west_2',   121: 'corridor_north',    122: 'corridor_north_2',
    123: 'corridor_south',    124: 'corridor_south_2',  125: 'mansion_hall',
    126: 'mansion_front_yard',127: 'second_floor_north',128: 'second_floor_1',
    129: 'second_floor_2',    130: 'second_floor_3',    131: 'second_floor_4',
    132: 'maid_room',         133: 'dining_room',       134: 'mansion_kitchen',
    135: 'reception_room',    136: 'bathroom',          137: 'storage_room',
    138: 'terrace',           139: 'countess_bedroom',  140: 'daughter_bedroom',
    141: 'study',             142: 'third_floor_center',143: 'count_bedroom',
    144: 'third_floor_north', 145: 'attic',             146: 'tutor_bedroom',
    147: 'road',              148: 'road_north_1',      149: 'road_north_2',
    150: 'road_north_3',      151: 'road_north_4',      152: 'karen_town_gate',
    153: 'town_road_center',  154: 'town_road_n1',      155: 'town_road_n2',
    156: 'town_road_n3',      157: 'count_mansion_gate',158: 'town_road_w1',
    159: 'town_road_w2',      160: 'town_road_w3',      161: 'town_road_e1',
    162: 'town_road_e2',      163: 'town_road_e3',      164: 'residence_w1',
    165: 'bakery',            166: 'residence_w3',      167: 'town_road_w4',
    168: 'town_road_w5',      169: 'karen_town_side_gate', 170: 'town_road_e2_north',
    171: 'town_road_e3_north',172: 'town_road_w4_n1',   173: 'town_road_w4_n2',
    174: 'town_road_w4_n3',   175: 'side_path_1',       176: 'side_path_2',
    177: 'side_path_3',       178: 'church_gate',       179: 'church_courtyard_1',
    180: 'church_courtyard_1_w1', 181: 'church_courtyard_1_w2', 182: 'church_courtyard_2',
    183: 'church_courtyard_2_w1', 184: 'church_courtyard_2_w2', 185: 'cemetery'
};

// 获取房间编号对应的房间ID
function getRoomIdByNumber(num) {
    return ROOM_ID_MAP[num] || null;
}