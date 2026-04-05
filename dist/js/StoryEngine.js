/**
 * StoryEngine.js — 剧情引擎
 * 负责加载剧情数据、跳转节点、处理节点逻辑
 *
 * 支持 6 种节点类型：
 *   - dialogue : 显示对话文本
 *   - choice   : 显示选项菜单
 *   - set       : 设置状态（属性/标记/道具）
 *   - if        : 条件判断跳转
 *   - jump      : 无条件跳转
 *   - end       : 结束游戏
 */
const StoryEngine = (function (EventBus, GameState) {
  'use strict';

  /** @type {Object} 剧情数据 */
  let storyData = null;

  /** @type {string|null} 当前节点 ID */
  let currentNodeId = null;

  // ============================================================
  // 公开 API
  // ============================================================

  /**
   * 加载剧情 JSON 数据
   * @param {Object} data - 剧情数据对象
   */
  function loadStory(data) {
    storyData = data;
    EventBus.emit('story:loaded', data);
  }

  /**
   * 跳转到指定节点
   * @param {string} nodeId - 节点 ID
   */
  function goToNode(nodeId) {
    if (!storyData) {
      console.error('[StoryEngine] Story not loaded.');
      return;
    }
    const node = storyData.nodes[nodeId];
    if (!node) {
      console.error(`[StoryEngine] Node not found: ${nodeId}`);
      return;
    }

    currentNodeId = nodeId;
    GameState.visitNode(nodeId);

    EventBus.emit('node:enter', { nodeId, node });

    // 根据节点类型处理
    // 'narrate' 类型等同于 'dialogue'（纯叙述文本）
    const effectiveType = node.type === 'narrate' ? 'dialogue' : node.type;
    switch (effectiveType) {
      case 'dialogue':
        handleDialogue(node);
        break;
      case 'choice':
        handleChoice(node);
        break;
      case 'set':
        handleSet(node);
        break;
      case 'if':
        handleIf(node);
        break;
      case 'jump':
        handleJump(node);
        break;
      case 'end':
        handleEnd(node);
        break;
      default:
        console.error(`[StoryEngine] Unknown node type: ${node.type}`);
    }
  }

  /**
   * 处理选项选择（由 ChoiceMenu 触发）
   * @param {number} choiceIndex - 选项索引（从 0 开始）
   */
  function handleChoiceSelect(choiceIndex) {
    const node = storyData.nodes[currentNodeId];
    if (!node || node.type !== 'choice') return;

    const choice = node.choices[choiceIndex];
    if (!choice) {
      console.error(`[StoryEngine] Choice index out of range: ${choiceIndex}`);
      return;
    }

    EventBus.emit('choice:selected', { nodeId: currentNodeId, choiceIndex, choice });

    // 处理选项附加效果
    if (choice.effects) {
      applyEffects(choice.effects);
    }

    // 跳转到目标节点
    if (choice.next) {
      goToNode(choice.next);
    }
  }

  /**
   * 获取当前节点 ID
   * @returns {string|null}
   */
  function getCurrentNodeId() {
    return currentNodeId;
  }

  /**
   * 获取节点数据
   * @param {string} nodeId
   * @returns {Object|null}
   */
  function getNode(nodeId) {
    return storyData ? storyData.nodes[nodeId] : null;
  }

  // ============================================================
  // 节点类型处理器
  // ============================================================

  /**
   * dialogue — 显示对话文本
   * @param {Object} node
   */
  function handleDialogue(node) {
    EventBus.emit('dialogue:show', {
      speaker: node.speaker || null,
      text: node.text || '',
      next: node.next || null
    });
  }

  /**
   * choice — 显示选项菜单
   * @param {Object} node
   */
  function handleChoice(node) {
    // 过滤掉条件不满足的选项
    const visibleChoices = node.choices
      .map((choice, index) => ({ ...choice, originalIndex: index }))
      .filter(choice => {
        // 支持 condition 和 requires 两种字段
        const cond = choice.condition || choice.requires;
        if (!cond) return true;
        return evaluateCondition(cond);
      });

    EventBus.emit('choice:show', {
      prompt: node.prompt || '请选择：',
      choices: visibleChoices
    });
  }

  /**
   * set — 设置状态
   * 支持两种格式：
   *   { effects: [...] } — 标准格式
   *   { field, delta }   — story.json 简化格式
   * @param {Object} node
   */
  function handleSet(node) {
    if (node.effects) {
      applyEffects(node.effects);
    } else if (node.field && node.delta !== undefined) {
      // 简化格式：直接增减属性
      GameState.add(`stats.${node.field}`, node.delta);
    }
    if (node.next) {
      // 延迟跳转，让 UI 先显示设置结果
      setTimeout(() => goToNode(node.next), 100);
    } else {
      console.warn('[StoryEngine] Set node without next:', currentNodeId);
    }
  }

  /**
   * if — 条件判断跳转
   * @param {Object} node
   */
  function handleIf(node) {
    const result = evaluateCondition(node.condition);
    const targetNode = result ? node.then : node.else;
    if (targetNode) {
      goToNode(targetNode);
    }
  }

  /**
   * jump — 无条件跳转
   * @param {Object} node
   */
  function handleJump(node) {
    if (node.target) {
      goToNode(node.target);
    }
  }

  /**
   * end — 结束游戏
   * @param {Object} node
   */
  function handleEnd(node) {
    EventBus.emit('game:end', {
      ending: node.ending || 'normal',
      message: node.message || '游戏结束'
    });
  }

  // ============================================================
  // 条件表达式求值
  // ============================================================

  /**
   * 求值条件表达式
   * 支持操作符：==, !=, >, <, >=, <=, and, or, not, hasItem, hasFlag
   * @param {string|Object} condition - 条件表达式
   * @returns {boolean}
   */
  function evaluateCondition(condition) {
    if (!condition) return true;
    if (typeof condition === 'boolean') return condition;

    // 字符串表达式，如 "stats.心性 >= 60"
    if (typeof condition === 'string') {
      return evaluateStringCondition(condition);
    }

    // 复合条件对象，如 { and: [...], or: [...] }
    if (typeof condition === 'object') {
      return evaluateObjectCondition(condition);
    }

    return false;
  }

  /**
   * 求值字符串条件
   * @param {string} expr
   * @returns {boolean}
   */
  function evaluateStringCondition(expr) {
    // 预处理：替换 hasItem 和 hasFlag
    let processedExpr = expr
      .replace(/hasItem\("([^"]+)"\)/g, (_, item) => `GameState.inventory.includes("${item}")`)
      .replace(/hasFlag\("([^"]+)"\)/g, (_, flag) => `GameState.getFlag("${flag}") === true`);

    try {
      // 安全求值：只允许特定操作
      return new Function('GameState', `
        with (GameState) {
          return ${processedExpr};
        }
      `)(GameState) === true;
    } catch (err) {
      console.error('[StoryEngine] Condition eval error:', err);
      return false;
    }
  }

  /**
   * 求值对象条件（and/or/not）
   * @param {Object} condObj
   * @returns {boolean}
   */
  function evaluateObjectCondition(condObj) {
    if ('and' in condObj) {
      return condObj.and.every(c => evaluateCondition(c));
    }
    if ('or' in condObj) {
      return condObj.or.some(c => evaluateCondition(c));
    }
    if ('not' in condObj) {
      return !evaluateCondition(condObj.not);
    }
    // 单值条件（如 { flag: true }）
    for (const key in condObj) {
      const val = condObj[key];
      if (key === 'stats' || key === 'relationships') {
        for (const k in val) {
          const path = `${key}.${k}`;
          if (GameState.get(path) !== val[k]) return false;
        }
        return true;
      }
      if (key === 'flag') {
        return GameState.getFlag(val) === true;
      }
      if (key === 'hasItem') {
        return GameState.get('inventory').includes(val);
      }
    }
    return true;
  }

  // ============================================================
  // 效果应用
  // ============================================================

  /**
   * 应用效果列表
   * @param {Array<Object>|Object} effects - 效果列表或扁平对象
   */
  function applyEffects(effects) {
    // 处理扁平格式：{ "心性": 5, "修为": 10 }
    if (!Array.isArray(effects) && typeof effects === 'object') {
      // 判断是 effect 对象还是扁平 stat 对象
      const firstKey = Object.keys(effects)[0];
      const firstVal = effects[firstKey];
      if (typeof firstVal === 'number') {
        // 扁平格式：{ "心性": 5, "修为": 10 }
        Object.entries(effects).forEach(([key, delta]) => {
          if (['心性', '修为', '缘'].includes(key)) {
            GameState.add(`stats.${key}`, delta);
          } else if (key.startsWith('好感度_')) {
            const name = key.replace('好感度_', '');
            GameState.changeRelation(name, delta);
          }
        });
        return;
      }
    }

    if (!Array.isArray(effects)) return;
    effects.forEach(effect => {
      switch (effect.type) {
        case 'set':
          GameState.set(effect.path, effect.value);
          break;
        case 'add':
          GameState.add(effect.path, effect.delta);
          break;
        case 'addItem':
          GameState.addItem(effect.item);
          break;
        case 'removeItem':
          GameState.removeItem(effect.item);
          break;
        case 'setFlag':
          GameState.setFlag(effect.flag, effect.value !== undefined ? effect.value : true);
          break;
        case 'relation':
          GameState.changeRelation(effect.name, effect.delta);
          break;
        case 'stats':
          for (const key in effect.delta) {
            GameState.add(`stats.${key}`, effect.delta[key]);
          }
          break;
        default:
          console.warn('[StoryEngine] Unknown effect type:', effect.type);
      }
    });
  }

  // ============================================================
  // 事件监听：对话完成/跳过 → 继续
  // ============================================================

  EventBus.on('dialogue:complete', function (data) {
    if (data.next) {
      goToNode(data.next);
    }
  });

  EventBus.on('choice:select', function (choiceIndex) {
    handleChoiceSelect(choiceIndex);
  });

  return {
    loadStory,
    goToNode,
    handleChoiceSelect,
    getCurrentNodeId,
    getNode,
    evaluateCondition,
    applyEffects
  };
})(window.EventBus, window.GameState);

window.StoryEngine = StoryEngine;
