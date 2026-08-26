import { Component, computed, inject, input, output, signal } from '@angular/core'
import { DisplayTranslationPipe } from '../../../pipes/DisplayTranslationPipe'
import { ListItemDetailsRelativeData } from 'src/app/shared/models/ListItemDetails/ListItemDetailsRelative'
import { MatTooltip } from '@angular/material/tooltip'
import { MenuComponent } from '../../shared-components.module'
import { MenuItemInterface } from 'src/app/shared/models/Menu/MenuItemInterface'
import { SearchbarComponent } from '../../search/searchbar.component'
import { TranslateService, TranslateModule, TranslatePipe } from '@ngx-translate/core'
@Component({
  selector: 'num-list-item-details-generic-sections',
  templateUrl: './list-item-details-generic-sections.component.html',
  styleUrls: ['./list-item-details-generic-sections.component.scss'],
  standalone: true,
  imports: [MatTooltip, DisplayTranslationPipe, MenuComponent, SearchbarComponent, TranslateModule],
})
export class ListItemDetailsGenericSectionsComponent {
  private translateService = inject(TranslateService)

  readonly listItemDetails = input.required<ListItemDetailsRelativeData[]>()
  readonly menuItems = input<MenuItemInterface[]>([])
  readonly selectedRelative = output<ListItemDetailsRelativeData>()

  readonly searchText = signal('')

  readonly filteredItems = computed(() => {
    const term = this.searchText().toLowerCase()
    const lang = this.translateService.currentLang
    if (!term) return this.listItemDetails()
    return this.listItemDetails().filter((item) =>
      item.display.translate(lang).toLowerCase().includes(term)
    )
  })

  constructor() {}

  public getSelectedRelative(item: ListItemDetailsRelativeData): void {
    this.selectedRelative.emit(item)
  }
}
