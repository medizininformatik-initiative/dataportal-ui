import { BulkSearchResponseFoundData } from './BulkSearchResponseFoundData';

export interface BulkSearchResponseData {
  uiProfileId: string
  found: BulkSearchResponseFoundData[]
  notFound: string[]
}
