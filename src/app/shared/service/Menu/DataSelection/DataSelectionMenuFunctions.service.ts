import { Injectable, inject } from '@angular/core'
import { DataSelectionProfileCloner } from 'src/app/model/Utilities/DataSelecionCloner/DataSelectionProfileCloner'
import { ActiveDataSelectionService } from 'src/app/service/Provider/ActiveDataSelection.service'
import { DataSelectionProviderService } from 'src/app/service/Provider/DataSelectionProvider.service'
import { ProfileProviderService } from 'src/app/service/Provider/ProfileProvider.service'
import { v4 as uuidv4 } from 'uuid'
import { NavigationHelperService } from '../../../../service/NavigationHelper.service'
import { RemoveReferenceService } from '../../../../service/RemoveReference.service'

@Injectable({
  providedIn: 'root',
})
export class DataSelectionMenuFunctionsService {
  private readonly profileProvider = inject(ProfileProviderService)
  private readonly dataSelectionProvider = inject(DataSelectionProviderService)
  private readonly activeDataSelectionService = inject(ActiveDataSelectionService)
  private readonly navigationHelperService = inject(NavigationHelperService)
  private readonly removeReferenceService = inject(RemoveReferenceService)

  constructor() {}

  public redirectToDataSelectionEditPage(id: string, args?: Record<string, unknown>) {
    this.navigationHelperService.navigateToEditProfile(id)
  }
  public cloneDataSelectionObject(id: string) {
    const profile = this.profileProvider.getOne(id)
    const copiedProfile = DataSelectionProfileCloner.deepCopyProfile(profile, uuidv4())
    const dataSelectionId = this.activeDataSelectionService.getActiveDataSelectionId()
    this.dataSelectionProvider.setProfileInDataSelection(dataSelectionId, copiedProfile, 'ADD')
  }

  public deleteDataSelectionObject(id: string) {
    this.removeReferenceService.delete(id)
  }
}
