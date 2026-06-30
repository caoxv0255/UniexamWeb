// 艾宾浩斯记忆曲线 / SM-2 改进算法（纯函数）
import { todayTs, addDays } from './utils.js';

export const RATINGS = {
  again: 0,  // 不会，重置
  hard: 1,   // 困难
  good: 2,   // 记得
  easy: 3,   // 简单
};

export const RATING_LABELS = {
  again: '不会', hard: '困难', good: '记得', easy: '简单',
};

// 艾宾浩斯经典复习间隔（天）：首次学后 20分/1天/2天/4天/7天/15天
// SM-2 在此基础上根据评分动态调整
const EB_INTERVALS = [0, 1, 2, 4, 7, 15, 30];

export function newCard(cardId, subjectId) {
  return {
    cardId,
    subjectId,
    easeFactor: 2.5,
    interval: 0,
    repetitions: 0,
    dueDate: todayTs(),
    lastReview: 0,
    history: [],
  };
}

// 调度核心：根据评分计算下次复习时间
export function schedule(card, rating, now = Date.now()) {
  const c = { ...card, history: [...(card.history || [])] };
  let { easeFactor, interval, repetitions } = c;

  if (rating === 'again') {
    repetitions = 0;
    interval = 0;
    // 当天重见：设为明天
    c.dueDate = addDays(todayTs(), 1);
  } else if (rating === 'hard') {
    easeFactor = Math.max(1.3, easeFactor - 0.15);
    interval = repetitions === 0 ? 1 : Math.max(1, Math.round(interval * 1.2));
    repetitions += 1;
    c.dueDate = addDays(todayTs(), interval);
  } else if (rating === 'good') {
    repetitions += 1;
    easeFactor = Math.max(1.3, easeFactor);
    interval = nextInterval(repetitions, interval, easeFactor);
    c.dueDate = addDays(todayTs(), interval);
  } else if (rating === 'easy') {
    repetitions += 1;
    easeFactor = Math.min(3.0, easeFactor + 0.15);
    interval = nextInterval(repetitions, interval, easeFactor, 1.3);
    c.dueDate = addDays(todayTs(), interval);
  }

  c.easeFactor = easeFactor;
  c.interval = interval;
  c.repetitions = repetitions;
  c.lastReview = now;
  c.history.push({ date: now, rating, interval });
  return c;
}

function nextInterval(repetitions, prevInterval, easeFactor, multiplier = 1) {
  // 前几次用艾宾浩斯固定间隔，之后用 SM-2 公式
  if (repetitions <= 6 && EB_INTERVALS[repetitions] != null) {
    return Math.max(EB_INTERVALS[repetitions], Math.round(prevInterval * easeFactor * multiplier));
  }
  return Math.max(1, Math.round(prevInterval * easeFactor * multiplier));
}

export function isDue(card, dateTs = todayTs()) {
  return card.dueDate <= dateTs;
}

export function masteryLevel(card) {
  const r = card.repetitions;
  if (r === 0) return { level: 'new', label: '新学', color: '#94a3b8' };
  if (r <= 2) return { level: 'familiar', label: '熟悉', color: '#fbbf24' };
  if (r <= 5) return { level: 'mastered', label: '掌握', color: '#34d399' };
  return { level: 'expert', label: '精通', color: '#60a5fa' };
}

// 未来 7 天每日到期数
export function forecastNextWeek(cards) {
  const start = todayTs();
  const days = [0, 0, 0, 0, 0, 0, 0];
  for (const c of cards) {
    const diff = Math.floor((c.dueDate - start) / 86400000);
    if (diff >= 0 && diff < 7) days[diff]++;
  }
  return days;
}

// 遗忘曲线保留率：R = e^(-t/S)，S 由平均间隔推算
export function retentionRate(daysAfter, avgInterval) {
  const S = Math.max(1, avgInterval || 1);
  return Math.exp(-daysAfter / S);
}
