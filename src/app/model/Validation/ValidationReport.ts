import { ValidationIssue } from './ValidationIssue';

export class ValidationReport {
  private timestamp: Date;
  private errorCount: number;
  private issues: ValidationIssue[];

  constructor(issues: ValidationIssue[]) {
    this.timestamp = new Date();
    this.issues = issues;
    this.errorCount = issues.length;
  }

  public getTimestamp(): Date {
    return this.timestamp;
  }

  public getErrorCount(): number {
    return this.errorCount;
  }

  public getIssues(): ValidationIssue[] {
    return this.issues;
  }

  public setIssues(issues: ValidationIssue[]): void {
    this.issues = issues;
    this.errorCount = issues.length;
  }

  public setTimestamp(timestamp: Date): void {
    this.timestamp = timestamp;
  }
}
