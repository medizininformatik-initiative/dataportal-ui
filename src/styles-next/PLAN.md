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

## NOW (2026-10-20)
Focus: typography. Colors wait.
- Fonts: one family (Titillium Web) since `c0c072e2`. Open: weights 500/300 (see `PLAN-design-tokens.md` open item 3).
- Typography track: see top block "NOW" in `PLAN-design-tokens.md`. Side menu roles done, h1 checked, checkbox parked.
- Color plan (this file): palettes, roles, button, color variables, foreground/background done. Rest of `custom-material` and the switch = later.
- 6 color variables the 652 merge needed: already written (dumped). Only their role decision is open, so it is color pass.

## Next steps (later, color pass and switch; after typography)
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

## More files (open only when needed)
- `PLAN-history.md`: old status notes.
- `PLAN-material-removal.md`: plan to remove Angular Material (later).
- `color-variables-notes.md`: what `_color-variables` emits, usage counts, cleanup notes.
- `PLAN-design-tokens.md`: typography track (current focus).

## Check after each step
`npx sass --load-path=. --load-path=node_modules src/styles-next/styles.scss > new.css` and diff against `src/styles/styles.scss`.

