import { ActiveSearchTermService } from 'src/app/service/Search/ActiveSearchTerm.service';
import { CloneConcept } from 'src/app/model/Utilities/CriterionCloner/ValueAttributeFilter/Concept/CloneConcept';
import { CodeableConceptListEntryAdapter } from 'src/app/shared/models/TableData/Adapter/CodeableConceptListEntryAdapter';
import { CodeableConceptResultList } from 'src/app/model/Search/ResultList/CodeableConcepttResultList';
import { CodeableConceptResultListEntry } from 'src/app/model/Search/ListEntries/CodeableConceptResultListEntry';
import { CodeableConceptSearchService } from 'src/app/service/Search/SearchTypes/CodeableConcept/CodeableConceptSearch.service';
import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { InterfaceTableDataRow } from 'src/app/shared/models/TableData/InterfaceTableDataRows';
import { Observable, Subscription, switchMap } from 'rxjs';
import { SelectedConceptFilterProviderService } from '../../../service/ConceptFilter/SelectedConceptFilterProvider.service';
import { TableData } from 'src/app/shared/models/TableData/InterfaceTableData';

@Component({
  selector: 'num-concept-filter-table',
  templateUrl: './concept-filter-table.component.html',
  styleUrls: ['./concept-filter-table.component.scss'],
})
export class ConceptFilterTableComponent implements OnInit, OnDestroy {
  codeableConceptResultList: CodeableConceptResultList;

  @Input()
  valueSetUrl: string[];

  @Input()
  conceptFilterId: string;

  adaptedData: TableData;

  searchText = '';

  private subscription: Subscription = new Subscription();

  private subscription2: Subscription = new Subscription();

  searchText$: Observable<string>;

  constructor(
    private activeSearchTermService: ActiveSearchTermService,
    private codeableConceptSearchService: CodeableConceptSearchService,
    private selectedConceptProviderService: SelectedConceptFilterProviderService
  ) {}

  ngOnInit() {
    this.codeableConceptSearchService
      .getSearchResults(this.valueSetUrl)
      .pipe(
        switchMap((results) => {
          this.adaptedData = CodeableConceptListEntryAdapter.adapt(results.getResults());
          return this.selectedConceptProviderService.getSelectedConcepts();
        })
      )
      .subscribe(() => {
        this.updateCheckboxSelection();
      });

    this.searchText$ = this.activeSearchTermService.getActiveSearchTerm();
  }

  private updateCheckboxSelection(): void {
    this.adaptedData?.body.rows.forEach((row) => {
      const listEntry = row.originalEntry as CodeableConceptResultListEntry;
      const concept = CloneConcept.deepCopyConcept(listEntry.getConcept());
      row.isCheckboxSelected = this.selectedConceptProviderService.findConcept(concept)
        ? true
        : false;
    });
  }

  ngOnDestroy() {
    this.subscription?.unsubscribe();
    this.subscription2?.unsubscribe();
  }

  public addSelectedRow(item: InterfaceTableDataRow) {
    const entry = item.originalEntry as CodeableConceptResultListEntry;
    const concept = CloneConcept.deepCopyConcept(entry.getConcept());
    this.selectedConceptProviderService.addConcept(concept);
  }

  public loadMoreSearchResults(): void {
    this.codeableConceptSearchService.loadNextPage(' ', this.valueSetUrl).subscribe();
  }
}
