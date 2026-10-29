import { NgClass } from '@angular/common'
import { Component, computed, effect, inject, input } from '@angular/core'
import { MatTooltip } from '@angular/material/tooltip'
import { NumDataCyDirective } from '../../directives/num-data-cy.directive'
import { FilterChipData } from '../../models/FilterChips/FilterChipData'
import { FilterChipPropertyData } from '../../models/FilterChips/FilterChipPropertyData'
import { DisplayTranslationPipe } from '../../pipes/DisplayTranslationPipe'
import { HighlightPipe } from '../../pipes/HighlightPipe'

@Component({
  selector: 'num-filter-chips',
  templateUrl: './filter-chips.component.html',
  styleUrls: ['./filter-chips.component.scss'],
  standalone: true,
  imports: [NgClass, DisplayTranslationPipe, HighlightPipe, MatTooltip, NumDataCyDirective],
})
export class FilterChipsComponent {
  private readonly translation = inject(DisplayTranslationPipe)

  public readonly filterChips = input<FilterChipData[]>([])
  public readonly displayBlockTriangle = input(true)
  public readonly showAll = input(false)
  public readonly maxVisible = input(3)
  public readonly searchTerm = input<string | undefined>(undefined)
  public readonly hasFilterChips = computed(() => this.filterChips().length > 0)

  private readonly twoLineCharLimit = 22

  constructor() {
    effect(() => {
      this.filterChips().forEach((chip) => {
        chip.twoLineDisplay = chip.typeExpanded ? this.getTrimmedLength(chip.type) > this.twoLineCharLimit : false
      })
    })
  }

  public toggleExpanded(chip: FilterChipPropertyData) {
    chip.expanded = !chip.expanded
  }

  public toggleTypeExpanded(chip: FilterChipData) {
    chip.typeExpanded = !chip.typeExpanded
    chip.twoLineDisplay = chip.typeExpanded ? this.getTrimmedLength(chip.type) > this.twoLineCharLimit : false
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

  public buildChipText(chip: FilterChipPropertyData): string {
    let label = this.translation.transform(chip.text)
    if (chip.labelNumber && chip.labelNumber > 0) {
      label += ` (${chip.labelNumber})`
    }
    return label
  }
}
