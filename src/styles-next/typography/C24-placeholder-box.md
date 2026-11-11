# C24 num-placeholder-box (empty state)

Molecule, empty-state text with icon. Source: `app/shared/components/placeholder-box/placeholder-box.component.scss`. Typography only. Measured on `/feasibility-query/bulk-search`; not shown on the single search page.

| Property | Now | Next | Source line | Change |
|---|---|---|---|---|
| font-size | 24px (#6a7483) | 16px (`control`) or 24 (Q10) | :24 | decide |
| line-height | 20px (measured) | 24px, or 32px if size stays 24 | not in this file | change |
| font-weight | not set | 400 | | add |

## Notes
- Line height (20) is smaller than the font size (24). Inherited from somewhere else; set it explicitly together with the size.
- Q10 in the research: 16/24 `control`, or 24/32 (like `h1`). Recommendation: 16/24; an empty state is not a page title.
- Check whether the 24px is the icon size or the text: `:24` may belong to the `fa-icon` rule. Read the file before editing.
