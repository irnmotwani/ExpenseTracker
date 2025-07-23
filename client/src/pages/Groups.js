import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

function Groups({ token }) {
  const navigate = useNavigate();
  const [groups, setGroups] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [message, setMessage] = useState('');
  
  const [newGroup, setNewGroup] = useState({
    name: '',
    start_date: '',
    end_date: ''
  });

  const [addMemberForm, setAddMemberForm] = useState({
    groupId: '',
    email: ''
  });

  const fetchGroups = useCallback(async () => {
    setLoading(true);
    try {
      const { buildUrl, API_ENDPOINTS } = require('../utils/api');
      const response = await axios.get(buildUrl(API_ENDPOINTS.GROUPS.BASE), {
        headers: { Authorization: `Bearer ${token}` }
      });
      setGroups(response.data.groups || []);
    } catch (error) {
      setMessage('Error fetching groups: ' + (error.response?.data?.message || 'Unknown error'));
    }
    setLoading(false);
  }, [token]);

  useEffect(() => {
    fetchGroups();
  }, [fetchGroups]);

  const createGroup = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { buildUrl, API_ENDPOINTS } = require('../utils/api');
      await axios.post(buildUrl(API_ENDPOINTS.GROUPS.BASE), newGroup, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setMessage('Group created successfully!');
      setNewGroup({ name: '', start_date: '', end_date: '' });
      setShowCreateForm(false);
      fetchGroups();
    } catch (error) {
      setMessage('Error creating group: ' + (error.response?.data?.message || 'Unknown error'));
    }
    setLoading(false);
  };

  const addMember = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { buildUrl, API_ENDPOINTS } = require('../utils/api');
      await axios.post(buildUrl(API_ENDPOINTS.GROUPS.MEMBERS(addMemberForm.groupId)), 
        { email: addMemberForm.email }, 
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setMessage('Member added successfully!');
      setAddMemberForm({ groupId: '', email: '' });
      fetchGroups();
    } catch (error) {
      setMessage('Error adding member: ' + (error.response?.data?.message || 'Unknown error'));
    }
    setLoading(false);
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
            <span className="page-title-icon">👥</span>
            <span className="page-title-text">Groups</span>
          </div>
          <button
            onClick={() => setShowCreateForm(!showCreateForm)}
            className="btn btn-success"
          >
            + Create Group
          </button>
        </div>
      </header>

      <main className="content-wrapper py-8">
        
        {/* Message */}
        {message && (
          <div className={`alert ${message.includes('Error') ? 'alert-error' : 'alert-success'} animate-fadeIn`}>
            {message}
            <button 
              onClick={() => setMessage('')}
              className="btn-ghost btn-sm float-right"
            >
              ×
            </button>
          </div>
        )}

        {/* Create Group Form */}
        {showCreateForm && (
          <div className="modern-card animate-fadeIn mb-8">
            <div className="modern-card-header">
              <h3 className="text-xl font-bold text-primary m-0">✨ Create New Group</h3>
            </div>
            <div className="modern-card-body">
              <form onSubmit={createGroup}>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                  <div className="form-group">
                    <label className="form-label">Group Name</label>
                    <input
                      type="text"
                      placeholder="e.g., Trip to Goa"
                      value={newGroup.name}
                      onChange={(e) => setNewGroup({...newGroup, name: e.target.value})}
                      className="form-input"
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Start Date</label>
                    <input
                      type="date"
                      value={newGroup.start_date}
                      onChange={(e) => setNewGroup({...newGroup, start_date: e.target.value})}
                      className="form-input"
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">End Date</label>
                    <input
                      type="date"
                      value={newGroup.end_date}
                      onChange={(e) => setNewGroup({...newGroup, end_date: e.target.value})}
                      className="form-input"
                      required
                    />
                  </div>
                </div>
                <div className="flex gap-4">
                  <button type="submit" disabled={loading} className="btn btn-primary">
                    {loading ? (
                      <>
                        <div className="loading-spinner"></div>
                        Creating...
                      </>
                    ) : (
                      '+ Create Group'
                    )}
                  </button>
                  <button 
                    type="button" 
                    onClick={() => setShowCreateForm(false)}
                    className="btn btn-secondary"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Groups List */}
        <div className="modern-card animate-fadeIn">
          <div className="modern-card-header">
            <h3 className="text-xl font-bold text-primary m-0">📋 Your Groups</h3>
          </div>
          
          {loading ? (
            <div className="loading-state">
              <div className="loading-state-spinner"></div>
              <div className="loading-state-text">Loading groups...</div>
            </div>
          ) : groups.length === 0 ? (
            <div className="empty-state">
              <div className="empty-state-icon">👥</div>
              <h3 className="empty-state-title">No Groups Yet</h3>
              <p className="empty-state-description">Create your first group to get started!</p>
              <button 
                onClick={() => setShowCreateForm(true)}
                className="btn btn-primary"
              >
                + Create Your First Group
              </button>
            </div>
          ) : (
            <div className="modern-card-body p-0">
              {groups.map((group, index) => (
                <div 
                  key={group._id} 
                  className={`p-6 flex justify-between items-center transition hover:bg-secondary ${
                    index < groups.length - 1 ? 'border-b border-primary' : ''
                  }`}
                >
                  <div className="flex-1">
                    <h4 className="text-lg font-semibold text-primary mb-2">{group.name}</h4>
                    <div className="flex items-center gap-4 text-sm text-secondary">
                      <span>📅 {new Date(group.start_date).toLocaleDateString()} - {new Date(group.end_date).toLocaleDateString()}</span>
                      <span>👥 {group.members?.length || 0} members</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-xs bg-tertiary text-tertiary px-2 py-1 rounded">
                      ID: {group._id.slice(-6)}
                    </span>
                    <button
                      onClick={() => navigate('/expenses', { state: { groupId: group._id, groupName: group.name } })}
                      className="btn btn-success btn-sm"
                    >
                      View Expenses
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Add Member Section */}
        {groups.length > 0 && (
          <div className="modern-card animate-fadeIn mt-8">
            <div className="modern-card-header">
              <h3 className="text-xl font-bold text-primary m-0">➕ Add Member to Group</h3>
            </div>
            <div className="modern-card-body">
              <form onSubmit={addMember}>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-end">
                  <div className="form-group">
                    <label className="form-label">Select Group</label>
                    <select
                      value={addMemberForm.groupId}
                      onChange={(e) => setAddMemberForm({...addMemberForm, groupId: e.target.value})}
                      className="form-select"
                      required
                    >
                      <option value="">Choose a group...</option>
                      {groups.map(group => (
                        <option key={group._id} value={group._id}>{group.name}</option>
                      ))}
                    </select>
                  </div>
                  <div className="form-group">
                    <label className="form-label">Member Email</label>
                    <input
                      type="email"
                      placeholder="member@example.com"
                      value={addMemberForm.email}
                      onChange={(e) => setAddMemberForm({...addMemberForm, email: e.target.value})}
                      className="form-input"
                      required
                    />
                  </div>
                  <div className="form-group">
                    <button type="submit" disabled={loading} className="btn btn-primary w-full">
                      {loading ? (
                        <>
                          <div className="loading-spinner"></div>
                          Adding...
                        </>
                      ) : (
                        '+ Add Member'
                      )}
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

export default Groups;