import { Injectable, inject } from '@angular/core'
import { BasicField } from 'src/app/model/DataSelection/Profile/Fields/BasicFields/BasicField'
import { SelectedBasicField } from 'src/app/model/DataSelection/Profile/Fields/BasicFields/SelectedBasicField'
import { ProfileFields } from 'src/app/model/DataSelection/Profile/Fields/ProfileFields'
import { AttributesData } from 'src/app/model/Interface/AttributesData'
import { SnackbarService } from '../../../shared/service/Snackbar/Snackbar.service'

@Injectable({
  providedIn: 'root',
})
export class BasicFieldTranslatorService {
  private readonly snackbar = inject(SnackbarService)

  /** Inserted by Angular inject() migration for backwards compatibility */
  constructor(...args: unknown[])

  constructor() {}

  /*TODO: Snackbar message is just a temporary solution. Will be obsolete with Backend validation*/
  /**
   * Builds the selected basic fields from the attributes that are not references.
   * @param {AttributesData[]} attributes
   * @param {ProfileFields} profileFields
   * @returns {SelectedBasicField[]}
   */
  public buildSelectedBasicFields(attributes: AttributesData[], profileFields: ProfileFields): SelectedBasicField[] {
    return this.filterNonReferenceAttributes(attributes)
      .map((attribute: AttributesData) => this.mapAttributeToSelectedBasicField(attribute, profileFields))
      .filter((element: SelectedBasicField) => element !== undefined)
  }

  /**
   * Keeps the attributes that are not linked to other groups.
   * @param {AttributesData[]} attributes
   * @returns {AttributesData[]}
   */
  private filterNonReferenceAttributes(attributes: AttributesData[]): AttributesData[] {
    return attributes.filter((attribute: AttributesData) => !attribute.linkedGroups || attribute.linkedGroups.length === 0)
  }

  /**
   * Maps the attribute to the selected basic field of the profile.
   * @param {AttributesData} attribute
   * @param {ProfileFields} profileFields
   * @returns {SelectedBasicField | undefined}
   */
  private mapAttributeToSelectedBasicField(attribute: AttributesData, profileFields: ProfileFields): SelectedBasicField | undefined {
    const matchingField = this.findBasicField(profileFields.getFieldTree(), attribute.attributeRef)
    if (matchingField) {
      return this.createSelectedBasicField(matchingField, attribute)
    }
    this.snackbar.displayErrorMessage('DSE-10001')
    return undefined
  }

  /**
   * Searches the field tree for the field with the element id.
   * @param {BasicField[]} basicFields
   * @param {string} attributeRef
   * @returns {BasicField | undefined}
   */
  private findBasicField(basicFields: BasicField[], attributeRef: string): BasicField | undefined {
    for (const field of basicFields) {
      if (field.getElementId() === attributeRef) {
        return field
      } else if (field.getChildren().length > 0) {
        const result = this.findBasicField(field.getChildren(), attributeRef)
        if (result) {
          return result
        }
      }
    }
    return undefined
  }

  /**
   * Creates a selected basic field from the field and the attribute.
   * @param {BasicField} basicField
   * @param {AttributesData} attribute
   * @returns {SelectedBasicField}
   */
  private createSelectedBasicField(basicField: BasicField, attribute: AttributesData): SelectedBasicField {
    return new SelectedBasicField(basicField, attribute.mustHave)
  }
}
