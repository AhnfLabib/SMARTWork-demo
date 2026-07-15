const { chromium } = require("playwright");
const path = require("path");

(async () => {
  const browser = await chromium.launch({
    executablePath: "C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe"
  });
  const page = await browser.newPage({ viewport: { width: 1440, height: 1100 }, deviceScaleFactor: 1 });
  const target = `file://${path.resolve("outputs/index.html").replace(/\\/g, "/")}`;

  await page.goto(target, { waitUntil: "load" });
  await page.getByRole("heading", { name: "BBS Current Role Map" }).waitFor();
  await page.getByLabel("Search the role map").fill("Westfield");
  await page.getByRole("button", { name: /Open profile for Ahnaf Labib/i }).waitFor();
  await page.getByText("Capacity plan: Project 80% / Product 15% / Internal 5%").first().waitFor();
  await page.screenshot({ path: "work/capacity-map-check.png", fullPage: false });

  await page.getByRole("button", { name: /Open profile for Ahnaf Labib/i }).click();
  await page.getByText("Capacity effective July 6, 2026").waitFor();
  await page.getByRole("heading", { name: "Current Capacity Assignment" }).waitFor();
  await page.getByText("Westfield").first().waitFor();
  await page.getByText("Data & IT Work Group").first().waitFor();
  await page.getByText("WINS / SMARTWork").first().waitFor();
  await page.screenshot({ path: "work/capacity-profile-check.png", fullPage: false });

  await browser.close();
  console.log("capacity map ok");
})();
