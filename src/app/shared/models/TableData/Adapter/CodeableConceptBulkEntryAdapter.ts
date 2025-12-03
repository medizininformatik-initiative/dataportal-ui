import { CodeableConceptBulkEntry } from 'src/app/model/Search/ListEntries/CodeableConceptBulkEntry';
import { InterfaceTableDataBody } from '../InterfaceTableDataBody';
import { InterfaceTableDataHeader } from '../InterfaceTableDataHeader';
import { InterfaceTableDataRow } from '../InterfaceTableDataRows';
import { TableData } from '../InterfaceTableData';
import { v4 as uuidv4 } from 'uuid';
import { TerminologySystemDictionary } from 'src/app/model/Utilities/TerminologySystemDictionary';
import { CriteriaBulkEntryNotFound } from 'src/app/model/Search/ListEntries/CriteriaBulkEntryNotFound';

export class CodeableConceptBulkEntryAdapter {
  private static headers: InterfaceTableDataHeader = {
    headers: ['DISPLAY', 'TERMINOLOGY_CODE', 'TERMCODE'],
  };

  public static adaptFound(listEntries: CodeableConceptBulkEntry[]): TableData {
    const rows: InterfaceTableDataRow[] = listEntries.map((entry: CodeableConceptBulkEntry) => {
      const terminologyCode = entry.getTermCode();
      return {
        id: uuidv4(),
        data: [
          entry.getDisplay(),
          TerminologySystemDictionary.getNameByUrl(terminologyCode.getSystem()) ??
            terminologyCode.getSystem(),
          terminologyCode.getCode(),
        ],
        hasCheckbox: true,
        isCheckboxSelected: true,
        isClickable: false,
        isDisabled: true,
        checkboxColumnIndex: 0,
        originalEntry: entry,
      };
    });

    const body: InterfaceTableDataBody = { rows };

    return { header: CodeableConceptBulkEntryAdapter.headers, body };
  }

  private static headersNotFound: InterfaceTableDataHeader = {
    headers: ['TERMCODE'],
  };

  public static adaptNotFound(listEntries: CriteriaBulkEntryNotFound[]): TableData {
    const rows: InterfaceTableDataRow[] = listEntries.map((entry: CriteriaBulkEntryNotFound) => {
      const terminologyCode = entry.getTermCode();
      return {
        id: uuidv4(),
        data: [entry.getTermCode()],
        hasCheckbox: false,
        isCheckboxSelected: false,
        isClickable: false,
        isDisabled: false,
        checkboxColumnIndex: 0,
        originalEntry: entry,
      };
    });

    const body: InterfaceTableDataBody = { rows };

    return { header: CodeableConceptBulkEntryAdapter.headersNotFound, body };
  }
}
