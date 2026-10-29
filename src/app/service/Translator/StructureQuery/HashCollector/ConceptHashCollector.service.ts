import { Injectable, inject } from '@angular/core'
import { AttributeFilterData } from 'src/app/model/Interface/AttributeFilterData'
import { TerminologyCodeData } from 'src/app/model/Interface/TerminologyCodeData'
import { ValueFilterData } from 'src/app/model/Interface/ValueFilterData'
import { FilterTypes } from 'src/app/model/Utilities/FilterTypes'
import { HashService } from '../../../Hash.service'

@Injectable({
  providedIn: 'root',
})
export class ConceptHashCollectorService {
  private readonly hashService = inject(HashService)

  /** Inserted by Angular inject() migration for backwards compatibility */
  constructor(...args: unknown[])

  constructor() {}

  /**
   * Collects concept hashes from attribute filters
   * @param {AttributeFilterData[]} attributeFilterData Array of AttributeFilterData
   * @returns {string[]} Array of concept hashes
   */
  public collectFromAttributeFilters(attributeFilterData: AttributeFilterData[]): string[] {
    const conceptHashes: string[] = []
    attributeFilterData.forEach((filter: AttributeFilterData) => conceptHashes.push(...this.getConceptHashesFromFilter(filter)))
    return conceptHashes
  }

  /**
   * Collects concept hashes from value filter
   * @param {ValueFilterData} valueFilterData ValueFilterData object
   * @returns {string[]} Array of concept hashes
   */
  public collectFromValueFilter(valueFilterData: ValueFilterData): string[] {
    return this.getConceptHashesFromFilter(valueFilterData)
  }

  /**
   * Extracts concept hashes from a filter base data object
   * @param filterBaseData AttributeFilterBaseData or ValueFilterData
   * @returns {string[]} Array of concept hashes
   * @param {AttributeFilterData | ValueFilterData} filterData
   */
  private getConceptHashesFromFilter(filterData: AttributeFilterData | ValueFilterData): string[] {
    if (filterData.type === FilterTypes.CONCEPT) {
      const selectedConcepts: TerminologyCodeData[] = filterData?.selectedConcepts
      return this.mapConceptHashes(selectedConcepts)
    }
    return []
  }

  /**
   * Maps terminology code data to concept hashes
   * @param {TerminologyCodeData[]} selectedConcepts Array of TerminologyCodeData
   * @returns {string[]} Array of concept hashes
   */
  private mapConceptHashes(selectedConcepts: TerminologyCodeData[]): string[] {
    if (!selectedConcepts || selectedConcepts.length === 0) {
      return []
    }
    return selectedConcepts.map((termCodeData: TerminologyCodeData) => this.hashService.createConceptHash(termCodeData))
  }
}
