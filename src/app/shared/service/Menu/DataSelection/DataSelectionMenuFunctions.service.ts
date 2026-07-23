import { ActiveDataSelectionService } from 'src/app/service/Provider/ActiveDataSelection.service'
import { DataSelectionProfileCloner } from 'src/app/model/Utilities/DataSelecionCloner/DataSelectionProfileCloner'
import { DataSelectionProviderService } from 'src/app/service/Provider/DataSelectionProvider.service'
import { Injectable, inject } from '@angular/core'
import { NavigationHelperService } from '../../../../service/NavigationHelper.service'
import { ProfileProviderService } from 'src/app/service/Provider/ProfileProvider.service'
import { RemoveReferenceService } from '../../../../service/RemoveReference.service'

@Injectable({
  providedIn: 'root',
})
export class DataSelectionMenuFunctionsService {
  private profileProvider = inject(ProfileProviderService)
  private dataSelectionProvider = inject(DataSelectionProviderService)
  private activeDataSelectionService = inject(ActiveDataSelectionService)
  private navigationHelperService = inject(NavigationHelperService)
  private removeReferenceService = inject(RemoveReferenceService)

  constructor() {}

  public redirectToDataSelectionEditPage(id: string, args?: Record<string, unknown>) {
    this.navigationHelperService.navigateToEditProfile(id)
  }
  /**
   * @param id
   */
  public cloneDataSelectionObject(id: string) {
    const profile = this.profileProvider.getOne(id)
    const copiedProfile = DataSelectionProfileCloner.deepCopyProfile(profile)
    this.profileProvider.addOne(copiedProfile)
    const dataSelectionId = this.activeDataSelectionService.getActiveDataSelectionId()
    this.dataSelectionProvider.setProfileInDataSelection(dataSelectionId, copiedProfile)
  }

  public deleteDataSelectionObject(id: string) {
    this.removeReferenceService.delete(id)
  }
}
