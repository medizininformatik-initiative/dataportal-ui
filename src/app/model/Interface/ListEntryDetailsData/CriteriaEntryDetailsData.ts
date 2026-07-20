import { CriteriaRelativeData } from './CriteriaRelativeData'
import { ListEntryDetailsData } from './ListEntryDetailsData'

export interface CriteriaEntryDetailsData extends ListEntryDetailsData<CriteriaRelativeData> {
  relatedTerms: CriteriaRelativeData[]
}
