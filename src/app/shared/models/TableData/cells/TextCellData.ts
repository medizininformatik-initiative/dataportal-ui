import { Display } from 'src/app/model/DataSelection/Profile/Display'
import { TableCellDataTypes } from './TableCellType'

export interface TextCellData {
  type: TableCellDataTypes.TEXT
  value: string | Display
}
