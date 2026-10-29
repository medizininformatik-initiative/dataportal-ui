import { SelectedReferenceField } from 'src/app/model/DataSelection/Profile/Fields/RefrenceFields/SelectedReferenceField'
import { ReferenceFieldsCloner } from './ReferenceFieldsCloner'

export class SelectedReferenceFieldsCloner {
  public static deepCopySelectedReferenceFields(selectedReferenceFields: SelectedReferenceField[]): SelectedReferenceField[] {
    if (!selectedReferenceFields || selectedReferenceFields.length === 0) {
      return []
    }
    return selectedReferenceFields.map((field) => SelectedReferenceFieldsCloner.deepCopySelectedReferenceField(field))
  }

  public static deepCopySelectedReferenceField(selectedReferenceField: SelectedReferenceField): SelectedReferenceField {
    const clonedLinkedProfileIds = [...selectedReferenceField.getLinkedProfileIds()]
    return new SelectedReferenceField(
      ReferenceFieldsCloner.deepCopyReferenceField(selectedReferenceField.getSelectedField()),
      clonedLinkedProfileIds,
      selectedReferenceField.getMustHave()
    )
  }
}
