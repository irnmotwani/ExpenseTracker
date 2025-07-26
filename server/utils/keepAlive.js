const axios = require('axios');

/**
 * Keep Alive Service
 * Prevents Render free tier from going to sleep
 */
class KeepAliveService {
  constructor() {
    this.serverUrl = process.env.RENDER_EXTERNAL_URL || 'https://expensetracker-nqlo.onrender.com';
    this.interval = null;
    this.pingInterval = 14 * 60 * 1000; // 14 minutes
  }

  start() {
    if (process.env.NODE_ENV === 'production') {
      console.log('🔄 Starting keep-alive service...');
      
      this.interval = setInterval(async () => {
        try {
          const response = await axios.get(`${this.serverUrl}/api/test/health`, {
            timeout: 10000
          });
          console.log(`✅ Keep-alive ping successful: ${new Date().toISOString()}`);
        } catch (error) {
          console.log(`❌ Keep-alive ping failed: ${error.message}`);
        }
      }, this.pingInterval);
    }
  }

  stop() {
    if (this.interval) {
      clearInterval(this.interval);
      this.interval = null;
      console.log('🛑 Keep-alive service stopped');
    }
  }
}

module.exports = new KeepAliveService();