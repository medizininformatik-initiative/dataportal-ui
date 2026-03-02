import { AbstractListEntry } from 'src/app/model/Search/ListEntries/AbstractListEntry';
import { TableCellType } from './cells/TableCellType';

export interface TableRowData {
  id: string
  cells: Array<TableCellType>
  isClickable?: boolean
  originalEntry: AbstractListEntry
}
