import { TableCellContext } from '../TableCellContext'
import { TableCellKind } from '../TableCellKind'

export interface CheckboxCellData {
  type: TableCellKind.CHECKBOX
  isSelected: boolean
  isDisabled: boolean
  context: TableCellContext
}
