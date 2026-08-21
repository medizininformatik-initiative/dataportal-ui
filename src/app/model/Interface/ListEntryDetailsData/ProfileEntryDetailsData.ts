import { DisplayData } from '../DisplayData'
import { ListEntryDetailsData } from './ListEntryDetailsData'
import { ProfileRelativeData } from './ProfileRelativeData'

export interface ProfileEntryDetailsData extends ListEntryDetailsData<ProfileRelativeData> {
  id: string
  description: DisplayData
  fields: {
    display: DisplayData
  }[]
  url: string
}
