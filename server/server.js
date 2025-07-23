const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');

const app = express();

// Basic middleware
app.use(cors({
  origin: process.env.NODE_ENV === 'production'
    ? process.env.CLIENT_URL
    : 'http://localhost:3000',
  credentials: true
}));
app.use(express.json());

// Connect to database
connectDB();

// Simple test route
app.get('/api/test/health', (req, res) => {
  res.json({ message: 'Server is working!', timestamp: new Date() });
});

// Auth routes
app.use('/api/auth', require('./routes/authRoutes'));

// User routes
app.use('/api/users', require('./routes/userRoutes'));

// Test routes
app.use('/api/test', require('./routes/testRoutes'));

// Groups routes
app.use('/api/groups', require('./routes/groupRoutes'));

// Expenses routes
app.use('/api/expenses', require('./routes/expenseRoutes'));

// Analytics routes
app.use('/api/analytics', require('./routes/analyticsRoutes'));

// Settlement routes
app.use('/api/settlements', require('./routes/settlementRoutes'));

// Khata Book routes
app.use('/api/khatabook', require('./routes/khatabookRoutes'));

// Personal Khata Book routes
app.use('/api/personal-khata', require('./routes/personalKhataRoutes'));

const PORT = process.env.PORT || 3000; // Using a standard development port
app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
  console.log(`🔗 MongoDB connected`);
});