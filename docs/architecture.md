# Architecture

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
