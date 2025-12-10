import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class BulkCriteriaSearchProvider {
  private searchText: string;
  private searchFilter: Subject<string> = new Subject<string>();

  /**	 * Sets the bulk criteria search text.
   * @param text - The search text to set
   */
  public setSearchText(text: string): void {
    this.searchText = text;
  }

  /**
   * Gets the bulk criteria search text as an Observable.
   * @returns Observable that emits the current search text
   */
  public getSearchText(): string {
    return this.searchText;
  }
}
