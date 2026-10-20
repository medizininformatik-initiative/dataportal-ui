# Design tokens: insights and discussion

Reference. Moved out of `PLAN-design-tokens.md` 2026-10-20, text unchanged. Newer insights are in `design-tokens-history.md` per session.

## Insights (what we learned)

- **`font:` is a shorthand and resets what it does not name.** It sets weight, size, line height and family, and resets `font-style`, `font-variant` (including `tabular-nums`), `font-stretch`, `font-kerning`, `font-size-adjust`, `font-feature-settings` to their defaults. Not reset: `letter-spacing`, `word-spacing`, `color`. This was a black box for the team, hence option B. Checked in the repo: no `font:` shorthand and no `font-variant-*` in any SCSS today; `font-style: italic` in 6 places. (Reset list from memory of the spec, not re-read.)
- **Names that sound like a scale must be a scale.** `heading-strong` implied `heading` and `heading-weak`. Naming the entry after its role removes the problem.
- **Two worlds of values in one file name.** A level (reusable look) and a label (role) are different ideas. We collapsed them: one entry per role. Price: equal looks repeat (an input and a nav item are both 16/24/400). Benefit: no invented vocabulary.
- **Component notes (`typography/Cxx-*.md`) contain mismatches between source and measurement** (C04 breadcrumbs, C05 language, C24, C26, C27). Each needs a DevTools or console check by Shah before a component is changed.
- **Many components have no `font-*` rule of their own** (C05, C06, C19): they inherit Material `body-2`. A role can only name them once the Material level is replaced or overridden.
- **`/* */` comments appear in the compiled CSS in expanded mode** (`//` never does). Compressed output removes them. Production build is probably compressed (not checked).
- **Page header HTML:** the title is a `<p>`, not a heading (research Q9). The eye button is the page header action, not the "?" icon (that one belongs to the section name, C18).

## For discussion (Claude's input)

1. **A typo in a variable name fails silently.** `font-size: var(--font-page-header-titel-size)` is not an error; the browser ignores it and the text inherits. Suggestion: a small check script (grep every `var(--font-...)` in `src/app` against the variables the Sass writes) in CI or as a Cypress/unit check, run at step 7.
2. **Two sources of truth.** The numbers now exist in `typography-prototype.css` (plain CSS) and in `_type-roles.scss`. After a group is ported, the prototype can drift. Suggestion: the prototype page reads the compiled CSS of the group instead of its own copy, or the prototype is deleted once the group is ported.
3. **The prototype CSS still uses the old vocabulary.** It has the `font:` shorthand, levels like `heading-1`, `body-large`, and `.type-*` classes. It does not follow decisions 2 and 3 yet. Suggestion: rewrite it with longhands and role names when the next group is prototyped, not before.
4. **The component notes use level names** (`control`, `label`, `body`, `meta`) from the research. Under decision 2 these are only descriptions of looks; the real names come per group. Suggestion: keep the notes as they are and add the role name in the "Next" column when a group is prototyped.
5. **Group order.** Suggestion, by shared look and file count: `page-header` (done), `app-content` groups: `section` (C18 section name, C19 filter, C20 button), `search-bar` (C16), `table` (C23, C27; also removes Open Sans), `app-header` (C05 language, C06 user menu; C07 done as `button`), `side-menu` (C09), breadcrumbs C04 under `app-content`, `action-bar` (C26). Table has the largest visible change; do it last or alone.
6. **Same pattern for shape and sizing.** If this works, `shape-*` and `size-*` roles can use the same files and mixin shape (`_shape-roles.scss`, `shape.vars`). Decide after the first typography group is switched.
7. **Fonts first or last?** Moving the table to Titillium removes the Google Fonts request, but only if nothing else keeps Open Sans (tooltip, action bar, filter chips, user button). Decide Q1 before the table group.
8. **Research on the other font properties** (`tabular-nums`, `font-synthesis`, `font-size-adjust`, `text-wrap: balance`, ...): section 11 of `research-usability-typography.md`. It does not change contrast; weight and size do.


## 2026-10-20: font cleanup
- Titillium Web has no 500 on Google Fonts (200, 300, 400, 600, 700, 900). Roboto Medium used to cover 500. Now 500 is drawn as 400. Same for 300 (no file shipped).
- Open Sans came from the Google Fonts CDN, not self-hosted: 2 preconnects, blocking CSS, up to 3 font files per cold load. Removing it = no third-party request (offline, GDPR). Speed gain NOT measured (no Lighthouse run).
- Roboto: 212 KB of files (9, only woff2 is fetched by modern browsers), no text used it, so it was never downloaded. Saving = repo/build size, not load time.
- Every `font-family` literal was redundant: `body.mat-typography` already sets Titillium, children inherit. Deleting the line is enough; no replacement needed (only `criteria-stage` needed `var(--font-body)`).
- Mistake caught: `git add src/app` also staged `app.component.ts`, which must stay uncommitted. Fixed with `reset --soft` before push. Stage by explicit file, not by folder, while `angular.json` + `app.component.ts` are held back.
