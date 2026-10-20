# Design tokens: session history

History, newest last. Moved out of `PLAN-design-tokens.md` 2026-10-20, text unchanged. Current status is in the NOW block of `PLAN-design-tokens.md`; where this file says otherwise, NOW wins.

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


## 2026-10-20 part 5: one font (Titillium Web), Roboto + Open Sans removed

Decision 8. Nothing committed. Undo all: `git checkout -- src/index.html src/styles-next/_font.scss src/styles-next/custom-material src/app src/assets/font` (restores deleted files too; `angular.json` and `app.component.ts` are not in this list, keep them).
Single file: `git checkout -- <path>`. See what changed: `git diff --stat`.

What was done:
- `src/index.html`: removed 2x `preconnect` (googleapis, gstatic) + the Open Sans stylesheet link.
- `src/styles-next/_font.scss`: removed 3 Roboto `@font-face` (300, 400, 500).
- `src/assets/font/roboto-*` (9 files: .ttf, .woff, .woff2 for light-300, regular-400, medium-500) deleted. `LICENSE.txt` kept.
- Deleted every line `font-family: 'Open Sans', sans-serif;` in 16 scss files: `_action-bar`, `_filter-chips` (2x each), `_header`, `_mat-tooltip` (was `!important`), `table`, `table-header` (2x), `table-body`, `text-cell`, `checkbox-cell`, `checkbox-text-cell`, `tree` (2x), `info-tooltip` (2x), `save-dataquery-modal`, `list-item-details-sections`, `bool-logic-switch`, `between-filter`.
- `criteria-stage.component.scss:32`: `var(--font-body, 'Open Sans', sans-serif)` -> `var(--font-body)`.
- `_mat-tooltip.themed.scss:19`: comment reworded.
- Left alone: `snackbar.component.scss:44` (system font stack, lists Roboto as one option), old tree `src/styles/` (deleted at the switch), `styles.scss:24` comment.

To check in browser: tables, tree, tooltips (mat + info), filter chips, action bar, header. They inherit Titillium from `body.mat-typography` now. Also check that no Material part falls back to Roboto.

Part 5b (same day): removed the last Roboto mentions in code. `styles.scss` comment line, `snackbar.component.scss` `.message-display` `font-family` (system stack with Roboto; now inherits Titillium), 3 Roboto `@font-face` in `typography-prototype-app.css` + its comment, Roboto note in `typography-prototype.css`. Undo: `git checkout -- <file>`. Docs (`*.md`) and old `src/styles/` still mention Roboto on purpose (history, deleted at switch).

## Part 6 (2026-10-20, later): section name and filter hint
What was done, in order:
1. Read the C18 notes and the CSS. `num-section-name` was an `<h3>` at 14/19/600 (tokens), with 4x `!important` to beat the global `h3` rule. Used 10 times.
2. Research check: "never skip a level". Page title is a real `<h1>`, so `<h3>` skipped `h2`.
3. Prototype `typography-prototype-section.html` (today vs next with neighbours). Shah could not judge from it, so the component was edited directly as a one-time exception (literals, `<h2>`), checked in the app, then ported properly.
4. Layout experiments in `search-filter-bar` / `search.component` (filters in one row with the heading, then beside the search bar). Heights never matched (search bar 44px, filters 42px, button 38px). Reverted with `git checkout`. Not wanted for now.
5. Port: role `app-content-section-name` (16/24/600, `letter-spacing: normal`), group file `_section-name.themed.scss`, component reads `--font-app-content-section-name-*`. `num-section-name` stays an `<h2>`.
6. Shah: the "Suche verfeinern:" text is a hint, not a heading. Both filter bars (`search-filter-bar`, `profile-search-bar`) now use `<p class="filter-heading__label">` with its own role `app-content-filter-hint` (group file `_filter-hint.themed.scss`), same values today.
7. `?` icon next to the hint vanished: the hint had `width: 100%` in a flex row. Removed the width.
8. Contrast check: `#5f6266` 6.13 on white, `#6a7483` 4.73 on white and 4.49 on the page grey. The h1 title (`#6a7483`) looked lighter than the hint (`#5f6266`) although bigger. Colors swapped: title `.header-font` now `--color-text-section`, hint `--color-text-secondary`. Breadcrumbs untouched.
9. Dead rule `.filter-heading__label` (no template used it) was removed, then reused for the hint.

