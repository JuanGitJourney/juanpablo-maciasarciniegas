import dotenv from 'dotenv';

dotenv.config();

export const config = {
  baseUrl: process.env.BASE_URL || 'https://goodbudget.com/api',
  authToken: process.env.AUTH_TOKEN || '',
  timeout: parseInt(process.env.TIMEOUT || '30000'),
  retryAttempts: 3,
  retryDelay: 1000
};

export const endpoints = {
  transactions: '/transactions',
  envelopes: '/envelopes',
  accounts: '/accounts'
};