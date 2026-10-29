import { SelectedBasicField } from '../../../DataSelection/Profile/Fields/BasicFields/SelectedBasicField'
import { BasicFieldCloner } from './BasicFieldCloner'

export class SelectedBasicFieldCloner {
  public static deepCopySelectedBasicFields(selectedFields: SelectedBasicField[]): SelectedBasicField[] {
    if (!selectedFields || selectedFields.length === 0) {
      return []
    }
    return selectedFields.map((selectedField: SelectedBasicField) => SelectedBasicFieldCloner.deepCopySelectedBasicField(selectedField))
  }

  /**
   * Clones a SelectedField object deeply.
   * @param {SelectedBasicField} selectedField The SelectedField to clone.
   * @returns {SelectedBasicField | undefined} A deep copy of the SelectedField.
   * */
  public static deepCopySelectedBasicField(selectedField: SelectedBasicField): SelectedBasicField | undefined {
    if (!selectedField) {
      return undefined
    }

    return new SelectedBasicField(BasicFieldCloner.deepCopyBasicField(selectedField.getSelectedField()), selectedField.getMustHave())
  }
}
