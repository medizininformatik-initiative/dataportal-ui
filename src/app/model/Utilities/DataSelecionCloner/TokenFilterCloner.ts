import { ProfileTokenFilter } from '../../DataSelection/Profile/Filter/ProfileTokenFilter'
import { Concept } from '../../FeasibilityQuery/Criterion/AttributeFilter/Concept/Concept'
import { CloneConcept } from '../CriterionCloner/ValueAttributeFilter/Concept/CloneConcept'

export class TokenFilterCloner {
  /**
   * Clones a ProfileTokenFilter object deeply.
   * @param {ProfileTokenFilter} tokenFilter The ProfileTokenFilter to clone.
   * @returns {ProfileTokenFilter} A deep copy of the ProfileTokenFilter.
   */
  public static deepCopyTokenFilter(tokenFilter: ProfileTokenFilter): ProfileTokenFilter {
    if (!tokenFilter) {
      return undefined
    }
    const clonedSelectedTokens = tokenFilter.getSelectedTokens().map((token: Concept) => CloneConcept.deepCopyConcept(token))
    const clonedValueSetUrls = [...(tokenFilter.getValueSetUrls() || [])]
    return new ProfileTokenFilter(
      tokenFilter.getId(),
      tokenFilter.getName(),
      tokenFilter.getType(),
      clonedValueSetUrls,
      clonedSelectedTokens
    )
  }
}
