import { CriteriaSetValidationIssue } from './Issues/CriteriaSetValidationIssue';
import { QuantityValidationIssue } from './Issues/QuantityValidationIssue';
import { TimeRestrictionValidationIssue } from './Issues/TimeRestrictionValidationIssue';
import { ValueSetValidationIssue } from './Issues/ValueSetValidationIssue';

export class ValidationIssue {
  private readonly code: string;
  private readonly message: string;
  private readonly location: string;

  /**
   * Optional detaile information about the criteria set involved in the validation issue
   * @see CriteriaSetValidationIssueData.
   */
  private criteriaSetValidationIssue: CriteriaSetValidationIssue;

  /**
   * Optional detailed information about the quantity validation issue.
   * @see {QuantityValidationIssueData}
   */
  private quantityValidationIssue?: QuantityValidationIssue;

  /**
   * Optional detailed information about the time restriction validation issue.
   * @see TimeRestrictionValidationIssueData
   */
  private timeRestrictionValidationIssue?: TimeRestrictionValidationIssue;

  /**
   * Optional detailed information about the termcode involved in the validation issue.
   * @see {}
   */
  private valueSetValidationIssue?: ValueSetValidationIssue;

  constructor(
    location: string,
    code: string,
    message: string,
    criteriaSetValidationIssue?: CriteriaSetValidationIssue,
    quantityValidationIssue?: QuantityValidationIssue,
    timeRestrictionValidationIssue?: TimeRestrictionValidationIssue,
    valueSetValidationIssue?: ValueSetValidationIssue
  ) {
    this.location = location;
    this.code = code;
    this.message = message;
    this.quantityValidationIssue = quantityValidationIssue;
    this.valueSetValidationIssue = valueSetValidationIssue;
    this.timeRestrictionValidationIssue = timeRestrictionValidationIssue;
    this.criteriaSetValidationIssue = criteriaSetValidationIssue;
  }

  public getLocation(): string {
    return this.location;
  }

  public getQuantityValidationIssue(): QuantityValidationIssue | undefined {
    return this.quantityValidationIssue;
  }

  public getTimeRestrictionValidationIssue(): TimeRestrictionValidationIssue | undefined {
    return this.timeRestrictionValidationIssue;
  }

  public getValueSetValidationIssue(): ValueSetValidationIssue | undefined {
    return this.valueSetValidationIssue;
  }

  public getCriteriaSetValidationIssue(): CriteriaSetValidationIssue | undefined {
    return this.criteriaSetValidationIssue;
  }

  public setQuantityValidationIssue(issue: QuantityValidationIssue): void {
    this.quantityValidationIssue = issue;
  }

  public setTimeRestrictionValidationIssue(issue: TimeRestrictionValidationIssue): void {
    this.timeRestrictionValidationIssue = issue;
  }

  public setValueSetValidationIssue(issue: ValueSetValidationIssue): void {
    this.valueSetValidationIssue = issue;
  }

  public setCriteriaSetValidationIssue(issue: CriteriaSetValidationIssue): void {
    this.criteriaSetValidationIssue = issue;
  }

  public getCode(): string {
    return this.code;
  }

  public getMessage(): string {
    return this.message;
  }
}
