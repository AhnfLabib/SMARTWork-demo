import { expect, test } from "@playwright/test";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

test("home search opens Ahnaf profile with tabs and capacity", async ({ page }) => {
  await page.goto("/");
  await page.getByLabel("Search people").fill("Ahnaf");
  await page.getByRole("button", { name: /Open profile for Ahnaf Labib/i }).click();
  await expect(page.getByRole("heading", { name: "Ahnaf Labib" })).toBeVisible();
  await expect(page.getByRole("tab", { name: "Overview" })).toBeVisible();
  await expect(page.getByRole("tab", { name: "Outcomes" })).toBeVisible();
  await expect(page.getByRole("tab", { name: "Competencies" })).toBeVisible();
  await expect(page.getByRole("tab", { name: "Reference" })).toBeVisible();
  await expect(page.getByText(/Project/i).first()).toBeVisible();
});

test("development page shows startup week and Westfield", async ({ page }) => {
  await page.goto("/#/person/ahnaf-labib/development");
  await expect(page.getByRole("heading", { name: "Ahnaf Labib" })).toBeVisible();
  await expect(page.getByText(/Week 1: Re-entry and Context Refresh/i)).toBeVisible();
  await expect(page.getByText(/Westfield/i).first()).toBeVisible();
});

test("review launch and manager form are available", async ({ page }) => {
  await page.goto("/#/person/ahnaf-labib/review");
  await expect(page.getByRole("link", { name: /Manager input/i })).toBeVisible();
  await expect(page.getByRole("link", { name: /Employee input/i })).toBeVisible();
  await expect(page.getByRole("link", { name: /Combine responses/i })).toBeVisible();
  await page.getByRole("link", { name: /Manager input/i }).click();
  await expect(page.getByRole("button", { name: /Export Manager response/i })).toBeVisible();
  await expect(page.getByText(/Rating baseline/i)).toBeVisible();
});

test("combine rejects invalid JSON", async ({ page }) => {
  await page.goto("/#/person/ahnaf-labib/review/combine");
  const badFile = path.join(__dirname, "fixtures/invalid.json");
  await page.locator('input[type="file"]').first().setInputFiles(badFile);
  await expect(page.getByText(/could not be read as JSON|does not look like a BBS/i)).toBeVisible();
});
