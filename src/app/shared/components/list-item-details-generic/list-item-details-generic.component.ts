import { Component, effect, input, output } from '@angular/core'
import {
  ListItemDetailsData,
  ListItemDetailsRelative,
} from '../list-item-details/ListItemDetailsData'
import { ListItemDetailsGenericSectionsComponent } from './list-item-details-generic-sections/list-item-details-generic-sections.component'
import { MatTab, MatTabGroup, MatTabLabel } from '@angular/material/tabs'
import { MatTooltip } from '@angular/material/tooltip'
import { JsonPipe, NgClass } from '@angular/common'
import { TranslateModule } from '@ngx-translate/core'
import { DisplayTranslationPipe } from '../../pipes/DisplayTranslationPipe'

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
    JsonPipe,
  ],
})
export class ListItemDetailsGenericComponent {
  readonly listItemDetails = input.required<ListItemDetailsData>()
  readonly selectedRelative = output<ListItemDetailsRelative>()
  constructor() {
    effect(() => {
      const details = this.listItemDetails()

      console.log('details', details)
      console.log('parents', details?.parents[0].display)
      console.log('parents length', details?.parents?.length)
    })
  }
  getSelectedRelative(item: ListItemDetailsRelative): void {
    this.selectedRelative.emit(item)
  }
}
