import { Issue } from '../Utilities/Issue'
import { QueryResult } from './QueryResult'

export class ErrorQueryResult extends QueryResult {
  constructor(feasibilityQueryId: string, issues: Issue[], id: string = '') {
    super(false, feasibilityQueryId, 0, id, [], issues)
  }

  public getTotalNumberOfPatients(): number | null {
    return null
  }
}
