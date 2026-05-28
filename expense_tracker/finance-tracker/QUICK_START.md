# 🚀 QUICK START GUIDE

**Get FinanceHub running in 5 minutes!**

---

## Prerequisites
- ✅ Firebase account (free)
- ✅ Modern web browser
- ✅ Text editor (VS Code recommended)
- ✅ Live Server extension (optional but recommended)

---

## Quick Setup (3 Simple Steps)

### Step 1: Get Firebase Config (2 min)
1. Go to [Firebase Console](https://console.firebase.google.com)
2. Create new project or use existing Firebase project
3. Enable Email/Password authentication
4. Create Firestore database (test mode)
5. Copy Firebase config from Project Settings

### Step 2: Update Config (1 min)
1. Open `js/firebase.js`
2. Replace firebaseConfig with your actual config
3. Save file

### Step 3: Run Locally (2 min)
**Using Live Server:**
- Right-click `index.html`
- Click "Open with Live Server"
- Browser opens at `http://127.0.0.1:5500`

**Using Python:**
```bash
python -m http.server 8000
# Open http://localhost:8000
```

---

## First Use

1. **Sign Up**
   - Email: your@email.com
   - Password: any 6+ characters
   - Name: Your Name

2. **Login**
   - Use same credentials

3. **Add Transaction**
   - Click "Add Transaction"
   - Fill in details
   - Save

4. **View Dashboard**
   - See your totals
   - Check charts
   - View transactions

---

## File Structure
```
finance-tracker/
├── index.html           # Login page
├── dashboard.html       # Main app
├── js/
│   ├── firebase.js      # ⚙️ UPDATE THIS
│   ├── auth.js
│   ├── dashboard.js
│   ├── charts.js
│   ├── transactions.js
│   └── ui.js
├── css/
│   └── style.css
└── README.md            # Full documentation
```

---

## Troubleshooting

| Issue | Solution |
|-------|----------|
| Blank page | Hard refresh (Ctrl+F5) |
| Login error | Check Firebase config |
| No data loads | Check Firestore rules published |
| Charts missing | Check Chart.js CDN loaded |

---

## Next Steps

- ✅ Customize colors in `css/style.css`
- ✅ Add more categories in `firebase.js`
- ✅ Deploy to Firebase Hosting / Netlify / Vercel
- ✅ Read full [README.md](./README.md)
- ✅ Follow detailed [SETUP_GUIDE.md](./SETUP_GUIDE.md)

---

**Questions?** Check [README.md](./README.md) for full documentation

**Ready?** Open `index.html` with Live Server! 🎉
