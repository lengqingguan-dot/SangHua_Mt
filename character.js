// ============================================================
//  角色/NPC 数据库 - 聚合入口
//  NPC模板数据分别位于 characters/ 目录下：
//    char_mainNpcs.js   - 主要NPC (侵犯+肢解)
//    char_hostileNpcs.js - 敌对NPC (主动攻击)
//    char_generalNpcs.js - 一般NPC (和平/中立)
// ============================================================

// 全局角色模板存储（由子文件填充）
const CHARACTER_TEMPLATES = {};

// -------------------- 角色创建函数 --------------------

// 从模板创建角色实例
function createCharacterFromTemplate(templateId) {
    const template = CHARACTER_TEMPLATES[templateId];
    if (!template) {
        console.error(`角色模板 "${templateId}" 不存在！`);
        return null;
    }
    
    // 深拷贝，避免修改模板
    const character = JSON.parse(JSON.stringify(template));
    
    // 当前HP可能因战斗变化，所以单独保存初始值
    character.currentHp = character.hp;
    
    return character;
}

// 批量创建角色
function createCharactersFromTemplates(templateIds) {
    return templateIds.map(id => createCharacterFromTemplate(id)).filter(char => char !== null);
}

// -------------------- NPC 管理 --------------------

// 获取房间内的NPC
function getRoomNPCs(roomId) {
    const room = gameState.world[roomId];
    if (!room || !room.npcs) return [];
    
    return room.npcs.map(npcId => {
        // 优先从活动NPC列表中获取
        const activeNPC = gameState.activeNPCs ? gameState.activeNPCs[npcId] : null;
        if (activeNPC) return activeNPC;
        
        // 否则创建新实例
        return createCharacterFromTemplate(npcId);
    });
}

// -------------------- NPC 交互 --------------------

// 与NPC对话
function talkToNPC(npcId) {
    const npc = getRoomNPCs(gameState.player.location).find(n => n.id === npcId);
    if (!npc) {
        print("这里没有这个人。");
        return;
    }
    
    if (!npc.canTalk) {
        print(`${npc.name} 似乎不想和你说话。`);
        return;
    }
    
    // 判断是否是初次对话
    const isFirstTime = !gameState.talkedNPCs[npcId];
    
    // 选择对话数组（初次对话用dialogue，重复对话用repeatDialogue或dialogue）
    const dialogues = isFirstTime ? npc.dialogue : (npc.repeatDialogue || npc.dialogue);
    
    // 显示对话
    if (dialogues && dialogues.length > 0) {
        // 随机选择一句对话
        const randomDialogue = dialogues[Math.floor(Math.random() * dialogues.length)];
        print(`<span style="color: #ff8844;">${randomDialogue}</span>`);
    }
    
    // 标记为已对话
    if (isFirstTime) {
        gameState.talkedNPCs[npcId] = true;
    }
}

// -------------------- 战斗系统（基础框架） --------------------

// 计算角色攻击力（基础 + 装备）
function getCharacterAttack(character) {
    const baseAtk = character.atk !== undefined ? character.atk : 1;
    let equipAtk = 0;
    let atkMultiplier = 1;
    
    // 如果是玩家（有 inventory 属性），额外计算装备加成
    if (character.inventory !== undefined) {
        if (character.equipment.weapon) {
            equipAtk += character.equipment.weapon.atk || 0;
        }
        if (character.equipment.armor) {
            equipAtk += character.equipment.armor.atk || 0;
        }
        // 饰品百分比加成
        if (character.equipment.accessory) {
            if (character.equipment.accessory.atkPercent) {
                atkMultiplier += character.equipment.accessory.atkPercent;
            }
        }
    }
    
    return Math.floor((baseAtk + equipAtk) * atkMultiplier);
}

// 计算角色防御力（基础 + 装备）
function getCharacterDefense(character) {
    let baseDef = character.def !== undefined ? character.def : 0;
    let defMultiplier = 1;
    
    // 如果是玩家（有 inventory 属性），额外计算装备加成
    if (character.inventory !== undefined) {
        if (character.equipment.weapon) {
            baseDef += character.equipment.weapon.def || 0;
        }
        if (character.equipment.armor) {
            baseDef += character.equipment.armor.def || 0;
        }
        // 饰品百分比加成
        if (character.equipment.accessory) {
            if (character.equipment.accessory.defPercent) {
                defMultiplier += character.equipment.accessory.defPercent;
            }
        }
    }
    
    return Math.floor(baseDef * defMultiplier);
}

// 计算角色灵巧（基础 + 装备）
function getCharacterAgility(character) {
    let baseAgi = character.agi !== undefined ? character.agi : 0;
    
    // 如果是玩家（有 inventory 属性），额外计算装备加成
    if (character.inventory !== undefined) {
        if (character.equipment.weapon) {
            baseAgi += character.equipment.weapon.agi || 0;
        }
        if (character.equipment.armor) {
            baseAgi += character.equipment.armor.agi || 0;
        }
        if (character.equipment.accessory) {
            baseAgi += character.equipment.accessory.agi || 0;
        }
    }
    
    return Math.floor(baseAgi);
}

// 计算实际伤害（攻击力 ±60% 浮动）
// attackerEq: 攻击方装备对象（可选，用于护甲穿透）
// defenderEq: 防守方装备对象（可选，用于物理伤害减免）
function calculateDamage(baseAtk, targetDef, attackerEq, defenderEq) {
    // 攻击力随机浮动 ±60%
    const variance = 0.6;
    const randomFactor = 1 + (Math.random() * variance * 2 - variance);
    const finalAtk = Math.floor(baseAtk * randomFactor);
    
    // ★ 护甲穿透：无视目标一定比例的防御
    let effectiveDef = targetDef;
    if (attackerEq && attackerEq.weapon && attackerEq.weapon.armorPenetration) {
        effectiveDef = Math.floor(targetDef * (1 - attackerEq.weapon.armorPenetration));
    }
    
    // 伤害 = 攻击力 - 有效防御力，最小为1
    let damage = Math.max(1, finalAtk - effectiveDef);
    
    // ★ 物理伤害减免：减少受到的物理攻击伤害
    if (defenderEq && defenderEq.armor && defenderEq.armor.physicalDamageReduction) {
        damage = Math.max(1, Math.floor(damage * (1 - defenderEq.armor.physicalDamageReduction)));
    }
    
    return damage;
}

// 判断是否闪避（基于灵巧）
function tryDodge(targetAgi) {
    // 1点灵巧 = 1% 闪避概率
    const dodgeChance = targetAgi;
    const roll = Math.random() * 100;
    return roll < dodgeChance;
}

// 获取所有角色模板ID列表
function getAllCharacterTemplateIds() {
    return Object.keys(CHARACTER_TEMPLATES);
}

// 获取角色类型名称
function getCharacterTypeName(type) {
    const map = {
        npc: 'NPC',
        enemy: '敌人',
        boss: '首领'
    };
    return map[type] || type;
}