import { AbstractTableAdapter } from './AbstractTableAdapter'
import { ReferenceCriteriaListEntry } from '../../../../model/Search/ListEntries/ReferenceCriteriaListEntry'
import { TableCellBuilder } from '../Cells/TableCellBuilder'
import { TableCellContext } from '../Cells/TableCellContext'
import { TableCellUnion } from '../Cells/TableCellUnion'
import { TableHeaderData } from '../TableHeaderData'
import { TableRowData } from '../TableRowData'
import { TerminologySystemDictionary } from 'src/app/model/Utilities/TerminologySystemDictionary'
import { IconCellData } from '../Cells/Data/IconCellData'
import { DisplayCellData } from '../Cells/Data/DisplayCellData'
import { TextCellData } from '../Cells/Data/TextCellData'

export class ReferenceCriteriaListEntryAdapter extends AbstractTableAdapter<ReferenceCriteriaListEntry> {
  protected buildHeaders(): TableHeaderData {
    return {
      headers: [
        { label: 'EMPTY', addAllCheckbox: false },
        { label: 'NAME', addAllCheckbox: false },
        { label: 'TERMINOLOGY_CODE', addAllCheckbox: false },
        { label: 'TERMCODE', addAllCheckbox: false },
      ],
    }
  }

  protected buildRows(listEntries: ReferenceCriteriaListEntry[]): TableRowData[] {
    return listEntries.map((listEntry) => this.buildRow(listEntry))
  }

  private buildRow(listEntry: ReferenceCriteriaListEntry): TableRowData {
    return {
      id: listEntry.getId(),
      isClickable: false,
      originalEntry: listEntry,
      cells: this.buildCells(listEntry),
    }
  }

  private buildCells(listEntry: ReferenceCriteriaListEntry): TableCellUnion[] {
    return TableCellBuilder.row(
      this.iconCell(),
      this.displayCell(listEntry),
      this.terminologyCell(listEntry),
      this.terminologyCodeCell(listEntry)
    )
  }

  private iconCell(): IconCellData {
    return TableCellBuilder.withIcon('plus', TableCellContext.CRITERIA)
  }

  private displayCell(listEntry: ReferenceCriteriaListEntry): DisplayCellData {
    const display = listEntry.getDisplay()
    return TableCellBuilder.withDisplay(display)
  }

  private terminologyCell(listEntry: ReferenceCriteriaListEntry): TextCellData {
    const terminologyName = TerminologySystemDictionary.getNameByUrl(listEntry.getTerminology())
    return TableCellBuilder.withText(terminologyName ?? listEntry.getTerminology())
  }

  private terminologyCodeCell(listEntry: ReferenceCriteriaListEntry): TextCellData {
    const terminologyCode = listEntry.getTermcode()
    return TableCellBuilder.withText(terminologyCode)
  }
}
