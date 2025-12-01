import { CriteriaListEntry } from 'src/app/model/Search/ListEntries/CriteriaListListEntry';
import { CriteriaProfileData } from 'src/app/model/Interface/CriteriaProfileData';
import { finalize } from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { SelectedTableItemsService } from '../SearchTermListItemService.service';
import { TerminologyApiService } from '../Backend/Api/TerminologyApi.service';
@Injectable({
  providedIn: 'root',
})
export class CriteriaProfileDataService {
  private ids: Set<string> = new Set<string>();

  constructor(
    private terminologyApiService: TerminologyApiService,
    private listItemService: SelectedTableItemsService<CriteriaListEntry>
  ) {}

  /**
   * Translate selected list items to CriteriaProfileData objects and return them as an Observable.
   * @returns The observable of criteria profile data array.
   */
  public translateListItemsToCriterions(): Observable<CriteriaProfileData[]> {
    const ids = this.listItemService.getSelectedIds();
    return this.getCriteriaProfileData(ids);
  }

  /**
   * Fetch CriteriaProfileData for the given IDs.
   *
   * @param ids The array of selected IDs.
   * @returns The observable of criteria profile data array.
   */
  public getCriteriaProfileData(ids: Array<string>): Observable<CriteriaProfileData[]> {
    return this.terminologyApiService.getCriteriaProfileData(ids);
  }
}
