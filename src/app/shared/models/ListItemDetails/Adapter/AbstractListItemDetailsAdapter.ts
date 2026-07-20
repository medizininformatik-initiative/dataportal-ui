import { AbstractDetails } from 'src/app/model/Search/EntryDetails/AbstractDetails'
import { AbstractRelative } from 'src/app/model/Search/EntryDetails/AbstractRelative'
import { ListItemDetailsData } from '../ListItemDetailsData'
import { ListItemDetailsRelativeData } from '../ListItemDetailsRelative'

export abstract class AbstractListItemDetailsAdapter<
  D extends AbstractDetails<T>,
  T extends AbstractRelative
> {
  /**
   *
   * @param {D extends AbstractDetails<T>} detailsData The details data to adapt.
   * @returns {ListItemDetailsData} The adapted list item details data.
   */
  public adapt(detailsData: D): ListItemDetailsData {
    const result: ListItemDetailsData = {
      display: detailsData.getDisplay(),
    }

    const parents = detailsData.getParents()
    if (parents.length) {
      result.parents = this.adaptRelatives(parents)
    }

    const children = detailsData.getChildren()
    if (children.length) {
      result.children = this.adaptRelatives(children)
    }

    return result
  }

  /**
   * Adapts an array of relatives to an array of ListItemDetailsRelative objects.
   * @param relatives The array of relatives to adapt.
   * @returns An array of ListItemDetailsRelative objects.
   */
  protected abstract adaptRelatives(relatives: T[]): ListItemDetailsRelativeData[]
}
