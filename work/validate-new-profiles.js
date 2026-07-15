const { chromium } = require("playwright");
const path = require("path");

(async () => {
  const browser = await chromium.launch({
    executablePath: "C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe"
  });
  const page = await browser.newPage({ viewport: { width: 1440, height: 1100 }, deviceScaleFactor: 1 });
  const target = `file://${path.resolve("outputs/index.html").replace(/\\/g, "/")}`;
  await page.goto(target, { waitUntil: "load" });

  for (const name of ["Brady Trebley", "Austin Cooper"]) {
    await page.getByRole("button", { name: new RegExp(`Open profile for ${name}`) }).click();
    await page.getByRole("heading", { name }).waitFor();
    await page.getByRole("button", { name: "Close" }).click();
  }

  await browser.close();
  console.log("new profile click-through ok");
})();
