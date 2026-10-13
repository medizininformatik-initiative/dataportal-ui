import { DisplayData } from '../DisplayData'
import { ListEntryDetailsData } from './ListEntryDetailsData'
import { ProfileRelativeData } from './ProfileRelativeData'
import { ProfileEntryDetailsFieldData } from '../../Search/EntryDetails/Profile/ProfileEntryDetailsField'

export interface ProfileEntryDetailsData extends ListEntryDetailsData<ProfileRelativeData> {
  id: string
  description: DisplayData
  fields: ProfileEntryDetailsFieldData[]
  url: string
}
