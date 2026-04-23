import { AbstractTableAdapter } from './AbstractTableAdapter';
import { CodeableConceptBulkEntry } from 'src/app/model/Search/ListEntries/CodeableConceptBulkEntry';
import { TableCellBuilder } from '../cells/TableCellBuilder';
import { TableCellType } from '../cells/TableCellType';
import { TableHeaderData } from '../TableHeaderData';
import { TableRowData } from '../TableRowData';
import { TerminologyCode } from 'src/app/model/Terminology/TerminologyCode';
import { TerminologySystemDictionary } from 'src/app/model/Utilities/TerminologySystemDictionary';
import { TextCellData } from '../cells/TextCellData';
import { v4 as uuidv4 } from 'uuid';

export class CodeableConceptBulkFoundEntryAdapter extends AbstractTableAdapter<CodeableConceptBulkEntry> {
  protected buildHeaders(): TableHeaderData {
    return { headers: ['DISPLAY', 'TERMINOLOGY_CODE', 'TERMCODE'] };
  }

  protected buildRows(listEntries: CodeableConceptBulkEntry[]): TableRowData[] {
    return listEntries.map((entry) => this.buildRow(entry));
  }

  private buildRow(entry: CodeableConceptBulkEntry): TableRowData {
    return {
      id: uuidv4(),
      isClickable: false,
      originalEntry: entry,
      cells: this.buildCells(entry),
    };
  }

  private buildCells(entry: CodeableConceptBulkEntry): TableCellType[] {
    const terminologyCode = entry.getTermCode();
    return TableCellBuilder.row(
      this.checkBoxCell(entry),
      this.terminologyCell(terminologyCode),
      this.termCodeCell(terminologyCode)
    );
  }

  private checkBoxCell(entry: CodeableConceptBulkEntry) {
    return TableCellBuilder.withCheckboxText(entry.getDisplay(), {
      isSelected: true,
      isDisabled: true,
    });
  }

  private terminologyCell(terminologyCode: TerminologyCode): TextCellData {
    const name = TerminologySystemDictionary.getNameByUrl(terminologyCode.getSystem());
    return TableCellBuilder.withText(name ?? terminologyCode.getSystem());
  }

  private termCodeCell(terminologyCode: TerminologyCode): TextCellData {
    return TableCellBuilder.withText(terminologyCode.getCode() ?? '');
  }
}
