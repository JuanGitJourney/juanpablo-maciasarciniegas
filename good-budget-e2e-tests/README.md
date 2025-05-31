# Good Budget E2E Tests

A comprehensive end-to-end testing suite for the Good Budget application using Playwright and TypeScript.

## 📋 Table of Contents

- [Overview](#overview)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Project Structure](#project-structure)
- [Configuration](#configuration)
- [Running Tests](#running-tests)
- [CAPTCHA Handling](#captcha-handling)
- [Page Object Model](#page-object-model)
- [Logging System](#logging-system)
- [Test Scripts](#test-scripts)
- [Troubleshooting](#troubleshooting)
- [Contributing](#contributing)

## 🎯 Overview

This project provides automated end-to-end testing for the Good Budget application, covering:

- **User Registration/Sign-up** flows
- **User Authentication/Login** processes
- **Navigation** between different pages
- **Form validation** and error handling
- **User onboarding** experiences

Built with modern tools and best practices:
- **Playwright** for cross-browser testing
- **TypeScript** for type safety
- **Page Object Model** for maintainable test structure
- **Comprehensive logging** for debugging and reporting

## 🔧 Prerequisites

Before running the tests, ensure you have:

- **Node.js** (version 16 or higher)
- **npm** or **yarn** package manager
- **Git** for version control

## 🚀 Installation

1. **Clone the repository:**
   ```bash
   git clone <repository-url>
   cd good-budget-e2e-tests
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Install Playwright browsers:**
   ```bash
   npx playwright install
   ```

4. **Create environment configuration:**
   ```bash
   cp .env.example .env
   ```

   Edit the `.env` file with your test environment URLs and credentials.

## 📁 Project Structure

good-budget-e2e-tests/
├── pages/                    # Page Object Model classes
│   ├── landing.page.ts      # Base landing page
│   ├── signUp.page.ts       # Sign-up page interactions
│   ├── login.page.ts        # Login page interactions
│   └── home.page.ts         # Home page after login
├── tests/
│   └── e2e/                 # End-to-end test files
│       ├── signup.spec.ts   # Sign-up test scenarios
│       └── login.spec.ts    # Login test scenarios
├── utils/                   # Utility functions and helpers
│   ├── logger.util.ts       # Comprehensive logging system
│   └── captcha.util.ts      # CAPTCHA handling utilities
├── playwright.config.ts     # Playwright configuration
├── package.json             # Project dependencies and scripts
└── README.md                # This file

## ⚙️ Configuration

### Environment Variables

Create a `.env` file in the root directory:

    BASE_URL=https://your-test-environment.com
    TEST_EMAIL=test@example.com
    TEST_PASSWORD=YourTestPassword123

### Playwright Configuration

The `playwright.config.ts` file includes:

- Multiple browser configurations (Chromium, Firefox, Safari)
- Test timeout settings
- Screenshot and video recording options
- Base URL configuration

## 🏃‍♂️ Running Tests

### Individual Test Suites

    # Run sign-up tests (headed mode)
    npm run test:signup

    # Run login tests (headed mode)
    npm run test:login

### All Tests

    # Run all tests (headless)
    npm test

    # Run all tests (headed mode)
    npm run test:headed

    # Run tests with UI mode (interactive)
    npm run test:ui

### Browser-Specific Tests

    # Run tests in Chrome only
    npm run test:chrome

    # Run tests in Safari only
    npm run test:safari

### View Test Reports

    npm run test:report

## 🔐 CAPTCHA Handling

> ⚠️ IMPORTANT: Manual CAPTCHA Intervention Required

This project includes **manual CAPTCHA handling** for sign-up flows. Here's how it works:

### How CAPTCHA is Handled

1. **Automatic Pause**: When the test reaches a CAPTCHA during sign-up, it will automatically pause execution  
2. **Manual Intervention**: You'll see a message in the console:

       >>> Pausing for manual CAPTCHA completion. Please solve the CAPTCHA and submit the form in the browser, then resume the test via Playwright Inspector. <<<

3. **Complete CAPTCHA**: Solve the CAPTCHA manually in the browser window  
4. **Submit Form**: Click the submit/signup button after solving CAPTCHA  
5. **Resume Test**: Click the **Play button** (▶️) in the Playwright Inspector window to continue test execution

### What You Need to Do

1. **Keep the browser window visible** during sign-up tests  
2. **Watch for the pause** - the test will stop and wait for you  
3. **Solve the CAPTCHA** manually when it appears  
4. **Click the signup button** after solving CAPTCHA  
5. **Resume in Playwright Inspector** by clicking the play button

### Configuration

CAPTCHA handling can be configured in the `provideSignUpDetails()` method:

```ts
await signUpPage.provideSignUpDetails(email, password, {
  pauseForCaptcha: true,  // Set to false to skip manual pause
  clickGetStarted: false  // Set to false if you handle submission manually
});
```

## 🏗️ Page Object Model

The project uses the Page Object Model pattern for maintainable and reusable test code:

### Base Pages

- `LandingPage`: Common navigation elements and base functionality
- `SignUpPage`: Sign-up form interactions and validations
- `LoginPage`: Login form and authentication
- `HomePage`: Post-login user dashboard and features

### Key Features

- Inheritance: Pages extend base classes for shared functionality  
- Locator Management: Centralized element selectors  
- Error Handling: Comprehensive try-catch blocks with meaningful errors  
- Reusable Methods: Common actions like clicking, filling forms, URL verification

### Example Usage

```ts
const signUpPage = new SignUpPage(page);
await signUpPage.navigateToSignUpPage();
await signUpPage.provideSignUpDetails('test@example.com', 'password123');
```

## 📊 Logging System

The project includes a comprehensive logging system for better debugging and test reporting:

### Features

- Multiple Log Levels: DEBUG, INFO, WARN, ERROR, FATAL  
- Contextual Logging: Each page has its own logger context  
- Action Tracking: Start/success/failure of operations  
- Element Interactions: Detailed UI interaction logs  
- Test Step Tracking: Clear step-by-step execution logs  
- Playwright Integration: Logs appear in test reports

### Log Output Examples

    2024-01-15T10:30:45.123Z INFO [Page.SignUpPage] 🚀 Starting: Provide SignUp Details  
    2024-01-15T10:30:45.150Z INFO [Page.SignUpPage] 📋 Step: Enter user credentials  
    2024-01-15T10:30:45.200Z INFO [Page.SignUpPage] 🎯 Fill on element: Email Field with value: test@example.com  
    2024-01-15T10:30:45.250Z INFO [Page.SignUpPage] ✅ Success: Provide SignUp Details

### Using the Logger

```ts
import { createPageLogger } from '../utils/logger.util';

const logger = createPageLogger('MyPage');
logger.actionStart('Performing action');
logger.elementInteraction('Click', 'Submit Button');
logger.actionSuccess('Action completed');
```

## 📜 Test Scripts

| Script               | Description                             |
|----------------------|-----------------------------------------|
| `npm test`           | Run all tests in headless mode          |
| `npm run test:signup`| Run sign-up tests with browser UI       |
| `npm run test:login` | Run login tests with browser UI         |
| `npm run test:headed`| Run all tests with browser UI           |
| `npm run test:ui`    | Interactive test runner with UI         |
| `npm run test:report`| View test execution reports             |
| `npm run test:chrome`| Run tests in Chromium only              |
| `npm run test:safari`| Run tests in Safari only                |

## 🔧 Troubleshooting

### Common Issues

#### 1. CAPTCHA Tests Failing  
**Problem**: Tests fail because CAPTCHA wasn't solved manually  
**Solution**:
- Ensure you're running tests in headed mode (`--headed`)
- Watch for the pause message and solve CAPTCHA manually
- Click the play button in Playwright Inspector after solving CAPTCHA

#### 2. Element Not Found Errors  
**Problem**: Locators can't find elements on the page  
**Solution**:
- Check if the page has fully loaded  
- Verify element selectors in the page object files  
- Use Playwright Inspector to debug selectors: `npx playwright codegen`

#### 3. Timeout Errors  
**Problem**: Tests timeout waiting for elements or actions  
**Solution**:
- Increase timeout values in playwright.config.ts  
- Check network connectivity and page load times  
- Verify element visibility conditions

#### 4. Environment Configuration  
**Problem**: Tests can't find configuration or credentials  
**Solution**:
- Ensure `.env` file exists with correct values  
- Verify BASE_URL and credentials are set  
- Check environment variable loading in tests

### Debug Mode

Run tests with debug information:

    # Run with debug output
    DEBUG=pw:api npm test

    # Run with Playwright Inspector
    npx playwright test --debug

### Getting Help

1. **Check the logs**: Comprehensive logging helps identify issues  
2. **Use Playwright Inspector**: Great for debugging element selectors  
3. **Review test reports**: HTML reports show detailed execution information  
4. **Check browser console**: Look for JavaScript errors or network issues

## 🤝 Contributing

### Code Standards

- Use **TypeScript** for all new code  
- Follow **Page Object Model** patterns  
- Add **comprehensive logging** to new methods  
- Include **error handling** in all interactions  
- Write **descriptive test names** and comments

### Adding New Tests

1. Create page objects for new pages in `/pages`  
2. Add test files in `/tests/e2e`  
3. Use existing patterns for consistency  
4. Include proper logging and error handling  
5. Test CAPTCHA flows manually when applicable

### Pull Request Process

1. Ensure all tests pass locally  
2. Add appropriate logging to new functionality  
3. Update README if adding new features  
4. Test CAPTCHA handling if modifying sign-up flows

---

## 📞 Support

For questions or issues:

1. Check this README for common solutions  
2. Review test execution logs for detailed error information  
3. Use Playwright's debugging tools for element selector issues  
4. Ensure manual CAPTCHA handling is properly followed for sign-up tests

---

**Author**: Juan Pablo Macias  
**License**: ISC
