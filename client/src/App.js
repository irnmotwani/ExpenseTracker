// Import required React modules and components
import React, { useState, useEffect, useCallback } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

// Import page components
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Groups from './pages/Groups';
import Expenses from './pages/Expenses';
import Analytics from './pages/Analytics';
import SettlementTracking from './pages/SettlementTracking';
import KhataBook from './pages/KhataBook';
import PersonalKhataBook from './pages/PersonalKhataBook';
import CustomerDetails from './pages/CustomerDetails';
import Profile from './pages/Profile';
import AboutUs from './pages/AboutUs';
import HelpSupport from './pages/HelpSupport';
import Footer from './components/Footer';
import ChatBot from './components/ChatBot';
import GlobalLoader from './components/GlobalLoader';
import './App.css';

function App() {
  // Authentication state - stores JWT token
  const [token, setToken] = useState('');

  // User state - stores user information
  const [user, setUser] = useState(null);
  
  // Loading state for initial app load
  const [isLoading, setIsLoading] = useState(false);

  /**
   * Effect to check for existing token in localStorage
   * This allows users to stay logged in after page refresh
   */
  useEffect(() => {
    // For development: Always start with login page
    // Comment out the lines below if you want persistent login
    
    // Check if user was previously logged in
    // const savedToken = localStorage.getItem('token');
    // if (savedToken) {
    //   setToken(savedToken);
    // }
  }, []); // Run only once on app start

  // Memoize fetchUserData to avoid unnecessary re-creations
  const fetchUserData = useCallback(async () => {
    try {
      const apiUrl = process.env.REACT_APP_API_URL || 'http://localhost:3001';
      
      // Add timeout for faster failure detection
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 second timeout
      
      const response = await fetch(`${apiUrl}/api/test/current-user`, {
        headers: { Authorization: `Bearer ${token}` },
        signal: controller.signal
      });
      
      clearTimeout(timeoutId);
      
      if (response.ok) {
        const data = await response.json();
        setUser(data.user);
      }
    } catch (error) {
      console.error('Error fetching user data:', error);
      // Fallback user data
      setUser({ username: 'User', email: 'user@example.com' });
    }
  }, [token]);

  useEffect(() => {
    if (token) {
      setIsLoading(true);
      // Fetch user data from API
      fetchUserData().finally(() => {
        setIsLoading(false);
      });
    }
  }, [token, fetchUserData]);

  const logout = () => {
    setToken('');
    setUser(null);
    localStorage.removeItem('token');
  };

  return (
    <Router>
      <div className="App" style={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column'
      }}>
        {/* Global Loading Overlay */}
        {isLoading && <GlobalLoader message="Loading your data..." />}
        
        {/* Main Content Area */}
        <div style={{ flex: 1 }}>
          {/* Conditional rendering based on authentication status */}
          {token ? (
            // Authenticated routes - user is logged in
            <Routes>
              <Route path="/dashboard" element={<Dashboard user={user} logout={logout} />} />
              <Route path="/groups" element={<Groups token={token} />} />
              <Route path="/expenses" element={<Expenses token={token} />} />
              <Route path="/analytics" element={<Analytics token={token} />} />
              <Route path="/settlements" element={<SettlementTracking token={token} />} />
              <Route path="/khatabook" element={<KhataBook token={token} />} />
              <Route path="/personal-khata" element={<PersonalKhataBook token={token} />} />
              <Route path="/personal-khata/customer/:customerId" element={<CustomerDetails token={token} />} />
              <Route path="/profile" element={<Profile token={token} user={user} setUser={setUser} />} />
              <Route path="/about" element={<AboutUs />} />
              <Route path="/help" element={<HelpSupport />} />
              <Route path="*" element={<Navigate to="/dashboard" />} />
            </Routes>
          ) : (
            // Non-authenticated routes - user needs to login
            <Routes>
              <Route path="/login" element={<Login setToken={setToken} setUser={setUser} />} />
              <Route path="*" element={<Navigate to="/login" />} />
            </Routes>
          )}
        </div>

        {/* Footer - Only show when user is logged in */}
        {token && <Footer />}
        
        {/* ChatBot - Only show when user is logged in */}
        {token && <ChatBot />}
      </div>
    </Router>
  );
}

export default App;