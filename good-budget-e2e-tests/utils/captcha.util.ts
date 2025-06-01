import { Page } from '@playwright/test';

// This utility function attempts to bypass reCAPTCHA checkboxes on GoodBudget signup page.
// As of now it is not used in any tests because it is not the right approach to handle reCAPTCHA.

/**
 * Attempts to interact with reCAPTCHA checkbox if it appears.
 */
export async function maybeBypassRecaptcha(page: Page): Promise<void> {
  try {
    const iframeSelector = 'iframe[title="reCAPTCHA"]';

    // Wait up to 5s for the iframe to appear
    const iframeLocator = page.locator(iframeSelector);
    const appears = await iframeLocator.isVisible({ timeout: 5000 }).catch(() => false);

    if (!appears) {
      console.log('🟡 No CAPTCHA iframe detected. Continuing...');
      return;
    }

    console.log('🔍 CAPTCHA iframe found, attempting to interact...');
    const frame = page.frameLocator(iframeSelector);
    const checkbox = frame.locator('.recaptcha-checkbox-border');

    // Wait for checkbox, then click it
    await checkbox.waitFor({ state: 'visible', timeout: 5000 });
    await checkbox.click();

    console.log('✅ CAPTCHA checkbox clicked successfully.');
  } catch (err) {
    console.warn('⚠️ CAPTCHA interaction failed or was skipped:', err instanceof Error ? err.message : err);
  }
}
