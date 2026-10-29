import { NgClass } from '@angular/common'
import { Component, input, output } from '@angular/core'
import { CheckboxTextCellData } from 'src/app/shared/models/TableData/Cells/Data/CheckboxTextCellData'
import { TableRowData } from 'src/app/shared/models/TableData/TableRowData'
import { TableCellKind } from '../../../models/TableData/Cells/TableCellKind'
import { TableCellUnion } from '../../../models/TableData/Cells/TableCellUnion'
import { AvailabilityCellComponent } from '../cells/availability-cell/availability-cell.component'
import { CheckboxCellComponent } from '../cells/checkbox-cell/checkbox-cell.component'
import { CheckboxTextCellComponent } from '../cells/checkbox-text-cell/checkbox-text-cell.component'
import { DisplayCellComponent } from '../cells/display-cell/display-cell.component'
import { IconCellComponent } from '../cells/icon-cell/icon-cell.component'
import { TextCellComponent } from '../cells/text-cell/text-cell.component'
import { getColumnWidthPercent } from '../table-column-width.util'

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
  public readonly rows = input<TableRowData[]>(undefined)

  public readonly rowClicked = output<TableRowData>()

  public readonly selectedRow = output<TableRowData>()

  public readonly iconClicked = output<TableRowData>()

  public onIconClick(row: TableRowData): void {
    this.iconClicked.emit(row)
  }

  public onRowClick(row: TableRowData): void {
    this.rowClicked.emit(row)
  }

  public getWidth(cells: TableCellUnion[], index: number): number | undefined {
    return getColumnWidthPercent(cells, index)
  }

  public onCheckboxSelect(row: TableRowData): void {
    const checkboxCell = row.cells.find(
      (c: TableCellUnion): c is CheckboxTextCellData => c.type === TableCellKind.CHECKBOX || c.type === TableCellKind.CHECKBOXTEXT
    )
    if (checkboxCell) {
      checkboxCell.isSelected = !checkboxCell.isSelected
    }
    this.selectedRow.emit(row)
  }

  protected readonly TableCellKind = TableCellKind
}
