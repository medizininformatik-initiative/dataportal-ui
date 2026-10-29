import { Component, input, output } from '@angular/core'
import { InfiniteScrollDirective } from 'ngx-infinite-scroll'
import { CheckboxTextCellData } from 'src/app/shared/models/TableData/Cells/Data/CheckboxTextCellData'
import { TableData } from 'src/app/shared/models/TableData/TableData'
import { TableCellKind } from '../../models/TableData/Cells/TableCellKind'
import { TableRowData } from '../../models/TableData/TableRowData'
import { TableBodyComponent } from './table-body/table-body.component'
import { TableHeaderComponent } from './table-header/table-header.component'

@Component({
  selector: 'num-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.scss'],
  standalone: true,
  imports: [TableHeaderComponent, TableBodyComponent, InfiniteScrollDirective],
})
export class TableComponent {
  public readonly tableData = input.required<TableData>()

  public readonly selectedRow = output<TableRowData>()
  public readonly rowClicked = output<TableRowData>()
  public readonly iconClicked = output<TableRowData>()
  public readonly selectAll = output<boolean>()
  public readonly triggerSelectAll = input<{ id: number; value: boolean }>()

  // Body scrolls internally (see table.component.scss), so infinite scroll
  // must watch the tbody element itself rather than an ancestor container.
  public readonly infiniteScrollDistance = input(0.5)
  public readonly infiniteScrollThrottle = input(50)
  public readonly loadMore = output<void>()

  public unselectCheckbox(ids: string[]): void {
    ids.forEach((id) => {
      const foundRow = this.tableData().body?.rows?.find((row) => row.id === id)
      if (foundRow) {
        const checkboxCell = foundRow.cells.find((c): c is CheckboxTextCellData => c.type === TableCellKind.CHECKBOXTEXT)
        if (checkboxCell) {
          checkboxCell.isSelected = false
        }
      }
    })
  }
}
