---
# https://vitepress.dev/reference/default-theme-home-page
layout: home

hero:
  name: "Feasibility GUI"
  text: "Build, run, and review feasibility queries with a terminology-aware UI"
  tagline: "Angular app with ElasticSearch-powered search, DSE editing, and resilient results workflow"
  actions:
    - theme: brand
      text: Getting Started
      link: /getting-started
    - theme: alt
      text: Usage Overview
      link: /usage/feasibility
    - theme: alt
      text: Configuration
      link: /configuration
    - theme: alt
      text: Backend & Auth
      link: /integration

features:
  - title: Feasibility Query Builder
    details: Author queries with inclusion/exclusion groups, dependencies, multi-value & date/time restrictions.
  - title: Terminology Search
    details: ElasticSearch-backed search with infinite scroll, list/tree views, and ValueSet scoping.
  - title: Data Selection (DSE)
    details: Profile-based editor with required/recommended/optional fields and referenced profiles handling.
  - title: Resilient Execution & Results
    details: Robust polling, synchronized summary/detail, obfuscation thresholds, and downloadable artifacts.
  - title: Operations & Security
    details: Keycloak authentication, backend-driven settings, feature flags, and About page with version info.
  - title: Internationalization & Theming
    details: ngx-translate (EN/DE), theme hooks, and branded styles.
---

# Getting Started
- Prerequisites: Node.js 16.x, Angular CLI, running Keycloak and backend services.
- Install & run:
  - npm install
  - npm start (or ng serve), open http://localhost:4200
- Ensure Keycloak and backend endpoints are reachable.
See README: Architecture, Prerequisites, Getting started (development).

# Configuration
- Settings fetched from backend at startup; keep static config minimal.
- Local overrides: src/assets/config/config.dev.json
- Typical entries: backend base URL, Keycloak realm/clientId, feature toggles, theme, mock flags.
- i18n files: src/assets/i18n/en.json, src/assets/i18n/de.json
See README: Configuration and Configuration (quick reference).

# Usage Overview
## Feasibility
### Standard Search
- ElasticSearch by code/term with infinite scroll and filters (Context, Terminology, Module).
- Add results to the Stage; inspect parents/children via details panel; switch List/Tree.
### Bulk Search
- Paste multiple codes/terms; resolved entries combined into one criterion element added to the Stage.
### Edit
- Edit via options button: time restriction, attribute filters, quantity configuration.
- Assemble query with drag-and-drop into Inclusion (AND) and Exclusion (OR); toggle connectors; reorder.
### Result
- Robust polling; aggregated counts; details on responding sites.

## Data Selection (DSE)
- Search/browse profiles.
- Edit patient/data profiles; required/recommended/optional; auto-include referenced; Only if referenced; auto-save.
- Review summaries and validation; download artifacts where supported.

# Running, Testing, E2E
- Unit: npm test
- CI tests: npm run test-ci
- Lint: npm run lint / npm run lint:fix
- E2E: npm run cypress
- Build: npm run build

# Troubleshooting
- Blank pages/redirect loops: verify Keycloak config (realm/clientId).
- No search results: check terminology backend URL/CORS.
- Polling issues: inspect network; ensure settings endpoint reachable.
- i18n keys shown: confirm i18n files loaded and keys exist.

# Maintenance
- Releases: https://github.com/medizininformatik-initiative/feasibility-gui/releases
- Contributions via PRs/issues.

# UX Notes
- Dense views collapse long chips with “+N” overflow.
- Route animations and snackbar feedback for status/errors.
- Token filters support single-search and bulk-add.

