// Import required modules
const Settlement = require('../models/Settlement');
const TripGroup = require('../models/TripGroup');
const Expense = require('../models/Expense');
const ExpenseSplit = require('../models/ExpenseSplit');
const User = require('../models/User');
const { calculateGroupBalances, getSettlementSuggestions, formatBalancesForDisplay } = require('../utils/balanceCalculator');

/**
 * Get calculated balances for a group
 * GET /api/settlements/balances/:groupId
 */
exports.getGroupBalances = async (req, res) => {
  try {
    const { groupId } = req.params;

    // Verify user has access to this group
    const group = await TripGroup.findOne({ 
      _id: groupId,
      $or: [
        { created_by: req.user.id },
        { 'members.user': req.user.id }
      ]
    }).populate('members.user', 'username email');
    
    if (!group) {
      return res.status(404).json({ message: 'Group not found or access denied' });
    }

    // Get all expenses for this group with splits
    const expenses = await Expense.find({ group_id: groupId }).populate('paid_by', 'username');
    const expenseSplits = await ExpenseSplit.find({ 
      expense_id: { $in: expenses.map(e => e._id) } 
    }).populate('user_id', 'username');

    // Get all settlements for this group
    const settlements = await Settlement.find({ group_id: groupId })
      .populate('from_user_id', 'username')
      .populate('to_user_id', 'username');

    // Transform data for balance calculation
    const expensesForCalculation = expenses.map(expense => {
      const splits = expenseSplits.filter(split => split.expense_id.toString() === expense._id.toString());
      return {
        _id: expense._id,
        amount: expense.amount,
        paid_by: expense.paid_by._id,
        split_between: splits.map(split => split.user_id._id)
      };
    });

    const settlementsForCalculation = settlements.map(settlement => ({
      from_user_id: settlement.from_user_id._id,
      to_user_id: settlement.to_user_id._id,
      amount: settlement.amount
    }));

    // Calculate balances using the utility function
    const balanceMatrix = calculateGroupBalances(expensesForCalculation, settlementsForCalculation);
    
    // Format balances for display
    const groupMembers = group.members.map(member => ({
      _id: member.user._id,
      username: member.user.username
    }));
    
    const formattedBalances = formatBalancesForDisplay(balanceMatrix, groupMembers);
    
    // Get settlement suggestions
    const suggestions = getSettlementSuggestions(balanceMatrix);
    const formattedSuggestions = suggestions.map(suggestion => ({
      ...suggestion,
      from_user_name: groupMembers.find(m => m._id.toString() === suggestion.from_user_id)?.username || 'Unknown',
      to_user_name: groupMembers.find(m => m._id.toString() === suggestion.to_user_id)?.username || 'Unknown'
    }));

    // Calculate summary
    const totalOutstanding = formattedBalances.reduce((sum, balance) => sum + balance.amount, 0);

    res.json({
      group: {
        _id: group._id,
        name: group.name,
        members: groupMembers
      },
      balances: formattedBalances,
      suggestions: formattedSuggestions,
      summary: {
        totalOutstanding: Math.round(totalOutstanding * 100) / 100,
        totalSettlements: settlements.length,
        suggestedTransactions: formattedSuggestions.length
      }
    });

  } catch (error) {
    console.error('Get group balances error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

/**
 * Record a new settlement
 * POST /api/settlements
 */
exports.recordSettlement = async (req, res) => {
  try {
    const { from_user_id, to_user_id, group_id, amount, description, date } = req.body;

    // Validation
    if (!from_user_id || !to_user_id || !group_id || !amount) {
      return res.status(400).json({
        message: 'from_user_id, to_user_id, group_id, and amount are required'
      });
    }

    if (amount <= 0) {
      return res.status(400).json({ message: 'Amount must be greater than 0' });
    }

    if (from_user_id === to_user_id) {
      return res.status(400).json({ message: 'Cannot create settlement from user to themselves' });
    }

    // Verify user has access to this group
    const group = await TripGroup.findOne({ 
      _id: group_id,
      $or: [
        { created_by: req.user.id },
        { 'members.user': req.user.id }
      ]
    }).populate('members.user', 'username email');
    
    if (!group) {
      return res.status(404).json({ message: 'Group not found or access denied' });
    }

    // Verify both users are members of the group
    const fromUserInGroup = group.members.some(member => member.user._id.toString() === from_user_id);
    const toUserInGroup = group.members.some(member => member.user._id.toString() === to_user_id);
    
    if (!fromUserInGroup || !toUserInGroup) {
      return res.status(400).json({ message: 'Both users must be members of the group' });
    }

    // Create settlement in database
    const settlement = new Settlement({
      from_user_id,
      to_user_id,
      group_id,
      amount: parseFloat(amount),
      description: description?.trim() || 'Settlement payment',
      date: date || new Date(),
      created_by: req.user.id
    });

    await settlement.save();

    // Populate user details for response
    await settlement.populate('from_user_id', 'username email');
    await settlement.populate('to_user_id', 'username email');
    await settlement.populate('created_by', 'username email');

    res.status(201).json({
      message: 'Settlement recorded successfully',
      settlement
    });

  } catch (error) {
    console.error('Record settlement error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

/**
 * Get all settlements for a specific group
 * GET /api/settlements/group/:groupId
 */
exports.getGroupSettlements = async (req, res) => {
  try {
    const { groupId } = req.params;
    
    // Verify user has access to this group
    const group = await TripGroup.findOne({ 
      _id: groupId,
      $or: [
        { created_by: req.user.id },
        { 'members.user': req.user.id }
      ]
    });
    
    if (!group) {
      return res.status(404).json({ message: 'Group not found or access denied' });
    }
    
    // Get all settlements for this group
    const settlements = await Settlement.find({ group_id: groupId })
      .populate('from_user_id', 'username email')
      .populate('to_user_id', 'username email')
      .populate('created_by', 'username email')
      .sort({ date: -1 }); // Most recent first
    
    res.json({
      group: {
        _id: group._id,
        name: group.name
      },
      settlements
    });
    
  } catch (error) {
    console.error('Get group settlements error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

/**
 * Delete a settlement
 * DELETE /api/settlements/:settlementId
 */
exports.deleteSettlement = async (req, res) => {
  try {
    const { settlementId } = req.params;

    // Find the settlement first
    const settlement = await Settlement.findById(settlementId);
    if (!settlement) {
      return res.status(404).json({ message: 'Settlement not found' });
    }

    // Verify user has access to this group
    const group = await TripGroup.findOne({ 
      _id: settlement.group_id,
      $or: [
        { created_by: req.user.id },
        { 'members.user': req.user.id }
      ]
    });
    
    if (!group) {
      return res.status(404).json({ message: 'Group not found or access denied' });
    }

    // Delete the settlement
    await Settlement.findByIdAndDelete(settlementId);

    res.json({
      message: 'Settlement deleted successfully'
    });

  } catch (error) {
    console.error('Delete settlement error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};