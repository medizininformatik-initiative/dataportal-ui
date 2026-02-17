import { AbstractProfileFilter } from 'src/app/model/DataSelection/Profile/Filter/AbstractProfileFilter';
import { BasicField } from 'src/app/model/DataSelection/Profile/Fields/BasicFields/BasicField';
import { BasicFieldData } from 'src/app/model/Interface/BasicFieldData';
import { BetweenFilter } from 'src/app/model/FeasibilityQuery/Criterion/TimeRestriction/BetweenFilter';
import { concatMap, map, Observable } from 'rxjs';
import { DataSelectionApiService } from '../Backend/Api/DataSelectionApi.service';
import { DataSelectionProfile } from 'src/app/model/DataSelection/Profile/DataSelectionProfile';
import { DataSelectionProfileData } from 'src/app/model/Interface/DataSelectionProfileData';
import { DataSelectionUIType } from 'src/app/model/Utilities/DataSelectionUIType';
import { Display } from 'src/app/model/DataSelection/Profile/Display';
import { Injectable } from '@angular/core';
import { ProfileFields } from 'src/app/model/DataSelection/Profile/Fields/ProfileFields';
import { ProfileFilterData } from 'src/app/model/Interface/ProfileFilterData';
import { ProfileProviderService } from 'src/app/modules/data-selection/services/ProfileProvider.service';
import { ProfileReference } from 'src/app/model/DataSelection/Profile/Reference/ProfileReference';
import { ProfileTimeRestrictionFilter } from 'src/app/model/DataSelection/Profile/Filter/ProfileDateFilter';
import { ProfileTokenFilter } from 'src/app/model/DataSelection/Profile/Filter/ProfileTokenFilter';
import { ReferenceField } from 'src/app/model/DataSelection/Profile/Fields/RefrenceFields/ReferenceField';
import { ReferenceFieldData } from 'src/app/model/Interface/ReferenceFieldData';
import { SelectedBasicField } from 'src/app/model/DataSelection/Profile/Fields/BasicFields/SelectedBasicField';
import { SelectedReferenceField } from 'src/app/model/DataSelection/Profile/Fields/RefrenceFields/SelectedReferenceField';
import { v4 as uuidv4 } from 'uuid';

@Injectable({
  providedIn: 'root',
})
export class CreateDataSelectionProfileService {
  private selectedBasicFields: SelectedBasicField[] = [];
  private selectedReferenceFields: SelectedReferenceField[] = [];
  constructor(
    private dataSelectionApiService: DataSelectionApiService,
    private profileProvider: ProfileProviderService
  ) {}

  /**
   * Fetches data selection profile data from the API.
   * Sets profiles in the profile provider.
   * @param urls The URLs of the data selection profiles to fetch.
   * @param markAsReference Whether to mark the profiles as references.
   * @return An observable of the fetched data selection profiles.
   */
  public fetchDataSelectionProfileData(
    urls: string[],
    markAsReference: boolean = false
  ): Observable<DataSelectionProfile[]> {
    return this.dataSelectionApiService.getDataSelectionProfileData(urls).pipe(
      map((data: DataSelectionProfileData[]) =>
        data.map((item: DataSelectionProfileData) => {
          const filters = this.createFilters(item.filters);
          const referenceFields = item.references;
          const test = this.mapAndConstructProfileReferenceFields(referenceFields);
          const profileFields = this.mapAndConstructProfileFields(item.fields, test);
          const profile = this.instanceOfDataSelectionProfile(
            item,
            profileFields,
            filters,
            markAsReference
          );
          this.selectedBasicFields = [];
          this.selectedReferenceFields = [];
          return profile;
        })
      ),
      concatMap((profiles) => {
        profiles.forEach((profile) => this.profileProvider.setProfileById(profile.getId(), profile));
        return [profiles];
      })
    );
  }

  /**
   * Creates profile filters from the provided filter data.
   * @param filters
   * @returns
   */
  private createFilters(filters: ProfileFilterData[]): AbstractProfileFilter[] {
    const profileFilters = filters?.map((filter: ProfileFilterData) => {
      switch (filter.ui_type) {
        case DataSelectionUIType.TIMERESTRICTION:
          return this.createProfileTimeRestrictionFilter(filter);
        case DataSelectionUIType.CODE:
          return new ProfileTokenFilter(uuidv4(), filter.name, filter.type, filter.valueSetUrls, []);
      }
    });
    return profileFilters;
  }

  /**
   * Creates a time restriction filter from the provided filter data.
   * @param filter
   * @returns
   */
  private createProfileTimeRestrictionFilter(
    filter: ProfileFilterData
  ): ProfileTimeRestrictionFilter {
    return new ProfileTimeRestrictionFilter(filter.name, filter.type, new BetweenFilter(null, null));
  }

  /**
   * @todo use ids from Onto files
   * @param item
   * @param fields
   * @param filters
   * @param markAsReference
   * @returns
   */
  private instanceOfDataSelectionProfile(
    item: DataSelectionProfileData,
    fields: ProfileFields,
    filters: AbstractProfileFilter[],
    markAsReference: boolean
  ): DataSelectionProfile {
    const displayInstance = Display.fromJson(item.display);
    const dataSelectionProfileProfile: DataSelectionProfile = new DataSelectionProfile(
      uuidv4(),
      item.url,
      displayInstance,
      fields,
      filters,
      new ProfileReference(true, markAsReference),
      displayInstance
    );
    return dataSelectionProfileProfile;
  }

  private mapAndConstructProfileFields(
    node: BasicFieldData[],
    referenceField: ReferenceField[]
  ): ProfileFields {
    const fields: BasicField[] = [];
    this.traverseAndMapFields(node, fields);
    return this.constructProfileFields(fields, referenceField);
  }

  private traverseAndMapFields(node: BasicFieldData[], fields: BasicField[]): void {
    node.map((nodeEntry) => {
      fields.push(this.mapField(nodeEntry));
    });
  }

  /**
   * Maps a BasicFieldData node to a BasicField instance.
   * @param node
   * @returns
   */
  private mapField(node: BasicFieldData): BasicField {
    const children = node.children ? node.children.map((child) => this.mapField(child)) : [];
    const display = Display.fromJson(node?.display);
    const description = Display.fromJson(node?.description);
    const isRequiredOrRecommended: boolean = node.required || node.recommended;
    const basicField = new BasicField(
      node.id,
      display,
      description,
      children as BasicField[],
      node.recommended,
      isRequiredOrRecommended,
      node.required,
      false,
      null
    );
    if (isRequiredOrRecommended) {
      this.selectedBasicFields.push(new SelectedBasicField(basicField, false));
    }
    return basicField;
  }

  private constructProfileFields(
    basicFields: BasicField[],
    referenceFields: ReferenceField[]
  ): ProfileFields {
    const profileFields = new ProfileFields(
      uuidv4(),
      basicFields.length > 0 ? basicFields : [],
      referenceFields.length > 0 ? referenceFields : [],
      this.selectedBasicFields,
      this.selectedReferenceFields
    );
    return profileFields;
  }

  public checkValuesForTypeString(value: string | string[]): string[] {
    if (typeof value == 'string') {
      if (value.length > 0) {
        return [value];
      } else {
        return [];
      }
    } else {
      return value;
    }
  }

  /**
   * Maps and constructs ReferenceField instances from ReferenceFieldData array.
   * @param referenceFields
   * @returns
   */
  private mapAndConstructProfileReferenceFields(
    referenceFields: ReferenceFieldData[]
  ): ReferenceField[] {
    return referenceFields.map((field) => ReferenceField.fromJson(field));
  }
}
