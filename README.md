# 💰 ExpenseFlow

A modern, full-stack expense tracking and management application built with React.js and Node.js. ExpenseFlow helps individuals and groups manage their expenses, track settlements, and maintain financial records efficiently.

## 🌐 Live Demo

**Frontend:** [https://expensefloww.netlify.app/](https://expensefloww.netlify.app/)  
**Backend API:** Deployed on Render

## ✨ Features

### 🔐 Authentication
- **User Registration & Login** - Secure email/password authentication
- **JWT Token Management** - Persistent login sessions
- **Profile Management** - Update personal information and change passwords
- **Account Deletion** - Complete account removal with data cleanup

### 👥 Group Management
- **Create Groups** - Set up expense groups for trips, roommates, or events
- **Invite Members** - Add friends and family to expense groups
- **Group Dashboard** - Overview of group expenses and balances
- **Member Management** - Add/remove group members

### 💸 Expense Tracking
- **Add Expenses** - Record expenses with descriptions, amounts, and categories
- **Split Expenses** - Automatically split expenses among group members
- **Expense History** - View detailed transaction history
- **Edit/Delete Expenses** - Modify or remove expense entries

### 🧾 Settlement Management
- **Balance Calculation** - Automatic calculation of who owes whom
- **Settlement Tracking** - Record payments between group members
- **Settlement History** - Track all past settlements
- **Balance Overview** - Clear visualization of outstanding balances

### 📊 Analytics & Reports
- **Expense Analytics** - Visual charts and graphs of spending patterns
- **Category Breakdown** - Expenses organized by categories
- **Time-based Reports** - Monthly and yearly expense summaries
- **Group Statistics** - Comprehensive group spending analysis

### 📚 Khata Book
- **Transaction History** - Complete record of all financial transactions
- **Search & Filter** - Find specific transactions quickly
- **Export Options** - Download transaction records
- **Date Range Filtering** - View transactions for specific periods

### 👤 Personal Khata Book
- **Customer Management** - Maintain records of personal customers/debtors
- **Individual Accounts** - Separate accounts for each customer
- **Payment Tracking** - Record payments and outstanding amounts
- **Customer Details** - Detailed view of customer transaction history

### 💬 Additional Features
- **ChatBot Integration** - AI-powered assistance for common queries
- **Responsive Design** - Works seamlessly on desktop and mobile devices
- **Modern UI/UX** - Clean, intuitive interface with smooth animations
- **Help & Support** - Comprehensive help section and contact information

## 🛠️ Tech Stack

### Frontend
- **React.js** - Modern JavaScript library for building user interfaces
- **React Router** - Client-side routing for single-page application
- **Axios** - HTTP client for API requests
- **CSS3** - Modern styling with animations and responsive design

### Backend
- **Node.js** - JavaScript runtime for server-side development
- **Express.js** - Web application framework for Node.js
- **MongoDB** - NoSQL database for data storage
- **Mongoose** - MongoDB object modeling for Node.js
- **JWT** - JSON Web Tokens for authentication
- **bcryptjs** - Password hashing and security

### Deployment
- **Frontend:** Netlify - Static site hosting with continuous deployment
- **Backend:** Render - Cloud platform for backend services
- **Database:** MongoDB Atlas - Cloud database service

## 🚀 Getting Started

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (local installation or MongoDB Atlas)
- Git

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/expenseflow.git
   cd expenseflow
   ```

2. **Install backend dependencies**
   ```bash
   cd server
   npm install
   ```

3. **Install frontend dependencies**
   ```bash
   cd ../client
   npm install
   ```

4. **Environment Configuration**
   
   Create `.env` file in the `server` directory:
   ```env
   PORT=3001
   NODE_ENV=development
   MONGO_URI=mongodb://localhost:27017/expenseflow
   JWT_SECRET=your_jwt_secret_here
   CLIENT_URL=http://localhost:3000
   CORS_ORIGINS=http://localhost:3000
   ```

   Create `.env` file in the `client` directory:
   ```env
   REACT_APP_API_URL=http://localhost:3001/api
   ```

5. **Start the development servers**
   
   Backend server:
   ```bash
   cd server
   npm run dev
   ```
   
   Frontend server (in a new terminal):
   ```bash
   cd client
   npm start
   ```

6. **Access the application**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:3001/api

## 📁 Project Structure

```
expenseflow/
├── client/                 # React frontend
│   ├── public/            # Static files
│   ├── src/
│   │   ├── components/    # Reusable React components
│   │   ├── pages/         # Page components
│   │   ├── utils/         # Utility functions and API config
│   │   └── App.js         # Main App component
│   └── package.json
├── server/                # Node.js backend
│   ├── config/           # Database configuration
│   ├── controllers/      # Route controllers
│   ├── middlewares/      # Custom middleware
│   ├── models/           # MongoDB models
│   ├── routes/           # API routes
│   ├── utils/            # Utility functions
│   └── server.js         # Main server file
├── netlify.toml          # Netlify deployment configuration
└── README.md
```

## 🔧 API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login

### Users
- `GET /api/users/profile` - Get user profile
- `PUT /api/users/profile` - Update user profile
- `DELETE /api/users/profile` - Delete user account
- `GET /api/users/stats` - Get user statistics

### Groups
- `GET /api/groups` - Get user's groups
- `POST /api/groups` - Create new group
- `GET /api/groups/:id` - Get group details
- `PUT /api/groups/:id` - Update group
- `DELETE /api/groups/:id` - Delete group

### Expenses
- `GET /api/expenses` - Get all expenses
- `POST /api/expenses` - Create new expense
- `GET /api/expenses/:id` - Get expense details
- `PUT /api/expenses/:id` - Update expense
- `DELETE /api/expenses/:id` - Delete expense

### Settlements
- `GET /api/settlements` - Get settlements
- `POST /api/settlements` - Create settlement
- `GET /api/settlements/balances/:groupId` - Get group balances

## 🚀 Deployment

### Frontend (Netlify)
1. Connect your GitHub repository to Netlify
2. Set build command: `cd client && npm run build`
3. Set publish directory: `client/build`
4. Add environment variables in Netlify dashboard

### Backend (Render)
1. Connect your GitHub repository to Render
2. Set build command: `cd server && npm install`
3. Set start command: `cd server && npm start`
4. Add environment variables in Render dashboard

## 🔮 Future Enhancements

We are continuously working to improve ExpenseFlow. Here are some exciting features planned for future releases:

### 🚀 Upcoming Features
- **Google Authentication** - Sign in with Google for faster and more secure access
- **Email Verification** - Enhanced security with email verification during registration
- **Payment Reminders** - Automated notifications for users who haven't settled their dues
- **SMS Notifications** - Text message alerts for important updates and reminders
- **Mobile App** - Native iOS and Android applications
- **Multi-currency Support** - Handle expenses in different currencies
- **Receipt Upload** - Attach photos of receipts to expense entries
- **Advanced Analytics** - More detailed spending insights and trends
- **Export to PDF** - Generate and download expense reports
- **Dark Mode** - Toggle between light and dark themes

### 💡 Planned Improvements
- **Real-time Notifications** - Instant updates when expenses are added or settled
- **Offline Support** - Work without internet connection with data sync
- **Advanced Search** - More powerful search and filtering options
- **Bulk Operations** - Add multiple expenses at once
- **Custom Categories** - Create personalized expense categories
- **Budget Limits** - Set spending limits and get alerts
- **Integration APIs** - Connect with banking and payment apps

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 📞 Support

For support and queries:
- **Email:** irnmotwanii@gmail.com
- **Phone:** +91 7000270580

## 🙏 Acknowledgments

- React.js community for excellent documentation
- MongoDB for reliable database services
- Netlify and Render for seamless deployment platforms

---

**Made with ❤️ by ARYAN MOTWANI**