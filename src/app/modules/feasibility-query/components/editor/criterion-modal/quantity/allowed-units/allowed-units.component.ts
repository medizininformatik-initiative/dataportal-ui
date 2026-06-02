import { QuantityUnit } from 'src/app/model/FeasibilityQuery/QuantityUnit'
import { Component, OnInit, input, model, output } from '@angular/core'
import { CloneQuantityUnit } from 'src/app/model/Utilities/CriterionCloner/ValueAttributeFilter/Quantity/CloneQuantityUnit'
import { MatFormField } from '@angular/material/form-field'
import { MatSelect } from '@angular/material/select'
import { MatOption } from '@angular/material/core'

@Component({
  selector: 'num-allowed-units',
  templateUrl: './allowed-units.component.html',
  styleUrls: ['./allowed-units.component.scss'],
  standalone: true,
  imports: [MatFormField, MatSelect, MatOption],
})
export class AllowedUnitsComponent implements OnInit {
  readonly allowedUnits = input<QuantityUnit[]>([])

  readonly selectedUnit = model<QuantityUnit>()

  readonly selectionChange = output<QuantityUnit>()

  selectedUnitDisplay: string

  ngOnInit() {
    this.selectedUnitDisplay = this.selectedUnit()?.getDisplay() ?? ''
  }

  onSelectionChange(selectedValue: string) {
    const unit = this.allowedUnits().find((u) => u.getDisplay() === selectedValue)
    if (unit) {
      this.selectedUnit.set(unit)
      this.emitQuantityUnitInstance()
    }
  }

  private emitQuantityUnitInstance() {
    this.selectionChange.emit(CloneQuantityUnit.deepCopyQuantityUnit(this.selectedUnit()))
  }
}
