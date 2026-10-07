import { AfterFilter } from 'src/app/model/FeasibilityQuery/Criterion/TimeRestriction/AfterFilter'
import { AbstractTimeRestriction } from 'src/app/model/FeasibilityQuery/Criterion/TimeRestriction/AbstractTimeRestriction'
import { AtFilter } from 'src/app/model/FeasibilityQuery/Criterion/TimeRestriction/AtFilter'
import { BeforeFilter } from 'src/app/model/FeasibilityQuery/Criterion/TimeRestriction/BeforeFilter'
import { BetweenFilter } from 'src/app/model/FeasibilityQuery/Criterion/TimeRestriction/BetweenFilter'
import { FilterTypes } from 'src/app/model/Utilities/FilterTypes'
import { QuantityComparisonOption } from 'src/app/model/Utilities/Quantity/QuantityFilterOptions'
import { TerminologyCode } from 'src/app/model/Terminology/TerminologyCode'
import {
  ATTRIBUTE_WIRE,
  attributeFilter,
  code,
  cohort,
  comparator,
  concept,
  CONTEXT_WIRE,
  criterion,
  DEFAULT_DISPLAY,
  included,
  Json,
  pneumonia,
  range,
  referenceCriterion,
  referenceTo,
  UiQuery,
  valueFilter,
  wire,
  MONTHS,
  MONTHS_WIRE,
  YEARS,
  YEARS_WIRE,
} from './ui-to-cohort-definition.fixtures'

/**
 * Every accepted UI query of `UIQuery2CohortDefinitionService`, with the exact JSON it must produce.
 * Read top to bottom: one entry is one case, grouped by what it exercises.
 *
 * Characterization: the expectations were derived from the serialized keys of the current classes
 * and verified against the current implementation. The translator is being rewritten to return plain
 * data, and every case must keep passing unchanged. The spec also checks each output against the
 * CCDL v1 schema.
 */
export interface Case {
  /** What the case shows, as a sentence. */
  name: string
  /** The UI query. A function, because building it registers criteria in the test's providers. */
  query: () => UiQuery
  /** The exact wire JSON. */
  expected: Json | (() => Json)
}

export interface CaseGroup {
  title: string
  cases: Case[]
}

const MONTH = { ui: MONTHS, wire: MONTHS_WIRE }

// --- Small helpers that keep the entries below one-liners -----------------------------------

const timeCase = (name: string, restriction: AbstractTimeRestriction, onWire: Json): Case => ({
  name,
  query: () => included(criterion({ timeRestriction: restriction })),
  expected: cohort([[pneumonia({ timeRestriction: onWire })]]),
})

const comparatorCase = (
  name: string,
  option: QuantityComparisonOption,
  onWire: 'eq' | 'lt' | 'gt',
  unit = { ui: YEARS, wire: YEARS_WIRE }
): Case => ({
  name,
  query: () =>
    included(
      criterion({
        valueFilters: [
          valueFilter(FilterTypes.QUANTITY_COMPARATOR, {
            quantity: comparator(option, 18, unit.ui),
          }),
        ],
      })
    ),
  expected: cohort([
    [
      pneumonia({
        valueFilter: {
          type: 'quantity-comparator',
          comparator: onWire,
          value: 18,
          unit: unit.wire,
        },
      }),
    ],
  ]),
})

// --- The cases ------------------------------------------------------------------------------

export const GROUPS: CaseGroup[] = [
  {
    title: 'structure of the cohort definition',
    cases: [
      {
        name: 'a criterion without filters',
        query: () => included(criterion()),
        expected: cohort([[pneumonia()]]),
      },
      {
        name: 'the name given to the query',
        query: () => ({ ...included(criterion()), display: 'My cohort' }),
        expected: cohort([[pneumonia()]], { display: 'My cohort' }),
      },
      {
        name: 'a new query that was never named is called "Ausgewählte Merkmale"',
        query: () => ({ ...included(criterion()), display: null }),
        expected: cohort([[pneumonia()]], { display: DEFAULT_DISPLAY }),
      },
      {
        name: 'criteria in one group stay together, further groups are separate lists',
        query: () => ({ inclusion: [[criterion(), criterion()], [criterion()]] }),
        expected: cohort([[pneumonia(), pneumonia()], [pneumonia()]]),
      },
      {
        name: 'exclusion criteria',
        query: () => ({ inclusion: [[criterion()]], exclusion: [[criterion()]] }),
        expected: cohort([[pneumonia()]], { exclusionCriteria: [[pneumonia()]] }),
      },
      {
        name: 'an exclusion criterion keeps its value filter',
        query: () => ({
          inclusion: [[criterion()]],
          exclusion: [
            [
              criterion({
                valueFilters: [
                  valueFilter(FilterTypes.QUANTITY_COMPARATOR, {
                    quantity: comparator(QuantityComparisonOption.LESS_THAN, 18),
                  }),
                ],
              }),
            ],
          ],
        }),
        expected: cohort([[pneumonia()]], {
          exclusionCriteria: [
            [
              pneumonia({
                valueFilter: {
                  type: 'quantity-comparator',
                  comparator: 'lt',
                  value: 18,
                  unit: YEARS_WIRE,
                },
              }),
            ],
          ],
        }),
      },
      {
        name: 'a term code keeps its version (as in a real saved CRTDL)',
        query: () =>
          included(
            criterion({
              termCodes: [
                new TerminologyCode(
                  '33355-9',
                  'Urea nitrogen [Moles/volume] in 24 hour Urine',
                  'http://loinc.org',
                  '2.81'
                ),
              ],
            })
          ),
        expected: cohort([
          [
            {
              termCodes: [
                {
                  code: '33355-9',
                  display: 'Urea nitrogen [Moles/volume] in 24 hour Urine',
                  system: 'http://loinc.org',
                  version: '2.81',
                },
              ],
              context: CONTEXT_WIRE,
            },
          ],
        ]),
      },
    ],
  },
  {
    title: 'time restrictions',
    cases: [
      timeCase('after a day', new AfterFilter('2020-01-01'), { afterDate: '2020-01-01' }),
      timeCase('before a day', new BeforeFilter('2024-01-01'), { beforeDate: '2024-01-01' }),
      timeCase('at a day', new AtFilter('2022-06-15', '2022-06-15'), {
        afterDate: '2022-06-15',
        beforeDate: '2022-06-15',
      }),
      timeCase('between two days', new BetweenFilter('2020-01-01', '2024-01-01'), {
        afterDate: '2020-01-01',
        beforeDate: '2024-01-01',
      }),
    ],
  },
  {
    title: 'value filters (on the criterion itself)',
    cases: [
      comparatorCase('quantity comparator: equal', QuantityComparisonOption.EQUAL, 'eq'),
      comparatorCase('quantity comparator: less than', QuantityComparisonOption.LESS_THAN, 'lt'),
      comparatorCase(
        'quantity comparator: greater than',
        QuantityComparisonOption.GREATER_THAN,
        'gt'
      ),
      comparatorCase(
        'quantity comparator in months: equal',
        QuantityComparisonOption.EQUAL,
        'eq',
        MONTH
      ),
      comparatorCase(
        'quantity comparator in months: less than',
        QuantityComparisonOption.LESS_THAN,
        'lt',
        MONTH
      ),
      comparatorCase(
        'quantity comparator in months: greater than',
        QuantityComparisonOption.GREATER_THAN,
        'gt',
        MONTH
      ),
      {
        name: 'quantity range',
        query: () =>
          included(
            criterion({
              valueFilters: [valueFilter(FilterTypes.QUANTITY_RANGE, { quantity: range(18, 65) })],
            })
          ),
        expected: cohort([
          [
            pneumonia({
              valueFilter: { type: 'quantity-range', minValue: 18, maxValue: 65, unit: YEARS_WIRE },
            }),
          ],
        ]),
      },
      {
        name: 'concepts',
        query: () =>
          included(
            criterion({
              valueFilters: [
                valueFilter(FilterTypes.CONCEPT, {
                  concept: concept(code('female'), code('male')),
                }),
              ],
            })
          ),
        expected: cohort([
          [
            pneumonia({
              valueFilter: { type: 'concept', selectedConcepts: [wire('female'), wire('male')] },
            }),
          ],
        ]),
      },
    ],
  },
  {
    title: 'attribute filters (on one attribute of the resource)',
    cases: [
      {
        name: 'concepts',
        query: () =>
          included(
            criterion({
              attributeFilters: [
                attributeFilter(FilterTypes.CONCEPT, {
                  concept: concept(code('J13', 'http://icd')),
                }),
              ],
            })
          ),
        expected: cohort([
          [
            pneumonia({
              attributeFilters: [
                {
                  type: 'concept',
                  attributeCode: ATTRIBUTE_WIRE,
                  selectedConcepts: [wire('J13', 'http://icd')],
                },
              ],
            }),
          ],
        ]),
      },
      {
        name: 'several concepts',
        query: () =>
          included(
            criterion({
              attributeFilters: [
                attributeFilter(FilterTypes.CONCEPT, {
                  concept: concept(code('J13', 'http://icd'), code('J15.0', 'http://icd')),
                }),
              ],
            })
          ),
        expected: cohort([
          [
            pneumonia({
              attributeFilters: [
                {
                  type: 'concept',
                  attributeCode: ATTRIBUTE_WIRE,
                  selectedConcepts: [wire('J13', 'http://icd'), wire('J15.0', 'http://icd')],
                },
              ],
            }),
          ],
        ]),
      },
      {
        name: 'concepts together with a time restriction',
        query: () =>
          included(
            criterion({
              timeRestriction: new BeforeFilter('2024-01-01'),
              attributeFilters: [
                attributeFilter(FilterTypes.CONCEPT, {
                  concept: concept(code('J13', 'http://icd')),
                }),
              ],
            })
          ),
        expected: cohort([
          [
            pneumonia({
              timeRestriction: { beforeDate: '2024-01-01' },
              attributeFilters: [
                {
                  type: 'concept',
                  attributeCode: ATTRIBUTE_WIRE,
                  selectedConcepts: [wire('J13', 'http://icd')],
                },
              ],
            }),
          ],
        ]),
      },
      {
        name: 'quantity comparator',
        query: () =>
          included(
            criterion({
              attributeFilters: [
                attributeFilter(FilterTypes.QUANTITY_COMPARATOR, {
                  quantity: comparator(QuantityComparisonOption.LESS_THAN, 5),
                }),
              ],
            })
          ),
        expected: cohort([
          [
            pneumonia({
              attributeFilters: [
                {
                  type: 'quantity-comparator',
                  attributeCode: ATTRIBUTE_WIRE,
                  comparator: 'lt',
                  value: 5,
                  unit: YEARS_WIRE,
                },
              ],
            }),
          ],
        ]),
      },
      {
        name: 'quantity range',
        query: () =>
          included(
            criterion({
              attributeFilters: [
                attributeFilter(FilterTypes.QUANTITY_RANGE, { quantity: range(1, 2) }),
              ],
            })
          ),
        expected: cohort([
          [
            pneumonia({
              attributeFilters: [
                {
                  type: 'quantity-range',
                  attributeCode: ATTRIBUTE_WIRE,
                  minValue: 1,
                  maxValue: 2,
                  unit: YEARS_WIRE,
                },
              ],
            }),
          ],
        ]),
      },
      {
        name: 'a reference to another criterion',
        query: () =>
          included(
            criterion({
              attributeFilters: [
                attributeFilter(FilterTypes.REFERENCE, {
                  reference: referenceTo(referenceCriterion(new AfterFilter('2020-01-01'))),
                }),
              ],
            })
          ),
        expected: cohort([
          [
            pneumonia({
              attributeFilters: [
                {
                  type: 'reference',
                  attributeCode: ATTRIBUTE_WIRE,
                  criteria: [
                    {
                      termCodes: [wire('referenced')],
                      context: CONTEXT_WIRE,
                      timeRestriction: { afterDate: '2020-01-01' },
                    },
                  ],
                },
              ],
            }),
          ],
        ]),
      },
    ],
  },
]
