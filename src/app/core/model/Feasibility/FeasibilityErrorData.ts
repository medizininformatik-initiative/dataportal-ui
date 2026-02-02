import { IssueData } from 'src/app/core/model/Feasibility/IssueData';

export interface FeasibilityErrorData {
  type: 'FEASIBILITY_ERROR'
  payload: IssueData[]
  url?: string
}
