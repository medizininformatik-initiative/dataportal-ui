import { Component, inject, OnDestroy, OnInit, output } from '@angular/core'
import { FormsModule } from '@angular/forms'
import { MatDialogRef } from '@angular/material/dialog'
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome'
import { TranslateModule } from '@ngx-translate/core'
import { NumDataCyDirective } from '../../directives/num-data-cy.directive'
import { SaveDataModal } from '../../models/SaveDataModal/SaveDataModal'
import { ButtonComponent } from '../button/button.component'
import { HeaderComponent } from '../header/header.component'

@Component({
  selector: 'num-save-dataquery-modal',
  templateUrl: './save-dataquery-modal.component.html',
  styleUrls: ['./save-dataquery-modal.component.scss'],
  standalone: true,
  imports: [FontAwesomeModule, HeaderComponent, FormsModule, ButtonComponent, TranslateModule, NumDataCyDirective],
})
export class SaveDataQueryModalComponent implements OnInit {
  private readonly dialogRef = inject<MatDialogRef<SaveDataQueryModalComponent>>(MatDialogRef)

  public readonly save = output<SaveDataModal>()

  public readonly cancelled = output<void>()

  public title = ''
  public comment = ''

  constructor() {}

  public ngOnInit(): void {}

  public doSave(): void {
    this.dialogRef.close({
      title: this.title,
      comment: this.comment,
    })
  }

  public doDiscard(): void {
    this.dialogRef.close()
  }
}
