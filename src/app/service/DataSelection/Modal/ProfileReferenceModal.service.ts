import { Injectable, OnDestroy, inject } from '@angular/core'
import { MatDialog } from '@angular/material/dialog'
import { Observable, Subscription } from 'rxjs'
import {
  ProfileReferenceModalComponent,
  ProfileReferenceModalComponentData,
} from 'src/app/modules/query-editor/components/editor-content/profile/reference/modal-window/profile-reference-modal.component'

@Injectable({
  providedIn: 'root',
})
export class ProfileReferenceModalService implements OnDestroy {
  private readonly dialog = inject(MatDialog)

  public dialogSubscription: Subscription

  /** Inserted by Angular inject() migration for backwards compatibility */
  constructor(...args: unknown[])

  constructor() {}

  /**
   * Unsubscribes from the dialog.
   */
  public ngOnDestroy() {
    this.dialogSubscription.unsubscribe()
  }

  /**
   * Opens the profile reference dialog and emits the selected urls when it closes.
   * @param {string[]} referencedProfileUrls
   * @param {string} profileId
   * @returns {Observable<string[]>}
   */
  public openProfileReferenceModal(referencedProfileUrls: string[], profileId: string): Observable<string[]> {
    const data = this.setModalData(referencedProfileUrls, profileId)
    const dialogRef = this.dialog.open(ProfileReferenceModalComponent, {
      disableClose: true,
      data,
    })

    return dialogRef.afterClosed()
  }

  /**
   * Builds the data for the profile reference dialog.
   * @param {string[]} referencedProfileUrls
   * @param {string} profileId
   * @returns {ProfileReferenceModalComponentData}
   */
  private setModalData(referencedProfileUrls: string[], profileId: string): ProfileReferenceModalComponentData {
    return {
      referenceUrls: referencedProfileUrls,
      profileId,
    }
  }
}
