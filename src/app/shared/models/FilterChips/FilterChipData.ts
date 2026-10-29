import { Display } from 'src/app/model/DataSelection/Profile/Display'
import { TimeRestrictionType } from 'src/app/model/FeasibilityQuery/TimeRestriction'
import { FilterTypes } from 'src/app/model/Utilities/FilterTypes'
import { FilterChipPropertyData } from './FilterChipPropertyData'

export interface FilterChipData {
  type: Display | FilterTypes | TimeRestrictionType | string
  typeExpanded?: boolean
  twoLineDisplay?: boolean
  data: FilterChipPropertyData[]
}
