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

## 2026-10-20: h1 / h2 session
- A global element rule (`h2`) wins over component intent: `!important` margin made the FAQ gap 20px although its scss said 4px. Moving type into roles read by the component removes this class of hidden override.
- A heading tag used for a plain sentence (intro `<h2>`) forces resets: 4x `!important` + border/padding/font-style. Right tag (`<p>`) = no resets. Check the tag before writing overrides.
- Component scss cannot call `role-color` (no `$theme`). Pattern: the group mixin (`page-header_themed`) emits a CSS variable from the role, the component reads `var(...)`. Used for intro color.
- Extending `type.vars` with an optional key (`letter-spacing`, guarded by `map.has-key`) keeps old roles unchanged: no variable is written when the key is missing.
- Collapse animation needs 4 properties together (`max-height`, `overflow`, `opacity`, `transition`); margin must be animated too or a gap stays when hidden.
- `#325a7e` was in no palette. Nearest: accent 700 `#3c5786` (same contrast 6.88). Compare contrast numbers, not only hex distance.
- Several leftovers were dead code: `h2` selectors in `save-dialog` / `save-file-modal` had no `<h2>` in their templates. Grep the template before keeping a selector.
- `git add <folder>` also stages held-back files (`app.component.ts`). Stage by explicit file or run `git status` before commit.

## Improvements still possible (heading / header area)
- Roles for modal title, FAQ title, data-protection title (prototype `typography-prototype-headings.html` exists; open: keep underline?, FAQ gap 4 or 20px?, data-protection weight 400 vs 600). Until then those three headings have no global h2 look and use Material's 20/32 + their own scss.
- `h3` (used in `section-name`, `information-section`, `error-display`, data-protection), `h4` (data-protection), `h5` (no template: dead rule): same treatment as `h2`. All still `!important` in `_headings.themed.scss`.
- Intro: `max-height: 200px` clips text above 8 lines (long translation, narrow window). Fix only if it shows up.
- Header title color `#6a7483` (contrast 4.49) -> candidate neutral 900 `#5e6c78` (5.12); eye button hover `#fff` literal. Color pass.
- Weights: Titillium has no 500/300; `$body-2` 500, `$caption` 300, `_button-cancel` 500, `profile-reference-chip` 500 are drawn as 400.
- Q8 (letter-spacing of non-link text) still open; intro keeps `normal` via role key.
- Dead code list (`.user-button`, `.portal-link-btn`) skipped by Shah.

## 2026-10-20: section name session
- `h3` for the section name skipped a level (h1 then h3). Check the heading outline before choosing a tag; the right tag also removed 4 `!important`s.
- A custom element (`<num-button>`) is `display: inline` by default. As a flex item it is blocked, but an `inline-flex` child on a text baseline makes the host taller than the child, so `align-items: center` aligns the wrong box. Likely cause of the button offset (not measured).
- `mat-form-field` reserves ~22px below the box for hint/error text; it pulls the visible box off a shared axis. Hide the subscript wrapper where no hints are used.
- Layout experiments (filters in one row with the heading or with the search bar) were reverted: search bar 44px, filter 42px, button 38px. A real layout change needs the three heights agreed first.
- A heading tag is for headings. A one-line label for controls ("Suche verfeinern:") is a hint: `<p>`, not `<h2>`/`<h3>`. The tag decides whether it shows up in the screen reader outline.
- Equal size and weight are not equal visual weight: color counts. A darker small text can outweigh a lighter big title. Check color order (title darkest) when roles share weight 600.
- `width: 100%` on a flex child squeezes its siblings (the `?` icon went to zero width). Prefer no width on the label in a flex row.
- Two roles with equal values are fine (hint and section name today): the role says what it is for, and each can change alone.
- Dev page `/playground` (`src/app/site/playground`, not in production builds) lists the shared components. It lacks the hint and an h1 above the section name.

