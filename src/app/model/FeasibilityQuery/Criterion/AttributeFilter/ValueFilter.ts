import { AbstractAttributeFilters } from './AbstractAttributeFilters'
import { ConceptFilter } from './Concept/ConceptFilter'
import { AbstractQuantityFilter } from './Quantity/AbstractQuantityFilter'
import { FilterTypes } from 'src/app/model/Utilities/FilterTypes'
import { Display } from 'src/app/model/DataSelection/Profile/Display'

/**
 * Class representing a ValueFilter.
 */
export class ValueFilter extends AbstractAttributeFilters {
  /**
   * Creates an instance of ValueFilter.
   *
   * @param display - The display name for the filter.
   * @param concept - Optional concept filter.
   * @param quantity - Optional quantity filter.
   * @param optional - Whether the filter is optional or not. Default is false.
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
