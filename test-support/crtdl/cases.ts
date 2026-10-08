import { atTime, criterion, withAttribute, withValue } from './criteria'
import { crtdl } from './crtdl'
import { attributeGroup, GroupOptions, patient } from './groups'
import { conceptAttribute, conceptValue, dateFilter, quantityComparator, quantityRange, timeRestriction, tokenFilter } from './filters'
import { COMPARATORS, EXTRACTION_FILTERS, GENDER_CONCEPTS, ICD_ATTRIBUTE_CODE, ICD_CONCEPTS, UNITS } from './ontology'
import { Crtdl, Criterion, CriterionModifier } from './types'

/**
 * Named CRTDLs for `crtdl-roundtrip.feature`: a case name in the feature's Examples table picks
 * one. This file only composes - values live in `ontology.ts`, shapes in `filters.ts`,
 * `criteria.ts` and `groups.ts`, and each value used more than once is named once below. Add a
 * case when a bug shows up in a filter combination, and run `npm run crtdl:validate` so a failing
 * roundtrip means the UI lost data, not that the input was invalid.
 */
type Cases = Record<string, Crtdl>

// --- Values: one name per value, whatever number of cases uses it ---------------------------

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

// --- Criteria and features: built from the values, named for what they are ------------------

/** The Cause of death criterion with ICD-10-WHO concepts selected, plus any other modifier. */
const icdConcepts =
  (...codes: Array<keyof typeof ICD_CONCEPTS>): CriterionModifier =>
  (c) =>
    withAttribute(
      conceptAttribute(
        ICD_ATTRIBUTE_CODE,
        codes.map((code) => ICD_CONCEPTS[code])
      )
    )(c)
const deathBy = (codes: Array<keyof typeof ICD_CONCEPTS>, ...modifiers: CriterionModifier[]) =>
  criterion('causeOfDeath', icdConcepts(...codes), ...modifiers)

const PNEUMONIA = criterion('pneumonia')
const pneumoniaAt = (restriction: ReturnType<typeof timeRestriction.before>) => criterion('pneumonia', atTime(restriction))
const DEATH_BY_J13 = deathBy(['J13'])
const OLDER_THAN_FIVE_CRITERION = criterion('age', withValue(OLDER_THAN_FIVE))
const WORKING_AGE_CRITERION = criterion('age', withValue(WORKING_AGE_RANGE))

const conditionFeature = (options: GroupOptions = {}) => attributeGroup('condition', { fields: ['conditionCode'], ...options })

const CONDITION_FILTERS = {
  recordedBetween: dateFilter(EXTRACTION_FILTERS.conditionDate.name, DATE.early, DATE.late),
  recordedSince: dateFilter(EXTRACTION_FILTERS.conditionDate.name, DATE.early),
  code: tokenFilter(EXTRACTION_FILTERS.conditionCode.name, EXTRACTION_FILTERS.conditionCode.system, [
    { code: 'J13', display: 'Pneumonie' },
  ]),
}

/** Patient + MedicationAdministration whose `medication[x]` links to the Medication feature. */
const linkedFeatures = (options: { mustHave: boolean; referenceOnly: boolean }) => [
  patient(),
  attributeGroup('medicationAdministration', {
    fields: [{ field: 'administrationMedication', mustHave: options.mustHave, linksTo: 'medication' }],
  }),
  attributeGroup('medication', { fields: ['medicationCode'], referenceOnly: options.referenceOnly }),
]

// --- Case builders ---------------------------------------------------------------------------

const included = (...criteria: Criterion[]) => crtdl({ inclusion: [criteria] })
const withFeatures = (...groups: ReturnType<typeof attributeGroup>[]) => crtdl({ groups: [patient(), ...groups] })

/** One case per entry of `variants`, named `<prefix> <key>`. */
const perVariant = <V>(prefix: string, variants: Record<string, V>, build: (variant: V) => Crtdl): Cases =>
  Object.keys(variants).reduce<Cases>((cases, key) => ({ ...cases, [`${prefix} ${key}`]: build(variants[key]) }), {})

/** `age <comparator> <unit>`: every comparator the backend accepts, in each unit. */
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
  'age greater than': included(OLDER_THAN_FIVE_CRITERION),
  'age range': included(WORKING_AGE_CRITERION),
  'gender concept': included(criterion('gender', withValue(conceptValue([GENDER_CONCEPTS.female])))),

  'exclusion with filter': crtdl({ exclusion: [[criterion('age', withValue(YOUNGER_THAN_LIMIT))]] }),
  'alternatives in one group': included(PNEUMONIA, DEATH_BY_J13),
  'two groups': crtdl({ inclusion: [[PNEUMONIA], [OLDER_THAN_FIVE_CRITERION]] }),

  'features with must have': withFeatures(conditionFeature({ fields: [{ field: 'conditionCode', mustHave: true }, 'conditionOnset'] })),
  'feature with date filter': withFeatures(conditionFeature({ filters: [CONDITION_FILTERS.recordedBetween] })),
  'feature with code filter': withFeatures(conditionFeature({ filters: [CONDITION_FILTERS.code] })),

  'linked feature': crtdl({ groups: linkedFeatures({ mustHave: false, referenceOnly: false }) }),
  'linked feature with must have': crtdl({ groups: linkedFeatures({ mustHave: true, referenceOnly: false }) }),
  'linked feature included only if referenced': crtdl({ groups: linkedFeatures({ mustHave: false, referenceOnly: true }) }),

  'everything at once': crtdl({
    inclusion: [[DEATH_BY_J13], [WORKING_AGE_CRITERION]],
    exclusion: [[pneumoniaAt(TIMES.after)]],
    groups: [
      patient(),
      conditionFeature({ fields: [{ field: 'conditionCode', mustHave: true }], filters: [CONDITION_FILTERS.recordedSince] }),
    ],
  }),
}

export function caseNamed(name: string): Crtdl {
  const found = CASES[name]
  if (!found) throw new Error(`No CRTDL case named "${name}". Known: ${Object.keys(CASES).join(', ')}`)
  return found
}
