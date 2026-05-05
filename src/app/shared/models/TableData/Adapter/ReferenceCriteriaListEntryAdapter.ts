import { AbstractTableAdapter } from './AbstractTableAdapter';
import { ReferenceCriteriaListEntry } from '../../../../model/Search/ListEntries/ReferenceCriteriaListEntry';
import { TableCellBuilder } from '../cells/TableCellBuilder';
import { TableCellType } from '../cells/TableCellType';
import { TableHeaderData } from '../TableHeaderData';
import { TableRowData } from '../TableRowData';
import { TerminologySystemDictionary } from 'src/app/model/Utilities/TerminologySystemDictionary';
import { IconCellData } from '../cells/IconCellData';
import { DisplayCellData } from '../cells/DisplayCellData';

export class ReferenceCriteriaListEntryAdapter extends AbstractTableAdapter<ReferenceCriteriaListEntry> {
  protected buildHeaders(): TableHeaderData {
    return { headers: ['EMPTY', 'NAME', 'TERMINOLOGY_CODE'] };
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
    return TableCellBuilder.row(
      this.iconCell(),
      this.displayCell(listEntry),
      this.terminologyCell(listEntry)
    );
  }

  private iconCell(): IconCellData {
    return TableCellBuilder.withIcon('plus');
  }

  private displayCell(listEntry: ReferenceCriteriaListEntry): DisplayCellData {
    const display = listEntry.getDisplay();
    return TableCellBuilder.withDisplay(display);
  }

  private terminologyCell(listEntry: ReferenceCriteriaListEntry): TableCellType {
    const terminologyName = TerminologySystemDictionary.getNameByUrl(listEntry.getTerminology());
    return TableCellBuilder.withText(terminologyName ?? listEntry.getTerminology());
  }
}
