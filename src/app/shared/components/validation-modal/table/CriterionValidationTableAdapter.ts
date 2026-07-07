import { AbstractTableAdapter } from 'src/app/shared/models/TableData/Adapter/AbstractTableAdapter'
import { CriterionValidationEntry } from './CriterionValidationEntry'
import { TableCellBuilder } from 'src/app/shared/models/TableData/cells/TableCellBuilder'
import { TableHeaderData } from 'src/app/shared/models/TableData/TableHeaderData'
import { TableRowData } from 'src/app/shared/models/TableData/TableRowData'

export class CriterionValidationTableAdapter extends AbstractTableAdapter<CriterionValidationEntry> {
  protected buildHeaders(): TableHeaderData {
    return { headers: ['CRITERION', 'STATUS', 'WHAT_IS_MISSING'] }
  }

  protected buildRows(entries: CriterionValidationEntry[]): TableRowData[] {
    return entries.map((entry) => ({
      id: entry.getId(),
      isClickable: false,
      originalEntry: entry,
      cells: [
        TableCellBuilder.withDisplay(entry.getDisplay()),
        TableCellBuilder.withText(entry.isValid() ? 'Valid' : 'Invalid'),
        TableCellBuilder.withText(entry.isValid() ? '–' : 'Missing filters'),
      ],
    }))
  }
}
