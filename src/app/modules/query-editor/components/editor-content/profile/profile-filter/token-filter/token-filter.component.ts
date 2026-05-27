import { Concept } from 'src/app/model/FeasibilityQuery/Criterion/AttributeFilter/Concept/Concept'
import { ProfileTokenFilter } from 'src/app/model/DataSelection/Profile/Filter/ProfileTokenFilter'
import { ChangeDetectionStrategy, Component, effect, input, output } from '@angular/core'
import { MatTabGroup, MatTab, MatTabLabel } from '@angular/material/tabs'
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome'
import { InformationSectionComponent } from '../../../../../../../shared/components/information-section/information-section.component'
import { ConceptFilterComponent } from '../../../../../../shared-filter/components/concept/concept-filter.component'
import { ConceptBulkSearchComponent } from '../../../../../../shared-filter/components/concept-bulk-search/concept-bulk-search.component'
import { SelectedConceptListComponent } from '../../../../../../shared-filter/components/concept/selected-concept-list/selected-concept-list.component'
import { TranslateModule } from '@ngx-translate/core'

@Component({
  selector: 'num-token-filter',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './token-filter.component.html',
  styleUrls: ['./token-filter.component.scss'],
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
export class TokenFilterComponent {
  readonly tokenFilter = input.required<ProfileTokenFilter>()
  readonly tokenFilterChanged = output<ProfileTokenFilter>()
  tabChanged = false
  selectedConcepts: Concept[] = []
  constructor() {
    effect(() => {
      this.selectedConcepts = this.tokenFilter().getSelectedTokens()
    })
  }

  /**
   * Updates the selected concepts in the token filter and emits the updated token filter instance.
   * @param concepts - The updated list of selected concepts.
   */
  public updateSelectedConcepts(concepts: Concept[]): void {
    const newProfileTokenFilter = this.createProfileTokenFilterInstance(concepts)
    this.tokenFilterChanged.emit(newProfileTokenFilter)
  }

  private createProfileTokenFilterInstance(concepts: Concept[]): ProfileTokenFilter {
    return new ProfileTokenFilter(
      this.tokenFilter().getId(),
      this.tokenFilter().getName(),
      this.tokenFilter().getType(),
      this.tokenFilter().getValueSetUrls(),
      concepts
    )
  }

  public onTabChange(): void {
    this.tabChanged = !this.tabChanged
  }
}
