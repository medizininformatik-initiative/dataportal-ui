import { Component, Input } from '@angular/core';
import { AvailabilityCellData } from 'src/app/shared/models/TableData/cells/AvailabilityCellData';

@Component({
  selector: 'num-availability-cell',
  templateUrl: './availability-cell.component.html',
  styleUrls: ['./availability-cell.component.scss'],
})
export class AvailabilityCellComponent {
  @Input() cell: AvailabilityCellData;
}
