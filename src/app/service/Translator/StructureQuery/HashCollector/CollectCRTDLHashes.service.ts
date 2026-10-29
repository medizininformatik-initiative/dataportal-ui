import { inject, Injectable } from '@angular/core'
import { AttributeFilterData } from 'src/app/model/Interface/AttributeFilterData'
import { ReferenceCriteriaData } from 'src/app/model/Interface/ReferenceCriteriaData'
import { StructuredQueryCriterionData } from 'src/app/model/Interface/StructuredQueryCriterionData'
import { ValueFilterData } from 'src/app/model/Interface/ValueFilterData'
import { TerminologyCode } from 'src/app/model/Terminology/TerminologyCode'
import { ConsentService } from 'src/app/service/Consent/Consent.service'
import { ConceptHashCollectorService } from './ConceptHashCollector.service'
import { CriterionHashCollectorService } from './CriterionHashCollector.service'

export interface HashCollection {
  readonly criteriaHashes: string[]
  readonly conceptHashes: string[]
}

@Injectable({
  providedIn: 'root',
})
export class CollectCRTDLHashesService {
  private readonly consentService = inject(ConsentService)
  private readonly conceptHashCollector = inject(ConceptHashCollectorService)
  private readonly criterionHashCollector = inject(CriterionHashCollectorService)

  private hashes: HashCollection = {
    criteriaHashes: [],
    conceptHashes: [],
  }

  constructor() {}

  public collectCriterionData(inexclusion: StructuredQueryCriterionData[][]): HashCollection {
    this.hashes = { conceptHashes: [], criteriaHashes: [] }
    inexclusion.forEach((criterionArray: StructuredQueryCriterionData[]) => {
      this.innerCriterion(criterionArray)
    })
    return this.hashes
  }

  private innerCriterion(innerArray: StructuredQueryCriterionData[]): void {
    innerArray.forEach((criterion: StructuredQueryCriterionData) => {
      if (!this.isConsent(criterion)) {
        this.processStructuredQueryCriterion(criterion)
      }
    })
  }

  /**
   * Checks if the given terminology code represents a consent.
   * @param termCode TerminologyCode object
   * @returns {boolean} True if it is a consent, false otherwise
   * @param {StructuredQueryCriterionData} criterion
   */
  private isConsent(criterion: StructuredQueryCriterionData): boolean {
    const terminologyCode = TerminologyCode.fromJson(criterion.termCodes[0])
    return this.consentService.getBooleanFlags(terminologyCode.getCode()) !== null
  }

  /**
   * Processes a single structured query criterion and collects its hashes.
   * @param {StructuredQueryCriterionData} structuredQueryCriterion StructuredQueryCriterionData object
   * @returns void
   */
  private processStructuredQueryCriterion(structuredQueryCriterion: StructuredQueryCriterionData): void {
    this.collectCriterionHashesFromReferenceFilters(structuredQueryCriterion)
    this.collectCriterionHashFromCriterion(structuredQueryCriterion)
    this.collectConceptHashesFromAttributeFilters(structuredQueryCriterion)
    this.collectConceptHashesFromValueFilter(structuredQueryCriterion)

    const referenceAttributeFilter = structuredQueryCriterion.attributeFilters?.find((attributeFilterData) => attributeFilterData.criteria)
    if (referenceAttributeFilter) {
      referenceAttributeFilter?.criteria.forEach((referenceCriterion) => {
        this.collectConceptHashesFromReferenceCriterionFromAttributeFilters(referenceCriterion)
        this.collectConceptHashesFromReferenceCriterionFromValueFilters(referenceCriterion)
      })
    }
  }

  /**
   * Collects criterion hashes from reference attribute filters.
   * @param {StructuredQueryCriterionData} structuredQueryCriterion
   */
  private collectCriterionHashesFromReferenceFilters(structuredQueryCriterion: StructuredQueryCriterionData): void {
    const attributeFilterData: AttributeFilterData[] | undefined = structuredQueryCriterion.attributeFilters
    if (!attributeFilterData) {
      return
    }
    const referenceCriterionHashes = this.criterionHashCollector.collectHashesFromReferenceFilters(attributeFilterData)
    this.hashes.criteriaHashes.push(...referenceCriterionHashes)
  }

  /**
   * Collects the criterion hash from the main structured query criterion.
   * @param {StructuredQueryCriterionData} structuredQueryCriterion
   */
  private collectCriterionHashFromCriterion(structuredQueryCriterion: StructuredQueryCriterionData): void {
    const criterionHash = this.criterionHashCollector.collectHashesFromCriterion(structuredQueryCriterion)
    this.hashes.criteriaHashes.push(criterionHash)
  }

  /**
   * Collects concept hashes from attribute filters.
   * @param {StructuredQueryCriterionData} structuredQueryCriterion
   */
  private collectConceptHashesFromAttributeFilters(structuredQueryCriterion: StructuredQueryCriterionData): void {
    const attributeFilters: AttributeFilterData[] | undefined = structuredQueryCriterion.attributeFilters
    if (!attributeFilters) {
      return
    }
    const attributeConceptHashes = this.conceptHashCollector.collectFromAttributeFilters(attributeFilters)
    this.hashes.conceptHashes.push(...attributeConceptHashes)
  }

  /**
   * Collects concept hashes from value filter.
   * @param {StructuredQueryCriterionData} structuredQueryCriterion
   */
  private collectConceptHashesFromValueFilter(structuredQueryCriterion: StructuredQueryCriterionData): void {
    const valueFilter: ValueFilterData | undefined = structuredQueryCriterion.valueFilter
    if (!valueFilter) {
      return
    }
    const valueConceptHashes = this.conceptHashCollector.collectFromValueFilter(valueFilter)
    this.hashes.conceptHashes.push(...valueConceptHashes)
  }

  private collectConceptHashesFromReferenceCriterionFromAttributeFilters(structuredQueryCriterion: ReferenceCriteriaData): void {
    const attributeFilters: AttributeFilterData[] | undefined = structuredQueryCriterion?.attributeFilters
    if (!attributeFilters) {
      return
    }
    const attributeConceptHashes = this.conceptHashCollector.collectFromAttributeFilters(attributeFilters)
    this.hashes.conceptHashes.push(...attributeConceptHashes)
  }

  private collectConceptHashesFromReferenceCriterionFromValueFilters(structuredQueryCriterion: ReferenceCriteriaData): void {
    const valueFilter: ValueFilterData | undefined = structuredQueryCriterion?.valueFilter
    if (!valueFilter) {
      return
    }
    const valueConceptHashes = this.conceptHashCollector.collectFromValueFilter(valueFilter)
    this.hashes.conceptHashes.push(...valueConceptHashes)
  }
}
