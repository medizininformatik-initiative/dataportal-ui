import { AvailabilityCellComponent } from '../cells/availability-cell/availability-cell.component'
import { CheckboxTextCellComponent } from '../cells/checkbox-text-cell/checkbox-text-cell.component'
import { CheckboxTextCellData } from 'src/app/shared/models/TableData/cells/CheckboxTextCellData'
import { Component, input, output } from '@angular/core'
import { DisplayCellComponent } from '../cells/display-cell/display-cell.component'
import { IconCellComponent } from '../cells/icon-cell/icon-cell.component'
import { NgClass } from '@angular/common'
import { TableRowData } from 'src/app/shared/models/TableData/TableRowData'
import { TextCellComponent } from '../cells/text-cell/text-cell.component'
import { CheckboxCellComponent } from '../../shared-components.module'
import { TableCellDataTypes } from '../../../models/TableData/cells/TableCellType'

/* eslint-disable @angular-eslint/component-selector */

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
    CheckboxCellComponent,
  ],
})
export class TableBodyComponent {
  readonly rows = input<TableRowData[]>(undefined)

  readonly rowClicked = output<TableRowData>()

  readonly selectedRow = output<TableRowData>()

  readonly iconClicked = output<TableRowData>()

  public onIconClick(row: TableRowData): void {
    this.iconClicked.emit(row)
  }

  public onRowClick(row: TableRowData): void {
    this.rowClicked.emit(row)
  }

  public onCheckboxSelect(row: TableRowData): void {
    const checkboxCell = row.cells.find(
      (c): c is CheckboxTextCellData =>
        c.type === TableCellDataTypes.CHECKBOX || c.type === TableCellDataTypes.CHECKBOXTEXT
    )
    if (checkboxCell) {
      checkboxCell.isSelected = !checkboxCell.isSelected
    }
    this.selectedRow.emit(row)
  }

  protected readonly TableCellDataTypes = TableCellDataTypes
}
