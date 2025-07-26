import React, { useState } from 'react';
import axios from 'axios';

/**
 * Modern Login/Register Component
 * 
 * Features:
 * - Beautiful animated background with floating particles
 * - Responsive design with left branding section and right form section
 * - Toggle between Login and Register modes
 * - Form validation and error handling
 * - JWT token management
 * - Password visibility toggle
 * - Loading states and success/error messages
 */
function ModernLogin({ setToken, setUser }) {
  // State for toggling between login and register mode
  const [isLogin, setIsLogin] = useState(true);
  
  // Form data state - stores username, email, password
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: ''
  });
  
  // Message state for showing success/error messages
  const [message, setMessage] = useState('');
  
  // Loading state for showing spinner during API calls
  const [loading, setLoading] = useState(false);
  
  // State for password visibility toggle
  const [showPassword, setShowPassword] = useState(false);
  
  // Removed resend verification for simple version

  // Removed particle animation for clean professional look

  /**
   * Handle form submission for both login and register
   * @param {Event} e - Form submit event
   */
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    try {
      // Determine API endpoint based on current mode (login/register)
      const url = isLogin ? '/auth/login' : '/auth/register';
      
      // Prepare data - login only needs email/password, register needs all fields
      const data = isLogin
        ? { email: formData.email, password: formData.password }
        : formData;

      // Import API utilities
      const { buildUrl } = require('../utils/api');
      
      // Make API call to backend using the centralized API config
      const response = await axios.post(buildUrl(url), data);

      // If successful, save token and user data
      if (response.data.token) {
        setToken(response.data.token); // Update parent component state
        setUser(response.data.user); // Update parent component state
        localStorage.setItem('token', response.data.token); // Persist token
        setMessage('✨ Welcome to ExpenseFlow!');
      }
    } catch (error) {
      // Handle API errors and show user-friendly messages
      setMessage(error.response?.data?.message || 'Something went wrong');
    }
    setLoading(false);
  };



  return (
    <div className="modern-login-container">
      {/* Clean Professional Background */}
      <div className="animated-background"></div>

      {/* Main Content Container */}
      <div className="login-content">
        {/* Left Side - Branding Section */}
        <div className="branding-section">
          <div className="brand-content">
            {/* Logo and Brand Name */}
            <div className="logo-container">
              <img 
                src="https://i.postimg.cc/RN0cXSjS/logo.png" 
                alt="ExpenseFlow Logo" 
                className="logo-image"
                onError={(e) => {
                  e.target.style.display = 'none';
                  e.target.nextSibling.style.display = 'block';
                }}
              />
              <div className="logo-icon" style={{display: 'none'}}>💰</div>
              <h1 className="brand-title">ExpenseFlow</h1>
            </div>
            
            {/* Brand Description */}
            <p className="brand-subtitle">
              Smart expense tracking for modern teams
            </p>
            
            {/* Feature List */}
            <div className="feature-list">
              <div className="feature-item">
                <span className="feature-icon">✨</span>
                <span>Automatic expense splitting</span>
              </div>
              <div className="feature-item">
                <span className="feature-icon">📊</span>
                <span>Real-time analytics</span>
              </div>
              <div className="feature-item">
                <span className="feature-icon">👥</span>
                <span>Group collaboration</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side - Login/Register Form */}
        <div className="form-section">
          <div className="form-container">
            {/* Form Header */}
            <div className="form-header">
              <h2 className="form-title">
                {isLogin ? 'Welcome Back' : 'Create Account'}
              </h2>
              <p className="form-subtitle">
                {isLogin ? 'Sign in to your account' : 'Join thousands of users'}
              </p>
            </div>

            {/* Tab Switcher for Login/Register */}
            <div className="tab-switcher">
              <button
                className={`tab-button ${isLogin ? 'active' : ''}`}
                onClick={() => setIsLogin(true)}
              >
                Sign In
              </button>
              <button
                className={`tab-button ${!isLogin ? 'active' : ''}`}
                onClick={() => setIsLogin(false)}
              >
                Sign Up
              </button>
              {/* Animated indicator that slides between tabs */}
              <div className={`tab-indicator ${isLogin ? 'left' : 'right'}`}></div>
            </div>

            {/* Main Form */}
            <form onSubmit={handleSubmit} className="modern-form">
              {/* Username field - only shown during registration */}
              {!isLogin && (
                <div className="input-group">
                  <div className="input-container">
                    <input
                      type="text"
                      placeholder="Full Name"
                      value={formData.username}
                      onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                      className="modern-input"
                      required={!isLogin}
                    />
                    <div className="input-icon">👤</div>
                  </div>
                </div>
              )}

              {/* Email field - required for both login and register */}
              <div className="input-group">
                <div className="input-container">
                  <input
                    type="email"
                    placeholder="Email Address"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="modern-input"
                    required
                  />
                  <div className="input-icon">📧</div>
                </div>
              </div>

              {/* Password field with visibility toggle */}
              <div className="input-group">
                <div className="input-container">
                  <input
                    type={showPassword ? "text" : "password"}
                    placeholder="Password"
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    className="modern-input"
                    required
                  />
                  <div className="input-icon">🔒</div>
                  {/* Password visibility toggle button */}
                  <button
                    type="button"
                    className="password-toggle"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? '👁️' : '👁️‍🗨️'}
                  </button>
                </div>
              </div>

              {/* Submit button with loading state */}
              <button
                type="submit"
                disabled={loading}
                className="primary-button"
              >
                {loading ? (
                  <div className="loading-spinner"></div>
                ) : (
                  <>
                    <span>{isLogin ? 'Sign In' : 'Create Account'}</span>
                    <span className="button-arrow">→</span>
                  </>
                )}
              </button>
            </form>

            {/* Success/Error Messages */}
            {message && (
              <div className={`message ${message.includes('Welcome') || message.includes('📧') ? 'success' : 'error'}`}>
                {message}
              </div>
            )}


          </div>
        </div>
      </div>

      {/* CSS Styles - All styling for the component */}
      <style jsx>{`
        /* Main container with full height */
        .modern-login-container {
          min-height: 100vh;
          position: relative;
          overflow: hidden;
          font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
        }

        /* Clean professional background */
        .animated-background {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
          z-index: -1;
        }

        @keyframes gradientShift {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }

        /* Floating gradient orbs for background animation */
        .gradient-orb {
          position: absolute;
          border-radius: 50%;
          filter: blur(40px);
          animation: float 6s ease-in-out infinite;
        }

        /* Individual orb styles with different colors and positions */
        .orb-1 {
          width: 300px;
          height: 300px;
          background: linear-gradient(45deg, #ff6b6b, #feca57);
          top: -150px;
          left: -150px;
          animation-delay: 0s;
        }

        .orb-2 {
          width: 200px;
          height: 200px;
          background: linear-gradient(45deg, #48cae4, #023e8a);
          top: 50%;
          right: -100px;
          animation-delay: 2s;
        }

        .orb-3 {
          width: 250px;
          height: 250px;
          background: linear-gradient(45deg, #06ffa5, #3d5a80);
          bottom: -125px;
          left: 30%;
          animation-delay: 4s;
        }

        /* Floating animation for orbs */
        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-20px) rotate(180deg); }
        }

        /* Container for floating particles */
        .particles-container {
          position: absolute;
          width: 100%;
          height: 100%;
          overflow: hidden;
        }

        /* Individual floating particles */
        .floating-particle {
          position: absolute;
          width: 4px;
          height: 4px;
          background: rgba(255, 255, 255, 0.6);
          border-radius: 50%;
          animation: rise linear infinite;
        }

        /* Animation for particles rising upward */
        @keyframes rise {
          to {
            transform: translateY(-100vh) rotate(360deg);
          }
        }

        /* Main content layout - split into two sections */
        .login-content {
          display: flex;
          min-height: 100vh;
          position: relative;
          z-index: 1;
        }

        /* Left side branding section */
        .branding-section {
          flex: 1;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 2rem;
          color: #333;
        }

        /* Branding content container */
        .brand-content {
          max-width: 500px;
          text-align: center;
        }

        /* Logo container with icon and title */
        .logo-container {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 1rem;
          margin-bottom: 2rem;
        }

        /* Logo image styling */
        .logo-image {
          width: 80px;
          height: 80px;
          object-fit: contain;
          filter: drop-shadow(0 4px 8px rgba(0,0,0,0.3));
        }

        /* Logo icon styling (fallback) */
        .logo-icon {
          font-size: 4rem;
          filter: drop-shadow(0 4px 8px rgba(0,0,0,0.3));
        }

        /* Brand title with clean text */
        .brand-title {
          font-size: 3.5rem;
          font-weight: 800;
          margin: 0;
          color: #333;
          text-shadow: none;
        }

        /* Brand subtitle */
        .brand-subtitle {
          font-size: 1.25rem;
          margin-bottom: 3rem;
          opacity: 0.9;
          font-weight: 300;
        }

        /* Feature list container */
        .feature-list {
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
          text-align: left;
        }

        /* Individual feature item */
        .feature-item {
          display: flex;
          align-items: center;
          gap: 1rem;
          font-size: 1.1rem;
          font-weight: 500;
        }

        /* Feature icon with background */
        .feature-icon {
          font-size: 1.5rem;
          width: 40px;
          height: 40px;
          display: flex;
          align-items: center;
          justify-content: center;
          background: rgba(255, 255, 255, 0.2);
          border-radius: 50%;
          backdrop-filter: blur(10px);
        }

        /* Right side form section */
        .form-section {
          flex: 1;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 2rem;
        }

        /* Form container with modern glass morphism effect */
        .form-container {
          width: 100%;
          max-width: 450px;
          background: rgba(255, 255, 255, 0.25);
          backdrop-filter: blur(10px);
          -webkit-backdrop-filter: blur(10px);
          border-radius: 24px;
          padding: 3rem;
          box-shadow: 
            0 25px 50px rgba(0, 0, 0, 0.15),
            0 0 0 1px rgba(255, 255, 255, 0.3);
          border: 1px solid rgba(255, 255, 255, 0.4);
          position: relative;
          overflow: hidden;
        }

        .form-container::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: linear-gradient(135deg, rgba(255,255,255,0.3) 0%, rgba(255,255,255,0.1) 100%);
          pointer-events: none;
        }

        /* Form header section */
        .form-header {
          text-align: center;
          margin-bottom: 2rem;
        }

        /* Form title */
        .form-title {
          font-size: 2rem;
          font-weight: 700;
          color: #1a1a1a;
          margin: 0 0 0.5rem 0;
        }

        /* Form subtitle */
        .form-subtitle {
          color: #666;
          font-size: 1rem;
          margin: 0;
        }

        /* Tab switcher for login/register */
        .tab-switcher {
          position: relative;
          display: flex;
          background: #f5f5f5;
          border-radius: 12px;
          padding: 4px;
          margin-bottom: 2rem;
        }

        /* Tab buttons */
        .tab-button {
          flex: 1;
          padding: 12px 24px;
          border: none;
          background: transparent;
          border-radius: 8px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s ease;
          position: relative;
          z-index: 2;
        }

        /* Active tab button */
        .tab-button.active {
          color: #667eea;
        }

        /* Sliding indicator for active tab */
        .tab-indicator {
          position: absolute;
          top: 4px;
          width: calc(50% - 4px);
          height: calc(100% - 8px);
          background: white;
          border-radius: 8px;
          transition: transform 0.3s ease;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
        }

        /* Indicator position for right tab */
        .tab-indicator.right {
          transform: translateX(100%);
        }

        /* Form styling */
        .modern-form {
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
        }

        /* Input group container */
        .input-group {
          position: relative;
        }

        /* Input container with icon */
        .input-container {
          position: relative;
          display: flex;
          align-items: center;
        }

        /* Modern input field styling */
        .modern-input {
          width: 100%;
          padding: 16px 50px 16px 50px;
          border: 2px solid #e1e5e9;
          border-radius: 12px;
          font-size: 16px;
          transition: all 0.3s ease;
          background: white;
          box-sizing: border-box;
        }

        /* Input focus state */
        .modern-input:focus {
          outline: none;
          border-color: #667eea;
          box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
        }

        /* Input icon positioning */
        .input-icon {
          position: absolute;
          left: 16px;
          font-size: 18px;
          color: #666;
          z-index: 1;
        }

        /* Password toggle button */
        .password-toggle {
          position: absolute;
          right: 16px;
          background: none;
          border: none;
          cursor: pointer;
          font-size: 18px;
          z-index: 1;
        }

        /* Primary submit button */
        .primary-button {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          width: 100%;
          padding: 16px;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          border: none;
          border-radius: 12px;
          font-size: 16px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s ease;
          position: relative;
          overflow: hidden;
        }

        /* Button hover effect */
        .primary-button:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 25px rgba(102, 126, 234, 0.3);
        }

        /* Disabled button state */
        .primary-button:disabled {
          opacity: 0.7;
          cursor: not-allowed;
          transform: none;
        }

        /* Button arrow animation */
        .button-arrow {
          transition: transform 0.3s ease;
        }

        .primary-button:hover .button-arrow {
          transform: translateX(4px);
        }

        /* Loading spinner */
        .loading-spinner {
          width: 20px;
          height: 20px;
          border: 2px solid rgba(255, 255, 255, 0.3);
          border-top: 2px solid white;
          border-radius: 50%;
          animation: spin 1s linear infinite;
        }

        /* Spinner animation */
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }

        /* Message styling */
        .message {
          margin-top: 1rem;
          padding: 12px 16px;
          border-radius: 8px;
          text-align: center;
          font-weight: 500;
        }

        /* Success message */
        .message.success {
          background: rgba(34, 197, 94, 0.1);
          color: #16a34a;
          border: 1px solid rgba(34, 197, 94, 0.2);
        }

        /* Error message */
        .message.error {
          background: rgba(239, 68, 68, 0.1);
          color: #dc2626;
          border: 1px solid rgba(239, 68, 68, 0.2);
        }

        /* Resend verification section */
        .resend-verification-section {
          margin-top: 2rem;
          padding: 1.5rem;
          background: rgba(255, 255, 255, 0.1);
          border-radius: 12px;
          border: 1px solid rgba(255, 255, 255, 0.2);
        }

        .resend-verification-section h3 {
          color: #333;
          margin: 0 0 1rem 0;
          font-size: 1.1rem;
          text-align: center;
        }

        .resend-form {
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }

        .resend-button {
          background: #28a745;
          color: white;
          border: none;
          padding: 12px 20px;
          border-radius: 8px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s ease;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
        }

        .resend-button:hover {
          background: #218838;
          transform: translateY(-1px);
        }

        .resend-button:disabled {
          background: #6c757d;
          cursor: not-allowed;
          transform: none;
        }

        /* Responsive design for mobile */
        @media (max-width: 768px) {
          .login-content {
            flex-direction: column;
          }
          
          .branding-section {
            min-height: 40vh;
          }
          
          .form-section {
            padding: 1rem;
          }
          
          .form-container {
            padding: 2rem;
          }
          
          .brand-title {
            font-size: 2.5rem;
          }
        }
      `}</style>
    </div>
  );
}

export default ModernLogin;