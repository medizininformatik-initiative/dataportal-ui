import { AbstractProfileFilter } from 'src/app/model/DataSelection/Profile/Filter/AbstractProfileFilter';
import { AttributeGroupsData } from 'src/app/model/Interface/AttributeGroupsData';
import { DataSelectionProfile } from 'src/app/model/DataSelection/Profile/DataSelectionProfile';
import { Display } from 'src/app/model/DataSelection/Profile/Display';
import { Injectable } from '@angular/core';
import { ProfileTimeRestrictionFilter } from 'src/app/model/DataSelection/Profile/Filter/ProfileDateFilter';
import { ProfileTokenFilter } from 'src/app/model/DataSelection/Profile/Filter/ProfileTokenFilter';
import { TerminologyCode } from 'src/app/model/Terminology/TerminologyCode';
import { TypeGuard } from '../../TypeGuard/TypeGuard';
import { UITimeRestrictionFactoryService } from '../Shared/UITimeRestrictionFactory.service';
import { v4 as uuidv4 } from 'uuid';
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
