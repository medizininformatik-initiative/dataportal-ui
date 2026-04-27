import { ReferenceFilter } from 'src/app/model/FeasibilityQuery/Criterion/AttributeFilter/Concept/ReferenceFilter';
import { v4 as uuidv4 } from 'uuid';

export class CloneReferenceFilter {
  /**
   * Creates a deep copy of a ReferenceFilter instance.
   *
   * @param referenceFilter - The ReferenceFilter instance to deep copy.
   * @returns A new ReferenceFilter instance that is a deep copy of the given instance.
   */
  static deepCopyReferenceFilter(
    referenceFilter: ReferenceFilter,
    preserveId = false
  ): ReferenceFilter {
    if (!(referenceFilter instanceof ReferenceFilter)) {
      throw new Error('Invalid instance type for deep copy');
    }

    return new ReferenceFilter(
      preserveId ? referenceFilter.getId() : uuidv4(),
      referenceFilter.getAllowedReferenceUri(),
      [...referenceFilter.getSelectedReferenceIds()]
    );
  }
}
