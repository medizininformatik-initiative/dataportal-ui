import { Display } from 'src/app/model/DataSelection/Profile/Display'
import { TableCellContext } from '../TableCellContext'
import { TableCellKind } from '../TableCellKind'

export interface CheckboxTextCellData {
  type: TableCellKind.CHECKBOXTEXT
  value: string | Display
  isSelected: boolean
  isDisabled: boolean
  context: TableCellContext
}
