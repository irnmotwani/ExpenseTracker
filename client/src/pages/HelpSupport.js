import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { openChatbot } from '../utils/chatbot';

function HelpSupport() {
  const navigate = useNavigate();
  const [activeSection, setActiveSection] = useState('getting-started');

  const faqData = {
    'getting-started': [
      {
        question: "How do I create my first expense group?",
        answer: "Go to the Groups page from your dashboard, click 'Create New Group', enter group details like name and description, and add members by their email addresses."
      },
      {
        question: "How do I add an expense to a group?",
        answer: "Navigate to the Expenses page, select your group, click 'Add Expense', fill in the amount, description, and select who paid and how to split the expense."
      },
      {
        question: "What is settlement tracking?",
        answer: "Settlement tracking shows who owes money to whom in your group and provides optimized suggestions to settle all debts with minimum transactions."
      }
    ],
    'settlements': [
      {
        question: "How do settlement suggestions work?",
        answer: "Our algorithm calculates the optimal way to settle all group debts with minimum transactions. For example, if A owes B ₹100 and B owes C ₹100, we suggest A pays C directly."
      },
      {
        question: "Can I record a partial settlement?",
        answer: "Yes! You can record any amount as a settlement. The system will automatically update the remaining balances and recalculate suggestions."
      },
      {
        question: "How do I delete a settlement?",
        answer: "Go to Settlement Tracking page, find the settlement in the history section, and click the delete button. This will restore the original balance."
      }
    ],
    'khatabook': [
      {
        question: "What is Khata Book?",
        answer: "Khata Book is a comprehensive transaction history that shows all expenses and settlements in chronological order, helping you track all financial activities."
      },
      {
        question: "Can I filter transactions by date?",
        answer: "Yes, you can use the date range picker to filter transactions and also search by description or participant names."
      },
      {
        question: "How is Personal Khata different from Group Khata?",
        answer: "Personal Khata is for individual expense tracking and customer management, while Group Khata shows shared expenses and settlements within groups."
      }
    ],
    'troubleshooting': [
      {
        question: "I can't see my group expenses",
        answer: "Make sure you're a member of the group and have proper permissions. Try refreshing the page or logging out and back in."
      },
      {
        question: "Settlement suggestions are not showing",
        answer: "This usually means all balances are settled or there are no outstanding amounts. Check if all expenses have been properly recorded."
      },
      {
        question: "I'm getting authentication errors",
        answer: "Your session might have expired. Try logging out and logging back in. If the problem persists, clear your browser cache."
      }
    ]
  };


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
          <h1 style={{ margin: 0, color: '#333' }}>❓ Help & Support</h1>
        </div>
      </div>

      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 20px' }}>

        {/* Quick Contact Cards */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
          gap: '20px',
          marginBottom: '40px'
        }}>
          <div 
            style={{
              backgroundColor: 'white',
              borderRadius: '10px',
              padding: '25px',
              boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
              borderLeft: '4px solid #3498db',
              transition: 'all 0.3s ease',
              cursor: 'pointer'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-3px)';
              e.currentTarget.style.boxShadow = '0 8px 25px rgba(52, 152, 219, 0.15)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = '0 2px 4px rgba(0, 0, 0, 0.1)';
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '15px', marginBottom: '15px' }}>
              <div style={{ fontSize: '32px' }}>📱</div>
              <div>
                <h3 style={{ margin: 0, color: '#3498db' }}>Phone Support</h3>
                <p style={{ margin: '5px 0 0 0', color: '#666', fontSize: '14px' }}>Call us for immediate assistance</p>
              </div>
            </div>
            <a
              href="tel:+917000270580"
              style={{
                display: 'block',
                backgroundColor: '#f8f9fa',
                padding: '10px',
                borderRadius: '5px',
                color: '#3498db',
                fontWeight: 'bold',
                textAlign: 'center',
                textDecoration: 'none'
              }}
            >
              +91 7000270580
            </a>
          </div>

          <div 
            style={{
              backgroundColor: 'white',
              borderRadius: '10px',
              padding: '25px',
              boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
              borderLeft: '4px solid #e74c3c',
              transition: 'all 0.3s ease',
              cursor: 'pointer'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-3px)';
              e.currentTarget.style.boxShadow = '0 8px 25px rgba(231, 76, 60, 0.15)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = '0 2px 4px rgba(0, 0, 0, 0.1)';
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '15px', marginBottom: '15px' }}>
              <div style={{ fontSize: '32px' }}>✉️</div>
              <div>
                <h3 style={{ margin: 0, color: '#e74c3c' }}>Email Support</h3>
                <p style={{ margin: '5px 0 0 0', color: '#666', fontSize: '14px' }}>Send us your queries via email</p>
              </div>
            </div>
            <a
              href="mailto:irnmotwanii@gmail.com"
              style={{
                display: 'block',
                backgroundColor: '#f8f9fa',
                padding: '10px',
                borderRadius: '5px',
                color: '#e74c3c',
                fontWeight: 'bold',
                textAlign: 'center',
                textDecoration: 'none'
              }}
            >
              irnmotwanii@gmail.com
            </a>
          </div>

          <div 
            style={{
              backgroundColor: 'white',
              borderRadius: '10px',
              padding: '25px',
              boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
              borderLeft: '4px solid #27ae60',
              cursor: 'pointer',
              transition: 'all 0.3s ease',
              position: 'relative',
              overflow: 'hidden'
            }}
            onClick={() => {
              openChatbot();
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-5px)';
              e.currentTarget.style.boxShadow = '0 8px 25px rgba(39, 174, 96, 0.2)';
              e.currentTarget.style.borderLeft = '4px solid #2ecc71';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = '0 2px 4px rgba(0, 0, 0, 0.1)';
              e.currentTarget.style.borderLeft = '4px solid #27ae60';
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '15px', marginBottom: '15px' }}>
              <div style={{ fontSize: '32px' }}>💬</div>
              <div>
                <h3 style={{ margin: 0, color: '#27ae60' }}>Live Chat</h3>
                <p style={{ margin: '5px 0 0 0', color: '#666', fontSize: '14px' }}>Chat with our AI support assistant</p>
              </div>
            </div>
            <div style={{
              backgroundColor: '#f8f9fa',
              padding: '10px',
              borderRadius: '5px',
              color: '#27ae60',
              fontWeight: 'bold',
              textAlign: 'center'
            }}>
              🤖 Start AI Chat - Available 24/7
            </div>
          </div>
        </div>

        {/* FAQ Section */}
        <div style={{
          backgroundColor: 'white',
          borderRadius: '10px',
          boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
          overflow: 'hidden'
        }}>
          <div style={{ padding: '30px 30px 20px 30px', borderBottom: '1px solid #e0e0e0' }}>
            <h2 style={{ margin: 0, color: '#2c3e50' }}>📚 Frequently Asked Questions</h2>
          </div>

          <div style={{ display: 'flex' }}>
            {/* Sidebar */}
            <div style={{
              width: '250px',
              backgroundColor: '#f8f9fa',
              padding: '20px',
              borderRight: '1px solid #e0e0e0'
            }}>
              {Object.keys(faqData).map((section) => (
                <button
                  key={section}
                  onClick={() => setActiveSection(section)}
                  style={{
                    width: '100%',
                    padding: '12px 15px',
                    marginBottom: '10px',
                    backgroundColor: activeSection === section ? '#3498db' : 'transparent',
                    color: activeSection === section ? 'white' : '#333',
                    border: 'none',
                    borderRadius: '5px',
                    cursor: 'pointer',
                    textAlign: 'left',
                    fontSize: '14px',
                    fontWeight: activeSection === section ? 'bold' : 'normal'
                  }}
                >
                  {section.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
                </button>
              ))}
            </div>

            {/* Content */}
            <div style={{ flex: 1, padding: '20px' }}>
              {faqData[activeSection].map((faq, index) => (
                <div key={index} style={{
                  marginBottom: '25px',
                  padding: '20px',
                  backgroundColor: '#f8f9fa',
                  borderRadius: '8px',
                  borderLeft: '4px solid #3498db'
                }}>
                  <h4 style={{
                    margin: '0 0 15px 0',
                    color: '#2c3e50',
                    fontSize: '16px'
                  }}>
                    Q: {faq.question}
                  </h4>
                  <p style={{
                    margin: 0,
                    color: '#555',
                    lineHeight: '1.6',
                    fontSize: '14px'
                  }}>
                    A: {faq.answer}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Feature Guide */}
        <div style={{
          backgroundColor: 'white',
          borderRadius: '10px',
          padding: '30px',
          marginTop: '30px',
          marginBottom: '30px',
          boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)'
        }}>
          <h2 style={{ color: '#2c3e50', marginBottom: '20px' }}>🚀 Quick Start Guide</h2>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '20px' }}>
            <div style={{ textAlign: 'center', padding: '20px' }}>
              <div style={{
                backgroundColor: '#3498db',
                color: 'white',
                width: '60px',
                height: '60px',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 15px auto',
                fontSize: '24px'
              }}>
                1
              </div>
              <h4 style={{ color: '#3498db', margin: '0 0 10px 0' }}>Create Groups</h4>
              <p style={{ color: '#666', fontSize: '14px' }}>Set up expense groups for trips, shared living, or any collaborative expenses</p>
            </div>

            <div style={{ textAlign: 'center', padding: '20px' }}>
              <div style={{
                backgroundColor: '#e74c3c',
                color: 'white',
                width: '60px',
                height: '60px',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 15px auto',
                fontSize: '24px'
              }}>
                2
              </div>
              <h4 style={{ color: '#e74c3c', margin: '0 0 10px 0' }}>Add Expenses</h4>
              <p style={{ color: '#666', fontSize: '14px' }}>Record expenses with details about who paid and how to split the cost</p>
            </div>

            <div style={{ textAlign: 'center', padding: '20px' }}>
              <div style={{
                backgroundColor: '#27ae60',
                color: 'white',
                width: '60px',
                height: '60px',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 15px auto',
                fontSize: '24px'
              }}>
                3
              </div>
              <h4 style={{ color: '#27ae60', margin: '0 0 10px 0' }}>Track Settlements</h4>
              <p style={{ color: '#666', fontSize: '14px' }}>View balances and get smart suggestions for settling debts efficiently</p>
            </div>

            <div style={{ textAlign: 'center', padding: '20px' }}>
              <div style={{
                backgroundColor: '#f39c12',
                color: 'white',
                width: '60px',
                height: '60px',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 15px auto',
                fontSize: '24px'
              }}>
                4
              </div>
              <h4 style={{ color: '#f39c12', margin: '0 0 10px 0' }}>Analyze & Review</h4>
              <p style={{ color: '#666', fontSize: '14px' }}>Use analytics and khata book to review spending patterns and history</p>
            </div>
          </div>
        </div>

        {/* Emergency Contact */}
        <div style={{
          backgroundColor: '#e74c3c',
          color: 'white',
          borderRadius: '10px',
          padding: '25px',
          textAlign: 'center',
          marginBottom: '30px'
        }}>
          <h3 style={{ margin: '0 0 15px 0' }}>🚨 Need Immediate Help?</h3>
          <p style={{ margin: '0 0 20px 0', opacity: 0.9 }}>
            For urgent issues or technical emergencies, contact us directly
          </p>
          <div style={{ display: 'flex', justifyContent: 'center', gap: '20px', flexWrap: 'wrap' }}>
            <a
              href="tel:+917000270580"
              style={{
                backgroundColor: 'white',
                color: '#e74c3c',
                padding: '12px 24px',
                borderRadius: '25px',
                textDecoration: 'none',
                fontWeight: 'bold',
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
              }}
            >
              📱 Call Now: +91 7000270580
            </a>
            <a
              href="mailto:irnmotwanii@gmail.com"
              style={{
                backgroundColor: 'white',
                color: '#e74c3c',
                padding: '12px 24px',
                borderRadius: '25px',
                textDecoration: 'none',
                fontWeight: 'bold',
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
              }}
            >
              ✉️ Email Support
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

export default HelpSupport;