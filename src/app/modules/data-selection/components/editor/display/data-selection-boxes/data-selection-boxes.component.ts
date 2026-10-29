import { Component, computed, inject, input, output } from '@angular/core'
import { toSignal } from '@angular/core/rxjs-interop'
import { MatTooltip } from '@angular/material/tooltip'
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome'
import { TranslateModule } from '@ngx-translate/core'
import { DataSelectionProfile } from 'src/app/model/DataSelection/Profile/DataSelectionProfile'
import { SelectedReferenceField } from 'src/app/model/DataSelection/Profile/Fields/RefrenceFields/SelectedReferenceField'
import { DataSelectionProfileCloner } from 'src/app/model/Utilities/DataSelecionCloner/DataSelectionProfileCloner'
import { AppSettingsProviderService } from 'src/app/service/Config/AppSettingsProvider.service'
import { NavigationHelperService } from 'src/app/service/NavigationHelper.service'
import { RemoveReferenceService } from 'src/app/service/RemoveReference.service'
import { MenuComponent } from 'src/app/shared/components/menu/menu.component'
import { MenuItemInterface } from 'src/app/shared/models/Menu/MenuItemInterface'
import { DisplayTranslationPipe } from 'src/app/shared/pipes/DisplayTranslationPipe'
import { DataSelectionFieldsChipsService } from 'src/app/shared/service/FilterChips/DataSelection/DataSelectionFieldsChips.service'
import { DataSelectionProviderService } from '../../../../../../service/Provider/DataSelectionProvider.service'
import { DataSelectionMenuService } from '../../../../../../shared/service/Menu/DataSelection/DataSelectionMenu.service'
import { FieldsColComponent } from './colums/fields-col/fields-col.component'
import { FiltersColComponent } from './colums/filters-col/filters-col.component'
import { LabelColComponent } from './colums/label-col/label-col.component'
import { ReferenceColComponent } from './colums/reference-col/reference-col.component'
import { LinkedReferencesComponent } from './linked-references/linked-references.component'

@Component({
  selector: 'num-data-selection-boxes',
  templateUrl: './data-selection-boxes.component.html',
  styleUrls: ['./data-selection-boxes.component.scss'],
  providers: [DataSelectionFieldsChipsService],
  standalone: true,
  imports: [
    DisplayTranslationPipe,
    FieldsColComponent,
    FiltersColComponent,
    FontAwesomeModule,
    LabelColComponent,
    LinkedReferencesComponent,
    MatTooltip,
    MenuComponent,
    ReferenceColComponent,
    TranslateModule,
  ],
})
export class DataSelectionBoxesComponent {
  private readonly removeReferenceService = inject(RemoveReferenceService)
  private readonly menuService = inject(DataSelectionMenuService)
  private readonly appSettingsProvider = inject(AppSettingsProviderService)
  private readonly dataSelectionProvider = inject(DataSelectionProviderService)
  private readonly navigationHelper = inject(NavigationHelperService)

  public readonly profile = input.required<DataSelectionProfile>()
  public readonly isEditable = input<boolean>(true)
  public readonly searchTerm = input<string | undefined>(undefined)

  public readonly profileMoveUp = output<void>()
  public readonly profileMoveDown = output<void>()

  private readonly activeDataSelection = toSignal(this.dataSelectionProvider.getActiveDataSelection(), { initialValue: undefined })

  private readonly activeProfiles = toSignal(this.dataSelectionProvider.getActiveProfiles(), {
    initialValue: [],
  })

  public readonly isMainProfile = computed(() => this.appSettingsProvider.getDsePatientProfileUrl() === this.profile()?.getUrl())

  private readonly profileIndex = computed(() =>
    this.activeProfiles().findIndex((p: DataSelectionProfile) => p.getId() === this.profile()?.getId())
  )

  public readonly canMoveUp = computed(() => !this.isMainProfile() && this.profileIndex() > 1)

  public readonly canMoveDown = computed(
    () => !this.isMainProfile() && this.profileIndex() >= 0 && this.profileIndex() < this.activeProfiles().length - 1
  )

  public readonly isReferenced = computed(() => {
    const dataSelection = this.activeDataSelection()
    const profile = this.profile()
    if (!dataSelection) {
      return false
    }
    return dataSelection.getProfiles().some((selectionProfile: DataSelectionProfile) =>
      selectionProfile
        .getProfileFields()
        .getSelectedReferenceFields()
        .some((selectedReferenceField: SelectedReferenceField) => {
          return selectedReferenceField.getLinkedProfileIds().some((linkedProfileId: string) => profile.getId() === linkedProfileId)
        })
    )
  })

  public readonly menuItems = computed<MenuItemInterface[]>(() => this.menuService.getMenuItems(this.isMainProfile()))

  public deleteProfile(id: string): void {
    this.removeReferenceService.delete(id)
  }

  public navigate(): void {
    const id = this.profile()?.getId()
    if (id) {
      this.navigationHelper.navigateToEditProfile(id)
    }
  }

  public onReferenceSetChange(isReferenceSet: boolean): void {
    this.profile().getReference().setIsReferenceSet(isReferenceSet)
    const clonedProfile = DataSelectionProfileCloner.deepCopyProfile(this.profile())
    this.dataSelectionProvider.setActiveProfile(clonedProfile)
  }

  public moveProfileUp(): void {
    if (!this.canMoveUp()) {
      return
    }
    this.profileMoveUp.emit()
  }

  public moveProfileDown(): void {
    if (!this.canMoveDown()) {
      return
    }
    this.profileMoveDown.emit()
  }
}
