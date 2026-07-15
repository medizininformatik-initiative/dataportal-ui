import { CheckboxComponent } from '../../../checkbox/checkbox.component'
import { CheckboxTextCellData } from 'src/app/shared/models/TableData/cells/CheckboxTextCellData'
import { Component, input, output } from '@angular/core'
import { DisplayTranslationPipe } from '../../../../pipes/DisplayTranslationPipe'
import { MatTooltip } from '@angular/material/tooltip'
import { TranslateModule } from '@ngx-translate/core'

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

  public onCheckboxChange(): void {
    this.checkboxChange.emit()
  }
}
