const Expense = require('../models/Expense');
const ExpenseSplit = require('../models/ExpenseSplit');
const TripGroup = require('../models/TripGroup');

// Get analytics for a specific group
exports.getGroupAnalytics = async (req, res) => {
  try {
    const { groupId } = req.params;
    // Fetching analytics for group
    
    // Check if user is member of the group
    const group = await TripGroup.findById(groupId)
      .populate('members.user', 'username email');
    
    if (!group) {
      return res.status(404).json({ message: 'Group not found' });
    }

    const isMember = group.members.some(member => 
      member.user._id.toString() === req.user.id
    );

    if (!isMember) {
      return res.status(403).json({ message: 'Access denied' });
    }

    // Get all expenses for this group
    const expenses = await Expense.find({ group_id: groupId })
      .populate('paid_by', 'username email')
      .sort({ date: -1 });

    // Get all splits for this group
    const expenseIds = expenses.map(expense => expense._id);
    const splits = await ExpenseSplit.find({ expense_id: { $in: expenseIds } })
      .populate('user_id', 'username email');

    // Calculate total group spending
    const totalGroupSpending = expenses.reduce((sum, expense) => sum + expense.amount, 0);

    // Calculate individual spending
    const individualSpending = {};
    
    // Initialize all group members
    group.members.forEach(member => {
      const userId = member.user._id.toString();
      individualSpending[userId] = {
        name: member.user.username,
        email: member.user.email,
        totalPaid: 0,
        totalShare: 0,
        expenseCount: 0,
        balance: 0
      };
    });

    // Calculate what each person paid
    expenses.forEach(expense => {
      const payerId = expense.paid_by._id.toString();
      if (individualSpending[payerId]) {
        individualSpending[payerId].totalPaid += expense.amount;
        individualSpending[payerId].expenseCount += 1;
      }
    });

    // Calculate what each person owes (their share)
    splits.forEach(split => {
      const userId = split.user_id._id.toString();
      if (individualSpending[userId]) {
        individualSpending[userId].totalShare += split.amount_share;
      }
    });

    // Calculate balance (what they paid - what they owe)
    Object.keys(individualSpending).forEach(userId => {
      const person = individualSpending[userId];
      person.balance = person.totalPaid - person.totalShare;
    });

    // Convert to array and sort by total paid (descending)
    const individualSpendingArray = Object.values(individualSpending)
      .sort((a, b) => b.totalPaid - a.totalPaid);

    // Calculate category wise spending
    const categorySpending = {};
    expenses.forEach(expense => {
      const category = expense.category;
      if (!categorySpending[category]) {
        categorySpending[category] = {
          category: category,
          total: 0,
          count: 0
        };
      }
      categorySpending[category].total += expense.amount;
      categorySpending[category].count += 1;
    });

    const categoryWiseSpending = Object.values(categorySpending)
      .sort((a, b) => b.total - a.total);

    const analytics = {
      totalGroupSpending,
      totalExpenses: expenses.length,
      totalMembers: group.members.length,
      individualSpending: individualSpendingArray,
      categoryWiseSpending,
      groupInfo: {
        name: group.name,
        startDate: group.start_date,
        endDate: group.end_date
      }
    };

    // Analytics calculated successfully
    res.json(analytics);
  } catch (error) {
    console.error('❌ Analytics error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};