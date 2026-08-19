import { AbstractTableAdapter } from 'src/app/shared/models/TableData/Adapter/AbstractTableAdapter'
import { CriterionValidationEntry } from './CriterionValidationEntry'
import { TableHeaderData } from 'src/app/shared/models/TableData/TableHeaderData'
import { TableRowData } from 'src/app/shared/models/TableData/TableRowData'
import { v4 as uuidv4 } from 'uuid'
import { TableCellBuilder } from '../../../models/TableData/Cells/TableCellBuilder'
import { TableCellContext } from '../../../models/TableData/Cells/TableCellContext'
export class CriterionValidationTableAdapter extends AbstractTableAdapter<CriterionValidationEntry> {
  private readonly ICON_NAME: string = 'pencil-alt'
  protected buildHeaders(): TableHeaderData {
    return {
      headers: [
        { label: 'CRITERION', addAllCheckbox: false },
        { label: 'STATUS', addAllCheckbox: false },
        { label: 'WHAT_IS_MISSING', addAllCheckbox: false },
        { label: 'ACTIONS', addAllCheckbox: false },
      ],
    }
  }

  protected buildRows(entries: CriterionValidationEntry[]): TableRowData[] {
    return entries.map((entry) => ({
      id: uuidv4(),
      isClickable: false,
      originalEntry: entry,
      cells: [
        TableCellBuilder.withDisplay(entry.getDisplay()),
        TableCellBuilder.withText(
          entry.isValid()
            ? 'SHARED_COMPONENTS.TABLE.CRITERION_VALIDATION.VALID'
            : 'SHARED_COMPONENTS.TABLE.CRITERION_VALIDATION.INVALID'
        ),
        TableCellBuilder.withText(
          entry.isValid() ? '–' : 'SHARED_COMPONENTS.TABLE.CRITERION_VALIDATION.MISSING_FILTER'
        ),
        TableCellBuilder.withIcon(this.ICON_NAME, TableCellContext.CRITERIA),
      ],
    }))
  }
}
