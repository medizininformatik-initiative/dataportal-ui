import { Concept } from 'src/app/model/FeasibilityQuery/Criterion/AttributeFilter/Concept/Concept';
import { Display } from 'src/app/model/DataSelection/Profile/Display';
import { FilterChipBuilder } from '../FilterChipBuilder';
import { v4 as uuidv4 } from 'uuid';
import { FilterChipData } from '../FilterChipData';

export class FilterChipConceptAdapter {
  public static conceptFilterChips: FilterChipData[] = [];

  /**
   * Adapts a ConceptFilter and optional attribute code into an array of FilterChipData.
   *
   * @param conceptFilter The ConceptFilter to adapt
   * @param attributeCode Optional TerminologyCode for additional attribute information
   * @returns An array of FilterChipData
   */
  public static adaptCodeableConcept(
    selectedConcepts: Concept[] = [],
    display?: Display | string
  ): FilterChipData[] {
    this.resetFilterChips();

    if (selectedConcepts.length === 0) {
      return [];
    }

    this.buildFilterChips(selectedConcepts, display);

    return this.conceptFilterChips;
  }

  /**
   * Resets the conceptFilterChips array.
   */
  private static resetFilterChips(): void {
    this.conceptFilterChips = [];
  }

  /**
   * Builds filter chips and adds them to the conceptFilterChips array.
   *
   * @param selectedConcepts A Set of TerminologyCode
   * @param type The filter type
   */
  private static buildFilterChips(selectedConcepts: Concept[], type: Display | string): void {
    const builder = new FilterChipBuilder(type);
    selectedConcepts.forEach((concept) => {
      this.createFilterChip(concept, builder);
    });
    this.conceptFilterChips.push(builder.buildFilterChip());
  }

  /**
   * Creates an FilterChipData from a TerminologyCode and adds it to the builder.
   *
   * @param concept The TerminologyCode to use for creating the chip
   * @param builder The FilterChipBuilder instance
   */
  private static createFilterChip(concept: Concept, builder: FilterChipBuilder): void {
    builder.addData(uuidv4(), concept.getDisplay());
  }
}
