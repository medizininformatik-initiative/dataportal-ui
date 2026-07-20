import { AbstractDetails } from '../AbstractDetails'
import { CriteriaEntryRelative } from './CriteriaEntryRelative'
import { CriteriaEntryDetailsData } from '../../../Interface/ListEntryDetailsData/CriteriaEntryDetailsData'
import { Display } from '../../../DataSelection/Profile/Display'

export class CriteriaEntryDetails extends AbstractDetails<CriteriaEntryRelative> {
  constructor(
    children: CriteriaEntryRelative[] = [],
    parents: CriteriaEntryRelative[] = [],
    display: Display
  ) {
    super(display, parents, children)
  }

  public static fromJson(json: CriteriaEntryDetailsData): CriteriaEntryDetails {
    const display = Display.fromJson(json.display)
    const parents = json.parents.map(CriteriaEntryRelative.fromJson)
    const children = json.children.map(CriteriaEntryRelative.fromJson)
    return new CriteriaEntryDetails(children, parents, display)
  }
}
