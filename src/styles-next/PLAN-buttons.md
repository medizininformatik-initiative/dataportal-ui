# Button plan (draft 2026-10-22, rule changed after the action-bar session)

Goal: two button colors, chosen by place. No new look has to be built: both already exist (`green`, `blue`).

## Color logic (from the app scan)
- Blue (`accent`) = structure and information: header, info tiles, criteria boxes, links, spinner, search bar (~160 uses of `--color-accent*`).
- Green (`secondary`) = action zone. Outside buttons only ~12 uses (header gradient line, about modal, dashboard, snackbar, error log, action bar tint).
- Red (`danger`) = destructive only (confirm delete).

## Rule (Shah, 2026-10-22): the place decides
| Place | Look |
|---|---|
| Inside `num-action-bar` (green tinted bar) | green: active = filled green, white icon/text. Disabled = white, green icon/text, green ring |
| Everywhere else (on white or blue-tint backgrounds: boxes, filter bar, modals, header) | blue: the existing `blue` variant (filled `accent` 500, white text, hover 600, focus 700). Disabled = existing disabled look (light grey, blue ring, blue text) |
| Delete | red (unchanged) |

Same hover/disabled logic in both colors. Effects:
- Cog, filter reset, portal link are already `blue`: nothing changes for them.
- `cancel` (modals, white background) becomes `blue`; the `cancel` variant and `type="cancel"` go.
- The `outline` option of the green mixin is unused and can go.
- No primary/secondary split: hierarchy comes from where the button is, not from fill.

Built so far (2026-10-22): action-bar active/disabled look in `custom-material/components/_action-bar.themed.scss`. The 10% green tint is now a gradient background of the container (a `::before` overlay covered the buttons).

Risks:
- Blue 500 with white text is 4.4:1 (green 500: 2.4:1). Blue 600 `#49689c` would pass 4.5.
- Blue button on a blue-tint box (criterion box): same hue family, so the button is less striking than on white. Check in the browser.
- A disabled bar button (white + green ring) can look like an enabled one; tooltips explain it.

## Current state (scan)
- Action bars: `type="green"`. Upload / download / save are `num-button green icon`. Bar buttons are fine already.
- Green outside the bar: "Edit stage" on the result page (`result-action-bar`, inside an action bar: ok), `type="green"` in dashboard (portal button), error-display, save modals: these become blue.
- Reset filter, options cog, portal link: `blue` already.
- `cancel`: 3 uses (download modal, confirm-delete modal, etc.).

## Steps
1. Done: action-bar look.
2. Walk the templates: every `type="green"` / `num-button green` outside `num-action-bar` -> `blue`; `cancel` -> `blue`.
3. Remove `cancel` variant (`_button-cancel.themed.scss`, `ButtonComponent` type) and the unused `$outline` branch.
4. Decide shades (contrast risk) and weight 500 vs 600 / letter-spacing Q8 for the removed cancel.
5. Optional: let `num-action-bar` force green so templates need no `type`.

## Open questions
1. Blue 500 or 600 for the filled blue button (contrast 4.4 vs 5.6)?
2. Disabled bar buttons: keep white + ring, or distinguish further from enabled ones?
3. Do the green buttons in dashboard / modals really turn blue, or is the dashboard a free-standing action zone?
4. Literals to turn into roles while here: `#9bb823` (3 files), `#7a9a2e`, `#345396`, checkbox `#839e00`.
