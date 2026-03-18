import { AbstractProfileFilter } from 'src/app/model/DataSelection/Profile/Filter/AbstractProfileFilter';
import { AttributeGroupsData } from 'src/app/model/Interface/AttributeGroupsData';
import { Concept } from 'src/app/model/FeasibilityQuery/Criterion/AttributeFilter/Concept/Concept';
import { ConceptTranslationCacheService } from '../ConceptTranslationCache.service';
import { DataSelectionFilterType } from 'src/app/model/Utilities/DataSelectionFilterType';
import { DataSelectionProfile } from 'src/app/model/DataSelection/Profile/DataSelectionProfile';
import { HashService } from '../../Hash.service';
import { Injectable } from '@angular/core';
import { ProfileTokenFilter } from 'src/app/model/DataSelection/Profile/Filter/ProfileTokenFilter';
import { TerminologyCode } from 'src/app/model/Terminology/TerminologyCode';
import { TerminologyCodeData } from 'src/app/model/Interface/TerminologyCodeData';
import { TypeGuard } from '../../TypeGuard/TypeGuard';
import { v4 as uuidv4 } from 'uuid';
import { Display } from '../../../model/DataSelection/Profile/Display';

@Injectable({
  providedIn: 'root',
})
export class ProfileTokenFilterTranslatorService {
  constructor(
    private conceptTranslationCacheService: ConceptTranslationCacheService,
    private hashService: HashService
  ) {}

  public createTokenFilters(
    externProfile: AttributeGroupsData,
    profile: DataSelectionProfile
  ): ProfileTokenFilter[] {
    return (profile.getFilters() ?? [])
      .filter(
        (filterData: AbstractProfileFilter) =>
          filterData.getType() === DataSelectionFilterType.TOKEN
      )
      .map((filterData) =>
        this.createProfileTokenFilter(filterData as ProfileTokenFilter, externProfile)
      );
  }

  private createProfileTokenFilter(
    filterData: ProfileTokenFilter,
    externProfile: AttributeGroupsData
  ): ProfileTokenFilter {
    const foundFilter = externProfile.filter.find(
      (externFilter) => externFilter.name === filterData.getName()
    );
    if (foundFilter && TypeGuard.isFilterData(foundFilter)) {
      const concepts = foundFilter.codes.map((code) => this.createConcept(code));
      return new ProfileTokenFilter(
        uuidv4(),
        foundFilter.name,
        foundFilter.type,
        filterData.getValueSetUrls(),
        concepts
      );
    } else {
      return filterData;
    }
  }

  private createConcept(code: TerminologyCodeData): Concept {
    const termCodeData = this.buildTermCodeData(code);
    const hash = this.hashService.createConceptHash(termCodeData);
    const conceptData = this.conceptTranslationCacheService.getOne(hash);
    const display = Display.fromJson(conceptData.display);
    return new Concept(display, TerminologyCode.fromJson(code));
  }

  private buildTermCodeData(code: TerminologyCodeData): TerminologyCodeData {
    return {
      code: code.code,
      system: code.system,
      version: code.version,
      display: code.display,
    };
  }
}
