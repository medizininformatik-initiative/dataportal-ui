import { AbstractCriterion } from './AbstractCriterion'
import { AbstractTimeRestriction } from './TimeRestriction/AbstractTimeRestriction'
import { AttributeFilter } from './AttributeFilter/AttributeFilter'
import { CritGroupPosition } from '../CritGroupPosition'
import { Display } from '../../DataSelection/Profile/Display'
import { TerminologyCode } from '../../Terminology/TerminologyCode'
import { ValueFilter } from './AttributeFilter/ValueFilter'

export class ReferenceCriterion extends AbstractCriterion {
  private parentId: string

  constructor(
    parentId: string,
    isReference: boolean,
    attributeFilters: Array<AttributeFilter>,
    context: TerminologyCode,
    criterionHash: string,
    display: Display,
    isRequiredFilterSet: boolean,
    position: CritGroupPosition,
    termCodes: Array<TerminologyCode>,
    timeRestriction: AbstractTimeRestriction,
    uniqueID: string,
    valueFilters: Array<ValueFilter>
  ) {
    super(
      isReference,
      attributeFilters,
      context,
      criterionHash,
      display,
      isRequiredFilterSet,
      position,
      termCodes,
      timeRestriction,
      uniqueID,
      valueFilters
    )

    this.parentId = parentId
  }

  public getParentId(): string {
    return this.parentId
  }

  public setParentId(parentId: string): void {
    this.parentId = parentId
  }
}
