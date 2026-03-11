import { AbstractProfileFilter } from 'src/app/model/DataSelection/Profile/Filter/AbstractProfileFilter';
import { AttributeGroupsData } from 'src/app/model/Interface/AttributeGroupsData';
import { DataSelectionProfile } from 'src/app/model/DataSelection/Profile/DataSelectionProfile';
import { Injectable } from '@angular/core';
import { ProfileDateFilterTranslatorService } from './ProfileDateFilterTranslator.service';
import { ProfileTokenFilterTranslatorService } from './ProfileTokenFilterTranslator.service';

@Injectable({
  providedIn: 'root',
})
export class ProfileFilterTranslatorService {
  constructor(
    private profileTokenFilterTranslator: ProfileTokenFilterTranslatorService,
    private profileDateFilterTranslator: ProfileDateFilterTranslatorService
  ) {}

  public createProfileFilters(
    externProfile: AttributeGroupsData,
    profile: DataSelectionProfile
  ): AbstractProfileFilter[] {
    const tokenFilters = this.profileTokenFilterTranslator.createTokenFilters(
      externProfile,
      profile
    );
    const dateFilters = this.profileDateFilterTranslator.createDateFilters(externProfile, profile);
    return [...tokenFilters, ...dateFilters];
  }
}
