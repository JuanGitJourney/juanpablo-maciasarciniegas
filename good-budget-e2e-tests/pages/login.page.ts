// pages/login.page.ts
import { Page, Locator, expect } from '@playwright/test';
import { SignUpPage } from './signUp.page';

export class LoginPage extends SignUpPage {
  readonly page: Page;
  readonly emailInput: Locator;
  readonly passwordInput: Locator;
  readonly loginButton: Locator;
  readonly generalError: Locator;

  constructor(page: Page) {
    super(page);
    this.page = page;
    this.emailInput = page.locator('#username'); 
    this.passwordInput = page.locator('#password');
    this.loginButton = page.locator('.elementor-button-text');
    this.generalError = page.locator('label[class="error"]');

  }

  async navigateToLoginPage(baseUrl: string) {
    await this.page.goto(`${baseUrl}/login`); // Or the direct login page URL
  }

  async provideLoginDetails(email: string, password: string, options: { clickLogin?: boolean } = {}) {
    const { clickLogin = true } = options;

    if (email !== undefined) {
        await this._enterEmail(email, this.emailInput);
    }
    if (password !== undefined) {
        await this._enterPassword(password, this.passwordInput);
    }
    if (clickLogin) {
      await this._clickElement(this.loginButton, 'Login button');
    }
  }

}
