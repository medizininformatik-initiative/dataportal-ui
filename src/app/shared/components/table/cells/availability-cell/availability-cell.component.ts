import { Component, input } from '@angular/core'
import { AvailabilityCellData } from 'src/app/shared/models/TableData/cells/AvailabilityCellData'
import { AvailabilityStatusBarComponent } from '../../../availability-status-bar/availability-status-bar.component'

@Component({
  selector: 'num-availability-cell',
  templateUrl: './availability-cell.component.html',
  styleUrls: ['./availability-cell.component.scss'],
  standalone: true,
  imports: [AvailabilityStatusBarComponent],
})
export class AvailabilityCellComponent {
  readonly cell = input<AvailabilityCellData>(undefined)
}
