import { AbstractTableAdapter } from './AbstractTableAdapter';
import { CriteriaBulkEntry } from 'src/app/model/Search/ListEntries/CriteriaBulkEntry';
import { TableCellBuilder } from '../cells/TableCellBuilder';
import { TableHeaderData } from '../TableHeaderData';
import { TableRowData } from '../TableRowData';
import { TerminologySystemDictionary } from 'src/app/model/Utilities/TerminologySystemDictionary';
import { v4 as uuidv4 } from 'uuid';
import { TableCellType } from '../cells/TableCellType';

export class CriteriaBulkFoundListEntryAdapter extends AbstractTableAdapter<CriteriaBulkEntry> {
  protected buildHeaders(): TableHeaderData {
    return { headers: ['DISPLAY', 'TERMINOLOGY_CODE', 'TERMCODE'] };
  }

  protected buildRows(listEntries: CriteriaBulkEntry[]): TableRowData[] {
    return listEntries.map((entry) => this.buildRow(entry));
  }

  private buildRow(entry: CriteriaBulkEntry): TableRowData {
    return {
      id: uuidv4(),
      isClickable: false,
      originalEntry: entry,
      cells: this.buildCells(entry),
    };
  }

  private buildCells(entry: CriteriaBulkEntry): TableCellType[] {
    return TableCellBuilder.row(
      this.displayCell(entry),
      this.terminologyCell(entry),
      this.termCodeCell(entry)
    );
  }

  private displayCell(entry: CriteriaBulkEntry) {
    const display = entry.getDisplay();
    const options = { isSelected: true, isDisabled: true };
    return TableCellBuilder.withCheckboxText(display, options);
  }

  private terminologyCell(entry: CriteriaBulkEntry) {
    const terminologyName = TerminologySystemDictionary.getNameByUrl(entry.getTerminology());
    return TableCellBuilder.withText(terminologyName ?? entry.getTerminology());
  }

  private termCodeCell(entry: CriteriaBulkEntry) {
    const termCode = entry.getTermCodes()[0].getCode();
    return TableCellBuilder.withText(termCode ?? '');
  }
}
