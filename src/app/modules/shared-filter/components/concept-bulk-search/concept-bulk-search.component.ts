import { BulkCodeableConceptSearchEngineService } from 'src/app/service/Search/SearchTypes/BulkCodeableConcept/BulkCodeableConceptSearchEngine'
import { CodeableConceptBulkEntry } from '../../../../model/Search/ListEntries/CodeableConceptBulkEntry'
import { CodeableConceptBulkFoundEntryAdapter } from 'src/app/shared/models/TableData/Adapter/CodeableConceptBulkFoundEntryAdapter'
import { CodeableConceptBulkNotFoundEntryAdapter } from 'src/app/shared/models/TableData/Adapter/CodeableConceptBulkNotFoundEntryAdapter'
import { CodeableConceptBulkResultList } from 'src/app/model/Search/ResultList/CodeableConceptBulkResultList'
import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
  Output,
  inject,
} from '@angular/core'
import { Concept } from 'src/app/model/FeasibilityQuery/Criterion/AttributeFilter/Concept/Concept'
import { ConceptSelectionHelperService } from '../../service/ConceptSelection/ConceptSelectionHelper.service'
import { Observable, of, Subscription, tap } from 'rxjs'
import { SearchFilter } from 'src/app/shared/models/SearchFilter/InterfaceSearchFilter'
import { SelectedConceptFilterProviderService } from '../../service/ConceptFilter/SelectedConceptFilterProvider.service'
import { TableData } from 'src/app/shared/models/TableData/TableData'
import { TableRowData } from 'src/app/shared/models/TableData/TableRowData'
import { MatInput } from '@angular/material/input'
import { FormsModule } from '@angular/forms'
import { SearchFilterComponent } from '../../../../shared/components/search-filter/search-filter.component'
import { ButtonComponent } from '../../../../shared/components/button/button.component'
import { MatTabGroup, MatTab } from '@angular/material/tabs'
import { TableComponent } from '../../../../shared/components/table/table.component'
import { TranslateModule } from '@ngx-translate/core'

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
export class ConceptBulkSearchComponent implements OnInit, OnDestroy, OnChanges {
  private selectedConceptFilterService = inject(SelectedConceptFilterProviderService)
  private bulkSearchService = inject(BulkCodeableConceptSearchEngineService)
  private conceptSelectionService = inject(ConceptSelectionHelperService)

  @Input() valueSetUrl: string[]
  @Input() conceptFilterId: string
  @Input() preSelectedConcepts: Concept[] = []
  @Input() tabChanged = false
  @Output() changedSelectedConcepts = new EventEmitter<Concept[]>()

  searchResults$: Observable<CodeableConceptBulkResultList> = of(undefined)
  searchFilter: SearchFilter
  notFoundTableData: TableData
  foundTableData: TableData
  bulkSearchTermInput = ''
  searchSubscription: Subscription
  selectedValueSet: string
  private subscription = new Subscription()
  foundCount: number
  notFoundCount: number

  /** Inserted by Angular inject() migration for backwards compatibility */
  constructor(...args: unknown[])

  constructor() {}

  ngOnChanges(): void {
    this.initializeComponent()
    if (this.tabChanged) {
      this.foundTableData = null
      this.notFoundTableData = null
      this.foundCount = 0
      this.notFoundCount = 0
      this.tabChanged = false
    }
  }

  ngOnInit(): void {
    this.initializePreSelectedConcepts()
  }

  ngOnDestroy(): void {
    this.cleanup()
  }

  public setValueSet(searchFilter: SearchFilter): void {
    this.selectedValueSet = searchFilter.selectedValues[0]
  }

  public bulkSearch(): void {
    this.performBulkSearch()
  }

  private initializeComponent(): void {
    this.initializeTerminologyFilter()
    this.initializePreSelectedConcepts()
  }

  private initializeTerminologyFilter(): void {
    const hasValueSetUrls = this.valueSetUrl?.length > 0
    if (!hasValueSetUrls) {
      return
    }

    this.searchFilter = this.conceptSelectionService.createTerminologyFilter(this.valueSetUrl)
  }

  private initializePreSelectedConcepts(): void {
    if (this.preSelectedConcepts.length > 0) {
      this.selectedConceptFilterService.initializeSelectedConcepts(this.preSelectedConcepts)
    }
  }

  private performBulkSearch(): void {
    this.searchSubscription?.unsubscribe()
    this.searchSubscription = this.bulkSearchService
      .search(this.bulkSearchTermInput, this.selectedValueSet)
      .pipe(
        tap((resultList) => {
          this.foundCount = resultList.getFound().length
          this.notFoundCount = resultList.getNotFound().length
        }),
        tap((resultList) => this.adaptData(resultList))
      )
      .subscribe((resultList) => {
        const concepts = resultList
          .getFound()
          .map((entry) => new Concept(entry.getDisplay(), entry.getTermCode()))
        this.toggleConceptSelection(concepts)
      })
  }

  private adaptData(resultList: CodeableConceptBulkResultList): void {
    const found = resultList.getFound()
    const notFound = resultList.getNotFound()

    if (found.length > 0) {
      this.foundTableData = new CodeableConceptBulkFoundEntryAdapter().adapt(found)
    } else {
      this.foundTableData = null
    }
    if (notFound.length > 0) {
      this.notFoundTableData = new CodeableConceptBulkNotFoundEntryAdapter().adapt(notFound)
    } else {
      this.notFoundTableData = null
    }
  }

  private toggleConceptSelection(concept: Concept[]): void {
    this.preSelectedConcepts = this.conceptSelectionService.addConceptsToSelection(
      concept,
      this.preSelectedConcepts
    )
    this.emitConceptChanges()
  }

  private emitConceptChanges(): void {
    const clonedConcepts = this.conceptSelectionService.cloneConcepts(this.preSelectedConcepts)
    this.changedSelectedConcepts.emit(clonedConcepts)
  }

  private cleanup(): void {
    this.subscription.unsubscribe()
    this.selectedConceptFilterService.clearSelectedConceptFilter()
  }

  public addSelectedRow(item: TableRowData): void {
    const entry = item.originalEntry as CodeableConceptBulkEntry
    const concept = new Concept(entry.getDisplay(), entry.getTermCode())
    const updatedSelectedConcepts = this.conceptSelectionService.toggleConceptSelection(
      concept,
      this.preSelectedConcepts
    )

    this.changedSelectedConcepts.emit(updatedSelectedConcepts)
  }
}
