# Testing Documentation (Cypress BDD)

This documentation provides an overview of the step definitions implemented for Behavior-Driven Development (BDD) testing with Cypress using Cucumber/Gherkin syntax. Step definitions link human-readable steps in `.feature` files to executable Cypress commands and custom helper functions in the codebase.

## Table of Contents

- [Installation & Setup](#1-install-cypress)
- [Important Notes](#important-notes)
- [Feature Files & Gherkin](#feature-files--gherkin)
- [Implemented Step Definitions](#implemented-step-definitions)
- [Running test](#test-runs)
  - [Authentication & Navigation Steps](#authentication--navigation-steps)
  - [Menu Interaction](#menu-interaction)
  - [Navigation Steps](#navigation-steps)
  - [Table / Row Assertions & Interaction](#table--row-assertions--interaction)
  - [Time Restriction Filter Steps](#time-restriction-filter-steps)
  - [Action Bar Button Steps](#action-bar-button-steps)
  - [Search Input Field](#search-input-field)
  - [Upload File](#upload-files)
  - [Download file](#download-files)
  - [Utilities](#utilities)
  - [Language Steps](#language-steps)
- [Navigation Label to URL Mapping](#navigation-label-to-url-mapping)
- [Examples](#example)
- [Helpful Links](#helpful-links)
- [Utilities](#utilities)

---

## Installation & Setup

To run the Cypress BDD tests with Cucumber, you need to install Cypress and the official Cucumber preprocessor, along with their dependencies.

### 1. Install Cypress

```bash
npm install --save-dev cypress

```

### 2. Install the Cucumber Preprocessor and Dependencies

```bash
npm install --save-dev @badeball/cypress-cucumber-preprocessor
```

### 3. Install npx

```bash
npm install -g npx
```

### 4. Install npx cypress

```bash
npx cypress install np
```

### 5. Open the Cypress Test Runner:

bash

```bash
npx cypress open
```

### 6. Run Tests in Headless Mode:

```bash
npx cypress run
```

## Test Criteria

Which exact criterium names the feature files search for, which ontology context
each comes from, and how to re-verify or replace one when the ontology version
changes: see [`TEST_DATA.md`](./TEST_DATA.md). For the mechanisms behind those
gotchas (translation fallback, step-file loading rules, ontology-reload
instability, the Component Object library), see [`CLAUDE.md`](./CLAUDE.md).

## Important Notes

All step strings (e.g., button names or labels) are case-sensitive and must match exactly.  
This includes whitespace and special characters (e.g., `"Zur Kohortenselektion hinzufügen"` must be written precisely).

---

## Feature Files & Gherkin

All BDD scenarios are written in **feature files** using the [Gherkin syntax](https://cucumber.io/docs/gherkin/reference/).

- Feature files have the `.feature` extension and contain scenarios written in plain English (or other supported languages).
- Each scenario describes user behavior using steps like `Given`, `When`, `Then`, `And`, and `But`.
- The file name and location must match the patterns defined in your Cypress or Cucumber configuration (see `package-lock.json` or `cypress.config.js` for the relevant glob patterns).

## Running test

When you run Cypress using the command:

```console
npx cypress run
```

it starts executing defined test cases. During this process, Cypress automatically performs several tasks:

Screenshots: If a test fails or if you've enabled screenshot capture, Cypress will generate and save screenshots in the cypress/screenshots/ directory.

File Downloads: If the application triggers any downloads during testing (e.g., JSON), those files will be saved to the cypress/downloads/ folder.

To ensure a clean test environment, the following folders are automatically cleared before each test run:

- cypress/downloads/

- cypress/screenshots/

This behavior is implemented in the [Cypress configuration](../cypress.config.ts) using the `before:run` hook. It guarantees that test artifacts from previous runs don’t interfere with current results.

### Skipping `@pending` scenarios

Scenarios and features tagged `@pending` are blocked on missing data or a product decision
(for example `attribute-concept-same-code-different-system.feature`). A plain `npx cypress run`
**still runs them, and they fail**. Exclude them with:

```console
npx cypress run --expose tags='not @pending'
```

Use `--expose`, not `--env`: this project is on Cypress 16, where the preprocessor reads the
`tags` option from the exposed config values. `--env tags=...` and `--env TAGS=...` are silently
ignored. A skipped scenario shows up as 0 passing in a few milliseconds instead of failing.

### Tags

Tag matching is exact: `@a:b:c` does not match a filter for `@a:b`. So tags are **facets**, one
per question, combined in a filter expression. Put them in this order, on every scenario:

```gherkin
@area:feasibility-query                  <- on the Feature line, once per file
Feature: ...
  @component:criterion-editor @behavior:remove @filter:attribute-filter @type:concept
  Scenario Outline: ...
```

| Tag              | Question it answers                                   | On                | Required                      | Values                                                                                                                                                                                                           |
| ---------------- | ----------------------------------------------------- | ----------------- | ----------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `@area:`         | Which category? (see below)                           | Feature           | yes                           | `feasibility-query`, `data-selection`, `data-query`, `saved-queries` (`dashboard` has no scenarios yet) |
| `@cross-cutting` | Not tied to one module                                | Feature           | instead of `@area:`           | -                                                                                                                                                                                                                |
| `@component:`    | Which screen or part is under test?                   | Scenario          | yes                           | grouped by category, see below |
| `@behavior:`     | What does the scenario do or check? Always a **verb** | Scenario          | yes                           | `select`, `remove`, `persist`, `sync-ui`, `show-chips`, `update-chip`, `apply`, `reject-invalid-dates`, `reject-invalid-range`, `offer-comparators`, `add`, `delete`, `duplicate`, `upload`, `download`, `save`, `show-file-actions`, `hide-file-actions`, `report-not-found`, `report-backend-error`, ... (reuse an existing one before inventing a new one) |
| `@filter:`       | Where in the criterion does the filter sit? (CCDL field) | Scenario | only for `criterion-editor`   | `value-filter`, `attribute-filter`, `time-restriction`, `none` |
| `@type:`         | Schema `type` of the filter (CCDL `type`)             | Scenario          | only if the filter has one    | `concept`, `quantity-comparator`, `quantity-range`, `reference` (feature filters: `date`, `token`) |
| `@comparator:`   | How it compares                                       | Scenario/Examples | only if it narrows the filter | `gt`, `ge`, `lt`, `le`, `eq`, `ne` (quantity-comparator); `before`, `after`, `at`, `between` (time restriction) |
| `@pending`       | Blocked on data or a product decision, fails today    | Scenario/Examples | -                             | exclude with `not @pending`                                                                                                                                                                                      |
| `@doc-collapse`  | Examples block that only documents a case             | Examples          | -                             | -                                                                                                                                                                                                                |

`@component:` values by category, each with the page it tests (page names as in `I am on the "..." page`):

| Category | `@area:` | `@component:` | Page | Route |
| --- | --- | --- | --- | --- |
| Feasibility query | `feasibility-query` | `criteria-search` | Feasibility Search | `/feasibility-query/search` |
| | | `criteria-bulk-search` | Feasibility Bulk Search | `/feasibility-query/bulk-search` |
| | | `feasibility-editor` | Feasibility Editor: the cohort definition's inclusion and exclusion lists | `/feasibility-query/overview` |
| | | `criterion-editor` | Query Editor - Criteria: configures **one** criterion (filters, time restriction), opened via "Configure" | `/query-editor/criterion/:id` |
| | | `feasibility-result` | Feasibility Result | `/feasibility-query/result` |
| Data selection | `data-selection` | `data-selection-search` | Data Selection Search | `/data-selection/search` |
| | | `data-selection-editor` | Data Selection Editor: the chosen features | `/data-selection/overview` |
| | | `data-selection-feature-editor` | Query Editor - Profile: configures **one** feature | `/query-editor/feature/:id` |
| Data definition | `data-query` | `cohort-definition` | Data Query - Cohort Definition | `/data-query/cohort-definition` |
| | | `crtdl` | the same page: CRTDL upload and download | |
| | | `upload` | the same page: invalid uploads | |
| Saved queries | `saved-queries` | `saved-queries` | Saved Queries | `/saved-queries` |
| General (`@cross-cutting`) | none | `action-bar`, `language`, `navigation`, `login`, `session`, `user-menu` | several / the whole app | |

`feasibility-editor` and `criterion-editor` are two screens, not two modules: the first lists the criteria of
a cohort definition, the second is the page you reach from one criterion's menu to edit that single criterion.
Feature editor is the same pair on the data selection side.

Rules:

- `@area:` goes on the Feature; everything else on the **Scenario**, never on the Feature or
  the Background, because behaviors differ per scenario. A scenario with two behaviors repeats the
  tag: `@behavior:select @behavior:remove`.
- Keep the order `@component`, `@behavior`, `@filter`, `@type`, `@comparator`. Add `@filter:`/`@type:`/`@comparator:` only
  when they apply; a search or navigation scenario has just `@component` + `@behavior`.
- `@component:` is the **screen under test** (a row of the table above), never a widget on it. The side
  panel that opens on a search result is part of `criteria-search`, not its own component.
- Need a new value? Add it to the table above **and** to `VALUES`/`COMPONENTS` in
  `cypress/scripts/lint-features.mjs` in the same change.

`npm run gherkin:lint` (also on commit for staged `.feature` files) fails on: an unknown tag or value, a tag on
the wrong level (`@area:` on a Scenario, `@behavior:` on a Feature or Examples), a Feature without `@area:`/`@cross-cutting`,
a Scenario without exactly one `@component:` or without a `@behavior:`, a `@component:` that does not belong to the
Feature's `@area:`, `@type` without `@filter`, duplicate tags, and tags out of order.

```console
npx cypress run --expose tags='@component:criterion-editor and @behavior:remove'
npx cypress run --expose tags='@filter:attribute-filter and @type:concept and not @pending'
npx cypress run --expose tags='@area:feasibility-query and @filter:time-restriction'
```

### Tables are column-aligned

Every Gherkin table (`Examples` and step data tables) has its `|` aligned in a column, one space
of padding each side, so a row reads like a spreadsheet row. Run `npm run gherkin:align` after
editing one; the pre-commit hook does it for staged `.feature` files; `node cypress/scripts/align-tables.cjs --check` lists files that need it and exits 1.

### Lint: no hard-coded values in steps

`npm run gherkin:lint` (also run on commit for staged `.feature` files) fails when a scenario step
quotes anything but a `<placeholder>` or a UI label. Criteria, codes, concepts, dates, chip texts,
messages, search terms and endpoints go in an `Examples` cell, even when a scenario has one row:
make it a `Scenario Outline`. A `Background` is not checked, because it cannot use placeholders.
A new UI label (button, tab, list or page name) is added to `UI_LABELS` in
`cypress/scripts/lint-features.mjs`.

### Data lives in `Examples`

Criteria, codes, concepts, tab names, labels and dates belong in an `Examples` table, never in a
step, so a value can be swapped without touching a step definition. A `Background` cannot use
`<placeholders>`, so a scenario that needs data adds its criterium inside the scenario
(`Given I add the criterium "<criterium>" via code "<criteriumCode>" to the editor`). A cell may
be a literal or a `{{group.key}}` placeholder from `support/test-data/concepts.json`, one group per
criterium (`age`, `causeOfDeath`, `gender`, `encounter`, ...) holding its code, filter tabs and concepts.
Prefer the placeholder for every criterium, code, tab, concept and system: one edit in the JSON
updates every scenario. Every step resolves placeholders, because step files import `defineStep`
from `support/defineStep.ts` (not from the preprocessor), which runs `resolve()` on each string
argument. Step definitions must not hard-code a filter name or code; take them from the scenario's
data table instead (see `I have selected one concept from the value set of each of these attribute filters:`).

## Implemented Step Definitions

These step definitions cover common user actions and assertions implemented in the Cypress step definition files. You can use them directly in the `.feature` files without needing to write additional code for these actions. This documentation will be updated as new steps are implemented.

In the following sections, you will find a list of already implemented step definitions that can be used directly in your feature files to write end-to-end tests. Use these steps as building blocks for your test scenarios.

### Authentication & Navigation Steps

- `I go to the login page`
- `I fill in the login form with valid credentials`
- `I am logged in as a user`

### Menu Interaction

- `I open the menu`
- `I click on the menu item {string}` – e.g., `"Bearbeiten"`

### Navigation Steps

- `I navigate to the {string} page`
- `I am on the {string} page` — for supported pages, see [Navigation Label to URL Mapping](#navigation-label-to-url-mapping)

### Table / Row Assertions & Interaction

- `I should see a row containing {string}` – checks for a table row with matching text
- `I select the checkbox in the row containing {string}` – selects a checkbox in the same row
- `I select the checkbox of item {string} from the search results`
- `the table should have {int} rows`

### Time Restriction Filter Steps

The following steps are available for setting a time restriction in your scenarios:

- `I set the time restriction to before with date {string}`
- `I set the time restriction to at with date {string}`
- `I set the time restriction to after with date {string}`
- `I set the time restriction to equal with date {string}`
- `I set the time restriction to between {string} and {string}`
- `I see the time restriction warning {string}`
- `I select a minimum of {int} and a maximum of {int}` (quantity range; set the unit first)
- `I see the quantity range warning {string}`
- `the operator of the panel {string} offers {string}` (comma-separated labels)

### Action Bar Button Steps

- `the button {string} should be disabled`
- `the button {string} should be enabled`
- `I click on the button {string}`

### Search Input Field

- `I type {string} in the search input field`
- `I clear the search input field`

### Upload files

- `I upload the file {string}`

### Download files

- `I download the file {string}`

### Utilities

#### Feasibility

##### Editor

- `I add the criterium {string} to the editor`
- `I should see the criterium {string} in the editor`
- `I see the criterium {string} with filter chip {string} in the block {string}`
- `I see the criterium {string} with filter chip block {string}`
- `I drag "{string}" criterium to the {string} list` - (Inclusion | Exlusion)

### Language Steps

The following steps are available for setting the application language in your scenarios:

- `I set the language to English`
- `I set the language to German`

## 🔗 Navigation Label to URL Mapping

This table shows the mapping between user-facing labels and the internal route URLs used in the application.

| Label                          | URL                           |
| ------------------------------ | ----------------------------- |
| Feasibility Editor             | /feasibility/editor           |
| Feasibility Search             | /feasibility/search           |
| Feasibility Result             | /feasibility/result           |
| Data Selection Editor          | /data-selection/editor        |
| Data Selection Search          | /data-selection/search        |
| Data Query - Cohort Definition | /data-query/cohort-definition |
| Data Query - Data Selection    | /data-query/data-selection    |
| Query Editor - Criteria        | /query-editor/criterion       |
| Query Editor - Profile         | /query-editor/profile         |

---

## Example

```gherkin
  Feature: Cohort Search

    Background:
      Given I am logged in as a user
      And I am on the Feasibility Editor page

    Scenario: Button test
      When I click on the button "Zur Kohortenselektion hinzufügen"
      Then the button "Kohortenselektion anzeigen" should be enabled
      And the button "Zur Kohortenselektion hinzufügen" is disabled
```

```gherkin
  Feature: Cohort Search

    Background:
      Given I am logged in as a user
      And I am on the Cohort Editor page

    Scenario: Search for Cohort elements
      Then I see 50 criteria results
      And the button "Zur Kohortenselektion hinzufügen" is disabled
```

---

## Helpful Links

- [Cypress Documentation](https://docs.cypress.io)
- [Cypress Cucumber Preprocessor](https://github.com/badeball/cypress-cucumber-preprocessor)
- [Gherkin Language Reference](https://cucumber.io/docs/gherkin/reference/)
