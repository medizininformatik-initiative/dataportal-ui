import { Json } from './types'

/**
 * Facts about the local test ontology, and nothing else: no JSON shapes, no logic. Every value
 * here was looked up in the `ontology` Elasticsearch index, `GET terminology/ui-profile` or
 * `GET dse/profile-data` (commands in `cypress/TEST_DATA.md`). When the ontology version
 * changes, this is the only file to re-verify; `npm run crtdl:validate` then checks that the
 * backend still accepts every generated case.
 */
export const SYSTEMS = {
  snomed: 'http://snomed.info/sct',
  loinc: 'http://loinc.org',
  icd10who: 'http://hl7.org/fhir/sid/icd-10',
  icd10gm: 'http://fhir.de/CodeSystem/bfarm/icd-10-gm',
  gender: 'http://hl7.org/fhir/administrative-gender',
} as const

const CONTEXT = { system: 'fdpg.mii.cds', version: '1.0.0' }
export const context = (code: string): Json => ({ ...CONTEXT, code, display: code })

/** Criteria a scenario can name. `profile` is the ui-profile that decides which filters it has. */
export const CRITERIA = {
  pneumonia: { system: SYSTEMS.snomed, code: '233604007', display: 'Pneumonia', context: 'Diagnose', profile: 'time restriction only' },
  causeOfDeath: { system: SYSTEMS.loinc, code: '79378-6', display: 'Cause of death', context: 'Todesursache', profile: 'one ICD-10-WHO concept attribute' },
  age: { system: SYSTEMS.snomed, code: '424144002', display: 'Gegenwärtiges chronologisches Alter', context: 'Patient', profile: 'quantity value filter, units a and mo' },
  gender: { system: SYSTEMS.snomed, code: '263495000', display: 'Geschlecht', context: 'Patient', profile: 'concept value filter' },
} as const
export type CriterionName = keyof typeof CRITERIA

/** Concepts offered by the ICD-10-WHO attribute of `causeOfDeath`. */
export const ICD_CONCEPTS = {
  J13: { system: SYSTEMS.icd10who, code: 'J13', display: 'Pneumonie durch Streptococcus pneumoniae' },
  'J15.0': { system: SYSTEMS.icd10who, code: 'J15.0', display: 'Pneumonie durch Klebsiella pneumoniae' },
} as const

export const GENDER_CONCEPTS = {
  female: { system: SYSTEMS.gender, code: 'female', display: 'female' },
  male: { system: SYSTEMS.gender, code: 'male', display: 'male' },
} as const

/** The concept attribute of `causeOfDeath`, as the backend names it. */
export const ICD_ATTRIBUTE_CODE = { code: 'icd10-who', system: 'http://hl7.org/fhir/StructureDefinition', display: 'ICD-10-WHO' }

/** Units of the quantity value filter. A unit is `{code, display}`, with no `system`. */
export const UNITS = { a: { code: 'a', display: 'a' }, mo: { code: 'mo', display: 'mo' } } as const
export type UnitName = keyof typeof UNITS

/** Comparators the backend accepts. `ne` is absent: `validation/crtdl` answers 500 for it. */
export const COMPARATORS = ['gt', 'lt', 'ge', 'le', 'eq'] as const
export type Comparator = (typeof COMPARATORS)[number]

/** Feature profiles (data extraction), with the fields the tests select. */
const MII = 'https://www.medizininformatik-initiative.de/fhir/core'
export const PROFILES = {
  patient: { groupReference: `${MII}/modul-person/StructureDefinition/PatientPseudonymisiert`, name: 'MII PR Person Patient (Pseudonymisiert)' },
  condition: { groupReference: `${MII}/modul-diagnose/StructureDefinition/Diagnose`, name: 'Diagnose' },
  medicationAdministration: { groupReference: `${MII}/modul-medikation/StructureDefinition/MedicationAdministration`, name: 'Medikationsverabreichung' },
  medication: { groupReference: `${MII}/modul-medikation/StructureDefinition/Medication`, name: 'Medikation' },
} as const
export type ProfileName = keyof typeof PROFILES

export const FIELDS = {
  patientActive: 'Patient.active',
  conditionCode: 'Condition.code',
  conditionOnset: 'Condition.onset[x]',
  administrationMedication: 'MedicationAdministration.medication[x]',
  medicationCode: 'Medication.code',
} as const

/** Filters of the feature profiles, as the backend names them (`dse/profile-data` `filters`). */
export const EXTRACTION_FILTERS = {
  conditionDate: { type: 'date', name: 'recorded-date' },
  conditionCode: { type: 'token', name: 'code', system: SYSTEMS.icd10gm },
} as const
