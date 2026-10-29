import { ReferenceField } from 'src/app/model/DataSelection/Profile/Fields/RefrenceFields/ReferenceField'
import { CloneDisplayData } from '../../DisplayData/CloneDisplayData'
import { ReferencedProfileCloner } from './ReferencedProfilesCloner'

export class ReferenceFieldsCloner {
  public static deepCopyReferenceFields(referenceFields: ReferenceField[]): ReferenceField[] {
    if (!referenceFields || referenceFields.length === 0) {
      return []
    }
    return referenceFields.map((field: ReferenceField) => ReferenceFieldsCloner.deepCopyReferenceField(field))
  }

  public static deepCopyReferenceField(referenceField: ReferenceField): ReferenceField {
    return new ReferenceField(
      referenceField.getElementId(),
      CloneDisplayData.deepCopyDisplayData(referenceField.getDisplay()),
      CloneDisplayData.deepCopyDisplayData(referenceField.getDescription()),
      referenceField.getIsRequired(),
      referenceField.getRecommended(),
      ReferencedProfileCloner.deepCopyReferencedProfiles(referenceField.getReferencedProfiles())
    )
  }
}
