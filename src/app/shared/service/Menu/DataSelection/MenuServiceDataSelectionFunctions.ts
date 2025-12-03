import { ActiveDataSelectionService } from 'src/app/service/Provider/ActiveDataSelection.service';
import { DataSelectionProfile } from 'src/app/model/DataSelection/Profile/DataSelectionProfile';
import { DataSelectionProviderService } from 'src/app/modules/data-selection/services/DataSelectionProvider.service';
import { Injectable } from '@angular/core';
import { NavigationHelperService } from '../../../../service/NavigationHelper.service';
import { ProfileProviderService } from 'src/app/modules/data-selection/services/ProfileProvider.service';
import { RemoveReferenceService } from '../../../../service/RemoveReference.service';
import { StagedProfileService } from '../../../../service/StagedDataSelectionProfile.service';
import { v4 as uuidv4 } from 'uuid';

@Injectable({
  providedIn: 'root',
})
export class MenuServiceDataSelectionFunctions {
  constructor(
    private profileProvider: ProfileProviderService,
    private dataSelectionProvider: DataSelectionProviderService,
    private activeDataSelectionService: ActiveDataSelectionService,
    private navigationHelperService: NavigationHelperService,
    private removeReferenceService: RemoveReferenceService,
    private stagedProfileService: StagedProfileService
  ) {}

  public redirectToDataSelectionEditPage(id: string) {
    this.stagedProfileService.initialize(id);
    this.navigationHelperService.navigateToEditProfile(id);
  }
  /**
   * @param id
   */
  public cloneDataSelectionObject(url: string) {
    const profile = this.profileProvider.getProfileById(url);
    const copiedProfile = new DataSelectionProfile(
      uuidv4(),
      profile.getUrl(),
      profile.getDisplay(),
      profile.getProfileFields(),
      profile.getFilters(),
      profile.getReference(),
      profile.getLabel()
    );
    this.profileProvider.setProfileById(copiedProfile.getId(), profile);
    const dataSelectionId = this.activeDataSelectionService.getActiveDataSelectionId();
    this.dataSelectionProvider.setProfileInDataSelection(dataSelectionId, copiedProfile);
  }

  public deleteDataSelectionObject(id: string) {
    this.removeReferenceService.delete(id);
  }
}
