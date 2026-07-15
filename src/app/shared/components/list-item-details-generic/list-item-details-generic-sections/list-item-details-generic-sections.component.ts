import { Component, input, output } from '@angular/core'
import { ListItemDetailsRelative } from '../../list-item-details/ListItemDetailsData'
import { DisplayTranslationPipe } from '../../../pipes/DisplayTranslationPipe'
import { MatTooltip } from '@angular/material/tooltip'

@Component({
  selector: 'num-list-item-details-generic-sections',
  templateUrl: './list-item-details-generic-sections.component.html',
  styleUrls: ['./list-item-details-generic-sections.component.scss'],
  standalone: true,
  imports: [MatTooltip, DisplayTranslationPipe],
})
export class ListItemDetailsGenericSectionsComponent {
  readonly listItemDetails = input.required<ListItemDetailsRelative[]>()
  readonly selectedRelative = output<ListItemDetailsRelative>()

  getSelectedRelative(item: ListItemDetailsRelative): void {
    this.selectedRelative.emit(item)
  }
}
