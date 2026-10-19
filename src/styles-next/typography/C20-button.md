# C20 num-button

Atom, action button. Source: `styles-next/custom-material/button/_button-base.themed.scss` (no scss in the component folder). Typography only.

| Property | Now (measured) | Next | Source line | Change |
|---|---|---|---|---|
| font-size | 16px | 16px (role `button`) | :12, :19 | none (use token) |
| line-height | 24px | 24px | Material | none |
| font-weight | 600 (base rule says 400 at :13, 600 at :20) | 600 | :13, :20 | none (remove the 400 rule if dead) |
| font-family | inherit | inherit | :6, :18 | none |
| letter-spacing | 0.25px | open Q8 | :25 `inherit` | decide |

## Notes
- Already on the ladder. The only work is replacing the literal `16px` / `600` with level values, so the CSS output stays identical.
- Used in the filter bar (reset), the action bar and bulk search; one change reaches all.
- Role name: `button` (shared, no area prefix). It covers `.num-button` and all color variants (`blue`, `green`, `red`). Decided 2026-10-19.
- C07 (portal link) joins as `.num-button.blue`; its own Open Sans rule is removed. See `C07-portal-link.md` and `typography-prototype-button.html`.
