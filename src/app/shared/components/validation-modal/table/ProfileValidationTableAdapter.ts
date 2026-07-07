import { AbstractTableAdapter } from 'src/app/shared/models/TableData/Adapter/AbstractTableAdapter'
import { ProfileValidationEntry } from './ProfileValidationContextEntry'
import { TableCellBuilder } from 'src/app/shared/models/TableData/cells/TableCellBuilder'
import { TableHeaderData } from 'src/app/shared/models/TableData/TableHeaderData'
import { TableRowData } from 'src/app/shared/models/TableData/TableRowData'
import { ValidationStateType } from 'src/app/service/Validation/DataSelectionValidation.service'

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

  private whatsMissing(state: ValidationStateType): string {
    switch (state) {
      case ValidationStateType.BasicFieldsSetButReferenceNotSet:
        return 'Missing references'
      case ValidationStateType.BasicFieldsSetAndReferenceSet:
        return '–'
      case ValidationStateType.NoBasicFieldsSetButReferencesSet:
        return 'Missing fields · Missing references'
      case ValidationStateType.NoBasicFieldsSetAndNoReferencesSet:
        return 'Missing fields'
    }
  }
}
