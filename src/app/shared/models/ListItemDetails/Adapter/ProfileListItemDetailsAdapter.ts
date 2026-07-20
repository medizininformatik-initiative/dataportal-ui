import { AbstractListItemDetailsAdapter } from './AbstractListItemDetailsAdapter'
import { ListItemDetailsData } from '../ListItemDetailsData'
import { ListItemDetailsRelativeData } from '../ListItemDetailsRelative'
import { ProfileEntryDetails } from 'src/app/model/Search/EntryDetails/Profile/ProfileEntryDetails'
import { ProfileEntryRelative } from 'src/app/model/Search/EntryDetails/Profile/ProfileEntryRelative'
import { Display } from 'src/app/model/DataSelection/Profile/Display'
import { Translation } from 'src/app/model/DataSelection/Profile/Translation'

export class ProfileListItemDetailsAdapter extends AbstractListItemDetailsAdapter<
  ProfileEntryDetails,
  ProfileEntryRelative
> {
  public adapt(detailsData: ProfileEntryDetails): ListItemDetailsData {
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

    const fields = detailsData.getFields()
    if (fields.length) {
      result.fields = this.adaptFields(fields)
    }

    return result
  }

  private adaptFields(fields: Display[]): Display {
    const original = fields.map((field) => field.getOriginal()).join(', ')

    const de = fields.map((field) => field.translate('de')).join(', ')

    const en = fields.map((field) => field.translate('en')).join(', ')

    return new Display([new Translation('de-DE', de), new Translation('en-US', en)], original)
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
