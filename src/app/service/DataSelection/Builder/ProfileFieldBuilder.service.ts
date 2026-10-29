import { Injectable } from '@angular/core'
import { Display } from 'src/app/model/DataSelection/Profile/Display'
import { BasicField } from 'src/app/model/DataSelection/Profile/Fields/BasicFields/BasicField'
import { SelectedBasicField } from 'src/app/model/DataSelection/Profile/Fields/BasicFields/SelectedBasicField'
import { ProfileFields } from 'src/app/model/DataSelection/Profile/Fields/ProfileFields'
import { ReferenceField } from 'src/app/model/DataSelection/Profile/Fields/RefrenceFields/ReferenceField'
import { SelectedReferenceField } from 'src/app/model/DataSelection/Profile/Fields/RefrenceFields/SelectedReferenceField'
import { BasicFieldData } from 'src/app/model/Interface/BasicFieldData'
import { ReferenceFieldData } from 'src/app/model/Interface/ReferenceFieldData'
import { v4 as uuidv4 } from 'uuid'

@Injectable({
  providedIn: 'root',
})
export class ProfileFieldBuilderService {
  /**
   * Maps raw field data and reference fields into a ProfileFields instance.
   * Collects required/recommended fields as pre-selected.
   * @param {BasicFieldData[]} basicFieldData Raw field nodes from the API response.
   * @param {ReferenceFieldData[]} referenceFieldData Raw reference field data from the API response.
   * @returns {ProfileFields} A fully constructed ProfileFields instance.
   */
  public buildProfileFields(basicFieldData: BasicFieldData[], referenceFieldData: ReferenceFieldData[]): ProfileFields {
    const selectedBasicFields: SelectedBasicField[] = []
    const selectedReferenceFields: SelectedReferenceField[] = []

    const referenceFields = this.mapReferenceFields(referenceFieldData)
    const basicFields = this.mapBasicFields(basicFieldData, selectedBasicFields)

    return new ProfileFields(
      uuidv4(),
      basicFields.length > 0 ? basicFields : [],
      referenceFields.length > 0 ? referenceFields : [],
      selectedBasicFields,
      selectedReferenceFields
    )
  }

  /**
   * Recursively maps an array of BasicFieldData nodes to BasicField instances.
   * Populates selectedBasicFields with any required or recommended fields.
   * @param {BasicFieldData[]} nodes Raw field data nodes.
   * @param {SelectedBasicField[]} selectedBasicFields Accumulator for pre-selected fields.
   * @returns {BasicField[]} Array of BasicField instances.
   */
  private mapBasicFields(nodes: BasicFieldData[], selectedBasicFields: SelectedBasicField[]): BasicField[] {
    return nodes.map((node: BasicFieldData) => this.mapBasicField(node, selectedBasicFields))
  }

  /**
   * Maps a single BasicFieldData node to a BasicField instance.
   * @param {BasicFieldData} node Raw field data node.
   * @param {SelectedBasicField[]} selectedBasicFields Accumulator for pre-selected fields.
   * @returns {BasicField} A BasicField instance.
   */
  private mapBasicField(node: BasicFieldData, selectedBasicFields: SelectedBasicField[]): BasicField {
    const children = node.children ? node.children.map((child: BasicFieldData) => this.mapBasicField(child, selectedBasicFields)) : []
    const display = Display.fromJson(node?.display)
    const description = Display.fromJson(node?.description)
    const isSelected = node.required || node.recommended

    const basicField = new BasicField(node.id, display, description, children, node.recommended, isSelected, node.required, null)

    if (isSelected) {
      selectedBasicFields.push(new SelectedBasicField(basicField, false))
    }
    return basicField
  }

  /**
   * Maps raw reference field data to ReferenceField instances.
   * @param {ReferenceFieldData[]} referenceFields Raw reference field data from the API response.
   * @returns {ReferenceField[]} Array of ReferenceField instances.
   */
  private mapReferenceFields(referenceFields: ReferenceFieldData[]): ReferenceField[] {
    return referenceFields.map((field: ReferenceFieldData) => ReferenceField.fromJson(field))
  }
}
