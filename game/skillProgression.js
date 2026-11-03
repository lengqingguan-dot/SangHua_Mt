// 学习记录和装备条件分离；升级只消费同阶研习册。
function itemTemplateId(item) {
    if (!item) return '';
    if (item.templateId) return item.templateId;
    if (ITEM_TEMPLATES[item.id]?.templateId) return ITEM_TEMPLATES[item.id].templateId;
    const staticIds = typeof ORIGINAL_TEMPLATE_IDS !== 'undefined' ? [...ORIGINAL_TEMPLATE_IDS] : Object.keys(ITEM_TEMPLATES);
    if (staticIds.includes(item.id)) return item.id;
    return staticIds.filter(id => item.id?.startsWith(id + '_') || item.id?.startsWith('drop_' + id + '_')).sort((a,b) => b.length-a.length)[0] || item.id;
}
function ensureSkillProgress(player = gameState.player) {
    if (!player.skillProgress) {
        player.skillProgress = {};
        (player.skills || []).forEach(id => { player.skillProgress[id] = {level:1,learnedSource:'legacy'}; });
    }
    player.skills = [...new Set([...(player.skills || []), ...Object.keys(player.skillProgress)])];
    return player.skillProgress;
}
function skillLevel(id) { const level = Number(ensureSkillProgress()[id]?.level); return Number.isFinite(level) ? Math.max(0, Math.min(5,Math.floor(level))) : 0; }
function skillSpCost(id, level = skillLevel(id)) { return id === 'hatred' ? [10,10,9,9,8][Math.max(0,Math.min(4,level-1))] : skills[id].cost; }
function weaponCategory(item = gameState.player.equipment.weapon) {
    return item?.weaponCategory || ITEM_TEMPLATES[itemTemplateId(item)]?.weaponCategory || '';
}
function addRewardItems(id, count = 1) {
    if (!ITEM_TEMPLATES[id] || !Number.isInteger(count) || count < 1) return false;
    for (let i=0; i<count; i++) gameState.player.inventory.push(createItemFromTemplate(id));
    return true;
}
function bookCount(id) { return gameState.player.inventory.filter(item => itemTemplateId(item) === id).length; }
function consumeBooks(id, count) {
    if (!Number.isInteger(count) || count < 1 || bookCount(id) < count) return false;
    for (let i=gameState.player.inventory.length-1; i>=0 && count; i--) {
        if (itemTemplateId(gameState.player.inventory[i]) === id) { gameState.player.inventory.splice(i,1); count--; }
    }
    return true;
}
function sellSkillBookFromDetail(id) {
    if (battleState.inBattle) return false;
    const index=gameState.player.inventory.findIndex(item=>item.id===id && item.type==='skill_book');
    if(index<0) return false;
    const item=gameState.player.inventory[index];
    if(!Number.isFinite(item.sellPrice) || !confirm(`确认出售${item.name}，获得 ${item.sellPrice} 金币？`)) return false;
    gameState.player.inventory.splice(index,1);
    gameState.player.gold=(gameState.player.gold || 0)+item.sellPrice;
    showInventoryPanel(); return true;
}
function useSkillBookFromInventory(itemId, convert = false) {
    const item = gameState.player.inventory.find(item => item.id === itemId && item.type === 'skill_book');
    if (!item?.skillId || itemTemplateId(item) !== `book_${item.skillId}`) return false;
    return learnSkillFromBook(item.skillId, convert, item);
}
function learnSkillFromBook(id, convert = false, selectedBook = null) {
    const skill = PLAYER_SKILL_DEFINITIONS[id];
    if (battleState.inBattle || !skill || !bookCount(`book_${id}`)) return false;
    const progress = ensureSkillProgress();
    // 从物品详情使用时消费所点的那一本，不误删另一动态实例。
    const consumeOriginal = () => {
        if (!selectedBook) return consumeBooks(`book_${id}`,1);
        const index = gameState.player.inventory.indexOf(selectedBook);
        if (index < 0 || itemTemplateId(selectedBook) !== `book_${id}`) return false;
        gameState.player.inventory.splice(index,1); return true;
    };
    if (progress[id]) {
        if (!convert || !confirm(`将《${skill.name}》转为同阶研习册 ×1？`)) return false;
        if (!consumeOriginal()) return false;
        addRewardItems(`training_book_${skill.rarity}`);
    } else {
        if (convert || gameState.player.level < skill.learnLevel) { print('等级不足，原典未消耗。'); return false; }
        if (!consumeOriginal()) return false;
        progress[id] = {level:1,learnedSource:'book'};
        gameState.player.skills.push(id);
        print(`学会了「${skill.name}」Lv.1！可通过下方「技能」按钮查看详情和升级。`);
    }
    showInventoryCategory('skill_book'); return true;
}
function upgradeLearnedSkill(id, expectedLevel) {
    const skill = PLAYER_SKILL_DEFINITIONS[id], level = skillLevel(id);
    if (battleState.inBattle || !skill || !level || level >= 5 || expectedLevel !== level) return false;
    const cost = SKILL_UPGRADE_COSTS[skill.rarity][level-1];
    if (!consumeBooks(`training_book_${skill.rarity}`,cost)) { print('同阶研习册不足。'); return false; }
    gameState.player.skillProgress[id].level++;
    print(`${skill.name}升至 Lv.${level+1}，消耗${cost}本研习册。`);
    showSkillDetail(id); return true;
}
function skillEffectText(id, level = Math.max(1,skillLevel(id))) {
    const s = PLAYER_SKILL_DEFINITIONS[id];
    if (id === 'hatred') return '本场基础攻击 ×2、防御 ×0.5、灵巧归零；每战一次';
    if (id === 'player_vow') return `本场基础防御 +${20+2*(level-1)}%；每战一次`;
    let text = `普通伤害 ×${(s.multiplier*(1+.1*(level-1))).toFixed(2)}`;
    if (s.debuff) text += `；敌${s.debuff === 'atk' ? '攻击' : '防御'} -${s.reduction*100}%，2次行动`;
    if (s.penetration) text += '；本次穿透 +15%（总上限50%）';
    if (id === 'judgment_cut') text += '；目标HP≤30%时额外×1.15';
    if (id === 'exploit_opening') text += '；目标有减益时额外×1.15';
    if (id === 'player_sacrifice') text += '；灵巧低于目标时自损当前HP的10%';
    return text;
}
function migrateProgression029(state, version) {
    const p = state.player;
    ensureSkillProgress(p);
    // 仇恨是开局技能；此前测试版未学习、仅持有原典的存档也直接补会。
    p.skillProgress.hatred ||= {level:1,learnedSource:'initial'};
    ensureSkillProgress(p);
    state.gameFlags ||= {};
    if (version < 4 && !state.gameFlags.skillMigration029) {
        const items = [...(p.inventory || []), ...Object.values(p.equipment || {})].map(itemTemplateId);
        const fullSet = items.some(id=>['knight_greatsword','crafted_knight_greatsword'].includes(id)) && items.some(id=>['knight_armor','crafted_knight_armor'].includes(id)) && items.includes('knight_emblem');
        if (fullSet || p.skills.some(id=>['player_vow','player_sacrifice'].includes(id))) {
            ['player_vow','player_sacrifice'].forEach(id => { p.skillProgress[id] ||= {level:1,learnedSource:'legacy-knight'}; });
        }
        if (fullSet) state.gameFlags.knightSupplyClaimed = true;
        state.gameFlags.skillMigration029 = true;
        ensureSkillProgress(p);
    }
}

// 临时效果从当前基础属性派生，不回写永久数值。
function playerBattleStat(value, key) {
    if (!battleState.inBattle) return value;
    const buffs = battleState.playerEffects || {};
    if (buffs.hatred) { if (key==='atk') value*=2; if(key==='def') value*=.5; if(key==='agi') return 0; }
    if (buffs.vow && key==='def') value*=1+buffs.vow;
    return value;
}
function effectiveEnemyStat(enemy, key) {
    let value = enemy[key] || 0;
    const effect = enemy.statusEffects?.[key];
    if (effect?.remaining > 0) value *= 1-effect.reduction;
    const support = enemy.supportBuff;
    if (support?.remaining > 0 && support.key===key) value*=1.15;
    return Math.max(0,Math.floor(value));
}
function tickEnemyEffects(enemy, versions) {
    Object.entries(enemy.statusEffects || {}).forEach(([key,effect])=> {
        if(effect.remaining>0 && (!versions || versions[key]===effect.generation)) effect.remaining--;
    });
    if (enemy.supportBuff?.remaining > 0 && (!versions || versions.support===enemy.supportBuff.generation)) enemy.supportBuff.remaining--;
}
function playerSkillFailure(id) {
    const s = skills[id];
    if (!battleState.inBattle) return '仅能在战斗中使用';
    if (battleState.paused) return '战斗暂时暂停';
    if (battleState.roundReady === false) return '回合准备中';
    if (!s || s.npcOnly || !skillLevel(id)) return '尚未学习';
    if (s.requireKnightSet && !hasKnightSetBonus()) return '需要骑士三件套';
    if (s.categories && !s.categories.includes(weaponCategory())) return `需要${s.categories.map(x=>WEAPON_CATEGORIES[x]).join('／')}`;
    const gripCount = gameState.player.functionalGripChains;
    const required = ['greatsword','mining_tool','blunt'].includes(weaponCategory()) ? 2 : 1;
    if (s.categories && Number.isFinite(gripCount) && gripCount < required) return `需要${required}条可用持握链`;
    if ((s.self ? battleState.auxiliaryUsed : battleState.attackUsed)) return '本回合行动已用';
    if (s.once && battleState.usedSkills?.[id]) return '本场已使用';
    if ((battleState.skillReadyRounds?.[id] || 0)>battleState.round) return '技能冷却中';
    if (gameState.player.sp < skillSpCost(id)) return 'SP 不足';
    const target = resolvePlayerTarget();
    if (!s.self && !target) return '没有有效目标';
    if (id==='player_sacrifice' && getCharacterAgility(gameState.player)<target.agi && gameState.player.hp<=Math.max(1,Math.floor(gameState.player.hp*.1))) return '自损将致死';
    return '';
}
function useLearnedCombatSkill(id) {
    const reason = playerSkillFailure(id);
    if (reason) { print(reason); return false; }
    const s = skills[id], p = gameState.player, target = resolvePlayerTarget();
    const lv = skillLevel(id);
    p.sp -= skillSpCost(id);
    if (s.self) battleState.auxiliaryUsed=true; else battleState.attackUsed=true;
    (battleState.usedSkills ||= {})[id] = true;
    (battleState.skillReadyRounds ||= {})[id] = battleState.round+(s.cooldown || 0);
    print(`<span style="color:#ffcc66;">你发动了技能「${s.name}」！</span>`);
    if (id==='hatred') (battleState.playerEffects ||= {}).hatred=true;
    else if (id==='player_vow') (battleState.playerEffects ||= {}).vow=.2+.02*(lv-1);
    else {
        if (id==='player_sacrifice' && getCharacterAgility(p)<target.agi) p.hp-=Math.max(1,Math.floor(p.hp*.1));
        if (tryDodge(target.agi)) print(`${s.name}被${target.name}闪避！`);
        else {
            const eq = { ...p.equipment, weapon: {...p.equipment.weapon} };
            if (s.penetration) eq.weapon.armorPenetration=Math.min(.5,(eq.weapon.armorPenetration || 0)+s.penetration);
            let multiplier=s.multiplier*(1+.1*(lv-1));
            if (id==='judgment_cut' && target.currentHp<=target.maxHp*.3) multiplier*=1.15;
            if (id==='exploit_opening' && Object.values(target.statusEffects || {}).some(e=>e.remaining>0)) multiplier*=1.15;
            const damage=Math.max(1,Math.floor(calculateDamage(getCharacterAttack(p),effectiveEnemyStat(target,'def'),eq,null)*multiplier));
            _applyDamageToUnit(target,damage,false,null,battleState.roomId);
            print(`${s.name} → ${target.name}：${damage}点伤害。`);
            if (s.debuff && !target._dead) {
                target.statusEffects ||= {};
                const old=target.statusEffects[s.debuff];
                if (!old || old.remaining<=0 || old.reduction<=s.reduction) target.statusEffects[s.debuff]={reduction:s.reduction,remaining:2,generation:(old?.generation || 0)+1};
            }
        }
    }
    _afterSkillResolution();
    if (battleState.inBattle) UI.setDetail(renderBattleDetail());
    return true;
}
