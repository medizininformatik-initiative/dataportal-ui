# Domain mapping: user language, TypeScript model, backend

Each concept can carry three different names. `GLOSSARY.md` defines the **user language** only; this document shows where the other two layers differ. Cells marked `?` are not yet verified.

- **UI**: label shown to researchers, from `src/assets/i18n/de.json` (default) and `en.json`.
- **TypeScript**: name in `src/app/model/**` and `src/app/service/**`.
- **Wire**: name in the backend API and the CCDL/CRTDL JSON (`~/test-MCP/clinical-cohort-definition-language-schema.json`, `~/test-MCP/CRTDL_schema.json`, `~/test-MCP/dataportal-backend-openapi.json`) or in Elasticsearch documents.

## Cohort and criteria

| Glossary term | UI (de / en) | TypeScript | Wire |
|---|---|---|---|
| Cohort definition | Kohortenselektion / Cohort Selection (headers, buttons); Kohortendefinition / Cohort Definition (info tooltip, FAQ) | `StructuredQuery`, `AnnotatedStructuredQuery` (outdated name) | CCDL: `cohortDefinition` inside a CRTDL; versioned by `version` |
| Criterion | Kriterium / Criterion | `Criterion` (`model/FeasibilityQuery/Criterion`), `StructuredQueryCriterion` | `criterion`: `context`, `termCodes`, `valueFilter?`, `attributeFilters?`, `timeRestriction?` |
| Term code | Terminologie-Codes / Terminology Codes (editor tab, headers); Termcode / term code in info and error texts | `TerminologyCode` | `termCodes[]`: `{system, code, display, version}` |
| Context | Kontext / KDS-Profil (en: Context / CDS Profile) | `ContextTermCode` | `context`: `{system, code, display, version}` |
| Value filter | Wertefilter / Value Filter (editor tab) | `ValueFilter` (`model/StructuredQuery/Criterion/ValueFilter`, `ValueFilterData`) | `valueFilter` |
| Attribute filter | Attributfilter / Attribute Filter (editor tab) | `AttributeFilterFactory.service.ts` | `attributeFilters` |
| Time restriction | Zeiteinschränkung / Time restriction (editor tab, chips); zeitliche Einschränkung in the info text | `TimeRestriction` (`model/FeasibilityQuery/TimeRestriction.ts`, `model/StructuredQuery/Criterion/TimeRestriction`) | `timeRestriction` |
| Inclusion / exclusion criteria | Einschlusskriterien, Ausschlusskriterien / Inclusion criteria, Exclusion criteria | ? | `inclusionCriteria`, `exclusionCriteria` |
| Criteria group | not shown as a label; the inner AND/OR switch sits between criteria boxes | `CriteriaGroupComponent` (`num-criteria-group`) | array of arrays, no name in the CCDL docs |

## Feasibility

| Glossary term | UI (de / en) | TypeScript | Wire |
|---|---|---|---|
| Feasibility query | Machbarkeitsabfrage / Feasibility Query | `FeasibilityQuery` (`model/FeasibilityQuery/FeasibilityQuery.ts`) | backend path `/query/feasibility` |
| Feasibility result | Ergebnis / Result (tab title) | ? (`TypeGuard.ts` checks a result object with `totalNumberOfPatients`) | `totalNumberOfPatients` |
| Saved feasibility query | Gespeicherte Machbarkeitsabfragen / Saved Feasibility Queries | `SavedFeasibilityQuery` | ? |

## Data request

| Glossary term | UI (de / en) | TypeScript | Wire |
|---|---|---|---|
| Data selection | Merkmalselektion / Feature Selection (navigation, headers, buttons); Datenselektion / Data Selection (dashboard, info tooltip); Datenanfrage in a download message | `DataExtraction` (name differs from the UI) | CRTDL `dataExtraction` |
| Attribute group | **Merkmal / Feature** (the thing a researcher adds, renames, filters, links); Attributgruppe / attribute group appears only in validation error messages | `AttributeGroup` in folder `AttributeGrooups` (typo) | CRTDL `attributeGroups[]`: `id`, `name`, `groupReference`, `attributes`, `filter`, `includeReferenceOnly` |
| Field | Feld / Field ("the specific data points of a feature, e.g. diagnosis code or date") | `Attributes` (`AttributeGroup.attributes`) | `attributes[]` with `attributeRef`, `mustHave` |
| Linked feature | Verknüpfte Merkmale / Linked features; Referenzierte Merkmale / Referenced features | `ProfileReference` | `linkedGroups` |
| Module | KDS-Modul / CDS Module ("thematic data categories in the MII Core Data Set, e.g. diagnosis, medication, laboratory"); a filter in both the criteria search and the feature search | ? | `kds_module` (ontology), `module` (profile) |
| Only if referenced | Nur wenn referenziert / Only if referenced (switch, tooltip, FAQ) | `includeReferenceOnly` on `AttributeGroup`; `ProfileReference` in the UI's data selection model (`model/DataSelection/Profile/Reference`) | `includeReferenceOnly` |
| CRTDL | "Als CRTDL" / "As CRTDL" (download option); Maschinenlesbare Abfragedefinition / Machine-readable query definition (JSON) | `CRTDL` | `version`, `display`, `cohortDefinition`, `dataExtraction` |
| Data query | Datenanfrage / Data Query (save button, snackbar); Datenabfrage (delete dialog); Datendefinition / Data Definition (download button); Gespeicherte Datendefinitionen / Saved Data Definitions (list and navigation) | `SavedDataQuery` | backend path `/query/data` |
| Profile | Profil / Profile only in technical texts (FHIR-Profil, "Show profile", removed-profile log); the table column headed "Profile" in en is **Merkmal** in de | not traced | `profile` index; an attribute group's `groupReference` is one profile's URL (exactly one per group, required) |

## Differences to discuss

- **"Cohort selection" is the everyday UI word.** The glossary lists "Cohort selection" under `_Avoid_` for Cohort definition, but `de.json` uses Kohortenselektion in headers, buttons and navigation, and Kohortendefinition only in tooltips and FAQ. `en.json` mirrors this. **Decided (Shah): Cohort definition wins.** The glossary keeps it and avoids Cohort selection. The UI labels are a known mismatch, not a glossary error.
- **"Cohort" alone is used for several things** in buttons (Save cohort, New Cohort, Download cohort). The glossary avoids it for feasibility queries and data queries.
- **"Group" already has a user-facing meaning.** The drag handle text says "Drag criterion to inclusion or exclusion group" (de: Ausschlussgruppe), so users call the whole inclusion side and the whole exclusion side a group. The bulk search has "Add group criteria" (de: Gruppenkriterium). The glossary's Criteria group (the inner set) is a different thing. **Decided (Shah):** the Criteria group definition says it is one part of the inclusion or exclusion criteria, never the whole side, and lists "inclusion group" and "exclusion group" under `_Avoid_`.
- **The UI also says "Criteria Sets"** in the error log modal, the same words as the ontology's criteria set.
- **Data selection naming drifts:** TypeScript says `DataExtraction`, the UI says Datenselektion, and `de.json` has Datenanfrage and Merkmalselektion in some places.
- **Feature, attribute group and profile (technical layers):** **Confirmed against the CRTDL schema:** an attribute group has exactly one `groupReference` (one profile) plus `attributes`, each of which can link to other attribute groups through `linkedGroups`. Several groups may use the same profile. The glossary term for the whole thing is Feature.
- **The UI says "profile" where the wire says "attribute group".** The UI texts (`REFERENCE_TOOLTIP_TEXT`, FAQ `ONLY_IF_REFERENCED`) talk about "this FHIR profile" being included only if referenced, and the UI's data selection model has `Profile` and `ProfileReference`, while the CRTDL stores the same thing as an attribute group with `includeReferenceOnly`. `DataExtraction2UiDataSelection.service.ts` translates between them. No UI label for "attribute group" was found. Open: which word is the user-language one?
- **Decided (Shah): Feature is the glossary term** for what a researcher selects (de: Merkmal), found in `de.json` and `en.json`. Attribute group (CRTDL, `AttributeGroup`) and Profile (FHIR) are the technical names and are listed under `_Avoid_`. English UI texts mix "feature" and "profile" for the same thing; German uses Merkmal almost everywhere. Field and Linked feature were added in the same step, plus Module for the KDS-Modul filter. The English UI wording is a known inconsistency, not a glossary error.
- **Context is labelled "Kontext / KDS-Profil"** (`SHARED_COMPONENTS.KONTEXT`), so "profile" also appears on the criteria side, for the glossary's Context.
- **A saved data query has four user-facing names:** Datenanfrage, Datenabfrage, Datendefinition and, in the list, Gespeicherte Datendefinitionen. **Decided (Shah): data query = data definition = data selection + cohort definition.** The glossary keeps Data query as the term and says the interface calls it a data definition. "Data extraction" was named by Shah as another synonym but is not adopted: the portal never extracts (TORCH does), and in the CRTDL `dataExtraction` is only the data-selection half. **Confirmed (Shah): Data extraction stays under `_Avoid_`.**
- **"Term code" is "Terminologie-Code" in the editor** and "Termcode" in error and info texts.
