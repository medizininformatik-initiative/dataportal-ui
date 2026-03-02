import { AbstractTableAdapter } from './AbstractTableAdapter';
import { CheckboxCellData } from '../cells/CheckboxCellData';
import { ReferenceCriteriaListEntry } from '../../../../model/Search/ListEntries/ReferenceCriteriaListEntry';
import { TableCellBuilder } from '../cells/TableCellBuilder';
import { TableCellType } from '../cells/TableCellType';
import { TableHeaderData } from '../TableHeaderData';
import { TableRowData } from '../TableRowData';
import { TerminologySystemDictionary } from 'src/app/model/Utilities/TerminologySystemDictionary';

export class ReferenceCriteriaListEntryAdapter extends AbstractTableAdapter<ReferenceCriteriaListEntry> {
  protected buildHeaders(): TableHeaderData {
    return { headers: ['NAME', 'TERMINOLOGY_CODE'] };
  }

  protected buildRows(listEntries: ReferenceCriteriaListEntry[]): TableRowData[] {
    return listEntries.map((listEntry) => this.buildRow(listEntry));
  }

  private buildRow(listEntry: ReferenceCriteriaListEntry): TableRowData {
    return {
      id: listEntry.getId(),
      isClickable: false,
      originalEntry: listEntry,
      cells: this.buildCells(listEntry),
    };
  }

  private buildCells(listEntry: ReferenceCriteriaListEntry): TableCellType[] {
    return TableCellBuilder.row(this.checkBoxCell(listEntry), this.terminologyCell(listEntry));
  }

  private checkBoxCell(listEntry: ReferenceCriteriaListEntry): CheckboxCellData {
    const display = listEntry.getDisplay();
    const options = { isDisabled: true };
    return TableCellBuilder.withCheckbox(display, options);
  }

  private terminologyCell(listEntry: ReferenceCriteriaListEntry): TableCellType {
    const terminologyName = TerminologySystemDictionary.getNameByUrl(listEntry.getTerminology());
    return TableCellBuilder.withText(terminologyName ?? listEntry.getTerminology());
  }
}
