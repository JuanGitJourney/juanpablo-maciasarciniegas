import { test, Page, expect } from '@playwright/test';
import { LoginPage } from '../../pages/login.page';
import { HomePage } from '../../pages/home.page';
import { LandingPage } from '../../pages/landing.page';
import { EnvelopePage } from '../../pages/envelope.page';
import { env } from 'process';

const BASE_URL = 'https://www.goodbudget.com';

const VALID_EMAIL = process.env.GOODBUDGET_VALID_EMAIL || 'existinguser@example.com';
const VALID_PASSWORD = process.env.GOODBUDGET_VALID_PASSWORD || 'defaultPassword123';
const VALID_USERNAME = VALID_EMAIL.split('@')[0]; 


test.describe('Envelope Management Feature', () => {
    let landingPage
    let loginPage: LoginPage;
    let homePage: HomePage;
    let envelopesPage: EnvelopePage;

    test.beforeEach(async ({ page }) => {
        landingPage = new LandingPage(page);
        loginPage = new LoginPage(page);
        homePage = new HomePage(page); 
        envelopesPage = new EnvelopePage(page)
        
        // Navigate to the base URL before each test
        await page.goto(BASE_URL);
        // Navigate to the landing page before each test
        await landingPage.navigateLoginPage();
        // Provide valid login details to ensure the user is logged in
        await loginPage.provideLoginDetails(VALID_EMAIL, VALID_PASSWORD, { clickLogin: true });
        // Verify redirection to home/dashboard and user context
        await homePage.checkUrl(/.*goodbudget.com\/home/, ''); 
        // Verify that the user is logged in by checking for the username on the home page
        await homePage.verifyUserName(VALID_USERNAME); 
    });

    test('TC001-E: User should be able to create a new envelope successfully', async () => {
        const envelopeName = `Groceries-${Date.now()}`; // Unique name for the envelope
        const initialBudget = '348.33';
        const envelopeBudget = '100';
        const finalBudget = '448.33';

        await homePage.clickAddEnvelopeButton(); 
        await envelopesPage.verifyMonthlyBudget(initialBudget);
        await envelopesPage.createNewEnvelope(envelopeName, envelopeBudget);
        await envelopesPage.verifyMonthlyBudget(finalBudget);
        await envelopesPage.saveChanges(false);
        await envelopesPage.decideToFillEnvelopes(false);
        await homePage.verifyCreatedEnvelope(envelopeName, true);
        
        await homePage.clickAddEnvelopeButton();
        await envelopesPage.deleteEnvelope(envelopeName, initialBudget); 
        await envelopesPage.saveChanges(false);
    });

    test('TC002-E: Should display validation error for empty envelope name', async () => {
        const envelopeName = ''; // Empty name
        const envelopeBudget = '100.00';

        await homePage.clickAddEnvelopeButton(); 
        await envelopesPage.createNewEnvelope(envelopeName, envelopeBudget);
        await envelopesPage.saveChanges(true);
        await envelopesPage.verifyErrorMessage('Envelopes need a name.');
    });

    test('TC003-E: Should display validation error for invalid budget amount (Letters)', async () => {
        const envelopeName = `Groceries-${Date.now()}`; // Unique name for the envelope
        const envelopeBudget = 'abc';

        await homePage.clickAddEnvelopeButton(); 
        await envelopesPage.createNewEnvelope(envelopeName, envelopeBudget);
        await envelopesPage.saveChanges(true);
        await envelopesPage.verifyErrorMessage('Please enter amount with no commas, letters, or symbols. Use positive amounts with 8 digits or less.');
    });

    test('TC004-E: Should display validation error for invalid budget amount (With commas)', async () => {
        const envelopeName = `Groceries-${Date.now()}`; // Unique name for the envelope
        const envelopeBudget = '100,50';

        await homePage.clickAddEnvelopeButton(); 
        await envelopesPage.createNewEnvelope(envelopeName, envelopeBudget);
        await envelopesPage.saveChanges(true);
        await envelopesPage.verifyErrorMessage('Please enter amount with no commas, letters, or symbols. Use positive amounts with 8 digits or less.');
    });

    test('TC005-E: Should display validation error for invalid budget amount (Symbols)', async () => {
        const envelopeName = `Groceries-${Date.now()}`; // Unique name for the envelope
        const envelopeBudget = '$100.50';

        await homePage.clickAddEnvelopeButton(); 
        await envelopesPage.createNewEnvelope(envelopeName, envelopeBudget);
        await envelopesPage.saveChanges(true);
        await envelopesPage.verifyErrorMessage('Please enter amount with no commas, letters, or symbols. Use positive amounts with 8 digits or less.');
    });


    test('TC006-E: User should be able to edit an existing envelope (Placeholder)', async () => {
        const totalInitialBudget = '348.33';
        const initialEnvelopeName = `Groceries`;
        const initialBudget = '240.00';
        const updatedEnvelopeName = `Rent`;
        const updatedBudget = '340.00';

        const totalUpdatedBudget = Number(totalInitialBudget) + (Number(updatedBudget) - Number(initialBudget));

        // Step 1: Create an envelope to edit
        await homePage.clickAddEnvelopeButton(); 
        await envelopesPage.verifyMonthlyBudget(totalInitialBudget);
        await envelopesPage.editEnvelope(initialEnvelopeName, initialBudget, updatedEnvelopeName, updatedBudget);
        await envelopesPage.verifyMonthlyBudget(totalUpdatedBudget.toString());

        await envelopesPage.saveChanges(false);
        await homePage.verifyCreatedEnvelope(updatedEnvelopeName, false);

        await homePage.clickAddEnvelopeButton();
        await envelopesPage.revertEditedChanges(initialEnvelopeName, initialBudget); 
        await envelopesPage.saveChanges(false);
    });

    test('TC007-E: User should be able to delete a created envelope (Placeholder)', async () => {
        const envelopeName = `Groceries-${Date.now()}`; // Unique name for the envelope
        const envelopeBudget = '100';
        const totalInitialBudget = '348.33';

        // Step 1: Create an envelope to delete
        await homePage.clickAddEnvelopeButton(); 
        await envelopesPage.createNewEnvelope(envelopeName, envelopeBudget);
        await envelopesPage.saveChanges(false);
        await envelopesPage.decideToFillEnvelopes(false);
        await homePage.verifyCreatedEnvelope(envelopeName, true);

        await homePage.clickAddEnvelopeButton();
        await envelopesPage.deleteEnvelope(envelopeName, totalInitialBudget);
        await envelopesPage.saveChanges(false);
        await homePage.verifyDeletedEnvelope(envelopeName, true);
    });

    
});
