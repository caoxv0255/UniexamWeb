// 离线校验题库中所有 LaTeX 公式语法
import katex from 'katex';
import { QUESTIONS } from '../assets/data/quizzes.js';

const FIELDS = ['description', 'answer', 'answerDetail', 'explain'];

function extractTexBlocks(text) {
  const blocks = [];
  if (typeof text !== 'string') return blocks;
  // 块级公式 $$...$$
  const blockRe = /\$\$([\s\S]+?)\$\$/g;
  let m;
  while ((m = blockRe.exec(text))) blocks.push({ tex: m[1], display: true });
  // 行内公式 $...$（排除已被块级占用的）
  const inlineRe = /\$([^$\n]+?)\$/g;
  while ((m = inlineRe.exec(text))) blocks.push({ tex: m[1], display: false });
  return blocks;
}

function validateQuestion(q) {
  const errors = [];
  FIELDS.forEach((field) => {
    const val = q[field];
    const blocks = extractTexBlocks(val);
    blocks.forEach(({ tex, display }) => {
      try {
        katex.renderToString(tex, { throwOnError: true, displayMode: display });
      } catch (e) {
        errors.push({ field, tex, message: e.message });
      }
    });
  });
  // 选项
  if (Array.isArray(q.opts)) {
    q.opts.forEach((opt, idx) => {
      extractTexBlocks(opt).forEach(({ tex, display }) => {
        try {
          katex.renderToString(tex, { throwOnError: true, displayMode: display });
        } catch (e) {
          errors.push({ field: `opts[${idx}]`, tex, message: e.message });
        }
      });
    });
  }
  // 评分标准
  if (Array.isArray(q.rubric)) {
    q.rubric.forEach((r, idx) => {
      extractTexBlocks(r.item).forEach(({ tex, display }) => {
        try {
          katex.renderToString(tex, { throwOnError: true, displayMode: display });
        } catch (e) {
          errors.push({ field: `rubric[${idx}].item`, tex, message: e.message });
        }
      });
    });
  }
  return errors;
}

let total = 0;
let failed = 0;
const summary = [];

for (const q of QUESTIONS) {
  total++;
  const errs = validateQuestion(q);
  if (errs.length) {
    failed++;
    summary.push({ id: q.id, title: q.title, errors: errs });
  }
}

if (failed) {
  console.error(`❌ 校验失败：${failed}/${total} 道题存在 LaTeX 错误`);
  for (const item of summary) {
    console.error(`\n[${item.id}] ${item.title}`);
    for (const e of item.errors) {
      console.error(`  字段 ${e.field}: ${e.message}\n    tex: ${e.tex.slice(0, 120)}`);
    }
  }
  process.exit(1);
} else {
  console.log(`✅ ${total} 道题的 LaTeX 公式全部校验通过`);
  process.exit(0);
}
