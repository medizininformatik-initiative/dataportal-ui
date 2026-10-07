import { TestBed } from '@angular/core/testing'
import { FeasibilityQuery } from 'src/app/model/FeasibilityQuery/FeasibilityQuery'
import { FilterTypes } from 'src/app/model/Utilities/FilterTypes'
import {
  concept,
  criterion,
  valueFilter,
} from '../../Translator/StructureQuery/ui-to-cohort-definition.fixtures'
import { FeasibilityQueryValidationService } from './FeasibilityQueryValidationService.service'

describe('FeasibilityQueryValidationService.validate', () => {
  let service: FeasibilityQueryValidationService

  const queryOf = (inclusion: string[][], exclusion: string[][] = []) => {
    const query = new FeasibilityQuery('query-1')
    query.setInclusionCriteria(inclusion)
    query.setExclusionCriteria(exclusion)
    return query
  }

  beforeEach(() => {
    service = TestBed.inject(FeasibilityQueryValidationService)
  })

  it('accepts a query whose criteria are all set', () => {
    const state = service.validate(queryOf([[criterion().getId()]]))

    expect(state.isValid).toBe(true)
    expect(state.hasInclusionCriteria).toBe(true)
  })

  it('rejects a query without inclusion criteria', () => {
    const state = service.validate(queryOf([], [[criterion().getId()]]))

    expect(state.isValid).toBe(false)
    expect(state.hasInclusionCriteria).toBe(false)
  })

  it('rejects a query whose only inclusion group is empty', () => {
    const state = service.validate(queryOf([[]]))

    expect(state.isValid).toBe(false)
    expect(state.hasInclusionCriteria).toBe(false)
  })

  it('rejects a criterion with an unset required filter and names it', () => {
    const unset = criterion({
      valueFilters: [valueFilter(FilterTypes.CONCEPT, { concept: concept() })],
    })

    const state = service.validate(queryOf([[unset.getId()]]))

    expect(state.isValid).toBe(false)
    expect(state.criterionValidationStates).toEqual([
      expect.objectContaining({ criterionId: unset.getId(), isValid: false }),
    ])
  })

  describe('one invalid criterion among valid ones', () => {
    const unsetCriterion = () =>
      criterion({ valueFilters: [valueFilter(FilterTypes.CONCEPT, { concept: concept() })] })

    it('rejects the query when it is in the inclusion criteria', () => {
      const unset = unsetCriterion()

      const state = service.validate(queryOf([[criterion().getId()], [unset.getId()]]))

      expect(state.isValid).toBe(false)
    })

    it('rejects the query when it is in the exclusion criteria', () => {
      const unset = unsetCriterion()

      const state = service.validate(queryOf([[criterion().getId()]], [[unset.getId()]]))

      expect(state.isValid).toBe(false)
    })
  })
})
