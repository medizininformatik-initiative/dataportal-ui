import { DataportalErrorType } from './DataportalErrorTypes';
import { IssueData } from 'src/app/core/model/Feasibility/IssueData';
import { ValidationResponseData } from 'src/app/core/model/Validation/ValidationResponseData';

export interface DataportalErrorData {
  type: DataportalErrorType
  payload: IssueData[] | ValidationResponseData[]
  url?: string
}
