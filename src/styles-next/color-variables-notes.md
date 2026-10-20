# `_color-variables` notes

Reference for the color pass. Moved out of `PLAN.md` 2026-10-20, text unchanged.

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
