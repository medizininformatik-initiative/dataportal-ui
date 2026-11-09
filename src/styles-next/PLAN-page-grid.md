# Plan: page grid for every page (next session)

Written 2026-10-21 at the end of the session. Reference page: the feasibility search (`modules/feasibility-query/components/search/`), done in commit `996391e7`. Notes on that session: `PLAN-design-tokens.md`, block "Session 2026-10-21".

Not checked in a browser by Claude. Every page below needs a look at laptop size (1366x768, side nav open and collapsed), intro shown and hidden.

## 0. Status (updated 2026-10-21, end of session 4)

Every page of the inventory (section 4) now has the grid frame. The dashboard (9) was dropped from the plan. What is left is the rollout cleanup (see "Before the next session").

Decision for section 3: per-page SCSS, not a shared class. Two shared frames came out of the work on their own: `num-query-page` (pages 6 and 7) and `num-editor-content` (page 11). Revisit a global `.page-grid` only if the cleanup shows the same block again.

| Page                    | State                                                                             | Commit                                         |
| ----------------------- | --------------------------------------------------------------------------------- | ---------------------------------------------- |
| 1 Feasibility search    | done                                                                              | `996391e7`                                     |
| 2 Data-selection search | done                                                                              | `f9cb8ed6`                                     |
| 3 Bulk search           | done (checked by Shah)                                                            | `cde94e43`                                     |
| 4 Feasibility editor    | done (plus drop-target effects, grabbed state, empty-list placeholder)            | `d4aeca1b`, `22b96757`, `92b58edc`, `56ef6659` |
| 5 Result                | done (checked by Shah, scrollbar flicker fixed)                                   | `f25ca265`                                     |
| 6, 7 Cohort / Data sel. | done (checked by Shah), shared `num-query-page` frame in `data-query/query-page/` | `42c2d2c3`                                     |
| 8 Data-selection editor | done (checked by Shah, and by Claude in the app with 3 profiles)                  | `c7380638`                                     |
| 9 Dashboard             | dropped from the plan                                                             | -                                              |
| 10 Saved queries        | done (checked by Shah)                                                            | `448b626e`                                     |
| 11 Query editor         | done (checked by Shah); grid in `num-editor-content`, plus a chip bug fix         | `23758be3`, fix `c1c0ecb7`                     |

### Session 5 (2026-10-21), app shell as a grid (uncommitted)

- `app-layout.component.html`: `.app-shell` is one grid, columns `auto minmax(0, 1fr)` (nav | content), rows `var(--header-height) minmax(0, 1fr)`, `height: 100dvh`. Header spans both columns. `position: fixed; inset: 108px` and the `95%` widths are gone. Without nav (`.no-nav`) main spans both columns; main has an explicit `grid-column: 2` otherwise.
- Tokens in `styles.scss` `:root`: `--header-height` 104px, `--nav-width-expanded` 320px, `--nav-width-collapsed` 64px, `--page-gutter` 24px. Header `width: 100%`, right padding = gutter; main `padding-inline: var(--page-gutter)` (replaces `padding-left-4`), so content lines up with the breadcrumbs and the header buttons.
- Usability: skip link "Zum Inhalt springen" (first tab stop, WCAG 2.4.1, `focusMain()` moves focus into `<main id="main-content" tabindex="-1">`, i18n `APPLAYOUT.SKIP_TO_CONTENT`); `scrollbar-gutter: stable` on main (scrollbar appearing no longer shifts the page, see insight 24); nav width transition only with `prefers-reduced-motion: no-preference`; `100dvh`.
- `num-snackbar` and `num-error-display` moved from `header.component.html` to `app-layout.component.html`. They sat inside the header host and made it 154px high instead of 104px.
- The old 4px between header (104) and body (108) is gone. Page content now starts at y=104.
- Measured at 1366x768: header 104, nav 320 (collapsed 64), content 344 to 1332 (right edge includes the 10px scrollbar gutter). `:root` inside a theme mixin did not emit the variables; put tokens in `styles.scss`.
- Header line: soft shadow (`0 1px 2px`, only under the content column) plus a 1px blue-to-green gradient line from the logo divider to the right page gutter. The vertical divider next to the logo is back, so the junction is a clean T. Main has `padding-block-start: var(--spacing-16)` below the header. Action-bar gradient tried and thrown away (outline buttons lost their edge on a tint above about 8%).
- Seen, not done: header logo wrapper stays 320px when the nav is collapsed (64px), so the divider line does not continue; `src/styles/` (old tree) has its own copy of `_app-layout.themed.scss`; `dashboard.component.scss` has its own `.fullscreen`; below about 1000px the 320px nav leaves little room (no auto-collapse); `Cypress` not run.

### Session 4 (2026-10-21), what we did

1. Page 5 (result): grid rows `auto auto minmax(0, 1fr) auto`, `.page-header` + `.title-row`, `height: 24%` and the dead `.height-59` removed, `padding-1` removed from the simple result. Shah's video showed a flickering scrollbar on the patient count: cause in insight 24. Committed (`f25ca265`).
2. Pages 6 and 7 (cohort definition, data selection) share one frame component `num-query-page` (`data-query/data-query/query-page/`): stepper + intro in `.page-header`, content row `minmax(0, 1fr)` with `overflow: hidden`, action bar. Slots: `<num-header-description>`, `<... actions>`, default content. The stepper navigates by itself (input `step` 0 or 1). Both pages lost their stepper imports, `navigate…` methods, `.empty-cohort-box` (it sat on an `ng-container`), `.height-400`, `width-100`, `margin-bottom-3`. The two `::ng-deep` stepper rules now live once, in the frame.
   - Page 7 empty state: only the placeholder box, filling the content row (like page 6). Before: a 50% box above an empty list.
   - `display-profiles` shows its toolbar (search bar, time restriction) only when `isEditable()`: page 7 is display only. Page 8 keeps it. Committed (`42c2d2c3`).
3. Page 11 (query editor, routes `/query-editor/criterion|feature|reference/:id`): `query-editor.component` is a grid `minmax(0, 1fr) auto` (card, action bar). `num-editor-content` is the frame of the three editors, rows `fit-content(40%) minmax(0, 1fr)` (header, tabs). The criterion, profile and reference editors have `:host { display: contents }` and no own `.container`, so their header and tabs are rows of that grid. The header is no longer a fixed 24% of the card (58px instead of about 170px at 768px high). `filter-tabs` tab content padding 8px to 16px (this was open item 6 of session 3). Both header components override the global `.selection-box` (`height: auto`, `margin-bottom: 0`). Committed (`23758be3`).
4. Found a bug that was already in the code: the profile header showed empty reference chips (commit `acd9c880` changed the chip data to `{ display, number }`, `profile-header.component.ts` still pushed bare `Display` objects). Fixed, committed on its own (`c1c0ecb7`).
5. The dashboard was thrown out of the plan.

Not checked in a browser: page 7 with no profile added, page 6 with a real cohort, the reference editor route (`/query-editor/reference/:id`) of page 11, page 11 at 1920x1080.

Seen, not done:

- `::ng-deep .mdc-tab { max-width: fit-content; padding: 0 var(--spacing-30) }` is in `criterion`, `profile` and `reference-edit` SCSS. `::ng-deep` makes it global, so it also hits the `mat-tab` mode toggle on the search pages, but only after one of those editors was loaded. Probably dead, but check the toggle before deleting.
- Intro visibility is global state. Pages 6 and 7 have no `showToggle` on their `num-header`, so after hiding the intro elsewhere it cannot be shown again there.
- `class="bottom"` on `num-action-bar` has no CSS rule anywhere (used on three action bars).
- Unused: `isCohortExistent` in `data-selection.component.ts`, `totalNumberOfPatients` in `cohort-definition.component.ts`.
- The `.selection-box` global in `_header-card.scss` (`height: 100%`, `margin-bottom: 8px`) is now overridden in four places (page 8 box, both page 11 headers). Better to remove it from the global and set it where needed, once all users are checked.

### Session 3 (2026-10-21), what we did

1. Read this plan. Committed page 3 (`cde94e43`, one commit, grid and chips were too mixed in the shared html/ts/i18n files to split).
2. Page 10 (saved queries) built, checked by Shah, committed (`448b626e`).
3. Page 8 (data-selection editor) built, then reworked after Shah's screenshots (too tight to the search bar, time restriction button in the wrong place, box far too tall). Committed (`c7380638`).
4. Claude logged into the local app (credentials in `.github/scripts/create-keycloak-user.sh`) and measured the DOM with Chrome DevTools to find the tall-box cause (see insight 12).
5. Open question, not decided: the `.fullscreen` wrapper (`_app-layout.themed.scss:46`, `width: 95%`, no margin) leaves all the spare 5% on the right. Content starts at the header's 17px left padding and ends 63px from the right. Options: A center it with `margin-inline: auto` (about 47px each side, no longer lined up with the logo), B `width: 100%` plus `padding-inline: 17px` (lined up with the logo, recommended by Claude). It affects every page, so decide once. Shah has not answered yet.
6. DONE in session 4 (padding 16px in `filter-tabs`). Seen on the profile editor (`query-editor/.../profile/profile.component`, not one of the 10 pages): tab content ("Zeitraum (optional)" etc.) starts 8px inside the white card, tabs have 30px padding. Candidate: `padding: var(--spacing-16)` on the tab content in `profile.component.scss`. Not done, Shah has not answered.

### Page 10 (saved queries), what changed (commit `448b626e`)

### Page 3 (bulk search), what changed (commit `cde94e43`, one commit)

- Grid frame in `bulk-search.component.{html,scss}`: rows `auto auto minmax(0, 1fr) auto`, `.page-header` + `.title-row` like page 1; `.header-container`, the `margin-left-auto` wrapper and `width-100` are gone.
- Textarea: autofocus through `viewChild` + `afterNextRender` (not the `autofocus` attribute); focus ring is a 2px accent border (`inset` box-shadow), no glow; textarea `margin-bottom` removed (row gap does it).
- Results host: `flex: 1` and `width: 100%` removed (grid item, `overflow: hidden` is enough).
- Results placeholder text (`FEASIBILITY.BULK_SEARCH.PLACEHOLDER`, de + en) now says what appears there; it was a copy of the textarea placeholder.
- Found table first column header: `CRITERION` ("Kriterium") instead of `DISPLAY` ("Merkmal"). `TABLE.DISPLAY` = "Merkmal" is shared and was set on purpose in `2929489e`; `CodeableConceptBulkFoundEntryAdapter` still uses it.
- Term chips under the textarea (`bulk-search-input.component.*`): one chip per unique term, red when the last search did not find it, x removes the term from the text, click on the chip text selects it in the textarea, summary line "N Begriffe erkannt / M nicht gefunden / Nicht gefundene entfernen". The split rule is now the exported `BULK_TERM_SEPARATOR` in `BulkCriteriaSearchEngine.service.ts`, used by search and chips. New i18n keys `TERMS_COUNT`, `TERMS_NOT_FOUND`, `REMOVE_NOT_FOUND`, `REMOVE_TERM` (de + en). Prototype: `prototype-bulk-chips.html` (variant A built).
- Tried and removed: rewrite the text to one term per line on paste/blur. It did not fire and Shah did not need it.
- Not done: no "N gefunden" count (new terms after an edit are unsearched, the number would lie); local `::-webkit-scrollbar` block in `bulk-search.component.scss` still there.

- `saved-queries.component.scss`: `.page-wrapper` is a grid, rows `auto minmax(0, 1fr)`; `num-feasibility` host is `display: block; min-height: 0; overflow: auto` so the tile list scrolls in its row. `align-items: flex-start` and `class="width-100"` removed. No intro, so no `.page-header` wrapper.

### Page 8 (data-selection editor), what changed (commit `c7380638`)

- `display.component.{html,scss}`: `.page-header` + `.title-row` like page 4, rows `auto auto minmax(0, 1fr) auto` (header, section name, profiles, actions). Old `.profiles-container` height/margin/gap and the dead rules `.selection-box-container`, `.box-container`, `.profiles-box`, `.overflow` removed.
- The time restriction (`num-apply-time-restriction`) moved from the page into `display-profiles`, in a `.toolbar` column under the search bar (Shah: it must not sit under the header, a button hidden between header and list is not visible enough). Page-level import moved with it.
- `display-profiles` `:host` has `gap: var(--spacing-16)` (search bar, summary line, list). `.container` is a grid with `align-content: start; row-gap: var(--spacing-16)`: that is the only spacing between profiles now.
- `data-selection-boxes.component.scss`: box `margin-bottom` removed, `height: auto` and `margin-bottom: 0` added to beat the global `.selection-box`. `linked-references`: tile `margin-bottom: 8px` became `margin-top: 8px`, so the tile hangs under its own box.
- `apply-time-restriction.component.scss` (data-selection copy only): toggle `height: 40px`, `padding: 0 14px`; select, date input and apply button 40px too. The feasibility editor has its own copy of this component, unchanged.
- Not done, seen: the box right edge stops at the scrollbar while the search bar runs full width; the reference tile is narrower than the box (about 80%); `min-height: 104px` makes boxes with few fields taller than needed; `num-section-name` still has its own `margin: var(--spacing-sm) 0` (also on page 4), it adds to the row gap.

### Drag and drop on the criterion box (2026-11-09), DONE in `64b038b0`

Decided with Shah and built:

1. Whole box is the drag handle: both `cdkDragHandle` are gone from `criteria-box.component.html`. Chips have `cursor: grab`. The grabbed look applies to a press anywhere except the `⋮` menu.
2. The stage has the drop-target look of the two lists: frame while the criterion is over it, drop label (`FEASIBILITY.EDITOR.DROP_STAGE`, de + en), empty hint hidden while dragging. The rules live in `general-styles/_drop-target.scss` (`.drop-list` on the cdkDropList, `.drop-col` on its column with the heading), used by both lists and the stage. The stage heading and list are one grid cell (`.stage-col` in `edit.component.scss`).
3. No pulsing frames anywhere (usability): `receiving` is a static frame. The short scale-in on the active list stays and is off under `prefers-reduced-motion`.

Not checked in a browser by Claude: the look of the stage while dragging (frame, label, hint). 13 e2e tests that drag criteria pass, but Cypress does not look at the frame.

Next step (open): the `⋮` menu must stay click-only. Check that a press on `num-menu` does not start a drag now that the whole box is the handle. If it does: `(pointerdown)` with `$event.stopPropagation()` on `num-menu`, or `cdkDragDisabled` while the pointer is on it.

### More to do (Shah, 2026-11-09), not looked at yet

- DONE in session 7 (`42034a04`): search pages: the filters and the filter reset button need to go below the search bar (today they sit to the right of it, see `TODO-2026-10-21.md` items 8 and 9).
- DONE in session 7: data selection: the button that adds a time constraint to all data selections has the wrong label (now "alle Merkmale"). Check the text and the i18n keys (de + en).
- DONE in session 7 (`f7c459a5`): breadcrumbs on `/query-editor/criterion/:id` are wrong: they show "Editor » Editor » Norethisteron und Estrogen" (screenshot from Shah). The first crumb and the middle crumb carry the same label. Find where the crumbs for this route are built, check the other editor routes (`feature`, `reference`) too, and fix the labels and targets.
- DONE in session 7 (local override file, not committed): local backend config (Shah's setup): set the backend configs so the detailed results are still visible after the polling times out. Also lower the polling timeout to 10 seconds, so a timeout is quick to reproduce and debug. Not looked at yet: find the backend polling and detailed-results settings (backend `docker-compose` / `application.yml`, `cypress/docker/`) and the UI polling code that reads them.
- STILL OPEN (needs Shah: which element?): the red of the warning is the wrong red. The app has two error reds (`--num-color--error-on-white`, `--num-color--error-on-tint`); find which red the warning uses and which it should use. This belongs to the color pass (`PLAN.md`, role for the two error reds).

### Session 6 (2026-11-09): develop merged, cleanup, e2e green, drag fix

Commits on `chore/remove-dead-palettes` (not pushed): `aeda6909` (merge of `origin/develop`, 8 conflicts), `788afd69` (Cypress selectors, 3 only-if-referenced examples), `d67cbe6d` (editor label race), `64b038b0` (drag handle, stage drop target), `556a9987` (unused rules, flag-icons, notes).

Done:

- develop merged, so the e2e suite of develop (with `numDataCy` and the data-cy registry) is in this branch. Conflict rule: keep our markup, add develop's `numDataCy` hook.
- Cypress adapted to our markup: checkbox state is `be.checked` (native input, no `aria-checked`), side nav is `num-side-menu` and `.num-nav-group > a.num-nav-link`.
- Full suite: 162 of 163 tests passed; the one failure (time-restriction date field) is fixed at its root, see insight 3. The five editor specs passed twice (22 of 22). The last full run of all 39 specs after the label fix has NOT been done.
- Cleanup: unused rules removed (table row, footer, search input, mat-chip, language toggle, h5, header `.toolbar`, divider modifiers, text label and meta classes), `mat.elevation-classes` and `mat.app-background` removed, spacing generator replaced by the 9 classes the templates use, `width-100` and the global `.selection-box` overrides removed, 15 prototype files deleted. flag-icons through Sass with only `de` and `gb`. Built CSS 217 KB to about 175 KB.
- Material usage counted (grep): tooltip 59 uses in 38 templates, tabs 60 tabs in 22 groups, dialog 19 files (TS only), form-field and select 5 to 6 files, then badge, input, datepicker, sidenav, stepper, menu, toolbar, expansion with 1 to 3 files each.

Insights:

1. Chrome coverage of one session says "not hit", not "dead". Stateful rules (focus, drop, checked), other pages and the other language never show up. Before deleting, check the templates with grep, and prefer a coverage run driven by the whole e2e suite.
2. CSS coverage across the e2e suite without a tool: a temporary `cypress/support` file that scans `document.styleSheets` for `styles.css` every 600 ms and keeps the indexes of rules with a matching element, written per test with `cy.writeFile`. Strip user-state pseudo-classes and pseudo-elements from the selector first (otherwise `::-webkit-scrollbar` looks unused). It must skip other origins (the Keycloak login page throws a SecurityError). Decode the indexes with the CSSOM list of the live page, align it 1:1 with `postcss` rules of the same file, then map to source files with the source map (`source-map` package, `originalPositionFor`). The served `styles.css` must be identical to the one analysed (compare the text).
3. Fast Cypress finds races a person never hits. Reproduce them with one scripted run in Chrome DevTools with short waits (`evaluate_script`, `ng.getComponent(el)` in dev mode, a `MutationObserver` that logs added and removed custom elements with timestamps). Found this way: the header search bar emits its start value after 300 ms, `updateLabel` rebuilt the staged profile and `setActiveProfile` replaced the profile, so tab content re-rendered (a picked time restriction type flipped back, the reference modal result was lost). Fixed by ignoring an unchanged label in `ProfileHeaderComponent.setLabel`.
4. A modal result must not depend on the component that opened it: `reference-field-tab` unsubscribes in `ngOnDestroy`, so a re-created tab drops the result silently. `track reference` (object identity) in an `@for` re-creates every item when the data object is replaced; track by a stable id (`reference.getElementId()`).
5. `cy.get(x).should('be.enabled')` is not a wait for a stable element: it passes on the old element that is replaced a moment later. Split `.clear()` and `.type()` into separate queries (Cypress re-queries only at the start of a command), and find out which event replaces the element.
6. flag-icons Sass: `@use 'flag-icons/sass/flag-icons' with ($flag-icons-included-countries: ('de', 'gb'), $flag-icons-use-square: false)`. Do not override `$flag-icons-path`: `resolve-url-loader` resolves `url()` from the Sass partial's folder, so the default `../flags` is right and a path relative to `styles.scss` breaks the build (the dev server then keeps serving the old CSS, check the size).
7. `indigo-pink.css` is the only source of Material colors (no theme mixin is called). About 47 KB of it is the `html { --mat-... }` token block, about 35 KB are rules for components the app does not use (chips, list, slide toggle, radio, FAB, button variants). Replacing it with a theme from our palettes for only the used components is the way to shrink it (see next session).
8. The pre-commit hook (`pretty-quick`) rejects partially staged files. To commit one hunk of a file: put the partial content in the working tree, `git add`, commit, then copy the full content back.
9. Develop made `isFeasibilityExistent` a signal (`computed`); our template read it as a plain value before and never showed the empty state. A signal in a template must be called.
10. Jest does not start in this environment (`esbuild` invariant "Buffer.from("") instanceof Uint8Array" from `src/test.ts`). The data-cy registry spec `num-data-cy.registry.spec.ts` has not run in this branch.
11. A `.mat-divider` class is used as a plain class on a div (`list-item-details-sections`), not as the Material component; its rules in `_divider-classes` stay.

Next session, in this order:

1. Run all 39 specs once (`npx cypress run --browser chrome --headless`, about 15 min, do not edit files meanwhile: the dev server rebuild disturbs the run).
2. Look at the drag and drop in the browser: stage frame, label and hint; the `⋮` menu must stay click-only (see above).
3. The open items of "More to do" below: filters and reset button under the search bar, time constraint label, warning red, breadcrumbs (`breadcrumbs.component.ts` differs from develop, check there first), backend polling config.
4. Material theme: replace `indigo-pink.css` by a theme built from our palettes for the used components only, assign primary, accent and warn on purpose, diff the compiled CSS, look at tabs, selects, tooltip, datepicker, badge. Order for removing Material later: expansion, stepper, menu, toolbar (1 file each), badge, sidenav, form-field and select and datepicker together, tooltip, then dialog and tabs.
5. Fix jest (insight 10) and run the registry spec.
6. Harden `reference-field-tab` (modal result must survive a re-created tab).
7. More coverage: dashboard FAQ (expansion panel), drag states, the other language; then `_button-color` red and outline, side-menu states.
8. Merge `origin/chore/lint-cleanup` last (35 commits, 944 files, includes `feat/claude-hooks`); it conflicts with every touched file. Decide before pushing: this branch is 150 develop commits ahead of its remote, merge kept.
9. Visual pass at 1366x768 and 1920x1080 (nav open and collapsed, intro shown and hidden), then the "Before the next session" list below.

### Session 7 (2026-11-09, later): wording, breadcrumbs, tooltips, result page

Commits (not pushed): `c75f9eb5` drag back to stage, `ffa5dd69` buttons and action bar, `f1c108a5` details modal, `42034a04` search layout, `c711225b` spinner colours, `f7c459a5` wording, breadcrumbs, disabled tooltips, result page, Cypress details scenario.

Naming scheme (Shah, decided): Cohort Definition is the general term (menu group, root breadcrumb, tab title prefix). Cohort Selection is the overview page where the cohort is edited (becomes a feasibility query once inclusion criteria exist). Result is the result page. Feature Definition is the data-selection group, Feature Selection its overview page. Criterion Editor and Reference Editor are the single-criterion pages. "Criteria editor" is not used for the overview page.

Insights:

1. Angular `snapshot.data` inherits the parent's `data` through empty-path and componentless parents (`paramsInheritanceStrategy: 'emptyOnly'`). Reading `routeConfig.data` gives only the route's own data. This was the "Editor » Editor" breadcrumb.
2. A CDK `cdkDropList` that is emptied by dragging its last item away collapses to 0px (the CDK hides the source element), so it cannot take the item back. Give the list a `min-height`. Reproduced with synthetic `mousedown`/`mousemove`/`mouseup` events dispatched from `evaluate_script` (20 moves, 30 ms apart).
3. A `::before` overlay inside a `position: relative` box paints above non-positioned siblings. That is why the action bar tint washed over its buttons. `isolation: isolate` on the box plus `z-index: -1` on the overlay puts it behind the children and above the box background.
4. Percentage heights do not resolve inside a flex item with an auto height. A grid with `grid-template-rows: auto minmax(0, 1fr)` and a `max-height` on the container gives the table a definite height, so it scrolls inside the dialog instead of growing.
5. `matTooltip` works on disabled buttons in Chrome (hover on `[disabled]` fires the tooltip). Do not use `pointer-events: none` for disabled buttons, it would kill the reason tooltips. Pattern for a reason: `[matTooltip]="cond ? ('SHARED_COMPONENTS.DISABLED.X' | translate) : ('...' | translate)"`, no new input on `num-button`.
6. App settings are read once at startup. A tab opened before a backend setting changed keeps the old value (`queryResultExpiry` was `PT1M`, now `PT1H` locally). After a change in the backend, reload the tab before judging a UI state.
7. Backend env names (from `application.yml` in the jar): `PT_POLLING_TIME_UI`, `QUERYRESULT_EXPIRY` (not `QUERYRESULT_EXPIRY_MINUTES`, which the compose file sets but nothing reads), `PRIVACY_QUOTA_READ_DETAILED_OBFUSCATED_AMOUNT`. The local override is `cypress/docker/docker-compose.override.yml` (in `.git/info/exclude`): 10s polling, 1h expiry, quota 1000. CI is unchanged, so the comments in `cypress/CLAUDE.md` and `cohortResult.cy.ts` that say `PT1M` are right for CI only.
8. `PollingManager.pollingProcess`: `endWith(lastValidResult ?? lastError ?? null)` is evaluated when the pipe is built, so it always emits `null`. It works because the component also finalizes on `complete`. Not fixed, worth a look.
9. `CohortDefinitionActionBar.isFeasibilityQueryValid` is a plain value read once (not a signal), so its send button and its new disabled tooltip can go stale.
10. Pre-commit has a feature-tag linter: `@behavior:` values must come from the list in `cypress/scripts/lint-features.mjs` (or be added there and to `cypress/TESTING.md`). `@behavior:open` is used for the details scenario.
11. `prettier --write` with a glob like `result.component.*` also rewrites the spec file. Name the files.
12. The spinner: `steps(12)` makes the ring jump one dot at a time, so with a colour gradient it looks like only the colours change. Shah wanted the original motion back, only the colours changed (kept: 1.2s steps(12), original opacities).
13. A modal, a table and a card all need a definite parent height before `height: 100%` works; check with `getBoundingClientRect` and `scrollHeight` vs `clientHeight` in `evaluate_script` instead of by eye.
14. Rebuilds reload the page and drop the in-memory cohort. A helper that re-runs "search, add, drag to Inclusion, send" in one `evaluate_script` call saves time (see the session notes of 2026-11-09, second file).

Next session, in this order:

1. Full Cypress run of all 39 specs (about 15 min, no edits meanwhile). Not done since the label, tooltip, wording and result-page changes. The local override (10s polling) may break result scenarios, check that first; run once with the override removed if it does.
2. Shah looks at: result page (finished state with a real number, Details enabled), details modal with many sites (the 50-site mock is removed, pad in the browser with `ng.getComponent` if needed), spinner colours, action bar tint and hairline, disabled tooltips, the three breadcrumb trails.
3. Warning red: which element looks wrong? `missing-filter` uses `--num-color--error-on-tint` `#b30519`, searchbar uses `--num-color--error-on-white` `#c4122f`; `PLAN-side-menu.md` suggests `danger 800` `#ba0000`.
4. Contrast (measured): white label on the green 500 fill is 2.26:1 (blue: 4.39:1); the green ramp is lighter than the blue ramp at the same step (OKLab L 0.735 vs 0.575). Shah said "it's fine" for now; green 800 (`#607311`, 5.31:1) would match blue. Decide before the colour pass.
5. Disabled-button tooltips not done (option 1 extras): reset filter, apply-time-restriction, arrow buttons. Fix insight 9 together.
6. Insight 8 (`endWith`), then harden `reference-field-tab`, fix jest (esbuild error), run `num-data-cy.registry.spec.ts`. `simple-result.component.spec.ts` is a stub that cannot pass (`declarations` for a standalone component); replace it when jest runs.
7. Material theme (replace `indigo-pink.css`), lint branch merge, push decision: unchanged from session 6.
8. `angular.json` still points at `styles-next/styles.scss` (uncommitted since before this session, left alone).

### Before the next session

All pages are done. Do these, in this order:

1. DONE in session 5 (uncommitted, waits for Shah's look): wrapper decision replaced by a grid app shell, see "Session 5". Then do one visual pass.
2. One look at every page at 1366x768 (side nav open and collapsed, intro shown and hidden) and at 1920x1080. The "not checked" list in session 4 comes first.
3. Cleanup (section 7, step 6): DONE 2026-11-09 for the utility classes (`width-100`, `margin-bottom-3/4`, `margin-left-auto` are gone) and the `.selection-box` global. Still open: set the default of `--header-description-margin` to `8px 0 0` and delete the hook (modals `result-detail-modal`, `validation-modal`, `save-dataquery-modal`, `download-crtdl` still use the old `1em 0`, decide for them first); update `PLAN-design-tokens.md`.
4. The "seen, not done" list of session 4 and the page 8 leftovers (section "Page 8", last bullet).
5. Cypress: DONE 2026-11-09 (full suite ran 3 times, see Session 6).
6. `npm run check:styles`, `npm run lint`, `npx prettier --check` on the edited files only.

Rules: do not add Co-Authored-By lines. Unrelated dirty files, leave alone: `angular.json`, `ReferenceCriteriaListEntry.ts`, `playground.component.ts`, `edit.component.scss` (one stray blank line), `.vscode/settings.json`, `.impeccable/`, `prototype-bulk-chips.html`.

How to test in the app (Chrome DevTools, log in at `localhost:4200`, credentials in `.github/scripts/create-keycloak-user.sh`): go through the in-app menu; direct URLs such as `/data-selection/editor` redirect to the cohort page, and a reload loses the in-memory state.

- Data-selection editor: `/data-selection/overview`, shows only profiles added on `/data-selection/search`.
- Criterion editor: Kriteriensuche, tick a row, "Zur Kohortenselektion hinzufügen", Kriterieneditor, Optionen, Konfigurieren.
- Feature (profile) editor: Merkmale (`/data-selection/overview`), Optionen, Konfigurieren; tab "Referenzen", "Neues Merkmal hinzufügen" for the chips.
- After each navigation the element uids change: take a new snapshot (`filePath` into the scratchpad) and grep it.
- `resize_page` to 1366x768 before measuring.

### Test data for bulk search

50 selectable codes with context `Procedure` and terminology `http://snomed.info/sct` (from the `ontology` index): `20055005 1303506009 1303504007 20234004 20649001 1303507000 1303505008 1331992000 83896000 112721006 1653007 1287776007 699147007 79759003 65474005 86975004 11964008 52229009 699148002 239293007 1303645006 1303637001 1303644005 1303641002 1303643004 1303639003 426236005 1303640001 1303642009 1303638006 275093002 26144004 1303514003 1303517005 1303520002 1303509002 1303510007 1303513009 178457009 178458004 1287778008 699146003 699171000 57878004 69505002 699179003 699178006 84071008 2021001 699144000`. Add `99999999` for a not-found term. Query: `localhost:9200/ontology/_search`, filter `terminology`, `context.code`, `selectable`.

### Insights from pages 2, 3 and 4

1. A SCSS compile error leaves a half-updated page: the new template with no rules (title toggle under the heading, action bar under the table, grid gone). On page 3 about 30 lines of pasted table text sat at the end of the stylesheet. When a layout looks wrong for no reason, run `npx sass <file>` first.
2. `prettier --write` on a folder also reformats files that were not touched (specs, other templates). Run it on the files you edited only, or check `git diff --stat` afterwards.
3. In a grid frame the intro margin variable must sit on the `.page-header` wrapper. Title and intro as separate children would each get a full `row-gap`.
4. Grid items need no `flex: 1`, `width: 100%` or `align-items: flex-start` workarounds: `minmax(0, 1fr)` rows and a stretching column replace them. Keep `overflow: hidden` or `min-height: 0` on the scrolling row's child.
5. Row-gap is the only spacing: remove child `margin-bottom` in the same change (textarea on page 3).
6. Components with an inline `<textarea>`: use `viewChild` + `afterNextRender` for autofocus; the `autofocus` attribute is unreliable for elements Angular inserts later.
7. Focus ring: match the search bar (2px accent border), not an `accent-bg` ring. Use `inset` box-shadow so the box does not change size.
8. Empty-state placeholders must describe the content that will appear, not repeat the input hint.
9. Check the shared table keys before changing a label: `TABLE.DISPLAY` is shared; use another existing key (`CRITERION`) in the adapter for one table.
10. The app has no `--color-error`; use `--num-color--error-on-white` (text on white) and `--num-color--error-on-tint` (text on a tint), with `color-mix` for border and background.
11. Target lib is below es2020: no `String.matchAll`; use a `RegExp.exec` loop.

### Insights from pages 8 and 10

12. A global class with the same name leaks into a component. `.selection-box` exists in `styles-next/general-styles/_header-card.scss` (`height: 100%`, `margin-bottom: 8px`, `padding-top: 8px`) and in the data-selection box. In a block parent `height: 100%` of an auto-height parent is ignored; in a grid row it resolves against the row, which holds the box plus its children, so the box became 225px instead of 115px. Symptom: a box is taller than its content only when something sits under it. Before moving a page to a grid, grep the class names of its children in `styles-next/` and look at computed `height` / `margin` in DevTools. `.fullscreen` has the same name clash (see section 4, page 9).
13. When moving margin spacing to `row-gap`, the global rule can still add its own margin (the 8px above). Set `margin: 0` locally in the same change.
14. Spacing between a box and its attached child (the reference tile) belongs to the child as `margin-top`, not to the box as `margin-bottom`: an empty child then adds nothing, and the child stays tied to its own box.
15. A page that is a grid does not need its own intro wrapper when it has none (page 10). Use `.page-header` only for title + intro.
16. Move a page-level action (here the time restriction) to the list it acts on when the page order puts it between header and list. Controls that expand (date inputs) go on their own row (`flex-direction: column`), not next to the search bar: a side-by-side row jumps when it opens.
17. Control heights: search bar 40px (`searchbar.component.scss`); buttons next to it should be 40px. `padding` heights drift (6px padding gave 32px); set `height: 40px` instead.
18. Custom element hosts (`num-feasibility`) are `display: inline`. `min-height` and `overflow` do nothing until `display: block`.
19. Dead rules can sit in a parent component's SCSS for rules that match elements in a child template (`.selection-box-container` in `display.component.scss`). Component styles are encapsulated, so they never applied: safe to delete after grepping the templates.
20. Prettier on a `.ts` file can add `;` before a line starting with `[` (`;[a, b] = ...`). Revert that hunk, it is not part of the change (the pre-commit hook fixed it in `c7380638`).
21. Browser check without the real page flow: `evaluate_script` with `getBoundingClientRect()` on each ancestor and `getComputedStyle().gridTemplateRows` found the cause in a few calls. A static copy of the markup (`repro.html`) did not reproduce it, because the cause was a global stylesheet, not the markup.

### Insights from pages 5, 6, 7 and 11

22. `display: contents` on a component host takes its box away: the host's children become grid items of the parent. Used on page 11, where three editors share one header + tabs frame in `num-editor-content`. Their scoped styles still apply to their own elements.
23. Shared frame as a component with content projection: `<ng-content select="num-header-description" />`, `<ng-content select="[actions]" />`, default `<ng-content />` for the rest. Control-flow blocks (`@if`) at the top level go to the default slot. The host is the grid (`:host { display: grid; height: 100% }`). Used for `num-query-page`.
24. Flickering scrollbar (page 5): children with `height: 100%` + `overflow: auto` inside an `auto` row are taller than the row (content + margin), so a scrollbar appears and disappears with every re-render (the spinner counts down each second). Remove `height`, `width`, `overflow` from the children, give the hosts `display: block`.
25. `mat-step [completed]` on an editable step shows the "edit" icon, not a check mark, and the icon text ("create") can show when the icon font is missing. Without `completed` the step shows its number. Do not set `completed` for a plain two-step navigation.
26. A percent height (`flex: 0 1 24%`) on a header makes it independent of its content. `fit-content(40%)` in the grid rows sizes it to the content and caps it; the item needs `min-height: 0; overflow: auto`.
27. "Broken look" is not always CSS. Read `textContent` of the element first: the empty reference chips (page 11) had empty text, so the cause was data (a type change that `as ProfileReferenceGroup` hid from TypeScript), not the new layout. `git log -- <file>` on the adapter and the model found it.
28. Looking at a screen recording: copy the `.mp4` from `/mnt/c/Users/<name>/Videos/` into the scratchpad, `ffmpeg -i in.mp4 -vf "fps=2,scale=1008:-1,tile=2x4" -frames:v 1 sheet.png`, read the PNG. Needs `ffmpeg` (`sudo apt install ffmpeg`).
29. `::ng-deep` rules in a lazy component are global once it was loaded, so the look of other pages can depend on which route was visited first (`.mdc-tab`, `.mat-step-icon`). Put such a rule in one place, or scope it with `:host ::ng-deep`.
30. `prettier --write` on a list of files still reformatted the `.spec.ts` of the folder (insight 2 again, twice this session): after every run `git status --short` and `git checkout` the specs.

## 1. Goal

Every page has the same frame: one column, a few rows, one `row-gap` as the only vertical rhythm. No page spaces itself with margins on its children. Result: the same gaps on every page, tuned in one place.

## 2. The pattern as built (feasibility search)

```scss
.container {
  height: 100%;
  display: grid;
  grid-template-columns: minmax(0, 1fr); // a wide table cannot push the page wider
  grid-template-rows: auto auto minmax(0, 1fr) auto; // header, search, results (rest, scrolls), actions
  row-gap: var(--spacing-16);
  overflow: auto;
}
.page-header {
  --header-description-margin: var(--spacing-8) 0 0; // title, 8px, intro
}
.title-row {
  // title left, mode toggle right
  display: grid;
  grid-template-columns: 1fr auto;
  align-items: center;
  margin-top: var(--spacing-8);
}
.result-container {
  min-height: 0;
  overflow: auto;
}
```

HTML: the title row and `num-header-description` sit together in one `<div class="page-header">`, so they count as one grid row.

Shared hook: `header-description.component.scss` reads `margin: var(--header-description-margin, 1em 0)`. Default unchanged, so pages not yet moved look the same.

## 3. Proposal to decide first: one shared mixin

Ten pages would copy the block above. Proposal: one rule in `styles-next/custom-material/layout/` (for example `_page-grid.themed.scss`, class `.page-grid`) with the rows as a variable:

```scss
.page-grid {
  display: grid;
  grid-template-columns: minmax(0, 1fr);
  grid-template-rows: var(--page-rows, auto minmax(0, 1fr) auto);
  row-gap: var(--spacing-16);
  height: 100%;
  overflow: auto;
}
```

A page sets only its rows: `style`/class `--page-rows: auto auto minmax(0, 1fr) auto;`. Also a shared `.page-header` (intro margin variable) and `.page-title-row`. Decide: shared class in `styles-next`, or per-page SCSS like today. Shared wins if all pages end up with the same rules; check that `npm run check:styles` accepts a mixin/class used from component templates.

When all pages are moved: change the default of `--header-description-margin` to `8px 0 0` (or `0`) and delete the hook. Modals still use the old `1em 0` (see section 5).

## 4. Page inventory

All rows are done except 9 (dropped). The "Today" and "Watch out" columns describe the state before the work.

Position of the page in the app: inside `.app-body .main-content .fullscreen` (`width: 95%; height: 100%`, `_app-layout.themed.scss`). That is the grid's parent.

| #   | Page (file)                                                                             | Today                                                                        | Rows in the grid                                                      | Watch out                                                                                                                                                                                                                                                                                   |
| --- | --------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------- | --------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 1   | Feasibility search (`feasibility-query/.../search/search.component`)                    | grid                                                                         | header, search, results, actions                                      | DONE, reference                                                                                                                                                                                                                                                                             |
| 2   | Data-selection search (`data-selection/.../search/search.component`)                    | flex column, `result-container flex:1; min-height:0`                         | same as page 1                                                        | has its own search-bar component (already flex-wrap, panel removed); scss has leftovers to check and delete: `.background-color-button`, `.tree-container`, `.box-container`, `::ng-deep .mat-drawer-inner-container` (used by the results drawer, check before deleting)                   |
| 3   | Bulk search (`.../search/bulk/bulk-search.component`) DONE (uncommitted), see section 0 | flex column, `align-items: flex-start`, `.header-container` margin-bottom 16 | header, input, results, actions                                       | uses `.margin-left-auto` and `.width-100` (grid column stretches, so `width-100` goes); same mode toggle as page 1, so it can share `.title-row`; local `::-webkit-scrollbar` block (20px, overridden by `* { scrollbar-width: thin }` in Chrome, see insight 2 in `PLAN-design-tokens.md`) |
| 4   | Feasibility editor (`feasibility-query/.../editor/edit.component`)                      | flex column; `.stage-container max-height: 35%` + `.overflow-auto flex:1`    | header, time restriction, section name, stage, query display, actions | two scroll regions; `max-height: 35%` has no definite parent height in a grid row (cyclic), test it; `margin-bottom-4`; commented-out consent switches in the template                                                                                                                      |
| 5   | Result (`feasibility-query/.../result/result.component`)                                | flex column; `.simple-result-container height: 24%`                          | header, simple result, query display, actions                         | same percentage-height problem as page 4; `.height-59` (42px) looks unused, grep first                                                                                                                                                                                                      |
| 6   | Cohort definition (`data-query/.../cohort-definition`)                                  | flex column, `:host` block                                                   | stepper, intro, content, actions                                      | `mat-stepper` with `num-header` in the step labels (not a page title); `!important` and `::ng-deep` on `mat-step-icon` and `mat-horizontal-content-container`; `margin-bottom-3`; `.height-400` probably dead                                                                               |
| 7   | Data selection (`data-query/.../data-selection`)                                        | flex column                                                                  | stepper, intro, content (empty box or list), actions                  | conditional `@if` empty box with `flex: 0 1 50%`: the number of children changes (see insight 2)                                                                                                                                                                                            |
| 8   | Data-selection editor (`data-selection/.../display/display.component`)                  | flex column; header and intro are direct children                            | header block, time restriction, section name, profiles, actions       | DONE (`c7380638`), see section 0. Was: wrap header + intro in `.page-header`; `.profiles-container` has `height:100%`, `margin-bottom:16`, `gap:1.5rem` (becomes row-gap work); dead rules to check: `.selection-box-container`, `.box-container`, `.profiles-box`, `.overflow`             |
| 10  | Saved queries (`saved-queries/.../saved-queries.component`)                             | `.page-wrapper` flex column, `align-items: flex-start`                       | header (no intro), list                                               | DONE (`448b626e`), `width-100` on the child went away                                                                                                                                                                                                                                       |
| 11  | Query editor (`query-editor/.../query-editor.component`; criterion, feature, reference) | card + action bar; in the card header `flex: 0 1 24%` and tabs `flex: 1`     | card, action bar; inside: header (capped), tabs (rest)                | DONE (`23758be3`), see session 4. `num-editor-content` owns the grid, the three editors use `display: contents`.                                                                                                                                                                            |

Utility classes that disappear with the grid (check other users before deleting the global definitions): `margin-bottom-3`, `margin-bottom-4`, `width-100`, `margin-left-auto`.

## 5. Out of scope here (decide separately)

Modals with a header and intro: `result-detail-modal`, `validation-modal`, `save-dataquery-modal`, `download-crtdl`. They sit inside `num-modal-window`, not in a page frame, and keep the default intro margin `1em 0` until the hook is removed.

## 6. Insights for the rollout

1. Grid auto-placement turns every direct child into a row. Pages 8, 9, 10 have the title and the intro as separate children: they would get a full `row-gap` between them. Wrap them in one `.page-header` div (or `display: contents` is not enough, the margin variable needs a wrapper).
2. Conditional rows (`@if` in pages 6, 7) change the number of children, so a positional `grid-template-rows` list breaks. Either keep the conditional content inside one stable row, or place children with `grid-row` / `grid-template-areas` and `grid-area`.
3. Percent heights (`height: 24%`, `max-height: 35%`) refer to the parent's height. A grid child's parent is its row, and an `auto` row has no fixed height. Replace by rows with `minmax(0, <fraction>fr)` or fixed `rem`, and look at the result at 768px.
4. `align-items: flex-start` on the old flex columns shrinks children to their content (hence the `width-100` helpers). The grid column is `minmax(0, 1fr)` and children stretch, so those helpers can go.
5. A grid or flex item does not collapse its children's margins. While some children keep margins, they add to `row-gap`. Remove the margins in the same change as the row-gap, page by page.
6. `--header-description-margin` only works if set on an ancestor of the intro (the `.page-header` wrapper). It is inherited, so it needs no `::ng-deep`.
7. Scrolling: each page has one scroll region (the row with `minmax(0, 1fr)` and `overflow: auto`). Pages with two regions (4, 5) need a decision which rows scroll.
8. Cypress and specs: selectors seen in the feasibility search work (`result-container` etc. are not used by Cypress), but check `cypress/e2e` for every page you touch before renaming a class.

## 7. Steps

1. Decide section 3 (shared mixin or per page).
2. Move page 2 (data-selection search), the closest twin of page 1. Look at it in the app.
3. Pages 3 and 10 (simplest: no conditional rows, no percent heights).
4. Pages 8 and 9.
5. Pages 4, 5 (percent heights), then 6, 7 (steppers, conditional rows).
6. Remove unused utility classes, set the intro default to the new margin, delete the hook, update `PLAN-design-tokens.md`.
7. After each page: `npm run check:styles`, `npm run lint`, `npx prettier --check <files>`, screenshots at 1366x768 and 1920x1080, intro shown and hidden, one commit per page.
