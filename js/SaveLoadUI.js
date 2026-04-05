/**
 * SaveLoadUI.js — 存档/读档界面
 * 3 槽位（自动存档/A存档/B存档），显示存档时间、章节、游玩时长
 * 新游戏 / 读取 / 删除 操作
 */
const SaveLoadUI = (function (EventBus, GameState, StoryEngine, SaveManager) {
  'use strict';

  /** 界面是否已创建 */
  let initialized = false;
  /** 当前模式：'save' | 'load' */
  let currentMode = 'load';
  /** 游玩开始时间（用于计算游玩时长） */
  let playStartTime = null;
  /** 游戏总时长（暂停时记录） */
  let accumulatedTime = 0;
  /** 上次记录时刻 */
  let lastTick = null;

  // ============================================================
  // 初始化
  // ============================================================

  function init() {
    if (initialized) return;
    createOverlay();
    bindEvents();
    playStartTime = Date.now();
    lastTick = Date.now();
    initialized = true;

    // 定时更新游玩时长显示
    setInterval(updatePlayTimeDisplay, 1000);
  }

  // ============================================================
  // DOM 创建
  // ============================================================

  function createOverlay() {
    const overlay = document.createElement('div');
    overlay.id = 'saveload-overlay';
    overlay.innerHTML = `
      <div class="saveload-modal">
        <div class="saveload-header">
          <span id="saveload-title">存档</span>
          <button class="saveload-close" id="saveload-close" aria-label="关闭">✕</button>
        </div>
        <div class="saveload-tabs">
          <button class="saveload-tab active" data-mode="save">存档</button>
          <button class="saveload-tab" data-mode="load">读档</button>
        </div>
        <div class="saveload-list" id="saveload-list">
          <!-- 槽位列表由 render() 填充 -->
        </div>
        <div class="saveload-footer">
          <button class="choice-btn saveload-newgame" id="saveload-newgame">新游戏</button>
          <button class="choice-btn saveload-back" id="saveload-back">返回</button>
        </div>
      </div>
    `;
    document.body.appendChild(overlay);
  }

  // ============================================================
  // 事件绑定
  // ============================================================

  function bindEvents() {
    const overlay = document.getElementById('saveload-overlay');
    const closeBtn = document.getElementById('saveload-close');
    const newGameBtn = document.getElementById('saveload-newgame');
    const backBtn = document.getElementById('saveload-back');
    const tabs = document.querySelectorAll('.saveload-tab');

    // 关闭
    closeBtn.addEventListener('click', close);
    backBtn.addEventListener('click', close);

    // 点击遮罩关闭
    overlay.addEventListener('click', (e) => {
      if (e.target === overlay) close();
    });

    // 新游戏
    newGameBtn.addEventListener('click', handleNewGame);

    // Tab 切换
    tabs.forEach(tab => {
      tab.addEventListener('click', () => {
        currentMode = tab.dataset.mode;
        tabs.forEach(t => t.classList.toggle('active', t === tab));
        render();
        document.getElementById('saveload-title').textContent =
          currentMode === 'save' ? '存档' : '读档';
        newGameBtn.style.display = currentMode === 'load' ? '' : 'none';
      });
    });
  }

  // ============================================================
  // 渲染
  // ============================================================

  function render() {
    const list = document.getElementById('saveload-list');
    if (!list) return;
    list.innerHTML = '';

    const saves = SaveManager.getAllSaveInfo();
    const slotNames = ['自动存档', '存档 1', '存档 2'];

    saves.forEach((info, i) => {
      const card = document.createElement('div');
      card.className = 'save-card' + (info.empty ? ' empty' : '');

      if (info.empty) {
        card.innerHTML = `
          <div class="save-card-title">${slotNames[i]}</div>
          <div class="save-card-info">空</div>
          <div class="save-card-actions">
            ${currentMode === 'save' ? `<button class="choice-btn save-btn" data-slot="${i}">存档</button>` : ''}
          </div>
        `;
      } else {
        const date = formatDate(info.timestamp);
        const duration = formatDuration(info.timestamp);
        const chapter = info.nodeId ? getChapterName(info.nodeId) : '—';

        card.innerHTML = `
          <div class="save-card-title">${slotNames[i]}</div>
          <div class="save-card-info">
            <span>📅 ${date}</span>
            <span>⏱ ${duration}</span>
            <span>📖 ${chapter}</span>
          </div>
          <div class="save-card-actions">
            ${currentMode === 'save' ? `<button class="choice-btn save-btn" data-slot="${i}">覆盖</button>` : ''}
            ${currentMode === 'load' ? `<button class="choice-btn load-btn" data-slot="${i}">读取</button>` : ''}
            <button class="choice-btn delete-btn" data-slot="${i}">删除</button>
          </div>
        `;
      }

      list.appendChild(card);
    });

    // 绑定按钮事件
    list.querySelectorAll('.save-btn').forEach(btn => {
      btn.addEventListener('click', () => handleSave(parseInt(btn.dataset.slot)));
    });
    list.querySelectorAll('.load-btn').forEach(btn => {
      btn.addEventListener('click', () => handleLoad(parseInt(btn.dataset.slot)));
    });
    list.querySelectorAll('.delete-btn').forEach(btn => {
      btn.addEventListener('click', () => handleDelete(parseInt(btn.dataset.slot)));
    });
  }

  // ============================================================
  // 操作处理
  // ============================================================

  function handleSave(slot) {
    SaveManager.save(slot, {
      playTime: getPlayTime()
    });
    render();
    // 短暂提示
    showToast(`存档成功！`);
  }

  function handleLoad(slot) {
    if (SaveManager.load(slot)) {
      // 重置计时
      playStartTime = Date.now();
      accumulatedTime = 0;
      close();
      // 刷新 HUD
      EventBus.emit('state:change', {});
      // 跳转到存档节点
      const state = GameState.getState();
      StoryEngine.goToNode(state.currentNode);
    } else {
      showToast('读取失败');
    }
  }

  function handleDelete(slot) {
    if (confirm(`确定要删除「${SaveManager.getSlotName(slot)}」吗？`)) {
      SaveManager.remove(slot);
      render();
    }
  }

  function handleNewGame() {
    if (confirm('确定要开始新游戏吗？当前进度将丢失。')) {
      GameState.init();
      SaveManager.remove(0);
      close();
      playStartTime = Date.now();
      accumulatedTime = 0;
      StoryEngine.goToNode('ch1_start');
      EventBus.emit('state:change', {});
    }
  }

  // ============================================================
  // 打开 / 关闭
  // ============================================================

  function open(mode) {
    currentMode = mode || 'load';
    const overlay = document.getElementById('saveload-overlay');
    if (!overlay) return;
    overlay.classList.add('visible');
    document.getElementById('saveload-title').textContent =
      currentMode === 'save' ? '存档' : '读档';
    document.getElementById('saveload-newgame').style.display =
      currentMode === 'load' ? '' : 'none';
    // 更新 tab 激活状态
    document.querySelectorAll('.saveload-tab').forEach(tab => {
      tab.classList.toggle('active', tab.dataset.mode === currentMode);
    });
    render();
    // 记录暂停时刻
    lastTick = null;
  }

  function close() {
    const overlay = document.getElementById('saveload-overlay');
    if (overlay) overlay.classList.remove('visible');
    // 恢复计时
    lastTick = Date.now();
  }

  function isOpen() {
    const overlay = document.getElementById('saveload-overlay');
    return overlay && overlay.classList.contains('visible');
  }

  // ============================================================
  // 工具
  // ============================================================

  function formatDate(isoString) {
    if (!isoString) return '—';
    const d = new Date(isoString);
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    const hour = String(d.getHours()).padStart(2, '0');
    const min = String(d.getMinutes()).padStart(2, '0');
    return `${month}/${day} ${hour}:${min}`;
  }

  function formatDuration(isoString) {
    if (!isoString) return '—';
    // 如果有存储的游玩时长
    const info = SaveManager.getAllSaveInfo().find(s => s.timestamp === isoString);
    const extra = info && info.extra && info.extra.playTime ? info.extra.playTime : 0;
    const totalSec = extra;
    return formatTime(totalSec);
  }

  function formatTime(seconds) {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;
    if (h > 0) return `${h}时${m}分`;
    if (m > 0) return `${m}分${s}秒`;
    return `${s}秒`;
  }

  function getPlayTime() {
    const now = Date.now();
    let elapsed = 0;
    if (lastTick) {
      elapsed = Math.floor((now - lastTick) / 1000);
    }
    return accumulatedTime + elapsed;
  }

  function updatePlayTimeDisplay() {
    if (isOpen()) return; // 打开存档界面时暂停计时显示
    const now = Date.now();
    if (lastTick) {
      accumulatedTime += Math.floor((now - lastTick) / 1000);
    }
    lastTick = now;
  }

  function getChapterName(nodeId) {
    if (!nodeId) return '—';
    const map = {
      'ch1': '第一章', 'ch2': '第二章', 'ch3': '第三章',
      'ch4': '第四章', 'ch5': '第五章'
    };
    const key = nodeId.replace(/_.*/, '');
    return map[key] || nodeId;
  }

  function showToast(msg) {
    // 简单 toast 提示
    const existing = document.getElementById('saveload-toast');
    if (existing) existing.remove();

    const toast = document.createElement('div');
    toast.id = 'saveload-toast';
    toast.textContent = msg;
    toast.style.cssText = `
      position: fixed; top: 50%; left: 50%; transform: translate(-50%,-50%);
      background: rgba(0,0,0,0.85); color: #c9a96e;
      padding: 12px 24px; border-radius: 6px; font-size: 14px;
      z-index: 9999; pointer-events: none;
    `;
    document.body.appendChild(toast);
    setTimeout(() => toast.remove(), 2000);
  }

  // ============================================================
  // 事件监听
  // ============================================================

  EventBus.on('ui:openSave', () => open('save'));
  EventBus.on('ui:openLoad', () => open('load'));

  return {
    init,
    open,
    close,
    isOpen
  };
})(window.EventBus, window.GameState, window.StoryEngine, window.SaveManager);

window.SaveLoadUI = SaveLoadUI;
