# Plan: design tokens for non-color CSS (typography, shape, size)

## NOW (2026-10-20): read this first

Everything below this block = reference and history. Nothing deleted. Where old text says "plan only" or "8 unwritten variables", this block wins.

**Focus: typography only. Colors later.**

**Done (typography roles live in components, Shah checked in browser):**
- `text-link`, breadcrumbs, `button` (incl. portal link), `page-header` (title, intro, eye button), `side-menu` (option C: parent 600, child 400, child-active 600; all 16/24).
- Global h1 rule gone. `.header-title` owns its font variables. Shah checked 2026-10-20: all fine.
- `npm run check:styles` guards typo'd variables and missing mixin includes.
- 652 merged. Side menu, `.app-body`, checkbox, 6 color variables ported to `styles-next`.
- One font: Titillium Web only (decision 8). Open Sans + Roboto removed in commit `c0c072e2` (2026-10-20). Log + undo: `design-tokens-history.md` part 5 and 5b. Shah checked in browser: looks good.
- Global `h2` rule removed (`_headings.themed.scss`; `h3`-`h5` stay). Page intro `header-description` is a `<p>` again, role variables incl. new optional role key `letter-spacing`, color from accent 700 via `--app-content-page-header-intro-color`, margin animates with the hide. Prototypes: `typography-prototype-headings.html`, `typography-prototype-intro-color.html`.
- h1 and h2 selectors: DONE (Shah, 2026-10-20). Insights + improvement list: `design-tokens-insights.md`, sections "h1 / h2 session".
- `app-content` group `section` (`num-section-name`, C18): role `app-content-section-name` 16/24/600, tag `h3` -> `h2`; the filter hint "Suche verfeinern:" is a `<p>`, component reads the variables, `!important`s gone (2026-10-20). Visual check in the app: Shah comes back. Notes: `typography/C18-section-name.md`.
- `app-content-filter-hint`: own role for "Suche verfeinern:" (a `<p>`, 2 filter bars), same values as the section name today. Title color and hint color swapped 2026-10-20 (title `#5f6266`, hint `#6a7483`). History: `design-tokens-history.md` part 6.
- `app-content` group `search-bar` (C16, 2026-10-20): role `app-content-search-bar-input` 16/24/400 (was 14px, line normal), group file `_search-bar.themed.scss`, `searchbar.component.scss` reads the variables. Control height decided 40px (Shah): searchbar `.searchbar-field` (was `.searchbar-row` + `.form-design`) fixed `height: 40px` (border-box, no jump on the 2px focus border), filter select `.mat-mdc-form-field-flex` 42 -> 40. `num-button` was already 40. Prototype: `typography-prototype-search-bar.html`. Shah checks the look in the app. Hover (border, hint, icon) parked: today only border color on hover, not while focused.
- `table` (C23, 2026-10-20, `dab450e3`): roles `table-header` 14/20/600 and `table-cell` 14/20/400 (generic, no area prefix), group file `_table.themed.scss`; six components read `--font-table-*`; rows 40px; `.row-container` wrapper `height: 100%`; dead classes `height-3-rem` / `clickable-row` / `table-row-text-color` removed. Option B (primary/secondary by color, not size). Prototype `typography-prototype-table.html`. Shah looked at it: good. History part 7.
- Control height 40 in the header (2026-10-20): language and user selects (wrapper `height: 40px`, flex `100%`), language options 40; Antragsportal button already 40. Scrollbar under the search results fixed with `overflow-x: hidden` in `profile-search-results.component.scss`. History part 7 items 8-9.
- Still open from this: roles for modal title, FAQ title, data-protection title (parked by Shah; prototype ready, 3 open questions in the reply of 2026-10-20: underline, FAQ gap 4px vs 20px, data-protection weight). Header title color `#6a7483` (4.49) and eye button `#fff` = color pass.

**Closed by Shah 2026-10-20:**
- Q9 h1: fine. Modals keep `num-header`. No second h1 wanted.
- Dead code list (`.user-button`, `.portal-link-btn`, stale specs): not checking. Skip.
- Checkbox: parked, works, fine for now.

**The 6 "unwritten" variables = already written.** Dumped 2026-10-20 with 652 values (`PLAN-side-menu.md` section 6). Nothing typography left. Only open: which color role each gets. That is color pass. Later.
`--num-color--error-on-tint`, `--num-color--error-on-white`, `--border-color-hover`, `--color-text-placeholder`, `--num-color--accent-900`, `--num-color--grey-hover`.

**Open, typography (in this order):**
1. `headings` audit: global `h2` rules in `base/_headings.themed.scss` use `!important` (letter-spacing, margin). Intro `<h2>` fights them. Scope them or move type into roles.
2. `app-content` groups: ~~`section`~~, ~~`search-bar`~~ (ported; Shah checks the look in the app), `table`, `action-bar` (process below, one group at a time).
3. ~~Font weights~~ DONE 2026-10-20 (500 and 300 -> 400 in all scss under `app/` and `styles-next/` and in the Material config; look unchanged, the browser drew them as 400). Old text: (decision 8 follow-up). Titillium has NO 500 and we ship only 400/600/700. Browser draws 500 and 300 as 400. Asked for 500: `$body-2` in `themes/fdpg-light/_typography.scss:10`, `button/_button-cancel.themed.scss:3`, `profile-reference-chip.component.scss:8`. Asked for 300: `$caption` (same file). Shah: not now. Options: 500 -> 400 (no visual change) or 600; 300 -> download Titillium 300 or use 400. Q8 letter-spacing: DONE 2026-10-20 (`normal` for every Material level in `themes/fdpg-light/_typography.scss`, tooltip `0.5px !important` deleted; Shah to look at selects, options, table, tooltips). Left: filter-chips `-0.03em`, headings `0 !important` (same look). Close before Material goes.
4. Side menu level 3 at 14/20 (option D): kept as alternative, not wanted now.

**Next session (2026-10-21 or later):**
1. Table leftovers (small): availability label 12/14 -> 12/16 (DONE 2026-10-20, `availability-status-bar.component.scss`); ~~`tabular-nums` for number columns~~ closed 2026-10-21, not needed (Titillium digits already equal width, font has no `tnum`); header `th` height (52 now; 36 was tried and undone); 15px checkbox vs 24px target. Notes: `C23`, `C27`.
2. Controls still not 40: `th` 52 (cancel button and `.icon-design` now 40, 2026-10-20). Search bar leftovers: `.select-search-wrapper` size + `.icon-design` 42 in `search-filter.component.scss` (Shah designs the wrapper); cancel button 42 -> 40 (`_button-cancel.themed.scss:3`); hover (border, hint, icon).
3. ~~`action-bar` (C26)~~ done 2026-10-20: only dead rules deleted, badge stays Material. Next: `app-header` leftovers if any, then the parked modal/FAQ/data-protection titles.
4. Shah checks the table in the app (header 14px, text cell 14px, rows 40px, long text fits) and the 40px controls side by side.
5. Section names that head blocks in modals: stay `h2` (decided OK 2026-10-20). Section-name spec is the Angular default; add a test only if the component grows.
6. Not committed on purpose: `angular.json`, `app.component.ts`. Untracked and not mine: `.impeccable/`, `.vscode/settings.json`. Nothing pushed yet this session.

**Later, colors (`PLAN.md` step 4 and 5):** role for the two error reds + placeholder, green shade for checkbox, header title color (`#6a7483`, contrast 4.49), then convert rest of `custom-material`, then the switch.

**Always on:** `angular.json` + `app.component.ts` stay uncommitted on purpose. Run `npm run check:styles` before commits that touch `styles-next`.

## Session 2026-10-21: table header, search layout (this block wins over "Next session" above)

Per-change undo steps: `TODO-2026-10-21.md` (items 1 to 17). Prototype: `typography-prototype-table-header.html`.

**Done**
- `tabular-nums`: closed, not needed (Titillium digits are all 560 wide, the font has no `tnum`).
- Table header: `th` 52 -> 40px (`height: 40px`, padding `0 8`); role `table-header` 14/20/600 -> 16/24/600 (ladder level `control-strong`); text color `#5e6c78` (5.12:1); 1px `--border-color` line under it; 8px gap under the header (`thead` margin); first row has no top border. Dead `.table-header` / `.sticky-header` rules deleted.
- Header and body columns now line up: `thead` is `overflow-y: scroll` with an invisible scrollbar (same width as `tbody`).
- Icon column header: label `FEATURE.ICON` / `CRITERIA.ICON` (existing tooltip keys), visible for screen readers only (`visuallyHidden` flag in `TableHeaderData`, `.visually-hidden` in the header component, three adapters).
- Availability label: no longer colored by status (was 2 to 3.6:1), color stays on the bar; track `rgba(0,0,0,.1)`.
- Both search pages (data-selection and feasibility): filters on the right of the search bar, heading "Suche verfeinern" / "Refine search" (no colon) above the filters with the (i) tooltip, gap bar to filters 8px (= gap between filters), search bar `flex: 1 1 20rem; max-width: 55%`, autofocus (`autofocus` input on `num-searchbar`, default false).
- Feasibility page: frame is a CSS grid (`grid-template-rows: auto auto minmax(0,1fr) auto`, `row-gap: 16px`), title row is a grid (`1fr auto`), dead rules deleted (`.mat-mdc-icon-button`, `.filter-chips`, `.details-panel`). Intro margin comes from `--header-description-margin` (default `1em 0`, so the 10 other pages are unchanged; feasibility sets `8px 0 0`).
- Tried and thrown away (Shah): tinted table header strip (`#f4f6f9`, `#f9fafc`), option C extras (2px line, first-row border), tinted panel with shadow around the search row.

**Insights**
1. Component-scoped styles never match the host element. A class set by the parent on a component's host (`<thead num-table-header class="table-header">`) is dead in the component's own `.scss` unless it is written with `:host`. Two rules, including the 20px scrollbar reserve, had never applied. Check with the compiled output or the browser before trusting an old rule.
2. `* { scrollbar-width: thin }` in `styles.scss` wins over `::-webkit-scrollbar { width: 20px }` in current Chrome. A hard-coded 20px reserve is wrong. Give the header the same scrollbar (`overflow-y: scroll`, transparent color) so the widths match by construction.
3. Measure the font before adding a font feature: with `fontTools` the shipped Titillium woff2 has only `frac` in GSUB and equal digit widths. Do not add `tabular-nums`.
4. A status color is not a text color. `#b0b8c4`, `#d4691e`, `#c8991a`, `#9ab721` on white are all below 4.5:1. Put the color on the bar, the label stays neutral.
5. `flex: 0 1 44%` on a child of a column flex container is ignored (the percentage basis is the height). Both search bars were full width. A `%` basis only works in a row container.
6. Grid for the 2D frame, flex for things that wrap. The page frame (rows) is a grid; the search row (filters drop below on narrow screens) stays flex-wrap. A grid or flex item does not collapse its children's margins, so every component margin adds up. That was the cause of the uneven vertical gaps (margins in 4 files). `row-gap` on the frame is the one place to tune them.
7. A shared component's margin can be made page-configurable with a CSS custom property that has a default: `margin: var(--header-description-margin, 1em 0)`. One page overrides it on a wrapper, no `::ng-deep`, no input, the other pages are untouched.
8. Percent widths next to fixed-width siblings: use `flex: 1 1 <min>` plus `max-width`, not a fixed `%`. The filters need about 600px, so a fixed 55% bar would always wrap the filters at laptop widths.
9. Shah's taste, three times: no tinted surfaces (header strip, panel). Whitespace, text color and thin lines are fine. Try those first.
10. Autofocus on load is an accessibility trade-off (screen-reader users can miss the page title). Fine on a search-first page; option: only when the intro is hidden.
11. Process slips to avoid: (a) a revert script that re-applied a change lost two lines, so run `git diff` after every revert; (b) `cat >> file` in a changed working directory created a stray `C23-table.md` in the wrong folder, so use absolute or repo-relative paths; (c) dictations were cut off twice ("Let's do", "and then we will"): ask instead of guessing; (d) the plan listed items already done (cancel button 40px), so grep before trusting a to-do line.

**Still to do**
1. Look at everything in the app (nothing was checked in a browser by me): table header and gaps, both search pages (laptop width, nav open and collapsed, filters wrapping), the 16px gap above the action bar, autofocus.
2. Controls still not 40px (list and file:line in `TODO-2026-10-21.md`): modals, date picker, result, timerestriction selector, filter chips (42), feasibility search (44), outer tabs (41); decide the 48px criterion-modal controls.
3. Apply the grid frame and `row-gap` to the data-selection page, `bulk-search` and the other pages that use `num-header-description` (10 pages still use the default margin).
4. Search bar prominence: width and autofocus done; accent border or stronger look (option 3) still parked.
5. `ReferenceCriteriaListEntryAdapter` uses the `plus` icon but the header and tooltip say "Show related criteria": check the text.
6. Color pass additions: header text `#5e6c78` and the line `--border-color` are literals; availability colors `AvailabilityStatus.ts`; `th` literal `#6a7483` elsewhere; scrollbar colors.
7. `searchbar.component.spec.ts` is stale (imports a `SearchComponent` that no longer exists).
8. Still uncommitted on purpose or not mine: `angular.json`, `playground.component.ts`, the `console.log` removal in `ReferenceCriteriaListEntry.ts`, `.impeccable/`, `.vscode/settings.json`.

---

Status (old, 2026-10-19): plan only, no code yet. Next to `PLAN.md`.
Goal: components stop hardcoding `font-size`, `font-weight`, `line-height`, `font-family`, `border-radius`, `height`, `min-width`. One central place, read by name. Same idea as `role-color` for colors.

## More files (open only when needed)
- `design-tokens-research.md`: why, how Material does tokens, Sass docs, first folder proposal.
- `design-tokens-insights.md`: insights and "for discussion" list.
- `design-tokens-history.md`: session notes 2026-10-19 (parts 2, 3) and 2026-10-20 (part 4), check script, verify metrics, 652 merge, dead code list.
- `PLAN-side-menu.md`: side menu port, steps, option C and D.
- `research-usability-typography.md`: usability research.

## Decisions log (Shah, 2026-10-19)

| # | Decision | Status |
|---|---|---|
| 1 | New files are Sass modules (`@use` / `@forward`). Old tree migrates later with the Sass migrator, then compare CSS. | decided |
| 2 | Names: `<group>-<part>`, by role, one name everywhere (map key, mixin argument, CSS variable, prototype). Group `page-header`: `app-content-page-header-title`, `app-content-page-header-intro`, later `app-content-page-header-actions`. No adjectives like `strong` / `large`. | decided |
| 3 | Values are written as four longhand variables (family, weight, size, line), not the `font:` shorthand. | decided (option B) |
| 4 | Roles live central in `themes/fdpg-light/_type-roles.scss`; one group file per group in `custom-material/typography/`. | decided |
| 5 | `.scss` comments use `/* */`, never `//`. Each function / mixin has a "Parsed as:" line and one example with output. | decided |
| 6 | Prototype pages are opened in Shah's own browser. Claude never opens DevTools or a browser for him, only gives the `file://` link. | decided |
| 10 | Role names start with the area: `app-header` (C05, C06, C07), `side-menu` (C09), `app-content` (everything in the body). Shared atoms without an area have none: `button`. "page" is too generic. | decided; roles renamed to `app-content-page-header-*` (2026-10-19) |
| 11 | The portal link (C07) is not a separate look: it becomes `<button class="num-button blue">` and uses the role `button`. No own role. | decided |
| 12 | Role `button` = Titillium Web 16/24/600, for `.num-button` and every color variant (C20). | prototype only |
| 13 | Process rule: one place (area) of the app at a time. Current area: `app-header`. | decided |
| 14 | C05 and C06 (selects in the app header) get no role: no `font-*` rule of their own, Material already renders the target 16/24/400. Todo at step 7: find the origin of the 20/32/500 host (C05), delete dead `.user-button` (C06). | decided |
| 15 | Breadcrumbs (C04): roles `app-header-breadcrumb-{link,current,separator}`; HTML + CSS switched in one go (semantic nav/ol, routerLink, aria-current, aria-hidden separator, tooltip unchanged). Wired in `custom-material/_index.scss`. | done, to review in browser |
| 16 | Global link rule gets role `text-link` (16/24/400, letter-spacing `normal`) and blue colors: accent 600 default, underline on hover, no paler visited, focus ring (option B). Replaces `app-header-breadcrumb-link`; global rule in `_links.themed.scss` loses its `!important`. Prototype `typography-prototype-text-link.html`. | ported 2026-10-19 (role `text-link`, `_links.themed.scss` reads the variables, `!important` removed) |
| 7 | Process steps 4 to 6 (switch components, compile + diff, delete literals) are discussed later. | open, Shah |
| 8 | One font family only: Titillium Web. Roboto and Open Sans go. See research Q1. | decided (Shah, 2026-10-20); removal open, list in `design-tokens-history.md` |
| 9 | Letter-spacing 0.25px / 0.5px from Material: keep or `normal`. See research Q8. | open |

## Process per group (established)

**Rule: one place in the app at a time.** Finish every group of one area before the next area (`app-header` first, then `side-menu`, then `app-content`). Inside an area, take the components in screen order. Reason: one screen area is reviewed in one browser look, and shared roles (`button`, `app-header-select`) are found and named once. Started 2026-10-19 with `app-header`: C07 done, C05 + C06 prototyped, next in `app-header`: nothing else (language, user menu, portal link are all of it).

One iteration = one group (for example `page-header`), not one file. Reference run: page header.

1. **Read** the component notes `typography/Cxx-*.md` (now / next / source line per property).
2. **Prototype in plain CSS**: change only the roles of this group in `typography-prototype.css`.
3. **Prototype page**: create `typography-prototype-<group>.html` next to the CSS. It shows today vs next side by side with the real texts, plus a table (label, size / line, weight, what it replaces, other users today). **Every reply that creates or changes a prototype ends with this link (Shah, 2026-10-19; I forgot it once)**, do not open a browser:
   `file://wsl.localhost/Ubuntu/home/shah/dataportal-ui/src/styles-next/typography-prototype-<group>.html`
   (Windows form `\\wsl.localhost\Ubuntu\home\shah\dataportal-ui\src\styles-next\...`). The relative `<link>` to the CSS works over `file://`.
4. **Review with Shah**: what changes, what the labels are. Names are agreed here.
5. **Port to Sass** (this is where the pipeline below starts): add the roles to `_type-roles.scss`, create `typography/_<group>.themed.scss`, check with a scratch compile. Compile only, no component is touched yet.
6. **Diagram**: update `typography-flow.html` if the flow changes.
7. *Discuss later (Shah):* switch the component SCSS to the variables, compile and diff the CSS (only intended changes), delete the old literals.

Done so far: `text-link` (global `a` rule, ported), `app-header-breadcrumb-*` (C04, switched in the component), C05 + C06 (no role, nothing to port), `button` (C07 + C20, prototype `typography-prototype-button.html`, ported to Sass), `app-content-page-header-title` (24/32/600), `app-content-page-header-intro` (16/24/400, 70ch), `app-content-page-header-actions` (icon 16px; prototype only).

## Architecture (built for the page header)

Files and what each one does (full picture with data shown: `typography-flow.html`):

| File | Job | Contains numbers? |
|---|---|---|
| `themes/fdpg-light/_type-roles.scss` | map `$fdpg-light-type-roles`: role name to (family, weight, size, line) | yes, the only place |
| `themes/fdpg-light/_theme.scss` | puts the map into `$theme` under the key `type-roles` | no |
| `functions/_type.scss` | mixin `type.vars($theme, $name)`: looks `$name` up, writes `--font-<name>-family / -weight / -size / -line` | no |
| `custom-material/typography/_page-header.themed.scss` | mixin `page-header_themed($theme)`: one `@include type.vars(...)` per role of the group, plus non-text values (`70ch`, icon size) | no, except layout values |
| component `.scss` (later) | four lines `font-size: var(--font-app-content-page-header-title-size);` etc. | no |

Reading `type.vars($theme, 'app-content-page-header-title')`: take `'app-content-page-header-title'` from `$theme[type-roles]`, write its four values as variables with the same name as prefix. Result in the browser:
`--font-app-content-page-header-title-family: 'Titillium Web', sans-serif; ...-weight: 600; ...-size: 24px; ...-line: 32px;`

Wired 2026-10-19: `button_themed` and `page-header_themed` are included in `custom-material/_index.scss` (variables emitted; no component reads them yet). Earlier note, now outdated: `_index.scss` did not include `page-header_themed`. New files are modules (`@use`), the index still uses `@import`; the bridge is written together with step 7.

## Not in scope

- Spacing/margin/padding tokens, shadows, z-index, breakpoints. Check after sizing if a pattern shows.
- Renaming CSS variables (`--num-color--*`).

**2026-10-20 (Shah):** modal / FAQ / data-protection title roles dropped for now (no questions to answer). Open `42px` heights left in modals/date picker/result (`save-file-modal`, `save-dataquery-modal`, `date-picker`, `result`, `timerestriction`, filter-chips `min-height`).
