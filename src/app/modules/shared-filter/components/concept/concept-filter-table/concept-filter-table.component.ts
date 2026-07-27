import { ActiveSearchTermService } from 'src/app/service/Search/ActiveSearchTerm.service'
import { CheckboxTextCellData } from 'src/app/shared/models/TableData/cells/CheckboxTextCellData'
import { CloneConcept } from 'src/app/model/Utilities/CriterionCloner/ValueAttributeFilter/Concept/CloneConcept'
import { CodeableConceptListEntryAdapter } from 'src/app/shared/models/TableData/Adapter/CodeableConceptListEntryAdapter'
import { CodeableConceptResultListEntry } from 'src/app/model/Search/ListEntries/CodeableConceptResultListEntry'
import { CodeableConceptSearchService } from 'src/app/service/Search/SearchTypes/CodeableConcept/CodeableConceptSearch.service'
import { Component, DestroyRef, effect, inject, input, output } from '@angular/core'
import { Concept } from 'src/app/model/FeasibilityQuery/Criterion/AttributeFilter/Concept/Concept'
import { filter, map, switchMap } from 'rxjs'
import { InfiniteScrollDirective } from 'ngx-infinite-scroll'
import { PlaceholderBoxComponent } from '../../../../../shared/components/placeholder-box/placeholder-box.component'
import { SelectedConceptFilterProviderService } from '../../../service/ConceptFilter/SelectedConceptFilterProvider.service'
import { TableComponent } from '../../../../../shared/components/table/table.component'
import { TableData } from 'src/app/shared/models/TableData/TableData'
import { TableRowData } from 'src/app/shared/models/TableData/TableRowData'
import { takeUntilDestroyed, toObservable, toSignal } from '@angular/core/rxjs-interop'
import { TranslateModule } from '@ngx-translate/core'
import { TableCellDataTypes } from '../../../../../shared/models/TableData/cells/TableCellType'

@Component({
  selector: 'num-concept-filter-table',
  templateUrl: './concept-filter-table.component.html',
  styleUrls: ['./concept-filter-table.component.scss'],
  standalone: true,
  imports: [InfiniteScrollDirective, TableComponent, PlaceholderBoxComponent, TranslateModule],
})
export class ConceptFilterTableComponent {
  private readonly destroyRef = inject(DestroyRef)
  private readonly activeSearchTermService = inject(ActiveSearchTermService)
  private readonly conceptSearchService = inject(CodeableConceptSearchService)
  private readonly selectedConceptProviderService = inject(SelectedConceptFilterProviderService)

  readonly valueSetUrl = input<string[] | undefined>(undefined)
  readonly conceptFilterId = input<string | undefined>(undefined)
  readonly selectedConcept = output<Concept>()

  readonly searchText = toSignal(this.activeSearchTermService.getActiveSearchTerm(), {
    initialValue: '',
  })

  readonly adaptedData = toSignal<TableData | undefined>(
    toObservable(this.valueSetUrl).pipe(
      filter((urls) => urls !== undefined),
      switchMap((urls) =>
        this.conceptSearchService.getSearchResults(urls).pipe(
          filter((results) => results !== null),
          map((results) => {
            results.getResults().forEach((entry) => {
              entry.setIsSelected(
                this.selectedConceptProviderService.isConceptSelected(
                  entry.getConcept().getTerminologyCode()
                )
              )
            })
            return new CodeableConceptListEntryAdapter().adapt(results.getResults())
          })
        )
      )
    ),
    { initialValue: undefined }
  )

  private selectedConcepts: Concept[] = []

  private readonly serviceSelectedConcepts =
    this.selectedConceptProviderService.getSelectedConcepts()

  constructor() {
    effect(() => {
      this.conceptFilterId() // track conceptFilterId changes
      this.serviceSelectedConcepts() // track service concept changes
      this.updateCheckboxSelection()
    })
  }

  private updateCheckboxSelection(): void {
    this.adaptedData()?.body.rows.forEach((row) => {
      const listEntry = row.originalEntry as CodeableConceptResultListEntry
      const concept = CloneConcept.deepCopyConcept(listEntry.getConcept())
      this.clearSelectedConceptArray()
      const checkboxCell = row.cells.find(
        (c): c is CheckboxTextCellData => c.type === TableCellDataTypes.CHECKBOXTEXT
      )
      if (checkboxCell) {
        checkboxCell.isSelected = !!this.selectedConceptProviderService.findConcept(concept)
      }
    })
  }

  public addSelectedRow(item: TableRowData): void {
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

  private clearSelectedConceptArray(): void {
    this.selectedConcepts = []
  }

  public loadMoreSearchResults(): void {
    const urls = this.valueSetUrl()
    if (!urls) return
    this.conceptSearchService
      .loadNextPage(' ', urls)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe()
  }
}
