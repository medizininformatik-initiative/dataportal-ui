import { TimeRestrictionValidationIssueData } from 'src/app/core/model/Validation/ValidationIssueData';

export class TimeRestrictionValidationIssue {
  private readonly afterDate: string;
  private readonly beforeDate: string;

  constructor(afterDate: string, beforeDate: string) {
    this.afterDate = afterDate;
    this.beforeDate = beforeDate;
  }

  public getAfterDate(): string {
    return this.afterDate;
  }

  public getBeforeDate(): string | undefined {
    return this.beforeDate;
  }

  public static fromJson(data: TimeRestrictionValidationIssueData): TimeRestrictionValidationIssue {
    const afterDate = data.timeRestriction.afterDate;
    const beforeDate = data.timeRestriction.beforeDate;
    return new TimeRestrictionValidationIssue(afterDate, beforeDate);
  }
}
