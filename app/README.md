# Bridge360

Bridge360 is Bridge Builder Strategies’ internal app for role clarity, capacity assignment, development plans, and private 360 reviews.

## Requirements

- Node.js 20+ recommended
- Local static serving of the production build (do **not** open `dist/index.html` via `file://`)

## Setup

```bash
cd app
npm install
```

## Develop

```bash
npm run dev
```

## Build & preview (supported local workflow)

```bash
npm run build
npm run preview
# or: npx serve dist
```

Routes use **HashRouter** (`/#/person/...`) so deep links work without server rewrite rules.

## Scripts

| Script | Purpose |
|--------|---------|
| `npm run dev` | Vite development server |
| `npm run build` | Typecheck + production build to `dist/` |
| `npm run preview` | Serve `dist/` locally |
| `npm test` | Vitest unit/component tests |
| `npx playwright test` | End-to-end smokes (build/`preview` via Playwright webServer) |

## Product notes

- **Brand:** BBS logos + palette; product name **Bridge360**
- **Print:** Use browser Print / Save as PDF (profile summary, full profile, development, combined 360)
- **360 privacy:** Manager and employee responses export as local JSON files (`schema: bbs-role-tool-response-v1`). Combine imports those files in-browser — nothing is uploaded to a server
- **Scope:** Current-state documentation only (no compensation / gap scoring)

## Later

Vercel deployment is intentionally out of scope for this build and can be added later.
