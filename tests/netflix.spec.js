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

  // click on Sign in button
  await page.getByRole('link', { name: /sign in/i}).click();

  // assert page url is 'https://www.netflix.com/login/'
  await expect(page).toHaveURL(/.*login/);
});

test.describe("Email and Password input fields initial conditions", () => {
  test.use({ baseURL: 'https://www.netflix.com'});

  test("Email input field is visible, editable, and empty", async ({ page }) => {
    await page.goto("/");

    await page.getByRole('link', { name: /sign in/i}).click();

    // locate Email input field
    const emailInputField = page.getByLabel(/email or phone number/i);

    // assert Email input field exists
    await expect(emailInputField).toBeVisible();
    // assert Email input field is editable
    await expect(emailInputField).toBeEditable();
    // assert Email input field is empty
    await expect(emailInputField).toBeEmpty();
  });

  test("Password input field is visible, editable, and empty", async ({ page }) => {
    await page.goto("/");

    await page.getByRole('link', { name: /sign in/i}).click();

    // locate Password input field
    const passwordInputField = page.getByLabel(/password/i);

    // assert Password input field exists
    await expect(passwordInputField).toBeVisible();
    // assert Password input field is editable
    await expect(passwordInputField).toBeEditable();
    // assert Password input field is empty
    await expect(passwordInputField).toBeEmpty();
  });
});

test('"Remember Me" checkbox is checked by default', async ({ page }) => {
  await page.goto("https://www.netflix.com");

  await page.getByRole('link', { name: /sign in/i}).click();

  // assert Remember Me checkbox is checked
  await expect(page.getByLabel(/remember me/i)).toBeChecked();
});

test("Show/Hide Password Button reveals when password input is in focus", async ({ page }) => {
  await page.goto("https://www.netflix.com");

  await page.getByRole('link', { name: /sign in/i}).click();

  // locate Password input field
  const passwordInputField = page.getByLabel(/password/i);
  // locate Show/Hide Password Button
  const passwordVisibilityButton = page.locator("#id_password_toggle");

  // assert Show/Hide Password Button is hidden
  await expect(passwordVisibilityButton).toBeHidden();

  // focus on Password input field
  await passwordInputField.focus();

  // assert Show/Hide Password Button is visible
  await expect(passwordVisibilityButton).toBeVisible();

  // unfocus from Password input field
  await passwordInputField.blur();

  // assert Show/Hide Password Button is hidden
  await expect(passwordVisibilityButton).toBeHidden();
});

test("Show/Hide Password Button reveals input value when toggled, then obscures it when toggled again", async ({ page }) => {
  await page.goto("https://www.netflix.com");

  await page.getByRole('link', { name: /sign in/i}).click();

  // locate Password input field
  const passwordInputField = page.getByLabel(/password/i);
  // locate Show/Hide Password Button
  const passwordVisibilityButton = page.locator("#id_password_toggle");

  // assert Password input field has the type of "password"
  await expect(passwordInputField).toHaveAttribute('type', 'password');

  // focus on Password input field
  await passwordInputField.focus();

  // assert Show/Hide Password Button is visible
  await expect(passwordVisibilityButton).toBeVisible();

  // click Show/Hide Password Button
  await passwordVisibilityButton.click();

  // assert Password input field has the type of "text"
  await expect(passwordInputField).toHaveAttribute('type', 'text');

  // click Show/Hide Password Button
  await passwordVisibilityButton.click();

  // assert Password input field has the type of "password"
  await expect(passwordInputField).toHaveAttribute('type', 'password');
});

test("Error alert appears when try to log in with invalid credentials", async ({ page }) => {
  await page.goto("https://www.netflix.com");

  await page.getByRole('link', { name: /sign in/i}).click();

  // fill Email input field with "bad@email.com"
  await page.getByLabel(/email or phone number/i).fill("bad@email.com");
  // fill Password input field with "password"
  await page.getByLabel(/password/i).fill("password");
  // click Sign in button
  await page.getByRole('button', { name: /sign in/i}).click();

  // assert "Try again..." alert is visible
  await expect(page.getByRole("alert")).toBeVisible();
});

test("Error messages appear when input fields left blank upon logging in", async({ page }) => {
  await page.goto("https://www.netflix.com");

  await page.getByRole('link', { name: /sign in/i}).click();

  // click Sign in button
  await page.getByRole('button', { name: /sign in/i}).click();

  // assert Email field error div is visible
  await expect(page.locator('[data-uia="login-field+error"]')).toBeVisible();
  // assert Password field error div is visible
  await expect(page.locator('[data-uia="password-field+error"]')).toBeVisible();
});

test('"Need Help" anchor tag opens Login Help page', async ({ page }) => {
  await page.goto("https://www.netflix.com");

  await page.getByRole("link", { name: /sign in/i}).click();

  // click "Need Help" anchor tag
  await page.getByRole("link", {name: /need help?/i}).click();

  // assert url is "https://www.netflix.com/LoginHelp/"
  await expect(page).toHaveURL(/.*LoginHelp/);
});

test('"Sign Up Now" anchor tag opens the Sign Up page', async ({ page }) => {
  await page.goto("https://www.netflix.com");

  await page.getByRole("link", { name: /sign in/i}).click();

  // click "Sign Up Now" anchor tag
  await page.getByRole("link", {name: /sign up now/i}).click();

  // assert url is "https://www.netflix.com"
  await expect(page).toHaveURL(/.*/);
});

test('Selects Spanish from Language select field, then selects English again, each time opening the corresponding page', async ({ page }) => {
  await page.goto("https://www.netflix.com");

  await page.getByRole("link", { name: /sign in/i}).click();

  // locate Language select field
  const languageSelector = page.getByPlaceholder("lang-switcher");

  // select option with value "/us-es/login" on Language select field
  await languageSelector.selectOption("/us-es/login");

  // assert url is "https://www.netflix.com/us-es/login/"
  await expect(page).toHaveURL(/.*us-es\/login/);

  // select option with value "/login" on Language select field
  await languageSelector.selectOption("/login");

  // assert url is "https://www.netflix.com/login/"
  await expect(page).toHaveURL(/.*login/);
});
