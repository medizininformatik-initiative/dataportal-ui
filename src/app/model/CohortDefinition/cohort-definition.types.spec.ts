import { describe, expect, it } from '@jest/globals'
import { CASES } from '../../../../test-support/crtdl/cases'
import { cohortDefinitionErrors } from '../../../../test-support/schemas/cohortDefinitionSchema'
import { CCDLComparator, CCDLValueFilter } from './CCDLFilters'
import { CCDLCohortDefinition } from './CCDLCohortDefinition'
import { CCDLCriterion } from './CCDLCriterion'
import { CCDLTermCode } from './CCDLTermCode'
import {
  attributeFilterCases,
  cohortStructureCases,
  comparatorCases,
  QUANTITY_COMPARATOR,
  rejectedCases,
  timeRestrictionCases,
  valueFilterCases,
  VERSION,
} from './cohort-definition.cases'

/**
 * Keeps the hand-written types and the CCDL v1 schema in line. Each example is typed, so a
 * type that is too strict stops compiling here; each must also pass the schema, so a type that is
 * too loose shows up in the `@ts-expect-error` cases, where TypeScript and the schema must both
 * reject the same input.
 */
const SYSTEM = 'http://example.org'
const CONTEXT = 'Condition'
const TERM_CODE = 'pneumonia'
const GREATER_OR_EQUAL = 'ge'
const VALUE = 1

const code = (value: string): CCDLTermCode => ({
  code: value,
  system: SYSTEM,
  display: `${value} (display)`,
})
const criterion = (extra: Partial<CCDLCriterion> = {}): CCDLCriterion => ({
  context: code(CONTEXT),
  termCodes: [code(TERM_CODE)],
  ...extra,
})
const cohort = (...criteria: CCDLCriterion[]): CCDLCohortDefinition => ({
  version: VERSION,
  inclusionCriteria: [criteria as [CCDLCriterion, ...CCDLCriterion[]]],
})
const valid = (document: unknown) => expect(cohortDefinitionErrors(document)).toEqual([])
const invalid = (document: unknown) => expect(cohortDefinitionErrors(document)).not.toEqual([])

describe('CCDLCohortDefinition types and the CCDL v1 schema agree', () => {
  describe('accepted', () => {
    testTimeRestrictions()
    testValueFilters()
    testAttributeFilters()
    testCohortStructures()
    testRoundtripCases()
  })

  describe('rejected', () => {
    testRejectedDocuments()
    testGeIsNotInTheTypeYet()
  })
})

function testTimeRestrictions() {
  it.each(timeRestrictionCases)('time restriction: %s', (_name, timeRestriction) =>
    valid(cohort(criterion({ timeRestriction })))
  )
}

function testValueFilters() {
  it.each([...valueFilterCases, ...comparatorCases])('value filter: %s', (_name, valueFilter) =>
    valid(cohort(criterion({ valueFilter })))
  )
}

function testAttributeFilters() {
  it.each(attributeFilterCases)('attribute filter: %s', (_name, filter) =>
    valid(cohort(criterion({ attributeFilters: [filter] })))
  )
}

function testCohortStructures() {
  it.each(cohortStructureCases)('cohort: %s', (_name, definition) => valid(definition))
}

function testRoundtripCases() {
  it.each(Object.entries(CASES))('Cypress roundtrip case: %s', (_name, crtdl) =>
    valid(crtdl.cohortDefinition)
  )
}

function testRejectedDocuments() {
  it.each(rejectedCases)('%s', (_name, document) => invalid(document))
}

function testGeIsNotInTheTypeYet() {
  it('ge is valid CCDL v1 but not in the type yet (not producible by the UI)', () => {
    // @ts-expect-error 'ge' is deliberately outside CCDLComparator until the ge/le change lands
    const comparator: CCDLComparator = GREATER_OR_EQUAL
    const valueFilter: CCDLValueFilter = { type: QUANTITY_COMPARATOR, comparator, value: VALUE }
    valid(cohort(criterion({ valueFilter })))
  })
}
