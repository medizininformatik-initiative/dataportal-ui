# C06 num-header-user-menu

Molecule, account menu (mat-select + 3 mat-option). Source: `app/layout/components/header/user-menu/user-menu.component.scss`, `styles-next/custom-material/layout/_header.themed.scss`. Typography only.

| Part | Property | Now (measured) | Next | Source line | Change |
|---|---|---|---|---|---|
| select text | size / line / weight | 16 / 24 / 400 | 16 / 24 / 400 (no role: Material value, same as target) | none in own scss (Material) | none |
| select text | letter-spacing | 0.5px | open Q8 | Material | decide |
| `.user-button` | family / size / line / weight | Open Sans 14 / 19 / 700 | none: dead rule, delete | `_header.themed.scss:68-78` | delete |

## Notes
- `user-menu.component.scss` has no typography. Only layout.
- `.user-button` in `_header.themed.scss` is used nowhere (grep in `src/app` and `styles-next`, 2026-10-19). Delete at step 7; no role.
- No role (decision 14, 2026-10-19): the component has no `font-*` rule and Material already renders the target value. A role is added when the select is replaced or overridden.
