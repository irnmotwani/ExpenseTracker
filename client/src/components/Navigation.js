import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

function Navigation({ user, logout }) {
  const navigate = useNavigate();
  const location = useLocation();

  const navigationItems = [
    { name: "Dashboard", path: "/dashboard", icon: "🏠" },
    { name: "Groups", path: "/groups", icon: "👥" },
    { name: "Expenses", path: "/expenses", icon: "💰" },
    { name: "Analytics", path: "/analytics", icon: "📊" },
    { name: "Settlements", path: "/settlements", icon: "🧾" },
    { name: "Khata Book", path: "/personal-khata", icon: "📒" }
  ];

  const isActive = (path) => {
    return location.pathname === path;
  };

  const navStyle = {
    backgroundColor: 'white',
    padding: '15px 0',
    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
    marginBottom: '20px'
  };

  const containerStyle = {
    maxWidth: '1200px',
    margin: '0 auto',
    padding: '0 20px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center'
  };

  const logoStyle = {
    fontSize: '24px',
    fontWeight: 'bold',
    color: '#333',
    textDecoration: 'none',
    cursor: 'pointer'
  };

  const navItemsStyle = {
    display: 'flex',
    gap: '30px',
    alignItems: 'center'
  };

  const navItemStyle = {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    padding: '8px 16px',
    borderRadius: '6px',
    textDecoration: 'none',
    color: '#666',
    fontSize: '14px',
    fontWeight: '500',
    transition: 'all 0.2s',
    cursor: 'pointer',
    border: 'none',
    backgroundColor: 'transparent'
  };

  const activeNavItemStyle = {
    ...navItemStyle,
    backgroundColor: '#007bff',
    color: 'white'
  };

  const userSectionStyle = {
    display: 'flex',
    alignItems: 'center',
    gap: '15px'
  };

  const userInfoStyle = {
    color: '#666',
    fontSize: '14px'
  };

  const logoutButtonStyle = {
    padding: '8px 16px',
    backgroundColor: '#dc3545',
    color: 'white',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
    fontSize: '14px',
    fontWeight: '500'
  };

  return (
    <nav style={navStyle}>
      <div style={containerStyle}>
        {/* Logo */}
        <div 
          style={logoStyle}
          onClick={() => navigate('/dashboard')}
        >
          🏦 ExpenseFlow
        </div>

        {/* Navigation Items */}
        <div style={navItemsStyle}>
          {navigationItems.map((item) => (
            <button
              key={item.path}
              style={isActive(item.path) ? activeNavItemStyle : navItemStyle}
              onClick={() => navigate(item.path)}
              onMouseEnter={(e) => {
                if (!isActive(item.path)) {
                  e.target.style.backgroundColor = '#f8f9fa';
                  e.target.style.color = '#333';
                }
              }}
              onMouseLeave={(e) => {
                if (!isActive(item.path)) {
                  e.target.style.backgroundColor = 'transparent';
                  e.target.style.color = '#666';
                }
              }}
            >
              <span>{item.icon}</span>
              <span>{item.name}</span>
            </button>
          ))}
        </div>

        {/* User Section */}
        <div style={userSectionStyle}>
          <span style={userInfoStyle}>
            Welcome, {user?.username || 'User'}!
          </span>
          <button
            onClick={logout}
            style={logoutButtonStyle}
            onMouseEnter={(e) => {
              e.target.style.backgroundColor = '#c82333';
            }}
            onMouseLeave={(e) => {
              e.target.style.backgroundColor = '#dc3545';
            }}
          >
            Logout
          </button>
        </div>
      </div>
    </nav>
  );
}

export default Navigation;