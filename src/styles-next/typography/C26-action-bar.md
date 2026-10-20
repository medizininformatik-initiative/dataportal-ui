# C26 num-action-bar (incl. count badge)

Organism, bottom action slot. Source: `styles-next/custom-material/components/_action-bar.themed.scss`, `app/shared/components/action-bar/action-bar.component.scss` (no `font-*` there). Typography only.

| Part | Property | Now (measured / source) | Next | Source line | Change |
|---|---|---|---|---|---|
| buttons (num-button) | size / line / weight | 16 / 24 / 600 | unchanged | see C20 | none |
| `.selection-text` | family / size / line / weight | Open Sans 12 / 16 / 600 | Titillium 12 / 16 / 600 (`meta-s`) | `_action-bar.themed.scss:34-37` | family only |
| `.count-badge` | family / size / line / weight | Open Sans 12 / 12 / 700 (source) | Titillium 12 / 16 / 600 (`meta-s`) | `_action-bar.themed.scss:51-54` | change |
| badge (measured) | size / line / weight | 12 / 22 / 600 | 12 / 16 / 600 | matBadge or `.count-badge` | check which |
| icon buttons | glyph | `font: 700 14px/1` (mock) | n/a, icons | | none |

## Notes
- Source says badge 12/12/700, measured says 12/22/600. Two different rules; find which one renders (`.count-badge` vs Material `matBadge`) before editing.
- `line-height: 12px` with `height: 21px` badge: text box smaller than the font box is fragile. Use 16.
- Contrast of green text (2.15) is a color topic.

## Result (2026-10-20)
- `.selection-text` and action-bar `.count-badge` had no user in any template: deleted from `_action-bar.themed.scss`. (`.count-badge` in filter chips is a different rule, kept.)
- The rendered badge is Material `.mat-badge-content` (12/22/600, box 26x26, `typography-prototype-app.css:331`, `--mat-badge-*`). No role: 12/16 would change nothing visible (Shah, option 2). The header user-menu badge shares it.
- The table above (`.count-badge` 12/12/700, `.selection-text`) is obsolete.
