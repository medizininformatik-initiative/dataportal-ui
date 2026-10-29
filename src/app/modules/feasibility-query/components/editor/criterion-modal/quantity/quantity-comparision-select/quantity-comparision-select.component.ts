import { Component, input, output } from '@angular/core'
import { MatOption } from '@angular/material/core'
import { MatFormField } from '@angular/material/form-field'
import { MatSelect } from '@angular/material/select'
import { TranslateModule } from '@ngx-translate/core'
import { QuantityComparisonOption } from 'src/app/model/Utilities/Quantity/QuantityFilterOptions'

@Component({
  selector: 'num-quantity-comparision-select',
  templateUrl: './quantity-comparision-select.component.html',
  styleUrls: ['./quantity-comparision-select.component.scss'],
  standalone: true,
  imports: [MatFormField, MatSelect, MatOption, TranslateModule],
})
export class QuantityComparisionSelectComponent {
  public quantityFilterOptionsArray: string[] = Object.values(QuantityComparisonOption)

  public readonly existingOption = input<QuantityComparisonOption>(QuantityComparisonOption.NONE)

  public readonly selectedOption = output<string>()

  public selectQuantityFilterOption(option: string) {
    this.selectedOption.emit(option)
  }
}
