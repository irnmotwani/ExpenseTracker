import React from 'react';
import { useNavigate } from 'react-router-dom';
import PageHeader from '../components/PageHeader';

function Dashboard({ user, logout }) {
  const navigate = useNavigate();

  return (
    <div style={{ minHeight: '100vh', background: '#f8f9fa' }}>
      <PageHeader 
        title="ExpenseFlow"
        icon="🏦"
        user={user}
        logout={logout}
        showUserInfo={true}
      />

      <main style={{ maxWidth: '1200px', margin: '0 auto', padding: '40px 20px' }}>
        <div style={{ 
          textAlign: 'center', 
          marginBottom: '50px',
          padding: '40px 20px',
          backgroundColor: 'white',
          borderRadius: '15px',
          boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
        }}>
          <h1 style={{ 
            fontSize: '2.5rem', 
            fontWeight: 'bold', 
            color: '#333',
            margin: '0 0 15px 0'
          }}>
            Welcome back, {user?.username || 'User'}! 👋
          </h1>
          <p style={{ 
            fontSize: '1.2rem', 
            color: '#666',
            maxWidth: '600px',
            margin: '15px auto 0 auto',
            lineHeight: '1.6'
          }}>
            Ready to manage your expenses? Split bills, track spending, and settle up with friends effortlessly.
          </p>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
          gap: '30px',
          marginBottom: '50px'
        }}>
          <div style={{
            backgroundColor: 'white',
            borderRadius: '15px',
            padding: '30px',
            boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
            cursor: 'pointer',
            transition: 'transform 0.2s',
            border: '1px solid #e0e0e0',
            height: '200px',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center'
          }}
          onClick={() => navigate('/groups')}>
            <div style={{ fontSize: '48px', marginBottom: '20px', textAlign: 'center' }}>👥</div>
            <h3 style={{ fontSize: '20px', fontWeight: 'bold', color: '#333', marginBottom: '15px', textAlign: 'center' }}>
              Manage Groups
            </h3>
            <p style={{ color: '#666', textAlign: 'center', lineHeight: '1.5', margin: 0 }}>
              Create trip groups, add members, and organize your expenses
            </p>
          </div>

          <div style={{
            backgroundColor: 'white',
            borderRadius: '15px',
            padding: '30px',
            boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
            cursor: 'pointer',
            transition: 'transform 0.2s',
            border: '1px solid #e0e0e0',
            height: '200px',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center'
          }}
          onClick={() => navigate('/expenses')}>
            <div style={{ fontSize: '48px', marginBottom: '20px', textAlign: 'center' }}>💰</div>
            <h3 style={{ fontSize: '20px', fontWeight: 'bold', color: '#333', marginBottom: '15px', textAlign: 'center' }}>
              Track Expenses
            </h3>
            <p style={{ color: '#666', textAlign: 'center', lineHeight: '1.5', margin: 0 }}>
              Add expenses, split bills, and see who owes what
            </p>
          </div>

          <div style={{
            backgroundColor: 'white',
            borderRadius: '15px',
            padding: '30px',
            boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
            cursor: 'pointer',
            transition: 'transform 0.2s',
            border: '1px solid #e0e0e0',
            height: '200px',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center'
          }}
          onClick={() => navigate('/analytics')}>
            <div style={{ fontSize: '48px', marginBottom: '20px', textAlign: 'center' }}>📊</div>
            <h3 style={{ fontSize: '20px', fontWeight: 'bold', color: '#333', marginBottom: '15px', textAlign: 'center' }}>
              View Analytics
            </h3>
            <p style={{ color: '#666', textAlign: 'center', lineHeight: '1.5', margin: 0 }}>
              See spending patterns and category breakdowns
            </p>
          </div>

          <div style={{
            backgroundColor: 'white',
            borderRadius: '15px',
            padding: '30px',
            boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
            cursor: 'pointer',
            transition: 'transform 0.2s',
            border: '1px solid #e0e0e0',
            height: '200px',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center'
          }}
          onClick={() => navigate('/settlements')}>
            <div style={{ fontSize: '48px', marginBottom: '20px', textAlign: 'center' }}>🧾</div>
            <h3 style={{ fontSize: '20px', fontWeight: 'bold', color: '#333', marginBottom: '15px', textAlign: 'center' }}>
              Settlement Tracking
            </h3>
            <p style={{ color: '#666', textAlign: 'center', lineHeight: '1.5', margin: 0 }}>
              Track who owes what and record payments
            </p>
          </div>

          <div style={{
            backgroundColor: 'white',
            borderRadius: '15px',
            padding: '30px',
            boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
            cursor: 'pointer',
            transition: 'transform 0.2s',
            border: '1px solid #e0e0e0',
            height: '200px',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center'
          }}
          onClick={() => navigate('/khatabook')}>
            <div style={{ fontSize: '48px', marginBottom: '20px', textAlign: 'center' }}>📚</div>
            <h3 style={{ fontSize: '20px', fontWeight: 'bold', color: '#333', marginBottom: '15px', textAlign: 'center' }}>
              Khata Book
            </h3>
            <p style={{ color: '#666', textAlign: 'center', lineHeight: '1.5', margin: 0 }}>
              View complete transaction history
            </p>
          </div>

          <div style={{
            backgroundColor: 'white',
            borderRadius: '15px',
            padding: '30px',
            boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
            cursor: 'pointer',
            transition: 'transform 0.2s',
            border: '1px solid #e0e0e0',
            height: '200px',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center'
          }}
          onClick={() => navigate('/personal-khata')}>
            <div style={{ fontSize: '48px', marginBottom: '20px', textAlign: 'center' }}>📔</div>
            <h3 style={{ fontSize: '20px', fontWeight: 'bold', color: '#333', marginBottom: '15px', textAlign: 'center' }}>
              Personal Khata
            </h3>
            <p style={{ color: '#666', textAlign: 'center', lineHeight: '1.5', margin: 0 }}>
              Manage personal customers
            </p>
          </div>
        </div>

        {/* Quick Start Guide */}
        <div style={{
          backgroundColor: 'white',
          borderRadius: '15px',
          padding: '30px',
          boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
          marginBottom: '30px'
        }}>
          <h3 style={{ 
            fontSize: '24px', 
            fontWeight: 'bold', 
            color: '#333', 
            margin: '0 0 30px 0',
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            borderBottom: '1px solid #e0e0e0',
            paddingBottom: '20px'
          }}>
            🚀 Quick Start Guide
          </h3>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
            gap: '25px'
          }}>
            <div 
              style={{
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                color: 'white',
                padding: '25px',
                borderRadius: '12px',
                textAlign: 'center',
                cursor: 'pointer',
                transition: 'transform 0.2s',
                boxShadow: '0 4px 15px rgba(102, 126, 234, 0.3)'
              }}
              onClick={() => navigate('/groups')}
              onMouseEnter={(e) => e.target.style.transform = 'translateY(-5px)'}
              onMouseLeave={(e) => e.target.style.transform = 'translateY(0)'}
            >
              <div style={{ fontSize: '48px', marginBottom: '15px' }}>👥</div>
              <h4 style={{ fontWeight: '600', marginBottom: '10px', fontSize: '16px', margin: '0 0 10px 0' }}>
                1. Create a Group
              </h4>
              <p style={{ fontSize: '14px', margin: 0, lineHeight: '1.4', opacity: 0.9 }}>
                Start by creating a trip or event group
              </p>
            </div>
            
            <div 
              style={{
                background: 'linear-gradient(135deg, #28a745 0%, #20c997 100%)',
                color: 'white',
                padding: '25px',
                borderRadius: '12px',
                textAlign: 'center',
                cursor: 'pointer',
                transition: 'transform 0.2s',
                boxShadow: '0 4px 15px rgba(40, 167, 69, 0.3)'
              }}
              onClick={() => navigate('/groups')}
              onMouseEnter={(e) => e.target.style.transform = 'translateY(-5px)'}
              onMouseLeave={(e) => e.target.style.transform = 'translateY(0)'}
            >
              <div style={{ fontSize: '48px', marginBottom: '15px' }}>✉️</div>
              <h4 style={{ fontWeight: '600', marginBottom: '10px', fontSize: '16px', margin: '0 0 10px 0' }}>
                2. Add Members
              </h4>
              <p style={{ fontSize: '14px', margin: 0, lineHeight: '1.4', opacity: 0.9 }}>
                Invite friends by their email addresses
              </p>
            </div>
            
            <div 
              style={{
                background: 'linear-gradient(135deg, #ffc107 0%, #fd7e14 100%)',
                color: 'white',
                padding: '25px',
                borderRadius: '12px',
                textAlign: 'center',
                cursor: 'pointer',
                transition: 'transform 0.2s',
                boxShadow: '0 4px 15px rgba(255, 193, 7, 0.3)'
              }}
              onClick={() => navigate('/expenses')}
              onMouseEnter={(e) => e.target.style.transform = 'translateY(-5px)'}
              onMouseLeave={(e) => e.target.style.transform = 'translateY(0)'}
            >
              <div style={{ fontSize: '48px', marginBottom: '15px' }}>💰</div>
              <h4 style={{ fontWeight: '600', marginBottom: '10px', fontSize: '16px', margin: '0 0 10px 0' }}>
                3. Add Expenses
              </h4>
              <p style={{ fontSize: '14px', margin: 0, lineHeight: '1.4', opacity: 0.9 }}>
                Record expenses and split automatically
              </p>
            </div>
            
            <div 
              style={{
                background: 'linear-gradient(135deg, #6f42c1 0%, #e83e8c 100%)',
                color: 'white',
                padding: '25px',
                borderRadius: '12px',
                textAlign: 'center',
                cursor: 'pointer',
                transition: 'transform 0.2s',
                boxShadow: '0 4px 15px rgba(111, 66, 193, 0.3)'
              }}
              onClick={() => navigate('/settlements')}
              onMouseEnter={(e) => e.target.style.transform = 'translateY(-5px)'}
              onMouseLeave={(e) => e.target.style.transform = 'translateY(0)'}
            >
              <div style={{ fontSize: '48px', marginBottom: '15px' }}>🧾</div>
              <h4 style={{ fontWeight: '600', marginBottom: '10px', fontSize: '16px', margin: '0 0 10px 0' }}>
                4. Settle Up
              </h4>
              <p style={{ fontSize: '14px', margin: 0, lineHeight: '1.4', opacity: 0.9 }}>
                See who owes what and settle balances
              </p>
            </div>
          </div>
        </div>

        {/* Help Section */}
        <div style={{
          backgroundColor: 'white',
          borderRadius: '15px',
          padding: '30px',
          boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
          marginBottom: '30px'
        }}>
          <h3 style={{ 
            fontSize: '24px', 
            fontWeight: 'bold', 
            color: '#333', 
            margin: '0 0 30px 0',
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            borderBottom: '1px solid #e0e0e0',
            paddingBottom: '20px'
          }}>
            💬 Need Help?
          </h3>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
            gap: '25px'
          }}>
            <div 
              style={{
                background: 'rgba(0, 123, 255, 0.1)',
                border: '2px solid #007bff',
                padding: '25px',
                borderRadius: '12px',
                textAlign: 'center',
                cursor: 'pointer',
                transition: 'transform 0.2s'
              }}
              onClick={() => {
                const chatButton = document.querySelector('[style*="position: fixed"][style*="bottom: 20px"]');
                if (chatButton) chatButton.click();
              }}
              onMouseEnter={(e) => e.target.style.transform = 'translateY(-3px)'}
              onMouseLeave={(e) => e.target.style.transform = 'translateY(0)'}
            >
              <div style={{ fontSize: '48px', marginBottom: '15px' }}>🤖</div>
              <h4 style={{ color: '#007bff', fontWeight: '600', marginBottom: '10px', fontSize: '16px', margin: '0 0 10px 0' }}>
                AI Chat Support
              </h4>
              <p style={{ fontSize: '14px', color: '#666', margin: 0, lineHeight: '1.4' }}>
                Get instant help 24/7 with our AI assistant
              </p>
            </div>
            
            <div 
              style={{
                background: 'rgba(40, 167, 69, 0.1)',
                border: '2px solid #28a745',
                padding: '25px',
                borderRadius: '12px',
                textAlign: 'center',
                cursor: 'pointer',
                transition: 'transform 0.2s'
              }}
              onClick={() => navigate('/help')}
              onMouseEnter={(e) => e.target.style.transform = 'translateY(-3px)'}
              onMouseLeave={(e) => e.target.style.transform = 'translateY(0)'}
            >
              <div style={{ fontSize: '48px', marginBottom: '15px' }}>❓</div>
              <h4 style={{ color: '#28a745', fontWeight: '600', marginBottom: '10px', fontSize: '16px', margin: '0 0 10px 0' }}>
                Help Center
              </h4>
              <p style={{ fontSize: '14px', color: '#666', margin: 0, lineHeight: '1.4' }}>
                Browse FAQs and detailed guides
              </p>
            </div>
            
            <div style={{
              background: 'rgba(255, 193, 7, 0.1)',
              border: '2px solid #ffc107',
              padding: '25px',
              borderRadius: '12px',
              textAlign: 'center'
            }}>
              <div style={{ fontSize: '48px', marginBottom: '15px' }}>📞</div>
              <h4 style={{ color: '#ffc107', fontWeight: '600', marginBottom: '10px', fontSize: '16px', margin: '0 0 10px 0' }}>
                Direct Support
              </h4>
              <p style={{ fontSize: '14px', color: '#666', margin: '0 0 15px 0', lineHeight: '1.4' }}>
                Call us for immediate assistance
              </p>
              <a 
                href="tel:+917000270580" 
                style={{ 
                  color: '#007bff', 
                  fontWeight: '600', 
                  fontSize: '14px', 
                  textDecoration: 'none' 
                }}
              >
                +91 7000270580
              </a>
            </div>
          </div>
        </div>

      </main>
    </div>
  );
}

export default Dashboard;