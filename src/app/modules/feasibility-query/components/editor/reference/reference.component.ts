import { ActiveSearchTermService } from 'src/app/service/Search/ActiveSearchTerm.service'
import { CriteriaSetSearchService } from 'src/app/service/Search/SearchTypes/CriteriaSet/CriteriaSetSearch.service'
import { Display } from 'src/app/model/DataSelection/Profile/Display'
import { map, Observable } from 'rxjs'
import { ReferenceCriteriaListEntryAdapter } from 'src/app/shared/models/TableData/Adapter/ReferenceCriteriaListEntryAdapter'
import { ReferenceCriterion } from 'src/app/model/FeasibilityQuery/Criterion/ReferenceCriterion'
import { SnackbarMessageService } from 'src/app/service/SnackbarMessage.service'
import { TableData } from 'src/app/shared/models/TableData/TableData'
import { TableRowData } from 'src/app/shared/models/TableData/TableRowData'
import { TerminologyCode } from 'src/app/model/Terminology/TerminologyCode'
import { ChangeDetectionStrategy, Component, OnInit, inject, input, output } from '@angular/core'
import { MatTabGroup, MatTab, MatTabLabel } from '@angular/material/tabs'
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome'
import { InformationSectionComponent } from '../../../../../shared/components/information-section/information-section.component'
import { SearchbarComponent } from '../../../../../shared/components/search/searchbar.component'
import { InfiniteScrollDirective } from 'ngx-infinite-scroll'
import { TableComponent } from '../../../../../shared/components/table/table.component'
import { PlaceholderBoxComponent } from '../../../../../shared/components/placeholder-box/placeholder-box.component'
import { SelectedReferenceListComponent } from '../../../../shared-filter/components/selected-reference-list/selected-reference-list.component'
import { AsyncPipe } from '@angular/common'
import { TranslateModule } from '@ngx-translate/core'
import {
  DisplayTranslationPipe,
  SectionNameComponent,
} from 'src/app/shared/components/shared-components.module'

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
    InfiniteScrollDirective,
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
  private activeSearchTermService = inject(ActiveSearchTermService)
  private snackbarMessageService = inject(SnackbarMessageService)
  private criteriaSetSearchService = inject(CriteriaSetSearchService)

  readonly referenceFilterUri = input<string>(undefined)

  readonly display = input<Display>(undefined)

  readonly selectedReferenceCriterion = input<ReferenceCriterion[]>([])

  readonly selectedReferenceIds = output<string>()

  readonly changedSelectedReferences = output<ReferenceCriterion[]>()

  tableData$: Observable<TableData | null>

  arrayOfSelectedReferences: selectedItem[] = []

  searchText$: Observable<string>

  searchtText = ''

  constructor() {}

  ngOnInit() {
    this.searchText$ = this.activeSearchTermService.getActiveSearchTerm()
    this.tableData$ = this.criteriaSetSearchService
      .getSearchResults([this.referenceFilterUri()])
      .pipe(
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
    this.criteriaSetSearchService
      .loadNextPage(this.searchtText, [this.referenceFilterUri()])
      .subscribe()
  }

  public updateSelectedReferences(updatedReferences: ReferenceCriterion[]): void {
    this.changedSelectedReferences.emit(updatedReferences)
  }
}
