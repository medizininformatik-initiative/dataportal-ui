import { Injectable } from '@angular/core'
import { BehaviorSubject, Observable } from 'rxjs'
import { AbstractListEntry } from '../../model/Search/ListEntries/AbstractListEntry'
import { AbstractArrayEntityProvider } from './Abstract/AbstractArrayEntityProvider'

@Injectable({
  providedIn: 'root',
})
export class SelectedTableItemsProvider<C extends AbstractListEntry> extends AbstractArrayEntityProvider<C> {
  private readonly selectedTableItemSource = new BehaviorSubject<C | null>(null)

  /**
   * Returns the id of the entity.
   * @param {C} entity
   * @returns {string}
   */
  protected selectId(entity: C): string {
    return entity.getId()
  }

  /**
   * Sets the item as the active item and adds it to the store.
   * @param {C} item
   */
  public setActiveItem(item: C): void {
    this.selectedTableItemSource.next(item)
    this.addOne(item)
  }

  /**
   * Adds the items to the store.
   * @param {C[]} items
   */
  public addItems(items: C[]): void {
    this.addMany(items)
  }

  /**
   * Returns the active item as an observable.
   * @returns {Observable<C | null>}
   */
  public getActiveItem(): Observable<C | null> {
    return this.selectedTableItemSource.asObservable()
  }

  /**
   * Returns all items as an observable.
   * @returns {Observable<C[]>}
   */
  public getItems(): Observable<C[]> {
    return this.getAll()
  }

  /**
   * Returns the current active item.
   * @returns {C | null}
   */
  public getActiveItemSnapshot(): C | null {
    return this.selectedTableItemSource.getValue()
  }

  /**
   * Returns the ids of all items.
   * @returns {string[]}
   */
  public getIds(): string[] {
    return this.items.map((e: C) => this.selectId(e))
  }

  /**
   * Adds the item to the store.
   * @param {C} item
   */
  public select(item: C): void {
    this.addOne(item)
  }

  /**
   * Removes the item from the store.
   * @param {C} item
   */
  public deselect(item: C): void {
    this.removeOne(item.getId())
  }

  /**
   * Removes all items and resets the active item.
   */
  public clear(): void {
    this.removeAll()
    this.selectedTableItemSource.next(null)
  }
}
