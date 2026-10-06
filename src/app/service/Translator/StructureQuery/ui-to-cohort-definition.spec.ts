import { beforeEach, describe, expect, it } from '@jest/globals'
import { TestBed } from '@angular/core/testing'
import { cohortDefinitionErrors } from '../../../../../test-support/schemas/cohortDefinitionSchema'
import { GROUPS } from './ui-to-cohort-definition.cases'
import { translate } from './ui-to-cohort-definition.fixtures'

/**
 * `UIQuery2StructuredQueryService` must produce exactly the JSON of each case, and that JSON must be
 * valid CCDL v1. The cases are listed in `ui-to-cohort-definition.cases.ts`.
 */
describe('UIQuery2StructuredQueryService output', () => {
  beforeEach(() => TestBed.configureTestingModule({}))

  describe.each(GROUPS)('$title', ({ cases }) => {
    it.each(cases)('$name', ({ query, expected }) => {
      const actual = translate(query())

      expect(actual).toEqual(typeof expected === 'function' ? expected() : expected)
      expect(cohortDefinitionErrors(actual)).toEqual([])
    })
  })
})
