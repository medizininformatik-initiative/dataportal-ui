import { CCDLCohortDefinition } from '../../CohortDefinition/CCDLCohortDefinition'
import { DataExtraction } from './DataExtraction'

/**
 * CRTDL (Common Research Data Transfer Language) class.
 * Represents the complete data structure for cohort definition and data extraction.
 */
export class CRTDL {
  /** @type {CCDLCohortDefinition} The cohort definition query */
  private readonly cohortDefinition: CCDLCohortDefinition

  /** @type {DataExtraction} The data extraction configuration */
  private readonly dataExtraction: DataExtraction

  /** @type {string} JSON schema version identifier */
  private readonly version = 'http://json-schema.org/to-be-done/schema#'

  /** @type {string} Display name for the CRTDL */
  private readonly display = ''

  /**
   * Creates a new CRTDL instance.
   * @param {CCDLCohortDefinition} [cohortDefinition] - The cohort definition query
   * @param {DataExtraction} [dataExtraction] - The data extraction configuration
   */
  constructor(cohortDefinition: CCDLCohortDefinition, dataExtraction: DataExtraction) {
    this.cohortDefinition = cohortDefinition
    this.dataExtraction = dataExtraction
  }

  /**
   * Gets the display name for the CRTDL.
   * @returns {string} The display name
   */
  public getDisplay(): string {
    return this.display
  }

  /**
   * Gets the JSON schema version.
   * @returns {string} The version identifier
   */
  public getVersion(): string {
    return this.version
  }

  /**
   * Gets the cohort definition query.
   * @returns {CCDLCohortDefinition} The cohort definition
   */
  public getCohortDefinition(): CCDLCohortDefinition {
    return this.cohortDefinition
  }

  /**
   * Gets the data extraction configuration.
   * @returns {DataExtraction} The data extraction configuration
   */
  public getDataExtraction(): DataExtraction {
    return this.dataExtraction
  }
}
