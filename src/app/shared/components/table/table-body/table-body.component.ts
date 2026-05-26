/* eslint-disable @angular-eslint/component-selector */
import { CheckboxTextCellData } from 'src/app/shared/models/TableData/cells/CheckboxTextCellData'
import { Component, EventEmitter, Input, Output } from '@angular/core'
import { TableRowData } from 'src/app/shared/models/TableData/TableRowData'
import { NgClass } from '@angular/common'
import { CheckboxTextCellComponent } from '../cells/checkbox-text-cell/checkbox-text-cell.component'
import { AvailabilityCellComponent } from '../cells/availability-cell/availability-cell.component'
import { DisplayCellComponent } from '../cells/display-cell/display-cell.component'
import { IconCellComponent } from '../cells/icon-cell/icon-cell.component'
import { TextCellComponent } from '../cells/text-cell/text-cell.component'

@Component({
  selector: '[num-table-body]',
  templateUrl: './table-body.component.html',
  styleUrls: ['./table-body.component.scss'],
  standalone: true,
  imports: [
    NgClass,
    CheckboxTextCellComponent,
    AvailabilityCellComponent,
    DisplayCellComponent,
    IconCellComponent,
    TextCellComponent,
  ],
})
export class TableBodyComponent {
  @Input() rows: TableRowData[]

  @Output()
  rowClicked = new EventEmitter<TableRowData>()

  @Output()
  selectedRow = new EventEmitter<TableRowData>()

  @Output()
  iconClicked = new EventEmitter<TableRowData>()

  public onIconClick(row: TableRowData): void {
    this.iconClicked.emit(row)
  }

  public onRowClick(row: TableRowData): void {
    this.rowClicked.emit(row)
  }

  public onCheckboxSelect(row: TableRowData): void {
    const checkboxCell = row.cells.find((c): c is CheckboxTextCellData => c.type === 'checkboxText')
    if (checkboxCell) {
      checkboxCell.isSelected = !checkboxCell.isSelected
    }
    this.selectedRow.emit(row)
  }
}
