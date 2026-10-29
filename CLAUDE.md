# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project

Angular 19 (standalone components, no NgModules for bootstrap) web UI for the FDPG Dataportal
(`num-portal-webapp`) — lets users build feasibility queries and data-selection cohorts against a
FHIR-based backend, using a CRTDL/StructuredQuery model.

## Commands

```bash
npm start                # ng serve (dev server)
npm run build            # production build (--max_old_space_size=6144)
npm run lint             # ng lint (eslint)
npm run lint:fix
npm test                 # jest, all specs
npx jest path/to/File.spec.ts        # single test file
npx jest -t "test name substring"    # single test by name
npm run cypress          # open Cypress interactively
npm run e2e              # headless e2e (ng e2e)
```

- Pre-commit hook (husky + lint-staged) runs `pretty-quick` and `ng-lint-staged lint --fix` on
  staged `.ts/.html/.scss` — formatting/lint issues on changed files are usually caught there.
- Dev server proxies `/api` → `http://localhost:8090` and `/aqleditor` → `http://localhost:8091`
  (see `proxy.conf.json`); a local backend is expected to be running for the app to fully init.

## Definition of done (mandatory, every change)

The coding rules below (doc comments, calls end in a const, typed arrow parameters, accessibility
modifiers, naming, service method vs module function, `shared/types/`) are **requirements, not
suggestions**. Writing code that breaks them is a defect, even when it compiles. A task is not done
until all of these hold for **every file you created or changed**:

1. Re-read your own diff against those rules before you run any tool. Typical misses: a call inside
   an object literal, a method without `public`/`private`, an arrow parameter without a type, a doc
   block without `{Type}` on `@param`/`@returns`.
2. `npx eslint <the files>`: **0 errors and 0 warnings on code you wrote.** Read the full output.
   "0 errors" alone is not enough: the rules above report as warnings. Warnings that already existed
   in untouched old code stay, but never report "clean" while your own lines still warn.
3. `npx prettier --check <the files>` and `npx tsc --noEmit -p tsconfig.app.json` print nothing.
4. The Jest specs next to the code you changed pass. Add a spec for new logic.
5. In the final message, say which of these you ran and what they showed. Don't claim a check you
   did not run.

If a rule and a request conflict, follow the request and say which rule you broke and why.

## Architecture

Startup sequence (`CoreInitService`), runtime config, auth, routing, domain model: read
`docs/architecture.md` before touching `src/app/core/`, `CoreInit.service.ts`, config, auth, routing
or the `StructuredQuery`/`CRTDL` model.

**Non-standard file naming.** Most services, providers, and models use **PascalCase filenames**
(e.g. `AppConfig.service.ts`, `CriterionMetadata.service.ts`) and PascalCase subfolders under
`src/app/service/` (`Config/`, `Criterion/`, `Download/`, `Provider/`, ...), diverging from
Angular's usual kebab-case convention. Match this existing convention for new files in `service/`,
`model/`, and `core/` rather than switching to kebab-case. Angular component/directive selectors
still follow the standard Angular style rules: element selectors are kebab-case with the `num`
prefix (e.g. `num-root`), attribute directives are camelCase with the `num` prefix.

**Style.** Prettier is configured with `semi: false` and single quotes; newer files omit
semicolons, but some older files still have them — follow the prettier config, not surrounding
file style, when it conflicts.

**Doc comments.** Every function and method gets a JSDoc block: one sentence, then one typed
`@param {Type} name` per parameter (no description) and one `@returns {Type}`. Omit `@returns` for
`void`. Example:

```ts
/**
 * Translates the criterion ids of each group and drops empty groups.
 * @param {string[][]} groups
 * @returns {NonEmptyArray<NonEmptyArray<CCDLCriterion>> | undefined}
 */
```

**Calls end in a const.** Don't call functions inside object or array literals. Assign the result to
a named `const` first, then put the const in (shorthand `{ unit }`). A call needed by two objects is
made once, above both:

```ts
const unit = mapUnit(quantity.getSelectedUnit())
return { unit, comparator, value }
```

Enforced as a warning by `no-restricted-syntax` (`Property > CallExpression`,
`ArrayExpression > CallExpression`) in `.eslintrc.json`. ESLint has no rule for the same call
appearing twice (DRY), so that part stays a review item.

**Typed arrow parameters.** Always annotate arrow-function parameters, also in callbacks:
`ids.map((id: string) => …)`, not `ids.map((id) => …)`. The return type stays inferred. Enforced by
`@typescript-eslint/typedef` (`arrowParameter`) in `.eslintrc.json` as a warning, since older code
still has ~600 violations.

**Accessibility modifiers.** Every class member needs `public`/`private`/`protected`
(`explicit-member-accessibility`), except constructors: write `constructor(…)`, never
`public constructor(…)`.

**Service method or module function.** Needs a dependency, or must be replaceable (mocked through
providers): service method. Pure, no dependencies, used in more than one place: exported module
function in its own file (e.g. `service/Translator/Shared/CohortDefinitionMapper.ts`), not an
injectable class and not `static` methods. A pure helper used by one service only may stay in that
service's file until a second user appears or the file grows. A private method that never uses
`this` is a sign it should be a module function.

**Generic types and helpers.** Domain-neutral types and their type guards (e.g. `NonEmptyArray<T>` +
`isNonEmpty`) live in `src/app/shared/types/`, one PascalCase file per concept
(`NonEmptyArray.ts`). Don't park them in a domain file such as `CCDLTermCode.ts`.

**Naming.** Service = noun for its responsibility; file `X.service.ts` holds class `XService`.
Method names start with a verb and don't repeat the service noun: `get…` reads (Observable in RxJS
code), `translate…`/`to…`/`build…` converts, `validate…` checks, `is…`/`has…`/`can…` returns a
boolean. Split pure `(input) => output` logic from reactive wiring.

Enforced by `@typescript-eslint/naming-convention` (warn repo-wide, error on files changed by the Stop
hook): no leading underscore on private/protected members, PascalCase types, camelCase otherwise
(UPPER_CASE constants, PascalCase enum aliases allowed). Functions returning `boolean` start with
`is`/`has`/`can` (`no-restricted-syntax`, explicit `: boolean` return types only).

**i18n.** Uses `@ngx-translate/core` with German (`de`) as the default language;
`DisplayTranslationPipe` (`src/app/shared/pipes/`) is the app-wide translation pipe. Route data
objects carry `breadcrumb`/`title` as translation keys resolved against `src/assets/i18n/`.

**Testing.** Unit tests are Jest (`jest-preset-angular`), colocated as `*.spec.ts` next to source
files. `moduleNameMapper` in `jest.config.js` redirects `environments/*` imports to
`environment.test.ts` and `lodash-es` to `lodash`, so tests don't depend on the runtime
config-loading pipeline described above. E2E tests are Cypress + Cucumber
(`cypress/e2e/**/*.feature` + matching `.ts` step definitions), with shared page objects/helpers
in `cypress/e2e/Utilities/`.

## Strictness guards

- `tsconfig.json` enables `alwaysStrict`, `noImplicitThis`, `strictBindCallApply`, `useUnknownInCatchVariables`,
  `noFallthroughCasesInSwitch`. Not yet repo-wide: `strict` (333 errors), `strictTemplates` (24 errors).
- Ratchet: `tsconfig.strict.json` (`strict`, `noImplicitOverride`, `noImplicitReturns`). The Stop hook runs it
  on changed `src/` files only, so new code must pass strict even if old code does not.
- `.eslintrc.json` extends `recommended-type-checked`. New rules (floating promises, `any`, non-null `!`,
  `eqeqeq`, `no-console`, `complexity`, ...) warn repo-wide and are promoted to errors on changed files by the
  Stop hook (`PROMOTED_RULES` in `.claude/hooks/stop-check.cjs`).
- `.dependency-cruiser.cjs` (`npx depcruise src --config .dependency-cruiser.cjs`): services and models must not
  import components/modules/layout (modals excepted); `shared/types/` imports nothing from the domain.

## Changelog

Format and workflow: `.claude/rules/changelog.md` (loads when `CHANGELOG.md` is touched).

## Agent skills

### Issue tracker

Issues are tracked in GitHub Issues (`medizininformatik-initiative/dataportal-ui`) via the `gh` CLI. See `docs/agents/issue-tracker.md`.

### Triage labels

Default five-label vocabulary (`needs-triage`, `needs-info`, `ready-for-agent`, `ready-for-human`, `wontfix`). See `docs/agents/triage-labels.md`.

### Domain docs

Single-context: one `GLOSSARY.md` + `docs/adr/` at the repo root. See `docs/agents/domain.md`.
