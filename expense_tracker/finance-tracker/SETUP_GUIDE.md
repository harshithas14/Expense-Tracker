# 🔧 FIREBASE SETUP GUIDE - STEP BY STEP

This guide will walk you through setting up Firebase for the FinanceHub application.

## ⏱️ Time Required: 10-15 minutes

---

## STEP 1: Create Firebase Project

### 1.1 Go to Firebase Console
- Open [Firebase Console](https://console.firebase.google.com)
- Sign in with your Google account (create one if you don't have)

### 1.2 Create New Project
- Click "Add project" or "Create project"
- Enter project name: `FinanceHub` (or your preferred name)
- Disable "Enable Google Analytics" (optional)
- Click "Create project"
- Wait 2-3 minutes for project creation

### 1.3 Project Overview
You'll see the Firebase dashboard. Keep this tab open!

---

## STEP 2: Enable Authentication

### 2.1 Navigate to Authentication
1. In left sidebar, click "Build" → "Authentication"
2. Click "Get started"

### 2.2 Enable Email/Password
1. Look for "Email/Password" option
2. Click on it
3. Toggle "Enable" switch ON
4. Click "Save"

### 2.3 Verify Setup
✅ You should see "Email/Password" listed as enabled

---

## STEP 3: Create Firestore Database

### 3.1 Navigate to Firestore
1. In left sidebar, click "Build" → "Firestore Database"
2. Click "Create database"

### 3.2 Configure Database
1. **Security rules**: Select "Start in test mode"
2. **Location**: Choose region closest to you
   - North America: `us-central1`
   - Europe: `europe-west1`
   - Asia-Pacific: `asia-southeast1`
3. Click "Create"
4. Wait for database creation (2-3 minutes)

### 3.3 Verify Setup
✅ You should see "Firestore Database" is active

---

## STEP 4: Get Firebase Configuration

### 4.1 Open Project Settings
1. Click gear icon (⚙️) in top-left
2. Click "Project Settings"

### 4.2 Go to Your Apps
1. Scroll down to "Your apps" section
2. Look for "Web" app icon
3. If no app exists, click "</>" (Web icon)
4. Register app with name: `FinanceHub`
5. Click "Register app"

### 4.3 Copy Firebase Config
1. You'll see code snippet with `const firebaseConfig = {...}`
2. Copy the entire config object
3. **Important**: Keep this private! Don't share it!

Example format:
```javascript
const firebaseConfig = {
  apiKey: "AIzaSyDzKsV8cV_xCd-A-Uh_3GYWKZHLVmXcDew",
  authDomain: "finance-hub-9847a.firebaseapp.com",
  projectId: "finance-hub-9847a",
  storageBucket: "finance-hub-9847a.firebasestorage.app",
  messagingSenderId: "123456789012",
  appId: "1:123456789012:web:abcdef1234567890abcdef"
};
```

---

## STEP 5: Update Application Configuration

### 5.1 Open firebase.js
1. Navigate to `js/firebase.js`
2. Find this section:
```javascript
const firebaseConfig = {
    apiKey: "YOUR_API_KEY",
    authDomain: "YOUR_AUTH_DOMAIN",
    projectId: "YOUR_PROJECT_ID",
    storageBucket: "YOUR_STORAGE_BUCKET",
    messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
    appId: "YOUR_APP_ID"
};
```

### 5.2 Replace with Your Config
1. Replace all `YOUR_*` values with your actual Firebase config
2. **Save the file** (Ctrl+S)

Example after replacement:
```javascript
const firebaseConfig = {
    apiKey: "AIzaSyDzKsV8cV_xCd-A-Uh_3GYWKZHLVmXcDew",
    authDomain: "finance-hub-9847a.firebaseapp.com",
    projectId: "finance-hub-9847a",
    storageBucket: "finance-hub-9847a.firebasestorage.app",
    messagingSenderId: "123456789012",
    appId: "1:123456789012:web:abcdef1234567890abcdef"
};
```

---

## STEP 6: Configure Firestore Security Rules

### 6.1 Open Firestore Rules
1. In Firebase Console, go to "Firestore Database"
2. Click "Rules" tab at top

### 6.2 Copy Rules
1. Open `firebase/firestore.rules` file in your project
2. Copy the entire content

### 6.3 Replace Rules in Firebase
1. In Firebase Console Rules tab, select all and delete existing rules
2. Paste the rules from `firestore.rules`
3. Click "Publish"

The rules should look like:
```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /users/{userId} {
      allow read, write: if request.auth.uid == userId;
      
      match /transactions/{transactionId} {
        allow read, write: if request.auth.uid == userId;
        ...
      }
    }
  }
}
```

### 6.4 Verify
✅ Rules should be published (turned from red to green)

---

## STEP 7: Run the Application

### Option A: Using Live Server (VS Code)

1. **Install Live Server Extension** (if not already installed)
   - Open VS Code
   - Ctrl+Shift+X (Extensions)
   - Search "Live Server"
   - Install by Ritwick Dey

2. **Start Live Server**
   - Right-click `index.html`
   - Select "Open with Live Server"
   - Browser opens automatically at `http://127.0.0.1:5500`

### Option B: Using npm

1. **Install http-server**
   ```bash
   npm install
   npm run dev
   ```

2. **Open Browser**
   - Go to `http://localhost:5173`

### Option C: Using Python

1. **Run Python Server**
   ```bash
   python -m http.server 8000
   ```

2. **Open Browser**
   - Go to `http://localhost:8000`

---

## STEP 8: Test the Application

### 8.1 Sign Up
1. Fill in name, email, password
2. Click "Create Account"
3. Should redirect to dashboard

### 8.2 Create Transaction
1. Click "Add Transaction"
2. Select type (Income/Expense)
3. Choose category
4. Enter amount
5. Select date
6. Click "Save Transaction"

### 8.3 Check Firestore
1. Go back to Firebase Console
2. Click "Firestore Database"
3. Check "users" collection
4. Should see your user ID and transaction data

---

## ✅ VERIFICATION CHECKLIST

- [ ] Firebase project created
- [ ] Authentication enabled (Email/Password)
- [ ] Firestore database created
- [ ] Firebase config copied to `js/firebase.js`
- [ ] Firestore rules published
- [ ] Application running on local server
- [ ] Can sign up and login
- [ ] Can create transactions
- [ ] Transactions appear in Firestore
- [ ] Dashboard displays data correctly

---

## 🐛 COMMON ISSUES & SOLUTIONS

### Issue: "Firebase is not defined"
**Solution:**
- Check Firebase is loading from CDN
- Check internet connection
- Clear browser cache (Ctrl+Shift+Delete)
- Check browser console for errors

### Issue: "Auth/invalid-api-key"
**Solution:**
- Double-check Firebase config values
- Ensure no extra spaces or quotes
- Regenerate API key in Firebase Console

### Issue: "Permission denied" when adding transactions
**Solution:**
- Check Firestore rules are published
- Verify user is authenticated
- Check UID matches in rules

### Issue: "Cannot read property 'uid' of null"
**Solution:**
- Ensure user is logged in before accessing dashboard
- Check authentication setup is complete
- Clear localStorage and try again

### Issue: Charts not showing
**Solution:**
- Verify Chart.js CDN is loading
- Check browser console for errors
- Ensure transactions exist in database
- Hard refresh browser (Ctrl+F5)

---

## 🔒 SECURITY NOTES

1. **Never commit firebase.js with real config to GitHub**
   - Add to `.gitignore`
   - Use environment variables for production

2. **Firestore Rules**
   - Rules prevent user accessing other user's data
   - Each user only sees their own transactions

3. **Authentication**
   - Passwords are managed by Firebase
   - We never handle raw passwords
   - Sessions auto-expire

---

## 🚀 NEXT STEPS

1. **Customize the app**
   - Change colors in `css/style.css`
   - Add more categories in `firebase.js`
   - Modify dashboard layout

2. **Add More Features**
   - Budget tracking
   - Recurring transactions
   - Export to PDF/CSV

3. **Deploy Publicly**
   - Use Firebase Hosting
   - Use Netlify
   - Use Vercel

---

## 📞 GETTING HELP

- Check [README.md](./README.md) for general info
- Visit [Firebase Docs](https://firebase.google.com/docs)
- Check browser console for error messages
- Test in Firestore console to verify data

---

## 🎉 You're All Set!

Your Firebase + FinanceHub app is ready to use!

**Happy Tracking!** 💰📊

For detailed API documentation, see [Firebase Documentation](https://firebase.google.com/docs/firestore)
