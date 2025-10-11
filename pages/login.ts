import { Page, Locator } from "@playwright/test";

export class LoginPage {
  // Selectors
  private readonly usernameInput: Locator;
  private readonly passwordInput: Locator;
  private readonly loginButton: Locator;

  // Constructor
  constructor(private page: Page) {
    this.usernameInput = this.page.getByTestId("username");
    this.passwordInput = this.page.getByTestId("password");
    this.loginButton = this.page.locator("#login-button");
  }

  // Actions
  async navigateTo() {
    await this.page.goto("/");
  }

  async login(username: string, password: string) {
    await this.usernameInput.fill(username);
    await this.passwordInput.fill(password);
    await this.loginButton.click();
  }
}
