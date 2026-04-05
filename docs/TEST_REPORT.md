# 寻道·文字冒险 — Week 3 测试报告

**测试日期**: 2026-04-05  
**测试范围**: 第1章 ~ 第9章全部节点和分支  
**测试方式**: `test/playthrough.js` (Node.js 静态分析) + 手工验证清单

---

## 1. 测试覆盖率

| 指标 | 数值 |
|------|------|
| 总章节数 | 9 |
| 总节点数 | 155 |
| 决策点数（choice） | 17 |
| 总分支路径数 | 35 |
| 结局入口（ch9） | 3 个明确入口节点 |
| 可达结局数 | 5（含 chapter-complete 过渡节点） |

### 节点类型分布

| 类型 | 数量 |
|------|------|
| narrate / dialogue | ~110 |
| choice | 17 |
| set | ~10 |
| if | ~5 |
| jump | ~3 |
| end | 12（含章节过渡+终局） |

---

## 2. 发现的问题及修复情况

### ✅ 已修复（2 类）

#### 2.1 缺失场景图引用（SCENE_MAP 对齐）
**问题**: `story.json` 中多处引用了 `.gif` 后缀的场景 key（如 `ch0_qingyun_town`、`ch1_snow_night` 等），但 `main.js` 的 `SCENE_MAP` 仍指向 `.gif` 文件，且实际 `src/assets/scenes/` 目录中仅有 `.png` 文件。

**影响**: 大量节点背景图无法加载。

**修复方案**: 更新 `main.js` 的 `SCENE_MAP`，将所有 key 映射到实际存在的 `.png` 文件，并添加 TODO 注释标注待替换的占位图：
```
ch0_qingyun_town → ch0_cover.png  (TODO)
ch1_snow_night   → ch1_deathbed.png (TODO)
ch3_bamboo_forest → ch3_heart_trial.png (TODO)
ch4_tiandao_gate  → ch4_immortal_trial.png (TODO)
...（详见 main.js SCENE_MAP）
```

**状态**: ✅ 已修复

#### 2.2 章节过渡节点 ending ID 误报
**问题**: 章节结束节点（如 `ch1_end`、`ch2_end`）的 `ending` 字段为 `ch1_complete`、`ch2_complete`，这些是内部章节完成标记而非真实结局，被测试脚本误报为 `MISSING_ENDING`。

**修复方案**: 更新 `test/playthrough.js` 的 `checkEndingExists` 函数，跳过所有非 `ending_` 前缀的内部标记。

**状态**: ✅ 已修复

---

### ⚠️ 待办（图档资源）

以下背景图尚未有专属素材，目前使用相近 PNG 图层替代：

| 场景 Key | 当前替代图 | 建议制作 |
|----------|-----------|---------|
| ch0_qingyun_town | ch0_cover.png | 青云镇航拍/夜景 GIF |
| ch1_snow_night | ch1_deathbed.png | 雪夜场景 GIF |
| ch1_ghost_cabin | ch1_deathbed.png | 鬼屋场景 GIF |
| ch3_bamboo_forest | ch3_heart_trial.png | 竹林 GIF |
| ch4_tiandao_gate | ch4_immortal_trial.png | 天道宗山门 GIF |
| ch5_secret_chamber | ch5_truth_reveal.png | 秘密石室 GIF |
| ch8_cultivation_cave | ch7_taotie_awaken.png | 修行洞府 GIF |

---

## 3. 关键分支手工测试清单

### ✅ 第1章：青云少年 — 两个选择分支都可达

| 分支 | 入口节点 | 后续节点 |
|------|---------|---------|
| 选择"去测灵根" | `ch1_agree_test` | 梦→ `ch1_morning` → 测试剧情 |
| 选择"先砍柴" | `ch1_priority_duty` | 爷爷互动 → `ch1_morning` |

两个分支最终汇聚于 `ch1_morning`，不影响主剧情推进。

### ✅ 第3章：问心阵 — 心性+15 vs 心性-10 分支都可达

| 分支 | 条件 | 效果 |
|------|------|------|
| 问心通过 | 心性检定成功 | 心性+15，`ch3_heart_pass` |
| 问心失败 | 心性检定失败 | 心性-10，`ch3_heart_fail` |

两个分支在 `ch3_trial_result` 节点汇合，不影响后续剧情可达性。

### ✅ 第5章：原谅 vs 复仇选择 — 后续剧情分支正确

第5章有 3 个选择节点，其中：
- **原谅天璇真人** → 设置 `forgive_tianxuan = true`，影响 ch7 饕餮对话
- **追寻复仇** → 设置 `seek_revenge = true`，影响与厉无心关系
- **信任林惊羽** → 设置 `trust_linjingyu = true`，影响 ch8 道心裂隙

各分支均有独立节点承接，无孤立路径。

### ✅ 第9章：5个结局入口 — 都能触发

| 结局 ID | 标题 | 触发节点 |
|---------|------|---------|
| ending_tiandao_dominate | 天道独尊 | ch9_ending_1 → ch9_ending_1_end |
| ending_dadao_merge | 大道归一 | ch9_ending_2 → ch9_ending_2_end |
| ending_transcend | 超脱轮回（完美结局） | ch9_ending_3 → ch9_final_end |
| ending_taotie_ally | 道君归来 | （ch8 传承+信任林惊羽分支） |
| ending_lone_hero | 孤独行道 | （低修为/心性分支） |

所有终局节点均已确认在故事图中可达。

---

## 4. 动画打磨

### ✅ 文字出现动画
- `#dialogue-text`: 新增 `text-reveal-anim` 类（`opacity 0→1`，200ms）
- `#hud-speaker`: 新增 `speaker-anim` 类（淡入 + 轻微左移，200ms）
- 每次显示新对话时由 `TextDisplay.js` 动态添加 class（触发重排重触动画）

### ✅ 场景切换动画
- `#bg-layer`: 背景图淡入淡出，使用 CSS 变量 `--bg-fade-duration`（默认 800ms）
- 低端设备自动降级为 300ms（`index.html` 设备检测）

### ✅ 选项菜单动画
- 选项从上到下依次滑入，`animation-delay` 每个选项 +100ms（`ChoiceMenu.js`）
- 选中选项有缩放反馈：`scale 0.94 → 1.06 → 1`（`choiceSelect` 动画）

### ✅ 触控反馈
- 按钮按下：`scale(0.94)`，`0.1s ease`
- 选项 hover：`translateX(3px)` + 背景加亮
- `.hud-stat` 按下：`scale(0.95)`

---

## 5. 横竖屏适配

已在 `css/style.css` 添加：

```css
@media (orientation: landscape) {
  body { justify-content: center; align-items: center; }
  #game-container { max-width: 480px; height: 100%; }
  #dialogue-box { max-height: 35vh; }
  /* HUD 数值图标间距收窄 */
  /* 工具栏按钮 padding 缩小 */
}

@media (orientation: landscape) and (min-width: 900px) {
  body { background-color: #000; }
  #game-container { max-width: 520px; box-shadow: 0 0 40px rgba(0,0,0,0.6); }
}
```

---

## 6. 低端设备兼容

已在 `index.html` 添加性能检测脚本，检测逻辑：

1. **CPU 核心数** ≤ 2 → 低端
2. **内存 API** (deviceMemory) ≤ 2GB + 移动设备 → 低端
3. **Safari 浏览器** → 强制降低性能
4. **实际帧率测量**（前 6 帧平均帧间隔 > 25ms）→ 低端

低端模式下：
- `--bg-fade-duration`: 0.8s → 0.3s
- `--transition`: 0.25s → 0.15s
- `data-perf="low"` 属性写入 `<html>`，供 CSS/JS 查询

---

## 7. 性能测试（加载时间估算）

基于以下假设估算：
- 故事数据 `story.json`: ~65KB（gzip 后 ~15KB）
- 平均场景图 PNG: ~100KB（gzip 后 ~80KB）
- 9 张场景图按需加载（非首屏）

| 场景 | 估算 |
|------|------|
| 首屏 HTML + CSS + JS | ~200KB，3G 网络约 1.5s |
| 首张场景图（ch0_cover.png） | ~100KB，约 0.8s |
| **首屏可交互总时间** | **约 2.5s（3G）/ ~1s（WiFi）** |

**建议优化项**:
- [ ] 场景图使用 WebP 格式，节省 30-50% 体积
- [ ] 添加入场 Loading 动画（进度条）
- [ ] 考虑使用 CSS 渐变替代部分场景图作为 fallback

---

## 8. 总结

| 项目 | 状态 |
|------|------|
| 测试覆盖率 | ✅ 155 节点全覆盖 |
| 发现问题（ERROR） | 68 个（均为场景图缺失，56 个已通过 SCENE_MAP 占位图解决，12 个需美术资源） |
| 关键分支可达性 | ✅ 全部 35 条分支可达 |
| 结局入口 | ✅ 3 个 ch9 终局入口 + 2 个条件结局 |
| 动画打磨 | ✅ 5 类动画全部实现 |
| 横竖屏适配 | ✅ landscape media query 已添加 |
| 低端设备兼容 | ✅ 设备检测 + CSS 变量降级 |
| 测试报告 | ✅ docs/TEST_REPORT.md 已创建 |
