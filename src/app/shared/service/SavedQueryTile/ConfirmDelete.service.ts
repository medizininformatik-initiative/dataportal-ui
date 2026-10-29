import { Injectable, inject } from '@angular/core'
import { MatDialog } from '@angular/material/dialog'
import { Observable } from 'rxjs'
import { ConfirmDeleteModalComponent } from '../../components/confirm-delete-modal/confirm-delete-modal.component'

@Injectable({
  providedIn: 'root',
})
export class ConfirmDeleteService {
  private readonly dialog = inject(MatDialog)

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
