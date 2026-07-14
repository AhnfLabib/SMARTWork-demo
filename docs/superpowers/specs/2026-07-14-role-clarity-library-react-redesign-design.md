# Role Clarity Library — React Redesign Design Spec

**Date:** 2026-07-14  
**Status:** Approved for implementation planning  
**Product:** Bridge Builder Strategies (BBS) Role Clarity Library

## 1. Problem & goals

The current app is a working static Role Clarity Library (`outputs/`: plain HTML/CSS/JS) with org map, role profiles, capacity, development plans, 360 private→combine workflow, and print/export. It is dense, monolithic (~3k-line `app.js`), and hard to navigate for managers who primarily need development planning and 360 reviews.

**Goals**
- Rebuild as a React + Vite SPA with **full feature parity**.
- Optimize UX for **managers running development plans and 360 reviews**.
- Progressive disclosure: important content upfront; depth via tabs/routes.
- Fuller visual redesign while **keeping official BBS logos and brand palette**.
- Ship as a **local static build** now; remain compatible with later Vercel deploy (out of scope for this build).

**Non-goals**
- Backend, auth, or cloud storage for review answers
- Compensation guidance, gap analysis, or scoring products
- Vercel project wiring in this build
- Deleting legacy `outputs/` until cutover is verified (deprecate, don’t remove unless asked)

## 2. Decisions locked

| Topic | Decision |
|--------|----------|
| Primary user | Managers (development + 360) |
| Approach | Routed React SPA (Approach 1) |
| Stack | React + TypeScript + Vite + React Router |
| Feature bar | Full parity |
| Profile IA | Summary hero + tabs (Overview / Outcomes / Competencies / Reference) |
| Visual | Fuller redesign; keep BBS brand + logos |
| Delivery | Local static folder/build; Vercel later |

## 3. Architecture & delivery

### Repo layout

```
app/                          # New Vite + React + TypeScript source
  src/
    data/                     # roles, org, capacity, development
    components/
    pages/
    styles/
    lib/                      # search, capacity math, review JSON, print helpers
  public/assets/              # brand + source profiles/documents
dist/                         # Static production build (serve locally)
outputs/                      # Legacy app — migration source until cutover
work/                         # Playwright validators (retargeted to new app)
docs/superpowers/specs/       # This design doc
```

### Runtime

- Client-only SPA; no server APIs.
- React Router with **HashRouter** so deep links work without server rewrite rules. Primary local workflow: `npm run build` then `npx serve dist` (or Vite preview). Raw `file://` is unsupported; HashRouter + local static server is the supported path.
- Feature modules: `org`, `profiles`, `capacity`, `development`, `review`, `print/export`.
- Print via CSS `@media print` and explicit body/print-mode classes (summary / full / development / review / combined), matching current capability.

### Static-export friendliness (for later Vercel)

- No SSR required.
- Relative asset paths; HashRouter or Vite `base` configurable later.
- No environment secrets required for core workflows.

## 4. Screens, routes & progressive disclosure

### Routes

| Route | Purpose |
|--------|---------|
| `/` | Home: org map + search; secondary directory/filters |
| `/person/:id` | Role profile (default after org click) |
| `/person/:id/development` | Development plan |
| `/person/:id/review` | 360 launch pad |
| `/person/:id/review/manager` | Private manager input |
| `/person/:id/review/employee` | Private employee input |
| `/person/:id/review/combine` | Import both JSON files → alignment report |

Person IDs remain stable (`ahnaf-labib`, `jack-dougher`, etc.).

### Home

- Brand header + short “current-state documentation only” note.
- Dominant org map; search prominent.
- Filters/directory demoted (collapsed panel or drawer) so finding a person is primary.

### Profile (`/person/:id`) — summary first

**Always visible**
- BBS logo + person name + standardized title
- Reports to / function (compact)
- Role purpose (short narrative)
- Capacity summary strip when capacity data exists
- Top outcome titles (titles only, not full tables)
- Primary actions: Development plan, 360 review, Print menu, Export, navigate home/back

**Tabs**
1. **Overview** — purpose, capacity detail, responsibility areas (summary/table)
2. **Outcomes** — full outcomes table
3. **Competencies** — expectation map; work-style guide when present
4. **Reference** — skills, tools, O\*NET, design notes, source documents

### Development & review

- Sticky `PersonContextBar`: name, title, links to Profile | Development | 360.
- Development: startup (if authored) → quarterly → semiannual; focus areas; reflection; manager support; local notes; export; print.
- Review: short launch pad + three actions; rating baselines and long guides appear on the path the user chooses (manager / employee / combine), not as a wall of content on the launch page.

## 5. Data model & migration

### Sources to migrate

From `outputs/data.js` and embedded structures in `outputs/app.js`:

| Module | Content |
|--------|---------|
| `roles.ts` | Full `ROLE_DATA` parity |
| `org.ts` | `ORG_TREE` with `profileId` links |
| `capacity.ts` | `CAPACITY_DATA` allocations |
| `development.ts` | Authored plans; default plan builder for others |

### Assets

- Brand logos → `app/public/assets/brand/`
- Source profile images/docs → `app/public/assets/source-profiles/` and `source-documents/`
- Role `sources` paths rewritten to public URLs

### Derived helpers (pure functions)

- Role/org search and filters
- Capacity totals and category grouping
- Development plan resolve (authored vs default builder)
- Competency expectation levels
- Review private-response validate/combine logic

### Compatibility

Private 360/development response JSON remains compatible with the current export mental model. Include `schemaVersion: 1` on new exports; combine accepts v1 (and legacy shape without version if fields match). Do not invent a server sync protocol.

## 6. Components & workflows

### Shared

- `AppShell` — header, logo, home affordance, brand accents
- `PersonContextBar` — person routes navigation + contextual print/export

### Home

- `OrgChart`, `OrgSearch`, optional `DirectoryPanel` (function / family / reports-to)

### Profile

- `ProfileHero`, `CapacityStrip` / `CapacityDetail`, `ProfileTabs`, table/section components for outcomes, responsibilities, competencies, O\*NET, sources

### Development

- `DevelopmentPlanPage` with conditional startup block, quarterly/semiannual sections, notes, export, print

### 360 (client-only privacy)

- `ReviewLaunch` — Manager / Employee / Combine
- `PrivateResponseForm` — outcomes + competencies + support notes; download JSON; no upload
- `ResponseMergeCenter` — import two files; validate personId, workflow, audience complementarity; side-by-side + alignment report; shared notes; print/export
- Preserve “local privacy workflow” copy: files stay on the user’s machine

### Print / export

- Print CSS per mode; hide chrome; expand required content
- Text/JSON download helpers for summaries and private responses

## 7. Visual redesign

### Keep

- Official BBS logos (color + white lockups)
- Palette: navy `#28334a`, green `#046a38`, blue `#1a4e8a`, orange `#f68d2e`, red `#a72b2a`
- Current-state documentation framing
- Letter-size print friendliness

### Refresh

- Clearer type hierarchy (professional, print-safe; avoid generic AI-default stacks/themes)
- Home as one composition: org map dominant, not a dashboard of competing panels
- Profile hero calm and summary-first; no card soup in the first viewport
- Tabs and spacing for scan-then-dive
- Accents from BBS palette; avoid purple-gradient / cream-serif / broadsheet clichés
- Responsive: stack home on small screens; sticky person context on person routes

### Print constraint

Redesign must preserve printable: profile summary, full profile, development plan, review/combined report.

## 8. Error handling

| Case | Behavior |
|------|----------|
| Unknown `person/:id` | Friendly not-found + link home |
| Zero search/filter matches | Empty state + clear filters action |
| Combine mismatched person/workflow/audience or invalid JSON | Specific error; no partial merge |
| Missing capacity | Hide capacity strip |
| Missing authored development plan | Use default plan builder |
| Missing source assets | “No source attached”; page still loads |

## 9. Testing & acceptance

### Testing

- Unit tests for pure helpers (filter, capacity totals, development resolve, JSON validate/combine)
- Playwright smokes ported from `work/validate-*.js`:
  - Front search opens a person
  - Profile tabs + print mode classes
  - Ahnaf development plan content
  - Capacity where data exists
  - Review launch → private form; combine validation path
- Manual print spot-check: Jack summary/full; Ahnaf development PDF

### Acceptance criteria

1. `npm run build` produces a static folder servable locally.
2. Full parity: org, all profiles, capacity, development, 360 private→combine, print/export.
3. Profiles are summary-first with four tabs.
4. Managers can complete Development + 360 paths with no backend.
5. BBS logos + palette present; UI is a redesign, not a skin of the old layout.
6. Playwright-style checks adapted and passing against the new app.

## 10. Implementation sequencing (for the plan)

Suggested build order (detailed steps belong in the implementation plan):

1. Scaffold Vite React TS app + HashRouter + design tokens/shell
2. Migrate data modules + assets; unit-test helpers
3. Home: org + search + directory
4. Profile: hero + tabs + capacity + export/print modes
5. Development plan pages + print
6. 360 launch, private forms, combine, print
7. Visual polish pass + responsive
8. Retarget Playwright validators; acceptance checklist

## 11. Out of scope reminders

- Vercel deploy configuration (later instruction from stakeholder)
- Server-side persistence of reviews
- Changing organizational reporting truth / inventing new people not in current data
- Gap analysis or compensation features
