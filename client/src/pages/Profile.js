import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

function Profile({ token, user, setUser }) {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [userStats, setUserStats] = useState({
    totalGroups: 0,
    totalExpenses: 0,
    totalAmount: 0,
    totalSettlements: 0
  });

  const [formData, setFormData] = useState({
    username: user?.username || '',
    email: user?.email || '',
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  const fetchUserStats = useCallback(async () => {
    try {
      const { buildUrl } = require('../utils/api');
      const response = await axios.get(buildUrl('/users/stats'), {
        headers: { Authorization: `Bearer ${token}` }
      });
      setUserStats(response.data);
    } catch (error) {
      console.error('Error fetching user stats:', error);
    }
  }, [token]);

  useEffect(() => {
    if (user) {
      setFormData({
        username: user.username || '',
        email: user.email || '',
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      });
      fetchUserStats();
    }
  }, [user, fetchUserStats]);

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    try {
      const { buildUrl } = require('../utils/api');
      const updateData = {
        username: formData.username,
        email: formData.email
      };

      // Add password fields only if user wants to change password
      if (formData.newPassword) {
        if (formData.newPassword !== formData.confirmPassword) {
          setMessage('❌ New passwords do not match');
          setLoading(false);
          return;
        }
        updateData.currentPassword = formData.currentPassword;
        updateData.newPassword = formData.newPassword;
      }

      const response = await axios.put(buildUrl('/users/profile'), updateData, {
        headers: { Authorization: `Bearer ${token}` }
      });

      setUser(response.data.user);
      setMessage('✅ Profile updated successfully!');
      setIsEditing(false);
      setFormData({
        ...formData,
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      });
    } catch (error) {
      setMessage('❌ Error updating profile: ' + (error.response?.data?.message || 'Unknown error'));
    }
    setLoading(false);
  };

  const handleDeleteAccount = async () => {
    if (window.confirm('Are you sure you want to delete your account? This action cannot be undone.')) {
      try {
        const { buildUrl } = require('../utils/api');
        await axios.delete(buildUrl('/users/profile'), {
          headers: { Authorization: `Bearer ${token}` }
        });
        
        // Clear local storage and redirect to login
        localStorage.removeItem('token');
        setMessage('Account deleted successfully');
        navigate('/login');
      } catch (error) {
        setMessage('❌ Error deleting account: ' + (error.response?.data?.message || 'Unknown error'));
      }
    }
  };

  return (
    <div className="min-h-screen" style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}>
      {/* Header */}
      <header className="nav-header">
        <div className="nav-container">
          <div className="page-title">
            <button onClick={() => navigate('/dashboard')} className="back-button">
              ← Back
            </button>
            <span className="page-title-icon">👤</span>
            <span className="page-title-text">Profile</span>
          </div>
        </div>
      </header>

      <main className="content-wrapper py-8">
        {/* Message */}
        {message && (
          <div className={`alert ${message.includes('Error') || message.includes('❌') ? 'alert-error' : 'alert-success'} animate-fadeIn`}>
            {message}
            <button 
              onClick={() => setMessage('')}
              className="btn-ghost btn-sm float-right"
            >
              ×
            </button>
          </div>
        )}

        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: '1fr 350px', 
          gap: '30px',
          '@media (max-width: 1024px)': {
            gridTemplateColumns: '1fr'
          }
        }}>
          {/* Profile Card */}
          <div>
            <div className="modern-card animate-fadeIn">
              <div className="modern-card-header">
                <div className="flex justify-between items-center">
                  <h3 className="text-xl font-bold text-primary m-0">👤 Profile Information</h3>
                  <button
                    onClick={() => setIsEditing(!isEditing)}
                    className={`btn ${isEditing ? 'btn-secondary' : 'btn-primary'} btn-sm`}
                  >
                    {isEditing ? 'Cancel' : 'Edit Profile'}
                  </button>
                </div>
              </div>
              <div className="modern-card-body">
                {!isEditing ? (
                  <div className="space-y-6">
                    {/* Profile Avatar */}
                    <div style={{ textAlign: 'center', marginBottom: '30px' }}>
                      <div style={{
                        width: '100px',
                        height: '100px',
                        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                        borderRadius: '50%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: 'white',
                        fontSize: '36px',
                        fontWeight: 'bold',
                        margin: '0 auto 20px auto',
                        boxShadow: '0 4px 15px rgba(102, 126, 234, 0.3)'
                      }}>
                        {user?.username?.charAt(0).toUpperCase() || 'U'}
                      </div>
                      <h2 style={{ 
                        fontSize: '28px', 
                        fontWeight: 'bold', 
                        color: '#333', 
                        margin: '0 0 8px 0' 
                      }}>
                        {user?.username || 'User'}
                      </h2>
                      <p style={{ 
                        color: '#666', 
                        fontSize: '16px', 
                        margin: '0',
                        wordBreak: 'break-word'
                      }}>
                        {user?.email || 'No email'}
                      </p>
                    </div>

                    {/* Profile Details */}
                    <div style={{ 
                      display: 'grid', 
                      gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', 
                      gap: '20px' 
                    }}>
                      <div style={{
                        background: 'rgba(255, 255, 255, 0.1)',
                        backdropFilter: 'blur(10px)',
                        padding: '20px',
                        borderRadius: '12px',
                        border: '1px solid rgba(255, 255, 255, 0.2)'
                      }}>
                        <label style={{ 
                          display: 'block', 
                          fontSize: '14px', 
                          color: '#666', 
                          marginBottom: '8px',
                          fontWeight: '500'
                        }}>
                          Username
                        </label>
                        <p style={{ 
                          color: '#333', 
                          fontWeight: '600', 
                          fontSize: '16px', 
                          margin: '0',
                          wordBreak: 'break-word'
                        }}>
                          {user?.username || 'Not set'}
                        </p>
                      </div>
                      <div style={{
                        background: 'rgba(255, 255, 255, 0.1)',
                        backdropFilter: 'blur(10px)',
                        padding: '20px',
                        borderRadius: '12px',
                        border: '1px solid rgba(255, 255, 255, 0.2)'
                      }}>
                        <label style={{ 
                          display: 'block', 
                          fontSize: '14px', 
                          color: '#666', 
                          marginBottom: '8px',
                          fontWeight: '500'
                        }}>
                          Email
                        </label>
                        <p style={{ 
                          color: '#333', 
                          fontWeight: '600', 
                          fontSize: '16px', 
                          margin: '0',
                          wordBreak: 'break-all',
                          lineHeight: '1.4'
                        }}>
                          {user?.email || 'Not set'}
                        </p>
                      </div>
                      <div style={{
                        background: 'rgba(255, 255, 255, 0.1)',
                        backdropFilter: 'blur(10px)',
                        padding: '20px',
                        borderRadius: '12px',
                        border: '1px solid rgba(255, 255, 255, 0.2)'
                      }}>
                        <label style={{ 
                          display: 'block', 
                          fontSize: '14px', 
                          color: '#666', 
                          marginBottom: '8px',
                          fontWeight: '500'
                        }}>
                          Member Since
                        </label>
                        <p style={{ 
                          color: '#333', 
                          fontWeight: '600', 
                          fontSize: '16px', 
                          margin: '0'
                        }}>
                          {user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'Unknown'}
                        </p>
                      </div>
                      <div style={{
                        background: 'rgba(255, 255, 255, 0.1)',
                        backdropFilter: 'blur(10px)',
                        padding: '20px',
                        borderRadius: '12px',
                        border: '1px solid rgba(255, 255, 255, 0.2)'
                      }}>
                        <label style={{ 
                          display: 'block', 
                          fontSize: '14px', 
                          color: '#666', 
                          marginBottom: '8px',
                          fontWeight: '500'
                        }}>
                          Account Status
                        </label>
                        <p style={{ 
                          color: '#28a745', 
                          fontWeight: '600', 
                          fontSize: '16px', 
                          margin: '0'
                        }}>
                          ✅ Active
                        </p>
                      </div>
                    </div>
                  </div>
                ) : (
                  <form onSubmit={handleUpdateProfile} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="form-group">
                        <label className="form-label">Username</label>
                        <input
                          type="text"
                          value={formData.username}
                          onChange={(e) => setFormData({...formData, username: e.target.value})}
                          className="form-input"
                          required
                        />
                      </div>
                      <div className="form-group">
                        <label className="form-label">Email</label>
                        <input
                          type="email"
                          value={formData.email}
                          onChange={(e) => setFormData({...formData, email: e.target.value})}
                          className="form-input"
                          required
                        />
                      </div>
                    </div>

                    {/* Password Change Section */}
                    <div className="border-t border-primary pt-6">
                      <h4 className="text-lg font-semibold text-primary mb-4">Change Password (Optional)</h4>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="form-group">
                          <label className="form-label">Current Password</label>
                          <input
                            type="password"
                            value={formData.currentPassword}
                            onChange={(e) => setFormData({...formData, currentPassword: e.target.value})}
                            className="form-input"
                            placeholder="Enter current password"
                          />
                        </div>
                        <div className="form-group">
                          <label className="form-label">New Password</label>
                          <input
                            type="password"
                            value={formData.newPassword}
                            onChange={(e) => setFormData({...formData, newPassword: e.target.value})}
                            className="form-input"
                            placeholder="Enter new password"
                          />
                        </div>
                        <div className="form-group">
                          <label className="form-label">Confirm New Password</label>
                          <input
                            type="password"
                            value={formData.confirmPassword}
                            onChange={(e) => setFormData({...formData, confirmPassword: e.target.value})}
                            className="form-input"
                            placeholder="Confirm new password"
                          />
                        </div>
                      </div>
                    </div>

                    <div className="flex gap-4">
                      <button 
                        type="submit" 
                        disabled={loading} 
                        className="btn btn-primary"
                      >
                        {loading ? (
                          <>
                            <div className="loading-spinner"></div>
                            Updating...
                          </>
                        ) : (
                          'Update Profile'
                        )}
                      </button>
                      <button
                        type="button"
                        onClick={() => setIsEditing(false)}
                        className="btn btn-secondary"
                      >
                        Cancel
                      </button>
                    </div>
                  </form>
                )}
              </div>
            </div>
          </div>

          {/* Stats Card */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div className="modern-card animate-fadeIn">
              <div className="modern-card-header">
                <h3 className="text-xl font-bold text-primary m-0">📊 Your Stats</h3>
              </div>
              <div className="modern-card-body p-0">
                <div className="space-y-4">
                  <div className="flex justify-between items-center p-4 border-b border-primary">
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">👥</span>
                      <span className="text-secondary">Groups</span>
                    </div>
                    <span className="text-xl font-bold text-primary">{userStats.totalGroups}</span>
                  </div>
                  <div className="flex justify-between items-center p-4 border-b border-primary">
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">💰</span>
                      <span className="text-secondary">Expenses</span>
                    </div>
                    <span className="text-xl font-bold text-primary">{userStats.totalExpenses}</span>
                  </div>
                  <div className="flex justify-between items-center p-4 border-b border-primary">
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">💵</span>
                      <span className="text-secondary">Total Amount</span>
                    </div>
                    <span className="text-xl font-bold text-green">₹{userStats.totalAmount}</span>
                  </div>
                  <div className="flex justify-between items-center p-4">
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">🧾</span>
                      <span className="text-secondary">Settlements</span>
                    </div>
                    <span className="text-xl font-bold text-primary">{userStats.totalSettlements}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Danger Zone */}
            <div className="modern-card animate-fadeIn border-red-200">
              <div className="modern-card-header bg-red-50">
                <h3 className="text-xl font-bold text-red-600 m-0">⚠️ Danger Zone</h3>
              </div>
              <div className="modern-card-body">
                <p className="text-secondary mb-4">
                  Once you delete your account, there is no going back. Please be certain.
                </p>
                <button
                  onClick={handleDeleteAccount}
                  className="btn btn-danger"
                >
                  Delete Account
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default Profile;