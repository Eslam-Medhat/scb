# Sauce Demo E2E Testing Project

This project contains automated end-to-end tests for the Sauce Demo application using Playwright with TypeScript and the Page Object Model design pattern.

## Prerequisites

- Node.js (v14 or higher)
- npm (comes with Node.js)
- Git (for cloning the repository)
- A modern web browser (Chrome/Chromium will be installed by Playwright)
- VS Code (recommended, but optional)

## Installation

1. Clone the repository:
```bash
git clone https://github.com/Eslam-Medhat/scb.git
cd scb
```

2. Install project dependencies:
```bash
npm install
```

3. Install Playwright browsers:
```bash
npx playwright install
```

If you're on Linux, you might need to install additional dependencies:
```bash
npx playwright install-deps
```

## Project Structure with Page Object Model Design

```
├── pages/              # Page Object Models
│   ├── cart.ts
│   ├── checkout.ts
│   ├── login.ts
│   └── products.ts
├── tests/             # Test Specifications
│   ├── .auth/        # Saved Authentication State
│   ├── cart.spec.ts
│   ├── checkout.spec.ts
│   ├── login.setup.ts
│   └── products.spec.ts
├── utils/            # Utilities
│   └── logger.ts
└── playwright.config.ts
```
implementation:
- Each page has its own class (e.g., `LoginPage`, `ProductsPage`)
- Page classes encapsulate locators and actions
- Tests only interact with page methods, never directly with elements
- Reusable actions are defined in page classes

## Authentication Approach

Using Playwright's storage state feature to save and reuse authentication state.

This means:
- Login happens once during setup
- All subsequent tests start authenticated
- No need to log in for each test
- Faster test execution
- More reliable than UI login

## Local Storage Injection for Cart Items

In the tests, I inject cart items directly into localStorage before page load.

Benefits of this approach:
- Tests start with known cart state
- No need to add items via UI first
- Faster test execution
- More focused testing of cart functionality

## Running Tests

1. Create .env file on root and copy values from example.env

2. Run all tests:
```bash
npx playwright test
```
OR

```bash
npm run test
```

3. Run specific test file:
```bash
npx playwright test tests/products.spec.ts
```

4. Run tests in headed mode (visible browser):
```bash
npx playwright test --headed
```

5. Run tests with HTML report:
```bash
npx playwright test --reporter=html
```

6. Update authentication state (if needed):
```bash
npx playwright test --project=setup
```

## Viewing Test Reports

After test execution, view the HTML report:
```bash
npx playwright show-report
```

This will open a detailed HTML report with test results, screenshots, and traces (if enabled).
