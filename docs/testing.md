# Behaviour Specification (Gherkin)

The Cypress E2E tests describe the UI behaviour in Gherkin (`cypress/e2e/**/*.feature`). Each scenario is a rule the UI follows, and the usage pages of this documentation are written from these scenarios. The screenshots were taken along the same flows.

When you change behaviour, update the feature file and the page it links to.

## How to read a feature

```gherkin
Feature: Bulk search
  Scenario Outline: A code that does not exist is reported as not found
    When I enter the bulk search codes "<codes>"
    And I select the bulk search terminology "<terminology>"
    And I select the bulk search context "<context>"
    And I run the bulk search
    Then the bulk search should have found <found> codes
    And the bulk search should not have found <notFound> codes
    Examples:
      | codes                     | terminology          | context          | found | notFound |
      | {{bulkSearch.oneUnknown}} | {{bulk.terminology}} | {{bulk.context}} | 1     | 1        |
```

- A `Scenario Outline` runs once per row of `Examples`.
::: v-pre
- `{{bulkSearch.oneUnknown}}` is a placeholder. Its value is in `cypress/test-data/*.json`, here `E11, ZZZ99`.
:::

- Tags like `@area:feasibility-query` and `@behavior:report-not-found` group scenarios. `@pending` marks a known defect; these scenarios are skipped by default.

See `cypress/TESTING.md` for how to run and write the tests.

## Features and documentation pages

| Feature | File | Scenarios | Documented in |
| ------- | ---- | --------- | ------------- |
| Action bar - upload, download and save | `ActionBar/action-bar.feature` | 2 | [Overview](./usage/overview#action-bar) |
| Bulk search - criterium with several termcodes | `BulkSearch/bulk-search-criterium.feature` | 2 | [Feasibility](./usage/feasibility#bulk-search) |
| Bulk search | `BulkSearch/bulk-search.feature` | 3 | [Feasibility](./usage/feasibility#bulk-search) |
| Attribute filter (concept) - criterium with several concept filters | `CohortEdit/CriterionEdit/AttributeFilter/Concept/attribute-concept-multiple.feature` | 4 | [Feasibility](./usage/feasibility#criterion-editor-filters) |
| Attribute filter (concept) - removing concepts | `CohortEdit/CriterionEdit/AttributeFilter/Concept/attribute-concept-remove.feature` | 4 | [Feasibility](./usage/feasibility#criterion-editor-filters) |
| Attribute filter (concept) - selecting concepts | `CohortEdit/CriterionEdit/AttributeFilter/Concept/attribute-concept-select.feature` | 5 | [Feasibility](./usage/feasibility#criterion-editor-filters) |
| Attribute filter (concept) - UI state | `CohortEdit/CriterionEdit/AttributeFilter/Concept/attribute-concept-ui-sync.feature` | 7 | [Feasibility](./usage/feasibility#criterion-editor-filters) |
| Criterion without any filter | `CohortEdit/CriterionEdit/NoFilter/criterion-without-filters.feature` | 3 | [Feasibility](./usage/feasibility#criterion-editor-filters) |
| Criterion editor - time restriction | `CohortEdit/CriterionEdit/TimeRestriction/time-restriction.feature` | 3 | [Feasibility](./usage/feasibility#criterion-editor-filters) |
| Value filter (concept) - selecting and removing concepts | `CohortEdit/CriterionEdit/ValueFilter/Concept/value-concept-select.feature` | 4 | [Feasibility](./usage/feasibility#criterion-editor-filters) |
| Value filter (quantity-comparator) - comparator, value and unit | `CohortEdit/CriterionEdit/ValueFilter/QuantityComparator/quantity-comparator-update-chip.feature` | 1 | [Feasibility](./usage/feasibility#criterion-editor-filters) |
| Value filter (quantity-range) - minimum greater than maximum | `CohortEdit/CriterionEdit/ValueFilter/QuantityRange/quantity-range-invalid.feature` | 2 | [Feasibility](./usage/feasibility#criterion-editor-filters) |
| Cohort editing | `CohortEdit/cohort-edit.feature` | 3 | [Feasibility](./usage/feasibility#editor) |
| Cohort Exclusion | `CohortEdit/cohort-exclusion.feature` | 3 | [Feasibility](./usage/feasibility#editor) |
| Criteria groups in the cohort editor | `CohortEdit/criteria-groups.feature` | 26 | [Feasibility](./usage/feasibility#editor) |
| Criterium actions | `CohortEdit/criterium-actions.feature` | 4 | [Feasibility](./usage/feasibility#editor) |
| Cohort Result | `CohortResult/cohort-result.feature` | 1 | [Feasibility](./usage/feasibility#result) |
| Cohort result polling | `CohortResult/result-polling.feature` | 18 | [Feasibility](./usage/feasibility#result) |
| Cohort Search | `CohortSearch/cohort-search.feature` | 2 | [Feasibility](./usage/feasibility#search) |
| Search details panel | `CohortSearch/search-details-panel.feature` | 4 | [Feasibility](./usage/feasibility#search) |
| Cohort definition - empty state | `DataQueryCohort/cohort-definition-empty.feature` | 3 | [Data Definition](./usage/data-definition) |
| CRTDL upload and download roundtrip | `DataQueryCohort/crtdl-roundtrip.feature` | 2 | [Data Definition](./usage/data-definition) |
| CRTDL upload with upgrade | `DataQueryCohort/crtdl-upgrade.feature` | 1 | [Data Definition](./usage/data-definition) |
| CRTDL upload - code filter after upload | `DataQueryCohort/crtdl-upload-code-filter.feature` | 1 | [Data Definition](./usage/data-definition) |
| Data Query Cohort | `DataQueryCohort/data-query-cohort.feature` | 2 | [Data Definition](./usage/data-definition) |
| Concept filter - same code in different code systems | `DataSelectionEditor/attribute-concept-same-code-different-system.feature` | 2 | [Data Selection](./usage/data-selection#profile-editor) |
| Data Selection Editor - code filter | `DataSelectionEditor/data-selection-code-filter.feature` | 1 | [Data Selection](./usage/data-selection#profile-editor) |
| Data Selection Editor - fields | `DataSelectionEditor/data-selection-fields.feature` | 3 | [Data Selection](./usage/data-selection#profile-editor) |
| Data Selection Editor - information | `DataSelectionEditor/data-selection-information.feature` | 1 | [Data Selection](./usage/data-selection#profile-editor) |
| Data Selection Editor - profile stores stay in sync | `DataSelectionEditor/data-selection-provider-sync.feature` | 4 | [Data Selection](./usage/data-selection#profile-editor) |
| Data Selection Editor - references | `DataSelectionEditor/data-selection-references.feature` | 10 | [Data Selection](./usage/data-selection#profile-editor) |
| Data Selection Editor - time restriction | `DataSelectionEditor/data-selection-time-restriction.feature` | 3 | [Data Selection](./usage/data-selection#profile-editor) |
| Data Selection - Only if referenced | `DataSelectionSearch/data-selection-only-if-referenced.feature` | 1 | [Data Selection](./usage/data-selection#search) |
| Data Selection Search | `DataSelectionSearch/data-selection-search.feature` | 2 | [Data Selection](./usage/data-selection#search) |
| Data Selection Search - select all | `DataSelectionSearch/data-selection-select-all.feature` | 3 | [Data Selection](./usage/data-selection#search) |
| Language switch | `Language/language-switch.feature` | 3 | [Overview](./usage/overview#language) |
| Side navigation | `Navigation/side-navigation.feature` | 3 | [Overview](./usage/overview#side-navigation) |
| Data selection search - nothing found | `NegativePaths/data-selection-search-failures.feature` | 2 | [Errors](./usage/errors) |
| Search - nothing found and backend failures | `NegativePaths/search-failures.feature` | 8 | [Errors](./usage/errors) |
| Lost session | `NegativePaths/session.feature` | 1 | [Errors](./usage/errors) |
| Upload - invalid files | `NegativePaths/upload-failures.feature` | 4 | [Errors](./usage/errors) |
| Saved Queries | `SavedQueries/saved-queries.feature` | 2 | [Saved Queries](./usage/saved-queries) |
| User menu | `UserMenu/user-menu.feature` | 4 | [Overview](./usage/overview#user-menu) |
| Login | `login/login.feature` | 1 | [Backend](./backend#sign-in-with-keycloak) |
