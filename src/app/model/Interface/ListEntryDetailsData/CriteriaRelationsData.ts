import { CriteriaRelativeData } from './CriteriaRelativesData'
import { ListEntryDetailsData } from './ListEntryDetailsData'

export interface CriteriaEntryDetailsData extends ListEntryDetailsData<CriteriaRelativeData> {
  relatedTerms: CriteriaRelativeData[]
}
