import { Component, effect, inject, input, model, output, untracked } from '@angular/core'
import { TranslateModule } from '@ngx-translate/core'
import { QuantityRangeFilter } from 'src/app/model/FeasibilityQuery/Criterion/AttributeFilter/Quantity/QuantityRangeFilter'
import { QuantityUnit } from 'src/app/model/FeasibilityQuery/QuantityUnit'
import { QuantityFilterFactoryService } from 'src/app/service/Factory/QuantityFilterFactory.service'
import { QuantityNotSet } from '../../../../../../../model/FeasibilityQuery/Criterion/AttributeFilter/Quantity/QuantityNotSet'
import { ValueSelectComponent } from '../../../../../../../shared/components/value-select/value-select.component'

@Component({
  selector: 'num-quantity-range',
  templateUrl: './quantity-range.component.html',
  styleUrls: ['./quantity-range.component.scss'],
  standalone: true,
  imports: [ValueSelectComponent, TranslateModule],
})
export class QuantityRangeComponent {
  private readonly quantityFilterFactoryService = inject(QuantityFilterFactoryService)

  public readonly minValue = model<number>()

  public readonly maxValue = model<number>()

  public readonly quantityFilterUnit = input<QuantityUnit>(undefined)

  public readonly quantityRangeInstance = output<QuantityRangeFilter | QuantityNotSet>()

  public displayWarning = false

  constructor() {
    let initialized = false
    effect(() => {
      this.minValue()
      this.maxValue()
      this.quantityFilterUnit()
      if (initialized) {
        untracked(() => this.emitQuantityRangeFilter())
      }
      initialized = true
    })
  }

  public setMaxValue(value: number): void {
    this.maxValue.set(value)
    this.emitQuantityRangeFilter()
  }

  public setMinValue(value: number): void {
    this.minValue.set(value)
    this.emitQuantityRangeFilter()
  }

  private emitQuantityRangeFilter(): void {
    const min = this.minValue()
    const max = this.maxValue()
    if (min != null && max != null && this.quantityFilterUnit()) {
      if (min <= max) {
        const quantityRangeFilter = this.quantityFilterFactoryService.createQuantityRangeFilter(min, max)
        this.quantityRangeInstance.emit(quantityRangeFilter)
        this.displayWarning = false
      } else {
        this.displayWarning = true
      }
    }
  }
}
