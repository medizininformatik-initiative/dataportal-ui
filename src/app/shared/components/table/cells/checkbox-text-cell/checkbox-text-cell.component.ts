import { Component, input, output } from '@angular/core'
import { MatTooltip } from '@angular/material/tooltip'
import { TranslateModule } from '@ngx-translate/core'
import { CheckboxTextCellData } from 'src/app/shared/models/TableData/Cells/Data/CheckboxTextCellData'
import { DisplayTranslationPipe } from '../../../../pipes/DisplayTranslationPipe'
import { CheckboxComponent } from '../../../checkbox/checkbox.component'

@Component({
  selector: 'num-checkbox-text-cell',
  templateUrl: './checkbox-text-cell.component.html',
  styleUrls: ['./checkbox-text-cell.component.scss'],
  standalone: true,
  imports: [CheckboxComponent, MatTooltip, TranslateModule, DisplayTranslationPipe],
})
export class CheckboxTextCellComponent {
  public readonly cell = input<CheckboxTextCellData>(undefined)

  public readonly checkboxChange = output<void>()

  public onCheckboxChange(): void {
    this.checkboxChange.emit()
  }
}
