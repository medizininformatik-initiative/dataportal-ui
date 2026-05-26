import { AttributeFilterData } from 'src/app/model/Interface/AttributeFilterData'
import { FilterTypes } from 'src/app/model/Utilities/FilterTypes'
import { HashService } from '../../../Hash.service'
import { Injectable, inject } from '@angular/core'
import { TerminologyCodeData } from 'src/app/model/Interface/TerminologyCodeData'
import { ValueFilterData } from 'src/app/model/Interface/ValueFilterData'

@Injectable({
  providedIn: 'root',
})
export class ConceptHashCollectorService {
  private hashService = inject(HashService)

  /** Inserted by Angular inject() migration for backwards compatibility */
  constructor(...args: unknown[])

  constructor() {}

  /**
   * Collects concept hashes from attribute filters
   * @param attributeFilterData Array of AttributeFilterData
   * @returns Array of concept hashes
   */
  public collectFromAttributeFilters(attributeFilterData: AttributeFilterData[]): string[] {
    const conceptHashes: string[] = []
    attributeFilterData.forEach((filter: AttributeFilterData) =>
      conceptHashes.push(...this.getConceptHashesFromFilter(filter))
    )
    return conceptHashes
  }

  /**
   * Collects concept hashes from value filter
   * @param valueFilterData ValueFilterData object
   * @returns Array of concept hashes
   */
  public collectFromValueFilter(valueFilterData: ValueFilterData): string[] {
    return this.getConceptHashesFromFilter(valueFilterData)
  }

  /**
   * Extracts concept hashes from a filter base data object
   * @param filterBaseData AttributeFilterBaseData or ValueFilterData
   * @returns Array of concept hashes
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
   * @param selectedConcepts Array of TerminologyCodeData
   * @returns Array of concept hashes
   */
  private mapConceptHashes(selectedConcepts: TerminologyCodeData[]): string[] {
    if (!selectedConcepts || selectedConcepts.length === 0) {
      return []
    }
    return selectedConcepts.map((termCodeData: TerminologyCodeData) =>
      this.hashService.createConceptHash(termCodeData)
    )
  }
}
