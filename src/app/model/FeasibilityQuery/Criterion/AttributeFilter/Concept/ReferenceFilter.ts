import { FilterTypes } from 'src/app/model/Utilities/FilterTypes';

/**
 * Class representing a ReferenceFilter.
 */
export class ReferenceFilter {
  private readonly id: string;
  private allowedReferenceUri: string[];
  private selectedReferenceIds: string[] = [];
  private type: FilterTypes = FilterTypes.REFERENCE;

  /**
   * Creates an instance of ReferenceFilter.
   *
   * @param allowedReferenceUri - The allowed reference URI.
   * @param selectedReferenceIds - The IDs of the selected reference criteria.
   */
  constructor(id: string, allowedReferenceUri: string[], selectedReferenceIds: string[] = []) {
    this.id = id;
    this.selectedReferenceIds = selectedReferenceIds;
    this.allowedReferenceUri = allowedReferenceUri;
  }

  /**
   * Returns the unique identifier of the ReferenceFilter.
   * @returns
   */
  public getId(): string {
    return this.id;
  }

  /**
   * Gets the IDs of the selected reference criteria.
   *
   * @returns An array of IDs of selected reference criteria.
   */
  public getSelectedReferenceIds(): string[] {
    return this.selectedReferenceIds;
  }

  /**
   * Sets the IDs of the selected reference criteria.
   *
   * @param ids - An array of IDs of selected reference criteria.
   */
  public setSelectedReferenceIds(ids: string[]): void {
    this.selectedReferenceIds = ids;
  }

  /**
   * Gets the allowed reference URI.
   *
   * @returns The allowed reference URI.
   */
  public getAllowedReferenceUri(): string[] {
    return this.allowedReferenceUri;
  }

  /**
   * Sets the allowed reference URI.
   *
   * @param allowedReferenceUri - The allowed reference URI to set.
   */
  public setAllowedReferenceUri(allowedReferenceUri: string[]): void {
    this.allowedReferenceUri = allowedReferenceUri;
  }

  /**
   * Gets the filter type.
   *
   * @returns The filter type.
   */
  public getType(): FilterTypes {
    return this.type;
  }

  /**
   * Sets the filter type.
   *
   * @param type - The new filter type.
   */
  public setType(type: FilterTypes): void {
    this.type = type;
  }

  /**
   * Static method to create a ReferenceFilter.
   *
   * @param allowedReferenceUri - The allowed reference URI.
   * @param selectedReference - The selected reference criteria.
   * @param selectedConcepts - The selected concepts.
   * @returns The created ReferenceFilter instance.
   */
  public static create(
    id: string,
    allowedReferenceUri: string[],
    selectedReferenceIds: string[] = []
  ): ReferenceFilter {
    return new ReferenceFilter(id, allowedReferenceUri, selectedReferenceIds);
  }

  public isSelectedReferenceSet(): boolean {
    return (
      this.selectedReferenceIds !== undefined &&
      this.selectedReferenceIds !== null &&
      this.selectedReferenceIds.length > 0
    );
  }
}
