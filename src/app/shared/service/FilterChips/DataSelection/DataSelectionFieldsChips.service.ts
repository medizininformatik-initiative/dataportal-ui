import { inject, Injectable } from '@angular/core'
import { TranslateService } from '@ngx-translate/core'
import { BehaviorSubject, Observable } from 'rxjs'
import { Display } from 'src/app/model/DataSelection/Profile/Display'
import { SelectedBasicField } from 'src/app/model/DataSelection/Profile/Fields/BasicFields/SelectedBasicField'
import { TimeRestrictionType } from 'src/app/model/FeasibilityQuery/TimeRestriction'
import { FilterTypes } from 'src/app/model/Utilities/FilterTypes'
import { FilterChipDataSelectionAdapter } from 'src/app/shared/models/FilterChips/Adapter/DataSelection/FilterChipDataSelectionAdapter'
import { FilterChipData } from 'src/app/shared/models/FilterChips/FilterChipData'

@Injectable({
  providedIn: 'root',
})
export class DataSelectionFieldsChipsService {
  public translate = inject(TranslateService)

  private readonly filterChipsSubject: BehaviorSubject<FilterChipData[]> = new BehaviorSubject<FilterChipData[]>([])
  public filterChips$: Observable<FilterChipData[]> = this.filterChipsSubject.asObservable()

  /** Inserted by Angular inject() migration for backwards compatibility */
  constructor(...args: unknown[])

  constructor() {}

  public generateFilterChipsFromDataSelectionFields(selectedFields: SelectedBasicField[]): Observable<FilterChipData[]> {
    const filterChips = FilterChipDataSelectionAdapter.adaptFields(selectedFields)
    const squashedFilterChips = this.squashFilterChips(filterChips)
    this.filterChipsSubject.next(squashedFilterChips)
    return this.filterChipsSubject.asObservable()
  }

  private squashFilterChips(filterChips: FilterChipData[]): FilterChipData[] {
    const squashedChipsMap = new Map<Display | FilterTypes | TimeRestrictionType | string, FilterChipData>()

    filterChips.forEach((chip) => {
      if (!squashedChipsMap.has(chip.type)) {
        squashedChipsMap.set(chip.type, {
          type: chip.type,
          data: [...chip.data],
        })
      } else {
        const existingChip = squashedChipsMap.get(chip.type)
        existingChip?.data.push(...chip.data)
      }
    })

    return Array.from(squashedChipsMap.values())
  }
}
