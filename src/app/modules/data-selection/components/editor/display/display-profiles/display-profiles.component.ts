import { Component, computed, inject, input } from '@angular/core'
import { DataSelectionBoxesComponent } from '../data-selection-boxes/data-selection-boxes.component'
import { DataSelectionProviderService } from 'src/app/service/Provider/DataSelectionProvider.service'
import { ProfileProviderService } from 'src/app/service/Provider/ProfileProvider.service'
import { toSignal } from '@angular/core/rxjs-interop'

@Component({
  selector: 'num-display-profiles',
  templateUrl: './display-profiles.component.html',
  styleUrls: ['./display-profiles.component.scss'],
  standalone: true,
  imports: [DataSelectionBoxesComponent],
})
export class DisplayProfilesComponent {
  private profileProvider = inject(ProfileProviderService)
  private dataSelectionProvider = inject(DataSelectionProviderService)

  readonly isEditable = input<boolean>(undefined)

  readonly activeDataSelection = toSignal(this.dataSelectionProvider.getActiveDataSelection(), {
    initialValue: null,
  })

  readonly profiles = computed(() => {
    const dataSelection = this.activeDataSelection()

    if (!dataSelection?.getProfiles()) {
      return []
    }
    return dataSelection.getProfiles()
  })
}
