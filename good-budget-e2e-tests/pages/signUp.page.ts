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
  }

  // Methods to interact with the Home Page
  
  private async _enterEmail(email: string): Promise<void> {
    try {
      await this.emailField.fill(email);
      console.log(`Email entered: ${email}`);
    } catch (error) {
      console.error(`Error entering email: ${error}`);
      throw new Error(`Failed to enter email. Underlying error: ${error instanceof Error ? error.message : String(error)}`);
    }
  }

    private async _enterPassword(password: string): Promise<void> {
    try {
      await this.passwordField.fill(password);
      console.log(`Password entered: ${password}`);
    } catch (error) {
      console.error(`Error entering password: ${error}`);
      throw new Error(`Failed to enter password. Underlying error: ${error instanceof Error ? error.message : String(error)}`);
    }
  }


  /**
   * Initiates the sign-up process by clicking the main sign-up button.
   * This might navigate to a sign-up page or open a sign-up modal.
   */
  async navigateToSignUpPage(): Promise<void> {
    await this._clickElement(this.signUpButton, 'Sign Up');
    await this._checkUrl(/.*goodbudget.com\/signup/, 'Sign Up');
  }

  async provideSignUpDetails(email: string, password: string): Promise<void> {
    await this.page.waitForLoadState('domcontentloaded'); // Ensure the page is fully loaded before interacting
    await this._enterEmail(email);
    await this._enterPassword(password);
    await this._clickElement(this.planRadio, 'Select Free Plan');
    await this._clickElement(this.termsOfUseCheckbox, 'Accept Terms of Use');
    
    console.log(">>> Pausing for manual CAPTCHA completion. Please solve the CAPTCHA and submit the form in the browser, then resume the test via Playwright Inspector. <<<");
    await this.page.pause();
    console.log(">>> Resuming test. Assuming CAPTCHA was solved and signup submitted. <<<");

    await this._clickElement(this.getStartedButton, 'Get Started Button');

  }
  
}