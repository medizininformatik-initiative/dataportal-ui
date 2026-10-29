import { Component, computed, inject, input, output } from '@angular/core'
import { toSignal } from '@angular/core/rxjs-interop'
import { MatTab, MatTabChangeEvent, MatTabGroup } from '@angular/material/tabs'
import { TranslateModule } from '@ngx-translate/core'
import { CriteriaBulkEntry } from 'src/app/model/Search/ListEntries/CriteriaBulkEntry'
import { CriteriaBulkResultList } from 'src/app/model/Search/ResultList/CriteriaBulkResultList'
import { SelectedBulkCriteriaProvider } from 'src/app/service/SelectedBulkCriteria.service'
import { CriteriaBulkFoundListEntryAdapter } from 'src/app/shared/models/TableData/Adapter/CriteriaBulkFoundListEntryAdapter'
import { CriteriaBulkNotFoundListEntryAdapter } from 'src/app/shared/models/TableData/Adapter/CriteriaBulkNotFoundListEntryAdapter'
import { CheckboxTextCellData } from 'src/app/shared/models/TableData/Cells/Data/CheckboxTextCellData'
import { TableData } from 'src/app/shared/models/TableData/TableData'
import { TableRowData } from 'src/app/shared/models/TableData/TableRowData'
import { PlaceholderBoxComponent } from '../../../../../../shared/components/placeholder-box/placeholder-box.component'
import { TableComponent } from '../../../../../../shared/components/table/table.component'
import { TableCellKind } from '../../../../../../shared/models/TableData/Cells/TableCellKind'

export type SelectedTab = 'FOUND' | 'NOTFOUND'

@Component({
  selector: 'num-bulk-search-results',
  templateUrl: './bulk-search-results.component.html',
  styleUrls: ['./bulk-search-results.component.scss'],
  standalone: true,
  imports: [MatTabGroup, MatTab, TableComponent, PlaceholderBoxComponent, TranslateModule],
})
export class BulkSearchResultsComponent {
  private readonly selectedBulkCriteriaService = inject(SelectedBulkCriteriaProvider)

  public readonly result = input<CriteriaBulkResultList | null>(null)

  public readonly selectedEntries = toSignal(this.selectedBulkCriteriaService.getSelected(), {
    initialValue: [] as CriteriaBulkEntry[],
  })

  public readonly foundCount = computed(() => this.result()?.getFound().length ?? 0)
  public readonly notFoundCount = computed(() => this.result()?.getNotFound().length ?? 0)
  public readonly hasResults = computed(() => this.foundCount() > 0 || this.notFoundCount() > 0)

  public readonly foundCriteriaTableData = computed<TableData | null>(() => {
    const result = this.result()
    if (!result) {
      return null
    }
    const selected = this.selectedEntries()
    const selectedIds = new Set(selected.map((item: CriteriaBulkEntry) => item.getId()))
    const tableData = new CriteriaBulkFoundListEntryAdapter().adapt(result.getFound())
    tableData.body?.rows?.forEach((row: TableRowData) => {
      const checkboxCell = row.cells.find((c): c is CheckboxTextCellData => c.type === TableCellKind.CHECKBOXTEXT)
      if (checkboxCell) {
        const entryId = (row.originalEntry as CriteriaBulkEntry).getId()
        checkboxCell.isSelected = selectedIds.has(entryId)
      }
    })
    return tableData
  })

  public readonly notFoundCriteriaTableData = computed<TableData | null>(() => {
    const result = this.result()
    if (!result) {
      return null
    }
    return new CriteriaBulkNotFoundListEntryAdapter().adapt(result.getNotFound())
  })

  public readonly tabChanged = output<SelectedTab>()

  public onTabChange(event: MatTabChangeEvent): void {
    this.tabChanged.emit(event.index === 0 ? 'FOUND' : 'NOTFOUND')
  }

  public setSelectedRowItem(item: TableRowData): void {
    const criteriaBulkEntry = item.originalEntry as CriteriaBulkEntry
    this.selectedBulkCriteriaService.toggle(criteriaBulkEntry)
  }
}
