---
name: playground-design
description: Build a new UI design (page or component idea) in the dev-only playground. Use when asked to design, prototype or sketch a component or page in the playground.
---

# Playground design

Designs live in `src/playground/designs/<designer>/<name>/`. Template: `designs/example/hello/`.
Route: `/playground/designs/<designer>/<name>` 
## Steps

1. `<designer>` = the user's name, lowercase. `<name>` = kebab-case.
2. Copy `example/hello/` to `designs/<designer>/<name>/`. Rename the component to `<Name>Component`, selector `num-design-<designer>-<name>`.
3. Build with shared components from `src/app/shared/components/` only. Reuse before writing new markup or CSS.
4. Register in `src/playground/designs/index.ts`: add `{ designer, name, title, load }` like the `hello` entry.
5. Fill `README.md`: `Intent:` one line, `## Missing` what shared components or tokens the design lacks.
6. Check in the browser (Chrome DevTools MCP: navigate, screenshot, console). Fix console errors.

## Rules

- Standalone components, inline template and styles, no routing changes.
- Do not edit `src/app/**`. Missing shared piece: list it under `## Missing`.
- Gallery tabs (`src/playground/gallery/`) are managed by `scripts/playground-tabs.cjs`. Do not hand-edit.
