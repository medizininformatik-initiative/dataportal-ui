# C22 details panel (drawer on row click)

Branch `refactor/details-panel`, 2026-10-20. Files: `search-results.component.scss` (drawer shell), `list-item-details-generic` (panel, tabs, rows), `...-sections` (parent / child cards). Same panel is used on the profile search (data-selection).

Done:

- Six roles `details-panel-*` (tab 16/24/400, title 16/24/600, label 14/20/600, value 14/20/400, relative-name 14/20/600, relative-meta 12/16/400), all `letter-spacing: normal`. Group file `_details-panel.themed.scss`.
- The panel no longer uses the global `num-text-*` / `num-info-item` classes; it reads the role variables. Title was 18px (off the ladder), line heights 19 -> 20.
- Tabs: new `material/_mat-tab.themed.scss`. Active label, indicator and ripple = accent 600, inactive label = foreground text (was Material indigo `#3f51b5`). This is global: every `mat-tab-group` / `mat-tab-nav-bar` in the app.
- Tab text size goes through `--mat-tab-header-label-text-*` set on `.mat-mdc-tab-header` (Material sets them there, a value on the group is ignored).
- New variable `--border-color-subtle` (neutral 100, was literal `#f1f2f3`), used by the panel row divider.
- `!important` removed from the drawer border; the two `::ng-deep` rules are scoped (`.details-drawer ::ng-deep`, `:host ::ng-deep`).

Left:

- Tab label `line-height` measures 16 (Material's `.mdc-tab` rule); tab height is fixed 48 so nothing moves.
- `::ng-deep .mat-drawer-inner-container` is still global in `concept-bulk-search`, `search`, `profile-search-results`.
- `num-list-entry` (relative card) is a global class used elsewhere: not touched. Close button is the cancel button (`font-weight: 400` on purpose).
- Old `shared/components/list-item-details` component: exported, no template uses it. Delete candidate.
- Not checked in the browser: profile search (data-selection) drawer, Parents / Children tabs, hover and focus.
- Other tab groups (edit-fields, criterion, profile reference) now get the accent color: look at them.

Undo: `git switch chore/remove-dead-palettes` (nothing is merged), or `git revert <commit>`.
