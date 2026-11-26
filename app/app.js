// The Family Ledger — entry script: hash router, nav state, event delegation.
// The only script index.html loads directly; views render, state.js owns data.

import {
  loadState, saveState, computeTotals, addTransaction, deleteTransaction,
  addGoalAmount, addGoal, toggleBill, setBudget, applyTip, unapplyTip,
} from './state.js';
import {
  renderDashboard, renderTransactions, renderBudgets, renderGoals,
  renderBills, renderCalculator, renderTips,
} from './views.js';
import { money } from './charts.js';

const state = loadState();
const viewEl = document.getElementById('view');
const navEl = document.getElementById('mainnav');
const morePanel = document.getElementById('morePanel');
const moreBtn = document.getElementById('moreBtn');

const ROUTES = {
  '': renderDashboard,
  'transactions': renderTransactions,
  'budgets': renderBudgets,
  'goals': renderGoals,
  'bills': renderBills,
  'calculator': renderCalculator,
  'tips': renderTips,
};

function route() {
  const hash = location.hash.replace(/^#\/?/, '').split('?')[0];
  const render = ROUTES[hash] || renderDashboard;
  viewEl.innerHTML = render(state);
  for (const link of navEl.querySelectorAll('a')) {
    const href = link.getAttribute('href') || '';
    const key = href.replace(/^#\/?/, '');
    link.classList.toggle('active', key === hash);
  }
  if (hash === 'calculator') {
    updateCalculator();
    updateSaver();
  }
  window.scrollTo(0, 0);
}

function rerender() {
  route();
}

// ---- Calculator (live, no page reload) ------------------------------------

function updateCalculator() {
  const input = document.getElementById('calc-income');
  const out = document.getElementById('calc-result');
  if (!input || !out) return;
  const income = Math.max(0, Number(input.value) || 0);
  const needs = Math.round(income * 0.5);
  const wants = Math.round(income * 0.3);
  const saved = income - needs - wants;
  out.innerHTML = `<div class="calc-result">
    <div class="calc-row"><span>Needs (50%)</span><b>${money(needs)}</b></div>
    <div class="calc-row"><span>Wants (30%)</span><b>${money(wants)}</b></div>
    <div class="calc-row"><span>Savings (20%)</span><b>${money(saved)}</b></div>
    <div class="split-bar"><div style="width:50%;background:#1d4d3b">Needs</div><div style="width:30%;background:#e8a33d">Wants</div><div style="width:20%;background:#3f8f6b">Saved</div></div>
    <p class="muted">On ${money(income)}/mo you could save ${money(saved)} every month — ${money(saved * 12)} a year.</p>
  </div>`;
}

function updateSaver() {
  const amountEl = document.getElementById('saver-amount');
  const monthsEl = document.getElementById('saver-months');
  const out = document.getElementById('saver-result');
  if (!amountEl || !monthsEl || !out) return;
  const p = Math.max(0, Number(amountEl.value) || 0);
  const n = Math.max(1, Math.min(360, Number(monthsEl.value) || 1));
  const r = 0.04 / 12;
  const total = p * (((1 + r) ** n - 1) / r);
  const paidIn = p * n;
  out.innerHTML = `<p class="saver-line">Saving <b>${money(p)}/month</b> for <b>${n} month${n > 1 ? 's' : ''}</b> at 4% interest grows to <b class="good-text">${money(total)}</b> — ${money(total - paidIn)} of it interest, on ${money(paidIn)} paid in.</p>`;
}

// ---- Events (one delegated listener for the whole app) ---------------------

document.addEventListener('click', (e) => {
  const el = e.target.closest('[data-action]');
  if (morePanel && !e.target.closest('.more-wrap')) morePanel.classList.remove('open');
  if (!el) return;
  const action = el.dataset.action;

  if (action === 'switch-month') {
    state.month = el.dataset.month;
    saveState(state);
    rerender();
  } else if (action === 'filter-member') {
    state.memberFilter = el.dataset.member;
    saveState(state);
    rerender();
  } else if (action === 'delete-tx') {
    deleteTransaction(state, el.dataset.id);
    rerender();
  } else if (action === 'goal-add') {
    addGoalAmount(state, el.dataset.id, 100);
    rerender();
  } else if (action === 'toggle-bill') {
    toggleBill(state, el.dataset.id);
    rerender();
  } else if (action === 'toggle-tip') {
    if (state.appliedTips.includes(el.dataset.id)) unapplyTip(state, el.dataset.id);
    else applyTip(state, el.dataset.id);
    rerender();
  } else if (action === 'calc-preset') {
    const input = document.getElementById('calc-income');
    if (input) input.value = el.dataset.income;
    document.querySelectorAll('[data-action="calc-preset"]').forEach((b) => b.classList.remove('active'));
    el.classList.add('active');
    updateCalculator();
  }
});

document.addEventListener('change', (e) => {
  const el = e.target.closest('[data-action]');
  if (!el) return;
  const action = el.dataset.action;
  if (action === 'filter-category') {
    state.txCategoryFilter = el.value;
    saveState(state);
    rerender();
  } else if (action === 'filter-type') {
    state.txTypeFilter = el.value;
    saveState(state);
    rerender();
  } else if (action === 'set-budget') {
    setBudget(state, state.month, el.dataset.category, Math.max(0, Number(el.value) || 0));
    rerender();
  } else if (action === 'calc-income') {
    updateCalculator();
  } else if (action === 'saver-input') {
    updateSaver();
  }
});

document.addEventListener('input', (e) => {
  const el = e.target.closest('[data-action]');
  if (!el) return;
  if (el.dataset.action === 'filter-search') {
    state.txSearch = el.value;
    // Re-render the list without losing focus: only the table body changes.
    const current = document.activeElement;
    rerender();
    const again = document.querySelector('[data-action="filter-search"]');
    if (again && current && current.dataset.action === 'filter-search') {
      again.focus();
      again.setSelectionRange(again.value.length, again.value.length);
    }
  } else if (el.dataset.action === 'calc-income') {
    updateCalculator();
  } else if (el.dataset.action === 'saver-input') {
    updateSaver();
  }
});

document.addEventListener('submit', (e) => {
  const form = e.target.closest('form[data-action]');
  if (!form) return;
  e.preventDefault();
  const data = new FormData(form);
  if (form.dataset.action === 'add-tx') {
    addTransaction(state, {
      date: String(data.get('date')),
      desc: String(data.get('desc')).trim(),
      category: String(data.get('category')),
      amount: Math.max(1, Number(data.get('amount')) || 0),
      type: String(data.get('type')),
      owner: String(data.get('owner')),
    });
    location.hash = '#/transactions';
    rerender();
  } else if (form.dataset.action === 'add-goal') {
    addGoal(state, {
      name: String(data.get('name')).trim(),
      target: Math.max(50, Number(data.get('target')) || 0),
      saved: Math.max(0, Number(data.get('saved')) || 0),
      note: 'Added by the family',
    });
    rerender();
  } else if (form.dataset.action === 'saver-form') {
    updateSaver();
  }
});

if (moreBtn && morePanel) {
  moreBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    morePanel.classList.toggle('open');
  });
}

window.addEventListener('hashchange', route);
route();
