// ============================================
// DASHBOARD MODULE
// ============================================

import { formatCurrency, formatDateForInput } from './firebase.js';
import { showLoadingOverlay, showToast, setActiveNavLink, showTab, getMonthName, renderRecentTransactions, renderBudgetSection } from './ui.js';
import { 
    loadTransactions, 
    getDashboardTransactions, 
    getMonthTransactions, 
    calculateStats, 
    renderTransactionsList,
    getCategoryDistribution,
    loadBudgets,
    addBudget
} from './transactions.js';
import { 
    initExpenseChart, 
    initComparisonChart, 
    initCategoryChart, 
    initTrendChart,
    processTrendData 
} from './charts.js';

let currentMonthData = null;

/**
 * Load all dashboard data
 */
export async function loadDashboardData() {
    try {
        setActiveNavLink('dashboard');
        showTab('dashboard');

        const now = new Date();
        const monthStart = new Date(now.getFullYear(), now.getMonth(), 1).getTime();
        const monthEnd = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59, 999).getTime();

        const transactions = await loadTransactions({ startDate: monthStart, endDate: monthEnd });
        const stats = calculateStats(transactions);

        updateDashboardStats(stats);

        const recentTransactions = transactions.slice(0, 5);
        renderRecentTransactions(recentTransactions);

        const categoryData = getCategoryDistribution(transactions);
        if (Object.keys(categoryData).length > 0) {
            initExpenseChart(categoryData);
            initDashboardComparisonChart(transactions);
        }

        await setupDashboardListeners();
        await loadBudgetTab();
        await updateAnalytics();
    } catch (error) {
        console.error('❌ Error loading dashboard:', error);
        showToast('error', 'Error', 'Failed to load dashboard data');
    }
}

/**
 * Update dashboard statistics
 */
export function updateDashboardStats(stats) {
    // Update balance
    const balanceElement = document.getElementById('totalBalance');
    if (balanceElement) {
        animateValue(balanceElement, stats.balance);
    }

    // Update income
    const incomeElement = document.getElementById('totalIncome');
    if (incomeElement) {
        animateValue(incomeElement, stats.totalIncome);
    }

    // Update expense
    const expenseElement = document.getElementById('totalExpense');
    if (expenseElement) {
        animateValue(expenseElement, stats.totalExpense);
    }

    // Update savings
    const savingsElement = document.getElementById('totalSavings');
    if (savingsElement) {
        animateValue(savingsElement, stats.balance);
    }
}

/**
 * Animate number value
 */
function animateValue(element, endValue) {
    const startValue = 0;
    const duration = 800;
    const startTime = Date.now();

    const animate = () => {
        const elapsed = Date.now() - startTime;
        const progress = Math.min(elapsed / duration, 1);
        const currentValue = startValue + (endValue - startValue) * progress;

        element.textContent = formatCurrency(currentValue);

        if (progress < 1) {
            requestAnimationFrame(animate);
        } else {
            element.textContent = formatCurrency(endValue);
        }
    };

    animate();
}

/**
 * Initialize dashboard comparison chart
 */
export async function initDashboardComparisonChart(transactions) {
    const months = [];
    const incomeData = [];
    const expenseData = [];

    const now = new Date();
    for (let i = 6; i >= 0; i--) {
        const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
        const month = date.getMonth() + 1;
        const year = date.getFullYear();

        months.push(getMonthName(month).substring(0, 3));

        const monthTransactions = transactions.filter(t => {
            const tDate = new Date(t.date);
            return tDate.getMonth() === month - 1 && tDate.getFullYear() === year;
        });

        const stats = calculateStats(monthTransactions);
        incomeData.push(stats.totalIncome);
        expenseData.push(stats.totalExpense);
    }

    initComparisonChart(incomeData, expenseData, months);
}

/**
 * Setup dashboard event listeners
 */
function setupDashboardListeners() {
    if (window.dashboardListenersSet) {
        return;
    }
    window.dashboardListenersSet = true;

    // Transaction modal
    const transactionModal = document.getElementById('transactionModal');
    if (transactionModal) {
        transactionModal.addEventListener('click', (e) => {
            if (e.target === transactionModal) {
                closeTransactionModal();
            }
        });
    }

    // Switch tabs
    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const tabName = link.getAttribute('href').substring(1);
            switchTab(tabName, e);
        });
    });

    // Set current date
    const dateInput = document.getElementById('transactionDate');
    if (dateInput) {
        dateInput.value = formatDateForInput(new Date());
    }

    // Year filter for analytics
    const yearFilter = document.getElementById('yearFilter');
    if (yearFilter && yearFilter.children.length === 0) {
        const currentYear = new Date().getFullYear();
        for (let y = currentYear - 5; y <= currentYear + 1; y++) {
            const option = document.createElement('option');
            option.value = y;
            option.textContent = y;
            if (y === currentYear) option.selected = true;
            yearFilter.appendChild(option);
        }
    }
}

/**
 * Switch between tabs
 */
export async function switchTab(tabName, event) {
    event?.preventDefault();

    try {
        setActiveNavLink(tabName);
        showTab(tabName);

        // Close mobile sidebar
        const sidebar = document.getElementById('sidebar');
        if (sidebar && window.innerWidth < 1024) {
            sidebar.classList.add('closed');
            sidebar.classList.remove('open');
        }

        // Load tab-specific data
        if (tabName === 'transactions') {
            await loadTransactionsTab();
        } else if (tabName === 'analytics') {
            await loadAnalyticsTab();
        } else if (tabName === 'budget') {
            await loadBudgetTab();
        }

    } catch (error) {
        console.error('❌ Error switching tab:', error);
        showToast('error', 'Error', 'Failed to load tab');
    }
}

/**
 * Load transactions tab
 */
export async function loadTransactionsTab() {
    try {
        showLoadingOverlay(true);
        const transactions = await loadTransactions();
        renderTransactionsList(transactions);
        showLoadingOverlay(false);
    } catch (error) {
        console.error('❌ Error loading transactions:', error);
        showToast('error', 'Error', 'Failed to load transactions');
        showLoadingOverlay(false);
    }
}

/**
 * Load analytics tab
 */
export async function loadAnalyticsTab() {
    try {
        showLoadingOverlay(true);

        const monthFilter = document.getElementById('monthFilter');
        const yearFilter = document.getElementById('yearFilter');

        const month = parseInt(monthFilter?.value || new Date().getMonth() + 1);
        const year = parseInt(yearFilter?.value || new Date().getFullYear());

        const transactions = await getMonthTransactions(month, year);
        const stats = calculateStats(transactions);

        // Update analytics display
        document.getElementById('analyticsIncome').textContent = formatCurrency(stats.totalIncome);
        document.getElementById('analyticsExpense').textContent = formatCurrency(stats.totalExpense);
        document.getElementById('analyticsSavings').textContent = formatCurrency(stats.balance);

        const daysInMonth = new Date(year, month, 0).getDate();
        const dailyAvg = stats.totalExpense / daysInMonth;
        document.getElementById('analyticsDaily').textContent = formatCurrency(dailyAvg);

        // Initialize charts
        const categoryData = getCategoryDistribution(transactions);
        if (Object.keys(categoryData).length > 0) {
            initCategoryChart(categoryData);
        }

        // Trend chart
        const trendData = processTrendData(transactions);
        initTrendChart(trendData);

        currentMonthData = transactions;
        showLoadingOverlay(false);

    } catch (error) {
        console.error('❌ Error loading analytics:', error);
        showToast('error', 'Error', 'Failed to load analytics');
        showLoadingOverlay(false);
    }
}

/**
 * Load budget tab
 */
export async function loadBudgetTab() {
    try {
        showLoadingOverlay(true);

        const budgets = await loadBudgets();
        const now = new Date();
        const monthStart = new Date(now.getFullYear(), now.getMonth(), 1).getTime();
        const monthEnd = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59, 999).getTime();
        const transactions = await loadTransactions({ startDate: monthStart, endDate: monthEnd });

        renderBudgetSection(budgets, transactions);

        showLoadingOverlay(false);

    } catch (error) {
        console.error('❌ Error loading budget:', error);
        showToast('error', 'Error', 'Failed to load budget');
        showLoadingOverlay(false);
    }
}

/**
 * Update analytics when filters change
 */
export async function updateAnalytics() {
    const monthFilter = document.getElementById('monthFilter');
    const yearFilter = document.getElementById('yearFilter');

    const month = parseInt(monthFilter?.value || new Date().getMonth() + 1);
    const year = parseInt(yearFilter?.value || new Date().getFullYear());

    const monthName = getMonthName(month);
    showToast('info', 'Loading Analytics', `${monthName} ${year}`);

    await loadAnalyticsTab();
}

/**
 * Refresh dashboard data
 */
export async function refreshData() {
    showToast('info', 'Refreshing', 'Loading latest data...');
    await loadDashboardData();
    showToast('success', 'Refreshed', 'Dashboard updated successfully');
}

/**
 * Open budget modal
 */
export async function openBudgetModal() {
    const category = prompt('Enter budget category (e.g., Food, Travel, Bills)');
    const amount = prompt('Enter budget limit amount in INR');
    if (!category || !amount || isNaN(amount)) {
        showToast('error', 'Invalid budget', 'Please enter a valid category and amount.');
        return;
    }

    await addBudget(category, Number(amount));
    await loadBudgetTab();
    showToast('success', 'Budget added', `${category} budget set for ₹${Number(amount).toFixed(2)}.`);
}

/**
 * Close transaction modal
 */
export function closeTransactionModal() {
    const modal = document.getElementById('transactionModal');
    if (modal) {
        modal.classList.add('hidden');
    }
}

// Make functions globally available
window.switchTab = switchTab;
window.refreshData = refreshData;
window.updateAnalytics = updateAnalytics;
window.openBudgetModal = openBudgetModal;
