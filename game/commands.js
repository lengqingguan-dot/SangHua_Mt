// ============================================================
//  game/commands.js - 命令解析系统
//  处理玩家输入的命令并分派到对应逻辑
// ============================================================

function processCommand(cmd) {
    if (!cmd.trim()) return;

    const args = cmd.trim().toLowerCase().split(/\s+/);
    const action = args[0];

    print(`<span style="color: #aaa;">> ${cmd}</span>`);

    switch (action) {
        case 'help':
        case '?':
            showHelp();
            break;

        case 'look':
        case 'l':
            currentPanel = null;
            look();
            updateMinimap();
            break;

        case 'north':
        case 'n':
        case 'south':
        case 's':
        case 'east':
        case 'e':
        case 'west':
        case 'w':
            move(action);
            break;

        case 'i':
        case 'inventory':
            showInventory();
            break;

        case 'hp':
        case 'status':
            showStatus();
            break;

        case 'save':
            saveGame();
            break;

        case 'load':
            loadGame();
            break;

        case 'reset':
            resetGame();
            break;

        case 'tp':
            handleTpCommand(args);
            break;

        case 'exp':
            handleExpCommand(args);
            break;

        default:
            print(`「${action}」是什么？输入 help 查看可用命令。`);
    }
}

function showHelp() {
    print("════ 命 令 帮 助 ════");
    print(" look / l      - 观察周围");
    print(" n / s / e / w - 向北/南/东/西移动");
    print(" north / south / east / west");
    print(" i / inventory - 查看行囊");
    print(" hp / status   - 查看状态");
    print(" save / load   - 保存/读取进度 (也可用下方按钮)");
    print(" reset         - 重新开始");
    print(" tp <编号>     - 开发者传送 (测试用)");
    print(" exp <数值>    - 开发者经验 (测试用)");
    print("（也可以直接点击右侧小地图移动）");
    print("═══════════════════════");
}

function handleTpCommand(args) {
    if (args[1]) {
        const roomNum = parseInt(args[1]);
        if (isNaN(roomNum)) {
            print(`<span style="color: red;">请输入有效的房间编号（数字）</span>`);
        } else {
            teleport(roomNum);
        }
    } else {
        print(`<span style="color: #888;">用法: tp <房间编号></span>`);
        print(`<span style="color: #888;">可用编号: 1-${Object.keys(ROOM_ID_MAP).length}</span>`);
        print(`<span style="color: #666;">1=二号矿井深处, 5=二号矿井口, 8=一号矿井口, 15=三号矿井口, 22=四号矿井口</span>`);
    }
}

function handleExpCommand(args) {
    if (args[1]) {
        const expAmount = parseInt(args[1]);
        if (isNaN(expAmount) || expAmount <= 0) {
            print(`<span style="color: red;">请输入有效的经验值（正整数）</span>`);
        } else {
            gameState.player.exp += expAmount;
            print(`<span style="color: #aaffaa;">[开发者模式] 获得 ${expAmount} 经验值，当前经验值: ${gameState.player.exp}</span>`);
            checkLevelUp();
        }
    } else {
        print(`<span style="color: #888;">用法: exp <经验值></span>`);
    }
}

// 开发者传送指令
function teleport(roomNumber) {
    const roomId = getRoomIdByNumber(roomNumber);
    if (!roomId) {
        print(`<span style="color: red;">无效的房间编号: ${roomNumber}</span>`);
        print(`<span style="color: #888;">可用编号: 1-${Object.keys(ROOM_ID_MAP).length}</span>`);
        return;
    }

    if (!gameState.world[roomId]) {
        print(`<span style="color: red;">房间数据不存在: ${roomId}</span>`);
        return;
    }

    gameState.player.location = roomId;
    print("");
    print(`<span style="color: #aaffaa;">[开发者模式] 传送到房间 #${roomNumber}: ${gameState.world[roomId].name}</span>`);
    print("");
    look();
    updateMinimap();
    updateSceneInfo();
}

// 发送命令（从输入框）
function sendCommand() {
    const input = UI.elements.cmdInput.value;
    UI.elements.cmdInput.value = '';

    if (waitingForName) {
        processNameInput(input);
        return;
    }

    processCommand(input);
}

// 处理名字输入
function processNameInput(name) {
    const trimmed = name.trim();
    if (trimmed === '') {
        gameState.player.name = '散华';
        print(`<span style="color: #e6d5a8;">你没有留下名字。从此，你便是「散华」。</span>`);
    } else {
        gameState.player.name = trimmed;
        print(`<span style="color: #e6d5a8;">「${trimmed}」——你念出了自己的名字。</span>`);
    }
    print("");

    waitingForName = false;
    if (!gameState.gameFlags) gameState.gameFlags = {};
    gameState.gameFlags.name_set = true;
    UI.elements.cmdInput.placeholder = "输入命令 (如 look, n, i)...";

    const room = gameState.world[gameState.player.location];
    showRoomInfo(room);
    updateSceneInfo();
    updateMinimap();
    StoryEngine.check();
}