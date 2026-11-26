// Views for The Family Ledger — one render function per route.
// Each returns HTML for <main id="view"> and wires its own controls
// through data-action attributes handled by app.js.

import { CATEGORIES, FAMILY, TIPS } from './data.js';
import { donutChart, barChart, cashflowStrip, money } from './charts.js';
import {
  computeTotals, dailySpend, historyFor, spendByMember, categoryName, categoryColor,
  tipSavingsByCategory,
} from './state.js';

export function esc(s) {
  return String(s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
}

function pct(part, whole) {
  return whole > 0 ? Math.round((part / whole) * 100) : 0;
}

function progressBar(value, max, over) {
  const w = Math.min(100, Math.round((value / Math.max(max, 1)) * 100));
  return `<div class="bar"><div class="bar-fill${over ? ' over' : ''}" style="width:${w}%"></div></div>`;
}

function monthSwitcher(state) {
  return `<div class="switcher" role="group" aria-label="Month">
    <button data-action="switch-month" data-month="2026-10" class="${state.month === '2026-10' ? 'active' : ''}">October</button>
    <button data-action="switch-month" data-month="2026-11" class="${state.month === '2026-11' ? 'active' : ''}">November</button>
  </div>`;
}

function memberPills(state) {
  const members = ['All', ...FAMILY.members];
  return `<div class="pills" role="group" aria-label="Filter by family member">
    ${members.map((m) => `<button data-action="filter-member" data-member="${esc(m)}" class="pill${state.memberFilter === m ? ' active' : ''}">${esc(m)}</button>`).join('')}
  </div>`;
}

// ---- Dashboard -----------------------------------------------------------

export function renderDashboard(state) {
  const t = computeTotals(state, state.month);
  const label = FAMILY.monthLabel[state.month];
  const rows = CATEGORIES.filter((c) => c.id !== 'savings' && c.id !== 'income')
    .map((c) => ({ name: c.name, color: c.color, value: t.byCategory[c.id] || 0 }))
    .filter((r) => r.value > 0)
    .sort((a, b) => b.value - a.value);
  const top3 = [...rows].slice(0, 3);
  const budget = state.budgets[state.month] || {};
  const daysLeft = state.month === '2026-11' ? 30 - 26 : 0; // today is 26 Nov
  const budgetLeft = Object.keys(budget)
    .filter((k) => k !== 'savings')
    .reduce((s, k) => s + Math.max(0, budget[k] - (t.byCategory[k] || 0)), 0);
  const safePerDay = daysLeft > 0 ? budgetLeft / daysLeft : budgetLeft;
  const recent = [...(state.transactions[state.month] || [])]
    .filter((x) => x.type === 'expense')
    .sort((a, b) => b.date.localeCompare(a.date))
    .slice(0, 5);
  const upcoming = state.bills.filter((b) => !b.paid).sort((a, b) => a.due - b.due).slice(0, 3);
  const byMember = spendByMember(state, state.month);
  const memberRows = FAMILY.members.map((m) => ({ name: m, value: byMember[m] || 0 }));
  const memberMax = Math.max(...memberRows.map((m) => m.value), 1);

  return `
  <div class="page-head">
    <div><h1>Good evening, Marlowe family</h1><p class="sub">Here is your money for ${esc(label)} — every figure updates as you edit.</p></div>
    ${monthSwitcher(state)}
  </div>
  ${memberPills(state)}
  <section class="cards" aria-label="Month summary">
    <div class="card stat"><span class="stat-label">Income</span><span class="stat-num">${money(t.income)}</span><span class="stat-note">Salaries + $150 refund</span></div>
    <div class="card stat"><span class="stat-label">Expenses</span><span class="stat-num">${money(t.expenses)}</span><span class="stat-note">${t.count} transactions</span></div>
    <div class="card stat good"><span class="stat-label">Saved</span><span class="stat-num">${money(t.saved)}</span><span class="stat-note">${pct(t.saved, t.income)}% of income</span></div>
    <div class="card stat"><span class="stat-label">Balance</span><span class="stat-num">${money(t.saved)}</span><span class="stat-note">Carried into December</span></div>
  </section>
  <section class="card safe-strip">
    <div><strong>Safe to spend today: ${money(safePerDay)}</strong><span class="muted"> — ${money(budgetLeft)} of budget left ÷ ${daysLeft} days left in November</span></div>
    <a class="btn small" href="#/budgets">See budgets</a>
  </section>
  <section class="grid-2">
    <div class="card">
      <h2>Where the money went</h2>
      <div class="donut-wrap">
        ${donutChart(rows)}
        <ul class="legend">${rows.map((r) => `<li><span class="swatch" style="background:${r.color}"></span>${esc(r.name)}<b>${money(r.value)}</b></li>`).join('')}</ul>
      </div>
    </div>
    <div class="card">
      <h2>Income vs expenses — 6 months</h2>
      ${barChart(historyFor(state, state.month))}
      <p class="muted">November is your best saving month yet: ${money(t.saved)} kept of ${money(t.income)} earned.</p>
    </div>
  </section>
  <section class="card">
    <h2>Daily spending — November</h2>
    ${cashflowStrip(dailySpend(state, state.month), state.bills.map((b) => b.due))}
  </section>
  <section class="grid-3">
    <div class="card">
      <h2>Top budgets</h2>
      ${top3.map((r) => {
        const cat = CATEGORIES.find((c) => c.name === r.name);
        const b = budget[cat.id] || 0;
        return `<div class="budget-row"><div class="budget-top"><span>${esc(r.name)}</span><span>${money(r.value)} of ${money(b)}</span></div>${progressBar(r.value, b, r.value > b)}<span class="muted">${r.value > b ? 'Over by ' + money(r.value - b) : money(b - r.value) + ' left'}</span></div>`;
      }).join('')}
      <a class="btn small" href="#/budgets">All budgets</a>
    </div>
    <div class="card">
      <h2>Upcoming bills</h2>
      ${upcoming.map((b) => `<div class="bill-line"><span><b>${esc(b.name)}</b><span class="muted"> due ${b.due} Nov</span></span><b>${money(b.amount)}</b></div>`).join('')}
      <a class="btn small" href="#/bills">All bills</a>
    </div>
    <div class="card">
      <h2>Recent spending</h2>
      ${recent.map((x) => `<div class="bill-line"><span><b>${esc(x.desc)}</b><span class="muted"> ${x.date.slice(5)} · ${esc(categoryName(x.category))}</span></span><b>−${money(x.amount)}</b></div>`).join('')}
      <a class="btn small" href="#/transactions">All transactions</a>
    </div>
  </section>
  <section class="card">
    <h2>Spending per family member — ${esc(label)}</h2>
    <div class="member-grid">${memberRows.map((m) => `<div class="member-row"><span>${esc(m.name)}</span><div class="bar"><div class="bar-fill" style="width:${Math.round((m.value / memberMax) * 100)}%"></div></div><b>${money(m.value)}</b></div>`).join('')}</div>
  </section>`;
}

// ---- Transactions --------------------------------------------------------

export function renderTransactions(state) {
  const list = [...(state.transactions[state.month] || [])].sort((a, b) => b.date.localeCompare(a.date));
  const q = (state.txSearch || '').toLowerCase();
  const filtered = list.filter((t) =>
    (state.txCategoryFilter === 'All' || t.category === state.txCategoryFilter) &&
    (state.txTypeFilter === 'All' || t.type === state.txTypeFilter) &&
    (state.memberFilter === 'All' || t.owner === state.memberFilter) &&
    (!q || t.desc.toLowerCase().includes(q)),
  );
  const inc = filtered.filter((t) => t.type === 'income').reduce((s, t) => s + t.amount, 0);
  const exp = filtered.filter((t) => t.type === 'expense').reduce((s, t) => s + t.amount, 0);
  const catOptions = ['All', ...CATEGORIES.map((c) => c.id), 'income']
    .map((c) => `<option value="${c}"${state.txCategoryFilter === c ? ' selected' : ''}>${c === 'All' ? 'All categories' : c === 'income' ? 'Income' : esc(categoryName(c))}</option>`).join('');

  return `
  <div class="page-head"><div><h1>Transactions</h1><p class="sub">${esc(FAMILY.monthLabel[state.month])} — ${filtered.length} shown of ${list.length}.</p></div>${monthSwitcher(state)}</div>
  ${memberPills(state)}
  <section class="card">
    <div class="filters">
      <select data-action="filter-category" aria-label="Filter by category">${catOptions}</select>
      <select data-action="filter-type" aria-label="Filter by type">
        <option value="All"${state.txTypeFilter === 'All' ? ' selected' : ''}>Income + expenses</option>
        <option value="income"${state.txTypeFilter === 'income' ? ' selected' : ''}>Income only</option>
        <option value="expense"${state.txTypeFilter === 'expense' ? ' selected' : ''}>Expenses only</option>
      </select>
      <input type="search" data-action="filter-search" placeholder="Search transactions…" value="${esc(state.txSearch || '')}" aria-label="Search transactions">
    </div>
    <div class="totals-line"><span>Income shown: <b class="good-text">${money(inc)}</b></span><span>Expenses shown: <b>${money(exp)}</b></span><span>Net: <b>${money(inc - exp)}</b></span></div>
    <div class="table-wrap"><table>
      <thead><tr><th>Date</th><th>Description</th><th>Who</th><th>Category</th><th class="num">Amount</th><th></th></tr></thead>
      <tbody>${filtered.map((t) => `<tr>
        <td>${t.date.slice(5)}</td>
        <td>${esc(t.desc)}</td>
        <td><span class="owner-badge">${esc(t.owner)}</span></td>
        <td>${t.category === 'income' ? 'Income' : esc(categoryName(t.category))}</td>
        <td class="num ${t.type === 'income' ? 'good-text' : ''}">${t.type === 'income' ? '+' : '−'}${money(t.amount)}</td>
        <td><button class="btn danger small" data-action="delete-tx" data-id="${t.id}">Delete</button></td>
      </tr>`).join('') || '<tr><td colspan="6">No transactions match these filters.</td></tr>'}</tbody>
    </table></div>
  </section>
  <section class="card">
    <h2>Add a transaction</h2>
    <form data-action="add-tx" class="form-grid">
      <label>Description<input name="desc" required maxlength="80" placeholder="e.g. Weekly shop at Aldi"></label>
      <label>Amount ($)<input name="amount" type="number" min="1" step="1" required placeholder="85"></label>
      <label>Category<select name="category">${CATEGORIES.filter((c) => c.id !== 'savings').map((c) => `<option value="${c.id}">${esc(c.name)}</option>`).join('')}</select></label>
      <label>Date<input name="date" type="date" value="${state.month}-26" required></label>
      <label>Type<select name="type"><option value="expense">Expense</option><option value="income">Income</option></select></label>
      <label>Who<select name="owner">${FAMILY.members.map((m) => `<option>${esc(m)}</option>`).join('')}</select></label>
      <button class="btn" type="submit">Add transaction</button>
    </form>
  </section>`;
}

// ---- Budgets ---------------------------------------------------------------

export function renderBudgets(state) {
  const t = computeTotals(state, state.month);
  const budget = state.budgets[state.month] || {};
  const tipSave = tipSavingsByCategory(state, TIPS);
  const needsCats = ['housing', 'food', 'transport', 'utilities', 'health', 'education'];
  const wantsCats = ['kids', 'leisure'];
  const needs = needsCats.reduce((s, c) => s + (t.byCategory[c] || 0), 0);
  const wants = wantsCats.reduce((s, c) => s + (t.byCategory[c] || 0), 0);
  const total = Math.max(t.income, 1);
  const rows = CATEGORIES.filter((c) => c.id !== 'savings').map((c) => {
    const spent = t.byCategory[c.id] || 0;
    const planned = budget[c.id] || 0;
    const cut = tipSave[c.id] || 0;
    const effective = Math.max(0, planned - cut);
    const over = spent > effective;
    return `<div class="budget-card card">
      <div class="budget-top"><span class="budget-name"><span class="swatch" style="background:${c.color}"></span>${esc(c.name)}</span>
      <label class="budget-edit">$<input type="number" min="0" step="5" value="${planned}" data-action="set-budget" data-category="${c.id}" aria-label="Budget for ${esc(c.name)}"> / mo</label></div>
      ${progressBar(spent, effective, over)}
      <div class="budget-figures"><span>Spent <b>${money(spent)}</b></span><span class="${over ? 'over-text' : ''}">${over ? 'Over by ' + money(spent - effective) : money(effective - spent) + ' left'}</span></div>
      ${cut > 0 ? `<p class="muted tip-note">Tip applied: −${money(cut)}/mo, effective budget ${money(effective)} (was ${money(planned)}).</p>` : ''}
    </div>`;
  }).join('');

  return `
  <div class="page-head"><div><h1>Budgets</h1><p class="sub">Monthly plan for ${esc(FAMILY.monthLabel[state.month])} — edit any amount, the bars move at once.</p></div>${monthSwitcher(state)}</div>
  <section class="card">
    <h2>The 50 / 30 / 20 split — actual vs target</h2>
    <div class="split-bar">
      <div style="width:${pct(needs, total)}%;background:#1d4d3b">Needs ${pct(needs, total)}%</div>
      <div style="width:${pct(wants, total)}%;background:#e8a33d">Wants ${pct(wants, total)}%</div>
      <div style="width:${pct(t.saved, total)}%;background:#3f8f6b">Saved ${pct(t.saved, total)}%</div>
    </div>
    <div class="split-legend">
      <span><b>Needs ${money(needs)}</b> — target 50% (${money(t.income * 0.5)})</span>
      <span><b>Wants ${money(wants)}</b> — target 30% (${money(t.income * 0.3)})</span>
      <span><b>Saved ${money(t.saved)}</b> — target 20% (${money(t.income * 0.2)})</span>
    </div>
    <p class="muted">Housing is the squeeze: needs run at ${pct(needs, total)}% of income, so wants stay lean at ${pct(wants, total)}% and savings beat the 20% target.</p>
  </section>
  <section class="budget-grid">${rows}</section>`;
}

// ---- Goals -----------------------------------------------------------------

export function renderGoals(state) {
  return `
  <div class="page-head"><div><h1>Savings goals</h1><p class="sub">Three things the Marlowe family is saving for — tap “Add $100” and watch the bar move.</p></div></div>
  <section class="goal-grid">
    ${state.goals.map((g) => `<div class="card goal-card">
      <h2>${esc(g.name)}</h2>
      <p class="goal-nums"><b>${money(g.saved)}</b> of ${money(g.target)}</p>
      ${progressBar(g.saved, g.target, false)}
      <p class="muted">${pct(g.saved, g.target)}% there · ${money(g.target - g.saved)} to go</p>
      <p>${esc(g.note)}</p>
      <button class="btn small" data-action="goal-add" data-id="${g.id}" ${g.saved >= g.target ? 'disabled' : ''}>Add $100</button>
      ${g.saved >= g.target ? '<span class="good-text">Goal reached!</span>' : ''}
    </div>`).join('')}
  </section>
  <section class="card">
    <h2>Start a new goal</h2>
    <form data-action="add-goal" class="form-grid">
      <label>Goal name<input name="name" required maxlength="60" placeholder="e.g. Christmas fund"></label>
      <label>Target ($)<input name="target" type="number" min="50" step="10" required placeholder="1000"></label>
      <label>Already saved ($)<input name="saved" type="number" min="0" step="10" value="0" required></label>
      <button class="btn" type="submit">Create goal</button>
    </form>
  </section>`;
}

// ---- Bills -----------------------------------------------------------------

export function renderBills(state) {
  const due = state.bills.filter((b) => !b.paid).reduce((s, b) => s + b.amount, 0);
  const paid = state.bills.filter((b) => b.paid).reduce((s, b) => s + b.amount, 0);
  return `
  <div class="page-head"><div><h1>Bills</h1><p class="sub">Recurring bills for November 2026 — mark one paid and the totals move.</p></div></div>
  <section class="cards three">
    <div class="card stat"><span class="stat-label">Still due this month</span><span class="stat-num">${money(due)}</span><span class="stat-note">${state.bills.filter((b) => !b.paid).length} bills unpaid</span></div>
    <div class="card stat"><span class="stat-label">Already paid</span><span class="stat-num good-text">${money(paid)}</span><span class="stat-note">${state.bills.filter((b) => b.paid).length} bills paid</span></div>
    <div class="card stat"><span class="stat-label">Total monthly bills</span><span class="stat-num">${money(due + paid)}</span><span class="stat-note">8 recurring bills</span></div>
  </section>
  <section class="card">
    <div class="table-wrap"><table>
      <thead><tr><th>Bill</th><th>Due</th><th class="num">Amount</th><th>Status</th><th></th></tr></thead>
      <tbody>${[...state.bills].sort((a, b) => a.due - b.due).map((b) => `<tr>
        <td><b>${esc(b.name)}</b><br><span class="muted">${esc(categoryName(b.category))}</span></td>
        <td>${b.due} Nov</td>
        <td class="num">${money(b.amount)}</td>
        <td>${b.paid ? '<span class="badge paid">Paid</span>' : '<span class="badge due">Due</span>'}</td>
        <td><button class="btn small" data-action="toggle-bill" data-id="${b.id}">${b.paid ? 'Mark unpaid' : 'Mark paid'}</button></td>
      </tr>`).join('')}</tbody>
    </table></div>
    <p class="muted">Rent is the big one — $1,850 on the 1st. Paying bills on time keeps the family credit score healthy and avoids late fees.</p>
  </section>`;
}

// ---- Calculator ------------------------------------------------------------

export function renderCalculator(state) {
  const t = computeTotals(state, state.month);
  const needs = ['housing', 'food', 'transport', 'utilities', 'health', 'education'].reduce((s, c) => s + (t.byCategory[c] || 0), 0);
  const wants = (t.byCategory.kids || 0) + (t.byCategory.leisure || 0);
  return `
  <div class="page-head"><div><h1>50 / 30 / 20 calculator</h1><p class="sub">Split any after-tax income into needs, wants and savings — then compare it with the Marlowe family’s real November.</p></div></div>
  <section class="grid-2">
    <div class="card">
      <h2>Your income</h2>
      <label class="big-input">Monthly after-tax income ($)
        <input type="number" id="calc-income" min="0" step="50" value="6850" data-action="calc-income">
      </label>
      <div class="pills">
        <button class="pill" data-action="calc-preset" data-income="4500">$4,500</button>
        <button class="pill active" data-action="calc-preset" data-income="6850">$6,850 · Marlowe</button>
        <button class="pill" data-action="calc-preset" data-income="9000">$9,000</button>
      </div>
      <div id="calc-result"></div>
    </div>
    <div class="card">
      <h2>Marlowe actual — November</h2>
      <div class="calc-compare">
        <div class="compare-row"><span>Needs</span><div class="bar"><div class="bar-fill" style="width:${pct(needs, t.income)}%"></div></div><b>${money(needs)} · ${pct(needs, t.income)}%</b></div>
        <div class="compare-row"><span>Wants</span><div class="bar"><div class="bar-fill amber" style="width:${pct(wants, t.income)}%"></div></div><b>${money(wants)} · ${pct(wants, t.income)}%</b></div>
        <div class="compare-row"><span>Saved</span><div class="bar"><div class="bar-fill green" style="width:${pct(t.saved, t.income)}%"></div></div><b>${money(t.saved)} · ${pct(t.saved, t.income)}%</b></div>
      </div>
      <p class="muted">Rule of thumb: 50% needs, 30% wants, 20% savings. The Marlowes run needs-heavy at ${pct(needs, t.income)}% because of rent, so they keep wants at ${pct(wants, t.income)}% and still save ${pct(t.saved, t.income)}%.</p>
    </div>
  </section>
  <section class="card">
    <h2>What-if saver — compound interest at 4%</h2>
    <form class="form-grid" data-action="saver-form">
      <label>Save each month ($)<input type="number" id="saver-amount" min="0" step="10" value="300" data-action="saver-input"></label>
      <label>For how many months?<input type="number" id="saver-months" min="1" max="360" step="1" value="12" data-action="saver-input"></label>
    </form>
    <div id="saver-result"></div>
  </section>`;
}

// ---- Tips ------------------------------------------------------------------

export function renderTips(state) {
  const applied = TIPS.filter((t) => state.appliedTips.includes(t.id));
  const totalSave = applied.reduce((s, t) => s + t.save, 0);
  const yearly = totalSave * 12;
  const withInterest = totalSave * (((1 + 0.04 / 12) ** 12 - 1) / (0.04 / 12));
  return `
  <div class="page-head"><div><h1>Money-saving tips</h1><p class="sub">Eight concrete moves for a family of four — apply one and it trims the matching budget.</p></div></div>
  <section class="card tips-banner">
    <div><strong>${state.appliedTips.length === 0 ? 'No tips applied yet.' : `You are saving ${money(totalSave)}/month from ${applied.length} tip${applied.length > 1 ? 's' : ''}.`}</strong>
    <span class="muted">${state.appliedTips.length === 0 ? 'Apply a tip below to see your monthly saving here.' : `That is ${money(yearly)} a year — or ${money(withInterest)} if you save it monthly at 4% interest.`}</span></div>
    ${state.appliedTips.length > 0 ? '<a class="btn small" href="#/budgets">See trimmed budgets</a>' : ''}
  </section>
  <section class="tips-grid">
    ${TIPS.map((tip) => {
      const isApplied = state.appliedTips.includes(tip.id);
      return `<article class="card tip-card${isApplied ? ' applied' : ''}">
        <div class="tip-save">Save ~${money(tip.save)}<span>/mo</span></div>
        <h2>${esc(tip.title)}</h2>
        <p>${esc(tip.body)}</p>
        <p class="muted">Trims: ${esc(categoryName(tip.category))} budget</p>
        <button class="btn small" data-action="toggle-tip" data-id="${tip.id}">${isApplied ? 'Applied ✓ — undo' : `Apply to budget (−${money(tip.save)}/mo)`}</button>
      </article>`;
    }).join('')}
  </section>`;
}
