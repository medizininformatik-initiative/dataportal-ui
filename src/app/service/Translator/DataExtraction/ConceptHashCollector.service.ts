import { Injectable, inject } from '@angular/core'
import { AttributeGroupsData } from 'src/app/model/Interface/AttributeGroupsData'
import { DataExtractionData } from 'src/app/model/Interface/DataExtractionData'
import { FilterData } from 'src/app/model/Interface/FilterData'
import { TerminologyCodeData } from 'src/app/model/Interface/TerminologyCodeData'
import { HashService } from '../../Hash.service'
import { TypeGuard } from '../../TypeGuard/TypeGuard'

@Injectable({
  providedIn: 'root',
})
export class ConceptHashCollectorService {
  private readonly hashService = inject(HashService)

  /** Inserted by Angular inject() migration for backwards compatibility */
  constructor(...args: unknown[])

  constructor() {}

  /**
   * Collects the concept hashes of all attribute groups.
   * @param {DataExtractionData} dataExtraction
   * @returns {string[]}
   */
  public collectConceptHashes(dataExtraction: DataExtractionData): string[] {
    const hashes: string[] = []
    dataExtraction.attributeGroups.forEach((group: AttributeGroupsData) => {
      this.collectGroupHashes(group, hashes)
    })
    return hashes
  }

  /**
   * Adds the concept hashes of the group filters to the list.
   * @param {AttributeGroupsData} group
   * @param {string[]} hashes
   */
  private collectGroupHashes(group: AttributeGroupsData, hashes: string[]): void {
    if (group.filter) {
      group.filter.forEach((filter: FilterData) => {
        this.collectFilterHashes(filter, hashes)
      })
    }
  }

  /**
   * Adds the concept hashes of a token filter to the list.
   * @param {FilterData} filter
   * @param {string[]} hashes
   */
  private collectFilterHashes(filter: FilterData, hashes: string[]): void {
    if (filter.type === 'token' && TypeGuard.isFilterData(filter)) {
      filter.codes.forEach((code: TerminologyCodeData) => {
        hashes.push(this.createConceptHash(code))
      })
    }
  }

  /**
   * Creates the concept hash for a code.
   * @param {TerminologyCodeData} code
   * @returns {string}
   */
  private createConceptHash(code: TerminologyCodeData): string {
    return this.hashService.createConceptHash({
      code: code.code,
      system: code.system,
      version: code.version,
      display: code.display,
    })
  }
}
