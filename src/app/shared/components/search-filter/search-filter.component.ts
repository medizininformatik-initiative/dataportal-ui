import { UpperCasePipe } from '@angular/common'
import { Component, computed, input, model, output } from '@angular/core'
import { FormsModule } from '@angular/forms'
import { MatOptgroup, MatOption } from '@angular/material/core'
import { MatFormField } from '@angular/material/form-field'
import { MatSelect, MatSelectTrigger } from '@angular/material/select'
import { MatTooltip } from '@angular/material/tooltip'
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome'
import { TranslateModule } from '@ngx-translate/core'
import { Display } from 'src/app/model/DataSelection/Profile/Display'
import { SearchFilterData } from '../../models/SearchFilter/SearchFilterData'
import { SearchFilterValueData } from '../../models/SearchFilter/SearchFilterData'
import { DisplayTranslationPipe } from '../../pipes/DisplayTranslationPipe'

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
  public isOpenData = {
    isOpen: false,
    targetFilter: '',
  }
  public readonly filter = model<SearchFilterData | undefined>(undefined)

  public readonly multiSelect = input(true)

  public readonly isOpen = output<{
    isOpen: boolean
    targetFilter: string
  }>()

  public readonly selectedValues = computed<string[] | string>(() => {
    const filter = this.filter()
    if (!filter) {
      return this.multiSelect() ? [] : ''
    }

    return this.multiSelect() ? filter.selectedValues : filter.selectedValues[0] ?? ''
  })

  public searchText = ''

  public get filteredData() {
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

  public translatedLabel: { translatedSystem: string; count: number; url: string }[] = []
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
