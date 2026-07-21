import { DisplayData } from '../DisplayData'
import { ListEntryDetailsData } from './ListEntryDetailsData'
import { ProfileRelativeData } from './ProfileRelativeData'

export interface ProfileEntryDetailsData extends ListEntryDetailsData<ProfileRelativeData> {
  id: string
  fields: {
    display: DisplayData
  }[]
}
