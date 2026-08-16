// ============================================================
//  game/devTools.js - 开发者工具
//  房间编号映射、测试传送等开发辅助功能
// ============================================================

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
    156: 'town_road_n3',      157: 'center_street_1',   158: 'town_road_w1',
    159: 'town_road_w2',      160: 'town_road_w3',      161: 'town_road_e1',
    162: 'town_road_e2',      163: 'town_road_e3',      164: 'residence_w1',
    165: 'residence_w2',            166: 'residence_w3',      167: 'town_road_w4',
    168: 'town_road_w5',      169: 'karen_town_side_gate', 170: 'town_road_e2_north',
    171: 'town_road_e3_north',172: 'town_road_w4_n1',   173: 'town_road_w4_n2',
    174: 'town_road_w4_n3',   175: 'side_path_1',       176: 'side_path_2',
    177: 'side_path_3',       178: 'church_gate',       179: 'church_courtyard_1',
    180: 'church_courtyard_1_w1', 181: 'church_courtyard_1_w2', 182: 'church_courtyard_2',
    183: 'church_courtyard_2_w1', 184: 'church_courtyard_2_w2', 185: 'cemetery',
    186: 'slum_east_1',          187: 'slum_east_2',
    188: 'slum_west_n1',         189: 'slum_west_n2',      190: 'slum_west_n3',
    191: 'slum_east_n1',         192: 'slum_east_n2',
    193: 'town_road_n2_w1',      194: 'town_road_n2_e1',   195: 'town_road_n2_e2',
    196: 'town_road_e2_n1',      197: 'town_road_e2_n2',
    198: 'town_road_e3_n1',      199: 'town_road_e3_n2',
    200: 'center_street_2',      201: 'center_street_3',   202: 'town_square',
    203: 'square_w1',            204: 'square_w2',         205: 'square_w3',
    206: 'square_e1',            207: 'square_e2',         208: 'square_e3',
    209: 'square_n1',            210: 'square_n2',         211: 'square_n3',
    212: 'fence_gate_north',     213: 'scribe_residence_gate', 214: 'karen_tavern',
    215: 'church_back_door',     216: 'church_porch',
    217: 'church_nave',          218: 'church_choir',
    219: 'church_altar',         220: 'church_sacristy',
    221: 'church_south_path',    222: 'priest_residence',
    223: 'church_north_path_1',  224: 'bell_tower',
    225: 'church_north_path_2',  226: 'abandoned_monastery',
    227: 'square_e4',            228: 'square_e5',         229: 'karen_relay_station',
    230: 'farm_1_1',             231: 'farm_1_2',          232: 'farm_1_3',
    233: 'farm_1_4',             234: 'farm_1_5',          235: 'farm_2_1',
    236: 'farm_2_2',             237: 'farm_2_3',          238: 'farm_2_4',
    239: 'farm_2_5',             240: 'farm_3_1',          241: 'farm_3_2',
    242: 'farm_3_3',             243: 'farm_3_4',          244: 'farm_3_5',
    245: 'farm_4_1',             246: 'farm_4_2',          247: 'farm_4_3',
    248: 'farm_4_4',             249: 'farm_4_5',          250: 'farm_5_1',
    251: 'farm_5_2',             252: 'farm_5_3',          253: 'farm_5_4',
    254: 'farm_5_5',             255: 'grain_mill',
    256: 'castle_road_1',        257: 'castle_road_2',
    258: 'griffin_knight_hq',    259: 'castle_road_e1',
    260: 'castle_road_e2',       261: 'count_castle_gate',
    262: 'stone_road_15',        263: 'stone_road_16',     264: 'mountain_path_5',
    265: 'mountain_path_6',      266: 'mountain_path_7',   267: 'mountain_path_8',
    268: 'mountain_path_9',      269: 'mountain_path_10',  270: 'mountain_path_11',
    271: 'mountain_path_12',     272: 'mountain_path_13',  273: 'mountain_path_14',
    274: 'hut_floor2',           275: 'basement',          276: 'workshop',
    277: 'stables',              278: 'dormitory_1',       279: 'dormitory_2',
    280: 'dormitory_3',          281: 'garden_center',
    282: 'cellar_north',         283: 'cellar_south',      284: 'cellar_east',
    285: 'cellar_west',          286: 'cellar_center',     287: 'cellar_northwest',
    288: 'cellar_northeast',     289: 'cellar_southwest',  290: 'cellar_southeast',
    291: 'deep_forest_1_e4',     292: 'deep_forest_1_w4',  293: 'deep_forest_1_w4_extra',
    294: 'deep_forest_2_e3',     295: 'deep_forest_2_e4',  296: 'deep_forest_2_w3',
    297: 'deep_forest_2_w4',     298: 'deep_forest_2_w4_extra',
    299: 'deep_forest_3_w2',     300: 'deep_forest_3_w3',  301: 'deep_forest_3_w4',
    302: 'castle_outer',          303: 'castle_outer_north_tower', 304: 'castle_outer_south_tower',
    305: 'castle_hall',           306: 'castle_corridor_1',    307: 'castle_corridor_2',
    308: 'castle_banquet_hall',   309: 'castle_2f_corridor_1', 310: 'castle_2f_corridor_2',
    311: 'castle_2f_corridor_3',  312: 'castle_observation_room',
    313: 'castle_corridor_3',      314: 'castle_corridor_4',
    315: 'dungeon_entrance',       316: 'dungeon',
    317: 'castle_3f_corridor_1',   318: 'castle_3f_corridor_2',
    319: 'count_command_room',
    320: 'dungeon_2',              321: 'dungeon_3',
    322: 'dungeon_4',
    323: 'castle_rooftop'
};

// 由 ROOM_ID_MAP 自动生成的反向映射: roomId → 编号
const ROOM_ID_TO_NUMBER = {};
for (const [num, id] of Object.entries(ROOM_ID_MAP)) {
    ROOM_ID_TO_NUMBER[id] = parseInt(num);
}

// 获取房间编号对应的房间ID
function getRoomIdByNumber(num) {
    return ROOM_ID_MAP[num] || null;
}

// 获取房间ID对应的编号
function getRoomNumberById(roomId) {
    return ROOM_ID_TO_NUMBER[roomId] || null;
}

// 为世界数据中每个房间注入 roomNumber 属性
function injectRoomNumbers(worldData) {
    for (const roomId in worldData) {
        const num = ROOM_ID_TO_NUMBER[roomId];
        if (num !== undefined) {
            worldData[roomId].roomNumber = num;
        }
    }
    return worldData;
}
