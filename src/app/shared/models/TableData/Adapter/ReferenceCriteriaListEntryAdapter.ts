import { InterfaceTableDataBody } from '../InterfaceTableDataBody';
import { InterfaceTableDataHeader } from '../InterfaceTableDataHeader';
import { InterfaceTableDataRow } from '../InterfaceTableDataRows';
import { ReferenceCriteriaListEntry } from '../../../../model/Search/ListEntries/ReferenceCriteriaListEntry';
import { TableData } from '../InterfaceTableData';
import { TerminologySystemDictionary } from 'src/app/model/Utilities/TerminologySystemDictionary';

export class ReferenceCriteriaListEntryAdapter {
  private static headers: InterfaceTableDataHeader = {
    headers: ['NAME', 'TERMINOLOGY_CODE'],
  };

  public static adapt(listEntries: ReferenceCriteriaListEntry[]): TableData {
    const rows: InterfaceTableDataRow[] = listEntries.map((listEntry) => ({
      id: listEntry.getId(),
      data: [
        listEntry.getDisplay(),
        TerminologySystemDictionary.getNameByUrl(listEntry.getTerminology()),
      ],
      hasCheckbox: true,
      isCheckboxSelected: false,
      isClickable: false,
      isDisabled: true,
      checkboxColumnIndex: 0,
      originalEntry: listEntry,
    }));

    const body: InterfaceTableDataBody = { rows };

    return { header: ReferenceCriteriaListEntryAdapter.headers, body };
  }
}
