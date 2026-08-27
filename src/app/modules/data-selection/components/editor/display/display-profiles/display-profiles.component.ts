import { Component, computed, inject, input, signal } from '@angular/core'
import { DataSelectionBoxesComponent } from '../data-selection-boxes/data-selection-boxes.component'
import { DataSelectionProviderService } from 'src/app/service/Provider/DataSelectionProvider.service'
import { ProfileProviderService } from 'src/app/service/Provider/ProfileProvider.service'
import { SearchbarComponent } from 'src/app/shared/components/search/searchbar.component'
import { TranslateService } from '@ngx-translate/core'
import { toSignal } from '@angular/core/rxjs-interop'

@Component({
  selector: 'num-display-profiles',
  templateUrl: './display-profiles.component.html',
  styleUrls: ['./display-profiles.component.scss'],
  standalone: true,
  imports: [DataSelectionBoxesComponent, SearchbarComponent],
})
export class DisplayProfilesComponent {
  private profileProvider = inject(ProfileProviderService)
  private dataSelectionProvider = inject(DataSelectionProviderService)
  private translateService = inject(TranslateService)

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

  readonly searchText = signal('')

  readonly filteredProfiles = computed(() => {
    const term = this.searchText().toLowerCase()
    const lang = this.translateService.currentLang
    if (!term) return this.profiles()
    return this.profiles().filter((profile) => {
      const nameMatch = profile.getDisplay().translate(lang).toLowerCase().includes(term)
      if (nameMatch) return true
      return profile
        .getProfileFields()
        .getSelectedBasicFields()
        .some((f) => f.getDisplay().translate(lang).toLowerCase().includes(term))
    })
  })

  readonly matchedFields = computed(() => {
    const term = this.searchText().toLowerCase()
    const lang = this.translateService.currentLang
    const map = new Map<string, string[]>()
    if (!term) return map
    for (const profile of this.profiles()) {
      const fields = profile
        .getProfileFields()
        .getSelectedBasicFields()
        .filter((f) => f.getDisplay().translate(lang).toLowerCase().includes(term))
        .map((f) => f.getDisplay().translate(lang))
      if (fields.length) map.set(profile.getId(), fields)
    }
    return map
  })

  readonly matchSummary = computed(() => {
    const term = this.searchText().toLowerCase()
    const lang = this.translateService.currentLang
    let byName = 0
    let byField = 0
    for (const profile of this.filteredProfiles()) {
      const nameMatch = profile.getDisplay().translate(lang).toLowerCase().includes(term)
      const fieldMatch = profile
        .getProfileFields()
        .getSelectedBasicFields()
        .some((f) => f.getDisplay().translate(lang).toLowerCase().includes(term))
      if (nameMatch) byName++
      else if (fieldMatch) byField++
    }
    return { byName, byField }
  })
}
