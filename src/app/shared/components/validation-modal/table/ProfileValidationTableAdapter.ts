import { AbstractTableAdapter } from 'src/app/shared/models/TableData/Adapter/AbstractTableAdapter'
import { ProfileValidationEntry } from './ProfileValidationContextEntry'
import { TableCellBuilder } from 'src/app/shared/models/TableData/cells/TableCellBuilder'
import { TableHeaderData } from 'src/app/shared/models/TableData/TableHeaderData'
import { TableRowData } from 'src/app/shared/models/TableData/TableRowData'
import {
  ProfileStateType,
  ProfileValidationState,
} from 'src/app/service/Validation/Internal/ProfileValidationService.service'

export class ProfileValidationTableAdapter extends AbstractTableAdapter<ProfileValidationEntry> {
  protected buildHeaders(): TableHeaderData {
    return { headers: ['PROFILE', 'STATUS', 'WHAT_IS_MISSING'] }
  }

  protected buildRows(entries: ProfileValidationEntry[]): TableRowData[] {
    return entries.map((entry) => ({
      id: entry.getId(),
      isClickable: false,
      originalEntry: entry,
      cells: [
        TableCellBuilder.withDisplay(entry.getDisplay()),
        TableCellBuilder.withText(entry.getValid() ? 'Valid' : 'Invalid'),
        TableCellBuilder.withText(this.whatsMissing(entry.getState())),
      ],
    }))
  }

  private whatsMissing(state: ProfileStateType): string {
    switch (state) {
      case ProfileStateType.BasicFieldsSetButReferenceNotSet:
        return 'Missing references'
      case ProfileStateType.BasicFieldsSetAndReferenceSet:
        return '–'
      case ProfileStateType.NoBasicFieldsSetButReferencesSet:
        return 'Missing fields · Missing references'
      case ProfileStateType.NoBasicFieldsSetAndNoReferencesSet:
        return 'Missing fields'
    }
  }
}
