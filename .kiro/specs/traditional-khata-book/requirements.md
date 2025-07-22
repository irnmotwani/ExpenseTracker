# Personal Khata Book Requirements

## Introduction

This feature will add a traditional personal khata book functionality to the ExpenseFlow application. Users will be able to manage their personal customers, record transactions (debit/credit), and track outstanding amounts. This is completely separate from group expense tracking and is designed for personal business use, similar to how shopkeepers maintain their customer ledgers.

## Requirements

### Requirement 1

**User Story:** As a business owner, I want to add and manage my personal customers, so that I can keep track of all people who owe me money or whom I owe money.

#### Acceptance Criteria

1. WHEN a user accesses personal khata book THEN the system SHALL display a list of all customers
2. WHEN a user clicks "Add Customer" THEN the system SHALL show a form to add customer details
3. WHEN adding a customer THEN the system SHALL require name and optionally phone number and address
4. WHEN a customer is added THEN the system SHALL display it in the customer list
5. WHEN a user clicks on a customer THEN the system SHALL show that customer's transaction history

### Requirement 2

**User Story:** As a business owner, I want to record transactions for each customer, so that I can track what they owe me or what I owe them.

#### Acceptance Criteria

1. WHEN viewing a customer's page THEN the system SHALL show an "Add Transaction" button
2. WHEN adding a transaction THEN the system SHALL allow selecting transaction type (Debit/Credit)
3. WHEN adding a transaction THEN the system SHALL require amount, description, and date
4. WHEN a debit transaction is added THEN it SHALL increase the amount customer owes
5. WHEN a credit transaction is added THEN it SHALL decrease the amount customer owes
6. WHEN a transaction is saved THEN it SHALL update the customer's outstanding balance

### Requirement 3

**User Story:** As a business owner, I want to see the outstanding balance for each customer, so that I know who owes me money and how much.

#### Acceptance Criteria

1. WHEN viewing customer list THEN each customer SHALL show their current outstanding balance
2. WHEN balance is positive THEN it SHALL be displayed in green (customer owes money)
3. WHEN balance is negative THEN it SHALL be displayed in red (I owe money to customer)
4. WHEN balance is zero THEN it SHALL be displayed in gray (no outstanding amount)
5. WHEN viewing customer details THEN the total balance SHALL be prominently displayed

### Requirement 4

**User Story:** As a business owner, I want to access personal khata book from the navigation, so that I can quickly manage my customer accounts.

#### Acceptance Criteria

1. WHEN user views the dashboard THEN there SHALL be a "Personal Khata" card/button
2. WHEN user clicks personal khata THEN it SHALL navigate to the personal khata book page
3. WHEN in personal khata book THEN navigation SHALL be clear and intuitive
4. WHEN user wants to go back THEN there SHALL be a back button to dashboard

### Requirement 5

**User Story:** As a business owner, I want to view transaction history for each customer, so that I can see all past dealings and verify amounts.

#### Acceptance Criteria

1. WHEN viewing a customer's page THEN all transactions SHALL be listed chronologically
2. WHEN viewing transactions THEN each SHALL show date, description, amount, and type
3. WHEN viewing transactions THEN running balance SHALL be calculated and displayed
4. WHEN there are many transactions THEN they SHALL be paginated or scrollable
5. WHEN viewing transaction history THEN it SHALL be easy to add new transactions

### Requirement 6

**User Story:** As a business owner, I want to search and filter customers, so that I can quickly find specific customers when I have many.

#### Acceptance Criteria

1. WHEN viewing customer list THEN there SHALL be a search box
2. WHEN typing in search THEN customers SHALL be filtered by name or phone number
3. WHEN search is cleared THEN all customers SHALL be shown again
4. WHEN there are no matching customers THEN appropriate message SHALL be displayed
5. WHEN customers list is long THEN it SHALL be easy to navigate

### Requirement 7

**User Story:** As a business owner, I want to see summary information about my khata book, so that I can understand my overall financial position with customers.

#### Acceptance Criteria

1. WHEN viewing khata book THEN summary SHALL show total customers
2. WHEN viewing summary THEN it SHALL show total amount to be received
3. WHEN viewing summary THEN it SHALL show total amount to be paid
4. WHEN viewing summary THEN it SHALL show net position (receivable - payable)
5. WHEN summary is displayed THEN it SHALL be prominently visible and easy to understand

### Requirement 8

**User Story:** As a business owner, I want to edit or delete transactions if I make mistakes, so that I can keep accurate records.

#### Acceptance Criteria

1. WHEN viewing transactions THEN each transaction SHALL have edit/delete options
2. WHEN editing a transaction THEN all fields SHALL be editable
3. WHEN a transaction is edited THEN customer balance SHALL be recalculated
4. WHEN deleting a transaction THEN user SHALL be asked for confirmation
5. WHEN a transaction is deleted THEN customer balance SHALL be updated accordingly