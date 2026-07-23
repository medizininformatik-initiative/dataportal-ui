import { Injectable, inject } from '@angular/core'
import { LoadDataSelectionProfilesService } from 'src/app/service/DataSelection/LoadDataSelectionProfiles.service'
import { ProfileEntryDetailsService } from 'src/app/service/Search/ListEntryDetails/ProfileEntryDetails.service'
import { ProfileSearchService } from 'src/app/service/Search/SearchTypes/Profile/ProfileSearch.service'
import { SnackbarMessageService } from 'src/app/service/SnackbarMessage.service'
import { filter, switchMap, take, tap } from 'rxjs'
import { DataSelectionProviderService } from 'src/app/service/Provider/DataSelectionProvider.service'

@Injectable({
  providedIn: 'root',
})
export class ProfileListItemDetailsMenuItemsFunctionsService {
  private profileSearchService = inject(ProfileSearchService)
  private profileEntryDetailsService = inject(ProfileEntryDetailsService)
  private loadDataSelectionProfilesService = inject(LoadDataSelectionProfilesService)
  private snackbarMessageService = inject(SnackbarMessageService)
  private dataSelectionProvider = inject(DataSelectionProviderService)

  public searchProfile(id: string): void {
    this.profileEntryDetailsService
      .loadDetails(id)
      .pipe(
        take(1),
        switchMap((details) => this.profileSearchService.search(details.getDisplay().getOriginal()))
      )
      .subscribe()
  }

  public showProfileInResultList(id: string): void {
    this.profileEntryDetailsService.loadDetails(id).pipe(take(1)).subscribe()
  }

  public addToDataSelection(id: string): void {
    this.loadDataSelectionProfilesService
      .loadProfiles([id])
      .pipe(
        filter((profiles) => profiles.length > 0),
        tap((profiles) => this.dataSelectionProvider.setProfileInActiveDataSelection(profiles[0])),
        take(1)
      )
      .subscribe(() => this.snackbarMessageService.displayAddedToDataSelection())
  }
}
