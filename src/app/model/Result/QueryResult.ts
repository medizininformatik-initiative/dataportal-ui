import { Issue } from '../Utilities/Issue';
import { QueryResultLine } from './QueryResultLine';
import { QueryResultLineData } from '../Interface/QueryResultLineData';
import { IssueData } from '../../core/model/Feasibility/IssueData';
import { QueryResultData } from '../Interface/QueryResultData';

export class QueryResult {
  private detailsReceived = false;
  private id: string;
  private feasibilityQueryId: string;
  private totalNumberOfPatients: number;
  private resultLines: QueryResultLine[] = [];

  private issues: Issue[];

  constructor(
    detailsReceived: boolean,
    feasibilityQueryId: string,
    totalNumberOfPatients: number,
    id: string,
    resultLines: QueryResultLine[] = [],
    issues: Issue[] = []
  ) {
    this.detailsReceived = detailsReceived;
    this.feasibilityQueryId = feasibilityQueryId;
    this.totalNumberOfPatients = totalNumberOfPatients;
    this.id = id;
    this.resultLines = resultLines;
    this.issues = issues;
  }

  public getDetailsReceived(): boolean {
    return this.detailsReceived;
  }

  public setDetailsReceived(detailsReceived: boolean): void {
    this.detailsReceived = detailsReceived;
  }

  public getFeasibilityQueryId(): string {
    return this.feasibilityQueryId;
  }

  public setFeasibilityQueryId(id: string): void {
    this.feasibilityQueryId = id;
  }

  public getTotalNumberOfPatients(): number {
    return this.totalNumberOfPatients;
  }

  public setTotalNumberOfPatients(value: number): void {
    this.totalNumberOfPatients = value;
  }

  public getId(): string {
    return this.id;
  }

  public setId(value: string): void {
    this.id = value;
  }

  public getResultLines(): QueryResultLine[] {
    return this.resultLines;
  }

  public setResultLines(value: QueryResultLine[]): void {
    this.resultLines = value;
  }

  public getIssues(): Issue[] {
    return this.issues;
  }

  public setIssues(value: Issue[]): void {
    this.issues = value;
  }

  public static fromJson(json: QueryResultData): QueryResult {
    const issues = json.issues.map((issue: IssueData) => Issue.fromJson(issue));
    const resultLines = json.resultLines.map((resultLine: QueryResultLineData) =>
      QueryResultLine.fromJson(resultLine)
    );
    return new QueryResult(
      json.detailsReceived,
      json.queryId,
      json.totalNumberOfPatients,
      json.id,
      resultLines,
      issues
    );
  }
}
