import { Component, input } from '@angular/core'
import { MatTooltip } from '@angular/material/tooltip'
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome'
import { TranslateModule } from '@ngx-translate/core'
import { DisplayCellData } from 'src/app/shared/models/TableData/Cells/Data/DisplayCellData'
import { DisplayTranslationPipe } from '../../../../pipes/DisplayTranslationPipe'

@Component({
  selector: 'num-display-cell',
  templateUrl: './display-cell.component.html',
  styleUrls: ['./display-cell.component.scss'],
  standalone: true,
  imports: [FontAwesomeModule, MatTooltip, TranslateModule, DisplayTranslationPipe],
})
export class DisplayCellComponent {
  public readonly cell = input<DisplayCellData>()
}
