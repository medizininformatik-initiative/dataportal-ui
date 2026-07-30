import { AbstractTableAdapter } from './AbstractTableAdapter'
import { CriteriaBulkEntryNotFound } from 'src/app/model/Search/ListEntries/CriteriaBulkEntryNotFound'
import { TableCellBuilder } from '../Cells/TableCellBuilder'
import { TableHeaderData } from '../TableHeaderData'
import { TableRowData } from '../TableRowData'
import { v4 as uuidv4 } from 'uuid'
import { TextCellData } from '../Cells/Data/TextCellData'
import { TableCellUnion } from '../Cells/TableCellUnion'

export class CriteriaBulkNotFoundListEntryAdapter extends AbstractTableAdapter<CriteriaBulkEntryNotFound> {
  protected buildHeaders(): TableHeaderData {
    return { headers: ['TERMCODE'] }
  }

  protected buildRows(listEntries: CriteriaBulkEntryNotFound[]): TableRowData[] {
    return listEntries.map((entry) => this.buildRow(entry))
  }

  private buildRow(entry: CriteriaBulkEntryNotFound): TableRowData {
    return {
      id: uuidv4(),
      isClickable: false,
      originalEntry: entry,
      cells: this.buildCells(entry),
    }
  }

  private buildCells(entry: CriteriaBulkEntryNotFound): TableCellUnion[] {
    return TableCellBuilder.row(this.termCodeCell(entry))
  }

  private termCodeCell(entry: CriteriaBulkEntryNotFound): TextCellData {
    const termCode = entry.getTermCode()
    return TableCellBuilder.withText(termCode ?? '')
  }
}
