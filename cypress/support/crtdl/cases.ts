import { atTime, criterion, withAttribute, withValue } from './criteria'
import { crtdl } from './crtdl'
import { attributeGroup, GroupOptions, patient } from './groups'
import {
  conceptAttribute,
  conceptValue,
  dateFilter,
  quantityComparator,
  quantityRange,
  referenceAttribute,
  timeRestriction,
  tokenFilter,
} from './filters'
import {
  COMPARATORS,
  DIAGNOSIS_REFERENCE_CODE,
  EXTRACTION_FILTERS,
  GENDER_CONCEPTS,
  ICD_ATTRIBUTE_CODE,
  ICD_CONCEPTS,
  DEATH_CAUSE_ATTRIBUTE_CODE,
  CERVIX_CANCER_CONCEPT,
  UNITS,
} from './ontology'
import { Crtdl, Criterion, CriterionModifier, Json } from './types'

/**
 * Named CRTDLs for `crtdl-roundtrip.feature`: case name in Examples table picks one. File only
 * composes. Values live in `ontology.ts`, shapes in `filters.ts`, `criteria.ts`, `groups.ts`.
 * Each value used more than once is named once below. Add case when bug appears in filter
 * combination. Run `npm run crtdl:validate`: failing roundtrip then means UI lost data, not
 * invalid input.
 * */
type Cases = Record<string, Crtdl>

/**
 * Values: one name per value, whatever number of cases uses it.
 * */

const DATE = { early: '2020-01-01', day: '2022-06-15', late: '2024-01-01' }
const TIMES = {
  before: timeRestriction.before(DATE.late),
  after: timeRestriction.after(DATE.early),
  between: timeRestriction.between(DATE.early, DATE.late),
  at: timeRestriction.at(DATE.day),
}

const AGE_LIMIT = 18
const WORKING_AGE = { from: AGE_LIMIT, to: 65 }
const OLDER_THAN_FIVE = quantityComparator('gt', 5, UNITS.a)
const YOUNGER_THAN_LIMIT = quantityComparator('lt', AGE_LIMIT, UNITS.a)
const WORKING_AGE_RANGE = quantityRange(WORKING_AGE.from, WORKING_AGE.to, UNITS.a)

/**
 * Criteria and features: built from values, named for what they are.
 * */

/**
 * Cause of death criterion with ICD-10-WHO concepts selected, plus any other modifier.
 * */
const icdConcepts =
  (...codes: Array<keyof typeof ICD_CONCEPTS>): CriterionModifier =>
  (c) =>
    withAttribute(
      conceptAttribute(
        ICD_ATTRIBUTE_CODE,
        codes.map((code) => ICD_CONCEPTS[code])
      )
    )(c)
/**
 * Build Cause of death criterion from ICD-10-WHO concept names plus modifiers.
 * */
const deathBy = (codes: Array<keyof typeof ICD_CONCEPTS>, ...modifiers: CriterionModifier[]) =>
  criterion('causeOfDeath', icdConcepts(...codes), ...modifiers)

const PNEUMONIA = criterion('pneumonia')
/**
 * Build Pneumonia criterion with time restriction.
 * */
const pneumoniaAt = (restriction: ReturnType<typeof timeRestriction.before>) =>
  criterion('pneumonia', atTime(restriction))
const DEATH_BY_J13 = deathBy(['J13'])
const OLDER_THAN_FIVE_CRITERION = criterion('age', withValue(OLDER_THAN_FIVE))
const WORKING_AGE_CRITERION = criterion('age', withValue(WORKING_AGE_RANGE))

/**
 * Cancer death whose `focus` references given criteria, plus any other modifier.
 * */
const cancerDeathOf = (referenced: Criterion[], ...modifiers: CriterionModifier[]) =>
  criterion(
    'oncoDeath',
    withAttribute(referenceAttribute(DIAGNOSIS_REFERENCE_CODE, referenced)),
    ...modifiers
  )
const CERVIX_CANCER = criterion('cervixCancer')
const DEATH_OF_CERVIX_CANCER = cancerDeathOf([CERVIX_CANCER])
/**
 * Shape of defect report `test_defekt_cohorte_ref.json`: reference, concept, time. Report used
 * specimen; its reference set has no criteria in ontology v5.2.2, so cancer death stands in.
 * */
const DEATH_AS_REPORTED = cancerDeathOf(
  [CERVIX_CANCER, criterion('breastCancerInFamily')],
  withAttribute(conceptAttribute(DEATH_CAUSE_ATTRIBUTE_CODE, [CERVIX_CANCER_CONCEPT])),
  atTime(TIMES.between)
)

/**
 * Build Condition feature with options.
 * */
const conditionFeature = (options: GroupOptions = {}) =>
  attributeGroup('condition', { fields: ['conditionCode'], ...options })

const CONDITION_FILTERS = {
  recordedBetween: dateFilter(EXTRACTION_FILTERS.conditionDate.name, DATE.early, DATE.late),
  recordedSince: dateFilter(EXTRACTION_FILTERS.conditionDate.name, DATE.early),
  code: tokenFilter(
    EXTRACTION_FILTERS.conditionCode.name,
    EXTRACTION_FILTERS.conditionCode.system,
    [{ code: 'J13', display: 'Pneumonie' }]
  ),
}

/**
 * Patient + MedicationAdministration whose `medication[x]` links to Medication feature.
 * */
const linkedFeatures = (options: { mustHave: boolean; referenceOnly: boolean }) => [
  patient(),
  attributeGroup('medicationAdministration', {
    fields: [
      { field: 'administrationMedication', mustHave: options.mustHave, linksTo: 'medication' },
    ],
  }),
  attributeGroup('medication', {
    fields: ['medicationCode'],
    referenceOnly: options.referenceOnly,
  }),
]

/**
 * Case builders.
 * */

/**
 * Build CRTDL with criteria in one inclusion group.
 * */
const included = (...criteria: Criterion[]) => crtdl({ inclusion: [criteria] })
/**
 * Build CRTDL with attribute groups as data extraction.
 * */
const withFeatures = (...groups: ReturnType<typeof attributeGroup>[]) =>
  crtdl({ groups: [patient(), ...groups] })

/**
 * One case per entry of `variants`, named `<prefix> <key>`.
 * */
const perVariant = <V>(
  prefix: string,
  variants: Record<string, V>,
  build: (variant: V) => Crtdl
): Cases =>
  Object.keys(variants).reduce<Cases>(
    (cases, key) => ({ ...cases, [`${prefix} ${key}`]: build(variants[key]) }),
    {}
  )

/**
 * `age <comparator> <unit>`: every comparator backend accepts, in each unit.
 * */
const comparatorCases = (): Cases =>
  COMPARATORS.reduce<Cases>(
    (cases, comparator) => ({
      ...cases,
      ...perVariant(`age ${comparator}`, UNITS, (unit) =>
        included(criterion('age', withValue(quantityComparator(comparator, AGE_LIMIT, unit))))
      ),
    }),
    {}
  )

export const CASES: Cases = {
  'no filters': crtdl(),
  ...perVariant('time', TIMES, (restriction) => included(pneumoniaAt(restriction))),
  ...comparatorCases(),

  'one concept': included(DEATH_BY_J13),
  'several concepts': included(deathBy(['J13', 'J15.0'])),
  'concept and time': included(deathBy(['J13'], atTime(TIMES.before))),
  'age quantity-comparator': included(OLDER_THAN_FIVE_CRITERION),
  'age quantity-range': included(WORKING_AGE_CRITERION),
  'gender concept': included(
    criterion('gender', withValue(conceptValue([GENDER_CONCEPTS.female])))
  ),

  'exclusion with filter': crtdl({
    exclusion: [[criterion('age', withValue(YOUNGER_THAN_LIMIT))]],
  }),
  'alternatives in one group': included(PNEUMONIA, DEATH_BY_J13),
  'two groups': crtdl({ inclusion: [[PNEUMONIA], [OLDER_THAN_FIVE_CRITERION]] }),

  'features with must have': withFeatures(
    conditionFeature({ fields: [{ field: 'conditionCode', mustHave: true }, 'conditionOnset'] })
  ),
  'feature with date filter': withFeatures(
    conditionFeature({ filters: [CONDITION_FILTERS.recordedBetween] })
  ),
  'feature with code filter': withFeatures(conditionFeature({ filters: [CONDITION_FILTERS.code] })),

  'reference to one diagnosis': included(DEATH_OF_CERVIX_CANCER),
  'reference to several diagnoses': included(
    cancerDeathOf([CERVIX_CANCER, criterion('breastCancerInFamily')])
  ),
  'reference to diagnosis with time': included(
    cancerDeathOf([criterion('cervixCancer', atTime(TIMES.before))])
  ),
  'reference and concept': included(DEATH_AS_REPORTED),
  'reference in exclusion': crtdl({ exclusion: [[DEATH_OF_CERVIX_CANCER]] }),
  'reference as alternative': included(PNEUMONIA, DEATH_OF_CERVIX_CANCER),
  'reference as reported': crtdl({
    inclusion: [[DEATH_AS_REPORTED], [OLDER_THAN_FIVE_CRITERION]],
    exclusion: [[DEATH_AS_REPORTED]],
  }),

  'linked feature': crtdl({ groups: linkedFeatures({ mustHave: false, referenceOnly: false }) }),
  'linked feature with must have': crtdl({
    groups: linkedFeatures({ mustHave: true, referenceOnly: false }),
  }),
  'linked feature included only if referenced': crtdl({
    groups: linkedFeatures({ mustHave: false, referenceOnly: true }),
  }),

  'everything at once': crtdl({
    inclusion: [[DEATH_BY_J13], [WORKING_AGE_CRITERION]],
    exclusion: [[pneumoniaAt(TIMES.after)]],
    groups: [
      patient(),
      conditionFeature({
        fields: [{ field: 'conditionCode', mustHave: true }],
        filters: [CONDITION_FILTERS.recordedSince],
      }),
    ],
  }),
}

/**
 * Broken CRTDLs: one wrong detail each. Backend must reject every one (`npm run
 * crtdl:validate` checks), UI must show error log, not crash or load half.
 * */
const brokenReference = (filter: Json) => included(criterion('oncoDeath', withAttribute(filter)))

export const MUTANTS: Cases = {
  'reference to criterion outside criteria set': included(cancerDeathOf([PNEUMONIA])),
  'reference to unknown diagnosis code': included(
    cancerDeathOf([
      { ...CERVIX_CANCER, termCodes: [{ ...CERVIX_CANCER.termCodes[0], code: 'C99.99' }] },
    ])
  ),
  'reference without criteria': included(cancerDeathOf([])),
  'reference with unknown attribute code': brokenReference(
    referenceAttribute({ ...DIAGNOSIS_REFERENCE_CODE, code: 'unbekannt' }, [CERVIX_CANCER])
  ),
  'reference with concepts instead of criteria': brokenReference({
    type: 'reference',
    attributeCode: DIAGNOSIS_REFERENCE_CODE,
    selectedConcepts: [CERVIX_CANCER.termCodes[0]],
  }),
}

/**
 * Return named case or mutant. Throw on unknown name.
 * */
export function caseNamed(name: string): Crtdl {
  const found = CASES[name] ?? MUTANTS[name]
  if (!found)
    throw new Error(
      `No CRTDL case named "${name}". Known: ${Object.keys({ ...CASES, ...MUTANTS }).join(', ')}`
    )
  return found
}
