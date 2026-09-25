# Feasibility GUI

An Angular application for building, editing, running, and reviewing feasibility queries and defining data selections. It provides a modern, terminology-aware UI with structured query authoring, profile-based selections, and a resilient results workflow.

## Table of Contents
- [What you can do](#what-you-can-do)
- [Key features](#key-features)
- [Feature catalog](#feature-catalog)
- [Architecture and tech stack](#architecture-and-tech-stack)
- [Prerequisites](#prerequisites)
- [Getting started (development)](#getting-started-development)
- [Configuration](#configuration)
- [Running, testing, E2E](#running-testing-e2e)
- [Usage overview](#usage-overview)
  - [Feasibility](#feasibility)
    - [Standard Search](#standard-search)
    - [Bulk Search](#bulk-search)
    - [Edit (Feasibility)](#edit)
    - [Result (Feasibility)](#result)
    - [Bulk concept selection](#bulk-concept-selection)
  - [Data Selection](#data-selection)
    - [Search (Data Selection)](#search)
    - [Edit (Data Selection)](#edit-1)
    - [Result (Data Selection)](#result-2)
- [Troubleshooting](#troubleshooting)
- [Maintenance](#maintenance)
- [Configuration (quick reference)](#configuration-quick-reference)
- [UX notes](#ux-notes)

## What you can do

- Build feasibility queries with:
  - Inclusion/exclusion groups
  - Multiple value restrictions per criterion
  - Date/time constraints and group dependencies
  - Translate to/from CCDL/CRTDL for interoperability
- Search and select concepts:
  - ElasticSearch-backed search with infinite scroll
  - Tree and list views with icons
  - Single and bulk concept selection (by ValueSet and free text)
  - Work with multiple ValueSet URLs and preselected tokens
  - Paste lists of codes for bulk selection
- Define data selections (DSE):
  - Profile-based configuration with required/recommended/optional fields
  - Automatic handling of referenced profiles when required/recommended
  - “Only if referenced” visibility where supported
  - Auto-save edits with validation feedback
- Execute and monitor:
  - Start queries and robustly poll results (tolerant to intermediate errors)
  - View synchronized summary and detail results
  - Save cohorts and data selections; download supported artifacts
- Import/export:
  - Exchange queries and data selections (with validation)
  - Deep-link: load queries by ID via URL
- Operate securely:
  - Authenticate with Keycloak
  - Load settings from backend at startup (minimal static config)
  - About page with UI/backend/ontology version info
- Localize and brand:
  - i18n via ngx-translate (EN/DE provided)
  - Theme/branding hooks
  - Optional comparator icon display via feature flag

## Key features

- Structured query builder with multi-group, dependency, and multi-value support
- Terminology search (ElasticSearch), infinite scroll, and multiple ValueSet URLs
- Data Selection editor with profile references and auto-save
- Resilient result polling and improved error surfacing
- Snackbar feedback, clean layouts, and route animations
- Import/export for queries and selections
- Backend-driven settings initialization
- Deep-linking (load query by ID)
- About page with system versions (UI, backend, ontology)
- HTTP interceptors for auth/error handling
- E2E tests with Cypress + Cucumber; unit tests with Jest

## Feature catalog

- Query authoring
  - Inclusion/exclusion
  - Multiple value restrictions per criterion
  - Date/time restrictions; initialization and validation of filters
  - Optional comparator icons (feature toggle)
  - Translation services between internal model and CCDL/CRTDL
- Terminology & search
  - ElasticSearch-backed concept/criteria search with infinite scrolling
  - Tree and list result modes with icons
  - Token filter with single and bulk tabs (paste codes, multi-add)
  - Multiple ValueSet URL support; preselected concept tokens
  - Improved terminology title display and attribute translations
- Data Selection (DSE)
  - Profile-based editing with required/recommended/optional fields
  - Automatic inclusion of referenced profiles when required/recommended
  - “Only if referenced” visibility control
  - Auto-save with snackbar feedback; deletion safeguards
- Execution & results
  - Robust polling through intermediate errors; explicit final error surfacing
  - Synchronized summary/detail results
  - Cohort and data selection saving; improved download behavior
  - Configurable obfuscation threshold for small counts
- UX & productivity
  - Route animations, dynamic tab titles, refined component layouts
  - Snackbar-based feedback and centralized error display
  - Count badges and compact chip displays in dense views
- Operations & settings
  - Settings fetched from backend at startup (reduced static config)
  - About page exposing UI/backend/ontology versions
  - Feature flags for capabilities and visualization limits
- Security & auth
  - Keycloak-based authentication and authorization
  - HTTP interceptors for token management and error handling
- Internationalization & theming
  - ngx-translate-based i18n (EN/DE), extensible to more locales
  - Theming/branding via stylesheet configuration
- Developer experience
  - Angular Material/CDK composables; Monaco editor integration
  - Type guards and assertion utilities across core services
  - Jest unit tests with coverage; Cypress + Cucumber for E2E
  - ESLint, Prettier, Husky, and CI-oriented test targets

## Architecture and tech stack

- Angular + RxJS + Angular Material
- Auth: Keycloak (angular-oauth2-oidc)
- i18n: @ngx-translate
- Testing: Jest (unit) and Cypress + Cucumber (E2E)
- Tooling: ESLint, Prettier, Husky

## Prerequisites

- Node.js 16.x (LTS recommended)
- Angular CLI
- Running Keycloak and backend services (terminology, query, settings)

References:
- Keycloak: https://github.com/num-codex/codex-keycloak
- Backend: https://github.com/num-codex/codex-feasibility-backend

## Getting started (development)

1) Install dependencies
```bash
npm install
```

2) Start the app
```bash
npm start
# or
ng serve
```

3) Open in browser
```
http://localhost:4200
```

Ensure Keycloak and backend endpoints are reachable.

## Configuration

- App settings are retrieved from the backend at startup (reduces static config).
- For local/dev overrides, use:
```
src/assets/config/config.dev.json
```
Typical entries:
- Backend base URL and Keycloak settings (baseUrl, realm, clientId)
- Feature toggles (query capabilities, polling interval)
- Theme selection
- Mock flags for terminology/query/result (for limited offline UI)

i18n files:
- src/assets/i18n/en.json
- src/assets/i18n/de.json

## Running, testing, E2E

- Unit tests
```bash
npm test
```

- CI-oriented tests
```bash
npm run test-ci
```

- Lint
```bash
npm run lint
npm run lint:fix
```

- E2E
```bash
npm run cypress
```

- Build
```bash
npm run build
```

## Usage overview

### Feasibility

#### Standard Search
In the feasibility query search view, you can:

- Search for criteria via ElasticSearch using infinite scroll, by either **code** or **term**. Results load progressively as you scroll and appear in a table below the search input.
- Refine your search using filters, such as:
  - **Context** (e.g., Condition, Procedure, etc.)
  - **Terminology system** (e.g., SNOMED CT, LOINC, etc.)
  - **Module** you want to search in  
  These filters help you narrow down the results to the exact type of criterion you need.

- Select a criterion to form the atomic building block of your feasibility query.  
  Once you find a suitable criterion, you can add it to the **Stage** by clicking the button in the green bar below the results table. This removes it from the current selection and places it into the stage. From there, you can continue searching for additional criteria or proceed to the **Edit** view using the button in the same green bar.

- View more details about relations between criteria.  
  The results table includes an icon that opens a side navigation panel showing **parent** and **child** nodes of the selected criterion:
  - **Children** = elements below the criterion in the hierarchy  
  - **Parents** = elements above the criterion in the hierarchy  
  This helps you better understand the context and placement of a criterion before adding it to your query.

You can also toggle between **Bulk Search** and **Standard Search** using the switch in the top-right corner of the search view.

### Bulk Search
Bulk Search allows you to search for multiple codes or terms at once. Instead of selecting individual criteria from the results list one by one, you can paste or enter multiple search terms, and the system will resolve all matching entries at once.

When you add the result to the **Stage** using the green bar, all matching entries are combined into **one single criterion element**. This makes it easy to include a large set of related terms—such as multiple codes from the same context or terminology system—without adding each one individually.

Bulk Search is particularly useful when working with:
- Large code lists  
- Groups of related terms that should be treated as a single criterion

#### Edit
 In the **Edit** view, you can modify each criterion using the options button on its card. Clicking this button opens a menu that allows you to edit the selected criterion. Depending on the type of criterion, it may support:

- A **time restriction**
- One or more **attribute filters**
- A **quantity** configuration

The edit dialog automatically displays all available options based on the specific properties of the selected criterion.

Once editing is complete, you can begin assembling your feasibility query. Use **drag and drop** to move each criterion into either the **Inclusion** or **Exclusion** areas:

- Criteria in the **Inclusion** area are connected with **AND** by default.
- Criteria in the **Exclusion** area are connected with **OR** by default.
- You can toggle the logical relation (AND/OR) by clicking the connector label.

You can also:

- Drag a criterion back to the **Stage**
- Reorder criteria within the Inclusion or Exclusion ar
eas using drag and drop

This allows you to flexibly structure your feasibility query according to your needs.

Once you have defined your feasibility query using the Inclusion and Exclusion areas, it is time to execute it. Use the green bar at the bottom of the page and click **Send Feasibility**. This action will send the query and open the results view.

### Result

In the result view, the feasibility query you submitted is displayed. At the top, a spinner indicates that the system is polling for responses within the configured time window.  
Once the polling period ends, you will see the aggregated result count collected from the Data Integration Centers across Germany.

A **Details** button will appear, allowing you to open a popup showing how many sites have responded to your query.

### Data Selection

#### Search
- Browse for profiles relevant to you data selection.

#### Edit
- Build patient/data profiles; mark fields as required/recommended/optional.
- Automatically include required/recommended referenced profiles.
- Use “Only if referenced” where applicable; edits auto-save with snackbar feedback.
##### Bulk concept selection
Use the bulk tab to quickly add many concepts/tokens:
1) Open a token/concept filter and switch to “Bulk”.
2) Paste codes/terms (one per line).
3) Submit to add all recognized items.

#### Result
- Review selection summaries and validation messages.
- For detailed result exploration and downstream use, refer to TORCH.

## Troubleshooting

- Blank pages or redirect loops: verify Keycloak and clientId/realm in config.
- No search results: check terminology backend URL and CORS.
- Polling never completes: inspect network errors; backend settings endpoint reachable.
- i18n keys visible: confirm i18n files are loaded and translation keys exist.

## Maintenance

- Releases and detailed changes:
  - https://github.com/medizininformatik-initiative/feasibility-gui/releases

Contributions and fixes are welcome via PRs and issues.

## Configuration (quick reference)

These flags influence behavior and UX across query authoring and results:

## UX notes

- Dense views collapse long chip lists and display a “+N” overflow badge to summarize hidden items.
- Query pages use route animations and snackbar feedback for consistent status/error messages.
- Token filters offer both single-search and bulk-add tabs for fast authoring.
