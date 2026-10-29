import { Component, computed, input, model, output } from '@angular/core'
import { MatOption } from '@angular/material/core'
import { MatFormField } from '@angular/material/form-field'
import { MatSelect } from '@angular/material/select'
import { QuantityUnit } from 'src/app/model/FeasibilityQuery/QuantityUnit'
import { CloneQuantityUnit } from 'src/app/model/Utilities/CriterionCloner/ValueAttributeFilter/Quantity/CloneQuantityUnit'

@Component({
  selector: 'num-allowed-units',
  templateUrl: './allowed-units.component.html',
  styleUrls: ['./allowed-units.component.scss'],
  standalone: true,
  imports: [MatFormField, MatSelect, MatOption],
})
export class AllowedUnitsComponent {
  public readonly allowedUnits = input<QuantityUnit[]>([])
  public readonly selectedUnit = model<QuantityUnit>()
  public readonly selectionChange = output<QuantityUnit>()

  public readonly selectedUnitDisplay = computed(() => this.selectedUnit()?.getDisplay() ?? '')

  public onSelectionChange(selectedValue: string) {
    const unit = this.allowedUnits().find((u: QuantityUnit) => u.getDisplay() === selectedValue)
    if (unit) {
      this.selectedUnit.set(unit)
      this.selectionChange.emit(CloneQuantityUnit.deepCopyQuantityUnit(unit))
    }
  }
}
