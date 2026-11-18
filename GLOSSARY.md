# FDPG Dataportal

The web UI of the German Research Data Portal for Health (FDPG). Researchers define which patients they are interested in, learn how many such patients exist across the hospital network, and select which data they would like to request. The portal itself never holds, extracts or transfers patient data.

## Language

### Network

**FDPG**:
The German Research Data Portal for Health: the central access point to the Medical Informatics Initiative's hospital network. It offers a feasibility portal (counts) and an application portal (data-use proposals).

**DIC**:
A Data Integration Center: the hospital-local unit that holds the site's patient data and answers queries about it.
_Avoid_: DIZ (in English text), site

**Data Use Project**:
A research project that applies through the FDPG to use data from the network.
_Avoid_: Study

### Cohort and criteria

**Criterion**:
One medical concept, identified by its term codes together with its context, optionally narrowed by a value filter, attribute filters and a time restriction. It is the atomic building block of a cohort definition.
_Avoid_: Concept (a concept is only the identity of a criterion, not the narrowed criterion)

**Term code**:
A code and its code system (plus, where known, the system's version) that together identify a medical concept. A criterion has several term codes only when they are synonymous.
_Avoid_: Code, concept code

**Context**:
An extra code that disambiguates a criterion whose term code alone is used for different things (e.g. a diagnosis code as cause of death versus as a condition).
_Avoid_: Category, domain

**Module**:
A thematic data category of the Medical Informatics Initiative core data set (e.g. diagnosis, medication, laboratory) by which criteria and features are grouped and filtered.

**Value filter**:
A constraint on the measured value of a criterion (e.g. a laboratory result above a threshold).
_Avoid_: Value restriction

**Attribute filter**:
A constraint on another property of the same clinical record as the criterion (e.g. the specimen type of a laboratory test), as opposed to its measured value.
_Avoid_: Attribute, property filter

**Time restriction**:
A constraint on when the criterion's event happened (e.g. a diagnosis made in March 2024).
_Avoid_: Date filter, time filter

**Criteria group**:
A set of criteria inside a cohort definition that are combined with each other by one logical operator. Among the inclusion criteria, a patient satisfies a criteria group by matching any one of its criteria, and must satisfy every such criteria group; among the exclusion criteria, a patient satisfies a criteria group only by matching all of its criteria, and is dropped if they satisfy any such criteria group. It is one part of the inclusion criteria or of the exclusion criteria, never the whole of either.
_Avoid_: Clause, Inclusion group and exclusion group (the interface's words for the whole inclusion side or exclusion side, which is a different thing), Attribute group (the data format's name for a feature, which belongs to a data selection and is unrelated), Criteria set (a different concept: it comes from the ontology)

**Cohort definition**:
A set of inclusion and exclusion criteria that describes a group of patients: the "who". It has no counts and no run state.
_Avoid_: Structured Query or SQ (outdated name, replaced by CCDL in 2024), Cohort selection, Query

**CCDL**:
Clinical Cohort Definition Language: the versioned JSON format in which a cohort definition is exchanged.

### Feasibility

**Feasibility query**:
A cohort definition submitted to the network to learn how many patients match. Every patient count the portal shows for a cohort, in any flow, comes from one.
_Avoid_: Cohort (a cohort definition is not a query until it is submitted)

**Feasibility result**:
The aggregated, privacy-rounded patient count returned for a feasibility query. It never contains patient-level data. It describes the cohort definition as it was when the query ran: once that cohort definition is edited, the result stays visible but is stale.
_Avoid_: Result set, patient list

### Data request

**Data selection**:
The choice of which data items a researcher wants for the cohort: the "what". The portal records the choice; separate extraction tooling carries it out for a Data Use Project. The interface also calls it the feature selection, because it is a selection of features.
_Avoid_: Data extraction (the portal does not extract)

**Feature**:
One kind of clinical record (e.g. laboratory observations) that a data selection asks for, with its own name, the chosen fields and optional filters. A feature can link to other features, and several features may be based on the same kind of clinical record.
_Avoid_: Attribute group (the data format's name for a feature), Profile (the technical FHIR name), Data item group

**Field**:
One data point of a feature that the researcher chooses to receive (e.g. the diagnosis code or the date).
_Avoid_: Attribute (the data format's name for a field; also easily confused with an attribute filter)

**Linked feature**:
A feature that is requested because a field of another selected feature refers to it (e.g. the encounter of a diagnosis).
_Avoid_: Referenced feature, Reference

**Only if referenced**:
A setting on a feature: its data is requested only when another selected feature links to it, never on its own. It is used for linked records, e.g. an encounter that is wanted only when a selected diagnosis refers to it.
_Avoid_: Reference only (suggests that only a pointer is included, not the data)

**CRTDL**:
Clinical Resource Transfer Definition Language: the versioned document that pairs one cohort definition (who) with one data selection (what) to formally describe a data extraction for a Data Use Project.

**Saved feasibility query**:
A stored cohort definition together with a label, a comment and its latest feasibility result. It is independent of any data query: a data query that reuses the same criteria is a separate record.
_Avoid_: Saved cohort

**Data query**:
A cohort definition (the "who") together with a data selection (the "what"), saved with a label, a comment, the latest feasibility result of its cohort definition and a validity status for each of its two parts. It is the record a user keeps and reopens, not the CRTDL document itself. The interface calls it a data definition.
_Avoid_: Cohort (a data query holds a cohort definition, it is not one), Data extraction (the portal does not extract, and the data format uses that name for the data selection half only)
