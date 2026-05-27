import { CodeableConceptResultList } from 'src/app/model/Search/ResultList/CodeableConcepttResultList'
import { CodeableConceptResultListEntry } from 'src/app/model/Search/ListEntries/CodeableConceptResultListEntry'
import { CodeableConceptSearchService } from 'src/app/service/Search/SearchTypes/CodeableConcept/CodeableConceptSearch.service'
import {
  Component,
  OnChanges,
  OnDestroy,
  OnInit,
  inject,
  input,
  model,
  output,
} from '@angular/core'
import { Concept } from 'src/app/model/FeasibilityQuery/Criterion/AttributeFilter/Concept/Concept'
import { ConceptSelectionHelperService } from '../../service/ConceptSelection/ConceptSelectionHelper.service'
import { filter, map, Observable, Subscription } from 'rxjs'
import { SearchFilter } from 'src/app/shared/models/SearchFilter/InterfaceSearchFilter'
import { SelectedConceptFilterProviderService } from '../../service/ConceptFilter/SelectedConceptFilterProvider.service'
import { SearchbarComponent } from '../../../../shared/components/search/searchbar.component'
import { SearchFilterComponent } from '../../../../shared/components/search-filter/search-filter.component'
import { ConceptFilterTableComponent } from './concept-filter-table/concept-filter-table.component'
import { AsyncPipe } from '@angular/common'

@Component({
  selector: 'num-concept-filter',
  templateUrl: './concept-filter.component.html',
  styleUrls: ['./concept-filter.component.scss'],
  providers: [ConceptSelectionHelperService, SelectedConceptFilterProviderService],
  standalone: true,
  imports: [SearchbarComponent, SearchFilterComponent, ConceptFilterTableComponent, AsyncPipe],
})
export class ConceptFilterComponent implements OnInit, OnDestroy, OnChanges {
  private readonly selectedConceptFilterService = inject(SelectedConceptFilterProviderService)
  private readonly conceptSearchService = inject(CodeableConceptSearchService)
  private readonly conceptSelectionService = inject(ConceptSelectionHelperService)

  readonly valueSetUrl = model<string[]>()
  readonly conceptFilterId = input<string>(undefined)
  readonly preSelectedConcepts = model<Concept[]>([])
  readonly changedSelectedConcepts = output<Concept[]>()

  searchResults$: Observable<CodeableConceptResultList>
  searchFilter: SearchFilter

  private currentSearchTerm = ''
  private subscription = new Subscription()

  /** Inserted by Angular inject() migration for backwards compatibility */
  constructor(...args: unknown[])

  constructor() {}

  ngOnInit(): void {
    this.initializeComponent()
  }

  ngOnChanges(): void {
    this.initializePreSelectedConcepts()
    this.setupSearchResults()
  }

  ngOnDestroy(): void {
    this.cleanup()
  }

  public searchConcepts(searchTerm: string): void {
    this.currentSearchTerm = searchTerm
    this.performSearch(searchTerm)
  }

  public setValueSet(searchFilter: SearchFilter): void {
    this.valueSetUrl.set(searchFilter.selectedValues)
    this.searchResults$ = this.conceptSearchService.search(
      this.currentSearchTerm,
      this.valueSetUrl()
    )
  }

  private initializeComponent(): void {
    this.initializeTerminologyFilter()
    this.initializePreSelectedConcepts()
    this.setupSearchResults()
    this.performSearch('')
  }

  private initializeTerminologyFilter(): void {
    const urls = this.valueSetUrl()
    if (urls?.length > 1) {
      this.searchFilter = this.conceptSelectionService.createTerminologyFilter(urls)
    }
  }

  private initializePreSelectedConcepts(): void {
    const hasPreSelectedConcepts = this.preSelectedConcepts().length >= 0
    if (hasPreSelectedConcepts) {
      this.selectedConceptFilterService.initializeSelectedConcepts(this.preSelectedConcepts())
    }
  }

  private setupSearchResults(): void {
    this.searchResults$ = this.conceptSearchService.getSearchResults(this.valueSetUrl()).pipe(
      filter((results) => results != null),
      map((results) => {
        results.getResults().find((entry: CodeableConceptResultListEntry) => {
          entry.setIsSelected(
            this.selectedConceptFilterService.isConceptSelected(
              entry.getConcept().getTerminologyCode()
            )
          )
        })
        return results
      })
    )
  }

  private performSearch(searchTerm: string): void {
    this.subscription.add(
      this.conceptSearchService.search(searchTerm, this.valueSetUrl()).subscribe()
    )
  }

  public toggleConceptSelection(concept: Concept): void {
    this.preSelectedConcepts.update((prev) =>
      this.conceptSelectionService.toggleConceptSelection(concept, prev)
    )
    this.emitConceptChanges()
  }

  private emitConceptChanges(): void {
    const clonedConcepts = this.conceptSelectionService.cloneConcepts(this.preSelectedConcepts())
    this.changedSelectedConcepts.emit(clonedConcepts)
  }

  private cleanup(): void {
    this.subscription.unsubscribe()
    this.selectedConceptFilterService.clearSelectedConceptFilter()
  }
}
