import { Display } from 'src/app/model/DataSelection/Profile/Display';
import { ElasticSearchFilterTypes } from 'src/app/model/Utilities/ElasticSearchFilterTypes';

export interface SearchFilter {
  filterType: ElasticSearchFilterTypes
  selectedValues: string[]
  data: SearchFilterValues[]
}

export interface SearchFilterValues {
  count: number
  label: string
  display: Display | string
}
