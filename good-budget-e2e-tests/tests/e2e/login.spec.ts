import { test, Page, expect } from '@playwright/test';
import { LoginPage } from '../../pages/login.page'; // Adjust path as needed
import { HomePage } from '../../pages/home.page';
import { LandingPage } from '../../pages/landing.page';

const BASE_URL = 'https://www.goodbudget.com';

const VALID_EMAIL = process.env.GOODBUDGET_VALID_EMAIL || 'existinguser@example.com';
const VALID_PASSWORD = process.env.GOODBUDGET_VALID_PASSWORD || 'defaultPassword123';
const VALID_USERNAME = VALID_EMAIL.split('@')[0]; 

test.describe('Login Flow E2E Tests', () => {
  let landingPage: LandingPage;
  let loginPage: LoginPage;
  let homePage: HomePage;
  
  test.beforeEach(async ({ page }) => {
    landingPage = new LandingPage(page);
    loginPage = new LoginPage(page);
    homePage = new HomePage(page);
    await page.goto(BASE_URL);
  });

  test('Navigate to Login Page', async () => {
    await landingPage.navigateLoginPage();
    await loginPage.checkUrl(/.*goodbudget.com\/login/, 'Log In | Personal Budget Software | Goodbudget');
  });

  test('Form Field Validations on Login Page', async () => {
    const invalidEmail = 'invalid-email';
    const nonExistentEmail = `nonexistent_${Date.now()}@example.com`;
    const incorrectPassword = 'wrongPassword123!';
    const emptyEmail = '';
    const emptyPassword = '';

    await landingPage.navigateLoginPage(); 

    // --- Case 1: Empty email and password ---
    await loginPage.provideLoginDetails(emptyEmail, emptyPassword, { clickLogin: true });
    let emptyFieldsError = await loginPage.verifyValidationError(
      loginPage.generalError,
      "Hm... that username and/or password didn't work."
    );
  
    expect(emptyFieldsError).toBe(true);

    // --- Case 2: Invalid email format ---
    await loginPage.provideLoginDetails(invalidEmail, VALID_PASSWORD, { clickLogin: true });
    const invalidEmailError = await loginPage.verifyValidationError(
      loginPage.generalError,
      "Hm... that username and/or password didn't work."
    );
  
    expect(invalidEmailError).toBe(true);
    
    await landingPage.navigateLoginPage();

    // --- Case 3: Non-existent email ---
    await loginPage.provideLoginDetails(nonExistentEmail, VALID_PASSWORD, { clickLogin: true });
    const nonExistentEmailError = await loginPage.verifyValidationError(
      loginPage.generalError,
      "Hm... that username and/or password didn't work."
    );
    expect(nonExistentEmailError).toBe(true);
    await landingPage.navigateLoginPage();

    // --- Case 4: Valid email, incorrect password ---
    await loginPage.provideLoginDetails(VALID_EMAIL, incorrectPassword, { clickLogin: true });
    const incorrectPasswordError = await loginPage.verifyValidationError(
      loginPage.generalError,
      "Hm... that username and/or password didn't work."
    );
    expect(incorrectPasswordError).toBe(true);
  });

  test('Successful Login', async () => {
    await landingPage.navigateLoginPage();
    await loginPage.provideLoginDetails(VALID_EMAIL, VALID_PASSWORD, { clickLogin: true });

    // Verify redirection to home/dashboard and user context
    await homePage.checkUrl(/.*goodbudget.com\/home/, ''); 
    // Verify that the user is logged in by checking for the username on the home page
    await homePage.verifyUserName(VALID_USERNAME); 
  });

  test('Logout and Return to Landing Page', async () => {
    await landingPage.navigateLoginPage();
    await loginPage.provideLoginDetails(VALID_EMAIL, VALID_PASSWORD, { clickLogin: true });
    await homePage.logOut();
    await landingPage.checkUrl(/.*goodbudget.com\/logout/, 'Logout Page');
  });
});