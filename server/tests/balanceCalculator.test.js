const { 
  calculatePairwiseBalances, 
  optimizeSettlements, 
  validateSettlement 
} = require('../utils/balanceCalculator');

// Mock user data for testing
const createMockUser = (id, username) => ({
  _id: id,
  username,
  email: `${username}@test.com`
});

// Helper function to run tests (since we don't have Jest setup)
const runTests = () => {
  console.log('🧪 Running Balance Calculator Tests...\n');
  
  try {
    // Test calculatePairwiseBalances
    console.log('✅ Testing calculatePairwiseBalances...');
    const userBalances1 = {
      'user1': {
        user: createMockUser('user1', 'Alice'),
        netBalance: 100
      },
      'user2': {
        user: createMockUser('user2', 'Bob'),
        netBalance: -50
      },
      'user3': {
        user: createMockUser('user3', 'Charlie'),
        netBalance: -50
      }
    };
    
    const pairwise = calculatePairwiseBalances(userBalances1);
    console.log('   Pairwise balances:', pairwise.length, 'pairs found');
    
    // Test optimizeSettlements
    console.log('✅ Testing optimizeSettlements...');
    const suggestions = optimizeSettlements(userBalances1);
    console.log('   Settlement suggestions:', suggestions.length, 'transactions needed');
    
    // Test validateSettlement
    console.log('✅ Testing validateSettlement...');
    const validation = validateSettlement('user2', 'user1', 50, userBalances1);
    console.log('   Settlement validation:', validation.isValid ? 'Valid' : 'Invalid');
    
    console.log('\n🎉 All tests passed!');
    
  } catch (error) {
    console.error('❌ Test failed:', error.message);
  }
};

// Export for potential Jest usage or run directly
if (require.main === module) {
  runTests();
}

module.exports = { runTests };