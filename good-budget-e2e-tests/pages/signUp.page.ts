import { type Page, type Locator, expect } from '@playwright/test';
import { maybeBypassRecaptcha } from '../utils/captcha.util'; // Adjust path as needed

// Import LandingPage from its module (update the path as needed)
import { LandingPage } from './landing.page';

export class SignUpPage extends LandingPage {
  // Properties
  readonly page: Page; // Instance of the Playwright Page

  // Locators for elements on the Home Page
  readonly emailField: Locator;
  readonly passwordField: Locator;
  readonly planRadio: Locator;
  readonly termsOfUseCheckbox: Locator;
  readonly getStartedButton: Locator;
  readonly emailError: Locator;
  readonly passwordError: Locator;
  readonly termsOfUseError: Locator;
 
  // Constructor
  constructor(page: Page) {
    super(page);
    this.page = page;

    // Locators initialization
    this.emailField = page.locator('#new_household_email');
    this.passwordField = page.locator('#new_household_new_password');
    this.planRadio = page.locator('#new_household_plan_0');
    this.termsOfUseCheckbox = page.locator('#new_household_terms_of_use');
    this.getStartedButton = page.locator('//span[@class="elementor-button-text"]');
    this.emailError = page.locator('.elementor-field-group-email label.error');
    this.passwordError = page.locator('.elementor-field-group-password label.error');
    this.termsOfUseError = page.locator('label.checkbox > label.error');
  }

  // Methods to interact with the Home Page
  
  protected async _enterEmail(email: string, emailFieldLocator: Locator): Promise<void> {
    try {
      await emailFieldLocator.fill(email);
      console.log(`Email entered: ${email}`);
    } catch (error) {
      console.error(`Error entering email: ${error}`);
      throw new Error(`Failed to enter email. Underlying error: ${error instanceof Error ? error.message : String(error)}`);
    }
  }

  protected async _enterPassword(password: string, passwordFieldLocator: Locator): Promise<void> {
    try {
      await passwordFieldLocator.fill(password);
      console.log(`Password entered: ${password}`);
    } catch (error) {
      console.error(`Error entering password: ${error}`);
      throw new Error(`Failed to enter password. Underlying error: ${error instanceof Error ? error.message : String(error)}`);
    }
  }

  protected async _verifValidationError(locator: Locator, expectedText: string): Promise<boolean> {
    try {
      await expect(locator).toHaveText(expectedText, { timeout: 5000 });
      console.log(`✅ Validation error verified: ${expectedText}`);
      return true;
    } catch (error) {
      console.warn(`⚠️ Validation error not found or text mismatch: ${expectedText}`);
      return false;
    }
  }

   public async verifyValidationError(locator: Locator, expectedText: string): Promise<boolean> {
    return this._verifValidationError(locator, expectedText);
  }

  async provideSignUpDetails(
    email: string,
    password: string,
    options?: {
      clickPlanRadio?: boolean;
      acceptTerms?: boolean;
      clickGetStarted?: boolean;
      pauseForCaptcha?: boolean;
    }
  ): Promise<void> {
    const {
      clickPlanRadio = true,
      acceptTerms = true,
      clickGetStarted = true,
      pauseForCaptcha = true,
    } = options || {};

    await this.page.waitForLoadState('domcontentloaded'); // Ensure the page is fully loaded

    await this._enterEmail(email, this.emailField);
    await this._enterPassword(password, this.passwordField);

    if (clickPlanRadio) {
      await this._clickElement(this.planRadio, 'Select Free Plan');
    }

    if (acceptTerms) {
      await this._clickElement(this.termsOfUseCheckbox, 'Accept Terms of Use');
    }

    if (pauseForCaptcha) {
      console.log(">>> Pausing for manual CAPTCHA completion. Please solve the CAPTCHA and submit the form in the browser, then resume the test via Playwright Inspector. <<<");
      await this.page.pause();
      console.log(">>> Resuming test. Assuming CAPTCHA was solved and signup submitted. <<<");
    }

    if (clickGetStarted) {
      await this._clickElement(this.getStartedButton, 'Get Started Button');
    }
  }
}
