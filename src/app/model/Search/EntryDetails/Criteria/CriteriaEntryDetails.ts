import { Display } from '../../../DataSelection/Profile/Display'
import { CriteriaEntryDetailsData } from '../../../Interface/ListEntryDetailsData/CriteriaEntryDetailsData'
import { AbstractDetails } from '../AbstractDetails'
import { CriteriaEntryRelative } from './CriteriaEntryRelative'

export class CriteriaEntryDetails extends AbstractDetails<CriteriaEntryRelative> {
  constructor(children: CriteriaEntryRelative[] = [], parents: CriteriaEntryRelative[] = [], display: Display, selectable: boolean) {
    super(display, parents, children, selectable)
  }

  public static fromJson(json: CriteriaEntryDetailsData): CriteriaEntryDetails {
    const display = Display.fromJson(json.display)
    const parents = json.parents.map(CriteriaEntryRelative.fromJson)
    const children = json.children.map(CriteriaEntryRelative.fromJson)
    return new CriteriaEntryDetails(children, parents, display, json.selectable)
  }
}
