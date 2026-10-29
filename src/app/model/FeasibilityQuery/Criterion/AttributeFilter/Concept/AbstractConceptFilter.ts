import { TerminologyCode } from 'src/app/model/Terminology/TerminologyCode'
import { Concept } from './Concept'

/**
 * Abstract class representing a concept filter.
 */
export abstract class AbstractConceptFilter {
  protected selectedConcepts: Array<Concept> = []

  protected readonly id: string

  /**
   * Creates an instance of AbstractConceptFilter.
   *
   * @param {Array<Concept>} selectedConcepts - The selected concepts.
   * @param allowedConcepts - The allowed concepts.
   * @param {string} id
   */
  constructor(id: string, selectedConcepts: Array<Concept> = []) {
    this.selectedConcepts = selectedConcepts
    this.id = id
  }

  public getId(): string {
    return this.id
  }

  /**
   * Gets the selected concepts.
   *
   * @returns {Array<Concept>} A Set of selected concepts.
   */
  public getSelectedConcepts(): Array<Concept> {
    return this.selectedConcepts
  }

  /**
   * Sets the selected concepts.
   *
   * @param {Array<Concept>} selectedConcepts - A Set of selected concepts.
   */
  public setSelectedConcepts(selectedConcepts: Array<Concept>): void {
    this.selectedConcepts = selectedConcepts
  }

  /**
   * Checks whether the selected concepts set exists.
   *
   * @returns {boolean} True if the selected concepts set exists, otherwise false.
   */
  public isSelectedConceptSet(): boolean {
    return this.selectedConcepts !== undefined && this.selectedConcepts !== null && this.selectedConcepts.length > 0
  }
}
