import { Injectable, inject } from '@angular/core'
import { map, switchMap, take } from 'rxjs'
import { Criterion } from 'src/app/model/FeasibilityQuery/Criterion/Criterion'
import { CriteriaResultList } from 'src/app/model/Search/ResultList/CriteriaResultList'
import { BuildCriterionService } from 'src/app/service/Criterion/Build/BuildCriterionService'
import { FeasibilityQueryProviderHub } from 'src/app/service/Provider/FeasibilityQueryProviderHub'
import { CriteriaEntryDetailsService } from 'src/app/service/Search/ListEntryDetails/CriteriaEntryDetails.service'
import { CriteriaEntryDetailsProviderService } from 'src/app/service/Search/ListEntryDetails/CriteriaEntryDetailsProvider.service'
import { CriteriaSearchService } from 'src/app/service/Search/SearchTypes/Criteria/CriteriaSearch.service'
import { CriteriaByIdSearchService } from 'src/app/service/Search/SearchTypes/CriteriaById/CriteriaByIdSearch.service'
import { SnackbarMessageService } from 'src/app/service/SnackbarMessage.service'

@Injectable({
  providedIn: 'root',
})
export class CriteriaListItemDetailsMenuItemsFunctionsService {
  private readonly searchService = inject(CriteriaByIdSearchService)
  private readonly criteriaSearchService = inject(CriteriaSearchService)
  private readonly criterionService = inject(BuildCriterionService)
  private readonly criteriaEntryDetailsService = inject(CriteriaEntryDetailsService)
  private readonly feasibilityQueryProviderHub = inject(FeasibilityQueryProviderHub)
  private readonly criteriaEntryDetailsProviderService = inject(CriteriaEntryDetailsProviderService)
  private readonly snackbarMessageService = inject(SnackbarMessageService)

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
          this.criteriaSearchService.search(searchTermResultList.getResults()[0].getDisplay().getOriginal())
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
