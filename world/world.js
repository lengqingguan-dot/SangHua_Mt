// ============================================================
//  世界地图数据库 - 数据合并器
// ============================================================

// 获取世界数据（深拷贝，避免修改模板）
function getWorldData() {
    // 合并world_0.js和world_1.js的数据
    const mergedWorld = JSON.parse(JSON.stringify(WORLD_TEMPLATE));
    
    // 如果存在WORLD_TEMPLATE_1（来自world_1.js），则合并
    if (typeof WORLD_TEMPLATE_1 !== 'undefined') {
        for (const roomId in WORLD_TEMPLATE_1) {
            if (WORLD_TEMPLATE_1.hasOwnProperty(roomId)) {
                mergedWorld[roomId] = JSON.parse(JSON.stringify(WORLD_TEMPLATE_1[roomId]));
            }
        }
    }
    
    // 合并模组世界数据（如果ModLoader已加载）
    if (typeof ModLoader !== 'undefined' && ModLoader.loaded) {
        ModLoader.applyToWorld(mergedWorld);
    }
    
    return mergedWorld;
}
