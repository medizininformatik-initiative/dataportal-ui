import { IssueData } from 'src/app/core/model/Feasibility/IssueData'
import { DataportalErrorType } from './DataportalErrorTypes'
import { ValidationIssueData } from './Validation/ValidationIssueData'
export interface DataportalErrorData {
  type: DataportalErrorType
  payload: IssueData[] | ValidationIssueData[]
  retryAfterSeconds?: number
  url?: string
}
