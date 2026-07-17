import { AbstractDetails } from '../AbstractDetails'
import { CriteriaEntryRelatives } from './CriteriaEntryRelatives'
import { CriteriaRelationsData } from '../../../Interface/CriteriaRelationsData'
import { Display } from '../../../DataSelection/Profile/Display'

export class CriteriaEntryDetails extends AbstractDetails<CriteriaEntryRelatives> {
  constructor(
    children: CriteriaEntryRelatives[] = [],
    parents: CriteriaEntryRelatives[] = [],
    display: Display
  ) {
    super(display, parents, children)
  }

  public static fromJson(json: CriteriaRelationsData): CriteriaEntryDetails {
    const display = Display.fromJson(json.display)
    const parents = json.parents.map(CriteriaEntryRelatives.fromJson)
    const children = json.children.map(CriteriaEntryRelatives.fromJson)
    return new CriteriaEntryDetails(children, parents, display)
  }
}
