import { Component, EventEmitter, OnInit, Output } from '@angular/core'
import { ActionBarComponent } from '../../../../shared/components/action-bar/action-bar.component'
import { ButtonComponent } from '../../../../shared/components/button/button.component'
import { TranslateModule } from '@ngx-translate/core'

@Component({
  selector: 'num-edit-action-bar',
  templateUrl: './edit-action-bar.component.html',
  styleUrls: ['./edit-action-bar.component.scss'],
  standalone: true,
  imports: [ActionBarComponent, ButtonComponent, TranslateModule],
})
export class EditActionBarComponent implements OnInit {
  @Output()
  cancelled = new EventEmitter<void>()
  constructor() {}

  ngOnInit() {}

  public onCancel() {
    this.cancelled.emit()
  }
}
