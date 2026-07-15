const { chromium } = require("playwright");
const path = require("path");

(async () => {
  const browser = await chromium.launch({
    executablePath: "C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe"
  });
  const page = await browser.newPage({ viewport: { width: 1440, height: 1000 }, deviceScaleFactor: 1 });
  const target = `file://${path.resolve("outputs/index.html").replace(/\\/g, "/")}`;
  await page.goto(target, { waitUntil: "load" });
  await page.screenshot({ path: "work/brand-home.png", fullPage: false });
  await page.getByRole("button", { name: /Open profile for Jack Dougher/ }).click();
  await page.screenshot({ path: "work/brand-profile.png", fullPage: false });
  await browser.close();
})();
