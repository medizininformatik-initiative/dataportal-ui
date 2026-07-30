/* eslint-disable @angular-eslint/component-selector */
import { Component, input } from '@angular/core'
import { TableData } from '../../../models/TableData/TableData'
import { TranslateModule } from '@ngx-translate/core'
import { TableCellKind } from '../../../models/TableData/Cells/TableCellKind'

@Component({
  selector: '[num-table-header]',
  templateUrl: './table-header.component.html',
  styleUrls: ['./table-header.component.scss'],
  standalone: true,
  imports: [TranslateModule],
})
export class TableHeaderComponent {
  readonly tableData = input<TableData>(undefined)

  public getWidth(index: number): number {
    const cellType = this.tableData()?.body?.rows[0]?.cells[index]?.type
    const tableData = this.tableData()
    const iconOrCheckbox = tableData?.body?.rows[0]?.cells?.filter(
      (cell) => cell.type === 'icon' || cell.type === 'checkbox'
    ).length
    const iconOrCheckboxWidth = 2

    switch (cellType) {
      case TableCellKind.ICON:
      case TableCellKind.CHECKBOX:
        return iconOrCheckboxWidth
      case TableCellKind.TEXT:
      case TableCellKind.DISPLAY:
      case TableCellKind.CHECKBOXTEXT:
      case TableCellKind.AVAILABILITY:
        return (
          (100 - iconOrCheckbox * iconOrCheckboxWidth) /
          (tableData?.body?.rows[0]?.cells?.length - iconOrCheckbox)
        )
    }
  }
}
