/**
 * SaveManager.js — 存档系统
 * 基于 localStorage，支持 3 个存档槽位（自动档 + 2 个手动槽）
 */
const SaveManager = (function (GameState, EventBus) {
  'use strict';

  const STORAGE_KEY = 'xundao_novel_saves';
  const SLOT_COUNT = 3;  // 0=自动存档, 1=手动槽1, 2=手动槽2

  /** @type {Object} 所有存档数据 */
  let saves = {};

  // ============================================================
  // 初始化
  // ============================================================

  function init() {
    loadAllSaves();
  }

  /**
   * 从 localStorage 加载所有存档
   */
  function loadAllSaves() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      saves = raw ? JSON.parse(raw) : {};
    } catch (err) {
      console.error('[SaveManager] Load error:', err);
      saves = {};
    }
  }

  /**
   * 保存所有存档到 localStorage
   */
  function persist() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(saves));
    } catch (err) {
      console.error('[SaveManager] Save error:', err);
    }
  }

  // ============================================================
  // 存档操作
  // ============================================================

  /**
   * 保存到指定槽位
   * @param {number} slot - 槽位编号（0=自动, 1=手动1, 2=手动2）
   * @param {Object} extraData - 额外存档数据（可选）
   * @returns {boolean}
   */
  function save(slot, extraData) {
    if (slot < 0 || slot >= SLOT_COUNT) {
      console.error(`[SaveManager] Invalid slot: ${slot}`);
      return false;
    }

    const state = GameState.getState();
    const now = new Date();

    saves[slot] = {
      version: 1,
      timestamp: now.toISOString(),
      nodeId: state.currentNode,
      state: state,
      extra: extraData || {}
    };

    persist();
    EventBus.emit('save:done', { slot, timestamp: saves[slot].timestamp });
    return true;
  }

  /**
   * 加载指定槽位
   * @param {number} slot - 槽位编号
   * @returns {boolean}
   */
  function load(slot) {
    if (slot < 0 || slot >= SLOT_COUNT) {
      console.error(`[SaveManager] Invalid slot: ${slot}`);
      return false;
    }

    const saveData = saves[slot];
    if (!saveData) {
      console.warn(`[SaveManager] Slot ${slot} is empty.`);
      return false;
    }

    // 恢复游戏状态
    GameState.init(saveData.state);

    EventBus.emit('load:done', { slot, nodeId: saveData.nodeId });
    return true;
  }

  /**
   * 自动存档（槽位 0）
   * @returns {boolean}
   */
  function autoSave() {
    return save(0);
  }

  /**
   * 删除指定槽位
   * @param {number} slot
   */
  function remove(slot) {
    if (slot < 0 || slot >= SLOT_COUNT) return;
    delete saves[slot];
    persist();
    EventBus.emit('save:removed', { slot });
  }

  /**
   * 获取存档信息（不含完整状态，用于列表展示）
   * @returns {Array<Object>}
   */
  function getAllSaveInfo() {
    return Array.from({ length: SLOT_COUNT }, (_, i) => {
      const s = saves[i];
      if (!s) return { slot: i, empty: true };
      return {
        slot: i,
        empty: false,
        timestamp: s.timestamp,
        nodeId: s.nodeId,
        isAuto: i === 0
      };
    });
  }

  /**
   * 检查槽位是否为空
   * @param {number} slot
   * @returns {boolean}
   */
  function isEmpty(slot) {
    return !saves[slot];
  }

  /**
   * 获取存档槽位名称
   * @param {number} slot
   * @returns {string}
   */
  function getSlotName(slot) {
    const names = ['自动存档', '存档 1', '存档 2'];
    return names[slot] || `存档 ${slot}`;
  }

  // ============================================================
  // 事件监听：节点切换时自动存档
  // ============================================================

  EventBus.on('node:enter', function () {
    autoSave();
  });

  return {
    init,
    save,
    load,
    autoSave,
    remove,
    getAllSaveInfo,
    isEmpty,
    getSlotName
  };
})(window.GameState, window.EventBus);

window.SaveManager = SaveManager;
