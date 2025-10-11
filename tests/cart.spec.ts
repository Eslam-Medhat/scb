import { test, expect } from "@playwright/test";
import { CartPage } from "@pages/cart";
import { logger } from "@utils/logger";


test.describe("Cart Page Tests", () => {
  let cartPage: CartPage;

  test.beforeEach(async ({ page }) => {
    cartPage = new CartPage(page);

    const injectedLocalStorage = [4, 0];

    // Pre-populate localStorage to simulate items already in cart
    await page.addInitScript((storage) => {
      localStorage.setItem("cart-contents", JSON.stringify(storage));
    }, injectedLocalStorage);

    logger.info(`Cart Page Tests > ${test.info().title} > Started`);

    await cartPage.navigateTo();
  });

  test.afterEach(async () => {
    logger.info(`Cart Page Tests > ${test.info().title} > Completed`);
  });

  test("should display correct number of items in cart", async () => {
    const itemCount = await cartPage.getCartItemCount();
    expect(itemCount).toBe(2);
  });

  test("should display correct item names", async () => {
    const itemNames = await cartPage.getCartItemNames();
    const expectedNames = ["Sauce Labs Backpack", "Sauce Labs Bike Light"];
    expect(itemNames).toEqual(expectedNames);
  });

  test("should display correct item quantities", async () => {
    const quantities = await cartPage.getCartItemQuantities();
    expect(quantities).toEqual([1, 1]);
  });

  test("should display cart counter with correct count", async () => {
    const cartCount = await cartPage.getShoppingCartCounter();
    expect(cartCount).toBe("2");
  });

  test("should display correct prices", async () => {
    const prices = await cartPage.getCartItemPrices();
    expect(prices).toContain(29.99);
    expect(prices).toContain(9.99);
  });

  test("should verify cart is empty after removing all items", async () => {
    await cartPage.removeAllItems();

    const isEmpty = await cartPage.isCartEmpty();
    expect(isEmpty).toBeTruthy();
  });

  test("should remove item from cart by name", async () => {
    await cartPage.removeItemByName("Sauce Labs Backpack");

    const itemCount = await cartPage.getCartItemCount();
    expect(itemCount).toBe(1);

    const itemNames = await cartPage.getCartItemNames();
    expect(itemNames).not.toContain("Sauce Labs Backpack");
    expect(itemNames).toContain("Sauce Labs Bike Light");
  });

  test("should update badge count when removing items one by one", async () => {
    // Initially 2 items
    let cartCount = await cartPage.getShoppingCartCounter();
    expect(cartCount).toBe("2");

    // Remove one item
    await cartPage.removeItemByName("Sauce Labs Backpack");
    cartCount = await cartPage.getShoppingCartCounter();
    expect(cartCount).toBe("1");
  });

  test("should proceed to checkout", async ({ page }) => {
    await cartPage.proceedToCheckout();
    expect(page.url()).toContain("/checkout-step-one.html");
  });

  test("should navigate back to products page", async ({ page }) => {
    await cartPage.continueShopping();
    await expect(page).toHaveURL("/inventory.html");
  });
});
