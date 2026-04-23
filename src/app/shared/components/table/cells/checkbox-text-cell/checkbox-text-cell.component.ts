import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CheckboxTextCellData } from 'src/app/shared/models/TableData/cells/CheckboxTextCellData';

@Component({
  selector: 'num-checkbox-text-cell',
  templateUrl: './checkbox-text-cell.component.html',
  styleUrls: ['./checkbox-text-cell.component.scss'],
})
export class CheckboxTextCellComponent {
  @Input() cell: CheckboxTextCellData;

  @Output() checkboxChange = new EventEmitter<void>();

  onCheckboxClick(event: MouseEvent): void {
    event.stopPropagation();
  }

  onCheckboxChange(): void {
    this.checkboxChange.emit();
  }
}
