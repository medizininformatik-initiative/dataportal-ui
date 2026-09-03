import { AppSettingsProviderService } from 'src/app/service/Config/AppSettingsProvider.service'
import { Component, computed, inject, input, output } from '@angular/core'
import { DataSelectionFieldsChipsService } from 'src/app/shared/service/FilterChips/DataSelection/DataSelectionFieldsChips.service'
import { DataSelectionProfile } from 'src/app/model/DataSelection/Profile/DataSelectionProfile'
import { DataSelectionProfileCloner } from 'src/app/model/Utilities/DataSelecionCloner/DataSelectionProfileCloner'
import { DisplayTranslationPipe } from 'src/app/shared/pipes/DisplayTranslationPipe'
import { FieldsColComponent } from './colums/fields-col/fields-col.component'
import { FiltersColComponent } from './colums/filters-col/filters-col.component'
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome'
import { LabelColComponent } from './colums/label-col/label-col.component'
import { LinkedReferencesComponent } from './linked-references/linked-references.component'
import { MatTooltip } from '@angular/material/tooltip'
import { MenuComponent } from 'src/app/shared/components/menu/menu.component'
import { MenuItemInterface } from 'src/app/shared/models/Menu/MenuItemInterface'
import { NavigationHelperService } from 'src/app/service/NavigationHelper.service'
import { ReferenceColComponent } from './colums/reference-col/reference-col.component'
import { RemoveReferenceService } from 'src/app/service/RemoveReference.service'
import { toSignal } from '@angular/core/rxjs-interop'
import { TranslateModule } from '@ngx-translate/core'
import { DataSelectionProviderService } from '../../../../../../service/Provider/DataSelectionProvider.service'
import { DataSelectionMenuService } from '../../../../../../shared/service/Menu/DataSelection/DataSelectionMenu.service'

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

  readonly profile = input.required<DataSelectionProfile>()
  readonly isEditable = input<boolean>(true)
  readonly searchTerm = input<string | undefined>(undefined)

  readonly profileMoveUp = output<void>()
  readonly profileMoveDown = output<void>()

  private readonly activeDataSelection = toSignal(
    this.dataSelectionProvider.getActiveDataSelection(),
    { initialValue: undefined }
  )

  private readonly activeProfiles = toSignal(this.dataSelectionProvider.getActiveProfiles(), {
    initialValue: [],
  })

  readonly isMainProfile = computed(
    () => this.appSettingsProvider.getDsePatientProfileUrl() === this.profile()?.getUrl()
  )

  private readonly profileIndex = computed(() =>
    this.activeProfiles().findIndex((p) => p.getId() === this.profile()?.getId())
  )

  readonly canMoveUp = computed(() => !this.isMainProfile() && this.profileIndex() > 1)

  readonly canMoveDown = computed(
    () =>
      !this.isMainProfile() &&
      this.profileIndex() >= 0 &&
      this.profileIndex() < this.activeProfiles().length - 1
  )

  readonly isReferenced = computed(() => {
    const dataSelection = this.activeDataSelection()
    if (!dataSelection) return false
    return dataSelection.getProfiles().some((profile: DataSelectionProfile) =>
      profile
        .getProfileFields()
        .getSelectedReferenceFields()
        .some((ref) => ref.getLinkedProfileIds().includes(profile.getId()))
    )
  })

  readonly menuItems = computed<MenuItemInterface[]>(() =>
    this.menuService.getMenuItems(this.isMainProfile())
  )

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
    if (!this.canMoveUp()) return
    this.profileMoveUp.emit()
  }

  public moveProfileDown(): void {
    if (!this.canMoveDown()) return
    this.profileMoveDown.emit()
  }
}
