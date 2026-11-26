// SVG chart builders for The Family Ledger. Pure functions returning SVG strings.
// No DOM access here — views.js decides where the SVG goes.

export function money(n) {
  return '$' + Math.round(n).toLocaleString('en-US');
}

// Donut chart of spending by category. `rows` is [{name, color, value}].
export function donutChart(rows, size = 220) {
  const total = rows.reduce((s, r) => s + r.value, 0) || 1;
  const cx = size / 2;
  const cy = size / 2;
  const r = size / 2 - 14;
  const circ = 2 * Math.PI * r;
  let offset = 0;
  const segments = rows
    .filter((row) => row.value > 0)
    .map((row) => {
      const frac = row.value / total;
      const len = Math.max(frac * circ - 2, 0.5);
      const seg = `<circle cx="${cx}" cy="${cy}" r="${r}" fill="none" stroke="${row.color}" stroke-width="26" stroke-dasharray="${len.toFixed(1)} ${circ.toFixed(1)}" stroke-dashoffset="${(-offset).toFixed(1)}" />`;
      offset += frac * circ;
      return seg;
    })
    .join('');
  return `<svg viewBox="0 0 ${size} ${size}" class="donut" role="img" aria-label="Spending by category chart">
    <circle cx="${cx}" cy="${cy}" r="${r}" fill="none" stroke="#efe7d8" stroke-width="26" />
    ${segments}
    <text x="${cx}" y="${cy - 6}" text-anchor="middle" class="donut-total">${money(total)}</text>
    <text x="${cx}" y="${cy + 18}" text-anchor="middle" class="donut-label">spent</text>
  </svg>`;
}

// Grouped bar chart: income vs expenses per month. `months` is [{month, income, expenses}].
export function barChart(months, width = 560, height = 200) {
  const max = Math.max(...months.map((m) => Math.max(m.income, m.expenses)), 1);
  const padL = 46;
  const padB = 26;
  const padT = 14;
  const plotW = width - padL - 8;
  const plotH = height - padT - padB;
  const groupW = plotW / months.length;
  const barW = Math.min(22, (groupW - 18) / 2);
  const grid = [0.25, 0.5, 0.75, 1]
    .map((f) => {
      const y = padT + plotH * (1 - f);
      return `<line x1="${padL}" y1="${y}" x2="${width - 8}" y2="${y}" class="grid" /><text x="${padL - 6}" y="${y + 4}" text-anchor="end" class="axis">${Math.round((max * f) / 1000)}k</text>`;
    })
    .join('');
  const bars = months
    .map((m, i) => {
      const gx = padL + i * groupW + (groupW - barW * 2 - 6) / 2;
      const ih = (m.income / max) * plotH;
      const eh = (m.expenses / max) * plotH;
      return `<rect x="${gx.toFixed(1)}" y="${(padT + plotH - ih).toFixed(1)}" width="${barW}" height="${ih.toFixed(1)}" rx="3" fill="#1d4d3b" />
      <rect x="${(gx + barW + 6).toFixed(1)}" y="${(padT + plotH - eh).toFixed(1)}" width="${barW}" height="${eh.toFixed(1)}" rx="3" fill="#e8a33d" />
      <text x="${(padL + i * groupW + groupW / 2).toFixed(1)}" y="${height - 8}" text-anchor="middle" class="axis">${m.month}</text>`;
    })
    .join('');
  return `<svg viewBox="0 0 ${width} ${height}" class="barchart" role="img" aria-label="Income versus expenses, last six months">
    ${grid}${bars}
  </svg>
  <div class="chart-legend"><span class="swatch" style="background:#1d4d3b"></span> Income <span class="swatch" style="background:#e8a33d"></span> Expenses</div>`;
}

// 30-day cashflow strip: one box per day, shaded by how much was spent that day,
// with an amber dot on each bill due date. `daily` is [{day, spent}], `dueDays` is [1, 12, ...].
export function cashflowStrip(daily, dueDays, width = 560, height = 64) {
  const max = Math.max(...daily.map((d) => d.spent), 1);
  const boxW = (width - 8) / 30;
  const boxes = daily
    .map((d, i) => {
      const intensity = d.spent / max;
      const fill = intensity === 0 ? '#efe7d8' : intensity < 0.35 ? '#f3d9a4' : intensity < 0.7 ? '#e8a33d' : '#b06f1e';
      const x = 4 + i * boxW;
      const dot = dueDays.includes(d.day)
        ? `<circle cx="${(x + boxW / 2).toFixed(1)}" cy="8" r="3.4" fill="#1d4d3b" stroke="#faf6ef" stroke-width="1.2" />`
        : '';
      return `<rect x="${x.toFixed(1)}" y="18" width="${(boxW - 2.5).toFixed(1)}" height="26" rx="3" fill="${fill}"><title>Nov ${d.day}: ${money(d.spent)} spent</title></rect>${dot}<text x="${(x + boxW / 2).toFixed(1)}" y="58" text-anchor="middle" class="axis">${d.day % 5 === 0 || d.day === 1 ? d.day : ''}</text>`;
    })
    .join('');
  return `<svg viewBox="0 0 ${width} ${height}" class="cashflow" role="img" aria-label="Daily spending strip for November">
    ${boxes}
  </svg>
  <div class="chart-legend"><span class="dot-legend"></span> Bill due date &nbsp;·&nbsp; darker box = more spent that day</div>`;
}
