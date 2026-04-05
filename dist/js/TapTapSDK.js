/**
 * TapTapSDK.js — TapTap H5 平台 SDK 接入
 *
 * TapTap H5 小游戏由平台统一注入 SDK，无需自行加载。
 * 本文件为静默桩：优先使用平台注入的 window.TapSDK / window.tapsdk，
 * 不可用时静默降级，不产生任何外部网络请求。
 */
const TapTapSDK = (function () {
  'use strict';

  /**
   * 获取平台注入的 SDK（TapTap H5 统一挂载点）
   */
  function getPlatformSDK() {
    return window.TapSDK || window.tapsdk || null;
  }

  /**
   * 请求评分（唤起 TapTap 评分弹窗）
   * 平台 SDK 不可用时静默降级
   */
  async function requestScore(opts) {
    const sdk = getPlatformSDK();
    if (!sdk) {
      console.warn('[TapTapSDK] 平台 SDK 未注入，跳过评分调用');
      return;
    }
    try {
      const fn = sdk.requestScore || (sdk.default && sdk.default.requestScore);
      if (typeof fn === 'function') {
        fn.call(sdk, {
          title: opts.title || '给寻道打分',
          content: opts.content || '喜欢寻道吗？给我们打个分吧！',
          successText: opts.successText || '去评分',
          cancelText: opts.cancelText || '残忍拒绝'
        });
      }
    } catch (err) {
      console.warn('[TapTapSDK] requestScore 调用失败:', err.message);
    }
  }

  /**
   * 分享（唤起 TapTap 分享面板）
   * 平台 SDK 不可用时静默降级
   */
  async function share(opts) {
    const sdk = getPlatformSDK();
    if (!sdk) {
      console.warn('[TapTapSDK] 平台 SDK 未注入，跳过分享调用');
      return;
    }
    try {
      const fn = sdk.share || (sdk.default && sdk.default.share);
      if (typeof fn === 'function') {
        fn.call(sdk, {
          title: opts.title || '寻道·文字冒险',
          content: opts.content || '我在玩寻道，一款修仙剧情向文字冒险游戏！',
          url: opts.url || window.location.href,
          imageUrl: opts.imageUrl || ''
        });
      }
    } catch (err) {
      console.warn('[TapTapSDK] share 调用失败:', err.message);
    }
  }

  /**
   * SDK 是否可用
   */
  function isAvailable() {
    return !!getPlatformSDK();
  }

  return {
    requestScore,
    share,
    isAvailable
  };
})();

window.TapTapSDK = TapTapSDK;
