import { CellDataContext, TableCellDataTypes } from './TableCellType'

export interface IconCellData {
  type: TableCellDataTypes.ICON
  actionId?: string
  icon: string
  context: CellDataContext
}
