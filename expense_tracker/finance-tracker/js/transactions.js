// ============================================
// TRANSACTIONS MODULE
// ============================================

import { getFirebaseDB, getUserId, formatCurrency, formatDate, formatDateForInput } from './firebase.js';
import { showToast, showLoadingOverlay, createTransactionItemHTML } from './ui.js';

let currentTransactionId = null;
let transactionsCache = [];

/**
 * Open add transaction modal
 */
export function openAddTransactionModal() {
    currentTransactionId = null;
    document.getElementById('modalTitle').textContent = 'Add Transaction';
    document.getElementById('transactionForm').reset();
    document.getElementById('transactionDate').valueAsDate = new Date();
    document.getElementById('transactionModal').classList.remove('hidden');
}

/**
 * Close transaction modal
 */
export function closeTransactionModal() {
    document.getElementById('transactionModal').classList.add('hidden');
    currentTransactionId = null;
}

/**
 * Open edit transaction modal
 */
export async function openEditTransactionModal(transactionId) {
    try {
        const transaction = transactionsCache.find(t => t.id === transactionId);
        if (!transaction) return;

        currentTransactionId = transactionId;
        document.getElementById('modalTitle').textContent = 'Edit Transaction';
        
        // Populate form
        document.getElementById('transactionType').value = transaction.type;
        document.getElementById('transactionCategory').value = transaction.category;
        document.getElementById('transactionAmount').value = transaction.amount;
        document.getElementById('transactionDate').value = formatDateForInput(transaction.date);
        document.getElementById('transactionDescription').value = transaction.description || '';
        
        document.getElementById('transactionModal').classList.remove('hidden');
    } catch (error) {
        console.error('❌ Error opening edit modal:', error);
        showToast('error', 'Error', 'Could not load transaction');
    }
}

/**
 * Handle transaction form submission
 */
export async function handleTransactionSubmit(e) {
    e.preventDefault();
    showLoadingOverlay(true);

    try {
        const type = document.getElementById('transactionType').value;
        const category = document.getElementById('transactionCategory').value;
        const amount = parseFloat(document.getElementById('transactionAmount').value);
        const date = new Date(document.getElementById('transactionDate').value).getTime();
        const description = document.getElementById('transactionDescription').value;

        // Validate
        if (!amount || amount <= 0) {
            showToast('error', 'Invalid Amount', 'Please enter a valid amount');
            return;
        }

        if (currentTransactionId) {
            // Update existing transaction
            await updateTransaction(currentTransactionId, {
                type, category, amount, date, description
            });
        } else {
            // Add new transaction
            await addTransaction({
                type, category, amount, date, description
            });
        }

        closeTransactionModal();
    } catch (error) {
        console.error('❌ Error submitting transaction:', error);
        showToast('error', 'Error', error.message);
    } finally {
        showLoadingOverlay(false);
    }
}

/**
 * Add new transaction to Firestore
 */
export async function addTransaction(transaction) {
    try {
        const { addDoc, collection, serverTimestamp } = await import('https://www.gstatic.com/firebasejs/10.7.0/firebase-firestore.js');

        const db = getFirebaseDB();
        const userId = getUserId();
        const timestamp = Number(new Date(transaction.date).getTime());

        const docRef = await addDoc(collection(db, `users/${userId}/transactions`), {
            ...transaction,
            date: new Date(transaction.date).toISOString(),
            timestamp,
            createdAt: serverTimestamp(),
            updatedAt: serverTimestamp()
        });

        console.log('✅ Transaction added:', docRef.id);
        showToast('success', 'Transaction Added', `${transaction.category} - ${formatCurrency(transaction.amount)}`);
        
        await loadTransactions();
        return docRef.id;

    } catch (error) {
        console.error('❌ Error adding transaction:', error);
        throw error;
    }
}

/**
 * Update transaction
 */
export async function updateTransaction(transactionId, transaction) {
    try {
        const { doc, updateDoc, serverTimestamp } = await import('https://www.gstatic.com/firebasejs/10.7.0/firebase-firestore.js');

        const db = getFirebaseDB();
        const userId = getUserId();
        const timestamp = Number(new Date(transaction.date).getTime());

        const transactionRef = doc(db, `users/${userId}/transactions/${transactionId}`);
        await updateDoc(transactionRef, {
            ...transaction,
            date: new Date(transaction.date).toISOString(),
            timestamp,
            updatedAt: serverTimestamp()
        });

        console.log('✅ Transaction updated:', transactionId);
        showToast('success', 'Transaction Updated', 'Changes saved successfully');
        
        await loadTransactions();

    } catch (error) {
        console.error('❌ Error updating transaction:', error);
        throw error;
    }
}

/**
 * Delete transaction
 */
export async function deleteTransaction(transactionId) {
    try {
        if (!confirm('Are you sure you want to delete this transaction?')) {
            return;
        }

        const { deleteDoc, doc } = await import('https://www.gstatic.com/firebasejs/10.7.0/firebase-firestore.js');

        const db = getFirebaseDB();
        const userId = getUserId();

        await deleteDoc(doc(db, `users/${userId}/transactions/${transactionId}`));

        console.log('✅ Transaction deleted:', transactionId);
        showToast('success', 'Transaction Deleted', 'Transaction removed successfully');
        
        // Reload transactions
        await loadTransactions();

    } catch (error) {
        console.error('❌ Error deleting transaction:', error);
        showToast('error', 'Error', 'Could not delete transaction');
    }
}

/**
 * Load all transactions for current user
 */
export async function loadTransactions(filters = {}) {
    try {
        showLoadingOverlay(true);

        const { collection, getDocs, query, where, orderBy } = await import('https://www.gstatic.com/firebasejs/10.7.0/firebase-firestore.js');

        const db = getFirebaseDB();
        const userId = getUserId();

        const constraints = [];
        const transactionCollection = collection(db, `users/${userId}/transactions`);

        if (filters.category) {
            constraints.push(where('category', '==', filters.category));
        }
        if (filters.type) {
            constraints.push(where('type', '==', filters.type));
        }

        if (filters.startDate !== undefined) {
            const startTimestamp = filters.startDate instanceof Date ? filters.startDate.getTime() : Number(filters.startDate);
            constraints.push(where('timestamp', '>=', startTimestamp));
        }
        if (filters.endDate !== undefined) {
            const endTimestamp = filters.endDate instanceof Date ? filters.endDate.getTime() : Number(filters.endDate);
            constraints.push(where('timestamp', '<=', endTimestamp));
        }

        constraints.push(orderBy('timestamp', 'desc'));
        const q = query(transactionCollection, ...constraints);
        const querySnapshot = await getDocs(q);
        const transactions = [];

        querySnapshot.forEach(doc => {
            transactions.push({
                id: doc.id,
                ...doc.data()
            });
        });

        transactionsCache = transactions;
        console.log('✅ Loaded transactions:', transactions.length);
        
        return transactions;

    } catch (error) {
        console.error('❌ Error loading transactions:', error);
        showToast('error', 'Error', 'Could not load transactions');
        return [];
    } finally {
        showLoadingOverlay(false);
    }
}

/**
 * Get transactions for dashboard
 */
export async function getDashboardTransactions() {
    try {
        const { collection, getDocs, query, orderBy, limit } = await import('https://www.gstatic.com/firebasejs/10.7.0/firebase-firestore.js');

        const db = getFirebaseDB();
        const userId = getUserId();

        const q = query(
            collection(db, `users/${userId}/transactions`),
            orderBy('timestamp', 'desc'),
            limit(5)
        );

        const querySnapshot = await getDocs(q);
        const transactions = [];

        querySnapshot.forEach(doc => {
            transactions.push({
                id: doc.id,
                ...doc.data()
            });
        });

        return transactions;

    } catch (error) {
        console.error('❌ Error loading dashboard transactions:', error);
        return [];
    }
}

/**
 * Get transactions for specific month
 */
export async function getMonthTransactions(month, year) {
    try {
        const { collection, getDocs, query, where, orderBy } = await import('https://www.gstatic.com/firebasejs/10.7.0/firebase-firestore.js');

        const db = getFirebaseDB();
        const userId = getUserId();

        const startTimestamp = new Date(year, month - 1, 1).getTime();
        const endTimestamp = new Date(year, month, 0, 23, 59, 59, 999).getTime();

        const q = query(
            collection(db, `users/${userId}/transactions`),
            where('timestamp', '>=', startTimestamp),
            where('timestamp', '<=', endTimestamp),
            orderBy('timestamp', 'desc')
        );

        const querySnapshot = await getDocs(q);
        const transactions = [];

        querySnapshot.forEach(doc => {
            transactions.push({
                id: doc.id,
                ...doc.data()
            });
        });

        return transactions;

    } catch (error) {
        console.error('❌ Error loading month transactions:', error);
        return [];
    }
}

/**
 * Load budget data for current user
 */
export async function loadBudgets() {
    try {
        const { collection, getDocs, query, orderBy } = await import('https://www.gstatic.com/firebasejs/10.7.0/firebase-firestore.js');
        const db = getFirebaseDB();
        const userId = getUserId();

        const q = query(
            collection(db, `users/${userId}/budgets`),
            orderBy('createdAt', 'desc')
        );

        const querySnapshot = await getDocs(q);
        const budgets = [];

        querySnapshot.forEach(doc => {
            budgets.push({
                id: doc.id,
                ...doc.data()
            });
        });

        return budgets;
    } catch (error) {
        console.error('❌ Error loading budgets:', error);
        return [];
    }
}

export async function addBudget(category, limit) {
    try {
        const { addDoc, collection, serverTimestamp } = await import('https://www.gstatic.com/firebasejs/10.7.0/firebase-firestore.js');
        const db = getFirebaseDB();
        const userId = getUserId();

        const docRef = await addDoc(collection(db, `users/${userId}/budgets`), {
            category,
            limit,
            createdAt: serverTimestamp(),
            updatedAt: serverTimestamp()
        });

        console.log('✅ Budget added:', docRef.id);
        return docRef.id;
    } catch (error) {
        console.error('❌ Error adding budget:', error);
        throw error;
    }
}

/**
 * Calculate transaction statistics
 */
export function calculateStats(transactions) {
    const stats = {
        totalIncome: 0,
        totalExpense: 0,
        balance: 0,
        incomeCount: 0,
        expenseCount: 0,
        byCategory: {},
        byType: { income: [], expense: [] }
    };

    transactions.forEach(t => {
        if (t.type === 'income') {
            stats.totalIncome += t.amount;
            stats.incomeCount++;
            stats.byType.income.push(t);
        } else {
            stats.totalExpense += t.amount;
            stats.expenseCount++;
            stats.byType.expense.push(t);
        }

        // Category breakdown
        if (!stats.byCategory[t.category]) {
            stats.byCategory[t.category] = { income: 0, expense: 0, count: 0 };
        }

        if (t.type === 'income') {
            stats.byCategory[t.category].income += t.amount;
        } else {
            stats.byCategory[t.category].expense += t.amount;
        }
        stats.byCategory[t.category].count++;
    });

    stats.balance = stats.totalIncome - stats.totalExpense;

    return stats;
}

/**
 * Search transactions
 */
export function searchTransactions(transactions, query) {
    if (!query) return transactions;

    const lowerQuery = query.toLowerCase();
    return transactions.filter(t => 
        t.category.toLowerCase().includes(lowerQuery) ||
        (t.description && t.description.toLowerCase().includes(lowerQuery)) ||
        t.amount.toString().includes(lowerQuery)
    );
}

/**
 * Filter transactions by category
 */
export function filterByCategory(transactions, category) {
    if (!category) return transactions;
    return transactions.filter(t => t.category === category);
}

/**
 * Filter transactions by type
 */
export function filterByType(transactions, type) {
    if (!type) return transactions;
    return transactions.filter(t => t.type === type);
}

/**
 * Render transactions list
 */
export function renderTransactionsList(transactions, containerId = 'transactionsList') {
    const container = document.getElementById(containerId);
    if (!container) return;

    if (transactions.length === 0) {
        container.innerHTML = `
            <div class="text-center py-8">
                <i class="fas fa-inbox text-slate-500 text-4xl mb-3 block"></i>
                <p class="text-slate-400">No transactions found</p>
            </div>
        `;
        return;
    }

    container.innerHTML = transactions.map(transaction => createTransactionItemHTML(transaction)).join('');

    container.querySelectorAll('.transaction-item').forEach(item => {
        const transactionId = item.dataset.id;
        const editButton = item.querySelector('.transaction-edit');
        const deleteButton = item.querySelector('.transaction-delete');

        if (editButton) {
            editButton.addEventListener('click', (e) => {
                e.stopPropagation();
                openEditTransactionModal(transactionId);
            });
        }

        if (deleteButton) {
            deleteButton.addEventListener('click', (e) => {
                e.stopPropagation();
                deleteTransaction(transactionId);
            });
        }
    });
}

/**
 * Render recent transactions
 */
export function renderRecentTransactions(transactions) {
    const container = document.getElementById('recentTransactionsList');
    if (!container) return;

    const recentTransactions = transactions.slice(0, 5);

    if (recentTransactions.length === 0) {
        container.innerHTML = `
            <div class="text-center py-8">
                <p class="text-slate-400">No recent transactions</p>
            </div>
        `;
        return;
    }

    container.innerHTML = recentTransactions.map(transaction => createTransactionItemHTML(transaction)).join('');
}

/**
 * Get category distribution for analytics
 */
export function getCategoryDistribution(transactions) {
    const distribution = {};

    transactions.forEach(t => {
        if (t.type === 'expense') {
            if (!distribution[t.category]) {
                distribution[t.category] = 0;
            }
            distribution[t.category] += t.amount;
        }
    });

    return distribution;
}

/**
 * Make functions globally available
 */
window.openAddTransactionModal = openAddTransactionModal;
window.closeTransactionModal = closeTransactionModal;
window.openEditTransactionModal = openEditTransactionModal;
window.deleteTransaction = deleteTransaction;

// Setup event listeners
if (document.getElementById('transactionForm')) {
    document.getElementById('transactionForm').addEventListener('submit', handleTransactionSubmit);
}

// Search and filter handlers
if (document.getElementById('searchTransactions')) {
    document.getElementById('searchTransactions').addEventListener('input', async (e) => {
        const query = e.target.value;
        let filtered = transactionsCache;
        
        if (query) {
            filtered = searchTransactions(transactionsCache, query);
        }
        
        const category = document.getElementById('categoryFilter')?.value || '';
        const type = document.getElementById('typeFilter')?.value || '';
        
        if (category) filtered = filterByCategory(filtered, category);
        if (type) filtered = filterByType(filtered, type);
        
        renderTransactionsList(filtered);
    });
}

if (document.getElementById('categoryFilter')) {
    document.getElementById('categoryFilter').addEventListener('change', async (e) => {
        const category = e.target.value;
        let filtered = transactionsCache;
        
        const search = document.getElementById('searchTransactions')?.value || '';
        if (search) {
            filtered = searchTransactions(filtered, search);
        }
        
        const type = document.getElementById('typeFilter')?.value || '';
        if (category) filtered = filterByCategory(filtered, category);
        if (type) filtered = filterByType(filtered, type);
        
        renderTransactionsList(filtered);
    });
}

if (document.getElementById('typeFilter')) {
    document.getElementById('typeFilter').addEventListener('change', async (e) => {
        const type = e.target.value;
        let filtered = transactionsCache;
        
        const search = document.getElementById('searchTransactions')?.value || '';
        if (search) {
            filtered = searchTransactions(filtered, search);
        }
        
        const category = document.getElementById('categoryFilter')?.value || '';
        if (category) filtered = filterByCategory(filtered, category);
        if (type) filtered = filterByType(filtered, type);
        
        renderTransactionsList(filtered);
    });
}
