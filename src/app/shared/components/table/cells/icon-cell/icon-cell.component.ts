import { Component, input, output } from '@angular/core'
import { MatTooltip } from '@angular/material/tooltip'
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome'
import { TranslateModule } from '@ngx-translate/core'
import { IconCellData } from 'src/app/shared/models/TableData/Cells/Data/IconCellData'

@Component({
  selector: 'num-icon-cell',
  templateUrl: './icon-cell.component.html',
  styleUrls: ['./icon-cell.component.scss'],
  standalone: true,
  imports: [FontAwesomeModule, MatTooltip, TranslateModule],
})
export class IconCellComponent {
  public readonly iconData = input<IconCellData>()

  public readonly color = input('black')

  public readonly iconClicked = output<void>()

  public onIconClick(): void {
    // TODO: The 'emit' function requires a mandatory void argument
    this.iconClicked.emit()
  }
}
