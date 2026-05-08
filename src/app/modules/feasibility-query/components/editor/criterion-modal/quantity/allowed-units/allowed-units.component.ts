import { QuantityUnit } from 'src/app/model/FeasibilityQuery/QuantityUnit';
import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges,
} from '@angular/core';
import { CloneQuantityUnit } from 'src/app/model/Utilities/CriterionCloner/ValueAttributeFilter/Quantity/CloneQuantityUnit';

@Component({
  selector: 'num-allowed-units',
  templateUrl: './allowed-units.component.html',
  styleUrls: ['./allowed-units.component.scss'],
})
export class AllowedUnitsComponent implements OnInit, OnChanges {
  @Input()
  allowedUnits: QuantityUnit[] = [];

  @Input()
  selectedUnit: QuantityUnit;

  @Output()
  selectionChange = new EventEmitter<QuantityUnit>();

  selectedUnitDisplay: string;

  ngOnInit() {
    this.selectedUnitDisplay = this.selectedUnit.getDisplay();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (
      (changes.allowedUnits && !changes.allowedUnits.firstChange) ||
      (changes.selectedUnit && !changes.selectedUnit.firstChange)
    ) {
      this.emitQuantityUnitInstance();
    }
  }

  onSelectionChange(selectedValue: string) {
    this.selectedUnit = this.allowedUnits.find((unit) => unit.getDisplay() === selectedValue);
    if (this.selectedUnit) {
      this.emitQuantityUnitInstance();
    }
  }

  private emitQuantityUnitInstance() {
    this.selectionChange.emit(CloneQuantityUnit.deepCopyQuantityUnit(this.selectedUnit));
  }
}
