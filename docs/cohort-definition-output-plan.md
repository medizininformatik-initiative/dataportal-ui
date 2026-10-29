# Plan: UI query to CCDL cohort definition (output side)

Step 4 of `docs/model-design-review.md` section 6.
Status: **plan, nothing implemented yet.** Steps 1 to 3 committed on `refactoring-structured-query`
(`4bdbb00a`, `91a036a2`).

## Goal

`ToCohortDefinitionService` stops returning `StructuredQuery` class tree, returns plain
`CCDLCohortDefinition` data. Single public method, `translateActiveQueryToCohortDefinition()`, reads the active query,
validates it, then translates it. Every other method `private`, so nobody can translate an invalid or non-active query.

Only output side changes. Input side (`StructuredQuery2*` translators, type guards) stays as is until
step 8 of review.

## How a CRTDL is translated today

CRTDL has two halves: `cohortDefinition` (a query) and `dataExtraction` (selected data). Only
cohort half in scope. `[PLAN]` marks what this plan changes.

### Output: UI to CRTDL (save, download, execute)

```
 UI state (read, never changed here)
 ┌──────────────────────────────────────────────┐
 │ FeasibilityQuery   ids of the criteria,      │
 │                    display, consent flag     │  [PLAN] consent flag removed
 │ CriterionProvider  id -> Criterion           │
 │ ReferenceCriterionProvider  id -> Criterion  │
 │ ConsentService     consent term code         │  [PLAN] no longer read here
 └──────────────────────┬───────────────────────┘
                        v
 ToCohortDefinitionService.translateToStructuredQuery(query)          [PLAN] returns plain data
   1. inclusion / exclusion ids  -> Criterion         (criterionProvider.getOne)
   2. each Criterion -> StructuredQueryCriterion      (class, built with setters)
        term codes      TerminologyCodeTranslator     (new TerminologyCode copies)
        context         criterion.getContext()        (the UI object itself, shared)
        time restr.     TimeRestrictionTranslationService -> After/Before/At/BetweenFilter
        value filter    concept | quantity comparator | quantity range
        attribute flt.  concept | quantity ... | reference
        reference       ids -> ReferenceCriterionProvider -> step 2 again (recursive)
   3. consent flag      ConsentService -> consent criterion, .push() onto the inclusion list   [PLAN] removed
                        v
              StructuredQuery  (class tree)  =  the cohortDefinition      [PLAN] CCDLCohortDefinition
                        |
        ┌───────────────┴──────────────────────────┐
        v                                          v
 Polling.service                          CreateCRTDL.service
 FeasibilityQueryApi.postStructuredQuery     + DataSelection2DataExtraction -> DataExtraction (out of scope)
 (execute the query on the backend)          -> CRTDL -> JSON.stringify
                                                 ├ DownloadCRTDL / DownloadCRTDLZip  (file)
                                                 └ SaveDataQuery  (POST to the backend)
```

### Input: CRTDL to UI (upload, load a saved query), not changed by this plan

```
 file upload                         saved data query (backend)
      │                                        │
      v                                        v
 CheckAndUpgradeCCDL   wraps a bare cohortDefinition into a CRTDL
      │
      v
 CrtdlProcessingPipelineService.process
      ├ validate        CRTDLValidationService -> backend /validation/crtdl
      ├ invalid         ProfileUpgradeService, then validate again (still invalid: stop)
      v
 CRTDL2UIModelService.createCRTDLFromJson
      ├ cohortDefinition   TypeAssertion.assertStructuredQueryData
      │      -> StructuredQuery2FeasibilityQuery
      │            -> StructuredQuery2UIQueryTranslator
      │                 fetches criteria profiles and concepts from the terminology API
      │                 CriterionTranslator -> Criterion -> CriterionProvider (ids go into the query)
      │            consent criterion -> ConsentService (flags), not a criterion   [PLAN] removed
      └ dataExtraction     TypeGuard / assertion -> DataExtraction2UiDataSelection
      v
 UiCRTDL  (FeasibilityQuery + DataSelection set in their providers)
```

Reading both diagrams together: input side already has pipeline (validate, upgrade, translate) and goes
through backend. Output side has no validation step; relies on disabled buttons.

## Design: three pieces

### 1. One rule: `FeasibilityQueryValidationService.validate(query)`

Today rule is private `buildValidationState(query)`, reachable only through `validationState` signal
buttons use. Becomes public as `validate(query)`. Signal calls it with active query, so buttons
and translator cannot disagree. "Valid" keeps current meaning:

1. at least one inclusion group exists, and
2. every criterion in inclusion and exclusion groups passes `CriterionValidationService.validate` (no required
   value or attribute filter left unset, and criterion id found in provider).

### 2. One class, one public method, everything else private

Lock is the language, not lint rule: validation and mapping live in one class; only `translateActiveQueryToCohortDefinition` public.

```ts
@Injectable({ providedIn: 'root' })
export class ToCohortDefinitionService {
  private validation = inject(FeasibilityQueryValidationService)
  private feasibilityQueryProvider = inject(FeasibilityQueryProviderService)

  public translateActiveQueryToCohortDefinition(): Observable<CCDLCohortDefinition> {
    return this.feasibilityQueryProvider.getActiveFeasibilityQuery().pipe(
      take(1),
      map((query) => {
        const state = this.validation.validate(query)
        if (!state.isValid) throw new Error(describe(state)) // names what failed
        return this.build(query)
      })
    )
  }

  private build(query: FeasibilityQuery): CCDLCohortDefinition {
    /* mapping, all private */
  }
}
```

- **No separate pipeline service.** Pipeline in front of public translator would leave translator
  callable directly, lock gone. So validation and mapping are same class, the existing
  `ToCohortDefinitionService`, name unchanged. `Polling` and `CreateCRTDL` call
  `translateActiveQueryToCohortDefinition()`; no caller passes a query any more.
- **Why it takes no query and returns an `Observable`.** The provider exposes the active query only as an
  Observable (`getActiveFeasibilityQuery()`), so the method takes the first value (`take(1)`) and works on that
  one object. Translator can only ever see active query, and no caller can pass a stale or different one. Both callers
  are already Observable chains. `validate(query)` stays public with its parameter: signal needs it, and
  this method passes the emitted query on.
- **Public surface is one method.** `createAttributeFilter` on today's `ToCohortDefinitionService` is `public`,
  must become `private`. No outside caller found, but verify with full grep before changing.
- **Other options considered.** ESLint `no-restricted-imports` rule (bypassable with lint-disable comment
  or `--no-verify`); Template Method base class with `protected` steps (same guarantee, more code, only worth it
  when second translator, e.g. data-extraction side, needs same skeleton); branded
  `ValidFeasibilityQuery` type (needs one `as` cast, every caller must validate first); not registering
  translator in Angular DI (weak, anyone can `new` it). Pure core with thin shell prototyped, dropped as
  too much boilerplate.
- **Sub-services stay public.** `TimeRestrictionTranslationService` and quantity filter translator remain
  injectable. They map pieces, not whole queries, so lock covers whole-query entry only.
- **Dependencies.** Class injects `FeasibilityQueryValidationService`. Check validation does not inject
  translator (no cycle); none seen.
- **Tests.** Characterization tests call `translateActiveQueryToCohortDefinition()` through `firstValueFrom(...)`. Fixtures set the
  active query in `FeasibilityQueryProviderService` instead of passing it, and already register criteria in
  provider, which is what validation reads.
- **An invalid query cannot reach `translateActiveQueryToCohortDefinition` from the UI.** Download, save and execute buttons disabled
  while query invalid, so throw guards against programming error, not user-facing path. No error
  handling for users added at call sites; exception means bug. Translator therefore always returns
  `CCDLCohortDefinition`, never `undefined`, and guards in `CreateCRTDL.createCRTDL`
  (`getInclusionCriteria()?.length > 0`) and the missing one in `createCRTDLForSave` removed.

### 3. Plain data, no shared memory

- Every output object is new literal. Term code becomes `{ code, system, display }` plus `version` only when
  set. No UI model instance in output (today `context: criterion.getContext()` does).
- Inputs only read. Nothing `.push()`ed onto input array.
- No consent group added (see section 4).
- No `ObjectHelper.clone` in new code; deep clone only hides sharing.
- Non-empty arrays built with `isNonEmpty` type guard, so no `as` casts.
- Comparator not `gt | lt | eq` fails loudly (or filter omitted) instead of serializing `"none"`.
- Keep old key order (`version`, `display`, `inclusionCriteria`, `exclusionCriteria`) so downloaded files do not
  change.
- **Time restriction.** `TimeRestrictionTranslationService.translateTimeRestrictionToStructuredQuery` also used by
  `DataSelection2DataExtraction` (data-extraction side, out of scope). Old method and `AfterFilter`,
  `BeforeFilter`, `AtFilter` and `BetweenFilter` classes stay for that caller. Cohort side gets new method
  returning `CCDLTimeRestriction`. Date logic (and its timezone bug) therefore exists twice until later change
  merges the two.

### 4. Consent: leave `ConsentService`, cut every wire to it

Decision: combined-consent flag (the 16 `yes-no-...` codes, `fdpg.consent.combined`) deprecated, so cohort
definition no longer carries it. `Consent.service.ts` stays as is, with lookup table. Everything else stops
using it. Facts behind decision (code search):

- UI toggle already dead: `<num-consent-switches>` commented out in `edit.component.html`.
- Flag can only be switched on by importing CRTDL holding a `fdpg.consent.combined` criterion, and
  output side then writes it back. Only live path, and the one being cut.
- Individual consent provisions (context `Einwilligung`, e.g. "BIOMAT erheben") are ordinary criteria,
  not affected.

Wires to cut (non-spec code):

| Where                                                                                             | What goes                                                                                                                                                    |
| ------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `ToCohortDefinitionService`                                                                       | consent group, `ConsentService` injection                                                                                                                    |
| `Consent.service.ts`                                                                              | only `getConsentStructuredQueryCriterion()`: builds a `StructuredQueryCriterion`, class slated for deletion, no caller after this change. Rest of file stays |
| `StructuredQuery2UIQueryTranslator`                                                               | `isConsent`, `setConsent`, `ConsentService` injection                                                                                                        |
| `StructuredQuery2FeasibilityQuery`                                                                | `feasibilityQuery.setConsent(...)`, `ConsentService` injection                                                                                               |
| `CollectCRTDLHashes.service`                                                                      | `isConsent` filter, `ConsentService` injection                                                                                                               |
| `FeasibilityQuery`                                                                                | `consent` field, `getConsent`, `setConsent`, constructor parameter, copy in `clone`                                                                          |
| `FeasibilityQueryFactory`, `LoadQueryIntoEditorFromUrl`, `saved-queries/feasibility.component`    | `setConsent(false)`, `setProvisionCode(...)`, `clearConsent()` calls                                                                                         |
| `consent-switches` component (ts, html, scss, spec) and commented block in `edit.component.html`  | delete                                                                                                                                                       |
| `FEASIBILITY.EDITOR.CONSENT.*` translations, `model/Utilities/Consent/*` enums, `ContextTermCode` | delete once nothing uses them (check with grep)                                                                                                              |
| `ui-to-cohort-definition.cases.ts` and `.fixtures.ts`                                             | consent case group and `query.setConsent(...)`                                                                                                               |

After this, nothing outside `Consent.service.ts` and its own spec imports `ConsentService`.

## Steps

1. **Validation.** Make `validate(query)` public; signal calls it. Spec: valid query passes; no inclusion
   criteria is invalid; criterion with unset required filter is invalid and named.
2. **Characterization and immutability tests first.** The 18 cases in `ui-to-cohort-definition.spec.ts` are
   safety net. Fixtures set active query in provider and call `translateActiveQueryToCohortDefinition()` via `firstValueFrom`. Check
   each case's criteria valid under new rule (fixtures register them in
   provider). Add immutability test: after translating, change output and assert UI query and
   second translation unchanged, and compare input before and after.
3. **Translator.** One public `translateActiveQueryToCohortDefinition()` that reads active query, validates, then returns
   `Observable<CCDLCohortDefinition>` built from literals. Everything else `private`. `Polling` and `CreateCRTDL` stop passing a query. Quantity filter translator becomes small functions returning
   `CCDLValueFilter` and `CCDLAttributeFilter`; add cohort-side time restriction method. Change types of `FeasibilityQueryApi.postStructuredQuery`, `CRTDL.ts`,
   `BackendArchitecture`, `Polling` and `CreateCRTDL` to `CCDLCohortDefinition`.

4. **Consent.** Cut wires in table in section 4, after translator step so characterization
   tests still guard the rest. Then grep that nothing but `Consent.service.ts` mentions `ConsentService`.

Done when: old and new outputs identical for every case, `tsc` and schema tests pass, no cohort-side code
imports `StructuredQuery`, `StructuredQueryCriterion` or value and attribute filter classes, and class
exposes one public method.

## Later, as separate changes

- `readonly` on `CCDL*` types (readonly `NonEmptyArray` and properties, small edits to case tables), so
  compiler rejects mutation of output.
- Delete old `StructuredQuery` classes and second `QuantityUnit`, once data-extraction caller of
  time restriction no longer needs them.
- Fix timezone bug (review F9): users west of UTC can save date one day early. Needs tests under several `TZ`
  values; `jest.global-setup.js` pins tests to `Europe/Berlin` meanwhile.
- `ge` and `le` (review F8).

## Hazards

- **Importing an old CRTDL with combined consent.** After wires cut, input side no longer recognizes
  `fdpg.consent.combined` criterion, would treat it as ordinary criterion. Backend validation skips
  existence check for that code system, so file passes validation, but UI translation then asks
  terminology API for profile it may not have. What happens (error, empty criterion, silent drop) not verified.
  Saved queries and uploads containing combined consent are exposed cases. Execute and download also stop
  carrying consent group, so results can differ for such files. Deliberate product decision, taken
  knowing it.

- **`PollingManager` still uses its own query.** `startPolling` calls `feasibilityQuery.addResultId(...)` and reads its
  id, while `Polling` now translates the active query. Same query today (it comes from the active-query provider),
  but nothing in code guarantees it if the active query changes between the two calls. Small gap, not a blocker.
- **Async tests.** `translateActiveQueryToCohortDefinition()` returns an `Observable`, so the 18 characterization cases need
  `firstValueFrom` and the active query set in the provider first.
- **Rejecting what the old code tolerated.** Criterion with required filter left unset used to be dropped
  silently by translator; now rejected. Optional filter unset still omitted.
- **`validate(query)` reads criteria by id from the criterion provider**, not from query object. Works for
  any query whose criteria registered there, not only active one; `translateActiveQueryToCohortDefinition` only ever passes the
  active one.

## Open items

- **Old files with combined consent.** Decide and test what input side does with a `fdpg.consent.combined`
  criterion once consent unwired: skip with warning, or reject file with message. Unused
  `cypress/fixtures/example-ccdl-with-combined-consent.json` is ready test input.

- Confirm with full grep that nothing else calls public `createAttributeFilter`.
- Confirm every case in `ui-to-cohort-definition.cases.ts` passes validation rule (step 2).
- Confirm with grep that nothing depends on identity or methods of old `StructuredQuery` object before
  deleting it (review says no caller uses its getters, except check removed in step 3).
