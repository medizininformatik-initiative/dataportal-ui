import { CriteriaSetValidationIssue } from './Issues/CriteriaSetValidationIssue';
import { QuantityRangeValidationIssue } from './Issues/QuantityRangeValidationIssue';
import { QuantityUnitValidationIssue } from './Issues/QuantityUnitValidationIssue';
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
   * Optional detailed information about the quantity range validation issue.
   * @see QuantityRangeValidationIssueData
   */
  private quantityRangeValidationIssue?: QuantityRangeValidationIssue;
  /**
   * Optional detailed information about the quantity unit validation issue.
   * @see {QuantityUnitValidationIssueData}
   */
  private quantityUnitValidationIssue?: QuantityUnitValidationIssue;

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
    quantityRangeValidationIssue?: QuantityRangeValidationIssue,
    quantityUnitValidationIssue?: QuantityUnitValidationIssue,
    timeRestrictionValidationIssue?: TimeRestrictionValidationIssue,
    valueSetValidationIssue?: ValueSetValidationIssue
  ) {
    this.location = location;
    this.code = code;
    this.message = message;
    this.quantityRangeValidationIssue = quantityRangeValidationIssue;
    this.quantityUnitValidationIssue = quantityUnitValidationIssue;
    this.valueSetValidationIssue = valueSetValidationIssue;
    this.timeRestrictionValidationIssue = timeRestrictionValidationIssue;
    this.criteriaSetValidationIssue = criteriaSetValidationIssue;
  }

  public getLocation(): string {
    return this.location;
  }

  public getQuantityUnitValidationIssue(): QuantityUnitValidationIssue | undefined {
    return this.quantityUnitValidationIssue;
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

  public setQuantityUnitValidationIssue(issue: QuantityUnitValidationIssue): void {
    this.quantityUnitValidationIssue = issue;
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

  public setQuantityRangeValidationIssue(issue: QuantityRangeValidationIssue): void {
    this.quantityRangeValidationIssue = issue;
  }

  public getQuantityRangeValidationIssue(): QuantityRangeValidationIssue | undefined {
    return this.quantityRangeValidationIssue;
  }

  public getCode(): string {
    return this.code;
  }

  public getMessage(): string {
    return this.message;
  }
}
