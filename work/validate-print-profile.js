const { chromium } = require("playwright");
const path = require("path");

(async () => {
  const browser = await chromium.launch({
    executablePath: "C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe"
  });
  const page = await browser.newPage({ viewport: { width: 1440, height: 1100 }, deviceScaleFactor: 1 });
  const target = `file://${path.resolve("outputs/index.html").replace(/\\/g, "/")}`;
  await page.goto(target, { waitUntil: "load" });
  await page.getByRole("button", { name: /Open profile for Jack Dougher/ }).click();
  await page.getByRole("heading", { name: "Jack Dougher" }).waitFor();
  await page.locator(".collapsible-section").evaluateAll(sections => {
    sections.forEach(section => {
      section.open = true;
    });
  });
  await page.emulateMedia({ media: "print" });
  await page.pdf({
    path: "work/print-profile-jack.pdf",
    format: "Letter",
    printBackground: true
  });
  await browser.close();
})();
