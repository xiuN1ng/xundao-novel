/**
 * ChoiceMenu.js — 选项菜单
 * 显示选项列表，支持条件过滤，触控友好（最小热区 44px）
 */
const ChoiceMenu = (function (EventBus) {
  'use strict';

  /** DOM 元素 */
  let containerEl = null;
  let promptEl = null;
  let listEl = null;

  /** 当前选项数据 */
  let currentChoices = [];

  // ============================================================
  // 初始化
  // ============================================================

  /**
   * 初始化
   * @param {Object} opts
   */
  function init(opts) {
    containerEl = getElement(opts.container);
    promptEl = getElement(opts.prompt);
    listEl = getElement(opts.list);

    if (!containerEl || !listEl) {
      console.error('[ChoiceMenu] Required elements not found');
    }
  }

  function getElement(input) {
    if (typeof input === 'string') {
      return document.querySelector(input);
    }
    return input || null;
  }

  // ============================================================
  // 显示 / 隐藏
  // ============================================================

  /**
   * 显示选项菜单
   * @param {Object} data - { prompt, choices }
   */
  function show(data) {
    currentChoices = data.choices || [];
    const prompt = data.prompt || '请选择：';

    // 隐藏打字区域（如果有继续提示）
    EventBus.emit('choice:show', data);

    // 更新提示语
    if (promptEl) {
      promptEl.textContent = prompt;
    }

    // 渲染选项按钮
    renderChoices();

    // 显示容器
    if (containerEl) {
      containerEl.classList.add('visible');
    }
  }

  /**
   * 隐藏选项菜单
   */
  function hide() {
    if (containerEl) {
      containerEl.classList.remove('visible');
    }
    currentChoices = [];
    if (listEl) {
      listEl.innerHTML = '';
    }
  }

  /**
   * 渲染选项列表
   */
  function renderChoices() {
    if (!listEl) return;
    listEl.innerHTML = '';

    currentChoices.forEach((choice, index) => {
      const btn = document.createElement('button');
      btn.className = 'choice-btn';
      btn.textContent = choice.text || `选项 ${index + 1}`;

      // 设置最小热区（触控友好）
      btn.style.minHeight = '44px';
      btn.style.width = '100%';

      // 选项依次滑入（stagger 100ms）
      btn.style.animationDelay = `${index * 100}ms`;

      // 点击事件
      btn.addEventListener('click', () => handleSelect(index));

      // 键盘支持
      btn.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          handleSelect(index);
        }
      });

      listEl.appendChild(btn);
    });
  }

  /**
   * 处理选项点击
   * @param {number} index - 选项索引
   */
  function handleSelect(index) {
    if (index < 0 || index >= currentChoices.length) return;

    const choice = currentChoices[index];

    EventBus.emit('choice:select', index);

    // 隐藏菜单
    hide();
  }

  /**
   * 获取当前选项数量
   * @returns {number}
   */
  function getCount() {
    return currentChoices.length;
  }

  // ============================================================
  // 事件监听
  // ============================================================

  EventBus.on('choice:show', function (data) {
    show(data);
  });

  EventBus.on('dialogue:show', function () {
    // 对话显示时隐藏选项
    hide();
  });

  EventBus.on('game:end', function () {
    hide();
  });

  return {
    init,
    show,
    hide,
    getCount
  };
})(window.EventBus);

window.ChoiceMenu = ChoiceMenu;
