import { Json } from './types'

/**
 * Facts about local test ontology, nothing else: no JSON shapes, no logic. Every value was
 * looked up in `ontology` Elasticsearch index, `GET terminology/ui-profile` or `GET
 * dse/profile-data` (commands in `cypress/TEST_DATA.md`). On ontology version change this is
 * only file to re-verify: `npm run crtdl:validate` then checks backend still accepts every
 * generated case.
 * */
export const SYSTEMS = {
  snomed: 'http://snomed.info/sct',
  loinc: 'http://loinc.org',
  icd10who: 'http://hl7.org/fhir/sid/icd-10',
  icd10gm: 'http://fhir.de/CodeSystem/bfarm/icd-10-gm',
  gender: 'http://hl7.org/fhir/administrative-gender',
} as const

const CONTEXT = { system: 'fdpg.mii.cds', version: '1.0.0' }
/**
 * Build context object for code.
 * */
export const context = (code: string): Json => ({ ...CONTEXT, code, display: code })

/**
 * Criteria scenario can name. `profile` = ui-profile deciding which filters criterion has.
 * */
export const CRITERIA = {
  pneumonia: {
    system: SYSTEMS.snomed,
    code: '233604007',
    display: 'Pneumonia',
    context: 'Diagnose',
    profile: 'time restriction only',
  },
  causeOfDeath: {
    system: SYSTEMS.loinc,
    code: '79378-6',
    display: 'Cause of death',
    context: 'Todesursache',
    profile: 'one ICD-10-WHO concept attribute',
  },
  age: {
    system: SYSTEMS.snomed,
    code: '424144002',
    display: 'Gegenwärtiges chronologisches Alter',
    context: 'Patient',
    profile: 'quantity value filter, units a and mo',
  },
  gender: {
    system: SYSTEMS.snomed,
    code: '263495000',
    display: 'Geschlecht',
    context: 'Patient',
    profile: 'concept value filter',
  },
} as const
export type CriterionName = keyof typeof CRITERIA

/**
 * Concepts offered by ICD-10-WHO attribute of `causeOfDeath`.
 * */
export const ICD_CONCEPTS = {
  J13: {
    system: SYSTEMS.icd10who,
    code: 'J13',
    display: 'Pneumonie durch Streptococcus pneumoniae',
  },
  'J15.0': {
    system: SYSTEMS.icd10who,
    code: 'J15.0',
    display: 'Pneumonie durch Klebsiella pneumoniae',
  },
} as const

export const GENDER_CONCEPTS = {
  female: { system: SYSTEMS.gender, code: 'female', display: 'female' },
  male: { system: SYSTEMS.gender, code: 'male', display: 'male' },
} as const

/**
 * Concept attribute of `causeOfDeath`, as backend names it.
 * */
export const ICD_ATTRIBUTE_CODE = {
  code: 'icd10-who',
  system: 'http://hl7.org/fhir/StructureDefinition',
  display: 'ICD-10-WHO',
}

/**
 * Units of quantity value filter. Unit is `{code, display}`, no `system`.
 * */
export const UNITS = { a: { code: 'a', display: 'a' }, mo: { code: 'mo', display: 'mo' } } as const
export type UnitName = keyof typeof UNITS

/**
 * Comparators backend accepts. `ne` absent: `validation/crtdl` answers 500 for it.
 * */
export const COMPARATORS = ['gt', 'lt', 'ge', 'le', 'eq'] as const
export type Comparator = (typeof COMPARATORS)[number]

/**
 * Feature profiles (data extraction), with fields tests select.
 * */
const MII = 'https://www.medizininformatik-initiative.de/fhir/core'
export const PROFILES = {
  patient: {
    groupReference: `${MII}/modul-person/StructureDefinition/PatientPseudonymisiert`,
    name: 'MII PR Person Patient (Pseudonymisiert)',
  },
  condition: {
    groupReference: `${MII}/modul-diagnose/StructureDefinition/Diagnose`,
    name: 'Diagnose',
  },
  medicationAdministration: {
    groupReference: `${MII}/modul-medikation/StructureDefinition/MedicationAdministration`,
    name: 'Medikationsverabreichung',
  },
  medication: {
    groupReference: `${MII}/modul-medikation/StructureDefinition/Medication`,
    name: 'Medikation',
  },
} as const
export type ProfileName = keyof typeof PROFILES

export const FIELDS = {
  patientActive: 'Patient.active',
  conditionCode: 'Condition.code',
  conditionOnset: 'Condition.onset[x]',
  administrationMedication: 'MedicationAdministration.medication[x]',
  medicationCode: 'Medication.code',
} as const

/**
 * Filters of feature profiles, as backend names them (`dse/profile-data` `filters`).
 * */
export const EXTRACTION_FILTERS = {
  conditionDate: { type: 'date', name: 'recorded-date' },
  conditionCode: { type: 'token', name: 'code', system: SYSTEMS.icd10gm },
} as const
