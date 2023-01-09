const { test, expect } = require("@playwright/test");

// run tests in headful mode so you can see the browser
test.use({ headless: false, slowMo: 1000 });

test("my first test", async ({ page }) => {
  // go to Netflix.com
  await page.goto("https://www.netflix.com");

  // assert page title appears
  await expect(page.locator('[data-uia="hero-title"]')).toHaveText(
    "Unlimited movies, TV shows, and more."
  );
});

// ADD YOUR TESTS HERE!

test("Sign in button navigates to Sign in page", async({ page }) => {
  await page.goto("https://www.netflix.com");

  await page.getByRole('link', { name: /sign in/i}).click();

  await expect(page).toHaveURL(/.*login/);
});

test.describe("Email and Password input fields initial conditions", () => {
  test.use({ baseURL: 'https://www.netflix.com'});

  test("email input field is visible, editable, and empty", async ({ page }) => {
    await page.goto("/");

    await page.getByRole('link', { name: /sign in/i}).click();

    const emailInputField = page.getByLabel(/email or phone number/i);

    await expect(emailInputField).toBeVisible();
    await expect(emailInputField).toBeEditable();
    await expect(emailInputField).toBeEmpty();
  });

  test("password input field is visible, editable, and empty", async ({ page }) => {
    await page.goto("/");

    await page.getByRole('link', { name: /sign in/i}).click();

    const passwordInputField = page.getByLabel(/password/i);

    await expect(passwordInputField).toBeVisible();
    await expect(passwordInputField).toBeEditable();
    await expect(passwordInputField).toBeEmpty();
  });
});

test('"Remember Me" checkbox is checked by default', async ({ page }) => {
  await page.goto("https://www.netflix.com");

  await page.getByRole('link', { name: /sign in/i}).click();

  await expect(page.getByLabel(/remember me/i)).toBeChecked();
});

test("Show/Hide Password Button reveals when password input is in focus", async ({ page }) => {
  await page.goto("https://www.netflix.com");

  await page.getByRole('link', { name: /sign in/i}).click();

  const passwordInputField = page.getByLabel(/password/i);
  const passwordVisibilityButton = page.locator("#id_password_toggle");

  await expect(passwordVisibilityButton).toBeHidden();

  await passwordInputField.focus();

  await expect(passwordVisibilityButton).toBeVisible();

  await passwordInputField.blur();

  await expect(passwordVisibilityButton).toBeHidden();
});

test("Show/Hide Password Button reveals input value when toggled, then obscures it when toggled again", async ({ page }) => {
  await page.goto("https://www.netflix.com");

  await page.getByRole('link', { name: /sign in/i}).click();

  const passwordInputField = page.getByLabel(/password/i);
  const passwordVisibilityButton = page.locator("#id_password_toggle");

  await expect(passwordInputField).toHaveAttribute('type', 'password');

  await passwordInputField.focus();

  await expect(passwordVisibilityButton).toBeVisible();

  await passwordVisibilityButton.click();

  await expect(passwordInputField).toHaveAttribute('type', 'text');

  await passwordVisibilityButton.click();

  await expect(passwordInputField).toHaveAttribute('type', 'password');
});

test("Error alert appears when try to log in with invalid credentials", async ({ page }) => {
  await page.goto("https://www.netflix.com");

  await page.getByRole('link', { name: /sign in/i}).click();
  await page.getByLabel(/email or phone number/i).fill("bad@email.com");
  await page.getByLabel(/password/i).fill("password");
  await page.getByRole('button', { name: /sign in/i}).click();

  await expect(page.getByRole("alert")).toBeVisible();
});

test("Error messages appear when input fields left blank upon logging in", async({ page }) => {
  await page.goto("https://www.netflix.com");

  await page.getByRole('link', { name: /sign in/i}).click();
  await page.getByRole('button', { name: /sign in/i}).click();

  await expect(page.locator('[data-uia="password-field+error"]')).toBeVisible();
  await expect(page.locator('[data-uia="login-field+error"]')).toBeVisible();
});

test('"Need Help" anchor tag opens Login Help page', async ({ page }) => {
  await page.goto("https://www.netflix.com");

  await page.getByRole("link", { name: /sign in/i}).click();
  await page.getByRole("link", {name: /need help?/i}).click();

  await expect(page).toHaveURL(/.*LoginHelp/);
});

test('"Sign Up Now" anchor tag opens the Sign Up page', async ({ page }) => {
  await page.goto("https://www.netflix.com");

  await page.getByRole("link", { name: /sign in/i}).click();
  await page.getByRole("link", {name: /sign up now/i}).click();

  await expect(page).toHaveURL(/.*/);
});

test('Selects Spanish from Language select field, then selects English again, each time opening the corresponding page', async ({ page }) => {
  await page.goto("https://www.netflix.com");

  await page.getByRole("link", { name: /sign in/i}).click();

  const languageSelector = page.getByPlaceholder("lang-switcher");

  await languageSelector.selectOption("/us-es/login");

  await expect(page).toHaveURL(/.*us-es\/login/);

  await languageSelector.selectOption("/login");

  await expect(page).toHaveURL(/.*login/);
});
