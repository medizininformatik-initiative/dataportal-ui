import { AbstractTableAdapter } from './AbstractTableAdapter';
import { CriteriaBulkEntryNotFound } from 'src/app/model/Search/ListEntries/CriteriaBulkEntryNotFound';
import { TableCellBuilder } from '../cells/TableCellBuilder';
import { TableCellType } from '../cells/TableCellType';
import { TableHeaderData } from '../TableHeaderData';
import { TableRowData } from '../TableRowData';
import { v4 as uuidv4 } from 'uuid';

export class CodeableConceptBulkNotFoundEntryAdapter extends AbstractTableAdapter<CriteriaBulkEntryNotFound> {
  protected buildHeaders(): TableHeaderData {
    return { headers: ['TERMCODE'] };
  }

  protected buildRows(listEntries: CriteriaBulkEntryNotFound[]): TableRowData[] {
    return listEntries.map((entry) => this.buildRow(entry));
  }

  private buildRow(entry: CriteriaBulkEntryNotFound): TableRowData {
    return {
      id: uuidv4(),
      isClickable: false,
      originalEntry: entry,
      cells: this.buildCells(entry),
    };
  }

  private buildCells(entry: CriteriaBulkEntryNotFound): TableCellType[] {
    const termCodeCell = this.termCodeCell(entry);
    return TableCellBuilder.row(termCodeCell);
  }

  private termCodeCell(entry: CriteriaBulkEntryNotFound) {
    const termCode = entry.getTermCode();
    return TableCellBuilder.withText(termCode ?? '');
  }
}
