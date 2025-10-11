import { Page, Locator, expect } from "@playwright/test";

export class CheckoutPage {
  // Selectors
  private readonly page: Page;
  private readonly firstNameInput: Locator;
  private readonly lastNameInput: Locator;
  private readonly postalCodeInput: Locator;
  private readonly continueButton: Locator;
  private readonly checkoutItems: Locator;
  private readonly checkoutItemNames: Locator;
  private readonly checkoutPrices: Locator;
  private readonly checkoutQuantities: Locator;
  private readonly subtotalLabel: Locator;
  private readonly taxLabel: Locator;
  private readonly totalLabel: Locator;
  private readonly finishButton: Locator;
  private readonly cancelButton: Locator;
  private readonly errorMessage: Locator;
  private readonly successMessage: Locator;
  private readonly shoppingCartCounter: Locator;
  private readonly backHomeButton: Locator;

  // Constructor
  constructor(page: Page) {
    this.page = page;
    this.firstNameInput = page.getByTestId("firstName");
    this.lastNameInput = page.getByTestId("lastName");
    this.postalCodeInput = page.getByTestId("postalCode");
    this.continueButton = page.getByTestId("continue");
    this.checkoutItems = page.getByTestId("inventory-item");
    this.checkoutItemNames = page.getByTestId("inventory-item-name");
    this.checkoutPrices = page.getByTestId("inventory-item-price");
    this.checkoutQuantities = page.getByTestId("item-quantity");
    this.subtotalLabel = page.getByTestId("subtotal-label");
    this.taxLabel = page.getByTestId("tax-label");
    this.totalLabel = page.getByTestId("total-label");
    this.finishButton = page.getByTestId("finish");
    this.cancelButton = page.getByTestId("cancel");
    this.errorMessage = page.getByTestId("error");
    this.successMessage = page.getByTestId("complete-header");
    this.shoppingCartCounter = this.page.getByTestId("shopping-cart-badge");
    this.backHomeButton = page.getByTestId("back-to-products");
  }

  // Actions
  async navigateTo() {
    await this.page.goto("/checkout-step-one.html");
  }

  async fillCheckoutForm(
    firstName: string,
    lastName: string,
    postalCode: string
  ) {
    await this.firstNameInput.fill(firstName);
    await this.lastNameInput.fill(lastName);
    await this.postalCodeInput.fill(postalCode);
    await this.continueButton.click();
  }

  async getSubtotal() {
    return this.subtotalLabel.textContent();
  }

  async getTax() {
    return this.taxLabel.textContent();
  }

  async getTotal() {
    return this.totalLabel.textContent();
  }

  async finishCheckout() {
    await this.finishButton.click();
  }

  async cancelCheckout() {
    await this.cancelButton.click();
  }

  async sumItemPrices() {
    const pricesText = await this.checkoutPrices.allTextContents();
    let total = 0;
    for (const priceText of pricesText) {
      total += parseFloat(priceText.replace("$", ""));
    }
    return total;
  }

  async sumSubtotalAndTax() {
    const subtotalText = (await this.getSubtotal()) as string;
    const taxText = (await this.getTax()) as string;
    const subtotal = parseFloat(subtotalText.replace("Item total: $", ""));
    const tax = parseFloat(taxText.replace("Tax: $", ""));
    return subtotal + tax;
  }

  async getCartItemCount() {
    return await this.checkoutItems.count();
  }

  async getCartItemNames() {
    return await this.checkoutItemNames.allTextContents();
  }

  async getCartItemPrices() {
    const pricesText = await this.checkoutPrices.allTextContents();
    const prices: number[] = [];
    for (const priceText of pricesText) {
      prices.push(parseFloat(priceText.replace("$", "")));
    }
    return prices;
  }

  async getCartItemQuantities() {
    const quantitiesString = await this.checkoutQuantities.allTextContents();
    const quantities: number[] = [];
    for (const quantityString of quantitiesString) {
      quantities.push(parseInt(quantityString));
    }
    return quantities;
  }
  async getErrorMessage() {
    expect(this.errorMessage).toBeVisible();
    return this.errorMessage.textContent();
  }

  async getSuccessMessage() {
    expect(this.successMessage).toBeVisible();
    return this.successMessage.textContent();
  }

  async isShoppingCartCounterAttached() {
    return await this.shoppingCartCounter.isHidden();
  }

  async clickBackHomeButton() {
    await this.backHomeButton.click();
  }
}
