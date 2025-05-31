import { type Page, type Locator, expect } from '@playwright/test';

export class LandingPage {
  // Properties
  readonly page: Page; // Instance of the Playwright Page

  // Locators for elements on the Home Page
  readonly loginButton: Locator;
  readonly signUpButton: Locator;
 
  // Constructor
  constructor(page: Page) {
    this.page = page;

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
    try {
      await elementLocator.waitFor({ state: 'visible', timeout });
      await elementLocator.click();
      console.log(`${elementName} button clicked successfully.`);
    } catch (error) {
      console.error(`Error clicking ${elementName} button: ${error}`);
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
    try {
      await expect(this.page).toHaveURL(expectedUrlPattern, { timeout });
      console.log(`Successfully navigated to ${pageName} page. URL matches: ${expectedUrlPattern.toString()}`);
    } catch (error) {
      const currentUrl = this.page.url();
      console.error(`Error navigating to ${pageName} page. Expected URL pattern: ${expectedUrlPattern.toString()}, Actual URL: ${currentUrl}. Error: ${error}`);
      if (error instanceof Error) {
        const urlError = new Error(`Failed to verify URL for ${pageName} page. Expected pattern: ${expectedUrlPattern.toString()}, Actual URL: ${currentUrl}. Underlying error: ${error.message}`);
        urlError.stack = error.stack;
        throw urlError;
      } else {
        throw new Error(`Failed to verify URL for ${pageName} page. Expected pattern: ${expectedUrlPattern.toString()}, Actual URL: ${currentUrl}. Underlying error is of unknown type: ${String(error)}`);
      }
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

  // Add more methods for other actions or verifications on the home page:
  // e.g., getTotalBudgetAmount(), getRecentTransactions(), navigateToProfile(), etc.
}