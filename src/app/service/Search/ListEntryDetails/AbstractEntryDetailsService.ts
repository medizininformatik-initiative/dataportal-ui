import { AbstractDetails } from 'src/app/model/Search/EntryDetails/AbstractDetails'
import { AbstractRelative } from 'src/app/model/Search/EntryDetails/AbstractRelative'
import { Observable } from 'rxjs'

/**
 * Abstract base for entry-details services.
 *
 * The double generic constraint guarantees that every concrete implementation
 * returns a fully populated {@link AbstractDetails} subclass that always
 * carries typed `parents` and `children` arrays alongside `display`.
 *
 * @template TRelative Concrete relative type (extends {@link AbstractRelative}).
 * @template TDetails  Concrete details type (extends {@link AbstractDetails}<TRelative>).
 */
export abstract class AbstractEntryDetailsService<
  T extends AbstractRelative,
  D extends AbstractDetails<T>
> {
  /**
   * Loads the entry details for the given ID.
   * Implementations must always populate `parents` and `children` on the
   * returned details — never leave them undefined.
   *
   * @param id Unique identifier of the entry.
   * @returns An Observable emitting fully populated entry details.
   */
  public abstract loadDetails(id: string): Observable<D>
}
