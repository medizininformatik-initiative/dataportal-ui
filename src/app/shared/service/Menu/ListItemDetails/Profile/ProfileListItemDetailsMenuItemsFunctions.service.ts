import { inject, Injectable } from '@angular/core'
import { filter, switchMap, take, tap } from 'rxjs'
import { DataSelectionProfile } from 'src/app/model/DataSelection/Profile/DataSelectionProfile'
import { ProfileEntryDetails } from 'src/app/model/Search/EntryDetails/Profile/ProfileEntryDetails'
import { LoadDataSelectionProfilesService } from 'src/app/service/DataSelection/LoadDataSelectionProfiles.service'
import { DataSelectionProviderService } from 'src/app/service/Provider/DataSelectionProvider.service'
import { ProfileProviderService } from 'src/app/service/Provider/ProfileProvider.service'
import { ProfileEntryDetailsService } from 'src/app/service/Search/ListEntryDetails/ProfileEntryDetails.service'
import { ProfileSearchService } from 'src/app/service/Search/SearchTypes/Profile/ProfileSearch.service'
import { SnackbarMessageService } from 'src/app/service/SnackbarMessage.service'

@Injectable({
  providedIn: 'root',
})
export class ProfileListItemDetailsMenuItemsFunctionsService {
  private readonly profileSearchService = inject(ProfileSearchService)
  private readonly profileEntryDetailsService = inject(ProfileEntryDetailsService)
  private readonly loadDataSelectionProfilesService = inject(LoadDataSelectionProfilesService)
  private readonly snackbarMessageService = inject(SnackbarMessageService)
  private readonly dataSelectionProvider = inject(DataSelectionProviderService)
  private readonly profileProvider = inject(ProfileProviderService)

  public searchProfile(id: string): void {
    this.profileEntryDetailsService
      .loadDetails(id)
      .pipe(
        take(1),
        switchMap((details: ProfileEntryDetails) => this.profileSearchService.search(details.getDisplay().getOriginal()))
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
        switchMap((details: ProfileEntryDetails) =>
          this.loadDataSelectionProfilesService.loadProfiles([
            'https://www.medizininformatik-initiative.de/fhir/ext/modul-icu/StructureDefinition/dauer-extrakorporaler-gasaustausch',
          ])
        ),
        filter((profiles: DataSelectionProfile[]) => profiles.length > 0),
        tap((profiles: DataSelectionProfile[]) => this.dataSelectionProvider.setActiveProfile(profiles[0], 'ADD')),
        take(1)
      )
      .subscribe(() => this.snackbarMessageService.displayAddedToDataSelection())
  }
}
