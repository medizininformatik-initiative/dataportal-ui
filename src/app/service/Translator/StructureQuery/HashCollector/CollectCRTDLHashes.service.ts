import { AttributeFilterData } from 'src/app/model/Interface/AttributeFilterData'
import { ConceptHashCollectorService } from './ConceptHashCollector.service'
import { ConsentService } from 'src/app/service/Consent/Consent.service'
import { CriterionHashCollectorService } from './CriterionHashCollector.service'
import { Injectable, inject } from '@angular/core'
import { StructuredQueryCriterionData } from 'src/app/model/Interface/StructuredQueryCriterionData'
import { TerminologyCode } from 'src/app/model/Terminology/TerminologyCode'

export interface HashCollection {
  readonly criteriaHashes: string[]
  readonly conceptHashes: string[]
}

@Injectable({
  providedIn: 'root',
})
export class CollectCRTDLHashesService {
  private consentService = inject(ConsentService)
  private conceptHashCollector = inject(ConceptHashCollectorService)
  private criterionHashCollector = inject(CriterionHashCollectorService)

  private hashes: HashCollection = {
    criteriaHashes: [],
    conceptHashes: [],
  }

  /** Inserted by Angular inject() migration for backwards compatibility */
  constructor(...args: unknown[])

  constructor() {}

  public collectCriterionData(inexclusion: StructuredQueryCriterionData[][]): HashCollection {
    inexclusion.forEach((criterionArray: StructuredQueryCriterionData[]) => {
      this.innerCriterion(criterionArray)
    })
    return this.hashes
  }

  public innerCriterion(innerArray: StructuredQueryCriterionData[]): void {
    innerArray.forEach((criterion: StructuredQueryCriterionData) => {
      if (!this.isConsent(criterion)) {
        this.processStructuredQueryCriterion(criterion)
      }
    })
  }

  /**
   * Checks if the given terminology code represents a consent.
   * @param termCode TerminologyCode object
   * @returns True if it is a consent, false otherwise
   */
  private isConsent(criterion: StructuredQueryCriterionData): boolean {
    const terminologyCode = TerminologyCode.fromJson(criterion.termCodes[0])
    return this.consentService.getBooleanFlags(terminologyCode.getCode()) !== null
  }

  /**
   * Processes a single structured query criterion and collects its hashes.
   * @param structuredQueryCriterion StructuredQueryCriterionData object
   * @returns void
   */
  private processStructuredQueryCriterion(
    structuredQueryCriterion: StructuredQueryCriterionData
  ): void {
    this.collectCriterionHashesFromReferenceFilters(structuredQueryCriterion)
    this.collectCriterionHashFromCriterion(structuredQueryCriterion)
    this.collectConceptHashesFromAttributeFilters(structuredQueryCriterion)
    this.collectConceptHashesFromValueFilter(structuredQueryCriterion)
  }

  /**
   * Collects criterion hashes from reference attribute filters.
   */
  private collectCriterionHashesFromReferenceFilters(
    structuredQueryCriterion: StructuredQueryCriterionData
  ): void {
    const attributeFilterData: AttributeFilterData[] = structuredQueryCriterion.attributeFilters
    if (!attributeFilterData) {
      return
    }
    const referenceCriterionHashes =
      this.criterionHashCollector.collectHashesFromReferenceFilters(attributeFilterData)
    this.hashes.criteriaHashes.push(...referenceCriterionHashes)
  }

  /**
   * Collects the criterion hash from the main structured query criterion.
   */
  private collectCriterionHashFromCriterion(
    structuredQueryCriterion: StructuredQueryCriterionData
  ): void {
    const criterionHash =
      this.criterionHashCollector.collectHashesFromCriterion(structuredQueryCriterion)
    this.hashes.criteriaHashes.push(criterionHash)
  }

  /**
   * Collects concept hashes from attribute filters.
   */
  private collectConceptHashesFromAttributeFilters(
    structuredQueryCriterion: StructuredQueryCriterionData
  ): void {
    const attributeFilters: AttributeFilterData[] = structuredQueryCriterion.attributeFilters
    if (!attributeFilters) {
      return
    }
    const attributeConceptHashes =
      this.conceptHashCollector.collectFromAttributeFilters(attributeFilters)
    this.hashes.conceptHashes.push(...attributeConceptHashes)
  }

  /**
   * Collects concept hashes from value filter.
   */
  private collectConceptHashesFromValueFilter(
    structuredQueryCriterion: StructuredQueryCriterionData
  ): void {
    const valueFilter = structuredQueryCriterion.valueFilter
    if (!valueFilter) {
      return
    }
    const valueConceptHashes = this.conceptHashCollector.collectFromValueFilter(valueFilter)
    this.hashes.conceptHashes.push(...valueConceptHashes)
  }
}
