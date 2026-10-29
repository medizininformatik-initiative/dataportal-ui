import { TerminologyCode } from 'src/app/model/Terminology/TerminologyCode'
import { FilterTypes } from 'src/app/model/Utilities/FilterTypes'
import { AbstractStructuredQueryFilters } from '../AbstractStructuredQueryFilters'

/**
 * Abstract base class for concept filters in a structured query.
 *
 * This class extends the base structured query filters to include selected concepts.
 *
 * @abstract
 */
export abstract class AbstractConceptFilter extends AbstractStructuredQueryFilters {
  private selectedConcepts: TerminologyCode[] = []
  protected type: FilterTypes = FilterTypes.CONCEPT

  /**
   * Constructor to initialize the AbstractConceptFilter with attribute code and selected concepts.
   *
   * @param attributeCode - The attribute code for the filter.
   * @param selectedConcepts - The selected concepts for the filter.
   */
  constructor(selectedConcepts: TerminologyCode[] = []) {
    super()
    this.selectedConcepts = selectedConcepts
  }

  /**
   * Gets the selected concepts.
   *
   * @returns The selected concepts.
   */
  public getSelectedConcepts(): TerminologyCode[] {
    return this.selectedConcepts
  }

  /**
   * Sets the selected concepts.
   *
   * @param selectedConcepts - The new selected concepts to set.
   */
  public setSelectedConcepts(selectedConcepts: TerminologyCode[]): void {
    this.selectedConcepts = selectedConcepts
  }

  /**
   * Gets the type of the filter.
   *
   * @returns The type of filter.
   */
  public getType(): FilterTypes {
    return this.type
  }
}
