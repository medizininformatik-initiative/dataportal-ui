import { AttributeFilter } from 'src/app/model/FeasibilityQuery/Criterion/AttributeFilter/AttributeFilter';
import { ConceptFilter } from 'src/app/model/FeasibilityQuery/Criterion/AttributeFilter/Concept/ConceptFilter';
import { Display } from 'src/app/model/DataSelection/Profile/Display';
import { FilterChipConceptAdapter } from '../../../models/FilterChips/Adapter/FilterChipConceptAdapter';
import { Injectable } from '@angular/core';
import { ValueFilter } from 'src/app/model/FeasibilityQuery/Criterion/AttributeFilter/ValueFilter';
import { FilterChipData } from 'src/app/shared/models/FilterChips/FilterChipData';

@Injectable({
  providedIn: 'root',
})
export class ConceptFilterChipService {
  constructor() {}

  /**
   * Generates concept filter chips from an array of AttributeFilters.
   *
   * @param attributeFilters Array of AttributeFilter objects
   * @returns Array of FilterChipData
   */
  public generateConceptChipsFromAttributeFilters(
    attributeFilters: AttributeFilter[]
  ): FilterChipData[] {
    const chips: FilterChipData[] = [];

    attributeFilters.forEach((attributeFilter) => {
      chips.push(...this.generateConceptChipsFromAttributeFilter(attributeFilter));
    });

    return chips;
  }

  /**
   * Generates concept filter chips from an array of ValueFilters.
   *
   * @param valueFilters Array of ValueFilter objects
   * @returns Array of FilterChipData
   */
  public generateConceptChipsFromValueFilters(valueFilters: ValueFilter[]): FilterChipData[] {
    const chips: FilterChipData[] = [];

    valueFilters.forEach((valueFilter) => {
      chips.push(...this.generateConceptChipsFromValueFilter(valueFilter));
    });

    return chips;
  }

  /**
   * Generates concept filter chips from a specific AttributeFilter.
   *
   * @param attributeFilter The AttributeFilter object
   * @returns Array of FilterChipData
   */
  private generateConceptChipsFromAttributeFilter(
    attributeFilter: AttributeFilter
  ): FilterChipData[] {
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
   * @returns Array of FilterChipData
   */
  private generateConceptChipsFromValueFilter(valueFilter: ValueFilter): FilterChipData[] {
    const conceptFilter = valueFilter?.getConcept();
    if (conceptFilter) {
      return this.generateConceptChips(conceptFilter, valueFilter.getDisplay());
    }
    return [];
  }

  /**
   * Adapts the ConceptFilter into an array of FilterChipData.
   *
   * @param conceptFilter The ConceptFilter object
   * @param attributeCode Optional TerminologyCode for the attribute
   * @returns Array of FilterChipData
   */
  public generateConceptChips(conceptFilter: ConceptFilter, display: Display): FilterChipData[] {
    return FilterChipConceptAdapter.adaptCodeableConcept(
      conceptFilter.getSelectedConcepts(),
      display
    );
  }
}
