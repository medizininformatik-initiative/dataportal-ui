import { describe, expect, it } from '@jest/globals'
import { QuantityUnit } from 'src/app/model/FeasibilityQuery/QuantityUnit'
import { TerminologyCode } from 'src/app/model/Terminology/TerminologyCode'
import { mapTermCode, mapUnit, requireNonEmpty, requireNumber } from './CohortDefinitionMapper'

describe('CohortDefinitionMapper', () => {
  it('maps a term code and leaves out a missing version', () => {
    const withoutVersion = new TerminologyCode('c', 'd', 's')
    const withVersion = new TerminologyCode('c', 'd', 's', '1.0')

    expect(mapTermCode(withoutVersion)).toEqual({ code: 'c', display: 'd', system: 's' })
    expect(mapTermCode(withVersion)).toEqual({ code: 'c', display: 'd', system: 's', version: '1.0' })
  })

  it('maps a unit to code and display only', () => {
    expect(mapUnit(new QuantityUnit('a', 'years', 'http://unitsofmeasure.org'))).toEqual({
      code: 'a',
      display: 'years',
    })
  })

  it('returns a non-empty array and throws for an empty one', () => {
    expect(requireNonEmpty([1], 'termCodes')).toEqual([1])
    expect(() => requireNonEmpty([], 'termCodes')).toThrow('Expected at least one entry in termCodes')
  })

  it('returns a number, also 0, and throws for null', () => {
    expect(requireNumber(0, 'value')).toBe(0)
    expect(() => requireNumber(null, 'value')).toThrow('Expected value to be set')
  })
})
