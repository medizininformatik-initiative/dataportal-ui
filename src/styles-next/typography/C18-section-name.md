# C18 num-section-name

Atom, section heading ("Suche verfeinern:"). Source: `app/shared/components/section-name/section-name.component.scss`. Typography only.

| Property | Now (measured) | Next | Source line | Change |
|---|---|---|---|---|
| font-size | `var(--font-size-md, 16px)` = 14px | 16px (`control-strong`) | :6 | change |
| line-height | `var(--line-height-md, 24px)` = 19px | 24px | :7 | change |
| font-weight | `var(--font-weight-bold)` = 600 | 600 | :5 | none |
| font-family | `var(--font-body, 'Titillium Web', sans-serif)` | `var(--font-body)` | :3 | simplify |
| font-style | normal | remove | :4 | cleanup |

## Notes
- The fallbacks in the `var()` calls (16px, 24px) are the target values, but the token wins, so the fallbacks never apply. After the change, drop the fallbacks.
- A heading should not be smaller than the controls it introduces (selects are 16).
- Element today is a `<p>`; a real `<h2>` is part of Q9.
