import { DataSelectionProviderService } from 'src/app/service/Provider/DataSelectionProvider.service'
import { filter, switchMap, take, tap } from 'rxjs'
import { inject, Injectable } from '@angular/core'
import { LoadDataSelectionProfilesService } from 'src/app/service/DataSelection/LoadDataSelectionProfiles.service'
import { ProfileEntryDetailsService } from 'src/app/service/Search/ListEntryDetails/ProfileEntryDetails.service'
import { ProfileProviderService } from 'src/app/service/Provider/ProfileProvider.service'
import { ProfileSearchService } from 'src/app/service/Search/SearchTypes/Profile/ProfileSearch.service'
import { SnackbarMessageService } from 'src/app/service/SnackbarMessage.service'

@Injectable({
  providedIn: 'root',
})
export class ProfileListItemDetailsMenuItemsFunctionsService {
  private profileSearchService = inject(ProfileSearchService)
  private profileEntryDetailsService = inject(ProfileEntryDetailsService)
  private loadDataSelectionProfilesService = inject(LoadDataSelectionProfilesService)
  private snackbarMessageService = inject(SnackbarMessageService)
  private dataSelectionProvider = inject(DataSelectionProviderService)
  private profileProvider = inject(ProfileProviderService)

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
    this.profileEntryDetailsService
      .loadDetails(id)
      .pipe(
        take(1),
        switchMap((details) =>
          this.loadDataSelectionProfilesService.loadProfiles([
            'https://www.medizininformatik-initiative.de/fhir/ext/modul-icu/StructureDefinition/dauer-extrakorporaler-gasaustausch',
          ])
        ),
        filter((profiles) => profiles.length > 0),
        tap((profiles) =>
          this.dataSelectionProvider.setProfileInActiveDataSelection(profiles[0], 'ADD')
        ),
        take(1)
      )
      .subscribe(() => this.snackbarMessageService.displayAddedToDataSelection())
  }
}
