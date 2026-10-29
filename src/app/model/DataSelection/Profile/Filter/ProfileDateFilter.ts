import { AbstractTimeRestriction } from 'src/app/model/FeasibilityQuery/Criterion/TimeRestriction/AbstractTimeRestriction'
import { DataSelectionUIType } from 'src/app/model/Utilities/DataSelectionUIType'
import { AbstractProfileFilter } from './AbstractProfileFilter'

export class ProfileTimeRestrictionFilter extends AbstractProfileFilter {
  private timeRestriction: AbstractTimeRestriction
  protected uiType: DataSelectionUIType = DataSelectionUIType.TIMERESTRICTION

  constructor(name: string, type: string, timeRestriction: AbstractTimeRestriction) {
    super(type, name)
    this.timeRestriction = timeRestriction
  }

  public setTimeRestriction(timeRestriction: AbstractTimeRestriction) {
    this.timeRestriction = timeRestriction
  }

  public getTimeRestriction(): AbstractTimeRestriction {
    return this.timeRestriction
  }
}
