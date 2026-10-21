# Plan: page grid for every page (next session)

Written 2026-10-21 at the end of the session. Reference page: the feasibility search (`modules/feasibility-query/components/search/`), done in commit `996391e7`. Notes on that session: `PLAN-design-tokens.md`, block "Session 2026-10-21".

Not checked in a browser by Claude. Every page below needs a look at laptop size (1366x768, side nav open and collapsed), intro shown and hidden.

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

Position of the page in the app: inside `.app-body .main-content .fullscreen` (`width: 95%; height: 100%`, `_app-layout.themed.scss`). That is the grid's parent.

| #   | Page (file)                                                            | Today                                                                        | Rows in the grid                                                      | Watch out                                                                                                                                                                                                                                                                                   |
| --- | ---------------------------------------------------------------------- | ---------------------------------------------------------------------------- | --------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 1   | Feasibility search (`feasibility-query/.../search/search.component`)   | grid                                                                         | header, search, results, actions                                      | DONE, reference                                                                                                                                                                                                                                                                             |
| 2   | Data-selection search (`data-selection/.../search/search.component`)   | flex column, `result-container flex:1; min-height:0`                         | same as page 1                                                        | has its own search-bar component (already flex-wrap, panel removed); scss has leftovers to check and delete: `.background-color-button`, `.tree-container`, `.box-container`, `::ng-deep .mat-drawer-inner-container` (used by the results drawer, check before deleting)                   |
| 3   | Bulk search (`.../search/bulk/bulk-search.component`)                  | flex column, `align-items: flex-start`, `.header-container` margin-bottom 16 | header, input, results, actions                                       | uses `.margin-left-auto` and `.width-100` (grid column stretches, so `width-100` goes); same mode toggle as page 1, so it can share `.title-row`; local `::-webkit-scrollbar` block (20px, overridden by `* { scrollbar-width: thin }` in Chrome, see insight 2 in `PLAN-design-tokens.md`) |
| 4   | Feasibility editor (`feasibility-query/.../editor/edit.component`)     | flex column; `.stage-container max-height: 35%` + `.overflow-auto flex:1`    | header, time restriction, section name, stage, query display, actions | two scroll regions; `max-height: 35%` has no definite parent height in a grid row (cyclic), test it; `margin-bottom-4`; commented-out consent switches in the template                                                                                                                      |
| 5   | Result (`feasibility-query/.../result/result.component`)               | flex column; `.simple-result-container height: 24%`                          | header, simple result, query display, actions                         | same percentage-height problem as page 4; `.height-59` (42px) looks unused, grep first                                                                                                                                                                                                      |
| 6   | Cohort definition (`data-query/.../cohort-definition`)                 | flex column, `:host` block                                                   | stepper, intro, content, actions                                      | `mat-stepper` with `num-header` in the step labels (not a page title); `!important` and `::ng-deep` on `mat-step-icon` and `mat-horizontal-content-container`; `margin-bottom-3`; `.height-400` probably dead                                                                               |
| 7   | Data selection (`data-query/.../data-selection`)                       | flex column                                                                  | stepper, intro, content (empty box or list), actions                  | conditional `@if` empty box with `flex: 0 1 50%`: the number of children changes (see insight 2)                                                                                                                                                                                            |
| 8   | Data-selection editor (`data-selection/.../display/display.component`) | flex column; header and intro are direct children                            | header block, time restriction, section name, profiles, actions       | wrap header + intro in `.page-header`; `.profiles-container` has `height:100%`, `margin-bottom:16`, `gap:1.5rem` (becomes row-gap work); dead rules to check: `.selection-box-container`, `.box-container`, `.profiles-box`, `.overflow`                                                    |
| 9   | Dashboard (`dashboard/.../dashboard.component`)                        | flex column; `.cards-section` holds header, intro and an inner 3-column grid | header block, cards                                                   | inner grid already exists (`gap: 16px`, `margin-top: 24`); local class `.fullscreen` has the same name as the global `.app-body .fullscreen`, avoid confusion                                                                                                                               |
| 10  | Saved queries (`saved-queries/.../saved-queries.component`)            | `.page-wrapper` flex column, `align-items: flex-start`                       | header (no intro), list                                               | `width-100` on the child goes away                                                                                                                                                                                                                                                          |

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
