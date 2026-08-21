import { AbstractTableAdapter } from 'src/app/shared/models/TableData/Adapter/AbstractTableAdapter'
import { ProfileValidationEntry } from './ProfileValidationContextEntry'
import { TableHeaderData } from 'src/app/shared/models/TableData/TableHeaderData'
import { TableRowData } from 'src/app/shared/models/TableData/TableRowData'
import { ProfileStateType } from 'src/app/service/Validation/Internal/ProfileValidationService.service'
import { v4 as uuidv4 } from 'uuid'
import { TableCellContext } from '../../../models/TableData/Cells/TableCellContext'
import { TableCellBuilder } from '../../../models/TableData/Cells/TableCellBuilder'
export class ProfileValidationTableAdapter extends AbstractTableAdapter<ProfileValidationEntry> {
  private readonly ICON_NAME: string = 'pencil-alt'

  /**
   * Returns the headers for the profile validation table.
   * @returns {TableHeaderData}
   */
  protected buildHeaders(): TableHeaderData {
    return {
      headers: [
        { label: 'PROFILE', addAllCheckbox: false },
        { label: 'STATUS', addAllCheckbox: false },
        { label: 'WHAT_IS_MISSING', addAllCheckbox: false },
        { label: 'ACTIONS', addAllCheckbox: false },
      ],
    }
  }

  /**
   * Builds the rows for the profile validation table.
   * @param {ProfileValidationEntry[]} entries
   * @returns {TableRowData[]}
   */
  protected buildRows(entries: ProfileValidationEntry[]): TableRowData[] {
    return entries.map((entry) => ({
      id: uuidv4(),
      isClickable: false,
      originalEntry: entry,
      cells: [
        TableCellBuilder.withDisplay(entry.getDisplay()),
        TableCellBuilder.withText(
          entry.getValid()
            ? 'SHARED_COMPONENTS.TABLE.PROFILE_VALIDATION.VALID'
            : 'SHARED_COMPONENTS.TABLE.PROFILE_VALIDATION.INVALID'
        ),
        TableCellBuilder.withText(this.whatsMissing(entry.getState())),
        TableCellBuilder.withIcon(this.ICON_NAME, TableCellContext.FEATURE),
      ],
    }))
  }

  private whatsMissing(state: ProfileStateType): string {
    switch (state) {
      case ProfileStateType.BasicFieldsSetButReferenceNotSet:
        return 'SHARED_COMPONENTS.TABLE.PROFILE_VALIDATION.MISSING_REFERENCE'
      case ProfileStateType.BasicFieldsSetAndReferenceSet:
        return '–'
      case ProfileStateType.NoBasicFieldsSetButReferencesSet:
        return 'SHARED_COMPONENTS.TABLE.PROFILE_VALIDATION.MISSING_FIELDS_MISSING_REFERENCES'
      case ProfileStateType.NoBasicFieldsSetAndNoReferencesSet:
        return 'SHARED_COMPONENTS.TABLE.PROFILE_VALIDATION.MISSING_FIELDS'
    }
  }
}
