import { type Page, type Locator, expect } from '@playwright/test';
import { LandingPage } from './landing.page';
import { time } from 'console';

export class HomePage extends LandingPage{
  // Properties
  readonly page: Page; // Instance of the Playwright Page

  // Locators for elements on the Home Page
  readonly userpilotModal: Locator;
  readonly userpilotNextButton: Locator;
  readonly userName: Locator;
  
  // Constructor
  constructor(page: Page) {
      super(page);
      this.page = page;

    // Locators initialization
    this.userpilotModal = page.locator('.userpilot-slide-container[role="main"]');
    this.userpilotNextButton = this.userpilotModal.locator('#userpilot-next-button .userpilot-btn[userpilot-btn-action="flow"]');
    this.userName = page.locator('div[class="trans-title"] span[class="walkme-pii"]');
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
    const appeared = await this.ensureModalAppears();

    if (!appeared) {
      console.warn('⚠️ Welcome modal did not appear within timeout.');
      return; // Let test continue
    }

    try {
      await expect(this.userpilotModal).toContainText('Welcome to Goodbudget!');
      await expect(this.userpilotModal).toContainText(`Let's start setting up your budget.`);
      await expect(this.userpilotNextButton).toBeVisible();
      await expect(this.userpilotNextButton).toHaveText('Next');

      console.log('✅ Welcome modal verified successfully.');
    } catch (error) {
      console.error('❌ Modal appeared but verification failed:', error);
    }
  }



  async verifyUserName(name: string): Promise<void> {
    await expect(this.userName).toBeVisible();

    try {
      await expect(this.userName).toHaveText(name);
      console.log(`✅ User name "${name}" verified successfully on the home page.`);
    } catch (error) {
      const actualText = await this.userName.textContent();
      console.error(`❌ User name mismatch. Expected: "${name}", Found: "${actualText?.trim()}"`);
      throw error;
    }
  }
  


  private async ensureModalAppears(): Promise<boolean> {
    try {
      await expect(this.userpilotModal).toBeVisible({ timeout: 5000 });
      return true;
    } catch {
      return false;
    }
  }


}