import { Component, inject } from '@angular/core'
import { MatDialogRef } from '@angular/material/dialog'
import { ButtonComponent } from '../button/button.component'
import { TranslateModule } from '@ngx-translate/core'

@Component({
  selector: 'num-confirm-delete-modal',
  templateUrl: './confirm-delete-modal.component.html',
  styleUrls: ['./confirm-delete-modal.component.scss'],
  standalone: true,
  imports: [ButtonComponent, TranslateModule],
})
export class ConfirmDeleteModalComponent {
  dialogRef = inject<MatDialogRef<ConfirmDeleteModalComponent>>(MatDialogRef)

  /** Inserted by Angular inject() migration for backwards compatibility */
  constructor(...args: unknown[])

  constructor() {}

  public cancel() {
    this.dialogRef.close(false)
  }

  public confirm() {
    this.dialogRef.close(true)
  }
}
