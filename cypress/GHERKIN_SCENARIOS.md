# Proposed Gherkin Scenarios (UI exploration)

Scenarios for UI behavior that has no `.feature` file yet, found by clicking
through the running app (`localhost:4200`, logged in as `testuser`, German UI)
and comparing against the 15 existing feature files (43 scenarios).

**Status legend**

- **observed** — I saw this behavior happen in the live UI.
- **inferred** — implied by the UI (labels, disabled states, tooltips) but I did
  not trigger it end to end. Verify before turning it into a step definition.

Steps reuse the phrasing already in `cypress/support/step_definitions/`. Steps
marked **(new)** have no matching definition yet — see
[New step definitions needed](#new-step-definitions-needed).

## Existing coverage (for reference)

| Area | Feature files | Scenarios |
|---|---|---|
| Login | `login/login.feature` | 1 |
| Cohort search | `CohortSearch/cohort-search.feature` | 2 |
| Cohort edit / exclusion / result | `CohortEdit/*`, `CohorttResult/*` | 5 |
| Criterion filters (attribute concept, value concept, no filter) | `Criterion/**` | 29 |
| Data query cohort (upload, advance) | `DataQueryCohort/*` | 2 |
| Data selection search | `DataSelectionSearch/*` | 2 |
| Saved queries | `SavedQueries/*` | 2 |

**Not covered:** bulk search, search filter dropdowns and reset, data-selection
select-all, duplicating or deleting a criterium, user menu (about / log out),
language switch as its own behavior, side-nav toggle, empty-state and validity
gating.

## 1. Bulk search

Route: `/feasibility-query/bulk-search`. Reached from the "Bulksuche" tab or the
"Zur Bulksuche" button in the criteria editor.

**Implemented and passing:** `cypress/e2e/BulkSearch/bulk-search.feature`
(5 scenarios), steps in `support/step_definitions/bulkSearch.cy.ts`, helper in
`support/component-objects/NumBulkSearch.ts`.

**Verified:** the page has a multi-line code box, a "Kontext" dropdown, a
"Terminologie" dropdown and a "Suchen" button. "Suchen" is **disabled until the
codes, the context AND the terminology are all set** (`canSubmit()` in
`bulk-search-input.component.ts` requires every filter to have a value). The
help text says codes can be separated by commas, spaces or line breaks; all
three work. A code that does not exist lands in the "Not found" tab.

> **Correction:** the first version of this document said "Suchen" enabled after
> choosing only a terminology. That was wrong: my manual click on "Suchen" had
> failed because the button was still disabled, and I misread the failure.

```gherkin
Feature: Bulk search            # see bulk-search.feature for the real file

  Scenario: The search button stays disabled until codes, context and terminology are set
  Scenario Outline: Codes can be separated by different delimiters
  Scenario: A code that does not exist is reported as not found
```

Still **inferred** (not implemented): adding the result as a group criterium,
and filtering the terminology dropdown by typing.

> **Possible bug to check:** after choosing a terminology the select shows the raw
> system URL (`http://fhir.de/CodeSystem/bfarm/icd-10-gm`) instead of the display
> name used in the option list (`ICD-10-GM`). Reproduced with a scripted click,
> so it is not an artifact of keyboard selection. The options are also **missing
> from the accessibility tree** in the devtools browser; the Cypress step works
> around this by matching `.mat-mdc-option` text.

## 2. Search filters and reset

**Observed:** single search has "KDS-Modul", "Kontext" and "Terminologie"
dropdowns; "Filter zurücksetzen" starts **disabled**. Data selection has "Modul"
and "FHIR Datentyp" dropdowns and the same disabled reset button.

```gherkin
Feature: Search filters

  Background:
    Given I am logged in as a user
    And I am on the "Feasibility Search" page
    And I set the language to the configured language

  Scenario: Reset filters is disabled while no filter is active              # observed
    Then the button "Reset filters" should be disabled (new)

  Scenario: Applying a filter enables reset and narrows the results          # inferred
    When I select the terminology filter "ICD-10-GM" (new)
    Then the button "Reset filters" should be enabled (new)
    And every result row has the terminology "ICD-10-GM" (new)

  Scenario: Resetting filters restores the full result list                  # inferred
    Given I select the terminology filter "ICD-10-GM" (new)
    When I click on the button "Reset filters" (new)
    Then the button "Reset filters" should be disabled (new)
    And the result list contains rows from more than one terminology (new)

  Scenario: Searching by terminology code finds the matching criterium       # observed
    When I search for "E11"
    Then I should see a result with the code "E11" in "ICD-10-GM" (new)
```

> **Observed behavior to account for:** searching `E11` also returns ATC drugs
> whose codes end in `E11` (for example `V03AE11`, `J01CE11`), so a code search
> is a substring match across all terminologies. Assert on the exact
> code **and** terminology, not on the first row.

## 3. Data selection: select all and counter

**Implemented and passing:** `cypress/e2e/DataSelectionSearch/data-selection-select-all.feature`
(3 scenarios; steps in `table.cy.ts`, helpers in `NumTable.ts`).

Route: `/data-selection/search`. **Observed:** a header checkbox with the
tooltip "Alles auswählen", a free-text search, and a counter badge on
"Zur Merkmalselektion hinzufügen".

```gherkin
Feature: Data selection - bulk selection

  Background:
    Given I am logged in as a user
    And I am on the "Data Selection" page (new)
    And I set the language to the configured language

  Scenario: Select all checks every visible row                              # observed
    When I click the "Select all" checkbox in the result table (new)
    Then every visible row in the result table is checked (new)
    And the button "Add to data selection" should be enabled (new)

  Scenario: Add is disabled while nothing is selected                        # observed
    Then the button "Add to data selection" should be disabled (new)

  Scenario: The counter badge shows the number of selected rows              # inferred
    When I select 3 rows in the result table (new)
    Then the selection counter shows "3" (new)
```

> **Timing note:** immediately after clicking "Alles auswählen" the header
> checkbox was ticked while the row checkboxes still looked unticked and the
> badge read `0`. About a second later all rows were checked and the add button
> was enabled. This is a render delay, not a lasting bug, but any step must
> **wait for the row state**, not assert right after the click.

## 4. User menu

**Implemented and passing:** `cypress/e2e/UserMenu/user-menu.feature` (4 scenarios;
steps in `userMenu.cy.ts`, helper in `NumUserMenu.ts`).

**Verified:** the user dropdown is a plain `mat-select`, **not** the shared
`num-menu`, so the existing `I open the menu` step cannot reach it. It offers
"About the Portal", "Log" and "Log Out". "Log" (the error log) is disabled while
there are no errors to show (`!hasErrorsToDisplay()` in `user-menu.component.html`)
- **not** because of a missing user role, as the first version of this document
claimed. "About the Portal" opens a dialog, and "Log Out" lands on the Keycloak
sign-in form (a different origin, asserted with `cy.origin`).

## 5. Language switch

**Implemented and passing:** `cypress/e2e/Language/language-switch.feature`
(3 scenarios). Switching to German and back translates the side navigation, and
the choice survives an in-app navigation (a side-nav click). It does **not**
survive a hard `cy.visit()`, which is why the `Background` sets no language.

> **Label trap:** the side nav label for saved queries is `Saved data definitions`
> (lowercase "d", key `NAVIGATION.QUERYBUILDER_OVERVIEW`), while the breadcrumb for
> the same page says `Saved Data Definitions`. The first draft used the breadcrumb
> text and failed.

## 6. Criterium actions in the editor

**Implemented and passing:** `cypress/e2e/CohortEdit/criterium-actions.feature`
(4 scenarios; new steps in `menu.cy.ts` and `criteriaList.cy.ts`).

**Verified:** the criterium options menu has exactly three entries: Configure,
Duplicate and Delete. There is no move entry, so moving a criterium between the
"Stage" list and the Inclusion / Exclusion groups is drag and drop only. A new
criterium starts in the list with `id="Stage"`. Duplicate creates a second box
with the same name; Delete removes it.

> **Test data note:** the feature uses `BIOMAT erheben`, not `Pneumonia`. In this
> environment a name search for "Pneumonia" returns 20 LOINC "Klebsiella
> pneumoniae ..." lab rows first, so the exact `Pneumonia` diagnosis never
> appears on the first page (the ranking issue described in `cypress/CLAUDE.md`).
> The existing `CohortEdit/cohort-exclusion.feature` also uses `Pneumonia` and
> fails the same way here, as do 3 of the 6 `cohort-edit.feature` examples and
> scenario 2 of `DataQueryCohort/data-query-cohort.feature`. The criterium exists:
> SNOMED `233604007`, context `Diagnose`, original text `Pneumonia` (its English
> translation is empty, so the UI falls back to the original). Adding it by code
> instead of by name would make those scenarios reach it.
>
> **Separate failure:** scenario 1 of `data-query-cohort.feature` fails because
> `downloadFile.cy.ts` clicks `[data-cy="download-ccdl"]`, which no template
> defines (the download component carries `download-format-crtdl` and
> `download-format-csv`).

## 7. Validity gating and empty state

**Implemented and passing:** `cypress/e2e/DataQueryCohort/cohort-definition-empty.feature`
(3 scenarios; steps in `cohortDefinition.cy.ts`). Without a cohort the page shows
the empty message, "Feasibility Query" and "Save cohort" are disabled, and
"New Cohort" opens the criteria search.

Still **inferred** (not implemented): download and save becoming enabled once a
criterium sits in a group.

## 8. Navigation

**Implemented and passing:** `cypress/e2e/Navigation/side-navigation.feature`
(3 scenarios; steps appended to `sideNav.cy.ts`). The side nav lists four areas
and collapses to icons only (the `collapsed` class on `mat-nav-list`).

> **A weak existing step:** `I am on the {string} page` does a hard `cy.visit()` when
> the URL does not match, so used after a click it cannot fail for a navigation
> that never happened. The new step `I should arrive on the {string} page` only
> asserts the URL, and `cohort-definition-empty.feature` uses it.

Still **inferred** (not implemented): that a full page reload keeps the user
signed in.

## New step definitions needed

Grouped by file. Everything marked **(new)** above maps to one of these.

| Suggested file | Steps |
|---|---|
| `bulkSearch.cy.ts` (new) | switch to bulk tab, enter codes, select terminology, run search, assert results, add as group criterium |
| `search.cy.ts` (extend) | filter dropdown select, "Reset filters" state, result row code and terminology assertions |
| `table.cy.ts` (extend) | select-all checkbox, "every visible row is checked" (with wait), selection counter |
| `menu.cy.ts` (extend) | open user menu, user menu item state, log out |
| `language.cy.ts` (extend) | assert page heading, assert language persists across routes |
| `criteriaList.cy.ts` (extend) | assert criteria count by name, assert "Selected" list contents |
| `sideNav.cy.ts` (extend) | toggle, assert collapsed labels |

## Gaps in this document

- The English UI was **not** exercised, so every English label is a translation
  guess. Check `src/assets/i18n/` before use.
- Saved queries, upload and download flows were **not** re-explored; the
  existing features already cover them.
- Criterium configuration (the filter editor) was **not** opened, since the
  existing `Criterion/**` features cover it in depth.

## Update: data in `Examples`, and a gap found while repairing data selection

All features written in this pass keep their data (criteria, codes, concepts, labels,
button names, dates) in `Examples` tables, so a value can be replaced without editing a step.

`DataSelectionSearch/data-selection-search.feature` was rewritten against the current UI
(table search instead of a tree, "Configure" instead of "Edit", no "Save" button, concept
chosen by code). One part is **not covered**: setting a time restriction in the profile
editor leaves the "Applied filters" header showing only the code filter chip. This needs a
product decision (intended behaviour or bug) before it can be tested; see the note in the
feature and in `TEST_DATA.md`.
