// Seed data for The Family Ledger — the Marlowe family, November 2026.
// Data only: no DOM code here. All figures are consistent across pages:
// November income $6,850, expenses $4,920, saved $1,930.

export const FAMILY = {
  name: 'The Marlowe Family',
  members: ['Alex', 'Sam', 'Maya & Leo', 'Shared'],
  monthLabel: { '2026-10': 'October 2026', '2026-11': 'November 2026' },
};

export const CATEGORIES = [
  { id: 'housing', name: 'Housing', color: '#1d4d3b' },
  { id: 'food', name: 'Food & Groceries', color: '#e8a33d' },
  { id: 'transport', name: 'Transport', color: '#4a7fa5' },
  { id: 'utilities', name: 'Utilities', color: '#7a6aa8' },
  { id: 'health', name: 'Health', color: '#c25e5e' },
  { id: 'education', name: 'Education', color: '#3f8f6b' },
  { id: 'kids', name: 'Kids', color: '#d97b3f' },
  { id: 'leisure', name: 'Leisure', color: '#b08d3e' },
  { id: 'savings', name: 'Savings', color: '#2e7d5b' },
];

// November 2026: income $6,850, expenses $4,920.
export const TRANSACTIONS_NOV = [
  { id: 'n01', date: '2026-11-01', desc: 'Alex salary — Riverside Studio', category: 'income', amount: 4600, type: 'income', owner: 'Alex' },
  { id: 'n02', date: '2026-11-01', desc: 'Sam salary — Northgate Clinic', category: 'income', amount: 2100, type: 'income', owner: 'Sam' },
  { id: 'n03', date: '2026-11-01', desc: 'Rent — Maple Street apartment', category: 'housing', amount: 1850, type: 'expense', owner: 'Shared' },
  { id: 'n04', date: '2026-11-02', desc: 'Whole Foods weekly shop', category: 'food', amount: 160, type: 'expense', owner: 'Sam' },
  { id: 'n05', date: '2026-11-03', desc: 'Shell petrol', category: 'transport', amount: 58, type: 'expense', owner: 'Alex' },
  { id: 'n06', date: '2026-11-04', desc: 'Netflix + Spotify', category: 'leisure', amount: 32, type: 'expense', owner: 'Shared' },
  { id: 'n07', date: '2026-11-05', desc: "Trader Joe's groceries", category: 'food', amount: 142, type: 'expense', owner: 'Sam' },
  { id: 'n08', date: '2026-11-05', desc: 'Family dinner at Olive Garden', category: 'leisure', amount: 92, type: 'expense', owner: 'Shared' },
  { id: 'n09', date: '2026-11-06', desc: "Kids' swimming lessons", category: 'kids', amount: 85, type: 'expense', owner: 'Maya & Leo' },
  { id: 'n10', date: '2026-11-06', desc: 'Home Depot — tap repair parts', category: 'housing', amount: 145, type: 'expense', owner: 'Alex' },
  { id: 'n11', date: '2026-11-07', desc: 'CVS pharmacy', category: 'health', amount: 46, type: 'expense', owner: 'Sam' },
  { id: 'n12', date: '2026-11-08', desc: 'School lunch money — Maya & Leo', category: 'education', amount: 60, type: 'expense', owner: 'Maya & Leo' },
  { id: 'n13', date: '2026-11-09', desc: 'Farmers market', category: 'food', amount: 74, type: 'expense', owner: 'Alex' },
  { id: 'n14', date: '2026-11-10', desc: 'Uber rides', category: 'transport', amount: 41, type: 'expense', owner: 'Alex' },
  { id: 'n15', date: '2026-11-10', desc: 'Car service — oil + brakes', category: 'transport', amount: 160, type: 'expense', owner: 'Alex' },
  { id: 'n16', date: '2026-11-12', desc: 'Electric bill', category: 'utilities', amount: 132, type: 'expense', owner: 'Shared' },
  { id: 'n17', date: '2026-11-13', desc: "Maya's ballet class", category: 'kids', amount: 70, type: 'expense', owner: 'Maya & Leo' },
  { id: 'n18', date: '2026-11-13', desc: 'Yoga class — Sam', category: 'health', amount: 60, type: 'expense', owner: 'Sam' },
  { id: 'n19', date: '2026-11-14', desc: 'Costco bulk shop', category: 'food', amount: 180, type: 'expense', owner: 'Sam' },
  { id: 'n20', date: '2026-11-14', desc: 'Tax refund', category: 'income', amount: 150, type: 'income', owner: 'Shared' },
  { id: 'n21', date: '2026-11-15', desc: 'Internet bill', category: 'utilities', amount: 79, type: 'expense', owner: 'Shared' },
  { id: 'n22', date: '2026-11-16', desc: 'Gym membership — Alex', category: 'health', amount: 45, type: 'expense', owner: 'Alex' },
  { id: 'n23', date: '2026-11-17', desc: "Leo's school books", category: 'education', amount: 38, type: 'expense', owner: 'Maya & Leo' },
  { id: 'n24', date: '2026-11-18', desc: 'Family movie night', category: 'leisure', amount: 64, type: 'expense', owner: 'Shared' },
  { id: 'n25', date: '2026-11-19', desc: 'Water bill', category: 'utilities', amount: 64, type: 'expense', owner: 'Shared' },
  { id: 'n26', date: '2026-11-19', desc: "Kids' winter coats", category: 'kids', amount: 118, type: 'expense', owner: 'Maya & Leo' },
  { id: 'n27', date: '2026-11-20', desc: 'Shell petrol', category: 'transport', amount: 52, type: 'expense', owner: 'Alex' },
  { id: 'n28', date: '2026-11-21', desc: 'Dentist checkup — Maya', category: 'health', amount: 120, type: 'expense', owner: 'Maya & Leo' },
  { id: 'n29', date: '2026-11-21', desc: 'Anniversary dinner', category: 'leisure', amount: 118, type: 'expense', owner: 'Shared' },
  { id: 'n30', date: '2026-11-22', desc: 'Whole Foods weekly shop', category: 'food', amount: 158, type: 'expense', owner: 'Sam' },
  { id: 'n31', date: '2026-11-23', desc: 'Phone bill', category: 'utilities', amount: 95, type: 'expense', owner: 'Shared' },
  { id: 'n32', date: '2026-11-24', desc: 'Health insurance premium', category: 'health', amount: 210, type: 'expense', owner: 'Shared' },
  { id: 'n33', date: '2026-11-24', desc: 'Thanksgiving groceries', category: 'food', amount: 96, type: 'expense', owner: 'Sam' },
  { id: 'n34', date: '2026-11-25', desc: "Leo's birthday gift", category: 'kids', amount: 76, type: 'expense', owner: 'Maya & Leo' },
  { id: 'n35', date: '2026-11-25', desc: 'Prescription refill', category: 'health', amount: 38, type: 'expense', owner: 'Sam' },
  { id: 'n36', date: '2026-11-26', desc: 'Takeaway pizza night', category: 'food', amount: 42, type: 'expense', owner: 'Shared' },
  { id: 'n37', date: '2026-11-27', desc: 'Train tickets — visit to grandparents', category: 'transport', amount: 86, type: 'expense', owner: 'Alex' },
  { id: 'n38', date: '2026-11-28', desc: 'Bookshop — school reading list', category: 'education', amount: 34, type: 'expense', owner: 'Maya & Leo' },
];

// October 2026: full seed, income $6,700, expenses $4,771.
export const TRANSACTIONS_OCT = [
  { id: 'o01', date: '2026-10-01', desc: 'Alex salary — Riverside Studio', category: 'income', amount: 4600, type: 'income', owner: 'Alex' },
  { id: 'o02', date: '2026-10-01', desc: 'Sam salary — Northgate Clinic', category: 'income', amount: 2100, type: 'income', owner: 'Sam' },
  { id: 'o03', date: '2026-10-01', desc: 'Rent — Maple Street apartment', category: 'housing', amount: 1850, type: 'expense', owner: 'Shared' },
  { id: 'o04', date: '2026-10-02', desc: 'Whole Foods weekly shop', category: 'food', amount: 174, type: 'expense', owner: 'Sam' },
  { id: 'o05', date: '2026-10-03', desc: 'Shell petrol', category: 'transport', amount: 62, type: 'expense', owner: 'Alex' },
  { id: 'o06', date: '2026-10-04', desc: 'Netflix + Spotify', category: 'leisure', amount: 32, type: 'expense', owner: 'Shared' },
  { id: 'o07', date: '2026-10-05', desc: 'Home repairs — leaky radiator', category: 'housing', amount: 210, type: 'expense', owner: 'Alex' },
  { id: 'o08', date: '2026-10-06', desc: 'Electric bill', category: 'utilities', amount: 118, type: 'expense', owner: 'Shared' },
  { id: 'o09', date: '2026-10-07', desc: "Kids' swimming lessons", category: 'kids', amount: 85, type: 'expense', owner: 'Maya & Leo' },
  { id: 'o10', date: '2026-10-08', desc: 'Costco bulk shop', category: 'food', amount: 226, type: 'expense', owner: 'Sam' },
  { id: 'o11', date: '2026-10-09', desc: 'School supplies — Maya', category: 'education', amount: 72, type: 'expense', owner: 'Maya & Leo' },
  { id: 'o12', date: '2026-10-10', desc: 'Dentist checkup — Leo', category: 'health', amount: 95, type: 'expense', owner: 'Maya & Leo' },
  { id: 'o13', date: '2026-10-11', desc: 'Dining out — family lunch', category: 'leisure', amount: 88, type: 'expense', owner: 'Shared' },
  { id: 'o14', date: '2026-10-12', desc: 'Health insurance premium', category: 'health', amount: 210, type: 'expense', owner: 'Shared' },
  { id: 'o15', date: '2026-10-13', desc: 'Train tickets — city trip', category: 'transport', amount: 74, type: 'expense', owner: 'Alex' },
  { id: 'o16', date: '2026-10-14', desc: 'Pharmacy', category: 'health', amount: 39, type: 'expense', owner: 'Sam' },
  { id: 'o17', date: '2026-10-15', desc: 'Internet bill', category: 'utilities', amount: 79, type: 'expense', owner: 'Shared' },
  { id: 'o18', date: '2026-10-16', desc: 'Gym membership — Alex', category: 'health', amount: 45, type: 'expense', owner: 'Alex' },
  { id: 'o19', date: '2026-10-17', desc: "Kids' winter clothes", category: 'kids', amount: 142, type: 'expense', owner: 'Maya & Leo' },
  { id: 'o20', date: '2026-10-18', desc: 'Family movie night', category: 'leisure', amount: 58, type: 'expense', owner: 'Shared' },
  { id: 'o21', date: '2026-10-19', desc: 'Water bill', category: 'utilities', amount: 58, type: 'expense', owner: 'Shared' },
  { id: 'o22', date: '2026-10-20', desc: 'Groceries — weekly top-up', category: 'food', amount: 163, type: 'expense', owner: 'Sam' },
  { id: 'o23', date: '2026-10-21', desc: 'School trip — science museum', category: 'education', amount: 55, type: 'expense', owner: 'Maya & Leo' },
  { id: 'o24', date: '2026-10-22', desc: 'Heating bill', category: 'utilities', amount: 120, type: 'expense', owner: 'Shared' },
  { id: 'o25', date: '2026-10-23', desc: 'Phone bill', category: 'utilities', amount: 95, type: 'expense', owner: 'Shared' },
  { id: 'o26', date: '2026-10-24', desc: 'Takeaway pizza night', category: 'food', amount: 44, type: 'expense', owner: 'Shared' },
  { id: 'o27', date: '2026-10-25', desc: "Kids' shoes — Leo", category: 'kids', amount: 96, type: 'expense', owner: 'Maya & Leo' },
  { id: 'o28', date: '2026-10-26', desc: 'Concert tickets — Sam & Alex', category: 'leisure', amount: 84, type: 'expense', owner: 'Shared' },
  { id: 'o29', date: '2026-10-27', desc: 'Prescription refill', category: 'health', amount: 41, type: 'expense', owner: 'Sam' },
  { id: 'o30', date: '2026-10-28', desc: 'Car wash + parking', category: 'transport', amount: 36, type: 'expense', owner: 'Alex' },
  { id: 'o31', date: '2026-10-29', desc: 'Birthday party supplies — Maya', category: 'kids', amount: 67, type: 'expense', owner: 'Maya & Leo' },
  { id: 'o32', date: '2026-10-30', desc: 'Shell petrol', category: 'transport', amount: 55, type: 'expense', owner: 'Alex' },
  { id: 'o33', date: '2026-10-31', desc: 'Coffee & snacks', category: 'food', amount: 9, type: 'expense', owner: 'Alex' },
];

// Monthly budgets (per month key).
export const BUDGETS = {
  '2026-11': { housing: 2000, food: 800, transport: 450, utilities: 400, health: 550, education: 200, kids: 400, leisure: 350, savings: 1000 },
  '2026-10': { housing: 2100, food: 850, transport: 420, utilities: 420, health: 520, education: 180, kids: 420, leisure: 320, savings: 1000 },
};

export const GOALS = [
  { id: 'g1', name: 'Emergency fund', saved: 6200, target: 10000, note: '6 months of essentials, in a high-yield savings account' },
  { id: 'g2', name: 'Family holiday — Lake District', saved: 1450, target: 2500, note: 'Cottage by the lake, Easter break' },
  { id: 'g3', name: 'New car', saved: 3800, target: 12000, note: 'Replace the 2014 hatchback next summer' },
];

export const BILLS = [
  { id: 'b1', name: 'Rent', amount: 1850, due: 1, paid: true, category: 'housing' },
  { id: 'b2', name: 'Streaming (Netflix + Spotify)', amount: 32, due: 4, paid: true, category: 'leisure' },
  { id: 'b3', name: 'Electric', amount: 132, due: 12, paid: true, category: 'utilities' },
  { id: 'b4', name: 'Internet', amount: 79, due: 15, paid: true, category: 'utilities' },
  { id: 'b5', name: 'Gym', amount: 45, due: 16, paid: false, category: 'health' },
  { id: 'b6', name: 'Water', amount: 64, due: 19, paid: false, category: 'utilities' },
  { id: 'b7', name: 'Phone', amount: 95, due: 23, paid: false, category: 'utilities' },
  { id: 'b8', name: 'Health insurance', amount: 210, due: 24, paid: false, category: 'health' },
];

export const TIPS = [
  { id: 't1', title: 'Meal-plan Sundays', body: 'Plan all 7 dinners on Sunday, shop once with a list, and cook two batch meals. Families that plan cut food waste by a third.', save: 180, category: 'food' },
  { id: 't2', title: 'Batch-cook & freeze lunches', body: 'Cook a double batch of soup, stew or pasta on Sunday and freeze 5 work lunches. Beats the $12 sandwich shop run every day.', save: 120, category: 'food' },
  { id: 't3', title: 'Bike or carpool twice a week', body: 'Swap two solo car trips a week for the bike or a lift share with a neighbour. Saves petrol and parking, and the kids love the ride.', save: 60, category: 'transport' },
  { id: 't4', title: 'Buy kids’ clothes second-hand', body: 'Kids outgrow clothes in a season. Charity shops and parent swap groups sell barely-worn coats and shoes for a quarter of retail.', save: 55, category: 'kids' },
  { id: 't5', title: 'Audit your subscriptions', body: 'List every subscription, cancel the ones nobody used in the last month, and share a family plan instead of four solo ones.', save: 45, category: 'leisure' },
  { id: 't6', title: 'Library & free museum days', body: 'Borrow books, films and board games from the library, and use the museum’s free first-Sunday entry instead of paid weekend outings.', save: 40, category: 'leisure' },
  { id: 't7', title: 'LED bulbs + off-peak laundry', body: 'Swap remaining bulbs for LEDs and run the washing machine after 9pm on the off-peak tariff. Small change, every single month.', save: 38, category: 'utilities' },
  { id: 't8', title: 'Switch to generic pharmacy brands', body: 'Ask the pharmacist for the generic version of regular medicines — same active ingredient, same dose, roughly 40% cheaper.', save: 25, category: 'health' },
];

// Six-month income vs expenses history (Jun–Nov 2026).
export const MONTHLY_HISTORY = [
  { month: 'Jun', income: 6700, expenses: 4610 },
  { month: 'Jul', income: 6700, expenses: 4890 },
  { month: 'Aug', income: 6850, expenses: 5120 },
  { month: 'Sep', income: 6700, expenses: 4735 },
  { month: 'Oct', income: 6700, expenses: 4582 },
  { month: 'Nov', income: 6850, expenses: 4920 },
];
