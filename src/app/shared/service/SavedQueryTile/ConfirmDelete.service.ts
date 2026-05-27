import { Injectable, inject } from '@angular/core'
import { MatDialog } from '@angular/material/dialog'
import { ConfirmDeleteModalComponent } from '../../components/confirm-delete-modal/confirm-delete-modal.component'
import { Observable } from 'rxjs'

@Injectable({
  providedIn: 'root',
})
export class ConfirmDeleteService {
  private dialog = inject(MatDialog)

  /** Inserted by Angular inject() migration for backwards compatibility */
  constructor(...args: unknown[])

  constructor() {}

  public confirmDelete(): Observable<boolean> {
    const dialogRef = this.dialog.open(ConfirmDeleteModalComponent, {
      disableClose: true,
    })
    return dialogRef.afterClosed()
  }
}
