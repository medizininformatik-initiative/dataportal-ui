import { FilterTypes } from 'src/app/model/Utilities/FilterTypes';
import { ReferenceCriterion } from '../../ReferenceCriterion';

/**
 * Class representing a ReferenceFilter.
 */
export class ReferenceFilter {
  private readonly id: string;
  private allowedReferenceUri: string[];
  private selectedReferences: ReferenceCriterion[] = [];
  private type: FilterTypes = FilterTypes.REFERENCE;

  /**
   * Creates an instance of ReferenceFilter.
   *
   * @param allowedReferenceUri - The allowed reference URI.
   * @param selectedReferences - The selected reference criteria.
   */
  constructor(
    id: string,
    allowedReferenceUri: string[],
    selectedReferences: ReferenceCriterion[] = []
  ) {
    this.id = id;
    this.selectedReferences = selectedReferences;
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
   * Gets the selected reference criteria.
   *
   * @returns An array of selected reference criteria.
   */
  public getSelectedReferences(): ReferenceCriterion[] {
    return this.selectedReferences;
  }

  /**
   * Sets the selected reference criteria.
   *
   * @param selectedReferences - An array of selected reference criteria.
   */
  public setSelectedReferences(selectedReferences: ReferenceCriterion[]): void {
    this.selectedReferences = selectedReferences;
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
    selectedReference: ReferenceCriterion[] = []
  ): ReferenceFilter {
    return new ReferenceFilter(id, allowedReferenceUri, selectedReference);
  }

  public isSelectedReferenceSet(): boolean {
    return (
      this.selectedReferences !== undefined &&
      this.selectedReferences !== null &&
      this.selectedReferences.length > 0
    );
  }
}
