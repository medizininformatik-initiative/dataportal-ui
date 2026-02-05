import { TerminologyCode } from '../../Terminology/TerminologyCode';
import { ValueSetValidationIssueData } from 'src/app/core/model/Validation/ValueSetValidationIssueData';

export class ValueSetValidationIssue {
  private readonly selectedConcepts: TerminologyCode;
  private readonly valueSets: string[];

  constructor(selectedConcepts: TerminologyCode, valueSets: string[]) {
    this.selectedConcepts = selectedConcepts;
    this.valueSets = valueSets;
  }

  public getSelectedConcepts(): TerminologyCode {
    return this.selectedConcepts;
  }

  public getValueSets(): string[] {
    return this.valueSets;
  }

  public static fromJson(json: ValueSetValidationIssueData): ValueSetValidationIssue {
    return new ValueSetValidationIssue(
      TerminologyCode.fromJson(json.selectedConcepts),
      json.valueSets
    );
  }
}
