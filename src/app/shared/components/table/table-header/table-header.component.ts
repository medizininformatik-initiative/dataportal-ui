/* eslint-disable @angular-eslint/component-selector */
import { Component, effect, input, output } from '@angular/core'
import { TableData } from '../../../models/TableData/TableData'
import { TranslateModule } from '@ngx-translate/core'
import { TableCellKind } from '../../../models/TableData/Cells/TableCellKind'
import { CheckboxComponent } from '../../checkbox/checkbox.component'

@Component({
  selector: '[num-table-header]',
  templateUrl: './table-header.component.html',
  styleUrls: ['./table-header.component.scss'],
  standalone: true,
  imports: [TranslateModule, CheckboxComponent],
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
  public onCheckboxAllChange(): void {
    this.checkBoxAll = !this.checkBoxAll
    this.selectAll.emit(this.checkBoxAll)
  }
}
