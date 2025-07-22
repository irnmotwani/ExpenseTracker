/**
 * API Endpoints Configuration
 * Centralized configuration for all API endpoints used in the application
 */

const BASE_URL = 'http://localhost:3001/api';

export const API_ENDPOINTS = {
  // Authentication endpoints
  AUTH: {
    LOGIN: '/auth/login',
    REGISTER: '/auth/register',
    VERIFY: '/auth/verify'
  },

  // User endpoints
  USERS: {
    BASE: '/users',
    PROFILE: '/users/profile'
  },

  // Groups endpoints
  GROUPS: {
    BASE: '/groups',
    BY_ID: (id) => `/groups/${id}`,
    MEMBERS: (id) => `/groups/${id}/members`,
    JOIN: (id) => `/groups/${id}/join`,
    LEAVE: (id) => `/groups/${id}/leave`
  },

  // Expenses endpoints
  EXPENSES: {
    BASE: '/expenses',
    BY_ID: (id) => `/expenses/${id}`,
    BY_GROUP: (groupId) => `/expenses/group/${groupId}`,
    BY_USER: (userId) => `/expenses/user/${userId}`
  },

  // Settlements endpoints
  SETTLEMENTS: {
    BASE: '/settlements',
    BY_ID: (id) => `/settlements/${id}`,
    BY_GROUP: (groupId) => `/settlements/group/${groupId}`,
    BY_USER: (userId) => `/settlements/user/${userId}`,
    BALANCES: (groupId) => `/settlements/balances/${groupId}`,
    DELETE: (id) => `/settlements/${id}`
  },

  // Khata Book endpoints
  KHATA: {
    BASE: '/khata',
    BY_ID: (id) => `/khata/${id}`,
    ENTRIES: (id) => `/khata/${id}/entries`,
    BALANCE: (id) => `/khata/${id}/balance`
  }
};

// Helper function to build full URL
export const buildUrl = (endpoint) => {
  return `${BASE_URL}${endpoint}`;
};

// Default axios configuration
export const API_CONFIG = {
  baseURL: BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json'
  }
};