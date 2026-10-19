# Style refactor plan

Goal: every color in `custom-material/` comes from a role (`role-color($theme, role, shade)`), then `styles-next` replaces `src/styles`.
Role map: primary -> `neutral`, accent -> `accent`, green -> `secondary`, red -> `danger`, warn -> `warning`.

## Done
- [x] Palettes, roles, `role-color` function, `fdpg-light` theme (`_roles.scss`, `_material.scss`, `_theme.scss`).
- [x] `button/*` uses roles only (CSS output identical to old tree, except `white` -> `#ffffff`).
- [x] `base/_color-variables.themed.scss` uses roles (CSS output unchanged).
- [x] Grey palette: `'white'` is now shade `0` (read with `role-color` / `map.get` only, Material treats 0-1 as opacity).
- [x] `themes/fdpg-light/_foreground.scss` + `_background.scss`, wired into `$theme` (`foreground`, `background` keys).
- [x] Functions `foreground-color($theme, key)` / `surface-color($theme, key)` in `functions/_foreground-background-color.scss` (with usage example in the file).
- [x] Deleted dead files: `base/_select-classes` (unused class, old MDC selectors), `components/_code-editor.themed` (empty, never imported), `base/_color-classes.themed` (unused `num-fg-color` / `num-bg-color` classes).
- [x] `base/_typography.themed` split into `base/_headings.themed` (h1-h5) and `base/_links.themed`; the Material call `all-component-typographies` is in `custom-material/_index.scss`; the typography config moved to `themes/fdpg-light/_typography.scss` (one typography file, `themes/typography/` removed). Colors via roles; dead selectors removed (`.mat-headline-3/4`, `.decision-dialog`, `.accordion`, `.mat-h5`, `.command-bar__scenario-link`, `.dashboard-link`: not used in `src/app`).
- [x] `base/_text-color-variables.themed.scss`: `--color-text-*` from foreground. `--border-color` (= foreground `divider`) moved into `_color-variables`. Both left `:root` (`styles.scss`) and are now set on `.FDPGTheme` (body).

## Status 2026-10-19
The typography track (`PLAN-design-tokens.md`) and the side menu port (`PLAN-side-menu.md`) run beside this color plan. Current status, gains and the next step are in `PLAN-design-tokens.md`, section "Session notes 2026-10-19 (part 3)". Run `npm run check:styles` before commits that touch `styles-next`.

## Next steps (later)
4. Convert the remaining `custom-material` files to `role-color` / `foreground-color` / `surface-color`:
   `base/_divider-classes`; `components/` (`_filter-chips`, `_action-bar`, `_checkbox`, `_lang-toggle-button`, `_general_table`, `_search-input`); `layout/` (`_side-menu`, `_footer`, `_app-layout`, `_header`); `material/` (`_mat-chip`, `_mat-expansion-panel`).
   Header colors (noted 2026-10-19): the page header is not fully wired to roles. Title color is `var(--color-text-secondary)` = foreground `secondary-text` `#6a7483` (hard-coded hex in `themes/fdpg-light/_foreground.scss`), contrast 4.49 on the page background. Candidate: `role-color($theme, neutral, 900)` `#5e6c78` (5.12). Not named "secondary": that role is green. The same variable also colors the breadcrumb current page and separator. Still to check: intro color `#325a7e` (literal in `header-description.component.scss`) and the eye button (`#fff` literal).
   `_search-input` still reads `map-get($theme, background)` + `mat.m2-get-color-from-palette`; it works with the new background map (key `card`).
5. Cleanup and switch:
   - Remove old keys from `_theme.scss`: `primary`, `accent`, `green`, `red`, `warn`. Keep `name`, `num-typography`, `roles`, `foreground`, `background`.
     Do it only when `grep -r "map-get(\$theme, \(primary\|accent\|green\|red\|warn\)" styles-next` finds nothing.
   - Grep for leftover hex / `rgba(` in `custom-material/` and `general-styles/`.
   - Compile both trees and diff the CSS, point `angular.json` (`styles`) at `src/styles-next/styles.scss`, delete `src/styles/`, commit.
   - Delete `color-variables-proposal.md` and `text-color-shades-proposal.md` (obsolete).

Open: role names are placeholders.

## Later: remove Angular Material completely
Goal: replace every Material component with native HTML elements (+ own CSS), then remove `@angular/material` (and `indigo-pink.css`, `mat.all-component-typographies`, `themes/fdpg-light/_material.scss`, `_typography.scss`).
Material in use (checked in templates and component imports, 2026-10-19; `layout/material/material.module.ts` lists every module and is NOT a usage list):
- Used: tooltip (79 files), dialog (20), tabs (13), select / option / optgroup / form-field (9), sidenav / drawer (8), stepper (4), expansion panel (4), badge (4), input (3), datepicker (2), menu, list (nav-list), toolbar, icon (+ `MatIconButton`) (1 each).
- Not used: table, sort, paginator, tree, checkbox, radio, slide toggle, button toggle, progress bar, autocomplete, card, snack-bar, `mat-button`. Tables are native HTML already. Chips: only in stale specs (`querySelector('mat-chip')` in `filter-chips` and `bool-logic-switch` specs).
- Quick win: delete unused modules from `material.module.ts` (it is only imported by specs).
Steps:
1. Chrome DevTools check (to do): for the Material type levels `body-2`, `button`, `caption` in `themes/fdpg-light/_typography.scss`, check in the running app whether components override the font locally, or really use the Material value. Use `mcp__chrome-devtools` (`take_snapshot`, `get_css_styles`). Compile test already done: only these Material components read the levels (`body-1`/`headline-1` are unused or equal to the default and can be removed now).
2. Replace components one family at a time, easy first (badge, icon, toolbar, list), then form controls (input, select / option, form-field, datepicker), then layout (tabs, stepper, sidenav / drawer, expansion panel), then overlays (tooltip, menu, dialog).
   Per family: keep Cypress tests green (`data-cy`), check keyboard use and ARIA (native elements first: `<button>`, `<select>`, `<input type=date>`, `<details>`, `<dialog>`, `popover`).
3. After each family, remove its Material module import and its styles in `custom-material/` (`material/`, `components/`).
4. At the end: remove `@angular/material` and `@angular/cdk` (if unused) from `package.json`, delete `themes/fdpg-light/_material.scss` and the typography config, keep `_theme.scss` with roles, foreground, background only.

## Check after each step
`npx sass --load-path=. --load-path=node_modules src/styles-next/styles.scss > new.css` and diff against `src/styles/styles.scss`.

## `_color-variables`: what it is for (verified 2026-10-19)
Emits CSS custom properties on the page. Component SCSS files cannot call Sass mixins with `$theme`, so they read `var(--...)` instead.

| Variable | Value now | Used in (count outside this file) |
|---|---|---|
| `--color-accent` | accent 500 | 112 uses, ~55 components |
| `--color-accent-bg` | accent 500 at 10% | 31 |
| `--color-accent-border` | accent 500 at 20% | 15 |
| `--color-accent-strong` | accent 600 | 5 |
| `--num-color--accent-200` | accent 200 | between-filter |
| `--num-color--accent-400` | accent 400 | selected-items-list, menu, `_ui-classes` (4) |
| `--num-color--accent-600` | accent 600 | bulk-search-input, between-filter |
| `--num-color--primary` | primary (grey) default | search.component (1) |
| `--num-color--primary-blue` | accent 500 | user-menu, dashboard (3) |
| `--num-color--primary-green` | green 500 | about-modal, dashboard, `styles.scss` (8) |
| `--num-color--warn` | warn default | searchbar (1, with fallback chain) |
| `--num-color--red` | red 500 | searchbar, missing-filter (2) |

Notes for the cleanup:
- `--num-color--primary-blue` has the same value as `--color-accent`; `--num-color--accent-600` and `--color-accent-strong` too.
- Names are not systematic (`--num-color--*` vs `--color-*`). Renaming touches every component file, so do it as a separate step after the roles are final.
- Variable names stay unchanged while converting values to `role-color`, so the component files need no edit.
