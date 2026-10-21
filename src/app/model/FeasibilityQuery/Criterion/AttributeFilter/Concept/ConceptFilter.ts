import { AbstractConceptFilter } from './AbstractConceptFilter'
import { Concept } from './Concept'
import { FilterTypes } from 'src/app/model/Utilities/FilterTypes'

/**
 * Class representing a ConceptFilter.
 */
export class ConceptFilter extends AbstractConceptFilter {
  private allowedConceptUrls: string[]
  private type: FilterTypes = FilterTypes.CONCEPT

  /**
   * Creates an instance of ConceptFilter.
   *
   * @param allowedConceptUri - The allowed concept URI.
   * @param selectedConcepts - The selected concepts.
   */
  constructor(id: string, allowedConceptUrls: string[], selectedConcepts: Array<Concept>) {
    super(id, selectedConcepts)
    this.allowedConceptUrls = allowedConceptUrls
  }

  /**
   * Gets the allowed concept URI.
   *
   * @returns The allowed concept URI.
   */
  public getAllowedConceptUrls(): string[] {
    return this.allowedConceptUrls
  }

  /**
   * Sets the allowed concept URI.
   *
   * @param allowedConceptUri - The new allowed concept URI.
   */
  public setAllowedConceptUri(allowedConceptUrls: string[]): void {
    this.allowedConceptUrls = allowedConceptUrls
  }

  /**
   * Gets the filter type.
   *
   * @returns The filter type.
   */
  public getType(): FilterTypes {
    return this.type
  }

  /**
   * Sets the filter type.
   *
   * @param type - The new filter type.
   */
  public setType(type: FilterTypes): void {
    this.type = type
  }

  /**
   * Checks whether the selected concepts set exists.
   *
   * @returns True if the selected concepts set exists, otherwise false.
   */
  public isSelectedConceptSet(): boolean {
    return this.selectedConcepts !== undefined && this.selectedConcepts !== null
  }

  public hasSelectedConcepts(): boolean {
    return this.isSelectedConceptSet() && this.selectedConcepts.length > 0
  }
}
