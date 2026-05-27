import { Component, input } from '@angular/core'
import { DisplayCellData } from 'src/app/shared/models/TableData/cells/DisplayCellData'
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome'
import { MatTooltip } from '@angular/material/tooltip'
import { TranslateModule } from '@ngx-translate/core'
import { DisplayTranslationPipe } from '../../../../pipes/DisplayTranslationPipe'

@Component({
  selector: 'num-display-cell',
  templateUrl: './display-cell.component.html',
  styleUrls: ['./display-cell.component.scss'],
  standalone: true,
  imports: [FontAwesomeModule, MatTooltip, TranslateModule, DisplayTranslationPipe],
})
export class DisplayCellComponent {
  readonly cell = input.required<DisplayCellData>()
}
