import { ConceptFilter } from 'src/app/model/FeasibilityQuery/Criterion/AttributeFilter/Concept/ConceptFilter'
import { v4 as uuidv4 } from 'uuid'
import { CloneConcept } from './CloneConcept'

export class CloneConceptFilter {
  /**
   * Creates a deep copy of a ConceptFilter instance.
   *
   * @param conceptFilter - The ConceptFilter instance to deep copy.
   * @returns A new ConceptFilter instance that is a deep copy of the given instance.
   */
  static deepCopyConceptFilter(conceptFilter: ConceptFilter): ConceptFilter {
    const copiedSelectedConcepts = CloneConcept.deepCopyConcepts(
      conceptFilter.getSelectedConcepts()
    )
    return new ConceptFilter(
      uuidv4(),
      conceptFilter.getAllowedConceptUrls(),
      copiedSelectedConcepts
    )
  }
}
