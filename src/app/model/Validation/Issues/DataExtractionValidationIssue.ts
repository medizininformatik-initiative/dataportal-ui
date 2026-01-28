import { DataExtractionValidationIssueData } from 'src/app/core/model/Validation/ValidationIssueData';

export class DataExtractionValidationIssue {
  private readonly type: string;
  private readonly name: string;
  private readonly start: string;
  private readonly end: string;

  constructor(type: string, name: string, start: string, end: string) {
    this.type = type;
    this.name = name;
    this.start = start;
    this.end = end;
  }

  public getType(): string {
    return this.type;
  }

  public getName(): string {
    return this.name;
  }

  public getStart(): string {
    return this.start;
  }

  public getEnd(): string {
    return this.end;
  }

  public static fromJson(data: DataExtractionValidationIssueData): DataExtractionValidationIssue {
    const type = data.type;
    const name = data.name;
    const start = data.start;
    const end = data.end;
    return new DataExtractionValidationIssue(type, name, start, end);
  }
}
