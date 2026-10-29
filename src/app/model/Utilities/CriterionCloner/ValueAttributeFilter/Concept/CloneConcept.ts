import { Concept } from 'src/app/model/FeasibilityQuery/Criterion/AttributeFilter/Concept/Concept'
import { CloneTerminologyCode } from '../../TerminologyCode/CloneTerminologyCode'

export class CloneConcept {
  public static deepCopyConcept(concept: Concept): Concept {
    return new Concept(concept.getDisplay(), CloneTerminologyCode.deepCopyTerminologyCode(concept.getTerminologyCode()))
  }

  public static deepCopyConcepts(concepts: Concept[]): Concept[] {
    return concepts.map((concept: Concept) => this.deepCopyConcept(concept))
  }
}
