import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

function PersonalKhataBook({ token }) {
  const navigate = useNavigate();
  const [customers, setCustomers] = useState([]);
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showAddForm, setShowAddForm] = useState(false);
  const [message, setMessage] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  const [newCustomer, setNewCustomer] = useState({
    name: '',
    phone: '',
    address: ''
  });

  const fetchCustomers = useCallback(async (search = '') => {
    setLoading(true);
    try {
      const params = search ? `?search=${encodeURIComponent(search)}` : '';
      const { buildUrl } = require('../utils/api');
      const response = await axios.get(buildUrl(`/personal-khata/customers${params}`), {
        headers: { Authorization: `Bearer ${token}` }
      });
      setCustomers(response.data);
    } catch (error) {
      setMessage('Error fetching customers: ' + (error.response?.data?.message || 'Unknown error'));
    }
    setLoading(false);
  }, [token]);

  const fetchSummary = useCallback(async () => {
    try {
      const { buildUrl } = require('../utils/api');
      const response = await axios.get(buildUrl('/personal-khata/summary'), {
        headers: { Authorization: `Bearer ${token}` }
      });
      setSummary(response.data);
    } catch (error) {
      setMessage('Error fetching summary: ' + (error.response?.data?.message || 'Unknown error'));
    }
  }, [token]);

  useEffect(() => {
    fetchCustomers();
    fetchSummary();
  }, [fetchCustomers, fetchSummary]);

  useEffect(() => {
    if (searchTerm) {
      fetchCustomers(searchTerm);
    } else {
      fetchCustomers();
    }
  }, [searchTerm, fetchCustomers]);

  const addCustomer = async (e) => {
    e.preventDefault();
    if (!newCustomer.name.trim()) {
      setMessage('Customer name is required');
      return;
    }

    setLoading(true);
    try {
      const { buildUrl } = require('../utils/api');
      await axios.post(buildUrl('/personal-khata/customers'), newCustomer, {
        headers: { Authorization: `Bearer ${token}` }
      });

      setMessage('✅ Customer added successfully!');
      setNewCustomer({ name: '', phone: '', address: '' });
      setShowAddForm(false);
      fetchCustomers();
      fetchSummary();
    } catch (error) {
      const errorMsg = error.response?.data?.message || error.message || 'Unknown error';
      setMessage(`❌ Error: ${errorMsg}`);
    }
    setLoading(false);
  };

  const getBalanceColor = (balance) => {
    if (balance > 0) return '#28a745'; // Green - customer owes money
    if (balance < 0) return '#dc3545'; // Red - I owe money to customer
    return '#6c757d'; // Gray - no outstanding amount
  };

  const getBalanceText = (balance) => {
    if (balance > 0) return `₹${balance}`;
    if (balance < 0) return `₹${Math.abs(balance)}`;
    return '₹0';
  };

  const getBalanceLabel = (balance) => {
    if (balance > 0) return 'Will receive';
    if (balance < 0) return 'Will pay';
    return 'Settled';
  };

  /**
   * Delete customer with confirmation
   * @param {string} customerId - Customer ID to delete
   * @param {string} customerName - Customer name for confirmation
   */
  const deleteCustomer = async (customerId, customerName) => {
    // Confirmation dialog
    const confirmDelete = window.confirm(
      `Are you sure you want to delete "${customerName}"?\n\n` +
      `This will permanently remove the customer and all their transaction history.\n` +
      `This action cannot be undone.`
    );

    if (!confirmDelete) {
      return; // User cancelled
    }

    setLoading(true);
    try {
      const { buildUrl } = require('../utils/api');
      await axios.delete(buildUrl(`/personal-khata/customers/${customerId}`), {
        headers: { Authorization: `Bearer ${token}` }
      });

      setMessage(`✅ Customer "${customerName}" deleted successfully!`);
      
      // Refresh data
      fetchCustomers();
      fetchSummary();
    } catch (error) {
      const errorMsg = error.response?.data?.message || error.message || 'Unknown error';
      setMessage(`❌ Error deleting customer: ${errorMsg}`);
    }
    setLoading(false);
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
            <h1 style={{ margin: 0, color: '#333' }}>📔 Personal Khata Book</h1>
          </div>
          <button
            onClick={() => setShowAddForm(!showAddForm)}
            style={{
              ...buttonStyle,
              backgroundColor: '#28a745'
            }}
          >
            + Add Customer
          </button>
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

        {/* Summary Cards */}
        {summary && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px', marginBottom: '30px' }}>
            <div style={{
              backgroundColor: 'white',
              padding: '20px',
              borderRadius: '10px',
              boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
              textAlign: 'center'
            }}>
              <h3 style={{ color: '#007bff', margin: '0 0 10px 0' }}>Total Customers</h3>
              <div style={{ fontSize: '32px', fontWeight: 'bold', color: '#007bff' }}>
                {summary.totalCustomers}
              </div>
            </div>

            <div style={{
              backgroundColor: 'white',
              padding: '20px',
              borderRadius: '10px',
              boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
              textAlign: 'center'
            }}>
              <h3 style={{ color: '#28a745', margin: '0 0 10px 0' }}>Total Receivable</h3>
              <div style={{ fontSize: '32px', fontWeight: 'bold', color: '#28a745' }}>
                ₹{summary.totalReceivable}
              </div>
            </div>

            <div style={{
              backgroundColor: 'white',
              padding: '20px',
              borderRadius: '10px',
              boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
              textAlign: 'center'
            }}>
              <h3 style={{ color: '#dc3545', margin: '0 0 10px 0' }}>Total Payable</h3>
              <div style={{ fontSize: '32px', fontWeight: 'bold', color: '#dc3545' }}>
                ₹{summary.totalPayable}
              </div>
            </div>

            <div style={{
              backgroundColor: 'white',
              padding: '20px',
              borderRadius: '10px',
              boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
              textAlign: 'center'
            }}>
              <h3 style={{ color: '#ffc107', margin: '0 0 10px 0' }}>Net Position</h3>
              <div style={{
                fontSize: '32px',
                fontWeight: 'bold',
                color: summary.netPosition >= 0 ? '#28a745' : '#dc3545'
              }}>
                {summary.netPosition >= 0 ? '+' : ''}₹{summary.netPosition}
              </div>
            </div>
          </div>
        )}

        {/* Add Customer Form */}
        {showAddForm && (
          <div style={{
            backgroundColor: 'white',
            padding: '30px',
            borderRadius: '10px',
            boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
            marginBottom: '30px'
          }}>
            <h3 style={{ marginBottom: '20px', color: '#333' }}>Add New Customer</h3>
            <form onSubmit={addCustomer}>
              <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 2fr', gap: '15px', marginBottom: '20px' }}>
                <div>
                  <label style={{ display: 'block', marginBottom: '5px', color: '#333' }}>Customer Name *</label>
                  <input
                    type="text"
                    placeholder="Enter customer name"
                    value={newCustomer.name}
                    onChange={(e) => setNewCustomer({ ...newCustomer, name: e.target.value })}
                    style={inputStyle}
                    required
                  />
                </div>
                <div>
                  <label style={{ display: 'block', marginBottom: '5px', color: '#333' }}>Phone Number</label>
                  <input
                    type="text"
                    placeholder="Phone number"
                    value={newCustomer.phone}
                    onChange={(e) => setNewCustomer({ ...newCustomer, phone: e.target.value })}
                    style={inputStyle}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', marginBottom: '5px', color: '#333' }}>Address</label>
                  <input
                    type="text"
                    placeholder="Customer address"
                    value={newCustomer.address}
                    onChange={(e) => setNewCustomer({ ...newCustomer, address: e.target.value })}
                    style={inputStyle}
                  />
                </div>
              </div>
              <div style={{ display: 'flex', gap: '10px' }}>
                <button type="submit" disabled={loading} style={buttonStyle}>
                  {loading ? 'Adding...' : 'Add Customer'}
                </button>
                <button
                  type="button"
                  onClick={() => setShowAddForm(false)}
                  style={{ ...buttonStyle, backgroundColor: '#6c757d' }}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Search */}
        <div style={{
          backgroundColor: 'white',
          padding: '20px',
          borderRadius: '10px',
          boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
          marginBottom: '30px'
        }}>
          <div style={{ display: 'flex', gap: '15px', alignItems: 'end' }}>
            <div style={{ flex: 1 }}>
              <label style={{ display: 'block', marginBottom: '5px', color: '#333' }}>Search Customers</label>
              <input
                type="text"
                placeholder="Search by name or phone number..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                style={inputStyle}
              />
            </div>
            <button
              onClick={() => setSearchTerm('')}
              style={{
                ...buttonStyle,
                backgroundColor: '#6c757d',
                marginBottom: '10px'
              }}
            >
              Clear
            </button>
          </div>
        </div>

        {/* Customer List */}
        <div style={{
          backgroundColor: 'white',
          borderRadius: '10px',
          boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
          overflow: 'hidden'
        }}>
          <div style={{ padding: '20px', borderBottom: '1px solid #e0e0e0' }}>
            <h3 style={{ margin: 0, color: '#333' }}>👥 Customers</h3>
            {searchTerm && (
              <p style={{ margin: '5px 0 0 0', color: '#666', fontSize: '14px' }}>
                Search results for "{searchTerm}"
              </p>
            )}
          </div>

          {loading ? (
            <div style={{ padding: '40px', textAlign: 'center', color: '#666' }}>
              Loading customers...
            </div>
          ) : customers.length === 0 ? (
            <div style={{ padding: '40px', textAlign: 'center', color: '#666' }}>
              {searchTerm ? 'No customers found matching your search.' : 'No customers yet. Add your first customer to get started!'}
            </div>
          ) : (
            <div>
              {customers.map((customer, index) => (
                <div
                  key={customer._id}
                  style={{
                    padding: '20px',
                    borderBottom: index < customers.length - 1 ? '1px solid #f0f0f0' : 'none',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    cursor: 'pointer',
                    transition: 'background-color 0.2s'
                  }}
                  onClick={() => navigate(`/personal-khata/customer/${customer._id}`)}
                  onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#f8f9fa'}
                  onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'white'}
                >
                  <div style={{ flex: 1 }}>
                    <h4 style={{ margin: '0 0 5px 0', color: '#333' }}>{customer.name}</h4>
                    <div style={{ display: 'flex', gap: '15px', fontSize: '14px', color: '#666' }}>
                      {customer.phone && <span>📞 {customer.phone}</span>}
                      {customer.address && <span>📍 {customer.address}</span>}
                    </div>
                  </div>
                  
                  <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                    {/* Balance Display */}
                    <div style={{ textAlign: 'right' }}>
                      <div style={{
                        fontSize: '20px',
                        fontWeight: 'bold',
                        color: getBalanceColor(customer.balance)
                      }}>
                        {getBalanceText(customer.balance)}
                      </div>
                      <div style={{ fontSize: '12px', color: '#666' }}>
                        {getBalanceLabel(customer.balance)}
                      </div>
                    </div>
                    
                    {/* Delete Button */}
                    <button
                      onClick={(e) => {
                        e.stopPropagation(); // Prevent navigation to customer details
                        deleteCustomer(customer._id, customer.name);
                      }}
                      style={{
                        padding: '8px 12px',
                        backgroundColor: '#dc3545',
                        color: 'white',
                        border: 'none',
                        borderRadius: '5px',
                        cursor: 'pointer',
                        fontSize: '12px',
                        transition: 'background-color 0.2s'
                      }}
                      onMouseEnter={(e) => e.target.style.backgroundColor = '#c82333'}
                      onMouseLeave={(e) => e.target.style.backgroundColor = '#dc3545'}
                      title="Delete Customer"
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

export default PersonalKhataBook;