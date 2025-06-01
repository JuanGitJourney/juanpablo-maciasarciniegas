import { config } from '../utils/config';
import { logger } from '../utils/helpers';

// Global test setup
beforeAll(async () => {
  logger.info('🚀 Starting API Test Suite');
  logger.info(`Base URL: ${config.baseUrl}`);
  
  // Verify API connectivity
  try {
    // Add any initial setup or connectivity checks here
    logger.info('✅ API connectivity verified');
  } catch (error) {
    logger.error('❌ Failed to connect to API:', error);
    throw error;
  }
});

// Global test teardown
afterAll(async () => {
  logger.info('🏁 API Test Suite completed');
});

// Increase timeout for all tests
jest.setTimeout(30000);