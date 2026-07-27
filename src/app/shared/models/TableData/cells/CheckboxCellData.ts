import { CellDataContext, TableCellDataTypes } from './TableCellType'

export interface CheckboxCellData {
  type: TableCellDataTypes.CHECKBOX
  isSelected: boolean
  isDisabled: boolean
  context: CellDataContext
}
