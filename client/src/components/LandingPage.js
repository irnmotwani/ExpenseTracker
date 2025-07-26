import React from 'react';

function LandingPage({ onGetStarted }) {
  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '20px'
    }}>
      <div style={{
        maxWidth: '1200px',
        width: '100%',
        textAlign: 'center',
        color: 'white'
      }}>
        {/* Hero Section */}
        <div style={{ marginBottom: '60px' }}>
          <h1 style={{
            fontSize: '4rem',
            fontWeight: 'bold',
            marginBottom: '20px',
            textShadow: '2px 2px 4px rgba(0,0,0,0.3)'
          }}>
            💰 ExpenseFlow
          </h1>
          <h2 style={{
            fontSize: '2rem',
            fontWeight: '300',
            marginBottom: '30px',
            opacity: 0.9
          }}>
            Smart Expense Tracking for Modern Teams
          </h2>
          <p style={{
            fontSize: '1.2rem',
            maxWidth: '600px',
            margin: '0 auto 40px auto',
            lineHeight: '1.6',
            opacity: 0.8
          }}>
            Track expenses, split bills, manage group finances, and analyze spending patterns 
            with our intuitive expense management platform.
          </p>
          <button
            onClick={onGetStarted}
            style={{
              padding: '15px 40px',
              fontSize: '1.1rem',
              fontWeight: 'bold',
              background: 'rgba(255,255,255,0.2)',
              color: 'white',
              border: '2px solid rgba(255,255,255,0.3)',
              borderRadius: '50px',
              cursor: 'pointer',
              transition: 'all 0.3s ease',
              backdropFilter: 'blur(10px)'
            }}
            onMouseOver={(e) => {
              e.target.style.background = 'rgba(255,255,255,0.3)';
              e.target.style.transform = 'translateY(-2px)';
            }}
            onMouseOut={(e) => {
              e.target.style.background = 'rgba(255,255,255,0.2)';
              e.target.style.transform = 'translateY(0)';
            }}
          >
            Get Started Free →
          </button>
        </div>

        {/* Features Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
          gap: '30px',
          marginTop: '80px'
        }}>
          <div style={{
            background: 'rgba(255,255,255,0.1)',
            padding: '30px',
            borderRadius: '15px',
            backdropFilter: 'blur(10px)'
          }}>
            <div style={{ fontSize: '3rem', marginBottom: '15px' }}>👥</div>
            <h3 style={{ fontSize: '1.5rem', marginBottom: '15px' }}>Group Expenses</h3>
            <p style={{ opacity: 0.8, lineHeight: '1.5' }}>
              Create groups, add members, and track shared expenses effortlessly
            </p>
          </div>
          
          <div style={{
            background: 'rgba(255,255,255,0.1)',
            padding: '30px',
            borderRadius: '15px',
            backdropFilter: 'blur(10px)'
          }}>
            <div style={{ fontSize: '3rem', marginBottom: '15px' }}>🧾</div>
            <h3 style={{ fontSize: '1.5rem', marginBottom: '15px' }}>Smart Splitting</h3>
            <p style={{ opacity: 0.8, lineHeight: '1.5' }}>
              Automatically split bills and calculate who owes what to whom
            </p>
          </div>
          
          <div style={{
            background: 'rgba(255,255,255,0.1)',
            padding: '30px',
            borderRadius: '15px',
            backdropFilter: 'blur(10px)'
          }}>
            <div style={{ fontSize: '3rem', marginBottom: '15px' }}>📊</div>
            <h3 style={{ fontSize: '1.5rem', marginBottom: '15px' }}>Analytics</h3>
            <p style={{ opacity: 0.8, lineHeight: '1.5' }}>
              Visualize spending patterns with detailed charts and reports
            </p>
          </div>
        </div>

        {/* SEO Keywords Section */}
        <div style={{
          marginTop: '80px',
          padding: '40px',
          background: 'rgba(255,255,255,0.05)',
          borderRadius: '15px',
          backdropFilter: 'blur(10px)'
        }}>
          <h3 style={{ fontSize: '1.8rem', marginBottom: '20px' }}>
            The Complete Expense Management Solution
          </h3>
          <p style={{ 
            fontSize: '1rem', 
            opacity: 0.8, 
            lineHeight: '1.6',
            maxWidth: '800px',
            margin: '0 auto'
          }}>
            ExpenseFlow is your go-to expense tracker and bill splitter app. Whether you're managing 
            personal finances, tracking group expenses for trips, or splitting bills with roommates, 
            our platform makes money management simple and efficient. Join thousands of users who 
            trust ExpenseFlow for their expense tracking needs.
          </p>
        </div>
      </div>
    </div>
  );
}

export default LandingPage;