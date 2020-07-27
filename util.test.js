const puppeteer = require("puppeteer");

const { generateText, checkAndGenerate, validateInput } = require("./util");
const { TestScheduler } = require("jest");

//unit tests!
test("should output the string of name and age", () => {
  const text = generateText("Laila", 19);
  expect(text).toBe("Laila (19 years old)");
  const text2 = generateText("Farah", 17);
  expect(text2).toBe("Farah (17 years old)");
});

test("should output data-less text", () => {
  const text = generateText("", null);
  expect(text).toBe(" (null years old)");
});

test("should validate input correctly", () => {
  //test data1
  let isValid = validateInput("Laila", true, false);
  expect(isValid).toBe(true);
  //test data2
  isValid = validateInput(" ", true, false);
  expect(isValid).toBe(false);
  //test data3
  isValid = validateInput(" ", false, false);
  expect(isValid).toBe(true);
  //test data4
  isValid = validateInput("19", false, true);
  expect(isValid).toBe(true);
  //test data5
  isValid = validateInput("19l", false, true);
  expect(isValid).toBe(false);
});

//integration test since the func we're testing has dependancies
test("should generate a valid test output", () => {
  const text = checkAndGenerate("Laila", 19);
  expect(text).toBe("Laila (19 years old)");
});

//e2e tests
test("should create an element with text", async () => {
  const browser = await puppeteer.launch({
    // headless: false,
    // slowMo: 80,
    // args: ["--window-size=1920,1080"],
    headless: true,
  });
  const page = await browser.newPage();
  await page.goto("http://127.0.0.1:5500/index.html");
  await page.click("input#name");
  await page.type("input#name", "Farah");
  await page.click("input#age");
  await page.type("input#age", "18");
  await page.click("#btnAddUser");
  const finalText = await page.$eval(".user-item", (el) => el.textContent);
  expect(finalText).toBe("Farah (18 years old)");
}, 30000);
