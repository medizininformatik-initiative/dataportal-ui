import {
  CRITERIA,
  CriterionName,
  GENDER_CONCEPTS,
  ICD_ATTRIBUTE_CODE,
  ICD_CONCEPTS,
  UNITS,
  context,
} from '../../../../test-support/crtdl/ontology'
import { CCDLCohortDefinition } from './CCDLCohortDefinition'
import { CCDLCriterion } from './CCDLCriterion'
import {
  CCDLAttributeFilter,
  CCDLComparator,
  CCDLReferencedCriterion,
  CCDLValueFilter,
} from './CCDLFilters'
import { CCDLTermCode } from './CCDLTermCode'
import { CCDLTimeRestriction } from './CCDLTimeRestriction'

/**
 * Case tables for `cohort-definition.types.spec.ts`, mirroring the cohort-definition half of
 * `crtdl-roundtrip.feature` (the feature selection cases have no CCDL counterpart). Values come from
 * `test-support/crtdl/ontology.ts`, so the Cypress roundtrip and these types use the same codes.
 */
const AFTERDATE = '2022-06-15'
const BEFOREDATE = '2024-01-01'
/** The ontology criteria the cases use (names in `test-support/crtdl/ontology.ts`). */
const PNEUMONIA = 'pneumonia' satisfies CriterionName
const AGE = 'age' satisfies CriterionName
const CAUSE_OF_DEATH = 'causeOfDeath' satisfies CriterionName

/** The `type` discriminators of the filter unions. */
const CONCEPT = 'concept'
export const QUANTITY_COMPARATOR = 'quantity-comparator'
const QUANTITY_RANGE = 'quantity-range'
const REFERENCE = 'reference'
export const VERSION = 'http://to_be_decided.com/draft-1/schema#'
const DISPLAY = 'Ausgewählte Merkmale'
const AGE_LIMIT = 18
const AGE_MAX = 65
const OLDER_THAN = 5
const RANGE = { minValue: 1, maxValue: 2 }
/** The comparators the editor offers (`ge` and `le` are not in `CCDLComparator` yet). */
const GREATER_THAN = 'gt' satisfies CCDLComparator
const LESS_THAN = 'lt' satisfies CCDLComparator
const EQUAL = 'eq' satisfies CCDLComparator
const COMPARATORS: CCDLComparator[] = [GREATER_THAN, LESS_THAN, EQUAL]
const UNIT_NAMES = Object.keys(UNITS) as Array<keyof typeof UNITS>

const termCode = ({ code, system, display }: CCDLTermCode): CCDLTermCode => ({
  code,
  system,
  display,
})

const FEMALE = termCode(GENDER_CONCEPTS.female)
const MALE = termCode(GENDER_CONCEPTS.male)
const J13 = termCode(ICD_CONCEPTS.J13)
const J15_0 = termCode(ICD_CONCEPTS['J15.0'])

/** The time restrictions the editor offers: before / after / between / at (one day twice). */
const AFTER: CCDLTimeRestriction = { afterDate: AFTERDATE }
const BEFORE: CCDLTimeRestriction = { beforeDate: BEFOREDATE }
const BETWEEN: CCDLTimeRestriction = { afterDate: AFTERDATE, beforeDate: BEFOREDATE }
const AT: CCDLTimeRestriction = { afterDate: AFTERDATE, beforeDate: AFTERDATE }

/** Filters, each named for what it selects. */
const olderThanFilter: CCDLValueFilter = {
  type: QUANTITY_COMPARATOR,
  comparator: GREATER_THAN,
  value: OLDER_THAN,
  unit: UNITS.a,
}
const youngerThanLimitFilter: CCDLValueFilter = {
  type: QUANTITY_COMPARATOR,
  comparator: LESS_THAN,
  value: AGE_LIMIT,
  unit: UNITS.a,
}
const workingAgeFilter: CCDLValueFilter = {
  type: QUANTITY_RANGE,
  minValue: AGE_LIMIT,
  maxValue: AGE_MAX,
  unit: UNITS.a,
}
const femaleFilter: CCDLValueFilter = { type: CONCEPT, selectedConcepts: [FEMALE] }
const femaleOrMaleFilter: CCDLValueFilter = { type: CONCEPT, selectedConcepts: [FEMALE, MALE] }
const deathByJ13Filter: CCDLAttributeFilter = {
  type: CONCEPT,
  attributeCode: ICD_ATTRIBUTE_CODE,
  selectedConcepts: [J13],
}
const deathByJ13OrJ15Filter: CCDLAttributeFilter = {
  ...deathByJ13Filter,
  selectedConcepts: [J13, J15_0],
}

/** A criterion by its name in the ontology, e.g. `criterion(AGE, { valueFilter })`. */
const criterion = (name: CriterionName, extra: Partial<CCDLCriterion> = {}): CCDLCriterion => ({
  context: context(CRITERIA[name].context) as unknown as CCDLTermCode,
  termCodes: [termCode(CRITERIA[name])],
  ...extra,
})

const cohort = (
  inclusionCriteria: CCDLCohortDefinition['inclusionCriteria'],
  exclusionCriteria?: CCDLCohortDefinition['exclusionCriteria']
): CCDLCohortDefinition => ({
  version: VERSION,
  display: DISPLAY,
  inclusionCriteria,
  ...(exclusionCriteria ? { exclusionCriteria } : {}),
})

const pneumonia = criterion(PNEUMONIA)
const pneumoniaAfter = criterion(PNEUMONIA, { timeRestriction: AFTER })
const olderThanFive = criterion(AGE, { valueFilter: olderThanFilter })
const youngerThanLimit = criterion(AGE, { valueFilter: youngerThanLimitFilter })
const workingAge = criterion(AGE, { valueFilter: workingAgeFilter })
const deathByJ13 = criterion(CAUSE_OF_DEATH, { attributeFilters: [deathByJ13Filter] })
const deathByJ13Before = criterion(CAUSE_OF_DEATH, {
  attributeFilters: [deathByJ13Filter],
  timeRestriction: BEFORE,
})

// --- Accepted: the types compile and the schema accepts them -------------------------------

const referencedPneumonia = pneumonia as CCDLReferencedCriterion
/** One reference level only: a referenced criterion cannot hold a reference filter again. */
const referenceFilter: CCDLAttributeFilter = {
  type: REFERENCE,
  attributeCode: ICD_ATTRIBUTE_CODE,
  criteria: [referencedPneumonia],
}
const attributeOlderThanFilter: CCDLAttributeFilter = {
  type: QUANTITY_COMPARATOR,
  attributeCode: ICD_ATTRIBUTE_CODE,
  comparator: GREATER_THAN,
  value: OLDER_THAN,
}
const attributeRangeFilter: CCDLAttributeFilter = {
  type: QUANTITY_RANGE,
  attributeCode: ICD_ATTRIBUTE_CODE,
  ...RANGE,
}

export const timeRestrictionCases: [string, CCDLTimeRestriction][] = [
  ['after only', AFTER],
  ['before only', BEFORE],
  ['both', BETWEEN],
  ['at (same day twice)', AT],
]

/** Value filters, on the criterion itself (`Age`, `Gender`). */
export const valueFilterCases: [string, CCDLValueFilter][] = [
  ['concept', femaleFilter],
  ['concepts, several', femaleOrMaleFilter],
  ['comparator gt', { type: QUANTITY_COMPARATOR, comparator: GREATER_THAN, value: OLDER_THAN }],
  ['range', { type: QUANTITY_RANGE, ...RANGE }],
  ['range with unit', workingAgeFilter],
]

/** Every comparator the editor offers, in each unit: `age <comparator> <unit>`. */
export const comparatorCases: [string, CCDLValueFilter][] = COMPARATORS.flatMap((comparator) =>
  UNIT_NAMES.map((unit): [string, CCDLValueFilter] => [
    `age ${comparator} ${unit}`,
    { type: QUANTITY_COMPARATOR, comparator, value: AGE_LIMIT, unit: UNITS[unit] },
  ])
)

/** Attribute filters, on an attribute of the resource (`Cause of death` -> ICD-10-WHO). */
export const attributeFilterCases: [string, CCDLAttributeFilter][] = [
  ['one concept', deathByJ13Filter],
  ['several concepts', deathByJ13OrJ15Filter],
  ['comparator', attributeOlderThanFilter],
  ['range', attributeRangeFilter],
  ['reference', referenceFilter],
]

/** Whole cohort definitions: criteria with their filters, and how groups combine. */
export const cohortStructureCases: [string, CCDLCohortDefinition][] = [
  ['no filters', cohort([[pneumonia]])],
  ['concept and time', cohort([[deathByJ13Before]])],
  ['exclusion with filter', cohort([[pneumonia]], [[youngerThanLimit]])],
  ['alternatives in one group', cohort([[pneumonia, deathByJ13]])],
  ['two groups', cohort([[pneumonia], [olderThanFive]])],
  ['everything at once', cohort([[deathByJ13], [workingAge]], [[pneumoniaAfter]])],
]

// --- Rejected: the schema rejects them; where the compiler can tell, it rejects them too -----

// @ts-expect-error afterDate or beforeDate is required
const emptyTimeRestriction: CCDLTimeRestriction = {}
// @ts-expect-error termCodes needs at least one entry
const noTermCodes: CCDLCriterion['termCodes'] = []
// @ts-expect-error 'between' is not a comparator
const unknownComparator: CCDLComparator = 'between'
// @ts-expect-error attributeCode is required on attribute filters
const filterWithoutCode: CCDLAttributeFilter = { type: CONCEPT, selectedConcepts: [J13] }
// @ts-expect-error inclusionCriteria needs at least one group
const noInclusionCriteria: CCDLCohortDefinition = { version: VERSION, inclusionCriteria: [] }
// @ts-expect-error exclusionCriteria is omitted when empty, never an empty list
const noExclusion: CCDLCohortDefinition['exclusionCriteria'] = []
const emptyExclusionCriteria = { ...cohort([[pneumonia]]), exclusionCriteria: noExclusion }
// @ts-expect-error referenced criteria cannot hold reference filters
const innerFilters: CCDLReferencedCriterion['attributeFilters'] = [referenceFilter]
const nestedReference: CCDLReferencedCriterion = { ...pneumonia, attributeFilters: innerFilters }

/** Not an error for the compiler (extra properties on a non-literal pass), only for the schema. */
const criterionWithExtraProperty = { ...pneumonia, extra: 1 }

/** Typed `unknown` on purpose: these are documents the app must never produce. */
export const rejectedCases: [string, unknown][] = [
  ['a property the schema does not know', cohort([[criterionWithExtraProperty]])],
  [
    'an empty time restriction',
    cohort([[criterion(PNEUMONIA, { timeRestriction: emptyTimeRestriction })]]),
  ],
  // The compiler cannot check a date format, only the schema can.
  [
    'a date that is not YYYY-MM-DD',
    cohort([[criterion(PNEUMONIA, { timeRestriction: { afterDate: 'yesterday' } })]]),
  ],
  ['a criterion without term codes', cohort([[criterion(PNEUMONIA, { termCodes: noTermCodes })]])],
  [
    'a comparator the schema does not know',
    cohort([
      [
        criterion(AGE, {
          valueFilter: {
            type: QUANTITY_COMPARATOR,
            comparator: unknownComparator,
            value: AGE_LIMIT,
          },
        }),
      ],
    ]),
  ],
  [
    'an attribute filter without attributeCode',
    cohort([[criterion(CAUSE_OF_DEATH, { attributeFilters: [filterWithoutCode] })]]),
  ],
  [
    'a reference inside a reference',
    cohort([
      [
        criterion(CAUSE_OF_DEATH, {
          attributeFilters: [
            { ...referenceFilter, criteria: [nestedReference] } as CCDLAttributeFilter,
          ],
        }),
      ],
    ]),
  ],
  ['no inclusion criteria', noInclusionCriteria],
  ['an empty list of exclusion criteria', emptyExclusionCriteria],
]
