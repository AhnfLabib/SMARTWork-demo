const { chromium } = require("playwright");
const path = require("path");

(async () => {
  const browser = await chromium.launch({
    executablePath: "C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe"
  });
  const page = await browser.newPage({ viewport: { width: 1440, height: 1000 }, deviceScaleFactor: 1 });
  const target = `file://${path.resolve("outputs/index.html").replace(/\\/g, "/")}`;

  await page.goto(target, { waitUntil: "load" });
  await page.getByRole("button", { name: /Open profile for Jack Dougher/i }).click();
  await page.getByRole("button", { name: /360 review worksheet/i }).click();
  await page.getByRole("heading", { name: "Jack Dougher" }).waitFor();
  await page.getByRole("heading", { name: "Three-Level Competency Map" }).waitFor();
  await page.locator(".competency-map-card").first().locator("input[type='radio']").nth(1).check();
  await page.locator(".review-field textarea").first().fill("Example notes for review validation.");
  await page.getByRole("button", { name: /Print \/ Save PDF/i }).waitFor();
  await page.screenshot({ path: "work/review-worksheet-check.png", fullPage: false });
  await page.evaluate(() => document.body.classList.add("review-printing"));
  await page.emulateMedia({ media: "print" });
  await page.pdf({ path: "work/review-worksheet-check.pdf", format: "Letter", printBackground: true });
  await browser.close();
  console.log("review worksheet ok");
})();
