# C27 num-availability-cell / status-bar

Molecule, availability label + 4px bar. Sources: `app/shared/components/table/cells/availability-cell/availability-cell.component.scss` (empty, one comment), status-bar component. Typography only.

| Part | Property | Now (measured) | Next | Source line | Change |
|---|---|---|---|---|---|
| label | family / size / line / weight | Titillium 12 / 14 / 400 | Titillium 12 / 16 / 400 (`meta`) | status-bar component (not in `availability-cell.scss`) | line-height change |
| bar | height | 4px | 4px | | none (not typography) |

## Notes
- `availability-cell.component.scss` has no rules. The label style lives in the status-bar component's own scss; open it before editing (not read in this pass).
- Label is Titillium while the rest of the row is Open Sans. After C23 moves to Titillium the row is consistent.
- Label contrast 2.00 is a color topic.
