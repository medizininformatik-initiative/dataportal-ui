import { ProfileListEntry } from 'src/app/model/Search/ListEntries/ProfileListEntry'
import { ProfileResultList } from 'src/app/model/Search/ResultList/ProfileResultList'
import { MappingStrategy } from '../../../Interface/InterfaceMappingStrategy'
import { ProfileListEntryData } from 'src/app/model/Interface/Search/ProfileListEntryData'
import { ProfileResultListData } from 'src/app/model/Interface/Search/ProfileResultListData'

export class ProfileResultMapperStrategy
  implements MappingStrategy<ProfileListEntry, ProfileResultList>
{
  /**
   * Maps the API response to a ProfileResultList.
   * @param {ProfileResultListData} response
   * @returns {ProfileResultList}
   */
  public mapResponseToResultList(response: ProfileResultListData): ProfileResultList {
    const listItems: ProfileListEntry[] = this.mapResponseToEntries(response.results)
    return new ProfileResultList(response.totalHits, listItems)
  }

  /**
   * Maps the API response results to an array of ProfileListEntry.
   * @param {ProfileListEntryData[]} results
   * @returns {ProfileListEntry[]}
   */
  public mapResponseToEntries(results: ProfileListEntryData[]): ProfileListEntry[] {
    return results.map((resultItem: ProfileListEntryData) =>
      this.mapEntryDataToListEntry(resultItem)
    )
  }

  /**
   * Maps the ProfileListEntryData to a ProfileListEntry.
   * @param {ProfileListEntryData} entryData
   * @returns {ProfileListEntry}
   */
  private mapEntryDataToListEntry(entryData: ProfileListEntryData): ProfileListEntry {
    return ProfileListEntry.fromJson(entryData)
  }
}
