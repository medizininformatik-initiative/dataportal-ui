import { AbstractTableAdapter } from './AbstractTableAdapter'
import { FeasibilityQueryResultDetailstListEntry } from '../../../../model/Search/ListEntries/FeasibilityQueryResultDetailstListEntry'
import { TableCellBuilder } from '../Cells/TableCellBuilder'
import { TableCellUnion } from '../Cells/TableCellUnion'
import { TableHeaderData } from '../TableHeaderData'
import { TableRowData } from '../TableRowData'
import { TextCellData } from '../Cells/Data/TextCellData'
import { v4 as uuidv4 } from 'uuid'

export class FeasibilityQueryResultDetailsListAdapter extends AbstractTableAdapter<FeasibilityQueryResultDetailstListEntry> {
  protected buildHeaders(): TableHeaderData {
    return {
      headers: [
        { label: 'SITE', addAllCheckbox: false },
        { label: 'PATIENT_COUNT', addAllCheckbox: false },
      ],
    }
  }

  protected buildRows(listEntries: FeasibilityQueryResultDetailstListEntry[]): TableRowData[] {
    return listEntries?.map((entry, index) => this.buildRow(entry, index))
  }

  private buildRow(entry: FeasibilityQueryResultDetailstListEntry, index: number): TableRowData {
    return {
      id: uuidv4(),
      isClickable: false,
      originalEntry: entry,
      cells: this.buildCells(entry, index),
    }
  }

  private buildCells(
    entry: FeasibilityQueryResultDetailstListEntry,
    index: number
  ): TableCellUnion[] {
    return TableCellBuilder.row(
      this.textCell(index),
      this.patientCountCell(entry.getNumberOfPatients())
    )
  }

  private textCell(index: number): TextCellData {
    const text = 'DIZ ' + (index + 1)
    return TableCellBuilder.withText(text)
  }

  private patientCountCell(count: number): TextCellData {
    const text = count.toString()
    return TableCellBuilder.withText(text)
  }
}
