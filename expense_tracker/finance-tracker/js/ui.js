// ============================================
// UI HELPERS & SHARED UTILITIES
// ============================================

import { formatCurrency, formatDate } from './firebase.js';

/**
 * Show a toast notification
 */
export function showToast(type = 'success', title = '', message = '') {
    const toast = document.getElementById('toast');
    const toastIcon = document.getElementById('toastIcon');
    const toastMessage = document.getElementById('toastMessage');
    const toastDescription = document.getElementById('toastDescription');

    if (!toast || !toastIcon || !toastMessage || !toastDescription) return;

    const iconMap = {
        success: 'fas fa-check-circle text-green-400',
        error: 'fas fa-exclamation-circle text-red-400',
        warning: 'fas fa-exclamation-triangle text-yellow-400',
        info: 'fas fa-info-circle text-blue-400'
    };

    toastIcon.className = iconMap[type] || iconMap.success;
    toastMessage.textContent = title || 'Notification';
    toastDescription.textContent = message || '';

    toast.classList.remove('hidden');
    toast.classList.add('animate-slide-up');

    clearTimeout(window.__financeToastTimeout);
    window.__financeToastTimeout = setTimeout(() => {
        toast.classList.add('hidden');
    }, 4000);
}

/**
 * Show or hide the loading overlay
 */
export function showLoadingOverlay(show = true) {
    const overlay = document.getElementById('loadingOverlay');
    if (!overlay) return;
    overlay.classList.toggle('hidden', !show);
}

/**
 * Toggle the sidebar on mobile
 */
export function toggleSidebar() {
    const sidebar = document.getElementById('sidebar');
    if (!sidebar) return;
    sidebar.classList.toggle('closed');
    sidebar.classList.toggle('open');
}

/**
 * Activate the correct sidebar item
 */
export function setActiveNavLink(tabName) {
    document.querySelectorAll('.nav-link').forEach((link) => {
        link.classList.remove('active');
        const href = link.getAttribute('href')?.substring(1);
        if (href === tabName) {
            link.classList.add('active');
        }
    });
}

/**
 * Show the selected tab and hide the others.
 */
export function showTab(tabName) {
    document.querySelectorAll('.tab-content').forEach((tab) => {
        tab.classList.add('hidden');
    });
    const targetTab = document.getElementById(`${tabName}-tab`);
    if (targetTab) {
        targetTab.classList.remove('hidden');
    }
}

/**
 * Get month name from number
 */
export function getMonthName(month) {
    const months = [
        'January', 'February', 'March', 'April',
        'May', 'June', 'July', 'August',
        'September', 'October', 'November', 'December'
    ];
    return months[month - 1] || '';
}

/**
 * Helper for currency formatting alias
 */
export function formatToCurrency(amount) {
    return formatCurrency(amount);
}

/**
 * Get icon class for a category.
 */
export function getCategoryIcon(category) {
    const icons = {
        'Salary': 'fas fa-briefcase',
        'Food': 'fas fa-utensils',
        'Travel': 'fas fa-plane',
        'Shopping': 'fas fa-shopping-bag',
        'Bills': 'fas fa-receipt',
        'Entertainment': 'fas fa-film',
        'Health': 'fas fa-heart',
        'Education': 'fas fa-book',
        'Others': 'fas fa-circle'
    };
    return icons[category] || 'fas fa-circle';
}

/**
 * Get color for a category.
 */
export function getCategoryColor(category) {
    const colors = {
        'Salary': '#10b981',
        'Food': '#f97316',
        'Travel': '#3b82f6',
        'Shopping': '#ec4899',
        'Bills': '#ef4444',
        'Entertainment': '#a855f7',
        'Health': '#06b6d4',
        'Education': '#6366f1',
        'Others': '#64748b'
    };
    return colors[category] || '#64748b';
}

/**
 * Create HTML for a transaction card.
 */
export function createTransactionItemHTML(transaction) {
    const icon = getCategoryIcon(transaction.category);
    const color = getCategoryColor(transaction.category);
    const isIncome = transaction.type === 'income';
    const sign = isIncome ? '+' : '-';
    const amountClass = isIncome ? 'text-green-400' : 'text-red-400';
    const date = formatDate(transaction.date);

    return `
        <div class="transaction-item rounded-2xl bg-white/5 border border-white/10 p-4 flex flex-col sm:flex-row justify-between gap-4" data-id="${transaction.id}">
            <div class="flex items-start gap-4 flex-1 min-w-0">
                <div class="w-14 h-14 rounded-2xl flex items-center justify-center" style="background: ${color}22; color: ${color};">
                    <i class="${icon} text-xl"></i>
                </div>
                <div class="min-w-0">
                    <div class="flex items-center justify-between gap-4">
                        <h4 class="text-white font-semibold truncate">${transaction.category}</h4>
                        <span class="text-xs font-semibold uppercase ${isIncome ? 'text-green-300' : 'text-red-300'}">${transaction.type}</span>
                    </div>
                    <p class="text-slate-400 text-sm mt-2 truncate">${transaction.description || 'No description'}</p>
                    <p class="text-slate-500 text-xs mt-3">${date}</p>
                </div>
            </div>
            <div class="flex flex-col justify-between items-end gap-3">
                <div class="text-right">
                    <p class="${amountClass} font-bold text-lg">${sign}${formatCurrency(transaction.amount)}</p>
                </div>
                <div class="flex gap-2">
                    <button class="transaction-edit px-3 py-2 rounded-xl bg-blue-500/20 text-blue-200 hover:bg-blue-500/30 transition text-sm font-semibold">Edit</button>
                    <button class="transaction-delete px-3 py-2 rounded-xl bg-red-500/20 text-red-200 hover:bg-red-500/30 transition text-sm font-semibold">Delete</button>
                </div>
            </div>
        </div>
    `;
}

/**
 * Render the recent transactions list.
 */
export function renderRecentTransactions(transactions) {
    const container = document.getElementById('recentTransactionsList');
    if (!container) return;

    if (transactions.length === 0) {
        container.innerHTML = `
            <div class="text-center py-8">
                <i class="fas fa-inbox text-slate-500 text-4xl mb-3 block"></i>
                <p class="text-slate-400">No recent transactions</p>
            </div>
        `;
        return;
    }

    container.innerHTML = transactions.map(transaction => createTransactionItemHTML(transaction)).join('');
}

/**
 * Render budget section with usage and remaining values.
 */
export function renderBudgetSection(budgets, transactions) {
    const budgetList = document.getElementById('budgetList');
    const budgetSummary = document.getElementById('budgetSummary');
    if (!budgetList || !budgetSummary) return;

    const budgetData = budgets.map((budget) => {
        const used = transactions
            .filter(t => t.category === budget.category && t.type === 'expense')
            .reduce((sum, t) => sum + t.amount, 0);
        const remaining = Math.max(budget.limit - used, 0);
        const progress = budget.limit > 0 ? Math.min(100, (used / budget.limit) * 100) : 0;
        return { ...budget, used, remaining, progress };
    });

    if (budgetData.length === 0) {
        budgetList.innerHTML = `
            <div class="text-center py-8">
                <i class="fas fa-wallet text-slate-500 text-4xl mb-3 block"></i>
                <p class="text-slate-400">No budgets added yet</p>
            </div>
        `;
        budgetSummary.innerHTML = `
            <div class="text-slate-400">Create a budget to track your spending.</div>
        `;
        return;
    }

    budgetList.innerHTML = budgetData.map((budget) => `
        <div class="p-4 rounded-2xl bg-white/5 border border-white/10">
            <div class="flex items-center justify-between mb-4">
                <div>
                    <p class="text-white font-semibold">${budget.category}</p>
                    <p class="text-slate-400 text-sm">Limit: ${formatCurrency(budget.limit)}</p>
                </div>
                <span class="text-sm font-semibold ${budget.remaining === 0 ? 'text-red-300' : 'text-green-300'}">${budget.progress.toFixed(0)}%</span>
            </div>
            <div class="w-full h-2 rounded-full bg-white/10 overflow-hidden mb-3">
                <div class="h-full rounded-full bg-gradient-to-r from-blue-500 to-purple-500" style="width: ${budget.progress}%;"></div>
            </div>
            <div class="flex justify-between text-slate-400 text-sm">
                <span>Used: ${formatCurrency(budget.used)}</span>
                <span>Remain: ${formatCurrency(budget.remaining)}</span>
            </div>
        </div>
    `).join('');

    const totalLimit = budgetData.reduce((sum, item) => sum + item.limit, 0);
    const totalUsed = budgetData.reduce((sum, item) => sum + item.used, 0);
    const totalRemaining = Math.max(totalLimit - totalUsed, 0);

    budgetSummary.innerHTML = `
        <div class="p-4 rounded-2xl bg-white/5 border border-white/10">
            <p class="text-slate-400 text-sm">Total Budget</p>
            <p class="text-3xl font-bold text-white">${formatCurrency(totalLimit)}</p>
        </div>
        <div class="p-4 rounded-2xl bg-white/5 border border-white/10">
            <p class="text-slate-400 text-sm">Total Spent</p>
            <p class="text-3xl font-bold text-red-400">${formatCurrency(totalUsed)}</p>
        </div>
        <div class="p-4 rounded-2xl bg-white/5 border border-white/10">
            <p class="text-slate-400 text-sm">Remaining</p>
            <p class="text-3xl font-bold text-green-400">${formatCurrency(totalRemaining)}</p>
        </div>
    `;
}

/**
 * Toggle dark mode preference
 */
export function toggleDarkMode() {
    const html = document.documentElement;
    const isDark = html.classList.toggle('dark');
    localStorage.setItem('theme', isDark ? 'dark' : 'light');
}

/**
 * Initialize dark mode on page load
 */
export function initDarkMode() {
    const html = document.documentElement;
    const theme = localStorage.getItem('theme') || 'dark';
    if (theme === 'dark') {
        html.classList.add('dark');
    } else {
        html.classList.remove('dark');
    }
}

/**
 * Notify user about notifications
 */
export function showNotifications() {
    showToast('info', 'Notifications', 'You have no new notifications right now.');
}

// Make global helper functions available to inline HTML actions
window.toggleSidebar = toggleSidebar;
window.toggleDarkMode = toggleDarkMode;
window.showNotifications = showNotifications;
window.showLoadingOverlay = showLoadingOverlay;
window.showToast = showToast;
