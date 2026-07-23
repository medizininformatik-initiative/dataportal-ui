// The atomic building block of a query is a Criterion (e.g. "Geschlecht: weiblich")
//
// We have following hierarchy from Query (top) to Criterion (bottom):
//
//    Query               contains Groups
//    Group               contains inclusion and exclusion criteria - it may also be related to one dependent child Group
//
//                        The inclusion criteria of type Criterion[][] are interpreted as (conjunctive normal form)
//                              (inclusion[0][0] or  inclusion[0][1] or  ...)
//                          and (inclusion[1][0] or  inclusion[1][1] or  ...)
//                          and
//                          ...
//                          and (inclusion[n][0] or  inclusion[n][1] or  ...)
//
//                        The exclusion criteria of type Criterion[][] are interpreted as (disjunctive normal form)
//                              (exclusion[0][0] and exclusion[0][1] and ...)
//                          or  (exclusion[1][0] and exclusion[1][1] and ...)
//                          or
//                          ...
//                          or  (exclusion[n][0] and exclusion[n][1] and ...)
//
//    Criterion           atomic building block of a query
//
/**
 * Represents a query with display name, consent, inclusion criteria, and exclusion criteria.
 */
export class FeasibilityQuery {
  private id: string
  private resultIDs: string[] = []
  private consent = false
  private display: string
  private version = ''
  private inclusionCriteria: string[][]
  private exclusionCriteria: string[][]

  /**
   * Constructor to initialize the Query with display and consent.
   *
   * @param id - The id of the query.
   * @param display - The display name of the query.
   * @param consent - The consent status of the query.
   */
  constructor(
    id: string,
    display: string = 'Ausgewählte Merkmale',
    consent: boolean = false,
    resultIDs: string[] = []
  ) {
    this.id = id
    this.consent = consent
    this.display = display
    this.inclusionCriteria = []
    this.exclusionCriteria = []
    this.resultIDs = resultIDs
  }

  getId(): string {
    return this.id
  }
  /**
   * Gets the consent name of the query.
   *
   * @returns The consent name of the query.
   */
  getConsent(): boolean {
    return this.consent
  }

  /**
   * Sets the consent name of the query.
   *
   * @param consent - The new consent name of the query.
   */
  setConsent(consent: boolean): void {
    this.consent = consent
  }

  /**
   * Gets the display name of the query.
   *
   * @returns The display name of the query.
   */
  getDisplay(): string {
    return this.display
  }

  /**
   * Sets the display name of the query.
   *
   * @param display - The new display name of the query.
   */
  setDisplay(display: string): void {
    this.display = display
  }

  /**
   * Gets the inclusion criteria of the query.
   *
   * @returns The inclusion criteria of the query.
   */
  getInclusionCriteria(): string[][] {
    return this.inclusionCriteria
  }

  /**
   * Sets the inclusion criteria of the query.
   *
   * @param inclusionCriteria - The new inclusion criteria of the query.
   */
  setInclusionCriteria(inclusionCriteria: string[][]): void {
    this.inclusionCriteria = inclusionCriteria
  }

  /**
   * Gets the exclusion criteria of the query.
   *
   * @returns The exclusion criteria of the query.
   */
  getExclusionCriteria(): string[][] {
    return this.exclusionCriteria
  }

  /**
   * Sets the exclusion criteria of the query.
   *
   * @param exclusionCriteria - The new exclusion criteria of the query.
   */
  setExclusionCriteria(exclusionCriteria: string[][]): void {
    this.exclusionCriteria = exclusionCriteria
  }

  public getResultIds(): string[] {
    return this.resultIDs
  }

  public setResultIds(resultIds: string[]): void {
    this.resultIDs = resultIds
  }

  public addResultId(resultId: string): void {
    this.resultIDs.push(resultId)
  }

  public clone(): FeasibilityQuery {
    const copy = new FeasibilityQuery(this.id, this.display, this.consent, [...this.resultIDs])

    copy.version = this.version

    copy.setInclusionCriteria(this.inclusionCriteria.map((group) => [...group]))

    copy.setExclusionCriteria(this.exclusionCriteria.map((group) => [...group]))

    return copy
  }
}
