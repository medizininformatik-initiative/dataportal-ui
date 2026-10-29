import { Injectable } from '@angular/core'
import { Display } from 'src/app/model/DataSelection/Profile/Display'
import { AttributeFilter } from 'src/app/model/FeasibilityQuery/Criterion/AttributeFilter/AttributeFilter'
import { ConceptFilter } from 'src/app/model/FeasibilityQuery/Criterion/AttributeFilter/Concept/ConceptFilter'
import { ValueFilter } from 'src/app/model/FeasibilityQuery/Criterion/AttributeFilter/ValueFilter'
import { FilterChipData } from 'src/app/shared/models/FilterChips/FilterChipData'
import { FilterChipConceptAdapter } from '../../../models/FilterChips/Adapter/FilterChipConceptAdapter'

@Injectable({
  providedIn: 'root',
})
export class ConceptFilterChipService {
  constructor() {}

  /**
   * Generates concept filter chips from an array of AttributeFilters.
   *
   * @param {AttributeFilter[]} attributeFilters Array of AttributeFilter objects
   * @returns {FilterChipData[]} Array of FilterChipData
   */
  public generateConceptChipsFromAttributeFilters(attributeFilters: AttributeFilter[]): FilterChipData[] {
    const chips: FilterChipData[] = []

    attributeFilters.forEach((attributeFilter) => {
      chips.push(...this.generateConceptChipsFromAttributeFilter(attributeFilter))
    })

    return chips
  }

  /**
   * Generates concept filter chips from an array of ValueFilters.
   *
   * @param {ValueFilter[]} valueFilters Array of ValueFilter objects
   * @returns {FilterChipData[]} Array of FilterChipData
   */
  public generateConceptChipsFromValueFilters(valueFilters: ValueFilter[]): FilterChipData[] {
    const chips: FilterChipData[] = []

    valueFilters.forEach((valueFilter) => {
      chips.push(...this.generateConceptChipsFromValueFilter(valueFilter))
    })

    return chips
  }

  /**
   * Generates concept filter chips from a specific AttributeFilter.
   *
   * @param {AttributeFilter} attributeFilter The AttributeFilter object
   * @returns {FilterChipData[]} Array of FilterChipData
   */
  private generateConceptChipsFromAttributeFilter(attributeFilter: AttributeFilter): FilterChipData[] {
    const conceptFilter = attributeFilter.getConcept()
    const display = attributeFilter.getDisplay()
    if (conceptFilter) {
      return this.generateConceptChips(conceptFilter, display)
    }
    return []
  }

  /**
   * Generates concept filter chips from a specific ConceptFilter.
   *
   * @param conceptFilter The ConceptFilter object
   * @returns {FilterChipData[]} Array of FilterChipData
   * @param {ValueFilter} valueFilter
   */
  private generateConceptChipsFromValueFilter(valueFilter: ValueFilter): FilterChipData[] {
    const conceptFilter = valueFilter?.getConcept()
    if (conceptFilter) {
      return this.generateConceptChips(conceptFilter, valueFilter.getDisplay())
    }
    return []
  }

  /**
   * Adapts the ConceptFilter into an array of FilterChipData.
   *
   * @param {ConceptFilter} conceptFilter The ConceptFilter object
   * @param attributeCode Optional TerminologyCode for the attribute
   * @returns {FilterChipData[]} Array of FilterChipData
   * @param {Display} display
   */
  public generateConceptChips(conceptFilter: ConceptFilter, display: Display): FilterChipData[] {
    return FilterChipConceptAdapter.adaptCodeableConcept(conceptFilter.getSelectedConcepts(), display)
  }
}
