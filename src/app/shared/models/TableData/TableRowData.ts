import { AbstractListEntry } from 'src/app/model/Search/ListEntries/AbstractListEntry'
import { TableCellUnion } from './Cells/TableCellUnion'

export interface TableRowData {
  id: string
  cells: Array<TableCellUnion>
  isClickable?: boolean
  originalEntry: AbstractListEntry
}
