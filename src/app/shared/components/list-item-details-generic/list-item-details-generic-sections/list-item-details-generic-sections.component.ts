import { Component, input, output } from '@angular/core'
import { DisplayTranslationPipe } from '../../../pipes/DisplayTranslationPipe'
import { ListItemDetailsRelativeData } from 'src/app/shared/models/ListItemDetails/ListItemDetailsRelative'
import { MatTooltip } from '@angular/material/tooltip'
import { MenuComponent } from '../../shared-components.module'
import { MenuItemInterface } from 'src/app/shared/models/Menu/MenuItemInterface'
@Component({
  selector: 'num-list-item-details-generic-sections',
  templateUrl: './list-item-details-generic-sections.component.html',
  styleUrls: ['./list-item-details-generic-sections.component.scss'],
  standalone: true,
  imports: [MatTooltip, DisplayTranslationPipe, MenuComponent],
})
export class ListItemDetailsGenericSectionsComponent {
  readonly listItemDetails = input.required<ListItemDetailsRelativeData[]>()
  readonly menuItems = input<MenuItemInterface[]>([])
  readonly selectedRelative = output<ListItemDetailsRelativeData>()

  constructor() {}

  public getSelectedRelative(item: ListItemDetailsRelativeData): void {
    this.selectedRelative.emit(item)
  }
}
