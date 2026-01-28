import { OperatorOptions } from '../../Utilities/Quantity/OperatorOptions';
import { QuantityUnit } from '../../FeasibilityQuery/QuantityUnit';
import { QuantityRangeValidationIssueData } from 'src/app/core/model/Validation/ValidationIssueData';

export class QuantityRangeValidationIssue {
  private readonly type: OperatorOptions.QUANTITY_RANGE;
  private readonly minValue: number;
  private readonly maxValue: number;
  private readonly unit: QuantityUnit;

  constructor(minValue: number, maxValue: number, unit: QuantityUnit) {
    this.type = OperatorOptions.QUANTITY_RANGE;
    this.unit = unit;
    this.minValue = minValue;
    this.maxValue = maxValue;
  }

  public getType(): OperatorOptions.QUANTITY_RANGE {
    return this.type;
  }

  public getUnit(): QuantityUnit {
    return this.unit;
  }

  public getMinValue(): number {
    return this.minValue;
  }

  public getMaxValue(): number {
    return this.maxValue;
  }

  public static fromJson(data: QuantityRangeValidationIssueData): QuantityRangeValidationIssue {
    const minValue = data.valueFilter.minValue;
    const maxValue = data.valueFilter.maxValue;
    const unitData = data.valueFilter.unit;
    const unit = QuantityUnit.fromJson(unitData);
    return new QuantityRangeValidationIssue(minValue, maxValue, unit);
  }
}
