import { Display } from 'src/app/model/DataSelection/Profile/Display'
import { TableCellKind } from '../TableCellKind'

export interface DisplayCellData {
  type: TableCellKind.DISPLAY
  value: Display
  icon?: string
}
