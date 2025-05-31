import { type Page, type Locator, expect } from '@playwright/test';
import { maybeBypassRecaptcha } from '../utils/captcha.util'; // Adjust path as needed
import { createPageLogger, Logger } from '../utils/logger.util';

// Import LandingPage from its module (update the path as needed)
import { LandingPage } from './landing.page';

export class SignUpPage extends LandingPage {
  // Properties
  readonly page: Page; // Instance of the Playwright Page
  protected readonly logger: Logger;

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
    this.logger = createPageLogger('SignUpPage');

    // Locators initialization
    this.emailField = page.locator('#new_household_email');
    this.passwordField = page.locator('#new_household_new_password');
    this.planRadio = page.locator('#new_household_plan_0');
    this.termsOfUseCheckbox = page.locator('#new_household_terms_of_use');
    this.getStartedButton = page.locator('//span[@class="elementor-button-text"]');
    this.emailError = page.locator('.elementor-field-group-email label.error');
    this.passwordError = page.locator('.elementor-field-group-password label.error');
    this.termsOfUseError = page.locator('label.checkbox > label.error');

    this.logger.info('SignUpPage initialized');
  }

  // Methods to interact with the Home Page
  
  protected async _enterEmail(email: string, emailFieldLocator: Locator): Promise<void> {
    this.logger.actionStart('Enter Email', { email });
    
    try {
      await emailFieldLocator.fill(email);
      this.logger.actionSuccess('Enter Email', { email });
      this.logger.elementInteraction('Fill', 'Email Field', email);
    } catch (error) {
      this.logger.actionFailure('Enter Email', error as Error, { email });
      throw new Error(`Failed to enter email. Underlying error: ${error instanceof Error ? error.message : String(error)}`);
    }
  }

  protected async _enterPassword(password: string, passwordFieldLocator: Locator): Promise<void> {
    this.logger.actionStart('Enter Password');
    
    try {
      await passwordFieldLocator.fill(password);
      this.logger.actionSuccess('Enter Password');
      this.logger.elementInteraction('Fill', 'Password Field', '[MASKED]');
    } catch (error) {
      this.logger.actionFailure('Enter Password', error as Error);
      throw new Error(`Failed to enter password. Underlying error: ${error instanceof Error ? error.message : String(error)}`);
    }
  }

  protected async _verifValidationError(locator: Locator, expectedText: string): Promise<boolean> {
    this.logger.actionStart('Verify Validation Error', { expectedText });
    
    try {
      await expect(locator).toHaveText(expectedText, { timeout: 5000 });
      this.logger.assertion(`Validation error text matches: ${expectedText}`, true);
      this.logger.actionSuccess('Verify Validation Error', { expectedText });
      return true;
    } catch (error) {
      this.logger.assertion(`Validation error text matches: ${expectedText}`, false);
      this.logger.actionFailure('Verify Validation Error', `Text mismatch or element not found`, { expectedText });
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

    this.logger.actionStart('Provide SignUp Details', { 
      email, 
      options: { clickPlanRadio, acceptTerms, clickGetStarted, pauseForCaptcha } 
    });

    try {
      this.logger.step('Wait for page to load');
      await this.page.waitForLoadState('domcontentloaded');

      this.logger.step('Enter user credentials');
      await this._enterEmail(email, this.emailField);
      await this._enterPassword(password, this.passwordField);

      if (clickPlanRadio) {
        this.logger.step('Select plan');
        await this._clickElement(this.planRadio, 'Select Free Plan');
      }

      if (acceptTerms) {
        this.logger.step('Accept terms of use');
        await this._clickElement(this.termsOfUseCheckbox, 'Accept Terms of Use');
      }

      if (pauseForCaptcha) {
        this.logger.warn('Pausing for manual CAPTCHA completion. Please solve the CAPTCHA and submit the form in the browser, then resume the test via Playwright Inspector.');
        await this.page.pause();
        this.logger.info('Resuming test. Assuming CAPTCHA was solved and signup submitted.');
      }

      if (clickGetStarted) {
        this.logger.step('Click Get Started button');
        await this._clickElement(this.getStartedButton, 'Get Started Button');
      }

      this.logger.actionSuccess('Provide SignUp Details');
    } catch (error) {
      this.logger.actionFailure('Provide SignUp Details', error as Error);
      throw error;
    }
  }

  // Override the parent _clickElement method to add logging
  protected async _clickElement(elementLocator: Locator, elementName: string, timeout: number = 5000): Promise<void> {
    this.logger.actionStart(`Click ${elementName}`, { timeout });
    
    try {
      await elementLocator.waitFor({ state: 'visible', timeout });
      await elementLocator.click();
      this.logger.actionSuccess(`Click ${elementName}`);
      this.logger.elementInteraction('Click', elementName);
    } catch (error) {
      this.logger.actionFailure(`Click ${elementName}`, error as Error, { timeout });
      
      // Improved error re-throwing to preserve stack trace and original error type if possible
      if (error instanceof Error) {
        const clickError = new Error(`Failed to click ${elementName} button. Underlying error: ${error.message}`);
        clickError.stack = error.stack; // Preserve original stack if available
        throw clickError;
      } else {
        throw new Error(`Failed to click ${elementName} button. Underlying error is of unknown type: ${String(error)}`);
      }
    }
  }
}