import React from 'react';
import { useNavigate } from 'react-router-dom';
import { openChatbot } from '../utils/chatbot';

function Footer() {
  const currentYear = new Date().getFullYear();
  const navigate = useNavigate();

  return (
    <footer style={{
      backgroundColor: '#2c3e50',
      color: 'white',
      padding: '30px 0 15px 0',
      marginTop: '40px'
    }}>
      <div style={{
        maxWidth: '1200px',
        margin: '0 auto',
        padding: '0 20px'
      }}>
        {/* Main Footer Content */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          gap: '30px',
          marginBottom: '25px'
        }}>
          
          {/* About Section */}
          <div>
            <h3 style={{ 
              color: '#3498db', 
              marginBottom: '12px',
              fontSize: '16px',
              fontWeight: 'bold'
            }}>
              💰 ExpenseTracker
            </h3>
            <p style={{ 
              lineHeight: '1.5', 
              color: '#bdc3c7',
              fontSize: '13px',
              margin: 0
            }}>
              Smart expense management for individuals and groups. 
              Track expenses, manage settlements, and maintain financial records efficiently.
            </p>
          </div>

          {/* Contact Section */}
          <div>
            <h4 style={{ 
              color: '#27ae60', 
              marginBottom: '12px',
              fontSize: '14px',
              fontWeight: 'bold'
            }}>
              📞 Contact Us
            </h4>
            <div style={{ color: '#bdc3c7', fontSize: '13px' }}>
              <div style={{ marginBottom: '6px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <span>📱</span>
                <a href="tel:+917000270580" style={{ color: '#3498db', textDecoration: 'none' }}>
                  +91 7000270580
                </a>
              </div>
              <div style={{ marginBottom: '6px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <span>✉️</span>
                <a href="mailto:irnmotwanii@gmail.com" style={{ color: '#3498db', textDecoration: 'none' }}>
                  irnmotwanii@gmail.com
                </a>
              </div>
              <div 
                style={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: '6px',
                  cursor: 'pointer',
                  transition: 'color 0.3s ease'
                }}
                onClick={openChatbot}
                onMouseEnter={(e) => e.target.style.color = '#3498db'}
                onMouseLeave={(e) => e.target.style.color = '#bdc3c7'}
              >
                <span>💬</span>
                <span>24/7 AI Chat Support</span>
              </div>
            </div>
          </div>

          {/* Quick Links Section */}
          <div>
            <h4 style={{ 
              color: '#f39c12', 
              marginBottom: '12px',
              fontSize: '14px',
              fontWeight: 'bold'
            }}>
              🔗 Quick Links
            </h4>
            <div style={{ 
              display: 'flex',
              flexDirection: 'column',
              gap: '6px',
              color: '#bdc3c7',
              fontSize: '13px'
            }}>
              <button
                onClick={() => navigate('/about')}
                style={{
                  background: 'none',
                  border: 'none',
                  color: '#3498db',
                  cursor: 'pointer',
                  textAlign: 'left',
                  padding: 0,
                  fontSize: '13px'
                }}
              >
                ℹ️ About Us
              </button>
              <button
                onClick={() => navigate('/help')}
                style={{
                  background: 'none',
                  border: 'none',
                  color: '#3498db',
                  cursor: 'pointer',
                  textAlign: 'left',
                  padding: 0,
                  fontSize: '13px'
                }}
              >
                ❓ Help & Support
              </button>
              <a href="mailto:irnmotwanii@gmail.com" style={{ color: '#3498db', textDecoration: 'none' }}>
                📋 Report Issues
              </a>
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div style={{
          borderTop: '1px solid #34495e',
          paddingTop: '15px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '15px'
        }}>
          
          {/* Copyright */}
          <div style={{ color: '#95a5a6', fontSize: '12px' }}>
            © {currentYear} ExpenseTracker. All rights reserved. Made with ❤️
          </div>

          {/* Tech Stack */}
          <div style={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: '8px',
            color: '#95a5a6',
            fontSize: '11px'
          }}>
            <span>Powered by:</span>
            <span style={{ 
              backgroundColor: '#34495e', 
              padding: '2px 6px', 
              borderRadius: '3px',
              color: '#61dafb'
            }}>
              React
            </span>
            <span style={{ 
              backgroundColor: '#34495e', 
              padding: '2px 6px', 
              borderRadius: '3px',
              color: '#68a063'
            }}>
              Node.js
            </span>
            <span style={{ 
              backgroundColor: '#34495e', 
              padding: '2px 6px', 
              borderRadius: '3px',
              color: '#4db33d'
            }}>
              MongoDB
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;