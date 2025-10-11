import { test, expect } from "@playwright/test";
import { LoginPage } from "@pages/login";
import { ProductsPage } from "@pages/products";
import { CartPage } from "@pages/cart";
import { CheckoutPage } from "@pages/checkout";
import { faker } from "@faker-js/faker";
import { logger } from "@utils/logger";

const firstName = faker.person.firstName();
const lastName = faker.person.lastName();
const postalCode = faker.location.zipCode();

test("Complete End-to-End Purchase Flow", async ({ page }) => {
    logger.info("Starting End-to-End Purchase Flow");

    const loginPage = new LoginPage(page);
    const productsPage = new ProductsPage(page);
    const cartPage = new CartPage(page);
    const checkoutPage = new CheckoutPage(page);

    const username = process.env.USER_NAME || "";
    const password = process.env.PASSWORD || "";

    await loginPage.navigateTo();
    await loginPage.login(username, password);
    await productsPage.addBackPackToCart();
    await productsPage.addBikeLightToCart();
    await productsPage.clickShoppingCart();
    await cartPage.proceedToCheckout();
    await checkoutPage.fillCheckoutForm(firstName, lastName, postalCode);
    await checkoutPage.finishCheckout();
    expect(page.url()).toContain("/checkout-complete.html");
    expect(await checkoutPage.getSuccessMessage()).toBe(
      "Thank you for your order!"
    );

    logger.info("End-to-End Purchase Flow completed successfully");
});