import { Observable } from 'rxjs';

/**
 * Base contract for entity providers.
 *
 * Defines NgRx-style collection operations without prescribing
 *
 * @template T The entity type managed by this provider.
 */
export abstract class AbstractEntityProvider<T> {
  /**
   * Returns an observable stream of all entities.
   * @returns An {@link Observable} that emits the current collection of entities.
   */
  public abstract getAll(): Observable<T[]> | Observable<Map<string, T>>;

  /**
   * Returns a single entity by its unique ID.
   * @param {string} id The unique identifier of the entity to retrieve.
   * @returns {T | undefined} The entity if found, otherwise `undefined`.
   */
  public abstract getOne(id: string): T | undefined;

  /**
   * Adds one entity if it does not already exist.
   * @abstract
   * @param {T} entity The entity to add.
   */
  public abstract addOne(entity: T): void;

  /**
   * Adds multiple entities if they do not already exist.
   * @abstract
   * @param {T[]} entities The array of entities to add.
   */
  public abstract addMany(entities: T[]): void;

  /**
   * Adds or replaces a single entity.
   * @abstract
   * @param {T} entity The entity to add or replace.
   */
  public abstract setOne(entity: T): void;

  /**
   * Adds or replaces multiple entities.
   * @abstract
   * @param {T[]} entities The array of entities to add or replace.
   */
  public abstract setMany(entities: T[]): void;

  /**
   * Replaces the entire collection.
   * @abstract
   * @param {T[]} entities The array of entities to set as the new collection.
   */
  public abstract setAll(entities: T[]): void;

  /**
   * Removes a single entity by ID.
   * @abstract
   * @param {string} id The unique identifier of the entity to remove.
   */
  public abstract removeOne(id: string): void;

  /**
   * Removes multiple entities by ID.
   * @abstract
   * @param {string[]} ids The array of unique identifiers of the entities to remove.
   */
  public abstract removeMany(ids: string[]): void;

  /**
   * Clears the entire collection.
   * @abstract
   * @returns {void}
   */
  public abstract removeAll(): void;
}
