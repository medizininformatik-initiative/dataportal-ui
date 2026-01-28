import { QuantityUnitValidationIssueData } from 'src/app/core/model/Validation/ValidationIssueData';

export class QuantityUnitValidationIssue {
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

  public static fromJson(json: QuantityUnitValidationIssueData): QuantityUnitValidationIssue {
    return new QuantityUnitValidationIssue(json.selected, json.allowed);
  }
}
