/* eslint-disable @angular-eslint/component-selector */
import { Component, effect, input, output } from '@angular/core'
import { MatTooltip } from '@angular/material/tooltip'
import { TranslateModule } from '@ngx-translate/core'
import { TableData } from '../../../models/TableData/TableData'
import { CheckboxComponent } from '../../checkbox/checkbox.component'
import { getColumnWidthPercent } from '../table-column-width.util'

@Component({
  selector: '[num-table-header]',
  templateUrl: './table-header.component.html',
  styleUrls: ['./table-header.component.scss'],
  standalone: true,
  imports: [TranslateModule, CheckboxComponent, MatTooltip],
})
export class TableHeaderComponent {
  public readonly tableData = input<TableData>(undefined)
  public readonly selectAll = output<boolean>()
  public readonly triggerSelectAll = input<{ id: number; value: boolean }>()

  public checkBoxAll: boolean = false

  constructor() {
    effect(() => {
      if (!this.triggerSelectAll()) {
        return
      }
      this.checkBoxAll = this.triggerSelectAll().value
    })
  }

  public getWidth(index: number): number | undefined {
    return getColumnWidthPercent(this.tableData()?.body?.rows[0]?.cells, index)
  }
  public onCheckboxAllChange(): void {
    this.checkBoxAll = !this.checkBoxAll
    this.selectAll.emit(this.checkBoxAll)
  }
}
