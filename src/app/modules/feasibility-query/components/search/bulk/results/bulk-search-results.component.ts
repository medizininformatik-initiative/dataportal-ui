import { Component, computed, inject, input, output } from '@angular/core'
import { MatTab, MatTabChangeEvent, MatTabGroup } from '@angular/material/tabs'
import { TranslateModule } from '@ngx-translate/core'
import { toSignal } from '@angular/core/rxjs-interop'
import { CheckboxTextCellData } from 'src/app/shared/models/TableData/cells/CheckboxTextCellData'
import { CriteriaBulkEntry } from 'src/app/model/Search/ListEntries/CriteriaBulkEntry'
import { CriteriaBulkFoundListEntryAdapter } from 'src/app/shared/models/TableData/Adapter/CriteriaBulkFoundListEntryAdapter'
import { CriteriaBulkNotFoundListEntryAdapter } from 'src/app/shared/models/TableData/Adapter/CriteriaBulkNotFoundListEntryAdapter'
import { CriteriaBulkResultList } from 'src/app/model/Search/ResultList/CriteriaBulkResultList'
import { PlaceholderBoxComponent } from '../../../../../../shared/components/placeholder-box/placeholder-box.component'
import { SelectedBulkCriteriaProvider } from 'src/app/service/SelectedBulkCriteria.service'
import { TableComponent } from '../../../../../../shared/components/table/table.component'
import { TableData } from 'src/app/shared/models/TableData/TableData'
import { TableRowData } from 'src/app/shared/models/TableData/TableRowData'

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

  readonly result = input<CriteriaBulkResultList | null>(null)

  readonly selectedEntries = toSignal(this.selectedBulkCriteriaService.getSelected(), {
    initialValue: [] as CriteriaBulkEntry[],
  })

  readonly foundCount = computed(() => this.result()?.getFound().length ?? 0)
  readonly notFoundCount = computed(() => this.result()?.getNotFound().length ?? 0)
  readonly hasResults = computed(() => this.foundCount() > 0 || this.notFoundCount() > 0)

  readonly foundCriteriaTableData = computed<TableData | null>(() => {
    const result = this.result()
    if (!result) return null
    const selected = this.selectedEntries()
    const selectedIds = new Set(selected.map((item) => item.getId()))
    const tableData = new CriteriaBulkFoundListEntryAdapter().adapt(result.getFound())
    tableData.body?.rows?.forEach((row) => {
      const checkboxCell = row.cells.find(
        (c): c is CheckboxTextCellData => c.type === 'checkboxText'
      )
      if (checkboxCell) {
        const entryId = (row.originalEntry as CriteriaBulkEntry).getId()
        checkboxCell.isSelected = selectedIds.has(entryId)
      }
    })
    return tableData
  })

  readonly notFoundCriteriaTableData = computed<TableData | null>(() => {
    const result = this.result()
    if (!result) return null
    return new CriteriaBulkNotFoundListEntryAdapter().adapt(result.getNotFound())
  })

  readonly tabChanged = output<SelectedTab>()

  onTabChange(event: MatTabChangeEvent): void {
    this.tabChanged.emit(event.index === 0 ? 'FOUND' : 'NOTFOUND')
  }

  setSelectedRowItem(item: TableRowData): void {
    const criteriaBulkEntry = item.originalEntry as CriteriaBulkEntry
    this.selectedBulkCriteriaService.toggle(criteriaBulkEntry)
  }
}
