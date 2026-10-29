import { TerminologyCode } from 'src/app/model/Terminology/TerminologyCode'
import { AbstractConceptFilter } from '../../Abstract/ConceptFilter/AbstractConceptFilter'

export class ConceptAttributeFilter extends AbstractConceptFilter {
  private attributeCode: TerminologyCode

  /**
   * Creates a new ConceptAttributeFilter.
   *
   * @param attributeCode
   * @param selectedConcepts
   */
  constructor(attributeCode: TerminologyCode, selectedConcepts: TerminologyCode[] = []) {
    super(selectedConcepts)
    this.attributeCode = attributeCode
  }

  /**
   * Gets the attributeCode value.
   *
   * @returns The attributeCode value.
   */
  public getAttributeCode(): TerminologyCode {
    return this.attributeCode
  }

  /**
   * Sets the attributeCode value.
   *
   * @param attributeCode - The new attributeCode value to set.
   */
  public setAttributeCode(attributeCode: TerminologyCode): void {
    this.attributeCode = attributeCode
  }

  /**
   * Creates a filter from the given values.
   *
   * @param attributeCode
   * @param selectedConcepts
   */
  public static createFilter(attributeCode: TerminologyCode, selectedConcepts: TerminologyCode[]) {
    return new ConceptAttributeFilter(attributeCode, Array.from(selectedConcepts))
  }
}
