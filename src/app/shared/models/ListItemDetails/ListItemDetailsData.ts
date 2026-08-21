import { Display } from 'src/app/model/DataSelection/Profile/Display'
import { ListItemDetailsRelativeData } from './ListItemDetailsRelative'

export interface ListItemDetailsData {
  parents?: ListItemDetailsRelativeData[]
  children?: ListItemDetailsRelativeData[]
  display: Display
  description?: Display
  fields?: ListItemDetailsRelativeData[]
  selectable: boolean
}
