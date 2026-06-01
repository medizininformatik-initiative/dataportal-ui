import { Component, computed, input, model, output } from '@angular/core'
import { DisplayTranslationPipe } from '../../pipes/DisplayTranslationPipe'
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome'
import { FormsModule } from '@angular/forms'
import { MatFormField } from '@angular/material/form-field'
import { MatOptgroup, MatOption } from '@angular/material/core'
import { MatSelect, MatSelectTrigger } from '@angular/material/select'
import { MatTooltip } from '@angular/material/tooltip'
import { SearchFilter } from '../../models/SearchFilter/InterfaceSearchFilter'
import { TranslateModule } from '@ngx-translate/core'

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
  ],
})
export class SearchFilterComponent {
  isOpenData = {
    isOpen: false,
    targetFilter: '',
  }
  readonly filter = model<SearchFilter | undefined>(undefined)

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

  searchText = ''

  get filteredData() {
    const filter = this.filter()
    if (!filter) {
      return []
    }

    if (!this.searchText) {
      return filter.data
    }
    const query = this.searchText.toLowerCase()
    return filter.data.filter((item) => item.label.toLowerCase().includes(query))
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

  public onOpenedChange(isOpen: boolean): void {
    const filter = this.filter()
    if (isOpen) {
      this.isOpenData.isOpen = true
      this.isOpenData.targetFilter = filter?.filterType ?? ''
      this.isOpen.emit(this.isOpenData)
    }
  }
}
