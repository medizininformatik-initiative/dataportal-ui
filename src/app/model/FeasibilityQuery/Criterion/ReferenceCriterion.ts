import { Display } from '../../DataSelection/Profile/Display'
import { TerminologyCode } from '../../Terminology/TerminologyCode'
import { CritGroupPosition } from '../CritGroupPosition'
import { AbstractCriterion } from './AbstractCriterion'
import { AttributeFilter } from './AttributeFilter/AttributeFilter'
import { ValueFilter } from './AttributeFilter/ValueFilter'
import { AbstractTimeRestriction } from './TimeRestriction/AbstractTimeRestriction'

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
