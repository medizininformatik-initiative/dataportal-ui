import { Display } from 'src/app/model/DataSelection/Profile/Display'
import { CellDataContext, TableCellDataTypes } from './TableCellType'

export interface CheckboxTextCellData {
  type: TableCellDataTypes.CHECKBOXTEXT
  value: string | Display
  isSelected: boolean
  isDisabled: boolean
  context: CellDataContext
}
