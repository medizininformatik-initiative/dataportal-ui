import { Component, input, output } from '@angular/core'
import { CheckboxCellData } from 'src/app/shared/models/TableData/cells/CheckboxCellData'
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
  readonly cell = input<CheckboxCellData>()

  readonly checkboxChange = output<void>()

  onCheckboxClick(event: MouseEvent): void {
    event.stopPropagation()
  }

  onCheckboxChange(): void {
    this.checkboxChange.emit()
  }
}
