import { Component, computed, effect, inject, input, viewChild } from '@angular/core'
import { CriteriaListEntry } from '../../../model/Search/ListEntries/CriteriaListListEntry'
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome'
import { ListItemDetailsComponent } from '../shared-components.module'
import { MatDrawer, MatDrawerContainer, MatDrawerContent } from '@angular/material/sidenav'
import { SelectedTableItemsProvider } from 'src/app/service/Provider/SelectedTableItemsProvider.service'
import { toSignal } from '@angular/core/rxjs-interop'

@Component({
  selector: 'num-search-result',
  templateUrl: './search-result.component.html',
  styleUrls: ['./search-result.component.scss'],
  standalone: true,
  imports: [
    MatDrawerContainer,
    MatDrawer,
    FontAwesomeModule,
    ListItemDetailsComponent,
    MatDrawerContent,
  ],
})
export class SearchResultComponent {
  private listItemService = inject<SelectedTableItemsProvider<CriteriaListEntry>>(
    SelectedTableItemsProvider
  )

  readonly searchTermListItems = input<CriteriaListEntry[]>([])
  readonly keysToSkip = input<string[]>([])

  readonly data = toSignal(this.listItemService.getActiveItem(), { initialValue: null })
  readonly isOpen = computed(() => !!this.data())

  private readonly sidenav = viewChild<MatDrawer>('drawer')

  constructor() {
    effect(() => {
      const drawer = this.sidenav()
      if (!drawer) {
        return
      }
      if (this.data()) {
        drawer.open()
      } else {
        drawer.close()
      }
    })
  }
}
