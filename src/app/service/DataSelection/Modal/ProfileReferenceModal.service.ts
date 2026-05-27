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
  private dialog = inject(MatDialog)

  dialogSubscription: Subscription

  /** Inserted by Angular inject() migration for backwards compatibility */
  constructor(...args: unknown[])

  constructor() {}

  ngOnDestroy() {
    this.dialogSubscription.unsubscribe()
  }

  public openProfileReferenceModal(
    referencedProfileUrls: string[],
    profileId: string
  ): Observable<string[]> {
    const data = this.setModalData(referencedProfileUrls, profileId)
    const dialogRef = this.dialog.open(ProfileReferenceModalComponent, {
      disableClose: true,
      data,
    })

    return dialogRef.afterClosed()
  }

  private setModalData(
    referencedProfileUrls: string[],
    profileId: string
  ): ProfileReferenceModalComponentData {
    return {
      referenceUrls: referencedProfileUrls,
      profileId,
    }
  }
}
