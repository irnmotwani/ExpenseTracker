const Settlement = require('../models/Settlement');
const Expense = require('../models/Expense');
const ExpenseSplit = require('../models/ExpenseSplit');
const TripGroup = require('../models/TripGroup');

// Helper function to check if user is member of group
const checkGroupMembership = async (groupId, userId) => {
  const group = await TripGroup.findById(groupId);
  if (!group) {
    throw new Error('Group not found');
  }

  const isMember = group.members.some(member => 
    member.user.toString() === userId
  );

  if (!isMember) {
    throw new Error('You are not a member of this group');
  }

  return group;
};

// Get complete transaction history for a group (expenses + settlements)
exports.getGroupTransactionHistory = async (req, res) => {
  try {
    const { groupId } = req.params;
    const { startDate, endDate, search, page = 1, limit = 50 } = req.query;
    
    // Check group membership
    await checkGroupMembership(groupId, req.user.id);

    // Build date filter
    const dateFilter = {};
    if (startDate || endDate) {
      dateFilter.date = {};
      if (startDate) dateFilter.date.$gte = new Date(startDate);
      if (endDate) dateFilter.date.$lte = new Date(endDate);
    }

    // Build search filter
    const searchFilter = {};
    if (search) {
      searchFilter.$or = [
        { description: { $regex: search, $options: 'i' } }
      ];
    }

    // Combine filters
    const expenseFilter = { group_id: groupId, ...dateFilter, ...searchFilter };
    const settlementFilter = { group_id: groupId, ...dateFilter, ...searchFilter };

    // Get expenses with splits
    const expenses = await Expense.find(expenseFilter)
      .populate('paid_by', 'username email')
      .populate('group_id', 'name')
      .sort({ date: -1 });

    // Get expense splits for found expenses
    const expenseIds = expenses.map(e => e._id);
    const expenseSplits = await ExpenseSplit.find({ 
      expense_id: { $in: expenseIds } 
    }).populate('user_id', 'username email');

    // Group splits by expense
    const splitsByExpense = {};
    expenseSplits.forEach(split => {
      const expenseId = split.expense_id.toString();
      if (!splitsByExpense[expenseId]) {
        splitsByExpense[expenseId] = [];
      }
      splitsByExpense[expenseId].push(split);
    });

    // Get settlements
    const settlements = await Settlement.find(settlementFilter)
      .populate('from_user_id', 'username email')
      .populate('to_user_id', 'username email')
      .populate('created_by', 'username email')
      .sort({ date: -1 });

    // Format expenses for transaction history
    const expenseTransactions = expenses.map(expense => ({
      _id: expense._id,
      type: 'expense',
      date: expense.date,
      description: expense.description,
      amount: expense.amount,
      category: expense.category,
      customCategory: expense.customCategory,
      paid_by: expense.paid_by,
      group_id: expense.group_id,
      splits: splitsByExpense[expense._id.toString()] || [],
      created_at: expense.createdAt
    }));

    // Format settlements for transaction history
    const settlementTransactions = settlements.map(settlement => ({
      _id: settlement._id,
      type: 'settlement',
      date: settlement.date,
      description: settlement.description,
      amount: settlement.amount,
      from_user: settlement.from_user_id,
      to_user: settlement.to_user_id,
      created_by: settlement.created_by,
      created_at: settlement.createdAt
    }));

    // Combine and sort all transactions by date
    const allTransactions = [...expenseTransactions, ...settlementTransactions]
      .sort((a, b) => new Date(b.date) - new Date(a.date));

    // Apply pagination
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + parseInt(limit);
    const paginatedTransactions = allTransactions.slice(startIndex, endIndex);

    // Calculate summary statistics
    const totalExpenses = expenseTransactions.length;
    const totalSettlements = settlementTransactions.length;
    const totalExpenseAmount = expenseTransactions.reduce((sum, t) => sum + t.amount, 0);
    const totalSettlementAmount = settlementTransactions.reduce((sum, t) => sum + t.amount, 0);

    res.json({
      transactions: paginatedTransactions,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(allTransactions.length / limit),
        totalTransactions: allTransactions.length,
        hasNextPage: endIndex < allTransactions.length,
        hasPrevPage: page > 1
      },
      summary: {
        totalExpenses,
        totalSettlements,
        totalExpenseAmount: Math.round(totalExpenseAmount * 100) / 100,
        totalSettlementAmount: Math.round(totalSettlementAmount * 100) / 100,
        netGroupSpending: Math.round((totalExpenseAmount - totalSettlementAmount) * 100) / 100
      },
      filters: {
        startDate,
        endDate,
        search,
        groupId
      }
    });
  } catch (error) {
    if (error.message === 'Group not found') {
      return res.status(404).json({ message: error.message });
    }
    if (error.message === 'You are not a member of this group') {
      return res.status(403).json({ message: error.message });
    }
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};