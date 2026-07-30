import { TableCellContext } from '../TableCellContext'
import { TableCellKind } from '../TableCellKind'

export interface IconCellData {
  type: TableCellKind.ICON
  actionId?: string
  icon: string
  context: TableCellContext
}
