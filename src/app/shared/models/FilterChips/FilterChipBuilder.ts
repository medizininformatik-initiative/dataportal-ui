import { Display } from 'src/app/model/DataSelection/Profile/Display'
import { TimeRestrictionType } from 'src/app/model/FeasibilityQuery/TimeRestriction'
import { FilterTypes } from 'src/app/model/Utilities/FilterTypes'
import { FilterChipData } from './FilterChipData'
import { FilterChipPropertyData } from './FilterChipPropertyData'

export class FilterChipBuilder {
  private readonly type: FilterTypes | TimeRestrictionType | string | Display
  private readonly data: FilterChipPropertyData[] = []

  constructor(type: FilterTypes | TimeRestrictionType | string | Display) {
    this.type = type
  }

  public addData(id: string, text: any, expanded: boolean = false, labelNumber?: number): this {
    this.data.push({ id, text, expanded, labelNumber })
    return this
  }

  public buildFilterChip(): FilterChipData {
    return {
      type: this.type,
      data: this.data,
    }
  }
}
