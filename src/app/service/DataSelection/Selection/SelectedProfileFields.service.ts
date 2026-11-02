import { Injectable } from '@angular/core'
import { BehaviorSubject, Observable } from 'rxjs'
import { BasicField } from 'src/app/model/DataSelection/Profile/Fields/BasicFields/BasicField'
import { SelectedBasicField } from 'src/app/model/DataSelection/Profile/Fields/BasicFields/SelectedBasicField'
import { BasicFieldCloner } from 'src/app/model/Utilities/DataSelecionCloner/ProfileFields/BasicFieldCloner'

@Injectable({
  providedIn: 'root',
})
export class SelectedProfileFieldsService {
  private readonly selectedFields = new BehaviorSubject<SelectedBasicField[]>([])
  private readonly deepCopyOfBasicFields = new BehaviorSubject<BasicField[]>([])
  private readonly fieldIds = new Set<string>()

  /**
   * Marks the basic fields, and their children, that are in the selection.
   * @param {BasicField[]} basicFields
   * @param {SelectedBasicField[]} selectedFields
   */
  public updateSelectionStatus(basicFields: BasicField[], selectedFields: SelectedBasicField[]): void {
    const selectedElementIds = new Set(selectedFields.map((field: SelectedBasicField) => field.getElementId()))

    const traverseAndUpdate = (fields: BasicField[]): void => {
      fields.forEach((field: BasicField) => {
        if (selectedElementIds.has(field.getElementId())) {
          field.setIsSelected(true)
        } else {
          field.setIsSelected(false)
        }

        if (field.getChildren().length > 0) {
          traverseAndUpdate(field.getChildren())
        }
      })
    }

    traverseAndUpdate(basicFields)
  }

  /**
   * Stores deep copies of the fields.
   * @param {BasicField[]} fields
   */
  public setDeepCopyFields(fields: BasicField[]): void {
    const deepCopy = this.deepCopyBasicFields(fields)
    this.deepCopyOfBasicFields.next(deepCopy)
  }

  /**
   * Creates deep copies of the fields.
   * @param {BasicField[]} fields
   * @returns {BasicField[]}
   */
  private deepCopyBasicFields(fields: BasicField[]): BasicField[] {
    return fields.map((field: BasicField) => BasicFieldCloner.deepCopyBasicField(field))
  }

  /**
   * Returns the deep copies of the basic fields as an observable.
   * @returns {Observable<BasicField[]>}
   */
  public getDeepCopyBasicFields(): Observable<BasicField[]> {
    return this.deepCopyOfBasicFields.asObservable()
  }

  /**
   * Returns the selected fields as an observable.
   * @returns {Observable<SelectedBasicField[]>}
   */
  public getSelectedFields(): Observable<SelectedBasicField[]> {
    return this.selectedFields.asObservable()
  }

  /**
   * Replaces the selected fields and resets the id set.
   * @param {SelectedBasicField[]} fields
   */
  public setSelectedFields(fields: SelectedBasicField[]): void {
    this.selectedFields.next(fields)
    this.fieldIds.clear()
  }

  /**
   * Adds the ids of the fields and their children to the id set.
   * @param {BasicField[]} fields
   */
  private setSelectedChildrenFields(fields: BasicField[]): void {
    fields.forEach((field: BasicField) => {
      this.fieldIds.add(field.getElementId())
      this.setSelectedChildrenFields(field.getChildren())
    })
  }

  /**
   * Adds the field to the selection if it is not yet selected.
   * @param {SelectedBasicField} field
   */
  public addToSelection(field: SelectedBasicField): void {
    const currentSelection = this.selectedFields.getValue()
    if (!this.fieldIds.has(field.getSelectedField().getElementId())) {
      this.selectedFields.next([...currentSelection, field])
      this.fieldIds.add(field.getSelectedField().getElementId())
      //this.updateDeepCopyField(field);
    }
  }

  /**
   * Removes the field from the selection.
   * @param {BasicField} field
   */
  public removeFromSelection(field: BasicField): void {
    const currentSelection = this.selectedFields.getValue()
    const updatedSelection = currentSelection.filter(
      (f: SelectedBasicField) => f.getSelectedField().getElementId() !== field.getElementId()
    )
    this.selectedFields.next(updatedSelection)
    this.fieldIds.delete(field.getElementId())
    this.updateDeepCopyField(field, false) // Mark as unselected
  }

  /**
   * Updates the field in the deep copy.
   * @param {BasicField} field
   */
  public updateField(field: BasicField): void {
    this.updateDeepCopyField(field)
  }

  /**
   * Updates the field in the deep copy, optionally setting its selected state.
   * @param {BasicField} field
   * @param {boolean} isSelected
   */
  public updateDeepCopyField(field: BasicField, isSelected = true): void {
    const deepCopy = this.deepCopyOfBasicFields.getValue()
    const updatedDeepCopy = this.updateNodeInDeepCopy(deepCopy, field, isSelected)
    this.deepCopyOfBasicFields.next(updatedDeepCopy)
  }

  /**
   * Replaces the matching field in the tree and returns the updated tree.
   * @param {BasicField[]} fields
   * @param {BasicField} updatedField
   * @param {boolean} isSelected
   * @returns {BasicField[]}
   */
  public updateNodeInDeepCopy(fields: BasicField[], updatedField: BasicField, isSelected: boolean): BasicField[] {
    return fields.map((field: BasicField) => {
      if (field.getElementId() === updatedField.getElementId()) {
        field.setIsSelected(isSelected)
        return field
      }
      if (field.getChildren()) {
        field.setChildren(this.updateNodeInDeepCopy(field.getChildren(), updatedField, isSelected))
      }
      return field
    })
  }

  /**
   * Returns the ids of the selected fields.
   * @returns {string[]}
   */
  public getSelectedIds(): string[] {
    return Array.from(this.fieldIds)
  }

  /**
   * Clears the selection and the deep copy selection.
   */
  public clearSelection(): void {
    this.selectedFields.next([])
    this.fieldIds.clear()
    this.clearDeepCopySelection()
  }

  /**
   * Clears the selected state in the deep copy.
   */
  private clearDeepCopySelection(): void {
    const deepCopy = this.deepCopyOfBasicFields.getValue()
    const clearedDeepCopy = this.clearSelectionInDeepCopy(deepCopy)
    this.deepCopyOfBasicFields.next(clearedDeepCopy)
  }

  /**
   * Sets every field and its children to not selected.
   * @param {BasicField[]} fields
   * @returns {BasicField[]}
   */
  private clearSelectionInDeepCopy(fields: BasicField[]): BasicField[] {
    return fields.map((field: BasicField) => {
      field.setIsSelected(false)
      if (field.getChildren()) {
        field.setChildren(this.clearSelectionInDeepCopy(field.getChildren()))
      }
      return field
    })
  }
}
