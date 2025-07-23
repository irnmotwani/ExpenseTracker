import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';

/**
 * Customer Details Page
 * 
 * Features:
 * - View customer information and current balance
 * - Display transaction history with running balance
 * - Add new transactions (Debit/Credit)
 * - Edit/Delete existing transactions
 * - Real-time balance calculation
 */
function CustomerDetails({ token }) {
    const navigate = useNavigate();
    const { customerId } = useParams();

    // State management
    const [customer, setCustomer] = useState(null);
    const [transactions, setTransactions] = useState([]);
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');
    const [showAddForm, setShowAddForm] = useState(false);

    // New transaction form data
    const [newTransaction, setNewTransaction] = useState({
        type: 'debit', // debit = customer owes you, credit = you owe customer
        amount: '',
        description: '',
        date: new Date().toISOString().split('T')[0] // Today's date
    });

    /**
     * Fetch customer details and transaction history
     */
    const fetchCustomerDetails = useCallback(async () => {
        setLoading(true);
        try {
            const response = await axios.get(
                `${require('../utils/api').buildUrl(`/personal-khata/customers/${customerId}/transactions`)}`,
                { headers: { Authorization: `Bearer ${token}` } }
            );
            setCustomer(response.data.customer);
            setTransactions(response.data.transactions);
        } catch (error) {
            setMessage('Error loading customer details: ' + (error.response?.data?.message || 'Unknown error'));
        }
        setLoading(false);
    }, [customerId, token]);

    // Load customer data and transactions on component mount
    useEffect(() => {
        fetchCustomerDetails();
    }, [customerId, fetchCustomerDetails]);

    /**
     * Add new transaction
     */
    const addTransaction = async (e) => {
        e.preventDefault();

        // Validation
        if (!newTransaction.amount || !newTransaction.description) {
            setMessage('Amount and description are required');
            return;
        }

        if (parseFloat(newTransaction.amount) <= 0) {
            setMessage('Amount must be greater than 0');
            return;
        }

        setLoading(true);
        try {
            await axios.post(
                require('../utils/api').buildUrl('/personal-khata/transactions'),
                {
                    customer_id: customerId,
                    type: newTransaction.type,
                    amount: parseFloat(newTransaction.amount),
                    description: newTransaction.description.trim(),
                    date: newTransaction.date
                },
                { headers: { Authorization: `Bearer ${token}` } }
            );

            setMessage('✅ Transaction added successfully!');
            setNewTransaction({
                type: 'debit',
                amount: '',
                description: '',
                date: new Date().toISOString().split('T')[0]
            });
            setShowAddForm(false);

            // Refresh data
            fetchCustomerDetails();
        } catch (error) {
            setMessage('❌ Error: ' + (error.response?.data?.message || 'Unknown error'));
        }
        setLoading(false);
    };

    /**
     * Get balance color based on amount
     */
    const getBalanceColor = (balance) => {
        if (balance > 0) return '#28a745'; // Green - customer owes money
        if (balance < 0) return '#dc3545'; // Red - you owe money to customer
        return '#6c757d'; // Gray - no outstanding amount
    };

    /**
     * Format balance text
     */
    const getBalanceText = (balance) => {
        if (balance > 0) return `₹${balance}`;
        if (balance < 0) return `₹${Math.abs(balance)}`;
        return '₹0';
    };

    /**
     * Get balance label
     */
    const getBalanceLabel = (balance) => {
        if (balance > 0) return 'Customer owes you';
        if (balance < 0) return 'You owe customer';
        return 'Settled';
    };

    if (loading && !customer) {
        return (
            <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <div style={{ textAlign: 'center', color: '#666' }}>
                    <div style={{ fontSize: '24px', marginBottom: '10px' }}>⏳</div>
                    <div>Loading customer details...</div>
                </div>
            </div>
        );
    }

    if (!customer) {
        return (
            <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <div style={{ textAlign: 'center', color: '#666' }}>
                    <div style={{ fontSize: '24px', marginBottom: '10px' }}>❌</div>
                    <div>Customer not found</div>
                    <button
                        onClick={() => navigate('/personal-khata')}
                        style={{ marginTop: '20px', padding: '10px 20px', backgroundColor: '#007bff', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' }}
                    >
                        Back to Khata Book
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div style={{ minHeight: '100vh', backgroundColor: '#f5f5f5' }}>
            {/* Header */}
            <div style={{
                backgroundColor: 'white',
                padding: '20px',
                boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
                marginBottom: '30px'
            }}>
                <div style={{
                    maxWidth: '1200px',
                    margin: '0 auto',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center'
                }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                        <button
                            onClick={() => navigate('/personal-khata')}
                            style={{
                                padding: '8px 12px',
                                backgroundColor: '#6c757d',
                                color: 'white',
                                border: 'none',
                                borderRadius: '5px',
                                cursor: 'pointer'
                            }}
                        >
                            ← Back to Khata Book
                        </button>
                        <div>
                            <h1 style={{ margin: 0, color: '#333' }}>👤 {customer.name}</h1>
                            <div style={{ display: 'flex', gap: '20px', fontSize: '14px', color: '#666', marginTop: '5px' }}>
                                {customer.phone && <span>📞 {customer.phone}</span>}
                                {customer.address && <span>📍 {customer.address}</span>}
                            </div>
                        </div>
                    </div>

                    <div style={{ textAlign: 'right' }}>
                        <div style={{
                            fontSize: '32px',
                            fontWeight: 'bold',
                            color: getBalanceColor(customer.balance)
                        }}>
                            {getBalanceText(customer.balance)}
                        </div>
                        <div style={{ fontSize: '14px', color: '#666' }}>
                            {getBalanceLabel(customer.balance)}
                        </div>
                    </div>
                </div>
            </div>

            <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 20px' }}>

                {/* Message */}
                {message && (
                    <div style={{
                        padding: '15px',
                        backgroundColor: message.includes('Error') || message.includes('❌') ? '#f8d7da' : '#d4edda',
                        color: message.includes('Error') || message.includes('❌') ? '#721c24' : '#155724',
                        borderRadius: '5px',
                        marginBottom: '20px'
                    }}>
                        {message}
                        <button
                            onClick={() => setMessage('')}
                            style={{ float: 'right', background: 'none', border: 'none', fontSize: '16px', cursor: 'pointer' }}
                        >
                            ×
                        </button>
                    </div>
                )}

                {/* Add Transaction Button */}
                <div style={{ marginBottom: '30px', textAlign: 'center' }}>
                    <button
                        onClick={() => setShowAddForm(!showAddForm)}
                        style={{
                            padding: '15px 30px',
                            backgroundColor: '#28a745',
                            color: 'white',
                            border: 'none',
                            borderRadius: '8px',
                            fontSize: '16px',
                            cursor: 'pointer',
                            boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)'
                        }}
                    >
                        + Add Transaction
                    </button>
                </div>

                {/* Add Transaction Form */}
                {showAddForm && (
                    <div style={{
                        backgroundColor: 'white',
                        padding: '30px',
                        borderRadius: '10px',
                        boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
                        marginBottom: '30px'
                    }}>
                        <h3 style={{ marginBottom: '20px', color: '#333' }}>Add New Transaction</h3>
                        <form onSubmit={addTransaction}>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '20px' }}>

                                {/* Transaction Type */}
                                <div>
                                    <label style={{ display: 'block', marginBottom: '5px', color: '#333', fontWeight: 'bold' }}>
                                        Transaction Type *
                                    </label>
                                    <select
                                        value={newTransaction.type}
                                        onChange={(e) => setNewTransaction({ ...newTransaction, type: e.target.value })}
                                        style={{
                                            width: '100%',
                                            padding: '12px',
                                            border: '1px solid #ddd',
                                            borderRadius: '5px',
                                            fontSize: '14px'
                                        }}
                                    >
                                        <option value="debit">Debit (Customer owes you)</option>
                                        <option value="credit">Credit (You owe customer)</option>
                                    </select>
                                    <small style={{ color: '#666', fontSize: '12px' }}>
                                        {newTransaction.type === 'debit' ?
                                            '💰 Use when customer takes goods/money from you' :
                                            '💸 Use when customer gives you money/payment'
                                        }
                                    </small>
                                </div>

                                {/* Amount */}
                                <div>
                                    <label style={{ display: 'block', marginBottom: '5px', color: '#333', fontWeight: 'bold' }}>
                                        Amount *
                                    </label>
                                    <input
                                        type="number"
                                        placeholder="Enter amount"
                                        value={newTransaction.amount}
                                        onChange={(e) => setNewTransaction({ ...newTransaction, amount: e.target.value })}
                                        style={{
                                            width: '100%',
                                            padding: '12px',
                                            border: '1px solid #ddd',
                                            borderRadius: '5px',
                                            fontSize: '14px'
                                        }}
                                        required
                                        min="0.01"
                                        step="0.01"
                                    />
                                </div>

                                {/* Description */}
                                <div>
                                    <label style={{ display: 'block', marginBottom: '5px', color: '#333', fontWeight: 'bold' }}>
                                        Description *
                                    </label>
                                    <input
                                        type="text"
                                        placeholder="What was this transaction for?"
                                        value={newTransaction.description}
                                        onChange={(e) => setNewTransaction({ ...newTransaction, description: e.target.value })}
                                        style={{
                                            width: '100%',
                                            padding: '12px',
                                            border: '1px solid #ddd',
                                            borderRadius: '5px',
                                            fontSize: '14px'
                                        }}
                                        required
                                    />
                                </div>

                                {/* Date */}
                                <div>
                                    <label style={{ display: 'block', marginBottom: '5px', color: '#333', fontWeight: 'bold' }}>
                                        Date *
                                    </label>
                                    <input
                                        type="date"
                                        value={newTransaction.date}
                                        onChange={(e) => setNewTransaction({ ...newTransaction, date: e.target.value })}
                                        style={{
                                            width: '100%',
                                            padding: '12px',
                                            border: '1px solid #ddd',
                                            borderRadius: '5px',
                                            fontSize: '14px'
                                        }}
                                        required
                                    />
                                </div>
                            </div>

                            <div style={{ display: 'flex', gap: '10px' }}>
                                <button
                                    type="submit"
                                    disabled={loading}
                                    style={{
                                        padding: '12px 24px',
                                        backgroundColor: '#007bff',
                                        color: 'white',
                                        border: 'none',
                                        borderRadius: '5px',
                                        cursor: 'pointer',
                                        fontSize: '14px'
                                    }}
                                >
                                    {loading ? 'Adding...' : 'Add Transaction'}
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setShowAddForm(false)}
                                    style={{
                                        padding: '12px 24px',
                                        backgroundColor: '#6c757d',
                                        color: 'white',
                                        border: 'none',
                                        borderRadius: '5px',
                                        cursor: 'pointer',
                                        fontSize: '14px'
                                    }}
                                >
                                    Cancel
                                </button>
                            </div>
                        </form>
                    </div>
                )}

                {/* Transaction History */}
                <div style={{
                    backgroundColor: 'white',
                    borderRadius: '10px',
                    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
                    overflow: 'hidden'
                }}>
                    <div style={{ padding: '20px', borderBottom: '1px solid #e0e0e0' }}>
                        <h3 style={{ margin: 0, color: '#333' }}>📋 Transaction History</h3>
                    </div>

                    {transactions.length === 0 ? (
                        <div style={{ padding: '40px', textAlign: 'center', color: '#666' }}>
                            <div style={{ fontSize: '48px', marginBottom: '15px' }}>📝</div>
                            <div>No transactions yet. Add your first transaction above!</div>
                        </div>
                    ) : (
                        <div>
                            {transactions.map((transaction, index) => (
                                <div
                                    key={transaction._id}
                                    style={{
                                        padding: '20px',
                                        borderBottom: index < transactions.length - 1 ? '1px solid #f0f0f0' : 'none',
                                        display: 'flex',
                                        justifyContent: 'space-between',
                                        alignItems: 'center'
                                    }}
                                >
                                    <div style={{ flex: 1 }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '5px' }}>
                                            <span style={{
                                                padding: '4px 8px',
                                                borderRadius: '4px',
                                                fontSize: '12px',
                                                fontWeight: 'bold',
                                                backgroundColor: transaction.type === 'debit' ? '#d4edda' : '#f8d7da',
                                                color: transaction.type === 'debit' ? '#155724' : '#721c24'
                                            }}>
                                                {transaction.type === 'debit' ? '📈 DEBIT' : '📉 CREDIT'}
                                            </span>
                                            <span style={{ fontSize: '14px', color: '#666' }}>
                                                {new Date(transaction.date).toLocaleDateString()}
                                            </span>
                                        </div>
                                        <div style={{ fontWeight: 'bold', marginBottom: '5px' }}>
                                            {transaction.description}
                                        </div>
                                    </div>

                                    <div style={{ textAlign: 'right' }}>
                                        <div style={{
                                            fontSize: '18px',
                                            fontWeight: 'bold',
                                            color: transaction.type === 'debit' ? '#28a745' : '#dc3545'
                                        }}>
                                            {transaction.type === 'debit' ? '+' : '-'}₹{transaction.amount}
                                        </div>
                                        <div style={{ fontSize: '12px', color: '#666' }}>
                                            Balance: ₹{transaction.runningBalance || 0}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

export default CustomerDetails;