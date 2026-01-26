import { IssueData } from '../../core/model/Feasibility/IssueData';
import { QueryResultLineData } from './QueryResultLineData';

export interface QueryResultData {
  detailsReceived: boolean
  queryId: string
  id: string
  issues: IssueData[]
  resultLines: QueryResultLineData[]
  totalNumberOfPatients: number
}
