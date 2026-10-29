import { Injectable, inject } from '@angular/core'
import { Display } from 'src/app/model/DataSelection/Profile/Display'
import { Criterion } from 'src/app/model/FeasibilityQuery/Criterion/Criterion'
import { CriteriaProfileData } from 'src/app/model/Interface/CriteriaProfileData'
import { TerminologyCode } from 'src/app/model/Terminology/TerminologyCode'
import { v4 as uuidv4 } from 'uuid'
import { HashService } from '../Hash.service'

@Injectable({
  providedIn: 'root',
})
export class CriterionMetadataService {
  private readonly hashService = inject(HashService)

  /** Inserted by Angular inject() migration for backwards compatibility */
  constructor(...args: unknown[])

  constructor() {}

  /**
   * Creates the mandatory fields (metadata) for a criterion.
   *
   * @param {CriteriaProfileData} criteriaProfileData The criteria profile data.
   * @returns {{ isReference: false context: TerminologyCode criterionHash: string display: Display isInvalid: boolean isRequiredFilterSet: boolean id: string termCodes: Array<TerminologyCode> }} An object containing the mandatory fields for the criterion.
   */
  public createMandatoryFields(criteriaProfileData: CriteriaProfileData): {
    isReference: false
    context: TerminologyCode
    criterionHash: string
    display: Display
    isInvalid: boolean
    isRequiredFilterSet: boolean
    id: string
    termCodes: Array<TerminologyCode>
  } {
    const context = TerminologyCode.fromJson(criteriaProfileData.context)
    const termCodes = criteriaProfileData.termCodes.map(TerminologyCode.fromJson)
    const display = Display.fromJson(criteriaProfileData.display)
    const criterionHash = this.hashService.createCriterionHash(context, termCodes[0])
    const isFilterRequired = true //!this.setIsRequiredFilterSet(criteriaProfileData);

    return {
      isReference: false,
      context,
      criterionHash,
      display,
      isInvalid: false,
      isRequiredFilterSet: isFilterRequired,
      id: uuidv4(),
      termCodes,
    }
  }

  /**
   * Creates the mandatory fields (metadata) for a criterion when translating.
   *
   * @param {CriteriaProfileData} criteriaProfileData The criteria profile data.
   * @returns {{ isReference: false context: TerminologyCode criterionHash: string display: Display isInvalid: boolean isRequiredFilterSet: boolean id: string termCodes: Array<TerminologyCode> }} An object containing the mandatory fields for the criterion.
   * @param {string} criterionId
   * @param {TerminologyCode[]} termCodes
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
    id: string
    termCodes: Array<TerminologyCode>
  } {
    const context = TerminologyCode.fromJson(criteriaProfileData.context)
    const display = Display.fromJson(criteriaProfileData.display)
    const criterionHash = this.hashService.createCriterionHash(context, termCodes[0])
    const isFilterRequired = true

    return {
      isReference: false,
      context,
      criterionHash,
      display,
      isInvalid: false,
      isRequiredFilterSet: isFilterRequired,
      id: criterionId,
      termCodes,
    }
  }

  /**
   * Builds the criterion metadata from the given criterion.
   *
   * @param {Criterion} criterion
   * @returns {{ isReference: boolean; context: TerminologyCode; criterionHash: string; display: Display; isInvalid: boolean; isRequiredFilterSet: boolean; id: string; termCodes: TerminologyCode[]; }}
   */
  public fromCriterion(criterion: Criterion) {
    return {
      isReference: false,
      context: criterion.getContext(),
      criterionHash: criterion.getCriterionHash(),
      display: criterion.getDisplay(),
      isInvalid: false,
      isRequiredFilterSet: criterion.getIsRequiredFilterSet(),
      id: criterion.getId(),
      termCodes: criterion.getTermCodes(),
    }
  }
}
