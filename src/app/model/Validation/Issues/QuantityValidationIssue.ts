import { QuantityValidationIssueData } from 'src/app/core/model/Validation/ValidationIssueData';

export class QuantityValidationIssue {
  private readonly selected: string;
  private readonly allowed: string[];

  constructor(selected: string, allowed: string[]) {
    this.selected = selected;
    this.allowed = allowed;
  }

  public getSelected(): string {
    return this.selected;
  }

  public getAllowed(): string[] {
    return this.allowed;
  }

  public static fromJson(json: QuantityValidationIssueData): QuantityValidationIssue {
    return new QuantityValidationIssue(json.selected, json.allowed);
  }
}
