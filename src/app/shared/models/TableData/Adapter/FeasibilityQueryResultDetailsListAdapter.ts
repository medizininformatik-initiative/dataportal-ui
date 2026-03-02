import { AbstractTableAdapter } from './AbstractTableAdapter';
import { FeasibilityQueryResultDetailstListEntry } from '../../../../model/Search/ListEntries/FeasibilityQueryResultDetailstListEntry';
import { TableCellBuilder } from '../cells/TableCellBuilder';
import { TableCellType } from '../cells/TableCellType';
import { TableHeaderData } from '../TableHeaderData';
import { TableRowData } from '../TableRowData';
import { TextCellData } from '../cells/TextCellData';
import { v4 as uuidv4 } from 'uuid';

export class FeasibilityQueryResultDetailsListAdapter extends AbstractTableAdapter<FeasibilityQueryResultDetailstListEntry> {
  protected buildHeaders(): TableHeaderData {
    return { headers: ['SITE', 'PATIENT_COUNT'] };
  }

  protected buildRows(listEntries: FeasibilityQueryResultDetailstListEntry[]): TableRowData[] {
    return listEntries?.map((entry, index) => this.buildRow(entry, index));
  }

  private buildRow(entry: FeasibilityQueryResultDetailstListEntry, index: number): TableRowData {
    return {
      id: uuidv4(),
      isClickable: false,
      originalEntry: entry,
      cells: this.buildCells(entry, index),
    };
  }

  private buildCells(
    entry: FeasibilityQueryResultDetailstListEntry,
    index: number
  ): TableCellType[] {
    return TableCellBuilder.row(
      this.textCell(index),
      this.patientCountCell(entry.getNumberOfPatients())
    );
  }

  private textCell(index: number): TextCellData {
    const text = 'DIZ ' + (index + 1);
    return TableCellBuilder.withText(text);
  }

  private patientCountCell(count: number): TextCellData {
    const text = count.toString();
    return TableCellBuilder.withText(text);
  }
}
