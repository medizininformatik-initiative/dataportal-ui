# C04 num-breadcrumbs

Molecule, location trail. Source: `app/shared/components/breadcrumbs/breadcrumbs.component.scss`. Typography only.

| Part | Property | Now (measured) | Next | Source line | Change |
|---|---|---|---|---|---|
| link | size / line / weight | 16 / 24 / 400 | 16 / 24 / 400 (role `app-header-breadcrumb-link`) | not found in own scss (`.breadcrumb-item` sets `14px` at :11, link measures 16) | none |
| link | letter-spacing | 0.5px | open Q8 | Material | decide |
| current page | size / line / weight | 14 / 32 / 500 | 16 / 24 / 600 (role `app-header-breadcrumb-current`) | :28 `font-weight: bold` | change |
| separator | size / line / weight | 24 / 32 / 500 | 16 / 24 / 400 (role `app-header-breadcrumb-separator`) | :36 `font-size: 24px` | change |

## Notes
- `bold` keyword = 700 but `--font-weight-bold` = 600. Use the token. Measured weight is 500, so another rule wins; find it in DevTools first.
- `.breadcrumb-item { font-size: var(--font-size-md) }` (14px) does not match the measured 16 on the link. Check which rule sets the 16 before deleting :11.
- Contrast of the link (2.27) is a color topic, out of scope.

## Done 2026-10-19: HTML + CSS switched (Shah: "do both")
Area `app-header` (left side of the toolbar). Roles `app-header-breadcrumb-{link,current,separator}`, all 16/24, weights 400 / 600 / 400. Letter-spacing is not part of the roles (Q8 still open, Material keeps applying it).

HTML (`breadcrumbs.component.html`):
- `<nav aria-label>` + `<ol>` / `<li>` instead of `div`s. Label key `APPLAYOUT.HEADER.BREADCRUMBS` (de "Brotkrümelnavigation", en "Breadcrumb").
- Links are `<a [routerLink]>` (keyboard, middle click, open in new tab) instead of `<a (click)>` without `href`. `navigateTo()` is removed; its mapping logic is now the pure method `targetOf(url)` and feeds `routerLink`, so every crumb leads to the same page as before.
- Current page: `<span aria-current="page">`, replaces `.last-breadcrumb`.
- Separator `»` stays a text node in a `<span aria-hidden="true">`. Chosen over CSS `::before` because the alt-text form `content: '»' / ''` is not supported in all browsers we target; `aria-hidden` works everywhere.
- Tooltip: `matTooltip` on the current page stays as it was (Shah).

SCSS (`breadcrumbs.component.scss`): reads `var(--font-app-header-breadcrumb-*)`, no font literals left. Dead rules removed (`.breadcrumb-item.active span`, the `14px` on `.breadcrumb-item`, `font-size: 24px` on the separator). List reset added for `ol`.

Wiring: `custom-material/typography/_breadcrumbs.themed.scss`, included in `custom-material/_index.scss` (first group connected to the app).

Not checked (needs a browser, Shah): separator spacing at 16px, the current-page ellipsis in a narrow header, query editor trail (`targetOf` for `queryEditor` urls).
Old spec `breadcrumbs.component.spec.ts` was already broken (imports `BreadcrumbsComponent`, the class is `BreadcrumbComponent`, a standalone component in `declarations`); not touched.

## Update 2026-10-19: link role
The link is styled by the global `a` rule (`base/_links.themed.scss`, 0,4,1 specificity, `!important` on weight, line and letter-spacing), not by this component. So the role `app-header-breadcrumb-link` is dropped in favour of the shared role `text-link` (decision 16, prototype `typography-prototype-text-link.html`). The component's `.breadcrumb-link` font and color lines are dead until then. `current` and `separator` stay as roles.
Done: the role `text-link` is ported, `_links.themed.scss` reads it, `.breadcrumb-link` is removed from the component SCSS, `app-header-breadcrumb-link` is gone from the roles. The crumb link now gets its type and colors (accent 600, underline on hover) from the global rule. Letter-spacing is no longer forced to 0.5px; links inherit it (Q8 still open).
