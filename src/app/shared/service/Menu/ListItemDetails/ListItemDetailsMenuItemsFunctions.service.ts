import { CreateCriterionService } from 'src/app/service/Criterion/CreateCriterionService';
import { CriteriaResultList } from 'src/app/model/Search/ResultList/CriteriaResultList';
import { CriteriaSearchService } from 'src/app/service/Search/SearchTypes/Criteria/CriteriaSearch.service';
import { Criterion } from 'src/app/model/FeasibilityQuery/Criterion/Criterion';
import { FeasibilityQueryProviderHub } from 'src/app/service/Provider/FeasibilityQueryProviderHub';
import { Injectable } from '@angular/core';
import { map, switchMap, take } from 'rxjs';
import { SearchTermDetailsService } from 'src/app/service/Search/SearchTemDetails/SearchTermDetails.service';
import { CriteriaByIdSearchService } from 'src/app/service/Search/SearchTypes/CriteriaById/CriteriaByIdSearch.service';
import { SearchTermDetailsProviderService } from 'src/app/service/Search/SearchTemDetails/SearchTermDetailsProvider.service';

@Injectable({
  providedIn: 'root',
})
export class ListItemDetailsMenuItemsFunctionsService {
  constructor(
    private searchService: CriteriaByIdSearchService,
    private criteriaSearchService: CriteriaSearchService,
    private criterionService: CreateCriterionService,
    private searchTermDetailsService: SearchTermDetailsService,
    private feasibilityQueryProviderHub: FeasibilityQueryProviderHub,
    private searchTermDetailsProviderService: SearchTermDetailsProviderService
  ) {}

  public showCriteriaInResultList(id: string) {
    this.searchService.search(id).pipe(take(1)).subscribe();
    this.searchTermDetailsService
      .getDetailsForListItem(id)
      .pipe(take(1))
      .subscribe((test) => {
        this.searchTermDetailsProviderService.setSearchTermDetails(test);
      });
  }

  public addToStage(id: string) {
    this.criterionService
      .createCriteriaFromHashes([id], false)
      .pipe(
        map((criteria: Criterion[]) => {
          this.feasibilityQueryProviderHub.addCriteriaToCriterionProvider(criteria);
          this.feasibilityQueryProviderHub.addCriteriaToStage(criteria);
        })
      )
      .subscribe();
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
            return this.searchTermDetailsService.getDetailsForListItem(
              resultList.getResults()[0].getId()
            );
          }
          return [];
        })
      )
      .subscribe((test) => {
        this.searchTermDetailsProviderService.setSearchTermDetails(test);
      });
  }
}
