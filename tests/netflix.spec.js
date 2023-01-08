const { test, expect } = require("@playwright/test");

// run tests in headful mode so you can see the browser
test.use({ headless: true, slowMo: 1000 });

test("my first test", async ({ page }) => {
  // go to Netflix.com
  await page.goto("https://www.netflix.com");

  // assert page title appears
  await expect(page.locator('[data-uia="hero-title"]')).toHaveText(
    "Unlimited movies, TV shows, and more."
  );
});

// ADD YOUR TESTS HERE!

// go to sign in page
// try to sign in with invalid email/pass

// -------------------------------------------

test("sign in page exists", async({ page }) => {
  await page.goto("https://www.netflix.com");

  await page.getByRole('link', { name: /sign in/i}).click();

  await expect(page).toHaveURL(/.*login/);
  const response = await page.request.get(page.url());
  await expect(response).toBeOK();

  await expect(page.getByRole('heading', { name: /sign in/i})).toBeVisible(); // may not need this
});

// test initial confitions:

// email or phone number field exists
// -||- is empty

// password field exists
// -||- is empty


test.describe("initial conditions", () => {
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

  test('"Remember Me" checkbox is checked by default', async ({ page }) => {
    await page.goto("/");
    await page.getByRole('link', { name: /sign in/i}).click();

    await expect(page.getByLabel(/remember me/i)).toBeChecked();
  })
})


// when click "show" it shows the password

test("Password Visibility Button reveals when password input is in focus", async ({ page }) => {
  await page.goto("https://www.netflix.com");
  await page.getByRole('link', { name: /sign in/i}).click();

  const passwordInputField = page.getByLabel(/password/i);
  const passwordVisibilityButton = page.locator("#id_password_toggle");

  await expect(passwordVisibilityButton).toBeHidden();
  await passwordInputField.focus();
  await expect(passwordVisibilityButton).toBeVisible();
  await passwordInputField.blur();
  await expect(passwordVisibilityButton).toBeHidden();


})

test("Password Visibility Button reveals input value when toggled, then obscures it when toggled again", async ({ page }) => {
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
})

test("Error alert appears when try to log in with invalid credentials", async ({ page }) => {
  await page.goto("https://www.netflix.com");
  await page.getByRole('link', { name: /sign in/i}).click();

  await page.getByLabel(/email or phone number/i).fill("bad@email.com");
  await page.getByLabel(/password/i).fill("password");

  await page.getByRole('button', { name: /sign in/i}).click();

  await expect(page.getByRole("alert")).toBeVisible();
})

test("Error messages appear when input fields left blank upon logging in", async({ page }) => {
  await page.goto("https://www.netflix.com");
  await page.getByRole('link', { name: /sign in/i}).click();

  await page.getByRole('button', { name: /sign in/i}).click();

  await expect(page.locator('[data-uia="password-field+error"]')).toBeVisible();
  await expect(page.locator('[data-uia="login-field+error"]')).toBeVisible();
})

// test("password input field is visible, editable, and empty", async )

// checkbox "remember me" is unchecked

// "need help" a tag exists
// -||- takes you to the page that has "forgot email/password" text

// "sign up now" a tag exists
// -||- takes you to the page that has "sign up now" text

// check language select field if exists and if works
