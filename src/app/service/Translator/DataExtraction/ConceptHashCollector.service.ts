import { AttributeGroupsData } from 'src/app/model/Interface/AttributeGroupsData'
import { DataExtractionData } from 'src/app/model/Interface/DataExtractionData'
import { FilterData } from 'src/app/model/Interface/FilterData'
import { HashService } from '../../Hash.service'
import { Injectable, inject } from '@angular/core'
import { TerminologyCodeData } from 'src/app/model/Interface/TerminologyCodeData'
import { TypeGuard } from '../../TypeGuard/TypeGuard'

@Injectable({
  providedIn: 'root',
})
export class ConceptHashCollectorService {
  private hashService = inject(HashService)

  /** Inserted by Angular inject() migration for backwards compatibility */
  constructor(...args: unknown[])

  constructor() {}

  public collectConceptHashes(dataExtraction: DataExtractionData): string[] {
    const hashes: string[] = []
    dataExtraction.attributeGroups.forEach((group) => {
      this.collectGroupHashes(group, hashes)
    })
    return hashes
  }

  private collectGroupHashes(group: AttributeGroupsData, hashes: string[]): void {
    if (group.filter) {
      group.filter.forEach((filter) => {
        this.collectFilterHashes(filter, hashes)
      })
    }
  }

  private collectFilterHashes(filter: FilterData, hashes: string[]): void {
    if (filter.type === 'token' && TypeGuard.isFilterData(filter)) {
      filter.codes.forEach((code) => {
        hashes.push(this.createConceptHash(code))
      })
    }
  }

  private createConceptHash(code: TerminologyCodeData): string {
    return this.hashService.createConceptHash({
      code: code.code,
      system: code.system,
      version: code.version,
      display: code.display,
    })
  }
}
