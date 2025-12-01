import { DisplayData } from './DisplayData';
import { TerminologyCodeData } from './TerminologyCodeData';

export interface BulkSearchResponseFoundData {
  id: string
  display: DisplayData
  availability: number
  context: TerminologyCodeData
  terminology: string
  termcodes: TerminologyCodeData[]
  kdsModule: string
  selectable: boolean
}
