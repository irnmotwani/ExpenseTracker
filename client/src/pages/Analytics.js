import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

function Analytics({ token }) {
  const navigate = useNavigate();
  const [groups, setGroups] = useState([]);
  const [selectedGroupId, setSelectedGroupId] = useState('');
  const [selectedGroupName, setSelectedGroupName] = useState('');
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const fetchGroups = useCallback(async () => {
    try {
      const { buildUrl, API_ENDPOINTS } = require('../utils/api');
      const response = await axios.get(buildUrl(API_ENDPOINTS.GROUPS.BASE), {
        headers: { Authorization: `Bearer ${token}` }
      });
      setGroups(response.data.groups || []);
    } catch (error) {
      setMessage('Error fetching groups: ' + (error.response?.data?.message || 'Unknown error'));
    }
  }, [token]);

  const fetchAnalytics = useCallback(async () => {
    if (!selectedGroupId) return;
    
    setLoading(true);
    try {
      const { buildUrl } = require('../utils/api');
      const response = await axios.get(buildUrl(`/analytics/group/${selectedGroupId}`), {
        headers: { Authorization: `Bearer ${token}` }
      });
      setAnalytics(response.data);
    } catch (error) {
      setMessage('Error fetching analytics: ' + (error.response?.data?.message || 'Unknown error'));
    }
    setLoading(false);
  }, [selectedGroupId, token]);

  useEffect(() => {
    fetchGroups();
  }, [fetchGroups]);

  useEffect(() => {
    if (selectedGroupId) {
      fetchAnalytics();
    }
  }, [selectedGroupId, fetchAnalytics]);

  const handleGroupChange = (groupId) => {
    setSelectedGroupId(groupId);
    const group = groups.find(g => g._id === groupId);
    setSelectedGroupName(group?.name || '');
    setAnalytics(null);
  };

  const inputStyle = {
    width: '100%',
    padding: '10px',
    border: '1px solid #ddd',
    borderRadius: '5px',
    fontSize: '14px',
    marginBottom: '10px'
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
            <h1 style={{ margin: 0, color: '#333' }}>📊 Analytics</h1>
            {selectedGroupName && (
              <span style={{ color: '#666', fontSize: '16px' }}>- {selectedGroupName}</span>
            )}
          </div>
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
          <h3 style={{ marginBottom: '15px', color: '#333' }}>Select Group for Analytics</h3>
          <select
            value={selectedGroupId}
            onChange={(e) => handleGroupChange(e.target.value)}
            style={{...inputStyle, width: '300px'}}
          >
            <option value="">Choose a group...</option>
            {groups.map(group => (
              <option key={group._id} value={group._id}>{group.name}</option>
            ))}
          </select>
        </div>

        {/* Analytics Display */}
        {loading ? (
          <div style={{
            backgroundColor: 'white',
            padding: '40px',
            borderRadius: '10px',
            boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
            textAlign: 'center'
          }}>
            Loading analytics...
          </div>
        ) : analytics ? (
          <div>
            {/* Summary Cards */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '20px', marginBottom: '30px' }}>
              <div style={{
                backgroundColor: 'white',
                padding: '20px',
                borderRadius: '10px',
                boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
                textAlign: 'center'
              }}>
                <h3 style={{ color: '#28a745', margin: '0 0 10px 0' }}>Total Group Spending</h3>
                <div style={{ fontSize: '32px', fontWeight: 'bold', color: '#28a745' }}>
                  ₹{analytics.totalGroupSpending}
                </div>
              </div>

              <div style={{
                backgroundColor: 'white',
                padding: '20px',
                borderRadius: '10px',
                boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
                textAlign: 'center'
              }}>
                <h3 style={{ color: '#007bff', margin: '0 0 10px 0' }}>Total Expenses</h3>
                <div style={{ fontSize: '32px', fontWeight: 'bold', color: '#007bff' }}>
                  {analytics.totalExpenses}
                </div>
              </div>

              <div style={{
                backgroundColor: 'white',
                padding: '20px',
                borderRadius: '10px',
                boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
                textAlign: 'center'
              }}>
                <h3 style={{ color: '#ffc107', margin: '0 0 10px 0' }}>Group Members</h3>
                <div style={{ fontSize: '32px', fontWeight: 'bold', color: '#ffc107' }}>
                  {analytics.totalMembers}
                </div>
              </div>
            </div>

            {/* Individual Spending */}
            <div style={{
              backgroundColor: 'white',
              borderRadius: '10px',
              boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
              overflow: 'hidden',
              marginBottom: '30px'
            }}>
              <div style={{ padding: '20px', borderBottom: '1px solid #e0e0e0' }}>
                <h3 style={{ margin: 0, color: '#333' }}>💰 Individual Spending Summary</h3>
              </div>
              <div>
                {analytics.individualSpending.map((person, index) => (
                  <div key={index} style={{
                    padding: '20px',
                    borderBottom: index < analytics.individualSpending.length - 1 ? '1px solid #f0f0f0' : 'none',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center'
                  }}>
                    <div>
                      <h4 style={{ margin: '0 0 5px 0', color: '#333' }}>{person.name}</h4>
                      <p style={{ margin: 0, color: '#666', fontSize: '14px' }}>
                        Paid for {person.expenseCount} expenses
                      </p>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#28a745' }}>
                        ₹{person.totalPaid}
                      </div>
                      <div style={{ fontSize: '14px', color: '#666' }}>
                        Share: ₹{person.totalShare}
                      </div>
                      <div style={{ 
                        fontSize: '14px', 
                        fontWeight: 'bold',
                        color: person.balance >= 0 ? '#28a745' : '#dc3545' 
                      }}>
                        {person.balance >= 0 ? `+₹${person.balance}` : `-₹${Math.abs(person.balance)}`}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Category Wise Spending */}
            <div style={{
              backgroundColor: 'white',
              borderRadius: '10px',
              boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
              overflow: 'hidden'
            }}>
              <div style={{ padding: '20px', borderBottom: '1px solid #e0e0e0' }}>
                <h3 style={{ margin: 0, color: '#333' }}>📋 Category Wise Spending</h3>
              </div>
              <div>
                {analytics.categoryWiseSpending.map((category, index) => (
                  <div key={index} style={{
                    padding: '15px 20px',
                    borderBottom: index < analytics.categoryWiseSpending.length - 1 ? '1px solid #f0f0f0' : 'none',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center'
                  }}>
                    <div>
                      <h4 style={{ margin: '0 0 5px 0', color: '#333' }}>{category.category}</h4>
                      <p style={{ margin: 0, color: '#666', fontSize: '14px' }}>
                        {category.count} expenses
                      </p>
                    </div>
                    <div style={{ fontSize: '20px', fontWeight: 'bold', color: '#007bff' }}>
                      ₹{category.total}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ) : selectedGroupId ? (
          <div style={{
            backgroundColor: 'white',
            padding: '40px',
            borderRadius: '10px',
            boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
            textAlign: 'center'
          }}>
            <div style={{ fontSize: '48px', marginBottom: '20px' }}>📊</div>
            <h3 style={{ color: '#333', marginBottom: '10px' }}>No Data Available</h3>
            <p style={{ color: '#666' }}>Add some expenses to see analytics</p>
          </div>
        ) : (
          <div style={{
            backgroundColor: 'white',
            padding: '40px',
            borderRadius: '10px',
            boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
            textAlign: 'center'
          }}>
            <div style={{ fontSize: '48px', marginBottom: '20px' }}>📊</div>
            <h3 style={{ color: '#333', marginBottom: '10px' }}>Select a Group</h3>
            <p style={{ color: '#666' }}>Choose a group from the dropdown above to view analytics</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default Analytics;