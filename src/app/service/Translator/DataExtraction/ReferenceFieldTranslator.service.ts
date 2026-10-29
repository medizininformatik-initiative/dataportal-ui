import { Injectable, inject } from '@angular/core'
import { ProfileFields } from 'src/app/model/DataSelection/Profile/Fields/ProfileFields'
import { ReferenceField } from 'src/app/model/DataSelection/Profile/Fields/RefrenceFields/ReferenceField'
import { SelectedReferenceField } from 'src/app/model/DataSelection/Profile/Fields/RefrenceFields/SelectedReferenceField'
import { AttributesData } from 'src/app/model/Interface/AttributesData'
import { SnackbarService } from '../../../shared/service/Snackbar/Snackbar.service'

@Injectable({
  providedIn: 'root',
})
export class ReferenceFieldTranslatorService {
  private readonly snackbar = inject(SnackbarService)

  /** Inserted by Angular inject() migration for backwards compatibility */
  constructor(...args: unknown[])

  constructor() {}

  /*TODO: Snackbar message is just a temporary solution. Will be obsolete with Backend validation*/
  /**
   * Builds the selected reference fields.
   *
   * @param {AttributesData[]} attributes
   * @param {ProfileFields} profileFields
   * @param {{ oldId: string; newId: string }[]} idMap
   * @returns {SelectedReferenceField[]}
   */
  public buildSelectedReferenceFields(
    attributes: AttributesData[],
    profileFields: ProfileFields,
    idMap: { oldId: string; newId: string }[]
  ): SelectedReferenceField[] {
    const result = this.filterReferenceAttributes(attributes)
      .map((attribute) => this.mapAttributeToSelectedReferenceField(attribute, profileFields, idMap))
      .filter((element) => element !== undefined)

    this.clearUnmatchedRecommendedFlags(profileFields, result)

    return result
  }

  private filterReferenceAttributes(attributes: AttributesData[]): AttributesData[] {
    return attributes.filter((attribute) => attribute.linkedGroups && attribute.linkedGroups.length > 0)
  }

  /**
   * Maps the attribute to selected reference field.
   *
   * @param {AttributesData} attribute
   * @param {ProfileFields} profileFields
   * @param {{ oldId: string; newId: string }[]} idMap
   * @returns {SelectedReferenceField | undefined}
   */
  private mapAttributeToSelectedReferenceField(
    attribute: AttributesData,
    profileFields: ProfileFields,
    idMap: { oldId: string; newId: string }[]
  ): SelectedReferenceField | undefined {
    const matchingField = this.findReferenceField(profileFields.getReferenceFields(), attribute.attributeRef)
    if (matchingField) {
      return this.createSelectedReferenceField(attribute, matchingField, idMap)
    }
    this.snackbar.displayErrorMessage('DSE-10001')
    return undefined
  }

  private clearUnmatchedRecommendedFlags(profileFields: ProfileFields, result: SelectedReferenceField[]): void {
    profileFields.getReferenceFields().forEach((refField) => {
      if (refField.getRecommended() && !this.isFieldInResult(refField, result)) {
        refField.setRecommended(false)
      }
    })
  }

  private isFieldInResult(refField: ReferenceField, result: SelectedReferenceField[]): boolean {
    return result.some((res) => res.getSelectedField().getElementId() === refField.getElementId())
  }

  private findReferenceField(referenceFields: ReferenceField[], attributeRef: string): ReferenceField {
    return referenceFields.find((field) => field.getElementId() === attributeRef)
  }

  /**
   * Creates the selected reference field.
   *
   * @param {AttributesData} attribute
   * @param {ReferenceField} foundField
   * @param {{ oldId: string; newId: string }[]} idMap
   * @returns {SelectedReferenceField}
   */
  private createSelectedReferenceField(
    attribute: AttributesData,
    foundField: ReferenceField,
    idMap: { oldId: string; newId: string }[]
  ): SelectedReferenceField {
    const linkedProfileIds = this.resolveLinkedProfileIds(attribute.linkedGroups, idMap)
    return new SelectedReferenceField(foundField, linkedProfileIds, attribute.mustHave)
  }

  /**
   * Resolves the linked profile ids.
   *
   * @param {string[]} linkedGroups
   * @param {{ oldId: string; newId: string }[]} idMap
   * @returns {string[]}
   */
  private resolveLinkedProfileIds(linkedGroups: string[], idMap: { oldId: string; newId: string }[]): string[] {
    return linkedGroups.map((linkedGroup) => idMap.find((id) => id.oldId === linkedGroup)?.newId).filter((id) => id !== undefined)
  }
}
