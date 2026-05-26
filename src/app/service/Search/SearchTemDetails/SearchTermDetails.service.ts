import { CriteriaRelationsData } from 'src/app/model/Interface/CriteriaRelationsData'
import { CriteriaRelativeData } from 'src/app/model/Interface/CriteriaRelativesData'
import { Display } from '../../../model/DataSelection/Profile/Display'
import { DisplayData } from 'src/app/model/Interface/DisplayData'
import { Injectable, inject } from '@angular/core'
import { map } from 'rxjs/operators'
import { Observable } from 'rxjs'
import { SearchTermDetails } from 'src/app/model/Search/SearchDetails/SearchTermDetails'
import { SearchTermDetailsProviderService } from './SearchTermDetailsProvider.service'
import { SearchTermRelatives } from 'src/app/model/Search/SearchDetails/SearchTermRelatives'
import { TerminologyApiService } from '../../Backend/Api/TerminologyApi.service'
import { TypeAssertion } from '../../TypeGuard/TypeAssersations'

@Injectable({
  providedIn: 'root',
})
export class SearchTermDetailsService {
  private terminologyApiService = inject(TerminologyApiService)
  private searchTermDetailsProviderService = inject(SearchTermDetailsProviderService)

  /** Inserted by Angular inject() migration for backwards compatibility */
  constructor(...args: unknown[])

  constructor() {}

  /**
   * Retrieves details for a specific list item.
   *
   * @param id The ID of the list item.
   * @returns An Observable emitting the details of the list item.
   */
  public getDetailsForListItem(id: string): Observable<SearchTermDetails> {
    return this.terminologyApiService.getSearchTermEntryRelations(id).pipe(
      map((response: CriteriaRelationsData) => {
        TypeAssertion.assertCriteriaRelationsData(response)
        SearchTermDetails.fromJson(response)
        const translations = this.mapToSearchTermTranslationDisplay(response.display)
        const parents = this.mapToSearchTermRelatives(response.parents)
        const children = this.mapToSearchTermRelatives(response.children)
        const searchTermDetails = new SearchTermDetails(children, parents, translations)
        this.searchTermDetailsProviderService.setSearchTermDetails(searchTermDetails)
        return searchTermDetails
      })
    )
  }

  private mapToSearchTermTranslationDisplay(display: DisplayData): Display {
    TypeAssertion.assertDisplayData(display)
    return Display.fromJson(display)
  }

  /**
   * Maps raw relative response to CriteriaRelatives objects.
   *
   * @param relatives Raw relative response.
   * @returns An array of CriteriaRelative objects.
   */
  private mapToSearchTermRelatives(relatives: CriteriaRelativeData[]): SearchTermRelatives[] {
    return relatives.map((relativeData: CriteriaRelativeData) =>
      this.mapToCriteriaRelative(relativeData)
    )
  }

  private mapToCriteriaRelative(relative: CriteriaRelativeData): SearchTermRelatives {
    TypeAssertion.assertCriteriaRelativeData(relative)
    return SearchTermRelatives.fromJson(relative)
  }
}
