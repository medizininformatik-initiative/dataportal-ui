import { Component, computed, inject, signal } from '@angular/core'
import { toSignal } from '@angular/core/rxjs-interop'
import { MatBadge } from '@angular/material/badge'
import { MatTooltip } from '@angular/material/tooltip'
import { TranslateModule } from '@ngx-translate/core'
import { finalize, map } from 'rxjs'
import { Subscription } from 'rxjs'
import { ProfileListEntry } from 'src/app/model/Search/ListEntries/ProfileListEntry'
import { LoadDataSelectionProfilesService } from 'src/app/service/DataSelection/LoadDataSelectionProfiles.service'
import { SelectedProfileService } from 'src/app/service/DataSelection/Selection/SelectedProfileEntry.service'
import { NavigationHelperService } from 'src/app/service/NavigationHelper.service'
import { SnackbarMessageService } from 'src/app/service/SnackbarMessage.service'
import { DataSelectionProviderService } from '../../../../../service/Provider/DataSelectionProvider.service'
import { ActionBarComponent } from '../../../../../shared/components/action-bar/action-bar.component'
import { ButtonComponent } from '../../../../../shared/components/button/button.component'

@Component({
  selector: 'num-profile-search-action-bar',
  templateUrl: './profile-search-action-bar.component.html',
  standalone: true,
  imports: [ActionBarComponent, ButtonComponent, MatBadge, MatTooltip, TranslateModule],
})
export class ProfileSearchActionBarComponent {
  private readonly selectedProfileService = inject(SelectedProfileService)
  private readonly dataSelectionProviderService = inject(DataSelectionProviderService)
  private readonly loadDataSelectionProfilesService = inject(LoadDataSelectionProfilesService)
  private readonly snackbarMessageService = inject(SnackbarMessageService)
  private readonly navigationHelperService = inject(NavigationHelperService)

  private readonly selectedProfiles = this.selectedProfileService.getSelectedProfiles()
  public readonly profileEntryCount = computed(() => this.selectedProfiles().length)

  public readonly dataSelectionProfileCount = toSignal(
    this.dataSelectionProviderService.getActiveDataSelection().pipe(map((ds) => ds.getProfiles().length)),
    { initialValue: 0 }
  )

  private subscription?: Subscription

  private readonly isLoadingSelectedProfiles = signal(false)

  public readonly canNavigateToDataSelection = computed(() => this.dataSelectionProfileCount() > 0 && !this.isLoadingSelectedProfiles())

  public loadSelectedProfiles(): void {
    const urls = this.selectedProfiles().map((profile: ProfileListEntry) => profile.getUrl())
    this.isLoadingSelectedProfiles.set(true)
    this.subscription = this.loadDataSelectionProfilesService
      .loadProfiles(urls)
      .pipe(finalize(() => this.isLoadingSelectedProfiles.set(false)))
      .subscribe(() => {
        this.selectedProfileService.clearSelection()
        this.snackbarMessageService.displayAddedToDataSelection()
      })
  }

  public navigateToDataSelection(): void {
    this.navigationHelperService.navigateToDataSelectionEditor()
  }
}
