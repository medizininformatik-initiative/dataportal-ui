import { AbstractProfileFilter } from 'src/app/model/DataSelection/Profile/Filter/AbstractProfileFilter';
import { DataSelectionProfile } from 'src/app/model/DataSelection/Profile/DataSelectionProfile';
import { DataSelectionUIType } from 'src/app/model/Utilities/DataSelectionUIType';
import { PossibleReferencesService } from 'src/app/service/PossibleReferences.service';
import { ProfileTimeRestrictionFilter } from 'src/app/model/DataSelection/Profile/Filter/ProfileDateFilter';
import { ProfileTokenFilter } from 'src/app/model/DataSelection/Profile/Filter/ProfileTokenFilter';
import { SelectedBasicField } from 'src/app/model/DataSelection/Profile/Fields/BasicFields/SelectedBasicField';
import { SelectedReferenceField } from 'src/app/model/DataSelection/Profile/Fields/RefrenceFields/SelectedReferenceField';
import { StagedProfileService } from 'src/app/service/StagedDataSelectionProfile.service';
import { Subscription } from 'rxjs';
import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  TemplateRef,
  ViewChild,
  ChangeDetectionStrategy,
  OnInit,
  OnDestroy,
  Input,
} from '@angular/core';
@Component({
  selector: 'num-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})

/**
 * The ProfileComponent is responsible for displaying and managing the data selection profile.
 * It initializes the profile, updates selected fields, and manages filters.
 * Newly added and stagged references are managed automatically in the StagedProfileService.
 */
export class ProfileComponent implements AfterViewInit, OnInit, OnDestroy {
  @Input()
  profile: DataSelectionProfile;

  timeRestrictionFilters: ProfileTimeRestrictionFilter[] = [];

  tokenFilter: ProfileTokenFilter;

  possibleReferencesServiceSubscription: Subscription;

  templates: { template: TemplateRef<any>; name: string }[] = [];

  @ViewChild('fields', { static: false, read: TemplateRef })
  readonly fieldsTemplate: TemplateRef<any>;
  @ViewChild('timeRestriction', { static: false, read: TemplateRef })
  readonly timeRestrictionTemplate: TemplateRef<any>;
  @ViewChild('reference', { static: false, read: TemplateRef })
  readonly referenceTemplate: TemplateRef<any>;
  @ViewChild('token', { static: false, read: TemplateRef })
  readonly tokenFilterTemplate: TemplateRef<any>;
  @ViewChild('information', { static: false, read: TemplateRef })
  readonly informationTemplate: TemplateRef<any>;

  constructor(
    private cdr: ChangeDetectorRef,
    private stagedProfileService: StagedProfileService,
    private possibleReferencesService: PossibleReferencesService
  ) {}

  ngOnInit(): void {
    this.stagedProfileService.initialize(this.profile);
  }

  ngOnDestroy(): void {
    this.possibleReferencesServiceSubscription?.unsubscribe();
    this.possibleReferencesService.clearPossibleReferencesMap();
  }

  /**
   * Lifecycle hook that is called after the component's view has been initialized.
   * Initializes the templates for rendering.
   */
  ngAfterViewInit(): void {
    this.stagedProfileService.initialize(this.profile);
    this.templates = [];
    this.updateTemplatesArray();
  }

  private updateTemplatesArray(): void {
    this.setFieldsTemplate();
    this.setReferencesTemplate();
    this.setTimeRestrictionTemplate();
    this.setTokenFilterTemplate();
    this.setInformationTemplate();
    this.cdr.detectChanges();
  }

  private setInformationTemplate(): void {
    this.templates.push({ template: this.informationTemplate, name: 'INFORMATION' });
  }

  private setTimeRestrictionTemplate(): void {
    this.profile.getFilters().forEach((filter) => {
      if (this.isTimeRestrictionFilter(filter)) {
        this.timeRestrictionFilters.push(filter);
        this.templates.push({ template: this.timeRestrictionTemplate, name: 'TIMERESTRICTION' });
      }
    });
  }

  private setTokenFilterTemplate(): void {
    this.profile.getFilters().forEach((filter: AbstractProfileFilter) => {
      if (this.isTokenFilter(filter)) {
        this.tokenFilter = filter;
        this.templates.push({ template: this.tokenFilterTemplate, name: 'TOKEN' });
      }
    });
  }

  private setFieldsTemplate(): void {
    const fields = this.profile.getProfileFields().getFieldTree();
    if (fields.length > 0) {
      this.templates.push({ template: this.fieldsTemplate, name: 'FIELD' });
    }
  }

  private setReferencesTemplate(): void {
    const referenceFields = this.profile.getProfileFields().getReferenceFields();
    if (referenceFields && referenceFields.length > 0) {
      this.possibleReferencesServiceSubscription?.unsubscribe();
      this.templates.push({ template: this.referenceTemplate, name: 'REFERENCE' });
    }
  }

  public updateSelectedFields(updatedSelectedBasicFields: SelectedBasicField[]): void {
    this.stagedProfileService.updateSelectedBasicFields(updatedSelectedBasicFields);
  }

  public updateProfileFilter(
    timeRestrictionFilter: ProfileTimeRestrictionFilter | ProfileTokenFilter
  ): void {
    this.stagedProfileService.updateProfileFilter(timeRestrictionFilter);
  }

  public updateSelectedReferenceFields(selectedReferenceFields: SelectedReferenceField[]): void {
    this.stagedProfileService.updateSelectedReferenceFields(selectedReferenceFields);
  }

  public updateLabel(label: string): void {
    this.stagedProfileService.updateLabel(label);
  }

  private isTimeRestrictionFilter(
    filter: AbstractProfileFilter
  ): filter is ProfileTimeRestrictionFilter {
    return filter.getUiType() === DataSelectionUIType.TIMERESTRICTION;
  }

  private isTokenFilter(filter: AbstractProfileFilter): filter is ProfileTokenFilter {
    return filter.getUiType() === DataSelectionUIType.CODE;
  }
}
