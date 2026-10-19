import { Component, ElementRef, computed, input, model, output, viewChild } from '@angular/core'
import { DisplayTranslationPipe } from '../../pipes/DisplayTranslationPipe'
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome'
import { FormsModule } from '@angular/forms'
import { MatFormField } from '@angular/material/form-field'
import { MatOptgroup, MatOption } from '@angular/material/core'
import { MatSelect, MatSelectTrigger } from '@angular/material/select'
import { MatTooltip } from '@angular/material/tooltip'
import { SearchFilterData } from '../../models/SearchFilter/SearchFilterData'
import { TranslateModule } from '@ngx-translate/core'
import { UpperCasePipe } from '@angular/common'
import { Display } from 'src/app/model/DataSelection/Profile/Display'
import { SearchFilterValueData } from '../../models/SearchFilter/SearchFilterData'

@Component({
  selector: 'num-search-filter',
  templateUrl: './search-filter.component.html',
  styleUrls: ['./search-filter.component.scss'],
  standalone: true,
  imports: [
    MatFormField,
    MatTooltip,
    MatSelect,
    MatSelectTrigger,
    MatOption,
    FontAwesomeModule,
    FormsModule,
    MatOptgroup,
    TranslateModule,
    DisplayTranslationPipe,
    UpperCasePipe,
  ],
})
export class SearchFilterComponent {
  isOpenData = {
    isOpen: false,
    targetFilter: '',
  }
  readonly filter = model<SearchFilterData | undefined>(undefined)

  readonly multiSelect = input(true)

  readonly isOpen = output<{
    isOpen: boolean
    targetFilter: string
  }>()

  readonly selectedValues = computed<string[] | string>(() => {
    const filter = this.filter()
    if (!filter) {
      return this.multiSelect() ? [] : ''
    }

    return this.multiSelect() ? filter.selectedValues : filter.selectedValues[0] ?? ''
  })

  readonly selectedCount = computed(() => {
    const values = this.selectedValues()
    return Array.isArray(values) ? values.length : values ? 1 : 0
  })

  readonly firstSelected = computed(() => {
    const values = this.selectedValues()
    return this.getCleanValue(Array.isArray(values) ? values[0] ?? '' : values)
  })

  searchText = ''

  private readonly searchInput = viewChild<ElementRef<HTMLInputElement>>('searchInput')
  private readonly matSelect = viewChild<MatSelect>('matSelect')

  get filteredData() {
    const filter = this.filter()
    if (!filter) {
      return []
    }

    if (!this.searchText) {
      return filter.data
    }
    const query = this.searchText.toLowerCase()
    return filter.data.filter((item) => this.getSearchSource(item).toLowerCase().includes(query))
  }

  translatedLabel: { translatedSystem: string; count: number; url: string }[] = []
  constructor() {}

  public onSelectionChange(selectedValues: string[] | string): void {
    const normalizedValues = Array.isArray(selectedValues) ? selectedValues : [selectedValues]

    this.filter.update((currentFilter) => {
      if (!currentFilter) {
        return currentFilter
      }

      return {
        ...currentFilter,
        selectedValues: normalizedValues,
      }
    })
  }

  public getCleanValue(value: string | string[]): string {
    if (Array.isArray(value)) {
      return value.map((v) => v.replace(/\s*\(\d+\)$/, '')).join(', ')
    }
    return value?.replace(/\s*\(\d+\)$/, '') || ''
  }

  public getTooltipText(): string {
    const selectedValues = this.selectedValues()
    if (!selectedValues || (Array.isArray(selectedValues) && selectedValues.length === 0)) {
      return 'SHARED_COMPONENTS.FILTER.NO_FILTER_SELECTED'
    }
    return this.getCleanValue(selectedValues)
  }

  public getOptionValue(item: SearchFilterValueData): string {
    const label = item.label?.trim()
    if (label) {
      return label
    }

    if (typeof item.display === 'string') {
      return item.display
    }

    if (item.display instanceof Display) {
      return item.display.getOriginal() ?? ''
    }

    return ''
  }

  public getTrackByValue(item: SearchFilterValueData): string {
    return this.getOptionValue(item)
  }

  private getSearchSource(item: SearchFilterValueData): string {
    return this.getOptionValue(item)
  }

  public onOpenedChange(isOpen: boolean): void {
    const filter = this.filter()
    if (isOpen) {
      this.isOpenData.isOpen = true
      this.isOpenData.targetFilter = filter?.filterType ?? ''
      this.isOpen.emit(this.isOpenData)
      this.searchInput()?.nativeElement.focus() // keyboard users start in the search field (WCAG 2.1.1)
    } else if (document.activeElement === document.body) {
      this.matSelect()?.focus() // the focused input was removed with the panel; give focus back (WCAG 2.4.3)
    }
  }

  // Filtering re-renders the options; without this the key manager keeps pointing at a removed one
  public resetActiveOption(): void {
    setTimeout(() => {
      const select = this.matSelect()
      // the open panel does not skip disabled options, so skip the search row by hand
      const first = select?.options.toArray().findIndex((option) => !option.disabled) ?? -1
      if (first >= 0) select?._keyManager.setActiveItem(first)
    })
  }

  // Typing stays in the input; navigation keys still reach mat-select (options, close, tab out)
  public onSearchKeydown(event: KeyboardEvent): void {
    if (!['ArrowDown', 'ArrowUp', 'Enter', 'Escape', 'Tab'].includes(event.key)) {
      event.stopPropagation()
    }
  }
}
