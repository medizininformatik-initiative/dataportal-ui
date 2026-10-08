import { beforeEach, describe, expect, it } from '@jest/globals'
import { TestBed } from '@angular/core/testing'
import { cohortDefinitionErrors } from '../../../../../test-support/schemas/cohortDefinitionSchema'
import { GROUPS } from './ui-to-cohort-definition.cases'
import { FeasibilityQueryValidationService } from '../../Validation/Internal/FeasibilityQueryValidationService.service'
import { buildQuery, translate } from './ui-to-cohort-definition.fixtures'

/**
 * `ToCohortDefinitionService` must produce exactly the JSON of each case, and that JSON must be
 * valid CCDL v1. The cases are listed in `ui-to-cohort-definition.cases.ts`.
 */
describe('ToCohortDefinitionService output', () => {
  beforeEach(() => TestBed.configureTestingModule({}))

  describe.each(GROUPS)('$title', ({ cases }) => {
    it.each(cases)('$name', async ({ query, expected }) => {
      const actual = await translate(query())

      expect(actual).toEqual(typeof expected === 'function' ? expected() : expected)
      expect(cohortDefinitionErrors(actual)).toEqual([])
    })

    it.each(cases)('$name: query is valid', ({ query }) => {
      const state = TestBed.inject(FeasibilityQueryValidationService).validate(buildQuery(query()))

      expect(state.isValid).toBe(true)
    })
  })
})
