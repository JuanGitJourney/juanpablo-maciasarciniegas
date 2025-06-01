# REST API Test Automation Framework (TypeScript)

## Overview
This is a comprehensive REST API test automation framework built with TypeScript for testing Good Budget's internal JSON endpoints. The framework focuses on the **Transactions** domain and provides full CRUD testing capabilities.

## Project Structure
```
api-test-framework/
├── src/
│   ├── tests/
│   │   ├── transactions.test.ts
│   │   └── setup.ts
│   ├── utils/
│   │   ├── apiClient.ts
│   │   ├── testData.ts
│   │   ├── config.ts
│   │   └── helpers.ts
│   ├── types/
│   │   └── transaction.types.ts
│   └── reports/
├── package.json
├── tsconfig.json
├── jest.config.js
├── .gitignore
└── README.md
```

## Setup Instructions

### Prerequisites
- Node.js (version 18+)
- npm or yarn
- Access to Good Budget application for endpoint discovery

### Installation
1. Clone the repository
2. Install dependencies:
```bash
npm install
```

### Environment Configuration
Create a `.env` file in the root directory:
```bash
BASE_URL=https://goodbudget.com/api
AUTH_TOKEN=your_auth_token_here
TIMEOUT=30000
```

## Tech Stack Choice & Approach

### Technology Stack
- **TypeScript**: Type safety, better IDE support, and maintainable code
- **Jest**: Robust testing framework with excellent TypeScript support
- **Axios**: HTTP client with interceptors for authentication and logging
- **Joi**: Schema validation for API responses
- **Winston**: Structured logging for debugging and monitoring
- **Allure**: Beautiful test reporting

### Why This Stack?
1. **TypeScript**: Provides compile-time error detection and better code documentation
2. **Jest**: Industry standard with powerful mocking and assertion capabilities
3. **Axios**: Reliable HTTP client with request/response interceptors
4. **Joi**: Ensures API responses match expected schemas
5. **Modular Design**: Separation of concerns for maintainability

### Testing Approach
- **Page Object Model**: Structured API interaction classes
- **Data-Driven Testing**: External test data management
- **Parallel Execution**: Faster test runs
- **Comprehensive Reporting**: Detailed test results and failure analysis

## Configuration Files

package.json
tsconfig.json
jest.config.js


## Source Code Structure

Types Definition (src/types/transaction.types.ts)
Configuration (src/utils/config.ts)
API Client (src/utils/apiClient.ts)
Test Data (src/utils/testData.ts)
Helpers (src/utils/helpers.ts)
Main Test Suite (src/tests/transactions.test.ts)
Test Setup (src/tests/setup.ts)


## How to Run Tests

### Basic Commands
```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:coverage

# Run specific test file
npm test -- transactions.test.ts

# Run tests with specific pattern
npm test -- --testNamePattern="CREATE"

# Debug tests
npm run test:debug
```

### Advanced Options
```bash
# Run tests in parallel (faster execution)
npm test -- --maxWorkers=4

# Run tests with verbose output
npm test -- --verbose

# Generate and open test report
npm run report
```

### Sample Test Report Structure
```
Test Results:
├── Transactions API Tests
│   ├── CREATE Transaction Tests ✅ (3/3 passed)
│   ├── READ Transaction Tests ✅ (4/4 passed)
│   ├── UPDATE Transaction Tests ✅ (4/4 passed)
│   ├── DELETE Transaction Tests ✅ (2/2 passed)
│   └── API Response Validation Tests ✅ (1/1 passed)
│
├── Total Tests: 14
├── Passed: 14
├── Failed: 0
├── Coverage: 95%
└── Duration: 45.2s
```

## Key Features

1. **Type Safety**: Full TypeScript implementation with strict typing
2. **Comprehensive CRUD Testing**: Complete test coverage for all operations
3. **Schema Validation**: Joi-based response validation
4. **Professional Logging**: Winston-based structured logging
5. **Clean Architecture**: Modular, maintainable code structure
6. **Error Handling**: Robust error handling and recovery
7. **Parallel Execution**: Fast test execution with parallel processing
8. **Beautiful Reports**: Multiple reporting options including Allure
9. **Environment Configuration**: Flexible configuration management
10. **Test Data Management**: Organized test data and cleanup

This framework provides a solid foundation for API testing with professional-grade features and best practices.