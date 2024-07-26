import { expect, test } from '../fixtures/base';
import Wallet from '../pages/wallet';

test.describe('Swap Flow ME', () => {
  // Enables the feature flag for Swap
  test.beforeEach(async ({ page }) => {
    await page.route('https://api-3.xverse.app/v1/app-features', (route) => {
      route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          CROSS_CHAIN_SWAPS: { enabled: true },
        }),
      });
    });
  });

  test('Cancel swap token via ME', async ({ page, extensionId }) => {
    // Restore wallet and setup Testnet network
    const wallet = new Wallet(page);
    await wallet.setupTest(extensionId, 'SEED_WORDS1', false);

    // get own BTC  & Ordinals Address for address check on review page
    await wallet.allUpperButtons.nth(1).click();
    const selfBTC = await wallet.getAddress(wallet.buttonCopyBitcoinAddress);

    // Reload the page to close the modal window for the addresses as the X button needs to have a better locator
    await page.reload();

    await wallet.checkVisualsStartpage();

    // Save initial Balance for later Balance checks
    const initialBTCBalance = await wallet.getTokenBalance('Bitcoin');

    await wallet.allUpperButtons.nth(2).click();
    await wallet.checkVisualsSwapPage();

    // Select the first Coin
    await wallet.buttonDownArrow.nth(0).click();

    // Had problems with loading of all tokens so I check that 'Bitcoin' is loaded
    await expect(wallet.labelTokenSubtitle.getByText('Bitcoin').first()).toBeVisible();
    await expect(await wallet.divTokenRow.count()).toBeGreaterThan(0);
    await wallet.divTokenRow.first().click();
    await expect(wallet.nameToken.first()).not.toContainText('Select asset');
    await expect(wallet.imageToken.first()).toBeVisible();
    await expect(wallet.buttonGetQuotes).toBeDisabled();

    // Select the second Coin
    await wallet.buttonDownArrow.nth(1).click();
    // Had problems with loading of all tokens so I check that a 'DOG' is loaded
    await expect(wallet.labelTokenSubtitle.getByText('DOG').first()).toBeVisible();
    await expect(await wallet.divTokenRow.count()).toBeGreaterThan(0);
    await wallet.divTokenRow.first().click();
    await expect(wallet.nameToken.last()).not.toContainText('Select asset');
    await expect(wallet.imageToken.last()).toBeVisible();
    await expect(wallet.buttonGetQuotes).toBeDisabled();

    // tried a calculated value but had multiple problems with that, for now we stick to a specific value
    const swapAmount = 0.00000546;

    const numericUSDValue = await wallet.fillSwapAmount(swapAmount);

    // Save rune token name
    const tokenName1 = await wallet.nameToken.last().innerText();

    await wallet.buttonGetQuotes.click();
    await expect(wallet.nameSwapPlace.last()).toBeVisible();
    await expect(wallet.quoteAmount.last()).toBeVisible();
    await expect(wallet.infoMessage.last()).toBeVisible();
    await expect(wallet.buttonSwapPlace.last()).toBeVisible();

    await wallet.buttonSwapPlace.filter({ hasText: 'Magic Eden' }).click();
    await expect(wallet.itemUTXO.first()).toBeVisible();

    // click only on a UTXO with value from 1000 e(not enough funds for higher)
    await wallet.itemUTXO.filter({ hasText: '1,000' }).first().locator('input').click();
    await expect(wallet.buttonNext).toBeVisible();
    await expect(wallet.textUSD).toBeVisible();
    await expect(wallet.quoteAmount).toBeVisible();

    const quoteAmount = await wallet.quoteAmount.innerText();
    const numericQuoteValue = parseFloat(quoteAmount.replace(/[^0-9.]/g, ''));
    await expect(numericQuoteValue).toBeGreaterThan(0);

    const usdAmount = await wallet.textUSD.innerText();
    const numericUSDValueSwap = parseFloat(usdAmount.replace(/[^0-9.]/g, ''));
    await expect(numericUSDValueSwap).toBeGreaterThan(0);

    await wallet.buttonNext.click();

    await wallet.checkVisualsQuotePage(tokenName1, false, numericQuoteValue, numericUSDValueSwap);

    // We can only continue if the FeeRate is above 0
    await wallet.waitForTextAboveZero(wallet.feeAmount, 30000);

    // Save the current fee amount for comparison
    const originalFee = await wallet.feeAmount.innerText();
    const numericOriginalFee = parseFloat(originalFee.replace(/[^0-9.]/g, ''));
    await expect(numericOriginalFee).toBeGreaterThan(0);

    // Click on edit Fee button
    await wallet.buttonEditFee.click();
    await expect(wallet.buttonSelectFee.first()).toBeVisible();
    await expect(wallet.labelTotalFee.first()).toBeVisible();

    // Compare medium fee to previous saved fee
    const mediumFee = await wallet.labelTotalFee.last().innerText();
    const numericMediumFee = parseFloat(mediumFee.replace(/[^0-9.]/g, ''));
    await expect(numericMediumFee).toBe(numericOriginalFee);

    // Save high fee rate for comparison
    const highFee = await wallet.labelTotalFee.first().innerText();
    const numericHighFee = parseFloat(highFee.replace(/[^0-9.]/g, ''));

    // Switch to high fee
    await wallet.buttonSelectFee.first().click();

    const newFee = await wallet.feeAmount.innerText();
    const numericNewFee = parseFloat(newFee.replace(/[^0-9.]/g, ''));
    await expect(numericNewFee).toBe(numericHighFee);

    await wallet.buttonSwap.click();
    await wallet.checkVisualsSendTransactionReview('swap', false, selfBTC);

    const sendRuneAmount = await wallet.sendRuneAmount.innerText();
    const sendAmountNumerical = parseFloat(sendRuneAmount.replace(/[^0-9.]/g, ''));
    await expect(numericQuoteValue).toEqual(sendAmountNumerical);

    // Check Rune token name
    await expect(wallet.nameRune).toContainText(tokenName1);

    // Cancel the transaction
    await expect(wallet.buttonCancel).toBeEnabled();
    await wallet.buttonCancel.click();

    // Check Startpage
    await wallet.checkVisualsStartpage();

    // Check BTC Balance after cancel the transaction
    const balanceAfterCancel = await wallet.getTokenBalance('Bitcoin');
    await expect(initialBTCBalance).toEqual(balanceAfterCancel);
  });
});
