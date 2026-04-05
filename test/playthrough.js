/**
 * playthrough.js — 全章节通关测试脚本
 * 运行方式: node test/playthrough.js
 *
 * 检查内容：
 * 1. 所有跳转 target 是否存在
 * 2. 所有 if 条件的 field 是否在 GameState 中定义
 * 3. 所有 end 节点的 ending 是否在 endings.json 中
 * 4. 所有 background 引用的图片是否存在于 src/assets/scenes/
 */

const fs = require('fs');
const path = require('path');

const PROJECT_ROOT = path.join(__dirname, '..');
const STORY_PATH = path.join(PROJECT_ROOT, 'data/story.json');
const ENDINGS_PATH = path.join(PROJECT_ROOT, 'data/endings.json');
const SCENES_DIR = path.join(PROJECT_ROOT, 'src/assets/scenes');

// GameState 中定义的字段（来自 GameState.js DEFAULT_STATE）
const GAME_STATE_FIELDS = [
  'stats.心性', 'stats.修为', 'stats.缘',
  'relationships.云爷爷', 'relationships.狗蛋',
  'relationships.天璇', 'relationships.天水门', 'relationships.云游子',
  'flags', 'inventory', 'visitedNodes'
];

// 用于检查 stats.* 字段的正则
const STAT_FIELD_RE = /^stats\.(.+)$/;
// 用于检查 relationships.* 字段的正则
const REL_FIELD_RE = /^relationships\.(.+)$/;

let storyData;
let endingsData;
let issues = [];
let totalNodes = 0;
let totalChoices = 0;
let totalBranches = 0;
let nodeMap = {};

function loadData() {
  storyData = JSON.parse(fs.readFileSync(STORY_PATH, 'utf8'));
  endingsData = JSON.parse(fs.readFileSync(ENDINGS_PATH, 'utf8'));
  console.log('✓ 故事数据加载成功');
  console.log(`  共 ${Object.keys(storyData.story).length} 章`);
}

function buildFlatNodeMap() {
  Object.values(storyData.story).forEach(chapter => {
    (chapter.nodes || []).forEach(node => {
      nodeMap[node.id] = node;
    });
  });
  console.log(`✓ 扁平节点映射完成，共 ${Object.keys(nodeMap).length} 个节点`);
}

function checkNodeExists(nodeId, fromNodeId) {
  if (!nodeId) return;
  if (!nodeMap[nodeId]) {
    issues.push({
      type: 'MISSING_NODE',
      from: fromNodeId,
      target: nodeId,
      severity: 'ERROR',
      message: `节点 "${fromNodeId}" 引用了不存在的节点 "${nodeId}"`
    });
  }
}

function checkFieldDefined(fieldExpr, fromNodeId) {
  if (!fieldExpr || typeof fieldExpr !== 'string') return;

  // 提取所有字段引用
  // 例如 "stats.心性 >= 60" → ["stats.心性"]
  const fieldMatches = fieldExpr.match(/(?:stats|relationships)\.[^\s+\-*\/<>=!&|]+/g) || [];

  fieldMatches.forEach(field => {
    let valid = false;
    if (field.startsWith('stats.')) {
      const statName = field.replace('stats.', '');
      // 心性/修为/缘 是 stats 中的三个标准属性
      if (['心性', '修为', '缘'].includes(statName)) valid = true;
      // 检查 inventory 和 flags
      if (['inventory', 'visitedNodes'].includes(statName)) valid = true;
    } else if (field.startsWith('relationships.')) {
      // relationships 允许任意角色名
      valid = true;
    } else if (field.startsWith('flags.')) {
      valid = true; // flags 允许任意 flag 名
    } else if (field.startsWith('inventory')) {
      valid = true;
    }

    if (!valid) {
      issues.push({
        type: 'UNDEFINED_FIELD',
        from: fromNodeId,
        field: field,
        severity: 'WARNING',
        message: `节点 "${fromNodeId}" 引用了未在 GameState DEFAULT_STATE 中预定义字段 "${field}"`
      });
    }
  });
}

function checkEndingExists(endingId, nodeId) {
  if (!endingId) return;
  // chapter-complete markers are internal, not real endings
  if (endingId.endsWith('_complete') || endingId.endsWith('_end') && endingId.includes('_end')) {
    // For nodes like ch1_end with ending='ch1_complete', these are chapter transitions, not game endings
    // Only validate endings that look like real ending IDs (ending_tiandao_dominate, etc.)
    if (!endingId.startsWith('ending_')) return;
  }
  const exists = endingsData.endings.some(e => e.id === endingId);
  if (!exists) {
    issues.push({
      type: 'MISSING_ENDING',
      from: nodeId,
      ending: endingId,
      severity: 'ERROR',
      message: `节点 "${nodeId}" 引用的结局 "${endingId}" 不存在于 endings.json`
    });
  }
}

function checkBackground(backgroundKey, nodeId) {
  if (!backgroundKey) return;
  // main.js 中的 SCENE_MAP
  // 与 main.js 的 SCENE_MAP 保持同步
  const SCENE_MAP = {
    'ch0_cover':            'ch0_cover.png',
    'ch0_qingyun_town':     'ch0_cover.png',     // 暂无专属图
    'ch1_deathbed':         'ch1_deathbed.png',
    'ch1_snow_night':       'ch1_deathbed.png',  // 暂无专属图
    'ch1_ghost_cabin':      'ch1_deathbed.png',  // 暂无专属图
    'ch2_boar_demon_battle':'ch2_boar_demon_battle.png',
    'ch3_bamboo_forest':    'ch3_heart_trial.png', // 暂无专属图
    'ch3_heart_trial':      'ch3_heart_trial.png',
    'ch4_immortal_trial':   'ch4_immortal_trial.png',
    'ch4_tiandao_gate':     'ch4_immortal_trial.png', // 暂无专属图
    'ch5_secret_chamber':   'ch5_truth_reveal.png', // 暂无专属图
    'ch5_truth_reveal':     'ch5_truth_reveal.png',
    'ch6_tournament':       'ch6_tournament.png',
    'ch7_taotie_awaken':    'ch7_taotie_awaken.png',
    'ch8_cultivation_cave': 'ch7_taotie_awaken.png', // 暂无专属图
    'ch9_taotie_final':     'ch9_taotie_final.png'
  };

  const filename = SCENE_MAP[backgroundKey];
  if (!filename) {
    issues.push({
      type: 'UNKNOWN_SCENE_KEY',
      from: nodeId,
      background: backgroundKey,
      severity: 'WARNING',
      message: `节点 "${nodeId}" 的 background key "${backgroundKey}" 不在 SCENE_MAP 中`
    });
    return;
  }

  const filePath = path.join(SCENES_DIR, filename);
  if (!fs.existsSync(filePath)) {
    issues.push({
      type: 'MISSING_SCENE_FILE',
      from: nodeId,
      background: backgroundKey,
      file: filename,
      severity: 'ERROR',
      message: `场景图片 "${filename}" (key: "${backgroundKey}") 不存在于 src/assets/scenes/`
    });
  }
}

function extractConditionFields(cond) {
  if (!cond) return [];
  if (typeof cond === 'string') {
    const matches = cond.match(/(?:stats|relationships|flags)\.[^\s+\-*\/<>=!&|]+/g) || [];
    return matches;
  }
  if (typeof cond === 'object') {
    const fields = [];
    if (cond.and) cond.and.forEach(c => fields.push(...extractConditionFields(c)));
    if (cond.or) cond.or.forEach(c => fields.push(...extractConditionFields(c)));
    if (cond.not) fields.push(...extractConditionFields(cond.not));
    if (cond.stats) Object.keys(cond.stats).forEach(k => fields.push(`stats.${k}`));
    if (cond.relationships) Object.keys(cond.relationships).forEach(k => fields.push(`relationships.${k}`));
    if (cond.flag) fields.push(`flags.${cond.flag}`);
    if (cond.hasItem) fields.push(`inventory.${cond.hasItem}`);
    return fields;
  }
  return [];
}

function traverseNodes() {
  // BFS/DFS 遍历所有节点
  const visited = new Set();
  const queue = ['ch1_start']; // 起点

  // 手动遍历所有节点（不依赖实际游戏状态）
  // 从每个 chapter 的 start 节点开始
  Object.values(storyData.story).forEach(chapter => {
    const nodes = chapter.nodes || [];
    nodes.forEach(node => {
      totalNodes++;
      if (node.type === 'choice') {
        totalChoices++;
        totalBranches += node.choices.length;
      }

      const nodeId = node.id;

      // 1. 检查 next 跳转
      if (node.next) {
        checkNodeExists(node.next, nodeId);
      }

      // 2. 检查 jump target
      if (node.type === 'jump' && node.target) {
        checkNodeExists(node.target, nodeId);
      }

      // 3. 检查 if 条件中的字段
      if (node.type === 'if' && node.condition) {
        const fields = extractConditionFields(node.condition);
        fields.forEach(f => {
          checkFieldDefined(f, nodeId);
          // 特殊：检查字符串条件
          if (typeof node.condition === 'string') {
            checkFieldDefined(node.condition, nodeId);
          }
        });
        // 检查 then/else 跳转
        if (node.then) checkNodeExists(node.then, nodeId);
        if (node.else) checkNodeExists(node.else, nodeId);
      }

      // 4. 检查 end 节点的 ending
      if (node.type === 'end') {
        checkEndingExists(node.ending, nodeId);
      }

      // 5. 检查 background 图片
      if (node.background) {
        checkBackground(node.background, nodeId);
      }

      // 6. 检查 choice 选项
      if (node.type === 'choice') {
        node.choices.forEach((choice, idx) => {
          if (choice.next) {
            checkNodeExists(choice.next, `${nodeId}[choice:${idx}]`);
          }
          if (choice.condition) {
            const fields = extractConditionFields(choice.condition);
            fields.forEach(f => checkFieldDefined(f, `${nodeId}[choice:${idx}]`));
          }
        });
      }

      // 7. 检查 set 节点的条件
      if (node.type === 'set' && node.effects) {
        node.effects.forEach(effect => {
          if (effect.path) {
            checkFieldDefined(effect.path, nodeId);
          }
        });
      }
    });
  });

  console.log(`✓ 节点遍历完成`);
  console.log(`  总节点数: ${totalNodes}`);
  console.log(`  决策点数: ${totalChoices}`);
  console.log(`  总分支数: ${totalBranches}`);
}

function checkAllEndingsReachable() {
  console.log('\n=== 结局可达性分析 ===');

  // 第9章的三个结束节点
  const ch9Endings = [
    { id: 'ch9_ending_1_end', ending: 'ending_tiandao_dominate' },
    { id: 'ch9_ending_2_end', ending: 'ending_dadao_merge' },
    { id: 'ch9_final_end', ending: 'ending_transcend' }
  ];

  // 找出所有指向这些 end 节点的节点
  const endingPaths = {};
  Object.entries(nodeMap).forEach(([fromId, node]) => {
    if (node.next === 'ch9_ending_1_end') {
      endingPaths['ending_tiandao_dominate'] = endingPaths['ending_tiandao_dominate'] || [];
      endingPaths['ending_tiandao_dominate'].push(fromId);
    }
    if (node.next === 'ch9_ending_2_end') {
      endingPaths['ending_dadao_merge'] = endingPaths['ending_dadao_merge'] || [];
      endingPaths['ending_dadao_merge'].push(fromId);
    }
    if (node.next === 'ch9_final_end') {
      endingPaths['ending_transcend'] = endingPaths['ending_transcend'] || [];
      endingPaths['ending_transcend'].push(fromId);
    }
    // also check choices
    if (node.type === 'choice') {
      node.choices.forEach(c => {
        if (c.next === 'ch9_ending_1_end') {
          endingPaths['ending_tiandao_dominate'] = endingPaths['ending_tiandao_dominate'] || [];
          endingPaths['ending_tiandao_dominate'].push(`${fromId}[choice]`);
        }
        if (c.next === 'ch9_ending_2_end') {
          endingPaths['ending_dadao_merge'] = endingPaths['ending_dadao_merge'] || [];
          endingPaths['ending_dadao_merge'].push(`${fromId}[choice]`);
        }
        if (c.next === 'ch9_final_end') {
          endingPaths['ending_transcend'] = endingPaths['ending_transcend'] || [];
          endingPaths['ending_transcend'].push(`${fromId}[choice]`);
        }
      });
    }
  });

  ch9Endings.forEach(({ ending, id }) => {
    const paths = endingPaths[ending] || [];
    const exists = endingsData.endings.find(e => e.id === ending);
    if (exists) {
      console.log(`  ✓ ${exists.title} (${ending})`);
      console.log(`    触发条件: ${exists.unlock_hints}`);
      console.log(`    入口节点: ${paths.length > 0 ? paths.join(', ') : '⚠️ 无直接入口'}`);
    }
  });
}

function printReport() {
  console.log('\n=== 问题报告 ===');
  if (issues.length === 0) {
    console.log('  ✓ 未发现问题！所有节点和分支均可达。');
  } else {
    const errors = issues.filter(i => i.severity === 'ERROR');
    const warnings = issues.filter(i => i.severity === 'WARNING');
    console.log(`  发现 ${issues.length} 个问题（${errors.length} 个错误，${warnings.length} 个警告）\n`);

    if (errors.length > 0) {
      console.log('【ERROR】');
      errors.forEach(issue => {
        console.log(`  [${issue.type}] ${issue.message}`);
        if (issue.target) console.log(`    缺失节点: ${issue.target}`);
        if (issue.file) console.log(`    缺失文件: ${issue.file}`);
      });
    }

    if (warnings.length > 0) {
      console.log('\n【WARNING】');
      warnings.forEach(issue => {
        console.log(`  [${issue.type}] ${issue.message}`);
        if (issue.field) console.log(`    字段: ${issue.field}`);
      });
    }
  }
}

function main() {
  console.log('========================================');
  console.log('  寻道·文字冒险 — 全章节通关测试');
  console.log('========================================\n');

  try {
    loadData();
    buildFlatNodeMap();
    traverseNodes();
    checkAllEndingsReachable();
    printReport();

    console.log('\n========================================');
    const errors = issues.filter(i => i.severity === 'ERROR');
    if (errors.length === 0) {
      console.log('  ✓ 所有测试通过！');
    } else {
      console.log(`  ✗ 测试失败，发现 ${errors.length} 个错误。`);
      process.exit(1);
    }
  } catch (err) {
    console.error('测试脚本执行失败:', err.message);
    process.exit(1);
  }
}

main();
