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

## Architecture

**Bootstrap & startup sequence.** The app is bootstrapped via `bootstrapApplication` in
`src/main.ts` using `appConfig` (`src/app/app.config.ts`) — there is no root `AppModule`
(`app.module.ts` is a stub left only as a pointer to `app.config.ts`). Before the UI is usable,
`CoreInitService.init()` (`src/app/CoreInit.service.ts`) runs as an app initializer and chains,
in order: load runtime app config → init OAuth → load dataportal settings → init user profile →
backend health check → fetch UI profiles → load actuator info → init terminology systems → init
patient profile → init providers. Each step's failure surfaces via `catchError`/`throwError`, so
when startup is broken, check this file first to see which stage failed.

**Runtime config, not build-time env vars.** `src/environments/environment*.ts` only carries
`name`/`production` flags. Actual config (auth issuer/realm/client id, backend base URL, legal
text, theme) is fetched at runtime from `src/assets/config/config.<env>.json` by
`AppConfigService` and stored in `AppConfigProviderService`
(`src/app/core/settings/AppConfigProvider.service.ts`). `config.deploy.json` uses
`#{placeholder}` tokens substituted during deployment (e.g. by octopus/CI variable replacement) —
don't treat those as literal values. A second, parallel settings pipeline
(`DataportalConfigService` / `DataportalConfigProviderService`) loads portal-specific settings
from the backend after the app config is ready. Both provider services are "set-once" —
`setAppConfigMap`/`setDataportalConfig` silently no-op (with a console warning) if called after
data is already present, so config is effectively immutable once loaded.

**Auth.** OAuth2/OIDC via `angular-oauth2-oidc`, configured in
`src/app/core/auth/AuthConfig.service.ts` from the runtime config above. `AuthTokenInterceptor`
(`src/app/core/interceptors/AuthToken.interceptor.ts`) attaches the bearer token to outgoing
requests except URLs matching `excludedUrls` (assets, local auth server). Route access is gated
by `RouteGuard`/`auth.guard.ts` in `src/app/core/auth/guards/`.

**Routing & feature modules.** Route path segments are centralized as constants in
`src/app/app-paths.ts` (`BasePaths`, `PathSegments`, `UrlPaths`) — use these instead of hardcoding
path strings. Top-level routes in `app-routing.module.ts` lazy-load feature areas under
`src/app/modules/`: `feasibility-query`, `data-selection`, `data-query` (combines the two into a
cohort definition), `query-editor` (a shared criterion/feature/reference editor reused across the
query flows, routed as `query-editor/criterion|feature|reference/:id`), and `saved-queries`.
`shared-filter` holds filter logic shared by the search UIs across those modules.

**Domain model.** Queries are represented as `StructuredQuery`/`CRTDL`
(`src/app/model/StructuredQuery`, `src/app/model/CRTDL`, `src/app/model/AnnotatedCRTDL`) built up
from `Criterion` objects. `src/app/service/Criterion/` and `src/app/service/Factory/` contain the
builders/factories that turn UI selections into these query structures before they're sent to the
backend or saved.

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

**i18n.** Uses `@ngx-translate/core` with German (`de`) as the default language;
`DisplayTranslationPipe` (`src/app/shared/pipes/`) is the app-wide translation pipe. Route data
objects carry `breadcrumb`/`title` as translation keys resolved against `src/assets/i18n/`.

**Testing.** Unit tests are Jest (`jest-preset-angular`), colocated as `*.spec.ts` next to source
files. `moduleNameMapper` in `jest.config.js` redirects `environments/*` imports to
`environment.test.ts` and `lodash-es` to `lodash`, so tests don't depend on the runtime
config-loading pipeline described above. E2E tests are Cypress + Cucumber
(`cypress/e2e/**/*.feature` + matching `.ts` step definitions), with shared page objects/helpers
in `cypress/e2e/Utilities/`.

## Agent skills

### Issue tracker

Issues are tracked in GitHub Issues (`medizininformatik-initiative/dataportal-ui`) via the `gh` CLI. See `docs/agents/issue-tracker.md`.

### Triage labels

Default five-label vocabulary (`needs-triage`, `needs-info`, `ready-for-agent`, `ready-for-human`, `wontfix`). See `docs/agents/triage-labels.md`.

### Domain docs

Single-context: one `GLOSSARY.md` + `docs/adr/` at the repo root. See `docs/agents/domain.md`.
