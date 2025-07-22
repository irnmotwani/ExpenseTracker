import React, { useState, useRef, useEffect } from 'react';

const ChatBot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      type: 'bot',
      message: 'Hi! I\'m your ExpenseTracker assistant. How can I help you today?',
      timestamp: new Date()
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const quickQuestions = [
    "How do I create a group?",
    "How to add expenses?",
    "Settlement not working",
    "Need human support"
  ];

  // Predefined responses for common questions
  const getPredefinedResponse = (question) => {
    const lowerQuestion = question.toLowerCase();
    
    if (lowerQuestion.includes('create') && lowerQuestion.includes('group')) {
      return 'To create a group: Go to Groups page → Click "Create New Group" → Enter group name and description → Add members by email. Need more help? Contact +91 7000270580';
    }
    
    if (lowerQuestion.includes('add') && lowerQuestion.includes('expense')) {
      return 'To add expenses: Go to Expenses page → Select your group → Click "Add Expense" → Enter amount, description → Choose who paid and how to split. Need help? Call +91 7000270580';
    }
    
    if (lowerQuestion.includes('settlement')) {
      return 'For settlement issues: Go to Settlement Tracking → Select group → View balances and suggestions → Record settlements. Still having trouble? Contact irnmotwanii@gmail.com';
    }
    
    if (lowerQuestion.includes('human') || lowerQuestion.includes('support') || lowerQuestion.includes('help')) {
      return 'For human support, contact us:\n📱 Phone: +91 7000270580\n✉️ Email: irnmotwanii@gmail.com\nWe\'re available 24/7 to help you!';
    }
    
    return null;
  };

  const sendMessage = async (message = inputMessage) => {
    if (!message.trim()) return;

    // Add user message
    const userMessage = {
      type: 'user',
      message: message,
      timestamp: new Date()
    };
    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsLoading(true);

    try {
      // Check for predefined responses first
      const predefinedResponse = getPredefinedResponse(message);
      if (predefinedResponse) {
        const botResponse = {
          type: 'bot',
          message: predefinedResponse,
          timestamp: new Date()
        };
        setMessages(prev => [...prev, botResponse]);
        setIsLoading(false);
        return;
      }

      // Call Gemini API
      const apiKey = 'AIzaSyCZ9dlPg5L4oZYmp_dmP8JSuAStVJJD5bA';
      console.log('Making API call to Gemini...');
      
      const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=${apiKey}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [{
            parts: [{
              text: `You are a helpful customer support assistant for ExpenseTracker, an expense management app. 

Context about ExpenseTracker:
- Users can create groups for shared expenses (trips, roommates, etc.)
- Add expenses and split them among group members
- Track settlements (who owes money to whom)
- View analytics and transaction history (Khata Book)
- Personal expense tracking features

Support contact info:
- Phone: +91 7000270580
- Email: irnmotwanii@gmail.com

User question: ${message}

Please provide a helpful, concise response (max 150 words). If it's a technical issue that needs human help, direct them to contact support. Be friendly and professional.`
            }]
          }]
        })
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log('API Response:', data);
      
      if (data.candidates && data.candidates[0] && data.candidates[0].content && data.candidates[0].content.parts && data.candidates[0].content.parts[0]) {
        const botResponse = {
          type: 'bot',
          message: data.candidates[0].content.parts[0].text,
          timestamp: new Date()
        };
        setMessages(prev => [...prev, botResponse]);
      } else {
        throw new Error('Invalid response structure from AI');
      }
    } catch (error) {
      console.error('Chat error:', error);
      const errorMessage = {
        type: 'bot',
        message: 'Sorry, I\'m having trouble right now. For immediate help, please contact our support team:\n📱 +91 7000270580\n✉️ irnmotwanii@gmail.com',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMessage]);
    }

    setIsLoading(false);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <>
      {/* Chat Widget Button */}
      <div
        onClick={() => setIsOpen(!isOpen)}
        style={{
          position: 'fixed',
          bottom: '20px',
          right: '20px',
          width: '60px',
          height: '60px',
          backgroundColor: '#007bff',
          borderRadius: '50%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: 'pointer',
          boxShadow: '0 4px 12px rgba(0, 123, 255, 0.3)',
          zIndex: 1000,
          transition: 'all 0.3s ease'
        }}
      >
        <span style={{ fontSize: '24px', color: 'white' }}>
          {isOpen ? '✕' : '💬'}
        </span>
      </div>

      {/* Chat Window */}
      {isOpen && (
        <div style={{
          position: 'fixed',
          bottom: '90px',
          right: '20px',
          width: '350px',
          height: '500px',
          backgroundColor: 'white',
          borderRadius: '10px',
          boxShadow: '0 8px 25px rgba(0, 0, 0, 0.15)',
          zIndex: 1000,
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden'
        }}>
          {/* Chat Header */}
          <div style={{
            backgroundColor: '#007bff',
            color: 'white',
            padding: '15px',
            display: 'flex',
            alignItems: 'center',
            gap: '10px'
          }}>
            <span style={{ fontSize: '20px' }}>🤖</span>
            <div>
              <div style={{ fontWeight: 'bold', fontSize: '16px' }}>ExpenseTracker Support</div>
              <div style={{ fontSize: '12px', opacity: 0.9 }}>Online • AI Assistant</div>
            </div>
          </div>

          {/* Messages Area */}
          <div style={{
            flex: 1,
            padding: '15px',
            overflowY: 'auto',
            backgroundColor: '#f8f9fa'
          }}>
            {messages.map((msg, index) => (
              <div
                key={index}
                style={{
                  marginBottom: '15px',
                  display: 'flex',
                  justifyContent: msg.type === 'user' ? 'flex-end' : 'flex-start'
                }}
              >
                <div style={{
                  maxWidth: '80%',
                  padding: '10px 15px',
                  borderRadius: '18px',
                  backgroundColor: msg.type === 'user' ? '#007bff' : 'white',
                  color: msg.type === 'user' ? 'white' : '#333',
                  fontSize: '14px',
                  lineHeight: '1.4',
                  boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
                  whiteSpace: 'pre-line'
                }}>
                  {msg.message}
                  <div style={{
                    fontSize: '11px',
                    opacity: 0.7,
                    marginTop: '5px',
                    textAlign: 'right'
                  }}>
                    {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </div>
                </div>
              </div>
            ))}
            
            {isLoading && (
              <div style={{ display: 'flex', justifyContent: 'flex-start', marginBottom: '15px' }}>
                <div style={{
                  padding: '10px 15px',
                  borderRadius: '18px',
                  backgroundColor: 'white',
                  boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)'
                }}>
                  <div style={{ display: 'flex', gap: '4px' }}>
                    <div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#007bff', animation: 'pulse 1.5s infinite' }}></div>
                    <div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#007bff', animation: 'pulse 1.5s infinite 0.5s' }}></div>
                    <div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#007bff', animation: 'pulse 1.5s infinite 1s' }}></div>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Quick Questions */}
          <div style={{ padding: '10px 15px', borderTop: '1px solid #e0e0e0' }}>
            <div style={{ fontSize: '12px', color: '#666', marginBottom: '8px' }}>Quick questions:</div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '5px' }}>
              {quickQuestions.map((question, index) => (
                <button
                  key={index}
                  onClick={() => sendMessage(question)}
                  style={{
                    padding: '5px 10px',
                    fontSize: '11px',
                    backgroundColor: '#f8f9fa',
                    border: '1px solid #e0e0e0',
                    borderRadius: '15px',
                    cursor: 'pointer',
                    color: '#007bff'
                  }}
                >
                  {question}
                </button>
              ))}
            </div>
          </div>

          {/* Input Area */}
          <div style={{
            padding: '15px',
            borderTop: '1px solid #e0e0e0',
            backgroundColor: 'white'
          }}>
            <div style={{ display: 'flex', gap: '10px' }}>
              <input
                type="text"
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Type your message..."
                style={{
                  flex: 1,
                  padding: '10px 15px',
                  border: '1px solid #e0e0e0',
                  borderRadius: '20px',
                  fontSize: '14px',
                  outline: 'none'
                }}
                disabled={isLoading}
              />
              <button
                onClick={() => sendMessage()}
                disabled={isLoading || !inputMessage.trim()}
                style={{
                  padding: '10px 15px',
                  backgroundColor: '#007bff',
                  color: 'white',
                  border: 'none',
                  borderRadius: '20px',
                  cursor: 'pointer',
                  fontSize: '14px'
                }}
              >
                Send
              </button>
            </div>
          </div>
        </div>
      )}

      {/* CSS Animation */}
      <style>
        {`
          @keyframes pulse {
            0%, 80%, 100% { opacity: 0.3; }
            40% { opacity: 1; }
          }
        `}
      </style>
    </>
  );
};

export default ChatBot;