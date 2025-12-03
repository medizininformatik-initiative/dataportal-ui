import { CriteriaBulkEntry } from 'src/app/model/Search/ListEntries/CriteriaBulkEntry';
import { InterfaceTableDataBody } from '../InterfaceTableDataBody';
import { InterfaceTableDataHeader } from '../InterfaceTableDataHeader';
import { InterfaceTableDataRow } from '../InterfaceTableDataRows';
import { TableData } from '../InterfaceTableData';
import { v4 as uuidv4 } from 'uuid';
import { TerminologySystemDictionary } from 'src/app/model/Utilities/TerminologySystemDictionary';
import { CriteriaBulkEntryNotFound } from 'src/app/model/Search/ListEntries/CriteriaBulkEntryNotFound';
import { Display } from 'src/app/model/DataSelection/Profile/Display';
import { Translation } from 'src/app/model/DataSelection/Profile/Translation';

export class CriteriaBulkListEntryAdapter {
  private static headers: InterfaceTableDataHeader = {
    headers: ['DISPLAY', 'TERMINOLOGY_CODE', 'TERMCODE'],
  };

  private static headersNotFound: InterfaceTableDataHeader = {
    headers: ['TERMCODE'],
  };

  public static adaptFound(
    listEntries: CriteriaBulkEntry[],
    isCheckboxSelected: boolean = true
  ): TableData {
    const rows: InterfaceTableDataRow[] = listEntries.map((entry: CriteriaBulkEntry) => ({
      id: uuidv4(),
      data: [
        entry.getDisplay(),
        TerminologySystemDictionary.getNameByUrl(entry.getTerminology()),
        entry.getTermCodes()[0].getCode(),
      ],
      hasCheckbox: true,
      isCheckboxSelected,
      isClickable: false,
      isDisabled: true,
      checkboxColumnIndex: 0,
      originalEntry: entry,
    }));

    const body: InterfaceTableDataBody = { rows };

    return { header: CriteriaBulkListEntryAdapter.headers, body };
  }

  public static adaptNotFound(listEntries: CriteriaBulkEntryNotFound[]): TableData {
    const rows: InterfaceTableDataRow[] = listEntries.map((entry: CriteriaBulkEntryNotFound) => ({
      id: uuidv4(),
      data: [entry.getTermCode()],
      hasCheckbox: false,
      isCheckboxSelected: false,
      isClickable: false,
      isDisabled: false,
      checkboxColumnIndex: 0,
      originalEntry: entry,
    }));

    const body: InterfaceTableDataBody = { rows };

    return { header: CriteriaBulkListEntryAdapter.headersNotFound, body };
  }
}
