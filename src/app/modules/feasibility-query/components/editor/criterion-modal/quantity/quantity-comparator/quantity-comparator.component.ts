import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges,
} from '@angular/core';
import { QuantityComparatorFilter } from 'src/app/model/FeasibilityQuery/Criterion/AttributeFilter/Quantity/QuantityComparatorFilter';
import { QuantityComparisonOption } from 'src/app/model/Utilities/Quantity/QuantityFilterOptions';
import { QuantityUnit } from 'src/app/model/FeasibilityQuery/QuantityUnit';
import { QuantityFilterFactoryService } from 'src/app/service/Factory/QuantityFilterFactory.service';

@Component({
  selector: 'num-quantity-comparator',
  templateUrl: './quantity-comparator.component.html',
  styleUrls: ['./quantity-comparator.component.scss'],
})
export class QuantityComparatorComponent implements OnChanges, OnInit {
  @Input()
  value: number;

  @Input()
  quantityComparatorType: QuantityComparisonOption;

  @Input()
  quantityFilterUnit: QuantityUnit;

  @Output()
  quantityComparatorInstance = new EventEmitter<QuantityComparatorFilter>();

  constructor(private quantityFilterFactoryService: QuantityFilterFactoryService) {}

  ngOnInit() {}

  ngOnChanges(changes: SimpleChanges): void {
    if (
      (changes.value && !changes.value.firstChange && this.value != null) ||
      (changes.quantityFilterUnit && !changes.quantityFilterUnit.firstChange) ||
      (changes.quantityComparatorType && !changes.quantityComparatorType.firstChange)
    ) {
      this.emitComparatorInstance();
    }
  }

  public setValue(newValue: number): void {
    this.value = newValue;
    this.emitComparatorInstance();
  }

  private emitComparatorInstance(): void {
    if (this.value != null) {
      const quantityComparator = this.quantityFilterFactoryService.createQuantityComparatorFilter(
        this.value,
        this.quantityComparatorType
      );
      this.quantityComparatorInstance.emit(quantityComparator);
    }
  }
}
