import React from 'react';
import { useNavigate } from 'react-router-dom';
import { openChatbot } from '../utils/chatbot';

function AboutUs() {
  const navigate = useNavigate();

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f8f9fa' }}>
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
          alignItems: 'center',
          gap: '15px'
        }}>
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
            ← Back to Dashboard
          </button>
          <h1 style={{ margin: 0, color: '#333' }}>ℹ️ About ExpenseTracker</h1>
        </div>
      </div>

      <div style={{ maxWidth: '1000px', margin: '0 auto', padding: '0 20px' }}>
        
        {/* Mission Section */}
        <div style={{
          backgroundColor: 'white',
          borderRadius: '10px',
          padding: '30px',
          marginBottom: '30px',
          boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)'
        }}>
          <h2 style={{ color: '#2c3e50', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '10px' }}>
            🎯 Our Mission
          </h2>
          <p style={{ fontSize: '16px', lineHeight: '1.6', color: '#555', marginBottom: '15px' }}>
            ExpenseTracker is designed to simplify financial management for individuals and groups. 
            We believe that managing expenses shouldn't be complicated or time-consuming.
          </p>
          <p style={{ fontSize: '16px', lineHeight: '1.6', color: '#555' }}>
            Our goal is to provide a comprehensive, user-friendly platform that helps you track expenses, 
            manage settlements, and maintain clear financial records with ease.
          </p>
        </div>

        {/* Features Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
          gap: '20px',
          marginBottom: '30px'
        }}>
          
          <div style={{
            backgroundColor: 'white',
            borderRadius: '10px',
            padding: '25px',
            boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
            borderLeft: '4px solid #3498db'
          }}>
            <h3 style={{ color: '#3498db', marginBottom: '15px' }}>👥 Group Management</h3>
            <p style={{ color: '#666', lineHeight: '1.5' }}>
              Create and manage expense groups for trips, shared living, office expenses, 
              and any collaborative financial activities.
            </p>
          </div>

          <div style={{
            backgroundColor: 'white',
            borderRadius: '10px',
            padding: '25px',
            boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
            borderLeft: '4px solid #e74c3c'
          }}>
            <h3 style={{ color: '#e74c3c', marginBottom: '15px' }}>💰 Smart Settlements</h3>
            <p style={{ color: '#666', lineHeight: '1.5' }}>
              Automatically calculate who owes whom and get optimized settlement suggestions 
              to minimize the number of transactions.
            </p>
          </div>

          <div style={{
            backgroundColor: 'white',
            borderRadius: '10px',
            padding: '25px',
            boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
            borderLeft: '4px solid #27ae60'
          }}>
            <h3 style={{ color: '#27ae60', marginBottom: '15px' }}>📊 Analytics & Insights</h3>
            <p style={{ color: '#666', lineHeight: '1.5' }}>
              Get detailed analytics on your spending patterns, group expenses, 
              and financial trends with interactive charts and reports.
            </p>
          </div>

          <div style={{
            backgroundColor: 'white',
            borderRadius: '10px',
            padding: '25px',
            boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
            borderLeft: '4px solid #f39c12'
          }}>
            <h3 style={{ color: '#f39c12', marginBottom: '15px' }}>📚 Khata Book</h3>
            <p style={{ color: '#666', lineHeight: '1.5' }}>
              Maintain comprehensive transaction history with detailed records 
              of all expenses and settlements for easy reference.
            </p>
          </div>

          <div style={{
            backgroundColor: 'white',
            borderRadius: '10px',
            padding: '25px',
            boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
            borderLeft: '4px solid #9b59b6'
          }}>
            <h3 style={{ color: '#9b59b6', marginBottom: '15px' }}>👤 Personal Finance</h3>
            <p style={{ color: '#666', lineHeight: '1.5' }}>
              Track personal expenses, manage customer accounts, 
              and maintain individual financial records separately.
            </p>
          </div>

          <div style={{
            backgroundColor: 'white',
            borderRadius: '10px',
            padding: '25px',
            boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
            borderLeft: '4px solid #1abc9c'
          }}>
            <h3 style={{ color: '#1abc9c', marginBottom: '15px' }}>🔒 Secure & Reliable</h3>
            <p style={{ color: '#666', lineHeight: '1.5' }}>
              Your financial data is protected with industry-standard security measures 
              and reliable cloud infrastructure.
            </p>
          </div>
        </div>

        {/* Technology Section */}
        <div style={{
          backgroundColor: 'white',
          borderRadius: '10px',
          padding: '30px',
          marginBottom: '30px',
          boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)'
        }}>
          <h2 style={{ color: '#2c3e50', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '10px' }}>
            ⚡ Technology Stack
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px' }}>
            <div style={{ textAlign: 'center', padding: '20px' }}>
              <div style={{ fontSize: '48px', marginBottom: '10px' }}>⚛️</div>
              <h4 style={{ color: '#61dafb', margin: '0 0 10px 0' }}>React.js</h4>
              <p style={{ color: '#666', fontSize: '14px' }}>Modern frontend framework for responsive UI</p>
            </div>
            <div style={{ textAlign: 'center', padding: '20px' }}>
              <div style={{ fontSize: '48px', marginBottom: '10px' }}>🟢</div>
              <h4 style={{ color: '#68a063', margin: '0 0 10px 0' }}>Node.js</h4>
              <p style={{ color: '#666', fontSize: '14px' }}>Scalable backend server technology</p>
            </div>
            <div style={{ textAlign: 'center', padding: '20px' }}>
              <div style={{ fontSize: '48px', marginBottom: '10px' }}>🍃</div>
              <h4 style={{ color: '#4db33d', margin: '0 0 10px 0' }}>MongoDB</h4>
              <p style={{ color: '#666', fontSize: '14px' }}>Flexible NoSQL database solution</p>
            </div>
            <div style={{ textAlign: 'center', padding: '20px' }}>
              <div style={{ fontSize: '48px', marginBottom: '10px' }}>🔐</div>
              <h4 style={{ color: '#f39c12', margin: '0 0 10px 0' }}>JWT Auth</h4>
              <p style={{ color: '#666', fontSize: '14px' }}>Secure authentication system</p>
            </div>
          </div>
        </div>

        {/* Contact Section */}
        <div style={{
          backgroundColor: 'white',
          borderRadius: '10px',
          padding: '30px',
          marginBottom: '30px',
          boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)'
        }}>
          <h2 style={{ color: '#2c3e50', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '10px' }}>
            📞 Get in Touch
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '20px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
              <div style={{ 
                backgroundColor: '#3498db', 
                color: 'white', 
                width: '50px', 
                height: '50px', 
                borderRadius: '50%', 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center',
                fontSize: '20px'
              }}>
                📱
              </div>
              <div>
                <h4 style={{ margin: '0 0 5px 0', color: '#333' }}>Phone Support</h4>
                <a href="tel:+917000270580" style={{ color: '#3498db', textDecoration: 'none', fontSize: '16px' }}>
                  +91 7000270580
                </a>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
              <div style={{ 
                backgroundColor: '#e74c3c', 
                color: 'white', 
                width: '50px', 
                height: '50px', 
                borderRadius: '50%', 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center',
                fontSize: '20px'
              }}>
                ✉️
              </div>
              <div>
                <h4 style={{ margin: '0 0 5px 0', color: '#333' }}>Email Support</h4>
                <a href="mailto:irnmotwanii@gmail.com" style={{ color: '#e74c3c', textDecoration: 'none', fontSize: '16px' }}>
                  irnmotwanii@gmail.com
                </a>
              </div>
            </div>

            <div 
              style={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: '15px',
                cursor: 'pointer',
                transition: 'transform 0.2s ease'
              }}
              onClick={openChatbot}
              onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
              onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
            >
              <div style={{ 
                backgroundColor: '#27ae60', 
                color: 'white', 
                width: '50px', 
                height: '50px', 
                borderRadius: '50%', 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center',
                fontSize: '20px'
              }}>
                💬
              </div>
              <div>
                <h4 style={{ margin: '0 0 5px 0', color: '#333' }}>Live Chat</h4>
                <span style={{ color: '#27ae60', fontSize: '16px' }}>24/7 AI Support Available</span>
              </div>
            </div>
          </div>
        </div>

        {/* Version Info */}
        <div style={{
          backgroundColor: '#2c3e50',
          color: 'white',
          borderRadius: '10px',
          padding: '20px',
          textAlign: 'center',
          marginBottom: '30px'
        }}>
          <h3 style={{ margin: '0 0 10px 0' }}>🚀 Version Information</h3>
          <p style={{ margin: '0', color: '#bdc3c7' }}>
            ExpenseTracker v1.0.0 | Last Updated: {new Date().toLocaleDateString()} | 
            <span style={{ color: '#27ae60', marginLeft: '10px' }}>✅ All Systems Operational</span>
          </p>
        </div>
      </div>
    </div>
  );
}

export default AboutUs;