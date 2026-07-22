import { Display } from 'src/app/model/DataSelection/Profile/Display'
import { ElasticSearchFilterTypes } from 'src/app/model/Utilities/ElasticSearchFilterTypes'

export interface SearchFilterData {
  filterType: ElasticSearchFilterTypes
  selectedValues: string[]
  data: SearchFilterValueData[]
}

export interface SearchFilterValueData {
  count: number
  label: string
  display: Display | string
}
