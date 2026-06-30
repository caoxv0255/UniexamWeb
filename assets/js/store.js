// 数据层：IndexedDB 封装 + localStorage 设置

import { uid, todayTs } from './utils.js';

const DB_NAME = 'study-platform';
const DB_VERSION = 2;
let dbPromise = null;

function openDB() {
  if (dbPromise) return dbPromise;
  dbPromise = new Promise((resolve, reject) => {
    const req = indexedDB.open(DB_NAME, DB_VERSION);
    req.onupgradeneeded = (e) => {
      const db = e.target.result;
      if (!db.objectStoreNames.contains('progress')) {
        const s = db.createObjectStore('progress', { keyPath: 'id' });
        s.createIndex('subjectId', 'subjectId', { unique: false });
      }
      if (!db.objectStoreNames.contains('reviews')) {
        const s = db.createObjectStore('reviews', { keyPath: 'cardId' });
        s.createIndex('dueDate', 'dueDate', { unique: false });
        s.createIndex('subjectId', 'subjectId', { unique: false });
      }
      if (!db.objectStoreNames.contains('favorites')) {
        db.createObjectStore('favorites', { keyPath: 'id' });
      }
      if (!db.objectStoreNames.contains('wrongAnswers')) {
        const s = db.createObjectStore('wrongAnswers', { keyPath: 'id' });
        s.createIndex('subjectId', 'subjectId', { unique: false });
        s.createIndex('reviewed', 'reviewed', { unique: false });
      }
      if (!db.objectStoreNames.contains('notes')) {
        const s = db.createObjectStore('notes', { keyPath: 'id' });
        s.createIndex('subjectId', 'subjectId', { unique: false });
        s.createIndex('kpId', 'kpId', { unique: false });
        s.createIndex('updatedAt', 'updatedAt', { unique: false });
      }
      // ===== 题库系统独立 store =====
      if (!db.objectStoreNames.contains('qbFavorites')) {
        const s = db.createObjectStore('qbFavorites', { keyPath: 'id' });
        s.createIndex('questionId', 'questionId', { unique: false });
        s.createIndex('subjectId', 'subjectId', { unique: false });
      }
      if (!db.objectStoreNames.contains('qbWrongAnswers')) {
        const s = db.createObjectStore('qbWrongAnswers', { keyPath: 'id' });
        s.createIndex('questionId', 'questionId', { unique: false });
        s.createIndex('subjectId', 'subjectId', { unique: false });
        s.createIndex('type', 'type', { unique: false });
        s.createIndex('reviewed', 'reviewed', { unique: false });
      }
      if (!db.objectStoreNames.contains('qbAttempts')) {
        const s = db.createObjectStore('qbAttempts', { keyPath: 'id' });
        s.createIndex('questionId', 'questionId', { unique: false });
        s.createIndex('subjectId', 'subjectId', { unique: false });
        s.createIndex('type', 'type', { unique: false });
        s.createIndex('createdAt', 'createdAt', { unique: false });
      }
    };
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error);
  });
  return dbPromise;
}

function tx(store, mode = 'readonly') {
  return openDB().then((db) => db.transaction(store, mode).objectStore(store));
}

export function dbGet(store, key) {
  return tx(store).then((s) => new Promise((res, rej) => {
    const r = s.get(key);
    r.onsuccess = () => res(r.result);
    r.onerror = () => rej(r.error);
  }));
}

export function dbGetAll(store) {
  return tx(store).then((s) => new Promise((res, rej) => {
    const r = s.getAll();
    r.onsuccess = () => res(r.result || []);
    r.onerror = () => rej(r.error);
  }));
}

export function dbPut(store, value) {
  return tx(store, 'readwrite').then((s) => new Promise((res, rej) => {
    const r = s.put(value);
    r.onsuccess = () => res(value);
    r.onerror = () => rej(r.error);
  }));
}

export function dbDelete(store, key) {
  return tx(store, 'readwrite').then((s) => new Promise((res, rej) => {
    const r = s.delete(key);
    r.onsuccess = () => res(true);
    r.onerror = () => rej(r.error);
  }));
}

export function dbClear(store) {
  return tx(store, 'readwrite').then((s) => new Promise((res, rej) => {
    const r = s.clear();
    r.onsuccess = () => res(true);
    r.onerror = () => rej(r.error);
  }));
}

export function dbByIndex(store, indexName, value) {
  return tx(store).then((s) => new Promise((res, rej) => {
    const idx = s.index(indexName);
    const r = idx.getAll(value);
    r.onsuccess = () => res(r.result || []);
    r.onerror = () => rej(r.error);
  }));
}

// ===== 进度 =====
export async function markLearned(typeId, subjectId) {
  await dbPut('progress', { id: typeId, subjectId, learnedAt: Date.now() });
}
export async function unmarkLearned(typeId) {
  await dbDelete('progress', typeId);
}
export async function isLearned(typeId) {
  const r = await dbGet('progress', typeId);
  return !!r;
}
export async function getLearnedIds(subjectId) {
  const all = subjectId
    ? await dbByIndex('progress', 'subjectId', subjectId)
    : await dbGetAll('progress');
  return new Set(all.map((r) => r.id));
}
export async function getChapterProgress(subjectData, chapterId) {
  const chapter = subjectData.chapters.find((c) => c.id === chapterId);
  if (!chapter) return { learned: 0, total: 0 };
  const total = chapter.questionTypes.length;
  const learnedIds = await getLearnedIds(subjectData.id);
  const learned = chapter.questionTypes.filter((q) => learnedIds.has(q.id)).length;
  return { learned, total };
}
export async function getSubjectProgress(subjectData) {
  const total = subjectData.chapters.reduce((s, c) => s + c.questionTypes.length, 0);
  const learnedIds = await getLearnedIds(subjectData.id);
  const learned = subjectData.chapters
    .flatMap((c) => c.questionTypes)
    .filter((q) => learnedIds.has(q.id)).length;
  const p = total ? Math.round((learned / total) * 100) : 0;
  return { learned, total, pct: p };
}

// ===== 收藏 =====
export async function toggleFavorite(typeId, subjectId) {
  const id = `${subjectId}:${typeId}`;
  const exists = await dbGet('favorites', id);
  if (exists) {
    await dbDelete('favorites', id);
    return false;
  }
  await dbPut('favorites', { id, typeId, subjectId, addedAt: Date.now() });
  return true;
}
export async function isFavorite(typeId) {
  const all = await dbGetAll('favorites');
  return all.some((f) => f.typeId === typeId);
}
export async function getFavorites(subjectId) {
  const all = await dbGetAll('favorites');
  return subjectId ? all.filter((f) => f.subjectId === subjectId) : all;
}

// ===== 错题 =====
export async function addWrongAnswer(quizId, subjectId, userAns, correctAns) {
  const all = await dbGetAll('wrongAnswers');
  const existing = all.find((w) => w.quizId === quizId);
  if (existing) {
    existing.userAns = userAns;
    existing.markedAt = Date.now();
    existing.reviewed = false;
    await dbPut('wrongAnswers', existing);
    return existing;
  }
  const record = {
    id: uid('wrong'), quizId, subjectId, userAns, correctAns,
    markedAt: Date.now(), reviewed: false,
  };
  await dbPut('wrongAnswers', record);
  return record;
}
export async function getWrongAnswers(subjectId) {
  const all = await dbGetAll('wrongAnswers');
  const filtered = subjectId ? all.filter((w) => w.subjectId === subjectId) : all;
  return filtered.sort((a, b) => b.markedAt - a.markedAt);
}
export async function markWrongReviewed(id) {
  const r = await dbGet('wrongAnswers', id);
  if (r) {
    r.reviewed = true;
    await dbPut('wrongAnswers', r);
  }
}
export async function deleteWrongAnswer(id) {
  await dbDelete('wrongAnswers', id);
}

// ===== 题库系统：收藏 =====
export async function toggleFavoriteQuestion(questionId, subjectId) {
  const id = `${subjectId}:${questionId}`;
  const exists = await dbGet('qbFavorites', id);
  if (exists) {
    await dbDelete('qbFavorites', id);
    return false;
  }
  await dbPut('qbFavorites', { id, questionId, subjectId, addedAt: Date.now() });
  return true;
}
export async function isFavoriteQuestion(questionId) {
  const list = await dbByIndex('qbFavorites', 'questionId', questionId);
  return list.length > 0;
}
export async function getFavoriteQuestions(subjectId) {
  const all = subjectId
    ? await dbByIndex('qbFavorites', 'subjectId', subjectId)
    : await dbGetAll('qbFavorites');
  return all.sort((a, b) => b.addedAt - a.addedAt);
}

// ===== 题库系统：错题 =====
export async function addWrongQuestion(questionId, subjectId, type, difficulty, userScore, maxScore, userAnswer, correctAnswer) {
  const list = await dbByIndex('qbWrongAnswers', 'questionId', questionId);
  const existing = list.find((w) => !w.reviewed);
  if (existing) {
    existing.userScore = userScore;
    existing.maxScore = maxScore;
    existing.userAnswer = userAnswer;
    existing.correctAnswer = correctAnswer;
    existing.markedAt = Date.now();
    existing.reviewed = false;
    await dbPut('qbWrongAnswers', existing);
    return existing;
  }
  const record = {
    id: uid('qbwrong'), questionId, subjectId, type, difficulty,
    userScore, maxScore, userAnswer, correctAnswer,
    markedAt: Date.now(), reviewed: false,
  };
  await dbPut('qbWrongAnswers', record);
  return record;
}
export async function getWrongQuestions(subjectId, type, reviewed) {
  let all = await dbGetAll('qbWrongAnswers');
  if (subjectId) all = all.filter((w) => w.subjectId === subjectId);
  if (type) all = all.filter((w) => w.type === type);
  if (reviewed != null) all = all.filter((w) => w.reviewed === reviewed);
  return all.sort((a, b) => b.markedAt - a.markedAt);
}
export async function markWrongQuestionReviewed(id) {
  const r = await dbGet('qbWrongAnswers', id);
  if (r) {
    r.reviewed = true;
    r.reviewedAt = Date.now();
    await dbPut('qbWrongAnswers', r);
  }
}
export async function deleteWrongQuestion(id) {
  await dbDelete('qbWrongAnswers', id);
}

// ===== 题库系统：作答历史 =====
export async function recordAttempt(questionId, subjectId, type, difficulty, userScore, maxScore, userAnswer) {
  const record = {
    id: uid('qbattempt'), questionId, subjectId, type, difficulty,
    userScore, maxScore, userAnswer,
    createdAt: Date.now(),
  };
  await dbPut('qbAttempts', record);
  return record;
}
export async function getAttempts(questionId) {
  if (questionId) return dbByIndex('qbAttempts', 'questionId', questionId);
  return dbGetAll('qbAttempts');
}

// ===== 笔记 =====
export async function saveNote(note) {
  if (!note.id) note.id = uid('note');
  note.updatedAt = Date.now();
  await dbPut('notes', note);
  return note;
}
export async function getNote(id) {
  return dbGet('notes', id);
}
export async function getNotes(subjectId) {
  const all = await dbGetAll('notes');
  const filtered = subjectId ? all.filter((n) => n.subjectId === subjectId) : all;
  return filtered.sort((a, b) => b.updatedAt - a.updatedAt);
}
export async function getNotesByKp(kpId) {
  return dbByIndex('notes', 'kpId', kpId);
}
export async function deleteNote(id) {
  await dbDelete('notes', id);
}

// ===== 记忆卡片 =====
export async function getCard(cardId) {
  return dbGet('reviews', cardId);
}
export async function putCard(card) {
  await dbPut('reviews', card);
  return card;
}
export async function getAllCards() {
  return dbGetAll('reviews');
}
export async function getDueCards(dateTs) {
  const all = await dbGetAll('reviews');
  return all.filter((c) => c.dueDate <= dateTs)
    .sort((a, b) => a.dueDate - b.dueDate);
}
export async function getNewCards(limit) {
  const all = await dbGetAll('reviews');
  return all.filter((c) => c.repetitions === 0).slice(0, limit);
}
export async function getCardsBySubject(subjectId) {
  return dbByIndex('reviews', 'subjectId', subjectId);
}

// ===== localStorage 设置 =====
export function getSetting(key, def) {
  try {
    const v = localStorage.getItem('sp:' + key);
    return v === null ? def : JSON.parse(v);
  } catch {
    return def;
  }
}
export function setSetting(key, value) {
  try {
    localStorage.setItem('sp:' + key, JSON.stringify(value));
  } catch {}
}

// ===== 导入/导出 =====
export async function exportAll() {
  const [progress, reviews, favorites, wrongAnswers, notes, qbFavorites, qbWrongAnswers, qbAttempts] = await Promise.all([
    dbGetAll('progress'),
    dbGetAll('reviews'),
    dbGetAll('favorites'),
    dbGetAll('wrongAnswers'),
    dbGetAll('notes'),
    dbGetAll('qbFavorites'),
    dbGetAll('qbWrongAnswers'),
    dbGetAll('qbAttempts'),
  ]);
  const settings = {};
  for (let i = 0; i < localStorage.length; i++) {
    const k = localStorage.key(i);
    if (k && k.startsWith('sp:')) settings[k] = localStorage.getItem(k);
  }
  return {
    version: 1,
    exportedAt: Date.now(),
    progress, reviews, favorites, wrongAnswers, notes,
    qbFavorites, qbWrongAnswers, qbAttempts, settings,
  };
}

export async function importAll(data) {
  if (!data || data.version !== 1) throw new Error('备份文件版本不兼容');
  await Promise.all([
    dbClear('progress'), dbClear('reviews'), dbClear('favorites'),
    dbClear('wrongAnswers'), dbClear('notes'),
    dbClear('qbFavorites'), dbClear('qbWrongAnswers'), dbClear('qbAttempts'),
  ]);
  const stores = ['progress', 'reviews', 'favorites', 'wrongAnswers', 'notes', 'qbFavorites', 'qbWrongAnswers', 'qbAttempts'];
  for (const s of stores) {
    const items = data[s] || [];
    for (const item of items) await dbPut(s, item);
  }
  if (data.settings) {
    for (const [k, v] of Object.entries(data.settings)) {
      try { localStorage.setItem(k, v); } catch {}
    }
  }
  return true;
}

export async function clearAll() {
  await Promise.all([
    dbClear('progress'), dbClear('reviews'), dbClear('favorites'),
    dbClear('wrongAnswers'), dbClear('notes'),
    dbClear('qbFavorites'), dbClear('qbWrongAnswers'), dbClear('qbAttempts'),
  ]);
  const keys = [];
  for (let i = 0; i < localStorage.length; i++) {
    const k = localStorage.key(i);
    if (k && k.startsWith('sp:')) keys.push(k);
  }
  keys.forEach((k) => localStorage.removeItem(k));
}
