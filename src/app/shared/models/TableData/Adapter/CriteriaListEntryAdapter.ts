import { AbstractTableAdapter } from './AbstractTableAdapter'
import { AvailabilityCellData } from '../Cells/Data/AvailabilityCellData'
import { CheckboxTextCellData } from '../Cells/Data/CheckboxTextCellData'
import { CriteriaListEntry } from '../../../../model/Search/ListEntries/CriteriaListListEntry'
import { TableCellBuilder } from '../Cells/TableCellBuilder'
import { TableHeaderData } from '../TableHeaderData'
import { TableRowData } from '../TableRowData'
import { TerminologySystemDictionary } from 'src/app/model/Utilities/TerminologySystemDictionary'
import { TextCellData } from '../Cells/Data/TextCellData'
import { TableCellContext } from '../Cells/TableCellContext'
import { TableCellUnion } from '../Cells/TableCellUnion'
import { IconCellData } from '../Cells/Data/IconCellData'

export class CriteriaListEntryAdapter extends AbstractTableAdapter<CriteriaListEntry> {
  constructor() {
    super()
  }

  protected buildHeaders(): TableHeaderData {
    return {
      headers: [
        { label: 'EMPTY', addAllCheckbox: false },
        { label: 'NAME', addAllCheckbox: false },
        { label: 'AVAILABILITY', addAllCheckbox: false },
        { label: 'TERMINOLOGY_CODE', addAllCheckbox: false },
        { label: 'TERMCODE', addAllCheckbox: false },
        { label: 'CONTEXT', addAllCheckbox: false },
      ],
    }
  }

  protected buildRows(listEntries: CriteriaListEntry[]): TableRowData[] {
    return listEntries.map((listEntry: CriteriaListEntry) => this.buildRow(listEntry))
  }

  private buildRow(listEntry: CriteriaListEntry): TableRowData {
    const cells = this.buildCells(listEntry)
    return {
      id: listEntry.getId(),
      isClickable: true,
      originalEntry: listEntry,
      cells,
    }
  }

  private buildCells(listEntry: CriteriaListEntry): TableCellUnion[] {
    return [
      this.iconCell(listEntry),
      this.displayCell(listEntry),
      this.availabilityCell(listEntry),
      this.terminologyCell(listEntry),
      this.termCodeCell(listEntry),
      this.contextCell(listEntry),
    ]
  }

  private displayCell(listEntry: CriteriaListEntry): CheckboxTextCellData {
    return TableCellBuilder.withCheckboxText(
      listEntry.getDisplay(),
      {
        isSelected: false,
        isDisabled: listEntry.getSelectable(),
      },
      TableCellContext.CRITERIA
    )
  }

  private iconCell(listEntry: CriteriaListEntry): IconCellData {
    return TableCellBuilder.withIcon('sitemap', TableCellContext.CRITERIA)
  }

  private terminologyCell(listEntry: CriteriaListEntry): TextCellData {
    const terminologyName = TerminologySystemDictionary.getNameByUrl(listEntry.getTerminology())
    return TableCellBuilder.withText(terminologyName ?? listEntry.getTerminology())
  }

  private termCodeCell(listEntry: CriteriaListEntry): TextCellData {
    const termCode = listEntry.getTermcode()
    return TableCellBuilder.withText(termCode ?? '')
  }

  private contextCell(listEntry: CriteriaListEntry): TextCellData {
    const context = listEntry.getContext()
    return TableCellBuilder.withText(context ?? '')
  }

  private availabilityCell(listEntry: CriteriaListEntry): AvailabilityCellData {
    const availabilityStatus = listEntry.getAvailabilityStatus()
    return TableCellBuilder.withAvailability(availabilityStatus)
  }
}
