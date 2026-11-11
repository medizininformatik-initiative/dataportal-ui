# C18 num-section-name

Atom, section heading ("Suche verfeinern:"). Source: `app/shared/components/section-name/section-name.component.scss`. Typography only.
Status 2026-10-20: ported. Role `app-content-section-name` (16/24/600, letter-spacing `normal`) in `themes/fdpg-light/_type-roles.scss`, group file `custom-material/typography/_section-name.themed.scss`, component reads the variables. Tag changed `<h3>` to `<h2>`. The hint "Suche verfeinern:" (2 filter bars) is no section name: it is a `<p class="filter-heading__label">` with its own role `app-content-filter-hint` (same values today: 16/24/600, `normal`; group file `_filter-hint.themed.scss`). Visual result: waiting for Shah's check in the app.

| Property | Was (measured) | Now | Change |
|---|---|---|---|
| font-size | `var(--font-size-md, 16px)` = 14px | 16px | change |
| line-height | `var(--line-height-md, 24px)` = 19px | 24px | change |
| font-weight | 600 | 600 | none |
| font-family / font-style | `var(--font-body, ...)` / normal | role variable / removed | simplify |
| tag | `<h3>`, 4x `!important` to beat the global `h3` rule | `<h2>`, no `!important` | h1 then h2, no skipped level |

## Notes
- Why `h2`: `<h3>` skipped a level under the `<h1>`. Why `<p>` for the filter hint: it labels controls, it does not head a block, so it should not appear in the outline. Option left open: `role="group"` + `aria-labelledby` on the filter container.
- `.filter-heading__label` was dead before (no template used it); it is now the hint's rule in `search-filter-bar` and `profile-search-bar`.
- Global `h3` rule in `_headings.themed.scss` stays: `information-section`, `error-display`, data-protection still use `h3`.
- Tried and reverted 2026-10-20: filters next to the section name, filters next to the search bar (alignment of search bar 44px / filter 42px / button 38px never matched). Not wanted for now.
- Color `#5f6266` (`section-text`) is still a hex in `_foreground.scss`: color pass.
- Hint contrast (checked 2026-10-20): `#5f6266` on white (`.app-body`) 6.13, on page grey 5.82 (AA text needs 4.5). Info icon `#6a7483` 4.73 on white, 4.49 on the page grey (icons need 3). Fine. Weight 600 is what sets the hint apart from the 16/24/400 select text next to it.
- The `?` icon vanished once because the hint had `width: 100%` in a flex row and pushed the icon to zero width. The hint has no width now.
