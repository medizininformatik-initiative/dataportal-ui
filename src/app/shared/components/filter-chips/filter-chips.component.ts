import { Component, computed, effect, inject, input } from '@angular/core'
import { DisplayTranslationPipe } from '../../pipes/DisplayTranslationPipe'
import { FilterChipData } from '../../models/FilterChips/FilterChipData'
import { FilterChipPropertyData } from '../../models/FilterChips/FilterChipPropertyData'
import { NgClass } from '@angular/common'

@Component({
  selector: 'num-filter-chips',
  templateUrl: './filter-chips.component.html',
  styleUrls: ['./filter-chips.component.scss'],
  standalone: true,
  imports: [NgClass, DisplayTranslationPipe],
})
export class FilterChipsComponent {
  private translation = inject(DisplayTranslationPipe)

  readonly filterChips = input<FilterChipData[]>([])
  readonly displayBlockTriangle = input(true)
  readonly hasFilterChips = computed(() => this.filterChips().length > 0)

  constructor() {
    effect(() => {
      this.filterChips().forEach((chip) => {
        chip.twoLineDisplay = chip.typeExpanded ? this.getTrimmedLength(chip.type) > 22 : false
      })
    })
  }

  public toggleExpanded(chip: FilterChipPropertyData) {
    chip.expanded = !chip.expanded
  }

  public toggleTypeExpanded(chip: FilterChipData) {
    chip.typeExpanded = !chip.typeExpanded
    chip.twoLineDisplay = chip.typeExpanded ? this.getTrimmedLength(chip.type) > 22 : false
  }

  public getTrimmedLength(display: FilterChipData['type']): number {
    return this.translation.transform(display).trim().length
  }
}
