import { ChangeDetectionStrategy, Component, effect, input, output } from '@angular/core'
import { MatTab, MatTabGroup, MatTabLabel } from '@angular/material/tabs'
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome'
import { TranslateModule } from '@ngx-translate/core'
import { Display } from 'src/app/model/DataSelection/Profile/Display'
import { Concept } from 'src/app/model/FeasibilityQuery/Criterion/AttributeFilter/Concept/Concept'
import { ConceptFilter } from 'src/app/model/FeasibilityQuery/Criterion/AttributeFilter/Concept/ConceptFilter'
import { v4 as uuidv4 } from 'uuid'
import { InformationSectionComponent } from '../../../../../../shared/components/information-section/information-section.component'
import { ConceptFilterComponent } from '../../../../../shared-filter/components/concept/concept-filter.component'
import { SelectedConceptListComponent } from '../../../../../shared-filter/components/concept/selected-concept-list/selected-concept-list.component'
import { ConceptBulkSearchComponent } from '../../../../../shared-filter/components/concept-bulk-search/concept-bulk-search.component'

@Component({
  selector: 'num-concept',
  templateUrl: './concept.component.html',
  styleUrls: ['./concept.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [
    MatTabGroup,
    MatTab,
    MatTabLabel,
    FontAwesomeModule,
    InformationSectionComponent,
    ConceptFilterComponent,
    ConceptBulkSearchComponent,
    SelectedConceptListComponent,
    TranslateModule,
  ],
})
export class ConceptComponent {
  public readonly conceptFilter = input.required<ConceptFilter>()

  public readonly changedConceptFilter = output<ConceptFilter>()

  public readonly display = input<Display>(undefined)

  public expanded = false

  public tabChanged = false

  public selectedConcepts: Concept[] = []

  constructor() {
    effect(() => {
      this.selectedConcepts = this.conceptFilter().getSelectedConcepts()
    })
  }

  public emitConceptFilter(selectedConcepts: Concept[]) {
    const newConceptFilter = new ConceptFilter(uuidv4(), this.conceptFilter().getAllowedConceptUrls(), selectedConcepts)
    this.changedConceptFilter.emit(newConceptFilter)
  }

  public onTabChange(): void {
    this.tabChanged = !this.tabChanged
  }
}
