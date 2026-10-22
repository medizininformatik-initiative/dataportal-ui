# styles

Hierarchy: theme → role → palette → shade → color.

| Folder | Level | What is in it |
|---|---|---|
| `palettes/` | palette, shade, color | One file per hue (`blue`, `green`, `grey`, `red`, `yellow`). Hex values live only here. |
| `themes/` | theme, role | One folder per theme (`fdpg-light/`): `_roles.scss` (role → palette), `_material.scss` (Angular Material format), `_theme.scss` (builds `$theme`). `_index.scss` picks the active theme. |
| `functions/` | | `role-color($theme, role, shade)`: looks up a hex through a role. |
| `custom-material/` | mixins | Code that takes the theme and styles the UI. Names a role and a shade, never a hex. |
| `general-styles/` | | Styles that use no theme color. |

Entry point: `styles.scss` (set in `angular.json`).

## Dark mode

Branch `feat/dark-mode`. Status, insights, issues and the next steps are in `PLAN-dark-mode-research.md`, start at its section **Next session (start here)** (index at the top of **Where we stand**). Theme: `themes/fdpg-dark/`, tools: `dark-mode-tools/`.
