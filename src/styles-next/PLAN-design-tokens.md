# Plan: design tokens for non-color CSS (typography, shape, size)

## NOW (2026-10-20): read this first

Everything below this block = reference and history. Nothing deleted. Where old text says "plan only" or "8 unwritten variables", this block wins.

**Focus: typography only. Colors later.**

**Done (typography roles live in components, Shah checked in browser):**
- `text-link`, breadcrumbs, `button` (incl. portal link), `page-header` (title, intro, eye button), `side-menu` (option C: parent 600, child 400, child-active 600; all 16/24).
- Global h1 rule gone. `.header-title` owns its font variables. Shah checked 2026-10-20: all fine.
- `npm run check:styles` guards typo'd variables and missing mixin includes.
- 652 merged. Side menu, `.app-body`, checkbox, 6 color variables ported to `styles-next`.
- One font: Titillium Web only (decision 8). Open Sans + Roboto removed in commit `c0c072e2` (2026-10-20). Log + undo: `design-tokens-history.md` part 5 and 5b. Shah checked in browser: looks good.
- Global `h2` rule removed (`_headings.themed.scss`; `h3`-`h5` stay). Page intro `header-description` is a `<p>` again, role variables incl. new optional role key `letter-spacing`, color from accent 700 via `--app-content-page-header-intro-color`, margin animates with the hide. Prototypes: `typography-prototype-headings.html`, `typography-prototype-intro-color.html`.
- Still open from this: roles for modal title, FAQ title, data-protection title (parked by Shah; prototype ready, 3 open questions in the reply of 2026-10-20: underline, FAQ gap 4px vs 20px, data-protection weight). Header title color `#6a7483` (4.49) and eye button `#fff` = color pass.

**Closed by Shah 2026-10-20:**
- Q9 h1: fine. Modals keep `num-header`. No second h1 wanted.
- Dead code list (`.user-button`, `.portal-link-btn`, stale specs): not checking. Skip.
- Checkbox: parked, works, fine for now.

**The 6 "unwritten" variables = already written.** Dumped 2026-10-20 with 652 values (`PLAN-side-menu.md` section 6). Nothing typography left. Only open: which color role each gets. That is color pass. Later.
`--num-color--error-on-tint`, `--num-color--error-on-white`, `--border-color-hover`, `--color-text-placeholder`, `--num-color--accent-900`, `--num-color--grey-hover`.

**Open, typography (in this order):**
1. `headings` audit: global `h2` rules in `base/_headings.themed.scss` use `!important` (letter-spacing, margin). Intro `<h2>` fights them. Scope them or move type into roles.
2. `app-content` groups: `section`, `search-bar`, `table`, `action-bar` (process below, one group at a time).
3. Font weights (decision 8 follow-up). Titillium has NO 500 and we ship only 400/600/700. Browser draws 500 and 300 as 400. Asked for 500: `$body-2` in `themes/fdpg-light/_typography.scss:10`, `button/_button-cancel.themed.scss:3`, `profile-reference-chip.component.scss:8`. Asked for 300: `$caption` (same file). Shah: not now. Options: 500 -> 400 (no visual change) or 600; 300 -> download Titillium 300 or use 400. Then: Q8 letter-spacing of non-link text, decision 9. Close before Material goes.
4. Side menu level 3 at 14/20 (option D): kept as alternative, not wanted now.

**Later, colors (`PLAN.md` step 4 and 5):** role for the two error reds + placeholder, green shade for checkbox, header title color (`#6a7483`, contrast 4.49), then convert rest of `custom-material`, then the switch.

**Always on:** `angular.json` + `app.component.ts` stay uncommitted on purpose. Run `npm run check:styles` before commits that touch `styles-next`.

---

Status (old, 2026-10-19): plan only, no code yet. Next to `PLAN.md`.
Goal: components stop hardcoding `font-size`, `font-weight`, `line-height`, `font-family`, `border-radius`, `height`, `min-width`. One central place, read by name. Same idea as `role-color` for colors.

## More files (open only when needed)
- `design-tokens-research.md`: why, how Material does tokens, Sass docs, first folder proposal.
- `design-tokens-insights.md`: insights and "for discussion" list.
- `design-tokens-history.md`: session notes 2026-10-19 (parts 2, 3) and 2026-10-20 (part 4), check script, verify metrics, 652 merge, dead code list.
- `PLAN-side-menu.md`: side menu port, steps, option C and D.
- `research-usability-typography.md`: usability research.

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
| 8 | One font family only: Titillium Web. Roboto and Open Sans go. See research Q1. | decided (Shah, 2026-10-20); removal open, list in `design-tokens-history.md` |
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

## Not in scope

- Spacing/margin/padding tokens, shadows, z-index, breakpoints. Check after sizing if a pattern shows.
- Renaming CSS variables (`--num-color--*`).
