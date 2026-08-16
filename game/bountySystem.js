// ============================================================
//  game/bountySystem.js - 势力名望与悬赏系统
//  加入势力「灭绝」、查看悬赏板、接取悬赏、击杀结算
// ============================================================

const FACTION_ID = 'extinction';

// 等级阈值：达到该名望后可升到对应等级
const FACTION_LEVEL_UP_REQUIREMENTS = { 2: 10, 3: 20, 4: 50, 5: 200 };

function getFaction() {
    if (!gameState.factions) gameState.factions = {};
    if (!gameState.factions[FACTION_ID]) gameState.factions[FACTION_ID] = { joined: false, renown: 0, level: 1 };
    return gameState.factions[FACTION_ID];
}

function getBountyState() {
    if (!gameState.bountyState) gameState.bountyState = { activeBounties: [], lastShownBounties: [] };
    return gameState.bountyState;
}

function ensureBountyState() {
    const bs = getBountyState();
    if (!bs.activeBounties) bs.activeBounties = [];
    if (!bs.lastShownBounties) bs.lastShownBounties = [];
    return bs;
}

// 根据当前名望判定等级
function getFactionLevelByRenown(renown) {
    let level = 1;
    if (renown >= 200) level = 5;
    else if (renown >= 50) level = 4;
    else if (renown >= 20) level = 3;
    else if (renown >= 10) level = 2;
    return level;
}

function refreshFactionLevel() {
    const f = getFaction();
    f.level = getFactionLevelByRenown(f.renown);
}

// 加入势力「灭绝」
function joinFactionExtinction() {
    const f = getFaction();
    f.joined = true;
    f.renown = 0;
    f.level = 1;
    ensureBountyState();
}

// 当前等级可接取的星级范围
function getAvailableStars() {
    const f = getFaction();
    const map = {
        1: [1, 2],
        2: [1, 3],
        3: [2, 4],
        4: [3, 5],
        5: [3, 6]
    };
    return map[f.level] || [1, 2];
}

// 当前等级可展示的悬赏数量
function getDisplayableBountyCount() {
    const f = getFaction();
    if (f.level <= 2) return 3;
    if (f.level <= 4) return 4;
    return 5;
}

// 随机取若干可接悬赏（按星级过滤；excludeDefIds 为排除的目标定义ID）
function rollAvailableBounties(excludeDefIds = []) {
    ensureBountyState();
    const [minStar, maxStar] = getAvailableStars();
    const eligible = BOUNTY_NPCS.filter(b =>
        b.stars >= minStar && b.stars <= maxStar && !excludeDefIds.includes(b.id)
    );
    if (eligible.length === 0) return [];
    const shuffled = [...eligible].sort(() => Math.random() - 0.5);
    return shuffled.slice(0, getDisplayableBountyCount());
}

// 刷新悬赏板（消耗 1 名望）
function refreshBountyBoard() {
    const f = getFaction();
    const bs = ensureBountyState();
    // 已接取任务后不允许手动刷新（保持任务栏稳定）
    if (bs.activeBounties && bs.activeBounties.length > 0) {
        print(`<span style="color:#ff6666;">已接取任务后无法手动刷新悬赏板。</span>`);
        return;
    }
    if (f.renown < 1) {
        print(`<span style="color:#ff6666;">名望不足，无法刷新悬赏板。</span>`);
        return;
    }
    f.renown -= 1;
    refreshFactionLevel();
    bs.lastShownBounties = rollAvailableBounties();
    showBountyBoard();
}

// 悬赏目标可出现的房间池
const BOUNTY_ROOM_POOL = [
    'residence_w1', 'residence_w2', 'residence_w3',
    'slum_west_n1', 'slum_west_n2', 'slum_west_n3',
    'town_road_w1', 'town_road_w2', 'town_road_w3',
    'town_road_e1', 'town_road_e2', 'town_road_e3',
    'town_road_n1', 'town_road_n2', 'town_road_n3',
    'town_square', 'center_street_1', 'center_street_2', 'center_street_3'
];

// 接取悬赏：实例化NPC并随机刷新到房间，返回是否成功
function acceptBounty(bountyDef) {
    ensureBountyState();
    // 一次只能接取一个势力任务
    if (gameState.bountyState.activeBounties && gameState.bountyState.activeBounties.length > 0) {
        print(`<span style="color:#ff6666;">你已有一个进行中的势力任务，完成后方可接取新任务。</span>`);
        return false;
    }
    const npcId = spawnBountyNpc(bountyDef);
    if (!npcId) return false;

    const roomIds = BOUNTY_ROOM_POOL.filter(id => gameState.world[id]);
    const roomId = roomIds[Math.floor(Math.random() * roomIds.length)];
    if (!roomId) return false;

    const room = gameState.world[roomId];
    if (!room.npcs) room.npcs = [];
    room.npcs.push(npcId);

    gameState.bountyState.activeBounties.push({
        id: `${bountyDef.id}_${Date.now()}`,
        defId: bountyDef.id,
        npcId,
        roomId,
        stars: bountyDef.stars,
        name: bountyDef.name
    });

    return true;
}

// 击杀悬赏目标后结算名望
function completeBountyByNpcId(npcId) {
    const bs = ensureBountyState();
    const idx = bs.activeBounties.findIndex(b => b.npcId === npcId);
    if (idx === -1) return false;

    const bounty = bs.activeBounties[idx];
    bs.activeBounties.splice(idx, 1);

    const f = getFaction();
    const reward = BOUNTY_REWARDS[bounty.stars] || 1;
    f.renown += reward;
    refreshFactionLevel();

    print(`<span style="color:#ffdd44;">✅ 已完成势力悬赏「${bounty.name}」，灭绝名望 +${reward}（当前名望 ${f.renown}，等级 ${f.level}）。</span>`);
    return true;
}

// 打开悬赏板
function showBountyBoard() {
    const f = getFaction();
    if (!f.joined) {
        print(`<span style="color:#888;">你并未加入任何势力，悬赏板上的字迹模糊难辨。</span>`);
        return;
    }

    ensureBountyState();
    if (!gameState.bountyState.lastShownBounties || gameState.bountyState.lastShownBounties.length === 0) {
        gameState.bountyState.lastShownBounties = rollAvailableBounties();
    }

    clearDetailPanel();
    currentPanel = null;

    let html = makeTitle('📜 悬赏板');
    html += `<div style="text-align:center;color:#c3b38d;">灭绝势力  |  名望：${f.renown}  |  等级：${f.level}</div>\n`;
    html += `<div style="color:#888;">等级 ${f.level} 可接星级 ${getAvailableStars()[0]}~${getAvailableStars()[1]}，本板展示 ${getDisplayableBountyCount()} 个悬赏。</div>\n`;
    html += centerLine();

    const hasActive = gameState.bountyState.activeBounties && gameState.bountyState.activeBounties.length > 0;
    if (hasActive) {
        html += `<div style="color:#ffaa66;">你已有一个进行中的势力任务，完成后方可接取新任务。</div>\n`;
    }
    const bounties = gameState.bountyState.lastShownBounties;
    if (bounties.length === 0) {
        html += `<div style="color:#888;">暂时没有可接取的悬赏，可以尝试刷新。</div>\n`;
    } else {
        bounties.forEach(bounty => {
            const btn = hasActive
                ? `<span style="color:#888;">📋 接取</span>`
                : `<span style="color:#ffaa00;cursor:pointer;text-decoration:underline;" onclick="acceptBountyFromBoard('${bounty.id}')">📋 接取</span>`;
            html += `<div style="margin:6px 0;">⭐${bounty.stars} ${bounty.name}　${btn}</div>\n`;
        });
    }

    html += centerLine();
    html += `<div><span style="color:#6688ff;cursor:pointer;text-decoration:underline;" onclick="refreshBountyBoard()">↩️ 刷新（1名望）</span></div>\n`;
    html += `<div><span style="color:#aaa;cursor:pointer;" onclick="clearDetailPanel()">↩️ 返回</span></div>\n`;
    UI.setDetail(html);
    currentPanel = 'bounty_board';
}

// 读档后恢复悬赏NPC实例（房间引用 NPC 而模板缺失时，从基础模板重新克隆注册）
function restoreBountyNpcs() {
    const bs = ensureBountyState();
    if (!bs.activeBounties || bs.activeBounties.length === 0) return;
    bs.activeBounties.forEach(bounty => {
        if (!bounty.npcId || CHARACTER_TEMPLATES[bounty.npcId]) return;
        const def = getBountyDef(bounty) || BOUNTY_NPCS.find(b => b.id === bounty.defId);
        if (!def) return;
        const base = CHARACTER_TEMPLATES[def.id];
        if (!base) return;
        const template = JSON.parse(JSON.stringify(base));
        template.id = bounty.npcId;
        template.name = bounty.name || def.name;
        CHARACTER_TEMPLATES[bounty.npcId] = template;
    });
}

// 根据悬赏记录查找基础定义（按 defId，其次按 stars+name 兜底）
function getBountyDef(bounty) {
    if (!bounty) return null;
    if (bounty.defId) return BOUNTY_NPCS.find(b => b.id === bounty.defId) || null;
    return BOUNTY_NPCS.find(b => b.stars === bounty.stars && b.name === bounty.name) || null;
}

// 从面板点击「接取」
function acceptBountyFromBoard(bountyDefId) {
    const bs = ensureBountyState();
    if (bs.activeBounties && bs.activeBounties.length > 0) {
        print(`<span style="color:#ff6666;">你已有一个进行中的势力任务，完成后方可接取新任务。</span>`);
        return;
    }
    const bountyDef = BOUNTY_NPCS.find(b => b.id === bountyDefId);
    if (!bountyDef) { print("悬赏已失效。"); return; }

    if (acceptBounty(bountyDef)) {
        print(`<span style="color:#ffaa66;">你接取了悬赏「${bountyDef.name}」。目标已潜藏在镇子的某个角落。</span>`);
        // 接取后按照规则从任务池刷新新的悬赏板（排除已接取目标）
        bs.lastShownBounties = rollAvailableBounties([bountyDefId]);
        showBountyBoard();
    } else {
        print("接取失败，请重试。");
    }
}