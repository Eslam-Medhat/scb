import { Page, Locator } from "@playwright/test";

export class CartPage {
  // Selectors
  private readonly page: Page;
  private readonly cartItems: Locator;
  private readonly cartItemNames: Locator;
  private readonly cartItemPrices: Locator;
  private readonly cartItemQuantities: Locator;
  private readonly continueShoppingButton: Locator;
  private readonly shoppingCartCounter: Locator;
  private readonly checkoutButton: Locator;

  // Constructor
  constructor(page: Page) {
    this.page = page;
    this.cartItems = page.getByTestId("inventory-item");
    this.cartItemNames = page.getByTestId("inventory-item-name");
    this.cartItemPrices = page.getByTestId("inventory-item-price");
    this.cartItemQuantities = page.getByTestId("item-quantity");
    this.continueShoppingButton = page.getByTestId("continue-shopping");
    this.shoppingCartCounter = this.page.getByTestId("shopping-cart-badge");
    this.checkoutButton = page.getByTestId("checkout");
  }

  // Actions
  async navigateTo() {
    await this.page.goto("/cart.html");
  }

  async getCartItemCount() {
    return await this.cartItems.count();
  }

  async getCartItemNames() {
    return await this.cartItemNames.allTextContents();
  }

  async getCartItemPrices() {
    const pricesText = await this.cartItemPrices.allTextContents();
    const prices: number[] = [];
    for (const priceText of pricesText) {
      prices.push(parseFloat(priceText.replace("$", "")));
    }
    return prices;
  }

  async getCartItemQuantities() {
    const quantitiesText = await this.cartItemQuantities.allTextContents();
    const quantities: number[] = [];
    for (const qtyText of quantitiesText) {
      quantities.push(parseInt(qtyText));
    }
    return quantities;
  }

  async removeItemByName(itemName: string) {
    const testId = `remove-${itemName.toLowerCase().replace(/\s+/g, "-")}`;
    await this.page.getByTestId(testId).click();
  }

  async removeAllItems() {
    const removeButtons = this.page.locator('[data-test^="remove-"]');
    const count = await removeButtons.count();
    for (let i = count - 1; i >= 0; i--) {
      await removeButtons.nth(i).click();
    }
  }

  async continueShopping() {
    await this.continueShoppingButton.click();
  }

  async proceedToCheckout() {
    await this.checkoutButton.click();
  }

  async isCartEmpty() {
    const count = await this.cartItems.count();
    return count === 0 ? true : false;
  }

  async getShoppingCartCounter() {
    return await this.shoppingCartCounter.textContent();
  }
}
