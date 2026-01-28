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
}
