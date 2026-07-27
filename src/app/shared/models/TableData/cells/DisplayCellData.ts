import { Display } from 'src/app/model/DataSelection/Profile/Display'
import { TableCellDataTypes } from './TableCellType'

export interface DisplayCellData {
  type: TableCellDataTypes.DISPLAY
  value: Display
  icon?: string
}
