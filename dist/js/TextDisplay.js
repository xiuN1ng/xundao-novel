/**
 * TextDisplay.js — 打字机效果文字显示
 * 中文字符逐字显示，支持跳过（点击）
 * 速度可配置，长文本自动滚动
 */
const TextDisplay = (function (EventBus) {
  'use strict';

  /** 配置（可从外部修改） */
  const CONFIG = {
    charDelay: 50,       // 每字符间隔（毫秒），越小越快
    punctDelay: 150,     // 遇到标点符号额外停顿（毫秒）
    newlineDelay: 200,    // 遇到换行额外停顿
    maxSpeed: 5,         // 最快速度档（charDelay = 300 / maxSpeed）
    minSpeed: 5,         // 最慢速度档
    initialSpeedLevel: 3 // 默认速度档 1-5（5最快）
  };

  /** 打字状态 */
  let state = {
    isTyping: false,
    isPaused: false,
    currentText: '',
    currentIndex: 0,
    timerId: null,
    speaker: null,
    speedLevel: CONFIG.initialSpeedLevel
  };

  /** DOM 元素引用 */
  let speakerEl = null;
  let textEl = null;
  let containerEl = null;
  let clickHintEl = null;

  // ============================================================
  // 初始化
  // ============================================================

  /**
   * 初始化，绑定 DOM 元素
   * @param {Object} opts
   * @param {string|HTMLElement} opts.speakerEl    - 说话人元素
   * @param {string|HTMLElement} opts.textEl        - 文本显示元素
   * @param {string|HTMLElement} opts.containerEl  - 点击容器
   * @param {string|HTMLElement} [opts.clickHintEl]- 点击提示元素
   */
  function init(opts) {
    speakerEl = getElement(opts.speakerEl);
    textEl = getElement(opts.textEl);
    containerEl = getElement(opts.containerEl);
    clickHintEl = getElement(opts.clickHintEl);

    if (!textEl) {
      console.error('[TextDisplay] textEl not found');
      return;
    }

    // 点击跳过 / 继续
    const target = containerEl || textEl;
    target.addEventListener('click', handleClick);
    // 防止选项按钮点击触发跳过
    target.addEventListener('click', (e) => {
      if (e.target.closest && e.target.closest('#choice-container')) {
        e.stopPropagation();
      }
    });
  }

  /**
   * 获取 DOM 元素
   */
  function getElement(input) {
    if (typeof input === 'string') {
      return document.querySelector(input);
    }
    return input || null;
  }

  // ============================================================
  // 打字逻辑
  // ============================================================

  /**
   * 根据速度档计算每字符延迟
   * @returns {number}
   */
  function getCharDelay() {
    // 速度档 1（最慢）→ charDelay * 2
    // 速度档 3（默认）→ charDelay
    // 速度档 5（最快）→ charDelay / 2
    const ratio = 2 - (state.speedLevel / CONFIG.maxSpeed);
    return Math.max(5, Math.round(CONFIG.charDelay * ratio));
  }

  /**
   * 显示文字（带打字机效果）
   * @param {string} text
   * @param {string|null} speaker
   */
  function show(text, speaker) {
    stop(); // 停止当前打字

    state.currentText = text;
    state.currentIndex = 0;
    state.speaker = speaker;
    state.isTyping = true;
    state.isPaused = false;

    // 更新说话人
    if (speakerEl) {
      speakerEl.textContent = speaker || '';
      speakerEl.style.display = speaker ? 'block' : 'none';
    }

    // 清空文本区 + 触发文字渐入动画
    if (textEl) {
      textEl.textContent = '';
      // 移除再添加 class 以重触动画
      textEl.classList.remove('text-reveal-anim');
      void textEl.offsetWidth; // 强制重排
      textEl.classList.add('text-reveal-anim');
    }

    // 说话人名称淡入
    if (speakerEl) {
      speakerEl.classList.remove('speaker-anim');
      void speakerEl.offsetWidth;
      speakerEl.classList.add('speaker-anim');
    }

    // 显示点击提示
    if (clickHintEl) {
      clickHintEl.classList.add('visible');
    }

    // 隐藏点击提示（打字完成时由 finish 隐藏）
    // 触发开始事件
    EventBus.emit('text:start', { text, speaker });

    // 开始打字
    scheduleNext();
  }

  /**
   * 立即显示完整文字（无打字效果）
   * @param {string} text
   * @param {string|null} speaker
   */
  function showInstant(text, speaker) {
    stop();
    state.isTyping = false;
    if (speakerEl) {
      speakerEl.textContent = speaker || '';
      speakerEl.style.display = speaker ? 'block' : 'none';
    }
    if (textEl) {
      textEl.textContent = text || '';
    }
    if (clickHintEl) {
      clickHintEl.classList.add('visible');
    }
    EventBus.emit('text:complete', { text, speaker });
  }

  /**
   * 安排下一个字符的显示
   */
  function scheduleNext() {
    if (!state.isTyping || state.isPaused) return;

    if (state.currentIndex >= state.currentText.length) {
      finish();
      return;
    }

    const char = state.currentText[state.currentIndex];
    const delay = getDelayForChar(char);

    state.timerId = setTimeout(() => {
      appendChar(char);
      state.currentIndex++;
      scheduleNext();
    }, delay);
  }

  /**
   * 根据字符类型返回延迟
   */
  function getDelayForChar(char) {
    const base = getCharDelay();
    if (/[。！？；：、，,]/.test(char)) {
      return base + CONFIG.punctDelay;
    } else if (char === '\n') {
      return base + CONFIG.newlineDelay;
    }
    return base;
  }

  /**
   * 添加单个字符到显示区 + 自动滚动
   */
  function appendChar(char) {
    if (textEl) {
      textEl.textContent += char;
      // 自动滚动到底部
      scrollToBottom();
    }
  }

  /**
   * 滚动文本到最底部（对话框内）
   */
  function scrollToBottom() {
    if (textEl) {
      textEl.scrollTop = textEl.scrollHeight;
    }
    // 同时滚动整个 text-area 容器
    const textArea = document.getElementById('text-area');
    if (textArea) {
      textArea.scrollTop = textArea.scrollHeight;
    }
  }

  /**
   * 打字完成
   */
  function finish() {
    state.isTyping = false;
    clearTimeout(state.timerId);
    state.timerId = null;
    if (clickHintEl) {
      clickHintEl.classList.add('visible');
    }
    EventBus.emit('text:complete', {
      text: state.currentText,
      speaker: state.speaker
    });
  }

  /**
   * 停止打字
   */
  function stop() {
    state.isTyping = false;
    state.isPaused = false;
    clearTimeout(state.timerId);
    state.timerId = null;
  }

  /**
   * 点击处理：打字中则跳过，否则通知继续
   */
  function handleClick(e) {
    // 忽略选项区域的点击
    if (e.target.closest && e.target.closest('#choice-container')) return;

    if (state.isTyping) {
      skip();
    } else {
      EventBus.emit('dialogue:complete', {});
    }
  }

  /**
   * 跳过打字效果，直接显示完整内容
   */
  function skip() {
    stop();
    if (textEl) {
      textEl.textContent = state.currentText;
      scrollToBottom();
    }
    if (clickHintEl) {
      clickHintEl.classList.add('visible');
    }
    EventBus.emit('text:complete', {
      text: state.currentText,
      speaker: state.speaker
    });
  }

  /**
   * 是否正在打字
   */
  function isTyping() {
    return state.isTyping;
  }

  /**
   * 设置打字速度档
   * @param {number} level 1-5（1最慢，5最快）
   */
  function setSpeedLevel(level) {
    state.speedLevel = Math.max(1, Math.min(CONFIG.maxSpeed, Math.round(level)));
  }

  /**
   * 获取当前速度档
   * @returns {number}
   */
  function getSpeedLevel() {
    return state.speedLevel;
  }

  // ============================================================
  // 事件监听
  // ============================================================

  EventBus.on('dialogue:show', function (data) {
    show(data.text, data.speaker);
  });

  return {
    init,
    show,
    showInstant,
    skip,
    isTyping,
    setSpeedLevel,
    getSpeedLevel,
    CONFIG // 暴露配置，允许外部修改
  };
})(window.EventBus);

window.TextDisplay = TextDisplay;
