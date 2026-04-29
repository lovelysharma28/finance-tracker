const form = document.getElementById('transactionForm');
const desc = document.getElementById('desc');
const amount = document.getElementById('amount');
const category = document.getElementById('category');
const goalText = document.getElementById('goalText');
const progressFill = document.querySelector('.progress-fill');
const modeToggle = document.getElementById('modeToggle');

let transactions = [];
let savingsGoal = 5000;

// Dark Mode Toggle
modeToggle.addEventListener('click', () => {
  document.body.classList.toggle('dark');
  modeToggle.textContent = document.body.classList.contains('dark') ? "☀️ Light Mode" : "🌙 Dark Mode";
});

// Add Transaction
form.addEventListener('submit', e => {
  e.preventDefault();
  const newTransaction = {
    desc: desc.value,
    amount: parseFloat(amount.value),
    category: category.value
  };
  transactions.push(newTransaction);
  updateDashboard();
  form.reset();
});

// Update Dashboard
function updateDashboard() {
  const categoryTotals = { food:0, transport:0, bills:0, entertainment:0 };
  let totalSpent = 0;

  transactions.forEach(t => {
    categoryTotals[t.category] += t.amount;
    totalSpent += t.amount;
  });

  // Update Chart
  expenseChart.data.datasets[0].data = [categoryTotals.food, categoryTotals.transport, categoryTotals.bills, categoryTotals.entertainment];
  expenseChart.update();

  // Update Savings Progress
  let saved = Math.max(0, savingsGoal - totalSpent);
  let percent = Math.min(100, (saved / savingsGoal) * 100);
  progressFill.style.width = percent + '%';
  if(percent > 70) progressFill.style.background = "#4CAF50";
  else if(percent > 40) progressFill.style.background = "#FFC107";
  else progressFill.style.background = "#F44336";
  goalText.textContent = `Saved: ₹${saved} / ₹${savingsGoal}`;
}

// Initialize Chart.js
const ctx = document.getElementById('expenseChart').getContext('2d');
const expenseChart = new Chart(ctx, {
  type: 'pie',
  data: {
    labels: ['Food', 'Transport', 'Bills', 'Entertainment'],
    datasets: [{
      label: 'Expenses',
      data: [0,0,0,0],
      backgroundColor: ['#FF6384','#36A2EB','#FFCE56','#4BC0C0'],
      hoverOffset: 10
    }]
  },
  options: {
    responsive: true,
    plugins: {
      legend: { position: 'bottom' },
      tooltip: { enabled: true }
    },
    animation: { animateScale: true, animateRotate: true }
  }
});
