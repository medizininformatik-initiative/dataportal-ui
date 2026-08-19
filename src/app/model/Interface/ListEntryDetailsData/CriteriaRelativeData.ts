import { ListEntryDetailsRelativeData } from './ListEntryDetailsRelativeData'

export interface CriteriaRelativeData extends ListEntryDetailsRelativeData {
  selectable: boolean
  termcode: string
  terminology: string
  contextualizedTermcodeHash: string
}
