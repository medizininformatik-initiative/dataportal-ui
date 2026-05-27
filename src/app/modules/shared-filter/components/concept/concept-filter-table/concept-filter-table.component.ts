import { ActiveSearchTermService } from 'src/app/service/Search/ActiveSearchTerm.service'
import { CheckboxTextCellData } from 'src/app/shared/models/TableData/cells/CheckboxTextCellData'
import { CloneConcept } from 'src/app/model/Utilities/CriterionCloner/ValueAttributeFilter/Concept/CloneConcept'
import { CodeableConceptListEntryAdapter } from 'src/app/shared/models/TableData/Adapter/CodeableConceptListEntryAdapter'
import { CodeableConceptResultList } from 'src/app/model/Search/ResultList/CodeableConcepttResultList'
import { CodeableConceptResultListEntry } from 'src/app/model/Search/ListEntries/CodeableConceptResultListEntry'
import { CodeableConceptSearchService } from 'src/app/service/Search/SearchTypes/CodeableConcept/CodeableConceptSearch.service'
import { Component, OnChanges, OnDestroy, OnInit, inject, input, output } from '@angular/core'
import { Concept } from 'src/app/model/FeasibilityQuery/Criterion/AttributeFilter/Concept/Concept'
import { ConceptSelectionHelperService } from '../../../service/ConceptSelection/ConceptSelectionHelper.service'
import { filter, map, Observable, Subscription, tap } from 'rxjs'
import { SelectedConceptFilterProviderService } from '../../../service/ConceptFilter/SelectedConceptFilterProvider.service'
import { TableData } from 'src/app/shared/models/TableData/TableData'
import { TableRowData } from 'src/app/shared/models/TableData/TableRowData'
import { InfiniteScrollDirective } from 'ngx-infinite-scroll'
import { TableComponent } from '../../../../../shared/components/table/table.component'
import { PlaceholderBoxComponent } from '../../../../../shared/components/placeholder-box/placeholder-box.component'
import { AsyncPipe } from '@angular/common'
import { TranslateModule } from '@ngx-translate/core'

@Component({
  selector: 'num-concept-filter-table',
  templateUrl: './concept-filter-table.component.html',
  styleUrls: ['./concept-filter-table.component.scss'],
  standalone: true,
  imports: [
    InfiniteScrollDirective,
    TableComponent,
    PlaceholderBoxComponent,
    AsyncPipe,
    TranslateModule,
  ],
})
export class ConceptFilterTableComponent implements OnInit, OnChanges, OnDestroy {
  private activeSearchTermService = inject(ActiveSearchTermService)
  private conceptSearchService = inject(CodeableConceptSearchService)
  private selectedConceptProviderService = inject(SelectedConceptFilterProviderService)
  private conceptSelectionHelperService = inject(ConceptSelectionHelperService)

  codeableConceptResultList: CodeableConceptResultList

  readonly valueSetUrl = input<string[]>(undefined)

  readonly conceptFilterId = input<string>(undefined)

  readonly selectedConcept = output<Concept>()

  adaptedData: TableData

  selectedConcepts: Concept[] = []

  private subscription: Subscription = new Subscription()

  private subscription2: Subscription = new Subscription()

  searchText$: Observable<string>

  /** Inserted by Angular inject() migration for backwards compatibility */
  constructor(...args: unknown[])

  constructor() {}

  ngOnChanges() {
    const selectedConcepts = this.selectedConceptProviderService.getSelectedConceptsValue()
    this.adaptedData?.body.rows.forEach((row) => {
      const entry = row.originalEntry as CodeableConceptResultListEntry
      const checkboxCell = row.cells.find(
        (c): c is CheckboxTextCellData => c.type === 'checkboxText'
      )
      if (checkboxCell) {
        checkboxCell.isSelected = this.conceptSelectionHelperService.isConceptSelected(
          entry.getConcept(),
          selectedConcepts
        )
      }
    })
  }

  ngOnInit() {
    this.conceptSearchService
      .getSearchResults(this.valueSetUrl())
      .pipe(
        filter((results) => results !== null),
        map((results) => {
          results.getResults().find((entry) => {
            entry.setIsSelected(
              this.selectedConceptProviderService.isConceptSelected(
                entry.getConcept().getTerminologyCode()
              )
            )
          })
          return results
        }),
        map((results) => {
          this.adaptedData = new CodeableConceptListEntryAdapter().adapt(results.getResults())
        })
      )
      .subscribe(() => {
        this.updateCheckboxSelection()
      })

    this.searchText$ = this.activeSearchTermService.getActiveSearchTerm()
  }

  private updateCheckboxSelection(): void {
    this.adaptedData?.body.rows.forEach((row) => {
      const listEntry = row.originalEntry as CodeableConceptResultListEntry
      const concept = CloneConcept.deepCopyConcept(listEntry.getConcept())
      this.clearSelectedConceptArray()
      const checkboxCell = row.cells.find(
        (c): c is CheckboxTextCellData => c.type === 'checkboxText'
      )
      if (checkboxCell) {
        checkboxCell.isSelected = !!this.selectedConceptProviderService.findConcept(concept)
      }
    })
  }

  ngOnDestroy() {
    this.subscription?.unsubscribe()
    this.subscription2?.unsubscribe()
  }

  public addSelectedRow(item: TableRowData) {
    const entry = item.originalEntry as CodeableConceptResultListEntry
    const concept = CloneConcept.deepCopyConcept(entry.getConcept())
    if (this.selectedConceptProviderService.findConcept(concept)) {
      this.selectedConceptProviderService.removeConcept(concept)
      this.clearSelectedConceptArray()
    } else {
      const foundConcept = this.selectedConcepts.find(
        (c) => c.getTerminologyCode().getCode() === concept.getTerminologyCode().getCode()
      )

      if (foundConcept) {
        this.selectedConcepts = this.selectedConcepts.filter(
          (c) => c.getTerminologyCode().getCode() !== concept.getTerminologyCode().getCode()
        )
      } else {
        this.selectedConceptProviderService.addConcepts(this.selectedConcepts)
        this.selectedConcepts.push(concept)
      }
    }
    this.selectedConcept.emit(concept)
  }

  private clearSelectedConceptArray() {
    this.selectedConcepts = []
  }

  public loadMoreSearchResults(): void {
    this.conceptSearchService.loadNextPage(' ', this.valueSetUrl()).subscribe()
  }
}
