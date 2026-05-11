import { CriteriaListEntry } from 'src/app/model/Search/ListEntries/CriteriaListListEntry';
import { Criterion } from 'src/app/model/FeasibilityQuery/Criterion/Criterion';
import { finalize, Observable } from 'rxjs';
import { Injectable } from '@angular/core';
import { SelectedTableItemsProvider } from '../../Provider/SelectedTableItemsProvider.service';
import { LoadCriterionService } from '../LoadCriterion.service';

@Injectable({
  providedIn: 'root',
})
export class BuildCriterionService {
  constructor(
    private listItemService: SelectedTableItemsProvider<CriteriaListEntry>,
    private loadCriterionService: LoadCriterionService
  ) {}

  /**
   * Loads criteria based on the provided hashes and optionally clears the pre-stage selection.
   * @param hashes
   * @param clearSelection
   * @returns
   */
  public buildCriteriaFromHashes(
    hashes: string[],
    clearSelection: boolean = true
  ): Observable<Criterion[]> {
    return this.loadCriterionService.loadCriteria(hashes).pipe(
      finalize(() => {
        if (clearSelection) {
          this.listItemService.clear();
        }
      })
    );
  }
}
