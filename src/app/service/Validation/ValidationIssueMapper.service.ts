import { Injectable } from '@angular/core';
import { CriteriaSetValidationIssue } from 'src/app/model/Validation/Issues/CriteriaSetValidationIssue';
import { QuantityRangeValidationIssue } from 'src/app/model/Validation/Issues/QuantityRangeValidationIssue';
import { QuantityUnitValidationIssue } from 'src/app/model/Validation/Issues/QuantityUnitValidationIssue';
import { TimeRestrictionValidationIssue } from 'src/app/model/Validation/Issues/TimeRestrictionValidationIssue';
import { TypeGuard } from '../TypeGuard/TypeGuard';
import { ValidationIssue } from 'src/app/model/Validation/ValidationIssue';
import { ValidationResponseData } from 'src/app/core/model/Validation/ValidationResponseData';
import { ValueSetValidationIssue } from 'src/app/model/Validation/Issues/ValueSetValidationIssue';
import { DataExtractionValidationIssue } from 'src/app/model/Validation/Issues/DataExtractionValidationIssue';

const PATH_PREFIX = /^content\//;
const NUMERIC_SEGMENT = /^\d+$/;

@Injectable({
  providedIn: 'root',
})
export class ValidationIssueMapperService {
  /**
   * Maps validation response data to a ValidationIssue instance
   * @param validationData - The validation response data from the backend
   * @returns ValidationIssue instance with attached details
   */
  public mapToValidationIssue(validationData: ValidationResponseData): ValidationIssue {
    const validationIssue = this.createValidationIssue(validationData);
    this.attachIssueDetails(validationIssue, validationData.details);
    return validationIssue;
  }

  /**
   * Attaches specific issue details to the validation issue based on the details type
   * @param validationIssue - The base validation issue
   * @param details - The details object containing type-specific information
   */
  private attachIssueDetails(validationIssue: ValidationIssue, details: any): void {
    if (!details) {
      return;
    }

    if (TypeGuard.isValueSetValidationIssueData(details)) {
      validationIssue.setValueSetValidationIssue(ValueSetValidationIssue.fromJson(details));
    } else if (TypeGuard.isQuantityUnitValidationIssueData(details)) {
      validationIssue.setQuantityUnitValidationIssue(QuantityUnitValidationIssue.fromJson(details));
    } else if (TypeGuard.isCriteriaSetValidationIssueData(details)) {
      validationIssue.setCriteriaSetValidationIssue(CriteriaSetValidationIssue.fromJson(details));
    } else if (TypeGuard.isTimeRestrictionValidationIssueData(details)) {
      validationIssue.setTimeRestrictionValidationIssue(
        TimeRestrictionValidationIssue.fromJson(details)
      );
    } else if (TypeGuard.isQuantityRangeValidationIssueData(details)) {
      validationIssue.setQuantityRangeValidationIssue(
        QuantityRangeValidationIssue.fromJson(details)
      );
    } else if (TypeGuard.isDataExtractionValidationIssueData(details)) {
      validationIssue.setDataExtractionValidationIssue(
        DataExtractionValidationIssue.fromJson(details)
      );
    }
  }

  /**
   * Creates a base ValidationIssue from validation response data
   * @param validationData - The validation response data from the backend
   * @returns Base ValidationIssue with location, code, and message
   */
  private createValidationIssue(validationData: ValidationResponseData): ValidationIssue {
    const location = this.pathToLocation(validationData.path);
    const code = validationData.value.code;
    const message = validationData.value.message;
    return new ValidationIssue(location, code, message);
  }

  /**
   * Converts backend path format to UI-readable format.
   * @example
   * "content/cohortDefinition/inclusionCriteria/0/0/termCodes/0"
   * becomes
   * "cohortDefinition.inclusionCriteria[0][0].termCodes[0]"
   */
  private pathToLocation(path: string): string {
    return path
      .replace(PATH_PREFIX, '')
      .split('/')
      .map((segment) => (NUMERIC_SEGMENT.test(segment) ? `[${segment}]` : segment))
      .join('.')
      .replace(/\.\[/g, '[');
  }
}
