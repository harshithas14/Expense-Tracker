// ============================================
// FIREBASE CONFIGURATION & INITIALIZATION
// ============================================

// Replace with your Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBFNutkaW1qDEXK1yxWm4JW0fbhUbnXueY",
  authDomain: "financetracker-4f38e.firebaseapp.com",
  projectId: "financetracker-4f38e",
  storageBucket: "financetracker-4f38e.firebasestorage.app",
  messagingSenderId: "719491407899",
  appId: "1:719491407899:web:921fe008f3a8eda696d8be",
  measurementId: "G-BD6X8BEFKY"
};

let db = null;
let auth = null;

/**
 * Initialize Firebase with error handling
 */
export async function initializeFirebase() {
    try {
        // Import Firebase SDK
        const { initializeApp } = await import('https://www.gstatic.com/firebasejs/10.7.0/firebase-app.js');
        const { getAuth } = await import('https://www.gstatic.com/firebasejs/10.7.0/firebase-auth.js');
        const { getFirestore } = await import('https://www.gstatic.com/firebasejs/10.7.0/firebase-firestore.js');

        // Initialize Firebase
        const app = initializeApp(firebaseConfig);
        auth = getAuth(app);
        db = getFirestore(app);

        console.log('🔥 Firebase initialized successfully');
        return { app, auth, db };
    } catch (error) {
        console.error('❌ Firebase initialization error:', error);
        throw error;
    }
}

export async function ensureFirebaseInitialized() {
    if (!auth || !db) {
        await initializeFirebase();
    }
    return { auth, db };
}

/**
 * Get Firebase Auth instance
 */
export function getFirebaseAuth() {
    return auth;
}

/**
 * Get Firestore Database instance
 */
export function getFirebaseDB() {
    return db;
}

/**
 * Get current user
 */
export function getCurrentUser() {
    if (!auth) return null;
    return auth.currentUser;
}

/**
 * Check if user is authenticated
 */
export function isUserAuthenticated() {
    return getCurrentUser() !== null;
}

/**
 * Get user ID
 */
export function getUserId() {
    const user = getCurrentUser();
    return user ? user.uid : null;
}

/**
 * Get user email
 */
export function getUserEmail() {
    const user = getCurrentUser();
    return user ? user.email : null;
}

/**
 * Get user display name
 */
export function getUserName() {
    const user = getCurrentUser();
    return user ? user.displayName || user.email : null;
}

/**
 * Firebase error handler
 */
export function handleFirebaseError(error) {
    const errorMessages = {
        'auth/email-already-in-use': 'Email is already registered',
        'auth/weak-password': 'Password should be at least 6 characters',
        'auth/invalid-email': 'Invalid email address',
        'auth/user-not-found': 'User not found',
        'auth/wrong-password': 'Incorrect password',
        'auth/user-disabled': 'User account is disabled',
        'auth/too-many-requests': 'Too many login attempts. Please try again later',
        'auth/operation-not-allowed': 'Operation not allowed',
    };

    return errorMessages[error.code] || error.message || 'An error occurred';
}

/**
 * Transaction categories
 */
export const TRANSACTION_CATEGORIES = [
    'Salary',
    'Food',
    'Travel',
    'Shopping',
    'Bills',
    'Entertainment',
    'Health',
    'Education',
    'Others'
];

/**
 * Category icons and colors
 */
export const CATEGORY_CONFIG = {
    'Salary': { icon: 'fas fa-briefcase', color: '#10b981', bgColor: 'bg-green-500/20' },
    'Food': { icon: 'fas fa-utensils', color: '#f97316', bgColor: 'bg-orange-500/20' },
    'Travel': { icon: 'fas fa-plane', color: '#3b82f6', bgColor: 'bg-blue-500/20' },
    'Shopping': { icon: 'fas fa-shopping-bag', color: '#ec4899', bgColor: 'bg-pink-500/20' },
    'Bills': { icon: 'fas fa-receipt', color: '#ef4444', bgColor: 'bg-red-500/20' },
    'Entertainment': { icon: 'fas fa-film', color: '#a855f7', bgColor: 'bg-purple-500/20' },
    'Health': { icon: 'fas fa-heart', color: '#06b6d4', bgColor: 'bg-cyan-500/20' },
    'Education': { icon: 'fas fa-book', color: '#6366f1', bgColor: 'bg-indigo-500/20' },
    'Others': { icon: 'fas fa-circle', color: '#64748b', bgColor: 'bg-slate-500/20' }
};

/**
 * Format currency
 */
export function formatCurrency(amount) {
    if (amount == null || isNaN(amount)) {
        return '₹0.00';
    }
    return new Intl.NumberFormat('en-IN', {
        style: 'currency',
        currency: 'INR',
        maximumFractionDigits: 2,
        minimumFractionDigits: 2
    }).format(Number(amount));
}

/**
 * Format date
 */
export function formatDate(date) {
    if (typeof date === 'number') {
        date = new Date(date);
    }
    return new Intl.DateTimeFormat('en-IN', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
    }).format(date);
}

/**
 * Format date for input
 */
export function formatDateForInput(date) {
    if (typeof date === 'number') {
        date = new Date(date);
    }
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
}

/**
 * Parse date from input
 */
export function parseDateFromInput(dateString) {
    const date = new Date(dateString);
    return date.getTime();
}
