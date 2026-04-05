/**
 * AudioManager.js — 音效系统
 * BGM 播放（单首循环）、音效触发、静音开关
 * 无音频文件时静默降级
 */
const AudioManager = (function (EventBus) {
  'use strict';

  /** @type {HTMLAudioElement|null} */
  let bgmAudio = null;
  /** 当前 BGM 路径 */
  let currentBgm = null;
  /** 是否静音 */
  let isMuted = false;
  /** 音量 0.0–1.0 */
  let volume = 0.6;
  /** 已缓存的音效 Audio 对象 */
  let sfxCache = {};

  // ============================================================
  // BGM
  // ============================================================

  /**
   * 播放 BGM（自动循环）
   * @param {string} src - 音频文件路径
   * @param {number} [vol] - 音量 0-1
   */
  function playBgm(src, vol) {
    if (!src) return;

    // 同一首不重复播放
    if (currentBgm === src && bgmAudio && !bgmAudio.paused) return;

    stopBgm();
    currentBgm = src;

    bgmAudio = new Audio(src);
    bgmAudio.loop = true;
    bgmAudio.volume = isMuted ? 0 : (vol !== undefined ? vol : volume);
    bgmAudio.preload = 'auto';

    bgmAudio.play().catch(() => {
      console.log('[AudioManager] BGM autoplay blocked — will start on user interaction');
    });
  }

  /**
   * 停止 BGM
   */
  function stopBgm() {
    if (bgmAudio) {
      bgmAudio.pause();
      bgmAudio.src = '';
      bgmAudio = null;
    }
    currentBgm = null;
  }

  /**
   * 暂停 BGM
   */
  function pauseBgm() {
    if (bgmAudio && !bgmAudio.paused) {
      bgmAudio.pause();
    }
  }

  /**
   * 恢复 BGM
   */
  function resumeBgm() {
    if (bgmAudio && bgmAudio.paused) {
      bgmAudio.play().catch(() => {});
    }
  }

  /**
   * 设置 BGM 音量
   * @param {number} vol - 0.0–1.0
   */
  function setBgmVolume(vol) {
    volume = Math.max(0, Math.min(1, vol));
    if (bgmAudio && !isMuted) {
      bgmAudio.volume = volume;
    }
  }

  // ============================================================
  // 音效
  // ============================================================

  /**
   * 播放音效（每次实例化新的 Audio，避免 iOS 不能复用问题）
   * @param {string} src - 音频文件路径
   * @param {number} [vol] - 音量 0-1
   */
  function playSfx(src, vol) {
    if (!src || isMuted) return;

    try {
      const audio = new Audio();
      audio.volume = vol !== undefined ? vol : volume;
      audio.preload = 'auto';
      // 检查音频是否存在（404 时静默降级）
      audio.addEventListener('error', () => { audio.src = ''; }, { once: true });
      audio.src = src;
      audio.play().catch(() => {});
      // 播放完毕后自动释放（无需手动清理）
      audio.addEventListener('ended', () => {
        audio.src = '';
      });
    } catch (err) {
      console.warn('[AudioManager] SFX play error:', err);
    }
  }

  /**
   * 播放对话出现音效
   */
  function playDialogueSound() {
    playSfx('assets/audio/dialogue.mp3', 0.4);
  }

  /**
   * 播放选项选择音效
   */
  function playChoiceSound() {
    playSfx('assets/audio/choice.mp3', 0.5);
  }

  /**
   * 播放选项出现音效
   */
  function playChoiceShowSound() {
    playSfx('assets/audio/choice_show.mp3', 0.3);
  }

  // ============================================================
  // 静音控制
  // ============================================================

  /**
   * 切换静音
   * @returns {boolean} 静音状态
   */
  function toggleMute() {
    isMuted = !isMuted;
    if (bgmAudio) {
      bgmAudio.volume = isMuted ? 0 : volume;
    }
    EventBus.emit('audio:mute', { muted: isMuted });
    return isMuted;
  }

  /**
   * 设置静音状态
   * @param {boolean} muted
   */
  function setMuted(muted) {
    isMuted = !!muted;
    if (bgmAudio) {
      bgmAudio.volume = isMuted ? 0 : volume;
    }
    EventBus.emit('audio:mute', { muted: isMuted });
  }

  /**
   * 是否静音
   * @returns {boolean}
   */
  function isMutedState() {
    return isMuted;
  }

  // ============================================================
  // 事件监听：音效触发
  // ============================================================

  EventBus.on('text:start', () => {
    // 每个字出现时播放打字音效（节流）
    // 由 TextDisplay 模块自行决定是否触发
  });

  EventBus.on('dialogue:show', () => {
    playDialogueSound();
  });

  EventBus.on('choice:show', () => {
    playChoiceShowSound();
  });

  EventBus.on('choice:select', () => {
    playChoiceSound();
  });

  // ============================================================
  // 背景音乐过渡
  // ============================================================

  /**
   * 淡入 BGM
   * @param {string} src
   * @param {number} fadeDuration 淡入时长（毫秒）
   */
  function fadeInBgm(src, fadeDuration = 2000) {
    playBgm(src, 0);
    if (!bgmAudio) return;
    bgmAudio.volume = 0;
    resumeBgm();

    const step = volume / (fadeDuration / 50);
    const interval = setInterval(() => {
      if (!bgmAudio || bgmAudio.paused) { clearInterval(interval); return; }
      const currentVol = bgmAudio.volume;
      if (currentVol + step >= volume) {
        bgmAudio.volume = isMuted ? 0 : volume;
        clearInterval(interval);
      } else {
        bgmAudio.volume = isMuted ? 0 : currentVol + step;
      }
    }, 50);
  }

  /**
   * 淡出 BGM
   * @param {number} fadeDuration 淡出时长（毫秒）
   */
  function fadeOutBgm(fadeDuration = 2000) {
    if (!bgmAudio) return;
    const startVol = bgmAudio.volume;
    const step = startVol / (fadeDuration / 50);
    const interval = setInterval(() => {
      if (!bgmAudio) { clearInterval(interval); return; }
      const currentVol = bgmAudio.volume;
      if (currentVol - step <= 0) {
        stopBgm();
        clearInterval(interval);
      } else {
        bgmAudio.volume = currentVol - step;
      }
    }, 50);
  }

  return {
    playBgm,
    stopBgm,
    pauseBgm,
    resumeBgm,
    setBgmVolume,
    playSfx,
    playDialogueSound,
    playChoiceSound,
    playChoiceShowSound,
    toggleMute,
    setMuted,
    isMutedState,
    fadeInBgm,
    fadeOutBgm
  };
})(window.EventBus);

window.AudioManager = AudioManager;
