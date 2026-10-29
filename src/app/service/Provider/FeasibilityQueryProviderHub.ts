import { Injectable, inject } from '@angular/core'
import { Criterion } from 'src/app/model/FeasibilityQuery/Criterion/Criterion'
import { ReferenceCriterion } from 'src/app/model/FeasibilityQuery/Criterion/ReferenceCriterion'
import { FeasibilityQuery } from 'src/app/model/FeasibilityQuery/FeasibilityQuery'
import { QueryResult } from 'src/app/model/Result/QueryResult'
import { ActiveFeasibilityQueryService } from './ActiveFeasibilityQuery.service'
import { CriterionProviderService } from './CriterionProvider.service'
import { FeasibilityQueryProviderService } from './FeasibilityQueryProvider.service'
import { ReferenceCriterionProviderService } from './ReferenceCriterionProvider.service'
import { ResultProviderService } from './ResultProvider.service'
import { StageProviderService } from './StageProvider.service'

@Injectable({ providedIn: 'root' })
export class FeasibilityQueryProviderHub {
  private readonly stageProviderService = inject(StageProviderService)
  private readonly feasibilityQueryProviderService = inject(FeasibilityQueryProviderService)
  private readonly criterionProviderService = inject(CriterionProviderService)
  private readonly activeFEasibilityQueryProviderService = inject(ActiveFeasibilityQueryService)
  private readonly referenceCriterionProviderService = inject(ReferenceCriterionProviderService)
  private readonly queryResultProviderService = inject(ResultProviderService)

  /** Inserted by Angular inject() migration for backwards compatibility */
  constructor(...args: unknown[])

  constructor() {}

  /**
   * Adds multiple criteria to a stage.
   *
   * @param {Criterion[]} criterions Array of Criterion objects
   */
  public addCriteriaToStage(criterions: Criterion[]): void {
    const ids = criterions.map((criterion) => criterion.getId())
    this.stageProviderService.addMany(ids)
  }

  /**
   * Adds a single criterion to a stage.
   *
   * @param {Criterion} criterion The Criterion object to add
   */
  public addCriterionToStage(criterion: Criterion): void {
    this.stageProviderService.addOne(criterion.getId())
  }

  /**
   * Adds a single criterion to a stage.
   *
   * @param criterion The Criterion object to add
   * @param {string} id
   */
  public addCriterionByIdToStage(id: string): void {
    this.stageProviderService.addOne(id)
  }

  /**
   * Adds a single criterion to the CriterionProvider.
   *
   * @param {Criterion} criterion The Criterion object to add
   */
  public addCriterionToCriterionProvider(criterion: Criterion): void {
    this.criterionProviderService.setOne(criterion)
  }

  /**
   * Adds a single criterion to the CriterionProvider.
   *
   * @param {Criterion} criterion The Criterion object to add
   */
  public addCriterionToByIdCriterionProvider(criterion: Criterion): void {
    this.criterionProviderService.setOne(criterion)
  }

  /**
   * Adds multiple criteria to the CriterionProvider.
   *
   * @param {Criterion[]} criterions Array of Criterion objects
   */
  public addCriteriaToCriterionProvider(criterions: Criterion[]): void {
    this.criterionProviderService.setMany(criterions)
  }

  /**
   * Adds a feasibility query.
   *
   * @param query The feasibility query object
   * @param {FeasibilityQuery} feasibilityQuery
   */
  public addFeasibilityQuery(feasibilityQuery: FeasibilityQuery): void {
    this.feasibilityQueryProviderService.setFeasibilityQueryById(feasibilityQuery, feasibilityQuery.getId())
  }

  /**
   * Adds an active feasibility query.
   *
   * @param query The active feasibility query object
   * @param {FeasibilityQuery} feasibilityQuery
   */
  public addActiveFeasibilityQuery(feasibilityQuery: FeasibilityQuery): void {
    this.activeFEasibilityQueryProviderService.setActiveFeasibilityQueryID(feasibilityQuery.getId())
  }

  /**
   * Adds a reference criterion.
   *
   * @param criterion The Criterion object to add as a reference
   * @param {ReferenceCriterion} refernceCriterion
   */
  public addReferenceCriterion(refernceCriterion: ReferenceCriterion): void {
    this.referenceCriterionProviderService.setOne(refernceCriterion)
  }

  /**
   * Adds multiple reference criteria.
   *
   * @param criterions Array of Criterion objects to add as references
   * @param {ReferenceCriterion[]} referenceCriteria
   */
  public addReferenceCriteria(referenceCriteria: ReferenceCriterion[]): void {
    this.referenceCriterionProviderService.setMany(referenceCriteria)
  }

  /**
   * Adds a query result.
   *
   * @param {QueryResult} result The query result object
   */
  public addQueryResult(result: QueryResult): void {
    this.queryResultProviderService.setOne(result)
  }
}
