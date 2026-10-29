import { CriteriaListEntryData } from 'src/app/model/Interface/Search/CriteriaListListEntryData'
import { CriteriaListEntry } from 'src/app/model/Search/ListEntries/CriteriaListListEntry'
import { CriteriaResultList } from 'src/app/model/Search/ResultList/CriteriaResultList'
import { TypeAssertion } from 'src/app/service/TypeGuard/TypeAssersations'
import { AbstractResultMapper } from '../../../Abstract/Mapping/AbstractResultMapper'
export class CriteriaResultMapperStrategy extends AbstractResultMapper<CriteriaListEntry, CriteriaResultList> {
  /**
   * Maps the API response to a CriteriaResultList.
   * @param {any} response The API response object.
   * @returns {CriteriaResultList} A CriteriaResultList instance.
   */
  public mapResponseToResultList(response: any): CriteriaResultList {
    const listItems: CriteriaListEntry[] = this.mapResponseToEntries(response.results)
    return new CriteriaResultList(response.totalHits, listItems)
  }

  /**
   * Maps the API response to an array of CriteriaListEntry instances.
   * @param {CriteriaListEntryData[]} results The array of CriteriaListEntryData objects.
   * @returns {CriteriaListEntry[]} An array of CriteriaListEntry instances.
   */
  public mapResponseToEntries(results: CriteriaListEntryData[]): CriteriaListEntry[] {
    return results.map((resultItem: CriteriaListEntryData) => this.mapCriteriaListEntry(resultItem))
  }

  private mapCriteriaListEntry(data: CriteriaListEntryData): CriteriaListEntry {
    TypeAssertion.assertCriteriaListListEntryData(data)
    return CriteriaListEntry.fromJson(data)
  }
}
