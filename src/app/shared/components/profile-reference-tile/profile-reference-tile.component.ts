import { A11yModule } from '@angular/cdk/a11y'
import { CheckboxComponent } from '../checkbox/checkbox.component'
import { Component, computed, inject, input, OnInit, output, Signal } from '@angular/core'
import { DataSelectionProfile } from 'src/app/model/DataSelection/Profile/DataSelectionProfile'
import { DataSelectionProfileCloner } from 'src/app/model/Utilities/DataSelecionCloner/DataSelectionProfileCloner'
import { DataSelectionProviderService } from 'src/app/service/Provider/DataSelectionProvider.service'
import { Display } from 'src/app/model/DataSelection/Profile/Display'
import { DisplayTranslationPipe } from '../../pipes/DisplayTranslationPipe'
import { FilterChipsComponent } from '../filter-chips/filter-chips.component'
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome'
import { InfoTooltipDirective } from '../../directives/info-tooltip.directive'
import { MatTooltip } from '@angular/material/tooltip'
import { MissingFilterComponent } from '../missing-filter/missing-filter.component'
import { ProfileProviderService } from 'src/app/service/Provider/ProfileProvider.service'
import { ProfileReferenceChipData } from '../../models/FilterChips/ProfileReferenceChipData'
import { ProfileReferenceChipsService } from '../../service/FilterChips/DataSelection/ProfileReferenceChips.service'
import { ProfileReferenceMenuFunctionsService } from '../../service/Menu/ProfileReference/ProfileReferenceMenuFunctionsService.service'
import { ReferenceField } from 'src/app/model/DataSelection/Profile/Fields/RefrenceFields/ReferenceField'
import { SelectedReferenceField } from 'src/app/model/DataSelection/Profile/Fields/RefrenceFields/SelectedReferenceField'
import { TranslateModule } from '@ngx-translate/core'
@Component({
  selector: 'num-profile-reference-tile',
  templateUrl: './profile-reference-tile.component.html',
  styleUrls: ['./profile-reference-tile.component.scss'],
  standalone: true,
  imports: [
    FontAwesomeModule,
    FilterChipsComponent,
    InfoTooltipDirective,
    CheckboxComponent,
    TranslateModule,
    DisplayTranslationPipe,
    MissingFilterComponent,
    A11yModule,
    MatTooltip,
  ],
})
export class ProfileReferenceTileComponent implements OnInit {
  private dataSelectionProviderService = inject(DataSelectionProviderService)
  private profileProviderService = inject(ProfileProviderService)
  private profileReferenceChipsService = inject(ProfileReferenceChipsService)
  private menuServiceDataSelectionFunctions = inject(ProfileReferenceMenuFunctionsService)

  readonly referenceField = input<SelectedReferenceField>()
  readonly unlinkedRequiredOrRecommendedReferences = input<ReferenceField>(undefined)
  readonly parentId = input<string>(undefined)
  readonly deleteTrigger = output<boolean>()
  readonly isEditable = input<boolean>(true)

  filterChips: ProfileReferenceChipData[] = []
  type: Signal<string> = computed(() => this.field()?.getType() ?? '')

  field: Signal<ReferenceField | SelectedReferenceField> = computed(
    () => this.referenceField() || this.unlinkedRequiredOrRecommendedReferences()
  )
  display: Signal<Display> = computed(() => this.field()?.getDisplay())
  elementId: Signal<string> = computed(() => this.field()?.getElementId() ?? undefined)

  constructor() {}

  ngOnInit(): void {
    this.initializeDisplayDataFilterChips()
  }

  private initializeDisplayDataFilterChips() {
    if (this.referenceField()) {
      this.filterChips.push(
        this.profileReferenceChipsService.getProfileReferenceChips(this.referenceField())
      )
    }
  }

  public setMustHave(checked: boolean) {
    const profile = this.cloneParentProfile()
    const field = profile
      .getProfileFields()
      .getSelectedReferenceFields()
      .find((selected) => selected.getElementId() === this.referenceField()?.getElementId())
    if (field) {
      field.setMustHave(checked)
      this.dataSelectionProviderService.setActiveProfile(profile)
    }
  }

  /**
   * Edits go to a clone: the stored profile is shared by both providers and must not change
   * before setActiveProfile publishes the new version.
   */
  private cloneParentProfile(): DataSelectionProfile {
    return DataSelectionProfileCloner.deepCopyProfile(
      this.profileProviderService.getOne(this.parentId())
    )
  }

  navigateToReferenceField(): void {
    this.menuServiceDataSelectionFunctions.navigate(this.parentId(), {
      elementId: this.elementId(),
    })
  }

  public deleteReferenceLink(): void {
    const profile = this.cloneParentProfile()
    if (this.unlinkedRequiredOrRecommendedReferences()) {
      const foundField = profile
        .getProfileFields()
        .getReferenceFields()
        .find(
          (field: ReferenceField) =>
            field.getElementId() === this.unlinkedRequiredOrRecommendedReferences().getElementId()
        )
      if (foundField) {
        foundField.setRecommended(false)
        this.dataSelectionProviderService.setActiveProfile(profile)
      }
    } else if (this.referenceField()) {
      const selectedReferences = profile.getProfileFields().getSelectedReferenceFields()
      const index = selectedReferences.findIndex(
        (field: SelectedReferenceField) =>
          field.getElementId() === this.referenceField().getElementId()
      )
      if (index !== -1) {
        selectedReferences.splice(index, 1)
        this.dataSelectionProviderService.setActiveProfile(profile)
        this.dataSelectionProviderService.resetUnlinkedReferences(
          this.referenceField().getLinkedProfileIds()
        )
      }
    }
    this.deleteTrigger.emit(true)
  }
}
