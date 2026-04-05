/**
 * main.js — 游戏入口
 * 负责初始化各模块、加载剧情数据、启动游戏
 */
const Main = (function (EventBus, GameState, StoryEngine, TextDisplay, ChoiceMenu, SaveManager, SaveLoadUI, AudioManager, TapTapSDK) {
  'use strict';

  /** @type {string} 剧情数据路径 */
  const STORY_DATA_PATH = 'data/story.json';

  /** 场景图片基础路径（GitHub Pages 从 dist/ 目录发布） */
  const SCENE_BASE = 'dist/assets/scenes/';

  /** 场景 ID → 文件名 映射（基于可用资源） */
  const SCENE_MAP = {
    'ch0_cover':            'ch0_cover.png',
    'ch0_qingyun_town':     'ch0_cover.png',     // TODO: replace with ch0_qingyun_town.png (待替换为专属背景图)
    'ch1_deathbed':         'ch1_deathbed.png',
    'ch1_snow_night':       'ch1_deathbed.png',  // TODO: replace with ch1_snow_night.png (待替换为专属背景图)
    'ch1_ghost_cabin':      'ch1_deathbed.png',  // TODO: replace with ch1_ghost_cabin.png (待替换为专属背景图)
    'ch2_boar_demon_battle':'ch2_boar_demon_battle.png',
    'ch3_bamboo_forest':    'ch3_heart_trial.png', // TODO: replace with ch3_bamboo_forest.png (待替换为专属背景图)
    'ch3_heart_trial':      'ch3_heart_trial.png',
    'ch4_immortal_trial':   'ch4_immortal_trial.png',
    'ch4_tiandao_gate':     'ch4_immortal_trial.png', // TODO: replace with ch4_tiandao_gate.png (待替换为专属背景图)
    'ch5_secret_chamber':   'ch5_truth_reveal.png', // TODO: replace with ch5_secret_chamber.png (待替换为专属背景图)
    'ch5_truth_reveal':      'ch5_truth_reveal.png',
    'ch6_tournament':       'ch6_tournament.png',
    'ch7_taotie_awaken':    'ch7_taotie_awaken.png',
    'ch8_cultivation_cave': 'ch7_taotie_awaken.png', // TODO: replace with ch8_cultivation_cave.png (待替换为专属背景图)
    'ch9_taotie_final':     'ch9_taotie_final.png'
  };

  /** 章节名映射 */
  const CHAPTER_NAMES = {
    ch1_start: '第一章·青云少年',
    ch2_start: '第二章·仙缘初显',
    ch3_start: '第三章·踏上道途'
  };

  // ============================================================
  // 初始化
  // ============================================================

  async function init() {
    console.log('[Main] 寻道·文字冒险 初始化中...');

    // 初始化各模块
    SaveManager.init();
    SaveLoadUI.init();

    // 绑定 UI 元素
    TextDisplay.init({
      speakerEl: '#hud-speaker',
      textEl: '#dialogue-text',
      containerEl: '#game-container',
      clickHintEl: '#click-hint'
    });

    ChoiceMenu.init({
      container: '#choice-container',
      prompt: '#choice-prompt',
      list: '#choice-list'
    });

    // HUD 刷新
    EventBus.on('state:change', updateHUD);
    EventBus.on('relation:change', updateHUD);
    EventBus.on('inventory:add', updateHUD);
    EventBus.on('inventory:remove', updateHUD);
    EventBus.on('node:enter', onNodeEnter);

    // dialogue:show → 调用 TextDisplay 显示文字
    EventBus.on('dialogue:show', function (data) {
      TextDisplay.show(data.text, data.speaker);
    });

    // 对话完成 → 继续下一个节点
    EventBus.on('text:complete', function (data) {
      const currentNode = StoryEngine.getCurrentNodeId();
      const node = StoryEngine.getNode(currentNode);
      if (node && node.next) {
        // 有 next 节点，等待用户点击继续
        // dialogue:complete 事件由 handleClick 触发
      }
    });

    // 点击继续 → 跳转到 next 节点
    EventBus.on('dialogue:complete', function () {
      const currentNode = StoryEngine.getCurrentNodeId();
      const node = StoryEngine.getNode(currentNode);
      if (node && node.next) {
        StoryEngine.goToNode(node.next);
      }
    });

    // 选项选择 → 处理效果并跳转
    EventBus.on('choice:select', function (choiceIndex) {
      StoryEngine.handleChoiceSelect(choiceIndex);
    });

    // 游戏结束
    EventBus.on('game:end', function (data) {
      const endScreen = document.getElementById('end-screen');
      const endTitle = document.getElementById('end-title');
      const endMessage = document.getElementById('end-message');
      if (endTitle) endTitle.textContent = data.message || '游戏结束';
      if (endMessage) endMessage.textContent = data.title || '感谢游玩';
      if (endScreen) endScreen.classList.add('visible');
      // TapTap 评分（仅在真正结束时提示一次）
      setTimeout(() => {
        TapTapSDK.requestScore({
          title: '给寻道打分',
          content: '喜欢寻道吗？给我们打个分吧！'
        });
      }, 3000);
    });

    // 绑定速度滑块
    bindSpeedSlider();

    // 绑定静音按钮
    EventBus.on('audio:mute', function (data) {
      const muteBtn = document.getElementById('mute-btn');
      if (muteBtn) muteBtn.textContent = data.muted ? '🔇' : '🔊';
    });

    // 加载剧情数据
    await loadStory();

    // 启动游戏
    GameState.init();
    updateHUD();
    StoryEngine.goToNode('ch1_start');

    console.log('[Main] 初始化完成');
  }

  // ============================================================
  // 剧情加载
  // ============================================================

  async function loadStory() {
    try {
      // 使用 XMLHttpRequest 替代 fetch（兼容 file:// 协议，无 CORS 限制）
      const data = await new Promise((resolve, reject) => {
        const xhr = new XMLHttpRequest();
        xhr.open('GET', STORY_DATA_PATH, true);
        xhr.onreadystatechange = () => {
          if (xhr.readyState === 4) {
            if (xhr.status === 0 || xhr.status === 200) {
              try { resolve(JSON.parse(xhr.responseText)); }
              catch (e) { reject(new Error('JSON parse error: ' + e.message)); }
            } else { reject(new Error(`HTTP ${xhr.status}`)); }
          }
        };
        xhr.onerror = () => reject(new Error('Network error'));
        xhr.send(null);
      });

      // 将嵌套格式转换为扁平格式：story.nodes[nodeId]
      const flatNodes = {};

      // 遍历所有章节
      const chapters = data.story || data;
      for (const chKey in chapters) {
        const chapter = chapters[chKey];
        if (chapter && chapter.nodes) {
          chapter.nodes.forEach(node => {
            if (node.id) {
              flatNodes[node.id] = node;
            }
          });
        }
      }

      const flatData = {
        title: data.meta ? data.meta.title : '寻道·文字冒险',
        nodes: flatNodes
      };

      StoryEngine.loadStory(flatData);
      console.log('[Main] 剧情数据加载成功:', flatData.title);
      console.log('[Main] 共加载', Object.keys(flatNodes).length, '个节点');
    } catch (err) {
      console.error('[Main] 剧情加载失败:', err);
      const textEl = document.getElementById('dialogue-text');
      if (textEl) textEl.textContent = '剧情加载失败，请刷新重试。';
    }
  }

  // ============================================================
  // HUD 更新
  // ============================================================

  function updateHUD() {
    const state = GameState.getState();

    // 基础属性
    const xinXingEl = document.getElementById('stat-xinxing-val');
    const xiuWeiEl = document.getElementById('stat-xiuwei-val');
    const yuanEl = document.getElementById('stat-yuan-val');
    if (xinXingEl) xinXingEl.textContent = state.stats['心性'] || 0;
    if (xiuWeiEl) xiuWeiEl.textContent = state.stats['修为'] || 0;
    if (yuanEl) yuanEl.textContent = state.stats['缘'] || 0;

    // 面板属性
    const panelXinXing = document.getElementById('panel-xinxing');
    const panelXiuWei = document.getElementById('panel-xiuwei');
    const panelYuan = document.getElementById('panel-yuan');
    if (panelXinXing) panelXinXing.textContent = state.stats['心性'] || 0;
    if (panelXiuWei) panelXiuWei.textContent = state.stats['修为'] || 0;
    if (panelYuan) panelYuan.textContent = state.stats['缘'] || 0;

    // 好感度
    const relEl = document.getElementById('panel-relations');
    if (relEl) {
      const rels = state.relationships || {};
      const entries = Object.entries(rels);
      if (entries.length === 0) {
        relEl.innerHTML = '<div class="stats-row"><span class="stats-row-name">暂无记录</span></div>';
      } else {
        relEl.innerHTML = entries.map(([name, val]) => `
          <div class="stats-row">
            <span class="stats-row-name">${name}</span>
            <span class="stats-row-value">${val}</span>
          </div>
        `).join('');
      }
    }

    // 道具
    const invEl = document.getElementById('panel-inventory');
    const invSection = document.getElementById('panel-inventory-section');
    if (invEl && invSection) {
      const items = state.inventory || [];
      if (items.length === 0) {
        invSection.style.display = 'none';
      } else {
        invSection.style.display = 'block';
        invEl.innerHTML = items.map(item => `
          <div class="stats-row">
            <span class="stats-row-name">${item}</span>
          </div>
        `).join('');
      }
    }

    // 剧情标记
    const flagsEl = document.getElementById('panel-flags');
    if (flagsEl) {
      const flags = state.flags || {};
      const entries = Object.entries(flags).filter(([, v]) => v === true);
      if (entries.length === 0) {
        flagsEl.innerHTML = '<div class="stats-row"><span class="stats-row-name">—</span></div>';
      } else {
        flagsEl.innerHTML = entries.map(([flag]) => `
          <div class="stats-row">
            <span class="stats-row-name">✓ ${flag}</span>
          </div>
        `).join('');
      }
    }
  }

  /**
   * 节点进入事件 → 更新背景图和章节名
   */
  function onNodeEnter(data) {
    const node = data.node;
    const nodeId = data.nodeId;

    // 更新章节名
    const chapterEl = document.getElementById('hud-chapter');
    if (chapterEl) {
      const chapterName = getChapterName(nodeId);
      chapterEl.textContent = chapterName;
    }

    // 更新背景图
    if (node && node.background) {
      setBackground(node.background);
    } else if (node && node.scene) {
      // 尝试从 scene 名称推断 background
      const bg = inferBackground(node.scene, nodeId);
      if (bg) setBackground(bg);
    }
  }

  function getChapterName(nodeId) {
    if (!nodeId) return '序章';
    const prefix = nodeId.replace(/_.*/, '');
    return CHAPTER_NAMES[prefix] || CHAPTER_NAMES[prefix.replace('ch', 'ch') + '_start'] || prefix;
  }

  function inferBackground(scene, nodeId) {
    // 从 scene 名称推断背景 key
    if (!scene) return null;
    const lower = scene.toLowerCase();
    if (lower.includes('老槐树') || lower.includes('青云镇')) return 'ch0_qingyun_town';
    if (lower.includes('断崖') || lower.includes('石台')) return 'ch1_deathbed';
    if (lower.includes('问心') || lower.includes('幻境')) return 'ch3_heart_trial';
    if (lower.includes('天门') || lower.includes('天道宗')) return 'ch4_tiandao_gate';
    if (lower.includes('妖兽') || lower.includes('野猪')) return 'ch2_boar_demon_battle';
    if (lower.includes('竹') || lower.includes('林')) return 'ch3_bamboo_forest';
    return null;
  }

  /**
   * 切换背景图（带淡入效果）
   * @param {string} sceneKey - 场景 key，如 'ch1_deathbed'
   */
  function setBackground(sceneKey) {
    const bgLayer = document.getElementById('bg-layer');
    if (!bgLayer) return;

    const filename = SCENE_MAP[sceneKey];
    if (!filename) return;

    const newSrc = `url('${SCENE_BASE}${filename}')`;

    // 如果相同则不切换
    if (bgLayer.style.backgroundImage === newSrc) return;

    bgLayer.style.backgroundImage = newSrc;
    bgLayer.classList.remove('bg-fade-in');
    void bgLayer.offsetWidth; // 触发重排以重置动画
    bgLayer.classList.add('bg-fade-in');
  }

  // ============================================================
  // 速度滑块
  // ============================================================

  function bindSpeedSlider() {
    const slider = document.getElementById('speed-slider');
    if (!slider) return;

    slider.addEventListener('input', () => {
      const level = parseInt(slider.value);
      TextDisplay.setSpeedLevel(level);
      // 滑块旁显示速度指示
      const label = document.getElementById('speed-label');
      if (label) {
        const chars = ['🐢', '▶', '▶▶', '▶▶▶', '⚡'];
        label.textContent = chars[level - 1] || '▶';
      }
    });
  }

  // ============================================================
  // 公开 API（供 HTML 调用）
  // ============================================================

  /** 继续游戏 */
  function continueGame() {
    EventBus.emit('dialogue:complete', {});
  }

  /** 重新开始 */
  function restartGame() {
    if (confirm('确定要重新开始吗？当前进度将丢失。')) {
      GameState.init();
      SaveManager.remove(0);
      StoryEngine.goToNode('ch1_start');
      updateHUD();
    }
  }

  /** 打开存档界面 */
  function openSaveUI() {
    SaveLoadUI.open('save');
  }

  /** 打开读档界面 */
  function openLoadUI() {
    SaveLoadUI.open('load');
  }

  /** 切换数值面板 */
  function toggleStatsPanel() {
    const panel = document.getElementById('stats-panel');
    if (!panel) return;
    panel.classList.toggle('visible');
    if (panel.classList.contains('visible')) {
      updateHUD();
    }
  }

  /** 关闭数值面板 */
  function closeStatsPanel() {
    const panel = document.getElementById('stats-panel');
    if (panel) panel.classList.remove('visible');
  }

  /** 切换静音 */
  function toggleMute() {
    AudioManager.toggleMute();
  }

  /** 请求评分 */
  function requestScore() {
    TapTapSDK.requestScore({
      title: '给寻道打分',
      content: '喜欢寻道吗？给我们打个分吧！'
    });
  }

  /** 分享 */
  function shareGame() {
    TapTapSDK.share({
      title: '寻道·文字冒险',
      content: '我在玩寻道，一款修仙剧情向文字冒险游戏！'
    });
  }

  // 绑定 HUD 数值点击 → 弹出详情面板
  function bindStatsPanelToggle() {
    document.querySelectorAll('.hud-stat').forEach(el => {
      el.addEventListener('click', (e) => {
        e.stopPropagation();
        const panel = document.getElementById('stats-panel');
        if (panel && panel.classList.contains('visible')) {
          panel.classList.remove('visible');
        } else if (panel) {
          updateHUD();
          panel.classList.add('visible');
        }
      });
    });

    const closeBtn = document.getElementById('stats-panel-close');
    if (closeBtn) closeBtn.addEventListener('click', closeStatsPanel);

    // 点击空白处关闭
    document.addEventListener('click', (e) => {
      const panel = document.getElementById('stats-panel');
      if (panel && panel.classList.contains('visible') &&
          !panel.contains(e.target) && !e.target.closest('.hud-stat')) {
        panel.classList.remove('visible');
      }
    });
  }

  // 暴露到全局
  window.GameMain = {
    continueGame,
    restartGame,
    openSaveUI,
    openLoadUI,
    toggleStatsPanel,
    closeStatsPanel,
    toggleMute,
    requestScore,
    shareGame
  };

  // DOM Ready 后启动
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      init();
      bindStatsPanelToggle();
    });
  } else {
    init();
    bindStatsPanelToggle();
  }

})(window.EventBus, window.GameState, window.StoryEngine, window.TextDisplay,
   window.ChoiceMenu, window.SaveManager, window.SaveLoadUI,
   window.AudioManager, window.TapTapSDK);
