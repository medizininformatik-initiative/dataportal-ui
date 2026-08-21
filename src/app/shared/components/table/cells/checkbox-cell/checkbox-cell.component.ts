import { Component, input, output } from '@angular/core'
import { CheckboxCellData } from 'src/app/shared/models/TableData/Cells/Data/CheckboxCellData'
import { CheckboxComponent } from '../../../checkbox/checkbox.component'
import { MatTooltip } from '@angular/material/tooltip'
import { TranslateModule } from '@ngx-translate/core'

@Component({
  selector: 'num-checkbox-cell',
  templateUrl: './checkbox-cell.component.html',
  styleUrls: ['./checkbox-cell.component.scss'],
  standalone: true,
  imports: [CheckboxComponent, MatTooltip, TranslateModule],
})
export class CheckboxCellComponent {
  readonly cell = input.required<CheckboxCellData>()

  readonly checkboxChange = output<void>()

  public onCheckboxChange(): void {
    this.checkboxChange.emit()
  }
}
