# Accent (blue) rules

Global rules for every blue surface, border, icon and text in the UI. Decided 2026-10-22 (Shah + Claude). Source of truth for the values: `palettes/_blue.palette.scss`; CSS variables: `custom-material/base/_color-variables.themed.scss`. Components read the variables, never a literal hex and never an alpha tint (`rgba(accent, 0.1)`): an alpha tint changes with whatever is behind it.

Brand blue = accent 500 `#49689c` (white on it 5.6:1). Hue is 218 for the whole ramp.

## 1. Shades and their job

| Shade | Hex | Job | Variable |
|---|---|---|---|
| 50 | `#f2f4f8` | resting tinted fill | `--color-accent-bg` |
| 75 | `#e8ecf3` | hover fill of a large 50 surface (half step, hover only) | `--color-accent-bg-hover` |
| 100 | `#dde3ee` | emphasized fill: hover of a small item, active option, badge, switch track, drag placeholder | `--color-accent-bg-strong` |
| 200 | `#bbc8dd` | line: border, divider, inset ring, range track. Also the "selected" fill of a table row | `--color-accent-border` |
| 300 | `#98accd` | hover of a 200 border. Otherwise decoration only, no text | `--color-accent-border-hover` |
| 400 | `#7992be` | only a non-text graphic that needs 3:1 on white. Unused today | none |
| 500 | `#49689c` | brand: filled button, link, icon, text on white or on a 50 fill | `--color-accent` |
| 600 | `#3c5786` | hover/pressed of a 500 item; text on a 100 or 200 fill | `--color-accent-strong` |
| 700 | `#2f476f` | keyboard focus fill, intro text | (via `role-color`) |
| 800, 900 | `#233657`, `#182640` | very dark text, focus ring | (via `role-color`) |

Fills go 50, then 100, then 200 as the state gets stronger.

## 2. Rules

**R1. A blue box has a fill and a hairline border.** Fill = 50. Border = `1px solid var(--color-accent-border)` (200). Applies to every card, tile, panel and box that has a blue fill. No box with a blue fill and no border.

**R2. Hover = one step darker, on the same ladder. Text stays as it is.**

| Rests as | Hover becomes |
|---|---|
| no fill (transparent) | 50 |
| 50, large surface (box, card, tile, panel) | 75 |
| 50, small item (row, chip, list item) | 100 |
| 100 | 200 |
| border 200 | border 300 |
| 500 (button, solid fill) | 600 |
| 600 | 700 |

Always transition (0.2s `ease`) for `background-color` and `border-color`.

**R3. Icons and text follow the same ladder.** A blue icon or link rests at 500 and goes to 600 on hover (`--color-accent-strong`). On a 100 or 200 fill it rests at 600 and goes to 700. An icon never fades with `opacity` on hover (it lowers contrast).

**R4. Text on blue.** On white or on a 50 fill: 500 or darker. On a 100 fill: 600 or darker (5.6:1). On a 200 fill: 700 or darker (600 is only 4.3:1). Never lighter than 500. Shade 400 and lighter never carry text or an icon that conveys meaning.

**R5. Keyboard focus is stronger than hover.** A focused element uses the next step above its hover: buttons 700, a ring of 2px in 500 or darker (`:focus-visible`). Focus is never a fill-only change.

**R6. Disabled.** A disabled blue item keeps its shape and drops to the neutral look (grey 50 fill, blue text and ring). No `opacity` on the whole element: it fades the white and lets the background through.

**R7. Non-interactive boxes.** A box that is not clickable (info tile, information section) follows R1 but has no hover. Hover only on things you can press, drag or select.

**R8. Contrast numbers to keep:** white on 500 = 5.6:1 (AA), white on 600 = 7.2:1 (AAA), white on 700 = 9.3:1. A UI edge needs 3:1 (WCAG 1.4.11); a hairline border is decorative when the box has a fill and a text label.

**R9. Form controls need a stronger border than boxes.** The 200 hairline is 1.7:1 on white, below the 3:1 of WCAG 1.4.11. It is fine on a box with a fill and a label (R1). An input, select or checkbox uses `--num-color--control-border` (neutral 700, 3.5:1).

## 3. Applied so far (2026-10-22)

- Palette shifted: 500 is the old 600; 600 to 900 one step darker. Half-step shade 75 added.
- Variables: `--color-accent-bg` (50), `--color-accent-bg-hover` (75), `--color-accent-bg-strong` (100), `--color-accent-border` (200), `--color-accent-border-hover` (300), `--color-accent-strong` (600). Removed: `--num-color--accent-400`.
- R1 + R2 (box part): criterion box (`shared/components/criteria-box`), data selection box (`.num-card` in `general-styles/_ui-classes.scss`).
- Fills that used the old 20% variable now use `-bg-strong`: drag placeholder, search-filter count badge, linked badge, search-mode toggle hover, bool-logic switch track.
- Text on 400 moved to `--color-accent-strong`: selected-items-list, menu, card link in `_ui-classes`.
- Filter chips (`custom-material/components/_filter-chips.themed.scss`): border 200, count badge fill 100 with 600 text.
- Buttons: `blue` variant 500 / 600 / 700 (rest / hover / focus).
- Table (`_general_table.themed.scss`) already uses 50 / 100 / 200 for row / hover / selected.

## 4. To apply (go through the UI with R1 to R7)

Check each: fill 50 and border (R1), hover (R2, only if interactive, R7), icons (R3), text on the fill (R4).

Blue fill, no border or no hover yet (from `--color-accent-bg` users):
- `shared/info-tile`, `shared/information-section` (static: R1 only)
- `shared/header` (has border; check hover), `shared/switch`, `shared/selected-items-list`
- `shared/validation-modal`, `shared/download-crtdl`, `shared/profile-reference-chip` (has border; check hover)
- `shared/list-item-details/list-item-details-sections` (has border; fallback literal `#f1f2f3` to remove)
- `shared-filter/concept/search-concept`, `shared-filter/concept/selected-concept-list`
- `data-selection/editor/display/apply-time-restriction`, `feasibility-query/editor/stage/apply-time-restriction`
- `data-selection/.../colums/reference-col` (has fill and border; check hover)
- `feasibility-query/editor/stage/consent-switches`, `feasibility-query/editor/display/display-criteria`
- `feasibility-query/editor/criterion-modal/concept`, `feasibility-query/search/bulk/input/bulk-search-input`
- `query-editor/query-editor`, `query-editor/.../profile/reference/modal-window`, `query-editor/.../criterion/header`
- `layout/error-log/error-log-item`
- Side menu active item (`--side-menu-bg-active` = 50): check hover on the other items

Icons and text:
- `shared/criteria-box` `.menu-icon:hover { opacity: 0.8 }` breaks R3: use 500 to 600.
- Icons that use `--color-accent` or `--num-color--primary-blue` without a hover color: user menu, menu cog, dashboard.
- Literals left: `#345396` fallbacks (dashboard), `#7a9a2e` (green, separate rule set).

When a component is done, tick it here and note the date.

## 5. Check against the research (2026-10-22, `research-usability-typography.md` sections 1, 6, 8)

The research is typography only. It covers colors in one table (section 6, contrast measured on the page, not on hover or focus states) and one idea block (section 8, "existing shades fix most failures").

**Matches**
- Section 8 proposes "accent 600 `#49689c`" for reset button, links and toggle. That is exactly the new accent 500. Fixes section 6 rows: reset button 4.17 to 5.33, active toggle 4.39 to 5.61 (on `#f9f9f9` / white).
- "Use existing palette shades, no new colors": rules use only palette shades (plus the half step 75).
- "Color counts for visual weight": R4 picks the text shade by surface.
- Insights: `border-box` and a fixed total height stop a layout jump when a border changes. R2 changes border color only, never width. Component SCSS cannot call `role-color`, so variables: same pattern.
- WCAG 2.5.8 target 24px: no rule here shrinks a target.

**Gaps and conflicts**
1. Green is not covered. Section 6: green 500 fails everywhere (2.26:1: filled button, outline, count badge). Research suggests green 800 `#607311` (5.31 on white). The action bar buttons and the white-with-green-icon disabled look still fail. Open.
2. Secondary text on the new fills fails. `#6a7483`: 4.73 on white, 4.49 on page, **4.30 on 50, 3.99 on 75 (hover), 3.67 on 100**. Boxes with grey meta text (criterion box info line, data selection box columns) fall below 4.5 and get worse on hover. The research already put this text 0.01 short on the page. Candidate from the plan (`PLAN.md`) and research: neutral 900 `#5e6c78`: 5.4 white, 4.9 on 50, 4.55 on 75, 4.19 on 100. Needs a decision.
3. Text on a 200 fill: 600 is 4.3:1, so R4 now says 700 (5.5:1).
4. Border contrast: 200 on white 1.69, on 50 1.54, below 3:1. Fine for filled boxes; not for controls. Added as R9.
5. Hover, focus, disabled (R2, R5, R6) and icons (R3) have no research behind them. The research states hover and focus were not measured. These rules come from this session; check them in the browser and with a contrast pass on states.
6. Hover color lowers text contrast: text on 75 and 100 must be checked (see 2).
