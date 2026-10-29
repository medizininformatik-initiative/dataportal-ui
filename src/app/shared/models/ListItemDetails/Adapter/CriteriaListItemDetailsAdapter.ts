import { CriteriaEntryDetails } from 'src/app/model/Search/EntryDetails/Criteria/CriteriaEntryDetails'
import { CriteriaEntryRelative } from 'src/app/model/Search/EntryDetails/Criteria/CriteriaEntryRelative'
import { ListItemDetailsRelativeData } from '../ListItemDetailsRelative'
import { AbstractListItemDetailsAdapter } from './AbstractListItemDetailsAdapter'

export class CriteriaListItemDetailsAdapter extends AbstractListItemDetailsAdapter<CriteriaEntryDetails, CriteriaEntryRelative> {
  /**
   * Returns an array of ListItemDetailsRelative objects adapted from the given array of CriteriaEntryRelatives.
   * @param {CriteriaEntryRelative[]} relatives
   * @returns {ListItemDetailsRelativeData[]}
   */
  protected adaptRelatives(relatives: CriteriaEntryRelative[]): ListItemDetailsRelativeData[] {
    return relatives.map((relative: CriteriaEntryRelative) => this.adaptRelative(relative))
  }

  /**
   * Returns a ListItemDetailsRelative object adapted from the given CriteriaEntryRelatives object.
   * @param {CriteriaEntryRelative} relative
   * @returns {ListItemDetailsRelativeData}
   */
  protected adaptRelative(relative: CriteriaEntryRelative): ListItemDetailsRelativeData {
    return {
      display: relative.getDisplay(),
      id: relative.getContextualizedTermcodeHash(),
      metadata: [relative.getTermcode(), relative.getTerminology()],
    }
  }
}
