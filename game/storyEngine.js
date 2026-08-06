// ============================================================
//  game/storyEngine.js - 剧情引擎
//  驱动所有剧情事件和任务的播放、触发检查、条件评估
//  支持主游戏和 Mod 扩展的注册制管理
// ============================================================

const StoryEngine = {
    /** @type {Map<string, Object>} */
    registry: new Map(),

    /** 已完成的事件ID列表 */
    completedEvents: [],

    /** 进行中的任务ID列表 */
    activeQuests: [],

    /** 已完成的任务ID列表 */
    completedQuests: [],

    /** 任务子目标进度 { questId: { conditionIndex: true } } */
    questProgress: {},

    /** 是否已完成加载 */
    loaded: false,

    // ==================== 注册 ====================

    /** 注册一组剧情/任务 */
    registerAll(stories) {
        for (const [id, story] of Object.entries(stories)) {
            this.registry.set(id, story);
        }
    },

    /** 初始化：注册主游戏剧情 */
    init() {
        if (typeof STORIES !== 'undefined') {
            this.registerAll(STORIES);
        }
        this.loaded = true;
        console.log(`[StoryEngine] 已注册 ${this.registry.size} 个剧情/任务`);
    },

    // ==================== 触发检查 ====================

    /** 每次游戏动作后调用 */
    check() {
        if (!this.loaded) this.init();

        // ★ 先检查进行中任务的完成条件（确保完成后再触发下一个任务）
        const activeCopy = [...this.activeQuests];
        for (const questId of activeCopy) {
            this.checkQuestCompletion(questId);
        }

        // 再检查新任务触发
        for (const [id, story] of this.registry) {
            if (story.type === 'event' && this.completedEvents.includes(id)) continue;
            if ((story.type === 'main' || story.type === 'side') && (this.completedQuests.includes(id) || this.activeQuests.includes(id))) continue;

            if (this.evaluateTrigger(story.trigger)) {
                if (story.type === 'event') {
                    this.play(id, story);
                } else {
                    this.startQuest(id, story);
                }
            }
        }
    },

    // ==================== 触发条件评估 ====================

    evaluateTrigger(trigger) {
        if (!trigger) return false;
        switch (trigger.type) {
            case 'first_enter':
                return gameState.player.location === trigger.room && gameState[trigger.flag] === true;

            case 'enter_room':
                return gameState.player.location === trigger.room
                    && (!trigger.flag_not_set || !gameState.gameFlags[trigger.flag_not_set]);

            case 'equip_and_enter':
                return gameState.player.location === trigger.room
                    && this._hasItemEquipped(trigger.item)
                    && this._isNpcAliveInRoom(trigger.room, trigger.npc_alive);

            case 'use_item':
                return false; // 由 triggerUseItem 手动触发

            case 'first_talk':
                return false; // 由 talkToNPCAction 手动调用 checkFirstTalk

            case 'has_item':
                return gameState.player.inventory.some(i => i && i.id === trigger.item);

            case 'auto_start':
                return true;

            case 'quest_complete':
                return this.completedEvents.includes(trigger.quest) || this.completedQuests.includes(trigger.quest);

            case 'composite_trigger':
                if (trigger.operator === 'all') {
                    return trigger.triggers.every(t => this.evaluateTrigger(t));
                } else {
                    return trigger.triggers.some(t => this.evaluateTrigger(t));
                }

            case 'flag':
                return gameState.gameFlags && gameState.gameFlags[trigger.flag];

            case 'npc_not_defeated':
                return this._isNpcAliveAnywhere(trigger.npc);

            default:
                return false;
        }
    },

    // ==================== 剧情播放 ====================

    /** 播放一个剧情事件 */
    play(id, story) {
        this.completedEvents.push(id);
        if (story.onStart) story.onStart();
        if (!story.story || story.story.length === 0) {
            if (story.onComplete) story.onComplete();
            return;
        }
        this.playLines({
            lines: story.story, color: '#e6d5a8', isTitle: !!story.isTitle,
            requireOverlay: false,  // onStart 已处理遮罩
            onComplete: story.onComplete
        });
    },

    /** 标记特定类型的任务条件完成（用于 use_item/first_talk/interact_with 等） */
    markConditionProgress(condType, condValue) {
        for (const questId of this.activeQuests) {
            const story = this.registry.get(questId);
            if (!story || !story.conditions) continue;

            // 检查 single 类型条件
            if (story.conditions.type === 'single') {
                const actualType = story.conditions.condType || story.conditions.type;
                const actualValue = story.conditions.condValue || story.conditions.value;
                if (actualType === condType && actualValue === condValue) {
                    this.completeQuest(questId, story);
                }
            }
        }
        this.check();
    },

    /** 手动触发首次对话相关的剧情/任务（由 talkToNPCAction 调用） */
    checkFirstTalk(npcId) {
        for (const [id, story] of this.registry) {
            if (story.trigger?.type === 'first_talk' && story.trigger.npc === npcId) {
                if (!gameState.talkedNPCs[npcId]) {
                    if (story.type === 'event') this.play(id, story);
                    else this.startQuest(id, story);
                }
            }
        }
    },

    /** 手动触发使用物品类事件 */
    triggerUseItem(itemId) {
        for (const [id, story] of this.registry) {
            if (story.type === 'event' && story.trigger.type === 'use_item'
                && story.trigger.item === itemId && !this.completedEvents.includes(id)) {
                this.play(id, story);
                return true;
            }
        }
        return false;
    },

    // ==================== 任务管理 ====================

    startQuest(id, story) {
        this.activeQuests.push(id);
        this.questProgress[id] = {};

        if (story.startStory && story.startStory.length > 0) {
            this.playLines({
                lines: story.startStory, color: '#ffaa66',
                onComplete: () => {
                    print(`<span style="color: #ffaa66; font-size: 1.3em; font-weight: bold;">【新任务】${story.name}</span>`);
                }
            });
        } else {
            print(`<span style="color: #ffaa66; font-size: 1.3em; font-weight: bold;">【新任务】${story.name}</span>`);
        }
    },

    /** 标记任务子条件完成 */
    markQuestProgress(questId, conditionIndex) {
        if (!this.questProgress[questId]) this.questProgress[questId] = {};
        this.questProgress[questId][conditionIndex] = true;
        this.checkQuestCompletion(questId);
    },

    checkQuestCompletion(questId) {
        const story = this.registry.get(questId);
        if (!story) return;

        // 处理 single 类型条件（单一条件）
        if (story.conditions.type === 'single') {
            if (this.evaluateCondition(story.conditions)) {
                this.completeQuest(questId, story);
            }
            return;
        }

        // 处理 composite 类型条件（多个子条件）
        if (story.conditions.type === 'composite') {
            const allMet = story.conditions.subConditions.every((cond, i) => {
                return this.evaluateCondition(cond) || this.questProgress[questId]?.[i];
            });
            if (allMet) {
                this.completeQuest(questId, story);
            }
        }
    },

    evaluateCondition(cond) {
        // 支持从 conditions 对象直接读取 condType/condValue
        // 如果是 single 类型的包装，使用 condType/condValue 作为实际条件
        const condType = cond.condType || cond.type;
        const condValue = cond.condValue || cond.value;
        const condCount = cond.count || 1;

        switch (condType) {
            case 'has_item':
                return gameState.player.inventory.some(i => i && i.id === (cond.item || condValue));
            case 'has_item_count':
                return gameState.player.inventory.filter(i => i && i.id === (cond.item || condValue)).length >= condCount;
            case 'npc_defeated':
                return !this._isNpcAliveAnywhere(cond.npc || condValue);
            case 'npc_not_defeated':
                return this._isNpcAliveAnywhere(cond.npc || condValue);
            case 'enter_room':
                return gameState.player.location === (cond.room || condValue);
            case 'flag':
                return gameState.gameFlags && gameState.gameFlags[cond.flag || condValue];
            case 'has_seen_item':
                return gameState.player.inventory.some(i => i && i.id === (cond.item || condValue));
            case 'read_item':
                // 需要外部标记（在 readItemFromDetail 中调用 markQuestProgress）
                return false;
            case 'use_item':
                // 需要外部标记
                return false;
            case 'first_talk':
                // 需要外部标记
                return false;
            case 'quest_talk':
                // 由 talkToNPCQuest 处理
                return false;
            case 'interact_with':
                // 需要外部标记
                return false;
            default:
                return false;
        }
    },

    completeQuest(questId, story, onAllDone) {
        // 从进行中移到已完成
        const idx = this.activeQuests.indexOf(questId);
        if (idx > -1) this.activeQuests.splice(idx, 1);
        this.completedQuests.push(questId);

        const showCompletionAndRewards = () => {
            print(`<span style="color: #66ff66; font-size: 1.3em; font-weight: bold;">✅ 任务完成：${story.name}</span>`);

            // 发放奖励
            if (story.rewards) {
                if (story.rewards.exp) {
                    gameState.player.exp += story.rewards.exp;
                    print(`<span style="color: #ffdd44;">获得 ${story.rewards.exp} 经验值</span>`);
                    checkLevelUp();
                }
                if (story.rewards.item) {
                    const item = createItemFromTemplate(story.rewards.item);
                    if (item) {
                        gameState.player.inventory.push(item);
                        print(`<span style="color: #aaffaa;">获得 ${item.name}</span>`);
                    }
                }
            }

            UI.setOverlay(false);
            if (onAllDone) onAllDone();
        };

        // 播放完成剧情（在任务完成提示之前）
        if (story.completeStory && story.completeStory.length > 0) {
            this.playLines({
                lines: story.completeStory, color: '#ffaa66', useNextBtn: true,
                onComplete: showCompletionAndRewards
            });
        } else {
            showCompletionAndRewards();
        }
    },

    // ==================== 存档/读档 ====================

    /** 获取当前剧情状态（用于存档） */
    getState() {
        return {
            completedEvents: [...this.completedEvents],
            activeQuests: [...this.activeQuests],
            completedQuests: [...this.completedQuests],
            questProgress: JSON.parse(JSON.stringify(this.questProgress))
        };
    },

    /** 从存档恢复剧情状态 */
    restore(state) {
        if (!state) return;
        this.completedEvents = state.completedEvents || [];
        this.activeQuests = state.activeQuests || [];
        this.completedQuests = state.completedQuests || [];
        this.questProgress = state.questProgress || {};
        this.loaded = true;
    },

    // ==================== 任务NPC对话 ====================

    /** 获取某个NPC关联的进行中任务 */
    getActiveQuestsForNpc(npcId) {
        const results = [];
        for (const questId of this.activeQuests) {
            const story = this.registry.get(questId);
            if (story && story.questNpc === npcId && story.questDialogue) {
                results.push({ id: questId, story: story });
            }
        }
        return results;
    },

    /** 查找与NPC关联的第一个进行中任务（用于UI按钮判定） */
    findActiveQuestForNpc(npcId) {
        const quests = this.getActiveQuestsForNpc(npcId);
        return quests.length > 0 ? quests[0].story : null;
    },

    /** 播放任务NPC对话并标记完成 */
    playQuestDialogue(questId) {
        const story = this.registry.get(questId);
        if (!story || !story.questDialogue) return false;
        this.playLines({
            lines: story.questDialogue, color: '#ff8844', useNextBtn: true,
            onComplete: () => { this.markConditionProgress('quest_talk', story.questNpc); }
        });
        return true;
    },

    // ==================== 逐行打印通用方法 ====================

    _currentPlayLines: null,

    /** 跳过当前剧情播放，直接显示剩余全部文本 */
    skipLines() {
        const ctx = this._currentPlayLines;
        if (!ctx) return;
        const { lines, color, isTitle, addLineBreaks, onEachLine, onComplete,
                useNextBtn, requireOverlay } = ctx;
        const startIdx = ctx.index;
        ctx.index = lines.length;  // ★ 阻止排队的 setTimeout showNext 继续输出
        // 打印剩余所有行
        for (let j = startIdx; j < lines.length; j++) {
            const line = lines[j];
            if (line === "") print("");
            else if (j === 0 && isTitle) print(`<span style="color: ${color}; font-weight: bold; font-size: 1.8em;">${line}</span>`);
            else print(`<span style="color: ${color};">${line}</span>`);
            if (addLineBreaks && line !== "") print("");
            if (onEachLine) onEachLine(line, j);
        }
        // 清理
        document.getElementById('story-skip-btn').style.display = 'none';
        if (useNextBtn) hideNextBtn();
        if (requireOverlay) UI.setOverlay(false);
        this._currentPlayLines = null;
        if (onComplete) onComplete();
    },

    /**
     * 统一的剧情文本逐行播放器
     * @param {Object} options
     * @param {string[]} options.lines - 文本行数组
     * @param {string} [options.color='#e6d5a8'] - 文本颜色
     * @param {Function} [options.onStart] - 开始回调
     * @param {Function} [options.onEachLine] - 每行回调(line, index)
     * @param {Function} [options.onComplete] - 完成回调
     * @param {boolean} [options.useNextBtn=false] - 使用Next按钮逐行（否则自动计时）
     * @param {number} [options.lineDelay=1300] - 自动播放时行间延迟(ms)
     * @param {boolean} [options.requireOverlay=true] - 是否启用遮罩
     * @param {boolean} [options.isTitle=false] - 首行是否作为标题样式
     * @param {boolean} [options.addLineBreaks=true] - 每行后是否自动换行
     */
    playLines(options) {
        const { lines, color = '#e6d5a8', onStart, onEachLine, onComplete,
                useNextBtn = false, lineDelay = 1300, requireOverlay = true,
                isTitle = false, addLineBreaks = true } = options;
        if (!lines || lines.length === 0) { if (onComplete) onComplete(); return; }
        if (requireOverlay) UI.setOverlay(true);
        if (onStart) onStart();
        // 存储上下文以供跳过使用
        const ctx = { lines, color, isTitle, addLineBreaks, onEachLine, onComplete,
                      useNextBtn, requireOverlay, index: 0 };
        this._currentPlayLines = ctx;
        document.getElementById('story-skip-btn').style.display = 'inline-block';
        const showNext = () => {
            ctx.index = (ctx.index || 0);
            if (ctx.index < lines.length) {
                const line = lines[ctx.index];
                if (line === "") print("");
                else if (ctx.index === 0 && isTitle) print(`<span style="color: ${color}; font-weight: bold; font-size: 1.8em;">${line}</span>`);
                else print(`<span style="color: ${color};">${line}</span>`);
                if (addLineBreaks && line !== "") print("");
                if (onEachLine) onEachLine(line, ctx.index);
                ctx.index++;
                if (useNextBtn) showNextBtn(showNext);
                else setTimeout(showNext, lineDelay);
            } else {
                document.getElementById('story-skip-btn').style.display = 'none';
                if (useNextBtn) hideNextBtn();
                if (requireOverlay) UI.setOverlay(false);
                this._currentPlayLines = null;
                if (onComplete) onComplete();
            }
        };
        showNext();
    },

    // ==================== 内部辅助方法 ====================

    /** 检查NPC是否在任意房间存活 */
    _isNpcAliveAnywhere(npcId) {
        if (!gameState.world) return false;
        for (const roomId in gameState.world) {
            const room = gameState.world[roomId];
            if (room.npcs && room.npcs.includes(npcId)) return true;
        }
        return false;
    },

    /** 检查NPC是否在指定房间存活 */
    _isNpcAliveInRoom(roomId, npcId) {
        const room = gameState.world && gameState.world[roomId];
        if (!room || !room.npcs) return false;
        return room.npcs.includes(npcId);
    },

    /** 检查指定物品是否已装备 */
    _hasItemEquipped(itemId) {
        if (!gameState.player || !gameState.player.equipment) return false;
        const eq = gameState.player.equipment;
        for (const slot in eq) {
            if (eq[slot] && eq[slot].id === itemId) return true;
        }
        return false;
    }

};