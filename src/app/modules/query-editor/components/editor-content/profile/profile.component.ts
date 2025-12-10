import { AbstractProfileFilter } from 'src/app/model/DataSelection/Profile/Filter/AbstractProfileFilter';
import { DataSelectionProfile } from 'src/app/model/DataSelection/Profile/DataSelectionProfile';
import { PossibleReferencesService } from 'src/app/service/PossibleReferences.service';
import { SelectedBasicField } from 'src/app/model/DataSelection/Profile/Fields/BasicFields/SelectedBasicField';
import { SelectedReferenceField } from 'src/app/model/DataSelection/Profile/Fields/RefrenceFields/SelectedReferenceField';
import { StagedProfileService } from 'src/app/service/StagedDataSelectionProfile.service';
import { distinctUntilChanged, distinctUntilKeyChanged, last, skip, Subscription, tap } from 'rxjs';
import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  TemplateRef,
  ViewChild,
  ChangeDetectionStrategy,
  OnInit,
  OnDestroy,
  SimpleChanges,
} from '@angular/core';
import { ProfileTimeRestrictionFilter } from 'src/app/model/DataSelection/Profile/Filter/ProfileDateFilter';
import { DataSelectionUIType } from 'src/app/model/Utilities/DataSelectionUIType';
import { ProfileTokenFilter } from 'src/app/model/DataSelection/Profile/Filter/ProfileTokenFilter';
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
  profile: DataSelectionProfile;

  timeRestrictionFilters: ProfileTimeRestrictionFilter[] = [];

  tokenFilter: ProfileTokenFilter;

  stagedProfileServiceSubscription: Subscription;

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

  ngOnInit(): void {}

  ngOnDestroy(): void {
    this.stagedProfileServiceSubscription?.unsubscribe();
    this.possibleReferencesServiceSubscription?.unsubscribe();
    this.possibleReferencesService.clearPossibleReferencesMap();
  }

  /**
   * Lifecycle hook that is called after the component's view has been initialized.
   * Initializes the templates for rendering.
   */
  ngAfterViewInit(): void {
    this.stagedProfileServiceSubscription?.unsubscribe();
    this.templates = [];
    this.stagedProfileServiceSubscription = this.stagedProfileService
      .getProfileObservable()
      .pipe(
        tap((profile) => (this.profile = profile)),
        tap(() => {
          this.tokenFilter = this.profile
            .getFilters()
            .find((filter) => filter.getUiType() === DataSelectionUIType.CODE) as ProfileTokenFilter;
          this.cdr.detectChanges();
        })
      )
      .subscribe(() => {
        if (this.templates.length === 0) {
          this.updateTemplatesArray();
        }
      });
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
      if (filter.getUiType() === DataSelectionUIType.TIMERESTRICTION) {
        this.timeRestrictionFilters.push(filter as ProfileTimeRestrictionFilter);
        this.templates.push({ template: this.timeRestrictionTemplate, name: 'TIMERESTRICTION' });
      }
    });
  }

  private setTokenFilterTemplate(): void {
    this.profile.getFilters().forEach((filter: AbstractProfileFilter) => {
      if (filter.getUiType() === DataSelectionUIType.CODE) {
        this.tokenFilter = filter as ProfileTokenFilter;
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
}
