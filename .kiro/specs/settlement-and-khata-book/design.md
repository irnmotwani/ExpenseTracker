# Design Document

## Overview

The Settlement Tracking and Khata Book feature will extend the existing ExpenseFlow application with comprehensive debt management and transaction ledger capabilities. The system will automatically calculate outstanding balances from existing expense splits, provide settlement recording functionality, and maintain a complete transaction history. The feature integrates seamlessly with the existing React frontend and Express/MongoDB backend architecture.

## Architecture

### Frontend Architecture
- **New Pages**: `SettlementTracking.js` and `KhataBook.js` components
- **Dashboard Integration**: Add two new cards to the existing dashboard grid
- **State Management**: Use React hooks for local state, axios for API communication
- **Routing**: Extend existing React Router configuration with new routes

### Backend Architecture
- **New Routes**: `/api/settlements` and `/api/khatabook` endpoints
- **Database Integration**: Extend existing MongoDB schema with Settlement model
- **Business Logic**: Settlement calculation algorithms and balance optimization
- **Data Aggregation**: Complex queries to calculate net balances and transaction history

### Data Flow
1. **Balance Calculation**: Aggregate expense splits to determine who owes whom
2. **Settlement Recording**: Create settlement records and update balances
3. **Optimization Algorithm**: Calculate minimum transactions needed for full settlement
4. **Transaction History**: Combine expenses and settlements for comprehensive ledger

## Components and Interfaces

### Frontend Components

#### Dashboard Updates
```javascript
// Add to existing Dashboard.js
const settlementCard = {
  title: "Settlement Tracking",
  icon: "🧾",
  description: "Track who owes what and record payments",
  route: "/settlements"
};

const khataBookCard = {
  title: "Khata Book",
  icon: "📚", 
  description: "View complete transaction history and ledger",
  route: "/khatabook"
};
```

#### SettlementTracking Component
- **Group Selection**: Dropdown to select group (reuse existing pattern)
- **Balance Display**: Table showing net balances between users
- **Settlement Form**: Form to record new settlements
- **Optimization Suggestions**: Display minimum transaction recommendations
- **Settlement History**: List of recorded settlements

#### KhataBook Component
- **Transaction List**: Chronological display of all transactions
- **Filter Controls**: Date range picker and search functionality
- **Transaction Details**: Expandable rows showing split details
- **Export Options**: Future extensibility for PDF/Excel export

### Backend Interfaces

#### Settlement Model
```javascript
const settlementSchema = {
  settlement_id: String (Primary Key),
  from_user_id: ObjectId (Foreign Key to User),
  to_user_id: ObjectId (Foreign Key to User), 
  amount: Number,
  group_id: ObjectId (Foreign Key to TripGroup),
  date: Date,
  description: String (Optional),
  created_at: Date,
  created_by: ObjectId (Foreign Key to User)
};
```

#### API Endpoints
- `GET /api/settlements/group/:groupId` - Get all settlements for a group
- `POST /api/settlements` - Record a new settlement
- `GET /api/settlements/balances/:groupId` - Get calculated balances
- `GET /api/settlements/suggestions/:groupId` - Get optimization suggestions
- `GET /api/khatabook/group/:groupId` - Get complete transaction history

## Data Models

### Extended Database Schema

#### Settlement Collection (New)
```javascript
{
  _id: ObjectId,
  from_user_id: ObjectId, // Who paid
  to_user_id: ObjectId,   // Who received payment
  amount: Number,
  group_id: ObjectId,
  date: Date,
  description: String,
  created_at: Date,
  created_by: ObjectId
}
```

#### Balance Calculation Logic
```javascript
// Pseudo-code for balance calculation
function calculateGroupBalances(groupId) {
  // 1. Get all expenses for group with splits
  // 2. Calculate what each person should have paid (total splits)
  // 3. Calculate what each person actually paid
  // 4. Get all settlements for group
  // 5. Apply settlements to adjust balances
  // 6. Return net balances between all pairs
}
```

### Data Relationships
- Settlement → User (from_user_id, to_user_id)
- Settlement → TripGroup (group_id)
- Settlement → User (created_by)

## Error Handling

### Frontend Error Handling
- **Network Errors**: Display user-friendly messages for API failures
- **Validation Errors**: Real-time form validation with error highlights
- **Loading States**: Show loading indicators during API calls
- **Empty States**: Appropriate messages when no data is available

### Backend Error Handling
- **Invalid Settlement Amount**: Prevent settlements exceeding outstanding balance
- **User Authorization**: Ensure users can only access their group data
- **Data Validation**: Validate all input data before database operations
- **Database Errors**: Proper error responses for database failures

### Specific Error Cases
```javascript
// Settlement amount validation
if (settlementAmount > outstandingBalance) {
  throw new Error("Settlement amount cannot exceed outstanding balance");
}

// User authorization
if (!isUserInGroup(userId, groupId)) {
  throw new Error("User not authorized to access this group");
}
```

## Testing Strategy

### Unit Testing
- **Balance Calculation**: Test various expense and settlement scenarios
- **Settlement Validation**: Test edge cases for settlement amounts
- **Optimization Algorithm**: Verify minimum transaction calculations
- **Data Aggregation**: Test complex queries for transaction history

### Integration Testing
- **API Endpoints**: Test all CRUD operations for settlements
- **Database Operations**: Test data consistency across collections
- **Frontend-Backend**: Test complete user workflows
- **Authentication**: Test user authorization for all operations

### User Acceptance Testing
- **Settlement Recording**: Test complete settlement workflow
- **Balance Display**: Verify accurate balance calculations
- **Khata Book**: Test transaction history accuracy
- **Dashboard Integration**: Test navigation and UI consistency

### Test Scenarios
1. **Basic Settlement**: Record settlement and verify balance update
2. **Complex Multi-party**: Test optimization with multiple users
3. **Edge Cases**: Test zero balances, exact settlements, overpayments
4. **Data Integrity**: Test concurrent settlements and race conditions
5. **UI Responsiveness**: Test on different screen sizes and devices

## Performance Considerations

### Database Optimization
- **Indexing**: Add indexes on group_id, user_id fields for fast queries
- **Aggregation**: Use MongoDB aggregation pipeline for complex calculations
- **Caching**: Consider caching balance calculations for frequently accessed groups

### Frontend Optimization
- **Lazy Loading**: Load settlement data only when needed
- **Pagination**: Implement pagination for large transaction histories
- **Debouncing**: Debounce search inputs to reduce API calls

### Scalability
- **Query Optimization**: Efficient queries for large datasets
- **Memory Management**: Proper cleanup of React components
- **API Rate Limiting**: Prevent abuse of calculation-heavy endpoints