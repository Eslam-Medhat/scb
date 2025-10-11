import { test, expect } from "@playwright/test";
import { CheckoutPage } from "@pages/checkout";
import { faker } from "@faker-js/faker";
import { logger } from "@utils/logger";

const firstName = faker.person.firstName();
const lastName = faker.person.lastName();
const postalCode = faker.location.zipCode();

test.describe("Checkout Page - Step One (Information)", () => {
  let checkoutPage: CheckoutPage;

  test.beforeEach(async ({ page }) => {
    checkoutPage = new CheckoutPage(page);

    const injectedLocalStorage = [4, 0];

    // Pre-populate localStorage to simulate items already in cart
    await page.addInitScript((storage) => {
      localStorage.setItem("cart-contents", JSON.stringify(storage));
    }, injectedLocalStorage);
    logger.info(`Checkout Page Tests > ${test.info().title} > Started`);
    await checkoutPage.navigateTo();
  });
  test.afterEach(async () => {
    logger.info(`Checkout Page Tests > ${test.info().title} > Completed`);
  });

  test("should successfully fill checkout form with valid data", async ({
    page,
  }) => {
    await checkoutPage.fillCheckoutForm(firstName, lastName, postalCode);
    expect(page.url()).toContain("/checkout-step-two.html");
  });

  test("should show error when first name is empty", async () => {
    await checkoutPage.fillCheckoutForm("", lastName, postalCode);
    const expectedErrorMessage = "Error: First Name is required";
    expect(await checkoutPage.getErrorMessage()).toBe(expectedErrorMessage);
  });

  test("should show error when last name is empty", async () => {
    await checkoutPage.fillCheckoutForm(firstName, "", postalCode);
    const expectedErrorMessage = "Error: Last Name is required";
    expect(await checkoutPage.getErrorMessage()).toBe(expectedErrorMessage);
  });

  test("should show error when postal code is empty", async () => {
    await checkoutPage.fillCheckoutForm(firstName, lastName, "");
    const expectedErrorMessage = "Error: Postal Code is required";
    expect(await checkoutPage.getErrorMessage()).toBe(expectedErrorMessage);
  });

  test("should cancel checkout and return to cart", async ({ page }) => {
    await checkoutPage.cancelCheckout();
    expect(page.url()).toContain("/cart.html");
  });
});

test.describe("Checkout Page - Step Two (Overview)", () => {
  let checkoutPage: CheckoutPage;

  test.beforeEach(async ({ page }) => {
    checkoutPage = new CheckoutPage(page);

    const injectedLocalStorage = [4, 0];

    // Pre-populate localStorage to simulate items already in cart
    await page.addInitScript((storage) => {
      localStorage.setItem("cart-contents", JSON.stringify(storage));
    }, injectedLocalStorage);

    await checkoutPage.navigateTo();
    await checkoutPage.fillCheckoutForm(firstName, lastName, postalCode);
    expect(page.url()).toContain("/checkout-step-two.html");
  });

  test("should display correct number of items", async () => {
    const itemCount = await checkoutPage.getCartItemCount();
    expect(itemCount).toBe(2);
  });

  test("should display correct item names", async () => {
    const itemNames = await checkoutPage.getCartItemNames();

    const expectedNames = ["Sauce Labs Backpack", "Sauce Labs Bike Light"];

    expect(itemNames).toEqual(expectedNames);
  });

  test("should display correct item prices", async () => {
    const prices = await checkoutPage.getCartItemPrices();
    expect(prices).toContain(29.99);
    expect(prices).toContain(9.99);
  });

  test("should display correct item quantities", async () => {
    const quantities = await checkoutPage.getCartItemQuantities();
    expect(quantities).toEqual([1, 1]);
  });

  test("should display subtotal", async () => {
    const subtotal = await checkoutPage.getSubtotal();
    expect(subtotal).toContain("Item total: $");
    expect(subtotal).toContain("39.98");
  });

  test("should display tax amount", async () => {
    const tax = await checkoutPage.getTax();
    expect(tax).toContain("Tax: $");
    expect(tax).toContain("3.20");
  });

  test("should display total amount", async () => {
    const total = await checkoutPage.getTotal();
    expect(total).toContain("Total: $");
    expect(total).toContain("43.18");
  });

  test("should calculate total correctly (subtotal + tax)", async () => {
    const calculatedTotal = await checkoutPage.sumSubtotalAndTax();

    const totalString = (await checkoutPage.getTotal()) as string;
    const totalNumber = parseFloat(totalString.replace("Total: $", ""));
    expect(calculatedTotal).toEqual(totalNumber);
  });

  test("should verify subtotal equals sum of item prices", async () => {
    const prices = await checkoutPage.sumItemPrices();

    const subtotalString = (await checkoutPage.getSubtotal()) as string;
    const subtotalNumber = parseFloat(
      subtotalString.replace("Item total: $", "")
    );

    expect(subtotalNumber).toEqual(prices);
  });

  test("should finish checkout successfully", async ({ page }) => {
    await checkoutPage.finishCheckout();
    expect(page.url()).toContain("/checkout-complete.html");
  });

  test("should cancel checkout from overview and return to inventory", async ({
    page,
  }) => {
    await checkoutPage.cancelCheckout();
    expect(page.url()).toContain("/inventory.html");
  });
});

test.describe("Checkout Page - Complete", () => {
  let checkoutPage: CheckoutPage;

  test.beforeEach(async ({ page }) => {
    checkoutPage = new CheckoutPage(page);

    const injectedLocalStorage = [4, 0];

    // Pre-populate localStorage to simulate items already in cart
    await page.addInitScript((storage) => {
      localStorage.setItem("cart-contents", JSON.stringify(storage));
    }, injectedLocalStorage);

    await checkoutPage.navigateTo();
    await checkoutPage.fillCheckoutForm(firstName, lastName, postalCode);
    await checkoutPage.finishCheckout();
    expect(page.url()).toContain("/checkout-complete.html");
    expect(await checkoutPage.isShoppingCartCounterAttached()).toBeTruthy();
  });

  test("should display success message", async () => {
    const message = await checkoutPage.getSuccessMessage();
    expect(message).toBe("Thank you for your order!");
  });

  test("should navigate back to products page after clicking back home button", async ({
    page,
  }) => {
    await checkoutPage.clickBackHomeButton();
    expect(page.url()).toContain("/inventory.html");
  });
});

test("checkout out of empty cart", async ({ page }) => {
  const checkoutPage = new CheckoutPage(page);
  await checkoutPage.navigateTo();

  await checkoutPage.fillCheckoutForm(firstName, lastName, postalCode);

  const total = await checkoutPage.getTotal();
  expect(total).toContain("Total: $");
  expect(total).toContain("0.00");

  await checkoutPage.finishCheckout();
  const message = await checkoutPage.getSuccessMessage();
  expect(message).toBe("Thank you for your order!");
  expect(page.url()).toContain("/checkout-complete.html");
});
