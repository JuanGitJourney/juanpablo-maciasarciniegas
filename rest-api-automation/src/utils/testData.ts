import { CreateTransactionRequest } from '../types/transaction.types';

export const testTransactions: CreateTransactionRequest[] = [
  {
    amount: -25.50,
    description: 'Coffee at Starbucks',
    category: 'Food & Dining',
    date: '2024-06-01',
    envelope_id: 'env_food_001',
    account_id: 'acc_checking_001'
  },
  {
    amount: -120.00,
    description: 'Grocery shopping',
    category: 'Groceries',
    date: '2024-06-01',
    envelope_id: 'env_groceries_001',
    account_id: 'acc_checking_001'
  },
  {
    amount: 2500.00,
    description: 'Monthly salary',
    category: 'Income',
    date: '2024-06-01',
    envelope_id: 'env_income_001',
    account_id: 'acc_checking_001'
  }
];

export const invalidTransactionData = {
  missingAmount: {
    description: 'Test transaction',
    category: 'Test',
    date: '2024-06-01',
    envelope_id: 'env_test_001',
    account_id: 'acc_test_001'
  },
  invalidAmount: {
    amount: 'invalid',
    description: 'Test transaction',
    category: 'Test',
    date: '2024-06-01',
    envelope_id: 'env_test_001',
    account_id: 'acc_test_001'
  }
};