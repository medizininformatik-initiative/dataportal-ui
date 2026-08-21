import { Display } from 'src/app/model/DataSelection/Profile/Display'
import { TableCellKind } from '../TableCellKind'

export interface TextCellData {
  type: TableCellKind.TEXT
  value: string | Display
}
