// 副本文案、成年女性敌人和肢体表。战斗数值、掉落概率仍由 content029 管理。
const EXPEDITION_SCENERY = {
    sealed_mine_gallery: {
        description: '封条贴在岩壁上，早被潮气泡成了褪色的薄皮。门后的风带着铁锈与灯油的气味，沿着废弃铁轨缓缓吹来。矿场账簿里早已划去了这条支矿道，黑暗中却仍有镐声，一声，又一声，像有人替那些未归的矿工数着漫长的夜。',
        entry: '旧铁轨在脚边断开，几盏矿灯悬在低矮的支架上。井口的天光停在身后，再往前，只有湿岩缓慢滴水的声音。',
        normalRoom: ["矿道","低矮的支架托着潮湿岩顶，废轨沿石壁伸向黑暗。旧工号隐没在盐霜下，偶尔一滴水落进空矿车，回声便沿着几处岔口渐渐散远。"],
        bossRoom: ['藏械深井', '废井底部被木台架成一座暗库，镐、刀和沉重的铁箱堆到岩壁边。最高的一盏灯仍亮着，灯下的人守着这批不曾记入账册的货。'],
        trace: '矿尘与灯油',
        limbs: {head:'发间缠着矿灯的旧系带',torso:'工装护衬上积着层层矿尘',arm:'袖口留着长期搬运磨出的痕迹',hand:'掌心有握持矿具留下的旧茧',leg:'膝部护布沾着灰白石粉',foot:'旧靴的绑带上结着干硬的泥',breast:'胸前的工作护衬残留着灯油气味'}
    },
    forest_supply_camp: {
        description: '林间本该只有鹿径，今夜却多了马车碾出的深辙。帐篷藏在杉影与薄雾之间，篝火烧得很低，仿佛连火光也受了禁令。药草、粮袋与箭束被运往同一个地方；循着风里若有若无的苦香，你会找到那条养着整支队伍的隐秘血脉。',
        entry: '一根横倒的杉木掩住车辙，树皮上还留着新鲜的斧痕。营地的火藏在林后，枝叶间偶尔闪过巡夜灯的微光。',
        normalRoom: ["林间营地","杉影覆着油布帐篷，篝火的余温还藏在灰里。草药的苦香与湿木气息相混，踩实的小径从货堆间穿过，枝叶深处不时传来巡夜的脚步声。"],
        bossRoom: ['余烬主帐', '主帐前的篝火只剩一圈余烬。地图被石块压在木桌上，一盏防风灯把山路照得分明；营地主人已经合起账册，等着闯入者走近。'],
        trace: '杉针与药草',
        limbs: {head:'头发里还夹着细小杉针',torso:'巡林衣的护衬带着草药气味',arm:'绑袖上缝着深绿的营地标记',hand:'手套边缘沾着草汁和弓弦蜡',leg:'护膝上留着穿行灌木的擦痕',foot:'靴边粘着溪岸的细沙',breast:'胸前护衬绣着营地的绿色线记'}
    },
    knight_trial: {
        description: '训练场后的石门并不通向荣耀，只通向荣耀被反复磨砺的地方。风从空旷的拱廊穿过，带起旧旗，也带起盔甲之间细微的回响。这里的每一次交锋都有见证，每一次退却都有余地；真正难以越过的，是利刃相接前，心里那一瞬的迟疑。',
        entry: '门边的铜铃已经敲过，演武用的旗带在拱廊下展开。白灰划出的界线通往不同训练厅，门侧刻着止战与认负的规矩。',
        normalRoom: ["演武厅","石地上的白灰被来回的步法磨得稀薄，旧旗垂在拱顶之下。兵器架安静地倚着墙，远处的甲片轻响提醒来客，这里的每一道门后都可能站着新的对手。"],
        bossRoom: ['誓剑圆厅', '高窗的光落在圆厅中央，照亮一道磨损的骑士誓词。教官站在白线另一侧，先以剑礼致意，然后缓缓摆开迎战的姿势。'],
        trace: '剑油与白灰',
        limbs: {head:'束发绳带着演武场的蓝色标记',torso:'板甲内衬缀着训练用的编号',arm:'护臂上的旧击痕排得很密',hand:'握剑处的皮手套经过多次修补',leg:'腿甲内的绑带系得一丝不乱',foot:'练习靴底沾着石厅的白灰',breast:'胸甲内的护衬仍有工整的缝线'}
    },
    smuggler_storehouse: {
        description: '暗巷尽头的仓门白日紧闭，入夜后，门缝里才透出细细一线灯。没有旗号的箱子从这里过手，没有姓名的人在这里结账。旧砖墙把低语锁在腹中，潮水般的脚步声在夹层来回；越往深处，账本上的货物便越不像货物，守门人的目光也越发沉默。',
        entry: '门轴被仔细上过油，推开时没有半点声响。空箱堆成一面假墙，墙后分出几条仅容侧身通过的暗巷。',
        normalRoom: ["仓库","货架把灯影分割成狭长的暗格，封蜡箱笼一直堆到低梁之下。雨水滴进墙边的铁盆，细碎回声掩住了脚步；没有署名的账签在穿堂风里轻轻翻动。"],
        bossRoom: ['夜账密库', '密库的铁门向内半开，桌上散着尚未结清的票据。仓主背后的柜格层层上锁，她把最后一枚印章收回袖中，目光停在你的来路上。'],
        trace: '封蜡与墨迹',
        limbs: {head:'兜帽边缘染着仓库的灰尘',torso:'暗色外衣内缝着隐蔽的票据袋',arm:'袖扣被磨得不再反光',hand:'指节上留着搬箱与用刀的旧痕',leg:'绑腿布上印着货架的木屑',foot:'软靴底磨去了多余的纹路',breast:'胸前护衬里缝着一段编号布签'}
    },
    academy_ruins: {
        description: '学院的名字早从路碑上剥落，石门却仍认得每一阵归来的风。阶下暗道浸着旧雨，砖缝里闪烁的微光，像一堂始终没有结束的夜课。那些失去名字的施法者还在廊间徘徊；更深的密室里，有人将最后一道咒语念了太久，久到整座学院都忘记了黎明。',
        entry: '石门在身后合拢了天光。旧校徽半埋在碎砖中，几道黯淡的符纹沿墙伸向深处，仿佛仍在为迟到的访客指路。',
        normalRoom: ["暗道","潮气漫过古老砖石，褪色符纹在墙缝里浮起幽微的光。走廊从拱门间曲折延伸，远处偶有法袍掠地的轻响，仿佛一堂无人散去的夜课仍在继续。"],
        bossRoom: ['失昼密室', '冰冷石壁围成一座封闭密室，残破法阵在地面缓慢明灭。紫色的光停在厅心那道身影周围，连尘埃也迟迟不肯落下。']
    },
    monastery_vault: {
        description: '修道院的钟早已裂了，地底却仍按时响起钟声。封印库沉在祭坛之下，铁门后的灯火一盏也不曾熄灭。守库人忘了四季，忘了来往的姓名，只记得一条比石墙更冷的戒律：被留下的东西，不许再见天日。你走近时，门里有人替你念完了一段无声的祷词。',
        entry: '祭坛后的石阶通向地下，墙龛里燃着颜色苍白的烛火。封印的细线横过门槛，风经过时，像琴弦一样轻轻发颤。',
        normalRoom: ["封库石室","苍白烛火照着嵌进石墙的铁柜，封签低垂，一行行旧祷文早已难辨。空气中有冷蜡与陈年香灰的气味，钟声穿过墙壁时，每一道拱门都像在低声回应。"],
        bossRoom: ['终祷封库', '最后一道封门敞开在成排烛火之间，深处的守卫披着灰白长衣。她身后是被铁链缚住的古老柜匣；钟声落定时，她抬起了手中的武器。'],
        trace: '烛蜡与冷香',
        limbs: {head:'灰白头巾的边缘沾着烛灰',torso:'长衣护衬上缝着封库的戒条',arm:'臂间缠着刻有旧祷文的布带',hand:'手套上凝着点点白色烛蜡',leg:'护腿布带染着地下石室的尘',foot:'靴上的银扣刻着褪色钟纹',breast:'胸前护衬印着封库的灰色纹记'}
    }
};

const EXPEDITION_WOMEN = {
    1: [
        ['女矿工', '成年女矿工把旧工装改作短甲，腰侧悬着缺口短刀。她熟悉每一处松动的支架，矿灯一晃，便会从暗处逼近。', '短发被矿帽压得凌乱', '握镐的旧茧横过掌心'],
        ['女监工', '成年女监工披着加固皮衣，铁尺和钥匙挂在同一条腰带上。旧工号已经被她刮去，只有命令别人的习惯还留在紧抿的嘴角。', '灰黑头发束成一条紧辫', '虎口有常年握持铁尺的磨痕']
    ],
    2: [
        ['林营女护卫', '成年女护卫身着深绿巡林衣，肩头挂着一截用作哨号的兽角。她在树影间换步，始终不让自己背向营地。', '栗色长发用皮绳扎起', '皮手套上留着弓弦的细痕'],
        ['林营女统领', '成年女统领穿着补缀整齐的皮甲，披风一角压着营地纹章。她不高声呼喝，只用几次短促的手势，让整片林地像弓弦一般收紧。', '深色发辫紧贴后颈', '手背护片上刻着指挥用的记号']
    ],
    3: [
        ['演武女骑士', '成年女骑士佩着训练场的蓝色旗带，剑刃按演武规矩收了锋。她先行剑礼，再把重心压低，目光稳稳守着你的肩线。', '短发修剪得干净利落', '掌心厚茧记录着长年的剑课'],
        ['演武女教官', '成年女教官的护甲已经失去光泽，扣带却依然收拾得一丝不乱。她等你站稳才举剑，动作不快，身前却仿佛没有一处可乘的空隙。', '鬓边几缕银发束进发结', '剑茧与修补手套的细线交错']
    ],
    4: [
        ['暗仓女看守', '成年女看守披着没有标记的暗色短衣，刀鞘贴着货架藏在身后。她不问来客的姓名，只用脚步封住最明亮的那条路。', '兜帽下露出剪短的黑发', '指节有搬运木箱留下的旧痕'],
        ['夜账女仓主', '成年女仓主穿着朴素却合身的长外套，袖中的印章比刀柄更加光亮。她合起账册时没有慌张，像是准备亲自抹去一笔不该存在的亏空。', '整齐盘发用乌木簪固定', '右手食指留着常戴印戒的浅印']
    ],
    6: [
        ['封库女卫士', '成年女卫士穿着灰白长衣与旧锁甲，胸前的钟纹被反复擦拭。她守在两盏烛灯之间，呼吸与远处的钟声保持着同一种节拍。', '灰白头巾裹住深色头发', '手甲边缘缠着旧祷文布带'],
        ['终祷女守望者', '成年女守望者披着缀满旧封签的长衣，双手平稳地握住沉重武器。她身后的柜门已有无数次修补，眼中那份守候却像从未动摇。', '银灰头发拢在旧冠箍下', '双手护革上压着重兵器的旧纹']
    ]
};
const EXPEDITION_LIMB_PARTS = [['head','头',1],['torso','躯干',1],['leg','腿',2],['arm','手臂',2],['hand','手',2],['foot','脚',2],['breast','乳房',2]];
const EXPEDITION_QUALITY_ORDER = ['normal','good','rare','epic','legendary','mythic'];
// 品质直接改变部位描写，不追加品质名称或保存等级。
Object.assign(EXPEDITION_SCENERY.academy_ruins, {
    trace:'结晶粉尘与旧墨',
    limbs:{head:'发间沾着微小结晶',torso:'深蓝法袍的护衬绣着褪色符号',arm:'袖边留着施法训练的符记',hand:'指节间有握持法杖的旧痕',leg:'袍摆上附着暗道的尘',foot:'法靴绑带沾着潮湿的砖灰',breast:'胸前的法袍护衬缀着旧学院的符记'}
});

function registerExpeditionAnatomy(npc, def) {
    npc.expeditionAnatomy=true;
    npc.corpseDescription=`${npc.name}已停止行动，衣甲上仍留着${def.scenery.trace}的痕迹。四周重归寂静。`;
    npc.limbTemplates=EXPEDITION_LIMB_PARTS.map(([part,label,count])=>{
        const id=`${npc.id}_${part}`, prose=EXPEDITION_LIMB_PROSE[npc.id]?.[part];
        const detail=Array.isArray(prose)?prose[0]:prose;
        ITEM_TEMPLATES[id]={id,name:`${npc.name}的${label}`,type:'limb',limbPart:part,sourceNpcId:npc.id,
            desc:`${npc.name}的${label}。${detail}`};
        return {id,name:label,count};
    });
}
EXPLORATION_DEFINITIONS.forEach(def=>{
    if(!def) return;
    def.scenery=EXPEDITION_SCENERY[def.id];def.description=def.scenery.description;
    def.minNormalRooms=10;def.maxNormalRooms=15;
    if(def.number===5) return;
    ['enemy','boss'].forEach((role,index)=>{
        const npc=CHARACTER_TEMPLATES[`expedition_${def.number}_${role}`];
        const [name,desc]=EXPEDITION_WOMEN[def.number][index];
        def[role]=name;
        Object.assign(npc,{name,desc,type:role==='boss'?'boss':'enemy',gender:'female',age:26+def.number+index*12});
        registerExpeditionAnatomy(npc,def);
    });
});
registerExpeditionAnatomy(CHARACTER_TEMPLATES.female_mage,EXPLORATION_DEFINITIONS[5]);
// 兼容旧档中的外庭守卫；沿用封库普通敌人的角色设定。
CHARACTER_TEMPLATES.expedition_6_outer_guard={
    ...JSON.parse(JSON.stringify(CHARACTER_TEMPLATES.expedition_6_enemy)),id:'expedition_6_outer_guard',bodySourceId:'expedition_6_enemy'
};

function canonicalExpeditionNpcId(id) {
    return String(id || '').replace(/^(expedition_[12346])_support$/,'$1_enemy');
}
function expeditionBodySource(id) {
    const owner=canonicalExpeditionNpcId(id);
    return CHARACTER_TEMPLATES[owner]?.bodySourceId || owner;
}
// 罩杯只决定乳房的大小与重量，脚码只决定脚掌的大小；两者各自另起一句，不参与品质分档。
function expeditionLimbSizeNote(part,cup,footSize) {
    if(part==='breast') return EXPEDITION_CUP_SIZE_TEXT[cup] || '';
    if(part==='foot') return EXPEDITION_FOOT_SIZE_TEXT[footSize] || '';
    return '';
}
function expeditionLimbDescription(npcId,part,rarity,sizes={}) {
    const owner=expeditionBodySource(npcId),prose=EXPEDITION_LIMB_PROSE[owner]?.[part];
    const index=Math.max(0,EXPEDITION_QUALITY_ORDER.indexOf(rarity));
    const note=expeditionLimbSizeNote(part,sizes.cup,sizes.footSize);
    // 脚与乳房按角色整体编写，六档各自含鞋靴细节与手感；其余部位由通用体格描写接上职业痕迹。
    if(Array.isArray(prose)) return `${prose[index]}${note}`;
    return prose ? `${EXPEDITION_LIMB_GRADE_DETAIL[part][index]}${prose}${note}` : '';
}
function buildExpeditionLimb(npcId,part,score,footSize,cup) {
    const owner=expeditionBodySource(npcId), base=ITEM_TEMPLATES[`${owner}_${part}`];
    if(!base) return null;
    const rarity=scoreToQuality(score);
    return normalizeLimbMeasurements({...base,sourceNpcId:owner,score,rarity,qualityDescriptionVersion:3,
        ...(part==='foot'?{footSize}:{}),...(part==='breast'?{cup}:{}),
        name:base.name,
        desc:expeditionLimbDescription(owner,part,rarity,{footSize,cup})});
}
// 与学院同样预掷七类、十二件肢体，成对部位共享评分和尺寸；固定随机源也不会无限重试。
function rollExpeditionLimbScore() {
    for(let attempt=0;attempt<20;attempt++) {
        const u=Math.max(Number.EPSILON,Math.random()),v=Math.random();
        const score=Math.round(50+18*Math.sqrt(-2*Math.log(u))*Math.cos(2*Math.PI*v));
        if(score>=0 && score<=100) return score;
    }
    return 50;
}
function generateExpeditionCorpse(npcId) {
    const npc=CHARACTER_TEMPLATES[canonicalExpeditionNpcId(npcId)];
    if(!npc?.expeditionAnatomy) return null;
    const footSize=rollGenericFootSize(),cup=rollGenericCup(),generatedLimbs={};
    const limbTemplates=npc.limbTemplates.map(limb=>{
        const part=ITEM_TEMPLATES[limb.id].limbPart;
        const item=buildExpeditionLimb(npc.bodySourceId || npc.id,part,rollExpeditionLimbScore(),footSize,cup);
        generatedLimbs[limb.id]=Array.from({length:limb.count},()=>JSON.parse(JSON.stringify(item)));
        return {...limb,name:stripLimbMeasurementSuffix(limb.name)};
    });
    return {name:`${npc.name}的尸体`,type:'limb',sourceNpcId:npc.id,desc:npc.corpseDescription,
        dismemberable:true,loot:[],limbTemplates,generatedLimbs};
}
function refreshExpeditionUnitNames(units) {
    (units || []).forEach(unit=>{
        const id=canonicalExpeditionNpcId(unit.npcId),npc=CHARACTER_TEMPLATES[id];
        if(npc?.expeditionAnatomy) {unit.npcId=id;unit.name=npc.name;delete unit.expeditionRole;}
    });
}
const EXPEDITION_RETIRED_NAMES={'矿道女掠夺者':'expedition_1_enemy','藏械女监工':'expedition_1_boss','矿道掠夺者':'expedition_1_enemy','藏械监工':'expedition_1_boss','矿道女投石手':'expedition_1_enemy','林营女救护者':'expedition_2_enemy','护旗女骑士':'expedition_3_enemy','暗仓女号令者':'expedition_4_enemy','鸣钟女侍从':'expedition_6_enemy'};
function expeditionItemOwner(item) {
    if(item.sourceNpcId) return canonicalExpeditionNpcId(item.sourceNpcId);
    const match=String(item.id || '').match(/^(?:corpse_)?(expedition_\d+_(?:outer_guard|enemy|support|boss)|female_mage)(?:_|$)/);
    if(match) return canonicalExpeditionNpcId(match[1]);
    const names=[...Object.entries(EXPEDITION_RETIRED_NAMES),...Object.values(CHARACTER_TEMPLATES).filter(n=>n.expeditionAnatomy).map(n=>[n.name,n.id]),['女法师','female_mage']];
    return names.find(([name])=>item.name?.startsWith(name+'的'))?.[1];
}
function refreshExpeditionLimb(item,ownerId) {
    if(!item || item.type!=='limb' || item.id?.startsWith('corpse_')) return;
    normalizeLimbMeasurements(item);
    const owner=expeditionBodySource(expeditionItemOwner(item) || ownerId),part=inferMagicDollLimbPart(item);
    const base=ITEM_TEMPLATES[`${owner}_${part}`];
    if(!base) return;
    Object.assign(item,{sourceNpcId:owner,limbPart:part,name:base.name,qualityDescriptionVersion:3,
        desc:expeditionLimbDescription(owner,part,item.rarity || scoreToQuality(item.score),{cup:item.cup,footSize:item.footSize})});
    normalizeLimbMeasurements(item);
}
function repairExpeditionContent() {
    const dungeon=gameState.activeDungeon,def=dungeon && explorationDef(dungeon.id);
    if(def) {
        repairDungeonGrid(dungeon);
        dungeon.roomIds.forEach(id=>{
            const room=gameState.world[id];if(!room) return;
            setDungeonRoomScenery(room,def,id===dungeon.entryRoomId?'initial':id===dungeon.bossRoomId?'boss':'normal');
        });
        dungeon.sceneryVersion=2;
    }
    const upgrade=item=>{
        if(!item) return;
        const owner=expeditionItemOwner(item),npc=CHARACTER_TEMPLATES[owner];
        if(item.id?.startsWith('corpse_') && npc?.expeditionAnatomy) {
            if(!item.generatedLimbs) Object.assign(item,generateExpeditionCorpse(owner),{loot:item.loot || []});
            item.name=`${npc.name}的尸体`;item.sourceNpcId=owner;item.desc=npc.corpseDescription;
            Object.values(item.generatedLimbs).forEach(parts=>parts.forEach(limb=>refreshExpeditionLimb(limb,owner)));
        } else refreshExpeditionLimb(item,owner);
        normalizeLimbMeasurements(item);
    };
    gameState.player.inventory.forEach(upgrade);
    Object.values(gameState.player.magicDoll?.slots || {}).forEach(upgrade);
    Object.values(gameState.world).forEach(room=>{
        room.npcs=(room.npcs || []).map(canonicalExpeditionNpcId);
        (room.items || []).forEach(id=>upgrade(ITEM_TEMPLATES[id]));
    });
    Object.values(gameState.backgroundBattles || {}).forEach(bg=>{
        refreshExpeditionUnitNames(bg.enemies);
        refreshExpeditionUnitNames(bg.combatSnapshot?.enemies);
    });
}
