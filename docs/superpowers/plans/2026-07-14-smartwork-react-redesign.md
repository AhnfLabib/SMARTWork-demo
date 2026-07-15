# SMARTWork React Redesign Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Rebuild the BBS Role Clarity Library as **SMARTWork**, a React + Vite + TypeScript HashRouter SPA with full feature parity, summary-first profile tabs, and manager-optimized development/360 workflows, shippable as a local static `dist/`.

**Architecture:** Client-only Vite React app under `app/`. Domain data lives in typed modules (`roles`, `org`, `capacity`, `development`). Pure helpers in `src/lib/` own search, capacity math, development plan resolution, and 360 JSON validate/combine. Pages use HashRouter routes; print uses CSS print modes. Legacy `outputs/` remains the migration source until cutover.

**Tech Stack:** React 18, TypeScript, Vite, React Router (HashRouter), Vitest, Playwright, CSS variables (BBS palette), no backend.

**Spec:** `docs/superpowers/specs/2026-07-14-smartwork-react-redesign-design.md`

---

## Global Constraints

- Product name in UI/document title: **SMARTWork** (not “Role Clarity Library”).
- Keep official BBS logos and palette: `#28334a`, `#046a38`, `#1a4e8a`, `#f68d2e`, `#a72b2a`.
- Person IDs stay stable (`ahnaf-labib`, `jack-dougher`, …).
- Private response export schema field remains `"schema": "bbs-role-tool-response-v1"` for compatibility; also include `schemaVersion: 1` and `product: "smartwork"`.
- Supported local use: `npm run build` + static serve of `dist/` (not `file://`).
- Do not delete `outputs/` in this plan.
- No Vercel wiring in this plan.
- Commit after each task with a clear message.
- Prefer small focused files; do not recreate a 3k-line monolith.

---

## File Structure

```
app/
  package.json                          # name: "smartwork"
  vite.config.ts
  vitest.config.ts
  index.html
  tsconfig.json
  tsconfig.app.json
  tsconfig.node.json
  public/
    assets/brand/                       # copied from outputs/assets/brand
    assets/source-profiles/             # copied from outputs/assets/source-profiles
    assets/source-documents/            # copied from outputs/assets/source-documents
  src/
    main.tsx
    App.tsx                             # HashRouter + routes
    vite-env.d.ts
    styles/
      tokens.css                        # BBS CSS variables + fonts
      global.css
      print.css                         # print modes
      pages.css                         # layout compositions
    types/
      role.ts
      org.ts
      capacity.ts
      development.ts
      review.ts
    data/
      roles.ts                          # migrated ROLE_DATA
      org.ts                            # ORG_TREE
      capacity.ts
      development.ts                    # authored plans only
      index.ts                          # lookups
    lib/
      search.ts
      capacity.ts
      developmentPlan.ts
      reviewPayload.ts
      download.ts
      competency.ts
    components/
      AppShell.tsx
      PersonContextBar.tsx
      OrgChart.tsx
      OrgSearch.tsx
      DirectoryPanel.tsx
      ProfileHero.tsx
      CapacityStrip.tsx
      CapacityDetail.tsx
      ProfileTabs.tsx
      DataTable.tsx
      NotFound.tsx
    pages/
      HomePage.tsx
      ProfilePage.tsx
      DevelopmentPage.tsx
      ReviewLaunchPage.tsx
      PrivateResponsePage.tsx
      ReviewCombinePage.tsx
  scripts/
    migrate-data.mjs                    # one-shot role path rewrite helper if needed
work/
  e2e/
    smoke.spec.ts                       # Playwright against Vite preview/dist
docs/superpowers/plans/2026-07-14-smartwork-react-redesign.md
```

---

### Task 1: Scaffold SMARTWork Vite + React + TypeScript

**Files:**
- Create: `app/package.json`, `app/vite.config.ts`, `app/vitest.config.ts`, `app/tsconfig.json`, `app/tsconfig.app.json`, `app/tsconfig.node.json`, `app/index.html`, `app/src/main.tsx`, `app/src/App.tsx`, `app/src/vite-env.d.ts`

- [ ] **Step 1: Create Vite React-TS app in `app/`**

```bash
cd /Users/ahnaflabib/Documents/Projects/build-a-professional-static-web-app
npm create vite@latest app -- --template react-ts
cd app
npm install
npm install react-router-dom
npm install -D vitest jsdom @testing-library/react @testing-library/jest-dom @testing-library/user-event
```

- [ ] **Step 2: Set package name and scripts**

In `app/package.json`, set `"name": "smartwork"` and ensure scripts include:

```json
{
  "name": "smartwork",
  "private": true,
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "tsc -b && vite build",
    "preview": "vite preview",
    "test": "vitest run",
    "test:watch": "vitest"
  }
}
```

- [ ] **Step 3: Configure Vitest in `app/vite.config.ts`**

```ts
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  base: "./",
  test: {
    environment: "jsdom",
    globals: true,
    setupFiles: "./src/test/setup.ts"
  }
});
```

Create `app/src/test/setup.ts`:

```ts
import "@testing-library/jest-dom/vitest";
```

- [ ] **Step 4: Set document title SMARTWork in `app/index.html`**

```html
<title>SMARTWork | Bridge Builder Strategies</title>
```

- [ ] **Step 5: Minimal App shell that renders SMARTWork**

`app/src/App.tsx`:

```tsx
export default function App() {
  return (
    <main>
      <h1>SMARTWork</h1>
      <p>Bridge Builder Strategies</p>
    </main>
  );
}
```

- [ ] **Step 6: Verify build**

```bash
cd app && npm run build && npm test -- --passWithNoTests
```

Expected: build succeeds; tests exit 0 (or passWithNoTests).

- [ ] **Step 7: Commit**

```bash
git add app
git commit -m "$(cat <<'EOF'
Scaffold SMARTWork Vite React TypeScript app.

EOF
)"
```

---

### Task 2: Design tokens, AppShell, HashRouter routes skeleton

**Files:**
- Create: `app/src/styles/tokens.css`, `app/src/styles/global.css`, `app/src/components/AppShell.tsx`, `app/src/components/NotFound.tsx`
- Modify: `app/src/main.tsx`, `app/src/App.tsx`

- [ ] **Step 1: Add BBS tokens**

`app/src/styles/tokens.css`:

```css
:root {
  --navy: #28334a;
  --green: #046a38;
  --blue: #1a4e8a;
  --orange: #f68d2e;
  --red: #a72b2a;
  --ink: #172033;
  --muted: #647086;
  --line: #d9e0ea;
  --soft: #f4f7fa;
  --panel: #ffffff;
  --font-display: "Source Serif 4", "Georgia", serif;
  --font-body: "Source Sans 3", "Segoe UI", sans-serif;
}
```

Load Source Serif 4 + Source Sans 3 from Google Fonts in `index.html` `<head>` (print-safe, not Inter/Roboto).

- [ ] **Step 2: Implement AppShell**

`AppShell` shows BBS color logo (`/assets/brand/bbs-logo-color-lockup.png` — assets added in Task 3; use path now), product name **SMARTWork**, eyebrow “Bridge Builder Strategies”, and note: “Current-state documentation — no gap analysis, scoring, or compensation guidance.” Logo + title navigate home via `<Link to="/">`.

- [ ] **Step 3: Wire HashRouter**

`App.tsx` routes:

```tsx
import { HashRouter, Routes, Route } from "react-router-dom";
import AppShell from "./components/AppShell";
import NotFound from "./components/NotFound";

function HomePlaceholder() {
  return <p>Org map coming next.</p>;
}

export default function App() {
  return (
    <HashRouter>
      <AppShell>
        <Routes>
          <Route path="/" element={<HomePlaceholder />} />
          <Route path="/person/:id" element={<p>Profile</p>} />
          <Route path="/person/:id/development" element={<p>Development</p>} />
          <Route path="/person/:id/review" element={<p>Review</p>} />
          <Route path="/person/:id/review/manager" element={<p>Manager</p>} />
          <Route path="/person/:id/review/employee" element={<p>Employee</p>} />
          <Route path="/person/:id/review/combine" element={<p>Combine</p>} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </AppShell>
    </HashRouter>
  );
}
```

- [ ] **Step 4: Manual check**

```bash
cd app && npm run dev
```

Open shown URL; confirm header says SMARTWork; `#/person/test` hits placeholder or not-found route works for unknown paths after person pages exist (NotFound for `*`).

- [ ] **Step 5: Commit**

```bash
git add app/src app/index.html
git commit -m "$(cat <<'EOF'
Add SMARTWork shell, tokens, and HashRouter route skeleton.

EOF
)"
```

---

### Task 3: Copy assets and migrate domain data modules

**Files:**
- Create: `app/src/types/*.ts`, `app/src/data/*.ts`
- Copy: brand + source assets into `app/public/assets/`

- [ ] **Step 1: Copy assets**

```bash
mkdir -p app/public/assets
cp -R outputs/assets/brand app/public/assets/
cp -R outputs/assets/source-profiles app/public/assets/
cp -R outputs/assets/source-documents app/public/assets/
```

- [ ] **Step 2: Define types**

`app/src/types/role.ts` — `Role` with fields matching legacy objects:

```ts
export type Triple = [string, string, string];
export type Pair = [string, string];

export interface WorkStyleCard {
  title: string;
  items: string[];
}

export interface WorkStyleGuide {
  basis: string;
  cards: WorkStyleCard[];
}

export interface Role {
  id: string;
  person: string;
  sourceTitle: string;
  standardizedTitle: string;
  roleFamily: string;
  reportsTo: string;
  function: string;
  primaryUse: string;
  observedWorkProfile: string;
  rolePurpose: string;
  outcomes: Triple[];
  responsibilities: Triple[];
  competencies: Triple[];
  skills: string[];
  tools: string[];
  onet: [string, string, string, string][];
  workStyleGuide?: WorkStyleGuide;
  designNote: string;
  sources: string[];
}
```

Also define `OrgNode`, `CapacityProfile`, `DevelopmentPlan` in sibling type files mirroring structures in `outputs/app.js` (`ORG_TREE`, `CAPACITY_DATA`, `DEVELOPMENT_PLAN_DATA` / `buildDefaultDevelopmentPlan` return shape).

- [ ] **Step 3: Migrate roles**

Convert `outputs/data.js` `ROLE_DATA` into `app/src/data/roles.ts` exporting `export const ROLES: Role[] = [...]`.
Rewrite every `sources` entry from `assets/...` to `/assets/...` (leading slash for Vite public).

Minimal mechanic (allowed):

```bash
# From repo root — adapt ROLE_DATA array into TS export manually or via node one-liner;
# verify ROLES.length matches legacy count (18).
node -e "const fs=require('fs'); const s=fs.readFileSync('outputs/data.js','utf8'); const m=s.match(/id: \"/g); console.log(m.length);"
```

Expected count: **18**.

- [ ] **Step 4: Migrate org, capacity, authored development**

- `app/src/data/org.ts` — copy `ORG_TREE` from `outputs/app.js` as typed `OrgNode`.
- `app/src/data/capacity.ts` — copy `CAPACITY_DATA`.
- `app/src/data/development.ts` — copy authored `DEVELOPMENT_PLAN_DATA` only (defaults built in lib).

- [ ] **Step 5: Lookup helpers**

`app/src/data/index.ts`:

```ts
import { ROLES } from "./roles";
import { ORG_TREE } from "./org";
import { CAPACITY_DATA } from "./capacity";
import { DEVELOPMENT_PLANS } from "./development";
import type { Role } from "../types/role";

export function getRoleById(id: string): Role | undefined {
  return ROLES.find((r) => r.id === id);
}

export function getAllRoles(): Role[] {
  return ROLES;
}

export { ORG_TREE, CAPACITY_DATA, DEVELOPMENT_PLANS };
```

- [ ] **Step 6: Smoke import test**

Create `app/src/data/roles.test.ts`:

```ts
import { describe, it, expect } from "vitest";
import { ROLES, getRoleById } from "./index";

describe("roles data", () => {
  it("includes 18 people including Ahnaf and Jack", () => {
    expect(ROLES).toHaveLength(18);
    expect(getRoleById("ahnaf-labib")?.person).toBe("Ahnaf Labib");
    expect(getRoleById("jack-dougher")?.person).toBe("Jack Dougher");
  });
});
```

Run: `cd app && npm test`

Expected: PASS.

- [ ] **Step 7: Commit**

```bash
git add app/public/assets app/src/types app/src/data
git commit -m "$(cat <<'EOF'
Migrate SMARTWork role, org, capacity, and development data.

EOF
)"
```

---

### Task 4: Search / filter helpers (TDD)

**Files:**
- Create: `app/src/lib/search.ts`, `app/src/lib/search.test.ts`

- [ ] **Step 1: Write failing tests**

```ts
import { describe, it, expect } from "vitest";
import { roleMatchesQuery, filterRoles } from "./search";
import { ROLES } from "../data";

describe("filterRoles", () => {
  it("finds Ahnaf by name substring", () => {
    const result = filterRoles(ROLES, { query: "ahnaf", function: "All", family: "All", reportsTo: "All" });
    expect(result.map((r) => r.id)).toContain("ahnaf-labib");
  });

  it("returns empty for nonsense query", () => {
    const result = filterRoles(ROLES, { query: "zzzz-no-match", function: "All", family: "All", reportsTo: "All" });
    expect(result).toHaveLength(0);
  });
});
```

- [ ] **Step 2: Run to verify fail**

`cd app && npm test -- src/lib/search.test.ts` → FAIL (module missing).

- [ ] **Step 3: Implement**

Search across person, titles, function, skills, tools, purpose, responsibilities text (case-insensitive). Filters: exact match on `function`, `roleFamily`, `reportsTo` when not `"All"`.

- [ ] **Step 4: Tests pass + commit**

```bash
git add app/src/lib/search.ts app/src/lib/search.test.ts
git commit -m "$(cat <<'EOF'
Add role search and filter helpers for SMARTWork.

EOF
)"
```

---

### Task 5: Capacity helpers (TDD)

**Files:**
- Create: `app/src/lib/capacity.ts`, `app/src/lib/capacity.test.ts`

- [ ] **Step 1: Failing test for Ahnaf totals**

Use `CAPACITY_DATA` for `ahnaf-labib`. Assert grouped percents sum to 100 and category totals match: Project 80, Product 15, Internal 5 (15+15+30+20=80; 10+5=15; 5=5).

- [ ] **Step 2: Implement `getCapacityProfile`, `capacityTotals`, `groupedAllocations`

- [ ] **Step 3: Pass + commit**

```bash
git commit -m "$(cat <<'EOF'
Add capacity allocation helpers for SMARTWork.

EOF
)"
```

---

### Task 6: Development plan resolve (TDD)

**Files:**
- Create: `app/src/lib/developmentPlan.ts`, `app/src/lib/developmentPlan.test.ts`

- [ ] **Step 1: Failing tests**

```ts
it("returns authored startup plan for Ahnaf", () => {
  const plan = getDevelopmentPlan("ahnaf-labib");
  expect(plan?.startupWeeks?.length).toBeGreaterThan(0);
  expect(plan?.period).toContain("2026");
});

it("builds a default plan for Jack without authored startup weeks", () => {
  const plan = getDevelopmentPlan("jack-dougher");
  expect(plan?.personId).toBe("jack-dougher");
  expect(plan?.quarterlyGoals?.length).toBeGreaterThan(0);
});
```

Port `buildDefaultDevelopmentPlan` / `getDevelopmentPlan` behavior from `outputs/app.js` (including Adelai startup special case).

- [ ] **Step 2: Implement + pass + commit**

```bash
git commit -m "$(cat <<'EOF'
Add development plan resolver with authored and default plans.

EOF
)"
```

---

### Task 7: Review payload validate + alignment (TDD)

**Files:**
- Create: `app/src/types/review.ts`, `app/src/lib/reviewPayload.ts`, `app/src/lib/reviewPayload.test.ts`, `app/src/lib/download.ts`

- [ ] **Step 1: Define payload type**

```ts
export type ReviewKind = "360-review" | "development-plan";
export type ReviewAudience = "manager" | "employee";

export interface ResponseField {
  key: string;
  group: string;
  label: string;
  value: string;
}

export interface PrivateResponsePayload {
  schema: "bbs-role-tool-response-v1";
  schemaVersion: 1;
  product: "smartwork";
  kind: ReviewKind;
  audience: ReviewAudience;
  personId: string;
  person: string;
  roleTitle: string;
  roleFamily: string;
  exportedAt: string;
  selections: ResponseField[];
  fields: ResponseField[];
}
```

- [ ] **Step 2: Tests for `validateResponsePayload`**

- Reject wrong schema
- Reject wrong personId
- Reject wrong kind
- Reject wrong audience
- Accept valid payload (legacy without `schemaVersion`/`product` still OK if `schema` + core fields match — implement: require `schema === "bbs-role-tool-response-v1"`; treat missing schemaVersion as legacy-ok)

- [ ] **Step 3: Tests for `buildAlignmentAnalysis`**

Port scoring from `outputs/app.js` (`ratingScore`, `comparisonStatus`, gap recommendations). Assert gap≥2 → `priority`, gap 0 → `aligned`.

- [ ] **Step 4: Implement + `downloadJsonFile` / `downloadTextFile` in `download.ts` + commit**

```bash
git commit -m "$(cat <<'EOF'
Add 360 response validation, alignment analysis, and download helpers.

EOF
)"
```

---

### Task 8: Home page — org map + search

**Files:**
- Create: `app/src/pages/HomePage.tsx`, `app/src/components/OrgChart.tsx`, `app/src/components/OrgSearch.tsx`, `app/src/styles/pages.css`
- Modify: `app/src/App.tsx`

- [ ] **Step 1: Implement OrgChart from `ORG_TREE`**

- Render hierarchy with person name + title.
- Collapse/expand children where `children` exist.
- Clicking a person with `profileId` navigates to `#/person/:profileId`.
- Visual: one dominant composition (not dashboard cards). Use BBS accent rail sparingly.

- [ ] **Step 2: OrgSearch**

Controlled search input filters visible people (dim/hide non-matches). Clear button. Meta text: “Showing all…” / “N matches”.

- [ ] **Step 3: Wire HomePage into route `/`**

- [ ] **Step 4: Manual verify**

Search “Ahnaf” → click → URL hash includes `person/ahnaf-labib`.

- [ ] **Step 5: Commit**

```bash
git commit -m "$(cat <<'EOF'
Add SMARTWork home org map and search.

EOF
)"
```

---

### Task 9: Directory filters panel

**Files:**
- Create: `app/src/components/DirectoryPanel.tsx`
- Modify: `app/src/pages/HomePage.tsx`

- [ ] **Step 1: Collapsed-by-default directory**

`<details>` or equivalent labeled “Role directory & filters”. Contains function / family / reports-to selects + role list linking to profiles. Uses `filterRoles`. Empty state + Clear filters.

- [ ] **Step 2: Commit**

```bash
git commit -m "$(cat <<'EOF'
Add collapsible role directory filters on SMARTWork home.

EOF
)"
```

---

### Task 10: Profile page — hero, capacity, tabs

**Files:**
- Create: `app/src/pages/ProfilePage.tsx`, `app/src/components/ProfileHero.tsx`, `app/src/components/CapacityStrip.tsx`, `app/src/components/CapacityDetail.tsx`, `app/src/components/ProfileTabs.tsx`, `app/src/components/DataTable.tsx`, `app/src/components/PersonContextBar.tsx`, `app/src/lib/competency.ts`
- Modify: `app/src/App.tsx`

- [ ] **Step 1: PersonContextBar**

Links: Profile | Development | 360 (active state by route). Shows person + standardized title.

- [ ] **Step 2: ProfileHero summary-first**

Always show: logo/title block, reportsTo/function, rolePurpose, capacity strip if present, top 5 outcome titles, CTAs to Development + 360, Print menu stub, Export summary, Home.

- [ ] **Step 3: ProfileTabs**

Tabs: Overview | Outcomes | Competencies | Reference with content from spec §4. Port competency expectation map logic from `outputs/app.js` into `competency.ts`.

- [ ] **Step 4: Unknown id → NotFound**

- [ ] **Step 5: Manual check Ahnaf capacity strip shows Project/Product/Internal percents**

- [ ] **Step 6: Commit**

```bash
git commit -m "$(cat <<'EOF'
Add SMARTWork profile page with summary hero and tabs.

EOF
)"
```

---

### Task 11: Profile export + print modes

**Files:**
- Create: `app/src/styles/print.css`
- Modify: `app/src/pages/ProfilePage.tsx`, `app/src/main.tsx` (import print.css)

- [ ] **Step 1: Export summary**

`exportSummary(role)` downloads a `.txt` with person, titles, purpose, outcomes, responsibilities, competencies (port content structure from `exportSummary` in `outputs/app.js`).

- [ ] **Step 2: Print modes**

Buttons set `document.body.dataset.printMode` to `profile-summary` or `profile-full`, call `window.print()`, clear on `afterprint`.

`print.css` hides shell chrome; summary mode shows hero + purpose + top outcomes; full shows all tab panels.

- [ ] **Step 3: Commit**

```bash
git commit -m "$(cat <<'EOF'
Add profile summary export and print modes.

EOF
)"
```

---

### Task 12: Development plan page

**Files:**
- Create: `app/src/pages/DevelopmentPage.tsx`
- Modify: `app/src/App.tsx`, `app/src/styles/print.css`

- [ ] **Step 1: Render plan via `getDevelopmentPlan(id)`**

Sections: basis, optional 30-day startup (weeks/assignments/support/reflection), quarterly, semiannual, focus areas, manager support, employee reflection. Local note textareas (component state only). Export notes + print mode `development`.

- [ ] **Step 2: Verify Ahnaf shows “Week 1: Re-entry and Context Refresh” and Westfield**

- [ ] **Step 3: Commit**

```bash
git commit -m "$(cat <<'EOF'
Add SMARTWork development plan page with print support.

EOF
)"
```

---

### Task 13: 360 launch + private response forms

**Files:**
- Create: `app/src/pages/ReviewLaunchPage.tsx`, `app/src/pages/PrivateResponsePage.tsx`
- Modify: `app/src/App.tsx`

- [ ] **Step 1: ReviewLaunchPage**

Short copy + three links/buttons: Manager input → `.../review/manager`, Employee → `.../review/employee`, Combine → `.../review/combine`. Do **not** dump full rating baselines on this page (baselines live on private form pages).

- [ ] **Step 2: PrivateResponsePage**

For audience param: outcome Emerging/Meeting/Strong radios + notes; competency Level I/II/III; manager-support fields as in legacy. Export JSON via `buildPrivateResponsePayload` + `downloadJsonFile` with filename `${id}-360-review-${audience}-response.json`.

- [ ] **Step 3: Commit**

```bash
git commit -m "$(cat <<'EOF'
Add SMARTWork 360 launch and private response export forms.

EOF
)"
```

---

### Task 14: Combine responses + alignment report

**Files:**
- Create: `app/src/pages/ReviewCombinePage.tsx`
- Modify: `app/src/styles/print.css`

- [ ] **Step 1: Two file inputs** (manager + employee)

On load, validate each with `validateResponsePayload`. Show specific errors; do not merge on failure.

- [ ] **Step 2: When both valid, show side-by-side fields + `buildAlignmentAnalysis` report + shared notes textarea + print mode `combined`

- [ ] **Step 3: Commit**

```bash
git commit -m "$(cat <<'EOF'
Add SMARTWork 360 combine workflow and alignment report.

EOF
)"
```

---

### Task 15: Visual polish + responsive layout

**Files:**
- Modify: `app/src/styles/*.css`, `AppShell.tsx`, key page components as needed

- [ ] **Step 1: Visual pass against spec §7**

- SMARTWork wordmark beside BBS logo
- Home = one composition
- Profile hero first viewport calm (no card soup)
- Mobile stack for home; sticky person context
- Avoid purple gradients / cream broadsheet look

- [ ] **Step 2: `npm run build` succeeds**

- [ ] **Step 3: Commit**

```bash
git commit -m "$(cat <<'EOF'
Polish SMARTWork visual design and responsive layout.

EOF
)"
```

---

### Task 16: Playwright smoke tests + work validators retarget

**Files:**
- Create: `app/playwright.config.ts`, `work/e2e/smoke.spec.ts` (or `app/e2e/smoke.spec.ts`)
- Modify: point/replace key `work/validate-*.js` scripts to hit Vite preview

- [ ] **Step 1: Install Playwright in app**

```bash
cd app && npm install -D @playwright/test && npx playwright install chromium
```

- [ ] **Step 2: Smoke spec covering**

1. Home search “Ahnaf” → open profile → see name
2. Profile has tabs Overview/Outcomes/Competencies/Reference
3. Development page contains “30-Day Startup Plan” or “Week 1: Re-entry” and “Westfield”
4. Capacity strip or detail shows for Ahnaf
5. Review launch shows Manager/Employee/Combine; manager form can export (or fields present)
6. Combine with invalid JSON shows error text

- [ ] **Step 3: Run**

```bash
cd app && npm run build && npx playwright test
```

Expected: PASS.

- [ ] **Step 4: Commit**

```bash
git commit -m "$(cat <<'EOF'
Add SMARTWork Playwright smoke coverage for manager workflows.

EOF
)"
```

---

### Task 17: Acceptance checklist + README

**Files:**
- Create: `app/README.md`
- Verify build output

- [ ] **Step 1: README**

Document: product SMARTWork; `npm install`, `npm run dev`, `npm run build`, `npm run preview` / `npx serve dist`; HashRouter; no `file://`; print via browser; privacy model for 360 JSON.

- [ ] **Step 2: Run full acceptance**

```bash
cd app && npm test && npm run build && npx playwright test
```

Checklist from spec §9 Acceptance criteria 1–6 — all must pass.

- [ ] **Step 3: Commit**

```bash
git commit -m "$(cat <<'EOF'
Document SMARTWork local build workflow and verify acceptance.

EOF
)"
```

---

## Spec coverage self-check

| Spec requirement | Task(s) |
|------------------|---------|
| React + Vite + TS SPA named SMARTWork | 1–2 |
| HashRouter + local static dist | 1, 2, 17 |
| Full parity org/profiles/capacity/dev/360/print | 3–14 |
| Summary hero + 4 tabs | 10 |
| Manager-optimized review/dev routes | 12–14 |
| BBS logos + palette + visual redesign | 2, 3, 15 |
| Client-only private JSON + combine validation | 7, 13, 14 |
| Unit + Playwright tests | 4–7, 16 |
| No Vercel / no delete outputs | Global constraints |

## Placeholder / consistency notes

- Export schema string stays `bbs-role-tool-response-v1` (legacy-compatible); `product: "smartwork"` is additive.
- Route param is always `:id` matching `Role.id`.
- Capacity category labels: `Project` | `Product` | `Internal`.
