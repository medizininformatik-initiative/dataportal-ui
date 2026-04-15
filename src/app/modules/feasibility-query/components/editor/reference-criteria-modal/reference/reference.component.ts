import { ActiveSearchTermService } from 'src/app/service/Search/ActiveSearchTerm.service';
import { CriteriaSetSearchService } from 'src/app/service/Search/SearchTypes/CriteriaSet/CriteriaSetSearch.service';
import { Display } from 'src/app/model/DataSelection/Profile/Display';
import { map, Observable } from 'rxjs';
import { ReferenceCriteriaListEntryAdapter } from 'src/app/shared/models/TableData/Adapter/ReferenceCriteriaListEntryAdapter';
import { ReferenceCriterion } from 'src/app/model/FeasibilityQuery/Criterion/ReferenceCriterion';
import { SnackbarMessageService } from 'src/app/service/SnackbarMessage.service';
import { TableData } from 'src/app/shared/models/TableData/TableData';
import { TableRowData } from 'src/app/shared/models/TableData/TableRowData';
import { TerminologyCode } from 'src/app/model/Terminology/TerminologyCode';
import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
} from '@angular/core';

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
})
export class ReferenceComponent implements OnInit {
  @Input()
  referenceFilterUri: string;

  @Input()
  attributeCode: TerminologyCode;

  @Input()
  selectedReferenceCriterion: ReferenceCriterion[] = [];

  @Output()
  selectedReferenceIds = new EventEmitter<string>();

  @Output()
  changedSelectedReferences = new EventEmitter<ReferenceCriterion[]>();

  tableData$: Observable<TableData | null>;

  arrayOfSelectedReferences: selectedItem[] = [];

  searchText$: Observable<string>;

  searchtText = '';

  constructor(
    private activeSearchTermService: ActiveSearchTermService,
    private snackbarMessageService: SnackbarMessageService,
    private criteriaSetSearchService: CriteriaSetSearchService
  ) {}

  ngOnInit() {
    this.searchText$ = this.activeSearchTermService.getActiveSearchTerm();
    this.tableData$ = this.criteriaSetSearchService
      .getSearchResults([this.referenceFilterUri])
      .pipe(
        map((results) => {
          const items = results?.getResults() ?? [];
          return items.length > 0 ? new ReferenceCriteriaListEntryAdapter().adapt(items) : null;
        })
      );
    this.startElasticSearch('');
  }

  public startElasticSearch(searchtext: string): void {
    if (!this.referenceFilterUri?.length) {
      console.warn('No referenceCriteriaUrl was provided');
      return;
    }
    this.searchtText = searchtext;
    this.criteriaSetSearchService.search(searchtext, [this.referenceFilterUri]).subscribe();
  }

  public emitIds(item: TableRowData): void {
    this.snackbarMessageService.displayCriterionEditSuccess();
    const itemId = item.originalEntry.getId();
    this.selectedReferenceIds.emit(itemId);
  }

  public loadMoreCriteriaSetResults(): void {
    this.criteriaSetSearchService
      .loadNextPage(this.searchtText, [this.referenceFilterUri])
      .subscribe();
  }

  public updateSelectedReferences(updatedReferences: ReferenceCriterion[]): void {
    this.changedSelectedReferences.emit(updatedReferences);
  }
}
