import { BasicField } from './BasicFields/BasicField';
import { ReferenceField } from './RefrenceFields/ReferenceField';
import { SelectedBasicField } from './BasicFields/SelectedBasicField';
import { SelectedReferenceField } from './RefrenceFields/SelectedReferenceField';

export class ProfileFields {
  private readonly id: string;
  private fieldTree: BasicField[] = [];
  private referenceFields: ReferenceField[] = [];

  private selectedBasicFields: SelectedBasicField[] = [];
  private selectedReferenceFields: SelectedReferenceField[] = [];

  constructor(
    id: string,
    fieldTree: BasicField[] = [],
    referenceFields: ReferenceField[] = [],
    selectedBasicFields: SelectedBasicField[] = [],
    selectedReferenceFields: SelectedReferenceField[] = []
  ) {
    this.id = id;
    this.fieldTree = fieldTree;
    this.referenceFields = referenceFields;
    this.selectedBasicFields = selectedBasicFields;
    this.selectedReferenceFields = selectedReferenceFields;
  }

  public getFieldTree(): BasicField[] {
    return this.fieldTree;
  }

  public getReferenceFields(): ReferenceField[] {
    return this.referenceFields;
  }

  public setReferenceFields(referenceFields: ReferenceField[]): void {
    this.referenceFields = referenceFields;
  }

  public getSelectedBasicFields(): SelectedBasicField[] {
    return this.selectedBasicFields;
  }

  public getSelectedReferenceFields(): SelectedReferenceField[] {
    return this.selectedReferenceFields;
  }

  public setSelectedReferenceFields(selectedFields: SelectedReferenceField[]): void {
    this.selectedReferenceFields = selectedFields;
  }

  public setSelectedBasicFields(selectedFields: SelectedBasicField[]): void {
    this.selectedBasicFields = selectedFields;
  }

  public getId(): string {
    return this.id;
  }

  public getRequiredOrRecommendedReferences(): ReferenceField[] {
    return this.referenceFields.filter(
      (referenceField) => referenceField.getIsRequired() || referenceField.getRecommended()
    );
  }

  /**
   * This method filters the reference fields to find those that are either required or recommended
   * and checks if they are not in the selectedReferenceArray.
   * @returns An array of unlinked required or recommended reference fields.
   */
  public getUnlinkedRequiredOrRecommendedReferences(): ReferenceField[] {
    const requiredOrRecommendedFields = this.getRequiredOrRecommendedReferences();

    return requiredOrRecommendedFields.filter(
      (referenceField) =>
        !this.selectedReferenceFields.some(
          (selectedField) => selectedField.getElementId() === referenceField.getElementId()
        )
    );
  }

  public getUnlinkedSelectedFields(): SelectedReferenceField[] {
    return this.selectedReferenceFields.filter(
      (selectedField) => selectedField.getLinkedProfileIds().length === 0
    );
  }
}
