import { Component, Input } from '@angular/core';
import { TextCellData } from 'src/app/shared/models/TableData/cells/TextCellData';

@Component({
  selector: 'num-text-cell',
  templateUrl: './text-cell.component.html',
  styleUrls: ['./text-cell.component.scss'],
})
export class TextCellComponent {
  @Input() cell: TextCellData;
}
