import { TerminologyCode } from 'src/app/model/Terminology/TerminologyCode'
import { FilterTypes } from 'src/app/model/Utilities/FilterTypes'
import { AbstractStructuredQueryFilters } from '../../Abstract/AbstractStructuredQueryFilters'
import { StructuredQueryCriterion } from '../../StructuredQueryCriterion'

/**
 * Class for reference filters in a structured query.
 *
 * This class extends the base structured query filters to include criteria
 * specific to reference filters.
 */
export class ReferenceFilter extends AbstractStructuredQueryFilters {
  private criteria: StructuredQueryCriterion[]
  protected type: FilterTypes = FilterTypes.REFERENCE
  private attributeCode: TerminologyCode

  /**
   * Constructor to initialize the ReferenceFilter with attribute code and criteria.
   *
   * @param attributeCode - The attribute code for the filter.
   * @param criteria - The criteria for the filter.
   */
  constructor(attributeCode: TerminologyCode, criteria: StructuredQueryCriterion[]) {
    super()
    this.criteria = criteria
    this.attributeCode = attributeCode
  }

  /**
   * Gets the criteria value.
   *
   * @returns The criteria value.
   */
  public getCriteria(): StructuredQueryCriterion[] {
    return this.criteria
  }

  /**
   * Sets the criteria value.
   *
   * @param criteria - The new criteria value to set.
   */
  public setCriteria(criteria: StructuredQueryCriterion[]): void {
    this.criteria = criteria
  }

  /**
   * Gets the type value.
   *
   * @returns The type value.
   */
  public getType(): FilterTypes {
    return this.type
  }

  /**
   * Gets the attributeCode value.
   *
   * @returns The attributeCode value.
   */
  public getAttributeCode(): TerminologyCode {
    return this.attributeCode
  }

  /**
   * Sets the attributeCode value.
   *
   * @param attributeCode - The new attributeCode value to set.
   */
  public setAttributeCode(attributeCode: TerminologyCode): void {
    this.attributeCode = attributeCode
  }

  /**
   * Creates a filter from the given values.
   *
   * @param attributeCode
   * @param structuredQueryCriterion
   */
  public static createFilter(attributeCode: TerminologyCode, structuredQueryCriterion: StructuredQueryCriterion[]): ReferenceFilter {
    return new ReferenceFilter(attributeCode, structuredQueryCriterion)
  }
}
