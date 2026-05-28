# 🏦 FinanceHub - Personal Finance & Expense Tracking Application

A modern, production-ready Firebase-based Personal Finance and Expense Tracking application built with HTML5, CSS3, JavaScript (ES6 Modules), Tailwind CSS, and Firebase.

## ✨ Features

### 🔐 Authentication
- ✅ User Signup with email and password
- ✅ User Login with persistent sessions
- ✅ Secure Logout
- ✅ Firebase Email/Password Authentication
- ✅ Session persistence across page refreshes

### 📊 Dashboard
- ✅ Beautiful sidebar navigation with icons
- ✅ Top navigation bar with quick actions
- ✅ Welcome section with user greeting
- ✅ Dashboard statistics cards:
  - Total Balance
  - Total Income (this month)
  - Total Expense (this month)
  - Savings (Income - Expense)
- ✅ Expense distribution doughnut chart
- ✅ Monthly comparison bar chart
- ✅ Recent transactions list
- ✅ Quick refresh button

### 💰 Transactions Management
- ✅ Add Income transactions
- ✅ Add Expense transactions
- ✅ Edit existing transactions
- ✅ Delete transactions
- ✅ Complete transaction history
- ✅ Search transactions by keyword
- ✅ Filter by category
- ✅ Filter by transaction type (income/expense)
- ✅ Date-based sorting

### 📂 Categories
- ✅ Salary
- ✅ Food
- ✅ Travel
- ✅ Shopping
- ✅ Bills
- ✅ Entertainment
- ✅ Health
- ✅ Education
- ✅ Others

### 📈 Analytics & Reports
- ✅ Monthly breakdown with bar charts
- ✅ Income vs Expense trend analysis
- ✅ Monthly statistics (income, expense, savings, daily average)
- ✅ Category-wise expense distribution
- ✅ Month and year selectors
- ✅ Real-time chart updates

### 💳 Budget Management
- ✅ Set budget limits for categories
- ✅ Track spending against budget
- ✅ Budget progress indicators
- ✅ Budget summary statistics

### 🎨 UI/UX Features
- ✅ Modern glassmorphism dashboard design
- ✅ Smooth animations and transitions
- ✅ Responsive design (mobile, tablet, desktop)
- ✅ Dark mode theme (default)
- ✅ Toast notifications
- ✅ Loading animations
- ✅ Empty state UI
- ✅ Responsive sidebar (mobile toggle)
- ✅ User profile section
- ✅ Real-time dashboard statistics
- ✅ Animated counter values
- ✅ Gradient backgrounds
- ✅ Card-based layouts
- ✅ Hover effects and interactive elements

### 🔧 Technical Features
- ✅ Firebase Firestore Database
- ✅ User-specific data isolation
- ✅ Real-time updates
- ✅ Cloud-based storage
- ✅ ES6 Modules for clean code
- ✅ Modular architecture
- ✅ Chart.js for data visualization
- ✅ Font Awesome icons
- ✅ Tailwind CSS styling
- ✅ Zero build process (works with Live Server)

## 📁 Project Structure

```
finance-tracker/
│
├── index.html                 # Login & Signup page
├── dashboard.html             # Main dashboard page
├── package.json              # Project dependencies
├── README.md                 # This file
│
├── css/
│   └── style.css            # Custom styles & Tailwind configuration
│
├── js/
│   ├── firebase.js          # Firebase initialization & utilities
│   ├── auth.js              # Authentication logic
│   ├── dashboard.js         # Dashboard functionality
│   ├── charts.js            # Chart.js integration
│   ├── transactions.js      # Transaction management
│   └── ui.js                # UI utilities & helpers
│
├── firebase/
│   └── firestore.rules      # Firestore security rules
│
└── assets/                  # (For future assets)
```

## 🚀 Getting Started

### Prerequisites
- Modern web browser (Chrome, Firefox, Safari, Edge)
- Node.js (optional, for live server)
- Firebase account (free tier sufficient)

### Installation

#### Option 1: Using Live Server (Recommended for Beginners)

1. **Clone or download the project**
   ```bash
   git clone <repository-url>
   cd finance-tracker
   ```

2. **Install Live Server extension in VS Code**
   - Open VS Code
   - Go to Extensions (Ctrl+Shift+X)
   - Search for "Live Server"
   - Install by "Ritwick Dey"

3. **Setup Firebase**
   - Go to [Firebase Console](https://console.firebase.google.com)
   - Create a new project
   - Enable Email/Password authentication
   - Create a Firestore database
   - Get your Firebase config

4. **Update Firebase Configuration**
   - Open `js/firebase.js`
   - Replace the `firebaseConfig` object with your credentials:
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

5. **Start the development server**
   - Right-click on `index.html`
   - Select "Open with Live Server"
   - Browser opens at `http://127.0.0.1:5500`

#### Option 2: Using http-server (NPM)

1. **Install dependencies**
   ```bash
   npm install
   ```

2. **Start development server**
   ```bash
   npm run dev
   ```

3. **Open browser**
   - Navigate to `http://localhost:5173`

#### Option 3: Using Python's built-in server

1. **Python 3.x**
   ```bash
   python -m http.server 8000
   ```

2. **Python 2.x**
   ```bash
   python -m SimpleHTTPServer 8000
   ```

3. **Open browser**
   - Navigate to `http://localhost:8000`

## 🔐 Firebase Setup Guide

### Step 1: Create Firebase Project
1. Go to [Firebase Console](https://console.firebase.google.com)
2. Click "Add project"
3. Enter project name (e.g., "FinanceHub")
4. Accept terms and create project

### Step 2: Enable Authentication
1. In Firebase Console, go to "Authentication"
2. Click "Get started"
3. Select "Email/Password"
4. Enable and save

### Step 3: Create Firestore Database
1. In Firebase Console, go to "Firestore Database"
2. Click "Create database"
3. Start in test mode (for development)
4. Select region (closest to you)
5. Create database

### Step 4: Get Firebase Config
1. Go to Project Settings
2. Scroll to "Your apps"
3. Click on Web app icon
4. Copy the config object
5. Update in `js/firebase.js`

### Step 5: Deploy Security Rules
1. Open `firebase/firestore.rules`
2. Copy the rules
3. In Firestore, go to "Rules"
4. Replace with the copied rules
5. Publish

## 📱 Usage Guide

### First Time Setup
1. **Sign Up**
   - Click "Sign Up"
   - Enter your name, email, and password
   - Click "Create Account"

2. **Login**
   - Enter email and password
   - Click "Sign In"
   - You'll be redirected to dashboard

### Adding Transactions
1. **Click "Add Transaction" button**
2. **Select Transaction Type** (Income/Expense)
3. **Choose Category** from dropdown
4. **Enter Amount**
5. **Select Date**
6. **Add Description** (optional)
7. **Click "Save Transaction"**

### Viewing Transactions
1. **Go to Transactions tab**
2. **Search** by keyword
3. **Filter** by category or type
4. **Click transaction** to edit
5. **Delete** by clicking delete button

### Viewing Analytics
1. **Go to Analytics tab**
2. **Select Month and Year**
3. **Click Update** to refresh
4. **View charts and statistics**

### Managing Budget
1. **Go to Budget tab**
2. **Click "Add Budget"**
3. **Set category and limit**
4. **Track spending** against limits

## 🎯 Features Walkthrough

### Dashboard
- **Total Balance**: Sum of all income minus expenses
- **Total Income**: Sum of all income transactions (current month)
- **Total Expense**: Sum of all expense transactions (current month)
- **Savings**: Income - Expense for current month
- **Charts**: Visual representation of spending patterns
- **Recent Transactions**: Last 5 transactions

### Transactions Tab
- **Full transaction history**
- **Advanced filtering and search**
- **Quick edit/delete actions**
- **Real-time list updates**

### Analytics Tab
- **Monthly trend analysis**
- **Category-wise breakdown**
- **Income vs Expense comparison**
- **Daily average spending**
- **Statistical summary**

### Budget Tab
- **Category budgets**
- **Spending trackers**
- **Budget alerts**
- **Progress visualization**

## 🎨 Customization

### Change Theme Colors
Edit `css/style.css` and modify the color variables in Tailwind config.

### Add New Categories
1. Update `TRANSACTION_CATEGORIES` in `js/firebase.js`
2. Add category config in `CATEGORY_CONFIG`
3. Add icon and color

### Modify Dashboard Layout
Edit `dashboard.html` to customize grid layouts and components.

## 🐛 Troubleshooting

### Issue: Firebase Connection Error
**Solution:**
- Check Firebase config in `js/firebase.js`
- Verify API key and project ID
- Check internet connection
- Clear browser cache

### Issue: Transactions Not Loading
**Solution:**
- Check Firestore database rules
- Verify user is authenticated
- Check browser console for errors
- Ensure Firestore is in "test mode" or rules are configured

### Issue: Charts Not Displaying
**Solution:**
- Check Chart.js CDN is loaded
- Verify transaction data exists
- Check browser console for errors
- Hard refresh browser (Ctrl+F5)

### Issue: Sidebar Not Working on Mobile
**Solution:**
- Check viewport meta tag in HTML
- Clear browser cache
- Test on actual mobile device
- Check CSS media queries

## 📊 Data Structure

### Users Collection
```
users/{userId}
├── name: string
├── email: string
├── createdAt: timestamp
├── updatedAt: timestamp
├── currency: string
└── theme: string
```

### Transactions Subcollection
```
users/{userId}/transactions/{transactionId}
├── type: string ("income" | "expense")
├── category: string
├── amount: number
├── date: number (timestamp)
├── description: string
├── createdAt: timestamp
└── updatedAt: timestamp
```

### Budgets Subcollection
```
users/{userId}/budgets/{budgetId}
├── category: string
├── limit: number
├── createdAt: timestamp
└── updatedAt: timestamp
```

## 🔒 Security

- ✅ All data is encrypted in transit
- ✅ User data is isolated by UID
- ✅ Firebase Authentication required
- ✅ Firestore security rules prevent unauthorized access
- ✅ No sensitive data stored in localStorage
- ✅ Session tokens managed by Firebase

## 📦 Dependencies

### CDN Libraries
- **Firebase SDK**: v10.7.0
- **Tailwind CSS**: Latest
- **Chart.js**: Latest
- **Font Awesome**: v6.5.1

### NPM Dependencies (Optional)
- `firebase`: ^10.7.0
- `http-server`: ^14.1.1

## 🚀 Deployment

### Deploy to Firebase Hosting
1. **Install Firebase CLI**
   ```bash
   npm install -g firebase-tools
   ```

2. **Login to Firebase**
   ```bash
   firebase login
   ```

3. **Initialize Firebase**
   ```bash
   firebase init hosting
   ```

4. **Build and Deploy**
   ```bash
   npm run build
   firebase deploy
   ```

### Deploy to Netlify
1. Push code to GitHub
2. Connect GitHub repo to Netlify
3. Deploy automatically

### Deploy to Vercel
1. Connect GitHub repo to Vercel
2. Deploy with one click
3. Get live URL

## 📈 Future Enhancements

- [ ] Recurring transactions
- [ ] Multi-currency support
- [ ] Bank account integration
- [ ] AI-powered expense categorization
- [ ] Receipt OCR
- [ ] Expense predictions
- [ ] Mobile app version
- [ ] Collaborative budgeting
- [ ] Bill reminders
- [ ] Investment tracking

## 🤝 Contributing

We welcome contributions! Please feel free to submit a Pull Request.

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🎉 Credits

Built with ❤️ using:
- Firebase for backend
- Tailwind CSS for styling
- Chart.js for visualizations
- Font Awesome for icons

## 📞 Support

For issues and questions:
1. Check [Troubleshooting](#-troubleshooting) section
2. Review Firebase documentation
3. Create an issue on GitHub
4. Contact support team

## 🔗 Useful Links

- [Firebase Documentation](https://firebase.google.com/docs)
- [Firestore Guide](https://firebase.google.com/docs/firestore)
- [Tailwind CSS](https://tailwindcss.com)
- [Chart.js](https://www.chartjs.org)
- [Font Awesome](https://fontawesome.com)

---

**Happy Tracking!** 💰📊

Last Updated: May 2024
Version: 1.0.0
