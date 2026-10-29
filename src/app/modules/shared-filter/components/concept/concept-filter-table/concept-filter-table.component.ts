import { Component, DestroyRef, effect, inject, input, output } from '@angular/core'
import { takeUntilDestroyed, toObservable, toSignal } from '@angular/core/rxjs-interop'
import { TranslateModule } from '@ngx-translate/core'
import { filter, map, switchMap } from 'rxjs'
import { Concept } from 'src/app/model/FeasibilityQuery/Criterion/AttributeFilter/Concept/Concept'
import { CodeableConceptResultListEntry } from 'src/app/model/Search/ListEntries/CodeableConceptResultListEntry'
import { CloneConcept } from 'src/app/model/Utilities/CriterionCloner/ValueAttributeFilter/Concept/CloneConcept'
import { ActiveSearchTermService } from 'src/app/service/Search/ActiveSearchTerm.service'
import { CodeableConceptSearchService } from 'src/app/service/Search/SearchTypes/CodeableConcept/CodeableConceptSearch.service'
import { CodeableConceptListEntryAdapter } from 'src/app/shared/models/TableData/Adapter/CodeableConceptListEntryAdapter'
import { CheckboxTextCellData } from 'src/app/shared/models/TableData/Cells/Data/CheckboxTextCellData'
import { TableData } from 'src/app/shared/models/TableData/TableData'
import { TableRowData } from 'src/app/shared/models/TableData/TableRowData'
import { PlaceholderBoxComponent } from '../../../../../shared/components/placeholder-box/placeholder-box.component'
import { TableComponent } from '../../../../../shared/components/table/table.component'
import { TableCellKind } from '../../../../../shared/models/TableData/Cells/TableCellKind'
import { ConceptSelectionHelperService } from '../../../service/ConceptSelection/ConceptSelectionHelper.service'

@Component({
  selector: 'num-concept-filter-table',
  templateUrl: './concept-filter-table.component.html',
  styleUrls: ['./concept-filter-table.component.scss'],
  standalone: true,
  imports: [TableComponent, PlaceholderBoxComponent, TranslateModule],
})
export class ConceptFilterTableComponent {
  private readonly destroyRef = inject(DestroyRef)
  private readonly activeSearchTermService = inject(ActiveSearchTermService)
  private readonly conceptSearchService = inject(CodeableConceptSearchService)
  private readonly conceptSelectionService = inject(ConceptSelectionHelperService)

  public readonly valueSetUrl = input<string[] | undefined>(undefined)
  public readonly conceptFilterId = input<string | undefined>(undefined)
  public readonly preSelectedConcepts = input<Concept[]>([])
  public readonly selectedConcept = output<Concept>()

  public readonly searchText = toSignal(this.activeSearchTermService.getActiveSearchTerm(), {
    initialValue: '',
  })

  public readonly adaptedData = toSignal<TableData | undefined>(
    toObservable(this.valueSetUrl).pipe(
      filter((urls) => urls !== undefined),
      switchMap((urls) =>
        this.conceptSearchService.getSearchResults(urls).pipe(
          filter((results) => results !== null),
          map((results) => {
            results.getResults().forEach((entry) => {
              entry.setIsSelected(this.conceptSelectionService.isConceptSelected(entry.getConcept(), this.preSelectedConcepts()))
            })
            return new CodeableConceptListEntryAdapter().adapt(results.getResults())
          })
        )
      )
    ),
    { initialValue: undefined }
  )

  constructor() {
    effect(() => {
      this.conceptFilterId() // track conceptFilterId changes
      this.preSelectedConcepts() // track selection changes
      this.updateCheckboxSelection()
    })
  }

  private updateCheckboxSelection(): void {
    this.adaptedData()?.body.rows.forEach((row) => {
      const listEntry = row.originalEntry as CodeableConceptResultListEntry
      const concept = listEntry.getConcept()
      const checkboxCell = row.cells.find((c): c is CheckboxTextCellData => c.type === TableCellKind.CHECKBOXTEXT)
      if (checkboxCell) {
        checkboxCell.isSelected = this.conceptSelectionService.isConceptSelected(concept, this.preSelectedConcepts())
      }
    })
  }

  public addSelectedRow(item: TableRowData): void {
    const entry = item.originalEntry as CodeableConceptResultListEntry
    const concept = CloneConcept.deepCopyConcept(entry.getConcept())
    this.selectedConcept.emit(concept)
  }

  public loadMoreSearchResults(): void {
    const urls = this.valueSetUrl()
    if (!urls) {
      return
    }
    this.conceptSearchService.loadNextPage(' ', urls).pipe(takeUntilDestroyed(this.destroyRef)).subscribe()
  }
}
