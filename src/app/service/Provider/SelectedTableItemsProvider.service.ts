import { AbstractArrayEntityProvider } from './Abstract/AbstractArrayEntityProvider';
import { AbstractListEntry } from '../../model/Search/ListEntries/AbstractListEntry';
import { BehaviorSubject, Observable } from 'rxjs';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class SelectedTableItemsProvider<
  C extends AbstractListEntry
> extends AbstractArrayEntityProvider<C> {
  private selectedTableItemSource = new BehaviorSubject<C | null>(null);

  protected selectId(entity: C): string {
    return entity.getId();
  }

  public setActiveItem(item: C): void {
    this.selectedTableItemSource.next(item);
    this.addOne(item);
  }

  public addItems(items: C[]): void {
    this.addMany(items);
  }

  public getActiveItem(): Observable<C | null> {
    return this.selectedTableItemSource.asObservable();
  }

  public getItems(): Observable<C[]> {
    return this.getAll();
  }

  public getActiveItemSnapshot(): C | null {
    return this.selectedTableItemSource.getValue();
  }

  public getIds(): string[] {
    return this.items.map((e) => this.selectId(e));
  }

  public select(item: C): void {
    this.addOne(item);
  }

  public deselect(item: C): void {
    this.removeOne(item.getId());
  }

  public clear(): void {
    this.removeAll();
    this.selectedTableItemSource.next(null);
  }
}
