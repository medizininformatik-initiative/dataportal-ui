import { BulkCodeableConceptSearchEngineService } from 'src/app/service/Search/SearchTypes/BulkCodeableConcept/BulkCodeableConceptSearchEngine'
import { ButtonComponent } from '../../../../shared/components/button/button.component'
import { CodeableConceptBulkEntry } from '../../../../model/Search/ListEntries/CodeableConceptBulkEntry'
import { CodeableConceptBulkFoundEntryAdapter } from 'src/app/shared/models/TableData/Adapter/CodeableConceptBulkFoundEntryAdapter'
import { CodeableConceptBulkNotFoundEntryAdapter } from 'src/app/shared/models/TableData/Adapter/CodeableConceptBulkNotFoundEntryAdapter'
import { CodeableConceptBulkResultList } from 'src/app/model/Search/ResultList/CodeableConceptBulkResultList'
import { Concept } from 'src/app/model/FeasibilityQuery/Criterion/AttributeFilter/Concept/Concept'
import { ConceptSelectionHelperService } from '../../service/ConceptSelection/ConceptSelectionHelper.service'
import { FormsModule } from '@angular/forms'
import { MatInput } from '@angular/material/input'
import { MatTab, MatTabGroup } from '@angular/material/tabs'
import { SearchFilterComponent } from '../../../../shared/components/search-filter/search-filter.component'
import { SearchFilterData } from 'src/app/shared/models/SearchFilter/SearchFilterData'
import { SelectedConceptFilterProviderService } from '../../service/ConceptFilter/SelectedConceptFilterProvider.service'
import { Subscription } from 'rxjs'
import { TableComponent } from '../../../../shared/components/table/table.component'
import { TableData } from 'src/app/shared/models/TableData/TableData'
import { TableRowData } from 'src/app/shared/models/TableData/TableRowData'
import { TranslateModule } from '@ngx-translate/core'
import {
  Component,
  computed,
  DestroyRef,
  effect,
  inject,
  input,
  output,
  signal,
} from '@angular/core'

@Component({
  selector: 'num-concept-bulk-search',
  templateUrl: './concept-bulk-search.component.html',
  styleUrls: ['./concept-bulk-search.component.scss'],
  providers: [ConceptSelectionHelperService],
  standalone: true,
  imports: [
    MatInput,
    FormsModule,
    SearchFilterComponent,
    ButtonComponent,
    MatTabGroup,
    MatTab,
    TableComponent,
    TranslateModule,
  ],
})
export class ConceptBulkSearchComponent {
  private selectedConceptFilterService = inject(SelectedConceptFilterProviderService)
  private bulkSearchService = inject(BulkCodeableConceptSearchEngineService)
  private conceptSelectionService = inject(ConceptSelectionHelperService)

  readonly valueSetUrl = input<string[] | undefined>(undefined)
  readonly preSelectedConcepts = input<Concept[]>([])
  readonly tabChanged = input(false)
  readonly changedSelectedConcepts = output<Concept[]>()

  readonly searchFilter = computed<SearchFilterData | undefined>(() => {
    const urls = this.valueSetUrl()
    if (!urls?.length) {
      return undefined
    }
    return this.conceptSelectionService.createTerminologyFilter(urls)
  })

  readonly selectedValueSet = signal<string | undefined>(undefined)
  readonly foundTableData = signal<TableData | undefined>(undefined)
  readonly notFoundTableData = signal<TableData | undefined>(undefined)
  readonly foundCount = computed(() => this.foundTableData()?.body.rows.length ?? 0)
  readonly notFoundCount = computed(() => this.notFoundTableData()?.body.rows.length ?? 0)
  private readonly selectedConcepts = signal<Concept[]>([])

  bulkSearchTermInput = ''
  private searchSubscription?: Subscription

  constructor() {
    // Keep local selection in sync with the input and initialize the provider
    effect(() => {
      const preSelected = this.preSelectedConcepts()
      this.selectedConcepts.set([...preSelected])
      if (preSelected.length > 0) {
        this.selectedConceptFilterService.initializeSelectedConcepts(preSelected)
      }
    })

    // Clear result tables on tab switch
    effect(() => {
      if (this.tabChanged()) {
        this.foundTableData.set(undefined)
        this.notFoundTableData.set(undefined)
      }
    })

    inject(DestroyRef).onDestroy(() => {
      this.searchSubscription?.unsubscribe()
      this.selectedConceptFilterService.clearSelectedConceptFilter()
    })
  }

  public setValueSet(filter: SearchFilterData): void {
    this.selectedValueSet.set(filter.selectedValues[0])
  }

  public bulkSearch(): void {
    this.searchSubscription?.unsubscribe()

    this.searchSubscription = this.bulkSearchService
      .search(this.bulkSearchTermInput, this.selectedValueSet() ?? '')
      .subscribe((resultList) => {
        this.updateTableData(resultList)
        this.updateSelectedConcepts(resultList.getFound())
      })
  }

  private updateTableData(resultList: CodeableConceptBulkResultList): void {
    const found = resultList.getFound()
    const notFound = resultList.getNotFound()

    this.foundTableData.set(
      found.length ? new CodeableConceptBulkFoundEntryAdapter().adapt(found) : undefined
    )

    this.notFoundTableData.set(
      notFound.length ? new CodeableConceptBulkNotFoundEntryAdapter().adapt(notFound) : undefined
    )
  }

  private updateSelectedConcepts(found: CodeableConceptBulkEntry[]): void {
    const concepts = found.map((entry) => new Concept(entry.getDisplay(), entry.getTermCode()))

    const updated = this.conceptSelectionService.addConceptsToSelection(
      concepts,
      this.selectedConcepts()
    )

    this.selectedConcepts.set(updated)
    this.changedSelectedConcepts.emit(this.conceptSelectionService.cloneConcepts(updated))
  }

  public addSelectedRow(item: TableRowData): void {
    const entry = item.originalEntry as CodeableConceptBulkEntry
    const concept = new Concept(entry.getDisplay(), entry.getTermCode())
    const updated = this.conceptSelectionService.toggleConceptSelection(
      concept,
      this.selectedConcepts()
    )
    this.selectedConcepts.set(updated)
    this.changedSelectedConcepts.emit(this.conceptSelectionService.cloneConcepts(updated))
  }
}
