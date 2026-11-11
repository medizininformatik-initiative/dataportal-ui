# C13 num-search-mode-toggle

Molecule, tablist with 2 buttons. Source: `app/shared/components/search-mode-toggle/search-mode-toggle.component.scss`. Typography only.

| Part | Property | Now (measured) | Next | Source line | Change |
|---|---|---|---|---|---|
| `.mode-toggle__option` | font-size | `var(--font-size-sm)` = 12px | 14px (`label`) | :33 | change |
| `.mode-toggle__option` | line-height | `1` (12px) | 20px | :35 | change |
| `.mode-toggle__option` | font-weight | `var(--font-weight-bold)` = 600 | 600 | :34 | none |
| `.mode-toggle__option` | font-family | `var(--font-body)` | `var(--font-body)` | :32 | none |
| `fa-icon` | font-size | `0.8rem` = 12.8px | 14px or `1em` | :39 | change |

## Notes
- `line-height: 1` on text breaks WCAG 1.4.12. Box height stays: `min-height: 30px` (:26) is untouched.
- Wider text at 14px: check that two options still fit the toggle width.
- Active-state contrast (4.39) is a color topic.
