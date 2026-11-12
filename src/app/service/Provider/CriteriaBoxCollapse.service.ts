import { inject, Injectable, signal } from '@angular/core'
import { LOCAL_STORAGE, StorageService } from 'ngx-webstorage-service'

/**
 * Collapse state shared by all criteria boxes: the "collapse all / expand all" button flips it,
 * every box follows. Kept in local storage so it survives page reloads and new sessions.
 */
@Injectable({ providedIn: 'root' })
export class CriteriaBoxCollapseService {
  private storage = inject<StorageService>(LOCAL_STORAGE)
  private readonly STORAGE_KEY = 'CRITERIA_BOXES_COLLAPSED'

  private readonly collapsedState = signal(this.storage.get(this.STORAGE_KEY) === true)
  readonly collapsed = this.collapsedState.asReadonly()

  public toggleAll(): void {
    const next = !this.collapsedState()
    this.storage.set(this.STORAGE_KEY, next)
    this.collapsedState.set(next)
  }
}
