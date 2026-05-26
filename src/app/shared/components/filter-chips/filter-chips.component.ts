import { Component, Input, OnInit } from '@angular/core'
import { DisplayData } from '../../../model/Interface/DisplayData'
import { DisplayTranslationPipe } from '../../pipes/DisplayTranslationPipe'
import { FilterChipData } from '../../models/FilterChips/FilterChipData'
import { Observable, of } from 'rxjs'
import { FilterChipPropertyData } from '../../models/FilterChips/FilterChipPropertyData'
import { NgClass } from '@angular/common'

@Component({
  selector: 'num-filter-chips',
  templateUrl: './filter-chips.component.html',
  styleUrls: ['./filter-chips.component.scss'],
  standalone: true,
  imports: [NgClass, DisplayTranslationPipe],
})
export class FilterChipsComponent implements OnInit {
  chipData$: Observable<FilterChipData[]> = of([])

  @Input()
  filterChips: FilterChipData[] = []

  @Input()
  displayBlockTriangle = true

  constructor(private translation: DisplayTranslationPipe) {}

  ngOnInit(): void {}

  public toggleExpanded(chip: FilterChipPropertyData) {
    chip.expanded = !chip.expanded
  }
  public toggleTypeExpanded(chip) {
    chip.typeExpanded = !chip.typeExpanded
    if (chip.typeExpanded) {
      chip.twoLineDisplay = this.getLength(chip.type) > 22
    } else {
      chip.twoLineDisplay = false
    }
  }

  public getLength(display: DisplayData): number {
    return this.translation.transform(display).length
  }
}
