import { type Page, type Locator, expect } from '@playwright/test';
import { LandingPage } from './landing.page';
import { createPageLogger, Logger } from '../utils/logger.util';
import { HomePage } from './home.page';

export class EnvelopePage extends LandingPage {
  // Properties
  readonly page: Page; // Instance of the Playwright Page
  protected readonly logger: Logger;

  // Locators for elements on the Home Page
  readonly newEnvelopeButton: Locator;
  readonly existingEnvelopeNameInput_1: Locator;
  readonly existingEnvelopeNameInput_2: Locator;
  readonly createdEnvelopeNameInput: Locator;
  readonly envelopeBudgetInput: Locator;
  readonly existingAmountInput_1: Locator;
  readonly existingAmountInput_2: Locator;
  readonly createdEnvelopeAmount: Locator;
  readonly saveEnvelopesButton: Locator;
  readonly validationErrorMessage: Locator;
  readonly editExistingEnvelopeButton_1: Locator;
  readonly editExistingEnvelopeButton_2: Locator;
  readonly editCreatedEnvelopeButton: Locator;
  readonly newEnvelopesMessage: Locator;
  readonly deleteExistingEnvelopeButton_1: Locator;
  readonly deleteExistingEnvelopeButton_2: Locator;
  readonly deleteCreatedEnvelopeButton: Locator;
  readonly fillEnvelopesButton: Locator;
  readonly dontFillEnvelopesButton: Locator;
  readonly fillEnvelopesAmountInput: Locator;
  readonly fillEnvelopesPayerInput: Locator;
  readonly quickFillDropdown: Locator;
  readonly saveFillEnvelopesButton: Locator;
  readonly fillFromAvailableButton: Locator;
  readonly monthlyBudgetInfo: Locator;
  readonly cancelButton: Locator;

  
  // Constructor
  constructor(page: Page) {
    super(page);
    this.page = page;
    this.logger = createPageLogger('Envelope Page');

    // Locators initialization
    this.newEnvelopeButton = page.locator('//div[@class="all-buckets"]//envelope-list//form[@class="form-edit-envelope ng-untouched ng-pristine ng-valid"]//div//button[@type="button"][normalize-space()="Add"]');
    this.existingEnvelopeNameInput_1 = page.locator('li[id="1"] div[class="row-name"] input[type="text"]');
    this.existingEnvelopeNameInput_2 = page.locator('li[id="2"] div[class="row-name"] input[type="text"]');
    this.createdEnvelopeNameInput = page.locator('li[id="-1"] div[class="row-name"] input[type="text"]');
    this.envelopeBudgetInput = page.locator('input[class="amount pull-right ng-pristine ng-valid ng-touched"]');
    this.saveEnvelopesButton = page.locator('#save-envelopes-btn');
    this.validationErrorMessage = page.locator('.control-group.error');
    this.existingAmountInput_1 = page.locator('li[id="1"] input[placeholder="0.00"]');
    this.existingAmountInput_2 = page.locator('li[id="2"] input[placeholder="0.00"]');
    this.createdEnvelopeAmount = page.locator('li[id="-1"] input[placeholder="0.00"]');
    this.cancelButton = page.locator('button[class="btn btn-cancel set-cancel-clicked"]');
    this.editExistingEnvelopeButton_1 = page.locator('li[id="1"] button[class="btn btn-ok"]');
    this.editExistingEnvelopeButton_2 = page.locator('li[id="2"] button[class="btn btn-ok"]');
    this.editCreatedEnvelopeButton = page.locator('li[id="-1"] button[class="btn btn-ok"]');
    this.newEnvelopesMessage = page.locator('//h1[normalize-space()="New Envelopes Created!"]');
    this.deleteExistingEnvelopeButton_1 = page.locator('li[id="1"] i[class="icon-remove-sign"]');
    this.deleteExistingEnvelopeButton_2 = page.locator('li[id="2"] i[class="icon-remove-sign"]');
    this.deleteCreatedEnvelopeButton = page.locator('li[id="3"] i[class="icon-remove-sign"]');
    this.fillEnvelopesButton = page.locator('#fillEnvelopesModalYes');
    this.dontFillEnvelopesButton = page.locator('//button[@id="fillEnvelopesModalNo"]');
    this.fillEnvelopesAmountInput = page.locator('#specify-amount');
    this.fillEnvelopesPayerInput = page.locator('#specify-fillname');
    this.quickFillDropdown = page.locator('div[class="btn-group"] button[class="btn btn-fill dropdown-toggle"]');
    this.monthlyBudgetInfo = page.locator('p[class="total-total"] strong');
    this.saveFillEnvelopesButton = page.locator('div[id="incomeSummary"] button[type="submit"]');
    this.fillFromAvailableButton = page.locator('//a[normalize-space()="Available"]');
    
    
    this.logger.info('Envelope Page initialized');
  }
  

    async createNewEnvelope(name: string, budget: string): Promise<void> {
      this.logger.actionStart('Create New Envelope', { name, budget });

      try {
        await expect(this.existingEnvelopeNameInput_1).toBeVisible({ timeout: 10000 });
        await expect(this.existingEnvelopeNameInput_1).toBeEnabled({ timeout: 10000 });
        await expect(this.existingEnvelopeNameInput_2).toBeVisible({ timeout: 10000 });
        await expect(this.existingEnvelopeNameInput_2).toBeEnabled({ timeout: 10000 });
        this.logger.step('Existing envelopes are visible and enabled');

        await this._clickElement(this.newEnvelopeButton, 'Add New Envelope Button');
        this.logger.step('Clicked Add New Envelope Button');


        await this._fillInputField(this.createdEnvelopeNameInput, name, 'New Envelope Name');
        this.logger.step(`Set envelope name to: ${name}`);
        
        await this._fillInputField(this.createdEnvelopeAmount, budget, 'New Envelope Budget');
        await this.createdEnvelopeAmount.press('Enter');

        this.logger.step(`Set envelope budget to: ${budget}`);        
        this.logger.actionSuccess('Create New Envelope', { name, budget });
      } catch (error) {
        this.logger.actionFailure('Create New Envelope', error as Error, { name, budget });
        throw error;
      }
    }

    async verifyMonthlyBudget(expectedBudget: string): Promise<void> {
      this.logger.actionStart('Verify Monthly Budget', { expectedBudget });
      try {
        await expect(this.monthlyBudgetInfo).toContainText(expectedBudget);
        this.logger.assertion('Monthly budget is', true);
        this.logger.actionSuccess('Verify Monthly Budget', { expectedBudget });
      } catch (error) {
        this.logger.actionFailure('Verify Monthly Budget', error as Error, { expectedBudget });
        throw error;
      }
    }

    async saveChanges(validationTest: boolean): Promise<void> {
      this.logger.actionStart('Save Changes');
      try {
        await this._clickElement(this.saveEnvelopesButton, 'Save Envelopes Button');

        if (validationTest) {
          await this._checkUrl(/^https:\/\/goodbudget\.com\/envelope\/edit$/, '');
        } else {
          await this._checkUrl(/.*goodbudget.com\/home/, '');
        }
        this.logger.actionSuccess('Save Changes');
      } catch (error) {
        this.logger.actionFailure('Save Changes', error as Error);
        throw error;
      }
    }

    async editEnvelope(name: string, budget: string, newName: string, newBudget: string): Promise<void> {
      this.logger.actionStart('Edit Envelope', { name, budget, newName, newBudget });
      try {
        // Click the edit button for the existing envelope
        if (name === 'Groceries') {
          await this._clickElement(this.editExistingEnvelopeButton_1, 'Edit Existing Envelope Button 1');
          await this._fillInputField(this.existingEnvelopeNameInput_1, newName, 'New Envelope Name');
          await this._fillInputField(this.existingAmountInput_1, newBudget, 'New Envelope Budget');
          await this.existingAmountInput_1.press('Enter');
        } else if (name === 'Gas') {
          await this._clickElement(this.editExistingEnvelopeButton_2, 'Edit Existing Envelope Button 2');
          await this._fillInputField(this.existingEnvelopeNameInput_2, newName, 'New Envelope Name');
          await this._fillInputField(this.existingAmountInput_2, newBudget, 'New Envelope Budget');
          await this.existingAmountInput_2.press('Enter');
        } else {
          await this._clickElement(this.editCreatedEnvelopeButton, 'Edit Created Envelope Button');
          await this._fillInputField(this.createdEnvelopeNameInput, newName, 'New Envelope Name');
          await this._fillInputField(this.createdEnvelopeAmount, newBudget, 'New Envelope Budget');
          await this.createdEnvelopeAmount.press('Enter');
        }

        this.logger.actionSuccess('Edit Envelope', { newName, newBudget });
      } catch (error) {
        this.logger.actionFailure('Edit Envelope', error as Error, { name, budget, newName, newBudget });
        throw error;
      }
    }

    async verifyErrorMessage(expectedMessage: string): Promise<void> {
      this.logger.actionStart('Verify Error Message', { expectedMessage });
      try {
        await expect(this.validationErrorMessage).toContainText(expectedMessage);
        this.logger.assertion('Validation error message is', true);
        this.logger.actionSuccess('Verify Error Message', { expectedMessage });
      } catch (error) {
        this.logger.actionFailure('Verify Error Message', error as Error, { expectedMessage });
        throw error;
      }
    }

    async revertEditedChanges(name: string, budget: string): Promise<void> {
      this.logger.actionStart('Revert Edited Changes', { name, budget });
      try {
        if (name === 'Groceries') {
          await this._fillInputField(this.existingEnvelopeNameInput_1, name, 'Revert Envelope Name');
          await this._fillInputField(this.existingAmountInput_1, budget, 'Revert Envelope Budget');
          await this.existingAmountInput_1.press('Enter');
        } else if (name === 'Gas') {
          await this._fillInputField(this.existingEnvelopeNameInput_2, name, 'Revert Envelope Name');
          await this._fillInputField(this.existingAmountInput_2, budget, 'Revert Envelope Budget');
          await this.existingAmountInput_2.press('Enter');
        } else {
          await this._fillInputField(this.createdEnvelopeNameInput, name, 'Revert Envelope Name');
          await this._fillInputField(this.createdEnvelopeAmount, budget, 'Revert Envelope Budget');
          await this.createdEnvelopeAmount.press('Enter');
        }
        this.logger.actionSuccess('Revert Edited Changes', { name, budget });
      } catch (error) {
        this.logger.actionFailure('Revert Edited Changes', error as Error, { name, budget });
        throw error;
      }
    }

    async deleteEnvelope(name: string, initialBudget: string): Promise<void> {
      this.logger.actionStart('Delete Envelope', { name });
      try {
        if (name === 'Groceries') {
          await this._clickElement(this.deleteExistingEnvelopeButton_1, 'Remove Existing Envelope Button');
          await expect(this.existingEnvelopeNameInput_1).not.toBeVisible();

        } else if (name === 'Gas') {
          await this._clickElement(this.deleteExistingEnvelopeButton_2, 'Remove Existing Envelope Button');
          await expect(this.existingEnvelopeNameInput_2).not.toBeVisible();

        } else {
          await this._clickElement(this.deleteCreatedEnvelopeButton, 'Remove Created Envelope Button');
          await expect(this.createdEnvelopeNameInput).not.toBeVisible();
        }
        this.logger.step(`Deleted envelope: ${name}`);
        await expect(this.monthlyBudgetInfo).toContainText(initialBudget);
        this.logger.assertion('Envelope is deleted', true);
        this.logger.actionSuccess('Delete Envelope', { name });
      } catch (error) {
        this.logger.actionFailure('Delete Envelope', error as Error, { name });
        throw error;
      }
    }      

    async decideToFillEnvelopes(fill: boolean): Promise<void> {
      this.logger.actionStart('Decide to Fill Envelopes', { fill });
      try {
        if (fill) {
          await this._clickElement(this.fillEnvelopesButton, 'Fill Envelopes Button');
          this.logger.step('Clicked Fill Envelopes Button');

        } else {
          await this._clickElement(this.dontFillEnvelopesButton, 'Do Not Fill Envelopes Button');
          this.logger.actionSuccess('Decide to Not Fill Envelopes');
        }
      } catch (error) {
        this.logger.actionFailure('Decide to Fill Envelopes', error as Error, { fill });
        throw error;
      }
    }

}