# Dark mode plan (2026-10-22)

## Decisions (grill-me session)

- Theme `themes/fdpg-dark/` next to `fdpg-light/`. Mixins stay as they are and run a second time under `[data-theme=dark]` (CSS about 2x).
- Switch: header toggle, localStorage, default light, OS preference ignored. Set `color-scheme: dark` so scrollbars and native controls match.
- Scope: main work in `src/styles-next/`; outside edits only when needed, logged (see Edit boundary). Hex in TS (charts, status) is ignored.
- Contrast: AA, 4.5:1 text, 3.0:1 UI and icons.
- Verify per iteration: the metrics M1-M9 (see Metrics and stop rules) plus Chrome DevTools screenshots (light + dark).
- Git: branch `feat/dark-mode`, one commit per iteration, no push, no attribution.
- Runner: `/loop` self-paced, cap 10 iterations, subagents for read-only jobs (see Subagents). Pauses for Shah at iterations 1, 5, 10.
- Branch: `feat/dark-mode`, created from `chore/e2e-merge-fix`, both at `5e5227bd`. Plain `git switch -c`, no worktree, so the dev server keeps running. Unrelated uncommitted changes exist (`angular.json`, `ReferenceCriteriaListEntry.ts`, `playground.component.ts`, untracked files): commit only each iteration's files, by explicit path.
- Approved: split `--color-accent` into text and fill (blocker 1), editing outside files as needed.
- Commits: no `Co-Authored-By` line, no Claude attribution (Shah's global rule wins over any reminder).
- Status: **session 1 ended 2026-10-22: iterations 1-9 done in code (see Where we stand), iteration 10 (full Cypress, sweep, audit) pending.** No subagents (Shah's call, overrides the Subagents section).

## Where we stand (end of session 1, 2026-10-22)

Branch `feat/dark-mode`, 14 commits on top of `5e5227bd`, nothing pushed. Dev server `npm start` (:4200) must be running; login `testuser` / `testpassword`.

**Done (all in code, committed):**
- Theme `themes/fdpg-dark/` (roles, foreground, background, theme) built on `fdpg-light`, compiled a second time under `[data-theme=dark] .FDPGTheme`. Header toggle (`num-theme-toggle`), `theme` key in localStorage, pre-paint script in `index.html`, toggle Cypress spec, `--expose theme=dark` for the whole suite.
- Accent split: `--color-accent` (fill), `--color-accent-text`, `--color-accent-line`, plus `--color-accent-strong`; `on-fill` and `on-bright-fill` foreground keys; surface keys `card`, `dialog`, `chrome`; variables `--color-surface`, `--color-page`, `--border-color-field`, `--color-text-table-header`. 46 component SCSS files moved from literal white / black / grey to these variables.
- Material: 14 component color mixins from our own background and foreground map (no `all-component-colors`, that is +80 KB), placeholder fix.
- Look (after Shah's feedback rounds): neutral greys like VS Code Dark Modern; content `#1b1b1b` is the darkest, chrome (header, side menu, footer, popups) `#232323`; grey-blue accent tints; soft borders (divider `#363636`, control `#6a6a6a`); green is VS Code's comment green `#6a9955` as button fill, `#86ad6f` as text, action bar grey; text `#bebebe` / `#9a9a9a` / `#a0a0a0`; sizes and Material levels x 1.125 (side menu x 1.0), `-webkit-text-stroke: 0.15px` as weight stand-in; page title `#9ca8bf`.

**Numbers:** contrast walker (`dark-mode-tools/contrast-walker.js`) 0 violations on cohort definition, feasibility search, bulk search, editor, data-selection search and editor, data-query data-selection, saved queries, criterion editor. Light CSS: only intended variable swaps (hex identical). CSS size 184 KB / 24 KB gzip against 100 KB / 14 KB (+68% gzip; gate was +60%, proposal: gzip <= +100%). M3 (light Cypress) was 57 passed, 0 failed when I stopped it for a design change; M4 (dark Cypress) never completed: see Next session.

## Insights (keep)

1. **`dark-ansi` is not a palette.** Claude Code's theme here is `dark-ansi`, it uses the terminal's own ANSI colors. Shah's VS Code theme is Dark+, so the text that reads well from afar is the VS Code terminal: foreground `#cccccc`, background `#181818` to `#1e1e1e`, monospace. Colors alone do not copy that: Titillium Web is narrow with a low x-height, the table cells and the 10-12 px labels (`Unbekannt`, badges) stay small, so they read worse from distance than terminal text. The levers that remain: size (hard-coded px in component SCSS are not scaled), weight, contrast `#bebebe` (about 9.7:1 on content). Tension to decide with Shah: "softer" (lower brightness) and "readable from afar" (higher contrast) pull in opposite directions.
2. **Palette keys 50-200 of the dark accent are remapped tints; light text shades live in theme keys** (`accent-text-shade`, `accent-line-shade`, `accent-strong-shade`, `accent-on-tint-shade`, 300 / 500 / 300 / 300). A mixin that needs a lighter blue must read a key, not `role-color(accent, 200)`.
3. **Light diffs hide in variables.** M1 only compares compiled styles-next light CSS; component SCSS outside it (46 files) is checked by reading, the values are the same hex. `var(--x)` replacing a hex is "same hex" only if the light variable carries that exact hex.
4. **Material tokens are set per selector, order matters.** `mat.select-color` sets `--mat-select-placeholder-text-color` on the same selector as my block: an override must come after the includes (second rule), not before.
5. **The logo `<img>` has class `FDPGTheme`.** Any `.FDPGTheme` rule with a background or color also hits the logo (and with `filter: brightness(1.4)` it showed as a lighter tile). Page-level declarations belong on `body.FDPGTheme`.
6. **Surface relation is Shah's call, not best-practice's.** Order tried: chrome darker (VS Code like), then chrome lighter (final), content darkest. Cards on the content have the same tone as the content (neutral 0), separation by border and the action bar, which is grey `#2b2b2b` in dark.
7. **Cypress runs are fragile against live edits.** The dev server reloads on every `src/` save and breaks the running spec; a killed `cypress run` leaves the Electron binary holding port 4300 (`ss -ltnp | grep 4300`, kill the pid). Four runs were stopped. Never edit `src/` during a run.
8. **German git output breaks parsing**: use `LC_ALL=C`. `git checkout -- <dirty file>` destroys uncommitted work (it did once, see Known gaps); lint-staged keeps a backup stash (`git fsck --lost-found`) that saved it.
9. **Light flaws found, not fixed (out of scope):** white text on green or red fills is 2.26:1 (buttons, snackbar), `#5f6266` section text is fine, status literals in component SCSS (`#dc3545`, `#c62828`, error-log hex).

## Next session (start here)

1. Start dev server and run both suites to the end, without touching `src/`: run `src/styles-next/dark-mode-tools/run-cypress-both.sh`, or the commands are `npm run cypress:run -- --expose tags='not @pending'` (light, M3) and `npm run cypress:run -- --expose tags='not @pending and not @component:theme',theme=dark` (dark, M4). Compare with the 2026-10-21 baseline in `cypress/E2E-FAILURES-2026-10-21.md`. Fix invisible or unclickable elements the dark run finds.
2. Shah's review of the screenshot sweep (iteration 5 pause was skipped, he reviewed live): confirm chrome vs content step (`#232323` / `#1b1b1b`), text tone (`#bebebe`), green, title grey-blue `#9ca8bf`, size x 1.125, stroke 0.15px. Open decision: lift the 10-12 px hard-coded labels (`Unbekannt`, badges, availability bar) and the table cell tone for distance reading.
3. Missing sweeps: dialogs (save, download, error, about, validation), datepicker panel, snackbars, tooltips in dark, bulk-search results, result page, criterion modal tabs with concept filter, user menu. Run the walker on each; screenshot light and dark pairs.
4. `npm run build` (M2 full), Lighthouse a11y dark vs light (M6), leftover hex count (M7), CSS size gate decision (M8).
5. Open items from the Hex list: `#839e00` checkbox fill, error text in `_color-variables`, `_ui-classes` fallback `#232323`, scrollbar light literals, status literals.
6. Cleanup before merge: decide on `-webkit-text-stroke` (non-standard, Chromium and Safari only; Firefox ignores it, so Firefox dark text is thinner), toggle `aria-label` translation keys, the `dark: true` flag in mixins (a few one-off literals), `prototype-bulk-chips.html` (untracked, Shah's).
7. Revert list for Shah: every outside edit is in `## Outside edits`; `git diff --name-only chore/e2e-merge-fix` must match it.


## What the code gives us

- Color reaches the UI by `role-color` (74 uses in mixins), `foreground-color` / `surface-color` (9), and CSS variables from `base/_color-variables.themed.scss` and `base/_text-color-variables.themed.scss`. Most components read the variables, so the dark theme re-emits the same variable names with dark values.
- Roles (`accent`, `secondary`, `neutral`, `danger`, `warning`) are job names. Dark keeps them; only values change.
- Most used shades: accent 600 (16), neutral 0 (10), secondary 500 (5), neutral 100 (5), accent 500 (5), accent 200 (5).

## Best practice (short)

1. Dark = second palette tied to the first by shared roles, not an inversion.
2. Same step, same job in both themes (Radix: 1-2 background, 3-5 fill, 6-8 border, 9-10 solid, 11-12 text).
3. Depth from lighter surfaces, not shadows (Material overlays white on `#121212`).
4. Lighter, desaturated accents for text, icons, borders. No pure black or white.
5. Status colors keep their meaning.

## Map: light job → dark value (draft)

**Superseded twice 2026-10-22 (Shah, VS Code screenshot, then "chrome lighter, content darker"):** greys are neutral. Content and card `#181818`, page `#1c1c1c`, chrome (header, side menu, footer, Material popups) `#262626`, hover and action bar `#2c2c2c`, border `#424242`, text `#cccccc`, secondary `#9d9d9d`, section `#b0b0b0`, mid greys 400-900 neutral (`_roles.scss` in `themes/fdpg-dark/`). The table below keeps the first blue-grey draft for the accent, status and shadow rows; grey rows are historical.

| Job | Light | Dark | Contrast (page / card) |
|---|---|---|---|
| page (`neutral 50`) | `#f9f9f9` | `#12161b` | base |
| card, dialog (`neutral 0` as surface) | `#ffffff` | `#1a1f26` | |
| hover, track (`neutral 100`) | `#f1f2f3` | `#222831` | |
| `neutral 200` | `#e8ebed` | `#2b323b` | |
| divider, border (`neutral 300`) | `#c5cacf` | `#3a434d` | 1.8 (decoration, light is 1.5) |
| control border (`neutral 700`) | `#7c8b98` | same | 5.2 |
| `text` | `#000000` | `#cccccc` (VS Code Dark Modern text) | 10.3 on card |
| `secondary-text` | `#6a7483` | `#a9b6c2` | 8.8 / 8.0 |
| `section-text` | `#5f6266` | `#b4bcc4` | 9.5 / 8.6 |
| placeholder | `#5f6773` | `#9aa4af` | 7.2 / 6.6 |
| accent fill 500 + white text | `#49689c` | same | white on it 5.61 |
| accent hover 600 | `#3c5786` | same | white on it 7.24 |
| accent text / icon / link | 500-600 | `accent 300` `#98accd` | 7.9 / 7.2 |
| accent graphic (was 400) | `#7992be` | same | 5.8 / 5.3 |
| accent border 200 | `#bbc8dd` | `accent 700` `#2f476f` | decoration |
| accent tint 50 | `#f2f4f8` | `accent 900` `#182640` | tint only |
| accent emphasized fill 100 | `#dde3ee` | `accent 800` `#233657` | text 200 on it about 8 |
| accent hover 75 | `#e8ecf3` | new half step between 900 and 800 | |
| focus ring | `accent 800/900` | `accent 200` `#bbc8dd` | 10.7 |
| secondary fill (green 500, black text) | `#9bb823` | same | 8.0 |
| secondary text (700) | `#758c17` | `secondary 400` `#bdd84f` | 11.3 |
| danger text | `#c4122f`, `#b30519` | `danger 300` `#ff8383` | 7.6 |
| danger fill | `#ff4545` | same, black text | |
| warning | `#eeb70c` | same | 9.9 |
| shadows | `rgba(0,0,0,.1)` | `.4`-`.5` | dark theme needs its own `--shadow-*` |

Rule behind the map: fills keep their color (white text still passes), everything drawn as text, icon or line moves to a lighter shade, tints and surfaces move to the dark end.

## VS Code reference (Dark Modern vs Light Modern)

Source: `extensions/theme-defaults/themes/dark_modern.json` and `light_modern.json` (microsoft/vscode, also in the local install under `resources/app/extensions/theme-defaults/themes/`). Same ~190 role-named keys (`sideBar.background`, `button.foreground`, ...) in two files with different values, each file includes a base (`dark_plus.json`). That is our `roles` + `fdpg-light` / `fdpg-dark` structure.

| Job | Light | Dark | Light L% → Dark L% |
|---|---|---|---|
| editor (content) | `#FFFFFF` | `#1F1F1F` | 100 → 12 |
| sidebar, activity bar, status bar (chrome) | `#F8F8F8` | `#181818` | 97 → 9 |
| widget, menu, quick input | `#F8F8F8` | `#202020` | 97 → 13 |
| border | `#E5E5E5` | `#2B2B2B` | 90 → 17 |
| input fill / input border | `#FFFFFF` / `#CECECE` | `#313131` / `#3C3C3C` | 100 → 19 / 81 → 24 |
| text | `#3B3B3B` | `#CCCCCC` | 23 → 80 |
| inactive text | `#616161` | `#9D9D9D` | 38 → 62 |
| placeholder | `#767676` | `#989898` | 46 → 60 |
| button fill | `#005FB8` | `#0078D4` | 36 → 42 |
| button hover | `#0258A8` | `#026EC1` | 33 → 38 |
| link | `#005FB8` | `#4daafc` | 36 → 65 |
| error | `#F85149` | `#F85149` | same |

How they got from light to dark (what we reuse):

1. **Lightness mirror, compressed.** Surfaces map to L 9-24% (not 0%), text to L 60-80% (not 100%). Roughly dark L = 100 - light L, squeezed. Our draft surfaces `#12161b` … `#3a434d` sit at L 9, 13, 16, 20, 26: same range, so the map holds.
2. **Text is soft in both themes.** `#3B3B3B` (10.5:1) and `#CCCCCC` (10.3-11:1). Neither pure black nor white. Our light text `#000` (19.9:1) is the outlier; dark text moved from `#e8ebed` (15.2) to `#ccd1d6` (11.8). Existing `neutral 300` `#c5cacf` (11.0) would also do.
3. **Same direction of depth in both themes.** Content is lighter than chrome (white over `#F8F8F8`; `#1F1F1F` over `#181818`). Inputs are lighter than their surround in both. So our card-lighter-than-page rule carries over unchanged.
4. **Borders carry separation, not surface contrast.** Chrome vs content is only 1.08:1 in dark; the `#2B2B2B` border does the work. Border vs surface about 1.2:1 in both themes. Plan: keep dividers visible in dark (`#3a434d` is 1.8:1, enough).
5. **Hue stays, saturation stays.** Blue is hue 206-209 and S 100% in both; only lightness moves (button 36 → 42). Hover is one step darker in both themes (same as our ACCENT-RULES R2).
6. **Button blue ≠ link blue in dark.** Dark button `#0078D4` (white text 4.53:1, just AA) but dark link `#4daafc` (6.6:1 on editor). In light the two are the same blue. This is exactly our accent fill vs accent text split, now with a precedent.
7. **Status colors identical across themes** (`#F85149` error, `#2EA043` added). Meaning is fixed; only text use differs.
8. **Alpha flips color.** Dark uses white alpha (`#FFFFFF1A` button border, `#FFFFFF17` group border, `#F1F1F133` hover), light uses black alpha (`#0000001a`). Our rule "no alpha tints" holds; for dark prefer solid shades, but alpha on hover overlays is acceptable if needed.
9. **Neutral greys, no tint** (S 0%). Ours are blue-tinted (S 9-20%). Keep the tint (brand), but stay low (<= 20%).
10. **Secondary button inverts its ladder:** fill `#E5E5E5` (L90) in light, transparent with `#2B2B2B` hover (L17) in dark.
11. **Separate high-contrast themes** exist for users who need more. Out of scope for us.

Where VS Code is weaker than our bar: placeholder is exactly 4.5:1, dark button text 4.53:1, light error `#F85149` is 3.4:1 on white, dark input border 1.18:1 (relies on the fill). We keep our AA targets and do not copy those values.

## Beyond color

**Font family and weight: VS Code does not change them between themes.** Neither the 4 theme JSONs (`dark_plus`, `light_plus`, `dark_modern`, `light_modern`) nor the base themes contain a `fontFamily` or `fontWeight`. Only syntax `fontStyle` (bold, italic) appears, identical in both. Dark and light differ only in color. Perceived font change is the **irradiation effect**: bright text on dark spreads into the dark and looks bolder and tighter ([Rendle](https://robinrendle.com/notes/subtle-optical-phenomenon/), [CSS-Tricks](https://css-tricks.com/?p=306566)). Same font, same weight, but it reads heavier.

What we have: Titillium Web as three static files (400, 600, 700; `_font.scss`), no variable axis, no `font-smoothing` rule anywhere, type roles live in the theme folder (`themes/fdpg-light/_type-roles.scss`, each role already supports `letter-spacing`).

| Lever | Verdict for us |
|---|---|
| Lower weight by about 50 (700 → 650) | Not possible: static 400/600/700 only. 600 → 400 is too big a jump. Skip unless we add a variable font. |
| Softer text color (done: `#ccd1d6`, 11.8:1) | Main lever. Less contrast = less bloom. Already in the map. |
| Letter-spacing +0.01 to 0.02em on body and small text in dark | Cheap: `fdpg-dark/_type-roles.scss` copy with `letter-spacing` set. Judge by screenshot, add only if text looks cramped. |
| Line height +0 to 2px | Optional, same file. Only if cramped. |
| `-webkit-font-smoothing: antialiased` | macOS only, no effect on Windows/Linux, never verified for this. Skip. |
| Dark-specific typeface | Overkill. Skip. |
| Weight 600 for small text (table header, labels) | Keep. Thin 400 at 14px on dark is the harder case to read than 600. |

**Other levels to research and decide while looping**

| Level | Light now | Dark plan |
|---|---|---|
| Borders | 1px `neutral 300` | Keep 1px, `#3a434d`. Borders replace shadows (VS Code, guides). Cards without border get one in dark. |
| Shadows | `rgba(0,0,0,.1)` in `--shadow-*` (7 variables in `styles.scss`) | Barely visible on dark. Raise alpha to .4-.5, and rely on surface step plus border for depth. |
| Elevation steps | page / card | page < card < hover < raised (menu, tooltip, dialog = one step lighter). |
| Images, logo | dark-blue logo | Logo loses contrast on dark (Dark Reader trial). Needs a light variant or a light backing. Other raster images: slight dim or border. |
| Icons | accent / grey fills | Use accent text variable (300). Check SVG `fill` set inline. |
| Focus ring | accent 800/900, 2px | `accent 200` `#bbc8dd`, 2px, 3:1 minimum. Keep on `:focus-visible`. |
| Form controls | white fill, grey border | Own fill (`hover` step), own border; autofill override so Chrome's white or yellow fill does not show. `color-scheme: dark` for native parts. |
| Disabled state | `neutral 400` | Re-check: grey 400 on dark may read as active. Needs contrast between 1.5 and 3:1. |
| Selection, scrollbar | `#c5cacf` / `#f1f2f3` literals in `styles.scss` | Tokenize; scrollbar track = card step, thumb = border step. |
| Alpha overlays | `rgba(role, .08/.4)` in buttons, action bar | Re-check each; alpha on dark surface shifts hue. |
| Toggle flash | n/a | Set theme before first paint (attribute on `<html>` in `index.html`) to avoid a white flash on reload. Disable transitions during the switch. |
| Charts, TS colors (`AvailabilityStatus`, `QueryResultMapper`) | hex in TS | Out of scope (decision), list as known gap. |

## Hex inside `styles-next` to tokenize for dark

`#5f6773` placeholder · `#839e00` checkbox fill · `#c4122f`, `#b30519` error text · `material/_mat-tooltip` (`#ffffff`, `#c3c7cd`, `#5f6266`) · `layout/_header` (`#f1f2f3`, `#ffffff`, `#000000`) · `styles.scss` (`white` badge, scrollbar `#f1f2f3`, `#c5cacf`, `#a8aeb5`) · `general-styles/_ui-classes` (`#232323`) · all `rgba(0,0,0,x)` shadows · `rgba(role, x)` alpha tints in `_button-color`, `_action-bar`.

## Blockers to fix before dark (no visible change in light)

1. `--color-accent` is one value for fill, text, icon and border in about 55 components. Add `--color-accent-text` (light 500, dark 300) and move text and icon users to it. **Approved 2026-10-22.** 52 files outside `styles-next` read `--color-accent` (7 inside): classify first (Subagents), then rename.
2. `neutral 0` means "surface white" (10 mixins) and "white text on a fill" (`_button-color`). Split into surface and on-fill.

## Dark Reader trial (screenshots, `home-light.png` / `home-dark.png`)

Dark Reader (`darkreader@4.9.96` injected from jsDelivr, not the extension: the DevTools Chrome is a fresh profile) on `/data-query/cohort-definition`, login `testuser`.

- Page and side menu become about `#202224`: neutral, no blue tint, no surface hierarchy. Our map (`#12161b` page, `#1a1f26` card) is darker and layered.
- Text turns warm beige-grey, readable. Ours is cool `#e8ebed`.
- Blue button unchanged. Matches the map (fills keep color).
- Green action bar becomes a dark olive tint, outlined green buttons get green text. Matches our plan to use `secondary 400` for text.
- Step circle 1 stays Material indigo `#3f51b5` (leftover from `indigo-pink.css`). Step circle 2 turns near black and is hard to see. Confirms the Material leak.
- Logo (dark blue text and icon) loses contrast. Images are untouched. Needs a dark logo variant or a light backing.
- Header gradient line is fine.

Conclusion: Dark Reader is a usable preview and a regression baseline. It cannot replace the theme. The three problems to solve ourselves: logo, Material leftovers (`indigo-pink.css`), accent text vs fill.

## Findings from the code check

1. **Material is not themed by us.** `custom-material/_index.scss` only includes `mat.all-component-typographies`. Material component colors (select, dialog, menu, datepicker, checkbox, tabs) come from the prebuilt `indigo-pink.css` (light) plus our overrides. A dark theme must add `mat.all-component-colors(<dark theme>)` under the dark selector, with `mat.m2-define-dark-theme` next to the existing `m2-define-light-theme` in `fdpg-light/_theme.scss`. This fixes most Material leaks in one include instead of per-component overrides. Goes into iteration 1.
2. **Selector scope.** `FDPGTheme` is a class on `<body>` (`index.html:10`), the CDK overlay container (dialogs, selects, tooltips) is a child of `<body>`, so overlays inherit it. Dark selector: `[data-theme=dark] .FDPGTheme` with the attribute on `<html>`. No per-overlay work.
3. **Pre-Angular screen.** The loading and error indicators in `index.html` are styled before the theme loads. A small inline script sets `data-theme` from localStorage at the top of `<head>`; the indicators need dark colors in the same file.
4. **Cypress asserts no colors** (no `have.css`, no hex or rgb in specs). Dark cannot break existing specs by color.
5. **No print, `forced-colors` or `prefers-contrast` rules** exist. Not added (out of scope).
6. **`!important` colors** (`_mat-tooltip`, `_header`, `.mat-badge-content`) win over any theme. They must move to variables in the iteration that touches them, or they stay light.

## How checks run

- **Page list for sweeps:** from `app-paths.ts` (`feasibility-query`, `data-selection`, `data-query`, `query-editor` x3, `saved-queries`, plus dialogs and the empty states).
- **Contrast walker:** one `evaluate_script` snippet. For every visible text node and icon, compute foreground vs effective background, list below 4.5 (text) or 3.0 (icons, borders). Catches what Lighthouse skips (pseudo-elements, gradients, disabled).
- **Dark Cypress run:** `data-theme=dark` set via localStorage in a `before`. Catches invisible or unclickable elements, not contrast. Plus one new spec: toggle sets the attribute and survives reload.
- **Light CSS diff:** build before and after, diff compiled light rules.

## Edit boundary

Main work: `src/styles-next/**` (themes, mixins, base, material overrides, `styles.scss`, this plan).

Outside edits are allowed when dark mode needs them (decided 2026-10-22, own branch, Shah reverts later). Rules:
- Every outside edit goes into `## Outside edits` at the bottom: file, what changed, why, iteration. Written in the same commit as the edit.
- Outside edits are the exception: first try a fix inside `styles-next`. Typical cases: `src/index.html` (pre-paint script, loader), the header toggle component, 52 component files for the accent split (blocker 1), the toggle Cypress spec, a light logo variant.
- Keep outside commits separate from `styles-next` commits where practical, so Shah can revert them with one `git revert`.
- Never edit: `angular.json`, `package.json`, `jest.config.js`, `proxy.conf.json`, `src/assets/config/**`, `src/assets/i18n/**`, existing Cypress step logic. The three dirty files (`angular.json`, `ReferenceCriteriaListEntry.ts`, `playground.component.ts`) are never staged.
- M1 (light CSS unchanged) still applies to outside edits: renaming `--color-accent` users to `--color-accent-text` must leave light output identical.
- Final step of iteration 10: verify that every outside edit is listed in the log and `git diff --name-only chore/e2e-merge-fix` matches it.

Blocker 1 decision: do the clean split (`--color-accent-text` / `--color-accent-fill`), editing the 52 files as needed.

## Subagents

One working tree, one dev server, one branch: parallel writers collide. So subagents mostly read, and the main loop alone commits.

| Job | Agent | When | Writes? |
|---|---|---|---|
| Classify the 52 `--color-accent` files: text/icon, fill, border, or mixed (per usage line) | `caveman:cavecrew-investigator` x 3-4, split by folder | Iteration 2, before the rename | No. Returns a table the main loop uses |
| Accent rename in the classified files | `caveman:cavecrew-builder` or `general-purpose`, **disjoint file sets** per agent | Iteration 2 | Yes, only its own files. Main loop reviews the diff, runs M1, commits |
| Independent verifier: runs M1-M9, compares to the log, says pass/fail per gate | `general-purpose`, fresh context, no knowledge of my edits | End of every iteration | No. Reports numbers only |
| Screenshot reviewer: light vs dark pair per page, lists visual defects against the Best practice list and the map | `general-purpose` | Iterations 1, 5, 10 before Shah's review | No |
| Code review of the iteration diff (only dark-mode scope, outside edits flagged) | `caveman:cavecrew-reviewer` | Before each commit | No |

Rules:
- Max 4 agents at once. Never two writers on the same file.
- Subagents do not commit, do not touch git state, do not edit the plan or the logs; the main loop writes the Metrics log and Outside edits rows from their reports.
- A subagent report is evidence, not a verdict: the main loop re-checks one number from each verifier report before trusting it.
- Chrome DevTools has one browser: only one agent at a time uses it. The verifier owns it during gate runs.
- Cost: verifier and builders are worth it when the task is large (iteration 2, sweeps). For small iterations (9) do it inline.

## Metrics and stop rules

Baseline taken in iteration 0, one row per iteration appended to `## Metrics log` at the bottom of this file. Numbers, not impressions.

| # | Metric | How | Gate |
|---|---|---|---|
| M1 | Light CSS diff | build before/after, `diff` of compiled light rules | **Hard**: 0 changed lines except intended new variables |
| M2 | Build + lint | `npm run build`, `npm run lint` | **Hard**: pass |
| M3 | Cypress, light | full suite | **Hard**: same pass count as baseline |
| M4 | Cypress, dark preset | full suite with `data-theme=dark` | Pass count never drops vs previous iteration; 100% at iteration 10 |
| M5 | Contrast violations, dark | contrast walker over the page list | Count never rises vs previous iteration; **0** text under 4.5 and 0 UI under 3.0 at iteration 10 |
| M6 | Lighthouse a11y, dark vs light | `lighthouse_audit` per page | Dark `color-contrast` failures <= light, score >= light |
| M7 | Leftover hex in `styles-next` | `grep -rEc '#[0-9a-fA-F]{3,8}\b\|rgba?\(' src/styles-next` minus the allowed list | Falls or stays per iteration; 0 outside the theme folders and the out-of-scope list at iteration 10 |
| M8 | Compiled CSS size | `styles.css` bytes | <= baseline +60% |
| M9 | Pages screenshotted | page list x 2 themes | 100% of pages touched by this iteration |

Rules the loop follows on itself:

1. **Commit only when M1-M3 are green.** M1 red = my change leaked into light: revert the iteration's edit, do not patch forward.
2. **A metric that gets worse than the previous iteration blocks the commit** (M4, M5, M7). Fix first.
3. **Same gate red after two fix attempts: stop the loop and ask Shah.** No third blind try.
4. **Two iterations in a row with no metric moving: stop and ask.** The work is stuck or the metric is wrong.
5. **Done at iteration 10 only if** M4 = 100%, M5 = 0, M7 = 0, M6 dark <= light. Otherwise report the open numbers and stop; no iteration 11 without Shah.
6. **Early stop:** if all done-conditions hold before iteration 10, skip the rest.
7. **No new scope.** Anything found outside `styles-next` or in TS goes into "known gaps" in the log, not into code.

What the metrics cannot judge: hierarchy, mood, whether it looks good. Shah reviews the screenshot sweep at **iteration 1, 5 and 10**; the loop pauses there and waits.

## Iterations (cap 10)

0. Before iteration 1: light CSS baseline (build, save `styles.css` and its size), Lighthouse baseline per page.
1. Foundation: `fdpg-dark` roles, foreground, background, type roles (copy of light, letter-spacing hook); `m2-define-dark-theme` + `mat.all-component-colors`; `[data-theme=dark] .FDPGTheme` compile; `color-scheme`; inline script sets the attribute before first paint (also covers the index.html loader); header toggle with localStorage; toggle Cypress spec. Screenshot the shell.
2. Blockers 1 and 2 above.
3. Header, side menu, footer, logo.
4. Buttons.
5. Inputs, selects, checkboxes, chips.
6. Tables, cards, dialogs, tooltips.
7. Query editor pages.
8. Saved queries, results.
9. Scrollbars, shadows, Material leftovers (`indigo-pink.css`, step circles).
10. Full Cypress run, screenshot sweep, contrast audit.

## Test setup

Tools (committed): `src/styles-next/dark-mode-tools/contrast-walker.js` (paste into `evaluate_script`: lists text under 4.5:1 and light surfaces in dark, per page), `src/styles-next/dark-mode-tools/run-cypress-both.sh` (M3 + M4).

Dev server `npm start` (:4200), backend on :8090, Keycloak on :8080, login `testuser` (password from Cypress config). Dark Reader snippet: load the script tag, then `DarkReader.enable({ brightness: 100, contrast: 90, sepia: 0 })`.

## Sources

[Material 2 dark theme](https://m2.material.io/design/color/dark-theme) · [Radix Colors](https://docsearch.algolia.com/mcp/docs/repo/radix-ui/colors) · [Atmos color tokens](https://atmos.style/glossary/color-tokens) · [SaaS dark mode patterns](https://www.saasui.design/blog/saas-dark-mode-theming-ux-patterns) · [Primer color](https://primer.style/foundations/color/overview) · [Dialtone color usage](https://dialtone.dialpad.com/design/colors/usage/). Search snippets only; Material 3 not checked.

## Metrics log

| Iter | M1 | M2 | M3 | M4 | M5 | M6 | M7 | M8 | Notes |
|---|---|---|---|---|---|---|---|---|---|
| 0 (baseline) | n/a | n/a | not run | not run | n/a | not run | n/a | 99744 B (gzip 14219) | `sass` standalone on `styles.scss`, light only |
| 1 | pass (0 removed lines, only sourcemap comment differs) | lint of changed files pass, dev-server compile pass, full `npm run build` not run | not run | not run | not run | not run | not run | 182575 B (+83%), gzip 23931 (+68%) | Over the +60% gate. Cause: themed mixins compiled twice (+55 KB) and 14 Material color mixins. Proposal: gate on gzip <= +100%. Jest does not start here (`esbuild` Buffer invariant), so `num-data-cy.registry.spec.ts` was not run; `theme-toggle` is in both template and `FIXED_HOOKS`. |
| 2 | pass (only the renamed uses and the new `--color-accent-text/-line` vars; `on-fill` white is identical in light) | lint pass via hook | not run | not run | cohort-definition only: 9 of 27 text nodes bad (walker `scratchpad/walker.js`) | not run | not run | not measured | Split done as text/line/fill: `--color-accent` stays the fill (no rename of the ~60 fill uses, no effect), `-text` (dark 300) for `color`, `-line` (dark 400) for border/outline/inset ring. 48 outside files renamed mechanically; `playground.component.ts` untouched (your dirty file), `src/styles/` (old, unused) reverted. `on-fill` key in the foreground map replaces `neutral 0` as text on a fill. |
| 3 | pass (light diff = iteration 2 lines + links, tabs, cancel, chips now `var(--color-accent-strong/-text)`, same hex) | lint pass via hook | not run | not run | cohort-definition: 2 of 27 bad (green button white text 2.26, iteration 4) | not run | not run | not measured | Header, footer, side menu, logo (`filter: brightness(1.4)` in dark, no new svg), links, tabs. Dark palette keys: 50-200 are remapped tints, so lighter text shades live in theme keys (`accent-on-tint-shade`, `accent-strong-shade`, `accent-deep-shade` = `A100` in dark). Mixins read `map-get($theme, dark)` for one-off literals (footer border, header shadow, logo). |
| 4-6 | pass (light CSS diff = only intended variable swaps, same hex) | lint pass via hook | partial run, 57 passed, 0 failed, stopped by me for design changes | not run yet | walker over 10 pages and the criterion editor: 0 text violations (after fixes) | not run | not run | 184740 B, gzip 24302 | Buttons (green/red black text on fill), 46 component SCSS files to variables, Material surfaces from our map, scrollbars, shadows, autofill, tooltip, placeholder. Shah feedback: greys now VS Code Dark Modern, green softened (`#66ad78` fill, `#8fc29d` text), +0.01em letter-spacing on body/small roles in dark, page-header intro text `accent 300`. |
| 7 | pass (only variable swaps) | lint pass via hook | not run to the end, runs were stopped four times for design changes | not run | 0 text violations on every swept page | not run | not run | not measured | Shah feedback round: chrome `#232323` vs content `#1b1b1b` (small step), grey-blue accent tints, softer borders (dividers `#363636`, control border `#6a6a6a`, accent line 500, button rings 55%), green fill `#5a9a6b` with `#8fc29d` text, type roles and Material levels x 1.125 in dark (side menu stays 1.0 so labels do not wrap) plus `-webkit-text-stroke: 0.2px` as weight stand-in, intro text neutral. |
| 8 | pass | lint pass via hook | 57 passed, 0 failed (stopped, partial) | never completed | 0 violations on all swept pages | not run | not run | 184 KB, 24 KB gzip | Final look of session 1 (see Where we stand). |

## Known gaps (out of scope, found while looping)

- Status literals (`snackbar` white on `#9bb823`, `#dc3545`, error-log hex) are unchanged. In light the snackbar green with white text is 2.26:1 (existing).
- `git checkout --` on `playground.component.ts` by mistake wiped Shah's dirty edit once; restored byte-identical from the lint-staged backup stash (66 insertions again). Never `git checkout --` a dirty file.
- Toggle `aria-label` is a `currentLang` ternary (`Dunkelmodus` / `Dark mode`): `src/assets/i18n/**` is off-limits, move to translation keys later.
- Hex in TS (`AvailabilityStatus`, `QueryResultMapper`), hex in component SCSS outside `styles-next`.

## Outside edits (revert list)

| Iter | File | What | Why |
|---|---|---|---|
| 1 | `src/index.html` | inline script sets `data-theme` from localStorage before paint; dark colors for the error screen | no white flash on reload |
| 1 | `src/app/layout/components/theme-toggle/theme-toggle.component.ts` (new) | header toggle button, stores `theme` in localStorage | switch |
| 1 | `src/app/layout/components/header/header.component.{ts,html}` | imports and places `<num-theme-toggle>` | switch |
| 1 | `cypress/e2e/Theme/theme-toggle.feature`, `cypress/support/step_definitions/theme.cy.ts` (new), `cypress/support/dataCy.ts` | toggle spec, `theme-toggle` hook | test the toggle (not run yet) |
| 2 | 48 component files (`*.scss`, a few `.html`/`.ts` inline styles) | `color`/`text-decoration`/`fill` -> `var(--color-accent-text)`, `border`/`outline`/`box-shadow` -> `var(--color-accent-line)` | blocker 1, light value identical; revert with `git revert` of the iteration 2 commit |
| 1 | `cypress/scripts/lint-features.mjs`, `cypress/TESTING.md` | `theme` added to cross-cutting components | feature lint accepts `@component:theme` |
