import { Display } from 'src/app/model/DataSelection/Profile/Display'
import { FilterTypes } from 'src/app/model/Utilities/FilterTypes'
import { AbstractAttributeFilters } from './AbstractAttributeFilters'
import { ConceptFilter } from './Concept/ConceptFilter'
import { ReferenceFilter } from './Concept/ReferenceFilter'
import { AbstractQuantityFilter } from './Quantity/AbstractQuantityFilter'

/**
 * Class representing a ValueFilter.
 */
export class ValueFilter extends AbstractAttributeFilters {
  /**
   * Creates an instance of ValueFilter.
   *
   * @param {Display} display - The display name for the filter.
   * @param {ConceptFilter} concept - Optional concept filter.
   * @param {AbstractQuantityFilter} quantity - Optional quantity filter.
   * @param {boolean} optional - Whether the filter is optional or not. Default is false.
   * @param {FilterTypes} filter
   */
  constructor(
    display: Display,
    filter: FilterTypes,
    concept?: ConceptFilter,
    quantity?: AbstractQuantityFilter,
    optional: boolean = false
  ) {
    super(display, filter, concept, quantity, undefined, optional)
  }
}
