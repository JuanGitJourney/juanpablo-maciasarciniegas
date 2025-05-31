// pages/login.page.ts
import { Page, Locator, expect } from '@playwright/test';
import { SignUpPage } from './signUp.page';
import { createPageLogger, Logger } from '../utils/logger.util';

export class LoginPage extends SignUpPage {
  readonly page: Page;
  protected readonly logger: Logger;
  readonly emailInput: Locator;
  readonly passwordInput: Locator;
  readonly loginButton: Locator;
  readonly generalError: Locator;

  constructor(page: Page) {
    super(page);
    this.page = page;
    this.logger = createPageLogger('LoginPage');
    
    this.emailInput = page.locator('#username'); 
    this.passwordInput = page.locator('#password');
    this.loginButton = page.locator('.elementor-button-text');
    this.generalError = page.locator('label[class="error"]');

    this.logger.info('LoginPage initialized');
  }

  async navigateToLoginPage(baseUrl: string) {
    const loginUrl = `${baseUrl}/login`;
    this.logger.actionStart('Navigate to Login Page', { url: loginUrl });
    
    try {
      await this.page.goto(loginUrl);
      this.logger.actionSuccess('Navigate to Login Page', { url: loginUrl });
      this.logger.pageNavigation(loginUrl, 'Login Page');
    } catch (error) {
      this.logger.actionFailure('Navigate to Login Page', error as Error, { url: loginUrl });
      throw error;
    }
  }

  async provideLoginDetails(email: string, password: string, options: { clickLogin?: boolean } = {}) {
    const { clickLogin = true } = options;

    this.logger.actionStart('Provide Login Details', { 
      email, 
      clickLogin, 
      hasPassword: !!password 
    });

    try {
      if (email !== undefined) {
        this.logger.step('Enter email');
        await this._enterEmail(email, this.emailInput);
      }
      
      if (password !== undefined) {
        this.logger.step('Enter password');
        await this._enterPassword(password, this.passwordInput);
      }
      
      if (clickLogin) {
        this.logger.step('Click login button');
        await this._clickElement(this.loginButton, 'Login button');
      }

      this.logger.actionSuccess('Provide Login Details');
    } catch (error) {
      this.logger.actionFailure('Provide Login Details', error as Error);
      throw error;
    }
  }

  async verifyLoginError(expectedErrorText: string): Promise<boolean> {
    this.logger.actionStart('Verify Login Error', { expectedError: expectedErrorText });
    
    try {
      await expect(this.generalError).toHaveText(expectedErrorText, { timeout: 5000 });
      this.logger.assertion(`Login error message matches: ${expectedErrorText}`, true);
      this.logger.actionSuccess('Verify Login Error', { expectedError: expectedErrorText });
      return true;
    } catch (error) {
      this.logger.assertion(`Login error message matches: ${expectedErrorText}`, false);
      this.logger.actionFailure('Verify Login Error', 'Error message not found or text mismatch', { expectedError: expectedErrorText });
      return false;
    }
  }
}