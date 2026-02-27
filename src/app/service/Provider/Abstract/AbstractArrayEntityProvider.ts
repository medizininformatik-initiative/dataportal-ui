import { BehaviorSubject, Observable } from 'rxjs';
import { AbstractEntityProvider } from './AbstractEntityProvdier';

/**
 * Abstract base class for array-backed entity providers.
 *
 * Provides an in-memory, RxJS-powered collection with NgRx-style CRUD operations
 * (add, set, update, upsert, remove). Concrete subclasses must implement
 * {@link selectId} to extract a stable string identifier from each entity.
 *
 * @template T The entity type managed by this provider.
 */
export abstract class AbstractArrayEntityProvider<T> extends AbstractEntityProvider<T> {
  /**
   * Extracts a stable, unique string identifier from an entity.
   * Implemented by each concrete subclass to define what constitutes
   * the entity's primary key.
   *
   * @param entity The entity from which to extract the ID.
   * @returns A string that uniquely identifies the entity.
   */
  protected abstract selectId(entity: T): string;

  /**
   * Internal in-memory array holding the current set of entities.
   * Mutations are always followed by a call to {@link emit} to keep
   * {@link itemsSubject} in sync.
   */
  protected items: T[] = [];

  /**
   * RxJS subject that broadcasts the current entity collection to all
   * active subscribers whenever the collection changes.
   */
  protected itemsSubject = new BehaviorSubject<T[]>([]);

  /**
   * Returns an observable that emits the full entity collection whenever
   * it changes. Subscribers receive a shallow copy of the internal array.
   *
   * @returns An {@link Observable} of the current entity array.
   */
  public getAll(): Observable<T[]> {
    return this.itemsSubject.asObservable();
  }

  /**
   * Retrieves a single entity by its identifier.
   *
   * @param id The unique identifier of the entity to look up.
   * @returns The matching entity, or `undefined` if no entity with that ID exists.
   */
  public getOne(id: string): T | undefined {
    return this.items.find((e) => this.selectId(e) === id);
  }

  /**
   * Adds a single entity to the collection only if an entity with the
   * same ID does not already exist. If a duplicate is detected the
   * operation is silently skipped and the collection is left unchanged.
   *
   * @param entity The entity to add.
   */
  public addOne(entity: T): void {
    const id = this.selectId(entity);
    if (this.hasSameId(id)) {
      return;
    }
    this.items.push(entity);
    this.emit();
  }

  /**
   * Adds multiple entities to the collection, skipping any whose ID
   * already exists. Emits a single update after all entities are
   * processed, but only if at least one new entity was actually added.
   *
   * @param entities The array of entities to add.
   */
  public addMany(entities: T[]): void {
    let changed = false;

    for (const entity of entities) {
      const id = this.selectId(entity);
      if (!this.hasSameId(id)) {
        this.items.push(entity);
        changed = true;
      }
    }
    if (changed) {
      this.emit();
    }
  }

  /**
   * Replaces an existing entity with the same ID, or inserts the entity
   * if no match is found. Always emits after the operation.
   *
   * @param entity The entity to set.
   */
  public setOne(entity: T): void {
    const id = this.selectId(entity);
    const index = this.items.findIndex((item) => this.selectId(item) === id);

    if (index >= 0) {
      this.items[index] = entity;
    } else {
      this.items.push(entity);
    }
    this.emit();
  }

  /**
   * Calls {@link setOne} for each entity in the array, replacing
   * existing entries or inserting new ones.
   *
   * @param entities The array of entities to set.
   */
  public setMany(entities: T[]): void {
    for (const entity of entities) {
      this.setOne(entity);
    }
  }

  /**
   * Replaces the entire collection with the provided array.
   * Previously held entities that are not present in the new array
   * are discarded. Always emits after the operation.
   *
   * @param entities The new entity array that will replace the current collection.
   */
  public setAll(entities: T[]): void {
    this.items = [...entities];
    this.emit();
  }

  /**
   * Removes the entity with the given ID from the collection.
   * Emits only when an entity was actually removed; otherwise the
   * collection and its subscribers are left undisturbed.
   *
   * @param id The unique identifier of the entity to remove.
   */
  public removeOne(id: string): void {
    const originalLength = this.items.length;

    this.items = this.items.filter((e) => this.selectId(e) !== id);

    if (this.items.length !== originalLength) {
      this.emit();
    }
  }

  /**
   * Removes all entities whose IDs appear in the provided array.
   * Uses a `Set` internally for O(1) ID lookups. Emits once if at
   * least one entity was removed, otherwise remains silent.
   *
   * @param ids An array of entity IDs to remove.
   */
  public removeMany(ids: string[]): void {
    const idSet = new Set(ids);
    const originalLength = this.items.length;

    this.items = this.items.filter((e) => !idSet.has(this.selectId(e)));

    if (this.items.length !== originalLength) {
      this.emit();
    }
  }

  /**
   * Clears the entire collection. Emits only when the collection was
   * non-empty before the call; does nothing if already empty.
   */
  public removeAll(): void {
    if (this.items.length > 0) {
      this.items = [];
      this.emit();
    }
  }

  /**
   * Publishes a shallow copy of the current {@link items} array to all
   * active subscribers of {@link itemsSubject}. Should be called after
   * every mutation to keep the observable stream up to date.
   */
  protected emit(): void {
    this.itemsSubject.next([...this.items]);
  }

  /**
   * Returns `true` when the collection already contains an entity whose
   * ID matches the given `id`; `false` otherwise.
   *
   * @param id The identifier to look up.
   */
  private hasSameId(id: string): boolean {
    return this.items.some((item) => this.selectId(item) === id);
  }
}
