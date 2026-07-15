const { chromium } = require("playwright");
const path = require("path");

(async () => {
  const browser = await chromium.launch({
    executablePath: "C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe"
  });
  const page = await browser.newPage({ viewport: { width: 1440, height: 1000 }, deviceScaleFactor: 1 });
  const target = `file://${path.resolve("outputs/index.html").replace(/\\/g, "/")}`;

  await page.goto(target, { waitUntil: "load" });
  await page.getByLabel("Search the role map").fill("Austin");
  await page.getByRole("button", { name: /Open profile for Austin Cooper/ }).click();
  await page.getByRole("heading", { name: "Austin Cooper" }).waitFor();
  await page.getByRole("button", { name: "Close" }).click();
  await page.getByRole("button", { name: "Clear" }).click();
  await page.getByRole("button", { name: /Interns/ }).click();
  await page.getByRole("button", { name: /Interns/ }).getAttribute("aria-expanded").then(value => {
    if (value !== "false") throw new Error("Interns level did not collapse");
  });

  await browser.close();
  console.log("front page search and collapse controls ok");
})();
