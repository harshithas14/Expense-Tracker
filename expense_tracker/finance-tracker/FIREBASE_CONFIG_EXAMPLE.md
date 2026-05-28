// ============================================
// FIREBASE CONFIGURATION EXAMPLE
// ============================================
// 
// This file shows how to properly configure Firebase for the FinanceHub app
// 
// INSTRUCTIONS:
// 1. Go to Firebase Console (https://console.firebase.google.com)
// 2. Select your project
// 3. Click gear icon (Settings) → Project Settings
// 4. Scroll to "Your apps" section
// 5. Click on your web app
// 6. Copy the firebaseConfig object
// 7. Replace the config in js/firebase.js with YOUR actual values
// 
// ============================================

// ❌ EXAMPLE OF INCORRECT CONFIG (PLACEHOLDER VALUES)
// DON'T USE THESE VALUES!
const firebaseConfig_EXAMPLE = {
    apiKey: "AIzaSyDzKsV8cV_xCd-A-Uh_3GYWKZHLVmXcDew",           // ❌ NOT A REAL KEY
    authDomain: "finance-hub-9847a.firebaseapp.com",           // ❌ NOT A REAL DOMAIN
    projectId: "finance-hub-9847a",                            // ❌ NOT A REAL PROJECT
    storageBucket: "finance-hub-9847a.firebasestorage.app",    // ❌ NOT A REAL BUCKET
    messagingSenderId: "123456789012",                         // ❌ NOT A REAL ID
    appId: "1:123456789012:web:abcdef1234567890abcdef"         // ❌ NOT A REAL ID
};

// ============================================
// ✅ EXAMPLE OF CORRECT STRUCTURE
// ============================================
// Replace with YOUR actual Firebase config from Firebase Console

const firebaseConfig = {
    // Get from Firebase Console → Project Settings
    apiKey: "YOUR_API_KEY_HERE",
    
    // Format: projectname-unique.firebaseapp.com
    authDomain: "YOUR_PROJECT_ID.firebaseapp.com",
    
    // Your Firebase project name
    projectId: "your-project-id",
    
    // Format: projectname-unique.appspot.com
    storageBucket: "your-project-id.appspot.com",
    
    // Messaging sender ID (usually 12-digit number)
    messagingSenderId: "1234567890123",
    
    // App ID format: 1:senderid:web:alphauniquestring
    appId: "1:1234567890123:web:abc123def456ghi789"
};

// ============================================
// WHERE TO FIND EACH VALUE
// ============================================

/*
1. apiKey:
   - Location: Firebase Console → Project Settings → Web App
   - Looks like: "AIzaSy..."
   - Purpose: Identify your app

2. authDomain:
   - Location: Firebase Console → Project Settings
   - Looks like: "my-app-abc123.firebaseapp.com"
   - Purpose: Authentication endpoint

3. projectId:
   - Location: Firebase Console → Project Settings
   - Looks like: "my-app-abc123"
   - Purpose: Identify Firestore database

4. storageBucket:
   - Location: Firebase Console → Project Settings
   - Looks like: "my-app-abc123.appspot.com"
   - Purpose: Cloud Storage endpoint

5. messagingSenderId:
   - Location: Firebase Console → Project Settings
   - Looks like: "1234567890123"
   - Purpose: Cloud Messaging

6. appId:
   - Location: Firebase Console → Project Settings
   - Looks like: "1:1234567890123:web:abc123def456ghi789"
   - Purpose: App identification
*/

// ============================================
// HOW TO UPDATE IN YOUR PROJECT
// ============================================

/*
1. Open file: js/firebase.js
2. Find this section (around line 5-12):

    const firebaseConfig = {
        apiKey: "AIzaSyDzKsV8cV_xCd-A-Uh_3GYWKZHLVmXcDew",
        authDomain: "finance-hub-9847a.firebaseapp.com",
        projectId: "finance-hub-9847a",
        storageBucket: "finance-hub-9847a.firebasestorage.app",
        messagingSenderId: "123456789012",
        appId: "1:123456789012:web:abcdef1234567890abcdef"
    };

3. Replace ALL values with YOUR actual Firebase config

4. Save the file (Ctrl+S)

5. That's it! Your app should now connect to Firebase
*/

// ============================================
// FIREBASE CONSOLE STEPS
// ============================================

/*
STEP 1: Go to https://console.firebase.google.com
STEP 2: Select your project
STEP 3: Click gear icon (⚙️) → Project Settings
STEP 4: Scroll down to "Your apps"
STEP 5: Find your web app under "Apps in this project"
STEP 6: Click on it to show the config
STEP 7: You'll see:

    const firebaseConfig = {
      apiKey: "YOUR_ACTUAL_API_KEY",
      authDomain: "YOUR_ACTUAL_AUTH_DOMAIN",
      projectId: "YOUR_ACTUAL_PROJECT_ID",
      storageBucket: "YOUR_ACTUAL_STORAGE_BUCKET",
      messagingSenderId: "YOUR_ACTUAL_SENDER_ID",
      appId: "YOUR_ACTUAL_APP_ID"
    };

STEP 8: Copy this ENTIRE block
STEP 9: Open js/firebase.js
STEP 10: Replace the firebaseConfig object with YOUR config
STEP 11: Save and reload your app
*/

// ============================================
// SECURITY REMINDERS
// ============================================

/*
🔒 SECURITY TIPS:

1. ✅ DO put your actual config in js/firebase.js (it's client-side, clients need it)

2. ❌ DON'T commit sensitive data to public GitHub
   - Add js/firebase.js to .gitignore if posting to GitHub
   - Use a private repository

3. ✅ DO enable Firebase Security Rules
   - Users can only access their own data
   - Read firebase/firestore.rules

4. ❌ DON'T put real Firebase config in comments on public repos

5. ✅ DO regularly rotate API keys
   - Go Firebase Console → Settings → Service Accounts
   - Generate new keys periodically

6. ✅ DO use Firestore Security Rules
   - They're already configured in firebase/firestore.rules
   - Make sure to publish them in Firebase Console
*/

// ============================================
// TESTING YOUR CONFIG
// ============================================

/*
To verify your Firebase config is correct:

1. Open index.html in browser
2. Open DevTools (F12)
3. Go to Console tab
4. Try to sign up
5. Check if:
   - ✅ Sign up works
   - ✅ User created in Firebase Auth
   - ✅ Dashboard loads
   - ✅ Can create transactions
   - ✅ Data appears in Firestore

If anything fails:
1. Open Console tab (F12)
2. Look for error messages
3. Check your Firebase config values
4. Verify Firebase project settings match
5. Ensure Firestore database is created
6. Ensure Authentication is enabled
*/

// ============================================
// COMMON CONFIG MISTAKES
// ============================================

/*
❌ MISTAKE 1: Using example values
   Wrong: apiKey: "AIzaSyDzKsV8cV_xCd-A-Uh_3GYWKZHLVmXcDew"
   Right: apiKey: "YOUR_ACTUAL_API_KEY_FROM_FIREBASE"

❌ MISTAKE 2: Missing values
   Wrong: authDomain: ""
   Right: authDomain: "my-project-12345.firebaseapp.com"

❌ MISTAKE 3: Extra spaces or quotes
   Wrong: apiKey: " AIzaSyD... "
   Right: apiKey: "AIzaSyD..."

❌ MISTAKE 4: Wrong project ID
   Wrong: projectId: "other-project-123"
   Right: projectId: "my-finance-app-456"

❌ MISTAKE 5: Not saving file
   - Always press Ctrl+S after editing!

✅ FIX: Copy-paste directly from Firebase Console
   - Reduces copy-paste errors
   - Ensures all values are correct
*/

// ============================================
// STILL HAVING ISSUES?
// ============================================

/*
📚 Read the full documentation:
   - SETUP_GUIDE.md (Step-by-step Firebase setup)
   - README.md (Complete project documentation)
   - QUICK_START.md (Get running in 5 minutes)

🔗 Firebase Documentation:
   - https://firebase.google.com/docs/web/setup
   - https://firebase.google.com/docs/firestore/quickstart

🐛 Debug tips:
   - Open browser console (F12)
   - Look for error messages
   - Check Firebase console for data
   - Verify credentials are correct
   - Clear browser cache (Ctrl+Shift+Delete)

💬 Get help:
   1. Check the README.md troubleshooting section
   2. Google the error message
   3. Check Firebase documentation
   4. Open an issue on GitHub
*/

export const EXAMPLE_CONFIG = firebaseConfig_EXAMPLE;
