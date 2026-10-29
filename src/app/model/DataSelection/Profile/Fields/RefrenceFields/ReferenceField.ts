import { ReferenceFieldData } from 'src/app/model/Interface/ReferenceFieldData'
import { ProfileFieldTypes } from 'src/app/model/Utilities/ProfileFieldTypes'
import { Display } from '../../Display'
import { AbstractField } from '../AbstractField'
import { ReferencedProfile } from './ReferencedProfile'

/**
 * Represents a field that references other profiles.
 * Extends AbstractField to provide reference-specific functionality.
 */
export class ReferenceField extends AbstractField {
  /** @type {ReferencedProfile[]} Array of profiles that  referenced */
  private referencedProfiles: ReferencedProfile[] = []

  /**
   * Creates a new ReferenceField instance.
   * @param {string} elementId - Unique identifier for the field element
   * @param {Display} display - Display information for the field
   * @param {Display} description - Description information for the field
   * @param {boolean} isRequired - Whether this field is required (default: false)
   * @param {boolean} recommended - Whether this field is recommended (default: false)
   * @param {ReferencedProfile[]} referencedProfiles - Array of profiles that can be referenced (default: [])
   */
  constructor(
    elementId: string,
    display: Display,
    description: Display,
    isRequired: boolean = false,
    recommended: boolean = false,
    referencedProfiles: ReferencedProfile[] = []
  ) {
    super(elementId, display, description, isRequired, recommended, ProfileFieldTypes.reference)
    this.referencedProfiles = referencedProfiles
  }

  /**
   * Gets the array of profiles that can be referenced by this field.
   * @returns {ReferencedProfile[]} Array of referenced profiles
   */
  public getReferencedProfiles(): ReferencedProfile[] {
    return this.referencedProfiles
  }

  /**
   * Sets the array of profiles that can be referenced by this field.
   * @param {ReferencedProfile[]} referencedProfiles - Array of referenced profiles to set
   * @returns
   */
  public setReferencedProfiles(referencedProfiles: ReferencedProfile[]): void {
    this.referencedProfiles = referencedProfiles
  }

  /**
   * Checks if the reference field is either required or recommended.
   * @param {ReferenceField} referenceField - The reference field to check
   * @returns {boolean} True if the field is required or recommended
   */
  public isRequiredOrRecomended(referenceField: ReferenceField): boolean {
    return referenceField.getIsRequired() || referenceField.getRecommended()
  }

  public static fromJson(data: ReferenceFieldData): ReferenceField {
    return new ReferenceField(
      data.id,
      Display.fromJson(data.display),
      Display.fromJson(data.description),
      data.required,
      data.recommended,
      data.referencedProfiles.map((profileData) => ReferencedProfile.fromJson(profileData))
    )
  }
}
