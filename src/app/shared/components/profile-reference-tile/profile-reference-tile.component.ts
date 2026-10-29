import { A11yModule } from '@angular/cdk/a11y'
import { Component, computed, inject, input, OnInit, output, Signal } from '@angular/core'
import { MatTooltip } from '@angular/material/tooltip'
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome'
import { TranslateModule } from '@ngx-translate/core'
import { DataSelectionProfile } from 'src/app/model/DataSelection/Profile/DataSelectionProfile'
import { Display } from 'src/app/model/DataSelection/Profile/Display'
import { ReferenceField } from 'src/app/model/DataSelection/Profile/Fields/RefrenceFields/ReferenceField'
import { SelectedReferenceField } from 'src/app/model/DataSelection/Profile/Fields/RefrenceFields/SelectedReferenceField'
import { DataSelectionProfileCloner } from 'src/app/model/Utilities/DataSelecionCloner/DataSelectionProfileCloner'
import { SelectedReferenceFieldsCloner } from 'src/app/model/Utilities/DataSelecionCloner/ProfileFields/SelectedReferenceFieldsCloner'
import { DataSelectionProviderService } from 'src/app/service/Provider/DataSelectionProvider.service'
import { ProfileProviderService } from 'src/app/service/Provider/ProfileProvider.service'
import { InfoTooltipDirective } from '../../directives/info-tooltip.directive'
import { ProfileReferenceChipData } from '../../models/FilterChips/ProfileReferenceChipData'
import { DisplayTranslationPipe } from '../../pipes/DisplayTranslationPipe'
import { ProfileReferenceChipsService } from '../../service/FilterChips/DataSelection/ProfileReferenceChips.service'
import { ProfileReferenceMenuFunctionsService } from '../../service/Menu/ProfileReference/ProfileReferenceMenuFunctionsService.service'
import { ProfileReferenceMenuService } from '../../service/Menu/ProfileReference/ProfileReferenceMenuService.service'
import { CheckboxComponent } from '../checkbox/checkbox.component'
import { FilterChipsComponent } from '../filter-chips/filter-chips.component'
import { MissingFilterComponent } from '../missing-filter/missing-filter.component'
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
  private readonly dataSelectionProviderService = inject(DataSelectionProviderService)
  private readonly profileProviderService = inject(ProfileProviderService)
  private readonly profileReferenceChipsService = inject(ProfileReferenceChipsService)
  private readonly profileReferenceMenuService = inject(ProfileReferenceMenuService)
  private readonly menuServiceDataSelectionFunctions = inject(ProfileReferenceMenuFunctionsService)

  public readonly referenceField = input<SelectedReferenceField>()
  public readonly unlinkedRequiredOrRecommendedReferences = input<ReferenceField>(undefined)
  public readonly parentId = input<string>(undefined)
  public readonly deleteTrigger = output<boolean>()
  public readonly isEditable = input<boolean>(true)

  public filterChips: ProfileReferenceChipData[] = []
  public type: Signal<string> = computed(() => this.field()?.getType() ?? '')

  public field: Signal<ReferenceField | SelectedReferenceField> = computed(
    () => this.referenceField() || this.unlinkedRequiredOrRecommendedReferences()
  )
  public display: Signal<Display> = computed(() => this.field()?.getDisplay())
  public elementId: Signal<string> = computed(() => this.field()?.getElementId() ?? undefined)

  public readonly menuItems: Signal<ReturnType<ProfileReferenceMenuService['getMenuItems']>> = computed(() => {
    const idToUse = this.parentId() ?? ''
    return this.profileReferenceMenuService.getMenuItems(idToUse, { elementId: this.elementId() })
  })

  constructor() {}

  public ngOnInit(): void {
    this.profileReferenceMenuService.getMenuItems(this.parentId(), { elementId: this.elementId() })
    this.initializeDisplayDataFilterChips()
  }

  private initializeDisplayDataFilterChips() {
    if (this.referenceField()) {
      this.filterChips.push(this.profileReferenceChipsService.getProfileReferenceChips(this.referenceField()))
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
      selectedReferences[index] = SelectedReferenceFieldsCloner.deepCopySelectedReferenceField(this.referenceField())
      this.updateProfile(profile)
    }
  }

  private updateProfile(profile: DataSelectionProfile): void {
    const updatedProfile = DataSelectionProfileCloner.deepCopyProfile(profile)
    this.dataSelectionProviderService.setActiveProfile(updatedProfile, 'SET')
  }

  private getIndexOfSelectedReferenceField(selectedReferences: SelectedReferenceField[]): number {
    const index = selectedReferences.findIndex(
      (field: SelectedReferenceField) => field.getElementId() === this.referenceField().getElementId()
    )
    return index
  }

  public navigateToReferenceField(): void {
    this.menuServiceDataSelectionFunctions.navigate(this.parentId(), {
      elementId: this.elementId(),
    })
  }

  public deleteReferenceLink(): void {
    const profile = this.profileProviderService.getOne(this.parentId())
    if (this.unlinkedRequiredOrRecommendedReferences()) {
      const profileFields = profile.getProfileFields().getReferenceFields()
      const foundField = profileFields.find(
        (field: ReferenceField) => field.getElementId() === this.unlinkedRequiredOrRecommendedReferences().getElementId()
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
