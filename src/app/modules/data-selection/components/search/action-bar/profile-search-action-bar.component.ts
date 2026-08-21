import { ActionBarComponent } from '../../../../../shared/components/action-bar/action-bar.component'
import { ButtonComponent } from '../../../../../shared/components/button/button.component'
import { Component, computed, inject } from '@angular/core'
import { DataSelectionProviderService } from '../../../../../service/Provider/DataSelectionProvider.service'
import { LoadDataSelectionProfilesService } from 'src/app/service/DataSelection/LoadDataSelectionProfiles.service'
import { map } from 'rxjs'
import { MatBadge } from '@angular/material/badge'
import { MatTooltip } from '@angular/material/tooltip'
import { NavigationHelperService } from 'src/app/service/NavigationHelper.service'
import { SelectedProfileService } from 'src/app/service/DataSelection/Selection/SelectedProfileEntry.service'
import { SnackbarMessageService } from 'src/app/service/SnackbarMessage.service'
import { Subscription } from 'rxjs'
import { toSignal } from '@angular/core/rxjs-interop'
import { TranslateModule } from '@ngx-translate/core'

@Component({
  selector: 'num-profile-search-action-bar',
  templateUrl: './profile-search-action-bar.component.html',
  standalone: true,
  imports: [ActionBarComponent, ButtonComponent, MatBadge, MatTooltip, TranslateModule],
})
export class ProfileSearchActionBarComponent {
  private selectedProfileService = inject(SelectedProfileService)
  private dataSelectionProviderService = inject(DataSelectionProviderService)
  private loadDataSelectionProfilesService = inject(LoadDataSelectionProfilesService)
  private snackbarMessageService = inject(SnackbarMessageService)
  private navigationHelperService = inject(NavigationHelperService)

  private readonly selectedProfiles = this.selectedProfileService.getSelectedProfiles()
  readonly profileEntryCount = computed(() => this.selectedProfiles().length)

  public readonly dataSelectionProfileCount = toSignal(
    this.dataSelectionProviderService
      .getActiveDataSelection()
      .pipe(map((ds) => ds.getProfiles().length)),
    { initialValue: 0 }
  )

  private subscription?: Subscription

  public loadSelectedProfiles(): void {
    const urls = this.selectedProfiles().map((profile) => profile.getUrl())
    this.subscription = this.loadDataSelectionProfilesService.loadProfiles(urls).subscribe(() => {
      this.selectedProfileService.clearSelection()
      this.snackbarMessageService.displayAddedToDataSelection()
    })
  }

  public navigateToDataSelection(): void {
    this.navigationHelperService.navigateToDataSelectionEditor()
  }
}
