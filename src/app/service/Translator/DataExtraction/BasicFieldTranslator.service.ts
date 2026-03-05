import { AttributesData } from 'src/app/model/Interface/AttributesData';
import { BasicField } from 'src/app/model/DataSelection/Profile/Fields/BasicFields/BasicField';
import { Injectable } from '@angular/core';
import { ProfileFields } from 'src/app/model/DataSelection/Profile/Fields/ProfileFields';
import { SelectedBasicField } from 'src/app/model/DataSelection/Profile/Fields/BasicFields/SelectedBasicField';
import { SnackbarService } from '../../../shared/service/Snackbar/Snackbar.service';

@Injectable({
  providedIn: 'root',
})
export class BasicFieldTranslatorService {
  constructor(private snackbar: SnackbarService) {}

  /*TODO: Snackbar message is just a temporary solution. Will be obsolete with Backend validation*/
  public buildSelectedBasicFields(
    attributes: AttributesData[],
    profileFields: ProfileFields
  ): SelectedBasicField[] {
    return this.filterNonReferenceAttributes(attributes)
      .map((attribute) => this.mapAttributeToSelectedBasicField(attribute, profileFields))
      .filter((element) => element !== undefined);
  }

  private filterNonReferenceAttributes(attributes: AttributesData[]): AttributesData[] {
    return attributes.filter(
      (attribute) => !attribute.linkedGroups || attribute.linkedGroups.length === 0
    );
  }

  private mapAttributeToSelectedBasicField(
    attribute: AttributesData,
    profileFields: ProfileFields
  ): SelectedBasicField | undefined {
    const matchingField = this.findBasicField(profileFields.getFieldTree(), attribute.attributeRef);
    if (matchingField) {
      return this.createSelectedBasicField(matchingField, attribute);
    }
    this.snackbar.displayErrorMessage('DSE-10001');
    return undefined;
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

  private createSelectedBasicField(
    basicField: BasicField,
    attribute: AttributesData
  ): SelectedBasicField {
    return new SelectedBasicField(basicField, attribute.mustHave);
  }
}
