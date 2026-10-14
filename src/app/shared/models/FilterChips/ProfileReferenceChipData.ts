import { Display } from 'src/app/model/DataSelection/Profile/Display'
import { FilterChipData } from './FilterChipData'

export interface ProfileReferenceChipData extends FilterChipData {
  id: string
  text: string
  expanded: boolean
  type: string
  typeExpanded?: boolean
  twoLineDisplay?: boolean
  data: ProfileReferenceChipData[]
  labelNumber?: number
}

export interface ProfileReferenceGroup {
  elementId: string
  profiles: {
    display: Display
    number: number
  }[]
}
