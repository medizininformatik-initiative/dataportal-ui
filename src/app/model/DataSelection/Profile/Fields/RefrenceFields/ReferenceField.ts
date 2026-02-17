import { AbstractField } from '../AbstractField';
import { Display } from '../../Display';
import { ProfileFieldTypes } from 'src/app/model/Utilities/ProfileFieldTypes';
import { ReferencedProfile } from './ReferencedProfile';
import { ReferenceFieldData } from 'src/app/model/Interface/ReferenceFieldData';

/**
 * Represents a field that references other profiles.
 * Extends AbstractField to provide reference-specific functionality.
 */
export class ReferenceField extends AbstractField {
  /** @type {ReferencedProfile[]} Array of profiles that  referenced */
  private referencedProfiles: ReferencedProfile[] = [];

  /**
   * Creates a new ReferenceField instance.
   * @param elementId - Unique identifier for the field element
   * @param display - Display information for the field
   * @param description - Description information for the field
   * @param isRequired - Whether this field is required (default: false)
   * @param recommended - Whether this field is recommended (default: false)
   * @param referencedProfiles - Array of profiles that can be referenced (default: [])
   */
  constructor(
    elementId: string,
    display: Display,
    description: Display,
    isRequired: boolean = false,
    recommended: boolean = false,
    deprecated: boolean = false,
    referencedProfiles: ReferencedProfile[] = []
  ) {
    super(
      elementId,
      display,
      description,
      isRequired,
      recommended,
      deprecated,
      ProfileFieldTypes.reference
    );
    this.referencedProfiles = referencedProfiles;
  }

  /**
   * Gets the array of profiles that can be referenced by this field.
   * @returns Array of referenced profiles
   */
  public getReferencedProfiles(): ReferencedProfile[] {
    return this.referencedProfiles;
  }

  /**
   * Sets the array of profiles that can be referenced by this field.
   * @param referencedProfiles - Array of referenced profiles to set
   * @returns
   */
  public setReferencedProfiles(referencedProfiles: ReferencedProfile[]): void {
    this.referencedProfiles = referencedProfiles;
  }

  /**
   * Checks if the reference field is either required or recommended.
   * @param referenceField - The reference field to check
   * @returns True if the field is required or recommended
   */
  public isRequiredOrRecomended(referenceField: ReferenceField): boolean {
    return referenceField.getIsRequired() || referenceField.getRecommended();
  }

  public static fromJson(data: ReferenceFieldData): ReferenceField {
    return new ReferenceField(
      data.id,
      Display.fromJson(data.display),
      Display.fromJson(data.description),
      data.required,
      data.recommended,
      false,
      data.referencedProfiles.map((profileData) => ReferencedProfile.fromJson(profileData))
    );
  }
}
