import { Component, OnInit, inject, input, output } from '@angular/core'
import { Concept } from 'src/app/model/FeasibilityQuery/Criterion/AttributeFilter/Concept/Concept'
import { SelectedConceptFilterProviderService } from '../../../service/ConceptFilter/SelectedConceptFilterProvider.service'
import { SelectedListItem } from 'src/app/shared/components/selected-items-list/selected-items-list.component'
import { SelectedItemsListComponent } from '../../../../../shared/components/selected-items-list/selected-items-list.component'

@Component({
  selector: 'num-selected-concept-list',
  templateUrl: './selected-concept-list.component.html',
  styleUrls: ['./selected-concept-list.component.scss'],
  standalone: true,
  imports: [SelectedItemsListComponent],
})
export class SelectedConceptListComponent implements OnInit {
  private conceptProviderService = inject(SelectedConceptFilterProviderService)

  readonly selectedConcepts = input<Concept[]>([])

  readonly changedSelectedConcepts = output<Concept[]>()

  /** Inserted by Angular inject() migration for backwards compatibility */
  constructor(...args: unknown[])

  constructor() {}

  ngOnInit(): void {}

  get listItems(): SelectedListItem[] {
    return this.selectedConcepts().map((c) => ({
      display: c.getDisplay(),
      code: c.getTerminologyCode().getCode(),
    }))
  }

  public removeAtIndex(index: number): void {
    const concept = this.selectedConcepts()[index]
    this.conceptProviderService.removeConcept(concept)
    this.changedSelectedConcepts.emit(this.conceptProviderService.getSelectedConceptsValue())
  }
}
