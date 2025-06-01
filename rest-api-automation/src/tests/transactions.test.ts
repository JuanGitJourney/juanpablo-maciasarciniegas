import { apiClient } from '../utils/apiClient';
import { endpoints } from '../utils/config';
import { testTransactions, invalidTransactionData } from '../utils/testData';
import { transactionSchema, apiResponseSchema, generateUniqueId } from '../utils/helpers';
import { Transaction, CreateTransactionRequest, ApiResponse } from '../types/transaction.types';

describe('Transactions API Tests', () => {
  let createdTransactionIds: string[] = [];

  afterAll(async () => {
    // Cleanup created transactions
    for (const id of createdTransactionIds) {
      try {
        await apiClient.delete(`${endpoints.transactions}/${id}`);
      } catch (error) {
        console.warn(`Failed to cleanup transaction ${id}:`, error);
      }
    }
  });

  describe('CREATE Transaction Tests', () => {
    test('should create a new transaction with valid data', async () => {
      const transactionData = {
        ...testTransactions[0],
        description: `Test transaction ${generateUniqueId()}`
      };

      const response = await apiClient.post<ApiResponse<Transaction>>(
        endpoints.transactions,
        transactionData
      );

      expect(response.status).toBe(201);
      expect(response.data.success).toBe(true);
      
      const { error } = transactionSchema.validate(response.data.data);
      expect(error).toBeUndefined();

      createdTransactionIds.push(response.data.data.id);
    });

    test('should return 400 for transaction with missing required fields', async () => {
      try {
        await apiClient.post(endpoints.transactions, invalidTransactionData.missingAmount);
      } catch (error: any) {
        expect(error.response.status).toBe(400);
        expect(error.response.data.success).toBe(false);
        expect(error.response.data.errors).toBeDefined();
      }
    });

    test('should return 400 for transaction with invalid amount', async () => {
      try {
        await apiClient.post(endpoints.transactions, invalidTransactionData.invalidAmount);
      } catch (error: any) {
        expect(error.response.status).toBe(400);
        expect(error.response.data.success).toBe(false);
      }
    });
  });

  describe('READ Transaction Tests', () => {
    let testTransactionId: string;

    beforeAll(async () => {
      // Create a transaction for read tests
      const transactionData = {
        ...testTransactions[1],
        description: `Read test transaction ${generateUniqueId()}`
      };

      const response = await apiClient.post<ApiResponse<Transaction>>(
        endpoints.transactions,
        transactionData
      );
      testTransactionId = response.data.data.id;
      createdTransactionIds.push(testTransactionId);
    });

    test('should retrieve all transactions', async () => {
      const response = await apiClient.get<ApiResponse<Transaction[]>>(endpoints.transactions);

      expect(response.status).toBe(200);
      expect(response.data.success).toBe(true);
      expect(Array.isArray(response.data.data)).toBe(true);
      expect(response.data.data.length).toBeGreaterThan(0);
    });

    test('should retrieve a specific transaction by ID', async () => {
      const response = await apiClient.get<ApiResponse<Transaction>>(
        `${endpoints.transactions}/${testTransactionId}`
      );

      expect(response.status).toBe(200);
      expect(response.data.success).toBe(true);
      expect(response.data.data.id).toBe(testTransactionId);

      const { error } = transactionSchema.validate(response.data.data);
      expect(error).toBeUndefined();
    });

    test('should return 404 for non-existent transaction', async () => {
      try {
        await apiClient.get(`${endpoints.transactions}/non-existent-id`);
      } catch (error: any) {
        expect(error.response.status).toBe(404);
        expect(error.response.data.success).toBe(false);
      }
    });

    test('should filter transactions by date range', async () => {
      const params = {
        start_date: '2024-06-01',
        end_date: '2024-06-30'
      };

      const response = await apiClient.get<ApiResponse<Transaction[]>>(
        endpoints.transactions,
        params
      );

      expect(response.status).toBe(200);
      expect(response.data.success).toBe(true);
      expect(Array.isArray(response.data.data)).toBe(true);
    });
  });

  describe('UPDATE Transaction Tests', () => {
    let testTransactionId: string;

    beforeAll(async () => {
      // Create a transaction for update tests
      const transactionData = {
        ...testTransactions[2],
        description: `Update test transaction ${generateUniqueId()}`
      };

      const response = await apiClient.post<ApiResponse<Transaction>>(
        endpoints.transactions,
        transactionData
      );
      testTransactionId = response.data.data.id;
      createdTransactionIds.push(testTransactionId);
    });

    test('should update transaction description', async () => {
      const updateData = {
        description: `Updated description ${generateUniqueId()}`
      };

      const response = await apiClient.put<ApiResponse<Transaction>>(
        `${endpoints.transactions}/${testTransactionId}`,
        updateData
      );

      expect(response.status).toBe(200);
      expect(response.data.success).toBe(true);
      expect(response.data.data.description).toBe(updateData.description);
      expect(response.data.data.id).toBe(testTransactionId);
    });

    test('should update transaction amount', async () => {
      const updateData = {
        amount: -99.99
      };

      const response = await apiClient.put<ApiResponse<Transaction>>(
        `${endpoints.transactions}/${testTransactionId}`,
        updateData
      );

      expect(response.status).toBe(200);
      expect(response.data.success).toBe(true);
      expect(response.data.data.amount).toBe(updateData.amount);
    });

    test('should return 404 when updating non-existent transaction', async () => {
      try {
        await apiClient.put(`${endpoints.transactions}/non-existent-id`, {
          description: 'Updated description'
        });
      } catch (error: any) {
        expect(error.response.status).toBe(404);
        expect(error.response.data.success).toBe(false);
      }
    });

    test('should return 400 when updating with invalid data', async () => {
      try {
        await apiClient.put(`${endpoints.transactions}/${testTransactionId}`, {
          amount: 'invalid-amount'
        });
      } catch (error: any) {
        expect(error.response.status).toBe(400);
        expect(error.response.data.success).toBe(false);
      }
    });
  });

  describe('DELETE Transaction Tests', () => {
    let testTransactionId: string;

    beforeEach(async () => {
      // Create a transaction for each delete test
      const transactionData = {
        ...testTransactions[0],
        description: `Delete test transaction ${generateUniqueId()}`
      };

      const response = await apiClient.post<ApiResponse<Transaction>>(
        endpoints.transactions,
        transactionData
      );
      testTransactionId = response.data.data.id;
    });

    test('should delete an existing transaction', async () => {
      const response = await apiClient.delete<ApiResponse<any>>(
        `${endpoints.transactions}/${testTransactionId}`
      );

      expect(response.status).toBe(200);
      expect(response.data.success).toBe(true);

      // Verify transaction is deleted
      try {
        await apiClient.get(`${endpoints.transactions}/${testTransactionId}`);
      } catch (error: any) {
        expect(error.response.status).toBe(404);
      }
    });

    test('should return 404 when deleting non-existent transaction', async () => {
      try {
        await apiClient.delete(`${endpoints.transactions}/non-existent-id`);
      } catch (error: any) {
        expect(error.response.status).toBe(404);
        expect(error.response.data.success).toBe(false);
      }
    });
  });

  describe('API Response Validation Tests', () => {
    test('should validate response schema for all endpoints', async () => {
      const response = await apiClient.get<ApiResponse<Transaction[]>>(endpoints.transactions);
      
      const { error } = apiResponseSchema.validate(response.data);
      expect(error).toBeUndefined();
    });
  });
});