import { CodeableConceptSearchService } from 'src/app/service/Search/SearchTypes/CodeableConcept/CodeableConceptSearch.service'
import { CodeableConceptResultListEntry } from 'src/app/model/Search/ListEntries/CodeableConceptResultListEntry'
import { combineLatest, filter, map, switchMap } from 'rxjs'
import { Concept } from 'src/app/model/FeasibilityQuery/Criterion/AttributeFilter/Concept/Concept'
import { ConceptFilterTableComponent } from './concept-filter-table/concept-filter-table.component'
import { ConceptSelectionHelperService } from '../../service/ConceptSelection/ConceptSelectionHelper.service'
import { SearchbarComponent } from '../../../../shared/components/search/searchbar.component'
import { SearchFilterData } from 'src/app/shared/models/SearchFilter/SearchFilterData'
import { SearchFilterComponent } from '../../../../shared/components/search-filter/search-filter.component'
import { SelectedConceptFilterProviderService } from '../../service/ConceptFilter/SelectedConceptFilterProvider.service'
import { takeUntilDestroyed, toObservable, toSignal } from '@angular/core/rxjs-interop'
import { CodeableConceptResultList } from 'src/app/model/Search/ResultList/CodeableConcepttResultList'
import {
  Component,
  DestroyRef,
  computed,
  effect,
  inject,
  input,
  model,
  output,
  signal,
} from '@angular/core'

@Component({
  selector: 'num-concept-filter',
  templateUrl: './concept-filter.component.html',
  styleUrls: ['./concept-filter.component.scss'],
  providers: [ConceptSelectionHelperService, SelectedConceptFilterProviderService],
  standalone: true,
  imports: [SearchbarComponent, SearchFilterComponent, ConceptFilterTableComponent],
})
export class ConceptFilterComponent {
  private readonly destroyRef = inject(DestroyRef)
  private readonly selectedConceptFilterService = inject(SelectedConceptFilterProviderService)
  private readonly conceptSearchService = inject(CodeableConceptSearchService)
  private readonly conceptSelectionService = inject(ConceptSelectionHelperService)

  readonly valueSetUrl = input.required<string[]>()
  readonly conceptFilterId = input<string | undefined>(undefined)
  readonly preSelectedConcepts = model<Concept[]>([])
  readonly changedSelectedConcepts = output<Concept[]>()

  private readonly currentSearchTerm = signal('')
  private readonly overrideUrls = signal<string[] | undefined>(undefined)
  readonly activeUrls = computed(() => this.overrideUrls() ?? this.valueSetUrl())

  readonly searchFilter = computed<SearchFilterData | undefined>(() => {
    const urls = this.valueSetUrl()
    return urls?.length > 1 ? this.conceptSelectionService.createTerminologyFilter(urls) : undefined
  })

  readonly searchResults = toSignal<CodeableConceptResultList | null>(
    toObservable(this.activeUrls).pipe(
      switchMap((urls) =>
        this.conceptSearchService.getSearchResults(urls).pipe(
          filter((results) => results != null),
          map((results) => this.applySelectionState(results))
        )
      )
    ),
    { initialValue: null }
  )

  constructor() {
    effect(() => this.syncPreSelectedConcepts())
    this.setupSearchTrigger()
    this.destroyRef.onDestroy(() => this.selectedConceptFilterService.clearSelectedConceptFilter())
  }

  public searchConcepts(searchTerm: string): void {
    this.currentSearchTerm.set(searchTerm)
  }

  public setValueSet(searchFilter: SearchFilterData): void {
    const urls = searchFilter.selectedValues.length > 0 ? searchFilter.selectedValues : undefined
    this.overrideUrls.set(urls)
  }

  public toggleConceptSelection(concept: Concept): void {
    this.preSelectedConcepts.update((prev: Concept[]) =>
      this.conceptSelectionService.toggleConceptSelection(concept, prev)
    )
    this.changedSelectedConcepts.emit(this.cloneCurrentConcepts())
  }

  private syncPreSelectedConcepts(): void {
    const concepts = this.preSelectedConcepts()
    this.selectedConceptFilterService.initializeSelectedConcepts(concepts)
    this.applySelectionStateToCurrentResults()
  }

  private applySelectionStateToCurrentResults(): void {
    this.searchResults()
      ?.getResults()
      .forEach((entry) => this.updateEntrySelection(entry))
  }

  private applySelectionState(results: CodeableConceptResultList): CodeableConceptResultList {
    results
      .getResults()
      .forEach((entry: CodeableConceptResultListEntry) => this.updateEntrySelection(entry))
    return results
  }

  private updateEntrySelection(entry: CodeableConceptResultListEntry): void {
    const terminologyCode = entry.getConcept().getTerminologyCode()
    const isSelected = this.selectedConceptFilterService.isConceptSelected(terminologyCode)
    entry.setIsSelected(isSelected)
  }

  private setupSearchTrigger(): void {
    combineLatest([toObservable(this.activeUrls), toObservable(this.currentSearchTerm)])
      .pipe(
        switchMap(([urls, term]) => this.conceptSearchService.search(term, urls)),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe()
  }

  private cloneCurrentConcepts(): Concept[] {
    return this.conceptSelectionService.cloneConcepts(this.preSelectedConcepts())
  }
}
