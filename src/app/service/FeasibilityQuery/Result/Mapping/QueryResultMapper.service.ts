import { HttpErrorResponse } from '@angular/common/http'
import { Injectable } from '@angular/core'
import { IssueData } from 'src/app/core/model/Feasibility/IssueData'
import { QueryResultData } from 'src/app/model/Interface/QueryResultData'
import { QueryResultLineData } from 'src/app/model/Interface/QueryResultLineData'
import { ErrorQueryResult } from 'src/app/model/Result/ErrorQueryResult'
import { QueryResult } from 'src/app/model/Result/QueryResult'
import { QueryResultLine } from 'src/app/model/Result/QueryResultLine'
import { Issue } from 'src/app/model/Utilities/Issue'

@Injectable({
  providedIn: 'root',
})
export class QueryResultMapperService {
  constructor() {}

  public createErrorQueryResult(issueData: IssueData[], feasibilityQueryId: string): ErrorQueryResult {
    const issues: Issue[] = (issueData || []).map((issue: IssueData) => Issue.fromJson(issue))
    return new ErrorQueryResult(feasibilityQueryId, issues)
  }

  /*@TODO Issue #631 - Generic Error message dev on feasibility details*/
  public createQueryResult(detailedReceived: boolean, result: QueryResultData, feasibilityQueryId: string): QueryResult {
    return new QueryResult(
      detailedReceived,
      feasibilityQueryId,
      result.totalNumberOfPatients,
      result.queryId?.toString(),
      this.createResultLines(result.resultLines),
      (result.issues || []).map((issue: IssueData) => Issue.fromJson(issue))
    )
  }

  private createResultLines(resultLines: QueryResultLineData[]): QueryResultLine[] {
    return resultLines.map((line: QueryResultLineData) => QueryResultLine.fromJson(line))
  }
}
