import { Display } from 'src/app/model/DataSelection/Profile/Display'
import { DisplayData } from 'src/app/model/Interface/DisplayData'
import { ProfileEntryDetails } from 'src/app/model/Search/SearchDetails/ProfileEntryDetails'
import { ProfileEntryRelative } from 'src/app/model/Search/SearchDetails/ProfileEntryRelative'
import { SearchTermDetails } from 'src/app/model/Search/SearchDetails/SearchTermDetails'
import { SearchTermRelatives } from 'src/app/model/Search/SearchDetails/SearchTermRelatives'

export interface ListItemDetailsRelative {
  display: Display
  id: string
  metadata?: string[]
}

export interface ListItemDetailsData {
  parents?: ListItemDetailsRelative[]
  children?: ListItemDetailsRelative[]
  display: Display
  fields?: Display[]
}

export class CriteriaListItemDetailsAdapter {
  public static adapt(detailsData: SearchTermDetails): ListItemDetailsData {
    const parents = detailsData.getParents()
    const children = detailsData.getChildren()
    return {
      display: detailsData.getDisplay(),
      parents: CriteriaListItemDetailsAdapter.adaptRelatives(parents),
      children: CriteriaListItemDetailsAdapter.adaptRelatives(children),
    }
  }

  protected static adaptRelatives(relatives: SearchTermRelatives[]): ListItemDetailsRelative[] {
    return relatives.map((relative) => {
      return {
        display: relative.getDisplay(),
        id: relative.getContextualizedTermcodeHash(),
        metadata: [relative.getTermcode(), relative.getTerminology()],
      }
    })
  }
}

export class ProfileListItemDetailsAdapter {
  public static adapt(detailsData: ProfileEntryDetails): ListItemDetailsData {
    const parents = detailsData.getParents()
    const children = detailsData.getChildren()
    const fields = detailsData.getFields()
    return {
      display: detailsData.getDisplay(),
      parents: ProfileListItemDetailsAdapter.adaptRelatives(parents),
      children: ProfileListItemDetailsAdapter.adaptRelatives(children),
      fields: fields,
    }
  }

  protected static adaptRelatives(relatives: ProfileEntryRelative[]): ListItemDetailsRelative[] {
    return relatives.map((relative) => {
      return {
        display: relative.getDisplay(),
        id: relative.getId(),
      }
    })
  }
}
