/* eslint-disable @angular-eslint/component-selector */
import { Component, effect, input, output } from '@angular/core'
import { TableData } from '../../../models/TableData/TableData'
import { TranslateModule } from '@ngx-translate/core'
import { CheckboxComponent } from '../../checkbox/checkbox.component'
import { MatTooltip } from '@angular/material/tooltip'
import { getColumnWidth } from '../table-column-width.util'

@Component({
  selector: '[num-table-header]',
  templateUrl: './table-header.component.html',
  styleUrls: ['./table-header.component.scss'],
  standalone: true,
  imports: [TranslateModule, CheckboxComponent, MatTooltip],
})
export class TableHeaderComponent {
  readonly tableData = input<TableData>(undefined)
  readonly selectAll = output<boolean>()
  readonly triggerSelectAll = input<{ id: number; value: boolean }>()

  checkBoxAll: boolean = false

  constructor() {
    effect(() => {
      if (!this.triggerSelectAll()) {
        return
      }
      this.checkBoxAll = this.triggerSelectAll().value
    })
  }

  public getWidth(index: number): string | undefined {
    return getColumnWidth(this.tableData()?.body?.rows[0]?.cells, index)
  }
  public onCheckboxAllChange(): void {
    this.checkBoxAll = !this.checkBoxAll
    this.selectAll.emit(this.checkBoxAll)
  }
}
