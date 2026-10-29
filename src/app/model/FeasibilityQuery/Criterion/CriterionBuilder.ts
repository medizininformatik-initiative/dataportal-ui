import { Display } from '../../DataSelection/Profile/Display'
import { TerminologyCode } from '../../Terminology/TerminologyCode'
import { CritGroupPosition } from '../CritGroupPosition'
import { AttributeFilter } from './AttributeFilter/AttributeFilter'
import { ValueFilter } from './AttributeFilter/ValueFilter'
import { Criterion } from './Criterion'
import { ReferenceCriterion } from './ReferenceCriterion'
import { AbstractTimeRestriction } from './TimeRestriction/AbstractTimeRestriction'
import { TimeRestrictionNotSet } from './TimeRestriction/TimeRestrictionNotSet'

/**
 * Builder class for constructing instances of AbstractCriterion and its subclasses.
 */
export class CriterionBuilder {
  private hasReference = false
  private attributeFilters?: Array<AttributeFilter> = []
  private context?: TerminologyCode
  private criterionHash?: string
  private display?: Display
  private isInvalid?: boolean
  private isRequiredFilterSet: boolean
  private parentId: string
  private position?: CritGroupPosition
  private termCodes?: Array<TerminologyCode>
  private timeRestriction?: AbstractTimeRestriction
  private id?: string
  private valueFilters?: Array<ValueFilter> = []

  /**
   * Creates a new CriterionBuilder.
   *
   * @param {{ isReference: boolean context: TerminologyCode criterionHash: string display: Display isRequiredFilterSet: boolean id: string termCodes: Array<TerminologyCode> }} mandatoryFields
   * @param {{ isReference: boolean context: TerminologyCode criterionHash: string display: Display isRequiredFilterSet: boolean id: string termCodes: Array<TerminologyCode> }} mandatoryFields.isReference
   * @param {{ isReference: boolean context: TerminologyCode criterionHash: string display: Display isRequiredFilterSet: boolean id: string termCodes: Array<TerminologyCode> }} mandatoryFields.context
   * @param {{ isReference: boolean context: TerminologyCode criterionHash: string display: Display isRequiredFilterSet: boolean id: string termCodes: Array<TerminologyCode> }} mandatoryFields.criterionHash
   * @param {{ isReference: boolean context: TerminologyCode criterionHash: string display: Display isRequiredFilterSet: boolean id: string termCodes: Array<TerminologyCode> }} mandatoryFields.display
   * @param {{ isReference: boolean context: TerminologyCode criterionHash: string display: Display isRequiredFilterSet: boolean id: string termCodes: Array<TerminologyCode> }} mandatoryFields.isRequiredFilterSet
   * @param {{ isReference: boolean context: TerminologyCode criterionHash: string display: Display isRequiredFilterSet: boolean id: string termCodes: Array<TerminologyCode> }} mandatoryFields.id
   * @param {{ isReference: boolean context: TerminologyCode criterionHash: string display: Display isRequiredFilterSet: boolean id: string termCodes: Array<TerminologyCode> }} mandatoryFields.termCodes
   */
  constructor(
    private readonly mandatoryFields: {
      isReference: boolean
      context: TerminologyCode
      criterionHash: string
      display: Display
      isRequiredFilterSet: boolean
      id: string
      termCodes: Array<TerminologyCode>
    }
  ) {
    this.context = mandatoryFields.context
    this.criterionHash = mandatoryFields.criterionHash
    this.display = mandatoryFields.display
    this.isRequiredFilterSet = mandatoryFields.isRequiredFilterSet
    this.id = mandatoryFields.id
    this.termCodes = mandatoryFields.termCodes
  }

  public withAttributeFilters(attributeFilters: Array<AttributeFilter>): CriterionBuilder {
    this.attributeFilters = attributeFilters
    return this
  }

  public withAttributeFilter(attributeFilter: AttributeFilter): CriterionBuilder {
    if (this.attributeFilters.length > 0) {
      const index = this.attributeFilters.findIndex(
        (existingAttributeFilter: AttributeFilter) =>
          attributeFilter.getAttributeCode()?.getCode() === existingAttributeFilter.getAttributeCode()?.getCode()
      )
      if (index !== -1) {
        this.attributeFilters[index] = attributeFilter
      } else {
        this.attributeFilters.push(attributeFilter)
      }
    } else {
      this.attributeFilters.push(attributeFilter)
    }
    return this
  }

  public withContext(context: TerminologyCode): CriterionBuilder {
    this.context = context
    return this
  }

  public withCriterionHash(criterionHash: string): CriterionBuilder {
    this.criterionHash = criterionHash
    return this
  }

  public withDisplay(display: Display): CriterionBuilder {
    this.display = display
    return this
  }

  public withIsInvalid(isInvalid: boolean): CriterionBuilder {
    this.isInvalid = isInvalid
    return this
  }

  public withPosition(position: CritGroupPosition): CriterionBuilder {
    this.position = position
    return this
  }

  public withTermCodes(termCodes: Array<TerminologyCode>): CriterionBuilder {
    this.termCodes = termCodes
    return this
  }

  public withTimeRestriction(timeRestriction: AbstractTimeRestriction): CriterionBuilder {
    this.timeRestriction = timeRestriction
    return this
  }

  public withId(id: string): CriterionBuilder {
    this.id = id
    return this
  }

  public withValueFilters(valueFilters: ValueFilter[]): CriterionBuilder {
    if (this.valueFilters.length === 0) {
      this.valueFilters.push(...valueFilters)
    } else {
      this.valueFilters = valueFilters
    }

    return this
  }

  public withRequiredFilter(withFilter: boolean): CriterionBuilder {
    this.isRequiredFilterSet = withFilter
    return this
  }

  public withHasReference(hasReference: boolean): CriterionBuilder {
    this.hasReference = hasReference
    return this
  }

  public withParentId(id: string): CriterionBuilder {
    this.parentId = id
    return this
  }

  /**
   * Builds a Criterion instance using the current builder configuration.
   *
   * @returns {Criterion} Criterion instance.
   */
  public buildCriterion(): Criterion {
    return new Criterion(
      false,
      this.attributeFilters,
      this.context,
      this.criterionHash,
      this.display,
      this.isRequiredFilterSet,
      this.position,
      this.termCodes,
      this.timeRestriction,
      this.id,
      this.valueFilters
    )
  }

  /**
   * Builds a ReferenceCriterion instance using the current builder configuration.
   * @instance
   * @returns {ReferenceCriterion}
   */
  public buildReferenceCriterion(): ReferenceCriterion {
    return new ReferenceCriterion(
      this.parentId,
      true,
      this.attributeFilters,
      this.context,
      this.criterionHash,
      this.display,
      this.isRequiredFilterSet,
      this.position,
      this.termCodes,
      this.timeRestriction,
      this.id,
      this.valueFilters
    )
  }

  public buildEmptyTimeRestriction() {
    return new TimeRestrictionNotSet()
  }
}
