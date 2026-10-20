# Design tokens: research (Material, Sass, first folder proposal)

Reference. Moved out of `PLAN-design-tokens.md` 2026-10-20, text unchanged. Read only when the question needs it.

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

