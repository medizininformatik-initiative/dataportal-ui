import { AttributeGroupsData } from 'src/app/model/Interface/AttributeGroupsData';
import { AttributesData } from 'src/app/model/Interface/AttributesData';
import { BasicField } from 'src/app/model/DataSelection/Profile/Fields/BasicFields/BasicField';
import { CreateDataSelectionProfileService } from '../../DataSelection/CreateDataSelectionProfile.service';
import { DataExtractionData } from 'src/app/model/Interface/DataExtractionData';
import { DataSelection } from 'src/app/model/DataSelection/DataSelection';
import { DataSelectionProfile } from 'src/app/model/DataSelection/Profile/DataSelectionProfile';
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { ProfileFields } from 'src/app/model/DataSelection/Profile/Fields/ProfileFields';
import { ProfileFieldsCloner } from 'src/app/model/Utilities/DataSelecionCloner/ProfileFieldsCloner';
import { ProfileReference } from 'src/app/model/DataSelection/Profile/Reference/ProfileReference';
import { ReferenceField } from 'src/app/model/DataSelection/Profile/Fields/RefrenceFields/ReferenceField';
import { SelectedBasicField } from 'src/app/model/DataSelection/Profile/Fields/BasicFields/SelectedBasicField';
import { SelectedReferenceField } from 'src/app/model/DataSelection/Profile/Fields/RefrenceFields/SelectedReferenceField';
import { TypeGuard } from '../../TypeGuard/TypeGuard';
import { UITimeRestrictionFactoryService } from '../Shared/UITimeRestrictionFactory.service';
import { v4 as uuidv4 } from 'uuid';
import { ProfileFilterTranslatorService } from './ProfileFilterTranslator.service';
import { SnackbarService } from '../../../shared/service/Snackbar/Snackbar.service';

@Injectable({
  providedIn: 'root',
})
export class DataExtraction2UiDataSelectionService {
  private idMap: { oldId: string; newId: string }[] = [];
  constructor(
    private createDataSelection: CreateDataSelectionProfileService,
    private profileFilterTranslatorService: ProfileFilterTranslatorService,
    private snackbar: SnackbarService
  ) {}

  /**
   * @todo Check if version is part of the dataExtraction.attributeGroups.filter.codes
   * @param dataExtraction
   */
  public translate(dataExtraction: DataExtractionData): Observable<DataSelection> {
    if (dataExtraction.attributeGroups?.length > 0) {
      const urls = this.getGroupReferences(dataExtraction);
      return this.createDataSelection.fetchDataSelectionProfileData(urls, false).pipe(
        map((dataSelectionProfiles) => {
          this.replaceExternalIdsWithFetchedProfileIds(
            dataSelectionProfiles,
            dataExtraction.attributeGroups
          );

          dataSelectionProfiles.forEach((dataSelectionProfile) => {
            const externDataSelectionProfile = this.findExternalProfileFromIdMap(
              dataSelectionProfile,
              dataExtraction
            );
            dataSelectionProfile.setLabel(
              externDataSelectionProfile.name ?? dataSelectionProfile.getLabel().getOriginal()
            );
            if (
              externDataSelectionProfile.attributes &&
              externDataSelectionProfile.attributes.length > 0
            ) {
              const profileFields = dataSelectionProfile.getProfileFields();
              const attributes = externDataSelectionProfile.attributes;
              const updatedProfileFields = this.setProfileFields(attributes, profileFields);
              dataSelectionProfile.setProfileFields(updatedProfileFields);
            } else {
              dataSelectionProfile.getProfileFields().setSelectedBasicFields([]);
            }

            if (TypeGuard.isFilterDataArray(externDataSelectionProfile.filter)) {
              const profileFilter = this.profileFilterTranslatorService.createProfileFilters(
                externDataSelectionProfile,
                dataSelectionProfile
              );
              dataSelectionProfile.setFilters(profileFilter);
            }

            if (externDataSelectionProfile.includeReferenceOnly) {
              dataSelectionProfile.setReference(new ProfileReference(true, true));
            } else {
              dataSelectionProfile.setReference(new ProfileReference(true, false));
            }
          });
          return new DataSelection(dataSelectionProfiles, uuidv4());
        })
      );
    }
  }

  private findExternalProfileFromIdMap(
    profile: DataSelectionProfile,
    dataExtraction: DataExtractionData
  ): AttributeGroupsData | undefined {
    const idTupel = this.idMap.find((id) => id.newId === profile.getId());
    return dataExtraction.attributeGroups.find(
      (externProfile) => externProfile.id === idTupel.oldId
    );
  }

  private setProfileFields(
    attributes: AttributesData[],
    profileFields: ProfileFields
  ): ProfileFields {
    const selectedReferenceFields = this.buildSelectedReferenceFields(attributes, profileFields);
    const selectedBasicFields = this.buildSelectedBasicFields(attributes, profileFields);

    profileFields.setSelectedBasicFields([]);
    profileFields.setSelectedReferenceFields([]);
    profileFields.setSelectedBasicFields(selectedBasicFields);
    profileFields.setSelectedReferenceFields(selectedReferenceFields);

    return ProfileFieldsCloner.deepCopyProfileFields(profileFields);
  }

  /*TODO: Snackbar message is just a temporary solution. Will be obsolete with Backend validation*/
  private buildSelectedReferenceFields(
    attributes: AttributesData[],
    profileFields: ProfileFields
  ): SelectedReferenceField[] {
    const result = attributes
      .filter((attribute) => attribute.linkedGroups && attribute.linkedGroups.length > 0)
      .map((attribute) => {
        const matchingField = this.findReferenceField(
          profileFields.getReferenceFields(),
          attribute.attributeRef
        );
        if (matchingField) {
          return this.createSelectedReferenceField(attribute, matchingField);
        } else {
          this.snackbar.displayErrorMessage('DSE-10001');
        }
      })
      .filter((element) => element !== undefined);
    profileFields.getReferenceFields().forEach((refField) => {
      if (refField.getRecommended()) {
        const foudnRef = result.find(
          (res) => res.getSelectedField().getElementId() === refField.getElementId()
        );
        if (!foudnRef) {
          refField.setRecommended(false);
        }
      }
    });
    return result;
  }

  /*TODO: Snackbar message is just a temporary solution. Will be obsolete with Backend validation*/
  private buildSelectedBasicFields(
    attributes: AttributesData[],
    profileFields: ProfileFields
  ): SelectedBasicField[] {
    return attributes
      .filter((attribute) => !attribute.linkedGroups || attribute.linkedGroups.length === 0)
      .map((attribute) => {
        const matchingField = this.findBasicField(
          profileFields.getFieldTree(),
          attribute.attributeRef
        );
        if (matchingField) {
          return this.createSelecteBasicFields(matchingField, attribute);
        } else {
          this.snackbar.displayErrorMessage('DSE-10001');
        }
      })
      .filter((element) => element !== undefined);
  }

  private findBasicField(basicFields: BasicField[], attributeRef: string): BasicField | undefined {
    for (const field of basicFields) {
      if (field.getElementId() === attributeRef) {
        return field;
      } else if (field.getChildren().length > 0) {
        const result = this.findBasicField(field.getChildren(), attributeRef);
        if (result) {
          return result;
        }
      }
    }
    return undefined;
  }

  private findReferenceField(
    referenceFields: ReferenceField[],
    attributeRef: string
  ): ReferenceField {
    return referenceFields.find((field) => field.getElementId() === attributeRef);
  }

  private createSelectedReferenceField(
    attribute: AttributesData,
    foundField: ReferenceField
  ): SelectedReferenceField {
    const linkedProfileIds = attribute.linkedGroups.map(
      (linkedGroup) =>
        this.idMap
          .map((id) => (id.oldId === linkedGroup ? id.newId : undefined))
          .filter((id) => id !== undefined)[0]
    );
    const selectedReferenceField = new SelectedReferenceField(
      foundField,
      linkedProfileIds,
      attribute.mustHave
    );
    return selectedReferenceField;
  }

  private createSelecteBasicFields(
    basicField: BasicField,
    attribute: AttributesData
  ): SelectedBasicField {
    const selectedBasicField = new SelectedBasicField(basicField, attribute.mustHave);
    return selectedBasicField;
  }

  private getGroupReferences(dataExtraction: DataExtractionData): string[] {
    return dataExtraction.attributeGroups.map((attributeGroup) => attributeGroup.groupReference);
  }

  private replaceExternalIdsWithFetchedProfileIds(
    dataSelectionProfiles: DataSelectionProfile[],
    externProfiles: AttributeGroupsData[]
  ): void {
    const remainingExternProfiles = [...externProfiles];

    dataSelectionProfiles.forEach((profile) => {
      const url = profile.getUrl();
      const index = remainingExternProfiles.findIndex((extern) => extern.groupReference === url);

      if (index !== -1) {
        const matchedExtern = remainingExternProfiles.splice(index, 1)[0];
        this.idMap.push({ oldId: matchedExtern.id, newId: profile.getId() });
      }
    });
  }
}
