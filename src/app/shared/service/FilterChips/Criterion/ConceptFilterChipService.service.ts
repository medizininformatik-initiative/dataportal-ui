import { AttributeFilter } from 'src/app/model/FeasibilityQuery/Criterion/AttributeFilter/AttributeFilter';
import { ConceptFilter } from 'src/app/model/FeasibilityQuery/Criterion/AttributeFilter/Concept/ConceptFilter';
import { Display } from 'src/app/model/DataSelection/Profile/Display';
import { FilterChipConceptAdapter } from '../../../models/FilterChips/Adapter/FilterChipConceptAdapter';
import { Injectable } from '@angular/core';
import { InterfaceFilterChip } from '../../../models/FilterChips/InterfaceFilterChip';
import { ValueFilter } from 'src/app/model/FeasibilityQuery/Criterion/AttributeFilter/ValueFilter';

@Injectable({
  providedIn: 'root',
})
export class ConceptFilterChipService {
  constructor() {}

  /**
   * Generates concept filter chips from an array of AttributeFilters.
   *
   * @param attributeFilters Array of AttributeFilter objects
   * @returns Array of InterfaceFilterChip
   */
  public generateConceptChipsFromAttributeFilters(
    attributeFilters: AttributeFilter[]
  ): InterfaceFilterChip[] {
    const chips: InterfaceFilterChip[] = [];

    attributeFilters.forEach((attributeFilter) => {
      chips.push(...this.generateConceptChipsFromAttributeFilter(attributeFilter));
    });

    return chips;
  }

  /**
   * Generates concept filter chips from an array of ValueFilters.
   *
   * @param valueFilters Array of ValueFilter objects
   * @returns Array of InterfaceFilterChip
   */
  public generateConceptChipsFromValueFilters(valueFilters: ValueFilter[]): InterfaceFilterChip[] {
    const chips: InterfaceFilterChip[] = [];

    valueFilters.forEach((valueFilter) => {
      chips.push(...this.generateConceptChipsFromValueFilter(valueFilter));
    });

    return chips;
  }

  /**
   * Generates concept filter chips from a specific AttributeFilter.
   *
   * @param attributeFilter The AttributeFilter object
   * @returns Array of InterfaceFilterChip
   */
  private generateConceptChipsFromAttributeFilter(
    attributeFilter: AttributeFilter
  ): InterfaceFilterChip[] {
    const conceptFilter = attributeFilter.getConcept();
    const display = attributeFilter.getDisplay();
    if (conceptFilter) {
      return this.generateConceptChips(conceptFilter, display);
    }
    return [];
  }

  /**
   * Generates concept filter chips from a specific ConceptFilter.
   *
   * @param conceptFilter The ConceptFilter object
   * @returns Array of InterfaceFilterChip
   */
  private generateConceptChipsFromValueFilter(valueFilter: ValueFilter): InterfaceFilterChip[] {
    const conceptFilter = valueFilter?.getConcept();
    if (conceptFilter) {
      return this.generateConceptChips(conceptFilter, valueFilter.getDisplay());
    }
    return [];
  }

  /**
   * Adapts the ConceptFilter into an array of InterfaceFilterChip.
   *
   * @param conceptFilter The ConceptFilter object
   * @param attributeCode Optional TerminologyCode for the attribute
   * @returns Array of InterfaceFilterChip
   */
  public generateConceptChips(
    conceptFilter: ConceptFilter,
    display: Display
  ): InterfaceFilterChip[] {
    return FilterChipConceptAdapter.adaptCodeableConcept(
      conceptFilter.getSelectedConcepts(),
      display
    );
  }
}
