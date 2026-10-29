import { TerminologyCode } from 'src/app/model/Terminology/TerminologyCode'
import { FilterTypes } from 'src/app/model/Utilities/FilterTypes'
import { AbstractConceptFilter } from './AbstractConceptFilter'
import { Concept } from './Concept'

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
   * @param {Array<Concept>} selectedConcepts - The selected concepts.
   * @param {string} id
   * @param {string[]} allowedConceptUrls
   */
  constructor(id: string, allowedConceptUrls: string[], selectedConcepts: Array<Concept>) {
    super(id, selectedConcepts)
    this.allowedConceptUrls = allowedConceptUrls
  }

  /**
   * Gets the allowed concept URI.
   *
   * @returns {string[]} The allowed concept URI.
   */
  public getAllowedConceptUrls(): string[] {
    return this.allowedConceptUrls
  }

  /**
   * Sets the allowed concept URI.
   *
   * @param allowedConceptUri - The new allowed concept URI.
   * @param {string[]} allowedConceptUrls
   */
  public setAllowedConceptUri(allowedConceptUrls: string[]): void {
    this.allowedConceptUrls = allowedConceptUrls
  }

  /**
   * Gets the filter type.
   *
   * @returns {FilterTypes} The filter type.
   */
  public getType(): FilterTypes {
    return this.type
  }

  /**
   * Sets the filter type.
   *
   * @param {FilterTypes} type - The new filter type.
   */
  public setType(type: FilterTypes): void {
    this.type = type
  }

  /**
   * Checks whether the selected concepts set exists.
   *
   * @returns {boolean} True if the selected concepts set exists, otherwise false.
   */
  public isSelectedConceptSet(): boolean {
    return this.selectedConcepts !== undefined && this.selectedConcepts !== null
  }

  public hasSelectedConcepts(): boolean {
    return this.isSelectedConceptSet() && this.selectedConcepts.length > 0
  }
}
