import { BulkCriteriaSearchFilterService } from 'src/app/service/Search/Filter/BulkCriteriaSearchFilter.service'
import { BULK_TERM_SEPARATOR } from 'src/app/service/Search/SearchTypes/BulkCriteria/BulkCriteriaSearchEngine.service'
import { BulkCriteriaSearchProvider } from 'src/app/service/Search/SearchTypes/BulkCriteria/BulkCriteriaSearchTextProvider.service'
import {
  afterNextRender,
  Component,
  computed,
  effect,
  ElementRef,
  inject,
  input,
  output,
  signal,
  untracked,
  viewChild,
} from '@angular/core'
import { FilterProvider } from 'src/app/service/Search/Filter/SearchFilterProvider.service'
import { FormsModule } from '@angular/forms'
import { MatTooltip } from '@angular/material/tooltip'
import { SearchFilterComponent } from '../../../../../../shared/components/search-filter/search-filter.component'
import { toSignal } from '@angular/core/rxjs-interop'
import { TranslateModule } from '@ngx-translate/core'
import { SearchFilterData } from 'src/app/shared/models/SearchFilter/SearchFilterData'

@Component({
  selector: 'num-bulk-search-input',
  templateUrl: './bulk-search-input.component.html',
  styleUrls: ['./bulk-search-input.component.scss'],
  standalone: true,
  imports: [FormsModule, SearchFilterComponent, MatTooltip, TranslateModule],
})
export class BulkSearchInputComponent {
  private readonly bulkCriteriaSearchProvider = inject(BulkCriteriaSearchProvider)
  private readonly bulkCriteriaSearchFilterService = inject(BulkCriteriaSearchFilterService)
  private readonly searchFilterProvider = inject(FilterProvider)

  readonly searchText = signal(this.bulkCriteriaSearchProvider.getSearchText() ?? '')

  readonly searchFilters = toSignal(this.bulkCriteriaSearchFilterService.getFilter(), {
    initialValue: [] as SearchFilterData[],
  })

  readonly filterMap = signal<Map<string, string[]>>(new Map())

  readonly filterAreSet = computed(() => {
    const map = this.filterMap()
    return map.size > 0 && Array.from(map).every(([, v]) => v.length > 0)
  })

  readonly canSubmit = computed(() => this.filterAreSet() && this.searchText().length > 0)

  readonly searchTextOutput = output<string>()

  /** Terms the last search did not find; their chips turn red. */
  readonly notFoundTerms = input<string[]>([])

  readonly terms = computed(() => [
    ...new Set(this.searchText().split(BULK_TERM_SEPARATOR).filter(Boolean)),
  ])
  readonly notFoundSet = computed(() => new Set(this.notFoundTerms()))
  readonly notFoundInText = computed(() => this.terms().filter((t) => this.notFoundSet().has(t)))

  private readonly searchInput = viewChild.required<ElementRef<HTMLTextAreaElement>>('searchInput')

  constructor() {
    afterNextRender(() => this.searchInput().nativeElement.focus())

    const initEffect = effect(
      () => {
        const filters = this.searchFilters()
        if (filters.length === 0) return

        if (this.filterMap().size === 0) {
          const map = new Map<string, string[]>()
          filters.forEach((f) => map.set(f.filterType, f.selectedValues as string[]))
          this.filterMap.set(map)
        }

        if (this.filterMap().size > 1 && this.searchText().length > 0) {
          untracked(() => this.searchTextOutput.emit(this.searchText()))
        }

        initEffect.destroy()
      },
      { allowSignalWrites: true }
    )
  }

  removeTerms(drop: string[]): void {
    const dropSet = new Set(drop)
    this.searchText.set(
      this.searchText()
        .split(BULK_TERM_SEPARATOR)
        .filter((t) => t && !dropSet.has(t))
        .join('\n')
    )
  }

  /** Selects the first occurrence of the term in the textarea and scrolls it into view. */
  showTerm(term: string): void {
    const area = this.searchInput().nativeElement
    const words = /[^\s,;]+/g
    let match: RegExpExecArray | null
    do {
      match = words.exec(area.value)
    } while (match && match[0] !== term)
    if (!match) return
    area.focus()
    area.setSelectionRange(match.index, match.index + term.length)
    // ponytail: scroll by line count, assumes no soft-wrapped lines (one term per line)
    const lineHeight = parseFloat(getComputedStyle(area).lineHeight) || 21
    const line = area.value.slice(0, match.index).split('\n').length - 1
    area.scrollTop = Math.max(0, line * lineHeight - area.clientHeight / 2)
  }

  setElasticSearchFilter(newFilter: SearchFilterData): void {
    const selectedValues = Array.isArray(newFilter.selectedValues)
      ? (newFilter.selectedValues as string[])
      : [newFilter.selectedValues as string]
    this.filterMap.update((map) => {
      const updated = new Map(map)
      updated.set(newFilter.filterType, selectedValues)
      return updated
    })
    this.searchFilterProvider.updateFilterSelectedValues(newFilter.filterType, selectedValues)
  }
}
