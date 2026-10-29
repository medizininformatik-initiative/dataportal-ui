import { Component, input, output } from '@angular/core'
import { MatTooltip } from '@angular/material/tooltip'
import { TranslateModule } from '@ngx-translate/core'
import { CheckboxCellData } from 'src/app/shared/models/TableData/Cells/Data/CheckboxCellData'
import { CheckboxComponent } from '../../../checkbox/checkbox.component'

@Component({
  selector: 'num-checkbox-cell',
  templateUrl: './checkbox-cell.component.html',
  styleUrls: ['./checkbox-cell.component.scss'],
  standalone: true,
  imports: [CheckboxComponent, MatTooltip, TranslateModule],
})
export class CheckboxCellComponent {
  public readonly cell = input.required<CheckboxCellData>()

  public readonly checkboxChange = output<void>()

  public onCheckboxChange(): void {
    this.checkboxChange.emit()
  }
}
