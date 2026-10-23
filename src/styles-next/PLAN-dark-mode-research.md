# Dark mode plan (2026-10-22 and 2026-10-23)

## Design rules learned (read first, apply to every dark change)

Found in session 4 when Shah's blue and green buttons "suddenly looked right". Numbers are APCA Lc (`dark-mode-tools/apca-contrast.mjs`) on the action bar `#2b2b2b`.

| Button                                                          | Fill vs bar | Label vs fill |
| --------------------------------------------------------------- | ----------- | ------------- |
| old green `#6a9955`, black                                      | 37          | 43            |
| old blue `#49689c`, white                                       | 20          | 83            |
| new green `#33843e`, white                                      | 26          | 78            |
| blue `#1476b8`, white (session 4)                               | 24          | 79            |
| blue `#2971a7`, white (session 5, calmer, on content `#272727`) | 23          | 81            |
| green `#33843e`, white (kept, on content `#272727`)             | 26          | 77            |

1. **A button has two contrasts: fill vs surface (edge) and label vs fill.** In dark, the label carries the contrast (Lc about 80), the fill only stands out moderately (Lc about 25). The old green failed both: loudest patch on the page (37) with a weak label (43).
2. **Keep one polarity.** The dark page is light-on-dark; black text on a light fill is a light-mode island the eye has to re-adapt to. Labels on fills are white in dark.
3. **Colors of the same rank get the same weight.** Blue and green share one OKLCH ladder (same lightness and chroma, only hue differs), so their edge and label contrasts match (24 / 26, 79 / 78). Mismatch (20 vs 37 before) makes one color fight the other.
4. **Clean color, moderate lightness.** Low chroma at mid lightness looks dirty next to neutral grey (old blue C 0.09, violet hue 260); high lightness plus high chroma looks neon (old light green L 0.74, C 0.17). Target: C about 0.13 at L about 0.55 for fills.
5. **Surfaces stay neutral.** Tints behind boxes, hovers and the active nav are neutral greys; color sits on fills, text, links and focus only (bluish tints read as a tinted page).
6. **Colored text sits below neutral text (session 5).** At equal OKLCH lightness a colored text looks brighter than grey (Helmholtz-Kohlrausch effect: chroma adds perceived brightness), and light-on-dark text blooms anyway (irradiation). Blue 300 `#92bde2` (L 0.78, C 0.07) next to body `#bebebe` (L 0.80, C 0) therefore read as "shiny". Now 300 = L 0.75, C 0.05 (`#94b2cc`, green `#9ab79b`), Lc 57. If body text gets brighter (Open, below), move 300 up with it and keep the gap (about -0.05 L).
7. **Disabled = the same hue, chroma drained (session 5, still Shah's open call).** Enabled green `#33843e` with white label is approved, keep it. Disabled: solid `oklch(from <500> 0.42 0.04 h)` fill, `oklch(from <500> 0.72 0.03 h)` label, no ring, all variants (relative color syntax: Chrome 119+, Firefox 128+). The action bar is the same green as a 12% wash over the content (light: 10% over white); exception to rule 5, the bar is Shah's brand surface. Tried and rejected by Shah, in order: (a) no fill + faded 1px ring and label; (b) soft white lift `rgba(255, 255, 255, 0.14)` + lifted green label; (c) solid soft white `#d6d6d6` (brightest patch on the bar); (d) dark cut-out + green ring on the green bar, the light theme's twin; (e) `rgba(<500>, 0.28)` fill + green 300 label. Shown next to the current pick, not yet judged: whole button at `opacity: 0.4` (VS Code), neutral grey `#3a3d3a` + `#8f988f`, transparent + 1px dashed green outline. Before session 5: fill darker than the bar, invisible ring, read as a hole. Replaces insight 23 ("disabled = grey").
8. **Glare comes from the background, not from the text (session 5, Shah's diagnosis).** Shah: fonts and borders looked "shiny", the main content background was "not sufficient". Content `#1b1b1b` (L 0.22) was so dark that every light text and line stood out with full irradiation, while the mid-tone fills (L 0.55) sat calmly at Lc about 25. That is why the blue and green buttons looked right and the text did not: the buttons already had a moderate step to their surround, the text had the maximum one. Lifting all surfaces by 12 (`#1b1b1b` -> `#272727`, chrome `#2f2f2f`) dims text and lines (body Lc 66 -> 64, WCAG 9.3 -> 8.0) and leaves the fills at Lc 25-26. Also dropped `-webkit-text-stroke: 0.15px` (it sharpened and thickened every glyph; insight from session 4). Lifted greys need their 3:1 partners re-checked: control border `#6a6a6a` -> `#7a7a7a`, secondary text `#9a9a9a` -> `#a2a2a2`.
9. **Text outranks lines (session 5, Shah: "borders too loud, text not loud enough, see the side menu").** A line drawn in a text tone competes with the text next to it. Lines take fill tones (500), text takes the light tones. Done: side menu active rail blue 300 -> 500; header gradient line ended in green 300 (`--num-color--primary-green` is the text tone in dark), now green 500; text `#bebebe` -> `#cccccc` (Lc 72, VS Code text), secondary `#a2a2a2` -> `#b0b0b0`, section and side menu `#a0a0a0` -> `#b8b8b8` (Lc 59 on the chrome). The APCA text question from session 4 is answered by this.
10. **Blue needs less chroma than green for the same weight.** The Helmholtz-Kohlrausch boost is strongest for blue, so the shared ladder (rule 3) made the blue button louder than the green one (Shah: "Antragsportal could be calmer"). Blue 500 / 600 / 700 now C 0.11 / 0.10 / 0.09 at L 0.53 / 0.49 / 0.445 (`#2971a7`, `#266595`, `#215882`), white label Lc 81. Green unchanged (approved by Shah). Rule 3 becomes: same L, chroma tuned by eye per hue.
11. **Loudness = thickness x contrast; compare lines with text stems (session 5, Shah's clue: typography).** Titillium Web stem widths, measured by canvas ink coverage of an `l`: 400 at 14 / 16 / 18 / 20px = 1.05 / 1.2 / 1.35 / 1.5px; 600 = 1.52 / 1.74 / 1.96 / 2.18px; 700 = 1.97 / 2.26 / 2.54 / 2.82px. Body and menu text is mostly 400 at 14-16px, so the letters are about 1px thick: a 2px line is twice as heavy as the text beside it, whatever its color. Weight index (stem or line width x APCA Lc): body 1.2 x 72 = 86, menu text 1.05 x 59 = 62, hint 1.05 x 56 = 59; drop frame was 2 x 23 = 46, now 1 x 23 = 23. Rule: a plain line is 1px in dark and its index stays at or below half of the text next to it; a 2px line is emphasis only and sits next to 600-weight text (active nav rail, current title underline). Done: side menu rails, logo divider, editor drop frames and slot 2px -> 1px (dark only). Not changed: outline button rings (2px, next to 600 labels), focus rings (must stay visible), ghost ring in the drag animation. Typography levers still open: thin 400 stems are why the 0.15px stroke once felt needed (+0.3px stem) and why lines compete so easily; candidates are 600 for 14px labels that sit next to lines (side menu children), or the dark size scale x1.125 for the side menu (now x1.0). Try one at a time with a screenshot.

Open, to work on with these rules (status after session 5):

- **Text**: done (rule 9: `#cccccc` / `#b0b0b0` / `#b8b8b8`, stroke removed). Still open: type scale x1.125 vs 1.0 and the 10-12px labels (rule 11).
- **Red and yellow**: done (ladder, session 5). Not yet seen on screen: warning chip, info tile, error log, validation modal.
- **Outline buttons**: ring is 55% of 500 at 2px; check its edge contrast and weight (rule 11) now that blue 500 is calmer and darker.
- **Chips, badges, step circles, toggles**: measure edge and label contrast the same way and align them with the buttons.
- **Disabled button**: still Shah's open call (rule 7).

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

**Session 5 (latest, 2026-10-22 evening and 2026-10-23, uncommitted, sessions 4 and 5 not committed):** read design rules 6-11 at the top, then **Session 5**, **Insights (keep)** 28-36, **Issues in session 5**, **Improvements gained in session 5**, and **Next session (start here)** (rewritten at the end of session 5). Dev server note: a broken intermediate SCSS left the server on stale CSS with the webpack overlay until a later save; compile with `npx sass` first when editing theme maps by script.

**Session 4:** read **Session 4** first (three rounds: neutral tints, VS Code blue, one OKLCH ladder for blue and green), then **Insights (keep)** 18-26, **Issues in session 4**, and **Next session (start here)**, which was rewritten in session 4.

Section index for the next session: **Design rules** (top), **Where we stand**, **Session 2** to **Session 5**, **Insights (keep)** (10-17 new in sessions 2-3, 18-27 in session 4, 28-36 in session 5), **Issues in session 1 / sessions 2 and 3 / session 4 / session 5**, **Improvements gained in session 1 / sessions 2 and 3 / session 4 / session 5**, **Next session (start here)**, then **Test setup** (tools) and **Outside edits (revert list)** at the bottom.

Branch `feat/dark-mode`, 18 commits on top of `5e5227bd` (`git log --oneline 5e5227bd..HEAD`), nothing pushed. Dev server `npm start` (:4200) must be running; login `testuser` / `testpassword`.

**Done (all in code, committed):**

- Theme `themes/fdpg-dark/` (roles, foreground, background, theme) built on `fdpg-light`, compiled a second time under `[data-theme=dark] .FDPGTheme`. Header toggle (`num-theme-toggle`), `theme` key in localStorage, pre-paint script in `index.html`, toggle Cypress spec, `--expose theme=dark` for the whole suite.
- Accent split: `--color-accent` (fill), `--color-accent-text`, `--color-accent-line`, plus `--color-accent-strong`; `on-fill` and `on-bright-fill` foreground keys; surface keys `card`, `dialog`, `chrome`; variables `--color-surface`, `--color-page`, `--border-color-field`, `--color-text-table-header`. 46 component SCSS files moved from literal white / black / grey to these variables.
- Material: 14 component color mixins from our own background and foreground map (no `all-component-colors`, that is +80 KB), placeholder fix.
- Look (after Shah's feedback rounds): neutral greys like VS Code Dark Modern; content `#1b1b1b` is the darkest, chrome (header, side menu, footer, popups) `#232323`; grey-blue accent tints; soft borders (divider `#363636`, control `#6a6a6a`); green is VS Code's comment green `#6a9955` as button fill, `#86ad6f` as text, action bar grey; text `#bebebe` / `#9a9a9a` / `#a0a0a0`; sizes and Material levels x 1.125 (side menu x 1.0), `-webkit-text-stroke: 0.15px` as weight stand-in (removed in session 5); page title `#9ca8bf` on a slate highlight (`accent 100` fill, 2px underline in the accent line tone; the left bar was dropped as a side-tab tell).

**Numbers:** contrast walker (`dark-mode-tools/contrast-walker.js`) 0 violations on cohort definition, feasibility search, bulk search, editor, data-selection search and editor, data-query data-selection, saved queries, criterion editor. Light CSS: only intended variable swaps (hex identical). CSS size 184 KB / 24 KB gzip against 100 KB / 14 KB (+68% gzip; gate was +60%, proposal: gzip <= +100%). Cypress: Shah decided on 2026-10-22 not to run it in session 1. Partial light runs that were stopped by me for design changes: 57 passed, 0 failed (latest partial: 29 passed, 0 failed). M3 and M4 are still open: see Next session.

## Session 2 (2026-10-22, read-only pass, no browser, no Cypress)

Shah: "improve from all data plus own estimates, stick to styles-next, be creative". Done inside `styles-next` only; light CSS checked by `sass` compile diff (M1 pass: only `var(--shadow-card)` swaps, same values).

- Checkbox checked fill in dark: `#839e00` (neon) -> secondary 500 `#6a9955`, dark tick on it 5.2:1. Same job as the green buttons.
- `mark` (search hits) in dark: tint 50 was 1.1:1 on the content, invisible. Now tint 100 with accent text 300 (5.5:1).
- `::selection` in dark: accent 200 grey-blue with primary text (5.2:1) instead of the browser's bright blue (VS Code style).
- Tooltip in dark: 12px -> 13.5px / 19px (the x 1.125 rule).
- Shadows: action bar and button hover read `var(--shadow-card)` (dark already sets stronger alpha); before they were light literals, so hover lift was invisible in dark.
- Hex out of mixins: placeholder (`placeholder` key in both foreground maps) and page title (`page-title` in dark foreground). `_ui-classes` fallback `#232323` removed. `fdpg-dark/_background.scss` stale comment fixed.

Not done (outside `styles-next`, add to the next session or Shah decides): light literals that break dark in component SCSS: `profile-reference-chip` error state (`#ffe5e5` fill, `#c62828`), `validation-modal` (`#2e7d32`, `#b71c1c` text, about 2-3:1 on dark), `error-log-modal` (`#fff3cd`), `error-log-item` (`#e9ecef`, `#495057`, `#667eea`), `info-tile` danger, `save-dataquery-modal` `#c5cacf`, `dashboard` `#555e6a`, `snackbar`. Fix: move to `--color-*` variables, or add status tint variables (`--color-danger-bg`, `--color-success-text`) to `_color-variables` first, which stays inside `styles-next`.

## Session 3 (2026-10-22, fresh look with screenshots, plan not followed)

New file `custom-material/components/_dark-overrides.themed.scss`: dark-only rules for components whose SCSS still holds light literals (host tag + class beats the encapsulated rule), plus the stepper. Delete a block when its component reads a variable. Dark `danger 50` / `warning 50` remapped to dark tints in `fdpg-dark/_roles.scss`. Light CSS: no change.

Found by screenshot, fixed: current step was invisible (both circles grey, both titles highlighted, stepper on a card-tone strip); empty-state text lines overlapped (24px on a 20px line height, light too, fixed in dark only); availability track invisible; saved-query rows ran together; neon snackbar with white text (now a chrome toast with a colored edge); pink, light yellow and light grey status fills (chip warning, info tile, error log, global `code` from `::ng-deep`); `#c5cacf` placeholder in the save dialog brighter than the text. Walker: 0 violations on cohort definition and data-selection overview.

Seen, left for Shah: eight solid blue "laden" buttons per saved-queries page read as a wall in dark (outline or text button in rows?); page title box looks like a chip on search pages; the same light empty-state line-height bug.

## Session 4 (2026-10-22, "still disturbing, can't say how")

Shah named two causes mid-session: content looks bluish, `type="green"` buttons far too green. Fixed (light CSS identical, all diff lines under `[data-theme="dark"]`):

- Dark accent tints 50/75/100/200 neutral (`#212121`, `#262626`, `#2c2c2c`, `#3a3a3a`) instead of grey-blue. Boxes (`.num-card`, criterion box), page-title chip, active nav item, accent borders no longer tint the content. Blue stays on fills, links, focus.
- Green button in dark is tonal: fill secondary 50 `#2a3526`, hover 100, focus 200, text 300 `#b6d1a8` (Lc 68), inset 1px edge from 500 at 55%. New `button-color` params `$on` (text on fill) and `$edge` (ring color).
- Disabled buttons in dark are grey (ring neutral 300, text neutral 500), all variants. Color now marks only what is clickable; before, a disabled green icon button looked like an enabled one.

Round 2 (Shah: green invisible, blue neon, header selects without border, "Antragsportal" letters tight; reference = VS Code status bar `#1476b8` on `#1e1e1e`):

- Tonal green dropped. Dark green fill `#2f7a3a` / hover `#296b33` / focus `#235c2c` (secondary 50-200), white text Lc 81. Same weight as the blue fill (Lc 24 vs 27 against the content).
- Dark blue fills 500/600/700 = `#1476b8` / `#106aa6` / `#0e5a8c` (VS Code), white text Lc 79. Accent text 300 `#90b9d5`, same hue 204 as the fill, replaces lavender-ish `#98accd` (hue 217).
- Header selects: dark border `--border-color-field` (the divider tone was 1.15:1 on the chrome).
- Button labels in dark: no text stroke, `letter-spacing: 0.02em`.
- Left: `OPTIONAL` chip still `#49689c` (color not from the palette).

Insight: "tonal" (dark tint fill + light text) reads as disabled next to grey disabled buttons; a primary action in dark needs a solid mid-tone fill. Match fill weights across colors by APCA Lc against the surface, not by hue.

Round 3 (Shah: blue and green better; borders, hovers and the rest should use the same blue, one hue palette):

- Why `#1476b8` works and `#49689c` did not (OKLCH): old C 0.09 at hue 260 (violet) is a greyed blue, it reads as dirty grey next to neutral greys; new C 0.13 at hue 245 (azure) is clearly a color, at L 0.55 (mid-dark) it does not glow. Neon = high L and high C together (old green `#9bb823`: L 0.74, C 0.17).
- One OKLCH ladder for blue (H 245) and green (H 146), same L and C per step: 300 text `#92bde2` / `#9bc49d`, 400 `#609fd2` / `#6fa973`, 500 fill `#1476b8` / `#33843e`, 600 hover, 700 focus. Table in `fdpg-dark/_roles.scss`. Both fills Lc 27 against the content, white text Lc 79 / 77. Tints 50-200 shared and neutral (`$_dark-tints`).
- Green button now uses 500/600/700 like blue (the 50-200 workaround and the `$edge` param are gone); outline and badge text green 300; checkbox tick white (light: same `#fff`).
- Off-ramp leftovers fixed: page title `#9ca8bf` -> blue 300; filter chip `OPTIONAL` block read Material's light palette (`m2-get-color-from-palette`), and its arrow used the text tone, now both accent 500.
- Scanner `dark-mode-tools/offramp-scanner.js` (every visible chromatic color not on the ramps): 0 on data-selection overview and criterion search.

Measured, not changed (Shah decides):

- **APCA** (WCAG 3 draft, perceptual) vs WCAG 2: text `#bebebe` on `#1b1b1b` is 9.3:1 (passes) but **Lc 66**, below the Lc 75 body-text minimum; secondary `#9a9a9a` Lc 46, intro/section `#a0a0a0` Lc 49, page title Lc 53. Light text is Lc 106, VS Code dark Lc 74. WCAG 2 overrates light-on-dark contrast, so "passes" hid dim text. Candidates: text `#d6d6d6` (Lc 80), secondary `#b0b0b0` (Lc 58), section `#b4b4b4` (Lc 60).
- **Text stroke works against dark.** Light text on dark already looks bolder (irradiation); the 0.15px stroke adds weight and smears glyph edges. Guides lower weight in dark (350 vs 400, or a negative GRAD axis). Candidate: drop the stroke once text is brighter; the stroke was compensating for dim text.
- **Type scale x 1.125** changes layout between themes (wraps, row heights). Candidate: back to 1.0 after the two points above.

Tool: `apca-w3` + `colorparsley` (npm), 10-line script in the scratchpad; worth committing next to `contrast-walker.js` if APCA becomes a gate.

## Session 5 (2026-10-22 evening to 2026-10-23, disabled buttons, shiny blue text, loud lines, feature editor)

Shah: disabled green looks wrong ("disabled is the inverse of enabled"), blue text too shiny. All diff lines dark-only (sass compile diff vs HEAD: the only light line is the known same-hex chip arrow from session 4).

- `button-color`: dark disabled = drained hue (`oklch(from ...)`), no ring. All variants. Action bar in dark: green 500 wash at 12% over neutral 0 (was grey neutral 100), border kept. Design rule 7 (eight variants tried, all recorded there).
- Surfaces lifted by 12 (neutral 0-300, tints 50-200, chrome), stroke removed, control border and secondary text raised to keep 3:1 / 4.5:1. Design rule 8. Walker 0 violations on the editor and cohort definition pages.
- Tooling: the dev server kept serving the last good CSS after a broken intermediate SCSS (and showed the webpack error overlay) until a later save. Workaround that is also faster for variants: compile with `npx sass --load-path=. --load-path=node_modules src/styles-next/styles.scss out.css`, wrap it in an `evaluate_script` file that disables `link[href*=styles]`, removes `#webpack-dev-server-client-overlay` and injects a `<style>`; screenshot; crop and stack with `ffmpeg hstack/vstack`. Relative `url()` in the injected CSS do not resolve (flag icon missing), ignore that in variants.
- Round after that: text up, lines down, blue calmer (design rules 9 and 10). Walker 0 on cohort definition, light CSS unchanged. Shah reported missing header select borders; they render here (`#7a7a7a`, 3.1:1 on the chrome), likely his tab held the CSS from the broken build. Re-check on his screen.
- Free round after Shah's screenshot (header selects confirmed present on his screen):
  - Side menu typography, four variants side by side (current, child labels 600, 17px, body tone): 600 erased the parent/child hierarchy, 17px wrapped "Gespeicherte Datendefinitionen", body tone `#cccccc` at 400 won. `--side-menu-text` = text primary in dark.
  - Red and yellow on the ladder (rule 3 / 10): red H 25 300 `#e19891` (error text 6.5:1, was neon `#ff8383`), 500 `#b2403d` fill with white 5.7:1 (was `#ff4545`), 600 / 700 hover and focus (the red button now uses them in dark; light keeps 300). Yellow H 85 300 `#e2bf76`, 500 `#d4a73e` (dark yellow turns olive, so it stays light). Status tints 50 lifted +12 with the surfaces.
  - **Leak found: the dark Material theme was built from the light palettes** (`fdpg-dark/_theme.scss`): 27 tokens in light blue `#49689c` and 41 in light yellow `#eeb70c` (form field error outlines and labels, caret, tab indicator, select option checkmark). Now `m2-define-palette($_dark-neutral / $_dark-accent / $_dark-warning)`. Expansion panel chevron read `m2-get-color-from-palette($accent)`: now `role-color` (dark 300). Left: `num-divider-color--a/--w` classes (0 uses in templates).
  - Saved queries: the wall of eight solid blue "laden" buttons (open since session 3) is now, in dark only, a quiet row action (1px ring 500, blue 300 label) that turns solid on row hover, keyboard focus and its own hover. One solid fill per view at a time.
  - Checks: walker 0 on editor, cohort definition, criterion search, saved queries; light CSS unchanged; CSS 189 KB / 25.3 KB gzip.
- Done later in session 5: status tints lifted (`#39292a`, `#373223`); section text `#b8b8b8`, body `#cccccc` (rule 9). Next: a status tint has not been seen on screen yet (chip warning, info tile, error log), screenshot one. The action bar's own `.num-button.disabled` rule loses to `button-color` in dark (0,2,1 vs 0,3,0); its session-4 dark tweak was reverted. Prototype by injecting a `<style>` with `!important` in `evaluate_script`, crop the bar with `ffmpeg -vf crop`, stack variants with `vstack`: faster than recompiling per variant.
- Ladder step 300 (text) L 0.78 / C 0.07 -> L 0.75 / C 0.05: blue `#94b2cc`, green `#9ab79b`. `oklch-ramp.mjs` updated. Design rule 6. Covers breadcrumb, nav, page title, "Kriterium hierher ziehen", outline labels.
- Editor empty-list sketch (`num-display-criteria`, `_dark-overrides`): drop slot was white 60% (brightest patch on the page), now `--color-accent-bg`; white glow under the cursor is now a dark shadow.

- Line weights (rule 11): side menu rails, logo divider, editor drop frames and slot 1px in dark; active rail and title underline stay 2px.
- Feature editor (`query-editor/feature`, Shah: "cannot see what is going on, cannot see what needs to be done"), all in `_dark-overrides`: field descriptions were the CSS keyword `grey` (`#808080`, Lc 33) in italic, now secondary text, upright; 10px descriptions in "Als erforderlich setzen" now 13px; filter tabs like VS Code (inactive = secondary text at full opacity instead of blue at 50%, active = primary text on the content with a 2px blue top line); the lighter frame around the darker tab panel flattened; field titles 600 over 400 descriptions (selector needs the extra class `.node-display-container`, the component rule ties otherwise). Walker 0, light unchanged.
- Tools added to `dark-mode-tools/`: `inject-css.sh` (compile styles-next and inject into the open page, bypasses the dev server), `open-editor.js` (reopens the feature editor after a reload), `stem-widths.js` (font stem widths). Scratchpad-only helpers (not kept): `lift.py` (shift all dark surface greys by N, from saved originals), crop helper for `ffmpeg`.

Open from session 5:

- Disabled button (rule 7), still Shah's call.
- Not yet seen: warning chip, info tile, error log, validation modal (status tints), dialogs, datepicker, user menu, snackbars, bulk search results, result page, criterion and reference editors (they share `num-filter-tabs` and `num-tree`, so the feature-editor fixes should carry over, screenshot to confirm).
- On the feature editor: titles in the "Als erforderlich setzen" list are still 400; the blue "-" expand toggles sit at 50% opacity.
- Never run in session 5: Cypress (M3, M4), `npm run build` (M2), Lighthouse (M6), hex count (M7).

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
10. **Screenshots find what the walker cannot (session 3).** The walker passed pages that were still wrong: two step circles that both pass contrast but look the same, overlapping text lines, a track at 10% black that is "decoration". Check state differences (current vs other, hover vs rest) by eye, contrast by the walker.
11. **Black alpha is a light-only literal.** `rgba(0, 0, 0, 0.03-0.1)` borders, hovers and tracks vanish on dark, without any contrast tool noticing. Grep `rgba(0, 0, 0` in component SCSS when sweeping; the fix is a variable (`--border-color`, `--num-color--grey-hover`), never a white alpha.
12. **Host tag beats encapsulation.** Component styles compile to `.x[_ngcontent-…]` (0,2,0). A dark rule in styles-next that starts at the host tag, `[data-theme=dark] .FDPGTheme num-x .x`, scores (0,3,1) and wins without `!important`. Collected in `components/_dark-overrides.themed.scss`; each block is a debt marker for that component.
13. **`::ng-deep` leaks globally.** `error-log-item` styles every `<code>` on the page once it has loaded, so its light pill showed up elsewhere. Overrides for such rules must be global too.
14. **Material stepper reads the primary palette, which is grey here.** Selected and unselected circles came out `#9ea9b3` vs `#9a9a9a`. Same leak in light (indigo `#3f51b5` via `indigo-pink.css`). A component that marks "current" needs its state colors set by us.
15. **A shared component can carry a page-level look.** The title highlight lives on `.header-title`, and `num-header` is reused inside the stepper labels, so both step titles got the box. Before styling a shared class, grep where its component is used.
16. **Status tints need a dark ramp too.** The light 50s (`#ffebeb`, `#fefaec`) glow on dark. Remapping only the 50 key in `fdpg-dark/_roles.scss` (hue kept, L ~14%) is enough: text on it uses 300 (red) or 500 (yellow).
17. **Toasts in dark: panel plus colored edge, not a colored fill.** A full green or red fill is the brightest thing on the screen; VS Code and GitHub use the chrome panel with a status edge or icon.
18. **Shah cannot always name the problem; a reference image can.** "Disturbing, can't say how" turned into three concrete complaints only after he saw changes (bluish content, loud green), and the fix direction came from a cropped VS Code status bar. Ask for, or offer, a reference screenshot early; sample it with `ffmpeg -vf crop=1:1:X:Y -f rawvideo -pix_fmt rgb24 - | od -An -tx1`.
19. **"Bluish" was not the background.** The content was neutral `#1b1b1b`; the cast came from grey-blue tints on boxes, chips and the active nav, and from violet-leaning text (`#98accd`, `#9ca8bf`, hue 217-260). Low-chroma blue next to neutral grey reads as a tinted surface. Measure the background before changing it.
20. **Judge colors in OKLCH, not HSL.** HSL said old blue S 36% / L 45% and new blue S 80% / L 40%, which looks like "much louder". OKLCH shows the truth: same lightness (0.52 vs 0.55), chroma 0.09 vs 0.13, hue 260 vs 245. Dirty = low chroma at mid lightness; neon = high lightness and high chroma together (old green L 0.74 C 0.17).
21. **Two colors weigh the same when they share OKLCH L and C.** Blue and green ramps are one ladder with two hues; APCA against the content then matches step by step (fill Lc 27 / 28). Adding a status color later: same ladder, new hue (`dark-mode-tools/oklch-ramp.mjs`).
22. **A tonal fill (dark tint + light text) reads as disabled** once disabled buttons are grey. The primary action in dark needs a solid mid-tone fill with white text (VS Code, GitHub).
23. **Disabled = grey in dark, all variants.** Color then marks only what can be clicked; a disabled green ring looked like a resting enabled button. **Superseded in session 5** by design rule 7: a faded inverse (1px ring 45%, label 60%) keeps the color identity without looking enabled; grey disabled on a darker fill read as a hole.
24. **A white alpha is the dark twin of insight 11.** `rgba(255, 255, 255, 0.6)` (editor drop slot) is invisible in light and the brightest patch in dark. Grep `rgba(255, 255, 255` in component SCSS too.
25. **WCAG 2 overrates light-on-dark contrast.** `#bebebe` on `#1b1b1b` passes at 9.3:1, but APCA gives Lc 66, below the Lc 75 body-text minimum (light theme: Lc 106). The contrast walker (WCAG 2) cannot see "foggy" text; `dark-mode-tools/apca-contrast.mjs` can.
26. **Material palette lookups bypass the dark roles.** `mat.m2-get-color-from-palette($accent, 500)` reads the shared light Material palette, so the dark ramp never reaches it (filter chip block). Use `role-color`. Grep `m2-get-color-from-palette` when a color refuses to change.
27. **A dark-only rule must not depend on a value that differs between themes.** The chip arrow used `--color-accent-text` (light 500 = block, dark 300 = paler than the block). Same hex in light hid the mismatch.
28. **Colored text must sit below grey text of the same lightness.** Chroma adds perceived brightness (Helmholtz-Kohlrausch), strongest for blue, so equal OKLCH L reads as louder for the colored one. Blue text and blue fills both needed less chroma than green (design rules 6 and 10). Equal numbers do not mean equal weight; look at the screen.
29. **Glare is set by the background step, not by the text color.** A near-black content (`#1b1b1b`) makes every light text and line shine at full irradiation. Lifting all surfaces by 12 calmed text and lines at once; mid-tone fills did not change (design rule 8). When something looks "shiny" or "foggy", change the surface before the foreground.
30. **Visual weight = thickness x contrast.** Compare line widths with font stem widths (`dark-mode-tools/stem-widths.js`): 400 at 14-16px is about 1.0-1.2px thick, so a 2px border outweighs the text beside it. Plain lines 1px in dark, 2px only as emphasis next to 600 text (design rule 11).
31. **A line drawn in a text tone competes with the text.** Rails, gradients and underlines take fill tones (500), text takes the light tones (design rule 9). One variable can carry two jobs: `--num-color--primary-green` is the pale text tone in dark, the header line used it as a line color and ended almost white.
32. **Material palettes in the dark theme must come from the dark roles.** `m2-define-dark-theme` was fed the light palettes: 27 tokens in light blue and 41 in light yellow leaked into dark (form field errors, caret, tab indicator, select checkmarks). The contrast walker cannot see them because they only show in states (error, focus, selected). Grep the compiled CSS for light palette hex after the first `[data-theme='dark']` line.
33. **Equal specificity: the later stylesheet wins.** A component rule `.node-display-container > span` (0,3,1 after encapsulation) tied with `num-tree .data-display` and won by load order. Add one class instead of `!important`.
34. **A solid fill repeated down a list is a wall.** Eight solid blue row buttons were the loudest thing on the saved-queries page; one solid fill per view (on hover or focus) keeps the action findable and lets the content lead.
35. **The dev server is not a safe prototyping loop.** A broken intermediate SCSS left it on stale CSS with the webpack overlay, and each save reloads the page and drops state (editor pages). Compile with `npx sass` first, try variants with `dark-mode-tools/inject-css.sh` + stacked `ffmpeg` crops of several variants in one image; ask Shah about rows, not single options.
36. **Shah's feedback is a rating of the whole picture, not of one value.** The disabled button was rejected five times while the cause (background step, line weight, text tone) sat elsewhere. After two rejections of the same element, measure the surroundings (text, line, surface) instead of trying a sixth variant. Shah also does not want `★ Insight` blocks in chat (profile): insights go into this plan.

## Issues in session 1 (what went wrong, so it does not repeat)

| #   | Issue                                                                                                                                             | Cause                                                                                                                                                                     | Fix / rule                                                                                                                                                                                                                                                             |
| --- | ------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 1   | Shah's uncommitted edit in `playground.component.ts` (66 lines) was wiped                                                                         | I ran `git checkout -- <dir>` to undo my own regex pass over the file                                                                                                     | Restored byte-identical from the lint-staged backup stash (`LC_ALL=C git fsck --lost-found`, commit "WIP on dark-mode"). Rule: never `git checkout --` a file that was dirty before the session; protect it by excluding it from the edit, not by reverting afterwards |
| 2   | `git add src/styles-next` committed Shah's untracked `prototype-bulk-chips.html` once                                                             | Directory add picks up untracked files                                                                                                                                    | Removed from the commit with `git rm --cached` + amend (not pushed). Rule: add by explicit path                                                                                                                                                                        |
| 3   | `prettier --write src/styles-next` reformatted about 40 unrelated docs                                                                            | Folder-wide prettier                                                                                                                                                      | Restored those tracked files from git (they were clean). Rule: run prettier on the changed files only                                                                                                                                                                  |
| 4   | Cypress runs failed to start or were invalid six times                                                                                            | A killed `cypress run` leaves Electron holding port 4300 ("Port 4300 is already in use"); every later run aborted at start; editing `src/` reloads the dev server mid-run | Kill the pid from `ss -ltnp \| grep 4300` and the orphaned Chrome and Electron helpers (about 80 processes found at the end). Never edit `src/` during a run                                                                                                           |
| 5   | Runs killed four times for design feedback, so M3 and M4 never completed                                                                          | Shah gave new design direction while a 1 h suite ran                                                                                                                      | Decided 2026-10-22: no Cypress in session 1. Run both suites first thing next session                                                                                                                                                                                  |
| 6   | Stale "task completed" notifications from abandoned waiter loops                                                                                  | Long `sleep 10` polling loops outlived their runs                                                                                                                         | Do not poll with long loops, use one bounded wait per run. Two waiter shells were still alive at the end and were killed                                                                                                                                               |
| 7   | Jest does not start in this environment                                                                                                           | `esbuild`: `Buffer.from("") instanceof Uint8Array is incorrectly false` (jsdom vs Node)                                                                                   | Not fixed. The `num-data-cy.registry.spec.ts` check for the new `theme-toggle` hook was done by reading                                                                                                                                                                |
| 8   | First attempts looked wrong: black text on dark (saved queries), lighter tile behind the logo, white placeholder, blank screenshot                | Material light `app-background` sets black; logo `<img>` carries class `FDPGTheme`; Material token order; screenshot taken before render                                  | See Insights 4 and 5. Screenshot before render: wait 3 s after reload                                                                                                                                                                                                  |
| 9   | German `git` output ("unreferenziert") broke my parsing                                                                                           | Locale                                                                                                                                                                    | `LC_ALL=C` for scripted git                                                                                                                                                                                                                                            |
| 10  | The design direction changed seven times in one hour (blue-grey, VS Code grey, chrome dark then light, softer, green, type size, text brightness) | Shah judged by eye against the VS Code screenshot                                                                                                                         | Expected for a first look; the map in this plan is now the VS Code derived one, open points are in "Next session"                                                                                                                                                      |

## Issues in sessions 2 and 3

| #   | Issue                                                                                 | Cause                                                      | Fix / rule                                                                                      |
| --- | ------------------------------------------------------------------------------------- | ---------------------------------------------------------- | ----------------------------------------------------------------------------------------------- |
| 1   | `prettier` failed: "No files matching the pattern" for a list of paths in `$P`        | zsh does not split an unquoted string variable into words  | Use an array: `P=(a b c)` and `"${P[@]}"`                                                       |
| 2   | `/* */` comment at the top of a mixin file landed in the compiled CSS once            | Sass keeps loud comments in output                         | Use `//` comments in mixin files                                                                |
| 3   | Prettier broke a table row in this plan (`ss -ltnp \| grep 4300`)                     | An unescaped `\|` inside a code span splits the table cell | Escape `\|` inside Markdown tables                                                              |
| 4   | Session 2 ran without a browser, so it missed the stepper, the empty state and toasts | "Don't test" was read as "don't look"                      | A screenshot is not a test run: take light and dark screenshots of the touched pages every time |

## Issues in session 4

| #   | Issue                                                                             | Cause                                                                       | Fix / rule                                                                                                       |
| --- | --------------------------------------------------------------------------------- | --------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------- |
| 1   | Tonal green shipped, Shah: "green not visible"                                    | I read "off the charts" as "remove the fill" instead of "lower its weight"  | Change one variable at a time: weight (L, C) first, structure (fill vs tonal) only if weight fails               |
| 2   | Injected CSS variants did not reach `.num-card`                                   | Some mixins compile `role-color` to hex, not `var()`                        | Prototype in the palette (`fdpg-dark/_roles.scss`), not by overriding variables                                  |
| 3   | Wait loop on `styles.css` hash timed out                                          | The dev server serves styles under another name or the hash check was wrong | Reload with `ignoreCache` and wait 3-5 s in `evaluate_script` instead                                            |
| 4   | Prettier split a trailing `// comment` after `box-shadow` into one value per line | Prettier SCSS formats a value followed by a comment that way                | Put comments on their own line above the declaration                                                             |
| 5   | `NODE_PATH` did not make a script find packages                                   | ESM `import` ignores `NODE_PATH`; resolution starts at the script file      | Copy the script next to a temp `node_modules` (header of each `dark-mode-tools/*.mjs`)                           |
| 6   | Temporary edit of `_theme.scss` (type scale 1.0) for a screenshot                 | Testing a variant needs a recompile                                         | Reverted by `sed` right after; `git status` was clean before. Prefer a scratch copy plus `npx sass` for variants |

## Improvements gained in session 4

- **Perceptual tools instead of WCAG 2 only:** APCA for text and fill weight, OKLCH for hue, chroma and lightness; both scripted in `dark-mode-tools/`.
- **One color system for dark:** blue and green from one ladder (`fdpg-dark/_roles.scss` table), shared neutral tints, both buttons on 500/600/700 with white text. Less special-casing: the tonal workaround and the `$edge` parameter were removed again.
- **Off-ramp scanner** (`dark-mode-tools/offramp-scanner.js`) finds every colored pixel source not on the ramp; 0 on two pages.
- **Light protected by a scripted check:** `git archive HEAD src/styles-next` into the scratchpad, `npx sass` both, `prettier --parser css`, `diff`; every changed line must sit after the first `[data-theme="dark"]` line (about 2310), or be the same hex (checked for the chip arrow).

## Improvements gained in sessions 2 and 3

- **Fewer hex in mixins:** placeholder and page title moved to foreground keys; shadows on buttons and the action bar read `var(--shadow-card)`, so dark's stronger alpha reaches them.
- **One place for dark debt in components:** `components/_dark-overrides.themed.scss` fixes eight components from inside `styles-next` without editing them. The list doubles as the to-do list for moving those components to variables.
- **States made visible:** current step, search hits (`mark`), text selection, availability track, saved-query row separation.
- **Glare removed:** neon checkbox, neon snackbar, pastel status fills, `#c5cacf` placeholder.
- **Light protected the cheap way:** `npx sass` compile before and after, `diff`, only `[data-theme=dark]` lines may appear (plus same-value variable swaps).

## Improvements gained in session 1

- **Measured contrast instead of impressions:** `dark-mode-tools/contrast-walker.js` (text under 4.5:1, light surfaces in dark) found real defects the eye missed: placeholder at 3.8:1 from Material's 60% alpha, accent text 1.8:1 on the dark nav, black text inherited from Material, white badge, white table rows. Result: 0 violations on 10 pages.
- **Light output protected:** M1 (compiled light CSS diff) after every iteration, kept to "same hex": every dark-only literal sits behind `map-get($theme, dark)` or a theme key.
- **Fewer places that know a color:** 46 component SCSS files and the shell no longer hold literal white, black or grey, they read `--color-surface`, `--color-page`, `--border-color-field`, `--color-text-*`. A third theme (high contrast, a team theme) now needs only a theme folder.
- **One accent became four jobs:** fill, text, line, strong (links, hover). The split lives in the theme, so dark moves text and line to lighter shades and keeps fills.
- **Material themed from our own maps** (14 component mixins, not `all-component-colors`): saves 80 KB and removes the indigo-pink leaks (stepper, details drawer, select panel, menus).
- **No flash on reload:** pre-paint script in `index.html`, transitions off during the switch.
- **Reproducible tooling committed:** contrast walker, `run-cypress-both.sh`, `--expose theme=dark` for the whole suite, a toggle spec.
- **Research turned into rules:** best-practice list, VS Code reference and the Dark Reader trial are now implemented, and each Shah correction is recorded with its value (grey set, green `#6a9955` from his reference image, type scale 1.125, stroke 0.15px).

## Issues in session 5

| #   | Issue                                                                             | Cause                                                                                          | Fix / rule                                                                                          |
| --- | --------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------- |
| 1   | Disabled button rejected five times in a row                                      | Cause was the background step and line weights, not the button                                 | Insight 36: after two rejections, measure the surroundings                                          |
| 2   | Dev server stayed on stale CSS, then the page showed the webpack error overlay    | My surface-lift script dropped the `#` of non-grey values, SCSS failed, server kept old output | Compile with `npx sass` before trusting the browser; `inject-css.sh` for variants                   |
| 3   | The overlay hid the page behind a "screenshot" of my variants twice               | Overlay iframe `#webpack-dev-server-client-overlay` stays after a failed build                 | The inject script removes it                                                                        |
| 4   | Row titles stayed 400 after setting 600                                           | Component rule tied on specificity and loaded later                                            | Insight 33: one more class                                                                          |
| 5   | The feature editor state vanished after each save                                 | Dev-server reload                                                                              | `open-editor.js`                                                                                    |
| 6   | `/clear` typed in a message did nothing                                           | It was sent as a prompt, not as a command                                                      | Type `/clear` as its own entry                                                                      |
| 7   | A control border and secondary text fell below 3:1 / 4.5:1 after the surface lift | Lifted surfaces shrink the contrast of every grey on them                                      | Re-run the walker after every surface change; raised `#6a6a6a` -> `#7a7a7a`, `#9a9a9a` -> `#a2a2a2` |

## Improvements gained in session 5

- **One surface step fixed three complaints** (shiny text, loud borders, "too much contrast between blue and dark"): content `#272727`, chrome `#2f2f2f`, text `#cccccc`; stroke removed (design rule 8).
- **Typography became a measured lever:** stem widths per weight and size, weight index = thickness x Lc (rule 11, `stem-widths.js`).
- **Four colors on one ladder with per-hue chroma:** blue, green, red, yellow (design rules 3, 6, 10; ramps in `fdpg-dark/_roles.scss`).
- **68 light-theme leaks removed from the dark Material theme** by building it from the dark roles (insight 32).
- **Feature editor readable** (descriptions, tabs, titles) and **saved queries without a wall of fills.**
- **Faster variant loop:** `inject-css.sh` + stacked crops (insight 35).

## Next session (start here)

**Feature editor (query-editor/feature), done at the end of session 5** (Shah: "cannot see what is going on, cannot see what needs to be done"), all in `_dark-overrides`: field descriptions were the CSS keyword `grey` (#808080, Lc 33) and italic, now secondary text, upright; 10px descriptions in "Als erforderlich setzen" now 13px; filter tabs like VS Code (inactive = secondary text at full opacity instead of blue at 50%, active = primary text on the content with a 2px blue top line); the lighter frame around the darker tab panel is flattened; field titles 600 over 400 descriptions (rule 11). Walker 0, light unchanged. Reach the page with `scratchpad/open-editor.js` logic: data-selection overview, gear (`button[aria-haspopup=menu]`), "Konfigurieren"; the dev server reload drops the editor state after every save. Left: titles in the "Als erforderlich setzen" list are still 400; the blue "−" expand toggles at 50% opacity; criterion and reference editors share `num-filter-tabs` and `num-tree`, screenshot them.

**From session 5 (do these first):**

1. **DONE 2026-10-23 (commit after 398910aa, 24 files).** Commit sessions 4 and 5 together: the `src/styles-next/**` files from `LC_ALL=C git status --short src/styles-next` (17 modified) plus the four new `dark-mode-tools/*` files. Never `prototype-bulk-chips.html`, `angular.json`, `ReferenceCriteriaListEntry.ts`, `playground.component.ts`. Add by explicit path, no attribution line.
2. Disabled button: still Shah's open call (design rule 7). Current = drained hue `oklch(from <500> 0.42 0.04 h)`. If he rejects it, the untried candidates are listed in rule 7; compare them in one stacked screenshot (inject + `ffmpeg vstack`), not one by one.
3. Screens not looked at since the session-5 lift (`#272727`) and the red/yellow ladder: dialogs (save, download, error log, validation, about), datepicker, user menu, snackbars, criterion modal tabs, bulk search results, result page, a warning chip and an info tile (status tints `#39292a` / `#373223`). Walker + `offramp-scanner.js` (`format: script`) + screenshot each.
4. Line weights (rule 11) on the pages not measured yet: outline buttons (2px ring), chips, table borders, dialog borders. Measure with the stem table; a plain line in dark is 1px.
5. Typography (rule 11, open): type scale x1.125 in dark vs 1.0 (layout differs between themes); the 10-12px labels (`Unbekannt`, badges, availability) at 400 have stems under 1px. One change at a time, screenshot, Shah judges.
6. Logo: `filter: brightness(1.4)` predates `#2971a7` and the lifted chrome `#2f2f2f`; check.
7. Unused leaks: `num-divider-color--a/--w` read Material palettes (0 uses); delete or move to `role-color` when touching that file.
8. Never run in session 5, still open from sessions 1-4: full Cypress light and dark (`run-cypress-both.sh`, M3 and M4), `npm run build` (M2), Lighthouse a11y dark vs light (M6), leftover hex count (M7), CSS size gate decision (M8, now 189 KB / 25.3 KB gzip). Run them after the commit and before any new design change, and do not touch `src/` during a run.
9. Ask Shah for a reference: his VS Code and Vim dark themes are the taste anchor (surfaces `#1f1f1f` to `#2b2b2b`, text `#cccccc`, selection blue, 1px lines, no glow). A cropped screenshot of his editor sampled with `ffmpeg` (insight 18) gives exact values for what is still unclear (tab bar, list hover, scrollbar).

**Older items (sessions 1-3):**

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

| Job                                    | Light                | Dark                                 | Contrast (page / card)                |
| -------------------------------------- | -------------------- | ------------------------------------ | ------------------------------------- |
| page (`neutral 50`)                    | `#f9f9f9`            | `#12161b`                            | base                                  |
| card, dialog (`neutral 0` as surface)  | `#ffffff`            | `#1a1f26`                            |                                       |
| hover, track (`neutral 100`)           | `#f1f2f3`            | `#222831`                            |                                       |
| `neutral 200`                          | `#e8ebed`            | `#2b323b`                            |                                       |
| divider, border (`neutral 300`)        | `#c5cacf`            | `#3a434d`                            | 1.8 (decoration, light is 1.5)        |
| control border (`neutral 700`)         | `#7c8b98`            | same                                 | 5.2                                   |
| `text`                                 | `#000000`            | `#cccccc` (VS Code Dark Modern text) | 10.3 on card                          |
| `secondary-text`                       | `#6a7483`            | `#a9b6c2`                            | 8.8 / 8.0                             |
| `section-text`                         | `#5f6266`            | `#b4bcc4`                            | 9.5 / 8.6                             |
| placeholder                            | `#5f6773`            | `#9aa4af`                            | 7.2 / 6.6                             |
| accent fill 500 + white text           | `#49689c`            | same                                 | white on it 5.61                      |
| accent hover 600                       | `#3c5786`            | same                                 | white on it 7.24                      |
| accent text / icon / link              | 500-600              | `accent 300` `#98accd`               | 7.9 / 7.2                             |
| accent graphic (was 400)               | `#7992be`            | same                                 | 5.8 / 5.3                             |
| accent border 200                      | `#bbc8dd`            | `accent 700` `#2f476f`               | decoration                            |
| accent tint 50                         | `#f2f4f8`            | `accent 900` `#182640`               | tint only                             |
| accent emphasized fill 100             | `#dde3ee`            | `accent 800` `#233657`               | text 200 on it about 8                |
| accent hover 75                        | `#e8ecf3`            | new half step between 900 and 800    |                                       |
| focus ring                             | `accent 800/900`     | `accent 200` `#bbc8dd`               | 10.7                                  |
| secondary fill (green 500, black text) | `#9bb823`            | same                                 | 8.0                                   |
| secondary text (700)                   | `#758c17`            | `secondary 400` `#bdd84f`            | 11.3                                  |
| danger text                            | `#c4122f`, `#b30519` | `danger 300` `#ff8383`               | 7.6                                   |
| danger fill                            | `#ff4545`            | same, black text                     |                                       |
| warning                                | `#eeb70c`            | same                                 | 9.9                                   |
| shadows                                | `rgba(0,0,0,.1)`     | `.4`-`.5`                            | dark theme needs its own `--shadow-*` |

Rule behind the map: fills keep their color (white text still passes), everything drawn as text, icon or line moves to a lighter shade, tints and surfaces move to the dark end.

## VS Code reference (Dark Modern vs Light Modern)

Source: `extensions/theme-defaults/themes/dark_modern.json` and `light_modern.json` (microsoft/vscode, also in the local install under `resources/app/extensions/theme-defaults/themes/`). Same ~190 role-named keys (`sideBar.background`, `button.foreground`, ...) in two files with different values, each file includes a base (`dark_plus.json`). That is our `roles` + `fdpg-light` / `fdpg-dark` structure.

| Job                                        | Light                 | Dark                  | Light L% → Dark L% |
| ------------------------------------------ | --------------------- | --------------------- | ------------------ |
| editor (content)                           | `#FFFFFF`             | `#1F1F1F`             | 100 → 12           |
| sidebar, activity bar, status bar (chrome) | `#F8F8F8`             | `#181818`             | 97 → 9             |
| widget, menu, quick input                  | `#F8F8F8`             | `#202020`             | 97 → 13            |
| border                                     | `#E5E5E5`             | `#2B2B2B`             | 90 → 17            |
| input fill / input border                  | `#FFFFFF` / `#CECECE` | `#313131` / `#3C3C3C` | 100 → 19 / 81 → 24 |
| text                                       | `#3B3B3B`             | `#CCCCCC`             | 23 → 80            |
| inactive text                              | `#616161`             | `#9D9D9D`             | 38 → 62            |
| placeholder                                | `#767676`             | `#989898`             | 46 → 60            |
| button fill                                | `#005FB8`             | `#0078D4`             | 36 → 42            |
| button hover                               | `#0258A8`             | `#026EC1`             | 33 → 38            |
| link                                       | `#005FB8`             | `#4daafc`             | 36 → 65            |
| error                                      | `#F85149`             | `#F85149`             | same               |

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

| Lever                                                         | Verdict for us                                                                                                           |
| ------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------ |
| Lower weight by about 50 (700 → 650)                          | Not possible: static 400/600/700 only. 600 → 400 is too big a jump. Skip unless we add a variable font.                  |
| Softer text color (done: `#ccd1d6`, 11.8:1)                   | Main lever. Less contrast = less bloom. Already in the map.                                                              |
| Letter-spacing +0.01 to 0.02em on body and small text in dark | Cheap: `fdpg-dark/_type-roles.scss` copy with `letter-spacing` set. Judge by screenshot, add only if text looks cramped. |
| Line height +0 to 2px                                         | Optional, same file. Only if cramped.                                                                                    |
| `-webkit-font-smoothing: antialiased`                         | macOS only, no effect on Windows/Linux, never verified for this. Skip.                                                   |
| Dark-specific typeface                                        | Overkill. Skip.                                                                                                          |
| Weight 600 for small text (table header, labels)              | Keep. Thin 400 at 14px on dark is the harder case to read than 600.                                                      |

**Other levels to research and decide while looping**

| Level                                                         | Light now                                                       | Dark plan                                                                                                                                     |
| ------------------------------------------------------------- | --------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------- |
| Borders                                                       | 1px `neutral 300`                                               | Keep 1px, `#3a434d`. Borders replace shadows (VS Code, guides). Cards without border get one in dark.                                         |
| Shadows                                                       | `rgba(0,0,0,.1)` in `--shadow-*` (7 variables in `styles.scss`) | Barely visible on dark. Raise alpha to .4-.5, and rely on surface step plus border for depth.                                                 |
| Elevation steps                                               | page / card                                                     | page < card < hover < raised (menu, tooltip, dialog = one step lighter).                                                                      |
| Images, logo                                                  | dark-blue logo                                                  | Logo loses contrast on dark (Dark Reader trial). Needs a light variant or a light backing. Other raster images: slight dim or border.         |
| Icons                                                         | accent / grey fills                                             | Use accent text variable (300). Check SVG `fill` set inline.                                                                                  |
| Focus ring                                                    | accent 800/900, 2px                                             | `accent 200` `#bbc8dd`, 2px, 3:1 minimum. Keep on `:focus-visible`.                                                                           |
| Form controls                                                 | white fill, grey border                                         | Own fill (`hover` step), own border; autofill override so Chrome's white or yellow fill does not show. `color-scheme: dark` for native parts. |
| Disabled state                                                | `neutral 400`                                                   | Re-check: grey 400 on dark may read as active. Needs contrast between 1.5 and 3:1.                                                            |
| Selection, scrollbar                                          | `#c5cacf` / `#f1f2f3` literals in `styles.scss`                 | Tokenize; scrollbar track = card step, thumb = border step.                                                                                   |
| Alpha overlays                                                | `rgba(role, .08/.4)` in buttons, action bar                     | Re-check each; alpha on dark surface shifts hue.                                                                                              |
| Toggle flash                                                  | n/a                                                             | Set theme before first paint (attribute on `<html>` in `index.html`) to avoid a white flash on reload. Disable transitions during the switch. |
| Charts, TS colors (`AvailabilityStatus`, `QueryResultMapper`) | hex in TS                                                       | Out of scope (decision), list as known gap.                                                                                                   |

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

| Job                                                                                                               | Agent                                                                             | When                                     | Writes?                                                               |
| ----------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------- | ---------------------------------------- | --------------------------------------------------------------------- |
| Classify the 52 `--color-accent` files: text/icon, fill, border, or mixed (per usage line)                        | `caveman:cavecrew-investigator` x 3-4, split by folder                            | Iteration 2, before the rename           | No. Returns a table the main loop uses                                |
| Accent rename in the classified files                                                                             | `caveman:cavecrew-builder` or `general-purpose`, **disjoint file sets** per agent | Iteration 2                              | Yes, only its own files. Main loop reviews the diff, runs M1, commits |
| Independent verifier: runs M1-M9, compares to the log, says pass/fail per gate                                    | `general-purpose`, fresh context, no knowledge of my edits                        | End of every iteration                   | No. Reports numbers only                                              |
| Screenshot reviewer: light vs dark pair per page, lists visual defects against the Best practice list and the map | `general-purpose`                                                                 | Iterations 1, 5, 10 before Shah's review | No                                                                    |
| Code review of the iteration diff (only dark-mode scope, outside edits flagged)                                   | `caveman:cavecrew-reviewer`                                                       | Before each commit                       | No                                                                    |

Rules:

- Max 4 agents at once. Never two writers on the same file.
- Subagents do not commit, do not touch git state, do not edit the plan or the logs; the main loop writes the Metrics log and Outside edits rows from their reports.
- A subagent report is evidence, not a verdict: the main loop re-checks one number from each verifier report before trusting it.
- Chrome DevTools has one browser: only one agent at a time uses it. The verifier owns it during gate runs.
- Cost: verifier and builders are worth it when the task is large (iteration 2, sweeps). For small iterations (9) do it inline.

## Metrics and stop rules

Baseline taken in iteration 0, one row per iteration appended to `## Metrics log` at the bottom of this file. Numbers, not impressions.

| #   | Metric                         | How                                                                               | Gate                                                                                                |
| --- | ------------------------------ | --------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------- |
| M1  | Light CSS diff                 | build before/after, `diff` of compiled light rules                                | **Hard**: 0 changed lines except intended new variables                                             |
| M2  | Build + lint                   | `npm run build`, `npm run lint`                                                   | **Hard**: pass                                                                                      |
| M3  | Cypress, light                 | full suite                                                                        | **Hard**: same pass count as baseline                                                               |
| M4  | Cypress, dark preset           | full suite with `data-theme=dark`                                                 | Pass count never drops vs previous iteration; 100% at iteration 10                                  |
| M5  | Contrast violations, dark      | contrast walker over the page list                                                | Count never rises vs previous iteration; **0** text under 4.5 and 0 UI under 3.0 at iteration 10    |
| M6  | Lighthouse a11y, dark vs light | `lighthouse_audit` per page                                                       | Dark `color-contrast` failures <= light, score >= light                                             |
| M7  | Leftover hex in `styles-next`  | `grep -rEc '#[0-9a-fA-F]{3,8}\b\|rgba?\(' src/styles-next` minus the allowed list | Falls or stays per iteration; 0 outside the theme folders and the out-of-scope list at iteration 10 |
| M8  | Compiled CSS size              | `styles.css` bytes                                                                | <= baseline +60%                                                                                    |
| M9  | Pages screenshotted            | page list x 2 themes                                                              | 100% of pages touched by this iteration                                                             |

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

Session 4 tools (in `dark-mode-tools/`, not committed yet): `offramp-scanner.js` (`evaluate_script` with `sourcePath`; colors not on the ramp), `apca-contrast.mjs` (`'#text:#bg:label'` pairs, prints APCA Lc and WCAG ratio), `oklch-inspect.mjs` (hex to OKLCH and HSL), `oklch-ramp.mjs` (builds the shared ladder for any hue, with Lc checks). The `.mjs` files need three npm packages outside the repo, see their first line.

Outside tools found in research, not installed: [Ignite UI Theming MCP](https://mcpservers.org/servers/igniteui/igniteui-theming) (Angular Sass light/dark themes), [a11y-feedback-mcp](https://glama.ai/mcp/servers/mo0fqyv1a5) (contrast pair fixes), [axecap](https://glama.ai/mcp/servers/ICJIA/axecap-mcp) (axe-core audits), [Radix custom palettes](https://www.radix-ui.com/colors/docs/overview/custom-palettes), [Leonardo](https://leonardocolor.io/) (contrast-target ramps), [sass-apca](https://npmjs.com/package/sass-apca). The Impeccable detector reads static CSS only and does not see the dark theme.

Dev server `npm start` (:4200), backend on :8090, Keycloak on :8080, login `testuser` (password from Cypress config). Dark Reader snippet: load the script tag, then `DarkReader.enable({ brightness: 100, contrast: 90, sepia: 0 })`.

## Sources

[Material 2 dark theme](https://m2.material.io/design/color/dark-theme) · [Radix Colors](https://docsearch.algolia.com/mcp/docs/repo/radix-ui/colors) · [Atmos color tokens](https://atmos.style/glossary/color-tokens) · [SaaS dark mode patterns](https://www.saasui.design/blog/saas-dark-mode-theming-ux-patterns) · [Primer color](https://primer.style/foundations/color/overview) · [Dialtone color usage](https://dialtone.dialpad.com/design/colors/usage/). Search snippets only; Material 3 not checked.

## Metrics log

| Iter         | M1                                                                                                                  | M2                                                                                | M3                                                                  | M4              | M5                                                                             | M6      | M7      | M8                                 | Notes                                                                                                                                                                                                                                                                                                                                                                                                             |
| ------------ | ------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------- | ------------------------------------------------------------------- | --------------- | ------------------------------------------------------------------------------ | ------- | ------- | ---------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 0 (baseline) | n/a                                                                                                                 | n/a                                                                               | not run                                                             | not run         | n/a                                                                            | not run | n/a     | 99744 B (gzip 14219)               | `sass` standalone on `styles.scss`, light only                                                                                                                                                                                                                                                                                                                                                                    |
| 1            | pass (0 removed lines, only sourcemap comment differs)                                                              | lint of changed files pass, dev-server compile pass, full `npm run build` not run | not run                                                             | not run         | not run                                                                        | not run | not run | 182575 B (+83%), gzip 23931 (+68%) | Over the +60% gate. Cause: themed mixins compiled twice (+55 KB) and 14 Material color mixins. Proposal: gate on gzip <= +100%. Jest does not start here (`esbuild` Buffer invariant), so `num-data-cy.registry.spec.ts` was not run; `theme-toggle` is in both template and `FIXED_HOOKS`.                                                                                                                       |
| 2            | pass (only the renamed uses and the new `--color-accent-text/-line` vars; `on-fill` white is identical in light)    | lint pass via hook                                                                | not run                                                             | not run         | cohort-definition only: 9 of 27 text nodes bad (walker `scratchpad/walker.js`) | not run | not run | not measured                       | Split done as text/line/fill: `--color-accent` stays the fill (no rename of the ~60 fill uses, no effect), `-text` (dark 300) for `color`, `-line` (dark 400) for border/outline/inset ring. 48 outside files renamed mechanically; `playground.component.ts` untouched (your dirty file), `src/styles/` (old, unused) reverted. `on-fill` key in the foreground map replaces `neutral 0` as text on a fill.      |
| 3            | pass (light diff = iteration 2 lines + links, tabs, cancel, chips now `var(--color-accent-strong/-text)`, same hex) | lint pass via hook                                                                | not run                                                             | not run         | cohort-definition: 2 of 27 bad (green button white text 2.26, iteration 4)     | not run | not run | not measured                       | Header, footer, side menu, logo (`filter: brightness(1.4)` in dark, no new svg), links, tabs. Dark palette keys: 50-200 are remapped tints, so lighter text shades live in theme keys (`accent-on-tint-shade`, `accent-strong-shade`, `accent-deep-shade` = `A100` in dark). Mixins read `map-get($theme, dark)` for one-off literals (footer border, header shadow, logo).                                       |
| 4-6          | pass (light CSS diff = only intended variable swaps, same hex)                                                      | lint pass via hook                                                                | partial run, 57 passed, 0 failed, stopped by me for design changes  | not run yet     | walker over 10 pages and the criterion editor: 0 text violations (after fixes) | not run | not run | 184740 B, gzip 24302               | Buttons (green/red black text on fill), 46 component SCSS files to variables, Material surfaces from our map, scrollbars, shadows, autofill, tooltip, placeholder. Shah feedback: greys now VS Code Dark Modern, green softened (`#66ad78` fill, `#8fc29d` text), +0.01em letter-spacing on body/small roles in dark, page-header intro text `accent 300`.                                                        |
| 7            | pass (only variable swaps)                                                                                          | lint pass via hook                                                                | not run to the end, runs were stopped four times for design changes | not run         | 0 text violations on every swept page                                          | not run | not run | not measured                       | Shah feedback round: chrome `#232323` vs content `#1b1b1b` (small step), grey-blue accent tints, softer borders (dividers `#363636`, control border `#6a6a6a`, accent line 500, button rings 55%), green fill `#5a9a6b` with `#8fc29d` text, type roles and Material levels x 1.125 in dark (side menu stays 1.0 so labels do not wrap) plus `-webkit-text-stroke: 0.2px` as weight stand-in, intro text neutral. |
| 8            | pass                                                                                                                | lint pass via hook                                                                | 57 passed, 0 failed (stopped, partial)                              | never completed | 0 violations on all swept pages                                                | not run | not run | 184 KB, 24 KB gzip                 | Final look of session 1 (see Where we stand).                                                                                                                                                                                                                                                                                                                                                                     |

## Known gaps (out of scope, found while looping)

- Status literals (`snackbar` white on `#9bb823`, `#dc3545`, error-log hex) are unchanged. In light the snackbar green with white text is 2.26:1 (existing).
- `git checkout --` on `playground.component.ts` by mistake wiped Shah's dirty edit once; restored byte-identical from the lint-staged backup stash (66 insertions again). Never `git checkout --` a dirty file.
- Toggle `aria-label` is a `currentLang` ternary (`Dunkelmodus` / `Dark mode`): `src/assets/i18n/**` is off-limits, move to translation keys later.
- Hex in TS (`AvailabilityStatus`, `QueryResultMapper`), hex in component SCSS outside `styles-next`.

## Outside edits (revert list)

| Iter | File                                                                                                                        | What                                                                                                                          | Why                                                                                  |
| ---- | --------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------ |
| 1    | `src/index.html`                                                                                                            | inline script sets `data-theme` from localStorage before paint; dark colors for the error screen                              | no white flash on reload                                                             |
| 1    | `src/app/layout/components/theme-toggle/theme-toggle.component.ts` (new)                                                    | header toggle button, stores `theme` in localStorage                                                                          | switch                                                                               |
| 1    | `src/app/layout/components/header/header.component.{ts,html}`                                                               | imports and places `<num-theme-toggle>`                                                                                       | switch                                                                               |
| 1    | `cypress/e2e/Theme/theme-toggle.feature`, `cypress/support/step_definitions/theme.cy.ts` (new), `cypress/support/dataCy.ts` | toggle spec, `theme-toggle` hook                                                                                              | test the toggle (not run yet)                                                        |
| 2    | 48 component files (`*.scss`, a few `.html`/`.ts` inline styles)                                                            | `color`/`text-decoration`/`fill` -> `var(--color-accent-text)`, `border`/`outline`/`box-shadow` -> `var(--color-accent-line)` | blocker 1, light value identical; revert with `git revert` of the iteration 2 commit |
| 1    | `cypress/scripts/lint-features.mjs`, `cypress/TESTING.md`                                                                   | `theme` added to cross-cutting components                                                                                     | feature lint accepts `@component:theme`                                              |
