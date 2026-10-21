# Plan: usability of the "Referenzen" tab (data selection editor)

Status: draft, layout not decided yet. Written 2026-10-20 from the conversation with Shah.
Interactive mockups: https://claude.ai/artifact/DMUBZu6JsXZnC6HyiB8wMr (private artifact, owner only)

## 1. Goal

A user who opens the Referenzen tab of a feature (for example Patient or Diagnose) understands within seconds:

1. which references the feature can have,
2. which already existing features they can link,
3. which new features they can add and link,

and can do each of these in one or two clicks without opening a dialog.

As a side effect the CSS of the tab is cleaned up to the project's roles, tokens and type roles (`styles-next`), with no `::ng-deep` leaks and no hardcoded colors.

## 2. The problem is usability, not code

The code works. The page is hard to use. Observed with the current UI (Patient, Diagnose):

- **The main action is easy to miss.** "Neues Merkmal hinzufügen" is a small button in the bottom left, far from the empty-state text that mentions it. The hint alone does not tell a new user what to do.
- **A dialog for a tiny task.** The button opens a very wide modal for one to four entries, with a duplicated label per row ("Organization / Organization"). Adding something costs click, tick, confirm. The same information could be shown inline.
- **Existing and new are not separated.** Features already in the data selection that can be linked show up as checkbox tiles. Features that do not exist yet are only reachable through the modal. The user cannot see both options together.
- **Three levels of navigation.** Outer tabs (Felder / Referenzen / Informationen), inner tabs (one per reference field), then the lists. The inner tab names are raw FHIR element names (`asserter`, `recorder`, `detail`, `ReferenzPrimaerdiagnose`), partly translated, partly not. The names cannot be changed.
- **Dead space.** The list sits at the top, the button sits 400px lower, a big area between them is empty.

Not in scope: the truncated chip in the "Referenzierte Merkmale" header column, and the identical-looking duplicate tiles (already fixed elsewhere).

## 3. How it works today (so we do not break it)

Component chain:
`profile.component` → `num-filter-tabs` (outer tabs, own `.tab` divs) → `num-profile-reference` (`mat-tab-group`, one inner tab per `ReferenceField` plus an Information tab) → `num-reference-field-tab` → `num-possible-references` → `num-selectable-reference-tile`.
The modal is `ProfileReferenceModalComponent` opened through `ProfileReferenceModalService`. Its tree comes from `ProfileReferenceAdapter`.

Files: `src/app/modules/query-editor/components/editor-content/profile/reference/` (all four sub-components and the modal), `src/app/shared/components/selectable-reference-tile/`, `src/app/service/PossibleReferences.service.ts`.

Data model (confirmed by Shah, this is intended behavior):

- A feature (profile) can be in the data selection **n times**. Each instance is independent. Some are linked as a reference, some are not.
- Each reference field lists every instance in the selection whose profile is an allowed target of that field. Ticked means linked, unticked means linkable but not linked in this instance.
- The modal lists the allowed **profile types** of the field, not instances. Confirming it loads the profile, creates a new instance and links it (`PossibleReferencesService.loadAndMapProfiles`).
- The number of allowed types per field is usually 1 to 5, but can be **100**. Observed: Patient has 1, 2 and 1 types in its three fields.

## 4. Constraints

- The two tab rows are a fixed design. The inner tab row is used in other places as well (for example "Was sind Felder? / Felder"). Contrast between the rows may be improved. Removing the inner row on this tab is allowed to be explored, but it is hard and affects consistency.
- The Information inner tab stays for now.
- Must work with 1 to 100 allowed types and with a long list of already selected instances.
- Must stay usable on a laptop screen (about 1366x768). The content area below the tab rows is then only about 340-390px high.
- The portal is light-only. Use the real tokens: accent `#5a79af`, accent strong `#49689c`, text secondary `#6a7483`, checkbox green `#839e00`, card radius 5px, Titillium Web, button role 16/24/600.

## 5. Complexity

High, for these reasons:

- Three nested navigation levels, one of them shared with other pages.
- Two kinds of list content (instances to link, types to create) that behave differently.
- Unbounded list sizes (1 to 100 types, n instances) combined with small laptop heights.
- Shared state in `PossibleReferencesService` (nested map profile id → element id → entries) that several components read and write.
- Cypress steps depend on the current structure (see section 8).
- Style debt in the same files: four copies of `::ng-deep .mdc-tab`, hardcoded `white` / `#fff` / `rgba(0,0,0,.02)`, `font-size: medium`, a 24px placeholder, a dead `mat-drawer-container` rule, two unrelated tab styles stacked.
- A dead branch in `ReferenceFieldTabComponent.updateSelectedPossibleReferences` (pushes `undefined`).

Because of this, the plan is staged and the layout is chosen with mockups first, before touching production code.

## 6. Artifacts and research so far

The mockup artifact (link at the top) has switches for:

- **Navigation between fields:** current tab row, or a left list that shows "n verknüpft · m möglich" per field.
- **Content layout:** A stacked, B two columns, C add bar on top, D split with docked add zone, E two large tabs, G one list grouped by profile.
- Screen height (desktop 1080p / laptop 768p), 3 or 100 possible profiles, 2 or 12 selected, tab-row contrast, portal look vs first draft.

Findings from the mockups and from design-system research (details are in the artifact):

- Several tab rows read as sub-categories and should be avoided or at least look different (LogRocket, California Courts Design System, GitLab design issue).
- For more than about 8 values a searchable list is recommended, with selected values grouped (SAP Fiori). A dual list is meant for bulk moves and fits only partly, because here every click creates an instance (Splunk, Microsoft Dynamics 365).
- A and D lose "Neu hinzufügen" or get cramped on a laptop. E adds a third tab level. B keeps both zones visible with their own scroll. G has no two-zone split at all.

Shah's reaction so far: likes the section headings, descriptions, badges and the add button wording. Likes the two-columns idea. Is not satisfied with a third tab row, so E is out as a main choice. Wants to see whether the inner tab row can go.

## 7. Plan

Phase E, environment (from the retro of the planning session, do first, small):
- Navigation pointer. The repo has no `CLAUDE.md` or `AGENTS.md`. Add a short `CLAUDE.md` at the repo root that only points to the component folder `src/app/modules/query-editor/components/editor-content/profile/reference/` and to this plan (the data model is in section 3). Reason: the planning session misread the data model twice because nothing recorded it.
- DevTools recipe. Add a memory note (next to `local-test-login.md`) with the shortest route to the Referenzen tab: save snapshots with `filePath` and grep them instead of reading them; open `/data-selection/overview`; open the "Optionen" menu with `evaluate_script` (`button[aria-haspopup=menu]`, a plain click does not open the Material menu), then click "Konfigurieren" in `.cdk-overlay-container`; click the outer tab by text (`.tab`, the outer tabs have no `role=tab`). Reason: the planning session needed about 10 calls and several failures to get there.
- Automated checks. `npm run check:styles` (`scripts/check-styles.cjs`), `npm run lint` and the husky pre-commit hook (`pretty-quick`, `lint-staged`) already exist. They become completion criteria in Phase 1 and Phase 4 below. Read `scripts/check-styles.cjs` first to see what it enforces.

Phase 0, decide (no production code):
1. Pick the layout in the artifact: B (two columns) or G (one list) for the content, tab row or left list for the field navigation. Review on the laptop setting with 100 types and 12 selected.
2. Confirm: search field above 8 entries, one-click add without confirm step (the modal allowed ticking several and confirming once), and the branch to work on (the current branch `chore/remove-dead-palettes` has unrelated changes).

Phase 1, CSS cleanup without behavior change:
- Remove the four `::ng-deep .mdc-tab` copies and the dead rules, move the tab look into the global `_mat-tab.themed.scss`.
- Replace hardcoded colors and sizes with tokens and type roles, no `!important`.
- Give the inner tab row more contrast than the outer one (tinted strip, active top bar, optional counters).
- Done when `npm run check:styles` and `npm run lint` pass and the four `::ng-deep .mdc-tab` copies are gone (`grep -rn "ng-deep .mdc-tab" src/app` finds none).

Phase 2, replace the modal with the chosen inline layout:
- Show instances (checkbox, state badge) and addable types (button) together, with the existing headings and descriptions.
- Add the search field above 8 entries and independent scrolling for long lists.
- Reuse the `loadAndMapProfiles` path for "Hinzufügen", delete `ProfileReferenceModalComponent`, `ProfileReferenceModalService` and `ProfileReferenceAdapter` if nothing else uses them.
- Drop the empty-state placeholder if the add list is always visible, otherwise restyle it.
- Remove the dead `else` branch in `updateSelectedPossibleReferences`.

Phase 3, field navigation (only if the left list is chosen): replace the inner `mat-tab-group` on this tab only, keep the Information entry first, keep the tab row everywhere else.

Phase 4, verify: update Cypress, run it, check screenshots at laptop and desktop size for Patient (3 fields) and Diagnose (6 fields) with few and many entries. Done when `npm run check:styles`, `npm run lint` and `npm test` pass and the commit goes through the husky pre-commit hook.

Further retro findings that touch Shah's global setup (output style conflict, hook noise, shell globs, classifier errors) are listed separately in `PLAN-references-tab-retro.md`. They are not part of this refactor.

## 8. Cypress impact

`cypress/e2e/DataSelectionSearch/data-selection-search.ts` and the feature file use: `.reference-container`, `.placeholder-box`, `num-modal-window`, `[data-cy=<name>]`, `.mdc-tab__text-label`, and the button text "Add new reference". The scenario clicks the "References" tab, then the "Part of" tab, expects the placeholder, opens the modal, adds "Procedure", saves. These steps change with Phase 2 and 3 and must be rewritten.

## 9. Open questions

1. Final layout: B, G, or something new after more review?
2. Keep the inner tab row, or a left list for this tab only?
3. One-click add: is losing "tick several, confirm once" acceptable?
4. Search threshold of 8: fine?
5. Branch base: `main` or the current branch?
