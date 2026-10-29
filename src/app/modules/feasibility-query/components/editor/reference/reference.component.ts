import { AsyncPipe } from '@angular/common'
import { ChangeDetectionStrategy, Component, inject, input, OnInit, output } from '@angular/core'
import { MatTab, MatTabGroup, MatTabLabel } from '@angular/material/tabs'
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome'
import { TranslateModule } from '@ngx-translate/core'
import { map, Observable } from 'rxjs'
import { Display } from 'src/app/model/DataSelection/Profile/Display'
import { ReferenceCriterion } from 'src/app/model/FeasibilityQuery/Criterion/ReferenceCriterion'
import { ActiveSearchTermService } from 'src/app/service/Search/ActiveSearchTerm.service'
import { CriteriaSetSearchService } from 'src/app/service/Search/SearchTypes/CriteriaSet/CriteriaSetSearch.service'
import { SnackbarMessageService } from 'src/app/service/SnackbarMessage.service'
import { DisplayTranslationPipe, SectionNameComponent } from 'src/app/shared/components/shared-components.module'
import { ReferenceCriteriaListEntryAdapter } from 'src/app/shared/models/TableData/Adapter/ReferenceCriteriaListEntryAdapter'
import { TableData } from 'src/app/shared/models/TableData/TableData'
import { TableRowData } from 'src/app/shared/models/TableData/TableRowData'
import { InformationSectionComponent } from '../../../../../shared/components/information-section/information-section.component'
import { PlaceholderBoxComponent } from '../../../../../shared/components/placeholder-box/placeholder-box.component'
import { SearchbarComponent } from '../../../../../shared/components/search/searchbar.component'
import { TableComponent } from '../../../../../shared/components/table/table.component'
import { SelectedReferenceListComponent } from '../../../../shared-filter/components/selected-reference-list/selected-reference-list.component'

interface selectedItem {
  id: string
  display: Display
  system: string
  terminology: string
}
@Component({
  selector: 'num-reference',
  templateUrl: './reference.component.html',
  styleUrls: ['./reference.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [
    MatTabGroup,
    MatTab,
    MatTabLabel,
    FontAwesomeModule,
    InformationSectionComponent,
    SearchbarComponent,
    TableComponent,
    PlaceholderBoxComponent,
    SelectedReferenceListComponent,
    AsyncPipe,
    TranslateModule,
    SectionNameComponent,
    DisplayTranslationPipe,
  ],
})
export class ReferenceComponent implements OnInit {
  private readonly activeSearchTermService = inject(ActiveSearchTermService)
  private readonly snackbarMessageService = inject(SnackbarMessageService)
  private readonly criteriaSetSearchService = inject(CriteriaSetSearchService)

  public readonly referenceFilterUri = input<string>(undefined)

  public readonly display = input<Display>(undefined)

  public readonly selectedReferenceCriterion = input<ReferenceCriterion[]>([])

  public readonly selectedReferenceIds = output<string>()

  public readonly changedSelectedReferences = output<ReferenceCriterion[]>()

  public tableData$: Observable<TableData | null>

  public arrayOfSelectedReferences: selectedItem[] = []

  public searchText$: Observable<string>

  public searchtText = ''

  constructor() {}

  public ngOnInit() {
    this.searchText$ = this.activeSearchTermService.getActiveSearchTerm()
    this.tableData$ = this.criteriaSetSearchService.getSearchResults([this.referenceFilterUri()]).pipe(
      map((results) => {
        const items = results?.getResults() ?? []
        return items.length > 0 ? new ReferenceCriteriaListEntryAdapter().adapt(items) : null
      })
    )
    this.startElasticSearch('')
  }

  public startElasticSearch(searchtext: string): void {
    const referenceFilterUri = this.referenceFilterUri()
    if (!referenceFilterUri?.length) {
      console.warn('No referenceCriteriaUrl was provided')
      return
    }
    this.searchtText = searchtext
    this.criteriaSetSearchService.search(searchtext, [referenceFilterUri]).subscribe()
  }

  public emitIds(item: TableRowData): void {
    this.snackbarMessageService.displayCriterionEditSuccess()
    const itemId = item.originalEntry.getId()
    this.selectedReferenceIds.emit(itemId)
  }

  public loadMoreCriteriaSetResults(): void {
    this.criteriaSetSearchService.loadNextPage(this.searchtText, [this.referenceFilterUri()]).subscribe()
  }

  public updateSelectedReferences(updatedReferences: ReferenceCriterion[]): void {
    this.changedSelectedReferences.emit(updatedReferences)
  }
}
