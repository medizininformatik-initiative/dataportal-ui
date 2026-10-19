# Plan: port the 652 side menu to `styles-next` (plan only, 2026-10-19)

Source: branch `652-fix-obvious-contrast-focus-and-semantics-issues-in-shared-components` (merge base `4ef9d038`), old tree `src/styles/` only. Checked with `git show` / `git diff HEAD...652`. Process: `PLAN-design-tokens.md` ("Process per group"), area `side-menu` (C09, `typography/C09-side-menu.md`, prototype `typography-prototype-side-menu.html`).

## 1. What 652 changed in the menu
Template (`side-menu.component.html`, ts, spec, `nav-item.interface.ts`, `core/constants/navigation.ts`, `app-layout.component.html/ts`):
- `mat-nav-list` / `mat-list-item` / `mat-icon` removed. Now `ul.num-nav-list[role=list]` > `li.num-nav-group` > `a.num-nav-link` (+ `--child`, `--grandchild`, `--active` via `routerLinkActive`, `ariaCurrentWhenActive="page"`), label in `span.navItem-font` / `span.navItem-font--child`. Non-link group label: `span.num-nav-link--label`. Toggle: `div.num-toggle-row > button.num-toggle-button` (`aria-expanded`). One `ng-template #navLink`, 3 levels (`children`, `routeTo?`). Host class `collapsed` (was on `mat-nav-list`).
- App layout: `mat-sidenav-container` -> `div.app-body > nav.sidenav + main.main-content` (no Material sidenav; `isHandset`, `toggleSideMenu` removed).
- Class names changed: `num-mat-list-item(--active)` -> `num-nav-link(--active)`, `num-logo-row` -> `num-toggle-row`. Cypress `sideNav.cy.ts` changed 1 line (unverified what).
SCSS (`_side-menu.component.themed.scss`, rewritten, 361 lines changed):
- Reads global tokens from `:root`: `--spacing-{2,4,6,12,16,20,24,32,40,48}`, `--border-radius-card`, `--font-body`, `--font-size-nav` (1.125rem), `--line-height-nav` (1.625rem), `--font-size-nav-child` (1rem), `--line-height-nav-child` (1.5rem), `--font-weight-bold`, `--color-text-section`, `--color-accent-bg`, `--color-accent`, `--border-color`.
- Menu-local vars (`num-side-menu { --side-menu-* }`): geometry `line-x`, `pill-x`, `child-indent`, `line-x2`, `grandchild-indent` (calc of spacing); colors `bg` (primary 'white'), `bg-hover` (primary 200), `bg-active` (`--color-accent-bg`), `text` (`--color-text-section`), `text-active` (accent 900), `icon` (primary 900), `icon-active` (`--color-accent`), `line` (`--border-color`), `line-hover` (primary 700), `focus-ring` (accent 900).
- Typography: parent item 18/26 weight 600 (`--font-weight-bold`); child 16/24 weight `mat.m2-font-weight($typography, body-2)` = 500, active child 600. No `!important`.
- Hex literals: none (all via `mat.m2-get-color-from-palette`). Only the toggle hover uses `mat.m2-get-color-from-palette($accent, 200)` + `m2-get-contrast-color-from-palette`.
- Features: `:has()` parent tint, rails via `::before/::after`, focus ring on pill, collapsed mode hides rails, `overflow-wrap: anywhere`.
- Link rule: `base/_typography.themed.scss` adds `:not(.num-nav-link)` to the global `a:not(...)` rule (else link color/weight would hit the menu).

## 2. Changed old-tree style files -> styles-next
| 652 file (old tree) | styles-next target | Action |
|---|---|---|
| `layout/_side-menu.component.themed.scss` | `custom-material/layout/_side-menu.component.themed.scss` (still the OLD pre-652 version: `mat-nav-list`, 8 hex, `!important`) | REWRITE from 652 version, then convert: `primary 'white'` -> `role-color($theme, neutral, 0)`, primary 200/700/900 -> neutral 200/700/900, accent 900/200 -> accent 900/200, `--color-text-section` stays (foreground `section-text`). Type -> `var(--font-side-menu-*)`. Drop `$name == 'fdpg'` block. Not a straight copy: 652 uses `$primary`/`$accent` Material maps and body-2 weight. |
| `layout/_app-layout.themed.scss` | `custom-material/layout/_app-layout.themed.scss` (still old `.sidenav-container`/`mat-sidenav`) | Copy structural part (`.app-body`, `.sidenav`, `.main-content`, `.fullscreen` 95%). Keep styles-next color treatment (`#ffffff` there -> `role-color neutral 0`). Check `.logo-wrapper` part untouched by 652. |
| `base/_typography.themed.scss` (+ `:not(.num-nav-link)`) | DIVERGED: file deleted/split into `base/_links.themed.scss` + `_headings.themed.scss`; link rule now `a:not(.mat-mdc-button):not(.mat-mdc-list-item):not(.mat-mdc-tab-link)` with roles | Do NOT copy. Add `:not(.num-nav-link)` to `_links.themed.scss` by hand (needed: link rule sets family/weight/size/line/color, hover underline, focus outline, `:visited`; specificity 0,3,1 beats `num-side-menu .num-nav-link` 0,2,1). |
| `base/_color-variables.themed.scss` | `custom-material/base/_color-variables.themed.scss` (roles, no `$primary` vars) | DIVERGED. Port only the side-menu-relevant ones if still needed: `--num-color--grey-hover` (= neutral 100) and `--num-color--accent-900` (= accent 900) are read only by `search-filter` (not the menu). Others in step 5. `--num-color--warn` is now yellow (warning 500) in styles-next, was `$warn` of old tree; 652 reads `error` / `error-on-white` from `$warn` (additional palette, not in styles-next). |
| `components/_checkbox.themed.scss` | `custom-material/components/_checkbox.themed.scss` (old MDC version, partly role-ed) | REPLACE with 652 version (native `input.checkbox` + `.mat-pseudo-checkbox`); colors: `primary 'white'` -> neutral 0, `--num-color--control-border` = neutral 700, `--num-color--checkbox-checked` = `#839e00` (no shade: green 600 `#8aa51d`, 700 `#758c17`; see risk 3). Needs new `:root` tokens + `assets/img/icons/checkmark.svg` (new in 652, merged by git). |
| `styles.scss` (+32 lines) | `styles-next/styles.scss` (tokens differ: `--font-weight-*`, no `--spacing-1`) | Add: `--font-size-nav*`, `--line-height-nav*`, `--spacing-1`, `--size-checkbox`, `--border-width-control`, `--focus-ring-width/-offset`, `--opacity-disabled`, `--transition-control`, `--shadow-control`, `--color-text-placeholder` (#5f6773 hex -> foreground key `placeholder-text`), `--border-color-hover`. Update the doc comment block too. Nav size/line tokens go away once roles replace them (step 4). |
| `themes/colors/_additional-theme.palette.scss` (`error-on-white` #c4122f) | no equivalent (`additional` palette deleted; roles: `danger` = red ramp) | Skip until error text roles are decided (risk 4); not menu related. |
| `themes/colors/_fdpg-primary-theme.palette.scss` (`green-3` #839e00) | `palettes/_grey.palette.scss` has no 'green-*'; green ramp in `_green.palette.scss` | Skip the palette key. Checkbox needs a green shade: use `role-color($theme, secondary, N)` (risk 3). |
Non-style files in 652 (checkbox, search-filter, searchbar, missing-filter, section-name, header ... `.component.scss`) merge by git; they read `--num-color--*` and `--spacing-*`, so those variables must exist in styles-next (run `npm run check:styles` after adding `--num-color--` to `VAR_PREFIXES`).

## 3. Step order (after each: sass compile + `npm run check:styles`)
1. Finish the merge for app files (templates, ts, spec). Styles-next untouched. Compile: sass command must still pass.
2. Global-rule check (insight 1): `grep -rn "^\s*a[:{ ,]\|\ba:not\|\.mdc-list-item\|mat-nav-list\|num-mat-list-item" src/styles-next`; list every element rule that can hit `a`, `ul`, `li`, `button`, `span` inside `num-side-menu` (known: `_links.themed.scss`; audit `_headings`, `_general_table`, `_lang-toggle-button`, `_ui-classes`). Add `:not(.num-nav-link)` to `_links.themed.scss`.
3. Add the new `:root` tokens to `styles-next/styles.scss` (list in section 2). Compile.
4. Layout: port `.app-body` etc. into `_app-layout.themed.scss`. Compile, load app, nav visible, content scrolls.
5. Rewrite `_side-menu.component.themed.scss` from 652 with roles for color (layout/colors first, type still `--font-body`/`--font-size-nav`). Delete old selectors. Compile + diff against the 652 CSS (only hex-normalising diffs allowed).
6. Typography roles (process step 5): add `side-menu-item` and `side-menu-item-active` to `themes/fdpg-light/_type-roles.scss`, new `custom-material/typography/_side-menu.themed.scss` (`type.vars` x2), `@include side-menu_themed($theme)` in `_index.scss`. Compile + check:styles (mixin-included check).
7. Switch the menu SCSS to `var(--font-side-menu-item-*)` / `-active-*`; delete `--font-size-nav*` tokens. Remove `:not(.num-nav-link)` need only if the link rule is later scoped.
8. Port checkbox (`_checkbox.themed.scss`) + tokens + green shade decision. Separate commit.
9. Other color variables (`error-*`, `grey-hover`, `accent-900`, placeholder) as one color-pass commit with their role decision.

## 4. Verification per step (DevTools, running app)
- Step 3/6: `getComputedStyle(document.body).getPropertyValue('--font-side-menu-item-size')` = `16px` (not empty); `--size-checkbox` = `18px`.
- Step 4: `.app-body` computed `position: fixed`, top `108px`; `nav.sidenav` width 320px (expanded) / 64px (collapsed); `main` scrolls, no horizontal scroll at 320px viewport.
- Step 5: `num-side-menu` computed `--side-menu-bg` `rgb(255,255,255)`, hover `rgb(232,235,237)` (#e8ebed), active text `rgb(35,54,87)` (#233657), icon `rgb(94,108,120)` (#5e6c78), focus ring accent 900. In *Styles* no hex literal, only `var(--side-menu-*)`. Tab through: ring 2px, offset -2px.
- Step 6/7: item `.num-nav-link` computed family Titillium Web, weight 400, 16px/24px; active link and active child text 600; Styles pane shows `var(--font-side-menu-item-size)`. Link rule must not apply: no underline on hover, color not `#49689c`.
- All: contrast of label vs row background >= 4.5 (DevTools contrast row); active vs inactive weight differs; `npm run check:styles` ok.

## 5. Risks / open questions for Shah
1. 652 has 18/26/600 parent + 16/24/500 child; your roles are 16/24 at 400/600. Two roles or three (`...-parent`)? Recommend two roles for all levels; accept parent 18 -> 16 and child 500 -> 400 (answer before step 6).
2. 652 sizes in `rem` (WCAG 1.4.4), our roles use `px`. Recommend keep px for now, decide rem for all roles once (not just here).
3. Checkbox fill `#839e00` has no shade in the green ramp. Recommend `secondary 700` `#758c17` (darker, contrast above 3.06) instead of a new shade.
4. `error-on-white` / `error` (#c4122f, #b30519) have no role (`danger` ramp is pure red). Recommend skip in this plan; own color pass, pick `danger 800` `#ba0000` as candidate.
5. Straight merge of old-tree files would be fine for git, but the old tree is deleted at the switch. Recommend: no extra work on `src/styles/`, but resolve its conflicts only by taking 652 (UU: side-menu, color-variables, palette).
6. `app-layout` drops Material sidenav (handset `over` mode gone). Recommend check the narrow viewport once in step 4 (unverified how 652 behaves below 600px).
