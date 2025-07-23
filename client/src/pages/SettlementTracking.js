import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { API_ENDPOINTS, buildUrl } from '../utils/api';

function SettlementTracking({ token }) {
  const navigate = useNavigate();
  const [groups, setGroups] = useState([]);
  const [selectedGroup, setSelectedGroup] = useState('');
  const [balances, setBalances] = useState([]);
  const [suggestions, setSuggestions] = useState([]);
  const [settlements, setSettlements] = useState([]);
  const [summary, setSummary] = useState({
    totalOutstanding: 0,
    totalSettlements: 0,
    suggestedTransactions: 0
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [showSettlementForm, setShowSettlementForm] = useState(false);
  
  const [newSettlement, setNewSettlement] = useState({
    from_user_id: '',
    to_user_id: '',
    amount: '',
    description: '',
    date: new Date().toISOString().split('T')[0]
  });
  const [currentGroupMembers, setCurrentGroupMembers] = useState([]);

  // Load groups and set first group as selected on component mount
  const fetchUserGroups = useCallback(async () => {
    try {
      const response = await axios.get(
        buildUrl(API_ENDPOINTS.GROUPS.BASE),
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      const userGroups = response.data.groups || [];
      setGroups(userGroups);
      
      // Auto-select first group if available
      if (userGroups.length > 0 && !selectedGroup) {
        setSelectedGroup(userGroups[0]._id);
      }
    } catch (error) {
      console.error('Error loading groups:', error);
      setMessage('Error loading groups: ' + (error.response?.data?.message || 'Unknown error'));
    }
  }, [token, selectedGroup]);

  // Load balances and settlements when group changes
  const fetchGroupBalances = useCallback(async () => {
    setLoading(true);
    try {
      const response = await axios.get(
        buildUrl(API_ENDPOINTS.SETTLEMENTS.BALANCES(selectedGroup)),
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      setBalances(response.data.balances || []);
      setSuggestions(response.data.suggestions || []);
      setSummary(response.data.summary || {
        totalOutstanding: 0,
        totalSettlements: 0,
        suggestedTransactions: 0
      });
      
      // Set current group members for the settlement form
      if (response.data.group && response.data.group.members) {
        setCurrentGroupMembers(response.data.group.members);
      }
    } catch (error) {
      setMessage('Error loading balances: ' + (error.response?.data?.message || 'Unknown error'));
    }
    setLoading(false);
  }, [selectedGroup, token]);

  const fetchGroupSettlements = useCallback(async () => {
    try {
      const response = await axios.get(
        buildUrl(API_ENDPOINTS.SETTLEMENTS.BY_GROUP(selectedGroup)),
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      setSettlements(response.data.settlements || []);
    } catch (error) {
      console.error('Error loading settlements:', error);
    }
  }, [selectedGroup, token]);

  useEffect(() => {
    if (token) {
      fetchUserGroups();
    }
  }, [token, fetchUserGroups]);

  useEffect(() => {
    if (selectedGroup) {
      fetchGroupBalances();
      fetchGroupSettlements();
    }
  }, [selectedGroup, fetchGroupBalances, fetchGroupSettlements]);

  const recordSettlement = async (e) => {
    e.preventDefault();
    
    // Prevent double submission
    if (loading) {
      return;
    }
    
    if (!newSettlement.from_user_id || !newSettlement.to_user_id || !newSettlement.amount) {
      setMessage('Please fill all required fields');
      return;
    }
    
    if (parseFloat(newSettlement.amount) <= 0) {
      setMessage('Amount must be greater than 0');
      return;
    }

    setLoading(true);
    try {
      await axios.post(
        buildUrl(API_ENDPOINTS.SETTLEMENTS.BASE),
        {
          ...newSettlement,
          group_id: selectedGroup,
          amount: parseFloat(newSettlement.amount)
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setMessage('✅ Settlement recorded successfully!');
      setNewSettlement({
        from_user_id: '',
        to_user_id: '',
        amount: '',
        description: '',
        date: new Date().toISOString().split('T')[0]
      });
      setShowSettlementForm(false);
      
      // Refresh data
      await fetchGroupBalances();
      await fetchGroupSettlements();
    } catch (error) {
      setMessage('❌ Error: ' + (error.response?.data?.message || 'Unknown error'));
    } finally {
      setLoading(false);
    }
  };

  const recordSuggestedSettlement = async (suggestion) => {
    if (loading) {
      return;
    }

    setLoading(true);
    try {
      await axios.post(
        buildUrl(API_ENDPOINTS.SETTLEMENTS.BASE),
        {
          from_user_id: suggestion.from_user_id,
          to_user_id: suggestion.to_user_id,
          group_id: selectedGroup,
          amount: suggestion.amount,
          description: suggestion.description || 'Suggested settlement'
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setMessage('✅ Suggested settlement recorded successfully!');
      
      // Refresh data
      await fetchGroupBalances();
      await fetchGroupSettlements();
    } catch (error) {
      setMessage('❌ Error recording suggested settlement: ' + (error.response?.data?.message || 'Unknown error'));
    } finally {
      setLoading(false);
    }
  };

  const deleteSettlement = async (settlementId) => {
    console.log('Delete button clicked for settlement:', settlementId);
    
    if (!settlementId) {
      console.error('No settlement ID provided');
      setMessage('❌ Error: No settlement ID provided');
      return;
    }
    
    if (!window.confirm('Are you sure you want to delete this settlement?')) {
      console.log('User cancelled deletion');
      return;
    }

    console.log('Attempting to delete settlement:', settlementId);
    setLoading(true);
    
    try {
      await axios.delete(
        buildUrl(API_ENDPOINTS.SETTLEMENTS.DELETE(settlementId)),
        { headers: { Authorization: `Bearer ${token}` } }
      );
      

      setMessage('✅ Settlement deleted successfully!');
      
      // Refresh data
      await fetchGroupBalances();
      await fetchGroupSettlements();
    } catch (error) {
      console.error('Delete error:', error);
      console.error('Error response:', error.response);
      setMessage('❌ Error deleting settlement: ' + (error.response?.data?.message || error.message || 'Unknown error'));
    } finally {
      setLoading(false);
    }
  };



  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f5f5f5' }}>
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
            <h1 style={{ margin: 0, color: '#333' }}>🧾 Settlement Tracking</h1>
          </div>
          <button
            onClick={() => setShowSettlementForm(!showSettlementForm)}
            style={{
              padding: '10px 20px',
              backgroundColor: '#28a745',
              color: 'white',
              border: 'none',
              borderRadius: '5px',
              cursor: 'pointer'
            }}
          >
            + Record Settlement
          </button>
        </div>
      </div>

      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 20px' }}>
        
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

        <div style={{ display: 'flex', gap: '20px', marginBottom: '30px' }}>
          <div style={{ flex: 1 }}>
            <label style={{ display: 'block', marginBottom: '5px', color: '#333', fontWeight: 'bold' }}>
              Select Group
            </label>
            <select
              value={selectedGroup}
              onChange={(e) => setSelectedGroup(e.target.value)}
              style={{
                width: '100%',
                padding: '12px',
                border: '1px solid #ddd',
                borderRadius: '5px',
                fontSize: '14px'
              }}
            >
              <option value="">Select a group</option>
              {groups.map(group => (
                <option key={group._id} value={group._id}>{group.name}</option>
              ))}
            </select>
          </div>
        </div>

        {summary && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px', marginBottom: '30px' }}>
            <div style={{
              backgroundColor: 'white',
              padding: '20px',
              borderRadius: '10px',
              boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
              textAlign: 'center'
            }}>
              <h3 style={{ color: '#dc3545', margin: '0 0 10px 0' }}>Total Outstanding</h3>
              <div style={{ fontSize: '32px', fontWeight: 'bold', color: '#dc3545' }}>
                ₹{summary.totalOutstanding}
              </div>
            </div>

            <div style={{
              backgroundColor: 'white',
              padding: '20px',
              borderRadius: '10px',
              boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
              textAlign: 'center'
            }}>
              <h3 style={{ color: '#28a745', margin: '0 0 10px 0' }}>Total Settlements</h3>
              <div style={{ fontSize: '32px', fontWeight: 'bold', color: '#28a745' }}>
                {summary.totalSettlements}
              </div>
            </div>

            <div style={{
              backgroundColor: 'white',
              padding: '20px',
              borderRadius: '10px',
              boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
              textAlign: 'center'
            }}>
              <h3 style={{ color: '#007bff', margin: '0 0 10px 0' }}>Suggested Transactions</h3>
              <div style={{ fontSize: '32px', fontWeight: 'bold', color: '#007bff' }}>
                {summary.suggestedTransactions}
              </div>
            </div>
          </div>
        )}

        {showSettlementForm && (
          <div style={{
            backgroundColor: 'white',
            padding: '30px',
            borderRadius: '10px',
            boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
            marginBottom: '30px'
          }}>
            <h3 style={{ marginBottom: '20px', color: '#333' }}>Record New Settlement</h3>
            <form onSubmit={recordSettlement}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '20px' }}>
                
                <div>
                  <label style={{ display: 'block', marginBottom: '5px', color: '#333', fontWeight: 'bold' }}>
                    From User *
                  </label>
                  <select
                    value={newSettlement.from_user_id}
                    onChange={(e) => setNewSettlement({...newSettlement, from_user_id: e.target.value})}
                    style={{
                      width: '100%',
                      padding: '12px',
                      border: '1px solid #ddd',
                      borderRadius: '5px',
                      fontSize: '14px'
                    }}
                    required
                  >
                    <option value="">Select who paid</option>
                    {currentGroupMembers.map(member => (
                      <option key={member._id} value={member._id}>
                        {member.username}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label style={{ display: 'block', marginBottom: '5px', color: '#333', fontWeight: 'bold' }}>
                    To User *
                  </label>
                  <select
                    value={newSettlement.to_user_id}
                    onChange={(e) => setNewSettlement({...newSettlement, to_user_id: e.target.value})}
                    style={{
                      width: '100%',
                      padding: '12px',
                      border: '1px solid #ddd',
                      borderRadius: '5px',
                      fontSize: '14px'
                    }}
                    required
                  >
                    <option value="">Select who received</option>
                    {currentGroupMembers.map(member => (
                      <option key={member._id} value={member._id}>
                        {member.username}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label style={{ display: 'block', marginBottom: '5px', color: '#333', fontWeight: 'bold' }}>
                    Amount *
                  </label>
                  <input
                    type="number"
                    placeholder="Enter amount"
                    value={newSettlement.amount}
                    onChange={(e) => setNewSettlement({...newSettlement, amount: e.target.value})}
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

                <div>
                  <label style={{ display: 'block', marginBottom: '5px', color: '#333', fontWeight: 'bold' }}>
                    Date *
                  </label>
                  <input
                    type="date"
                    value={newSettlement.date}
                    onChange={(e) => setNewSettlement({...newSettlement, date: e.target.value})}
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

                <div style={{ gridColumn: '1 / -1' }}>
                  <label style={{ display: 'block', marginBottom: '5px', color: '#333', fontWeight: 'bold' }}>
                    Description
                  </label>
                  <input
                    type="text"
                    placeholder="What was this settlement for?"
                    value={newSettlement.description}
                    onChange={(e) => setNewSettlement({...newSettlement, description: e.target.value})}
                    style={{
                      width: '100%',
                      padding: '12px',
                      border: '1px solid #ddd',
                      borderRadius: '5px',
                      fontSize: '14px'
                    }}
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
                  {loading ? 'Recording...' : 'Record Settlement'}
                </button>
                <button
                  type="button"
                  onClick={() => setShowSettlementForm(false)}
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

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '30px' }}>
          
          <div style={{
            backgroundColor: 'white',
            borderRadius: '10px',
            boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
            overflow: 'hidden'
          }}>
            <div style={{ padding: '20px', borderBottom: '1px solid #e0e0e0' }}>
              <h3 style={{ margin: 0, color: '#333' }}>💰 Outstanding Balances</h3>
            </div>

            {loading ? (
              <div style={{ padding: '40px', textAlign: 'center', color: '#666' }}>
                Loading balances...
              </div>
            ) : balances.length === 0 ? (
              <div style={{ padding: '40px', textAlign: 'center', color: '#666' }}>
                <div style={{ fontSize: '48px', marginBottom: '15px' }}>🎉</div>
                <div>All settled! No outstanding balances.</div>
              </div>
            ) : (
              <div>
                {balances.map((balance, index) => (
                  <div
                    key={index}
                    style={{
                      padding: '20px',
                      borderBottom: index < balances.length - 1 ? '1px solid #f0f0f0' : 'none',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center'
                    }}
                  >
                    <div>
                      <div style={{ fontWeight: 'bold', marginBottom: '5px' }}>
                        {balance.from_user_name} → {balance.to_user_name}
                      </div>
                      <div style={{ fontSize: '14px', color: '#666' }}>
                        {balance.description}
                      </div>
                    </div>
                    
                    <div style={{
                      fontSize: '20px',
                      fontWeight: 'bold',
                      color: '#dc3545'
                    }}>
                      ₹{balance.amount}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div style={{
            backgroundColor: 'white',
            borderRadius: '10px',
            boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
            overflow: 'hidden'
          }}>
            <div style={{ padding: '20px', borderBottom: '1px solid #e0e0e0' }}>
              <h3 style={{ margin: 0, color: '#333' }}>💡 Settlement Suggestions</h3>
            </div>

            {suggestions.length === 0 ? (
              <div style={{ padding: '40px', textAlign: 'center', color: '#666' }}>
                <div style={{ fontSize: '48px', marginBottom: '15px' }}>✨</div>
                <div>No suggestions needed!</div>
              </div>
            ) : (
              <div>
                {suggestions.map((suggestion, index) => (
                  <div
                    key={index}
                    style={{
                      padding: '20px',
                      borderBottom: index < suggestions.length - 1 ? '1px solid #f0f0f0' : 'none',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center'
                    }}
                  >
                    <div style={{ flex: 1 }}>
                      <div style={{ fontWeight: 'bold', marginBottom: '5px' }}>
                        {suggestion.from_user_name} should pay {suggestion.to_user_name}
                      </div>
                      <div style={{ fontSize: '14px', color: '#666' }}>
                        Optimal settlement
                      </div>
                    </div>
                    
                    <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                      <div style={{
                        fontSize: '20px',
                        fontWeight: 'bold',
                        color: '#28a745'
                      }}>
                        ₹{suggestion.amount}
                      </div>
                      
                      <button
                        onClick={() => recordSuggestedSettlement(suggestion)}
                        disabled={loading}
                        style={{
                          padding: '8px 16px',
                          backgroundColor: '#007bff',
                          color: 'white',
                          border: 'none',
                          borderRadius: '4px',
                          cursor: 'pointer',
                          fontSize: '12px',
                          fontWeight: 'bold'
                        }}
                        title="Record this settlement"
                      >
                        ✅ Record
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <div style={{
          backgroundColor: 'white',
          borderRadius: '10px',
          boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
          overflow: 'hidden',
          marginTop: '30px'
        }}>
          <div style={{ padding: '20px', borderBottom: '1px solid #e0e0e0' }}>
            <h3 style={{ margin: 0, color: '#333' }}>📋 Settlement History</h3>
          </div>

          {settlements.length === 0 ? (
            <div style={{ padding: '40px', textAlign: 'center', color: '#666' }}>
              <div style={{ fontSize: '48px', marginBottom: '15px' }}>📝</div>
              <div>No settlements recorded yet.</div>
            </div>
          ) : (
            <div>
              {settlements.map((settlement, index) => (
                <div
                  key={settlement._id}
                  style={{
                    padding: '20px',
                    borderBottom: index < settlements.length - 1 ? '1px solid #f0f0f0' : 'none',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center'
                  }}
                >
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: 'bold', marginBottom: '5px' }}>
                      {settlement.from_user_id?.username || 'Unknown'} paid {settlement.to_user_id?.username || 'Unknown'}
                    </div>
                    <div style={{ fontSize: '14px', color: '#666' }}>
                      {settlement.description} • {new Date(settlement.date).toLocaleDateString()}
                    </div>
                  </div>
                  
                  <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                    <div style={{
                      fontSize: '18px',
                      fontWeight: 'bold',
                      color: '#28a745'
                    }}>
                      ₹{settlement.amount}
                    </div>
                    
                    <button
                      onClick={() => deleteSettlement(settlement._id)}
                      style={{
                        padding: '6px 12px',
                        backgroundColor: '#dc3545',
                        color: 'white',
                        border: 'none',
                        borderRadius: '4px',
                        cursor: 'pointer',
                        fontSize: '12px',
                        fontWeight: 'bold'
                      }}
                      title="Delete this settlement"
                    >
                      🗑️ Delete
                    </button>
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

export default SettlementTracking;