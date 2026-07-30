import { CheckboxTextCellData } from 'src/app/shared/models/TableData/Cells/Data/CheckboxTextCellData'
import { Component, input, output } from '@angular/core'
import { TableBodyComponent } from './table-body/table-body.component'
import { TableCellKind } from '../../models/TableData/Cells/TableCellKind'
import { TableData } from 'src/app/shared/models/TableData/TableData'
import { TableHeaderComponent } from './table-header/table-header.component'
import { TableRowData } from '../../models/TableData/TableRowData'

@Component({
  selector: 'num-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.scss'],
  standalone: true,
  imports: [TableHeaderComponent, TableBodyComponent],
})
export class TableComponent {
  readonly tableData = input.required<TableData>()

  readonly selectedRow = output<TableRowData>()
  readonly rowClicked = output<TableRowData>()
  readonly iconClicked = output<TableRowData>()

  public unselectCheckbox(ids: string[]): void {
    ids.forEach((id) => {
      const foundRow = this.tableData().body?.rows?.find((row) => row.id === id)
      if (foundRow) {
        const checkboxCell = foundRow.cells.find(
          (c): c is CheckboxTextCellData => c.type === TableCellKind.CHECKBOXTEXT
        )
        if (checkboxCell) {
          checkboxCell.isSelected = false
        }
      }
    })
  }
}
