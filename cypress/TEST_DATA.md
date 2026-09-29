# Test Criteria Reference

Which exact criterium names the Cypress feature files search for, from which
ontology **context**, and how to re-verify or replace one. For *why* this
matters (translation fallback behavior, ontology-reload instability, and other
mechanisms), see `cypress/CLAUDE.md` — this file is just the current reference
table and the verification commands.

## Current criteria in use

| Criterium (exact `display.en`, verified non-empty — see `CLAUDE.md`) | Context | Termcode (for code-search) | Used for | Used in |
|---|---|---|---|---|
| `Age` | `Laboruntersuchung` | LOINC `30525-0` | General add→drag→run flows (Time Restriction tab only — see below) | `SavedQueries/saved-queries.feature` (load scenario), `CohorttResult/cohort-result.feature` |
| `Current chronological age` | `Patient` | SNOMED `424144002` | Numeric value + unit comparator filter (`No filter` → `greater`, value `5`, unit `a`) | `CohortEdit/cohort-edit.feature` ("Changing a criterium's filter comparison...") |
| `Pneumonia` | `Diagnose` | | Time-restriction filter (before/on); general add→drag→run flows | `cohort-edit.feature` ("Applying a time-restriction filter..." and "Adding a criterium to the Inclusion list..."), `cohort-exclusion.feature`, `DataQueryCohort/data-query-cohort.feature` |
| `Appendectomy` | `MII Onkologie Therapie` (and several other Onkologie sub-contexts — 50 total matches) | | Time-restriction filter (after, second row for context variety); general flows | `cohort-edit.feature`, `saved-queries.feature` (delete scenario) |

Picking from different contexts is deliberate — a numeric-value criterium
exercises the value-filter UI a `Diagnose`/time-restriction-only one doesn't,
so a scenario actually tests the filter type it claims to, and one rename
doesn't take out the whole suite.

**A criterium's *context* determines which filter UI it can even show** — its
ui-profile (`GET terminology/ui-profile`, keyed by FHIR profile name, e.g.
`MII_PR_Labor_Laboruntersuchung`) is what actually declares
`valueDefinition`/`attributeDefinitions`, and every criterium sharing that
profile shares the same answer. Checked across all 60 profiles this ontology
has: only `MII_PR_Person_Patient` (context `Patient`) declares a
`quantity`-type `valueDefinition` with `allowedUnits`. Found out the hard way
— `Age` (`Laboruntersuchung`, profile `MII_PR_Labor_Laboruntersuchung`,
`valueDefinition: null`) rendered *only* a Time Restriction tab in the real
app, despite "a lab test has a numeric value" seeming like a safe assumption.
**Don't infer filter support from a criterium's name or kds_module** — check
its profile's `valueDefinition`/`attributeDefinitions` (see the ui-profile
query below), or just open `query-editor/criterion/:id` for it and look.

Favor common, single-word, unambiguous terms over rare/obscure ones where the
scenario allows it — two earlier picks (`Current chronological age`,
`Pacing-induced cardiomyopathy`) were *thought* gone after an ontology
reload, but that traced to the `match_phrase` false-negative bug below, not
real drift; both are re-confirmed present via the corrected `match` query.

**Search by termcode, not display text, when the app's own search ranking
doesn't surface a criterium in the first page.** Confirmed for `Age`/`Current
chronological age`: the search endpoint
(`terminology/entry/search?searchterm=...`) matches substrings of the
*original* (German) display too, so a short/common English term like "Age"
gets buried under dozens of unrelated German matches (`Ageusie` = "loss of
taste", `Agel-Amyloidose`, every `Agenesie von ...`) and never appears in the
first 20 results — confirmed the exact term is still a top-scored exact match
in Elasticsearch itself, so this is a UI search-ranking quirk, not missing
data. A termcode search (`searchterm=424144002`) is exact and returns exactly
one hit — see the `... via code "..."` Gherkin step
(`cypress/support/step_definitions/criterionToEditor.cy.ts`), reusable for
any future criterium with the same problem.

## How to re-verify (or find a replacement)

The backend API requires a Keycloak token, but Elasticsearch itself
(`xpack.security.enabled: false`) can be queried directly with no auth.
**First confirm `elastic-search-init` has exited** — see `cypress/CLAUDE.md` —
before trusting any result below.

**Check an exact criterium name still exists, with a genuinely non-empty `en`**
(query the `ontology` index — `codeable_concept` holds value-set codes used
*inside* a filter, not top-level searchable criteria, and gives false positives).
Use a plain `match` with `"operator":"and"`, **not** `match_phrase` —
`display.en` is indexed with `edge_ngram_analyzer_include_punctuation` but
searched with `lowercase_analyzer` (an intentionally asymmetric autocomplete
setup), and `match_phrase` against that combination gives false negatives:
it reported zero hits for "Current chronological age" once, wrongly
"confirming" a real, present criterium as gone (see above):

```bash
curl -s "http://localhost:9200/ontology/_search" -H 'Content-Type: application/json' \
  -d '{"size":1,"query":{"match":{"display.en":{"query":"Pneumonia","operator":"and"}}}}' \
  | jq -r '.hits.total.value, (.hits.hits[0]._source.display | "original=\(.original) en=\(.en)")'
```

Zero hits, or an empty `en`, means pick a replacement rather than guessing at a
fix — see `cypress/CLAUDE.md`'s translation-fallback note for why an empty `en`
isn't safe even if the criterium technically exists.

**Check whether a criterium's context/profile actually supports the filter
type a scenario needs**, before writing the scenario against it — the
`ontology` index alone can't tell you this (see above):

```bash
TOKEN=$(curl -s -X POST "http://localhost:8080/realms/dataportal/protocol/openid-connect/token" \
  -d "grant_type=password" -d "client_id=dataportal-webapp" \
  -d "username=testuser" -d "password=testpassword" | jq -r .access_token)
# id = the ontology doc's _id from the query above
curl -s "http://localhost:8090/api/v6/terminology/criteria-profile-data?ids=<id>" \
  -H "Authorization: Bearer $TOKEN" | jq '.[0].uiProfileId'
# ids= is currently ignored by this endpoint and returns all ~60 profiles —
# find the matching profile by name and check its filter capabilities:
curl -s "http://localhost:8090/api/v6/terminology/ui-profile?ids=<uiProfileId>" \
  -H "Authorization: Bearer $TOKEN" \
  | jq '.[] | select(.name=="<uiProfileId>") | {timeRestrictionAllowed, valueDefinition, attributeDefinitions}'
```

**Verify a criterium is findable by termcode** (needed if free-text search
doesn't surface it — see above), against the real app search endpoint using
the same token:

```bash
curl -s -G "http://localhost:8090/api/v6/terminology/entry/search" \
  --data-urlencode "searchterm=<termcode>" --data-urlencode "availability=" \
  --data-urlencode "contexts=" --data-urlencode "kds-modules=" \
  --data-urlencode "terminologies=" --data-urlencode "page=0" --data-urlencode "page-size=20" \
  -H "Authorization: Bearer $TOKEN" | jq '.totalHits, .results[0].display'
```

**List available contexts**, if picking a replacement from a specific one:

```bash
curl -s "http://localhost:9200/ontology/_search" -H 'Content-Type: application/json' \
  -d '{"size":0,"aggs":{"contexts":{"terms":{"field":"context.display","size":50}}}}' \
  | jq '.aggregations.contexts.buckets'
```

**Find a candidate within a context**, filtering by both the search term and the
context **in the same query** — a separate unfiltered fetch can return a
same-named-but-wrong-context document:

```bash
curl -s "http://localhost:9200/ontology/_search" -H 'Content-Type: application/json' \
  -d '{"size":5,"query":{"bool":{"must":[
        {"match":{"display.en":{"query":"<search term>","operator":"and"}}},
        {"term":{"context.display":"<context, e.g. Patient>"}}
      ]}}}' \
  | jq '.hits.hits[]._source.display'
```
