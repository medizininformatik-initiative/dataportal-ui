import { TerminologyCode } from 'src/app/model/Terminology/TerminologyCode'
import { AbstractConceptFilter } from '../../Abstract/ConceptFilter/AbstractConceptFilter'

export class ConceptValueFilter extends AbstractConceptFilter {
  /**
   * Creates a new ConceptValueFilter.
   *
   * @param selectedConcepts
   */
  constructor(selectedConcepts: TerminologyCode[] = []) {
    super(selectedConcepts)
  }

  /**
   * Creates a filter from the given values.
   *
   * @param selectedConcepts
   */
  public static createFilter(selectedConcepts: TerminologyCode[]) {
    return new ConceptValueFilter(Array.from(selectedConcepts))
  }
}
