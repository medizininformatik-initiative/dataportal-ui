# Proposal: text colors as shades in `_grey.palette.scss`

Not applied yet. Goal: move `--color-text-*` from hard-coded hex in `styles.scss:86-89` onto the `neutral` role without changing any color.

## How a palette looks today

`palettes/_grey.palette.scss` is a map: shade key -> hex, plus a `contrast` map (text color to put on top of that shade).

```scss
$num-grey-palette: (
  'white': #ffffff,      // named shade (string key)
  50: #f9f9f9,           // numbered shades 50-900 (light -> dark)
  ...
  900: #5e6c78,
  A100: #ffffff,         // accent shades
  ...
  contrast: (
    'white': #000000,
    50: #000000,
    ...
  ),
);
```

`'white'` already proves that named (non-number) shades work in this file.

## Option 1: named shades (recommended)

Add the three values as named shades. Names say what they are, not where they are used.

```scss
$num-grey-palette: (
  'white': #ffffff,
  'black': #000000,          // new
  50: #f9f9f9,
  ...
  900: #5e6c78,
  'ink-600': #6a7483,        // new: was --color-text-secondary
  'ink-700': #5f6266,        // new: was --color-text-section
  A100: #ffffff,
  ...
  contrast: (
    'white': #000000,
    'black': #ffffff,        // new
    'ink-600': #ffffff,      // new
    'ink-700': #ffffff,      // new
    50: #000000,
    ...
  ),
);
```

Use in the new mixin (`base/_text-color-variables.themed.scss`):

```scss
@mixin text-color-variables_themed($theme) {
  --color-text-primary: #{role-color($theme, neutral, 'black')};
  --color-text-secondary: #{role-color($theme, neutral, 'ink-600')};
  --color-text-section: #{role-color($theme, neutral, 'ink-700')};
}
```

Then delete lines 86-89 from `styles.scss` and add `@include text-color-variables_themed($theme);` to `custom-material_themed` in `custom-material/_index.scss`.

Result: CSS output identical (`#000000`, `#6a7483`, `#5f6266`).

## Option 2: reuse the nearest numbered shade

```scss
--color-text-primary: #{role-color($theme, neutral, 900)};    // #5e6c78, was #000000
--color-text-secondary: #{role-color($theme, neutral, 800)};  // #6c7b89, was #6a7483
--color-text-section: #{role-color($theme, neutral, 900)};    // #5e6c78, was #5f6266
```

No palette change, but:
- Primary text goes from black to blue-grey. Big visual change.
- Contrast on white drops for secondary text: `#6c7b89` is about 4.0:1, below the 4.5:1 WCAG AA minimum for body text. The current `#6a7483` is 4.73:1.

## Comparison

| | Option 1 | Option 2 |
|---|---|---|
| Visual change | none | yes (primary text, contrast) |
| Palette change | 3 shades + 3 contrast entries | none |
| Palette stays a clean 50-900 scale | no, 3 off-scale entries | yes |
| Fits "refactor without changing output" | yes | no |

Recommendation: option 1 now. Later, decide separately whether the text colors should move onto the regular scale (a design change, not a refactor).

## Open question

The shade names (`'black'`, `'ink-600'`, `'ink-700'`) are placeholders. `ink-*` is only a suggestion for "text-weight greys". Pick other names if you prefer.
