# C14 num-header-description

Atom, page intro, hidden by default. Source: `app/shared/components/header-description/header-description.component.scss`. Typography only.

| Property | Now (measured) | Next | Source line | Change |
|---|---|---|---|---|
| font-size | 18px | 16px | :5 | change |
| line-height | 22px | 24px | :6 | change |
| font-weight | `var(--font-weight-bold)` = 600 | 400 | :4 | change |
| max-width | none (5 lines at 1003px, over 80 characters) | `70ch` | not set | add |
| letter-spacing | 0.25px | open Q8 | inherited | decide |
| font-style | normal | remove (default) | :3 | cleanup |

## Notes
- Label: `app-content-page-header-intro` (16/24/400, max 70ch). A sentence block in 600 reads as a heading; 400 is the research default for running text.
- 18 leaves the ladder (12, 14, 16, 24).
