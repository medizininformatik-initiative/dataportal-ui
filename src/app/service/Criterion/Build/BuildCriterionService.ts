import { CriteriaListEntry } from 'src/app/model/Search/ListEntries/CriteriaListListEntry'
import { Criterion } from 'src/app/model/FeasibilityQuery/Criterion/Criterion'
import { finalize, Observable } from 'rxjs'
import { inject, Injectable } from '@angular/core'
import { LoadCriterionService } from '../LoadCriterion.service'
import { SelectedTableItemsProvider } from '../../Provider/SelectedTableItemsProvider.service'

@Injectable({
  providedIn: 'root',
})
export class BuildCriterionService {
  private listItemService = inject<SelectedTableItemsProvider<CriteriaListEntry>>(
    SelectedTableItemsProvider
  )
  private loadCriterionService = inject(LoadCriterionService)

  constructor() {}

  /**
   * Loads criteria based on the provided hashes and optionally clears the pre-stage selection.
   * @param {string[]} hashes
   * @param {boolean} clearSelection
   * @returns {Observable<Criterion[]>}
   */
  public buildCriteriaFromHashes(
    hashes: string[],
    clearSelection: boolean = true
  ): Observable<Criterion[]> {
    return this.loadCriterionService.loadCriteria(hashes).pipe(
      finalize(() => {
        if (clearSelection) {
          this.listItemService.clear()
        }
      })
    )
  }
}
