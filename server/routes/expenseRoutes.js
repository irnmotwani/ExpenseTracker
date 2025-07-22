const express = require('express');
const router = express.Router();
const { createExpense, getExpenses, getGroupExpenses, updateExpense, deleteExpense } = require('../controllers/expenseController');
const authMiddleware = require('../middlewares/authMiddleware');

// Create a new group expense
router.post('/', authMiddleware, createExpense);

// Get all expenses for a specific group
router.get('/group/:groupId', authMiddleware, getGroupExpenses);

// Get all expenses for the logged-in user (backward compatibility)
router.get('/', authMiddleware, getExpenses);

// Update an expense
router.put('/:id', authMiddleware, updateExpense);

// Delete an expense
router.delete('/:id', authMiddleware, deleteExpense);

module.exports = router; 