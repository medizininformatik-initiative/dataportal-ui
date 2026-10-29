import { NgClass } from '@angular/common'
import { Component, computed, input, output } from '@angular/core'
import { MatTab, MatTabGroup, MatTabLabel } from '@angular/material/tabs'
import { MatTooltip } from '@angular/material/tooltip'
import { TranslateModule } from '@ngx-translate/core'
import { ListItemDetailsData } from '../../models/ListItemDetails/ListItemDetailsData'
import { ListItemDetailsRelativeData } from '../../models/ListItemDetails/ListItemDetailsRelative'
import { MenuItemInterface } from '../../models/Menu/MenuItemInterface'
import { DisplayTranslationPipe } from '../../pipes/DisplayTranslationPipe'
import { ListItemDetailsGenericSectionsComponent } from './list-item-details-generic-sections/list-item-details-generic-sections.component'

@Component({
  selector: 'num-list-item-details-generic',
  templateUrl: './list-item-details-generic.component.html',
  styleUrls: ['./list-item-details-generic.component.scss'],
  standalone: true,
  imports: [
    MatTabGroup,
    MatTab,
    MatTabLabel,
    NgClass,
    MatTooltip,
    ListItemDetailsGenericSectionsComponent,
    TranslateModule,
    DisplayTranslationPipe,
  ],
})
export class ListItemDetailsGenericComponent {
  public readonly listItemDetails = input.required<ListItemDetailsData>()
  public readonly menuItems = input<MenuItemInterface[]>([])
  public readonly selectedRelative = output<ListItemDetailsRelativeData>()

  public readonly displayFields = computed(() =>
    (this.listItemDetails()?.fields ?? []).map((item) => item.display.getOriginal()).join(', ')
  )

  public readonly translations = computed(() => (this.listItemDetails()?.display?.getTranslations() ?? []).filter((t) => t.getValue()))

  public getSelectedRelative(item: ListItemDetailsRelativeData): void {
    this.selectedRelative.emit(item)
  }
}
