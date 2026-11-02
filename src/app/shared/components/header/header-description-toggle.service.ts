import { Injectable } from '@angular/core'
import { BehaviorSubject } from 'rxjs'

@Injectable({ providedIn: 'root' })
export class HeaderDescriptionToggleService {
  private readonly STORAGE_KEY = 'header-description-visible'

  private readonly visible = new BehaviorSubject<boolean>(localStorage.getItem(this.STORAGE_KEY) === 'true')

  public readonly visible$ = this.visible.asObservable()

  /**
   * Returns whether the header description is visible.
   * @returns {boolean}
   */
  public get isVisible(): boolean {
    return this.visible.value
  }

  /**
   * Toggles the header description and stores the state in the local storage.
   */
  public toggle() {
    const next = !this.visible.value
    this.visible.next(next)
    localStorage.setItem(this.STORAGE_KEY, String(next))
  }
}
