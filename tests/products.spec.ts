import { test, expect } from "@playwright/test";
import { ProductsPage } from "@pages/products";
import { logger } from "@utils/logger";

test.describe("Products Page Tests", () => {
  let productsPage: ProductsPage;

  test.beforeEach(async ({ page }) => {
    productsPage = new ProductsPage(page);
    logger.info(`Products Page Tests > ${test.info().title} > Started`);
    
    await productsPage.navigateTo();
  });

  test.afterEach(async () => {
    logger.info(`Products Page Tests > ${test.info().title} > Completed`);
  });

  test("Add products to cart", async () => {
    // Add Backpack to cart
    await productsPage.addBackPackToCart();
    let cartCount = await productsPage.getShoppingCartCounter();
    expect(cartCount).toBe("1");

    // Add Bike Light to cart
    await productsPage.addBikeLightToCart();
    cartCount = await productsPage.getShoppingCartCounter();
    expect(cartCount).toBe("2");
  });

  test("Sort products by high to low price", async () => {
    await productsPage.sortProducts("hilo");

    // Verify that products are sorted by price from high to low
    const pricesNumber = await productsPage.sortedProductsPriceHighToLow();

    const sortedPrices = [...pricesNumber].sort((a, b) => b - a);
    expect(pricesNumber).toEqual(sortedPrices);
  });
});

test("Remove products from cart", async ({ page }) => {
  const injectedLocalStorage = [4, 0];

  // Pre-populate localStorage to simulate items already in cart
  await page.addInitScript((storage) => {
    localStorage.setItem("cart-contents", JSON.stringify(storage));
  }, injectedLocalStorage);

  const productsPage = new ProductsPage(page);

  await productsPage.navigateTo();
  // Verify initial cart count
  let cartCount = await productsPage.getShoppingCartCounter();
  expect(cartCount).toBe("2");

  // Remove Backpack from cart
  await productsPage.removeBackPackFromCart();
  cartCount = await productsPage.getShoppingCartCounter();
  expect(cartCount).toBe("1");

  // Remove Bike Light from cart
  await productsPage.removeBikeLightFromCart();

  expect(await productsPage.isShoppingCartCounterAttached()).toBeTruthy();
});
