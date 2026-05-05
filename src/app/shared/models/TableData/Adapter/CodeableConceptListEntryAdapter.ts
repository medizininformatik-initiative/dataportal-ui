import { AbstractTableAdapter } from './AbstractTableAdapter';
import { CodeableConceptResultListEntry } from 'src/app/model/Search/ListEntries/CodeableConceptResultListEntry';
import { TableCellBuilder } from '../cells/TableCellBuilder';
import { TableHeaderData } from '../TableHeaderData';
import { TableRowData } from '../TableRowData';
import { TerminologySystemDictionary } from 'src/app/model/Utilities/TerminologySystemDictionary';
import { v4 as uuidv4 } from 'uuid';
import { TextCellData } from '../cells/TextCellData';
import { TableCellType } from '../cells/TableCellType';

export class CodeableConceptListEntryAdapter extends AbstractTableAdapter<CodeableConceptResultListEntry> {
  protected buildHeaders(): TableHeaderData {
    return { headers: ['DISPLAY', 'TERMINOLOGY_CODE', 'TERMCODE'] };
  }

  protected buildRows(listEntries: CodeableConceptResultListEntry[]): TableRowData[] {
    return listEntries.map((entry) => this.buildRow(entry));
  }

  private buildRow(entry: CodeableConceptResultListEntry): TableRowData {
    return {
      id: uuidv4(),
      isClickable: false,
      originalEntry: entry,
      cells: this.buildCells(entry),
    };
  }

  private buildCells(entry: CodeableConceptResultListEntry): TableCellType[] {
    return TableCellBuilder.row(
      this.checkboxTextCell(entry),
      this.terminologyCell(entry),
      this.termCodeCell(entry)
    );
  }

  private checkboxTextCell(entry: CodeableConceptResultListEntry) {
    const display = entry.getConcept().getDisplay();
    const options = { isSelected: entry.getIsSelected(), isDisabled: true };
    return TableCellBuilder.withCheckboxText(display, options);
  }

  private terminologyCell(entry: CodeableConceptResultListEntry): TextCellData {
    const terminologyName = TerminologySystemDictionary.getNameByUrl(
      entry.getConcept().getTerminologyCode().getSystem()
    );
    return TableCellBuilder.withText(
      terminologyName ?? entry.getConcept().getTerminologyCode().getSystem()
    );
  }

  private termCodeCell(entry: CodeableConceptResultListEntry): TextCellData {
    const termCode = entry.getConcept().getTerminologyCode().getCode();
    return TableCellBuilder.withText(termCode ?? '');
  }
}
