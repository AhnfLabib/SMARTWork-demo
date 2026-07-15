const { chromium } = require("playwright");
const path = require("path");

(async () => {
  const browser = await chromium.launch({
    executablePath: "C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe"
  });
  const page = await browser.newPage({ viewport: { width: 1440, height: 1000 }, deviceScaleFactor: 1 });
  const target = `file://${path.resolve("outputs/index.html").replace(/\\/g, "/")}`;

  await page.goto(target, { waitUntil: "load" });
  await page.getByLabel("Search the role map").fill("Gary");
  await page.getByRole("button", { name: /Open profile for Gary Raikes/ }).click();
  await page.getByRole("heading", { name: "Gary Raikes" }).waitFor();
  await page.getByText("Senior Vice President, Business Development & Growth Strategy").first().waitFor();
  await page.screenshot({ path: "work/gary-profile-check.png", fullPage: false });
  await browser.close();
  console.log("gary profile click-through ok");
})();
