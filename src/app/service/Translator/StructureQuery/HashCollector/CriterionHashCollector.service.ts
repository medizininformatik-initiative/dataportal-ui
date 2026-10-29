import { Injectable, inject } from '@angular/core'
import { AttributeFilterData } from 'src/app/model/Interface/AttributeFilterData'
import { ContextData } from 'src/app/model/Interface/ContextData'
import { ReferenceCriteriaData } from 'src/app/model/Interface/ReferenceCriteriaData'
import { StructuredQueryCriterionData } from 'src/app/model/Interface/StructuredQueryCriterionData'
import { TerminologyCodeData } from 'src/app/model/Interface/TerminologyCodeData'
import { TerminologyCode } from 'src/app/model/Terminology/TerminologyCode'
import { FilterTypes } from 'src/app/model/Utilities/FilterTypes'
import { HashService } from '../../../Hash.service'

@Injectable({
  providedIn: 'root',
})
export class CriterionHashCollectorService {
  private readonly hashService = inject(HashService)

  /** Inserted by Angular inject() migration for backwards compatibility */
  constructor(...args: unknown[])

  constructor() {}

  /**
   * Collects criterion hash from the main criterion
   * @param {StructuredQueryCriterionData} structuredQueryCriterion StructuredQueryCriterionData object
   * @returns {string} Criterion hash string
   */
  public collectHashesFromCriterion(structuredQueryCriterion: StructuredQueryCriterionData): string {
    const contextData = structuredQueryCriterion.context
    const termCodeData = structuredQueryCriterion.termCodes[0]
    return this.createCriterionHash(contextData, termCodeData)
  }

  /**
   * Collects criterion hashes from reference filters
   * @param {AttributeFilterData[]} attributeFilterData Array of AttributeFilterData
   * @returns {string[]} Array of criterion hashes
   */
  public collectHashesFromReferenceFilters(attributeFilterData: AttributeFilterData[]): string[] {
    const referenceFilter = attributeFilterData.find(
      (attributeFilter: AttributeFilterData) => attributeFilter.type === FilterTypes.REFERENCE
    )

    if (!referenceFilter) {
      return []
    }
    return this.createReferenceCriterionHash(referenceFilter.criteria)
  }

  /**
   * Creates an array of reference criterion hashes from reference criteria data
   * @param {ReferenceCriteriaData[]} referenceCriteriaData
   * @returns {string[]} Array of reference criterion hashes
   */
  private createReferenceCriterionHash(referenceCriteriaData: ReferenceCriteriaData[]): string[] {
    return referenceCriteriaData.map((reference: ReferenceCriteriaData) =>
      this.createCriterionHash(reference.context, reference.termCodes[0])
    )
  }

  /**
   * Creates a criterion hash from context and term code data
   * @param {ContextData} contextData ContextData object
   * @param {TerminologyCodeData} termCodeData TerminologyCodeData object
   * @returns {string} Criterion hash string
   */
  private createCriterionHash(contextData: ContextData, termCodeData: TerminologyCodeData): string {
    const context = TerminologyCode.fromJson(contextData)
    const termCode = TerminologyCode.fromJson(termCodeData)
    return this.hashService.createCriterionHash(context, termCode)
  }
}
