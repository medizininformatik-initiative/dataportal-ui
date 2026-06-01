import { Component, input, output } from '@angular/core'
import { CheckboxTextCellData } from 'src/app/shared/models/TableData/cells/CheckboxTextCellData'
import { CheckboxComponent } from '../../../checkbox/checkbox.component'
import { MatTooltip } from '@angular/material/tooltip'
import { TranslateModule } from '@ngx-translate/core'
import { DisplayTranslationPipe } from '../../../../pipes/DisplayTranslationPipe'

@Component({
  selector: 'num-checkbox-text-cell',
  templateUrl: './checkbox-text-cell.component.html',
  styleUrls: ['./checkbox-text-cell.component.scss'],
  standalone: true,
  imports: [CheckboxComponent, MatTooltip, TranslateModule, DisplayTranslationPipe],
})
export class CheckboxTextCellComponent {
  readonly cell = input<CheckboxTextCellData>(undefined)

  readonly checkboxChange = output<void>()

  onCheckboxClick(event: MouseEvent): void {
    event.stopPropagation()
  }

  onCheckboxChange(): void {
    // TODO: The 'emit' function requires a mandatory void argument
    this.checkboxChange.emit()
  }
}
