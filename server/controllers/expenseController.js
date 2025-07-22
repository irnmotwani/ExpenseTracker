const Expense = require('../models/Expense');
const ExpenseSplit = require('../models/ExpenseSplit');
const TripGroup = require('../models/TripGroup');

// Create a new group expense
exports.createExpense = async (req, res) => {
  try {
    const { amount, description, date, category, customCategory, group_id, split_type = 'equal' } = req.body;

    // Validate required fields
    if (!group_id) {
      return res.status(400).json({ message: 'Group ID is required for expenses.' });
    }

    if (category === 'Others' && !customCategory) {
      return res.status(400).json({ message: 'Custom category is required when category is Others.' });
    }

    // Check if user is member of the group
    const group = await TripGroup.findById(group_id);
    if (!group) {
      return res.status(404).json({ message: 'Group not found' });
    }

    const isMember = group.members.some(member => 
      member.user.toString() === req.user.id
    );

    if (!isMember) {
      return res.status(403).json({ message: 'You are not a member of this group' });
    }

    // Create the expense
    const expense = new Expense({
      amount,
      description,
      date: date || Date.now(),
      category,
      customCategory: category === 'Others' ? customCategory : undefined,
      paid_by: req.user.id,
      group_id,
      user: req.user.id // Keep for backward compatibility
    });

    await expense.save();

    // Create expense splits (equal split among all members)
    const memberCount = group.members.length;
    const splitAmount = amount / memberCount;

    const splits = group.members.map(member => ({
      expense_id: expense._id,
      user_id: member.user,
      amount_share: splitAmount,
      split_type
    }));

    await ExpenseSplit.insertMany(splits);

    // Populate and return the expense with splits
    const populatedExpense = await Expense.findById(expense._id)
      .populate('paid_by', 'username email')
      .populate('group_id', 'name');

    const expenseSplits = await ExpenseSplit.find({ expense_id: expense._id })
      .populate('user_id', 'username email');

    res.status(201).json({
      expense: populatedExpense,
      splits: expenseSplits
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get all expenses for a specific group
exports.getGroupExpenses = async (req, res) => {
  try {
    const { groupId } = req.params;
    
    // Check if user is member of the group
    const group = await TripGroup.findById(groupId);
    if (!group) {
      return res.status(404).json({ message: 'Group not found' });
    }

    const isMember = group.members.some(member => 
      member.user.toString() === req.user.id
    );

    if (!isMember) {
      return res.status(403).json({ message: 'You are not a member of this group' });
    }

    const expenses = await Expense.find({ group_id: groupId })
      .populate('paid_by', 'username email')
      .populate('group_id', 'name')
      .sort({ date: -1 });

    // Get splits for each expense
    const expensesWithSplits = await Promise.all(
      expenses.map(async (expense) => {
        const splits = await ExpenseSplit.find({ expense_id: expense._id })
          .populate('user_id', 'username email');
        return {
          ...expense.toObject(),
          splits
        };
      })
    );

    res.json(expensesWithSplits);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get all expenses for the logged-in user (backward compatibility)
exports.getExpenses = async (req, res) => {
  try {
    const expenses = await Expense.find({ user: req.user.id }).sort({ date: -1 });
    res.json(expenses);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};

// Update an expense
exports.updateExpense = async (req, res) => {
  try {
    const { id } = req.params;
    const { amount, description, date, category, customCategory } = req.body;
    const expense = await Expense.findOne({ _id: id, user: req.user.id });
    if (!expense) {
      return res.status(404).json({ message: 'Expense not found' });
    }
    // Update fields
    expense.amount = amount !== undefined ? amount : expense.amount;
    expense.description = description !== undefined ? description : expense.description;
    expense.date = date !== undefined ? date : expense.date;
    expense.category = category !== undefined ? category : expense.category;
    expense.customCategory = category === 'Others' ? customCategory : undefined;
    await expense.save();
    res.json(expense);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};

// Delete an expense
exports.deleteExpense = async (req, res) => {
  try {
    const { id } = req.params;
    const expense = await Expense.findOneAndDelete({ _id: id, user: req.user.id });
    if (!expense) {
      return res.status(404).json({ message: 'Expense not found' });
    }
    res.json({ message: 'Expense deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
}; 