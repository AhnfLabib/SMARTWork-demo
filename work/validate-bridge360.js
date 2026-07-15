/**
 * Bridge360 smoke entry — prefer Playwright in app/:
 *   cd app && npm run build && npx playwright test
 *
 * Legacy Edge validators under work/validate-*.js targeted the old outputs/
 * static app. Use the Playwright suite for Bridge360 coverage.
 */
console.log("Use: cd app && npm run build && npx playwright test");
