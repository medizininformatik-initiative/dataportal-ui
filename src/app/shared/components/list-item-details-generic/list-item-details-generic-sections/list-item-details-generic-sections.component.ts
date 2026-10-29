import { Component, computed, inject, input, output, signal } from '@angular/core'
import { MatTooltip } from '@angular/material/tooltip'
import { TranslateService, TranslateModule } from '@ngx-translate/core'
import { ListItemDetailsRelativeData } from 'src/app/shared/models/ListItemDetails/ListItemDetailsRelative'
import { MenuItemInterface } from 'src/app/shared/models/Menu/MenuItemInterface'
import { DisplayTranslationPipe } from '../../../pipes/DisplayTranslationPipe'
import { MenuComponent } from '../../menu/menu.component'
import { SearchbarComponent } from '../../search/searchbar.component'
@Component({
  selector: 'num-list-item-details-generic-sections',
  templateUrl: './list-item-details-generic-sections.component.html',
  styleUrls: ['./list-item-details-generic-sections.component.scss'],
  standalone: true,
  imports: [MatTooltip, DisplayTranslationPipe, MenuComponent, SearchbarComponent, TranslateModule],
})
export class ListItemDetailsGenericSectionsComponent {
  private readonly translateService = inject(TranslateService)

  public readonly listItemDetails = input.required<ListItemDetailsRelativeData[]>()
  public readonly menuItems = input<MenuItemInterface[]>([])
  public readonly selectedRelative = output<ListItemDetailsRelativeData>()
  public readonly showSearch = input(false)

  public readonly searchText = signal('')

  public readonly filteredItems = computed(() => {
    const term = this.searchText().toLowerCase()
    const lang = this.translateService.currentLang
    if (!term) {
      return this.listItemDetails()
    }
    return this.listItemDetails().filter((item: ListItemDetailsRelativeData) => item.display.translate(lang).toLowerCase().includes(term))
  })

  constructor() {}

  public getSelectedRelative(item: ListItemDetailsRelativeData): void {
    this.selectedRelative.emit(item)
  }
}
