# Plan: design tokens for non-color CSS (typography, shape, size)

Status: plan only, no code yet (2026-10-19). Next to `PLAN.md`.
Goal: components stop hardcoding `font-size`, `font-weight`, `line-height`, `font-family`, `border-radius`, `height`, `min-width`. One central place, read by name. Same idea as `role-color` for colors.

## Why

Count in `src/styles-next` (2026-10-19), `custom-material/` only:
- `height:` 34, `font-size:` 19, `font-weight:` 18, `line-height:` 13, `border-radius:` 12, `font-family:` 10.
- Families: `'Open Sans'` 6, `'Titillium Web'` 6, `'Roboto'` 3. Three families, no rule which one where.
- `border-radius`: `5px` 8x, rest `4px 3px 2px 10px 19px 25%` and 4x `var(...)`.
- `themes/fdpg-light/_typography.scss` has Material levels, but our components ignore them.
- Test case: `components/_action-bar.themed.scss` (12px/16px/600 label, 12px/12px/700 badge, radius 5px, height 80px / 21px).

## Part 1: how Angular Material does it (checked in `node_modules/@angular/material` 19.2.19)

Three layers. Each layer only reads the one above.

1. **Theme config.** `core/tokens/_m3-system.scss`: config map has optional keys `color`, `typography`, `density`. Typography and density are separate inputs, not mixed into color.
2. **Named levels, not raw values.**
   - Typography = set of levels (`body-1`, `body-2`, `button`, `caption`, `headline-*`). A level = size / line-height / weight. Family is defined once (`plain-family` / `brand-family`).
   - Components never write `font-size: 14px`. They say "I use level `button`".
   - M3 also has a shape scale at system level: `corner-none`, `corner-extra-small`, `corner-small`, `corner-medium`, `corner-large`, `corner-extra-large`, `corner-full` (`core/tokens/m3/definitions`). M2 has no shape scale (radius hardcoded per component).
3. **Per-component token files.** `core/tokens/m2/mdc/_filled-button.scss`, `core/tokens/m2/mat/...`, `core/tokens/m3/definitions/_md-comp-*.scss`. Each maps parts of one component to CSS variables, e.g. `--mdc-filled-button-container-height`. Values come from layers 1 and 2. Component CSS only reads `var(--...)`.
   - `get-density-tokens($theme)` in the same file: heights scale with one density number (`container-height`), not hardcoded.
   - Theme mixin (`button/_button-theme.scss`) calls `token-utils.create-token-values(prefix, tokens)` to emit the variables.

Take-away for us:
- Name the level, not the number.
- One family definition, levels reference it.
- Shape = small scale (3 to 4 steps), not free numbers.
- Heights that repeat = named size, not a literal.
- Component CSS reads names or `var(--...)`; values live in one place.

## Part 2: what Sass docs recommend (checked sass-lang.com, 2026-10-19)

- **`@use` / `@forward`, not `@import`.** `@import` is deprecated (warnings since Dart Sass 1.80.0), removed in Dart Sass 3.0.0. Reasons in docs: global scope, name collisions, no private members, CSS emitted on every import. Sass ships a migrator tool.
- **Partials.** File starts with `_` = partial, not compiled alone. Underscore may be left out in `@use "code"`.
- **Index files.** Folder with `_index.scss` loads by folder name: `@use "foundation"`. Docs example: one entry file that `@forward`s the parts, so users get one public API.
- **Namespaces.** `@use "src/corners"` gives namespace `corners.`. Short member names are safe because of the namespace (no `num-type-` prefix needed). `as *` is "not recommended" for external libraries.
- **`@forward`.** Re-exports a module's members. Options: `show` / `hide` to limit the API, `as prefix-*` to add a prefix.
- **Private members.** Name starting with `-` or `_` is not part of the module API. Use for helper functions/variables in token files.
- **Configuration.** `$radius: 3px !default;` in a module, override once with `@use "x" with ($radius: 5px)`. Module keeps its configuration for the whole compile, `with` allowed once per module. `@forward ... with (...)` lets an upstream default be changed but still overridden downstream.
- **Maps.** Docs recommend quoted strings as map keys (avoid string/color type confusion, e.g. `red`). `sass:map` gives `get`, `set`, `merge`. `map.get($m, k1, k2)` walks nested maps (already used in `functions/_role-color.scss`).
- Sass docs give **no** naming rule for variables, mixins, or files. `.themed` suffix and `_themed` mixin names are our own convention, not Sass.

## Part 3: gap in our code vs. Sass

- All of `styles-next` uses `@import` (`styles.scss`, `custom-material/_index.scss`, `themes/_index.scss`, palettes). Deprecated, deprecation warnings already show in every compile.
- Only `@use '@angular/material' as mat` is a module. `role-color` and `foreground-color` are global functions only because of `@import`.
- Consequence for this plan: new token files should be written as modules (`@use`/`@forward`, namespaced). Mixing with `@import` works but must be bridged (see open decision 1).

## Part 4: proposed folders (first proposal; superseded by "Architecture" below: `_type-roles.scss`, `functions/_type.scss`, `custom-material/typography/`)

Same pattern as roles: values in `themes/fdpg-light/`, readers in `functions/`.

```
styles-next/
  themes/fdpg-light/
    _typography.scss   (exists; add our own levels next to the Material ones)
    _shape.scss        (new: radius scale)
    _sizing.scss       (new: only heights/widths that repeat; start small)
    _theme.scss        (add keys: shape, sizing)
  functions/
    _role-color.scss
    _foreground-background-color.scss
    _type-style.scss   (new: mixin type-style($theme, $level) -> font-size, line-height, weight, family)
    _shape.scss        (new: function shape($theme, $step) -> radius)
    _sizing.scss       (new: function size($theme, $name))
```

Proposed content (names are placeholders, like role names):
- **Typography levels:** `heading`, `body`, `body-strong`, `label`, `label-small`, `caption`. Each = size / line-height / weight. Fonts: one `$font-family-brand` (Titillium Web), one `$font-family-text` (Open Sans). Decide with design which is the real second family. `'Roboto'` is probably Material default and should go.
- **Shape scale:** `small 3px`, `medium 5px`, `large 10px`, `full 50%`. Maps today's `5px` (8x), `4px`, `3px`, `2px`, `10px`. `19px` and `25%` are checked one by one.
- **Sizing:** only names that repeat in 3+ files after a grep. Do not create a scale for one-off heights.
- **Output style:** `type-style` is a mixin (sets 3 to 4 properties). `shape` and `size` are functions (one value).
- **File naming:** drop `.themed` for new files (nothing in Sass needs it). Keep `.themed` in old files until step 4 of `PLAN.md` is done; rename in one separate commit.

## Decisions log (Shah, 2026-10-19)

| # | Decision | Status |
|---|---|---|
| 1 | New files are Sass modules (`@use` / `@forward`). Old tree migrates later with the Sass migrator, then compare CSS. | decided |
| 2 | Names: `<group>-<part>`, by role, one name everywhere (map key, mixin argument, CSS variable, prototype). Group `page-header`: `app-content-page-header-title`, `app-content-page-header-intro`, later `app-content-page-header-actions`. No adjectives like `strong` / `large`. | decided |
| 3 | Values are written as four longhand variables (family, weight, size, line), not the `font:` shorthand. | decided (option B) |
| 4 | Roles live central in `themes/fdpg-light/_type-roles.scss`; one group file per group in `custom-material/typography/`. | decided |
| 5 | `.scss` comments use `/* */`, never `//`. Each function / mixin has a "Parsed as:" line and one example with output. | decided |
| 6 | Prototype pages are opened in Shah's own browser. Claude never opens DevTools or a browser for him, only gives the `file://` link. | decided |
| 10 | Role names start with the area: `app-header` (C05, C06, C07), `side-menu` (C09), `app-content` (everything in the body). Shared atoms without an area have none: `button`. "page" is too generic. | decided; roles renamed to `app-content-page-header-*` (2026-10-19) |
| 11 | The portal link (C07) is not a separate look: it becomes `<button class="num-button blue">` and uses the role `button`. No own role. | decided |
| 12 | Role `button` = Titillium Web 16/24/600, for `.num-button` and every color variant (C20). | prototype only |
| 13 | Process rule: one place (area) of the app at a time. Current area: `app-header`. | decided |
| 14 | C05 and C06 (selects in the app header) get no role: no `font-*` rule of their own, Material already renders the target 16/24/400. Todo at step 7: find the origin of the 20/32/500 host (C05), delete dead `.user-button` (C06). | decided |
| 15 | Breadcrumbs (C04): roles `app-header-breadcrumb-{link,current,separator}`; HTML + CSS switched in one go (semantic nav/ol, routerLink, aria-current, aria-hidden separator, tooltip unchanged). Wired in `custom-material/_index.scss`. | done, to review in browser |
| 16 | Global link rule gets role `text-link` (16/24/400, letter-spacing `normal`) and blue colors: accent 600 default, underline on hover, no paler visited, focus ring (option B). Replaces `app-header-breadcrumb-link`; global rule in `_links.themed.scss` loses its `!important`. Prototype `typography-prototype-text-link.html`. | ported 2026-10-19 (role `text-link`, `_links.themed.scss` reads the variables, `!important` removed) |
| 7 | Process steps 4 to 6 (switch components, compile + diff, delete literals) are discussed later. | open, Shah |
| 8 | Which font families are real (drop `'Roboto'`? drop Open Sans?). See research Q1. | open |
| 9 | Letter-spacing 0.25px / 0.5px from Material: keep or `normal`. See research Q8. | open |

## Process per group (established)

**Rule: one place in the app at a time.** Finish every group of one area before the next area (`app-header` first, then `side-menu`, then `app-content`). Inside an area, take the components in screen order. Reason: one screen area is reviewed in one browser look, and shared roles (`button`, `app-header-select`) are found and named once. Started 2026-10-19 with `app-header`: C07 done, C05 + C06 prototyped, next in `app-header`: nothing else (language, user menu, portal link are all of it).

One iteration = one group (for example `page-header`), not one file. Reference run: page header.

1. **Read** the component notes `typography/Cxx-*.md` (now / next / source line per property).
2. **Prototype in plain CSS**: change only the roles of this group in `typography-prototype.css`.
3. **Prototype page**: create `typography-prototype-<group>.html` next to the CSS. It shows today vs next side by side with the real texts, plus a table (label, size / line, weight, what it replaces, other users today). Give Shah the link, do not open a browser:
   `file://wsl.localhost/Ubuntu/home/shah/dataportal-ui/src/styles-next/typography-prototype-<group>.html`
   (Windows form `\\wsl.localhost\Ubuntu\home\shah\dataportal-ui\src\styles-next\...`). The relative `<link>` to the CSS works over `file://`.
4. **Review with Shah**: what changes, what the labels are. Names are agreed here.
5. **Port to Sass** (this is where the pipeline below starts): add the roles to `_type-roles.scss`, create `typography/_<group>.themed.scss`, check with a scratch compile. Compile only, no component is touched yet.
6. **Diagram**: update `typography-flow.html` if the flow changes.
7. *Discuss later (Shah):* switch the component SCSS to the variables, compile and diff the CSS (only intended changes), delete the old literals.

Done so far: `text-link` (global `a` rule, ported), `app-header-breadcrumb-*` (C04, switched in the component), C05 + C06 (no role, nothing to port), `button` (C07 + C20, prototype `typography-prototype-button.html`, ported to Sass), `app-content-page-header-title` (24/32/600), `app-content-page-header-intro` (16/24/400, 70ch), `app-content-page-header-actions` (icon 16px; prototype only).

## Architecture (built for the page header)

Files and what each one does (full picture with data shown: `typography-flow.html`):

| File | Job | Contains numbers? |
|---|---|---|
| `themes/fdpg-light/_type-roles.scss` | map `$fdpg-light-type-roles`: role name to (family, weight, size, line) | yes, the only place |
| `themes/fdpg-light/_theme.scss` | puts the map into `$theme` under the key `type-roles` | no |
| `functions/_type.scss` | mixin `type.vars($theme, $name)`: looks `$name` up, writes `--font-<name>-family / -weight / -size / -line` | no |
| `custom-material/typography/_page-header.themed.scss` | mixin `page-header_themed($theme)`: one `@include type.vars(...)` per role of the group, plus non-text values (`70ch`, icon size) | no, except layout values |
| component `.scss` (later) | four lines `font-size: var(--font-app-content-page-header-title-size);` etc. | no |

Reading `type.vars($theme, 'app-content-page-header-title')`: take `'app-content-page-header-title'` from `$theme[type-roles]`, write its four values as variables with the same name as prefix. Result in the browser:
`--font-app-content-page-header-title-family: 'Titillium Web', sans-serif; ...-weight: 600; ...-size: 24px; ...-line: 32px;`

Wired 2026-10-19: `button_themed` and `page-header_themed` are included in `custom-material/_index.scss` (variables emitted; no component reads them yet). Earlier note, now outdated: `_index.scss` did not include `page-header_themed`. New files are modules (`@use`), the index still uses `@import`; the bridge is written together with step 7.

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

## Session notes 2026-10-19 (part 2): insights and next steps

Committed this session: `0edc30cd` (button role, `app-content-` prefix), `0e6b9b87` (breadcrumbs HTML + SCSS), `8ae4806b` (`text-link` role, link colors). Not committed: the docs, the prototype pages, `typography-prototype.css`, `angular.json`, `app.component.ts`.

### Insights (new)

1. **A global element rule hides the real source of a value.** The breadcrumb link looked "origin not found" because `base/_links.themed.scss` (`a:not(...)`, specificity 0,4,1, `!important` on weight, line height and letter-spacing) beat the component. The 0.5px letter-spacing on links came from there, not from Material. Lesson for process step 1: before prototyping a component, grep `custom-material/base/` and `general-styles` for element selectors (`a`, `h1` to `h5`, `button`, `input`, `label`). Still to audit: `base/_headings.themed.scss` (letter-spacing with `!important`, same pattern).
2. **Not every "Material" component is Material.** Breadcrumbs are plain `div` / `a` with one `matTooltip`. Read the template and the component `imports` before assuming. Correct the notes C04, C13, C24, C26, C27 the same way when they are reached.
3. **Look for an existing theme before inventing a role.** The portal link needed no role because `.num-button.blue` (button-color theme) already exists. Roles are named by function: area prefix (`app-header-`, `side-menu-`, `app-content-`) for area-bound looks, no prefix for shared ones (`button`, `text-link`).
4. **A role only pays off when the component writes the value itself.** C05 and C06 (Material renders the target value, no `font-*` rule) got no role. Rule of thumb: no literal in our SCSS = no role yet.
5. **Q8 splits in two.** Links: decided `normal` (the forced 0.5px is gone). Other text (body, table, buttons, page-header intro): still open, still inherited from Material. Close it before Material is removed.
6. **The typography track already changes colors.** `text-link` moved links from grey `#9ea9b3` (contrast about 2.3) to accent 600 (5.33). Colors that still fail and sit outside the track: breadcrumb current page and separator (secondary `#6a7483`, 4.49), green outline buttons. Collect them for the color pass (`PLAN.md` step 4).
7. **`type.vars` fails silently, and it matters more now.** `_links.themed.scss` reads `--font-text-link-*`. If `text-link_themed` were missing from `custom-material/_index.scss`, links would silently inherit instead of erroring. Discussion item 1 (check script) goes up in priority; do it before step 7 is repeated for the next groups.
8. **Only two groups are wired into `custom-material/_index.scss`:** `breadcrumbs_themed` and `text-link_themed`. `button_themed` and `page-header_themed` exist and compile, but are not included, so `--font-button-*` and `--font-app-content-page-header-*` are not emitted yet. Include them in the same commit that switches their components.
9. **Splitting commits across shared files:** save the full file, write the commit-1 version, commit, restore the full file, commit 2 (no `git add -p` needed). Pre-commit runs husky + prettier + `ng-lint-staged`; `i18n/*.json` and the breadcrumbs spec already fail `prettier --check` on the base commit (not ours). Do not run `prettier --write` on a whole folder; it reformats unrelated files (it touched the spec once).
10. **Prototype pages:** equal specificity + later rule wins. `.blue` before `.btn` made the blue button look outlined. Use compound selectors (`.btn.blue`) and tell Shah to hard-reload (`file://` cache).
11. **Dictation noise.** Prompts come from speech-to-text and garble names: "CO7 Namhella" is C07 portal-link, "HTTP proxy" is the HTML prototype, "Link Team CSS" is link theme CSS. Repeat my reading in one line before starting; ask when two readings cost real work.

### Check script (added 2026-10-19, part 3)
`npm run check:styles` runs `scripts/check-styles.cjs` (exit 0 ok, 1 problems, 2 Sass failed). Compiles `styles-next/styles.scss` once, then runs each check on the CSS and the source files. Run one check: `node scripts/check-styles.cjs <check-name>`.
Checks now:
- `vars-read-but-not-written`: a `var(--font-*)` in `src/app` or `custom-material` that no compiled CSS writes (insight 7, typo or missing include). Prefixes in `VAR_PREFIXES`; add `--color-`, `--num-color--` once their reads are clean (not checked yet, may report old leftovers).
- `mixins-defined-but-not-included`: a `*_themed` mixin that `custom-material/_index.scss` never `@include`s (insight 8).
Add a check: push `{ name, run(ctx) }` to `CHECKS`; `ctx.css` is the compiled CSS; `grep(dirs, ext, regex)` finds reads in files; return a list of problem strings.
Ideas for more checks: `font-family` names used in SCSS that are not in the role map or the Google Fonts link (decision 8); `var(--x)` with a fallback that hides a missing variable; hex / `rgba(` literals left in `custom-material/` (`PLAN.md` step 5); `@include` of a mixin name that exists in no file; stale specs (insight "Dead or broken code"). Run it before every commit that touches `styles-next`; not in CI yet.
Known limits: comments are scanned too (a commented `var(--font-x)` can false-alarm); dynamic names `var(--font-#{$name})` are skipped.

### How to verify a switch (metrics, 2026-10-19)
Per component, three levels. A switch is "wired" when 1 and 2 pass; 3 is the visual review.
1. **Static (script):** `npm run check:styles` is `ok`. Every `var(--font-...)` / `var(--app-content-...)` the component reads is written by the compiled CSS.
2. **Computed (DevTools, on the running app):** select the element, tab *Computed*, compare with the role in `themes/fdpg-light/_type-roles.scss`. Expected values for the page header:
   | Element | font-family | weight | size | line-height | other |
   |---|---|---|---|---|---|
   | `.header-font` (title) | Titillium Web | 600 | 24px | 32px | |
   | `.header-description` (intro) | Titillium Web | 400 | 16px | 24px | `max-width` = 70ch (about 650px at 16px) |
   | `.toggle-btn` (eye button) | | | 16px | 1 | |
   In the *Styles* pane the declaration must read `var(--font-app-content-page-header-title-size)`, not a literal. If the value is crossed out or shows the inherited value, the variable is missing (typo or not included).
3. **Visual:** the title is smaller (30 to 24px) and lighter (700 to 600); the intro is smaller and regular (18/600 to 16/400) and wraps at about 70 characters; colors unchanged.
Console shortcut for 2: `getComputedStyle($0).fontSize` with the element selected in the Elements panel (`$0`). Variable set: `getComputedStyle(document.body).getPropertyValue('--font-app-content-page-header-title-size')` must return `24px` (not empty).

### Dead or broken code found (delete or fix at step 7)
- `.user-button` in `custom-material/layout/_header.themed.scss:68` (used nowhere).
- `.portal-link-btn` rule (after C07 becomes `num-button blue`).
- `breadcrumbs.component.spec.ts`: imports `BreadcrumbsComponent` (class is `BreadcrumbComponent`), standalone component in `declarations`. Probably other specs are stale too: run `ng test` once and list the failures before step 7.
- C05: the 20/32/500 host size has no known origin (measure in DevTools).

### Next steps (order)
1. Commit the docs and prototype pages (separate commit, no code).
2. Shah checks in the browser: breadcrumbs (separator spacing, ellipsis, query-editor trail: `targetOf`), links (grey to blue, focus ring), blue button prototype.
3. **C07 switch (done 2026-10-19, waits for Shah's browser check; cancel button keeps weight 500, role says 600):** template `class="num-button blue"`, delete `.portal-link-btn`, include `button_themed` in the index, replace the `.num-button` literals (16px, 600) with `var(--font-button-*)`.
4. **Page header switch (done 2026-10-19, waits for Shah's browser check):** include `page-header_themed`, replace literals in `shared/components/header` and `header-description`.
5. `side-menu` (C09): prototype `typography-prototype-side-menu.html` exists, roles `side-menu-item` (400) and `side-menu-item-active` (600) proposed, waits for Shah's review. Remember the global-rule check (insight 1) first.
6. `app-content` groups in the order of "For discussion" item 5: section, search-bar, table, action-bar.
7. Close Q8 (non-link text) and decision 8 (font families).
8. ~~Build the var check script (insight 7)~~ done: `npm run check:styles`. Still: fix or delete stale specs, add more checks.
9. Audit global element rules in `base/` (insight 1) and move their type into roles one rule at a time (`headings` next).

## Not in scope

- Spacing/margin/padding tokens, shadows, z-index, breakpoints. Check after sizing if a pattern shows.
- Renaming CSS variables (`--num-color--*`).
