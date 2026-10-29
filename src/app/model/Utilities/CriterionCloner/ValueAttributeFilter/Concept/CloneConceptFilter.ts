import { ConceptFilter } from 'src/app/model/FeasibilityQuery/Criterion/AttributeFilter/Concept/ConceptFilter'
import { v4 as uuidv4 } from 'uuid'
import { CloneTerminologyCode } from '../../TerminologyCode/CloneTerminologyCode'
import { CloneConcept } from './CloneConcept'

export class CloneConceptFilter {
  /**
   * Creates a deep copy of a ConceptFilter instance.
   *
   * @param {ConceptFilter} conceptFilter - The ConceptFilter instance to deep copy.
   * @returns {ConceptFilter} A new ConceptFilter instance that is a deep copy of the given instance.
   */
  public static deepCopyConceptFilter(conceptFilter: ConceptFilter): ConceptFilter {
    const copiedSelectedConcepts = CloneConcept.deepCopyConcepts(conceptFilter.getSelectedConcepts())
    return new ConceptFilter(uuidv4(), conceptFilter.getAllowedConceptUrls(), copiedSelectedConcepts)
  }
}
