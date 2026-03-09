import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CheckboxCellData } from 'src/app/shared/models/TableData/cells/CheckboxCellData';

@Component({
  selector: 'num-checkbox-cell',
  templateUrl: './checkbox-cell.component.html',
  styleUrls: ['./checkbox-cell.component.scss'],
})
export class CheckboxCellComponent {
  @Input() cell: CheckboxCellData;

  @Output() checkboxChange = new EventEmitter<void>();

  onCheckboxClick(event: MouseEvent): void {
    event.stopPropagation();
  }

  onCheckboxChange(): void {
    this.checkboxChange.emit();
  }
}
