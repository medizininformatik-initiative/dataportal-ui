import { AbstractProfileFilter } from 'src/app/model/DataSelection/Profile/Filter/AbstractProfileFilter'
import { DataSelectionProfile } from 'src/app/model/DataSelection/Profile/DataSelectionProfile'
import { DataSelectionUIType } from 'src/app/model/Utilities/DataSelectionUIType'
import { EditFieldsComponent } from '../../../../shared-filter/components/edit-fields/edit-fields.component'
import { FilterTabsComponent } from '../filter-tabs/filter-tabs.component'
import { InformationSectionComponent } from '../../../../../shared/components/information-section/information-section.component'
import { PossibleReferencesService } from 'src/app/service/PossibleReferences.service'
import { ProfileHeaderComponent } from './header/profile-header.component'
import { ProfileReferenceComponent } from './reference/profile-reference.component'
import { ProfileTimeFilterComponent } from './profile-filter/profile-time-restriction/profile-time-filter.component'
import { ProfileTimeRestrictionFilter } from 'src/app/model/DataSelection/Profile/Filter/ProfileDateFilter'
import { ProfileTokenFilter } from 'src/app/model/DataSelection/Profile/Filter/ProfileTokenFilter'
import { SelectedBasicField } from 'src/app/model/DataSelection/Profile/Fields/BasicFields/SelectedBasicField'
import { SelectedReferenceField } from 'src/app/model/DataSelection/Profile/Fields/RefrenceFields/SelectedReferenceField'
import { StagedProfileService } from 'src/app/service/StagedDataSelectionProfile.service'
import { Subscription } from 'rxjs'
import { TokenFilterComponent } from './profile-filter/token-filter/token-filter.component'
import { TranslateModule } from '@ngx-translate/core'
import {
  AfterViewInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  computed,
  effect,
  inject,
  input,
  OnDestroy,
  OnInit,
  signal,
  TemplateRef,
  viewChild,
} from '@angular/core'
@Component({
  selector: 'num-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [
    ProfileHeaderComponent,
    FilterTabsComponent,
    EditFieldsComponent,
    ProfileTimeFilterComponent,
    TokenFilterComponent,
    ProfileReferenceComponent,
    InformationSectionComponent,
    TranslateModule,
  ],
})

/**
 * The ProfileComponent is responsible for displaying and managing the data selection profile.
 * It initializes the profile, updates selected fields, and manages filters.
 * Newly added and stagged references are managed automatically in the StagedProfileService.
 */
export class ProfileComponent implements AfterViewInit, OnInit, OnDestroy {
  private cdr = inject(ChangeDetectorRef)
  private stagedProfileService = inject(StagedProfileService)
  private possibleReferencesService = inject(PossibleReferencesService)

  readonly activeFieldTabId = signal<string | null>(null)

  readonly profile = input.required<DataSelectionProfile>()

  readonly tokenFilter = computed(() => {
    return this.profile()
      .getFilters()
      .find((filter: AbstractProfileFilter) => this.isTokenFilter(filter))
  })

  readonly timeRestrictionFilters = computed(() => {
    return this.profile()
      .getFilters()
      .filter((filter: AbstractProfileFilter) => this.isTimeRestrictionFilter(filter))
  })

  constructor() {
    effect(() => {
      this.stagedProfileService.initialize(this.profile())
    })

    const { activeTab, ...rest } = history.state
    this.activeFieldTabId.set(activeTab ?? null)

    history.replaceState(rest, '')
  }

  possibleReferencesServiceSubscription: Subscription

  templates: { template: TemplateRef<any>; name: string; active?: boolean }[] = []

  readonly fieldsTemplate = viewChild('fields', { read: TemplateRef })
  readonly timeRestrictionTemplate = viewChild('timeRestriction', { read: TemplateRef })
  readonly referenceTemplate = viewChild('reference', { read: TemplateRef })
  readonly tokenFilterTemplate = viewChild('token', { read: TemplateRef })
  readonly informationTemplate = viewChild('information', { read: TemplateRef })

  ngOnInit(): void {}

  ngOnDestroy(): void {
    this.possibleReferencesServiceSubscription?.unsubscribe()
    this.possibleReferencesService.clearReferencesMap()
  }

  /**
   * Lifecycle hook that is called after the component's view has been initialized.
   * Initializes the templates for rendering.
   */
  ngAfterViewInit(): void {
    this.stagedProfileService.initialize(this.profile())
    this.templates = []
    this.updateTemplatesArray()
    this.cdr.detectChanges()
  }

  private updateTemplatesArray(): void {
    this.setFieldsTemplate()
    this.setReferencesTemplate()
    this.setTimeRestrictionTemplate()
    this.setTokenFilterTemplate()
    this.setInformationTemplate()
    this.cdr.detectChanges()
  }

  private setInformationTemplate(): void {
    this.templates.push({ template: this.informationTemplate(), name: 'INFORMATION' })
  }

  private setTimeRestrictionTemplate(): void {
    if (this.timeRestrictionFilters().length > 0) {
      this.templates.push({ template: this.timeRestrictionTemplate(), name: 'TIMERESTRICTION' })
    }
  }

  private setTokenFilterTemplate(): void {
    if (this.tokenFilter()) {
      this.templates.push({ template: this.tokenFilterTemplate(), name: 'TOKEN' })
    }
  }

  private setFieldsTemplate(): void {
    const fields = this.profile().getProfileFields().getFieldTree()
    if (fields.length > 0) {
      this.templates.push({ template: this.fieldsTemplate(), name: 'FIELD' })
    }
  }

  private setReferencesTemplate(): void {
    const referenceFields = this.profile().getProfileFields().getReferenceFields()
    if (referenceFields && referenceFields.length > 0) {
      this.possibleReferencesServiceSubscription?.unsubscribe()
      const activeTab = this.activeFieldTabId() ? true : false //referenceFields[0].getElementId()
      this.templates.push({
        template: this.referenceTemplate(),
        name: 'REFERENCE',
        active: activeTab,
      })
    }
  }

  public updateSelectedFields(updatedSelectedBasicFields: SelectedBasicField[]): void {
    this.stagedProfileService.updateSelectedBasicFields(updatedSelectedBasicFields)
  }

  public updateProfileFilter(
    timeRestrictionFilter: ProfileTimeRestrictionFilter | ProfileTokenFilter
  ): void {
    this.stagedProfileService.updateProfileFilter(timeRestrictionFilter)
  }

  public updateSelectedReferenceFields(selectedReferenceFields: SelectedReferenceField[]): void {
    this.stagedProfileService.updateSelectedReferenceFields(selectedReferenceFields)
  }

  public updateLabel(label: string): void {
    this.stagedProfileService.updateLabel(label)
  }

  private isTimeRestrictionFilter(
    filter: AbstractProfileFilter
  ): filter is ProfileTimeRestrictionFilter {
    return filter.getUiType() === DataSelectionUIType.TIMERESTRICTION
  }

  private isTokenFilter(filter: AbstractProfileFilter): filter is ProfileTokenFilter {
    return filter.getUiType() === DataSelectionUIType.CODE
  }

  public trackByTimeRestrictionName(
    _index: number,
    profileTimeFilter: ProfileTimeRestrictionFilter
  ): string | number {
    return profileTimeFilter.getName() ?? _index
  }
}
