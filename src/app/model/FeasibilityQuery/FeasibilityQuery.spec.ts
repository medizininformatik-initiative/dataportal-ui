import { FeasibilityQuery } from './FeasibilityQuery'

describe('FeasibilityQuery', () => {
  it('drops empty inclusion and exclusion groups', () => {
    const query = new FeasibilityQuery('query-1')

    query.setInclusionCriteria([['a'], [], ['b', 'c']])
    query.setExclusionCriteria([[], ['d']])

    expect(query.getInclusionCriteria()).toEqual([['a'], ['b', 'c']])
    expect(query.getExclusionCriteria()).toEqual([['d']])
  })

  it('turns groups that are all empty into no groups', () => {
    const query = new FeasibilityQuery('query-1')

    query.setInclusionCriteria([[]])
    query.setExclusionCriteria([[], []])

    expect(query.getInclusionCriteria()).toEqual([])
    expect(query.getExclusionCriteria()).toEqual([])
  })
})
