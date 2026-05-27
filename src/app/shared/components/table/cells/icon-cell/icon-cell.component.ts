import { Component, input, output } from '@angular/core'
import { IconCellData } from 'src/app/shared/models/TableData/cells/IconCellData'
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome'
import { MatTooltip } from '@angular/material/tooltip'
import { TranslateModule } from '@ngx-translate/core'

@Component({
  selector: 'num-icon-cell',
  templateUrl: './icon-cell.component.html',
  styleUrls: ['./icon-cell.component.scss'],
  standalone: true,
  imports: [FontAwesomeModule, MatTooltip, TranslateModule],
})
export class IconCellComponent {
  readonly iconData = input.required<IconCellData>()

  readonly color = input('black')

  readonly iconClicked = output<void>()

  public onIconClick(): void {
    // TODO: The 'emit' function requires a mandatory void argument
    this.iconClicked.emit()
  }
}
