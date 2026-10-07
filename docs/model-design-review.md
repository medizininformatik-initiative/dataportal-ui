# Model layer design review (`src/app/model`)

Reviewed with the `codebase-design` vocabulary: **module**, **interface**, **depth**, **seam**,
**leverage**, **locality**, and the **deletion test**.

## How this was produced, and what it can't tell you

- A script listed every exported class, interface, type and enum under `src/app/model`
  (278 declarations in 254 files; 174 outside `Interface/` and the cloners).
- For each declaration it counted how many other non-spec files mention the name, how many
  `new <Name>(` call sites exist, and how many methods are getters or setters.
- I then read the ambiguous cases by hand: `AnnotatedCRTDL`, the annotated query tree, both
  `QuantityUnit` classes, the time-restriction classes, `AbstractCriterion` and the type guards.
- **Limits.**
  - The usage counts are matched by name, so two classes with the same name inflate each
    other's counts. I confirmed the findings below by hand; the raw tables are not exact.
  - I did not read every method body. Depth judgements for the many small classes come from
    their size and their getter/setter ratio, not from a full read.
  - Template (`.html`) usage was only searched for the dead-code candidates in section 1.
  - `model/` has **no spec files** (0 of 174), so nothing here is protected by tests.

## 1. Answer to the open question: nothing constructs `AnnotatedCRTDL`

`AnnotatedCRTDL` is only mentioned in its own file. The one `new AnnotatedCRTDL(...)` is inside its
own static `fromJson`, and `fromJson` is never called. Its sibling type `AnnotatedCRTDLData`
is referenced only by `TypeGuard.isAnnotatedCRTDLData` and `TypeAssersations.assertAnnotatedCRTDLData`,
and neither of those is called outside `service/TypeGuard`.

So this whole cluster is dead (introduced in commit `41eb6936`, never wired in):

| Module | Used by |
|---|---|
| `AnnotatedCRTDL` | nobody |
| `AnnotatedCRTDLData` (interface) | only its own type guard and assertion |
| `AnnotatedStructuredQuery`, `AnnotatedStructuredQueryCriterion`, `AnnotatedStructuredQueryIssue` | only `AnnotatedCRTDL` and `SavedAnnotatedFeasibilityQuery` |
| `SavedAnnotatedFeasibilityQuery` | nobody |

**Deletion test:** deleting the cluster makes no complexity reappear anywhere. Candidate for deletion,
together with `isAnnotatedCRTDLData` and `assertAnnotatedCRTDLData`.

### Other declarations with no consumer

Each of these is mentioned in no other file of `src/` (checked with a word-match grep over all of `src/`;
the Cypress suite was not searched):

| Declaration | File | Note |
|---|---|---|
| `TemplateContext`, `TabItem`, `CriterionTabData` | `model/TabComponentData.ts` | whole file unused |
| `AbstractValidationIssueInfo` | `Validation/ValidationIssueInfo.ts` | |
| `BuildInformation` (top-level) | `Actuator/Information/BuildInformation.ts` | its children `GitInformation`, `BuildDetails`, `TerminologyInformation` and the three Git classes are then only reachable through it |
| `SavedFeasibilityQueryListItem`, `StructuredQueryTemplate` | `SavedFeasibilityQuery/` | |
| `DataSelectionProfileBuilder` | `DataSelection/Profile/` | |
| `DataSelectionFieldsType` | `Utilities/` | enum |
| `QuantityComparatorFilterData` | `Interface/Quantity/` | |
| `QueryResponse` | `Result/` | |
| `TimeRestriction` class | `FeasibilityQuery/TimeRestriction.ts` | no `new`, no type usage; only the `TimeRestrictionType` enum in the same file is used (by ~10 files). The class also has a field named `tvpe` (typo) |

Treat these as candidates and confirm each (templates, Cypress, dynamic lookups) before deleting.

## 2. The data structure, as it is today

Three parallel representations of "a query", with translators between them:

```
 UI state                        StructuredQuery = CRTDL cohortDefinition          persisted / returned
 ───────────────────             ─────────────────────────         ─────────────────────────
 FeasibilityQuery                StructuredQuery                   SavedDataQuery(+ListItem)
  └ AbstractCriterion            └ StructuredQueryCriterion        QueryResult / QueryResultLine
     (Criterion,                    ├ termCodes, context           SavedFeasibilityQueryResults
      ReferenceCriterion)           ├ attributeFilters[]
     ├ attributeFilters[]           ├ valueFilter
     ├ valueFilters[]               └ timeRestriction
     └ timeRestriction

 UiCRTDL ──── CRTDL ──── DataExtraction ──── AttributeGroup(s) ──── Attribute(s) + group filters
 DataSelectionProfile ── ProfileFields (Basic / Reference / Selected*) ── ProfileTree(Root/Node)
 Search: ListEntry / ResultList / EntryDetails / Filter families (Criteria*, Profile*, CodeableConcept*)
 Validation / Upgrade: ValidationReport ── ValidationIssue ── (Issues/*)   ProfileUpgrade
 Interface/*Data: one wire-shaped interface per class above (80 files)
 Utilities/*Cloner: 23 clone helper classes, ~750 lines
```

Translators between the UI and wire representations live in `service/Translator/*`.

## 3. Findings

### F1. The UI model and the `StructuredQuery` (our CRTDL output) are near-copies (high)

> Correction from the maintainer: `StructuredQuery` is not an incidental wire copy. It is the
> `cohortDefinition` of the CRTDL this application produces. So it is a real, deliberately separate
> output format, and the question is only how much of it needs its own classes.

Nine class names exist twice, once in `FeasibilityQuery/` and once in `StructuredQuery/`:
`QuantityUnit`, `ReferenceFilter`, `AbstractTimeRestriction`, `AtFilter`, `AfterFilter`,
`BeforeFilter`, `BetweenFilter`, `AbstractConceptFilter`, `AbstractQuantityFilter`. The two
criterion classes (`AbstractCriterion` and `StructuredQueryCriterion`) are parallel too, under
different names.

- The `StructuredQuery` time-restriction classes are 7 lines each, a constructor that only calls
  `super`. The `FeasibilityQuery` versions are 20 to 58 lines.
- The two `QuantityUnit` classes differ by one field (`system`).
- Same name, different module: an import that picks the wrong folder compiles and fails later.
  That is why my own usage counts were unreliable.
- **Why this matters:** this is a locality problem. Adding a filter field means editing both
  hierarchies, both `Interface/*Data` types, a translator in each direction, a type guard and a
  cloner.
- **Direction (decided):** replace the `StructuredQuery*` classes with plain typed data (the
  `*Data` types, tightened). One translator module per direction produces it; the Jest schema test
  (section 5) proves the output. See section 5 for the full decision list.

### F2. Most classes are shallow: fields plus getters and setters (high)

About 70 classes have at least 4 getters/setters where getters and setters make up at least half of all methods.
Worst by count: `AbstractCriterion` (25 of 33), `DataSelectionProfileTreeNode` (19 of 21),
`DataSelectionProfile` (16 of 18), `SavedDataQueryListItem` (14 of 16), `CriteriaBulkEntry` (13 of 16),
`ValidationIssue` (12 of 13), `SavedDataQuery`, `QueryResult`, `FeasibilityQuery`, `TerminologyCode`.

- The interface is as large as the implementation. A caller learns nothing by reading the
  methods that the field list does not say.
- Every property pays a three-way tax: the field, the getter and the setter, in each of the two
  models, plus a `*Data` interface.
- The depth that does exist is in the cloners and translators (see F5), not in the model classes.
- **Direction:** pick where invariants really live. For plain records, use readonly interfaces
  or plain classes with public fields. For classes with real rules (`AbstractCriterion`'s
  "is the required filter set", `FeasibilityQuery`'s group positions), expose operations
  (`isComplete()`, `addToGroup()`) and keep the raw setters private.

### F3. The `*Data` interface layer plus type guards are a second hand-written copy of every shape (medium)

- `model/Interface/` has 80 files of `*Data` types. `service/TypeGuard` adds 1,479 lines:
  72 `is*` guards and 37 `assert*` functions, one per shape.
- Each guard re-implements what the interface already declares, so a field added to a
  `*Data` interface is silently unchecked until someone edits the matching guard.
- Several guards are unused (`isAnnotatedCRTDLData`, `assertAnnotatedCRTDLData`), which shows the
  pairing is not enforced.
- **Direction (decided):** the `*Data` types stay hand-written. Ajv validates the translator output
  against the published schema in Jest only, never at runtime. The guards on incoming data mirror the
  schema exactly (extra properties rejected, applied after `CheckAndUpgradeCCDL` wraps a bare
  cohortDefinition). Stored data must be checked before the strict guard is enabled.

### F4. Class hierarchies with one or two leaves (medium)

- `CriterionBuilder.ts` plus `Criterion` (which is `class Criterion extends AbstractCriterion {}`, empty) and
  `ReferenceCriterion`: the abstract/concrete split buys nothing for `Criterion`.
- `AbstractSavedFeasibilityQuery`, `AbstractSearchFilter`, `AbstractSearchFilterValue`,
  `AbstractDetails`, `AbstractRelative`, `AbstractField`, `AbstractSelectedField`,
  `AbstractCodeMessage`: each has 2 to 3 subclasses and mostly shared fields.
- One adapter is a hypothetical seam, two is a real one. Where the two leaves differ only in
  a type tag, a single class with a discriminated union is shallower to read.
- `CritType.ts`, `DataQuerySlots` and `ContextTermCode` / `ConsentTermCode` are tiny and referenced
  from one place each. The last two are classes holding a constant `TerminologyCode`; they
  look like constants, not modules.

### F5. The cloners are a parallel hierarchy that mirrors the model (medium)

`Utilities/CriterionCloner/` and `Utilities/DataSelecionCloner/` hold 23 `Clone*`/`*Cloner`
classes (about 750 lines). Each mirrors one model class and exposes a single static method;
many are called from exactly one other cloner.

- Locality is poor: adding a field to a model class means remembering to update its cloner,
  and nothing fails if you forget, because the model has no tests.
- **Direction:** give each model class (or the aggregate, e.g. a criterion) one `clone()`, or
  use `structuredClone` plus class re-hydration at the aggregate level. Fewer, deeper modules.
- The folder name `DataSelecionCloner` is also misspelled, as are `RefrenceFields`,
  `AttributeGrooups`, `dataExtratcion` (`AnnotatedCRTDL`) and the `tvpe` field. These are
  cosmetic but they show up in every import.

### F6. Copy/paste duplicates inside `Search/` and `Interface/` (low, quick wins)

- `Search/EntryDetails/Criteria/CriteriaEntryRelatives.ts` and `CriteriaEntryRelative.ts` both
  export `CriteriaEntryRelative` and differ only in import order and one import path
  (`src/app/...` vs relative). Keep one.
- `Interface/ListEntryDetailsData/CriteriaRelationsData.ts` and `CriteriaEntryDetailsData.ts`
  both export `CriteriaEntryDetailsData`.
- Two files each export `AbstractConceptFilter` and `AbstractQuantityFilter` (see F1), and
  two export `ReferenceFilter`.

### F7. No tests at the model layer (medium)

There are no `*.spec.ts` files under `model/`. That is partly fine for pure records, but the
classes with behaviour (`AbstractCriterion`, `FeasibilityQuery`, `TerminologyCode`, the
cloners) have no tests at their interface. The translators in `service/Translator` are the
effective test surface today; the model has no direct one.

## 4. Reference: the supported schema

Only schema v1 is supported. Read from `medizininformatik-initiative` on GitHub:

- `clinical-resource-transfer-definition-language` (CRTDL): tags `v0.1.0`, `v0.1.1`. The CRTDL has
  `version` (a URI string in v0.1.x), `display`, `cohortDefinition` and `dataExtraction`.
  `main` (unreleased) changes `version` to the constant `"1"` and references CCDL v2. Out of scope.
- `clinical-cohort-definition-language` (CCDL) `v1.0.0`: the `cohortDefinition`. `version` is a URI
  string, and `additionalProperties: false` applies on the root, `criterion`, `termCode`, `unit`,
  `timeRestriction`, `valueFilter` and `attributeFilter`. v2 (`main`) removed that restriction.
- `valueFilter` and `attributeFilter` are unions discriminated by `type`: `concept`,
  `quantity-comparator`, `quantity-range` (and `reference` for attribute filters). Comparators:
  `gt, ge, lt, le, eq, ne`.
- The CRTDL v0.1.1 example uses `http://json-schema.org/to-be-done/schema#` (CRTDL) and
  `http://to_be_decided.com/draft-1/schema#` (cohortDefinition). Those are exactly the app's values.

### F8. Concrete gaps against v1 (to be confirmed by the schema test)

- `ge` and `le` are valid comparators, so the `@pending` roundtrip scenarios describe a real gap in
  the translator mapping (`AbstractQuantityFilter.mapComparatorToQuantityComparison`).
- `TimeRestrictionData` requires `afterDate`; the schema requires `afterDate` or `beforeDate`.
- `ValueFilterData` and `AttributeFilterData` are looser than the `type`-discriminated unions.
- Any extra property in emitted objects is a v1 violation.

## 5. Decisions: cohortDefinition classes to types

| Topic | Decision |
|---|---|
| Schema target | CCDL v1.0.0 plus the CRTDL v0.1.x wrapper |
| Types | Hand-written `*Data` types as discriminated unions; the Ajv test guards drift |
| Validation | Tests only; Ajv is a devDependency; nothing new at runtime |
| Scope | The cohortDefinition (about 25 classes). `CRTDL`, `DataExtraction` and the data-selection side keep their classes |
| Seam | One translator module per direction. `UIQuery2CohortDefinition.service.ts` is the live UI-to-data path (used by `Polling.service.ts`, `CreateCRTDL.service.ts`) |
| Test input | Round trip from the `cases.ts` catalogue, moved to a folder shared by Cypress and Jest |
| Dead code | Deleted first, in its own commit: the annotated cluster, the `Translator/StructureQuery/Builder/` cluster, and the other unreferenced declarations (each re-checked) |
| `ge`/`le` | A separate change after the refactor |
| Version | Emit the real CCDL v1 schema URI for the cohortDefinition. Input accepts any URI; the frontend never reads `version` (guards only check it is a string) |
| `CheckAndUpgradeCCDL` | Stays. It migrates old CCDL-only files by wrapping them in a CRTDL with the main profile |
| Input guards | Mirror the schema exactly, applied after the upgrade wrap; enabled last |

### How the translator output is asserted

1. **Compile time:** the translator returns the typed data, built from object literals (no `as` casts).
2. **Jest:** feed the catalogue cases through `StructuredQuery2FeasibilityQuery` and back through
   `UIQuery2CohortDefinition`, validate each result with Ajv 2020 against the vendored CCDL v1.0.0
   schema (formats enabled; in draft 2020-12 `format` is annotation-only by default), and compare
   with the input.
3. **Cypress:** the existing `crtdl-roundtrip` suite stays as the end-to-end check.

## 6. Order of work

1. Delete the dead code (own commit). **Done on branch `refactoring-structured-query`, not yet committed.**
2. Move the case catalogue to a shared folder; add the Ajv schema tests. **Done, not committed**
   (see "Step 2 result" below).
3. Tighten the `*Data` types into discriminated unions. **Drafted for review** in `src/app/model/CohortDefinition/` (`CCDL*` types plus a spec that checks them against the schema); nothing uses them yet.
4. One translator module per direction returning plain typed data. The Consent criterion
   (`Consent.service.ts`, `new StructuredQueryCriterion()` plus setters) becomes an object literal.
5. Delete the `StructuredQuery*` classes and the second `QuantityUnit`.
6. Switch the version URI.
7. Fix `ge`/`le` and un-pend the Cypress scenarios.
8. Enable the strict input guards, after checking stored data.

Later, outside this change: the other findings (F2, F4, F5, F6, F7) in the order of their cost.

## 7. Open items

- Does the backend, or any validator, read `version`? Switching the URI assumes it does not.
- Do saved queries on the backend fail the strict guard? Verify before step 8.
- Is the CRTDL wrapper's own `version` also switched? Assumed no.
- Do `Hash.service` and the cloners depend on the model classes? Check before step 4.
- Is the annotated query model (a `StructuredQuery` with per-criterion `issues`) planned work or
  abandoned? Step 1 assumes abandoned: nothing in the app reads such a response; validation goes
  through `ValidationReport` / `ValidationIssue`.

### Orphans left behind by step 1 (not yet deleted)

Now referenced only by each other, no longer by the app: `Actuator/Information/Git/*`,
`Actuator/Information/Build/BuildInformation.ts` (`BuildDetails`), `Actuator/Information/Terminology/*`
(and their `Interface/ActuatorInfoData/*` types), `SavedFeasibilityQuery/AbstractSavedFeasibilityQuery.ts`
and `FeasibilityQuery/CritType.ts` (only `CritGroupPosition` uses it; check that one is live).

## 8. Step 2 result: schema tests

Done on branch `refactoring-structured-query` (not committed):

- The catalogue moved from `cypress/support/crtdl/` to `test-support/crtdl/` (Cypress imports updated).
- `test-support/schemas/ccdl-v1.0.0.schema.json` is the CCDL schema, vendored from tag `v1.0.0`;
  `cohortDefinitionSchema.ts` validates with Ajv 2020 and format assertion on.
- `ajv` and `ajv-formats` are now devDependencies; `tsconfig.spec.json` gained the `node` types.
- `cohort-definition.schema.spec.ts` (33 tests): every case of the catalogue is valid CCDL v1, and
  the schema rejects an unknown property and an empty time restriction.
- `ui-to-cohort-definition.spec.ts` (4 tests): criteria built with the real model classes go through
  `UIQuery2CohortDefinitionService` and the serialized output is valid CCDL v1 (no filters; quantity
  comparator `eq`, `lt`, `gt`, with the exact output shape asserted).

**Changed finding: the full round trip is not feasible in Jest.** `StructuredQuery2UIQueryTranslator`
fetches criteria profiles, UI profiles and concept translations from the terminology backend, and the
catalogue contains none of that data. The round trip stays with the Cypress `crtdl-roundtrip` suite.
In Jest the output side is tested from hand-built UI models (this was the option rejected earlier).
The input side can only be tested with captured backend fixtures; not done.

**New finding: `ge` and `le` cannot be represented in the UI model.** `QuantityComparisonOption` has only
`NONE, EQUAL, LESS_THAN, GREATER_THAN, BETWEEN`, so the `ge`/`le` fix is a UI-model change as well as a
translator change. Step 7 grows accordingly.

Not yet covered by the output tests: time restrictions, quantity ranges, concept value and attribute
filters, reference filters, exclusion criteria, consent.

## 9. Classes (`model/StructuredQuery`) vs interfaces (`model/Interface/*Data`) and guards

The classes build the output; the interfaces and `TypeGuard` check incoming files. Method used: every
class variant was built and serialized (`JSON.stringify`), and the keys were compared with the
interfaces and the guards. The temporary spec was deleted afterwards.

**What the classes send:** root `version`, `display`, `inclusionCriteria` (`exclusionCriteria` only if
set); criterion `termCodes`, `context`, optional `timeRestriction`, `valueFilter`, `attributeFilters`;
concept `type`, `selectedConcepts`; comparator `type`, `comparator`, `value`, `unit`; range `type`,
`minValue`, `maxValue`, `unit`; reference `type`, `attributeCode`, `criteria` (attribute filters add
`attributeCode`); time restriction After `afterDate`, Before `beforeDate`, At/Between both; unit
`code`, `display`; term code `code`, `display`, `system`, optional `version`.

**Same fields:** every key the classes emit exists in the interfaces, and the guards accept every
output. No class emits a field the interfaces lack.

**Differences (the interfaces say more than the classes produce, the guards say less than the interfaces):**

1. `ValueFilterData` requires `selectedConcepts`, `comparator` and `unit` on every filter, and
   `AttributeFilterData` requires `criteria` on every filter. No single filter has all of them. The
   guards do not check those fields, so the runtime check passes.
2. `TimeRestrictionData.afterDate` is required, but a "before" restriction sends only `beforeDate`. The
   guard allows both to be missing, which accepts `{}`; the schema rejects that.
3. Only the interface has `precision`, a unit `system`, and the comparator values `none` and `bw`.
   The guard only checks that `comparator` is a string.
4. `Comparator.NONE` is the class default and serializes as `"none"`, which is not valid CCDL. The UI
   always sets a comparator today; nothing enforces it.
5. `display`: required in the interface, optional in the guard, and omitted by the class when unset.
6. `context.version` is required by the interface and the guard, and the app's own contexts always have
   `version: '1.0.0'`; so it only rejects files from other tools. Stricter than the schema, not a bug in
   the app's output.
7. `TerminologyCode.uid` is dead: it is never set, only cloned from `undefined`, so it never appears.

**Conclusion:** the `CCDL*` types match the classes' real output better than the interfaces do (except
that `'none'` must never be emitted), which supports replacing both. The risk is on the input side:
the new guards will be stricter than today's lenient ones.

## 10. Step 4 plan: output side only

Goal: `UIQuery2CohortDefinitionService` returns `CCDLCohortDefinition` (plain data) instead of the
`StructuredQuery` class. The input side (guards, `StructuredQuery2*`) is untouched until step 8.

1. **Characterization test first.** **Done, not committed** (`ui-to-cohort-definition.spec.ts`, 18 cases, see F9 below). Build a set of UI queries (extend `ui-to-cohort-definition.spec.ts`:
   four time restrictions, range, concept value and attribute, reference, exclusion, consent). For each,
   record the current serialized output, and assert the new translator produces exactly that.
2. **New translator output.** Build typed object literals. The quantity-filter translator
   (`Builder/StructuredQueryQuantityFilterTranslator`) and the time-restriction translator become small
   functions that return `CCDLValueFilter`, `CCDLAttributeFilter` and `CCDLTimeRestriction`.
3. **Consent.** `Consent.service.getConsentStructuredQueryCriterion()` returns a `CCDLCriterion` literal.
4. **Callers.** `Polling.service`, `CreateCRTDL.service`, `FeasibilityQueryApi.postStructuredQuery` and
   `BackendArchitecture` (two methods) change their parameter type; `CRTDL.ts` holds a
   `CCDLCohortDefinition` instead of a `StructuredQuery`. None of them call getters on `StructuredQuery`.
5. **Remove the `'none'` hole:** the translator fails loudly (or omits the filter) if a comparator is not
   one of `gt | lt | eq`, instead of serializing `"none"`.

**Hazard:** `TimeRestrictionTranslationService.translateTimeRestrictionToStructuredQuery` is also called
by `DataSelection2DataExtraction` (the data-extraction side, out of scope). So the existing method stays
for that caller and step 4 adds a new method for the cohort side. The `AfterFilter`/`BeforeFilter`/
`AtFilter`/`BetweenFilter` classes can therefore only be deleted once that caller no longer needs them
(step 5 is partly blocked by this).

**Finished when:** the old and new outputs are identical for every test case, `tsc` and the schema tests
pass, and no cohort-side code imports `StructuredQuery`, `StructuredQueryCriterion` or the value and
attribute filter classes.

### F9. The time restriction depends on the machine's timezone (found while writing the characterization tests)

`TimeRestrictionTranslationService.translateTimeRestrictionToStructuredQuery` derives the dates from the
local timezone offset (`getTimezoneOffset()`, `setHours(...)`) and then reads them back with
`toISOString()` (UTC). Running the same 18 cases under different `TZ` values:

| `TZ` | Result |
|---|---|
| `Europe/Berlin`, `UTC`, `Pacific/Auckland` | all 18 pass |
| `America/Los_Angeles` | 5 fail: every date comes out one day early (after, before, at, between, and the reference case) |
| `Asia/Kolkata` (UTC+5:30) | 1 fails: the `between` end date is one day early |

So users west of UTC would save a different date than they picked, and half-hour offsets are also affected.
The behaviour is not changed in step 4. `jest.global-setup.js` pins the test run to `Europe/Berlin` (the
app's users) so the characterization tests are deterministic. Fixing it means treating the dates as plain
`YYYY-MM-DD` strings and never going through `Date`; that is a behaviour change and needs its own step and
tests (parametrized over timezones). The same service is used by `DataSelection2DataExtraction`, so the
data-extraction side is affected too.

**Characterization suite check:** seven deliberate breaks of the translator (consent not added, value
filter dropped, attribute filters dropped, exclusion dropped, reference criteria dropped, AFTER treated as
BEFORE, AT losing its `beforeDate`) were each caught by at least one test; the sources were restored and
verified identical to HEAD afterwards.

**Fixtures must not reuse one value for two fields.** The first version of the characterization tests used the
same string for a term code's `code` and `display`, so a translator that swapped them would have passed. The
fixtures now use a distinct `display` everywhere, and swapping the two in the term-code translator fails 17 of
18 tests (in the attribute-code construction, 2 tests). A real saved CRTDL also showed two things the cases
lacked: a term code with a `version` (`2.81`), and the default display `Ausgewählte Merkmale`; both are covered now.

**IDE typing of specs.** The root `tsconfig.json` has no `types` and includes `cypress/`, so in the IDE Chai,
Jasmine and Jest all declare `expect`; this gives errors such as `Property 'toEqual' does not exist on type
'Assertion'` in about 100 spec files (the Jest run itself uses `tsconfig.spec.json` and is fine). The new specs
import `describe`, `it`, `expect` from `@jest/globals`, which fixes them locally. A project-wide fix (a solution-style
root tsconfig or a `types`/`exclude` change) was tried briefly and did not remove the conflicts, so it is open.

**Layout of the characterization tests.** `ui-to-cohort-definition.cases.ts` lists every accepted case (name, UI
query, exact expected JSON) in groups; `ui-to-cohort-definition.fixtures.ts` holds the builders and the wire helpers;
`ui-to-cohort-definition.spec.ts` only loops over the cases (translate, compare, validate against the schema). To
add a case, add one entry to a group in the cases file. The context fixture also got a distinct `display`; before, a
translator that replaced the context by something with the same text would not have been noticed.
