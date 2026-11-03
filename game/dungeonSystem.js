// ============================================================
//  game/dungeonSystem.js - 随机地下城结构与出入口
//  六处副本共用平面网格：一间入口、十至十五间普通房、一间首领房。
// ============================================================

const DUNGEON_DEFINITIONS = {
    academy_ruins: {
        id: 'academy_ruins',
        name: '学院遗址',
        roomName: '暗道',
        bossRoomName: '密室',
        entranceRoom: 'mysterious_stone_gate',
        roomPrefix: 'academy_dungeon_'
    }
};

EXPLORATION_DEFINITIONS.forEach(def => {
    if (!def || def.number===5) return;
    DUNGEON_DEFINITIONS[def.id]={id:def.id,name:def.name,entranceRoom:def.anchor,roomPrefix:`explore_${def.id}_`};
});

const DUNGEON_DIRECTIONS = ['north', 'east', 'south', 'west'];
const DUNGEON_OPPOSITE = { north: 'south', east: 'west', south: 'north', west: 'east' };
const DUNGEON_STEPS = {north:{x:0,y:-1},east:{x:1,y:0},south:{x:0,y:1},west:{x:-1,y:0}};
const DUNGEON_LAYOUT_VERSION = 'spatial_grid_v2';

function shuffledDungeonDirections() {
    const result = [...DUNGEON_DIRECTIONS];
    for (let i = result.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [result[i], result[j]] = [result[j], result[i]];
    }
    return result;
}

function clearGeneratedDungeon(dungeonId = 'academy_ruins') {
    const def = DUNGEON_DEFINITIONS[dungeonId];
    if (!def || !gameState.world) return;
    Object.keys(gameState.world).forEach(roomId => {
        if (roomId.startsWith(def.roomPrefix)) delete gameState.world[roomId];
    });
    if (gameState.activeDungeon && gameState.activeDungeon.id === dungeonId) {
        delete gameState.activeDungeon;
    }
}

function connectDungeonRooms(rooms, fromId, toId) {
    const from = rooms[fromId];
    const to = rooms[toId];
    if(!from?.dungeonPosition || !to?.dungeonPosition) return false;
    const dx=to.dungeonPosition.x-from.dungeonPosition.x, dy=to.dungeonPosition.y-from.dungeonPosition.y;
    const direction=DUNGEON_DIRECTIONS.find(dir=>DUNGEON_STEPS[dir].x===dx && DUNGEON_STEPS[dir].y===dy);
    if (!direction) return false;
    if(from.exits[direction] || to.exits[DUNGEON_OPPOSITE[direction]]) return false;
    from.exits[direction] = toId;
    to.exits[DUNGEON_OPPOSITE[direction]] = fromId;
    return true;
}

function buildDungeonGrid(normalRoomCount, bossDistance) {
    const key=p=>`${p.x},${p.y}`, path=[{x:0,y:0}], occupied=new Set(['0,0']);
    let attempts=0;
    function growMainPath() {
        if(path.length===bossDistance+1) return true;
        if(++attempts>2000) return false;
        const current=path[path.length-1];
        for(const dir of shuffledDungeonDirections()) {
            const step=DUNGEON_STEPS[dir], next={x:current.x+step.x,y:current.y+step.y};
            if(occupied.has(key(next))) continue;
            occupied.add(key(next));path.push(next);
            if(growMainPath()) return true;
            path.pop();occupied.delete(key(next));
        }
        return false;
    }
    if(!growMainPath()) {
        path.splice(0,path.length,...Array.from({length:bossDistance+1},(_,x)=>({x,y:0})));
        occupied.clear();path.forEach(p=>occupied.add(key(p)));
    }
    // path 包含入口和首领；普通房的剩余配额成为岔路，绝不与已有坐标重叠。
    const boss=path[path.length-1], positions=path.slice(0,-1), links=[];
    for(let i=1;i<positions.length;i++) links.push([i-1,i]);
    const bossParent=positions.length-1;
    while(positions.length<normalRoomCount+1) {
        const candidates=[];
        const firstBranch=positions.length===bossDistance;
        positions.forEach((p,index)=>{
            if(firstBranch && (index===0 || index===bossParent)) return;
            for(const dir of DUNGEON_DIRECTIONS) {
                const step=DUNGEON_STEPS[dir], next={x:p.x+step.x,y:p.y+step.y};
                if(!occupied.has(key(next))) candidates.push({parent:index,next});
            }
        });
        if(!candidates.length) throw new Error('地下城没有可用的支路坐标');
        const chosen=candidates[Math.floor(Math.random()*candidates.length)];
        links.push([chosen.parent,positions.length]);positions.push(chosen.next);occupied.add(key(chosen.next));
    }
    links.push([bossParent,positions.length]);positions.push(boss);
    return {positions,links};
}

function setDungeonRoomScenery(room, def, type) {
    const scenery=def.scenery;
    room.dungeonRoomType=type;
    room.name=type==='initial' ? `${def.name} · 入口` : type==='boss' ? scenery.bossRoom[0] : scenery.normalRoom[0];
    room.desc=type==='initial' ? scenery.entry : type==='boss' ? scenery.bossRoom[1] : scenery.normalRoom[1];
}

function arrangeDungeonRooms(dungeon) {
    const normalIds=dungeon.roomIds.filter(id=>id!==dungeon.entryRoomId && id!==dungeon.bossRoomId);
    const ordered=[dungeon.entryRoomId,...normalIds,dungeon.bossRoomId];
    const distance=10+Math.floor(Math.random()*(Math.min(12,normalIds.length)-9));
    const grid=buildDungeonGrid(normalIds.length,distance), rooms={};
    ordered.forEach((id,index)=>{
        const room=gameState.world[id];
        room.dungeonPosition={...grid.positions[index]};room.exits={};rooms[id]=room;
    });
    for(const [a,b] of grid.links) {
        if(!connectDungeonRooms(rooms,ordered[a],ordered[b])) throw new Error('地下城空间连接失败');
    }
    dungeon.bossDistance=getDungeonDistance(rooms,dungeon.entryRoomId,dungeon.bossRoomId);
    dungeon.normalRoomCount=normalIds.length;
    dungeon.layoutVersion=DUNGEON_LAYOUT_VERSION;
    dungeon.roomIds=ordered;
    if(!validateDungeonGrid(dungeon)) throw new Error('地下城空间或房间数量校验失败');
}

function validateDungeonGrid(dungeon, world=gameState.world) {
    if(!dungeon?.roomIds || new Set(dungeon.roomIds).size!==dungeon.roomIds.length) return false;
    const ids=new Set(dungeon.roomIds), positions=new Set();
    if(!ids.has(dungeon.entryRoomId) || !ids.has(dungeon.bossRoomId) || dungeon.entryRoomId===dungeon.bossRoomId) return false;
    if(ids.size<12 || ids.size>17) return false;
    for(const id of ids) {
        const room=world[id],p=room?.dungeonPosition;
        if(!p || !Number.isInteger(p.x) || !Number.isInteger(p.y) || positions.has(`${p.x},${p.y}`)) return false;
        positions.add(`${p.x},${p.y}`);
        for(const [dir,to] of Object.entries(room.exits || {})) {
            const step=DUNGEON_STEPS[dir],target=world[to]?.dungeonPosition;
            if(!step || !ids.has(to) || !target || target.x!==p.x+step.x || target.y!==p.y+step.y || world[to].exits[DUNGEON_OPPOSITE[dir]]!==id) return false;
        }
    }
    const queue=[dungeon.entryRoomId],seen=new Set(queue);
    for(let i=0;i<queue.length;i++) Object.values(world[queue[i]].exits).forEach(id=>{if(!seen.has(id)){seen.add(id);queue.push(id)}});
    const distance=getDungeonDistance(world,dungeon.entryRoomId,dungeon.bossRoomId);
    return seen.size===ids.size && distance>=10 && distance<=12;
}

function getDungeonDistance(rooms, startId, targetId) {
    const queue = [{ id: startId, distance: 0 }];
    const visited = new Set([startId]);
    while (queue.length > 0) {
        const current = queue.shift();
        if (current.id === targetId) return current.distance;
        Object.values(rooms[current.id].exits || {}).forEach(nextId => {
            if (!visited.has(nextId)) {
                visited.add(nextId);
                queue.push({ id: nextId, distance: current.distance + 1 });
            }
        });
    }
    return Infinity;
}

function generateDungeon(dungeonId = 'academy_ruins') {
    const config=DUNGEON_DEFINITIONS[dungeonId], def=explorationDef(dungeonId);
    if(!config || !def) throw new Error(`未知地下城：${dungeonId}`);
    clearGeneratedDungeon(dungeonId);
    const normalRoomCount=10+Math.floor(Math.random()*6), academy=def.number===5;
    const entryRoomId=`${config.roomPrefix}${academy?1:0}`, bossRoomId=`${config.roomPrefix}boss`;
    const normalIds=Array.from({length:normalRoomCount},(_,index)=>`${config.roomPrefix}${index+(academy?2:1)}`);
    const roomIds=[entryRoomId,...normalIds,bossRoomId];
    roomIds.forEach((id,index)=>{
        const type=index===0?'initial':id===bossRoomId?'boss':'normal';
        const room={exits:{},items:[],npcs:[],generatedDungeon:true,dungeonId,isDungeonBossRoom:type==='boss'};
        setDungeonRoomScenery(room,def,type);
        if(type==='boss') room.npcs=[academy?'mad_female_mage':`expedition_${def.number}_boss`];
        else if(type==='normal') {
            const roll=Math.random(), count=index===1?1:roll<.35?0:roll<.85?1:2;
            room.npcs=Array.from({length:count},()=>academy?'female_mage':`expedition_${def.number}_enemy`);
        }
        gameState.world[id]=room;
    });
    if(academy) gameState.world[entryRoomId].items.push('academy_dungeon_return_gate');
    const dungeon={id:dungeonId,name:def.name,entranceRoom:config.entranceRoom,entryRoomId,bossRoomId,
        roomIds,enemyContentVersion:1,sceneryVersion:2};
    arrangeDungeonRooms(dungeon);
    gameState.activeDungeon=dungeon;
    return dungeon;
}

// 修复已保存的旧空间连接，原房间ID、当前位置、尸体、战斗和已击败敌人全部保留。
function repairDungeonGrid(dungeon) {
    if(!dungeon || dungeon.layoutVersion===DUNGEON_LAYOUT_VERSION && validateDungeonGrid(dungeon)) return false;
    const def=explorationDef(dungeon.id);
    if(!def || !dungeon.roomIds?.every(id=>gameState.world[id])) return false;
    let normalIds=dungeon.roomIds.filter(id=>id!==dungeon.entryRoomId && id!==dungeon.bossRoomId);
    // 旧短副本补足十间普通房；新增房间为空，不重刷正在进行的战斗或已结算的奖励。
    for(let i=normalIds.length;i<10;i++) {
        let id=`${DUNGEON_DEFINITIONS[def.id].roomPrefix}grid_${i}`;
        while(gameState.world[id]) id+='_';
        gameState.world[id]={items:[],npcs:[],exits:{},generatedDungeon:true,dungeonId:def.id};
        normalIds.push(id);
    }
    dungeon.roomIds=[dungeon.entryRoomId,...normalIds,dungeon.bossRoomId];
    arrangeDungeonRooms(dungeon);
    dungeon.sceneryVersion=0;
    return true;
}

function repairLoadedAcademyDungeon() {
    const dungeon = gameState.activeDungeon;
    if (!dungeon || dungeon.id !== 'academy_ruins' || dungeon.enemyContentVersion >= 1) return;
    (dungeon.roomIds || []).forEach(roomId => {
        const room = gameState.world[roomId];
        if (!room) return;
        if (roomId === dungeon.bossRoomId) {
            if (!room.npcs.includes('mad_female_mage') && !room.items.includes('academy_dungeon_exit')) {
                room.npcs.push('mad_female_mage');
            }
            return;
        }
        const spawnRoll = Math.random();
        const enemyCount = spawnRoll < 0.45 ? 0 : (spawnRoll < 0.85 ? 1 : 2);
        for (let i = 0; i < enemyCount; i++) room.npcs.push('female_mage');
    });
    dungeon.enemyContentVersion = 1;
}

function enterAcademyRuins() {
    if (typeof enterExploration === 'function') return enterExploration('academy_ruins');
    clearDetailPanel();
    currentPanel = null;
    const dungeon = generateDungeon('academy_ruins');
    if (!gameState.gameFlags) gameState.gameFlags = {};
    gameState.gameFlags.academyDungeonEntered = true;
    relocateTo(dungeon.entryRoomId, {
        travelText: '你侧身穿过大石门，踏入被黑暗吞没的学院遗址。',
        callback: () => {
            if (typeof checkHostileNPCs === 'function') checkHostileNPCs(dungeon.entryRoomId);
            if (typeof StoryEngine !== 'undefined') StoryEngine.check();
        }
    });
}

function unlockAcademyDungeonExit() {
    const dungeon = gameState.activeDungeon;
    if (!dungeon || dungeon.id !== 'academy_ruins') return false;
    const bossRoom = gameState.world[dungeon.bossRoomId];
    if (!bossRoom) return false;
    if (!bossRoom.items.includes('academy_dungeon_exit')) bossRoom.items.push('academy_dungeon_exit');
    return true;
}

function leaveAcademyDungeon() {
    if (typeof leaveExploration === 'function') return leaveExploration();
    const entranceRoom = gameState.activeDungeon?.entranceRoom || 'mysterious_stone_gate';
    clearDetailPanel();
    currentPanel = null;
    relocateTo(entranceRoom, {
        skipCheck: true,
        travelText: '你沿着石门后的通道折返，重新回到荒地深处。',
        callback: () => {
            clearGeneratedDungeon('academy_ruins');
            if (typeof StoryEngine !== 'undefined') StoryEngine.check();
        }
    });
}
