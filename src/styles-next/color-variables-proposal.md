# Proposal: `_color-variables.themed.scss` with roles

File: `custom-material/base/_color-variables.themed.scss`. Not applied yet.
Variable names stay the same, so no component file changes.

## Mapping

| Old | New |
|---|---|
| `$accent` shade N | `role-color($theme, accent, N)` |
| `$green` shade 500 | `role-color($theme, secondary, 500)` |
| `$red` shade 500 | `role-color($theme, danger, 500)` |
| `$primary` default | `role-color($theme, neutral, 500)` |
| `$warn` default | `role-color($theme, warning, 500)` |

"Default" in `mat.m2-get-color-from-palette($p)` with no shade is shade 500 (Material M2 default).
Check: grey 500 = `#9ea9b3`, yellow 500 = `#eeb70c`.

## File after the change

```scss
@mixin color-variables_themed($theme) {
  // ── Primary palette exports ────────────────────────────────────────────────
  // Used by: feasibility-query search component
  --num-color--primary: #{role-color($theme, neutral, 500)};

  // Used by: dashboard (border/conic gradient), user-menu (icon color)
  --num-color--primary-blue: #{role-color($theme, accent, 500)};

  // Used by: data-selection search, editor action bars, bulk-search action bar
  --num-color--primary-green: #{role-color($theme, secondary, 500)};

  // ── Accent palette exports ─────────────────────────────────────────────────
  // Used by: between-filter (range track fill)
  --num-color--accent-200: #{role-color($theme, accent, 200)};

  // Used by: dashboard (text), selected-items-list, menu (icon), ui-classes (card link)
  --num-color--accent-400: #{role-color($theme, accent, 400)};

  // Used by: between-filter (range thumb)
  --num-color--accent-600: #{role-color($theme, accent, 600)};

  // Brand accent. Used by: ~55 components (criteria-stage, display-criteria, header, ...)
  --color-accent: #{role-color($theme, accent, 500)};
  --color-accent-bg: #{rgba(role-color($theme, accent, 500), 0.1)};
  --color-accent-border: #{rgba(role-color($theme, accent, 500), 0.2)};
  --color-accent-strong: #{role-color($theme, accent, 600)};

  // ── Status colours ─────────────────────────────────────────────────────────
  // Used by: searchbar (validation error colour)
  --num-color--warn: #{role-color($theme, warning, 500)};

  // Used by: searchbar (fallback when --num-color--warn is unavailable)
  --num-color--red: #{role-color($theme, danger, 500)};
}
```

## Diff

```diff
-@use 'node_modules/@angular/material' as mat;
 @mixin color-variables_themed($theme) {
-  $accent: map-get($theme, accent);
-  $primary: map-get($theme, primary);
-  $warn: map-get($theme, warn);
-  $green: map-get($theme, green);
-  $red: map-get($theme, red);
-
-  --num-color--primary: #{mat.m2-get-color-from-palette($primary)};
+  --num-color--primary: #{role-color($theme, neutral, 500)};
   ... (same pattern for the other 11 lines)
```

## Effect

- Removed: the `@use ... as mat` line (this also fixes the odd `node_modules/` path that needed `--load-path=.`) and the 5 local variables.
- CSS output: identical (same hex values). Verify with a CSS diff against `src/styles/styles.scss`.
- Still unresolved (not part of this change): duplicate values (`--num-color--primary-blue` = `--color-accent`, `--num-color--accent-600` = `--color-accent-strong`) and inconsistent names. A rename touches ~60 component files.
