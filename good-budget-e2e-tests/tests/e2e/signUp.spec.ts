import { test, Page } from '@playwright/test';
import { SignUpPage } from '../../pages/signUp.page';
import { HomePage } from '../../pages/home.page';
import { LandingPage } from '../../pages/landing.page';

const BASE_URL = 'https://www.goodbudget.com';

test.describe('HomePage Interaction', () => {
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


  test('Should fill the signup details up to CAPTCHA', async () => {
    const userEmail = `testuser_${Date.now()}@example.com`;
    const userName = userEmail.split('@')[0];
    const userPassword = 'defaultPassword123';

    if (!userEmail || !userPassword) {
      throw new Error('Environment variables TEST_USER_EMAIL and TEST_USER_PASSWORD must be set for this test.');
    }

    await landingPage.navigateToSignUpPage(); // Navigates to signup page
    await signUpPage.provideSignUpDetails(userEmail, userPassword); // Fills in email and password

    await homePage.verifyWelcomeModal();
    await homePage.verifyUserName(userName);
  });


});