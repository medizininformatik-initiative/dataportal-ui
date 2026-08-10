import { Component, input, OnInit, output } from '@angular/core'
import { DisplayTranslationPipe } from '../../pipes/DisplayTranslationPipe'
import { ListItemDetailsData } from '../../models/ListItemDetails/ListItemDetailsData'
import { ListItemDetailsGenericSectionsComponent } from './list-item-details-generic-sections/list-item-details-generic-sections.component'
import { ListItemDetailsRelativeData } from '../../models/ListItemDetails/ListItemDetailsRelative'
import { MatTab, MatTabGroup, MatTabLabel } from '@angular/material/tabs'
import { MatTooltip } from '@angular/material/tooltip'
import { NgClass } from '@angular/common'
import { TranslateModule } from '@ngx-translate/core'
import { MenuItemInterface } from '../../models/Menu/MenuItemInterface'

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
export class ListItemDetailsGenericComponent implements OnInit {
  readonly listItemDetails = input.required<ListItemDetailsData>()
  readonly menuItems = input<MenuItemInterface[]>([])
  readonly selectedRelative = output<ListItemDetailsRelativeData>()

  displayFields = []
  ngOnInit() {
    this.displayFields = this.listItemDetails().fields.map(
      (item) => ' ' + item.display.getOriginal()
    )
  }

  public getSelectedRelative(item: ListItemDetailsRelativeData): void {
    this.selectedRelative.emit(item)
  }
}
