import { Injectable } from '@angular/core'
import { ReferenceField } from '../model/DataSelection/Profile/Fields/RefrenceFields/ReferenceField'
import { SelectedReferenceField } from '../model/DataSelection/Profile/Fields/RefrenceFields/SelectedReferenceField'
import { PossibleProfileReferenceData } from '../model/Interface/PossibleProfileReferenceData'

@Injectable({
  providedIn: 'root',
})
export class CreateSelectedReferenceService {
  constructor() {}

  /**
   * Maps possible references to selected reference fields.
   * @param {PossibleProfileReferenceData[]} possibleReferences
   * @param {ReferenceField} referenceField
   * @returns {SelectedReferenceField}
   */
  public mapPossibleReferencesToSelectedReferences(
    possibleReferences: PossibleProfileReferenceData[],
    referenceField: ReferenceField
  ): SelectedReferenceField {
    const linkedProfileIds = possibleReferences
      .filter((reference: PossibleProfileReferenceData) => reference.isSelected)
      .map((filteredReference: PossibleProfileReferenceData) => filteredReference.id)

    return this.createSelectedReferenceFieldInstances(referenceField, linkedProfileIds)
  }

  /**
   * Creates selected reference field instances by mapping reference fields to profile IDs.
   * @param {ReferenceField} referenceField
   * @param {string[]} linkedProfileIds
   * @param {boolean} mustHave
   * @returns {SelectedReferenceField}
   */
  public createSelectedReferenceFieldInstances(
    referenceField: ReferenceField,
    linkedProfileIds: string[],
    mustHave: boolean = false
  ): SelectedReferenceField {
    return new SelectedReferenceField(referenceField, linkedProfileIds, mustHave)
  }
}
