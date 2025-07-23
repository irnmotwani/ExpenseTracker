import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

function KhataBook({ token }) {
  const navigate = useNavigate();
  const [selectedGroup, setSelectedGroup] = useState('');
  const [transactions, setTransactions] = useState([]);
  const [filteredTransactions, setFilteredTransactions] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');
  const [transactionType, setTransactionType] = useState('all');

  const fetchGroups = useCallback(async () => {
    try {
      const { buildUrl, API_ENDPOINTS } = require('../utils/api');
      const response = await axios.get(buildUrl(API_ENDPOINTS.GROUPS.BASE), {
        headers: { Authorization: `Bearer ${token}` }
      });
      const userGroups = response.data.groups || [];
      
      // Auto-select first group if available
      if (userGroups.length > 0 && !selectedGroup) {
        setSelectedGroup(userGroups[0]._id);
      }
    } catch (error) {
      console.error('Error loading groups:', error);
    }
  }, [token, selectedGroup]);

  const fetchTransactions = useCallback(async () => {
    if (!selectedGroup) return;
    
    try {
      // Fetch expenses for the group
      const { buildUrl, API_ENDPOINTS } = require('../utils/api');
      const expensesResponse = await axios.get(buildUrl(API_ENDPOINTS.EXPENSES.BY_GROUP(selectedGroup)), {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      // Fetch settlements for the group
      const settlementsResponse = await axios.get(buildUrl(API_ENDPOINTS.SETTLEMENTS.BY_GROUP(selectedGroup)), {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      const expenses = expensesResponse.data || [];
      const settlements = settlementsResponse.data.settlements || [];
      
      // Transform expenses to transaction format
      const expenseTransactions = expenses.map(expense => ({
        _id: expense._id,
        type: 'expense',
        date: expense.date,
        description: expense.description,
        amount: expense.amount,
        paid_by: expense.paid_by?.username || 'Unknown',
        category: expense.category
      }));
      
      // Transform settlements to transaction format
      const settlementTransactions = settlements.map(settlement => ({
        _id: settlement._id,
        type: 'settlement',
        date: settlement.date,
        description: settlement.description || 'Settlement payment',
        amount: settlement.amount,
        from_user: settlement.from_user_id?.username || 'Unknown',
        to_user: settlement.to_user_id?.username || 'Unknown'
      }));
      
      // Combine and sort by date (newest first)
      const allTransactions = [...expenseTransactions, ...settlementTransactions]
        .sort((a, b) => new Date(b.date) - new Date(a.date));
      
      setTransactions(allTransactions);
      setFilteredTransactions(allTransactions);
    } catch (error) {
      console.error('Error loading transactions:', error);
    }
  }, [selectedGroup, token]);

  useEffect(() => {
    if (token) {
      fetchGroups();
    }
  }, [token, fetchGroups]);

  useEffect(() => {
    if (selectedGroup) {
      fetchTransactions();
    }
  }, [selectedGroup, fetchTransactions]);

  useEffect(() => {
    let filtered = [...transactions];
    if (searchTerm) {
      filtered = filtered.filter(txn => 
        txn.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    if (dateFrom) {
      filtered = filtered.filter(txn => new Date(txn.date) >= new Date(dateFrom));
    }
    if (dateTo) {
      filtered = filtered.filter(txn => new Date(txn.date) <= new Date(dateTo));
    }
    if (transactionType !== 'all') {
      filtered = filtered.filter(txn => txn.type === transactionType);
    }
    setFilteredTransactions(filtered);
  }, [searchTerm, dateFrom, dateTo, transactionType, transactions]);

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f5f5f5' }}>
      <div style={{ backgroundColor: 'white', padding: '20px', boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)', marginBottom: '30px' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'flex', alignItems: 'center', gap: '15px' }}>
          <button onClick={() => navigate('/dashboard')} style={{ padding: '8px 12px', backgroundColor: '#6c757d', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' }}>← Back</button>
          <h1 style={{ margin: 0, color: '#333' }}>📚 Khata Book</h1>
        </div>
      </div>

      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 20px' }}>
        <div style={{ backgroundColor: 'white', padding: '30px', borderRadius: '10px', boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)', marginBottom: '30px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr', gap: '15px', marginBottom: '20px' }}>
            <input type="text" placeholder="Search transactions..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} style={{ padding: '10px', border: '1px solid #ddd', borderRadius: '5px' }} />
            <input type="date" value={dateFrom} onChange={(e) => setDateFrom(e.target.value)} style={{ padding: '10px', border: '1px solid #ddd', borderRadius: '5px' }} />
            <input type="date" value={dateTo} onChange={(e) => setDateTo(e.target.value)} style={{ padding: '10px', border: '1px solid #ddd', borderRadius: '5px' }} />
            <select value={transactionType} onChange={(e) => setTransactionType(e.target.value)} style={{ padding: '10px', border: '1px solid #ddd', borderRadius: '5px' }}>
              <option value="all">All</option>
              <option value="expense">Expenses</option>
              <option value="settlement">Settlements</option>
            </select>
          </div>
          <button onClick={() => { setSearchTerm(''); setDateFrom(''); setDateTo(''); setTransactionType('all'); }} style={{ padding: '10px 20px', backgroundColor: '#6c757d', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' }}>Clear Filters</button>
        </div>

        <div style={{ backgroundColor: 'white', borderRadius: '10px', boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)', overflow: 'hidden' }}>
          <div style={{ padding: '20px', borderBottom: '1px solid #e0e0e0' }}>
            <h3 style={{ margin: 0, color: '#333' }}>📋 Transaction History</h3>
          </div>
          {filteredTransactions.length === 0 ? (
            <div style={{ padding: '40px', textAlign: 'center', color: '#666' }}>No transactions found</div>
          ) : (
            <div>
              {filteredTransactions.map((transaction, index) => (
                <div key={transaction._id} style={{ padding: '20px', borderBottom: index < filteredTransactions.length - 1 ? '1px solid #f0f0f0' : 'none', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <div style={{ fontWeight: 'bold', marginBottom: '5px' }}>{transaction.description}</div>
                    <div style={{ fontSize: '14px', color: '#666' }}>
                      {transaction.type === 'expense' ? `Paid by ${transaction.paid_by}` : `${transaction.from_user} → ${transaction.to_user}`} • {new Date(transaction.date).toLocaleDateString()}
                    </div>
                  </div>
                  <div style={{ fontSize: '18px', fontWeight: 'bold', color: transaction.type === 'expense' ? '#dc3545' : '#28a745' }}>₹{transaction.amount}</div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default KhataBook;