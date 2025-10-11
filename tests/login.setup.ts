import { test as setup, expect } from "@playwright/test";
import { LoginPage } from "@pages/login";
import { chromium } from "@playwright/test";
import { logger } from "@utils/logger";



import fs from "fs";

setup("Login with valid credentials", async () => {
  logger.info("Starting login setup...");
  const browser = await chromium.launch();
  const context = await browser.newContext();
  const page = await context.newPage();

  const loginPage = new LoginPage(page);
  const username = process.env.USER_NAME || "";
  const password = process.env.PASSWORD || "";

  await loginPage.navigateTo();
  await loginPage.login(username, password);
  expect(page.url()).toBe("https://www.saucedemo.com/inventory.html");
  fs.mkdirSync("./tests/.auth", { recursive: true });
  await context.storageState({ path: "./tests/.auth/login.json" });
  await browser.close();
  logger.info("Login setup completed and storage state saved.");
});
