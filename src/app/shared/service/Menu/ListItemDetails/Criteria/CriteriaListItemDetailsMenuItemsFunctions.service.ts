import { CriteriaByIdSearchService } from 'src/app/service/Search/SearchTypes/CriteriaById/CriteriaByIdSearch.service'
import { CriteriaResultList } from 'src/app/model/Search/ResultList/CriteriaResultList'
import { CriteriaSearchService } from 'src/app/service/Search/SearchTypes/Criteria/CriteriaSearch.service'
import { Criterion } from 'src/app/model/FeasibilityQuery/Criterion/Criterion'
import { FeasibilityQueryProviderHub } from 'src/app/service/Provider/FeasibilityQueryProviderHub'
import { Injectable, inject } from '@angular/core'
import { map, switchMap, take } from 'rxjs'
import { CriteriaEntryDetailsProviderService } from 'src/app/service/Search/ListEntryDetails/CriteriaEntryDetailsProvider.service'
import { CriteriaEntryDetailsService } from 'src/app/service/Search/ListEntryDetails/CriteriaEntryDetails.service'
import { SnackbarMessageService } from 'src/app/service/SnackbarMessage.service'
import { BuildCriterionService } from 'src/app/service/Criterion/Build/BuildCriterionService'

@Injectable({
  providedIn: 'root',
})
export class CriteriaListItemDetailsMenuItemsFunctionsService {
  private searchService = inject(CriteriaByIdSearchService)
  private criteriaSearchService = inject(CriteriaSearchService)
  private criterionService = inject(BuildCriterionService)
  private criteriaEntryDetailsService = inject(CriteriaEntryDetailsService)
  private feasibilityQueryProviderHub = inject(FeasibilityQueryProviderHub)
  private criteriaEntryDetailsProviderService = inject(CriteriaEntryDetailsProviderService)
  private snackbarMessageService = inject(SnackbarMessageService)

  /** Inserted by Angular inject() migration for backwards compatibility */
  constructor(...args: unknown[])

  constructor() {}

  public showCriteriaInResultList(id: string) {
    this.searchService.search(id).pipe(take(1)).subscribe()
    this.criteriaEntryDetailsService
      .loadDetails(id)
      .pipe(take(1))
      .subscribe((test) => {
        this.criteriaEntryDetailsProviderService.setCriteriaEntryDetails(test)
      })
  }

  public addToStage(id: string) {
    this.criterionService
      .buildCriteriaFromHashes([id])
      .pipe(
        map((criteria: Criterion[]) => {
          this.feasibilityQueryProviderHub.addCriteriaToCriterionProvider(criteria)
          this.feasibilityQueryProviderHub.addCriteriaToStage(criteria)
        })
      )
      .subscribe(() => this.snackbarMessageService.displayAddedToCriteriaStage())
  }

  public searchCriteria(id: string) {
    this.searchService
      .search(id)
      .pipe(
        take(1),
        switchMap((searchTermResultList: CriteriaResultList) =>
          this.criteriaSearchService.search(
            searchTermResultList.getResults()[0].getDisplay().getOriginal()
          )
        ),
        switchMap((resultList: CriteriaResultList) => {
          if (resultList.getResults().length > 0) {
            return this.criteriaEntryDetailsService.loadDetails(resultList.getResults()[0].getId())
          }
          return []
        })
      )
      .subscribe((test) => {
        this.criteriaEntryDetailsProviderService.setCriteriaEntryDetails(test)
      })
  }
}
