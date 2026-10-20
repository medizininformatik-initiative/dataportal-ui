# Plan: remove Angular Material completely (later)

Moved out of `PLAN.md` 2026-10-20, text unchanged. Not now; typography first.

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

