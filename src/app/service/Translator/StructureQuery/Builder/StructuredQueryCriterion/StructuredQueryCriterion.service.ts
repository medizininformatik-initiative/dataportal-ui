import { AbstractStructuredQueryFilters } from 'src/app/model/StructuredQuery/Criterion/Abstract/AbstractStructuredQueryFilters'
import { Criterion } from 'src/app/model/FeasibilityQuery/Criterion/Criterion'
import { FeatureService } from 'src/app/service/Feature.service'
import { Injectable, inject } from '@angular/core'
import { StructuredQueryAttributeFilterFactoryService } from './AttributeFilter/StructuredQueryAttributeFilterFactory.service'
import { StructuredQueryCriterion } from 'src/app/model/StructuredQuery/Criterion/StructuredQueryCriterion'
import { StructuredQueryCriterionBuilder } from '../StructuredQueryBuilder'
import { StructuredQueryValueFilterFactoryService } from './ValueFilter/StructuredQueryValueFilterFactory.service'
import { TerminologyCode } from 'src/app/model/Terminology/TerminologyCode'
import { TerminologyCodeTranslator } from '../../../Shared/TerminologyCodeTranslator.service'
import { TimeRestrictionTranslationService } from '../../../Shared/TimeRestrictionTranslation.service'

@Injectable({
  providedIn: 'root',
})
export class StructuredQueryCriterionService {
  private timeRestrictionTranslation = inject(TimeRestrictionTranslationService)
  private featureService = inject(FeatureService)
  private attributeFilterService = inject(StructuredQueryAttributeFilterFactoryService)
  private valueFilterService = inject(StructuredQueryValueFilterFactoryService)
  private terminologyTranslator = inject(TerminologyCodeTranslator)

  /** Inserted by Angular inject() migration for backwards compatibility */
  constructor(...args: unknown[])

  constructor() {}

  public buildStructuredQueryCriterion(criterion: Criterion): StructuredQueryCriterion {
    return new StructuredQueryCriterionBuilder()
      .withAttributeFilters(this.buildAttributeFilters(criterion))
      .withContext(this.getContextIfFeatureEnabled(criterion))
      .withTermCodes(this.terminologyTranslator.translateTermCodes(criterion.getTermCodes()))
      .withTimeRestriction(
        this.timeRestrictionTranslation.translateTimeRestrictionToStructuredQuery(
          criterion.getTimeRestriction()
        )
      )
      .withValueFilter(this.buildValueFilter(criterion))
      .build()
  }

  private getContextIfFeatureEnabled(criterion: Criterion): TerminologyCode | undefined {
    return this.featureService.getSendSQContextToBackend() ? criterion.getContext() : undefined
  }

  private buildAttributeFilters(
    criterion: Criterion
  ): AbstractStructuredQueryFilters[] | undefined {
    const attributeFilters: AbstractStructuredQueryFilters[] = criterion
      .getAttributeFilters()
      .map((filter) => this.attributeFilterService.createAttributeFilter(filter))
      .filter((filter) => filter !== undefined) as AbstractStructuredQueryFilters[]

    return attributeFilters.length > 0 ? attributeFilters : undefined
  }

  private buildValueFilter(criterion: Criterion): AbstractStructuredQueryFilters | undefined {
    const valueFilters: AbstractStructuredQueryFilters[] = criterion
      .getValueFilters()
      .map((filter) => this.valueFilterService.createValueFilter(filter))
      .filter((filter) => filter !== undefined) as AbstractStructuredQueryFilters[]

    return valueFilters.length > 0 ? valueFilters[0] : undefined
  }
}
