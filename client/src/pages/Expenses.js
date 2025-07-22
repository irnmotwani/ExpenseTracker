import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';

function Expenses({ token }) {
  const navigate = useNavigate();
  const location = useLocation();
  const [groups, setGroups] = useState([]);
  const [selectedGroupId, setSelectedGroupId] = useState(location.state?.groupId || '');
  const [selectedGroupName, setSelectedGroupName] = useState(location.state?.groupName || '');
  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [message, setMessage] = useState('');

  const [newExpense, setNewExpense] = useState({
    amount: '',
    description: '',
    category: 'Food'
  });

  useEffect(() => {
    fetchGroups();
  }, []);

  useEffect(() => {
    if (selectedGroupId) {
      fetchExpenses();
    }
  }, [selectedGroupId]);

  const fetchGroups = async () => {
    try {
      // Import API utilities
      const { buildUrl, API_ENDPOINTS } = require('../utils/api');
      
      // Log the URL being used
      const url = buildUrl(API_ENDPOINTS.GROUPS.BASE);
      console.log('Fetching groups from URL:', url);
      
      const response = await axios.get(url, {
        headers: { Authorization: `Bearer ${token}` }
      });
      console.log('Groups API response:', response);
      setGroups(response.data.groups || []);
    } catch (error) {
      console.error('Error details:', error);
      setMessage('Error fetching groups: ' + (error.response?.data?.message || 'Unknown error'));
    }
  };

  const fetchExpenses = async () => {
    if (!selectedGroupId) return;

    setLoading(true);
    try {
      const { buildUrl, API_ENDPOINTS } = require('../utils/api');
      const response = await axios.get(buildUrl(API_ENDPOINTS.EXPENSES.BY_GROUP(selectedGroupId)), {
        headers: { Authorization: `Bearer ${token}` }
      });
      setExpenses(response.data);
    } catch (error) {
      setMessage('Error fetching expenses: ' + (error.response?.data?.message || 'Unknown error'));
    }
    setLoading(false);
  };

  const createExpense = async (e) => {
    e.preventDefault();
    if (!selectedGroupId) {
      setMessage('Please select a group first');
      return;
    }

    if (!token) {
      setMessage('Please login first');
      return;
    }

    setLoading(true);
    try {
      console.log('Creating expense with data:', {
        ...newExpense,
        amount: parseFloat(newExpense.amount),
        group_id: selectedGroupId
      });

      const { buildUrl, API_ENDPOINTS } = require('../utils/api');
      const response = await axios.post(buildUrl(API_ENDPOINTS.EXPENSES.BASE), {
        ...newExpense,
        amount: parseFloat(newExpense.amount),
        group_id: selectedGroupId
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });

      console.log('Expense created successfully:', response.data);
      setMessage('✅ Expense created and split successfully!');
      setNewExpense({ amount: '', description: '', category: 'Food' });
      setShowCreateForm(false);
      fetchExpenses();
    } catch (error) {
      console.error('Error creating expense:', error);
      const errorMsg = error.response?.data?.message || error.message || 'Unknown error';
      const statusCode = error.response?.status || 'No status';
      setMessage(`❌ Error (${statusCode}): ${errorMsg}`);
    }
    setLoading(false);
  };

  const handleGroupChange = (groupId) => {
    setSelectedGroupId(groupId);
    const group = groups.find(g => g._id === groupId);
    setSelectedGroupName(group?.name || '');
    setExpenses([]);
  };

  const inputStyle = {
    width: '100%',
    padding: '10px',
    border: '1px solid #ddd',
    borderRadius: '5px',
    fontSize: '14px',
    marginBottom: '10px'
  };

  const buttonStyle = {
    padding: '10px 20px',
    backgroundColor: '#007bff',
    color: 'white',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
    fontSize: '14px'
  };

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
              onClick={() => navigate('/dashboard')}
              style={{
                padding: '8px 12px',
                backgroundColor: '#6c757d',
                color: 'white',
                border: 'none',
                borderRadius: '5px',
                cursor: 'pointer'
              }}
            >
              ← Back
            </button>
            <h1 style={{ margin: 0, color: '#333' }}>💰 Expenses</h1>
            {selectedGroupName && (
              <span style={{ color: '#666', fontSize: '16px' }}>- {selectedGroupName}</span>
            )}
          </div>
          {selectedGroupId && (
            <button
              onClick={() => setShowCreateForm(!showCreateForm)}
              style={{
                ...buttonStyle,
                backgroundColor: '#28a745'
              }}
            >
              + Add Expense
            </button>
          )}
        </div>
      </div>

      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 20px' }}>

        {/* Message */}
        {message && (
          <div style={{
            padding: '15px',
            backgroundColor: message.includes('Error') ? '#f8d7da' : '#d4edda',
            color: message.includes('Error') ? '#721c24' : '#155724',
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

        {/* Group Selection */}
        <div style={{
          backgroundColor: 'white',
          padding: '20px',
          borderRadius: '10px',
          boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
          marginBottom: '30px'
        }}>
          <h3 style={{ marginBottom: '15px', color: '#333' }}>Select Group</h3>
          <select
            value={selectedGroupId}
            onChange={(e) => handleGroupChange(e.target.value)}
            style={{ ...inputStyle, width: '300px' }}
          >
            <option value="">Choose a group...</option>
            {groups.map(group => (
              <option key={group._id} value={group._id}>{group.name}</option>
            ))}
          </select>


        </div>

        {/* Create Expense Form */}
        {showCreateForm && selectedGroupId && (
          <div style={{
            backgroundColor: 'white',
            padding: '30px',
            borderRadius: '10px',
            boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
            marginBottom: '30px'
          }}>
            <h3 style={{ marginBottom: '20px', color: '#333' }}>Add New Expense</h3>
            <form onSubmit={createExpense}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr 1fr', gap: '15px', marginBottom: '20px' }}>
                <div>
                  <label style={{ display: 'block', marginBottom: '5px', color: '#333' }}>Amount (₹)</label>
                  <input
                    type="number"
                    step="0.01"
                    placeholder="1000"
                    value={newExpense.amount}
                    onChange={(e) => setNewExpense({ ...newExpense, amount: e.target.value })}
                    style={inputStyle}
                    required
                  />
                </div>
                <div>
                  <label style={{ display: 'block', marginBottom: '5px', color: '#333' }}>Description</label>
                  <input
                    type="text"
                    placeholder="e.g., Hotel booking, Dinner, etc."
                    value={newExpense.description}
                    onChange={(e) => setNewExpense({ ...newExpense, description: e.target.value })}
                    style={inputStyle}
                    required
                  />
                </div>
                <div>
                  <label style={{ display: 'block', marginBottom: '5px', color: '#333' }}>Category</label>
                  <select
                    value={newExpense.category}
                    onChange={(e) => setNewExpense({ ...newExpense, category: e.target.value })}
                    style={inputStyle}
                  >
                    <option value="Food">Food</option>
                    <option value="Transport">Transport</option>
                    <option value="Accommodation">Accommodation</option>
                    <option value="Entertainment">Entertainment</option>
                    <option value="Others">Others (Custom)</option>
                  </select>
                  {newExpense.category === 'Others' && (
                    <input
                      type="text"
                      placeholder="Enter custom category (e.g., Hotel, Shopping)"
                      value={newExpense.customCategory || ''}
                      onChange={(e) => setNewExpense({ ...newExpense, customCategory: e.target.value })}
                      style={{ ...inputStyle, marginTop: '10px', border: '2px solid #ffc107' }}
                      required
                    />
                  )}
                </div>
              </div>
              <div style={{ display: 'flex', gap: '10px' }}>
                <button type="submit" disabled={loading} style={buttonStyle}>
                  {loading ? 'Adding...' : 'Add Expense'}
                </button>
                <button
                  type="button"
                  onClick={() => setShowCreateForm(false)}
                  style={{ ...buttonStyle, backgroundColor: '#6c757d' }}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Expenses List */}
        {selectedGroupId && (
          <div style={{
            backgroundColor: 'white',
            borderRadius: '10px',
            boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
            overflow: 'hidden'
          }}>
            <div style={{ padding: '20px', borderBottom: '1px solid #e0e0e0' }}>
              <h3 style={{ margin: 0, color: '#333' }}>Group Expenses</h3>
            </div>

            {loading ? (
              <div style={{ padding: '40px', textAlign: 'center', color: '#666' }}>
                Loading expenses...
              </div>
            ) : expenses.length === 0 ? (
              <div style={{ padding: '40px', textAlign: 'center', color: '#666' }}>
                No expenses yet. Add your first expense to get started!
              </div>
            ) : (
              <div>
                {expenses.map((expense) => (
                  <div key={expense._id} style={{
                    padding: '20px',
                    borderBottom: '1px solid #f0f0f0'
                  }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '15px' }}>
                      <div>
                        <h4 style={{ margin: '0 0 5px 0', color: '#333' }}>{expense.description}</h4>
                        <p style={{ margin: '0 0 5px 0', color: '#666', fontSize: '14px' }}>
                          Paid by: {expense.paid_by?.username || 'Unknown'} • Category: {expense.category}
                        </p>
                        <p style={{ margin: 0, color: '#666', fontSize: '14px' }}>
                          Date: {new Date(expense.date).toLocaleDateString()}
                        </p>
                      </div>
                      <div style={{ textAlign: 'right' }}>
                        <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#28a745' }}>
                          ₹{expense.amount}
                        </div>
                      </div>
                    </div>

                    {/* Splits */}
                    {expense.splits && expense.splits.length > 0 && (
                      <div style={{
                        backgroundColor: '#f8f9fa',
                        padding: '15px',
                        borderRadius: '5px',
                        marginTop: '15px'
                      }}>
                        <h5 style={{ margin: '0 0 10px 0', color: '#333' }}>Split Details:</h5>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '10px' }}>
                          {expense.splits.map((split, index) => (
                            <div key={index} style={{
                              display: 'flex',
                              justifyContent: 'space-between',
                              padding: '8px 12px',
                              backgroundColor: 'white',
                              borderRadius: '3px',
                              fontSize: '14px'
                            }}>
                              <span>{split.user_id?.username || 'Unknown'}</span>
                              <span style={{ fontWeight: 'bold' }}>₹{split.amount_share.toFixed(2)}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {!selectedGroupId && (
          <div style={{
            backgroundColor: 'white',
            padding: '40px',
            borderRadius: '10px',
            boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
            textAlign: 'center'
          }}>
            <div style={{ fontSize: '48px', marginBottom: '20px' }}>💰</div>
            <h3 style={{ color: '#333', marginBottom: '10px' }}>Select a Group</h3>
            <p style={{ color: '#666' }}>Choose a group from the dropdown above to view and manage expenses</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default Expenses;