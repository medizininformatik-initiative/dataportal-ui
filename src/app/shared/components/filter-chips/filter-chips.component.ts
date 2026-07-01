import { Component, computed, effect, inject, input } from '@angular/core'
import { DisplayTranslationPipe } from '../../pipes/DisplayTranslationPipe'
import { FilterChipData } from '../../models/FilterChips/FilterChipData'
import { FilterChipPropertyData } from '../../models/FilterChips/FilterChipPropertyData'
import { NgClass } from '@angular/common'
import { MatTooltip } from '@angular/material/tooltip'

@Component({
  selector: 'num-filter-chips',
  templateUrl: './filter-chips.component.html',
  styleUrls: ['./filter-chips.component.scss'],
  standalone: true,
  imports: [NgClass, DisplayTranslationPipe, MatTooltip],
})
export class FilterChipsComponent {
  private translation = inject(DisplayTranslationPipe)

  readonly filterChips = input<FilterChipData[]>([])
  readonly displayBlockTriangle = input(true)
  readonly showAll = input(false)
  readonly maxVisible = input(3)
  readonly hasFilterChips = computed(() => this.filterChips().length > 0)

  private readonly twoLineCharLimit = 22

  constructor() {
    effect(() => {
      this.filterChips().forEach((chip) => {
        chip.twoLineDisplay = chip.typeExpanded
          ? this.getTrimmedLength(chip.type) > this.twoLineCharLimit
          : false
      })
    })
  }

  public toggleExpanded(chip: FilterChipPropertyData) {
    chip.expanded = !chip.expanded
  }

  public toggleTypeExpanded(chip: FilterChipData) {
    chip.typeExpanded = !chip.typeExpanded
    chip.twoLineDisplay = chip.typeExpanded
      ? this.getTrimmedLength(chip.type) > this.twoLineCharLimit
      : false
  }

  public getTrimmedLength(display: FilterChipData['type']): number {
    return this.translation.transform(display).trim().length
  }

  public getOverflowTooltip(chips: FilterChipPropertyData[]): string {
    return chips
      .slice(this.maxVisible())
      .map((chip) => this.translation.transform(chip.text))
      .join(' • ')
  }
}
