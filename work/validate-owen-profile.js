const { chromium } = require("playwright");
const path = require("path");

(async () => {
  console.log("launching");
  const browser = await chromium.launch({
    executablePath: "C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe"
  });
  console.log("browser launched");
  const page = await browser.newPage({ viewport: { width: 1440, height: 1000 }, deviceScaleFactor: 1 });
  const target = `file://${path.resolve("outputs/index.html").replace(/\\/g, "/")}`;

  console.log("opening page");
  await page.goto(target, { waitUntil: "load" });
  console.log("searching");
  await page.getByLabel("Search the role map").fill("Owen");
  console.log("clicking");
  await page.getByRole("button", { name: /Open profile for Owen Nguyen/i }).click();
  console.log("checking heading");
  await page.getByRole("heading", { name: "Owen Nguyen" }).waitFor();
  const detailText = await page.locator("#detailRoot").textContent({ timeout: 5000 });
  if (!detailText.includes("Financial Analysis & Product Strategy Intern")) {
    throw new Error("Owen title was not found in the role detail.");
  }
  if (!detailText.includes("Financial Assessment Data Becomes Actionable Models")) {
    throw new Error("Owen outcomes were not found in the role detail.");
  }
  if (!detailText.includes("Financial and Investment Analysts")) {
    throw new Error("Owen O*NET alignment was not found in the role detail.");
  }
  console.log("screenshot");
  await page.screenshot({ path: "work/owen-profile-check.png", fullPage: false });

  console.log("closing");
  await browser.close();
  console.log("Owen profile click-through verified.");
})();
