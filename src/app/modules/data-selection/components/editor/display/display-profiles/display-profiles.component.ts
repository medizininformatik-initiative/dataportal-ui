import { DataSelectionBoxesComponent } from '../data-selection-boxes/data-selection-boxes.component'
import { ProfileProviderService } from 'src/app/service/Provider/ProfileProvider.service'
import { SearchbarComponent } from 'src/app/shared/components/search/searchbar.component'
import { TranslateService } from '@ngx-translate/core'
import {
  afterNextRender,
  Component,
  computed,
  ElementRef,
  inject,
  Injector,
  input,
  QueryList,
  signal,
  ViewChildren,
} from '@angular/core'
import { DataSelectionProviderService } from 'src/app/service/Provider/DataSelectionProvider.service'
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
  private translateService = inject(TranslateService)
  private readonly dataSelectionProvider = inject(DataSelectionProviderService)
  private readonly injector = inject(Injector)

  readonly isEditable = input<boolean | undefined>(undefined)

  @ViewChildren('profileBox') private boxRefs!: QueryList<ElementRef<HTMLElement>>

  private readonly activeDataSelection = toSignal(
    this.dataSelectionProvider.getActiveDataSelection(),
    {
      initialValue: null,
    }
  )

  readonly profiles = computed(() => {
    const dataSelection = this.activeDataSelection()
    if (!dataSelection?.getProfiles()) return []
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
  public handleMoveUp(profileId: string): void {
    this.flipAndReorder('up', profileId)
  }

  public handleMoveDown(profileId: string): void {
    this.flipAndReorder('down', profileId)
  }

  private flipAndReorder(direction: 'up' | 'down', profileId: string): void {
    const profiles = this.profiles()
    const visibleProfiles = this.filteredProfiles()
    const idx = profiles.findIndex((p) => p.getId() === profileId)
    if (direction === 'up' ? idx <= 1 : idx < 0 || idx >= profiles.length - 1) return

    // Capture old top positions using visible (filtered) profiles since boxRefs reflects them
    const oldTops = new Map<string, number>()
    this.boxRefs.forEach((ref, i) => {
      if (i < visibleProfiles.length) {
        oldTops.set(visibleProfiles[i].getId(), ref.nativeElement.getBoundingClientRect().top)
      }
    })

    // Commit reorder
    const newOrder = [...profiles]
    if (direction === 'up') {
      [newOrder[idx - 1], newOrder[idx]] = [newOrder[idx], newOrder[idx - 1]]
    } else {
      [newOrder[idx], newOrder[idx + 1]] = [newOrder[idx + 1], newOrder[idx]]
    }
    this.dataSelectionProvider.reorderProfiles(newOrder)

    // After Angular re-renders the new order, apply FLIP transforms
    afterNextRender(
      () => {
        const newVisibleProfiles = this.filteredProfiles()
        this.boxRefs.forEach((ref, i) => {
          if (i >= newVisibleProfiles.length) return
          const el = ref.nativeElement
          const oldTop = oldTops.get(newVisibleProfiles[i].getId())
          if (oldTop === undefined) return
          const delta = oldTop - el.getBoundingClientRect().top
          if (delta === 0) return
          el.style.transition = 'none'
          el.style.transform = `translateY(${delta}px)`
          void el.offsetHeight // force reflow so transform is applied instantly
          el.style.transition = 'transform 220ms cubic-bezier(0.4, 0, 0.2, 1)'
          el.style.transform = ''
        })
      },
      { injector: this.injector }
    )
  }
}
