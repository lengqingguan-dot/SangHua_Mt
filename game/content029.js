// 0.2.9 的静态内容。普通脚本加载，无运行时网络或导表依赖。
const SKILL_UPGRADE_COSTS = {
    normal: [1, 2, 3, 4], good: [2, 3, 4, 6], rare: [2, 4, 6, 8],
    epic: [3, 5, 8, 12], legendary: [4, 8, 12, 16], mythic: [6, 10, 16, 24]
};
const WEAPON_CATEGORIES = { dagger: '短刃', sword: '单手剑', cleaver: '砍刀', blunt: '钝器', mining_tool: '矿具', greatsword: '大剑' };
const ORIGINAL_WEAPON_CATEGORIES = {
    pickaxe: 'mining_tool', kitchen_knife: 'cleaver', fruit_knife: 'dagger', rusty_sword: 'sword',
    iron_stick: 'blunt', knight_greatsword: 'greatsword', crafted_knight_greatsword: 'greatsword'
};
Object.entries(ORIGINAL_WEAPON_CATEGORIES).forEach(([id, category]) => {
    if (ITEM_TEMPLATES[id]) ITEM_TEMPLATES[id].weaponCategory = category;
});
const UPDATE029_EQUIPMENT = [
    ['pit_pick','修整矿镐','weapon','mining_tool','good',5,0,-1,0,1],
    ['work_cleaver','工棚砍刀','weapon','cleaver','normal',5,0,0,0,1],
    ['patched_workcoat','补缀工装','armor','', 'normal',0,3,0,0,1],
    ['miners_lamp','矿灯挂坠','accessory','', 'normal',0,0,1,0,1],
    ['hunt_dagger','猎用短刀','weapon','dagger','good',5,0,3,0,2],
    ['ranger_sword','巡林剑','weapon','sword','good',7,0,2,0,2],
    ['ranger_leather','巡林皮衣','armor','','good',0,4,1,0,2],
    ['ranger_charm','林路护符','accessory','','good',0,0,2,0,2],
    ['drill_greatsword','演武大剑','weapon','greatsword','rare',10,0,-1,0,3],
    ['training_mace','演武重锤','weapon','blunt','rare',9,0,-1,0,3],
    ['drill_mail','演武链甲','armor','','rare',0,7,-1,0,3],
    ['drill_badge','演武徽牌','accessory','','rare',0,2,1,0,3],
    ['smuggler_dagger','暗巷短刃','weapon','dagger','rare',7,0,4,0,4],
    ['hooked_cleaver','钩背砍刀','weapon','cleaver','rare',8,0,1,0,4],
    ['smuggler_coat','暗巷轻衣','armor','','rare',0,5,2,0,4],
    ['smuggler_ring','巧战指环','accessory','','rare',2,0,0,0,4],
    ['sentinel_sword','遗址守卫剑','weapon','sword','rare',9,0,2,0,5],
    ['inscribed_pick','铭纹破障镐','weapon','mining_tool','rare',9,0,-1,.1,5],
    ['archive_coat','档案员长衣','armor','','rare',0,6,1,0,5],
    ['sentinel_plate','遗址卫甲','armor','','rare',0,9,-2,0,5],
    ['penitent_greatsword','戒律大剑','weapon','greatsword','epic',13,0,-2,.15,6],
    ['bell_mace','鸣钟重锤','weapon','blunt','epic',12,0,-1,.15,6],
    ['penitent_plate','戒律重甲','armor','','epic',0,11,-2,0,6],
    ['pilgrim_coat','远行者长衣','armor','','epic',0,8,2,0,6]
];
UPDATE029_EQUIPMENT.forEach(([id,name,type,weaponCategory,rarity,atk,def,agi,armorPenetration,source]) => {
    ITEM_TEMPLATES[id] = { id, templateId: id, name, type, slot: type, equipable: true,
        weaponCategory, rarity, atk, def, agi, armorPenetration, sourceDungeon: source,
        sellPrice: {normal:5,good:10,rare:20,epic:35}[rarity],
        desc: `副本 D${source} 的战利品。攻击 ${atk}，防御 ${def}，灵巧 ${agi}${armorPenetration ? `，穿透 ${armorPenetration*100}%` : ''}。不授予技能。` };
});
const PLAYER_SKILL_DEFINITIONS = {
    quick_stab: {name:'迅刺',rarity:'normal',learnLevel:1,categories:['dagger'],cost:2,cooldown:1,multiplier:1.05,source:1},
    steady_cut: {name:'稳斩',rarity:'normal',learnLevel:1,categories:['sword','cleaver'],cost:2,cooldown:1,multiplier:1.10,source:1},
    heavy_bash: {name:'沉击',rarity:'good',learnLevel:3,categories:['blunt'],cost:4,cooldown:2,multiplier:1.20,debuff:'atk',reduction:.10,source:2},
    armor_pick: {name:'凿甲',rarity:'good',learnLevel:3,categories:['mining_tool'],cost:4,cooldown:2,multiplier:1.05,debuff:'def',reduction:.15,source:2},
    heavy_cut: {name:'重斩',rarity:'good',learnLevel:4,categories:['greatsword'],cost:5,cooldown:2,multiplier:1.45,source:2},
    exploit_opening: {name:'乘隙',rarity:'rare',learnLevel:6,categories:['dagger','sword'],cost:6,cooldown:2,multiplier:1.20,source:4},
    sundering_strike: {name:'裂甲击',rarity:'rare',learnLevel:6,categories:['greatsword','mining_tool'],cost:7,cooldown:3,multiplier:1.35,penetration:.15,source:5},
    suppressing_blow: {name:'压制打击',rarity:'rare',learnLevel:6,categories:['blunt'],cost:6,cooldown:3,multiplier:1.10,debuff:'atk',reduction:.15,source:4},
    judgment_cut: {name:'裁决斩',rarity:'epic',learnLevel:10,categories:['greatsword'],cost:10,cooldown:3,multiplier:1.65,source:6},
    hatred: {name:'仇恨',rarity:'normal',learnLevel:1,cost:10,self:true,once:true,source:0},
    player_vow: {name:'誓言',rarity:'rare',learnLevel:6,cost:20,self:true,once:true,requireKnightSet:true,source:3},
    player_sacrifice: {name:'舍身',rarity:'epic',learnLevel:10,cost:20,cooldown:3,multiplier:1,requireKnightSet:true,categories:['greatsword'],source:6}
};
Object.entries(PLAYER_SKILL_DEFINITIONS).forEach(([id, data]) => {
    skills[id] = { ...skills[id], ...data };
    ITEM_TEMPLATES[`book_${id}`] = {id:`book_${id}`,name:`《${data.name}》原典`,type:'skill_book',skillId:id,
        rarity:data.rarity,desc:id === 'hatred' ? '旧版本遗留原典。仇恨为初始自带技能，此书可转换为普通研习册。' : `学习${data.name} Lv.1，需要角色等级 ${data.learnLevel}。已学会时可转换为同阶研习册。`,sellPrice:{normal:1,good:2,rare:4,epic:8}[data.rarity]};
});
Object.keys(SKILL_UPGRADE_COSTS).forEach(rarity => {
    const names = {normal:'普通',good:'优良',rare:'稀有',epic:'史诗',legendary:'珍品',mythic:'神品'};
    ITEM_TEMPLATES[`training_book_${rarity}`] = {id:`training_book_${rarity}`,name:`${names[rarity]}技能研习册`,type:'skill_book',rarity,
        desc:'在下方「技能」栏打开已学技能详情，消耗此书升级同稀有度技能。不能用来首次学习。',sellPrice:{normal:1,good:2,rare:4,epic:8}[rarity]};
});
const EXPLORATION_DEFINITIONS = [
    null,
    {id:'sealed_mine_gallery',name:'封存支矿道',anchor:'mine_exit_4',level:2,rarity:'normal',books:['quick_stab','steady_cut'],enemy:'女矿工',boss:'女监工'},
    {id:'forest_supply_camp',name:'林间补给营',anchor:'forest_start',level:4,rarity:'good',books:['heavy_bash','armor_pick','heavy_cut'],enemy:'补给护卫',boss:'补给营头目'},
    {id:'knight_trial',name:'骑士演武场',anchor:'training_ground',level:6,rarity:'rare',books:['player_vow'],enemy:'演武守卫',boss:'演武教官',training:true},
    {id:'smuggler_storehouse',name:'暗巷走私仓',anchor:'slum_east_1',level:7,rarity:'rare',books:['exploit_opening','suppressing_blow'],enemy:'仓库看守',boss:'仓库管事'},
    {id:'academy_ruins',name:'学院遗址',anchor:'mysterious_stone_gate',level:10,rarity:'rare',books:['sundering_strike']},
    {id:'monastery_vault',name:'修道院封印库',anchor:'abandoned_monastery',level:12,rarity:'epic',books:['judgment_cut','player_sacrifice'],enemy:'守库卫士',boss:'封印守卫'}
];
EXPLORATION_DEFINITIONS.forEach((def, number) => {
    if (!def) return;
    def.number = number;
    def.equipment = UPDATE029_EQUIPMENT.filter(row => row[9] === number).map(row => row[0]);
    if (number === 5) return;
    ['enemy','boss'].forEach(role => {
        const id = `expedition_${number}_${role}`;
        const hp = 14 + def.level * 4;
        const unitHp = role==='boss' ? hp*2 : hp;
        const attackScale = role==='boss' ? 1.15 : 1;
        CHARACTER_TEMPLATES[id] = {id,name:def[role],type:'enemy',level:def.level,canFight:true,hostile:true,
            canTalk:false,desc:`${def.name}中的${def[role]}。`,drops:[],fixedBalance:true,
            hp: unitHp, maxHp: unitHp,
            atk: Math.round((2+def.level*2)*attackScale), def: Math.floor(def.level*.7), agi: 2+Math.floor(def.level/2),
            sp:20,maxSp:20,exp:def.training ? 0 : 5+def.level*2,
            training:def.training || false};
    });
});
CHARACTER_TEMPLATES.expedition_6_outer_guard={...CHARACTER_TEMPLATES.expedition_6_enemy,id:'expedition_6_outer_guard',name:'外庭守卫'};
