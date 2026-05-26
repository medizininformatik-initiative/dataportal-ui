/* eslint-disable @angular-eslint/component-selector */
import { Component, Input } from '@angular/core'
import { TableData } from '../../../models/TableData/TableData'
import { TranslateModule } from '@ngx-translate/core'

@Component({
  selector: '[num-table-header]',
  templateUrl: './table-header.component.html',
  styleUrls: ['./table-header.component.scss'],
  standalone: true,
  imports: [TranslateModule],
})
export class TableHeaderComponent {
  @Input() tableData: TableData

  public getWidth(index: number): number {
    const cellType = this.tableData?.body?.rows[0]?.cells[index]?.type
    const iconOrCheckbox = this.tableData?.body?.rows[0]?.cells?.filter(
      (cell) => cell.type === 'icon' || cell.type === 'checkbox'
    ).length
    const iconOrCheckboxWidth = 2

    switch (cellType) {
      case 'icon':
      case 'checkbox':
        return iconOrCheckboxWidth
      case 'text':
      case 'display':
      case 'checkboxText':
      case 'availability':
        return (
          (100 - iconOrCheckbox * iconOrCheckboxWidth) /
          (this.tableData?.body?.rows[0]?.cells?.length - iconOrCheckbox)
        )
    }
  }
}
