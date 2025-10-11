import { Page, Locator } from "@playwright/test";

type Items =
  | "backpack"
  | "bike-light"
  | "bolt-t-shirt"
  | "fleece-jacket"
  | "onesie";
  
export class ProductsPage {

  // Selectors
  private readonly backPackItem: Locator;
  private readonly bikeLightItem: Locator;
  private readonly removeBackPackItem: Locator;
  private readonly removeBikeLightItem: Locator;
  private readonly shoppingCartCounter: Locator;
  private readonly shoppingCartLink: Locator;
  private readonly sortDropdown: Locator;

  // Constructor
  constructor(private page: Page) {
    this.backPackItem = this.page.getByTestId(
      "add-to-cart-sauce-labs-backpack"
    );
    this.bikeLightItem = this.page.getByTestId(
      "add-to-cart-sauce-labs-bike-light"
    );
    this.removeBackPackItem = this.page.getByTestId(
      "remove-sauce-labs-backpack"
    );
    this.removeBikeLightItem = this.page.getByTestId(
      "remove-sauce-labs-bike-light"
    );
    this.shoppingCartCounter = this.page.getByTestId("shopping-cart-badge");
    this.shoppingCartLink = this.page.getByTestId("shopping-cart-link");
    this.sortDropdown = this.page.getByTestId("product-sort-container");
  }

  // Actions
  async navigateTo() {
    await this.page.goto("/inventory.html");
  }

  // This is a generic method to add item
  async addToCart(item: Items) {
    const itemLocator = this.page.getByTestId(`add-to-cart-sauce-labs-${item}`);
    await itemLocator.click();
  }

  async addBackPackToCart() {
    await this.backPackItem.click();
  }

  async addBikeLightToCart() {
    await this.bikeLightItem.click();
  }
  
  async removeBackPackFromCart() {
    await this.removeBackPackItem.click();
  }

  async removeBikeLightFromCart() {
    await this.removeBikeLightItem.click();
  }

  async sortProducts(option: string) {
    await this.sortDropdown.selectOption(option);
  }

  async getShoppingCartCounter() {
    return await this.shoppingCartCounter.textContent();
  }

  async isShoppingCartCounterAttached() {
    return await this.shoppingCartCounter.isHidden();
  }

  async sortedProductsPriceHighToLow() {
    const priceElements = this.page.locator(
      '[data-test="inventory-item-price"]'
    );
    const pricesString = await priceElements.allTextContents();
    const pricesNumber = pricesString.map((price) =>
      parseFloat(price.replace("$", ""))
    );
    return pricesNumber;
  }

  async clickShoppingCart() {
    await this.shoppingCartLink.click();
  }
  
}
