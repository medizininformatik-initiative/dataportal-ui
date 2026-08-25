import { AbstractListItemDetailsAdapter } from './AbstractListItemDetailsAdapter'
import { ListItemDetailsData } from '../ListItemDetailsData'
import { ListItemDetailsRelativeData } from '../ListItemDetailsRelative'
import { ProfileEntryDetails } from 'src/app/model/Search/EntryDetails/Profile/ProfileEntryDetails'
import { ProfileEntryDetailsField } from 'src/app/model/Search/EntryDetails/Profile/ProfileEntryDetailsField'
import { ProfileEntryRelative } from 'src/app/model/Search/EntryDetails/Profile/ProfileEntryRelative'
import { v4 as uuidv4 } from 'uuid'
export class ProfileListItemDetailsAdapter extends AbstractListItemDetailsAdapter<
  ProfileEntryDetails,
  ProfileEntryRelative
> {
  public adapt(detailsData: ProfileEntryDetails): ListItemDetailsData {
    const result: ListItemDetailsData = {
      display: detailsData.getDisplay(),
      selectable: detailsData.getSelectable(),
    }

    const parents = detailsData.getParents()
    if (parents.length) {
      result.parents = this.adaptRelatives(parents)
    }

    const children = detailsData.getChildren()
    if (children.length) {
      result.children = this.adaptRelatives(children)
    }

    const fields = detailsData.getFields()
    if (fields.length) {
      result.fields = this.adaptFields(fields)
    }

    const description = detailsData.getDescription()
    if (description) {
      result.description = description
    }

    return result
  }

  private adaptFields(fields: ProfileEntryDetailsField[]): ListItemDetailsRelativeData[] {
    return fields.map((field) => {
      return {
        display: field.getDisplay(),
        id: uuidv4(),
        description: field.getDescription(),
      }
    })
  }

  /**
   * @param {ProfileEntryRelative[]} relatives The array of profile entry relatives to adapt.
   * @returns {ListItemDetailsRelativeData[]} The adapted list item details relative data.
   */
  protected adaptRelatives(relatives: ProfileEntryRelative[]): ListItemDetailsRelativeData[] {
    return relatives.map((relative) => this.adaptRelative(relative))
  }

  /**
   *
   * @param {ProfileEntryRelative} relative The profile entry relative to adapt.
   * @returns {ListItemDetailsRelativeData} The adapted list item details relative data.
   */
  private adaptRelative(relative: ProfileEntryRelative): ListItemDetailsRelativeData {
    return {
      display: relative.getDisplay(),
      id: relative.getId(),
    }
  }
}
