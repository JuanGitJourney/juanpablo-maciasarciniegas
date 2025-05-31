import { test, Page, expect } from '@playwright/test';
import { SignUpPage } from '../../pages/signUp.page';
import { HomePage } from '../../pages/home.page';
import { LandingPage } from '../../pages/landing.page';
import { sign } from 'crypto';

const BASE_URL = 'https://www.goodbudget.com';

test.describe('Signup Flow E2E Tests', () => {
  let landingPage: LandingPage;
  let signUpPage: SignUpPage;
  let homePage: HomePage;

  let page: Page;

  test.beforeAll(async ({ browser }) => {
    page = await browser.newPage();
    signUpPage = new SignUpPage(page);
    homePage = new HomePage(page);
    landingPage = new LandingPage(page);
  });

  test.beforeEach(async () => {
    await page.goto(BASE_URL);
  });

  test.afterAll(async () => {
    await page.close();
  });

  test('Navigate to Signup Page', async () => {
    await landingPage.navigateToSignUpPage();
    await landingPage.checkUrl(/.*goodbudget.com\/signup/, 'Sign Up');
  });

  test('Form Field Validations', async () => {
    const invalidEmail = 'invalid-email';
    const invalidPassword = '123';
    const emptyEmail = '';
    const emptyPassword = '';
    const userEmail = `testuser_${Date.now()}@example.com`;
    const userPassword = 'defaultPassword123';

    await landingPage.navigateToSignUpPage();

    // --- Case 1: Empty email and password ---
    await signUpPage.provideSignUpDetails(emptyEmail, emptyPassword, {
      clickPlanRadio: true,
      acceptTerms: true,
      clickGetStarted: true,
      pauseForCaptcha: false,
    });

    const emptyEmailError = await signUpPage.verifyValidationError(
      signUpPage.emailError,
      'You must enter an email address.'
    );
    const emptyPasswordError = await signUpPage.verifyValidationError(
      signUpPage.passwordError,
      'Your password must be at least 4 characters.'
    );

    expect(emptyEmailError).toBe(true);
    expect(emptyPasswordError).toBe(true);

    // --- Case 2: Invalid email & weak password ---
    await signUpPage.provideSignUpDetails(invalidEmail, invalidPassword, {
      clickPlanRadio: true,
      acceptTerms: true,
      clickGetStarted: true,
      pauseForCaptcha: false,
    });

    const invalidEmailError = await signUpPage.verifyValidationError(
      signUpPage.emailError,
      `'"${invalidEmail}"' is not a valid email address.`
    );
    const weakPasswordError = await signUpPage.verifyValidationError(
      signUpPage.passwordError,
      'Your password must be at least 4 characters.'
    );

    expect(invalidEmailError).toBe(true);
    expect(weakPasswordError).toBe(true);

    
    // --- Case 3: Unselected Plan ---
    await page.reload(); // Reset form state
    await signUpPage.provideSignUpDetails(userEmail, userPassword, {
      clickPlanRadio: false,
      acceptTerms: false,
      clickGetStarted: true,
      pauseForCaptcha: false,
    });



    // --- Case 4: Not Accept Terms of Use ---
    await signUpPage.provideSignUpDetails(userEmail, userPassword, {
      clickPlanRadio: true,
      acceptTerms: false,
      clickGetStarted: true,
      pauseForCaptcha: false,
    });

    const notAgreeOnTermsError = await signUpPage.verifyValidationError(
      signUpPage.termsOfUseError,
      `You must agree to the Terms of Use.`
    );

    expect(notAgreeOnTermsError).toBe(true);

  });

  test('Duplicate Account Handling', async () => {
    const existingEmail = 'existinguser@example.com'; 
    const userPassword = 'defaultPassword123';

    await landingPage.navigateToSignUpPage();
    await signUpPage.provideSignUpDetails(existingEmail, userPassword, {
      clickPlanRadio: true,
      acceptTerms: true,
      clickGetStarted: true,
      pauseForCaptcha: false 
    });
    
    const duplicateEmailError = await signUpPage.verifyValidationError(
      signUpPage.emailError,
      'Email is already taken. Already have a Household? Log in »'
    );
    console.log(signUpPage.emailError); 
    expect(duplicateEmailError).toBe(true);

  });

  test('Successful Signup', async () => {
    const userEmail = `testuser_${Date.now()}@example.com`;
    const userName = userEmail.split('@')[0];
    const userPassword = 'defaultPassword123';

    await landingPage.navigateToSignUpPage();
    await signUpPage.provideSignUpDetails(userEmail, userPassword, {
      clickPlanRadio: true,
      acceptTerms: true,
      clickGetStarted: true,
      pauseForCaptcha: true 
    });
    

    // Verify welcome modal or success page appears
    await homePage.verifyWelcomeModal();

    // Verify username displayed on home page
    await homePage.verifyUserName(userName);
  });

});
