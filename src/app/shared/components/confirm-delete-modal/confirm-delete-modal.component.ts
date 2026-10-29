import { Component, inject } from '@angular/core'
import { MatDialogRef } from '@angular/material/dialog'
import { TranslateModule } from '@ngx-translate/core'
import { ButtonComponent } from '../button/button.component'

@Component({
  selector: 'num-confirm-delete-modal',
  templateUrl: './confirm-delete-modal.component.html',
  styleUrls: ['./confirm-delete-modal.component.scss'],
  standalone: true,
  imports: [ButtonComponent, TranslateModule],
})
export class ConfirmDeleteModalComponent {
  public dialogRef = inject<MatDialogRef<ConfirmDeleteModalComponent>>(MatDialogRef)

  constructor() {}

  public cancel() {
    this.dialogRef.close(false)
  }

  public confirm() {
    this.dialogRef.close(true)
  }
}
