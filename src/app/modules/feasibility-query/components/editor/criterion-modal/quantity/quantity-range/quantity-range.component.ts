import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  Output,
  SimpleChanges,
  inject,
} from '@angular/core'
import { QuantityRangeFilter } from 'src/app/model/FeasibilityQuery/Criterion/AttributeFilter/Quantity/QuantityRangeFilter'
import { QuantityUnit } from 'src/app/model/FeasibilityQuery/QuantityUnit'
import { QuantityNotSet } from '../../../../../../../model/FeasibilityQuery/Criterion/AttributeFilter/Quantity/QuantityNotSet'
import { QuantityFilterFactoryService } from 'src/app/service/Factory/QuantityFilterFactory.service'
import { ValueSelectComponent } from '../../../../../../../shared/components/value-select/value-select.component'
import { TranslateModule } from '@ngx-translate/core'

@Component({
  selector: 'num-quantity-range',
  templateUrl: './quantity-range.component.html',
  styleUrls: ['./quantity-range.component.scss'],
  standalone: true,
  imports: [ValueSelectComponent, TranslateModule],
})
export class QuantityRangeComponent implements OnChanges {
  private quantityFilterFactoryService = inject(QuantityFilterFactoryService)

  @Input()
  minValue: number

  @Input()
  maxValue: number

  @Input()
  quantityFilterUnit: QuantityUnit

  @Output()
  quantityRangeInstance: EventEmitter<QuantityRangeFilter | QuantityNotSet> = new EventEmitter()

  displayWarning = false

  /** Inserted by Angular inject() migration for backwards compatibility */
  constructor(...args: unknown[])
  constructor() {}

  ngOnChanges(changes: SimpleChanges): void {
    if (
      (changes.minValue && !changes.minValue.firstChange) ||
      (changes.maxValue && !changes.maxValue.firstChange) ||
      (changes.quantityFilterUnit && !changes.quantityFilterUnit.firstChange)
    ) {
      this.emitQuantityRangeFilter()
    }
  }

  public setMaxValue(value: number): void {
    this.maxValue = value
    this.emitQuantityRangeFilter()
  }

  public setMinValue(value: number): void {
    this.minValue = value
    this.emitQuantityRangeFilter()
  }

  private emitQuantityRangeFilter(): void {
    if (this.minValue != null && this.maxValue != null && this.quantityFilterUnit) {
      if (this.minValue <= this.maxValue) {
        const quantityRangeFilter = this.quantityFilterFactoryService.createQuantityRangeFilter(
          this.minValue,
          this.maxValue
        )
        this.quantityRangeInstance.emit(quantityRangeFilter)
        this.displayWarning = false
      } else {
        this.displayWarning = true
      }
    }
  }
}
