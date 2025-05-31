import { type Page, type Locator, expect } from '@playwright/test';
import { createPageLogger, Logger } from '../utils/logger.util';

export class LandingPage {
  // Properties
  readonly page: Page; // Instance of the Playwright Page
  protected readonly logger: Logger;

  // Locators for elements on the Home Page
  readonly loginButton: Locator;
  readonly signUpButton: Locator;
 
  // Constructor
  constructor(page: Page) {
    this.page = page;
    this.logger = createPageLogger('LandingPage');

    // Locators initialization
    this.loginButton = page.locator("(//a[@class='elementor-item'][normalize-space()='Log in'])[1]");
    this.signUpButton = page.locator("(//a[@class='elementor-item'][normalize-space()='Sign up'])[1]"); 
  }

  // Methods to interact with the Home Page

  /**
   * Generic private method to click a button after ensuring it's visible.
   * @param elementLocator The Playwright Locator for the button.
   * @param buttonName A descriptive name for the button (for logging/error messages).
   * @param timeout Optional timeout for waiting for the button to be visible. Defaults to 5000ms.
   */
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

  /**
   * Generic private method to check if the current URL matches an expected pattern.
   * @param expectedUrlPattern The RegExp or string pattern for the expected URL.
   * @param pageName A descriptive name for the page being checked (for logging/error messages).
   * @param timeout Optional timeout for the URL check. Defaults to 10000ms.
   */
  protected async _checkUrl(expectedUrlPattern: RegExp | string, pageName: string, timeout: number = 10000): Promise<void> {
    this.logger.actionStart(`Check URL for ${pageName}`, { expectedPattern: expectedUrlPattern.toString(), timeout });
    
    try {
      await expect(this.page).toHaveURL(expectedUrlPattern, { timeout });
      const currentUrl = this.page.url();
      this.logger.actionSuccess(`Check URL for ${pageName}`, { expectedPattern: expectedUrlPattern.toString(), actualUrl: currentUrl });
      this.logger.assertion(`URL matches pattern for ${pageName}`, true, expectedUrlPattern.toString(), currentUrl);
    } catch (error) {
      const currentUrl = this.page.url();
      this.logger.actionFailure(`Check URL for ${pageName}`, `URL pattern mismatch`, { 
        expectedPattern: expectedUrlPattern.toString(), 
        actualUrl: currentUrl 
      });
      this.logger.assertion(`URL matches pattern for ${pageName}`, false, expectedUrlPattern.toString(), currentUrl);
      
      if (error instanceof Error) {
        const urlError = new Error(`Failed to verify URL for ${pageName} page. Expected pattern: ${expectedUrlPattern.toString()}, Actual URL: ${currentUrl}. Underlying error: ${error.message}`);
        urlError.stack = error.stack;
        throw urlError;
      } else {
        throw new Error(`Failed to verify URL for ${pageName} page. Expected pattern: ${expectedUrlPattern.toString()}, Actual URL: ${currentUrl}. Underlying error is of unknown type: ${String(error)}`);
      }
    }
  }

  public async checkUrl(expectedUrl: RegExp, pageTitle: string) {
    return this._checkUrl(expectedUrl, pageTitle);
  }

  /**
   * Initiates the sign-up process by clicking the main sign-up button.
   * This might navigate to a sign-up page.
   */
  public async navigateToSignUpPage(): Promise<void> {
    this.logger.step('Navigate to Sign Up page');
    await this._clickElement(this.signUpButton, 'Sign Up', 1000);
  }

  /**
   * Initiates the login process by clicking the main login button.
   * This might navigate to a log in page.
   */
  public async navigateLoginPage(): Promise<void> {
    this.logger.step('Navigate to Login page');
    await this._clickElement(this.loginButton, 'Login');
  }
}