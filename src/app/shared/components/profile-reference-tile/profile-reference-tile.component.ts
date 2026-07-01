import { CheckboxComponent } from '../checkbox/checkbox.component'
import { Component, computed, inject, input, OnInit, output, Signal } from '@angular/core'
import { DataSelectionProfile } from 'src/app/model/DataSelection/Profile/DataSelectionProfile'
import { DataSelectionProfileCloner } from 'src/app/model/Utilities/DataSelecionCloner/DataSelectionProfileCloner'
import { DataSelectionProviderService } from 'src/app/modules/data-selection/services/DataSelectionProvider.service'
import { Display } from 'src/app/model/DataSelection/Profile/Display'
import { DisplayTranslationPipe } from '../../pipes/DisplayTranslationPipe'
import { FilterChipsComponent } from '../filter-chips/filter-chips.component'
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome'
import { InfoTooltipDirective } from '../../directives/info-tooltip.directive'
import { MenuComponent } from '../menu/menu.component'
import { MenuProfileReference } from '../../service/Menu/DataSelection/MenuProfileReference.service'
import { MenuProfileReferenceFunctionsService } from '../../service/Menu/DataSelection/MenuProfileReferenceFunctions.service'
import { ProfileProviderService } from 'src/app/service/Provider/ProfileProvider.service'
import { ProfileReferenceChipData } from '../../models/FilterChips/ProfileReferenceChipData'
import { ProfileReferenceChipsService } from '../../service/FilterChips/DataSelection/ProfileReferenceChips.service'
import { ReferenceField } from 'src/app/model/DataSelection/Profile/Fields/RefrenceFields/ReferenceField'
import { SelectedReferenceField } from 'src/app/model/DataSelection/Profile/Fields/RefrenceFields/SelectedReferenceField'
import { SelectedReferenceFieldsCloner } from 'src/app/model/Utilities/DataSelecionCloner/ProfileFields/SelectedReferenceFieldsCloner'
import { TranslateModule } from '@ngx-translate/core'
import { MissingFilterComponent } from '../missing-filter/missing-filter.component'
import { A11yModule } from '@angular/cdk/a11y'
import { MatTooltip } from '@angular/material/tooltip'
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
  private profileReferenceMenuService = inject(MenuProfileReference)
  private menuServiceDataSelectionFunctions = inject(MenuProfileReferenceFunctionsService)

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

  readonly menuItems: Signal<ReturnType<MenuProfileReference['getMenuItems']>> = computed(() => {
    const idToUse = this.parentId() ?? ''
    return this.profileReferenceMenuService.getMenuItems(idToUse, { elementId: this.elementId() })
  })

  constructor() {}

  ngOnInit(): void {
    this.profileReferenceMenuService.getMenuItems(this.parentId(), { elementId: this.elementId() })
    this.initiliazeDisplayDataFiletrChips()
  }

  private initiliazeDisplayDataFiletrChips() {
    if (this.referenceField()) {
      this.filterChips.push(
        this.profileReferenceChipsService.getProfileReferenceChips(this.referenceField())
      )
    }
  }

  public setMustHave(checked: boolean) {
    if (this.referenceField()) {
      this.referenceField().setMustHave(checked)
      this.updateReferenceField()
    }
  }

  private updateReferenceField(): void {
    const profile = this.profileProviderService.getOne(this.parentId())
    const selectedReferences = profile.getProfileFields().getSelectedReferenceFields()
    const index = this.getIndexOfSelectedReferenceField(selectedReferences)

    if (index !== -1) {
      selectedReferences[index] = SelectedReferenceFieldsCloner.deepCopySelectedReferenceField(
        this.referenceField()
      )
      this.updateProfile(profile)
    }
  }

  private updateProfile(profile: DataSelectionProfile): void {
    const updatedProfile = DataSelectionProfileCloner.deepCopyProfile(profile)
    this.profileProviderService.setOne(updatedProfile)
    this.dataSelectionProviderService.setProfileInActiveDataSelection(updatedProfile)
  }

  private getIndexOfSelectedReferenceField(selectedReferences: SelectedReferenceField[]): number {
    const index = selectedReferences.findIndex(
      (field: SelectedReferenceField) =>
        field.getElementId() === this.referenceField().getElementId()
    )
    return index
  }

  navigateToReferenceField(): void {
    this.menuServiceDataSelectionFunctions.navigate(this.parentId(), {
      elementId: this.elementId(),
    })
  }

  public deleteReferenceLink(): void {
    const profile = this.profileProviderService.getOne(this.parentId())
    if (this.unlinkedRequiredOrRecommendedReferences()) {
      const profileFields = profile.getProfileFields().getReferenceFields()
      const foundField = profileFields.find(
        (field: ReferenceField) =>
          field.getElementId() === this.unlinkedRequiredOrRecommendedReferences().getElementId()
      )
      if (foundField) {
        foundField.setRecommended(false)
        this.updateProfile(profile)
      }
    } else if (this.referenceField()) {
      const selectedReferences = profile.getProfileFields().getSelectedReferenceFields()
      const index = this.getIndexOfSelectedReferenceField(selectedReferences)

      if (index !== -1) {
        selectedReferences.splice(index, 1)
        this.updateProfile(profile)
      }
    }
    this.deleteTrigger.emit(true)
  }
}
