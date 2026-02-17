import { BasicField } from 'src/app/model/DataSelection/Profile/Fields/BasicFields/BasicField';
import { CloneDisplayData } from '../../DisplayData/CloneDisplayData';

export class BasicFieldCloner {
  public static deepCopyBasicFields(fields: BasicField[]): BasicField[] {
    if (!fields || fields.length === 0) {
      return [];
    }

    return fields.map((field) => BasicFieldCloner.deepCopyBasicField(field));
  }

  public static deepCopyBasicField(basicField: BasicField) {
    return new BasicField(
      basicField.getElementId(),
      CloneDisplayData.deepCopyDisplayData(basicField.getDisplay()),
      CloneDisplayData.deepCopyDisplayData(basicField.getDescription()),
      BasicFieldCloner.deepCopyBasicFields(basicField.getChildren() || []),
      basicField.getRecommended(),
      basicField.getIsSelected(),
      basicField.getIsRequired(),
      basicField.getDeprecated(),
      basicField.getType()
    );
  }
}
