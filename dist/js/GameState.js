/**
 * GameState.js — 游戏状态管理
 * 维护角色属性、关系、道具、剧情标记等全局状态
 */
const GameState = (function (EventBus) {
  'use strict';

  // 默认初始状态
  const DEFAULT_STATE = {
    currentNode: 'ch1_start',
    stats: {
      心性: 50,
      修为: 0,
      缘: 0
    },
    relationships: {
      '云爷爷': 50,
      '狗蛋': 50,
      '天璇': 30,
      '天水门': 0,
      '云游子': 0
    },
    flags: {},       // 剧情标记，如 { has_met_elder: true }
    inventory: [],   // 道具列表，如 ['青云剑诀', '玉佩']
    visitedNodes: [] // 已访问的节点 ID 列表
  };

  let state = {};

  /**
   * 初始化或重置游戏状态
   * @param {Object} initialState - 可选的初始状态（用于加载存档）
   */
  function init(initialState) {
    state = initialState ? JSON.parse(JSON.stringify(initialState)) : JSON.parse(JSON.stringify(DEFAULT_STATE));
    EventBus.emit('state:init', state);
  }

  /**
   * 获取当前完整状态（深拷贝）
   * @returns {Object}
   */
  function getState() {
    return JSON.parse(JSON.stringify(state));
  }

  /**
   * 获取指定路径的值
   * @param {string} path - 如 'stats.心性' 或 'relationships.云爷爷'
   * @returns {*}
   */
  function get(path) {
    const keys = path.split('.');
    let value = state;
    for (const key of keys) {
      if (value == null) return undefined;
      value = value[key];
    }
    return value;
  }

  /**
   * 设置指定路径的值
   * @param {string} path - 属性路径
   * @param {*} value - 新值
   */
  function set(path, value) {
    const keys = path.split('.');
    let target = state;
    for (let i = 0; i < keys.length - 1; i++) {
      if (target[keys[i]] == null) target[keys[i]] = {};
      target = target[keys[i]];
    }
    target[keys[keys.length - 1]] = value;
    EventBus.emit('state:change', { path, value });
  }

  /**
   * 增加数值（用于属性增减）
   * @param {string} path - 属性路径
   * @param {number} delta - 变化量
   */
  function add(path, delta) {
    const current = get(path) || 0;
    set(path, current + delta);
  }

  /**
   * 添加道具
   * @param {string} item - 道具名称
   */
  function addItem(item) {
    if (!state.inventory.includes(item)) {
      state.inventory.push(item);
      EventBus.emit('inventory:add', item);
    }
  }

  /**
   * 移除道具
   * @param {string} item - 道具名称
   */
  function removeItem(item) {
    const idx = state.inventory.indexOf(item);
    if (idx !== -1) {
      state.inventory.splice(idx, 1);
      EventBus.emit('inventory:remove', item);
    }
  }

  /**
   * 设置剧情标记
   * @param {string} flag - 标记名
   * @param {*} value - 标记值（默认 true）
   */
  function setFlag(flag, value = true) {
    state.flags[flag] = value;
    EventBus.emit('flag:set', { flag, value });
  }

  /**
   * 获取剧情标记
   * @param {string} flag - 标记名
   * @returns {*}
   */
  function getFlag(flag) {
    return state.flags[flag];
  }

  /**
   * 记录访问过的节点
   * @param {string} nodeId - 节点 ID
   */
  function visitNode(nodeId) {
    if (!state.visitedNodes.includes(nodeId)) {
      state.visitedNodes.push(nodeId);
    }
  }

  /**
   * 检查节点是否已访问
   * @param {string} nodeId - 节点 ID
   * @returns {boolean}
   */
  function hasVisited(nodeId) {
    return state.visitedNodes.includes(nodeId);
  }

  /**
   * 修改关系值
   * @param {string} name - 角色名称
   * @param {number} delta - 变化量
   */
  function changeRelation(name, delta) {
    if (state.relationships[name] == null) {
      state.relationships[name] = 50; // 默认中立值
    }
    state.relationships[name] += delta;
    // 限制范围 0-100
    state.relationships[name] = Math.max(0, Math.min(100, state.relationships[name]));
    EventBus.emit('relation:change', { name, value: state.relationships[name] });
  }

  return {
    init,
    getState,
    get,
    set,
    add,
    addItem,
    removeItem,
    setFlag,
    getFlag,
    visitNode,
    hasVisited,
    changeRelation,
    DEFAULT_STATE
  };
})(window.EventBus);

// 导出
window.GameState = GameState;
