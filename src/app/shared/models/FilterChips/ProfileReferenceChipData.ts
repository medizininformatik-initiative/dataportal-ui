import { Display } from 'src/app/model/DataSelection/Profile/Display';
import { FilterChipData } from './FilterChipData';

export interface ProfileReferenceChipData extends FilterChipData {
  id: string
  text: string
  expanded: boolean
  type: string
  typeExpanded?: boolean
  twoLineDisplay?: boolean
  data: ProfileReferenceChipData[]
}

export interface ProfileReferenceGroup {
  elementId: string
  profiles: Display[]
}
