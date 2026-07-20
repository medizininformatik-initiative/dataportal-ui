import { AbstractEntryDetailsService } from './AbstractEntryDetailsService'
import { CriteriaEntryDetails } from 'src/app/model/Search/EntryDetails/Criteria/CriteriaEntryDetails'
import { CriteriaEntryDetailsProviderService } from './CriteriaEntryDetailsProvider.service'
import { CriteriaEntryRelative } from 'src/app/model/Search/EntryDetails/Criteria/CriteriaEntryRelative'
import { CriteriaEntryDetailsData } from 'src/app/model/Interface/ListEntryDetailsData/CriteriaEntryDetailsData'
import { CriteriaRelativeData } from 'src/app/model/Interface/ListEntryDetailsData/CriteriaRelativeData'
import { Display } from '../../../model/DataSelection/Profile/Display'
import { DisplayData } from 'src/app/model/Interface/DisplayData'
import { inject, Injectable } from '@angular/core'
import { map } from 'rxjs/operators'
import { Observable } from 'rxjs'
import { TerminologyApiService } from '../../Backend/Api/TerminologyApi.service'
import { TypeAssertion } from '../../TypeGuard/TypeAssersations'

@Injectable({
  providedIn: 'root',
})
export class CriteriaEntryDetailsService extends AbstractEntryDetailsService<
  CriteriaEntryRelative,
  CriteriaEntryDetails
> {
  private terminologyApiService = inject(TerminologyApiService)
  private criteriaEntryDetailsProviderService = inject(CriteriaEntryDetailsProviderService)

  public loadDetails(id: string): Observable<CriteriaEntryDetails> {
    return this.terminologyApiService
      .getCriteriaEntryRelations(id)
      .pipe(map((response) => this.mapCriteriaRelationData(response)))
  }

  private mapCriteriaRelationData(response: CriteriaEntryDetailsData): CriteriaEntryDetails {
    TypeAssertion.assertCriteriaEntryDetailsData(response)

    const translations = this.mapDisplay(response.display)
    const parents = this.mapRelativeData(response.parents)
    const children = this.mapRelativeData(response.children)

    const details = new CriteriaEntryDetails(children, parents, translations)
    this.criteriaEntryDetailsProviderService.setCriteriaEntryDetails(details)

    return details
  }

  private mapDisplay(display: DisplayData): Display {
    TypeAssertion.assertDisplayData(display)
    return Display.fromJson(display)
  }

  protected mapRelativeData(relatives: CriteriaRelativeData[]): CriteriaEntryRelative[] {
    return relatives.map((relativeData: CriteriaRelativeData) =>
      this.mapToCriteriaRelative(relativeData)
    )
  }

  private mapToCriteriaRelative(relative: CriteriaRelativeData): CriteriaEntryRelative {
    TypeAssertion.assertCriteriaRelativeData(relative)
    return CriteriaEntryRelative.fromJson(relative)
  }
}
