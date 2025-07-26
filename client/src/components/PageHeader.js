import React from 'react';
import { useNavigate } from 'react-router-dom';

function PageHeader({
  title,
  icon,
  user,
  logout,
  showBackButton = false,
  backPath = '/dashboard',
  showUserInfo = false,
  rightContent = null
}) {
  const navigate = useNavigate();

  return (
    <header style={{
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
        {/* Left side - Title and back button */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
          {showBackButton && (
            <button
              onClick={() => navigate(backPath)}
              style={{
                padding: '8px 12px',
                backgroundColor: '#6c757d',
                color: 'white',
                border: 'none',
                borderRadius: '5px',
                cursor: 'pointer',
                fontSize: '14px'
              }}
            >
              ← Back
            </button>
          )}
          <h1 style={{ margin: 0, color: '#333', display: 'flex', alignItems: 'center', gap: '10px' }}>
            {icon && <span style={{ fontSize: '24px' }}>{icon}</span>}
            {typeof title === 'string' ? title : <div>{title}</div>}
          </h1>
        </div>

        {/* Right side - User info or custom content */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
          {rightContent}

          {showUserInfo && user && (
            <>
              <span style={{ color: '#666', fontSize: '16px' }}>
                Welcome, {user.username || 'User'}!
              </span>
              <button
                onClick={() => navigate('/profile')}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '5px',
                  padding: '8px 12px',
                  backgroundColor: '#667eea',
                  color: 'white',
                  border: 'none',
                  borderRadius: '5px',
                  cursor: 'pointer',
                  fontSize: '14px',
                  fontWeight: '500',
                  transition: 'background-color 0.2s'
                }}
                onMouseEnter={(e) => e.target.style.backgroundColor = '#5a6fd8'}
                onMouseLeave={(e) => e.target.style.backgroundColor = '#667eea'}
              >
                👤 Profile
              </button>
              <button
                onClick={logout}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '5px',
                  padding: '8px 12px',
                  backgroundColor: '#dc3545',
                  color: 'white',
                  border: 'none',
                  borderRadius: '5px',
                  cursor: 'pointer',
                  fontSize: '14px',
                  fontWeight: '500',
                  transition: 'background-color 0.2s'
                }}
                onMouseEnter={(e) => e.target.style.backgroundColor = '#c82333'}
                onMouseLeave={(e) => e.target.style.backgroundColor = '#dc3545'}
              >
                🚪 Logout
              </button>
            </>
          )}
        </div>
      </div>
    </header>
  );
}

export default PageHeader;