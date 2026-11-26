// State for The Family Ledger — the single source of truth.
// Loads the seed from data.js, persists every change to localStorage, and
// recomputes every total from the same data, so any edit re-renders every
// page consistently (dashboard cards, donut, bar chart, budget bars).

import { TRANSACTIONS_NOV, TRANSACTIONS_OCT, BUDGETS, GOALS, BILLS, CATEGORIES, MONTHLY_HISTORY } from './data.js';

const STORE_KEY = 'family-ledger-v1';

function clone(x) {
  return JSON.parse(JSON.stringify(x));
}

function defaultState() {
  return {
    month: '2026-11',
    transactions: { '2026-11': clone(TRANSACTIONS_NOV), '2026-10': clone(TRANSACTIONS_OCT) },
    budgets: clone(BUDGETS),
    goals: clone(GOALS),
    bills: clone(BILLS),
    appliedTips: [],
    memberFilter: 'All',
    txCategoryFilter: 'All',
    txTypeFilter: 'All',
    txSearch: '',
  };
}

export function loadState() {
  try {
    const raw = localStorage.getItem(STORE_KEY);
    if (raw) {
      const saved = JSON.parse(raw);
      const base = defaultState();
      return { ...base, ...saved, transactions: { ...base.transactions, ...(saved.transactions || {}) } };
    }
  } catch (e) {
    // Corrupt storage: fall back to the seed.
  }
  return defaultState();
}

export function saveState(state) {
  try {
    localStorage.setItem(STORE_KEY, JSON.stringify(state));
  } catch (e) {
    // Storage full or unavailable: the page still works in memory.
  }
}

// The one totals function every view uses.
export function computeTotals(state, month) {
  const list = state.transactions[month] || [];
  const member = state.memberFilter;
  const inScope = (t) => member === 'All' || t.owner === member;
  let income = 0;
  let expenses = 0;
  const byCategory = {};
  for (const cat of CATEGORIES) byCategory[cat.id] = 0;
  for (const t of list) {
    if (!inScope(t)) continue;
    if (t.type === 'income') income += t.amount;
    else {
      expenses += t.amount;
      if (t.category in byCategory) byCategory[t.category] += t.amount;
    }
  }
  const budget = state.budgets[month] || {};
  const budgetTotal = Object.values(budget).reduce((s, v) => s + v, 0);
  return { income, expenses, saved: income - expenses, byCategory, budgetTotal, count: list.length };
}

// Daily spend for the cashflow strip (selected month, all members).
export function dailySpend(state, month) {
  const daysInMonth = month === '2026-10' ? 31 : 30;
  const daily = [];
  for (let d = 1; d <= daysInMonth; d++) daily.push({ day: d, spent: 0 });
  for (const t of state.transactions[month] || []) {
    if (t.type !== 'expense') continue;
    const day = Number(t.date.slice(8, 10));
    if (day >= 1 && day <= daysInMonth) daily[day - 1].spent += t.amount;
  }
  return daily;
}

// 6-month history, recomputed for the selected month so the bar chart moves
// with the month switcher: earlier months keep their seed figures, the
// selected month uses the live totals.
export function historyFor(state, month) {
  const totals = computeTotals(state, month);
  const label = month === '2026-11' ? 'Nov' : 'Oct';
  return MONTHLY_HISTORY.map((m) =>
    m.month === label ? { month: m.month, income: totals.income, expenses: totals.expenses } : m,
  );
}

// Per-member spend for the dashboard mini card.
export function spendByMember(state, month) {
  const out = {};
  for (const t of state.transactions[month] || []) {
    if (t.type !== 'expense') continue;
    out[t.owner] = (out[t.owner] || 0) + t.amount;
  }
  return out;
}

export function categoryName(id) {
  const cat = CATEGORIES.find((c) => c.id === id);
  return cat ? cat.name : id;
}

export function categoryColor(id) {
  const cat = CATEGORIES.find((c) => c.id === id);
  return cat ? cat.color : '#999';
}

export function addTransaction(state, tx) {
  const month = tx.date.slice(0, 7);
  if (!state.transactions[month]) state.transactions[month] = [];
  state.transactions[month].push({ id: 'u' + Date.now().toString(36), ...tx });
  saveState(state);
}

export function deleteTransaction(state, id) {
  for (const month of Object.keys(state.transactions)) {
    state.transactions[month] = state.transactions[month].filter((t) => t.id !== id);
  }
  saveState(state);
}

export function addGoalAmount(state, goalId, amount) {
  const goal = state.goals.find((g) => g.id === goalId);
  if (goal) goal.saved = Math.min(goal.saved + amount, goal.target);
  saveState(state);
}

export function addGoal(state, goal) {
  state.goals.push({ id: 'g' + Date.now().toString(36), ...goal });
  saveState(state);
}

export function toggleBill(state, billId) {
  const bill = state.bills.find((b) => b.id === billId);
  if (bill) bill.paid = !bill.paid;
  saveState(state);
}

export function setBudget(state, month, category, amount) {
  if (!state.budgets[month]) state.budgets[month] = {};
  state.budgets[month][category] = amount;
  saveState(state);
}

export function applyTip(state, tipId) {
  if (!state.appliedTips.includes(tipId)) state.appliedTips.push(tipId);
  saveState(state);
}

export function unapplyTip(state, tipId) {
  state.appliedTips = state.appliedTips.filter((t) => t !== tipId);
  saveState(state);
}

// Money saved by applied tips, per category (used to trim budgets live).
export function tipSavingsByCategory(state, tips) {
  const out = {};
  for (const tip of tips) {
    if (state.appliedTips.includes(tip.id)) out[tip.category] = (out[tip.category] || 0) + tip.save;
  }
  return out;
}
