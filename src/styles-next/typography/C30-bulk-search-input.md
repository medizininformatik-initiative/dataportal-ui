# C30 num-bulk-search-input (bulk search page, not in the original map)

Organism, textarea + filters + search button. Source: `app/modules/feasibility-query/components/search/bulk/input/bulk-search-input.component.scss`. Typography only.

| Part | Property | Now (measured / source) | Next | Source line | Change |
|---|---|---|---|---|---|
| textarea | font-family | `var(--font-body)` | same | :21 | none |
| textarea | font-size | `var(--font-size-md)` = 14px | 16px (`control`) | :22 | change |
| textarea | font-weight | 500 (renders as 400, Titillium has no 500) | 400 | :23 | change |
| textarea | line-height | normal | 24px | not set | add |
| search button | size / line | 16 / 24 | unchanged | :59-60 | none |
| second 16px rule | size / family | 16px, `inherit` | unchanged | :63-64 | none |
| button | weight | `var(--font-weight-bold)` = 600 | 600 | :68 | none |

## Notes
- Weight 500 is not loaded for Titillium. Dropping 500 (27 uses in the repo, Q2) removes this silent fallback.
- Title above the textarea is the same C12 (30/46/700 now, 24/32/600 next).
