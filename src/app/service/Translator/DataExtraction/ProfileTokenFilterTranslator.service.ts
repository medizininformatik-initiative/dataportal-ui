import { Injectable, inject } from '@angular/core'
import { DataSelectionProfile } from 'src/app/model/DataSelection/Profile/DataSelectionProfile'
import { AbstractProfileFilter } from 'src/app/model/DataSelection/Profile/Filter/AbstractProfileFilter'
import { ProfileTokenFilter } from 'src/app/model/DataSelection/Profile/Filter/ProfileTokenFilter'
import { Concept } from 'src/app/model/FeasibilityQuery/Criterion/AttributeFilter/Concept/Concept'
import { AttributeGroupsData } from 'src/app/model/Interface/AttributeGroupsData'
import { FilterData } from 'src/app/model/Interface/FilterData'
import { TerminologyCodeData } from 'src/app/model/Interface/TerminologyCodeData'
import { TerminologyCode } from 'src/app/model/Terminology/TerminologyCode'
import { DataSelectionFilterType } from 'src/app/model/Utilities/DataSelectionFilterType'
import { v4 as uuidv4 } from 'uuid'
import { Display } from '../../../model/DataSelection/Profile/Display'
import { HashService } from '../../Hash.service'
import { TypeGuard } from '../../TypeGuard/TypeGuard'
import { ConceptTranslationCacheService } from '../ConceptTranslationCache.service'

@Injectable({
  providedIn: 'root',
})
export class ProfileTokenFilterTranslatorService {
  private readonly conceptTranslationCacheService = inject(ConceptTranslationCacheService)
  private readonly hashService = inject(HashService)

  /** Inserted by Angular inject() migration for backwards compatibility */
  constructor(...args: unknown[])

  constructor() {}

  public createTokenFilters(externProfile: AttributeGroupsData, profile: DataSelectionProfile): ProfileTokenFilter[] {
    return (profile.getFilters() ?? [])
      .filter((filterData: AbstractProfileFilter) => filterData.getType() === DataSelectionFilterType.TOKEN)
      .map((filterData: AbstractProfileFilter) => this.createProfileTokenFilter(filterData as ProfileTokenFilter, externProfile))
  }

  private createProfileTokenFilter(filterData: ProfileTokenFilter, externProfile: AttributeGroupsData): ProfileTokenFilter {
    const foundFilter = externProfile.filter.find((externFilter: FilterData) => externFilter.name === filterData.getName())
    if (foundFilter && TypeGuard.isFilterData(foundFilter)) {
      const concepts = foundFilter.codes.map((code: TerminologyCodeData) => this.createConcept(code))
      return new ProfileTokenFilter(uuidv4(), foundFilter.name, foundFilter.type, filterData.getValueSetUrls(), concepts)
    } else {
      return filterData
    }
  }

  private createConcept(code: TerminologyCodeData): Concept {
    const termCodeData = this.buildTermCodeData(code)
    const hash = this.hashService.createConceptHash(termCodeData)
    const conceptData = this.conceptTranslationCacheService.getOne(hash)
    const display = Display.fromJson(conceptData.display)
    return new Concept(display, TerminologyCode.fromJson(code))
  }

  private buildTermCodeData(code: TerminologyCodeData): TerminologyCodeData {
    return {
      code: code.code,
      system: code.system,
      version: code.version,
      display: code.display,
    }
  }
}
