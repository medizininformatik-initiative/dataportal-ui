import { ActiveDataSelectionService } from 'src/app/service/Provider/ActiveDataSelection.service';
import { DataSelectionProfileCloner } from 'src/app/model/Utilities/DataSelecionCloner/DataSelectionProfileCloner';
import { DataSelectionProviderService } from 'src/app/modules/data-selection/services/DataSelectionProvider.service';
import { Injectable } from '@angular/core';
import { NavigationHelperService } from '../../../../service/NavigationHelper.service';
import { ProfileProviderService } from 'src/app/service/Provider/ProfileProvider.service';
import { RemoveReferenceService } from '../../../../service/RemoveReference.service';
import { StagedProfileService } from '../../../../service/StagedDataSelectionProfile.service';

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
    //this.stagedProfileService.initialize(id);
    this.navigationHelperService.navigateToEditProfile(id);
  }
  /**
   * @param id
   */
  public cloneDataSelectionObject(id: string) {
    const profile = this.profileProvider.getOne(id);
    const copiedProfile = DataSelectionProfileCloner.deepCopyProfile(profile);
    this.profileProvider.addOne(copiedProfile);
    const dataSelectionId = this.activeDataSelectionService.getActiveDataSelectionId();
    this.dataSelectionProvider.setProfileInDataSelection(dataSelectionId, copiedProfile);
  }

  public deleteDataSelectionObject(id: string) {
    this.removeReferenceService.delete(id);
  }
}
