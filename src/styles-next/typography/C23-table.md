# C23 num-table (header, body, cells)

Organism, data table. Sources: `app/shared/components/table/table.component.scss`, `table-header/`, `table-body/`, `cells/*`. Typography only.

| Part | Property | Now (measured) | Next | Source line | Change |
|---|---|---|---|---|---|
| table | font-family | Open Sans | Titillium (Q1) | `table.component.scss:14` | change |
| `.table-header` | font-family | Open Sans | Titillium | `table-header.component.scss:8` | change |
| `th` | size / line / weight | 12 / 14 / 700 | 14 / 20 / 600 (`label`) | `table-header.component.scss:29-32` | change |
| `td` | family / size / line | Open Sans 14 / 19 | Titillium 14 / 20 (`body`) | `table-body.component.scss:22-24` | change |
| name cell | family / size / line | Open Sans 14 / 19 | Titillium 14 / 20 | `checkbox-cell...:3-5`, `checkbox-text-cell...:3-5` | change |
| text cell | family / size / line / weight | Open Sans 12 / 14 / 400 | Titillium 14 / 20 / 400 (`body`) or 12 / 16 (`meta`) | `text-cell.component.scss:2-5` | decide |
| display cell | size | 14px | 14px | `display-cell.component.scss:2` | none |
| numbers | font-variant-numeric | normal | `tabular-nums` | not set | add |

## Notes
- Header is smaller than the data (12 vs 14). Fix: header `label` 14/20/600.
- Open Sans is loaded from fonts.googleapis.com with weights 400/600/700 only. Moving the table to Titillium removes most of that request. After Q1, delete the `<link>` in `index.html` if nothing else uses Open Sans (C26, tooltips, filter chips still do).
- `text-cell` is `12/14`: decide whether it is `meta` (12/16) or `body` (14/20). Text cell shows terminology and code columns.
- Line heights 14 and 19 are off the 4px grid.

## Status 2026-10-20 (commit `dab450e3`)
Done: header role `table-header` 14/20/600, body role `table-cell` 14/20/400 (name, text, display cells), Open Sans gone, row height 40, wrapper `height: 100%`. Option B (contrast only) chosen; name cell stays `#000`, other cells `#6a7483` (color pass).
Open: `tabular-nums`, header height 52px, 15px checkbox, availability label (C27).
