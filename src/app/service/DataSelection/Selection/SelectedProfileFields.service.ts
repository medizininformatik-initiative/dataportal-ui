import { BasicField } from 'src/app/model/DataSelection/Profile/Fields/BasicFields/BasicField';
import { BasicFieldCloner } from 'src/app/model/Utilities/DataSelecionCloner/ProfileFields/BasicFieldCloner';
import { BehaviorSubject, Observable } from 'rxjs';
import { Injectable } from '@angular/core';
import { SelectedBasicField } from 'src/app/model/DataSelection/Profile/Fields/BasicFields/SelectedBasicField';

@Injectable({
  providedIn: 'root',
})
export class SelectedProfileFieldsService {
  private selectedFields = new BehaviorSubject<SelectedBasicField[]>([]);
  private deepCopyOfBasicFields = new BehaviorSubject<BasicField[]>([]);
  private fieldIds = new Set<string>();

  public updateSelectionStatus(
    basicFields: BasicField[],
    selectedFields: SelectedBasicField[]
  ): void {
    const selectedElementIds = new Set(selectedFields.map((field) => field.getElementId()));

    const traverseAndUpdate = (fields: BasicField[]): void => {
      fields.forEach((field) => {
        if (selectedElementIds.has(field.getElementId())) {
          field.setIsSelected(true);
        } else {
          field.setIsSelected(false);
        }

        if (field.getChildren().length > 0) {
          traverseAndUpdate(field.getChildren());
        }
      });
    };

    traverseAndUpdate(basicFields);
  }

  public setDeepCopyFields(fields: BasicField[]): void {
    const deepCopy = this.deepCopyBasicFields(fields);
    this.deepCopyOfBasicFields.next(deepCopy);
  }

  private deepCopyBasicFields(fields: BasicField[]): BasicField[] {
    return fields.map((field) => BasicFieldCloner.deepCopyBasicField(field));
  }

  public getDeepCopyBasicFields(): Observable<BasicField[]> {
    return this.deepCopyOfBasicFields.asObservable();
  }

  public getSelectedFields(): Observable<SelectedBasicField[]> {
    return this.selectedFields.asObservable();
  }

  public setSelectedFields(fields: SelectedBasicField[]): void {
    this.selectedFields.next(fields);
    this.fieldIds.clear();
  }

  private setSelectedChildrenFields(fields: BasicField[]): void {
    fields.forEach((field) => {
      this.fieldIds.add(field.getElementId());
      this.setSelectedChildrenFields(field.getChildren());
    });
  }

  public addToSelection(field: SelectedBasicField): void {
    const currentSelection = this.selectedFields.getValue();
    if (!this.fieldIds.has(field.getSelectedField().getElementId())) {
      this.selectedFields.next([...currentSelection, field]);
      this.fieldIds.add(field.getSelectedField().getElementId());
      //this.updateDeepCopyField(field);
    }
  }

  public removeFromSelection(field: BasicField): void {
    const currentSelection = this.selectedFields.getValue();
    const updatedSelection = currentSelection.filter(
      (f) => f.getSelectedField().getElementId() !== field.getElementId()
    );
    this.selectedFields.next(updatedSelection);
    this.fieldIds.delete(field.getElementId());
    this.updateDeepCopyField(field, false); // Mark as unselected
  }

  public updateField(field: BasicField): void {
    this.updateDeepCopyField(field);
  }

  public updateDeepCopyField(field: BasicField, isSelected = true): void {
    const deepCopy = this.deepCopyOfBasicFields.getValue();
    const updatedDeepCopy = this.updateNodeInDeepCopy(deepCopy, field, isSelected);
    this.deepCopyOfBasicFields.next(updatedDeepCopy);
  }

  public updateNodeInDeepCopy(
    fields: BasicField[],
    updatedField: BasicField,
    isSelected: boolean
  ): BasicField[] {
    return fields.map((field) => {
      if (field.getElementId() === updatedField.getElementId()) {
        field.setIsSelected(isSelected);
        return field;
      }
      if (field.getChildren()) {
        field.setChildren(this.updateNodeInDeepCopy(field.getChildren(), updatedField, isSelected));
      }
      return field;
    });
  }

  public getSelectedIds(): string[] {
    return Array.from(this.fieldIds);
  }

  public clearSelection(): void {
    this.selectedFields.next([]);
    this.fieldIds.clear();
    this.clearDeepCopySelection();
  }

  private clearDeepCopySelection(): void {
    const deepCopy = this.deepCopyOfBasicFields.getValue();
    const clearedDeepCopy = this.clearSelectionInDeepCopy(deepCopy);
    this.deepCopyOfBasicFields.next(clearedDeepCopy);
  }

  private clearSelectionInDeepCopy(fields: BasicField[]): BasicField[] {
    return fields.map((field) => {
      field.setIsSelected(false);
      if (field.getChildren()) {
        field.setChildren(this.clearSelectionInDeepCopy(field.getChildren()));
      }
      return field;
    });
  }
}
