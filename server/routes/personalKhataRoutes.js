const express = require('express');
const router = express.Router();
const authMiddleware = require('../middlewares/authMiddleware');

// Import personal khata controller
const {
  getCustomers,
  addCustomer,
  updateCustomer,
  deleteCustomer,
  getCustomerTransactions,
  addTransaction,
  updateTransaction,
  deleteTransaction,
  getKhataBookSummary
} = require('../controllers/personalKhataController');

// All routes require authentication
router.use(authMiddleware);

// Customer management routes
router.get('/customers', getCustomers);
router.post('/customers', addCustomer);
router.put('/customers/:id', updateCustomer);
router.delete('/customers/:id', deleteCustomer);

// Transaction management routes
router.get('/customers/:customerId/transactions', getCustomerTransactions);
router.post('/transactions', addTransaction);
router.put('/transactions/:id', updateTransaction);
router.delete('/transactions/:id', deleteTransaction);

// Summary route
router.get('/summary', getKhataBookSummary);

module.exports = router;