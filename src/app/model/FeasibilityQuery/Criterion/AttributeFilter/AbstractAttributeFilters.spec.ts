import { describe, expect, it } from '@jest/globals'
import { Display } from 'src/app/model/DataSelection/Profile/Display'
import { FilterTypes } from 'src/app/model/Utilities/FilterTypes'
import { QuantityComparisonOption } from 'src/app/model/Utilities/Quantity/QuantityFilterOptions'
import { TerminologyCode } from '../../../Terminology/TerminologyCode'
import { QuantityUnit } from '../../QuantityUnit'
import { AttributeFilter } from './AttributeFilter'
import { Concept } from './Concept/Concept'
import { ConceptFilter } from './Concept/ConceptFilter'
import { ReferenceFilter } from './Concept/ReferenceFilter'
import { QuantityComparatorFilter } from './Quantity/QuantityComparatorFilter'
import { QuantityNotSet } from './Quantity/QuantityNotSet'
import { ValueFilter } from './ValueFilter'

const display = new Display([], 'value')
const years = new QuantityUnit('a', 'years')
const attributeCode = new TerminologyCode('attribute', 'attribute', 'http://loinc.org')

describe('AbstractAttributeFilters.hasSelection', () => {
  it('is false for a concept filter without selected concepts', () => {
    const concepts = new ConceptFilter('concept-filter', [], [])

    expect(new ValueFilter(display, FilterTypes.CONCEPT, concepts).hasSelection()).toBe(false)
  })

  it('is true for a concept filter with a selected concept', () => {
    const code = new TerminologyCode('c', 'd', 's')
    const concepts = new ConceptFilter('concept-filter', [], [new Concept(new Display([], 'd'), code)])

    expect(new ValueFilter(display, FilterTypes.CONCEPT, concepts).hasSelection()).toBe(true)
  })

  it('is true only for a reference filter with selected references', () => {
    const empty = new ReferenceFilter('reference-filter', [], [])
    const selected = new ReferenceFilter('reference-filter', [], ['id'])

    expect(new AttributeFilter(display, FilterTypes.REFERENCE, attributeCode, undefined, undefined, empty).hasSelection()).toBe(false)
    expect(new AttributeFilter(display, FilterTypes.REFERENCE, attributeCode, undefined, undefined, selected).hasSelection()).toBe(true)
  })

  it('is false for QuantityNotSet and true for a real quantity', () => {
    const notSet = QuantityNotSet.create(years, [years])
    const comparator = new QuantityComparatorFilter(years, [years], 0, QuantityComparisonOption.EQUAL, 1)

    expect(new ValueFilter(display, FilterTypes.QUANTITY_NOT_SET, undefined, notSet).hasSelection()).toBe(false)
    expect(new ValueFilter(display, FilterTypes.QUANTITY_COMPARATOR, undefined, comparator).hasSelection()).toBe(true)
  })

  it('is false for a filter with nothing set', () => {
    expect(new ValueFilter(display, FilterTypes.CONCEPT).hasSelection()).toBe(false)
  })
})
