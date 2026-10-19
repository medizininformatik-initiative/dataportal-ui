# C05 num-language

Molecule, language select (mat-select). Source: `app/layout/components/language/language.component.scss`. Typography only.

| Part | Property | Now (measured) | Next | Source line | Change |
|---|---|---|---|---|---|
| host | size / line / weight | 20 / 32 / 500 | 16 / 24 / 400 (no role: Material value, same as target) | none in own scss | change (find origin) |
| select text | size / line / weight | 16 / 24 / 400 | 16 / 24 / 400 (no role: Material value, same as target) | Material select | none |
| select text | letter-spacing | 0.5px | open Q8 | Material | decide |

## Notes
- The file has no `font-*` rule at all. Sizes come from Material (`body-2` level 16/24/500 in `themes/fdpg-light/_typography.scss`) and the host.
- The 20px on the host is one of the outliers to remove (20 is not on the ladder). Origin not found in source; check with `get_css_styles` (PLAN.md step 1).
- Same `.language-select` class is also used in `user-menu.component.scss` (see C06).
- No role (decision 14, 2026-10-19): the component has no `font-*` rule and Material already renders the target value. A role is added when the select is replaced or overridden.
- Open: size of the option text in the panel (`mat-option`), measure before step 7.
