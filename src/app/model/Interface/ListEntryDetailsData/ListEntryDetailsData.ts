import { DisplayData } from '../DisplayData'
import { ListEntryDetailsRelativeData } from './ListEntryDetailsRelativeData'

export interface ListEntryDetailsData<R extends ListEntryDetailsRelativeData> {
  display: DisplayData
  parents: R[]
  children: R[]
  selectable: boolean
}
