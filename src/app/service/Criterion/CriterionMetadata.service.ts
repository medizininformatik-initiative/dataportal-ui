import { CriteriaProfileData } from 'src/app/model/Interface/CriteriaProfileData';
import { Display } from 'src/app/model/DataSelection/Profile/Display';
import { HashService } from '../Hash.service';
import { Injectable } from '@angular/core';
import { TerminologyCode } from 'src/app/model/Terminology/TerminologyCode';
import { v4 as uuidv4 } from 'uuid';

@Injectable({
  providedIn: 'root',
})
export class CriterionMetadataService {
  constructor(private hashService: HashService) {}

  /**
   * Creates the mandatory fields (metadata) for a criterion.
   *
   * @param criteriaProfileData The criteria profile data.
   * @returns An object containing the mandatory fields for the criterion.
   */
  public createMandatoryFields(criteriaProfileData: CriteriaProfileData): {
    isReference: false
    context: TerminologyCode
    criterionHash: string
    display: Display
    isInvalid: boolean
    isRequiredFilterSet: boolean
    uniqueID: string
    termCodes: Array<TerminologyCode>
  } {
    const context = TerminologyCode.fromJson(criteriaProfileData.context);
    const termCodes = criteriaProfileData.termCodes.map(TerminologyCode.fromJson);
    const display = Display.fromJson(criteriaProfileData.display);
    const criterionHash = this.hashService.createCriterionHash(context, termCodes[0]);
    const isFilterRequired = true; //!this.setIsRequiredFilterSet(criteriaProfileData);

    return {
      isReference: false,
      context,
      criterionHash,
      display,
      isInvalid: false,
      isRequiredFilterSet: isFilterRequired,
      uniqueID: uuidv4(),
      termCodes,
    };
  }

  /**
   * Creates the mandatory fields (metadata) for a criterion.
   *
   * @param criteriaProfileData The criteria profile data.
   * @returns An object containing the mandatory fields for the criterion.
   */
  public createMandatoryFieldsFromData(
    criteriaProfileData: CriteriaProfileData,
    criterionId: string,
    termCodes: TerminologyCode[]
  ): {
    isReference: false
    context: TerminologyCode
    criterionHash: string
    display: Display
    isInvalid: boolean
    isRequiredFilterSet: boolean
    uniqueID: string
    termCodes: Array<TerminologyCode>
  } {
    const context = TerminologyCode.fromJson(criteriaProfileData.context);
    const display = Display.fromJson(criteriaProfileData.display);
    const criterionHash = this.hashService.createCriterionHash(context, termCodes[0]);
    const isFilterRequired = true;

    return {
      isReference: false,
      context,
      criterionHash,
      display,
      isInvalid: false,
      isRequiredFilterSet: isFilterRequired,
      uniqueID: criterionId,
      termCodes,
    };
  }
}
