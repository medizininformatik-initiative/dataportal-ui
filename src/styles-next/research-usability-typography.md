# Typography: research summary and draft decisions

Date: 2026-10-19. Scope: typography only (size, line height, weight, family). Colors, borders and box sizes stay as they are. No code changed.
Next to `PLAN-design-tokens.md` and `typography-prototype.css`.

Confidence tags: **[W3C]** read on w3.org. **[DS]** design system page read. **[LOCAL]** read from installed `@angular/material` 19.2.19. **[NN/g]** / **[Baymard]** read. **[BLOG]** low trust. **[ME]** my knowledge, not checked. **[SCSS]** read from our `.scss` files, not measured in a browser.

## 1. Rules that must hold (WCAG 2.2) [W3C]

| Rule | Says | Meaning for us |
|---|---|---|
| 1.4.3 Contrast (AA) | Text 4.5:1. Large text 3:1. Large = 24px regular or 18.66px bold. | Size decides the needed contrast. 18px bold is not large. |
| 1.4.4 Resize text (AA) | 200% without loss. Relative units recommended. | Prefer `rem`. No fixed-height containers around text. |
| 1.4.12 Text spacing (AA) | No clipping at line height 1.5, letter spacing 0.12em, word spacing 0.16em. | Unitless `line-height: 1` and fixed `height:` on text boxes break this. Use `min-height`. |
| 1.4.8 Visual presentation (AAA) | Paragraph line height 1.5, at most 80 characters, not justified. | Goal for running text only. |
| 2.5.8 Target size (AA) | Click target at least 24x24px. | Applies to small toggles and badges. |
| 1.4.11 Non-text contrast (AA) | Control borders 3:1. | Colors, out of scope here. |

## 2. What other systems do

- **Body size:** UI 14px (Carbon productive, Material 3 `body-medium`), running text 16px (USWDS, Atlassian, Carbon expressive) [DS][LOCAL]. Nothing below 11-12px; we have two 10px uses.
- **Line height:** body 1.4-1.5, small text 1.33, headings 1.1-1.35. Values sit on a 4px (or 5px) grid [DS][LOCAL].
- **Weight:** 400 and 600 (Carbon). No checked system uses 300 at small sizes. Same size with another weight is a valid level (Carbon `heading-01` vs `body-01`) [DS].
- **Hierarchy:** about 3 clear size tiers (NN/g). 2-4px between heading levels, never skip a level (Atlassian). Carbon's ladder: 12, 14, 16, 20, 28, 32, no 18 [DS][NN/g].
- **Measure:** 45-90 characters, ideal about 66, `max-width` about 70ch for paragraphs only [DS][Baymard].
- **Family:** one UI family plus mono for code. No checked system mixes two sans families for UI text [DS]. Tabular numerals (`font-variant-numeric: tabular-nums`) keep number columns aligned [BLOG][ME].

## 3. How to map components (standard used)

- **Levels: Atomic Design** (Brad Frost): atom, molecule, organism, template, page. One level per component.
- **Catalog: Interface Inventory** (Brad Frost): one row per component with source file, role, text style today, proposed level.
- **Structure: composition tree** (UML composite structure idea, parts inside a whole). Ports and connectors skipped, a page hierarchy has none.
- Deliverable: artifact "Search Component Map" (tab Map: layout sketch, tree, inventory; tab Redesign: mock, levels, change list). Covers the feasibility search page only, 29 components (C01-C29).
- Assign levels by the role of the text, not by CSS values. Roles: page title, section heading, intro, field label, input value, hint, table header, table cell, button, toggle, badge, nav item, breadcrumb.

## 4. Findings in the running app (measured 2026-10-19, test user, 1400x900, computed styles)

Earlier `.scss` reading was cross-checked in the browser. Confirmed: title 30/46/700, description 18/22/600, section name 14/19/600, toggle 12/12/600, portal link in Open Sans. Corrected: see the "wrong" rows.

- **Most controls are 16/24, not 14.** Selects, buttons (600), nav items (600, active or not), breadcrumb link, user menu, language select. Only the search input (14/normal), table cells (14/19) and body (14/20) are 14.
- **Table header is 12/14/700 Open Sans**, smaller than the 14/19 cells. Table and portal link use Open Sans (external request); everything else Titillium Web.
- **No heading element on the page** (no h1-h6, no `role=heading`). The title is a `<p>`.
- **Description** is hidden by default (eye button). Shown: 5 lines at 1003px, over 80 characters per line, 18px/600.
- **Letter-spacing** is 0.25px on body, buttons, table and 0.5px on 16px Material text. Not planned for yet.
- **Breadcrumb:** link 16/24/400, current 14/32/500, separator 24/32/500. Weight 700 `bold` keyword is not what renders here.
- **Nav:** weight 600 on every item, so weight does not show the active state. 4 items for the test user.
- Other sizes in use: 12.8 (toggle icon), 13.3 (eye button default), 20 (language host).
- Map was missing: availability cell and status bar (12/14 label, 4px bar), row icon cell, row checkbox, info icon, three icon buttons in the action bar. Added.
- No horizontal overflow at 1400px. Text-spacing test (WCAG 1.4.12 values injected): no clipped text found by an automatic check. First pass only, no visual check.
- **Bulk search** (`/feasibility-query/bulk-search`): same title 30/46/700. Textarea 14/normal/500 (Titillium has no 500 loaded, renders as 400). Search button 16/24/600 blue outline. Empty-state text **24px with line-height 20px** (#6a7483): line height below font size. No heading element. Action buttons 16/24/600.
- Weight trap still true in code: keyword `bold` = 700, `--font-weight-bold` = 600.

## 5. Draft decisions (typography only)

Six levels. Most controls are already 16/24, so 16 stays the control size and only outliers move. Line heights on a 4px grid, weights 400 and 600, one family (Titillium Web), sizes in `rem`.

| Level | Size / line | Weight | Used for |
|---|---|---|---|
| h1 | 24 / 32 | 600 | page title, as a real `h1` |
| control-strong | 16 / 24 | 600 | section name, buttons, active nav, current breadcrumb, portal link |
| control | 16 / 24 | 400 | intro (max 70ch), input, selects, nav, breadcrumb link, user menu, language |
| body | 14 / 20 | 400 | table cells, page default |
| label | 14 / 20 | 600 | table header, mode toggle |
| meta / meta-s | 12 / 16 | 400 / 600 | availability label, hints, badge |

Ladder: 12, 14, 16, 24. Steps 1.17, 1.14, 1.50. Removed: 18, 20, 30, 13.3, 12.8. Real `h2` (20/28/600) only when headings exist.
Changes: title 30/46/700 to 24/32/600; description 18/22/600 to 16/24/400; section name 14 to 16; input 14 to 16; table header 12/14/700 to 14/20/600 and table to Titillium; portal link to Titillium 16/24/600; toggle 12 to 14; breadcrumb current 14/32/500 to 16/24/600, separator 24 to 16; nav inactive 600 to 400; badge 12/22 to 12/16; no `line-height: 1` on text; `tabular-nums` on number columns.

## 6. Contrast of the current colors (measured, not changed)

| Where | Pair | Ratio | Result |
|---|---|---|---|
| Body, cells | #000 on white | 21.0 | pass |
| Title 30px bold | #6a7483 on #f9f9f9 | 4.49 | pass (large text) |
| Table header 12px | #6a7483 on white | 4.73 | pass |
| Description | #325a7e on #f9f9f9 | 6.88 | pass |
| Section name, nav | #5f6266 on #f9f9f9 | 5.82 | pass |
| Breadcrumb link | #9ea9b3 on #f9f9f9 | 2.27 | fail |
| Availability label 12px | #b0b8c4 on white | 2.00 | fail |
| Green outline buttons | #9bb823 on #f9f9f9 | 2.15 | fail |
| Count badge | #9bb823 on white | 2.26 | fail |
| Filled green button | white on #9bb823 | 2.26 | fail |
| Reset button | #5a79af on #f9f9f9 | 4.17 | fail |
| Active toggle 12px | white on #5a79af | 4.39 | fail |
| Empty-state text 24px (bulk) | #6a7483 on white | 4.73 | pass |

Type can help only the blue pairs, by 18.66px bold or larger (not on the ladder). The rest needs a color decision, outside this scope.

## 7. Open questions

- Q1: one family (drop Open Sans and the external font request) or two by role? Check table look in the running app.
- Q2: drop weight 500 (27 uses) and 300 (3 uses)? Unify `bold` keyword with the 600 token?
- Q3: `rem` or `px`? Recommended `rem` [ME, test in browser].
- Q4: snap outliers (0.8rem, 0.95rem, 1.1rem, 1.2rem, 13px, 10px, 28px, `medium`) to the ladder.
- Q5: keep `.num-text-*` utility classes as aliases of the new levels?
- Q6: contrast decision from section 6 (green, grey, accent pairs).
- Q7: apply the same levels to the other pages (bulk search is measured, other routes are not).
- Q8: letter-spacing 0.25px/0.5px (Material): keep, or `normal`?
- Q9: make the title a real `h1` and add heading structure (HTML change, not typography).
- Q10: bulk empty-state text 24/20: set to 16/24 `control`, or 24/32 (line height must exceed size)?

## 8. Ideas and insights (mine, not decisions)

**Work order**
1. Token step first. About 82 font-size declarations use `--font-size-md/sm`. Changing `--line-height-md` from 19 to 20 reaches its 15 uses (`--line-height-sm` stays 16, 9 uses) with no new names. Lowest risk, biggest reach. Counts from `typography-prototype.css`.
2. Outliers next: 12.8, 13.3, 18, 20 (language host), `medium`, `line-height: 1` on text, the 24/20 empty state. No decision needed except the target size.
3. Then per-component changes in the change list, one family at a time, with a before/after screenshot of each page.
4. Table family (Open Sans to Titillium) last: it is the only visible shape change and removes the external font request.

**Guard against drift**
- Add a Cypress check (the repo has Cypress and a test user): collect unique `fontFamily / fontSize / fontWeight / lineHeight` tuples of all visible text per route and assert they are a subset of the ladder. The script I used for measuring is the base. Fails when someone adds a 13px again.
- Alternative or addition: a lint rule that only allows token values for `font-size`, `font-weight`, `line-height` in `.scss`. Cheaper, but does not see Material's own styles.

**Where the 0.25px / 0.5px comes from**
- It is Material's typography config applied on top of our tokens. If the levels own `letter-spacing` (as the prototype already planned), the Material values stop leaking in. Decide Q8 first, otherwise levels inherit it by accident.

**Headings**
- Title as real `h1`, section name as `h2` costs no visual change if the level classes set the look. It gives screen reader users an outline (WCAG 1.3.1, 2.4.6) and makes the `h2` 20/28 level meaningful. HTML change, so it needs your yes (Q9).

**If a color pass is ever allowed: existing palette shades fix most failures, no new colors**
- Green outline text and badge: green 800 `#607311` on #f9f9f9 = 5.04 (white on green 800 = 5.31 for filled buttons).
- Reset button, links, toggle: accent 600 `#49689c` on #f9f9f9 = 5.33 (white on it = 5.61).
- Breadcrumb link and availability label: secondary `#6a7483` is 4.49 on #f9f9f9, still 0.01 short; grey 800 `#6c7b89` is worse (4.13). A slightly darker secondary (`#656f7d` = 4.84) would fix both the page background and the toggle pill (4.50).
- Input borders (1.65) are a separate non-text rule.
- Not applied. Colors stay out of scope until you say so.

**Process**
- Same measuring script on every route builds the inventory automatically; the component map then only needs the structure by hand. Worth doing before porting any level to Sass.
- Keep the artifact as the review tool: send it with the MD so decisions Q1-Q10 can be answered per row.
- Open Sans: if kept, self-host it (like Titillium). A health portal should not call Google Fonts.

## 9. Next steps

1. Decide Q1-Q10.
2. Run the measuring script on the other routes and states (hover, focus, empty, drawer, modals).
3. Visual check of text spacing (1.4.12 bookmarklet), browser zoom 200% and font-size 200%.
4. Port levels to Sass in `themes/fdpg-light/_typography.scss`, token step first (see section 8).

## 10. Limits

- Values measured on one page, one viewport (1400x900), German UI, test user. Hover, focus, error and empty states, the details drawer, bulk search and other pages are not measured.
- Material 3 website and Apple HIG not read. M3 numbers come from the installed Angular Material files.
- No user testing with researchers or clinic staff. Sizes are conventions, not proof for this portal.
- px/rem browser behavior and tabular-numerals benefit are from my knowledge or blog hints.

## 11. Font properties not used yet (to research, noted 2026-10-19)

Idea (Shah): besides family, weight, size and line height, CSS has more font properties. They may improve readability and the app in general. Nothing below is checked; every row is [ME] until read in a source.
Our Sass writes the four main properties as separate variables (not the `font` shorthand), so any property below can be added as its own line without a reset side effect.

| Property | What it could give us here | To check |
|---|---|---|
| `font-variant-numeric: tabular-nums` | Equal-width digits, numbers line up in columns (availability, codes). Already planned for number columns. | Does Titillium Web have the `tnum` feature? |
| `font-variant-numeric: slashed-zero` | Codes like `12962-7` or `0` vs `O` are easier to tell apart (terminology codes). | Feature in the font file? |
| `font-synthesis: none` (or `font-synthesis-weight`) | Stops the browser from faking bold/italic when a weight is not loaded (Titillium has no 500, so 500 renders as 400 today; Open Sans has no 300/500). | Effect on the 27 uses of 500. |
| `font-size-adjust` | Keeps the visual size the same when the fallback font is used (Titillium to sans-serif). | Browser support in our target browsers. |
| `font-optical-sizing`, `font-kerning`, `text-rendering` | Small legibility gains at large sizes (page title). | Does the font have an optical-size axis? Probably not; low value. |
| `font-display` (in `@font-face`, `_font.scss`) | Avoids invisible text while fonts load (`swap` / `optional`). Relevant for the external Open Sans request. | Current setting in `_font.scss` and `index.html`. |
| `font-variant-caps`, `font-stretch` | Probably no use here. | Skip unless a need shows. |
| Related, not in `font`: `text-wrap: balance` on titles, `text-wrap: pretty` on the intro, `hyphens: auto` with `lang` for narrow columns, `letter-spacing` (Q8) | Better line breaks, no single-word last line. | Browser support. Hyphenation in German text. |

Contrast: these properties do not change color contrast. What helps contrast through type is weight and size (WCAG large text is 24px regular or 18.66px bold; thin weights like 300 look lighter). So the useful items for contrast are weight choices and `font-synthesis`, not the others. Say so in the write-up so the expectation is clear.

Plan: (1) read MDN / CSS Fonts spec for each row and note the source, (2) check the font files for OpenType features (`tnum`, `zero`), (3) prototype the promising ones on the HTML page of the component that needs them (table first), (4) add accepted ones as extra variables next to the four main ones.

## Sources
- WCAG 2.2 Understanding: [1.4.3](https://www.w3.org/WAI/WCAG22/Understanding/contrast-minimum.html), [1.4.4](https://www.w3.org/WAI/WCAG22/Understanding/resize-text.html), [1.4.8](https://www.w3.org/WAI/WCAG22/Understanding/visual-presentation.html), [1.4.12](https://www.w3.org/WAI/WCAG22/Understanding/text-spacing.html), [2.5.8](https://www.w3.org/WAI/WCAG22/Understanding/target-size-minimum.html)
- [IBM Carbon type sets](https://carbondesignsystem.com/elements/typography/type-sets/), [GOV.UK type scale](https://design-system.service.gov.uk/styles/type-scale/), [USWDS typography](https://designsystem.digital.gov/components/typography/), [Atlassian applying typography](https://atlassian.design/foundations/typography/applying-typography)
- [NN/g legibility](https://www.nngroup.com/articles/legibility-readability-comprehension/), [NN/g visual hierarchy](https://www.nngroup.com/articles/visual-hierarchy-ux-definition/), [Baymard line length](https://baymard.com/blog/line-length-readability)
- [Atomic Design](https://v9.bradfrost.com/blog/post/atomic-web-design), [Interface Inventory](https://v9.bradfrost.com/blog/post/interface-inventory), [UML composite structure diagram](https://support.ptc.com/help/modeler/r10.1/en/Modeler/rtsme/ref_dia_structure_diagram.html)
- Material 3 values: `node_modules/@angular/material/core/tokens/m3/definitions/_md-sys-typescale.scss`

## Nested side navigation (searched 2026-10-19, for the side menu C09)
- **Weight, not size, marks the level.** Top-level items strong (600), nested items regular (400), same size. Carbon UI shell: link and sub-menu title 14px/600, sub-menu items 14px/400 [[Carbon](https://carbondesignsystem.com/components/UI-shell-left-panel/style/)]. Queensland design system and Salt say the same: strong top level, regular nested [[Qld](https://www.designsystem.qld.gov.au/components/side-navigation), [Salt](https://saltdesignsystem.com/salt/patterns/vertical-navigation)]. Trimble Modus: level header 14/600, back item 12/400 [[Modus](https://modus.trimble.com/components/web/side-navigation/styles)].
- **Depth:** at most 3 levels; more and the indentation is no longer readable; keep the hierarchy wide and flat [[Qld](https://www.designsystem.qld.gov.au/components/side-navigation), [NN/g via Salt](https://saltdesignsystem.com/salt/patterns/vertical-navigation)]. We have exactly 3.
- **Indentation and marks** carry the hierarchy together with weight (our rails and pill do this).
- **Not found:** a source that sets a larger size for the parent. Our 18/26 parent is not backed by any of them.
- **Consequence for C09:** option B (all 400) drops the parent/child weight signal the systems use; option C (parent 600, children 400, active 600) matches them. Active state must not rely on weight alone (WCAG 1.4.1): we also have pill, rail and color.
- **Cross-check 2026-10-19 (earlier sections vs the nested search):** sections 4 and 5 treated the nav as flat (measured: 4 items, one weight 600; draft: all inactive 400, active 600 = option B). They never looked at levels 1 to 3, because the nested menu came with the 652 merge. They do give the frame: ladder 12/14/16/24 (no 18), weights 400/600, "about 3 size tiers", and 14/20/400 exists as `body`. So: option C uses only existing ladder levels (parent = `control-strong`, child = `control`, active = `control-strong`), and parent 600 comes from the nested search, not from section 5. Option D's level 3 (14/20/400) is the `body` level, also on the ladder. Nothing in the research separates level 2 from level 3; they differ by indent and rails only. Text spacing (1.4.12): 24/16 = 1.5 ok, 20/14 = 1.43 for D (default only; the rule tests user overrides).
