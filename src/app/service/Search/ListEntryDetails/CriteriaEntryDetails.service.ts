import { inject, Injectable } from '@angular/core'
import { Observable } from 'rxjs'
import { map } from 'rxjs/operators'
import { DisplayData } from 'src/app/model/Interface/DisplayData'
import { CriteriaEntryDetailsData } from 'src/app/model/Interface/ListEntryDetailsData/CriteriaEntryDetailsData'
import { CriteriaRelativeData } from 'src/app/model/Interface/ListEntryDetailsData/CriteriaRelativeData'
import { CriteriaEntryDetails } from 'src/app/model/Search/EntryDetails/Criteria/CriteriaEntryDetails'
import { CriteriaEntryRelative } from 'src/app/model/Search/EntryDetails/Criteria/CriteriaEntryRelative'
import { Display } from '../../../model/DataSelection/Profile/Display'
import { TerminologyApiService } from '../../Backend/Api/TerminologyApi.service'
import { TypeAssertion } from '../../TypeGuard/TypeAssersations'
import { AbstractEntryDetailsService } from './AbstractEntryDetailsService'
import { CriteriaEntryDetailsProviderService } from './CriteriaEntryDetailsProvider.service'

@Injectable({
  providedIn: 'root',
})
export class CriteriaEntryDetailsService extends AbstractEntryDetailsService<CriteriaEntryRelative, CriteriaEntryDetails> {
  private readonly terminologyApiService = inject(TerminologyApiService)
  private readonly criteriaEntryDetailsProviderService = inject(CriteriaEntryDetailsProviderService)

  /**
   * Loads the details and relations of a criteria entry.
   * @param {string} id
   * @returns {Observable<CriteriaEntryDetails>}
   */
  public loadDetails(id: string): Observable<CriteriaEntryDetails> {
    return this.terminologyApiService.getCriteriaEntryRelations(id).pipe(map((response) => this.mapCriteriaRelationData(response)))
  }

  /**
   * Validates the response and maps it to criteria entry details.
   * @param {CriteriaEntryDetailsData} response
   * @returns {CriteriaEntryDetails}
   */
  private mapCriteriaRelationData(response: CriteriaEntryDetailsData): CriteriaEntryDetails {
    TypeAssertion.assertCriteriaEntryDetailsData(response)

    const translations = this.mapDisplay(response.display)
    const parents = this.mapRelativeData(response.parents)
    const children = this.mapRelativeData(response.children)

    const details = new CriteriaEntryDetails(children, parents, translations, response.selectable)
    this.criteriaEntryDetailsProviderService.setCriteriaEntryDetails(details)

    return details
  }

  /**
   * Validates the display data and maps it to a display.
   * @param {DisplayData} display
   * @returns {Display}
   */
  private mapDisplay(display: DisplayData): Display {
    TypeAssertion.assertDisplayData(display)
    return Display.fromJson(display)
  }

  /**
   * Maps the relative data to criteria entry relatives.
   * @param {CriteriaRelativeData[]} relatives
   * @returns {CriteriaEntryRelative[]}
   */
  protected mapRelativeData(relatives: CriteriaRelativeData[]): CriteriaEntryRelative[] {
    return relatives.map((relativeData: CriteriaRelativeData) => this.mapToCriteriaRelative(relativeData))
  }

  /**
   * Validates the relative data and maps it to a criteria entry relative.
   * @param {CriteriaRelativeData} relative
   * @returns {CriteriaEntryRelative}
   */
  private mapToCriteriaRelative(relative: CriteriaRelativeData): CriteriaEntryRelative {
    TypeAssertion.assertCriteriaRelativeData(relative)
    return CriteriaEntryRelative.fromJson(relative)
  }
}
