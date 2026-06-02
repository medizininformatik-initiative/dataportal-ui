import {
  Component,
  OnChanges,
  OnInit,
  effect,
  inject,
  input,
  model,
  output,
  untracked,
} from '@angular/core'
import { QuantityComparatorFilter } from 'src/app/model/FeasibilityQuery/Criterion/AttributeFilter/Quantity/QuantityComparatorFilter'
import { QuantityComparisonOption } from 'src/app/model/Utilities/Quantity/QuantityFilterOptions'
import { QuantityUnit } from 'src/app/model/FeasibilityQuery/QuantityUnit'
import { QuantityFilterFactoryService } from 'src/app/service/Factory/QuantityFilterFactory.service'
import { ValueSelectComponent } from '../../../../../../../shared/components/value-select/value-select.component'

@Component({
  selector: 'num-quantity-comparator',
  templateUrl: './quantity-comparator.component.html',
  styleUrls: ['./quantity-comparator.component.scss'],
  standalone: true,
  imports: [ValueSelectComponent],
})
export class QuantityComparatorComponent {
  private quantityFilterFactoryService = inject(QuantityFilterFactoryService)

  readonly value = model<number>()

  readonly quantityComparatorType = input<QuantityComparisonOption>(undefined)

  readonly quantityFilterUnit = input<QuantityUnit>(undefined)

  readonly quantityComparatorInstance = output<QuantityComparatorFilter>()

  /** Inserted by Angular inject() migration for backwards compatibility */
  constructor(...args: unknown[])

  constructor() {
    let initialized = false
    effect(() => {
      const val = this.value()
      this.quantityFilterUnit()
      this.quantityComparatorType()
      if (initialized && val != null) {
        untracked(() => this.emitComparatorInstance())
      }
      initialized = true
    })
  }

  public setValue(newValue: number): void {
    this.value.set(newValue)
    this.emitComparatorInstance()
  }

  private emitComparatorInstance(): void {
    const val = this.value()
    if (val != null) {
      const quantityComparator = this.quantityFilterFactoryService.createQuantityComparatorFilter(
        val,
        this.quantityComparatorType()
      )
      this.quantityComparatorInstance.emit(quantityComparator)
    }
  }
}
