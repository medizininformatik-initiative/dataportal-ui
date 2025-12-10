import { AttributeDefinitionData } from '../model/Interface/AttributeDefinitionData';
import { AttributeFilter } from '../model/FeasibilityQuery/Criterion/AttributeFilter/AttributeFilter';
import { AttributeFilterFactoryService } from './Criterion/AttributeFilterFactory.service';
import { CriteriaBulkEntry } from '../model/Search/ListEntries/CriteriaBulkEntry';
import { CriterionBuilder } from '../model/FeasibilityQuery/Criterion/CriterionBuilder';
import { Display } from '../model/DataSelection/Profile/Display';
import { HashService } from './Hash.service';
import { Injectable } from '@angular/core';
import { TerminologyCode } from '../model/Terminology/TerminologyCode';
import { TimeRestrictionNotSet } from '../model/FeasibilityQuery/Criterion/TimeRestriction/TimeRestrictionNotSet';
import { UiProfileData } from '../model/Interface/UiProfileData';
import { UiProfileProviderService } from './Provider/UiProfileProvider.service';
import { v4 as uuidv4 } from 'uuid';
import { ValueFilter } from '../model/FeasibilityQuery/Criterion/AttributeFilter/ValueFilter';

@Injectable({
  providedIn: 'root',
})
export class CreateBulkCriterionService {
  constructor(
    private uiProfileProviderService: UiProfileProviderService,
    private hashService: HashService,
    private attributeFilterFactory: AttributeFilterFactoryService
  ) {}

  public createBulkCriterion(response: CriteriaBulkEntry[], uiProfileId: string) {
    const uiProfile: UiProfileData = this.uiProfileProviderService.getUiProfileById(uiProfileId);
    const termcodes: TerminologyCode[] = this.extractTermcodes(response);
    const criteriaProfile = this.buildCriteriaProfile(response, termcodes);
    const builder = new CriterionBuilder(criteriaProfile);
    this.applyFilters(builder, uiProfile);

    return builder.buildCriterion();
  }

  private extractTermcodes(foudnEntries: CriteriaBulkEntry[]): TerminologyCode[] {
    return foudnEntries.map((entry: CriteriaBulkEntry) => entry.getTermCodes()[0]);
  }

  /**
   * Builds criteria profile data from the first bulk entry.
   * @param response
   * @param termcodes
   * @returns
   */
  private buildCriteriaProfile(
    response: CriteriaBulkEntry[],
    termcodes: TerminologyCode[]
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
    const firstBulkElement = response[0];
    return this.createCriteriaProfileData(firstBulkElement, termcodes);
  }

  private createCriteriaProfileData(
    response: CriteriaBulkEntry,
    termcodes: TerminologyCode[]
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
    const context = response.getContext();
    const termcode = response.getTermCodes()[0];
    const hash = this.hashService.createCriterionHash(context, termcode);
    const display = response.getDisplay();
    return {
      isReference: false,
      context,
      criterionHash: hash,
      display,
      isInvalid: false,
      isRequiredFilterSet: true,
      uniqueID: uuidv4(),
      termCodes: termcodes,
    };
  }

  private applyFilters(builder: CriterionBuilder, uiProfile: UiProfileData) {
    builder.withAttributeFilters(this.createAttributeFilter(uiProfile));
    builder.withValueFilters(
      [this.createValueFilter(uiProfile)].filter((filter) => filter !== undefined) as ValueFilter[]
    );
    builder.withTimeRestriction(this.createTimeRestriction(uiProfile));
  }

  private createTimeRestriction(uiProfile: UiProfileData): TimeRestrictionNotSet | undefined {
    const timeRestrictionAllowed: boolean = uiProfile.timeRestrictionAllowed;
    return timeRestrictionAllowed ? new TimeRestrictionNotSet() : undefined;
  }

  private createValueFilter(uiProfile: UiProfileData): ValueFilter | undefined {
    if (!uiProfile.valueDefinition) {
      return undefined;
    }
    return this.attributeFilterFactory.createValueFilter(uiProfile.valueDefinition);
  }

  private createAttributeFilter(uiProfile: UiProfileData): AttributeFilter[] {
    const attributeFilter: AttributeFilter[] = uiProfile.attributeDefinitions.map(
      (value: AttributeDefinitionData) => this.attributeFilterFactory.createAttributeFilter(value)
    );
    return attributeFilter;
  }
}
