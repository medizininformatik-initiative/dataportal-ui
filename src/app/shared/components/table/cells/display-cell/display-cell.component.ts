import { Component, Input } from '@angular/core';
import { DisplayCellData } from 'src/app/shared/models/TableData/cells/DisplayCellData';

@Component({
  selector: 'num-display-cell',
  templateUrl: './display-cell.component.html',
  styleUrls: ['./display-cell.component.scss'],
})
export class DisplayCellComponent {
  @Input() cell: DisplayCellData;
}
