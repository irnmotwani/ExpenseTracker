const Customer = require('../models/Customer');
const KhataTransaction = require('../models/KhataTransaction');

// Get all customers for the logged-in user
exports.getCustomers = async (req, res) => {
  try {
    const { search } = req.query;
    
    // Build search filter
    let filter = { user_id: req.user.id };
    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: 'i' } },
        { phone: { $regex: search, $options: 'i' } }
      ];
    }

    const customers = await Customer.find(filter).sort({ name: 1 });

    // Calculate balance for each customer
    const customersWithBalance = await Promise.all(
      customers.map(async (customer) => {
        const balance = await KhataTransaction.calculateCustomerBalance(customer._id);
        return {
          ...customer.toObject(),
          balance: balance
        };
      })
    );

    res.json(customersWithBalance);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Add a new customer
exports.addCustomer = async (req, res) => {
  try {
    const { name, phone, address } = req.body;

    // Validate required fields
    if (!name || !name.trim()) {
      return res.status(400).json({ message: 'Customer name is required' });
    }

    // Check if customer with same name already exists for this user
    const existingCustomer = await Customer.findOne({
      user_id: req.user.id,
      name: name.trim()
    });

    if (existingCustomer) {
      return res.status(400).json({ message: 'Customer with this name already exists' });
    }

    const customer = new Customer({
      user_id: req.user.id,
      name: name.trim(),
      phone: phone ? phone.trim() : '',
      address: address ? address.trim() : ''
    });

    await customer.save();

    // Return customer with initial balance of 0
    const customerWithBalance = {
      ...customer.toObject(),
      balance: 0
    };

    res.status(201).json(customerWithBalance);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Update customer details
exports.updateCustomer = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, phone, address } = req.body;

    // Validate required fields
    if (!name || !name.trim()) {
      return res.status(400).json({ message: 'Customer name is required' });
    }

    // Find customer and verify ownership
    const customer = await Customer.findOne({ _id: id, user_id: req.user.id });
    if (!customer) {
      return res.status(404).json({ message: 'Customer not found' });
    }

    // Check if another customer with same name exists (excluding current customer)
    const existingCustomer = await Customer.findOne({
      user_id: req.user.id,
      name: name.trim(),
      _id: { $ne: id }
    });

    if (existingCustomer) {
      return res.status(400).json({ message: 'Another customer with this name already exists' });
    }

    // Update customer
    customer.name = name.trim();
    customer.phone = phone ? phone.trim() : '';
    customer.address = address ? address.trim() : '';

    await customer.save();

    // Calculate current balance
    const balance = await KhataTransaction.calculateCustomerBalance(customer._id);
    
    const customerWithBalance = {
      ...customer.toObject(),
      balance: balance
    };

    res.json(customerWithBalance);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Delete customer
exports.deleteCustomer = async (req, res) => {
  try {
    const { id } = req.params;

    // Find customer and verify ownership
    const customer = await Customer.findOne({ _id: id, user_id: req.user.id });
    if (!customer) {
      return res.status(404).json({ message: 'Customer not found' });
    }

    // Get transaction count for confirmation message
    const transactionCount = await KhataTransaction.countDocuments({ customer_id: id });
    
    // Delete all transactions for this customer first
    if (transactionCount > 0) {
      await KhataTransaction.deleteMany({ customer_id: id, user_id: req.user.id });
      // Transactions deleted successfully
    }

    // Delete the customer
    await Customer.findByIdAndDelete(id);
    
    const message = transactionCount > 0 
      ? `Customer "${customer.name}" and ${transactionCount} transactions deleted successfully`
      : `Customer "${customer.name}" deleted successfully`;
    
    res.json({ message });
  } catch (error) {
    console.error('Delete customer error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get customer transactions
exports.getCustomerTransactions = async (req, res) => {
  try {
    const { customerId } = req.params;
    const { page = 1, limit = 20 } = req.query;

    // Verify customer ownership
    const customer = await Customer.findOne({ _id: customerId, user_id: req.user.id });
    if (!customer) {
      return res.status(404).json({ message: 'Customer not found' });
    }

    // Get transactions with balance history
    const balanceHistory = await KhataTransaction.getCustomerBalanceHistory(customerId);
    
    // Apply pagination
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + parseInt(limit);
    const paginatedTransactions = balanceHistory.transactions.slice(startIndex, endIndex);

    res.json({
      customer: {
        ...customer.toObject(),
        balance: balanceHistory.currentBalance
      },
      transactions: paginatedTransactions,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(balanceHistory.transactions.length / limit),
        totalTransactions: balanceHistory.transactions.length,
        hasNextPage: endIndex < balanceHistory.transactions.length,
        hasPrevPage: page > 1
      },
      currentBalance: balanceHistory.currentBalance
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Add transaction
exports.addTransaction = async (req, res) => {
  try {
    const { customer_id, type, amount, description, date } = req.body;

    // Validate required fields
    if (!customer_id || !type || !amount || !description) {
      return res.status(400).json({ 
        message: 'customer_id, type, amount, and description are required' 
      });
    }

    if (!['debit', 'credit'].includes(type.toLowerCase())) {
      return res.status(400).json({ message: 'Transaction type must be either debit or credit' });
    }

    if (amount <= 0) {
      return res.status(400).json({ message: 'Amount must be greater than 0' });
    }

    // Verify customer ownership
    const customer = await Customer.findOne({ _id: customer_id, user_id: req.user.id });
    if (!customer) {
      return res.status(404).json({ message: 'Customer not found' });
    }

    const transaction = new KhataTransaction({
      customer_id,
      user_id: req.user.id,
      type: type.toLowerCase(),
      amount: parseFloat(amount),
      description: description.trim(),
      date: date || Date.now()
    });

    await transaction.save();

    // Get updated balance
    const newBalance = await KhataTransaction.calculateCustomerBalance(customer_id);

    res.status(201).json({
      transaction: transaction.toObject(),
      newBalance: newBalance
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Update transaction
exports.updateTransaction = async (req, res) => {
  try {
    const { id } = req.params;
    const { type, amount, description, date } = req.body;

    // Find transaction and verify ownership
    const transaction = await KhataTransaction.findOne({ _id: id, user_id: req.user.id });
    if (!transaction) {
      return res.status(404).json({ message: 'Transaction not found' });
    }

    // Validate fields
    if (type && !['debit', 'credit'].includes(type.toLowerCase())) {
      return res.status(400).json({ message: 'Transaction type must be either debit or credit' });
    }

    if (amount && amount <= 0) {
      return res.status(400).json({ message: 'Amount must be greater than 0' });
    }

    // Update transaction
    if (type) transaction.type = type.toLowerCase();
    if (amount) transaction.amount = parseFloat(amount);
    if (description) transaction.description = description.trim();
    if (date) transaction.date = date;

    await transaction.save();

    // Get updated balance
    const newBalance = await KhataTransaction.calculateCustomerBalance(transaction.customer_id);

    res.json({
      transaction: transaction.toObject(),
      newBalance: newBalance
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Delete transaction
exports.deleteTransaction = async (req, res) => {
  try {
    const { id } = req.params;

    // Find transaction and verify ownership
    const transaction = await KhataTransaction.findOne({ _id: id, user_id: req.user.id });
    if (!transaction) {
      return res.status(404).json({ message: 'Transaction not found' });
    }

    const customerId = transaction.customer_id;
    await KhataTransaction.findByIdAndDelete(id);

    // Get updated balance
    const newBalance = await KhataTransaction.calculateCustomerBalance(customerId);

    res.json({ 
      message: 'Transaction deleted successfully',
      newBalance: newBalance
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get khata book summary
exports.getKhataBookSummary = async (req, res) => {
  try {
    // Get all customers for user
    const customers = await Customer.find({ user_id: req.user.id });
    
    let totalReceivable = 0;
    let totalPayable = 0;
    let customersWithBalance = 0;

    // Calculate balances for all customers
    for (const customer of customers) {
      const balance = await KhataTransaction.calculateCustomerBalance(customer._id);
      if (balance > 0) {
        totalReceivable += balance;
        customersWithBalance++;
      } else if (balance < 0) {
        totalPayable += Math.abs(balance);
        customersWithBalance++;
      }
    }

    // Get total transactions count
    const totalTransactions = await KhataTransaction.countDocuments({ user_id: req.user.id });

    res.json({
      totalCustomers: customers.length,
      customersWithBalance,
      totalReceivable: Math.round(totalReceivable * 100) / 100,
      totalPayable: Math.round(totalPayable * 100) / 100,
      netPosition: Math.round((totalReceivable - totalPayable) * 100) / 100,
      totalTransactions
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};