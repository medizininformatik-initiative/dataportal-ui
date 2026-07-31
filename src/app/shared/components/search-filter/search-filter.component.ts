import { Component, computed, input, model, output } from '@angular/core'
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
    }
  }
}
