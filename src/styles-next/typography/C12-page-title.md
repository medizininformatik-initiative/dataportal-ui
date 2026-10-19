# C12 num-header (page title)

Atom, page title. Source: `app/shared/components/header/header.component.scss`. Typography only.

| Part | Property | Now (measured) | Next | Source line | Change |
|---|---|---|---|---|---|
| `.header-font` | size | 30px | 24px | :4 | change |
| `.header-font` | line-height | 46px | 32px | :5 | change |
| `.header-font` | weight | 700 | 600 | :3 | change |
| `.header-font` | font-style | normal | remove (default) | :2 | cleanup |
| element | tag | `<p>` | `<h1>` (HTML change, Q9) | template | change (needs yes) |
| `.toggle-btn` (eye button) | line-height / size | `1` / browser default 13.3 | 14 / 20 or icon-only | :21 | change |

## Notes
- Label: `app-content-page-header-title` (24/32/600). Line height 46/30 = 1.53 is loose.
- No heading element on the page. The `<h1>` is the only part that is not CSS.
- The 13.3px comes from the `<button>` default; set the size explicitly or make the button icon-only.
