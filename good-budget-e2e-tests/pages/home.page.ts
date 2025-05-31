import { type Page, type Locator, expect } from '@playwright/test';
import { LandingPage } from './landing.page';
import { createPageLogger, Logger } from '../utils/logger.util';

export class HomePage extends LandingPage {
  // Properties
  readonly page: Page; // Instance of the Playwright Page
  protected readonly logger: Logger;

  // Locators for elements on the Home Page
  readonly userpilotModal: Locator;
  readonly userpilotNextButton: Locator;
  readonly userName: Locator;
  readonly logOutButton: Locator;
  
  // Constructor
  constructor(page: Page) {
    super(page);
    this.page = page;
    this.logger = createPageLogger('HomePage');

    // Locators initialization
    this.userpilotModal = page.locator('.userpilot-slide-container[role="main"]');
    this.userpilotNextButton = this.userpilotModal.locator('#userpilot-next-button .userpilot-btn[userpilot-btn-action="flow"]');
    this.userName = page.locator('div[class="trans-title"] span[class="walkme-pii"]');
    this.logOutButton = page.locator('//a[normalize-space()="Logout"]');

    this.logger.info('HomePage initialized');
  }
  
  /**
   * Verifies the presence and content of the Userpilot welcome modal.
   * 
   * ⚠️ Note: This modal appears inconsistently due to a known issue in the app's onboarding flow.
   * Sometimes it does not show up after sign-up unless the page is reloaded, and sometimes not at all.
   * This method safely skips modal verification if the modal does not appear within the timeout.
   * 
   * Test execution will continue without failure when the modal is missing.
   */
  async verifyWelcomeModal(): Promise<void> {
    this.logger.actionStart('Verify Welcome Modal');
    
    const appeared = await this.ensureModalAppears();

    if (!appeared) {
      this.logger.warn('Welcome modal did not appear within timeout - continuing test execution');
      this.logger.actionFailure('Verify Welcome Modal', 'Modal did not appear within timeout', { timeout: 5000 });
      return; // Let test continue
    }

    try {
      this.logger.step('Verify modal content');
      
      await expect(this.userpilotModal).toContainText('Welcome to Goodbudget!');
      this.logger.assertion('Modal contains welcome text', true);
      
      await expect(this.userpilotModal).toContainText(`Let's start setting up your budget.`);
      this.logger.assertion('Modal contains setup text', true);
      
      await expect(this.userpilotNextButton).toBeVisible();
      this.logger.assertion('Next button is visible', true);
      
      await expect(this.userpilotNextButton).toHaveText('Next');
      this.logger.assertion('Next button has correct text', true);

      this.logger.actionSuccess('Verify Welcome Modal');
    } catch (error) {
      this.logger.actionFailure('Verify Welcome Modal', 'Modal verification failed', { error: (error as Error).message });
      throw error;
    }
  }

  async verifyUserName(name: string): Promise<void> {
    this.logger.actionStart('Verify User Name', { expectedName: name });

    try {
      await expect(this.userName).toBeVisible();
      this.logger.assertion('User name element is visible', true);

      await expect(this.userName).toHaveText(name);
      this.logger.assertion(`User name matches: ${name}`, true);
      this.logger.actionSuccess('Verify User Name', { expectedName: name });
    } catch (error) {
      const actualText = await this.userName.textContent();
      this.logger.assertion(`User name matches: ${name}`, false, name, actualText?.trim());
      this.logger.actionFailure('Verify User Name', `Name mismatch - Expected: "${name}", Found: "${actualText?.trim()}"`, { 
        expectedName: name, 
        actualName: actualText?.trim() 
      });
      throw error;
    }
  }

  async logOut(): Promise<void> {
    this.logger.actionStart('Log Out');
    
    try {
      await this._clickElement(this.logOutButton, 'Logout button');
      this.logger.actionSuccess('Log Out');
    } catch (error) {
      this.logger.actionFailure('Log Out', error as Error);
      throw error;
    }
  }

  async clickWelcomeModalNext(): Promise<void> {
    this.logger.actionStart('Click Welcome Modal Next Button');
    
    try {
      const appeared = await this.ensureModalAppears();
      
      if (!appeared) {
        this.logger.warn('Welcome modal not available - skipping next button click');
        return;
      }

      await this._clickElement(this.userpilotNextButton, 'Welcome Modal Next Button');
      this.logger.actionSuccess('Click Welcome Modal Next Button');
    } catch (error) {
      this.logger.actionFailure('Click Welcome Modal Next Button', error as Error);
      throw error;
    }
  }

  private async ensureModalAppears(): Promise<boolean> {
    this.logger.debug('Checking if welcome modal appears', { timeout: 5000 });
    
    try {
      await expect(this.userpilotModal).toBeVisible({ timeout: 5000 });
      this.logger.debug('Welcome modal appeared successfully');
      return true;
    } catch {
      this.logger.debug('Welcome modal did not appear within timeout');
      return false;
    }
  }
}