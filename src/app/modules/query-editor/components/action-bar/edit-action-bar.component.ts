import { Component, OnInit, output } from '@angular/core'
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
  readonly cancelled = output<void>()
  constructor() {}

  ngOnInit() {}

  public onCancel() {
    // TODO: The 'emit' function requires a mandatory void argument
    this.cancelled.emit()
  }
}
