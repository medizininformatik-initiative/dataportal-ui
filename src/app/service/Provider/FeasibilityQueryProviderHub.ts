import { ActiveFeasibilityQueryService } from './ActiveFeasibilityQuery.service'
import { Criterion } from 'src/app/model/FeasibilityQuery/Criterion/Criterion'
import { CriterionProviderService } from './CriterionProvider.service'
import { FeasibilityQuery } from 'src/app/model/FeasibilityQuery/FeasibilityQuery'
import { FeasibilityQueryProviderService } from './FeasibilityQueryProvider.service'
import { Injectable, inject } from '@angular/core'
import { QueryResult } from 'src/app/model/Result/QueryResult'
import { ReferenceCriterion } from 'src/app/model/FeasibilityQuery/Criterion/ReferenceCriterion'
import { ReferenceCriterionProviderService } from './ReferenceCriterionProvider.service'
import { ResultProviderService } from './ResultProvider.service'
import { StageProviderService } from './StageProvider.service'

@Injectable({ providedIn: 'root' })
export class FeasibilityQueryProviderHub {
  private stageProviderService = inject(StageProviderService)
  private feasibilityQueryProviderService = inject(FeasibilityQueryProviderService)
  private criterionProviderService = inject(CriterionProviderService)
  private activeFEasibilityQueryProviderService = inject(ActiveFeasibilityQueryService)
  private referenceCriterionProviderService = inject(ReferenceCriterionProviderService)
  private queryResultProviderService = inject(ResultProviderService)

  /** Inserted by Angular inject() migration for backwards compatibility */
  constructor(...args: unknown[])

  constructor() {}

  /**
   * Adds multiple criteria to a stage.
   *
   * @param criterions Array of Criterion objects
   */
  public addCriteriaToStage(criterions: Criterion[]): void {
    const ids = criterions.map((criterion) => criterion.getId())
    this.stageProviderService.addMany(ids)
  }

  /**
   * Adds a single criterion to a stage.
   *
   * @param criterion The Criterion object to add
   */
  public addCriterionToStage(criterion: Criterion): void {
    this.stageProviderService.addOne(criterion.getId())
  }

  /**
   * Adds a single criterion to a stage.
   *
   * @param criterion The Criterion object to add
   */
  public addCriterionByIdToStage(id: string): void {
    this.stageProviderService.addOne(id)
  }

  /**
   * Adds a single criterion to the CriterionProvider.
   *
   * @param criterion The Criterion object to add
   */
  public addCriterionToCriterionProvider(criterion: Criterion): void {
    this.criterionProviderService.setOne(criterion)
  }

  /**
   * Adds a single criterion to the CriterionProvider.
   *
   * @param criterion The Criterion object to add
   */
  public addCriterionToByIdCriterionProvider(criterion: Criterion): void {
    this.criterionProviderService.setOne(criterion)
  }

  /**
   * Adds multiple criteria to the CriterionProvider.
   *
   * @param criterions Array of Criterion objects
   */
  public addCriteriaToCriterionProvider(criterions: Criterion[]): void {
    this.criterionProviderService.setMany(criterions)
  }

  /**
   * Adds a feasibility query.
   *
   * @param query The feasibility query object
   */
  public addFeasibilityQuery(feasibilityQuery: FeasibilityQuery): void {
    this.feasibilityQueryProviderService.setFeasibilityQueryById(
      feasibilityQuery,
      feasibilityQuery.getId()
    )
  }

  /**
   * Adds an active feasibility query.
   *
   * @param query The active feasibility query object
   */
  public addActiveFeasibilityQuery(feasibilityQuery: FeasibilityQuery): void {
    this.activeFEasibilityQueryProviderService.setActiveFeasibilityQueryID(feasibilityQuery.getId())
  }

  /**
   * Adds a reference criterion.
   *
   * @param criterion The Criterion object to add as a reference
   */
  public addReferenceCriterion(refernceCriterion: ReferenceCriterion): void {
    this.referenceCriterionProviderService.setOne(refernceCriterion)
  }

  /**
   * Adds multiple reference criteria.
   *
   * @param criterions Array of Criterion objects to add as references
   */
  public addReferenceCriteria(referenceCriteria: ReferenceCriterion[]): void {
    this.referenceCriterionProviderService.setMany(referenceCriteria)
  }

  /**
   * Adds a query result.
   *
   * @param result The query result object
   */
  public addQueryResult(result: QueryResult): void {
    this.queryResultProviderService.setOne(result)
  }
}
