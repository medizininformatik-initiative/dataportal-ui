# C07 num-header-portal-link

Molecule, external link button in the app header. Source: `app/layout/components/header/portal-link/portal-link.component.scss`. Typography only.
Decision 2026-10-19 (Shah): becomes a blue button, `class="num-button blue"`. It uses the shared role `button` (C20). It has no role of its own.

| Property | Now | Next | Source line | Change |
|---|---|---|---|---|
| look | outlined, no fill, hover accent | filled blue (`.num-button.blue`: accent 500, hover 600, white text, raised shadow) | :1-8, :27-31 | change |
| font-family | `'Open Sans', sans-serif` | `var(--font-button-family)` (Titillium Web, role `button`) | :9 | change |
| font-size | `var(--font-size-md)` = 14px | 16px (role `button`) | :11 | change |
| line-height | `var(--line-height-md)` = 19px | 24px | :12 | change |
| font-weight | `var(--font-weight-bold)` = 600 | 600 | :10 | none |
| size | padding 6px 12px (about 33px high) | height 40px, padding 9px 18px, min-width 125px, gap 15px | :6-7 | change |

## Notes
- Prototype: `typography-prototype-button.html`.
- Component change at step 7: template gets `class="num-button blue"`, the whole `.portal-link-btn` rule is deleted (the colors, shape and type then come from `custom-material/button/`).
- Only header item in Open Sans. Moving it removes one reason for the external font request (full removal depends on Q1 and C23, C26).
- Bigger and heavier than the other header controls (language, user menu). Check the header as a whole in the browser before step 7.
- Tooltip (`matTooltip`) and the `fa-icon` stay unchanged.
