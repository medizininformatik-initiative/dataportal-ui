import { StructuredQueryCriterion } from './Criterion/StructuredQueryCriterion'

export class StructuredQuery {
  private readonly version: string = 'http://to_be_decided.com/draft-1/schema#'
  private display = ''

  private inclusionCriteria: StructuredQueryCriterion[][] = []
  private exclusionCriteria: StructuredQueryCriterion[][] = []

  /**
   * Creates a new StructuredQuery.
   *
   * @param inclusionCriteria
   * @param exclusionCriteria
   * @param display
   */
  constructor(inclusionCriteria: StructuredQueryCriterion[][], exclusionCriteria: StructuredQueryCriterion[][], display?: string) {
    this.inclusionCriteria = inclusionCriteria
    this.exclusionCriteria = exclusionCriteria
    this.display = display
  }

  public getInclusionCriteria(): StructuredQueryCriterion[][] {
    return this.inclusionCriteria
  }

  /**
   * Sets the inclusion criteria.
   *
   * @param criteria
   */
  public setInclusionCriteria(criteria: StructuredQueryCriterion[][]): void {
    this.inclusionCriteria = criteria
  }

  public getExclusionCriteria(): StructuredQueryCriterion[][] {
    return this.exclusionCriteria
  }

  /**
   * Sets the exclusion criteria.
   *
   * @param criteria
   */
  public setExclusionCriteria(criteria: StructuredQueryCriterion[][]): void {
    this.exclusionCriteria = criteria
  }

  public getVersion(): string {
    return this.version
  }

  public getDisplay(): string {
    return this.display
  }

  /**
   * Sets the display.
   *
   * @param display
   */
  public setDisplay(display: string): void {
    this.display = display
  }
}
