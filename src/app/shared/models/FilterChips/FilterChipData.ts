import { Display } from 'src/app/model/DataSelection/Profile/Display';
import { FilterTypes } from 'src/app/model/Utilities/FilterTypes';
import { TimeRestrictionType } from 'src/app/model/FeasibilityQuery/TimeRestriction';
import { FilterChipPropertyData } from './FilterChipPropertyData';

export interface FilterChipData {
  type: Display | FilterTypes | TimeRestrictionType | string
  typeExpanded?: boolean
  twoLineDisplay?: boolean
  data: FilterChipPropertyData[]
}
