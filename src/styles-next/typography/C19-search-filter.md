# C19 num-search-filter

Molecule, filter dropdown (mat-select + search input). Source: `app/shared/components/search-filter/search-filter.component.scss`. Typography only.

| Part | Property | Now (measured) | Next | Source line | Change |
|---|---|---|---|---|---|
| select text | size / line / weight | 16 / 24 / 400 | 16 / 24 / 400 (`control`) | Material select | none |
| select text | letter-spacing | 0.5px | open Q8 | Material | decide |
| `.select-search-input` | font-size | `var(--font-size-md)` = 14px | 16px | :75 | change |
| `.icon-design` | font-size | `var(--font-size-sm)` = 12px | check: icon size | :34 | check |

## Notes
- `.select-search-input` is the search field inside the open dropdown; it is not on the measured page (closed state). Not measured.
- Option list text (mat-option) not measured either.
