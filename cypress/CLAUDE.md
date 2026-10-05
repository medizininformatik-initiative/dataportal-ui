# CLAUDE.md — cypress/

Guidance specific to working in this test suite. Repo-wide conventions are in
the root `CLAUDE.md`; this file only covers what's particular to Cypress/Cucumber
here, discovered while auditing and refactoring this suite — mechanisms worth
knowing before touching a `.feature` file or its step definitions, not just a
reference table (see `TEST_DATA.md` for that — which criteria to use, from which
ontology context, and how to re-verify one).

## Step-definition files are resolved by exact basename match

`package.json`'s `cypress-cucumber-preprocessor.stepDefinitions` glob resolves a
`.feature` file's steps from either (a) a `.ts` file with the **exact same
basename**, in the same directory (`CohortEdit/cohort-edit.ts` ↔
`CohortEdit/cohort-edit.feature`), or (b) anything under
`cypress/support/step_definitions/` (loaded globally, for every feature).
There's no third option — placing new steps in an unrelated same-folder file
(e.g. adding a new feature's steps into an existing sibling's `.ts`) silently
fails to load them. New, feature-specific steps need a matching-basename file;
new, reusable steps belong in `support/step_definitions/` (or
`support/component-objects/`, see below).

## The `numDataCy` directive and its registry

`src/app/shared/directives/num-data-cy.directive.ts` is the single place that
attaches a `data-cy` attribute — every template uses `numDataCy="literal"` or
`[numDataCy]="expr"` instead of a raw `data-cy`/`[attr.data-cy]`, so renaming or
extending the mechanism (validation, dev-mode duplicate-value warnings, etc.)
means changing one file, not every template that has a test hook.

**Registry** — every component carrying `numDataCy`, its value(s), and the
Cypress component-object (see below) that reads it:

| Component | `numDataCy` value(s) | Read by |
|---|---|---|
| `checkbox` | `"checkbox"` | `NumCheckbox` |
| `criteria-box` | `criterion().getDisplay()` (dynamic, on the inner `.container` div — **not** the `num-criteria-box` host tag, so a plain `[data-cy="..."]` lookup needs `.container[data-cy="..."]` to stay unambiguous, see below); `"criterion-content"` | `criterionToEditor.cy.ts`, `NumFilterChips`, `cohort-edit.ts` |
| `side-menu` | `'nav-' + navItem.routeTo` (dynamic, one of the `BasePaths.*` values) | `sideNav.cy.ts` |
| `save-dataquery-modal` | `"dialog-title-input"`, `"dialog-comment-input"` | `NumModal`/`support/step_definitions/cohortResult.cy.ts` |
| `saved-query-tile` | `"saved-query-delete-icon"` | `savedQueries.cy.ts` |
| `menu` | `"openMenu"`; `item.label \| translate` (dynamic, per menu item) | `NumMenu` |
| `filter-chips` | `filterChip.type \| displayTranslation` (dynamic); `chip.text \| displayTranslation` (dynamic) | `NumFilterChips` |
| `download-crtdl` | `"download-modal"` (the `num-save-file-modal` host), `"download-format-crtdl"`, `"download-format-csv"`, `"cancel-download-button"`, `"save-file-button"` | `downloadFile.cy.ts` |
| `language` | `"language-select"`, `"language-option-de"`, `"language-option-en"` | `language.cy.ts` |
| `tree` | `node.data.display \| displayTranslation` (dynamic, per tree node) | `data-selection-search.ts` |
| `action-bar` | `"upload-crtdl"` (the file `<input>`); `"download-crtdl-button"` (opens the download modal); `"save-cohort-button"` | `uploadFile.cy.ts`; `action-bar.cy.ts` (icon-only buttons — see its `ICON_ONLY_BUTTONS` lookup, since the other action-bar buttons are text-matched, this one has no visible text) |

Deliberately **not** migrated: `dashboard`, `data-selection-boxes`,
`query-editor/criterion`, `reference-edit`, `save-dialog` (feasibility-query
result), `value-filter` — these had raw `data-cy` before this pass and weren't
in scope for it; migrate them onto `numDataCy` the next time one of them is
touched for an unrelated reason, not as a standalone follow-up.

## Component Object library — one class per shared Angular component

`cypress/support/component-objects/` holds one generic, parametrized class per
reusable component from `src/app/shared/components/<name>/` (`NumButton`,
`NumCheckbox`, `NumTable`, `NumModal`, `NumFilterChips`, `NumMenu`, plus
`MaterialSelect` for Angular Material's own `mat-select`/`.mat-mdc-option`,
which isn't one of ours). Reach for the matching class instead of writing a new
`cy.get(...)` chain against a shared component — that's the whole point of the
library. `defineStep(...)` bindings stay in `step_definitions/`/per-feature
files; their bodies should just call into these.

## `data-cy` is for elements with no meaningful text — not a default for everything

Discovered while retrofitting `save-dataquery-modal`: an empty `<input>`/
`<textarea>` or a bare icon (`fa-icon`, no label) has nothing to match against,
so `data-cy` is the right tool. A button with a real, stable, translated label
does — Cypress's own guidance already covers that case (see below), and this
codebase already does it successfully (`action-bar.cy.ts`, `cohort-edit.ts`'s
`cy.contains('button', 'Select')`). Adding `data-cy` to every button would just
duplicate what text-matching already does correctly. When multiple instances of
the same component share one label (e.g. every `saved-query-tile` has a
"Load Data Definition" button), scope into the right instance first (by its own
distinguishing text, like the tile's title), then match the button by text
within that scope — don't reach for a new attribute just to avoid the two-step
lookup.

## `data-cy` only on markup we own — never Angular Material's internals

Angular Material generates its own DOM (`.mat-mdc-option` list items,
`.mat-datepicker-input`, `.cdk-overlay-backdrop`) — there's no template of ours
to attach `data-cy` to. For those, `cy.contains(text)` is the right call, not a
workaround (Cypress's own guidance: "if text is meaningful, use
`cy.contains()`"). Only retrofit `data-cy` on components under
`src/app/shared/components/` or route-level components we actually author.

## A row/entity's internal `id` is not usable as a test selector

Checked before using one: `TableRowData.id` (and similarly most domain-model
`id`s surfaced via search results) traces back to the backend response —
ultimately Elasticsearch's own document id for ontology-backed entities. It's an
opaque hash a test author can't predict or write into a `.feature` file in
advance. Row-finding stays text-based (`cy.contains('td', text)`) — which is
also just the Cypress-recommended approach for text that's meaningful to the
test, not an accepted fallback. Don't add `data-cy="{{ someEntity.id }}"`
expecting it to make a selector more robust — check what that id actually is
first.

## What renders isn't always the field a test assumes — check the fallback

`DisplayTranslationPipe` → `Display.translate(language)`
(`src/app/model/DataSelection/Profile/Display.ts:37-64`):

```ts
if (translation && translation.getValue()) {
  return translation.getValue() ?? this.original
}
return this.original
```

`if (translation && translation.getValue())` is a **truthiness** check — an
empty-string translation (`""`) is falsy, so it silently falls through to
`this.original` (the source-language text), not blank. A criterium whose
`display.en` is `""` still renders something in English mode — just the
`original` (often German, for this ontology), not an empty cell and not an
English phrase. Confirmed on a real document
(`"11-Hydroxylase-Mangel"` → `en: ""` → renders as `"11-Hydroxylase-Mangel"`,
not blank) while investigating why a scenario wasn't matching.

**When picking a criterium** (see `TEST_DATA.md`), verify `display.en` is
*genuinely non-empty*, not just that your search term matched something — a
query can match via `original` or another field even when `en` is empty. If
`en` is empty for a candidate, either pick a different one or write the
scenario against `original` instead — whichever `Display.translate('en')` would
actually return for that document, not whichever the Gherkin author assumes.

## Ontology reload is a real, observed source of flakiness — not paranoia

`elastic-search-init` (`cypress/docker/docker-compose.yml`, `FORCE_REINSTALL:
true`) is a one-shot loader. Querying Elasticsearch while it's still `Up` (not
yet `Exited (0)`) can return a consistent-looking but partial dataset that
changes under you — observed directly: doc count went 289,225 → 671,652
*during* a single investigation, invalidating already-"confirmed" criteria
before they were committed. Always confirm
`docker ps -a --filter name=elastic-search-init` shows `Exited (0)` before
trusting any Elasticsearch-backed check, and re-check doc count is stable
across ~20s before relying on results (see `TEST_DATA.md` for the exact
commands).

## A criterium's filter capabilities come from its shared ui-profile, not its name

Whether a criterium's `query-editor/criterion/:id` page shows a Time
Restriction tab, a value/quantity filter, or attribute filters is decided by
its **ui-profile** (`GET terminology/ui-profile`, keyed by a FHIR profile
name like `MII_PR_Labor_Laboruntersuchung`) — and that profile is shared by
every criterium under the same context/module, not computed per-criterium.
"A lab test has a numeric value" is not a safe inference: `Age` (LOINC
`30525-0`, context `Laboruntersuchung`) looked like an obvious pick for a
value-filter scenario and turned out to render *only* a Time Restriction tab
— its profile's `valueDefinition` is `null`. Checked across all ~60 profiles
this ontology has, exactly one (`MII_PR_Person_Patient`, context `Patient`)
declares a `quantity` value filter with units. Before writing a scenario that
depends on a specific filter type, check the candidate's profile (see
`TEST_DATA.md`'s ui-profile query) or just open the real
`query-editor/criterion/:id` page for it — don't infer from the criterium's
name, kds_module, or "it's a lab test" intuition.

## Free-text search ranking can bury an exact match — search by termcode instead

The app's own search endpoint (`terminology/entry/search`) matches substrings
against `display.original` (not just `display.en`) — so a short English term
like "Age" also matches unrelated German originals that happen to contain
"age" as a substring (`Ageusie` = "loss of taste", `Agel-Amyloidose`, every
`Agenesie von ...`), and with enough of those, the exact match doesn't appear
in the first page of results even though it's the top-scored hit in
Elasticsearch directly. This is a UI search-ranking property, not missing or
drifted data — confirm via a direct ES `match` query (see `TEST_DATA.md`)
before assuming a criterium is gone just because the app's own search box
doesn't surface it. When this happens, search by the criterium's termcode
instead (the search bar explicitly supports "Enter code or search term", and
a code match is exact — one hit): use the
`I add the criterium "<criterium>" via code "<code>" to the editor` step
(`cypress/support/step_definitions/criterionToEditor.cy.ts`) instead of the
plain by-name one.

## A value filter's chip can share its data-cy with its own criteria-box

`NumFilterChips`/`cohort-edit.ts` look up a criteria-box by
`[data-cy="<criterium display>"]`. For a **value** (not attribute) quantity
filter, the filter concept *is* the criterion itself, so its filter-chip
block ends up carrying the exact same `data-cy` text as the criteria-box it
lives inside (confirmed for `Current chronological age`: both the box and its
own "greater than" chip's block render `data-cy="Current chronological age"`)
— an unscoped `[data-cy="..."]` lookup then matches both and either errors
("contained 2 elements") or silently picks the wrong one. Scope to
`.container[data-cy="..."]` (the box's real host — see the registry above),
never a bare `[data-cy="..."]`, when the criterium might have this kind of
filter.

## A value filter's edit doesn't always survive "Close" without waiting for it

Setting a quantity/value filter on `query-editor/criterion/:id` and
immediately clicking "Close" intermittently lost the filter — the
criteria-box back on the Feasibility Editor page still showed "Please set a
filter" despite every prior step succeeding. Root cause: the page edits a
**cloned working copy** (`EditCriterionService.initialize()` deep-copies the
criterion; `emit()` deep-copies again and pushes through
`CriterionProviderService.setOne()`), and the Feasibility Editor's criteria
list only sees the update once that round trip has propagated back through
`criterion$` → the `criterion()` input signal → change detection — which
takes an extra tick or two that a fast, scripted click can outrun (a real
person retyping/re-clicking doesn't hit this). Time-restriction filters
never showed this because their update path happens to settle before the
"Close" click; quantity filters can not. Fix: assert the criterion page's own
"Selected Filters" summary (`.header-col-chips`, fed by the same round trip)
shows the new value **before** clicking "Close" — Cypress's normal retry
absorbs the propagation delay without a fixed `cy.wait()`. See
`CohortEdit.shouldSeeChipValueInFilterSummary` in
`cypress/e2e/CohortEdit/cohort-edit.ts`.

## A quantity comparator filter chip's exact text is `"<symbol> <value> <unit>"`

`FilterChipQuantityAdapter.adaptQuantity` (comparator case) builds the chip
text as `` `${symbol} ${value} ${unitDisplay}` `` (e.g. `"> 5 a"` for
"greater than 5, unit a") — that whole string, not just the number, is both
what renders and the chip's `data-cy` value. A test step doing an *exact*
`data-cy` match (`NumFilterChips.getFilterChipByName`, unlike the
substring-based `.should('contain', ...)` checks elsewhere) needs the full
string, not just the value the scenario cares about.

## Feasibility result computation is genuinely async — check `.settings`, don't guess a timeout

`GET /.settings` on the backend (no auth needed, confirmed directly — e.g.
`curl http://localhost:8090/.settings`) returns the real polling/expiry
config as ISO-8601 durations: `passthroughPollingTimeUi` and
`queryResultExpiry` were both `PT1M` (60s) in this env,
`readResultSummaryPollingInterval` `PT15S`,
`readResultDetailedObfuscatedPollingInterval` `PT10S`. `num-spinner`'s
countdown on the result page is driven by `passthroughPollingTimeUi` — a
default ~4s Cypress assertion timeout isn't remotely enough to wait out a
real computation; a scenario that needs the actual computed result (not just
"reached the Result page") needs a timeout sized off these values, not a
guess. See `CohortResult.resultIsVisible()`
(`cypress/support/step_definitions/cohortResult.cy.ts`) for the pattern: ~70s,
covering a full `queryResultExpiry` cycle plus slack, applied to both the
spinner-gone and the content-appeared assertions (the spinner disappearing
*is* the completion signal — giving only the second assertion a long timeout
still fails if the first one gives up first).

**The per-site "Details" dialog needed a similar wait and was cut instead of
extended further** — opening it and waiting (~70s) for its own async,
separately-polled breakdown to populate pushed a real scenario long enough to
cross into the app's OAuth silent-token-refresh cycle
(`login-status-iframe.html/init` firing mid-test, access tokens are 300s
here), which was observed to trigger an unexplained navigation back to
`feasibility-query/search`, losing all dialog/result state. This is a real,
reproducible interaction between long-running scripted waits and the auth
library's refresh handling — worth its own investigation if the Details
dialog needs test coverage, but it's a different problem from "cohort
saving," which is what `cohort-result.feature`'s scenario is actually about;
the dialog-opening step was removed from that scenario rather than chasing
this further within an unrelated refactor pass.

## `I am on the "..." page` does a hard `cy.visit()` when the URL doesn't already match — and that resets the language

`SideNavTests.visitUrl` (`cypress/support/step_definitions/sideNav.cy.ts`)
only skips `cy.visit()` when the current URL already includes the target
path; otherwise it does a real, full-page `cy.visit()`, not an in-app SPA
navigation. That reruns Angular's whole bootstrap sequence (see the root
`CLAUDE.md`'s `CoreInitService.init()` chain) from scratch, and the language
selected earlier via "I set the language to English" isn't persisted through
that — it's back to the app's German default afterward. Confirmed the hard
way: `data-query-cohort.feature`'s second scenario has a Background that
lands on "Data Query - Cohort Definition", then its own first step visits
"Feasibility Search" — a **different** page than the Background's — via
`Given`/`And` (an action, not a `Then` assertion after some in-app click),
forcing the hard reload and silently reverting to German; a
`getRowByExactText` search for "Pneumonia" then failed because the row
actually said "Pneumonie". Any scenario whose first action-step visits a
*different* page than its Background already established needs its own "I
set the language to English" right after — don't assume the Background's
language setting survives a scenario that changes pages via `Given`/`When`
rather than in-app clicks.

## `showSave` is `false` on the Feasibility Result page

`num-action-bar` on `result-action-bar.component.html` explicitly sets
`[showSave]="false"` (the default, from `editor-action-bar.component.html`
which doesn't override it, is `true`). "Save cohort" only exists on the
Feasibility **Editor** page — a scenario that runs Feasibility first and then
tries to save afterward is clicking a button that isn't rendered. Save before
running Feasibility, not after.

## A concept filter chip shows the concept's display text, not its code

On the criterium box, a selected concept renders as a `.chip-container` with the concept's
**display** text (for `Cause of death` -> `J13`: `Pneumonie durch Streptococcus pneumoniae`)
under a block carrying the filter's name (`ICD-10-WHO`). The text is the ontology's original, so
it is German in the English UI when no English translation exists. A scenario asserting a chip
therefore needs the display text in its `Examples` (`firstChip` / `secondChip`), kept in step
with the code column. See `attribute-concept-select.feature` and the step
`the criterium {string} shows a filter chip for {string}` in `criterionEditor.cy.ts`.

## Feasibility concept filters have one value set; data-selection code filters can have several

Checked against `GET terminology/ui-profile`: every feasibility concept filter (attribute or value)
references exactly one value set, so one code can never appear in two systems in the same table
there. The data-selection `Diagnosis` profile's Code Filter offers ICD-10-GM, Alpha-ID, SNOMED and
Orphanet together (`GET dse/profile-data`, keyed by the profile **url**, not the Elasticsearch `_id`),
so `I26` shows up twice. That is what `attribute-concept-same-code-different-system.feature` tests.
The search table shows a row's system as its display name (`ICD-10-GM`, `Alpha-ID`) in its own cell;
the selected-concepts list shows only display and code.

## A reference is saved asynchronously — wait for its chip before closing the editor

Choosing a profile in the add-reference modal only returns URLs; `ReferenceFieldTabComponent` then
loads the profiles from the backend before the reference exists. Clicking "Close" straight after
"Select" silently drops it. Assert the "Selected Reference" chip first (see
`data-selection-only-if-referenced.feature`, issue #641).

## Negative paths: break the backend with `cy.intercept`, assert on the error dialog

`cypress/e2e/NegativePaths/` covers what happens when things go wrong. The steps in
`support/step_definitions/backendFailures.cy.ts` register an intercept (status code, unreachable,
slow answer, 401) and must run after the page has loaded and before the action that fires the
request. Two overlays report errors and are not interchangeable: `num-error-display` (any non-
validation HTTP error and uncaught errors; hard-coded English, title is the raw error type) and
`num-error-log-modal` (the backend's validation problems for a rejected upload). Their steps are in
`errorDialog.cy.ts`. Scenarios tagged `@pending` describe behaviour the app does not have yet
(raw `GENERIC_ERROR` title, `[object Object]` for network errors, 401 not sending the user to
sign in, no empty-result message on the data selection search); they fail on purpose.

## CRTDL roundtrip matrix: generate cases, don't hand-write fixtures

`DataQueryCohort/crtdl-roundtrip.feature` uploads a generated CRTDL, downloads it again and checks
everything sent came back. `support/crtdl/` has one file per concern, so each changes alone:
`ontology.ts` (facts about the test ontology - the only file to re-verify after an upgrade),
`types.ts`, `filters.ts` (filter shapes, no ontology), `criteria.ts` (`criterion(name, ...modifiers)`),
`groups.ts` (`attributeGroup(profile, ...)`), `crtdl.ts`, `cases.ts` (composition only) and
`roundtrip.ts` (what "the same" means, as explicit rules). A value used twice gets a name once in
`cases.ts`; do not inline a date, a limit or a repeated criterion.

After touching any of them run `npm run crtdl:validate`: it asks the backend whether it accepts
every case, so a failing roundtrip means the UI lost data, not that the input was invalid.
`docs/crtdl-roundtrip-cases.md` is the readable list of the cases (a plain sentence each, written by
`describe.ts`); `npm run crtdl:doc` regenerates it and `npm run crtdl:doc:check` fails when it is
stale. Group order comes from the feature's Examples tables; `@doc-collapse` folds a generated table.

Facts learned the hard way: a quantity `unit` is `{code, display}` with no `system`; the app omits
`includeReferenceOnly: false` on export, so only a true value is sent; group ids are regenerated on
upload, so `roundtrip.ts` ignores `id` and compares `linkedGroups` by length only; the comparator
`ne` makes `validation/crtdl` answer 500 (a backend bug), so it is not in the matrix.
Not covered yet: criteria that reference criteria, consent criteria, unknown fields (#515) and the
old CCDL auto-upgrade (#464, #545).
