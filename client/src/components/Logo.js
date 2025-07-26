import React from 'react';

function Logo({ size = 40, className = '', showText = true }) {
  const logoStyle = {
    width: `${size}px`,
    height: `${size}px`,
    objectFit: 'contain',
    filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.2))'
  };

  const fallbackStyle = {
    fontSize: `${size * 0.8}px`,
    display: 'none'
  };

  return (
    <div className={`logo-container ${className}`} style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
      <img 
        src="https://i.postimg.cc/RN0cXSjS/logo.png" 
        alt="ExpenseFlow Logo" 
        style={logoStyle}
        onError={(e) => {
          e.target.style.display = 'none';
          e.target.nextSibling.style.display = 'inline-block';
        }}
      />
      <span style={fallbackStyle}>💰</span>
      {showText && (
        <span style={{ 
          fontWeight: 'bold', 
          fontSize: `${size * 0.6}px`,
          color: 'inherit'
        }}>
          ExpenseFlow
        </span>
      )}
    </div>
  );
}

export default Logo;