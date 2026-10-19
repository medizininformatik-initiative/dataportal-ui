# C16 num-searchbar

Molecule, search input. Source: `app/shared/components/search/searchbar.component.scss`. Typography only.

| Part | Property | Now (measured) | Next | Source line | Change |
|---|---|---|---|---|---|
| `.input-design` | font-size | `var(--font-size-md)` = 14px | 16px (`control`) | :45 | change |
| `.input-design` | line-height | normal | 24px | not set | add |
| `.input-design` | font-weight | 400 | 400 | not set | none |
| `.input-design:focus-within` | font-weight | 600 | 400 (no weight jump on focus) | :33 | change |
| `.icon-design` | font-size | `var(--font-size-sm)` = 12px | check: icon size, not text | :67 | check |

## Notes
- The selects below (C19) are 16/24. After the change the input matches them.
- Weight change on focus makes the text jump in width. Show focus with the border (already done at :34-35) instead.
- Input height `42px` (:44) stays; 16/24 fits.
