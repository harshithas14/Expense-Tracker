// ============================================
// AUTHENTICATION MODULE
// ============================================

import {
    getFirebaseAuth,
    getFirebaseDB,
    isUserAuthenticated,
    getUserId,
    handleFirebaseError,
    formatDateForInput
} from './firebase.js';

import { showToast } from './ui.js';

let authInitialized = false;

/**
 * Setup authentication listeners
 */
export function setupAuthListeners() {
    const loginForm = document.getElementById('loginForm');
    const signupForm = document.getElementById('signupForm');

    if (loginForm) {
        loginForm.addEventListener('submit', handleLogin);
    }

    if (signupForm) {
        signupForm.addEventListener('submit', handleSignup);
    }

    // Set minimum date
    const dateInput = document.getElementById('transactionDate');
    if (dateInput) {
        dateInput.value = formatDateForInput(new Date());
    }

    authInitialized = true;
}

/**
 * Handle user login
 */
export async function handleLogin(e) {
    e.preventDefault();

    const email = document.getElementById('loginEmail').value;
    const password = document.getElementById('loginPassword').value;
    const errorDiv = document.getElementById('loginError');

    try {
        showLoading(true);
        errorDiv.classList.add('hidden');

        // Dynamic import Firebase Auth
        const { signInWithEmailAndPassword } = await import('https://www.gstatic.com/firebasejs/10.7.0/firebase-auth.js');

        const auth = getFirebaseAuth();
        const result = await signInWithEmailAndPassword(auth, email, password);

        console.log('✅ Login successful:', result.user.email);
        showToast('success', 'Login Successful!', `Welcome back, ${result.user.email}`);

        // Redirect to dashboard
        setTimeout(() => {
            window.location.href = 'dashboard.html';
        }, 1000);

    } catch (error) {
        console.error('❌ Login error:', error);
        const errorMessage = handleFirebaseError(error);
        errorDiv.textContent = errorMessage;
        errorDiv.classList.remove('hidden');
        showToast('error', 'Login Failed', errorMessage);
    } finally {
        showLoading(false);
    }
}

/**
 * Handle user signup
 */
export async function handleSignup(e) {
    e.preventDefault();

    const name = document.getElementById('signupName').value;
    const email = document.getElementById('signupEmail').value;
    const password = document.getElementById('signupPassword').value;
    const confirmPassword = document.getElementById('signupConfirm').value;
    const errorDiv = document.getElementById('signupError');

    try {
        errorDiv.classList.add('hidden');

        // Validate password match
        if (password !== confirmPassword) {
            throw new Error('Passwords do not match');
        }

        // Validate password strength
        if (password.length < 6) {
            throw new Error('Password must be at least 6 characters');
        }

        showLoading(true);

        // Dynamic import Firebase Auth
        const { createUserWithEmailAndPassword, updateProfile } = await import('https://www.gstatic.com/firebasejs/10.7.0/firebase-auth.js');
        const { doc, setDoc } = await import('https://www.gstatic.com/firebasejs/10.7.0/firebase-firestore.js');

        const auth = getFirebaseAuth();
        const db = getFirebaseDB();

        // Create user account
        const result = await createUserWithEmailAndPassword(auth, email, password);
        const user = result.user;

        // Update user profile
        await updateProfile(user, {
            displayName: name
        });

        // Create user document in Firestore
        await setDoc(doc(db, 'users', user.uid), {
            name: name,
            email: email,
            createdAt: new Date().getTime(),
            updatedAt: new Date().getTime(),
            currency: 'INR',
            theme: 'dark'
        });

        console.log('✅ Signup successful:', user.email);
        showToast('success', 'Account Created!', 'Redirecting to dashboard...');

        // Redirect to dashboard
        setTimeout(() => {
            window.location.href = 'dashboard.html';
        }, 1500);

    } catch (error) {
        console.error('❌ Signup error:', error);
        const errorMessage = error.message || handleFirebaseError(error);
        errorDiv.textContent = errorMessage;
        errorDiv.classList.remove('hidden');
        showToast('error', 'Signup Failed', errorMessage);
    } finally {
        showLoading(false);
    }
}

/**
 * Check authorization status
 */
export async function checkAuthStatus() {
    try {
        // Dynamic import Firebase Auth
        const { onAuthStateChanged } = await import('https://www.gstatic.com/firebasejs/10.7.0/firebase-auth.js');

        const auth = getFirebaseAuth();

        return new Promise((resolve) => {
            const unsubscribe = onAuthStateChanged(auth, (user) => {
                if (!user) {
                    // Not authenticated, redirect to login
                    if (window.location.pathname.includes('dashboard.html')) {
                        window.location.href = 'index.html';
                    }
                } else {
                    // User is authenticated
                    loadUserProfile(user);
                    updateUserInfo(user);
                }
                unsubscribe();
                resolve(user);
            });
        });

    } catch (error) {
        console.error('❌ Auth status check error:', error);
    }
}

/**
 * Load user profile data
 */
export async function loadUserProfile(user) {
    try {
        const { doc, getDoc } = await import('https://www.gstatic.com/firebasejs/10.7.0/firebase-firestore.js');

        const db = getFirebaseDB();
        const userDocRef = doc(db, 'users', user.uid);
        const userDocSnap = await getDoc(userDocRef);

        if (userDocSnap.exists()) {
            return userDocSnap.data();
        } else {
            // Create user document if it doesn't exist
            const { setDoc } = await import('https://www.gstatic.com/firebasejs/10.7.0/firebase-firestore.js');
            const userData = {
                name: user.displayName || user.email,
                email: user.email,
                createdAt: new Date().getTime(),
                updatedAt: new Date().getTime(),
                currency: 'INR',
                theme: 'dark'
            };
            await setDoc(userDocRef, userData);
            return userData;
        }
    } catch (error) {
        console.error('❌ Error loading user profile:', error);
        return null;
    }
}

/**
 * Update user info in UI
 */
export function updateUserInfo(user) {
    const userName = user.displayName || user.email;
    const userEmail = user.email;

    // Update all user info displays
    document.querySelectorAll('#userNameDisplay').forEach(el => {
        el.textContent = userName;
    });

    document.querySelectorAll('#userEmailDisplay').forEach(el => {
        el.textContent = userEmail;
    });

    document.querySelectorAll('#userGreeting').forEach(el => {
        el.textContent = userName.split(' ')[0];
    });
}

/**
 * Handle logout
 */
export async function handleLogout() {
    try {
        const { signOut } = await import('https://www.gstatic.com/firebasejs/10.7.0/firebase-auth.js');

        const auth = getFirebaseAuth();
        await signOut(auth);

        console.log('✅ Logout successful');
        showToast('success', 'Logged Out', 'See you next time!');

        // Redirect to login
        setTimeout(() => {
            window.location.href = 'index.html';
        }, 1000);

    } catch (error) {
        console.error('❌ Logout error:', error);
        showToast('error', 'Logout Failed', error.message);
    }
}

/**
 * Toggle between login and signup forms
 */
export function toggleAuthForms() {
    const loginForm = document.getElementById('login-form');
    const signupForm = document.getElementById('signup-form');

    if (loginForm && signupForm) {
        loginForm.classList.toggle('hidden');
        signupForm.classList.toggle('hidden');
    }
}

// Make functions globally available
window.handleLogout = handleLogout;
window.toggleAuthForms = toggleAuthForms;

/**
 * Show loading state
 */
function showLoading(show) {
    const overlay = document.getElementById('loadingOverlay');
    if (overlay) {
        overlay.classList.toggle('hidden', !show);
    }
}
