import { DisplayData } from '../DisplayData'
import { ListEntryData } from './ListEntryData'

export interface ProfileListEntryData extends ListEntryData {
  display: DisplayData
  availability: number
  module: DisplayData
  url: string
  categories: any[]
  selectable: boolean
  name: string
}
