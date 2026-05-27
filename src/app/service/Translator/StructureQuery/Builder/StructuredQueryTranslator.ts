import { ConsentTermCode } from 'src/app/model/Utilities/ConsentTermCode'
import { ContextTermCode } from 'src/app/model/Utilities/ContextTermCode'
import { Criterion } from 'src/app/model/FeasibilityQuery/Criterion/Criterion'
import { CriterionProviderService } from 'src/app/service/Provider/CriterionProvider.service'
import { FeasibilityQuery } from 'src/app/model/FeasibilityQuery/FeasibilityQuery'
import { Injectable, inject } from '@angular/core'
import { StructuredQuery } from 'src/app/model/StructuredQuery/StructuredQuery'
import { StructuredQueryCriterion } from 'src/app/model/StructuredQuery/Criterion/StructuredQueryCriterion'
import { StructuredQueryCriterionService } from './StructuredQueryCriterion/StructuredQueryCriterion.service'

@Injectable({
  providedIn: 'root',
})
export class StructuredQueryTranslator {
  private criterionProvider = inject(CriterionProviderService)
  private structuredQueryCriterionService = inject(StructuredQueryCriterionService)

  /** Inserted by Angular inject() migration for backwards compatibility */
  constructor(...args: unknown[])

  constructor() {}

  public translateToStructuredQuery(feasibilityQuery: FeasibilityQuery): StructuredQuery {
    const inclusionCriteria = this.convertInclusionCriteria(feasibilityQuery.getInclusionCriteria())
    const exclusionCriteria = this.convertExclusionCriteria(feasibilityQuery.getExclusionCriteria())
    const displayName =
      feasibilityQuery.getDisplay().length > 0 ? feasibilityQuery.getDisplay() : ''

    const structuredQuery = new StructuredQuery(inclusionCriteria, exclusionCriteria, displayName)

    if (feasibilityQuery.getConsent()) {
      structuredQuery.getInclusionCriteria().push(this.createConsentCriterion())
    }
    return structuredQuery
  }

  private convertInclusionCriteria(
    inclusionCriteriaArray: string[][]
  ): StructuredQueryCriterion[][] | [] {
    return inclusionCriteriaArray.length > 0
      ? this.convertCriterionGroup(inclusionCriteriaArray)
      : []
  }

  private convertExclusionCriteria(
    exclusionCriteriaArray: string[][]
  ): StructuredQueryCriterion[][] | undefined {
    return exclusionCriteriaArray.length > 0
      ? this.convertCriterionGroup(exclusionCriteriaArray)
      : undefined
  }

  private convertCriterionGroup(criterionGroup: string[][]): StructuredQueryCriterion[][] {
    const structuredCriteriaGroup: StructuredQueryCriterion[][] = criterionGroup
      .map((ids: string[]) => this.convertCriteriaIdsToStructuredCriteria(ids))
      .filter((innerArray) => innerArray.length > 0)

    return structuredCriteriaGroup.length > 0 ? structuredCriteriaGroup : undefined
  }

  /**
   * Converts an array of criterion IDs to an array of structured query criteria.
   *
   * @param ids Array of criterion IDs
   * @returns Array of StructuredQueryCriterion
   */
  private convertCriteriaIdsToStructuredCriteria(ids: string[]): StructuredQueryCriterion[] {
    return ids.map((id) => {
      const criterion = this.criterionProvider.getCriterionByUID(id)
      return this.buildStructuredQueryCriterion(criterion)
    })
  }

  /**
   * Builds a StructuredQueryCriterion from a Criterion.
   *
   * @param criterion
   * @returns
   */
  private buildStructuredQueryCriterion(criterion: Criterion): StructuredQueryCriterion {
    return this.structuredQueryCriterionService.buildStructuredQueryCriterion(criterion)
  }

  private createConsentCriterion(): StructuredQueryCriterion[] {
    return [
      new StructuredQueryCriterion(
        [ConsentTermCode.getConsentTermCode()],
        undefined,
        ContextTermCode.getContextTermCode()
      ),
    ]
  }
}
