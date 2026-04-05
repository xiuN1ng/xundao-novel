/**
 * EventBus.js — 事件总线，模块间通信中心
 * 使用发布/订阅模式实现松耦合
 */
const EventBus = (function () {
  'use strict';

  // 存储事件监听器：{ eventName: [callback1, callback2, ...] }
  const listeners = {};

  /**
   * 订阅事件
   * @param {string} event - 事件名称
   * @param {Function} callback - 回调函数
   */
  function on(event, callback) {
    if (!listeners[event]) {
      listeners[event] = [];
    }
    listeners[event].push(callback);
  }

  /**
   * 取消订阅
   * @param {string} event - 事件名称
   * @param {Function} callback - 回调函数（不传则移除该事件所有监听）
   */
  function off(event, callback) {
    if (!listeners[event]) return;
    if (!callback) {
      listeners[event] = [];
    } else {
      listeners[event] = listeners[event].filter(cb => cb !== callback);
    }
  }

  /**
   * 发布事件
   * @param {string} event - 事件名称
   * @param {*} data - 传递的数据
   */
  function emit(event, data) {
    if (!listeners[event]) return;
    listeners[event].forEach(callback => {
      try {
        callback(data);
      } catch (err) {
        console.error(`[EventBus] Error in listener for "${event}":`, err);
      }
    });
  }

  return { on, off, emit };
})();

// 导出为全局变量（兼容 IIFE）
window.EventBus = EventBus;
