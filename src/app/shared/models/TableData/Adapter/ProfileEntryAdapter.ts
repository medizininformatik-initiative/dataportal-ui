import { ProfileListEntry } from 'src/app/model/Search/ListEntries/ProfileListEntry'
import { AbstractTableAdapter } from './AbstractTableAdapter'
import { TableHeaderData } from '../TableHeaderData'
import { TableRowData } from '../TableRowData'
import { TableCellBuilder } from '../cells/TableCellBuilder'

export class ProfileEntryAdapter extends AbstractTableAdapter<ProfileListEntry> {
  constructor() {
    super()
  }

  protected buildHeaders(): TableHeaderData {
    const headers = ['EMPTY', 'DISPLAY', 'AVAILABILITY', 'MODULE']
    return { headers }
  }

  protected buildRows(data: ProfileListEntry[]): TableRowData[] {
    return data.map((entry: ProfileListEntry) => this.buildRow(entry))
  }

  public buildRow(entry: ProfileListEntry): TableRowData {
    const cells = this.buildCells(entry)
    return {
      id: entry.getId(),
      isClickable: true,
      originalEntry: entry,
      cells,
    }
  }

  private buildCells(entry: ProfileListEntry): Array<any> {
    return [
      this.checkBoxCell(entry),
      this.displayCell(entry),
      this.availabilityCell(entry),
      this.moduleCell(entry),
    ]
  }

  private checkBoxCell(entry: ProfileListEntry): any {
    const checkboxoptions = {
      isSelected: false,
      isDisabled: entry.getSelectable(),
    }
    return TableCellBuilder.withCheckbox(checkboxoptions)
  }

  private displayCell(entry: ProfileListEntry): any {
    return TableCellBuilder.withDisplay(entry.getDisplay())
  }

  private availabilityCell(entry: ProfileListEntry): any {
    return TableCellBuilder.withAvailability(entry.getAvailabilityStatus())
  }

  private moduleCell(entry: ProfileListEntry): any {
    return TableCellBuilder.withDisplay(entry.getModule())
  }
}
