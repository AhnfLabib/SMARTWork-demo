const { chromium } = require("playwright");
const path = require("path");

(async () => {
  const browser = await chromium.launch({
    executablePath: "C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe"
  });
  const page = await browser.newPage({ viewport: { width: 1440, height: 1000 }, deviceScaleFactor: 1 });
  const target = `file://${path.resolve("outputs/index.html").replace(/\\/g, "/")}`;

  console.log("opening");
  await page.goto(target, { waitUntil: "load" });
  console.log("searching");
  await page.getByLabel("Search the role map").fill("Ahnaf");
  console.log("opening profile");
  await page.getByRole("button", { name: /Open profile for Ahnaf Labib/i }).click();
  console.log("opening development");
  await page.getByRole("button", { name: /Development plan/i }).click();
  console.log("checking content");
  await page.locator(".development-card").waitFor();
  const detailText = await page.locator("#detailRoot").textContent({ timeout: 5000 });
  if (!detailText.includes("Ahnaf Labib")) throw new Error("Ahnaf name not found.");
  if (!detailText.includes("30-Day Startup Plan")) throw new Error("30-Day Startup Plan not found.");
  if (!detailText.includes("July 13, 2026 - August 11, 2026")) throw new Error("Startup period not found.");
  if (!detailText.includes("Week 1: Re-entry and Context Refresh")) throw new Error("Startup week flow not found.");
  if (!detailText.includes("Westfield")) throw new Error("Startup assignment area not found.");
  if (!detailText.includes("Quarterly Plan")) throw new Error("Quarterly Plan not found.");
  if (!detailText.includes("Semiannual Plan")) throw new Error("Semiannual Plan not found.");
  if (!detailText.includes("Project & Workstream Coordination")) throw new Error("Focus area not found.");
  await page.locator(".development-card .review-field textarea").first().fill("Development plan validation note.");
  await page.evaluate(() => document.querySelector(".detail-panel")?.scrollTo(0, 0));
  console.log("screenshot");
  await page.screenshot({ path: "work/development-plan-check.png", fullPage: false });

  console.log("pdf");
  await page.evaluate(() => document.body.classList.add("development-printing"));
  await page.emulateMedia({ media: "print" });
  await page.pdf({ path: "work/development-plan-check.pdf", format: "Letter", printBackground: true });

  await browser.close();
  console.log("development plan ok");
})();
