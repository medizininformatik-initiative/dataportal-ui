# C09 a.num-mat-list-item (side menu item)

Atom, nav item. Source: `styles-next/custom-material/layout/_side-menu.component.themed.scss` (no own scss in `app`). Typography only.

| Part | Property | Now (measured) | Next | Source line | Change |
|---|---|---|---|---|---|
| item, inactive | size / line / weight | 16 / 24 / 600 | 16 / 24 / 400 (`control`) | :140-144 `!important` (family, size, weight, line, letter-spacing) | weight change |
| item, active | size / line / weight | 16 / 24 / 600 | 16 / 24 / 600 (`control-strong`) | :151, :155 `font-weight: 600 !important` | none |
| `.navItem-font` | size / line / weight | 16 / 24 / 600 | same rule, weight 400 unless active | :118-121 | weight change |
| letter-spacing | | normal (forced) | open Q8 | :144 | decide |

## Notes
- Weight is 600 everywhere, so weight does not show the active state. Fix: inactive 400, active 600.
- Three places set the same values (`.navItem-font`, `.num-mat-list-item`, `--active`). Merge into the two levels.
- `!important` on all four properties: remove once the level class replaces the Material override.
