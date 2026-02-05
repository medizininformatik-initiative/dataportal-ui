import { CriteriaSetValidationIssueData } from 'src/app/core/model/Validation/CriteriaSetValidationIssueData';
import { TerminologyCode } from '../../Terminology/TerminologyCode';

export class CriteriaSetValidationIssue {
  private readonly criteriaSet: string[];
  private readonly criteria: TerminologyCode;

  constructor(criteriaSet: string[], criteria: TerminologyCode) {
    this.criteriaSet = criteriaSet;
    this.criteria = criteria;
  }

  public getCriteriaSet(): string[] {
    return this.criteriaSet;
  }

  public getCriteria(): TerminologyCode {
    return this.criteria;
  }

  public static fromJson(json: CriteriaSetValidationIssueData): CriteriaSetValidationIssue {
    return new CriteriaSetValidationIssue(
      json.criteriaSets,
      TerminologyCode.fromJson(json.termCode)
    );
  }
}
