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
3. **Prototype page**: create `typography-prototype-<group>.html` next to the CSS. It shows today vs next side by side with the real texts, plus a table (label, size / line, weight, what it replaces, other users today). **Every reply that creates or changes a prototype ends with this link (Shah, 2026-10-19; I forgot it once)**, do not open a browser:
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

### Merge of 652 (2026-10-19): decisions and notes for later
- Page-header intro becomes an `<h2>` (from 652). Page title is still a `<p>`, so the page has an `<h2>` but no `<h1>`: heading order is broken until Q9 (title as `<h1>`) is decided. Do Q9 soon, so the intro `<h2>` has its `<h1>`.
- Intro values stay ours (role `app-content-page-header-intro`, 16/24/400, 24 / 16 = 1.5, already meets WCAG 1.4.12). 652's 18px / 550 are not taken. Its margin reset is kept (`margin: 1em 0`, `padding`, `border`, `letter-spacing` with `!important`, because the global `h2` rules are `!important`, see `base/_headings.themed.scss`).
- **Palette, fix later (Shah):** 652 adds `green-3` (`#839e00`) and `green-hover` (`rgba(163, 210, 128, 0.9)`) to the OLD palette file `src/styles/themes/colors/_fdpg-primary-theme.palette.scss`. They are not the appropriate choice (arbitrary values, outside the green ramp). Taken as is in the merge only so it resolves; fix in the palette view (`styles-next/palettes/`, green ramp, role `secondary`). Checkbox candidate: `secondary 700` (`PLAN-side-menu.md` risk 3).
- Old-tree conflicts (`_color-variables`, palette, side-menu SCSS, spec): take 652. `material.module.ts` stays deleted. Port to `styles-next`: see `PLAN-side-menu.md`.

## Session notes 2026-10-19 (part 3): where we stand, gains, next step

### Where we stand
Commits since `8ae4806b`: `1b918f0c` docs and prototypes, `5e1a28d9` `check:styles` script, `3a4af5d1` button + page-header groups wired into `_index.scss`, `3803dabb` page-header switch (title, intro, eye button), `3204184d` button switch + portal link as `num-button blue` + repeated CSS removed, `cbb63437` intro measure 100ch, `a4c407d8` header selects outlined, `de39ec82` merge of 652, `ebdefd93` plans, `107ae519` side menu + `.app-body` layout ported to `styles-next`.
- Typography groups switched in components: `text-link`, breadcrumbs, `button` (incl. portal link), `page-header`. Browser-checked by Shah: page header, buttons, header selects, side menu (ported, ok 2026-10-19).
- Side menu: structure and colors ported from 652 (`PLAN-side-menu.md` steps 1 to 5). Text sizes are still 652's (18/26/600, 16/24/500). Typography roles for the menu (steps 6 and 7) wait for decision 1.
- Not ported from 652 (components render without their new look until then): checkbox (step 8), 8 unwritten variables (`PLAN-side-menu.md` section 6).
- Uncommitted, deliberately: `angular.json` (build points at `styles-next`) and `src/app/app.component.ts` (swaps the `FDPGTheme` body class for the stylesheet name from the app config). Understand or drop `app.component.ts` before it is ever committed: if the config names another theme, the whole `.FDPGTheme { ... }` block (all variables) stops matching `<body>`.

### Next step
1. ~~Shah's browser check of the side menu~~ done 2026-10-19.
2. Decision 1 made 2026-10-19: option C (three roles: parent 600, child 400, active 600; all 16/24; px). Option D (level 3 at 14/20/400) is kept as an alternative with values in `PLAN-side-menu.md` section 7. Steps 6 and 7 are planned there for C. Then steps 6 and 7: roles `side-menu-item` and `side-menu-item-active`, new group file, include in `_index.scss`, drop the four `--font-size-nav*` tokens.
3. Then: Q9 (title as `<h1>`; the intro is now an `<h2>`), step 8 (checkbox), step 9 (the 8 variables, colors, green shade), the global element rule audit (`headings`), then the color pass (`PLAN.md` step 4) and the switch.

### Gains
- A second, repeatable check: `npm run check:styles` catches silent variable typos and unincluded mixins. With wider prefixes it found 8 variables the 652 merge needs (not visible by eye).
- A repeatable "no accidental change" proof: compile both trees (`npx sass --quiet ...`), cut the blocks of one component out of each CSS file with `awk`, `diff`. The side menu port differed in exactly one line (`white` vs `#ffffff`); the button cleanup removed exactly the intended lines. Use it for every port.
- Page header and buttons run on role variables end to end (Sass role, `type.vars`, include, component reads `var(--font-...)`), with a three-level verification table (script, DevTools computed, visual).
- Merge handled without losing work: dry run in a temporary `git worktree`, then `git merge --no-commit`, conflicts in the old tree resolved by taking 652 (that tree is deleted at the switch), real work moved to `styles-next` by a plan. A subagent wrote the port plan in about 2 minutes while the merge stayed open (it read refs with `git show`, never touched the working tree).

### Notes added later 2026-10-19
- **Checkbox is done later** (Shah). Side menu step 8 waits.
- **Why `styles-next` goes stale (confirmed by Shah):** investigate at some point why `styles-next` stays behind the old tree (branches edit only `src/styles/`), and how to stop it. See insight 1 below. Not started.
- Rule from Shah: when a decision needs a visual comparison, draft the prototype page as part of the plan without being asked.

### Insights (new, not reported before)
1. **Every branch that edits `src/styles/` makes `styles-next` stale.** 652 changed 8 old-tree style files and none of ours; the merge cost a whole port plan. Do the switch (`PLAN.md` step 5: point `angular.json` at `styles-next`, delete `src/styles/`) as soon as the menu, checkbox and the 8 variables are ported, and tell the team to stop editing `src/styles/` in the meantime (or to mirror edits).
2. **`ng serve` does not reload `angular.json`.** After changing `styles` restart the server and hard-reload. `ps` showed two `ng serve` processes: kill the stale one so you do not look at the wrong build.
3. **Theme variables live on `<body class="FDPGTheme">`, not on `:root`.** In DevTools select `<body>` (or a child, "Inherited from body") and use the console check in "How to verify a switch". The first "I cannot see it" in this session was exactly that.
4. **Prefix coverage of the check script.** `VAR_PREFIXES` is `--font-` and `--app-content-` only. Widening it to all families fails today (insight above); widen it per family when its variables are written. The check also scans comments (can false-alarm).
5. **Stale numbers in docs.** The intro measure is now `100ch` in `_page-header.themed.scss` (Shah's change), but the C14 note, the verification table and the comment in that file still say 70ch ("45-90 characters"). Fix the docs or revert the value.
6. **The cancel button keeps weight 500** (role `button` says 600); marked with a comment in `_button-cancel.themed.scss`. Decide with the button review.
7. **Duplicate class name:** both the language select and the user menu use `class="language-select"`. A rename (`header-select`) would remove the shared-name coupling that my outline rule relies on; do it with the `app-header-select` role.
8. **Global `h2` rules are `!important`** (`base/_headings.themed.scss`, letter-spacing; margin). The intro `<h2>` needed `!important` resets to undo them. Audit `_headings` next (process insight 1) and scope it, so components stop fighting it.
9. **Prettier in pre-commit** rewrites the prototype HTML pages on commit. Harmless, but the diff of the first commit shows reformatting.
10. **Dictation noise, new examples:** "pagella teams" = page-header, "6.52" = 652, "feed/editor" = `feat/editor-back-to-search-origin`, "index.css" = `custom-material/_index.scss`. Keep repeating my reading before work that is hard to undo (merges).
11. **Stash `stash@{0}`** ("On develop: timeout-component") is not ours; leave it alone.

## Session notes 2026-10-20 (part 4): side menu roles, where we stand, insights

### Where we stand
- Commits: `eb533865` side menu type roles, `15daca71` docs (decision C, option D, nested-nav research). Working tree clean except the deliberate `angular.json` and `app.component.ts` (see part 3).
- Typography groups switched in components and browser-checked by Shah: `text-link`, breadcrumbs, `button`, `page-header`, **`side-menu`** (new). Side menu checked 2026-10-20: "looks good".
- Side menu roles (option C, px): `side-menu-parent-item` 16/24/600 (level 1), `side-menu-child-item` 16/24/400 (levels 2 and 3 and the group label), `side-menu-child-item-active` 16/24/600 (open page, levels 2 and 3). Temporary `--font-size-nav*` tokens deleted from `styles-next`. Details and option D (level 3 at 14/20/400, role `side-menu-grandchild-item`): `PLAN-side-menu.md` section 7.
- `PLAN-side-menu.md`: steps 1 to 7 done (1 to 5 on 2026-10-19, 6 and 7 on 2026-10-20). Open: step 8 checkbox (Shah: later), step 9 (6 unwritten variables, green shade).

### What we did this session
1. Plan status, then `PLAN-side-menu.md` steps 6 and 7 planned before building (Shah's rule: plan first).
2. Browser check of the ported side menu: done and ticked.
3. Prototype of the menu text: first as mock-ups (wrong), then rebuilt from the real markup and compiled CSS with four options A to D. Checked in Chrome DevTools against Shah's screenshot.
4. Usability: our own research file had nothing on nested nav; web search added it (Carbon, Qld, Salt: weight marks the level, max 3 levels). Written to `research-usability-typography.md`.
5. Decision: option C. Names: `side-menu-parent-item`, `side-menu-child-item`, `side-menu-child-item-active`.
6. Built: 3 roles, group file `typography/_side-menu.themed.scss` (mixin `side-menu_themed`), include, menu SCSS switched, tokens removed. Compile diff before/after showed only the intended lines.
7. Noted for later: checkbox later; investigate why `styles-next` goes stale behind the old tree (insight 1 of part 3).

### Next step
Pick one (Shah decides): Q9 page title as `<h1>` (HTML change; the intro is already an `<h2>`); step 9 of the side-menu plan (6 variables, role decisions, then widen `VAR_PREFIXES`); `headings` audit (global `h2` rules with `!important`); then the color pass (`PLAN.md` step 4) and the switch. Recommended order: Q9 and `headings` audit together (same files), then step 9, then colors, then the switch.

### Found 2026-10-20: page title h1 (answers Q9)
- The h1 already exists: commit `6d520dff` (branch 652) changed `<p class="header-font">` to `<div class="header-font"><h1 class="header-title">` in the shared `num-header` component (14 uses). It is the only `<h1>` in `src/app` (plus `playground.component.ts`, a dev page). So Q9 is done for every page that uses `num-header`; open: modals that use `num-header` get a second h1 (download-crtdl, validation-modal, save-dataquery-modal, result-detail-modal) and any page without `num-header`.
- `.header-font .header-title` (reset: margin, padding, border, letter-spacing `!important`, `font: inherit`) exists only because the global `.FDPGTheme h1` rule (`_headings.themed.scss`: margin 0 0 20px, letter-spacing -0.63px, both `!important`) would hit it. That global h1 rule now serves no other h1. **Cleanup done 2026-10-20 (Shah: yes):** delete the global h1 rule, put the four `var(--font-app-content-page-header-title-*)` lines and `margin: 0` on `.header-title` itself, drop the `!important`s and the unneeded padding/border resets. Material's `.mat-typography h1` (specificity 0,1,1) still loses to a component class (0,2,0).
  Result: global h1 rule deleted from `_headings.themed.scss`; `.header-title` carries the four font variables, `letter-spacing: inherit` (unchanged look) and `margin: 0`, no `!important`; `.header-font` keeps color, flex, gap. Waits for Shah's browser check (Computed: Titillium Web, 24px, 600, line 32px; title position and spacing unchanged).
- DevTools showed the inherited `.header-font` font lines crossed out because the h1 has `font: inherit`; the values still apply (check Computed).

### Insights (new)
**What to improve**
1. **A rule in the plan is not a rule at reply time.** The "give Shah the link to the prototype" rule was written in the plan (process step 3) and I still forgot it. End every reply that touches a prototype with a self-check: link given? Commit asked? Questions listed? Do not rely on having read the plan.
2. **Take the "today" column from the real app, never from docs.** The first prototype said "today 16/24/600" (a pre-652 state) with mock colors, borders and English text; Shah could not judge it. Build prototypes from the real markup and the compiled CSS, with the real labels (`assets/i18n/de.json`) and layout (`.app-body`, `.sidenav`). Verify with a DevTools screenshot against Shah's screenshot before reporting. Cost: two rounds.
3. **Name roles by position and state, and show a "role covers which level" table at the start.** My `side-menu-item` meant "child" but sounded generic; "active" was unclear. Names that worked: parent / child by structure, `-active` as a state suffix on the child. Ask for names with the table, not after the build.
4. **Research can be stale against the code.** `research-usability-typography.md` was measured on a flat menu (4 items); the nested menu came with the 652 merge. After a merge that changes a component, re-check the research rows for it. The file now has a cross-check bullet.
5. **The prototype generator lives only in the scratchpad** (`gen.cjs`, outside the repo) and the prototype CSS is a snapshot. It cannot be rebuilt after a session. If more prototypes are needed: put the generator into `scripts/` or build the prototype by hand from the snapshot.
6. **`check:styles` guards one direction only** (variable read but never written). Written but never read is not checked (for example a typo'd extra variable in a group mixin). A second check is cheap.
7. **Group mixin extras:** extra values in a group are extra custom properties next to the `type.vars` includes. This is documented only in the answer to Shah, not in the file; add one comment line to `_page-header.themed.scss` and `_side-menu.themed.scss` if it comes up again.

**What worked (keep)**
8. **Copy `before.css` before editing, diff after.** It proved again that the switch changed exactly the font lines. Do it for every port.
9. **Options as a table plus one recommendation, with the rejected option kept in the plan with its values** (option D). Shah could change his mind later at no cost.
10. **Chrome DevTools screenshot to verify own work** (`new_page`, `resize_page`, `take_screenshot`, then Read the PNG). Quick and caught that D's pill and rails line up.
11. **Searching only after the local file failed:** read the repo research first, search second.

**What I learned**
12. `.num-nav-link--child` is also a `.num-nav-link`: the child rule must set `font-family` too, otherwise the child inherits the parent role's variable and the two roles are coupled by accident.
13. `fa-icon` is `em`-sized: changing the link font size changes the icon size (18px text to 16px shrinks the parent icons by about 2px). Every future size change of a text container with icons has this side effect.
14. Weight, not size, is the common way to mark nesting levels (Carbon: 14/600 parent, 14/400 child). Our own ladder (12/14/16/24, no 18) agrees; the 652 parent at 18/26 had no support.
15. **Dictation noise, new examples:** "route" = roles, "court definition" = Kohortendefinition, "nested charts" = nested menus, "F tools" = DevTools, "StyleNext" = `styles-next`, "pagella" = page-header. Repeat the reading before irreversible work.
16. Prettier in the pre-commit hook reformats the prototype HTML on every commit that touches it. Harmless.

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
5. `side-menu` (C09): prototype `typography-prototype-side-menu.html` exists, roles `side-menu-parent-item` (600), `side-menu-child-item` (400), `side-menu-child-item-active` (600), option C chosen 2026-10-19 (D = level 3 at 14/20 kept as an alternative). Remember the global-rule check (insight 1) first.
6. `app-content` groups in the order of "For discussion" item 5: section, search-bar, table, action-bar.
7. Close Q8 (non-link text) and decision 8 (font families).
8. ~~Build the var check script (insight 7)~~ done: `npm run check:styles`. Still: fix or delete stale specs, add more checks.
9. Audit global element rules in `base/` (insight 1) and move their type into roles one rule at a time (`headings` next).

## Not in scope

- Spacing/margin/padding tokens, shadows, z-index, breakpoints. Check after sizing if a pattern shows.
- Renaming CSS variables (`--num-color--*`).
