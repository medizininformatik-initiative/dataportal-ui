import { CodeableConceptResultList } from 'src/app/model/Search/ResultList/CodeableConcepttResultList';
import { CodeableConceptSearchService } from 'src/app/service/Search/SearchTypes/CodeableConcept/CodeableConceptSearch.service';
import { Component, EventEmitter, Input, OnChanges, OnDestroy, OnInit, Output } from '@angular/core';
import { Concept } from 'src/app/model/FeasibilityQuery/Criterion/AttributeFilter/Concept/Concept';
import { ConceptSelectionHelperService } from '../../service/ConceptSelection/ConceptSelectionHelper.service';
import { filter, map, Observable, Subscription } from 'rxjs';
import { SearchFilter } from 'src/app/shared/models/SearchFilter/InterfaceSearchFilter';
import { SelectedConceptFilterProviderService } from '../../service/ConceptFilter/SelectedConceptFilterProvider.service';

@Component({
  selector: 'num-shared-concept-filter-copy',
  templateUrl: './copy_shared-concept-filter.component.html',
  styleUrls: ['./copy_shared-concept-filter.component.scss'],
  providers: [ConceptSelectionHelperService],
})
export class CopySharedConceptFilterComponent implements OnInit, OnDestroy, OnChanges {
  @Input() valueSetUrl: string[];
  @Input() conceptFilterId: string;
  @Input() preSelectedConcepts: Concept[] = [];
  @Output() changedSelectedConcepts = new EventEmitter<Concept[]>();

  searchResults$: Observable<CodeableConceptResultList>;
  searchFilter: SearchFilter;

  private currentSearchTerm = '';
  private subscription = new Subscription();

  constructor(
    private readonly selectedConceptFilterService: SelectedConceptFilterProviderService,
    private readonly conceptSearchService: CodeableConceptSearchService,
    private readonly conceptSelectionService: ConceptSelectionHelperService
  ) {}

  ngOnInit(): void {
    console.log('Initializing CopySharedConceptFilterComponent');
    this.initializeComponent();
  }

  ngOnChanges(): void {
    this.initializePreSelectedConcepts();
    this.setupSearchResults();
  }

  ngOnDestroy(): void {
    this.cleanup();
  }

  public searchConcepts(searchTerm: string): void {
    this.currentSearchTerm = searchTerm;
    this.performSearch(searchTerm);
  }

  public setValueSet(searchFilter: SearchFilter): void {
    this.valueSetUrl = searchFilter.selectedValues;
    this.searchResults$ = this.conceptSearchService.search(this.currentSearchTerm, this.valueSetUrl);
  }

  private initializeComponent(): void {
    this.initializeTerminologyFilter();
    this.initializePreSelectedConcepts();
    this.setupSearchResults();
    this.performSearch('');
  }

  private initializeTerminologyFilter(): void {
    this.searchFilter = this.conceptSelectionService.createTerminologyFilter(this.valueSetUrl);
  }

  private initializePreSelectedConcepts(): void {
    const hasPreSelectedConcepts = this.preSelectedConcepts.length > 0;
    if (hasPreSelectedConcepts) {
      this.selectedConceptFilterService.initializeSelectedConcepts(this.preSelectedConcepts);
    }
  }

  private setupSearchResults(): void {
    this.searchResults$ = this.conceptSearchService.getSearchResults(this.valueSetUrl).pipe(
      filter((results) => results != null),
      map((results) => {
        results.getResults().find((entry) => {
          entry.setIsSelected(
            this.selectedConceptFilterService.isConceptSelected(
              entry.getConcept().getTerminologyCode()
            )
          );
        });
        return results;
      })
    );
  }

  private performSearch(searchTerm: string): void {
    this.subscription.add(
      this.conceptSearchService.search(searchTerm, this.valueSetUrl).subscribe()
    );
  }

  public toggleConceptSelection(concept: Concept): void {
    this.preSelectedConcepts = this.conceptSelectionService.toggleConceptSelection(
      concept,
      this.preSelectedConcepts
    );
    this.emitConceptChanges();
  }

  private emitConceptChanges(): void {
    const clonedConcepts = this.conceptSelectionService.cloneConcepts(this.preSelectedConcepts);
    this.changedSelectedConcepts.emit(clonedConcepts);
  }

  private cleanup(): void {
    this.subscription.unsubscribe();
    this.selectedConceptFilterService.clearSelectedConceptFilter();
  }
}
