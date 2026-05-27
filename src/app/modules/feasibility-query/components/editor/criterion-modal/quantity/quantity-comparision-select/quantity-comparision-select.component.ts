import { Component, EventEmitter, Input, Output } from '@angular/core'
import { QuantityComparisonOption } from 'src/app/model/Utilities/Quantity/QuantityFilterOptions'
import { MatFormField } from '@angular/material/form-field'
import { MatSelect } from '@angular/material/select'
import { MatOption } from '@angular/material/core'
import { TranslateModule } from '@ngx-translate/core'

@Component({
  selector: 'num-quantity-comparision-select',
  templateUrl: './quantity-comparision-select.component.html',
  styleUrls: ['./quantity-comparision-select.component.scss'],
  standalone: true,
  imports: [MatFormField, MatSelect, MatOption, TranslateModule],
})
export class QuantityComparisionSelectComponent {
  quantityFilterOptionsArray: string[] = Object.values(QuantityComparisonOption)

  @Input()
  existingOption: QuantityComparisonOption = QuantityComparisonOption.NONE

  @Output()
  selectedOption = new EventEmitter<string>()

  selectQuantityFilterOption(option: string) {
    this.selectedOption.emit(option)
  }
}
