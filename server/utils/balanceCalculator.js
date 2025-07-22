/**
 * Balance Calculator Utility
 * 
 * This service calculates outstanding balances between group members
 * based on expenses and settlements. It determines who owes money to whom.
 */

/**
 * Calculate outstanding balances for a group
 * @param {Array} expenses - Array of group expenses with splits
 * @param {Array} settlements - Array of recorded settlements
 * @returns {Object} Balance matrix showing who owes whom
 */
function calculateGroupBalances(expenses, settlements) {
  const balances = {};
  
  // Step 1: Process all expenses to calculate what each person should have paid vs what they actually paid
  expenses.forEach(expense => {
    const paidBy = expense.paid_by.toString();
    const totalAmount = expense.amount;
    const splitCount = expense.split_between.length;
    const amountPerPerson = totalAmount / splitCount;
    
    // Initialize balances for all participants
    expense.split_between.forEach(userId => {
      const userIdStr = userId.toString();
      if (!balances[userIdStr]) balances[userIdStr] = {};
      if (!balances[paidBy]) balances[paidBy] = {};
      
      if (!balances[userIdStr][paidBy]) balances[userIdStr][paidBy] = 0;
      if (!balances[paidBy][userIdStr]) balances[paidBy][userIdStr] = 0;
    });
    
    // Calculate what each person owes to the person who paid
    expense.split_between.forEach(userId => {
      const userIdStr = userId.toString();
      if (userIdStr !== paidBy) {
        // This person owes money to the person who paid
        balances[userIdStr][paidBy] += amountPerPerson;
      }
    });
  });
  
  // Step 2: Apply settlements to reduce balances
  settlements.forEach(settlement => {
    const fromUser = settlement.from_user_id.toString();
    const toUser = settlement.to_user_id.toString();
    const amount = settlement.amount;
    
    // Initialize if not exists
    if (!balances[fromUser]) balances[fromUser] = {};
    if (!balances[toUser]) balances[toUser] = {};
    if (!balances[fromUser][toUser]) balances[fromUser][toUser] = 0;
    if (!balances[toUser][fromUser]) balances[toUser][fromUser] = 0;
    
    // Reduce the debt that fromUser owes to toUser
    if (balances[fromUser][toUser] >= amount) {
      // Normal case: reduce the existing debt
      balances[fromUser][toUser] -= amount;
    } else {
      // Settlement is more than the debt
      const excess = amount - balances[fromUser][toUser];
      balances[fromUser][toUser] = 0;
      
      // Now toUser owes fromUser the excess amount
      balances[toUser][fromUser] += excess;
    }
  });
  
  // Step 3: Simplify balances (net out mutual debts)
  const simplifiedBalances = {};
  Object.keys(balances).forEach(fromUser => {
    Object.keys(balances[fromUser]).forEach(toUser => {
      if (fromUser !== toUser && balances[fromUser][toUser] > 0) {
        const reverseAmount = balances[toUser] && balances[toUser][fromUser] || 0;
        const netAmount = balances[fromUser][toUser] - reverseAmount;
        
        if (netAmount > 0) {
          if (!simplifiedBalances[fromUser]) simplifiedBalances[fromUser] = {};
          simplifiedBalances[fromUser][toUser] = Math.round(netAmount * 100) / 100;
        }
      }
    });
  });
  
  return simplifiedBalances;
}

/**
 * Get settlement suggestions to minimize number of transactions
 * @param {Object} balances - Balance matrix from calculateGroupBalances
 * @returns {Array} Array of suggested settlements
 */
function getSettlementSuggestions(balances) {
  const suggestions = [];
  
  // Check if there are any outstanding balances
  const hasOutstandingBalances = Object.keys(balances).some(fromUser => 
    Object.keys(balances[fromUser]).some(toUser => balances[fromUser][toUser] > 0.01)
  );
  
  if (!hasOutstandingBalances) {
    return []; // No suggestions needed if no outstanding balances
  }
  
  // For circular debts, suggest direct settlements first
  // Check for simple circular patterns and suggest breaking them
  const directSuggestions = [];
  
  Object.keys(balances).forEach(fromUser => {
    Object.keys(balances[fromUser]).forEach(toUser => {
      const amount = balances[fromUser][toUser];
      if (amount > 0.01) {
        directSuggestions.push({
          from_user_id: fromUser,
          to_user_id: toUser,
          amount: Math.round(amount * 100) / 100,
          description: 'Direct settlement'
        });
      }
    });
  });
  
  // If we have simple direct settlements, return them
  if (directSuggestions.length <= 3) {
    return directSuggestions;
  }
  
  // For complex scenarios, calculate net balances for optimization
  const netBalances = {};
  
  // Calculate net balance for each person
  Object.keys(balances).forEach(fromUser => {
    if (!netBalances[fromUser]) netBalances[fromUser] = 0;
    Object.keys(balances[fromUser]).forEach(toUser => {
      netBalances[fromUser] -= balances[fromUser][toUser]; // They owe money
      if (!netBalances[toUser]) netBalances[toUser] = 0;
      netBalances[toUser] += balances[fromUser][toUser]; // They are owed money
    });
  });
  
  // Create suggestions by matching creditors with debtors
  const creditors = []; // People who are owed money
  const debtors = []; // People who owe money
  
  Object.keys(netBalances).forEach(userId => {
    const roundedBalance = Math.round(netBalances[userId] * 100) / 100;
    if (roundedBalance > 0.01) { // Owed money (creditor)
      creditors.push({ userId, amount: roundedBalance });
    } else if (roundedBalance < -0.01) { // Owes money (debtor)
      debtors.push({ userId, amount: Math.abs(roundedBalance) });
    }
  });
  
  // If everyone's net balance is zero (circular debt), return direct suggestions
  if (creditors.length === 0 && debtors.length === 0) {
    return directSuggestions.slice(0, 2); // Return first 2 suggestions to break the cycle
  }
  
  // Sort to ensure consistent suggestions
  creditors.sort((a, b) => b.amount - a.amount);
  debtors.sort((a, b) => b.amount - a.amount);
  
  // Match debtors with creditors
  let i = 0, j = 0;
  while (i < debtors.length && j < creditors.length) {
    const debtor = debtors[i];
    const creditor = creditors[j];
    
    const settlementAmount = Math.min(debtor.amount, creditor.amount);
    
    // Only suggest if amount is significant
    if (settlementAmount > 0.01) {
      suggestions.push({
        from_user_id: debtor.userId,
        to_user_id: creditor.userId,
        amount: Math.round(settlementAmount * 100) / 100,
        description: 'Optimal settlement'
      });
    }
    
    debtor.amount -= settlementAmount;
    creditor.amount -= settlementAmount;
    
    if (debtor.amount <= 0.01) i++;
    if (creditor.amount <= 0.01) j++;
  }
  
  return suggestions;
}

/**
 * Format balances for display
 * @param {Object} balances - Balance matrix
 * @param {Array} users - Array of user objects with _id and username
 * @returns {Array} Formatted balance entries for display
 */
function formatBalancesForDisplay(balances, users) {
  const formatted = [];
  const userMap = {};
  
  // Create user lookup map
  users.forEach(user => {
    userMap[user._id.toString()] = user.username;
  });
  
  Object.keys(balances).forEach(fromUserId => {
    Object.keys(balances[fromUserId]).forEach(toUserId => {
      const amount = balances[fromUserId][toUserId];
      if (amount > 0) {
        formatted.push({
          from_user_id: fromUserId,
          from_user_name: userMap[fromUserId] || 'Unknown User',
          to_user_id: toUserId,
          to_user_name: userMap[toUserId] || 'Unknown User',
          amount: amount,
          description: `${userMap[fromUserId]} owes ${userMap[toUserId]}`
        });
      }
    });
  });
  
  return formatted.sort((a, b) => b.amount - a.amount); // Sort by amount descending
}

module.exports = {
  calculateGroupBalances,
  getSettlementSuggestions,
  formatBalancesForDisplay
};